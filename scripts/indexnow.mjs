import { readdirSync } from "node:fs";

const SITE_URL = "https://blog.msdqn.dev";
const host = new URL(SITE_URL).host;
const keyFile = readdirSync(new URL("../public/", import.meta.url)).find(
  (name) => /^[a-f0-9]{32}\.txt$/.test(name),
);

if (!keyFile) {
  throw new Error("IndexNow key file not found in public/");
}

const key = keyFile.replace(/\.txt$/, "");
const sitemap = await (await fetch(`${SITE_URL}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1],
);

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host,
    key,
    keyLocation: `${SITE_URL}/${keyFile}`,
    urlList,
  }),
});

console.log(`IndexNow: ${response.status} for ${urlList.length} URLs`);

if (!response.ok && response.status !== 202) {
  console.error(await response.text());
  process.exitCode = 1;
}
