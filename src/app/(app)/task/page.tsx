import { getAllTasks } from "@/app/actions/task";
import TaskPageClient from "./TaskPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JFC | Task Page",
};

export default async function TaskPage() {
  const { open, completed } = await getAllTasks();

  return (
    <TaskPageClient
      openTasks={open}
      completedTasks={completed}
    />
  );
}
