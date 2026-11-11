import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { calculators, getCalculator } from "@/lib/calculators/definitions";
import { CalculatorClient } from "@/components/CalculatorClient";
import { CalculatorArticle } from "@/components/CalculatorArticle";
export function generateStaticParams() {
  return calculators.map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCalculator(slug);
  if (!c) return {};
  return {
    title: `${c.name}: Formula, Examples & Guide`,
    description: `${c.description} Learn the formula, how to use the calculator, worked examples, assumptions and answers to common questions.`,
    alternates: { canonical: `/calculators/${slug}` },
    openGraph: {
      title: `${c.name} | Calculyt`,
      description: c.description,
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
    <main className="container-shell pb-12">
      <CalculatorClient slug={slug} />
      <CalculatorArticle calculator={calculator} />
    </main>
  );
}
