import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding MO3 Production database...");

  await prisma.work.deleteMany();
  await prisma.section.deleteMany();
  await prisma.client.deleteMany();
  await prisma.siteConfig.deleteMany();

  const sections = [
    {
      title: "Commercial Ads",
      slug: "commercial-ads",
      order: 1,
      isVisible: true,
    },
    {
      title: "Reels",
      slug: "reels",
      order: 2,
      isVisible: true,
    },
    {
      title: "Podcast",
      slug: "podcast",
      order: 3,
      isVisible: true,
    },
    {
      title: "Video Clips",
      slug: "video-clips",
      order: 4,
      isVisible: true,
    },
  ];

  const sectionRecords = await Promise.all(
    sections.map((section) => prisma.section.create({ data: section }))
  );

  const clients = [
    {
      name: "Lumen Labs",
      logo: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      order: 1,
      isVisible: true,
    },
    {
      name: "Noir Collective",
      logo: "https://res.cloudinary.com/demo/image/upload/balloons.jpg",
      order: 2,
      isVisible: true,
    },
    {
      name: "Velvet Agency",
      logo: "https://res.cloudinary.com/demo/image/upload/coffee.jpg",
      order: 3,
      isVisible: true,
    },
    {
      name: "Arcadia Studio",
      logo: "https://res.cloudinary.com/demo/image/upload/car.jpg",
      order: 4,
      isVisible: true,
    },
    {
      name: "Pulse Media",
      logo: "https://res.cloudinary.com/demo/image/upload/horses.jpg",
      order: 5,
      isVisible: true,
    },
  ];

  await Promise.all(clients.map((client) => prisma.client.create({ data: client })));

  const works = [
    {
      title: "Brand Launch: Atlas",
      client: "Lumen Labs",
      videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
      thumbnail: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      description: "A cinematic product launch film with dramatic lighting and fast-paced storytelling.",
      tags: ["commercial", "launch", "cinematic"],
      isVisible: true,
      order: 1,
      sectionId: sectionRecords[0].id,
    },
    {
      title: "Retail Spotlight",
      client: "Noir Collective",
      videoUrl: "https://vimeo.com/76979871",
      thumbnail: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      description: "A premium retail commercial built around strong visuals and refined pacing.",
      tags: ["advertising", "retail", "brand"],
      isVisible: true,
      order: 2,
      sectionId: sectionRecords[0].id,
    },
    {
      title: "Urban Teaser",
      client: "Velvet Agency",
      videoUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
      thumbnail: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      description: "A short cinematic teaser for a premium lifestyle campaign.",
      tags: ["teaser", "lifestyle", "premium"],
      isVisible: true,
      order: 3,
      sectionId: sectionRecords[0].id,
    },
    {
      title: "Reel One: Motion",
      client: "Arcadia Studio",
      videoUrl: "https://vimeo.com/148751763",
      thumbnail: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      description: "A social reel with punchy edits and motion-driven visuals.",
      tags: ["reel", "motion", "social"],
      isVisible: true,
      order: 1,
      sectionId: sectionRecords[1].id,
    },
    {
      title: "Reel Two: Night",
      client: "Pulse Media",
      videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
      thumbnail: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      description: "A dynamic nighttime reel crafted for high-impact social reach.",
      tags: ["reel", "night", "social"],
      isVisible: true,
      order: 2,
      sectionId: sectionRecords[1].id,
    },
    {
      title: "Reel Three: Story",
      client: "Lumen Labs",
      videoUrl: "https://vimeo.com/76979871",
      thumbnail: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      description: "A storytelling-focused reel highlighting visual craft and brand tone.",
      tags: ["reel", "story", "branding"],
      isVisible: true,
      order: 3,
      sectionId: sectionRecords[1].id,
    },
    {
      title: "Podcast Intro",
      client: "Noir Collective",
      videoUrl: "https://www.youtube.com/watch?v=K4TOrB7at0Y",
      thumbnail: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      description: "A branded podcast intro with cinematic audio-visual cues.",
      tags: ["podcast", "intro", "audio"],
      isVisible: true,
      order: 1,
      sectionId: sectionRecords[2].id,
    },
    {
      title: "Podcast Highlight",
      client: "Velvet Agency",
      videoUrl: "https://vimeo.com/22439234",
      thumbnail: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      description: "A highlight reel for a premium discussion series.",
      tags: ["podcast", "highlight", "discussion"],
      isVisible: true,
      order: 2,
      sectionId: sectionRecords[2].id,
    },
    {
      title: "Podcast Visualizer",
      client: "Arcadia Studio",
      videoUrl: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
      thumbnail: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      description: "A visualizer video for podcast episodes with moody design.",
      tags: ["podcast", "visualizer", "design"],
      isVisible: true,
      order: 3,
      sectionId: sectionRecords[2].id,
    },
    {
      title: "Clip One: Motion Study",
      client: "Pulse Media",
      videoUrl: "https://vimeo.com/76979871",
      thumbnail: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      description: "A short clip showcasing motion design and kinetic energy.",
      tags: ["clip", "motion", "design"],
      isVisible: true,
      order: 1,
      sectionId: sectionRecords[3].id,
    },
    {
      title: "Clip Two: Visual Mood",
      client: "Lumen Labs",
      videoUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
      thumbnail: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      description: "A mood-driven clip with dramatic visuals and texture.",
      tags: ["clip", "mood", "visual"],
      isVisible: true,
      order: 2,
      sectionId: sectionRecords[3].id,
    },
    {
      title: "Clip Three: Story Frame",
      client: "Noir Collective",
      videoUrl: "https://vimeo.com/148751763",
      thumbnail: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      description: "A short narrative clip built for cinematic storytelling.",
      tags: ["clip", "narrative", "cinematic"],
      isVisible: true,
      order: 3,
      sectionId: sectionRecords[3].id,
    },
  ];

  await Promise.all(works.map((work) => prisma.work.create({ data: work })));

  const siteConfig = [
    {
      key: "aboutText",
      value:
        "MO3 Production crafts cinematic visual experiences for brands, podcasts, and digital campaigns. Our work blends premium storytelling with bold atmosphere and refined direction.",
    },
    {
      key: "whatsapp",
      value: "+12345678901",
    },
    {
      key: "instagram",
      value: "instagram.com/mo3production",
    },
    {
      key: "behance",
      value: "behance.net/mo3production",
    },
    {
      key: "facebook",
      value: "facebook.com/mo3production",
    },
  ];

  await Promise.all(siteConfig.map((item) => prisma.siteConfig.create({ data: item })));

  console.log("✅ Prisma seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
