"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import RowActions from "@/components/ui/RowActions";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { deleteCategoryAction } from "@/app/actions/categories";

type Props = {
  categoryId: string;
};

export default function CategoryRowActions({ categoryId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteCategoryAction(categoryId);
      setOpen(false);
      router.refresh();
    });
  };

  return (  
    <>
      <RowActions
        onEdit={() => router.push(`/categories/${categoryId}/edit`)}
        onDelete={() => setOpen(true)}
      />

      <ConfirmModal
        open={open}
        title="Delete Category"
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
