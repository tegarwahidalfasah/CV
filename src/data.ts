export const profile = {
  name: "Tegar Wahid Alfasah",
  shortName: "Tegar Wahid",
  lastName: "Alfasah",
  initials: "TWA",
  roles: ["Content Creator", "Desainer", "Fotografer", "Videografer"],
  tagline: "Content creator, desainer & visual storyteller",
  intro:
    "Mengubah ide menjadi konten visual yang menarik — mulai dari desain, fotografi, videografi, hingga manajemen media sosial.",
  about:
    "Nama saya Tegar Wahid Alfasah, mahasiswa tingkat 3 di kampus Universitas Mandiri. Saya memiliki ketertarikan di bidang kreatif sejak duduk di bangku SMP dan terus berjenjang di bidang tersebut sampai sekarang, di bangku perkuliahan.",
  location: "Walahar, Dangdeur, Subang — Jawa Barat",
  locationShort: "Subang, Jawa Barat",
  phone: "0851-7435-3873",
  phoneHref: "tel:+6285174353873",
  // Nomor yang sama dengan `phone`, tapi dalam format internasional tanpa "+" dan
  // tanpa tanda baca (syarat tautan wa.me). Teks pembuka sudah di-encode.
  whatsappHref:
    "https://wa.me/6285174353873?text=Halo%20Tegar%2C%20saya%20tertarik%20untuk%20berkolaborasi%20kreatif.",
  email: "tegarwahidalfasah@gmail.com",
  instagram: "@tgar212",
  instagramHref: "https://instagram.com/tgar212",
};

export type Tool = {
  name: string;
  description: string;
  icon: string;
  tags: string[];
};

export const tools: Tool[] = [
  {
    name: "Adobe Family",
    description:
      "Photoshop, Illustrator, Premiere Pro dan keluarga Adobe untuk kebutuhan desain serta editing profesional.",
    icon: "palette",
    tags: ["Photoshop", "Illustrator", "Premiere"],
  },
  {
    name: "Canva",
    description:
      "Desain grafis cepat untuk feed, story, poster dan berbagai kebutuhan konten media sosial.",
    icon: "shapes",
    tags: ["Feed", "Story", "Poster"],
  },
  {
    name: "CapCut",
    description:
      "Editing video pendek yang dinamis untuk konten TikTok, Reels dan media sosial lainnya.",
    icon: "clapperboard",
    tags: ["Reels", "Short Video", "Color"],
  },
  {
    name: "Microsoft Office",
    description:
      "Word, Excel dan PowerPoint untuk administrasi, laporan dokumentasi serta presentasi organisasi.",
    icon: "file-text",
    tags: ["Word", "Excel", "PowerPoint"],
  },
];

export const disciplines = [
  "Desain",
  "Photography",
  "Videography",
  "Video Editor",
  "Social Media Management",
  "Dokumentasi",
  "Technical Support",
];

export type Education = {
  school: string;
  period: string;
  program: string;
  description: string;
};

export const education: Education[] = [
  {
    school: "Universitas Mandiri",
    period: "2022 — Sekarang",
    program: "Teknik Komputer Jaringan (TKJ)",
    description:
      "Mahasiswa program studi TKJ (Teknik Komputer Jaringan) di Universitas Mandiri, saat ini duduk di tingkat 3.",
  },
  {
    school: "SMK Bina Wisata Lembang",
    period: "2019 — 2022",
    program: "Rekayasa Perangkat Lunak (RPL)",
    description:
      "Alumni angkatan 2019–2022 program studi RPL (Rekayasa Perangkat Lunak) di SMK Bina Wisata Lembang.",
  },
];

export type Experience = {
  company: string;
  period: string;
  role: string;
  description: string;
  tags: string[];
};

export const experience: Experience[] = [
  {
    company: "HG Adventure",
    period: "2022",
    role: "Content Creator",
    description:
      "Content creator media sosial di HG Adventure. Bertanggung jawab atas seluruh proses produksi konten, mulai dari ide hingga publikasi.",
    tags: ["Desain", "Photography", "Videography", "Editor", "Social Media"],
  },
  {
    company: "The Lodge Maribaya Bandung",
    period: "2021",
    role: "Departemen IT — PKL",
    description:
      "Praktek Kerja Lapangan (PKL) di The Lodge Maribaya Bandung selama 3 bulan di departemen IT, dengan fokus pada desain dan dokumentasi.",
    tags: ["Desain", "Dokumentasi"],
  },
  {
    company: "Tim IT SMK Bina Wisata Lembang",
    period: "2020 — 2021",
    role: "Technical Support",
    description:
      "Bagian dari Tim IT SMK Bina Wisata Lembang, menangani kebutuhan teknis, desain dan dokumentasi sekolah.",
    tags: ["Desain", "Dokumentasi", "Technical Support"],
  },
];

export type Organization = {
  name: string;
  period: string;
  role: string;
};

export const organizations: Organization[] = [
  {
    name: "BEM FT UM",
    period: "2023 — Sekarang",
    role: "Departemen Seni Budaya dan Olahraga",
  },
  {
    name: "HIMA TKJ",
    period: "2022 — 2023",
    role: "Ketua HIMA",
  },
  {
    name: "BW Jurnal",
    period: "2019 — 2022",
    role: "Sekretaris / Wakil Ketua",
  },
  {
    name: "OSIS SMK Bina Wisata Lembang",
    period: "2020 — 2021",
    role: "Riset Teknologi",
  },
  {
    name: "OSIS SMP Negeri 2 Lembang",
    period: "2017 — 2018",
    role: "Bendahara 3",
  },
];

export type Work = {
  title: string;
  client: string;
  category: string;
  image: string;
  /**
   * Tautan ke karya aslinya (postingan Instagram/TikTok).
   * Embed (mode `worksEmbedMode`) hanya berlaku untuk URL postingan
   * (`/p/…` atau `/reel/…`); tautan profil tampil sebagai gambar statis.
   * Jika tautan berisi "tiktok", label kartu otomatis berubah jadi
   * "Lihat di TikTok" (lihat Works.tsx).
   */
  href: string;
};

/**
 * Mode tampilan section Karya:
 * - `true`  → kartu merender postingan Instagram aslinya (embed via iframe).
 * - `false` → kartu menampilkan gambar statis (output `npm run assets`).
 *
 * Embed hanya berlaku untuk `href` berupa URL postingan Instagram
 * (`/p/…` atau `/reel/…`) — tautan profil tetap tampil sebagai gambar statis.
 */
export const worksEmbedMode = true;

export const works: Work[] = [
  {
    title: "Adventure Social Media Content",
    client: "HG Adventure",
    category: "Photography · Videography",
    image:
      "https://images.pexels.com/photos/12757209/pexels-photo-12757209.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    href: "https://www.instagram.com/p/CndXH6PSHgW/",
  },
  {
    title: "Golden Hour Frames",
    client: "Color & Editing",
    category: "Videography · Editor",
    image:
      "https://images.pexels.com/photos/36920917/pexels-photo-36920917.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    href: "https://www.instagram.com/p/CnAOziCSY7O/",
  },
  {
    title: "Potret & Visual Storytelling",
    client: "Photography",
    category: "Foto Dokumentasi",
    image:
      "https://images.pexels.com/photos/31681666/pexels-photo-31681666.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800",
    href: "https://www.instagram.com/p/Cduwhlhpjrv/",
  },
  {
    title: "Dokumentasi Wisata Alam",
    client: "The Lodge Maribaya",
    category: "Dokumentasi",
    image:
      "https://images.pexels.com/photos/29546725/pexels-photo-29546725.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    href: "https://www.instagram.com/p/CZVY1JgPkzN/",
  },
  {
    title: "Behind the Scenes Produksi",
    client: "Videography",
    category: "Video Production",
    image:
      "https://images.pexels.com/photos/34037222/pexels-photo-34037222.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    href: "https://www.instagram.com/p/CU7Y4tRlz3r/",
  },
  {
    title: "Desain Konten & Visual Identity",
    client: "Graphic Design",
    category: "Desain · Sosial Media",
    image:
      "https://images.pexels.com/photos/3850210/pexels-photo-3850210.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    href: "https://instagram.com/tgar212",
  },
];

export const stats = [
  { value: "03", label: "Pengalaman Kerja" },
  { value: "05", label: "Organisasi" },
  { value: "02", label: "Institusi Pendidikan" },
  { value: "07", label: "Bidang Kreatif" },
];
