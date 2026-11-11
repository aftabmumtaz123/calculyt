import Link from "next/link";
import { Calculator, Search } from "lucide-react";
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#ebe8f1] bg-white/90 backdrop-blur-xl">
      <div className="container-shell flex h-[76px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#211444] text-white">
            <Calculator size={21} />
          </span>
          <span className="font-[Manrope] text-xl font-extrabold tracking-tight">
            calculyt<span className="text-violet-600">.</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-[#77758a] md:flex">
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
        <Link
          href="/#all-calculators"
          className="flex items-center gap-2 rounded-full border border-[#eae7f0] px-4 py-2 text-sm font-semibold hover:border-violet-300"
        >
          <Search size={16} /> Find a tool
        </Link>
      </div>
    </header>
  );
}
