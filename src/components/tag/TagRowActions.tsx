"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import RowActions from "@/components/ui/RowActions";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { deleteTagAction } from "@/app/actions/tags";

type Props = {
  tagId: string;
};

export default function TagRowActions({ tagId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      sessionStorage.setItem("tagToast", "Deleted tag.");
      await deleteTagAction(tagId);
      setOpen(false);
      router.refresh();
    });
  };

  return (
    <>
      <RowActions
        onEdit={() => router.push(`/tag/${tagId}/edit`)}
        onDelete={() => setOpen(true)}
      />

      <ConfirmModal
        open={open}
        title="Delete Tag"
        message="Are you sure you want to delete this item?"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isPending}
        onCancel={() => setOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
