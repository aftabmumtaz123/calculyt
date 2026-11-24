import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://calculyt.vercel.app"
).replace(/\/$/, "");
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Calculyt — Calculations made clear",
    template: "%s | Calculyt",
  },
  description:
    "A modern collection of practical calculators with clear results and visual insights.",
  alternates: { canonical: "/" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <footer className="mt-20 border-t border-[#e9e6f0] bg-white">
          <div className="container-shell flex flex-col gap-3 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
            <span>
              © {new Date().getFullYear()} Calculyt. Clear answers, confident
              decisions.
            </span>
            <span className="flex flex-wrap gap-4">
              <Link href="/sitemap.html" className="hover:text-violet-700">
                HTML sitemap
              </Link>
              <Link href="/sitemap.xml" className="hover:text-violet-700">
                XML sitemap
              </Link>
              <span>Independent calculations · No account required</span>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
