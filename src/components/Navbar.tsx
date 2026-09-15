import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { profile } from "../data";

const links = [
  { label: "Tentang", href: "#tentang" },
  { label: "Keahlian", href: "#keahlian" },
  { label: "Karya", href: "#karya" },
  { label: "Pendidikan", href: "#pendidikan" },
  { label: "Pengalaman", href: "#pengalaman" },
  { label: "Organisasi", href: "#organisasi" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Menu mobile: kunci fokus di dalam panel, tutup dengan Escape, dan
     kembalikan fokus ke tombol pembuka saat ditutup. */
  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("button, a[href]")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      // Siklus fokus: Tab dari elemen terakhir kembali ke elemen pertama, dst.
      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-navy-900/10 bg-navy-950/90 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 font-display text-sm font-bold text-white transition-transform duration-300 group-hover:-rotate-6">
              {profile.initials}
            </span>
            <span className="hidden font-display text-sm font-semibold tracking-wide text-cream-50 sm:block">
              Tegar Wahid<span className="text-brand-400">.</span>
            </span>
          </a>

          <ul className="hidden items-center gap-7 lg:flex">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-display text-[13px] font-medium text-cream-100/70 transition-colors hover:text-brand-400"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="#kontak"
              className="group hidden items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 font-display text-[13px] font-semibold text-white transition-all hover:bg-brand-600 sm:flex"
            >
              Hubungi Saya
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Buka menu navigasi"
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls="menu-mobile"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-cream-100/20 text-cream-50 lg:hidden"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu navigasi"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex flex-col bg-navy-950 px-6 py-6 lg:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 font-display text-sm font-bold text-white">
                {profile.initials}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup menu navigasi"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-cream-100/20 text-cream-50"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <ul className="mt-14 flex flex-col gap-2">
              {links.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i + 0.1, duration: 0.4 }}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline gap-4 border-b border-cream-100/10 py-4"
                  >
                    <span className="font-mono text-xs text-brand-400">
                      0{i + 1}
                    </span>
                    <span className="font-display text-3xl font-semibold text-cream-50 transition-colors group-hover:text-brand-400">
                      {link.label}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>

            <div className="mt-auto space-y-3 pb-4">
              <a
                href={`mailto:${profile.email}`}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-5 py-3.5 font-display text-sm font-semibold text-white"
              >
                {profile.email}
              </a>
              <p className="text-center text-xs text-cream-100/60">
                {profile.locationShort}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
