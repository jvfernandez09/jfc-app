"use server";

import { revalidatePath } from "next/cache";
import pool from "@/app/lib/database";

export type TaskForType = "business" | "person";

export type TaskRow = {
  id: string;
  taskName: string;
  forType: TaskForType;
  forName: string;
  status: "Open" | "Completed";
};

export type TaskActionState = {
  success: boolean;
  message: string;
};


export async function getAllTasks(): Promise<{
  open: TaskRow[];
  completed: TaskRow[];
}> {
  const { rows } = await pool.query(
    `
    SELECT
      t.id,
      t.title,
      t.is_done,

      b.id AS business_id,
      b.name AS business_name,

      p.id AS person_id,
      CONCAT(p.last_name, ', ', p.first_name) AS person_name

    FROM tasks t
    INNER JOIN task_assignments ta ON ta.task_id = t.id
    LEFT JOIN businesses b ON b.id = ta.business_id
    LEFT JOIN people p ON p.id = ta.person_id
    ORDER BY t.created_at DESC
    `
  );

  const mapped = rows.map((r) => {
    const forType: TaskForType = r.business_id ? "business" : "person";
    const forName = r.business_id ? r.business_name : r.person_name;

    return {
      id: r.id,
      taskName: r.title,
      forType,
      forName,
      status: r.is_done ? "Completed" : "Open",
    } satisfies TaskRow;
  });

  return {
    open: mapped.filter((t) => t.status === "Open"),
    completed: mapped.filter((t) => t.status === "Completed"),
  };
}


export async function completeTaskAction(
  taskId: string
): Promise<TaskActionState> {
  await pool.query(
    `
    UPDATE tasks
    SET is_done = true,
        updated_at = now()
    WHERE id = $1
    `,
    [taskId]
  );

  revalidatePath("/task");

  return {
    success: true,
    message: "Task completed.",
  };
}

export async function reopenTaskAction(
  taskId: string
): Promise<TaskActionState> {
  await pool.query(
    `
    UPDATE tasks
    SET is_done = false,
        updated_at = now()
    WHERE id = $1
    `,
    [taskId]
  );

  revalidatePath("/task");

  return {
    success: true,
    message: "Task re-opened.",
  };
}
