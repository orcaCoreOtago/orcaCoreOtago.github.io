// Builds _nav.yml (the navbar) from sops.yml so the SOP list lives in one place.
// Runs automatically before every `quarto render` (see _quarto.yml).
// Uses only Quarto's built-in Deno: nothing to install.
//
// It understands the simple layout used in sops.yml: one "- title:" line per
// SOP, followed by indented "key: value" lines. Keep that layout.

const text = Deno.readTextFileSync("sops.yml");
type Sop = { title?: string; path?: string; category?: string };
const sops: Sop[] = [];
let cur: Sop | null = null;

const unquote = (s: string) => s.trim().replace(/^["']|["']$/g, "");

for (const raw of text.split(/\r?\n/)) {
  const line = raw.replace(/\s+#.*$/, "");
  if (/^\s*#/.test(raw) || !line.trim()) continue;
  const m = line.match(/^\s*(-\s*)?(\w+):\s*(.*)$/);
  if (!m) continue;
  if (m[1]) { cur = {}; sops.push(cur); }
  if (!cur) continue;
  const [, , key, val] = m;
  if (key === "title") cur.title = unquote(val);
  if (key === "path") cur.path = unquote(val);
  if (key === "categories") cur.category = unquote(val.replace(/^\[|\]$/g, "").split(",")[0]);
}

const byCat = new Map<string, Sop[]>();
for (const s of sops) {
  if (!s.title || !s.path) continue;
  const c = s.category || "Other";
  if (!byCat.has(c)) byCat.set(c, []);
  byCat.get(c)!.push(s);
}

const q = (s: string) => JSON.stringify(s); // JSON strings are valid YAML
let out = "# GENERATED from sops.yml by _scripts/build-nav.ts. Do not edit.\n";
out += "website:\n  navbar:\n    left:\n      - text: Home\n        href: index.qmd\n";
for (const [cat, items] of [...byCat].sort(([a], [b]) => a.localeCompare(b))) {
  out += `      - text: ${q(cat)}\n        menu:\n`;
  for (const s of items.sort((a, b) => a.title!.localeCompare(b.title!))) {
    out += `          - text: ${q(s.title!)}\n            href: ${q(s.path!)}\n`;
  }
}
out += "    right:\n      - icon: github\n        href: https://github.com/orcaCoreOtago\n";

Deno.writeTextFileSync("_nav.yml", out);
console.log(`build-nav: ${sops.length} SOPs in ${byCat.size} menus`);
