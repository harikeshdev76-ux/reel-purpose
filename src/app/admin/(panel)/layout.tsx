import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <AdminNav
        userName={session.user?.name ?? ""}
        userEmail={session.user?.email ?? ""}
      />
      {/* Offset for the fixed mobile header (pt-20) and the desktop sidebar (lg:ml-64) */}
      <div className="p-4 pt-20 sm:p-8 sm:pt-20 lg:ml-64 lg:pt-8">{children}</div>
    </div>
  );
}
