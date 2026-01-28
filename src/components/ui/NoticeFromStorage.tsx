"use client";

import { useEffect, useState } from "react";
import AutoNotice from "@/components/ui/AutoNotice";

type StoredToast =
  | string
  | {
      message?: string;
      createdAt?: number;
    };

type Props = {
  storageKey: string;
  durationMs?: number;
  variant?: "success" | "error" | "info";
};

export default function NoticeFromStorage({
  storageKey,
  durationMs = 5000,
  variant = "success",
}: Props) {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return;

    let finalMsg = "";

    try {
      const parsed = JSON.parse(raw) as StoredToast;

      if (typeof parsed === "string") {
        finalMsg = parsed;
      } else {
        finalMsg = parsed?.message || "";
      }
    } catch {
      finalMsg = raw;
    }

    if (finalMsg) {
      setMsg(finalMsg);
    }

    sessionStorage.removeItem(storageKey);
  }, [storageKey]);

  return (
    <AutoNotice
      message={msg}
      durationMs={durationMs}
      variant={variant}
      onClose={() => setMsg("")}
    />
  );
}
