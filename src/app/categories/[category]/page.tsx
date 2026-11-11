import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import catalog from "@/lib/calculators/catalog.json";
import { calculators, categories } from "@/lib/calculators/definitions";
import {
  getCategoryBySlug,
  categorySlug,
} from "@/lib/calculators/catalog-utils";
export function generateStaticParams() {
  return categories.map((c) => ({ category: categorySlug(c.name) }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const c = getCategoryBySlug(slug);
  if (!c) return {};
  return {
    title: `${c.name} Calculators`,
    description: `Browse the Calculyt ${c.name.toLowerCase()} calculator directory. Explore available tools, formulas and practical calculation guides.`,
    alternates: { canonical: `/categories/${slug}` },
  };
}
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();
  const entries = catalog.filter((item) => item.category === category.name);
  return (
    <main className="container-shell py-10 md:py-14">
      <Link href="/" className="text-sm font-semibold text-violet-700">
        ← All calculators
      </Link>
      <header className="mt-6 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-violet-600">
          Calculator directory
        </p>
        <h1 className="mt-2 text-4xl font-extrabold">
          {category.name} Calculators
        </h1>
        <p className="mt-4 text-base leading-8 text-muted">
          {category.description} Browse {entries.length} calculator topics in
          this category. Tools marked Available have working interactive
          calculations; Planned entries are included in the directory and will
          be released as their formulas and tests are completed.
        </p>
      </header>
      <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((item) => {
          const tool = calculators.find((c) => c.name === item.name);
          return (
            <div
              key={item.slug}
              className="card flex min-h-28 flex-col justify-between p-4"
            >
              <div>
                <h2 className="font-bold">{item.name}</h2>
                <p className="mt-1 text-xs text-muted">
                  {tool?.description ??
                    `A ${category.name.toLowerCase()} calculator for ${item.name.replace(/ Calculator$/i, "").toLowerCase()} calculations.`}
                </p>
              </div>
              {tool ? (
                <Link
                  className="mt-4 text-sm font-bold text-violet-700 hover:underline"
                  href={`/calculators/${tool.slug}`}
                >
                  Open calculator →
                </Link>
              ) : (
                <span className="mt-4 inline-flex w-fit rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                  Planned
                </span>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
