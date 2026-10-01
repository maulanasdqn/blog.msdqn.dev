import type { ThemeRegistrationRaw } from "shiki/core";

export const monoTheme: ThemeRegistrationRaw = {
  name: "msdqn-mono",
  type: "dark",
  colors: {
    "editor.background": "#111111",
    "editor.foreground": "#d4d4d4",
  },
  settings: [
    { settings: { foreground: "#d4d4d4", background: "#111111" } },
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#8a8a8a", fontStyle: "italic" },
    },
    {
      scope: [
        "keyword",
        "storage",
        "storage.type",
        "storage.modifier",
        "keyword.control",
        "keyword.operator.new",
        "variable.language",
      ],
      settings: { foreground: "#fafafa", fontStyle: "bold" },
    },
    {
      scope: [
        "string",
        "string.quoted",
        "string.template",
        "markup.inline.raw",
      ],
      settings: { foreground: "#b8b8b8" },
    },
    {
      scope: ["constant.numeric", "constant.language", "constant.character"],
      settings: { foreground: "#fafafa" },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "meta.function-call",
        "entity.name.type",
        "support.type",
        "entity.name.class",
      ],
      settings: { foreground: "#fafafa" },
    },
    {
      scope: ["punctuation", "keyword.operator", "meta.brace"],
      settings: { foreground: "#8a8a8a" },
    },
    {
      scope: ["markup.inserted", "punctuation.definition.inserted"],
      settings: { foreground: "#fafafa" },
    },
    {
      scope: ["markup.deleted", "punctuation.definition.deleted"],
      settings: { foreground: "#8a8a8a", fontStyle: "strikethrough" },
    },
  ],
};
