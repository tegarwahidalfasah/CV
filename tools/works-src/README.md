# Sumber gambar section Karya

Taruh foto/screenshot karya aslinya di folder ini, lalu jalankan:

```bash
npm run assets
```

Setiap berkas `jpg` / `jpeg` / `png` / `webp` di sini dikompres otomatis
menjadi **`src/assets/works/<nama-berkas>.webp`** (maks. 1400 px, kualitas 82).

## Penamaan

Ikuti urutan kartu pada `works` di `src/data.ts` agar mudah dicocokkan:

| Berkas | Kartu |
| --- | --- |
| `01-adventure.jpg` | 1 — Adventure Social Media Content |
| `02-golden-hour.jpg` | 2 — Golden Hour Frames |
| `03-potret.jpg` | 3 — Potret & Visual Storytelling |
| `04-maribaya.jpg` | 4 — Dokumentasi Wisata Alam |
| `05-bts.jpg` | 5 — Behind the Scenes Produksi |
| `06-design.jpg` | 6 — Desain Konten & Visual Identity |

Ekstensi bebas (jpg/png/webp), nama boleh berbeda — yang penting berurutan.

Setelah `npm run assets`, arahkan properti `image` tiap karya di
`src/data.ts` ke berkas hasil generate-nya, contoh:

```ts
import work01 from "../assets/works/01-adventure.webp";
// …
{ title: "Adventure Social Media Content", image: work01, /* … */ }
```

Folder kosong tidak masalah — `npm run assets` tetap menghasilkan potret,
favicon, dan OG image seperti biasa.
