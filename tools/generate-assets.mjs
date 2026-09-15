#!/usr/bin/env node
/**
 * Generator aset statis untuk web CV.
 *
 * Menghasilkan:
 *   src/assets/portrait.webp      → potret hero terkompresi (dipakai Hero.tsx)
 *   public/favicon.ico            → ikon tab (16/32/48 px)
 *   public/favicon-32x32.png      → ikon tab PNG
 *   public/apple-touch-icon.png   → ikon iOS (180 px, full-bleed)
 *   public/og-image.jpg           → kartu preview 1200×630 untuk WhatsApp/IG/LinkedIn
 *
 * Teks pada kartu OG dibaca otomatis dari `src/data.ts`, jadi tidak perlu
 * diedit dua kali ketika nama/peran/kontak berubah.
 *
 * Jalankan:  npm run assets
 * Butuh:     ImageMagick (`convert` atau `magick`) tersedia di PATH.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FONTS = path.join(ROOT, "tools/fonts");
const SRC_ASSETS = path.join(ROOT, "src/assets");
const PUBLIC = path.join(ROOT, "public");
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "cv-assets-"));

/* ------------------------------------------------------- warna (src/index.css)
 * Samakan dengan blok @theme */
const NAVY_950 = "#05070c";
const BRAND_500 = "#2563eb";
const BRAND_400 = "#3b82f6";
const ACCENT_500 = "#a855f7";
const CREAM_50 = "#ffffff";
const CREAM_300 = "#cbd5e6";
const CREAM_60 = "#9aa6bb";

const FONT_DISPLAY = path.join(FONTS, "SpaceGrotesk-Bold.ttf");
const FONT_BODY = path.join(FONTS, "Inter-Regular.ttf");

/* ------------------------------------------------------------------- helpers */

const MAGICK = (() => {
  for (const bin of ["magick", "convert"]) {
    try {
      execFileSync(bin, ["-version"], { stdio: "ignore" });
      return bin;
    } catch {
      /* coba binari berikutnya */
    }
  }
  throw new Error(
    "ImageMagick tidak ditemukan. Pasang dulu (mis. `sudo apt install imagemagick`) lalu jalankan ulang."
  );
})();

/** Jalankan ImageMagick dengan argumen array (tanpa lewat shell, jadi aman dari quoting). */
const im = (...args) => execFileSync(MAGICK, args, { stdio: ["ignore", "pipe", "pipe"] }).toString();

const kb = (bytes) => `${Math.round(bytes / 1024)} kB`;
const px = (file) => im(file, "-format", "%wx%h", "info:").trim();
const size = (file) => fs.statSync(file).size;

/** Offset untuk `-repage`, aman untuk nilai negatif (mis. "+445-282"). */
const at = (x, y) => `${x >= 0 ? "+" : ""}${x}${y >= 0 ? "+" : ""}${y}`;

/** Lebar teks dalam piksel tanpa perlu render penuh. */
const measure = (text, font, pointsize) =>
  Number(im("-font", font, "-pointsize", String(pointsize), `label:${text}`, "-format", "%w", "info:").trim());

/**
 * Masker sudut membulat: hasil = gambar utuh dengan alpha diambil dari
 * roundrectangle putih (Dst_In). Dipakai `-compose Dst_In` karena lebih
 * deterministik daripada CopyOpacity + `-alpha extract`.
 */
function roundedMask(file, w, h, radius, prefix) {
  const mask = path.join(TMP, `${prefix}-mask.png`);
  im("-size", `${w}x${h}`, "xc:none", "-fill", "white",
     "-draw", `roundrectangle 0,0,${w - 1},${h - 1},${radius},${radius}`, mask);

  const out = path.join(TMP, `${prefix}-rounded.png`);
  im(file, mask, "-alpha", "set", "-compose", "Dst_In", "-composite", out);
  return out;
}

/** Baca teks dari src/data.ts agar kartu OG selalu sinkron dengan isi web. */
function readProfile() {
  const src = fs.readFileSync(path.join(ROOT, "src/data.ts"), "utf8");
  const block = src.match(/export const profile = \{([\s\S]*?)\n\};/);
  if (!block) throw new Error("Tidak menemukan `export const profile = { ... }` di src/data.ts");

  const body = block[1];
  const str = (key) => {
    const m = body.match(new RegExp(`\\b${key}:\\s*"([^"]*)"`));
    if (!m) throw new Error(`Kunci "${key}" tidak ditemukan di profile (src/data.ts)`);
    return m[1];
  };
  const rolesRaw = body.match(/roles:\s*\[([^\]]*)\]/);
  const roles = rolesRaw
    ? rolesRaw[1].split(",").map((s) => s.trim().replace(/^"|"$/g, "")).filter(Boolean)
    : [];

  return {
    name: str("name"),
    initials: str("initials"),
    roles,
    locationShort: str("locationShort"),
    email: str("email"),
    instagram: str("instagram"),
  };
}

/* ------------------------------------------------- 1. potret hero → WebP ---- */

function buildPortrait() {
  const input = path.join(SRC_ASSETS, "portrait.png");
  if (!fs.existsSync(input)) throw new Error(`Sumber potret tidak ada: ${path.relative(ROOT, input)}`);

  const output = path.join(SRC_ASSETS, "portrait.webp");
  im(input, "-strip", "-define", "webp:method=6", "-quality", "90", output);

  const saved = Math.round((1 - size(output) / size(input)) * 100);
  console.log(`✓ portrait.webp     ${px(output)}   ${kb(size(input))} → ${kb(size(output))}  (-${saved}%)`);
}

/* ---------------------------------------------- 2. ikon situs (favicon) ----- */

function buildIcons(profile) {
  const S = 512;
  const letter = profile.initials.slice(0, 1); // satu huruf agar tetap terbaca di 16 px

  // Gradien diagonal brand-500 → accent-500 (senada .text-gradient di index.css).
  // Dibuat dengan `-sparse-color barycentric` agar tidak ada sudut yang bocor
  // (rotasi gambar penuh meninggalkan sudut berwarna latar).
  const gradient = path.join(TMP, "grad.png");
  im("-size", `${S}x${S}`, "xc:white",
     "-sparse-color", "barycentric", `0,0 ${BRAND_500} ${S - 1},${S - 1} ${ACCENT_500}`,
     gradient);

  const rounded = roundedMask(gradient, S, S, 112, "icon");

  // Huruf putih di tengah, digeser sedikit ke atas agar terlihat optis center
  const stamp = (src, dst, pointsize) =>
    im(src, "-font", FONT_DISPLAY, "-pointsize", String(pointsize), "-fill", CREAM_50,
       "-gravity", "center", "-annotate", `+0+${Math.round(pointsize * 0.04)}`, letter, dst);

  const icon = path.join(TMP, "icon.png");
  stamp(rounded, icon, 300);

  // apple-touch-icon: tanpa transparansi (iOS memberi sudut sendiri)
  const square180 = path.join(TMP, "square-180.png");
  im(gradient, "-resize", "180x180", square180);
  stamp(square180, path.join(PUBLIC, "apple-touch-icon.png"), 104);

  im(icon, "-define", "icon:auto-resize=48,32,16", path.join(PUBLIC, "favicon.ico"));
  im(icon, "-resize", "32x32", path.join(PUBLIC, "favicon-32x32.png"));

  console.log(`✓ favicon.ico + favicon-32x32.png + apple-touch-icon.png   (huruf "${letter}")`);
}

/* --------------------------------------- 3. kartu preview OG 1200×630 ------- */

function buildOgImage(profile) {
  const W = 1200;
  const H = 630;
  const PAD = 80;
  const portrait = path.join(SRC_ASSETS, "portrait.webp");

  const [cardW, cardH] = px(portrait).split("x").map(Number);
  const cardX = W - cardW - PAD;
  const cardY = Math.round((H - cardH) / 2);

  /* Semua lapisan ditempel dengan `-draw "image Over x,y"`. Cara ini memakai
     koordinat absolut, jadi tidak terpengaruh page-offset seperti halnya
     `-repage` + `-composite` berantai (offset negatif pun aman). */

  // Glow lembut: lingkaran ber-blur dengan alpha diturunkan (senada blur-[140px] di Hero)
  const glow = (name, color, radius, alpha, blur) => {
    const file = path.join(TMP, `${name}.png`);
    im("-size", `${radius * 2}x${radius * 2}`, "xc:none",
       "-fill", color, "-draw", `circle ${radius},${radius} ${radius},${Math.round(radius * 0.13)}`,
       "-blur", `0x${blur}`,
       "-channel", "A", "-evaluate", "multiply", String(alpha), "+channel",
       file);
    return file;
  };
  const glowBlue = glow("glow-blue", BRAND_500, 450, 0.20, 110);
  const glowPurple = glow("glow-purple", ACCENT_500, 380, 0.26, 120);

  const portraitCard = roundedMask(portrait, cardW, cardH, 28, "portrait");

  // ---- teks
  const textW = cardX - PAD - 48;
  const words = profile.name.split(" ");
  const line1 = words.slice(0, -1).join(" ").toUpperCase();
  const line2 = words.slice(-1)[0].toUpperCase();

  const fit = (text, font, start, min) => {
    let s = start;
    while (s > min && measure(text, font, s) > textW) s -= 2;
    return s;
  };
  const headline = Math.min(fit(line1, FONT_DISPLAY, 96, 40), fit(line2, FONT_DISPLAY, 96, 40));
  const subline = profile.roles.join("  ·  ");
  const subSize = fit(subline, FONT_BODY, 30, 18);
  const meta = `${profile.locationShort}   ·   ${profile.email}   ·   ${profile.instagram}`;
  const metaSize = fit(meta, FONT_BODY, 22, 13);

  const eyebrowY = 150;
  const l1 = eyebrowY + 96;
  const l2 = l1 + Math.round(headline * 0.98);
  const ruleY = l2 + 62;
  const subY = ruleY + 52;
  const metaY = H - PAD - 10;

  // tanda kutip tunggal / backslash akan merusak sintaks -draw
  const safe = (s) => s.replace(/['\\]/g, "");

  const og = path.join(PUBLIC, "og-image.jpg");
  im(
    "-size", `${W}x${H}`, `xc:${NAVY_950}`,

    "-draw", `image Over ${cardX - 260},${cardY - 320} 0,0 '${glowBlue}'`,
    "-draw", `image Over -380,300 0,0 '${glowPurple}'`,
    "-draw", `image Over ${cardX},${cardY} 0,0 '${portraitCard}'`,

    "-fill", BRAND_400,
    "-draw", `rectangle ${PAD},${eyebrowY - 44} ${PAD + 56},${eyebrowY - 40}`,
    "-font", FONT_BODY, "-pointsize", "24",
    "-draw", `text ${PAD},${eyebrowY} '${safe("// PORTOFOLIO")}'`,

    "-font", FONT_DISPLAY, "-pointsize", String(headline), "-fill", CREAM_50,
    "-draw", `text ${PAD},${l1} '${safe(line1)}'`,

    // kata terakhir: outline biru (senada .text-outline-blue)
    "-fill", "none", "-stroke", BRAND_500, "-strokewidth", "2.5",
    "-draw", `text ${PAD},${l2} '${safe(line2)}'`,
    "-stroke", "none",

    "-fill", "#ffffff30",
    "-draw", `rectangle ${PAD},${ruleY} ${cardX - 60},${ruleY + 1}`,

    "-font", FONT_BODY, "-pointsize", String(subSize), "-fill", CREAM_300,
    "-draw", `text ${PAD},${subY} '${safe(subline)}'`,

    "-pointsize", String(metaSize), "-fill", CREAM_60,
    "-draw", `text ${PAD},${metaY} '${safe(meta)}'`,

    "-strip", "-colorspace", "sRGB", "-interlace", "Plane", "-quality", "82", og
  );

  console.log(`✓ og-image.jpg      ${px(og)}   ${kb(size(og))}`);
}

/* ---------------------------------------------------------------------- main */

fs.mkdirSync(PUBLIC, { recursive: true });
const profile = readProfile();
console.log(`Sumber data: ${profile.name}\n`);

buildPortrait();
buildIcons(profile);
buildOgImage(profile);

fs.rmSync(TMP, { recursive: true, force: true });
console.log("\nSelesai. Semua aset sudah diperbarui.");
