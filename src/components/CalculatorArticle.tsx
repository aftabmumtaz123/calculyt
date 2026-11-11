import type { CalculatorDefinition } from "@/lib/calculators/types";
import { calculatorArticles } from "@/lib/calculators/articles";
import Link from "next/link";
import { calculators } from "@/lib/calculators/definitions";

const formulaBySlug:Record<string,string>={
  "body-fat":"Men: %fat = 86.010 × log10(waist − neck) − 70.041 × log10(height) + 36.76. Women: %fat = 163.205 × log10(waist + hip − neck) − 97.684 × log10(height) − 78.387 (measurements in inches).",
  "macro":"Protein grams = calorie target × protein % ÷ 100 ÷ 4. Carbohydrate grams use the same 4 kcal/g factor; fat uses 9 kcal/g.",
  "pregnancy":"Estimated gestational age = elapsed days since LMP, adjusted for cycle length. Estimated due date ≈ LMP + 280 days.",
  "pregnancy-weight-gain":"Entered gain is compared with broad pregnancy weight-gain reference ranges. This page prorates the total range by week only for context; real gain is not linear.",
  "pregnancy-conception":"Estimated conception date ≈ estimated due date − 266 days.",
  "due-date":"Estimated due date ≈ LMP + 280 days + (cycle length − 28 days).",
  "pace":"Pace = elapsed time ÷ distance. Speed = distance ÷ elapsed time.",
  "army-body-fat":"This tool transparently uses a Navy-style circumference equation as an educational comparison, not an official Army assessment formula.",
  "carbohydrate":"Carbohydrate grams = daily calories × carbohydrate percentage ÷ 100 ÷ 4.",
  "lean-body-mass":"Lean body mass = body weight × (1 − estimated body-fat percentage ÷ 100).",
  "healthy-weight":"Adult BMI reference weight = BMI × height², using BMI values 18.5 and 24.9 for the lower and upper estimates.",
  "calories-burned":"Estimated kcal = MET × 3.5 × weight in kilograms ÷ 200 × duration in minutes.",
  "one-rep-max":"Epley estimate: one-rep maximum ≈ lifted weight × (1 + repetitions ÷ 30).",
  "target-heart-rate":"Heart-rate reserve = estimated maximum heart rate − resting heart rate. Target zone = resting rate + reserve × zone percentage.",
  "protein":"Daily protein estimate = body weight in kilograms × selected grams-per-kilogram factor.",
  "fat-intake":"Fat grams = daily calories × fat percentage ÷ 100 ÷ 9.",
  "tdee":"Estimated TDEE = Mifflin–St Jeor resting energy estimate × selected activity multiplier.",
  "ovulation":"Estimated ovulation ≈ cycle start + cycle length − 14 days.",
  "conception":"Estimated ovulation ≈ cycle start + cycle length − 14 days; fertile-window dates are approximate calendar estimates.",
  "period":"Next period ≈ last period start + average cycle length.",
  "gfr":"2021 CKD-EPI creatinine equation: eGFR = 142 × min(Scr/κ,1)^α × max(Scr/κ,1)^−1.2 × 0.9938^age × 1.012 (female coefficient where applicable).",
  "body-type":"Descriptive ratios: shoulder-to-hip = shoulder circumference ÷ hip circumference; waist-to-hip = waist circumference ÷ hip circumference.",
  "body-surface-area":"Mosteller: BSA (m²) = √(height in cm × weight in kg ÷ 3600).",
  "bac":"Simplified Widmark-style estimate: estimated BAC ≈ ethanol grams ÷ (distribution ratio × body weight grams) × 100 − elimination estimate.",
  "anorexic-bmi":"BMI = weight in kilograms ÷ height in meters². BMI does not diagnose anorexia or any eating disorder.",
  "weight-watcher-points":"This page uses a disclosed custom illustrative equation: (calories + 4 × sugar grams − 4 × protein grams) ÷ user-selected kcal-per-point factor. It is not the official branded formula.",
  "overweight":"BMI = weight in kilograms ÷ height in meters²; adult screening bands are not a diagnosis.",
  "scientific-calculator":"The selected operation applies standard arithmetic, power, square-root, logarithmic or trigonometric functions. Trigonometric inputs are interpreted in degrees.",
  "fraction":"For a/b ± c/d, use (ad ± bc)/bd. Multiplication is ac/bd; division is ad/bc. Reduce by the greatest common divisor.",
  "triangle":"Heron's formula: area = √[s(s−a)(s−b)(s−c)], where s = (a+b+c)/2.",
  "volume":"Rectangular prism: V=lwh. Cylinder: V=πr²h. Sphere: V=4πr³/3. Cone: V=πr²h/3.",
  "standard-deviation":"Population SD = √[Σ(x−mean)²/N]. Sample SD uses N−1 in the denominator.",
  "number-sequence":"Arithmetic term: aₙ=a₁+(n−1)d. Geometric term: aₙ=a₁rⁿ⁻¹.",
  "percent-error":"Percent error = |experimental − accepted| ÷ |accepted| × 100%.",
  "exponent":"Power = base^exponent.",
  "binary":"Integer arithmetic is performed in base 10 and the result is represented in base 2.",
  "hex":"Integer arithmetic is performed in base 10 and the result is represented in base 16.",
  "half-life":"Remaining quantity = initial quantity × (1/2)^(elapsed time ÷ half-life).",
  "quadratic-formula":"For ax²+bx+c=0, x = [−b ± √(b²−4ac)] ÷ 2a.",
  "slope":"Slope m=(y₂−y₁)/(x₂−x₁); y-intercept b=y₁−mx₁.",
  "log":"log_b(x) = ln(x) ÷ ln(b), where x>0, b>0 and b≠1.",
  "area":"Rectangle: A=lw. Triangle: A=bh/2. Circle: A=πr². Trapezoid: A=(a+b)h/2.",
  "sample-size":"For a proportion: n = z²p(1−p)/E², rounded up. No finite-population correction is applied.",
  "probability":"For equally likely outcomes, P(event)=favorable outcomes ÷ total outcomes.",
  "statistics":"The page summarizes the entered values using mean, median, range and population standard deviation.",
  "mean-median-mode-range":"Mean = sum ÷ count. Median is the middle sorted value. Mode is the most frequent value. Range = maximum − minimum.",
  "permutation-and-combination":"Permutations: nPr=n!/(n−r)!. Combinations: nCr=n!/[r!(n−r)!].",
  "z-score":"z=(observed value − mean) ÷ standard deviation.",
  "confidence-interval":"Normal-approximation interval = sample mean ± z × (sample standard deviation ÷ √sample size).",
  "ratio":"Simplify a:b by dividing both terms by their greatest common divisor.",
  "distance":"Euclidean distance = √[(x₂−x₁)²+(y₂−y₁)²].",
  "circle":"Circumference C=2πr. Area A=πr². Diameter d=2r.",
  "surface-area":"Rectangular prism: SA=2(lw+lh+wh). Sphere: SA=4πr². Cylinder: SA=2πr(r+h). Cube: SA=6a².",
  "pythagorean-theorem":"For a right triangle, a²+b²=c², where c is the hypotenuse.",
  "right-triangle":"Hypotenuse c=√(a²+b²). Area=ab/2. Acute angles are found with inverse tangent.",
  "root":"The nth root of x is x^(1/n); even roots of negative real values are not real.",
  "least-common-multiple":"LCM(a,b)=|a×b| ÷ GCD(a,b), with LCM equal to zero if either input is zero.",
  "greatest-common-factor":"The greatest common factor is the largest positive integer that divides both inputs without a remainder.",
  "factor":"A positive integer factor divides the entered integer exactly.",
  "rounding":"Scale the value by 10^decimal places, apply the selected rounding rule, then divide by the scale.",
  "matrix":"The calculator applies element-wise addition/subtraction or the standard row-by-column 2×2 matrix product; determinant of A is ad−bc.",
  "scientific-notation":"Write x=m×10ⁿ, where n=floor(log₁₀|x|) and 1≤|m|<10.",
  "big-number":"Whole-number arithmetic uses arbitrary-precision integer operations to avoid floating-point rounding.",
  "prime-factorization":"Repeatedly divide the integer by prime divisors until the remaining quotient is 1.",
  "common-factor":"Common factors are the positive divisors shared by both integers; the greatest is their GCD.",
  "basic-calculator":"The calculator applies addition, subtraction, multiplication or division to the two entered values.",
  "long-division":"Dividend = divisor × quotient + remainder, using integer quotient and remainder.",
  "average":"Arithmetic mean = sum of all observations ÷ number of observations.",
  "p-value":"Two-tailed normal approximation: p = 2 × [1 − Φ(|z|)], where Φ is the standard normal cumulative distribution."
};

export function CalculatorArticle({ calculator }:{calculator:CalculatorDefinition}) {
  const isHealth=calculator.category==="Health & Fitness";
  const isMath=calculator.category==="Math";
  const article=calculatorArticles[calculator.slug] ?? {
    intro: `${calculator.description} This guide explains the purpose of the tool, the inputs it uses and how to interpret the result.`,
    method: isHealth
      ? `The ${calculator.name} applies the measurement-based method described below to the values entered. Check the units, equation setting and assumptions before interpreting the estimate.`
      : isMath
      ? `The ${calculator.name} applies the relevant arithmetic, geometric or statistical relationship to the entered values. The result panel presents the calculated value and supporting metrics.`
      : `The ${calculator.name} processes the entered values using its configured calculation model.`,
    formula: formulaBySlug[calculator.slug] ?? (isHealth
      ? "The result is an estimate based on the displayed measurements and selected assumptions. Review the limitations and consult a qualified professional where appropriate."
      : isMath
      ? "The exact operation depends on the selected inputs. The calculator applies the corresponding standard mathematical relationship."
      : "The calculation uses the relationship represented by the selected inputs."),
    example: `Start with the sample values already populated in the calculator. Select Calculate result, review the headline figure and supporting metrics, then adjust one input at a time to compare scenarios.`,
    tips: isHealth
      ? ["Use the units displayed beside each field.", "Treat the output as an estimate, not a diagnosis or treatment recommendation.", "Ask a qualified healthcare professional about individual concerns or decisions."]
      : isMath
      ? ["Check signs, units and decimal places before calculating.", "Try a simple known example to validate your inputs.", "Keep sufficient precision during intermediate steps when working manually."]
      : ["Enter values using the units displayed beside each field.", "Compare more than one scenario before making a decision.", "Check assumptions and any fees or rules not represented by the model."],
    limitations: isHealth
      ? "This calculator provides an educational estimate, not a diagnosis or individualized medical advice. Health needs and clinical interpretation vary. Seek qualified professional guidance for personal decisions, symptoms, pregnancy care or treatment."
      : isMath
      ? "Results depend on the values and assumptions entered. Floating-point calculations may have finite precision; statistical outputs may rely on approximations and do not replace a complete study design or analysis."
      : "This is an educational estimate based on simplified assumptions. Results may differ from actual provider calculations and local rules.",
    faqs: [
      { question: `What does the ${calculator.name} calculate?`, answer: calculator.description },
      { question: "How should I interpret the result?", answer: isHealth ? "Treat it as an estimate and consider the health-specific limitations shown on the page." : "Review the method and supporting metrics, and verify the inputs and assumptions." },
      { question: "Can I rely on this as professional advice?", answer: isHealth ? "No. It is not a diagnosis or treatment recommendation. Consult a qualified healthcare professional." : "Use the result as an informational aid and verify important decisions independently." }
    ]
  };
  const related=calculators.filter(item=>item.slug!==calculator.slug && item.category===calculator.category).slice(0,3);
  const jsonLd={
    "@context":"https://schema.org",
    "@type":"SoftwareApplication",
    name:calculator.name,
    applicationCategory:"EducationalApplication",
    operatingSystem:"Any",
    description:calculator.description,
    offers:{"@type":"Offer",price:"0",priceCurrency:"USD"},
    mainEntityOfPage:`/calculators/${calculator.slug}`
  };
  const faqLd={"@context":"https://schema.org","@type":"FAQPage","mainEntity":article.faqs.map(f=>({"@type":"Question",name:f.question,acceptedAnswer:{"@type":"Answer",text:f.answer}}))};
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqLd)}} />
    <article className="mt-10 space-y-6">
      <section className="card p-6 md:p-8"><p className="text-xs font-bold uppercase tracking-[.16em] text-violet-600">Calculator guide</p><h2 className="mt-2 text-2xl font-extrabold">What is the {calculator.name}?</h2><p className="mt-4 leading-8 text-muted">{article.intro}</p></section>
      <section className="card p-6 md:p-8"><h2 className="text-xl font-extrabold">How does this calculator work?</h2><p className="mt-3 leading-8 text-muted">{article.method}</p><h3 className="mt-6 font-bold">Formula and calculation method</h3><p className="mt-2 rounded-xl bg-[#f6f3fb] p-4 font-mono text-sm leading-7 text-[#493078]">{article.formula}</p><p className="mt-3 text-sm leading-7 text-muted">The calculator applies this method to the values entered above. Review the assumptions below before relying on an estimate.</p></section>
      <section className="card p-6 md:p-8"><h2 className="text-xl font-extrabold">Example calculation</h2><p className="mt-3 leading-8 text-muted">{article.example}</p></section>
      <section className="card p-6 md:p-8"><h2 className="text-xl font-extrabold">How to use the {calculator.name.replace(/ Calculator$/i,"")}</h2><ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-7 text-muted"><li>Enter each requested value using the unit shown beside the field.</li><li>Check the inputs and select <strong className="text-ink">Calculate result</strong>.</li><li>Review the headline result, supporting metrics and chart where provided.</li><li>Change one input at a time to compare scenarios, or use Reset to start again.</li></ol></section>
      <section className="card p-6 md:p-8"><h2 className="text-xl font-extrabold">Tips for interpreting your result</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-muted">{article.tips.map(t=><li key={t}>{t}</li>)}</ul><h3 className="mt-6 font-bold">Assumptions and limitations</h3><p className="mt-2 leading-8 text-muted">{article.limitations}</p></section>
      <section className="card p-6 md:p-8"><h2 className="text-xl font-extrabold">Frequently asked questions</h2><div className="mt-4 divide-y divide-[#eeeaf4]">{article.faqs.map(f=><details key={f.question} className="py-4"><summary className="cursor-pointer font-semibold">{f.question}</summary><p className="mt-3 text-sm leading-7 text-muted">{f.answer}</p></details>)}</div></section>
      {related.length>0&&<section><h2 className="text-xl font-extrabold">Related {calculator.category} calculators</h2><div className="mt-4 grid gap-3 sm:grid-cols-3">{related.map(item=><Link key={item.slug} href={`/calculators/${item.slug}`} className="card p-4 text-sm font-semibold transition hover:border-violet-300 hover:text-violet-700">{item.name}<span className="mt-2 block text-xs font-normal text-muted">{item.description}</span></Link>)}</div></section>}
    </article>
  </>;
}
