import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

export type Post = CollectionEntry<"blog">;

export async function getAllPosts(): Promise<Post[]> {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return sortByDate(posts);
}

export function sortByDate(posts: Post[]): Post[] {
  return [...posts].sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.data.tags.includes(tag));
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.data.category === category);
}

export function getAllTags(posts: Post[]): Record<string, number> {
  const tags: Record<string, number> = {};
  for (const post of posts) {
    for (const tag of post.data.tags) {
      tags[tag] = (tags[tag] ?? 0) + 1;
    }
  }
  return tags;
}
