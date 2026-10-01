import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import type { Element, Root as HastRoot } from "hast";
import { toString as hastToString } from "hast-util-to-string";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";
import { obsidianPlugin, rehypeHighlight } from "@/lib/obsidian";

export type Heading = {
  depth: number;
  slug: string;
  text: string;
};

export type RenderedPost = {
  html: string;
  headings: Heading[];
};

let highlighter: Promise<HighlighterCore> | undefined;

const getHighlighter = (): Promise<HighlighterCore> => {
  highlighter ??= createHighlighterCore({
    themes: [import("@shikijs/themes/poimandres")],
    langs: [
      import("@shikijs/langs/typescript"),
      import("@shikijs/langs/tsx"),
      import("@shikijs/langs/javascript"),
      import("@shikijs/langs/jsx"),
      import("@shikijs/langs/json"),
      import("@shikijs/langs/rust"),
      import("@shikijs/langs/go"),
      import("@shikijs/langs/python"),
      import("@shikijs/langs/shellscript"),
      import("@shikijs/langs/sql"),
      import("@shikijs/langs/html"),
      import("@shikijs/langs/css"),
      import("@shikijs/langs/yaml"),
      import("@shikijs/langs/toml"),
      import("@shikijs/langs/nix"),
      import("@shikijs/langs/dockerfile"),
      import("@shikijs/langs/diff"),
      import("@shikijs/langs/markdown"),
    ],
    engine: createJavaScriptRegexEngine(),
  });
  return highlighter;
};

const collectHeadings = () => (tree: HastRoot, file: VFile) => {
  const headings: Heading[] = [];
  visit(tree, "element", (node: Element) => {
    const depth = Number(node.tagName.slice(1));
    if (!/^h[23]$/.test(node.tagName) || typeof node.properties.id !== "string")
      return;
    headings.push({
      depth,
      slug: node.properties.id,
      text: hastToString(node),
    });
  });
  file.data.headings = headings;
};

const cache = new Map<string, RenderedPost>();

export const renderMarkdown = async (
  key: string,
  markdown: string,
): Promise<RenderedPost> => {
  const cached = cache.get(key);
  if (cached) return cached;

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(obsidianPlugin)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight)
    .use(rehypeSlug)
    .use(collectHeadings)
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
      properties: { className: ["heading-link"] },
    })
    .use(rehypeShikiFromHighlighter, await getHighlighter(), {
      theme: "poimandres",
      defaultLanguage: "text",
      fallbackLanguage: "text",
    })
    .use(rehypeStringify)
    .process(markdown);

  const rendered = {
    html: String(file),
    headings: (file.data.headings as Heading[] | undefined) ?? [],
  };
  cache.set(key, rendered);
  return rendered;
};
