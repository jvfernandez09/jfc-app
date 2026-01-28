"use server";

import { cookies } from "next/headers";
import pool from "@/app/lib/database";
import { verifyToken, signToken } from "@/app/lib/jwt";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export type ProfileState = {
  success: boolean;
  message: string;
};

export type PasswordState = {
  success: boolean;
  message: string;
  errors?: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  };
};

export type DeleteAccountState = {
  success: boolean;
  message: string;
  errors?: {
    password?: string;
  };
};

export async function updateProfileAction(
  _prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").toLowerCase().trim();

  if (!name || !email) {
    return { success: false, message: "Name and email are required." };
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { success: false, message: "Please enter a valid email." };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  const payload = verifyToken(token) as { userId: number; email: string };

  try {
    const result = await pool.query(
      `UPDATE users
       SET name = $1, email = $2
       WHERE id = $3
       RETURNING id, email`,
      [name, email, payload.userId]
    );

    if (result.rowCount === 0) {
      return { success: false, message: "User not found." };
    }

    const newToken = signToken({
      userId: payload.userId,
      email: result.rows[0].email,
    });

    cookieStore.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    revalidatePath("/profile");

    return { success: true, message: "Profile updated successfully." };
  } catch (err) {
    console.log("updateProfileAction error:", err);

    if (err instanceof Error && (err as { code?: string }).code === "23505") {
      return { success: false, message: "Email already exists." };
    }

    return {
      success: false,
      message: err instanceof Error ? err.message : "Unable to update profile.",
    };
  }
}

export async function updatePasswordAction(
  _prevState: PasswordState,
  formData: FormData
): Promise<PasswordState> {
  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  const errors: PasswordState["errors"] = {};

  if (!currentPassword) {
    errors.currentPassword = "The current password field is required.";
  }

  if (!newPassword) {
    errors.newPassword = "The password field is required.";
  } else if (newPassword.length < 8) {
    errors.newPassword = "The password field must be at least 8 characters.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "The password field is required.";
  } else if (newPassword !== confirmPassword) {
    errors.confirmPassword = "The password field confirmation does not match.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "",
      errors,
    };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  const payload = verifyToken(token) as { userId: number; email: string };

  try {
    const userResult = await pool.query(
      `SELECT password_hash FROM users WHERE id = $1`,
      [payload.userId]
    );

    if (userResult.rowCount === 0) {
      return { success: false, message: "User not found." };
    }

    const hashedPassword = userResult.rows[0].password_hash as string;

    const isMatch = await bcrypt.compare(currentPassword, hashedPassword);

    if (!isMatch) {
      return {
        success: false,
        message: "",
        errors: {
          currentPassword: "Current password is incorrect.",
        },
      };
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE users SET password_hash = $1 WHERE id = $2`,
      [newHashedPassword, payload.userId]
    );


    revalidatePath("/profile");

    return { success: true, message: "Password updated successfully." };
  } catch (err) {
    console.log("updatePasswordAction error:", err);

    return {
      success: false,
      message: err instanceof Error ? err.message : "Unable to update password.",
    };
  }
}

export async function deleteAccountAction(
  _prevState: DeleteAccountState,
  formData: FormData
): Promise<DeleteAccountState> {
  const password = String(formData.get("password") || "");

  if (!password) {
    return {
      success: false,
      message: "",
      errors: { password: "The password field is required." },
    };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  const payload = verifyToken(token) as { userId: string; email: string };

  try {
    const userResult = await pool.query(
      `SELECT password_hash FROM users WHERE id = $1`,
      [payload.userId]
    );

    if (userResult.rowCount === 0) {
      return { success: false, message: "User not found." };
    }

    const passwordHash = userResult.rows[0].password_hash as string;
    const ok = await bcrypt.compare(password, passwordHash);

    if (!ok) {
      return {
        success: false,
        message: "",
        errors: { password: "Password is incorrect." },
      };
    }

    await pool.query(`DELETE FROM users WHERE id = $1`, [payload.userId]);

    cookieStore.delete("token");
  } catch (err) {
    console.log("deleteAccountAction error:", err);

    return {
      success: false,
      message: err instanceof Error ? err.message : "Unable to delete account.",
    };
  }

  redirect("/login");
}

