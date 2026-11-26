import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  calculators,
  getCalculator,
  calculatorAliases,
} from "@/lib/calculators/definitions";
import { CalculatorClient } from "@/components/CalculatorClient";
import { CalculatorArticle } from "@/components/CalculatorArticle";
import { calculatorSeo } from "@/lib/seo";
export function generateStaticParams() {
  return [
    ...calculators.map((c) => ({ slug: c.slug })),
    ...Object.keys(calculatorAliases).map((slug) => ({ slug })),
  ];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCalculator(slug);
  if (!c) return {};
  const seo = calculatorSeo(c.name, c.description);
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: `/calculators/${c.slug}` },
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "article",
    },
  };
}
export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) notFound();
  return (
    <main id="main" className="container-shell pb-12">
      <CalculatorClient slug={slug} />
      <CalculatorArticle calculator={calculator} />
    </main>
  );
}
