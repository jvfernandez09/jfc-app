"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createTagAction, type CreateTagState } from "@/app/actions/tags";
import AlertMessage from "@/components/ui/AlertMessage";

const initialState: CreateTagState = {
  success: false,
  message: "",
  errors: {},
};

export default function CreateTagPage() {
  const router = useRouter();
  const [state, action, isPending] = useActionState(createTagAction, initialState);

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-gray-900">Add New Tag</h2>

      {state?.errors?.name && (
        <div className="mt-4">
          <AlertMessage
            variant="error"
            title="Error!"
            message={`${state?.errors?.name} Thank You!` || ""}
          />

        </div>
      )}


      <form action={action} className="mt-4">
        <div className="max-w-2xl">
          <label className="block font-medium text-gray-700">Tag Name</label>

          <input
            name="name"
            type="text"
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="mt-10 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/tag")}
            className="inline-flex items-center rounded-full bg-gray-500 px-5 py-2 font-semibold text-white hover:bg-gray-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center rounded-full bg-blue-500 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isPending ? "Adding..." : "Add Tag"}
          </button>
        </div>
      </form>
    </div>
  );
}
