"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import pool from "@/app/lib/database";
import { signToken } from "@/app/lib/jwt";
import { verifyToken } from "@/app/lib/jwt";

export type AuthState = {
  error: string;
};
export type CurrentUser = {
  id: string;
  name: string;
  email: string;
};

export async function loginAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") || "").toLowerCase().trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const result = await pool.query(
    "SELECT id, email, password_hash FROM users WHERE email = $1",
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    return { error: "These credentials do not match our records." };
  }

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    return { error: "These credentials do not match our records." };
  }

  const token = signToken({ userId: user.id, email: user.email });

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/task");
}

export async function registerAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").toLowerCase().trim();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!name || !email || !password || !confirmPassword) {
    return { error: "All fields are required." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const hashed = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      `INSERT INTO users (name, email, password_hash)
   VALUES ($1, $2, $3)`,
      [name, email, hashed]
    );

  } catch (err) {
    if (err instanceof Error && (err as { code?: string }).code === "23505") {
      return { error: "Email already exists." };
    }

    return { error: "Unable to create account." };
  }

  redirect("/login");
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const payload = verifyToken(token) as { userId: string; email: string };

    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [payload.userId]
    );

    return result.rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();

  cookieStore.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  redirect("/login");
}