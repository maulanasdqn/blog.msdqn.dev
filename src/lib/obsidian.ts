import type { Element, Root as HastRoot, Parents, Text } from "hast";
import type { BlockContent, PhrasingContent, Root } from "mdast";
import { visit } from "unist-util-visit";

const CODE_TAGS = new Set(["code", "pre"]);

export function obsidianPlugin() {
  return (tree: Root) => {
    visit(tree, "text", (node) => {
      node.value = node.value.replace(/%%.*?%%/gs, "");
    });

    visit(tree, "text", (node, index, parent) => {
      if (!node.value.includes("[[") || !parent || index === undefined) return;

      const parts = node.value.split(/(\[\[[^\]]+\]\])/g);
      if (parts.length === 1) return;

      const newNodes = parts
        .filter((p) => p !== "")
        .map((part): PhrasingContent => {
          const match = part.match(/^\[\[([^\]]+)\]\]$/);
          if (match) {
            const segments = match[1].split("|");
            const slug = segments[0]
              .trim()
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "");
            const label = (segments[1] ?? segments[0]).trim();
            return {
              type: "link",
              url: `/blog/${slug}`,
              children: [{ type: "text", value: label }],
            };
          }
          return { type: "text", value: part };
        });

      parent.children.splice(index, 1, ...newNodes);
    });

    visit(tree, "blockquote", (node, index, parent) => {
      if (!parent || index === undefined) return;
      const firstChild = node.children[0];
      if (firstChild?.type !== "paragraph") return;
      const firstText = firstChild.children[0];
      if (firstText?.type !== "text") return;

      const match = firstText.value.match(/^\[!(\w+)\](?:\s+(.*))?/);
      if (!match) return;

      const calloutType = match[1].toLowerCase();
      const calloutTitle =
        match[2] ?? calloutType.charAt(0).toUpperCase() + calloutType.slice(1);

      firstText.value = firstText.value
        .replace(/^\[!\w+\](?:\s+.*)?/, "")
        .trim();
      if (!firstText.value && firstChild.children.length === 1) {
        node.children.shift();
      }

      const openNode = {
        type: "html" as const,
        value: `<div class="callout callout-${calloutType}"><div class="callout-title">${calloutTitle}</div><div class="callout-content">`,
      };
      const closeNode = { type: "html" as const, value: "</div></div>" };

      const innerChildren = node.children.flatMap((child) => {
        if (child.type === "blockquote") {
          return child.children as BlockContent[];
        }
        return child as BlockContent;
      });

      parent.children.splice(index, 1, openNode, ...innerChildren, closeNode);
    });
  };
}

export function rehypeHighlight() {
  return (tree: HastRoot) => {
    visit(tree, "text", (node: Text, index, parent: Parents | undefined) => {
      if (!node.value.includes("==") || !parent || index === undefined) return;

      if (
        parent.type === "element" &&
        CODE_TAGS.has((parent as Element).tagName)
      ) {
        return;
      }

      const parts = node.value.split(/(==.+?==)/g);
      if (parts.length === 1) return;

      const newNodes = parts
        .filter((p) => p !== "")
        .map((part): Text | Element => {
          const match = part.match(/^==(.+)==$/);
          if (match) {
            return {
              type: "element",
              tagName: "mark",
              properties: {},
              children: [{ type: "text", value: match[1] }],
            };
          }
          return { type: "text", value: part };
        });

      parent.children.splice(index, 1, ...newNodes);
    });
  };
}
