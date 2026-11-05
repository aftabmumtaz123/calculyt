import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
export const metadata: Metadata = { title: { default: "Calculyt — Calculations made clear", template: "%s | Calculyt" }, description: "A modern collection of practical calculators with clear results and visual insights." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteHeader />{children}<footer className="mt-20 border-t border-[#e9e6f0] bg-white"><div className="container-shell flex flex-col gap-3 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} Calculyt. Clear answers, confident decisions.</span><span>Independent calculations · No account required</span></div></footer></body></html>;
}
