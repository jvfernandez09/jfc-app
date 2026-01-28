"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import RowActions from "@/components/ui/RowActions";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { deletePersonAction } from "@/app/actions/people";

type Props = {
  personId: string;
};

export default function PeopleRowActions({ personId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deletePersonAction(personId);
      setOpen(false);
      router.refresh();
    });
  };

  return (
    <>
      <RowActions
        onEdit={() => router.push(`/people/${personId}/edit`)}
        onDelete={() => setOpen(true)}
      />

      <ConfirmModal
        open={open}
        title="Delete Person"
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
