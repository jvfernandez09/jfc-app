"use client";

import { useActionState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import AlertMessage from "@/components/ui/AlertMessage";
import {
  createPersonAction,
  type BusinessOption,
  type TagOption,
  type CreatePeopleState,
} from "@/app/actions/people";
import { usePageTitle } from "@/components/layout/PageTitleProvider";

type Props = {
  businesses: BusinessOption[];
  tags: TagOption[];
};

const initialState: CreatePeopleState = {
  success: false,
  message: "",
  errors: {},
};

export default function CreatePeopleForm({ businesses, tags }: Props) {
  const router = useRouter();
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("Add Person");
    return () => setTitle(null);
  }, [setTitle]);

  const [state, action, isPending] = useActionState(
    createPersonAction,
    initialState
  );

  const bannerMessage = useMemo(() => {
    const msgs = [
      state?.errors?.firstName,
      state?.errors?.lastName,
      state?.errors?.email,
    ].filter(Boolean) as string[];

    if (msgs.length === 0) return !state.success ? state.message : "";

    return msgs.join(" ");
  }, [state?.errors, state.success, state.message]);

  useEffect(() => {
    if (state.success) {
      sessionStorage.setItem(
        "peopleToast",
        JSON.stringify({
          message: state.message,
          createdAt: Date.now(),
        })
      );

      router.push("/people");
    }
  }, [state.success, state.message, router]);

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-gray-900">Add New Person</h2>

      {!state.success && bannerMessage && (
        <div className="mt-4">
          <AlertMessage variant="error" title="Error!" message={bannerMessage} />
        </div>
      )}

      <form action={action} className="mt-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block font-medium text-gray-700">First Name</label>

            <input
              name="firstName"
              type="text"
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            {state?.errors?.firstName && (
              <p className="mt-2 text-sm text-red-600">
                {state.errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-700">Last Name</label>

            <input
              name="lastName"
              type="text"
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            {state?.errors?.lastName && (
              <p className="mt-2 text-sm text-red-600">
                {state.errors.lastName}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-700">Email</label>

            <input
              name="email"
              type="text"
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            {state?.errors?.email && (
              <p className="mt-2 text-sm text-red-600">{state.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-700">Phone</label>

            <input
              name="phone"
              type="text"
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Business</label>
            <div className="relative mt-2">
              <select
                name="businessId"
                className="w-full appearance-none rounded-md border border-gray-300 px-3 pr-10 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">-- None --</option>

                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

          </div>

          <div>
            <label className="block font-medium text-gray-700">Tags</label>

            <div className="mt-2 space-y-2">
              {tags.length === 0 ? (
                <p className="text-sm text-gray-500">No tags found.</p>
              ) : (
                tags.map((tag) => (
                  <label
                    key={tag.id}
                    className="flex items-center gap-2 text-sm text-gray-800"
                  >
                    <input type="checkbox" name="tagIds" value={tag.id} />
                    {tag.name}
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/people")}
            className="inline-flex items-center rounded-full bg-gray-500 px-6 py-2 font-semibold text-white hover:bg-gray-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center rounded-full bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isPending ? "Adding..." : "Add Person"}
          </button>
        </div>
      </form>
    </div>
  );
}
