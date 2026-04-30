import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPlacesPage() {
  const works = await prisma.work.findMany({
    where: { showOnMap: true },
    orderBy: [{ section: { order: "asc" } }, { order: "asc" }],
    include: {
      section: {
        select: {
          title: true,
        },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--card-bg)] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <p className="font-mono text-sm uppercase tracking-[0.35em] text-[color:var(--color-primary)]">Map Coverage</p>
        <h1 className="mt-4 text-4xl font-semibold text-[color:var(--foreground)]">Work locations</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[color:var(--muted)]">
          The public map now reads directly from the main `Work` records. Edit location metadata from the Works
          manager so project content, visibility, and coordinates stay in sync.
        </p>
        <Link
          href="/admin/works"
          className="mt-6 inline-flex rounded-full bg-[color:var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--color-red-dim)]"
        >
          Manage works
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--card-bg)]">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-[color:var(--surface-strong)] text-[color:var(--muted)]">
            <tr>
              <th className="px-4 py-4">Project</th>
              <th className="px-4 py-4">Section</th>
              <th className="px-4 py-4">City</th>
              <th className="px-4 py-4">Country</th>
              <th className="px-4 py-4">Coordinates</th>
            </tr>
          </thead>
          <tbody>
            {works.length ? (
              works.map((work) => (
                <tr key={work.id} className="border-t border-[color:var(--color-border)]">
                  <td className="px-4 py-4 text-[color:var(--foreground)]">{work.title}</td>
                  <td className="px-4 py-4 text-[color:var(--muted)]">{work.section.title}</td>
                  <td className="px-4 py-4 text-[color:var(--muted)]">{work.locationCity ?? "Missing"}</td>
                  <td className="px-4 py-4 text-[color:var(--muted)]">{work.locationCountry ?? "Missing"}</td>
                  <td className="px-4 py-4 font-mono text-[color:var(--muted)]">
                    {work.locationLat != null && work.locationLng != null
                      ? `${work.locationLat.toFixed(4)}, ${work.locationLng.toFixed(4)}`
                      : "Missing"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[color:var(--muted)]">
                  No projects are enabled for the map yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
