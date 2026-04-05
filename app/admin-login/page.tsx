import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LoginForm from "./LoginForm";
import MO3Logo from "@/components/MO3Logo";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-[color:var(--background)] px-6 py-10 text-[color:var(--foreground)] sm:px-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-10 rounded-3xl border border-[color:var(--border-color)] bg-[color:var(--card-bg)] p-10 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="space-y-4">
          <MO3Logo className="h-[5rem] w-auto" />
          <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--foreground)]">
            Admin login
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
            Sign in with the administrator credentials configured in your environment.
          </p>
        </div>

        <div className="rounded-3xl bg-[color:var(--surface)] p-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}