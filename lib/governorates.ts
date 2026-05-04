export type GovernorateMapPoint = {
  slug: string;
  name: string;
  top: string;
  left: string;
};

export const EGYPT_GOVERNORATES: GovernorateMapPoint[] = [
  { slug: "alexandria", name: "Alexandria", top: "18%", left: "18%" },
  { slug: "beheira", name: "Beheira", top: "26%", left: "26%" },
  { slug: "matrouh", name: "Matrouh", top: "16%", left: "6%" },
  { slug: "kafr-el-sheikh", name: "Kafr El Sheikh", top: "20%", left: "31%" },
  { slug: "dakahlia", name: "Dakahlia", top: "20%", left: "42%" },
  { slug: "damietta", name: "Damietta", top: "18%", left: "50%" },
  { slug: "gharbia", name: "Gharbia", top: "26%", left: "36%" },
  { slug: "monufia", name: "Monufia", top: "30%", left: "31%" },
  { slug: "qaliubiya", name: "Qalyubia", top: "33%", left: "39%" },
  { slug: "sharqia", name: "Sharqia", top: "29%", left: "46%" },
  { slug: "cairo", name: "Cairo", top: "37%", left: "42%" },
  { slug: "giza", name: "Giza", top: "39%", left: "35%" },
  { slug: "fayoum", name: "Fayoum", top: "48%", left: "34%" },
  { slug: "beni-suef", name: "Beni Suef", top: "52%", left: "39%" },
  { slug: "minya", name: "Minya", top: "61%", left: "40%" },
  { slug: "assiut", name: "Assiut", top: "69%", left: "42%" },
  { slug: "sohag", name: "Sohag", top: "76%", left: "44%" },
  { slug: "qena", name: "Qena", top: "83%", left: "46%" },
  { slug: "luxor", name: "Luxor", top: "88%", left: "50%" },
  { slug: "aswan", name: "Aswan", top: "95%", left: "53%" },
  { slug: "red-sea", name: "Red Sea", top: "66%", left: "66%" },
  { slug: "new-valley", name: "New Valley", top: "63%", left: "19%" },
  { slug: "suez", name: "Suez", top: "40%", left: "52%" },
  { slug: "ismailia", name: "Ismailia", top: "34%", left: "54%" },
  { slug: "port-said", name: "Port Said", top: "20%", left: "56%" },
  { slug: "north-sinai", name: "North Sinai", top: "22%", left: "69%" },
  { slug: "south-sinai", name: "South Sinai", top: "48%", left: "64%" },
];

export function governorateNameFromSlug(slug: string) {
  return EGYPT_GOVERNORATES.find((item) => item.slug === slug)?.name ?? slug;
}
