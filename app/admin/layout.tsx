import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Sidebar from "./components/Sidebar";
import AdminDarkMode from "./components/AdminDarkMode";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin-login");
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <AdminDarkMode />
      <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <main className="bg-[color:var(--surface)] p-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-[color:var(--foreground)] sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
