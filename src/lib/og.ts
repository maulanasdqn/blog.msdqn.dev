import onestRegular from "@fontsource/onest/files/onest-latin-400-normal.woff?inline";
import onestMedium from "@fontsource/onest/files/onest-latin-500-normal.woff?inline";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import resvgWasm from "@resvg/resvg-wasm/index_bg.wasm?module";
import satori, { init as initSatori } from "satori/standalone";
import yogaWasm from "satori/yoga.wasm?module";
import type { Post } from "@/lib/posts";
import { formatDate, OG_HEIGHT, OG_WIDTH } from "@/lib/site";

const COLORS = {
  bg: "#0a0a0a",
  text: "#fafafa",
  subtle: "#a3a3a3",
  muted: "#737373",
  line: "#262626",
};

type Node = {
  type: string;
  props: { style?: Record<string, unknown>; children?: Child | Child[] };
};
type Child = Node | string;

const h = (
  style: Record<string, unknown>,
  children?: Child | Child[],
): Node => ({ type: "div", props: { style, children } });

const fromDataUrl = (url: string): ArrayBuffer =>
  Uint8Array.from(atob(url.slice(url.indexOf(",") + 1)), (char) =>
    char.charCodeAt(0),
  ).buffer;

let ready: Promise<void> | undefined;

const setup = (): Promise<void> => {
  ready ??= Promise.all([initSatori(yogaWasm), initWasm(resvgWasm)]).then(
    () => undefined,
  );
  return ready;
};

let fonts: { name: string; data: ArrayBuffer; weight: 400 | 500 }[] | undefined;

const getFonts = () => {
  fonts ??= [
    { name: "Onest", data: fromDataUrl(onestRegular), weight: 400 },
    { name: "Onest", data: fromDataUrl(onestMedium), weight: 500 },
  ];
  return fonts;
};

const titleSize = (title: string): number =>
  title.length > 70 ? 52 : title.length > 45 ? 60 : 72;

const card = (post: Post): Node =>
  h(
    {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "66px 88px",
      backgroundColor: COLORS.bg,
      color: COLORS.text,
      fontFamily: "Onest",
    },
    [
      h(
        {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
        [
          h(
            {
              fontSize: 20,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: COLORS.muted,
            },
            `Writing · ${formatDate(post.publishedAt)} · ${post.readTime} min read`,
          ),
          h(
            {
              width: 56,
              height: 56,
              borderRadius: 10,
              backgroundColor: COLORS.text,
              color: COLORS.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 500,
            },
            "M",
          ),
        ],
      ),
      h({ display: "flex", flexDirection: "column", gap: 28 }, [
        h(
          {
            fontSize: titleSize(post.title),
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: -1.5,
            maxWidth: 1000,
          },
          post.title,
        ),
        h(
          { display: "flex", gap: 24, fontSize: 24, color: COLORS.subtle },
          post.tags.slice(0, 4).map((tag) => h({}, `#${tag}`)),
        ),
      ]),
      h(
        {
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 30,
          borderTop: `1px solid ${COLORS.line}`,
          fontSize: 26,
        },
        [
          h({ color: COLORS.text }, "Maulana Sodiqin"),
          h({ color: COLORS.subtle }, "blog.msdqn.dev"),
        ],
      ),
    ],
  );

export const renderOgImage = async (post: Post): Promise<ArrayBuffer> => {
  await setup();
  const svg = await satori(card(post) as never, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: getFonts(),
  });
  return new Resvg(svg, { fitTo: { mode: "width", value: OG_WIDTH } })
    .render()
    .asPng()
    .slice().buffer;
};
