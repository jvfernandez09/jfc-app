import { getCurrentUser } from "@/app/actions/auth";
import AppNavbarClient from "./AppNavBarClient";

export default async function AppNavbar() {
  const user = await getCurrentUser();
  return <AppNavbarClient user={user} />;
}
