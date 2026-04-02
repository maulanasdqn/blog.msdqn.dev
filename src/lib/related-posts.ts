import type { Post } from "./posts";

export function getRelatedPosts(current: Post, all: Post[], limit = 3): Post[] {
  const currentTags = new Set(current.data.tags);
  const others = all.filter((p) => p.id !== current.id);
  const scored = others.map((post) => {
    let score = 0;
    for (const tag of post.data.tags) {
      if (currentTags.has(tag)) score += 2;
    }
    if (current.data.category && post.data.category === current.data.category)
      score += 1;
    return { post, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.post.data.pubDate.getTime() - a.post.data.pubDate.getTime(),
    )
    .slice(0, limit)
    .map((s) => s.post);
}
