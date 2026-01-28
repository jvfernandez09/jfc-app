import { redirect } from "next/navigation";
import ProfilePageClient from "./ProfilePageClient";
import { getCurrentUser } from "@/app/actions/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JFC | Profile Page",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return (
    <ProfilePageClient
      initialName={user.name}
      initialEmail={user.email}
    />
  );
}
