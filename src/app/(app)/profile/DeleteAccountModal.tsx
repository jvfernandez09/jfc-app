"use client";

import React from "react";
import { DeleteAccountState, deleteAccountAction } from "@/app/actions/profile";

const initialDeleteState: DeleteAccountState = {
  success: false,
  message: "",
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function DeleteAccountModal({ open, onClose }: Props) {
  const [show, setShow] = React.useState(open);

  const [state, formAction, pending] = React.useActionState(
    deleteAccountAction,
    initialDeleteState
  );

  // ✅ mount/unmount with animation
  React.useEffect(() => {
    if (open) {
      setShow(true);
      return;
    }

    const t = setTimeout(() => setShow(false), 200);
    return () => clearTimeout(t);
  }, [open]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-gray-900/50 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* top modal container */}
      <div className="absolute inset-x-0 top-0 flex justify-center px-4 pt-10">
        <div
          className={`relative w-155 max-w-[92vw] rounded-lg bg-white p-6 shadow-xl transition-all duration-200 ${
            open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
        >
          <h3 className="text-base font-semibold text-gray-900">
            Are you sure you want to delete your account?
          </h3>

          <p className="mt-1 text-sm text-gray-600">
            Once your account is deleted, all of its resources and data will be
            permanently deleted. Please enter your password to confirm you would
            like to permanently delete your account.
          </p>

          <form action={formAction} className="mt-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="block h-10.5 w-full rounded-md border border-gray-300 px-3 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />

            {state.errors?.password && (
              <p className="mt-2 text-xs text-red-600">
                {state.errors.password}
              </p>
            )}

            {state.message && (
              <p
                className={
                  "mt-2 text-xs " +
                  (state.success ? "text-green-600" : "text-red-600")
                }
              >
                {state.message}
              </p>
            )}

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={pending}
                className="inline-flex h-9 items-center rounded-md border border-gray-300 bg-white px-4 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60 tracking-widest"
              >
                CANCEL
              </button>

              <button
                type="submit"
                disabled={pending}
                className="inline-flex h-9 items-center rounded-md bg-red-600 px-4 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60 tracking-widest"
              >
                {pending ? "DELETING..." : "DELETE ACCOUNT"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
