import { markdownResponse, postMarkdown } from "@/lib/llms";
import { listPosts } from "@/lib/posts";
import { SITE_DESCRIPTION } from "@/lib/site";

export const GET = async (): Promise<Response> => {
  const posts = await listPosts();
  return markdownResponse(
    [
      "# Maulana Sodiqin | Writing",
      `> ${SITE_DESCRIPTION}`,
      ...posts.map(postMarkdown),
    ].join("\n\n---\n\n"),
  );
};
