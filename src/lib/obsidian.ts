import type { Root, BlockContent } from "mdast";
import { visit } from "unist-util-visit";

export function obsidianPlugin() {
  return (tree: Root) => {
    // Strip %%comments%%
    visit(tree, "text", (node) => {
      node.value = node.value.replace(/%%.*?%%/gs, "");
    });

    // ==highlights== → <mark>
    visit(tree, "text", (node) => {
      if (node.value.includes("==")) {
        node.value = node.value.replace(/==(.+?)==/g, "<mark>$1</mark>");
      }
    });

    // Obsidian callouts: > [!type] Title
    visit(tree, "blockquote", (node, index, parent) => {
      if (!parent || index === undefined) return;
      const firstChild = node.children[0];
      if (firstChild?.type !== "paragraph") return;
      const firstText = firstChild.children[0];
      if (firstText?.type !== "text") return;

      const match = firstText.value.match(/^\[!(\w+)\](?:\s+(.*))?/);
      if (!match) return;

      const calloutType = match[1].toLowerCase();
      const calloutTitle = match[2] ?? calloutType.charAt(0).toUpperCase() + calloutType.slice(1);

      // Remove the [!type] line
      firstText.value = firstText.value.replace(/^\[!\w+\](?:\s+.*)?/, "").trim();
      if (!firstText.value && firstChild.children.length === 1) {
        node.children.shift();
      }

      const calloutNode = {
        type: "html" as const,
        value: `<div class="callout callout-${calloutType}"><div class="callout-title">${calloutTitle}</div><div class="callout-content">`,
      };
      const closeNode = { type: "html" as const, value: "</div></div>" };

      parent.children.splice(index, 1, calloutNode, ...node.children as BlockContent[], closeNode);
    });
  };
}
