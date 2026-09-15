# CV — Portofolio Tegar Wahid Alfasah

Website portofolio pribadi (satu halaman) untuk **Tegar Wahid Alfasah** — Content Creator, Desainer, Fotografer & Videografer asal Subang, Jawa Barat.

Dibangun dengan React 19 + TypeScript + Vite + Tailwind CSS v4, animasi `framer-motion`, ikon `lucide-react`, dan di-bundle menjadi **satu file HTML** lewat `vite-plugin-singlefile`.

## Menjalankan

```bash
npm install      # pasang dependensi
npm run dev      # server pengembangan (http://localhost:5173)
npm run typecheck# cek tipe TypeScript
npm run build    # build produksi -> dist/ (siap upload)
npm run assets   # regenerasi gambar: potret WebP, favicon, kartu preview OG
npm run preview  # pratinjau hasil build
```

## Struktur

```
index.html                     # shell HTML: meta SEO, favicon, Open Graph, JSON-LD
vite.config.ts                 # plugin React + Tailwind + singlefile, alias "@" -> src
src/
  main.tsx                     # entry point React
  App.tsx                      # urutan section + <MotionConfig reducedMotion="user">
  index.css                    # tema Tailwind (@theme), animasi, aturan reduced-motion
  data.ts                      # SEMUA konten: profil, tools, pendidikan, pengalaman, organisasi, karya
  assets/portrait.png          # ⚠ sumber potret (jangan dihapus/diubah nama)
  assets/portrait.webp         # hasil `npm run assets` — yang dipakai Hero.tsx
  utils/cn.ts                  # helper clsx + tailwind-merge
  components/
    Navbar.tsx  Hero.tsx  About.tsx  Skills.tsx  Works.tsx
    Education.tsx  Experience.tsx  Organizations.tsx  Contact.tsx  Footer.tsx
    Reveal.tsx                 # wrapper animasi scroll (Reveal & SectionLabel)
    Icons.tsx                  # ikon SVG kustom (Instagram, TikTok)
tools/
  generate-assets.mjs          # generator aset (butuh ImageMagick)
  fonts/                       # font brand untuk generator + lisensi OFL
public/                        # hasil generator: favicon.ico, favicon-32x32.png,
                               # apple-touch-icon.png, og-image.jpg
```

## Mengubah konten

Hampir semua teks, tautan dan daftar berada di **`src/data.ts`** — cukup ubah satu file itu untuk memperbarui nama, kontak, tools, riwayat pendidikan/pengalaman, organisasi, foto portofolio, dan angka statistik.

Teks pada kartu preview (og-image) ikut dibaca dari file yang sama, jadi cukup ganti sekali.

## Aset gambar (`npm run assets`)

Skrip ini memerlukan **ImageMagick** (`convert` atau `magick`) di PATH, dan menghasilkan:

| Berkas | Keterangan |
| --- | --- |
| `src/assets/portrait.webp` | potret hero dikompresi (~90% lebih kecil dari PNG asli) |
| `public/favicon.ico` + `favicon-32x32.png` | ikon tab browser |
| `public/apple-touch-icon.png` | ikon saat disimpan ke Home Screen iOS |
| `public/og-image.jpg` | kartu preview 1200×630 saat link dibagikan |

Jalankan ulang setiap kali foto potret atau nama/peran di `data.ts` berubah.

## Domain & SEO

Domain situs ini sudah diisi: **https://portofolio-tegarwahidalfasah.netlify.app** (ada di `canonical`, `og:url`, `og:image`, `twitter:image`, dan JSON-LD di `index.html`).

Jika nanti pindah ke domain sendiri (mis. `tegarwahidalfasah.com`), ganti **semua** URL tersebut. `og:image` wajib berupa URL absolut — crawler WhatsApp/Instagram/LinkedIn tidak bisa membaca path relatif, dan bila URL-nya salah maka kartu preview tidak akan muncul sama sekali.

Urutan prioritas bila kustom domain dipakai: daftarkan domain di Netlify → aktifkan HTTPS → baru perbarui `index.html`.

## Tautan karya

Setiap entri di `works` (`src/data.ts`) punya properti `href` yang menunjuk ke postingan karya asli. Saat ini semuanya masih menunjuk ke profil Instagram — ganti dengan URL postingan masing-masing karya. Jika URL berisi `tiktok`, label kartu otomatis berubah menjadi "Lihat di TikTok".

## Catatan tema

Palet warna, font, dan animasi kustom didefinisikan di blok `@theme` pada `src/index.css`:

- `navy-*` — permukaan gelap
- `cream-*` — permukaan terang
- `brand-*` — aksen biru (utama)
- `accent-*` — aksen ungu (sekunder)
- Font: `Space Grotesk` (display), `Inter` (body), `Instrument Serif` (aksen italic), `JetBrains Mono` (mono)

Teks abu-abu di atas permukaan gelap memakai minimal `text-cream-100/60` agar tetap lolos kontras WCAG AA (4.5:1).

## Deployment

Hasil `npm run build` berisi:

```
dist/index.html            # seluruh CSS & JS sudah inline
dist/favicon.ico  favicon-32x32.png  apple-touch-icon.png  og-image.jpg
```

Kelima berkas itu harus ikut terunggah di **root** domain (bukan hanya `index.html`), karena favicon dan `og-image.jpg` direferensikan lewat path absolut. Cocok untuk GitHub Pages, Vercel, Netlify, atau hosting statis apa pun.
