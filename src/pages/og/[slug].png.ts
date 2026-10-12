import type { APIContext } from "astro";
import { renderOgImage } from "@/lib/og";
import { getPost } from "@/lib/posts";

export const GET = async ({
  params,
  request,
}: APIContext): Promise<Response> => {
  const post = await getPost(params.slug ?? "");
  if (!post) return new Response("Not found\n", { status: 404 });

  const cache = (caches as unknown as { default: Cache }).default;
  const key = new Request(
    `${new URL(request.url).origin}/og/${post.slug}.png?v=${post.updatedAt.getTime()}`,
  );
  const cached = await cache.match(key);
  if (cached) return cached;

  const response = new Response(await renderOgImage(post), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
  await cache.put(key, response.clone());
  return response;
};
