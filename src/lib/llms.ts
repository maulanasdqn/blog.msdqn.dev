import type { Post } from "@/lib/posts";
import { formatDate, SITE_URL } from "@/lib/site";

export const postUrl = (post: Post): string => `${SITE_URL}/blog/${post.slug}`;

const wikiSlug = (target: string): string =>
  target
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const portableMarkdown = (content: string): string =>
  content
    .replace(/%%.*?%%/gs, "")
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, label) => {
      const text = (label ?? target).trim();
      return `[${text}](${SITE_URL}/blog/${wikiSlug(target)})`;
    })
    .trim();

export const postMarkdown = (post: Post): string => {
  const meta = [
    `- Author: Maulana Sodiqin (https://msdqn.dev)`,
    `- Published: ${formatDate(post.publishedAt)}`,
    `- Updated: ${formatDate(post.updatedAt)}`,
    `- URL: ${postUrl(post)}`,
    ...(post.tags.length > 0 ? [`- Tags: ${post.tags.join(", ")}`] : []),
  ];
  return [
    `# ${post.title}`,
    ...(post.excerpt ? [`> ${post.excerpt}`] : []),
    meta.join("\n"),
    portableMarkdown(post.content),
  ].join("\n\n");
};

export const markdownResponse = (body: string): Response =>
  new Response(`${body}\n`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex",
    },
  });
