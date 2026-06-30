import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import VendorNav from "@/components/vendor/VendorNav";

export default async function VendorPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "vendor") {
    redirect("/vendor");
  }

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <VendorNav
        userName={session.user?.name ?? ""}
        userEmail={session.user?.email ?? ""}
      />
      <div className="p-4 pt-20 sm:p-8 sm:pt-20 lg:ml-64 lg:pt-8">
        {children}
      </div>
    </div>
  );
}
