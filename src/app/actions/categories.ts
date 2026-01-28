"use server";

import pool from "@/app/lib/database";
import { revalidatePath } from "next/cache";

export type CategoryRow = {
  id: string;
  name: string;
};

export type CreateCategoryState = {
  success: boolean;
  message: string;
  errors?: { name?: string };
};

export type UpdateCategoryState = {
  success: boolean;
  message: string;
  errors?: { name?: string };
};

export async function getCategories(): Promise<CategoryRow[]> {
  try {
    const result = await pool.query(
      `SELECT id::text, name
       FROM categories
       ORDER BY created_at DESC`
    );
    return result.rows;
  } catch (err) {
    console.log("getCategories error:", err);
    return [];
  }
}

export async function getCategoryById(id: string): Promise<CategoryRow | null> {
  try {
    const result = await pool.query(
      `SELECT id::text, name
       FROM categories
       WHERE id = $1`,
      [id]
    );

    return result.rowCount ? result.rows[0] : null;
  } catch (err) {
    console.log("getCategoryById error:", err);
    return null;
  }
}

export async function createCategoryAction(
  _prevState: CreateCategoryState,
  formData: FormData
): Promise<CreateCategoryState> {
  const name = String(formData.get("name") || "").trim();

  if (!name) {
    return {
      success: false,
      message: "",
      errors: { name: "Category name is required." },
    };
  }

  try {
    await pool.query(`INSERT INTO categories (name) VALUES ($1)`, [name]);
    revalidatePath("/categories");

    return { success: true, message: `Created ${name}.` };
  } catch (err) {
    console.log("createCategoryAction error:", err);

    if (err instanceof Error && (err as { code?: string }).code === "23505") {
      return {
        success: false,
        message: "",
        errors: { name: "Category already exists." },
      };
    }

    return {
      success: false,
      message: err instanceof Error ? err.message : "Unable to create category.",
    };
  }
}

export async function updateCategoryAction(
  categoryId: string,
  _prevState: UpdateCategoryState,
  formData: FormData
): Promise<UpdateCategoryState> {
  const name = String(formData.get("name") || "").trim();

  if (!name) {
    return {
      success: false,
      message: "",
      errors: { name: "Category name is required." },
    };
  }

  try {
    const result = await pool.query(
      `UPDATE categories SET name = $1 WHERE id = $2`,
      [name, categoryId]
    );

    if (result.rowCount === 0) {
      return { success: false, message: "Category not found." };
    }

    revalidatePath("/categories");

    return { success: true, message: `Updated ${name}.` };
  } catch (err) {
    console.log("updateCategoryAction error:", err);

    if (err instanceof Error && (err as { code?: string }).code === "23505") {
      return {
        success: false,
        message: "",
        errors: { name: "Category already exists." },
      };
    }

    return {
      success: false,
      message: err instanceof Error ? err.message : "Unable to update category.",
    };
  }
}

export async function deleteCategoryAction(categoryId: string) {
  try {
    await pool.query(`DELETE FROM categories WHERE id = $1`, [categoryId]);
    revalidatePath("/categories");
    return { success: true };
  } catch (err) {
    console.log("deleteCategoryAction error:", err);
    return { success: false };
  }
}
