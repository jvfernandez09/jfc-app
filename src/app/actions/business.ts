"use server";

import { revalidatePath } from "next/cache";
import pool from "@/app/lib/database";

/* ---------------------------------- TYPES --------------------------------- */
export type Category = { id: string; name: string };
export type Tag = { id: string; name: string };

export type BusinessRow = {
  id: string;
  name: string;
  contact_email: string | null;
  categories: Category[];
  tags: Tag[];
};

export type BusinessFormState = {
  success: boolean;
  message?: string;
  errors?: {
    name?: string;
    contactEmail?: string;
  };
};

export type BusinessShowData = {
  business: {
    id: string;
    name: string;
    contact_email: string | null;
  };
  people: {
    id: string;
    first_name: string;
    last_name: string;
    email: string | null;
  }[];
  tasks: {
    id: string;
    title: string;
    description: string | null;
    is_done: boolean;
    created_at: string;
  }[];
};
export type CreateBusinessTaskState = {
  success: boolean;
  message: string;
  errors?: {
    title?: string;
  };
};

export async function createTaskForBusinessAction(
  businessId: string,
  _prev: CreateBusinessTaskState,
  formData: FormData
): Promise<CreateBusinessTaskState> {
  const title = String(formData.get("title") || "").trim();
  const description =
    String(formData.get("description") || "").trim() || null;
  const status = String(formData.get("status") || "open");

  if (!title) {
    return {
      success: false,
      message: "",
      errors: { title: "Title is required." },
    };
  }

  const taskRes = await pool.query(
    `
    INSERT INTO tasks (title, description, is_done)
    VALUES ($1, $2, $3)
    RETURNING id
    `,
    [title, description, status === "completed"]
  );

  const taskId = taskRes.rows[0].id;

  await pool.query(
    `
    INSERT INTO task_assignments (task_id, business_id)
    VALUES ($1, $2)
    `,
    [taskId, businessId]
  );

  revalidatePath(`/business/${businessId}/show`);

  return {
    success: true,
    message: "Task added.",
  };
}


export async function getBusinessShowData(businessId: string) {
  const businessRes = await pool.query(
    `
    SELECT id, name, contact_email
    FROM businesses
    WHERE id = $1
    `,
    [businessId]
  );

  if (businessRes.rowCount === 0) return null;

  const tasksRes = await pool.query(
    `
    SELECT
      t.id,
      t.title,
      t.description,
      t.is_done,
      t.created_at
    FROM tasks t
    INNER JOIN task_assignments ta
      ON ta.task_id = t.id
    WHERE ta.business_id = $1
    ORDER BY t.created_at DESC
    `,
    [businessId]
  );

  return {
    business: businessRes.rows[0],
    tasks: tasksRes.rows.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      isDone: t.is_done,
      createdAt: t.created_at,
    })),
  };
}

export async function getBusinesses(): Promise<BusinessRow[]> {
  const { rows } = await pool.query(`
    SELECT
      b.id,
      b.name,
      b.contact_email,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('id', c.id, 'name', c.name))
        FILTER (WHERE c.id IS NOT NULL),
        '[]'
      ) AS categories,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('id', t.id, 'name', t.name))
        FILTER (WHERE t.id IS NOT NULL),
        '[]'
      ) AS tags
    FROM businesses b
    LEFT JOIN business_categories bc ON bc.business_id = b.id
    LEFT JOIN categories c ON c.id = bc.category_id
    LEFT JOIN business_tags bt ON bt.business_id = b.id
    LEFT JOIN tags t ON t.id = bt.tag_id
    GROUP BY b.id
    ORDER BY b.name ASC
  `);

  return rows;
}

export async function getBusinessById(id: string) {
  const { rows } = await pool.query(
    `SELECT id, name, contact_email FROM businesses WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

export async function getBusinessCategories(id: string): Promise<string[]> {
  const { rows } = await pool.query(
    `SELECT category_id FROM business_categories WHERE business_id = $1`,
    [id]
  );
  return rows.map((r) => r.category_id);
}

export async function getBusinessTags(id: string): Promise<string[]> {
  const { rows } = await pool.query(
    `SELECT tag_id FROM business_tags WHERE business_id = $1`,
    [id]
  );
  return rows.map((r) => r.tag_id);
}

/* -------------------------------- CREATE --------------------------------- */

export async function createBusinessAction(
  _prev: BusinessFormState,
  formData: FormData
): Promise<BusinessFormState> {
  const name = String(formData.get("name") || "").trim();
  const contactEmail =
    String(formData.get("contactEmail") || "").trim() || null;

  const categoryIds = formData.getAll("categoryIds") as string[];
  const tagIds = formData.getAll("tagIds") as string[];

  if (!name) {
    return {
      success: false,
      errors: { name: "Business name is required." },
    };
  }

  try {
    const { rows } = await pool.query(
      `
      INSERT INTO businesses (name, contact_email)
      VALUES ($1, $2)
      RETURNING id
      `,
      [name, contactEmail]
    );

    const businessId = rows[0].id as string;

    if (categoryIds.length > 0) {
      await pool.query(
        `
        INSERT INTO business_categories (business_id, category_id)
        SELECT $1, unnest($2::uuid[])
        `,
        [businessId, categoryIds]
      );
    }

    if (tagIds.length > 0) {
      await pool.query(
        `
        INSERT INTO business_tags (business_id, tag_id)
        SELECT $1, unnest($2::uuid[])
        `,
        [businessId, tagIds]
      );
    }

    revalidatePath("/business");

    return {
      success: true,
      message: `${name} created.`,
    };
  } catch (err) {
    console.error("createBusinessAction error:", err);
    return {
      success: false,
      message: "Unable to create business.",
    };
  }
}


/* -------------------------------- UPDATE --------------------------------- */

export async function updateBusinessAction(
  businessId: string,
  _prev: BusinessFormState,
  formData: FormData
): Promise<BusinessFormState> {
  const name = String(formData.get("name") || "").trim();
  const contactEmail =
    String(formData.get("contactEmail") || "").trim() || null;

  const categoryIds = formData.getAll("categoryIds") as string[];
  const tagIds = formData.getAll("tagIds") as string[];

  if (!name) {
    return {
      success: false,
      errors: { name: "Business name is required." },
    };
  }

  try {
    await pool.query(
      `
      UPDATE businesses
      SET name = $1,
          contact_email = $2,
          updated_at = now()
      WHERE id = $3
      `,
      [name, contactEmail, businessId]
    );

    await pool.query(
      `DELETE FROM business_categories WHERE business_id = $1`,
      [businessId]
    );

    await pool.query(
      `DELETE FROM business_tags WHERE business_id = $1`,
      [businessId]
    );

    if (categoryIds.length > 0) {
      await pool.query(
        `
        INSERT INTO business_categories (business_id, category_id)
        SELECT $1, unnest($2::uuid[])
        `,
        [businessId, categoryIds]
      );
    }

    if (tagIds.length > 0) {
      await pool.query(
        `
        INSERT INTO business_tags (business_id, tag_id)
        SELECT $1, unnest($2::uuid[])
        `,
        [businessId, tagIds]
      );
    }

    revalidatePath("/business");

    return {
      success: true,
      message: `${name} updated.`,
    };
  } catch (err) {
    console.error("updateBusinessAction error:", err);
    return {
      success: false,
      message: "Unable to update business.",
    };
  }
}


/* -------------------------------- DELETE --------------------------------- */

export async function deleteBusinessAction(id: string) {
  await pool.query(`DELETE FROM businesses WHERE id = $1`, [id]);
  revalidatePath("/business");
}
