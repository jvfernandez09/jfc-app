"use client";

import React from "react";

type Props = {
  title?: string;
  message?: string;
  variant?: "error" | "success" | "info";
};

export default function AlertMessage({
  title,
  message,
  variant = "error",
}: Props) {
  if (!message) return null;

  const base = "w-full rounded-md border px-4 py-3 text-sm";

  const styles: Record<NonNullable<Props["variant"]>, string> = {
    error: "border-red-400 bg-red-100 text-red-700",
    success: "border-green-400 bg-green-100 text-green-700",
    info: "border-blue-400 bg-blue-100 text-blue-700",
  };

  return (
    <div className={`${base} ${styles[variant]}`}>
      {title && <span className="font-bold">{title} </span>}
      <span>{message}</span>
    </div>
  );
}
