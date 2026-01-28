"use client";

import React, { useEffect } from "react";
import { AlertTriangle, Info } from "lucide-react";

type Props = {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "info";
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title = "Delete",
  message = "Are you sure you want to delete this item?",
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  variant = "danger",
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  const isDanger = variant === "danger";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onCancel}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div
            className={[
              "flex h-12 w-12 items-center justify-center rounded-full",
              isDanger ? "bg-red-50" : "bg-blue-50",
            ].join(" ")}
          >
            {isDanger ? (
              <AlertTriangle className="h-6 w-6 text-red-600" />
            ) : (
              <Info className="h-6 w-6 text-blue-600" />
            )}
          </div>

          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            {title}
          </h3>

          <p className="mt-2 text-sm text-gray-600">{message}</p>

          <div className="mt-6 flex w-full justify-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="inline-flex min-w-27.5 items-center justify-center rounded-full bg-gray-500 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-60"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={[
                "inline-flex min-w-27.5 items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-white disabled:opacity-60",
                isDanger
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600",
              ].join(" ")}
            >
              {isLoading
                ? isDanger
                  ? "Deleting..."
                  : "Processing..."
                : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
