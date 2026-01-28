"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import AlertMessage from "@/components/ui/AlertMessage";
import ConfirmModal from "@/components/ui/ConfirmModal";
import {
  updateCategoryAction,
  deleteCategoryAction,
  type CategoryRow,
  type UpdateCategoryState,
} from "@/app/actions/categories";
import { usePageTitle } from "@/components/layout/PageTitleProvider";

type Props = {
  category: CategoryRow;
};

const initialState: UpdateCategoryState = {
  success: false,
  message: "",
  errors: {},
};

export default function EditCategoryForm({ category }: Props) {
  const router = useRouter();
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle(`Edit Category: ${category.name}`);
    return () => setTitle(null);
  }, [category.name, setTitle]);

  const boundUpdate = updateCategoryAction.bind(null, category.id);
  const [state, updateAction, isUpdating] = useActionState(
    boundUpdate,
    initialState
  );

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDeleting, startDelete] = useTransition();

  const errorMsg =
    state?.errors?.name || (!state.success ? state.message : "");

  useEffect(() => {
    if (state.success) {
      sessionStorage.setItem(
        "categoryToast",
        JSON.stringify({
          message: state.message || `Updated ${category.name}.`,
          createdAt: Date.now(),
        })
      );

      router.push("/categories");
    }
  }, [state.success, state.message, router, category.name]);

  const confirmDelete = () => {
    startDelete(async () => {
      sessionStorage.setItem(
        "categoryToast",
        JSON.stringify({
          message: `Deleted ${category.name}.`,
          createdAt: Date.now(),
        })
      );

      await deleteCategoryAction(category.id);

      setOpenDeleteModal(false);
      router.push("/categories");
    });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-gray-900">
        Edit Category: {category.name}
      </h2>

      <div className="mt-4">
        <AlertMessage
          variant="error"
          title={errorMsg ? "Error!" : undefined}
          message={errorMsg}
        />
      </div>

      <form action={updateAction} className="mt-6">
        <div className="max-w-2xl">
          <label className="block font-medium text-gray-700">
            Category Name
          </label>

          <input
            name="name"
            type="text"
            defaultValue={category.name}
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="mt-10 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/categories")}
            className="inline-flex items-center rounded-full bg-gray-500 px-6 py-2 font-semibold text-white hover:bg-gray-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isUpdating}
            className="inline-flex items-center rounded-full bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isUpdating ? "Updating..." : "Update Category"}
          </button>
        </div>

        <div className="mt-10 flex items-center justify-start">
          <button
            type="button"
            onClick={() => setOpenDeleteModal(true)}
            disabled={isDeleting}
            className="inline-flex items-center rounded-full bg-red-500 px-6 py-2 font-semibold text-white hover:bg-red-600 disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete Category"}
          </button>
        </div>
      </form>

      <ConfirmModal
        open={openDeleteModal}
        title="Delete Category"
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
