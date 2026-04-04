export type Work = {
  id: string;
  title: string;
  client: string | null;
  videoUrl: string | null;
  thumbnail: string | null;
  description: string | null;
  tags: string[];
  isVisible: boolean;
  order: number;
  sectionId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Section = {
  id: string;
  title: string;
  slug: string;
  order: number;
  isVisible: boolean;
  works: Work[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type Client = {
  id: string;
  name: string;
  logo: string;
  order: number;
  isVisible: boolean;
};

export type SiteConfig = {
  id: string;
  key: string;
  value: string;
};

export type SectionWithWorks = Section & { works: Work[] };
