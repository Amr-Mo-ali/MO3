import { prisma } from "@/lib/prisma";
import Homepage from "@/components/Homepage";

export default async function Home() {
  const [siteConfigRows, clients, sections] = await Promise.all([
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
  ]);

  const siteConfig = Object.fromEntries(siteConfigRows.map((item) => [item.key, item.value])) as {
    aboutText?: string;
    whatsapp?: string;
    instagram?: string;
    behance?: string;
    facebook?: string;
  };

  const visibleSections = sections.filter((section) => section.works.length > 0);

  return (
    <Homepage
      siteConfig={{
        aboutText: siteConfig.aboutText ?? "",
        whatsapp: siteConfig.whatsapp ?? "",
        instagram: siteConfig.instagram ?? "",
        behance: siteConfig.behance ?? "",
        facebook: siteConfig.facebook ?? "",
      }}
      clients={clients}
      sections={visibleSections}
    />
  );
}
