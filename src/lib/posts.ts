import { env } from "cloudflare:workers";
import { tagSlug } from "@/lib/site";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  readTime: number;
  metaTitle: string | null;
  metaDescription: string | null;
  featured: boolean;
  publishedAt: Date;
  updatedAt: Date;
};

type Row = {
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  tags: string | null;
  read_time: string | null;
  meta_title: string | null;
  meta_description: string | null;
  featured: number | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

const WORDS_PER_MINUTE = 200;

const parseTags = (value: string | null): string[] => {
  try {
    const parsed = JSON.parse(value ?? "[]");
    return Array.isArray(parsed)
      ? parsed
          .map(String)
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];
  } catch {
    return [];
  }
};

const readTime = (row: Row): number => {
  const fromColumn = Number.parseInt(row.read_time ?? "", 10);
  if (Number.isFinite(fromColumn) && fromColumn > 0) return fromColumn;
  const words = (row.content ?? "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
};

const toPost = (row: Row): Post => ({
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt ?? "",
  content: row.content ?? "",
  tags: parseTags(row.tags),
  readTime: readTime(row),
  metaTitle: row.meta_title,
  metaDescription: row.meta_description,
  featured: row.featured === 1,
  publishedAt: new Date(row.published_at ?? row.created_at),
  updatedAt: new Date(row.updated_at),
});

const PUBLISHED = `SELECT slug, title, excerpt, content, tags, read_time, meta_title, meta_description, featured, published_at, created_at, updated_at
  FROM blog_posts WHERE published = 1`;
const NEWEST_FIRST = "ORDER BY COALESCE(published_at, created_at) DESC";

export const listPosts = async (): Promise<Post[]> => {
  const { results } = await env.DB.prepare(
    `${PUBLISHED} ${NEWEST_FIRST}`,
  ).all<Row>();
  return results.map(toPost);
};

export const getPost = async (slug: string): Promise<Post | null> => {
  const row = await env.DB.prepare(`${PUBLISHED} AND slug = ?1`)
    .bind(slug)
    .first<Row>();
  return row ? toPost(row) : null;
};

export const searchPosts = async (query: string): Promise<Post[]> => {
  const pattern = `%${query.replace(/[%_]/g, "")}%`;
  const { results } = await env.DB.prepare(
    `${PUBLISHED} AND (title LIKE ?1 OR excerpt LIKE ?1 OR content LIKE ?1 OR tags LIKE ?1) ${NEWEST_FIRST} LIMIT 50`,
  )
    .bind(pattern)
    .all<Row>();
  return results.map(toPost);
};

export const countTags = (posts: Post[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return new Map([...counts].sort((a, b) => b[1] - a[1]));
};

export const postsWithTag = (posts: Post[], slug: string): Post[] =>
  posts.filter((post) => post.tags.some((tag) => tagSlug(tag) === slug));

export const relatedPosts = (
  current: Post,
  posts: Post[],
  limit = 3,
): Post[] => {
  const tags = new Set(current.tags.map(tagSlug));
  return posts
    .filter((post) => post.slug !== current.slug)
    .map((post) => ({
      post,
      score: post.tags.filter((tag) => tags.has(tagSlug(tag))).length,
    }))
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.post.publishedAt.getTime() - a.post.publishedAt.getTime(),
    )
    .slice(0, limit)
    .map((entry) => entry.post);
};
