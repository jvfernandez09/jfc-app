"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlertMessage from "@/components/ui/AlertMessage";
import ConfirmModal from "@/components/ui/ConfirmModal";
import {
  updateBusinessAction,
  deleteBusinessAction,
  Category,
  Tag,
} from "@/app/actions/business";
import { usePageTitle } from "@/components/layout/PageTitleProvider";

type Business = {
  id: string;
  name: string;
  contact_email: string | null;
  categoryIds: string[];
  tagIds: string[];
};

type Props = {
  business: Business;
  categories: Category[];
  tags: Tag[];
};

type FormState = {
  success: boolean;
  message?: string;
  errors?: {
    name?: string;
    contactEmail?: string;
  };
};

const initialState: FormState = {
  success: false,
  message: "",
  errors: {},
};

export default function EditBusinessForm({
  business,
  categories,
  tags,
}: Props) {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const { setTitle } = usePageTitle();

  const boundUpdate = updateBusinessAction.bind(null, business.id);
  const [state, action, isPending] = useActionState(
    boundUpdate,
    initialState
  );

  useEffect(() => {
    setTitle(`Edit Person: ${business.name}`);
    return () => setTitle(null);
  }, [business.name, setTitle]);

  const errorMsg =
    state.errors?.name ||
    state.errors?.contactEmail ||
    (!state.success ? state.message : undefined);

  useEffect(() => {
    if (state.success) {
      sessionStorage.setItem(
        "businessToast",
        JSON.stringify({
          message: state.message || `${business.name} updated.`,
          createdAt: Date.now(),
        })
      );
      router.push("/business");
    }
  }, [state.success, state.message, router, business.name]);

  const handleDelete = async () => {
    await deleteBusinessAction(business.id);
    sessionStorage.setItem(
      "businessToast",
      JSON.stringify({
        message: `${business.name} deleted.`,
        createdAt: Date.now(),
      })
    );
    router.push("/business");
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      {errorMsg && (
        <div className="mt-4">
          <AlertMessage title="Error!" message={errorMsg} />
        </div>
      )}

      <form action={action} className="mt-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block font-medium text-gray-700">
              Business Name
            </label>
            <input
              name="name"
              defaultValue={business.name}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Contact Email
            </label>
            <input
              name="contactEmail"
              defaultValue={business.contact_email ?? ""}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="font-medium text-gray-700">Categories</p>
            <div className="mt-3 space-y-2">
              {categories.length === 0 ? (
                <p className="text-sm text-gray-500">No categories found.</p>
              ) : (
                categories.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-2 text-sm text-gray-800"
                  >
                    <input
                      type="checkbox"
                      name="categoryIds"
                      value={c.id}
                      defaultChecked={business.categoryIds.includes(c.id)}
                    />
                    {c.name}
                  </label>
                ))
              )}
            </div>
          </div>

          <div>
            <p className="font-medium text-gray-700">Tags</p>
            <div className="mt-3 space-y-2">
              {tags.length === 0 ? (
                <p className="text-sm text-gray-500">No tags found.</p>
              ) : (
                tags.map((t) => (
                  <label
                    key={t.id}
                    className="flex items-center gap-2 text-sm text-gray-800"
                  >
                    <input
                      type="checkbox"
                      name="tagIds"
                      value={t.id}
                      defaultChecked={business.tagIds.includes(t.id)}
                    />
                    {t.name}
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/business")}
            className="inline-flex items-center rounded-full bg-gray-500 px-6 py-2 font-semibold text-white hover:bg-gray-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center rounded-full bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isPending ? "Updating..." : "Update Business"}
          </button>
        </div>

        <div className="mt-10 flex items-center justify-start">
          <button
            type="button"
            onClick={() => setShowDelete(true)}
            className="inline-flex items-center rounded-full bg-red-500 px-6 py-2 font-semibold text-white hover:bg-red-600"
          >
            Delete Business
          </button>
        </div>
      </form>

      <ConfirmModal
        open={showDelete}
        title="Delete Business"
        message="Are you sure you want to delete this item?"
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
