import type { Root } from "mdast";
import type { VFile } from "vfile";
import { toString } from "mdast-util-to-string";

const WORDS_PER_MINUTE = 200;

export function readingTimePlugin() {
  return (tree: Root, file: VFile) => {
    const text = toString(tree);
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
    file.data.astro = file.data.astro ?? {};
    (file.data.astro as Record<string, unknown>).frontmatter = {
      ...((file.data.astro as Record<string, unknown>).frontmatter as object ?? {}),
      readingTime: minutes,
    };
  };
}
