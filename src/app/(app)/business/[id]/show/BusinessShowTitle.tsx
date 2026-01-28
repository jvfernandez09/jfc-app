"use client";

import { useEffect } from "react";
import { usePageTitle } from "@/components/layout/PageTitleProvider";

export default function BusinessShowTitle({ name }: { name: string }) {
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle(`Business: ${name}`);
    return () => setTitle(null);
  }, [name, setTitle]);

  return null;
}
