import type { APIContext } from "astro";
import { markdownResponse, postMarkdown } from "@/lib/llms";
import { getPost } from "@/lib/posts";

export const GET = async ({ params }: APIContext): Promise<Response> => {
  const post = await getPost(params.slug ?? "");
  if (!post) return new Response("Not found\n", { status: 404 });
  return markdownResponse(postMarkdown(post));
};
