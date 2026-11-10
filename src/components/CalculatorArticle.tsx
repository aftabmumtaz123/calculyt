import type { CalculatorDefinition } from "@/lib/calculators/types";
import { calculatorArticles } from "@/lib/calculators/articles";
import Link from "next/link";
import { calculators } from "@/lib/calculators/definitions";

export function CalculatorArticle({
  calculator,
}: {
  calculator: CalculatorDefinition;
}) {
  const article = calculatorArticles[calculator.slug] ?? {
    intro: `${calculator.description} This guide explains the purpose of the tool, the inputs it uses and how to interpret the estimate. The result is generated from the assumptions entered by the visitor.`,
    method: `The ${calculator.name} reads the values entered in the form, applies its configured calculation model and presents the result with supporting metrics. Change one input at a time to compare scenarios and understand which assumptions have the largest effect.`,
    formula: `The calculation uses the financial relationship represented by the selected inputs. Review the result notes and the assumptions below; tax rules, lender contracts, market prices and product terms can differ by location and provider.`,
    example: `Start with the sample values already populated in the calculator. Select Calculate result, review the headline figure and supporting metrics, then adjust the rate, amount or term to see how the estimate changes.`,
    tips: [
      "Enter values using the units displayed beside each field.",
      "Compare more than one scenario before making a decision.",
      "Check fees, taxes, eligibility rules and contract terms that are not represented by this simplified model.",
    ],
    limitations:
      "This is an educational estimate based on simplified assumptions. It is not tax, legal, investment, lending or financial advice. Results can differ from actual provider calculations and local regulations.",
    faqs: [
      {
        question: `What does the ${calculator.name} calculate?`,
        answer: calculator.description,
      },
      {
        question: "Are the results guaranteed?",
        answer:
          "No. Results depend on the assumptions and values entered and should be treated as estimates.",
      },
      {
        question: "Can I use this result as professional advice?",
        answer:
          "No. Confirm important decisions with a qualified professional and the relevant provider or official authority.",
      },
    ],
  };
  const related = calculators
    .filter(
      (item) =>
        item.slug !== calculator.slug && item.category === calculator.category,
    )
    .slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: calculator.name,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    description: calculator.description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    mainEntityOfPage: `/calculators/${calculator.slug}`,
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <article className="mt-10 space-y-6">
        <section className="card p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-violet-600">
            Calculator guide
          </p>
          <h2 className="mt-2 text-2xl font-extrabold">
            What is the {calculator.name}?
          </h2>
          <p className="mt-4 leading-8 text-muted">{article.intro}</p>
        </section>
        <section className="card p-6 md:p-8">
          <h2 className="text-xl font-extrabold">
            How does this calculator work?
          </h2>
          <p className="mt-3 leading-8 text-muted">{article.method}</p>
          <h3 className="mt-6 font-bold">Formula and calculation method</h3>
          <p className="mt-2 rounded-xl bg-[#f6f3fb] p-4 font-mono text-sm leading-7 text-[#493078]">
            {article.formula}
          </p>
          <p className="mt-3 text-sm leading-7 text-muted">
            The calculator applies this method to the values entered above.
            Review the assumptions below before relying on an estimate.
          </p>
        </section>
        <section className="card p-6 md:p-8">
          <h2 className="text-xl font-extrabold">Example calculation</h2>
          <p className="mt-3 leading-8 text-muted">{article.example}</p>
        </section>
        <section className="card p-6 md:p-8">
          <h2 className="text-xl font-extrabold">
            How to use the {calculator.name.replace(/ Calculator$/i, "")}
          </h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-7 text-muted">
            <li>
              Enter each requested value using the unit shown beside the field.
            </li>
            <li>
              Check the inputs and select{" "}
              <strong className="text-ink">Calculate result</strong>.
            </li>
            <li>
              Review the headline result, supporting metrics and chart where
              provided.
            </li>
            <li>
              Change one input at a time to compare scenarios, or use Reset to
              start again.
            </li>
          </ol>
        </section>
        <section className="card p-6 md:p-8">
          <h2 className="text-xl font-extrabold">
            Tips for interpreting your result
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-muted">
            {article.tips.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <h3 className="mt-6 font-bold">Assumptions and limitations</h3>
          <p className="mt-2 leading-8 text-muted">{article.limitations}</p>
        </section>
        <section className="card p-6 md:p-8">
          <h2 className="text-xl font-extrabold">Frequently asked questions</h2>
          <div className="mt-4 divide-y divide-[#eeeaf4]">
            {article.faqs.map((f) => (
              <details key={f.question} className="py-4">
                <summary className="cursor-pointer font-semibold">
                  {f.question}
                </summary>
                <p className="mt-3 text-sm leading-7 text-muted">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-extrabold">
              Related {calculator.category} calculators
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/calculators/${item.slug}`}
                  className="card p-4 text-sm font-semibold transition hover:border-violet-300 hover:text-violet-700"
                >
                  {item.name}
                  <span className="mt-2 block text-xs font-normal text-muted">
                    {item.description}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
