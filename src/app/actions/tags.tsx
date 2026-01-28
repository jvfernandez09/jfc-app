"use server";

import pool from "@/app/lib/database";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type CreateTagState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string;
  };
};

export type UpdateTagState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string;
  };
};

export type DeleteTagState = {
  success: boolean;
  message: string;
};

export type TagRow = {
  id: string;
  name: string;
};

export async function getTags(): Promise<TagRow[]> {
  try {
    const result = await pool.query(
      `SELECT id::text, name
       FROM tags
       ORDER BY created_at DESC`
    );

    return result.rows;
  } catch (err) {
    console.log("getTags error:", err);
    return [];
  }
}

export async function createTagAction(
  _prevState: CreateTagState,
  formData: FormData
): Promise<CreateTagState> {
  const name = String(formData.get("name") || "").trim();

  if (!name) {
    return {
      success: false,
      message: "",
      errors: { name: "Tag name is required." },
    };
  }

  try {
    await pool.query(`INSERT INTO tags (name) VALUES ($1)`, [name]);

    revalidatePath("/tag");
  } catch (err) {
    console.log("createTagAction error:", err);

    if (err instanceof Error && (err as { code?: string }).code === "23505") {
      return {
        success: false,
        message: "",
        errors: { name: "Tag already exists." },
      };
    }

    return {
      success: false,
      message: err instanceof Error ? err.message : "Unable to create tag.",
    };
  }

  redirect("/tag");
}

export async function updateTagAction(
  tagId: string,
  _prevState: UpdateTagState,
  formData: FormData
): Promise<UpdateTagState> {
  const name = String(formData.get("name") || "").trim();

  if (!name) {
    return {
      success: false,
      message: "",
      errors: { name: "Tag name is required." },
    };
  }

  try {
    const result = await pool.query(
      `UPDATE tags SET name = $1 WHERE id = $2`,
      [name, tagId]
    );

    if (result.rowCount === 0) {
      return { success: false, message: "Tag not found." };
    }

    revalidatePath("/tag");

    return {
      success: true,
      message: `Updated ${name}.`,
    };
  } catch (err) {
    console.log("updateTagAction error:", err);

    if (err instanceof Error && (err as { code?: string }).code === "23505") {
      return {
        success: false,
        message: "",
        errors: { name: "Tag already exists." },
      };
    }

    return {
      success: false,
      message: err instanceof Error ? err.message : "Unable to update tag.",
    };
  }
}

export async function deleteTagAction(tagId: string) {
  try {
    await pool.query(`DELETE FROM tags WHERE id = $1`, [tagId]);
    revalidatePath("/tag");
    return { success: true };
  } catch (err) {
    console.log("deleteTagAction error:", err);
    return { success: false };
  }
}

export async function getTagById(id: string): Promise<TagRow | null> {
  try {
    const result = await pool.query(
      `SELECT id::text, name
       FROM tags
       WHERE id = $1`,
      [id]
    );

    return result.rowCount ? result.rows[0] : null;
  } catch (err) {
    console.log("getTagById error:", err);
    return null;
  }
}
