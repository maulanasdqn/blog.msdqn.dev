export const SITE_URL = "https://blog.msdqn.dev";
export const SITE_NAME = "Maulana Sodiqin | Writing";
export const SITE_DESCRIPTION =
  "Notes and tutorials by Maulana Sodiqin on building web platforms with Rust and TypeScript, from backend systems to browser automation.";
export const AUTHOR = {
  "@type": "Person",
  "@id": "https://msdqn.dev/#person",
  name: "Maulana Sodiqin",
  url: "https://msdqn.dev/",
  jobTitle: "Senior Software Engineer",
  sameAs: [
    "https://www.linkedin.com/in/maulana-sodiqin/",
    "https://github.com/maulanasdqn",
  ],
};
export const MIN_INDEXED_TAG_POSTS = 2;
export const OG_IMAGE = `${SITE_URL}/og-image.png`;
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export const ogImageUrl = (slug: string, updatedAt: Date): string =>
  `${SITE_URL}/og/${slug}.png?v=${Math.floor(updatedAt.getTime() / 1000)}`;

export const tagSlug = (tag: string): string =>
  tag
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export const formatDate = (date: Date): string =>
  date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
