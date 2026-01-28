"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import AlertMessage from "@/components/ui/AlertMessage";
import ConfirmModal from "@/components/ui/ConfirmModal";
import {
  updateTagAction,
  deleteTagAction,
  type TagRow,
  type UpdateTagState,
} from "@/app/actions/tags";
import { usePageTitle } from "@/components/layout/PageTitleProvider";

type Props = {
  tag: TagRow;
};

const initialState: UpdateTagState = {
  success: false,
  message: "",
  errors: {},
};

export default function EditTagForm({ tag }: Props) {
  const router = useRouter();

  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle(`Edit Tag: ${tag.name}`);

    return () => {
      setTitle(null);
    };
  }, [tag.name, setTitle]);

  const boundUpdate = updateTagAction.bind(null, tag.id);
  const [state, updateAction, isUpdating] = useActionState(
    boundUpdate,
    initialState
  );

  const [isDeleting, startDelete] = useTransition();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const errorMsg = state?.errors?.name || (!state.success ? state.message : "");

  useEffect(() => {
    if (state.success) {
      sessionStorage.setItem(
        "tagToast",
        JSON.stringify({
          message: state.message || `Updated ${tag.name}.`,
          createdAt: Date.now(),
        })
      );

      router.push("/tag");
    }
  }, [state.success, state.message, router, tag.name]);

  const confirmDelete = () => {
    startDelete(async () => {
      sessionStorage.setItem(
        "tagToast",
        JSON.stringify({
          message: `Deleted ${tag.name}.`,
          createdAt: Date.now(),
        })
      );

      await deleteTagAction(tag.id);

      setOpenDeleteModal(false);
      router.push("/tag");
    });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mt-4">
        <AlertMessage
          variant="error"
          title={errorMsg ? "Error!" : undefined}
          message={errorMsg}
        />
      </div>

      <form action={updateAction} className="mt-6">
        <div className="max-w-2xl">
          <label className="block font-medium text-gray-700">Tag Name</label>

          <input
            name="name"
            type="text"
            defaultValue={tag.name}
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="mt-10 flex items-center justify-end">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/tag")}
              className="inline-flex items-center rounded-full bg-gray-500 px-6 py-2 font-semibold text-white hover:bg-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex items-center rounded-full bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {isUpdating ? "Updating..." : "Update Tag"}
            </button>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-start">
          <button
            type="button"
            onClick={() => setOpenDeleteModal(true)}
            disabled={isDeleting}
            className="inline-flex items-center rounded-full bg-red-500 px-6 py-2 font-semibold text-white hover:bg-red-600 disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete Tag"}
          </button>
        </div>
      </form>

      <ConfirmModal
        open={openDeleteModal}
        title="Delete Tag"
        message="Are you sure you want to delete this item?"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        onCancel={() => setOpenDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
