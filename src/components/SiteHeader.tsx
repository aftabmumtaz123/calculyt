"use client";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { Calculator, Search, Menu, X, ArrowUpRight } from "lucide-react";
import { calculators } from "@/lib/calculators/definitions";
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false),
    [searchOpen, setSearchOpen] = useState(false),
    [query, setQuery] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null),
    menuRef = useRef<HTMLDivElement>(null);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? calculators
          .filter((c) =>
            `${c.name} ${c.description} ${c.category}`
              .toLowerCase()
              .includes(q),
          )
          .slice(0, 8)
      : calculators.filter((c) => c.featured).slice(0, 6);
  }, [query]);
  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
      if (e.key === "Tab" && searchOpen && dialogRef.current) {
        const nodes = dialogRef.current.querySelectorAll<HTMLElement>(
          "button,input,a[href]",
        );
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
      if (e.key === "Tab" && menuOpen && menuRef.current) {
        const nodes =
          menuRef.current.querySelectorAll<HTMLElement>("a[href],button");
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, searchOpen]);
  useEffect(() => {
    if (menuOpen)
      menuRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
  }, [menuOpen]);
  return (
    <header className="sticky top-0 z-40 border-b border-[#ebe8f1] bg-white/95 backdrop-blur-xl">
      <div className="container-shell flex min-h-[68px] items-center justify-between gap-3 py-2">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#211444] text-white">
            <Calculator size={21} aria-hidden="true" />
          </span>
          <span className="text-xl font-extrabold tracking-tight">
            calculyt<span className="text-violet-600">.</span>
          </span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 text-sm font-medium text-[#6b6a7e] md:flex"
        >
          <Link className="hover:text-violet-600" href="/">
            Explore
          </Link>
          <a className="hover:text-violet-600" href="/#categories">
            Categories
          </a>
          <a className="hover:text-violet-600" href="/#popular">
            Popular tools
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSearchOpen(true);
              setMenuOpen(false);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-[#eae7f0] px-3 py-2 text-sm font-semibold hover:border-violet-300"
          >
            <Search size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Find a tool</span>
          </button>
          <button
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-[#eae7f0] md:hidden"
          >
            {menuOpen ? (
              <X size={19} aria-hidden="true" />
            ) : (
              <Menu size={19} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div
          ref={menuRef}
          className="border-t border-[#eeeaf4] bg-white p-4 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav className="container-shell flex flex-col gap-1">
            <Link
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-3 py-3 font-semibold hover:bg-violet-50"
              href="/"
            >
              Explore
            </Link>
            <a
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-3 py-3 font-semibold hover:bg-violet-50"
              href="/#categories"
            >
              Categories
            </a>
            <a
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-3 py-3 font-semibold hover:bg-violet-50"
              href="/#popular"
            >
              Popular tools
            </a>
            <a
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-3 py-3 font-semibold text-violet-700 hover:bg-violet-50"
              href="/#all-calculators"
            >
              Browse all calculators{" "}
              <ArrowUpRight className="inline" size={15} aria-hidden="true" />
            </a>
          </nav>
        </div>
      )}
      {searchOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto overscroll-contain bg-[#171229]/60 p-4 pt-[max(1rem,8vh)]"
            role="dialog"
            aria-modal="true"
            aria-label="Search calculators"
            ref={dialogRef}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setSearchOpen(false);
            }}
          >
            <div className="flex max-h-[84vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
              <div className="flex items-center gap-3">
                <Search className="text-violet-600" aria-hidden="true" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search calculators by name or topic..."
                  className="min-w-0 flex-1 border-0 py-2 outline-none"
                  aria-label="Search calculators"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="rounded-lg p-2 hover:bg-gray-100"
                >
                  <X aria-hidden="true" />
                </button>
              </div>
              <p className="mb-3 mt-4 text-xs font-semibold uppercase tracking-wider text-[#77758a]">
                {query ? "Search results" : "Popular tools"}
              </p>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                {results.length ? (
                  results.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/calculators/${c.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 hover:bg-violet-50"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold">
                          {c.name}
                        </span>
                        <span className="block truncate text-xs text-muted">
                          {c.category} · {c.description}
                        </span>
                      </span>
                      <ArrowUpRight
                        size={16}
                        className="shrink-0 text-violet-600"
                        aria-hidden="true"
                      />
                    </Link>
                  ))
                ) : (
                  <p className="px-3 py-6 text-sm text-muted">
                    No calculators found. Try another search term.
                  </p>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}
