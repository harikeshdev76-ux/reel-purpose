import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";

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
      <Sidebar
        userName={session.user?.name ?? ""}
        userEmail={session.user?.email ?? ""}
      />
      <div className="ml-64 min-h-screen bg-[#0f1117] p-8">{children}</div>
    </div>
  );
}
