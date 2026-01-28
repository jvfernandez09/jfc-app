"use client";

import { usePathname } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import { usePageTitle } from "./PageTitleProvider";

const getTitle = (pathname: string) => {
  if (pathname === "/task") return "Tasks";
  if (pathname === "/tag") return "Tags";
  if (pathname === "/tag/create") return "Add Tag";
  if (pathname === "/categories") return "Categories";
  if (pathname === "/business") return "Business";
  if (pathname === "/people") return "People";
  if (pathname === "/profile") return "Profile";
  return "";
};

export default function AppPageHeader() {
  const pathname = usePathname();
  const { title } = usePageTitle();

  return <PageHeader title={title ?? getTitle(pathname)} />;
}
