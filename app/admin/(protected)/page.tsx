import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [totalSections, totalWorks, totalClients, recentWorks] = await Promise.all([
    prisma.section.count(),
    prisma.work.count(),
    prisma.client.count(),
    prisma.work.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { section: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-[color:var(--card-bg)] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-[color:var(--border-color)]">
        <p className="text-sm uppercase tracking-[0.35em] text-[#E31212]">Overview</p>
        <h1 className="mt-4 text-4xl font-semibold text-[color:var(--foreground)]">Dashboard</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
          High-level production metrics and the latest works are shown here so you can keep the
          portfolio current.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl bg-[color:var(--card-bg)] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-[color:var(--border-color)]">
          <p className="text-sm uppercase tracking-[0.35em] text-[color:var(--accent)]">Sections</p>
          <p className="mt-5 text-5xl font-semibold text-[color:var(--foreground)]">{totalSections}</p>
          <p className="mt-3 text-sm text-[color:var(--muted)]">Total sections in the portfolio.</p>
        </div>
        <div className="rounded-3xl bg-[color:var(--card-bg)] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-[color:var(--border-color)]">
          <p className="text-sm uppercase tracking-[0.35em] text-[color:var(--accent)]">Works</p>
          <p className="mt-5 text-5xl font-semibold text-[color:var(--foreground)]">{totalWorks}</p>
          <p className="mt-3 text-sm text-[color:var(--muted)]">Total works available in the portfolio.</p>
        </div>
        <div className="rounded-3xl bg-[color:var(--card-bg)] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-[color:var(--border-color)]">
          <p className="text-sm uppercase tracking-[0.35em] text-[color:var(--accent)]">Clients</p>
          <p className="mt-5 text-5xl font-semibold text-[color:var(--foreground)]">{totalClients}</p>
          <p className="mt-3 text-sm text-[color:var(--muted)]">Total clients managed in the system.</p>
        </div>
      </div>

      <div className="rounded-3xl bg-[color:var(--card-bg)] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-[color:var(--border-color)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[color:var(--accent)]">Recent Work</p>
            <h2 className="mt-4 text-3xl font-semibold text-[color:var(--foreground)]">Last 5 works added</h2>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {recentWorks.length > 0 ? (
            recentWorks.map((work: any) => (
              <div
                key={work.id}
                className="flex flex-col gap-3 rounded-3xl border border-[color:var(--border-color)] bg-[color:var(--surface)] p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.35em] text-[color:var(--muted)]">{work.section?.title}</p>
                  <h3 className="text-xl font-semibold text-[color:var(--foreground)]">{work.title}</h3>
                  <p className="text-sm text-[color:var(--muted)]">{work.client}</p>
                </div>
                <div className="space-y-1 text-right text-sm text-[color:var(--muted)] sm:text-left">
                  <p>{new Date(work.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                  <p className="text-[color:var(--muted)]">Order {work.order}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[color:var(--muted)]">No works have been added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}