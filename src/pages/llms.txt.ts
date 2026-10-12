import { markdownResponse, postUrl } from "@/lib/llms";
import { countTags, listPosts } from "@/lib/posts";
import { SITE_DESCRIPTION, SITE_URL, tagSlug } from "@/lib/site";

export const GET = async (): Promise<Response> => {
  const posts = await listPosts();
  const tags = [...countTags(posts).keys()];
  return markdownResponse(
    [
      "# Maulana Sodiqin | Writing",
      `> ${SITE_DESCRIPTION}`,
      "Written by Maulana Sodiqin, a senior software engineer (https://msdqn.dev). Every post is also available as plain Markdown by appending `.md` to its URL, and the full text of all posts is at " +
        `${SITE_URL}/llms-full.txt.`,
      "## Posts",
      posts
        .map(
          (post) =>
            `- [${post.title}](${postUrl(post)}.md)${post.excerpt ? `: ${post.excerpt}` : ""}`,
        )
        .join("\n"),
      ...(tags.length > 0
        ? [
            "## Topics",
            tags
              .map((tag) => `- [${tag}](${SITE_URL}/tags/${tagSlug(tag)})`)
              .join("\n"),
          ]
        : []),
      "## Optional",
      [
        `- [Full text of all posts](${SITE_URL}/llms-full.txt)`,
        `- [RSS feed](${SITE_URL}/rss.xml)`,
        "- [About the author](https://msdqn.dev)",
      ].join("\n"),
    ].join("\n\n"),
  );
};
