"use client";

import { useEffect } from "react";
import { usePageTitle } from "@/components/layout/PageTitleProvider";

export default function PersonShowTitle({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle(`Person: ${lastName}, ${firstName}`);
    return () => setTitle(null);
  }, [firstName, lastName, setTitle]);

  return null;
}
