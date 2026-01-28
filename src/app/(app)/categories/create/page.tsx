"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AlertMessage from "@/components/ui/AlertMessage";
import {
  createCategoryAction,
  type CreateCategoryState,
} from "@/app/actions/categories";
import { usePageTitle } from "@/components/layout/PageTitleProvider";

const initialState: CreateCategoryState = {
  success: false,
  message: "",
  errors: {},
};

export default function CreateCategoryPage() {
  const router = useRouter();
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("Add Category");
    return () => setTitle(null);
  }, [setTitle]);

  const [state, action, isPending] = useActionState(
    createCategoryAction,
    initialState
  );

  const errorMsg =
    state?.errors?.name || (!state.success ? state.message : "");

  useEffect(() => {
    if (state.success) {
      sessionStorage.setItem(
        "categoryToast",
        JSON.stringify({
          message: state.message,
          createdAt: Date.now(),
        })
      );
      router.push("/categories");
    }
  }, [state.success, state.message, router]);

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-gray-900">Add New Category</h2>

      <div className="mt-4">
        <AlertMessage
          variant="error"
          title={errorMsg ? "Error!" : undefined}
          message={errorMsg}
        />
      </div>

      <form action={action} className="mt-6">
        <div className="max-w-2xl">
          <label className="block font-medium text-gray-700">
            Category Name
          </label>

          <input
            name="name"
            type="text"
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
            disabled={isPending}
            className="inline-flex items-center rounded-full bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isPending ? "Adding..." : "Add Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
