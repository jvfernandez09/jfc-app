"use client";

import { useActionState, useEffect, useRef } from "react";
import AlertMessage from "@/components/ui/AlertMessage";
import {
  createTaskForBusinessAction,
  type CreateBusinessTaskState,
} from "@/app/actions/business";

type Props = {
  businessId: string;
};

const initialState: CreateBusinessTaskState = {
  success: false,
  message: "",
  errors: {},
};

export default function AddBusinessTaskForm({ businessId }: Props) {
  const formRef = useRef<HTMLFormElement | null>(null);

  const boundAction = createTaskForBusinessAction.bind(null, businessId);
  const [state, action, isPending] = useActionState(boundAction, initialState);

  const bannerMessage =
    state?.errors?.title || (!state.success ? state.message : "");

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();

      sessionStorage.setItem(
        "businessToast",
        JSON.stringify({
          message: state.message,
          createdAt: Date.now(),
        })
      );
    }
  }, [state.success, state.message]);

  return (
    <div>
      {bannerMessage && (
        <div className="mb-4">
          <AlertMessage
            variant="error"
            title="Error!"
            message={bannerMessage}
          />
        </div>
      )}

      {state.success && state.message && (
        <div className="mb-4">
          <AlertMessage
            variant="success"
            title="Success!"
            message={state.message}
          />
        </div>
      )}

      <form ref={formRef} action={action} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            name="title"
            type="text"
            placeholder="Enter task title"
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          {state?.errors?.title && (
            <p className="mt-2 text-sm text-red-600">
              {state.errors.title}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>

          <div className="relative mt-2">
            <select
              name="status"
              className="w-full appearance-none rounded-md border border-gray-300 px-3 pr-10 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="open">Open</option>
              <option value="completed">Completed</option>
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


        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center rounded-full bg-green-500 px-6 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-60"
          >
            {isPending ? "Adding..." : "Add Task"}
          </button>
        </div>
      </form>
    </div>
  );
}
