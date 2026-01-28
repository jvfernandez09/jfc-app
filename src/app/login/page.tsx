import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JFC | Login Page",
};

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    redirect("/task");
  }

  return <LoginForm />;
}
