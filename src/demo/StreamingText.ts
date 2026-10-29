import type { StreamingTextProps } from "../primitives/StreamingText";

const words = (text: string) => text.split(" ").map((t) => ({ text: t }));

const images = {
  scoop:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%231f7a5f'/%3E%3Cpath d='M20 36c0 7 5.4 12 12 12s12-5 12-12H20Z' fill='%23fff'/%3E%3Ccircle cx='32' cy='25' r='11' fill='%23bff3dd'/%3E%3Cpath d='M24 24c4-7 13-7 17 0' fill='none' stroke='%231f7a5f' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E",
  trends:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%232f6fec'/%3E%3Cpath d='M15 43 27 31l8 7 14-18' fill='none' stroke='%23fff' stroke-width='7' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='49' cy='20' r='5' fill='%23bfe0ff'/%3E%3C/svg%3E",
  market:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%23e56d24'/%3E%3Cpath d='M17 45V25h8v20h-8Zm11 0V16h8v29h-8Zm11 0V30h8v15h-8Z' fill='%23fff'/%3E%3Cpath d='M16 49h32' stroke='%23ffd6b8' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E",
};

export const streamingTextDemo = {
  content: [
    ...words("Pistachio is your fastest-growing flavor — sales are up 23% this month and margins beat vanilla by 8 points."),
    { text: "", cite: true },
    ...words("Stone-fruit flavors are trending in the same range."),
  ],
  sources: [
    { name: "Scoop Data", domain: "scoopdata.io", href: "https://scoopdata.io/", image: images.scoop },
    { name: "Trends Index", domain: "trends.google.com", href: "https://trends.google.com/trends/", image: images.trends },
    { name: "Market Basket", domain: "marketbasket.io", href: "https://marketbasket.io/", image: images.market },
  ],
  followUps: ["Which flavors sell best in winter", "Compare gelato and soft serve margins"],
  loop: true,
} satisfies StreamingTextProps;
