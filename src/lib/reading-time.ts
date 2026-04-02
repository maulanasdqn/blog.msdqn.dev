import type { Root } from "mdast";
import { toString as mdastToString } from "mdast-util-to-string";
import type { VFile } from "vfile";

const WORDS_PER_MINUTE = 200;

export function readingTimePlugin() {
  return (tree: Root, file: VFile) => {
    const text = mdastToString(tree);
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
    file.data.astro = file.data.astro ?? {};
    (file.data.astro as Record<string, unknown>).frontmatter = {
      ...(((file.data.astro as Record<string, unknown>)
        .frontmatter as object) ?? {}),
      readingTime: minutes,
    };
  };
}
