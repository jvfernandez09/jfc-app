"use client";

import { useActionState, useEffect } from "react";
import AlertMessage from "@/components/ui/AlertMessage";
import { createBusinessAction } from "@/app/actions/business";
import { usePageTitle } from "@/components/layout/PageTitleProvider";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
};

type Tag = {
  id: string;
  name: string;
};

type Props = {
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

export default function CreateBusinessForm({ categories, tags }: Props) {
    const router = useRouter();
    const { setTitle } = usePageTitle();

  const [state, action, isPending] = useActionState(
    createBusinessAction,
    initialState
  );
  useEffect(() => {
    setTitle("Add Business");
    return () => setTitle(null);
  }, [setTitle]);

   useEffect(() => {
    if (state.success) {
      sessionStorage.setItem(
        "businessToast",
        JSON.stringify({
          message: state.message,
          createdAt: Date.now(),
        })
      );

      router.push("/business");
    }
  }, [state.success, state.message, router]);

  const errorMsg =
    state.errors?.name ||
    state.errors?.contactEmail ||
    (!state.success ? state.message : undefined);

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-gray-900">Add Business</h2>

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
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Contact Email
            </label>
            <input
              name="contactEmail"
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                    />
                    {c.name}
                  </label>
                ))
              )}
            </div>
          </div>

          {/* TAGS */}
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
                    />
                    {t.name}
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ACTION */}
        <div className="mt-10 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center rounded-full bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isPending ? "Creating..." : "Create Business"}
          </button>
        </div>
      </form>
    </div>
  );
}
