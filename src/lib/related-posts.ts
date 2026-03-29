import type { Post } from "./posts";

export function getRelatedPosts(current: Post, all: Post[], limit = 3): Post[] {
  const others = all.filter((p) => p.id !== current.id);
  const scored = others.map((post) => {
    let score = 0;
    for (const tag of current.data.tags) {
      if (post.data.tags.includes(tag)) score += 2;
    }
    if (current.data.category && post.data.category === current.data.category) score += 1;
    return { post, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.post);
}
