import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { headers } from "next/headers";
import Sidebar from "./components/Sidebar";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const headersList = headers();
  const pathname = headersList.get("x-invoke-path") || "";

  const isLoginPage = pathname === "/admin/login" || pathname.startsWith("/admin/login");

  if (!isLoginPage) {
    const session = await getServerSession(authOptions);
    if (!session) {
      redirect("/admin/login");
    }
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="grid min-h-screen grid-cols-[280px_1fr]">
        <Sidebar />
        <main className="bg-[color:var(--surface)] p-8 text-[color:var(--foreground)]">{children}</main>
      </div>
    </div>
  );
}