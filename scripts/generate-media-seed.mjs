import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const imageDir = path.join(projectRoot, "img");
const outFile = path.join(projectRoot, "cloudflare", "worker", "seed_media.sql");

const baseUrl = process.env.MEDIA_BASE_URL;

if (!baseUrl) {
  console.error("Missing MEDIA_BASE_URL env var.");
  console.error("Example: MEDIA_BASE_URL=https://cdn.tudominio.com/seishin");
  process.exit(1);
}

const allowed = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".mp4"]);

const toTitle = (fileName) =>
  fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const sqlEscape = (value) => value.replace(/'/g, "''");

const files = fs
  .readdirSync(imageDir)
  .filter((name) => allowed.has(path.extname(name).toLowerCase()))
  .sort((a, b) => a.localeCompare(b, "es"));

const rows = files.map((name, index) => {
  const ext = path.extname(name).toLowerCase();
  const mediaType = ext === ".mp4" ? "video" : "image";
  const title = toTitle(name);
  const src = `${baseUrl.replace(/\/+$/, "")}/${encodeURIComponent(name)}`;
  const sortOrder = index + 1;

  return `('${sqlEscape(title)}','${mediaType}','${sqlEscape(src)}',NULL,${sortOrder},1)`;
});

const content = [
  "DELETE FROM media_items;",
  "INSERT INTO media_items (title, media_type, src, description, sort_order, is_published) VALUES",
  rows.join(",\n"),
  ";",
  "",
].join("\n");

fs.writeFileSync(outFile, content, "utf8");
console.log(`Seed file generated: ${outFile}`);
