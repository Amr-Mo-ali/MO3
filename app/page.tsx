import { prisma } from "@/lib/prisma";
import Homepage from "@/components/Homepage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [siteConfigRows, clients, sections, heroConfig, stats, testimonials, faqs] = await Promise.all([
    prisma.siteConfig.findMany({ orderBy: { key: "asc" } }),
    prisma.client.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    }),
    prisma.section.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
      include: {
        works: {
          where: { isVisible: true },
          orderBy: { order: "asc" },
        },
      },
    }),
    prisma.heroConfig.findFirst({
      where: { isVisible: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.stat.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    }),
    prisma.testimonial.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    }),
    prisma.fAQ.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    }),
  ]);

  const siteConfig = Object.fromEntries(siteConfigRows.map((item) => [item.key, item.value])) as {
    about_text?: string;
    whatsapp?: string;
    instagram?: string;
    behance?: string;
    facebook?: string;
  };

  const visibleSections = sections.filter((section) => section.works.length > 0);

  return (
    <Homepage
      siteConfig={{
        aboutText: siteConfig.about_text ?? "",
        whatsapp: siteConfig.whatsapp ?? "",
        instagram: siteConfig.instagram ?? "",
        behance: siteConfig.behance ?? "",
        facebook: siteConfig.facebook ?? "",
      }}
      clients={clients}
      sections={visibleSections}
      heroConfig={heroConfig}
      stats={stats}
      testimonials={testimonials}
      faqs={faqs}
    />
  );
}
