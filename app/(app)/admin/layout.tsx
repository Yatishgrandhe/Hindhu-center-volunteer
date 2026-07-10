import { redirect } from "next/navigation";
import { getUserAndProfile } from "@/lib/auth";

/**
 * Server-side guard for the entire /admin route group. This is the source of
 * truth for admin access — it runs on every request to an admin page and does
 * not depend on middleware. Non-admins can never render admin UI.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getUserAndProfile();

  if (!user) redirect("/login");
  if (!profile?.onboarded) redirect("/onboarding");
  if (profile.role !== "admin") redirect("/dashboard");

  return <>{children}</>;
}
