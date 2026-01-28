import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RegisterForm from "./RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JFC | Register Page",
};

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    redirect("/task");
  }

  return <RegisterForm />;
}
