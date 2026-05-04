export type Work = {
  id: string;
  title: string;
  client: string | null;
  videoUrl: string | null;
  thumbnail: string | null;
  description: string | null;
  tags: string[];
  locationLabel: string | null;
  locationCity: string | null;
  locationCountry: string | null;
  locationLat: number | null;
  locationLng: number | null;
  showOnMap: boolean;
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

export type HeroConfig = {
  id: string;
  title: string;
  subtitle: string | null;
  ctaLabel: string;
  ctaLink: string;
  videoUrl: string;
  posterUrl: string | null;
  isVisible: boolean;
};

export type Stat = {
  id: string;
  label: string;
  value: number;
  prefix: string | null;
  suffix: string | null;
  order: number;
  isVisible: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  photo: string | null;
  order: number;
  isVisible: boolean;
};

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  order: number;
  isVisible: boolean;
};

export type SectionWithWorks = Section & { works: Work[] };
