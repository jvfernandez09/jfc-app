"use client";

import { useState, useTransition } from "react";
import Table, { TableColumn } from "@/components/ui/Table";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Building2, User } from "lucide-react";
import { completeTaskAction, reopenTaskAction } from "@/app/actions/task";

type TaskRow = {
  id: string;
  taskName: string;
  forType: "business" | "person";
  forName: string;
  status: "Open" | "Completed";
};

function ForCell({ type, name }: { type: "business" | "person"; name: string }) {
  const Icon = type === "business" ? Building2 : User;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-800">
      <Icon className="h-4 w-4 text-gray-700" />
      <span>{name}</span>
    </div>
  );
}

type Props = {
  openTasks: TaskRow[];
  completedTasks: TaskRow[];
};

export default function TaskPageClient({
  openTasks,
  completedTasks,
}: Props) {
  const [selectedTask, setSelectedTask] = useState<TaskRow | null>(null);
  const [actionType, setActionType] =
    useState<"complete" | "reopen" | null>(null);
  const [isPending, startTransition] = useTransition();

  const taskColumns = (
    actionLabel: string,
    actionVariant: "green" | "red"
  ): TableColumn<TaskRow>[] => {
    const actionClass =
      actionVariant === "green"
        ? "bg-green-500 hover:bg-green-600"
        : "bg-red-500 hover:bg-red-600";

    return [
      {
        key: "taskName",
        header: "Task Name",
        width: "35%",
        render: (row) => (
          <span className="text-sm text-gray-900">{row.taskName}</span>
        ),
      },
      {
        key: "for",
        header: "For",
        width: "35%",
        render: (row) => (
          <ForCell type={row.forType} name={row.forName} />
        ),
      },
      {
        key: "status",
        header: "Status",
        width: "15%",
        align: "center",
        render: (row) => (
          <span className="text-sm text-gray-800">{row.status}</span>
        ),
      },
      {
        key: "action",
        header: "Action",
        width: "15%",
        align: "center",
        render: (row) => (
          <button
            type="button"
            onClick={() => {
              setSelectedTask(row);
              setActionType(
                row.status === "Open" ? "complete" : "reopen"
              );
            }}
            className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold text-white ${actionClass}`}
          >
            {actionLabel}
          </button>
        ),
      },
    ];
  };

  const handleConfirm = () => {
    if (!selectedTask || !actionType) return;

    startTransition(async () => {
      if (actionType === "complete") {
        await completeTaskAction(selectedTask.id);
      } else {
        await reopenTaskAction(selectedTask.id);
      }

      setSelectedTask(null);
      setActionType(null);
    });
  };

  return (
    <>
      <Table
        title="Open Tasks List"
        columns={taskColumns("Complete", "green")}
        rows={openTasks}
        emptyText="No open tasks found."
      />

      <Table
        title="Completed Tasks List"
        columns={taskColumns("Re-open", "red")}
        rows={completedTasks}
        emptyText="No completed tasks found."
      />

      <ConfirmModal
        open={!!selectedTask}
        title={
          actionType === "complete"
            ? "Complete Task"
            : "Re-open Task"
        }
        message={
          actionType === "complete"
            ? "Are you sure you want to complete this task?"
            : "Are you sure you want to re-open this task?"
        }
        confirmText={
          actionType === "complete" ? "Complete" : "Re-open"
        }
        cancelText="Cancel"
        variant="info"
        isLoading={isPending}
        onCancel={() => {
          setSelectedTask(null);
          setActionType(null);
        }}
        onConfirm={handleConfirm}
      />
    </>
  );
}
