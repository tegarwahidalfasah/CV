import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionLabel } from "./Reveal";
import { works, worksEmbedMode } from "../data";

// Bento arrangement: wide, tall(rows 1-2), then four tiles, last wide
const layout = [
  "lg:col-span-2",
  "lg:row-span-2",
  "",
  "",
  "",
  "lg:col-span-2",
];
const order = [0, 2, 3, 4, 1, 5];
const heights = ["h-64", "h-96", "h-64", "h-64", "h-64", "h-64"];

/** Label + ikon menyesuaikan platform pada tautan karya (Instagram/TikTok). */
function platformOf(href: string) {
  return href.includes("tiktok")
    ? { label: "Lihat di TikTok", short: "TikTok" }
    : { label: "Lihat di Instagram", short: "Instagram" };
}

/**
 * Ubah URL postingan Instagram (`…/p/CODE/` atau `…/reel/CODE/`) menjadi URL
 * embed-nya yang bisa dirender langsung dalam `<iframe>` (tanpa API/widget).
 * Mengembalikan `null` untuk tautan yang bukan postingan (mis. profil).
 */
function instagramEmbedUrl(href: string): string | null {
  const m = href.match(/instagram\.com\/(p|reel)\/([A-Za-z0-9_-]+)/i);
  return m ? `https://www.instagram.com/${m[1].toLowerCase()}/${m[2]}/embed/` : null;
}

export function Works() {
  // Mode embed memakai grid seragam yang lebih tinggi agar iframe postingan
  // muat; bento tetap dipakai untuk mode gambar statis.
  const embedActive = worksEmbedMode;
  const grid = embedActive
    ? "mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    : "mt-14 grid grid-cols-1 gap-5 lg:h-[660px] lg:grid-cols-3 lg:grid-rows-3";

  return (
    <section id="karya" className="relative bg-cream-100 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionLabel index="// 03" title="Portofolio" />
        </Reveal>

        <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal delay={0.05}>
            <h2 className="max-w-xl font-display text-4xl font-bold leading-tight tracking-tight text-navy-900 sm:text-5xl">
              Cuplikan{" "}
              <span className="font-body font-normal italic text-brand-600">
                bidang karya
              </span>{" "}
              saya
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="max-w-md text-navy-600">
              Gambaran visual dari disiplin yang saya kerjakan — desain,
              fotografi, videografi, hingga pengelolaan konten media sosial.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className={grid}>
            {order.map((workIndex, layoutIndex) => {
              const work = works[workIndex];
              const platform = platformOf(work.href);
              const embedUrl = embedActive ? instagramEmbedUrl(work.href) : null;
              return (
                <article
                  key={work.title}
                  className={`card-hover group relative overflow-hidden rounded-3xl border border-navy-900/10 bg-navy-900 shadow-sm hover:shadow-xl focus-within:shadow-xl ${embedActive ? "h-[440px] sm:h-[480px]" : `${layout[layoutIndex]} ${heights[layoutIndex]} lg:h-auto`}`}
                >
                  {/* Seluruh kartu bisa diklik: tautan direntangkan menutupi kartu,
                      sehingga tetap satu tautan yang rapi untuk keyboard & pembaca layar. */}
                  <a
                    href={work.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${work.title} — ${work.client} (buka ${platform.short} di tab baru)`}
                    className="absolute inset-0 z-30 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
                  />

                  <img
                    src={work.image}
                    alt={work.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                  />

                  {embedUrl && (
                    /* Postingan asli (embed iframe). Gambar di belakangnya
                       menjadi cadangan bila embed gagal memuat. pointer-events
                       dimatikan supaya anchor di atas tetap satu-satunya
                       tautan interaktif kartu. */
                    <iframe
                      src={embedUrl}
                      title={`${work.title} — postingan Instagram`}
                      loading="lazy"
                      scrolling="no"
                      aria-hidden="true"
                      referrerPolicy="no-referrer"
                      className="pointer-events-none absolute inset-0 z-[5] h-full w-full border-0"
                    />
                  )}

                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-95" />

                  <div className="absolute right-4 top-4 z-20 flex -translate-y-2 items-center gap-1.5 rounded-full bg-accent-500 px-3.5 py-2 font-display text-xs font-semibold text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    {platform.short}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 z-20 p-6">
                    <span className="inline-block rounded-full bg-brand-500 px-3 py-1 font-body text-[10px] font-medium uppercase tracking-wider text-white">
                      {work.category}
                    </span>
                    <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-cream-50">
                      {work.title}
                    </h3>
                    <p className="mt-1 text-sm text-cream-100/70">
                      {work.client}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
