"use client";

import { useEffect, useState } from "react";

type Props = {
  message?: string;
  variant?: "success" | "error" | "info";
  durationMs?: number;
  onClose?: () => void;
};

export default function AutoNotice({
  message,
  variant = "success",
  durationMs = 5000,
  onClose,
}: Props) {
  const [visible, setVisible] = useState(Boolean(message));

  useEffect(() => {
    setVisible(Boolean(message));
  }, [message]);

  useEffect(() => {
    if (!message) return;
    if (!visible) return;

    const timer = window.setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, durationMs);

    return () => window.clearTimeout(timer);
  }, [message, visible, durationMs, onClose]);

  if (!message || !visible) return null;

  const styles =
    variant === "success"
      ? "text-green-600"
      : variant === "error"
      ? "text-red-600"
      : "text-blue-600";

  const icon = variant === "success" ? "✅" : variant === "error" ? "❌" : "ℹ️";

  return (
    <div className={`flex items-center gap-2 text-sm ${styles}`}>
      <span>{icon}</span>
      <span>- {message}</span>
    </div>
  );
}
