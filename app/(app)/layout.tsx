import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getUserAndProfile } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getUserAndProfile();

  if (!user) redirect("/login");
  if (!profile?.onboarded) redirect("/onboarding");

  return (
    <>
      <SiteHeader authed role={profile.role} name={profile.full_name} />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
