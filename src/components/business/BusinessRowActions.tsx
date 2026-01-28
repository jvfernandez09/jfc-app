"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import RowActions from "@/components/ui/RowActions";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { deleteBusinessAction } from "@/app/actions/business";

type Props = {
  businessId: string;
};

export default function BusinessRowActions({ businessId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteBusinessAction(businessId);

      setOpen(false);
      router.refresh();
    });
  };

  return (
    <>
      <RowActions
        onEdit={() => router.push(`/business/${businessId}/edit`)}
        onDelete={() => setOpen(true)}
      />

      <ConfirmModal
        open={open}
        title="Delete Business"
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
