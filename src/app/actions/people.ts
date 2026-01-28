"use server";

import pool from "@/app/lib/database";
import { revalidatePath } from "next/cache";

export type BusinessOption = {
  id: string;
  name: string;
};

export type TagOption = {
  id: string;
  name: string;
};

export type PersonRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  businessName: string | null;
  tags: { id: string; name: string }[];
};

export type PersonEditData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  businessId: string | null;
  tagIds: string[];
};

export type PersonShowData = {
  person: {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
    businessName: string | null;
  };
  tasks: {
    id: string;
    title: string;
    description: string | null;
    isDone: boolean;
    createdAt: string;
  }[];
};

export type CreatePeopleState = {
  success: boolean;
  message: string;
  errors?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
};

export type UpdatePeopleState = {
  success: boolean;
  message: string;
  errors?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
};

export type CreatePersonTaskState = {
  success: boolean;
  message: string;
  errors?: {
    title?: string;
  };
};

const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

export async function getBusinessOptions(): Promise<BusinessOption[]> {
  try {
    const result = await pool.query(
      `SELECT id::text, name
       FROM businesses
       ORDER BY created_at DESC`
    );
    return result.rows;
  } catch (err) {
    console.log("getBusinessOptions error:", err);
    return [];
  }
}

export async function getTagOptions(): Promise<TagOption[]> {
  try {
    const result = await pool.query(
      `SELECT id::text, name
       FROM tags
       ORDER BY created_at DESC`
    );
    return result.rows;
  } catch (err) {
    console.log("getTagOptions error:", err);
    return [];
  }
}

export async function getPeople(): Promise<PersonRow[]> {
  try {
    const result = await pool.query(
      `
      SELECT
        p.id::text,
        p.first_name AS "firstName",
        p.last_name AS "lastName",
        p.email,
        p.phone,
        b.name AS "businessName",
        COALESCE(
          json_agg(
            json_build_object(
              'id', t.id::text,
              'name', t.name
            )
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) AS tags
      FROM people p
      LEFT JOIN businesses b ON b.id = p.business_id
      LEFT JOIN person_tags pt ON pt.person_id = p.id
      LEFT JOIN tags t ON t.id = pt.tag_id
      GROUP BY p.id, b.name
      ORDER BY p.created_at DESC
      `
    );

    return result.rows;
  } catch (err) {
    console.log("getPeople error:", err);
    return [];
  }
}

export async function getPersonById(id: string): Promise<PersonEditData | null> {
  try {
    const personResult = await pool.query(
      `SELECT
        id::text,
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        phone,
        business_id::text AS "businessId"
      FROM people
      WHERE id = $1
      LIMIT 1`,
      [id]
    );

    if (personResult.rowCount === 0) return null;

    const tagResult = await pool.query(
      `SELECT tag_id::text AS id
       FROM person_tags
       WHERE person_id = $1`,
      [id]
    );

    return {
      ...personResult.rows[0],
      tagIds: tagResult.rows.map((r) => r.id as string),
    };
  } catch (err) {
    console.log("getPersonById error:", err);
    return null;
  }
}

export async function getPersonShowData(
  personId: string
): Promise<PersonShowData | null> {
  try {
    // ✅ person details
    const personRes = await pool.query(
      `
      SELECT
        p.id::text,
        p.first_name AS "firstName",
        p.last_name AS "lastName",
        p.email,
        p.phone,
        b.name AS "businessName"
      FROM people p
      LEFT JOIN businesses b ON b.id = p.business_id
      WHERE p.id = $1
      LIMIT 1
      `,
      [personId]
    );

    if (personRes.rowCount === 0) {
      return null;
    }

    const tasksRes = await pool.query(
      `
      SELECT
        t.id::text,
        t.title,
        t.description,
        t.is_done AS "isDone",
        t.created_at::text AS "createdAt"
      FROM task_assignments ta
      JOIN tasks t ON t.id = ta.task_id
      WHERE ta.person_id = $1
      ORDER BY t.created_at DESC
      `,
      [personId]
    );

    return {
      person: personRes.rows[0],
      tasks: tasksRes.rows,
    };
  } catch (err) {
    console.log("getPersonShowData error:", err);
    return null;
  }
}

export async function createPersonAction(
  _prevState: CreatePeopleState,
  formData: FormData
): Promise<CreatePeopleState> {
  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();

  const businessIdRaw = String(formData.get("businessId") || "").trim();
  const businessId = businessIdRaw ? businessIdRaw : null;

  const tagIds = formData.getAll("tagIds").map((v) => String(v));

  const errors: CreatePeopleState["errors"] = {};

  if (!firstName) errors.firstName = "First name is required.";
  if (!lastName) errors.lastName = "Last name is required.";

  if (email && !isValidEmail(email)) {
    errors.email = "Please enter a valid email.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "", errors };
  }

  try {
    const insertPerson = await pool.query(
      `INSERT INTO people (first_name, last_name, email, phone, business_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id::text`,
      [firstName, lastName, email || null, phone || null, businessId]
    );

    const personId = insertPerson.rows[0].id as string;

    if (tagIds.length > 0) {
      const values = tagIds.map((_, idx) => `($1, $${idx + 2})`).join(", ");

      await pool.query(
        `INSERT INTO person_tags (person_id, tag_id)
         VALUES ${values}
         ON CONFLICT DO NOTHING`,
        [personId, ...tagIds]
      );
    }

    revalidatePath("/people");

    return {
      success: true,
      message: `Created ${firstName} ${lastName}.`,
    };
  } catch (err) {
    console.log("createPersonAction error:", err);

    if (err instanceof Error && (err as { code?: string }).code === "23505") {
      return {
        success: false,
        message: "",
        errors: { email: "Email already exists." },
      };
    }

    return {
      success: false,
      message: err instanceof Error ? err.message : "Unable to create person.",
    };
  }
}

export async function updatePersonAction(
  personId: string,
  _prevState: UpdatePeopleState,
  formData: FormData
): Promise<UpdatePeopleState> {
  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();

  const businessIdRaw = String(formData.get("businessId") || "").trim();
  const businessId = businessIdRaw ? businessIdRaw : null;

  const tagIds = formData.getAll("tagIds").map((v) => String(v));

  const errors: UpdatePeopleState["errors"] = {};

  if (!firstName) errors.firstName = "First name is required.";
  if (!lastName) errors.lastName = "Last name is required.";

  if (email && !isValidEmail(email)) {
    errors.email = "Please enter a valid email.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "", errors };
  }

  try {
    const result = await pool.query(
      `UPDATE people
       SET first_name = $1,
           last_name = $2,
           email = $3,
           phone = $4,
           business_id = $5,
           updated_at = now()
       WHERE id = $6`,
      [firstName, lastName, email || null, phone || null, businessId, personId]
    );

    if (result.rowCount === 0) {
      return { success: false, message: "Person not found." };
    }

    await pool.query(`DELETE FROM person_tags WHERE person_id = $1`, [personId]);

    if (tagIds.length > 0) {
      const values = tagIds.map((_, idx) => `($1, $${idx + 2})`).join(", ");

      await pool.query(
        `INSERT INTO person_tags (person_id, tag_id)
         VALUES ${values}
         ON CONFLICT DO NOTHING`,
        [personId, ...tagIds]
      );
    }

    revalidatePath("/people");

    return {
      success: true,
      message: `Updated ${firstName} ${lastName}.`,
    };
  } catch (err) {
    console.log("updatePersonAction error:", err);

    if (err instanceof Error && (err as { code?: string }).code === "23505") {
      return {
        success: false,
        message: "",
        errors: { email: "Email already exists." },
      };
    }

    return {
      success: false,
      message: err instanceof Error ? err.message : "Unable to update person.",
    };
  }
}

export async function deletePersonAction(personId: string) {
  try {
    await pool.query(`DELETE FROM people WHERE id = $1`, [personId]);
    revalidatePath("/people");
    return { success: true };
  } catch (err) {
    console.log("deletePersonAction error:", err);
    return { success: false };
  }
}
export async function createTaskForPersonAction(
  personId: string,
  _prevState: CreatePersonTaskState,
  formData: FormData
): Promise<CreatePersonTaskState> {
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const status = String(formData.get("status") || "open").trim();

  if (!title) {
    return {
      success: false,
      message: "",
      errors: { title: "Task title is required." },
    };
  }

  const isDone = status === "completed";

  try {
    const taskRes = await pool.query(
      `INSERT INTO tasks (title, description, is_done)
       VALUES ($1, $2, $3)
       RETURNING id::text`,
      [title, description || null, isDone]
    );

    const taskId = taskRes.rows[0].id as string;

    await pool.query(
      `INSERT INTO task_assignments (task_id, person_id)
       VALUES ($1, $2)`,
      [taskId, personId]
    );

    revalidatePath(`/people/${personId}/show`);

    return {
      success: true,
      message: "Task added successfully.",
    };
  } catch (err) {
    console.log("createTaskForPersonAction error:", err);

    return {
      success: false,
      message: err instanceof Error ? err.message : "Unable to add task.",
    };
  }
}