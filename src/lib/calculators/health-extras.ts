import type {
  CalculatorDefinition,
  CalculationResult,
  CalculatorField,
} from "./types";

const f = (
  name: string,
  label: string,
  defaultValue: string,
  unit?: string,
  min = 0,
  step = 1,
): CalculatorField => ({
  name,
  label,
  type: "number",
  defaultValue,
  unit,
  min,
  step,
});
const s = (
  name: string,
  label: string,
  defaultValue: string,
  options: { label: string; value: string }[],
): CalculatorField => ({ name, label, type: "select", defaultValue, options });
const d = (
  name: string,
  label: string,
  defaultValue: string,
): CalculatorField => ({ name, label, type: "date", defaultValue });
const n = (v: Record<string, string>, k: string) => Number(v[k] ?? 0);
const fmt = (x: number, digits = 2) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(
    Number.isFinite(x) ? x : 0,
  );
const kg = (x: number) => `${fmt(x)} kg`;
const kcal = (x: number) => `${fmt(x, 0)} kcal/day`;
const days = (date: string, delta: number) => {
  const x = new Date(`${date}T12:00:00Z`);
  x.setUTCDate(x.getUTCDate() + delta);
  return x.toISOString().slice(0, 10);
};
const dateDiff = (a: string, b: string) =>
  Math.round(
    (new Date(`${b}T12:00:00Z`).getTime() -
      new Date(`${a}T12:00:00Z`).getTime()) /
      86400000,
  );
const log10 = (x: number) => Math.log(x) / Math.LN10;
const R = (
  headline: string,
  value: string,
  description: string,
  metrics: { label: string; value: string }[],
  chart?: { label: string; value: number }[],
  note?: string,
): CalculationResult => ({
  headline,
  value,
  description,
  metrics,
  chart,
  chartTitle: "Health and fitness estimate",
  chartKind: chart ? "bar" : undefined,
  note:
    note ??
    "This tool provides an educational estimate, not a diagnosis or individualized medical advice. Individual needs vary. Consult a qualified healthcare professional for personal decisions, symptoms, pregnancy care or treatment.",
});
const sex = s("sex", "Equation setting", "male", [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
]);
const activity = s("activity", "Activity level", "1.55", [
  { label: "Sedentary", value: "1.2" },
  { label: "Lightly active", value: "1.375" },
  { label: "Moderately active", value: "1.55" },
  { label: "Very active", value: "1.725" },
  { label: "Extra active", value: "1.9" },
]);

const defs: CalculatorDefinition[] = [
  {
    slug: "body-fat",
    name: "Body Fat Calculator",
    category: "Health & Fitness",
    description:
      "Estimate body-fat percentage with the U.S. Navy circumference method.",
    icon: "Activity",
    fields: [
      sex,
      f("height", "Height", "175", "cm", 100, 0.1),
      f("neck", "Neck circumference", "38", "cm", 10, 0.1),
      f("waist", "Waist circumference", "85", "cm", 20, 0.1),
      f("hip", "Hip circumference (female equation)", "98", "cm", 20, 0.1),
    ],
    calculate(v) {
      const h = n(v, "height") / 2.54,
        neck = n(v, "neck") / 2.54,
        waist = n(v, "waist") / 2.54,
        hip = n(v, "hip") / 2.54;
      const x =
        v.sex === "male"
          ? 86.01 * log10(waist - neck) - 70.041 * log10(h) + 36.76
          : 163.205 * log10(waist + hip - neck) - 97.684 * log10(h) - 78.387;
      if (!Number.isFinite(x))
        throw new Error(
          "Check that all circumference measurements are valid and consistent.",
        );
      return R(
        "Estimated body-fat percentage",
        `${fmt(x)}%`,
        "Approximation using the U.S. Navy circumference equation.",
        [
          {
            label: "Equation setting",
            value: v.sex === "male" ? "Male" : "Female",
          },
          { label: "Height", value: `${fmt(n(v, "height"))} cm` },
          { label: "Waist", value: `${fmt(n(v, "waist"))} cm` },
        ],
        [
          { label: "Estimated body fat", value: x },
          { label: "Remaining percentage", value: 100 - x },
        ],
        "Circumference equations are rough estimates and can be inaccurate for some body types. They are not a diagnosis or a measure of health by themselves.",
      );
    },
  },
  {
    slug: "macro",
    name: "Macro Calculator",
    category: "Health & Fitness",
    description:
      "Estimate carbohydrate, protein and fat gram targets from a calorie target and selected macro split.",
    icon: "Apple",
    fields: [
      f("calories", "Daily calorie target", "2000", "kcal", 1),
      f("protein", "Protein percentage", "25", "%", 0, 0.1),
      f("carbs", "Carbohydrate percentage", "45", "%", 0, 0.1),
      f("fat", "Fat percentage", "30", "%", 0, 0.1),
    ],
    calculate(v) {
      const p = n(v, "protein"),
        c = n(v, "carbs"),
        fat = n(v, "fat");
      if (Math.abs(p + c + fat - 100) > 0.01)
        throw new Error("Macro percentages must add up to 100%.");
      const cal = n(v, "calories");
      const pg = (cal * p) / 100 / 4,
        cg = (cal * c) / 100 / 4,
        fg = (cal * fat) / 100 / 9;
      return R(
        "Estimated daily macro targets",
        `${fmt(pg)} g protein`,
        "Daily grams implied by the calorie target and selected percentage split.",
        [
          { label: "Protein", value: `${fmt(pg)} g (${fmt(p)}%)` },
          { label: "Carbohydrates", value: `${fmt(cg)} g (${fmt(c)}%)` },
          { label: "Fat", value: `${fmt(fg)} g (${fmt(fat)}%)` },
        ],
        [
          { label: "Protein kcal", value: pg * 4 },
          { label: "Carb kcal", value: cg * 4 },
          { label: "Fat kcal", value: fg * 9 },
        ],
        "Macro ranges depend on age, activity, health and goals. This is a mathematical split, not a prescribed diet.",
      );
    },
  },
  {
    slug: "pregnancy",
    name: "Pregnancy Calculator",
    category: "Health & Fitness",
    description:
      "Estimate pregnancy week and trimester from the first day of the last menstrual period.",
    icon: "CalendarHeart",
    fields: [
      d("lmp", "First day of last menstrual period", "2026-10-01"),
      f("cycle", "Usual cycle length", "28", "days", 20, 1),
    ],
    calculate(v) {
      const elapsed = dateDiff(v.lmp, new Date().toISOString().slice(0, 10));
      if (elapsed < 0)
        throw new Error("Last menstrual period date cannot be in the future.");
      const adj = elapsed + (n(v, "cycle") - 28),
        week = Math.floor(adj / 7),
        day = adj % 7,
        edd = days(v.lmp, 280 + n(v, "cycle") - 28),
        trimester = week < 13 ? "First" : week < 28 ? "Second" : "Third";
      return R(
        "Estimated gestational age",
        `${week} weeks, ${day} days`,
        `${trimester} trimester estimate based on the last menstrual period.`,
        [
          { label: "Estimated due date", value: edd },
          { label: "Estimated pregnancy day", value: `Day ${adj + 1}` },
          { label: "Trimester", value: trimester },
        ],
        [
          {
            label: "First trimester",
            value: Math.max(0, Math.min(adj, 13 * 7)),
          },
          {
            label: "Second trimester",
            value: Math.max(0, Math.min(adj - 13 * 7, 15 * 7)),
          },
          { label: "Third trimester", value: Math.max(0, adj - 28 * 7) },
        ],
        "Calendar estimates can differ from ultrasound dating, irregular cycles and clinical assessment. Confirm pregnancy dating and care with a qualified clinician.",
      );
    },
  },
  {
    slug: "pregnancy-weight-gain",
    name: "Pregnancy Weight Gain Calculator",
    category: "Health & Fitness",
    description:
      "Compare entered pregnancy weight change with broad guideline ranges by pre-pregnancy BMI category.",
    icon: "Scale",
    fields: [
      s("bmi", "Pre-pregnancy BMI category", "normal", [
        { label: "Underweight (BMI below 18.5)", value: "under" },
        { label: "Normal (18.5–24.9)", value: "normal" },
        { label: "Overweight (25–29.9)", value: "over" },
        { label: "Obesity (30 or higher)", value: "obese" },
      ]),
      f("week", "Pregnancy week", "24", "weeks", 1, 1),
      f("gain", "Weight gained so far", "6", "kg", 0, 0.1),
    ],
    calculate(v) {
      const ranges: Record<string, [number, number]> = {
        under: [12.5, 18],
        normal: [11.5, 16],
        over: [7, 11.5],
        obese: [5, 9],
      };
      const [lo, hi] = ranges[v.bmi] ?? ranges.normal;
      const week = Math.min(40, n(v, "week")),
        total = n(v, "gain");
      const low = (lo * week) / 40,
        high = (hi * week) / 40;
      return R(
        "Weight change entered",
        kg(total),
        "Contextual comparison against broad total-pregnancy guideline ranges prorated linearly by week for visualization only.",
        [
          {
            label: "Broad total-pregnancy range",
            value: `${fmt(lo)}–${fmt(hi)} kg`,
          },
          { label: "Entered gain", value: kg(total) },
          {
            label: "Simple week-scaled context",
            value: `${fmt(low)}–${fmt(high)} kg at week ${week}`,
          },
        ],
        [
          { label: "Entered", value: total },
          { label: "Lower reference", value: low },
          { label: "Upper reference", value: high },
        ],
        "Weight gain is not expected to progress linearly. These broad singleton-pregnancy ranges are not individualized targets; discuss your situation with your maternity care professional.",
      );
    },
  },
  {
    slug: "pregnancy-conception",
    name: "Pregnancy Conception Calculator",
    category: "Health & Fitness",
    description:
      "Estimate a conception date from an entered estimated due date.",
    icon: "CalendarDays",
    fields: [d("due", "Estimated due date", "2027-07-08")],
    calculate(v) {
      const conception = days(v.due, -266);
      return R(
        "Estimated conception date",
        conception,
        "A typical estimate uses approximately 266 days from conception to the estimated due date.",
        [
          { label: "Estimated due date", value: v.due },
          { label: "Estimated conception date", value: conception },
          { label: "Method", value: "Due date minus 266 days" },
        ],
        undefined,
        "This is an approximate calendar estimate, not confirmation of conception timing. Clinical dating can differ.",
      );
    },
  },
  {
    slug: "due-date",
    name: "Due Date Calculator",
    category: "Health & Fitness",
    description:
      "Estimate a pregnancy due date using the last menstrual period and average cycle length.",
    icon: "CalendarCheck",
    fields: [
      d("lmp", "First day of last menstrual period", "2026-10-01"),
      f("cycle", "Average cycle length", "28", "days", 20, 1),
    ],
    calculate(v) {
      const due = days(v.lmp, 280 + n(v, "cycle") - 28);
      return R(
        "Estimated due date",
        due,
        "Estimated using the standard 280-day method adjusted for cycle length.",
        [
          { label: "Last menstrual period", value: v.lmp },
          { label: "Cycle length", value: `${fmt(n(v, "cycle"), 0)} days` },
          {
            label: "Estimated conception",
            value: days(v.lmp, 14 + n(v, "cycle") - 28),
          },
        ],
        undefined,
        "Due dates are estimates. Ultrasound and clinical assessment may revise pregnancy dating.",
      );
    },
  },
  {
    slug: "pace",
    name: "Pace Calculator",
    category: "Health & Fitness",
    description:
      "Calculate running or walking pace and speed from distance and elapsed time.",
    icon: "Timer",
    fields: [
      f("distance", "Distance", "5", "km", 0.001, 0.001),
      f("minutes", "Elapsed time", "30", "minutes", 0.01, 0.01),
    ],
    calculate(v) {
      const pace = n(v, "minutes") / n(v, "distance"),
        speed = n(v, "distance") / (n(v, "minutes") / 60),
        mins = Math.floor(pace),
        secs = Math.round((pace - mins) * 60);
      return R(
        "Average pace",
        `${mins}:${String(secs).padStart(2, "0")} min/km`,
        "Average elapsed time per kilometer.",
        [
          { label: "Average speed", value: `${fmt(speed)} km/h` },
          { label: "Distance", value: `${fmt(n(v, "distance"))} km` },
          { label: "Elapsed time", value: `${fmt(n(v, "minutes"))} min` },
        ],
        [
          { label: "Pace (min/km)", value: pace },
          { label: "Speed (km/h)", value: speed },
        ],
      );
    },
  },
  {
    slug: "army-body-fat",
    name: "Army Body Fat Calculator",
    category: "Health & Fitness",
    description:
      "Estimate body-fat percentage using a Navy-style circumference equation for comparison; this is not an official Army assessment.",
    icon: "ShieldCheck",
    fields: [
      sex,
      f("height", "Height", "175", "cm", 100, 0.1),
      f("neck", "Neck circumference", "38", "cm", 10, 0.1),
      f("waist", "Waist circumference", "85", "cm", 20, 0.1),
      f("hip", "Hip circumference (female equation)", "98", "cm", 20, 0.1),
    ],
    calculate(v) {
      const h = n(v, "height") / 2.54,
        neck = n(v, "neck") / 2.54,
        waist = n(v, "waist") / 2.54,
        hip = n(v, "hip") / 2.54;
      const bf =
        v.sex === "male"
          ? 86.01 * log10(waist - neck) - 70.041 * log10(h) + 36.76
          : 163.205 * log10(waist + hip - neck) - 97.684 * log10(h) - 78.387;
      if (!Number.isFinite(bf))
        throw new Error("Check the entered measurements.");
      return R(
        "Estimated circumference-based body fat",
        `${fmt(bf)}%`,
        "This uses a Navy-style circumference equation as an educational approximation, not the official Army body-fat assessment method.",
        [
          { label: "Height", value: `${fmt(n(v, "height"))} cm` },
          { label: "Waist", value: `${fmt(n(v, "waist"))} cm` },
          { label: "Neck", value: `${fmt(n(v, "neck"))} cm` },
        ],
        undefined,
        "This is not an official military assessment or eligibility determination. Current service-specific measurement rules may differ.",
      );
    },
  },
  {
    slug: "carbohydrate",
    name: "Carbohydrate Calculator",
    category: "Health & Fitness",
    description:
      "Estimate carbohydrate grams from a daily calorie target and selected calorie percentage.",
    icon: "Wheat",
    fields: [
      f("calories", "Daily calorie target", "2000", "kcal", 1),
      f("percent", "Calories from carbohydrates", "45", "%", 0, 0.1),
    ],
    calculate(v) {
      const grams = (n(v, "calories") * n(v, "percent")) / 100 / 4;
      return R(
        "Estimated carbohydrate amount",
        `${fmt(grams)} g/day`,
        "Uses approximately four kilocalories per gram of carbohydrate.",
        [
          {
            label: "Daily calorie target",
            value: `${fmt(n(v, "calories"), 0)} kcal`,
          },
          { label: "Carbohydrate share", value: `${fmt(n(v, "percent"))}%` },
          {
            label: "Energy from carbohydrates",
            value: `${fmt(grams * 4, 0)} kcal`,
          },
        ],
      );
    },
  },
  {
    slug: "lean-body-mass",
    name: "Lean Body Mass Calculator",
    category: "Health & Fitness",
    description:
      "Estimate lean body mass from body weight and estimated body-fat percentage.",
    icon: "Dumbbell",
    fields: [
      f("weight", "Body weight", "70", "kg", 1, 0.1),
      f("fat", "Estimated body-fat percentage", "20", "%", 0, 0.1),
    ],
    calculate(v) {
      const lean = n(v, "weight") * (1 - n(v, "fat") / 100);
      return R(
        "Estimated lean body mass",
        kg(lean),
        "Body weight minus estimated fat mass.",
        [
          { label: "Estimated fat mass", value: kg(n(v, "weight") - lean) },
          { label: "Body weight", value: kg(n(v, "weight")) },
          { label: "Body-fat estimate", value: `${fmt(n(v, "fat"))}%` },
        ],
        [
          { label: "Lean mass", value: lean },
          { label: "Fat mass", value: n(v, "weight") - lean },
        ],
      );
    },
  },
  {
    slug: "healthy-weight",
    name: "Healthy Weight Calculator",
    category: "Health & Fitness",
    description:
      "Calculate the adult weight range corresponding to BMI 18.5–24.9 for a given height.",
    icon: "Scale",
    fields: [f("height", "Height", "175", "cm", 100, 0.1)],
    calculate(v) {
      const h = n(v, "height") / 100,
        lo = 18.5 * h * h,
        hi = 24.9 * h * h;
      return R(
        "Adult BMI reference weight range",
        `${fmt(lo)}–${fmt(hi)} kg`,
        "Weight range corresponding to the commonly used adult BMI screening interval.",
        [
          { label: "Lower reference", value: kg(lo) },
          { label: "Upper reference", value: kg(hi) },
          { label: "Height", value: `${fmt(n(v, "height"))} cm` },
        ],
        undefined,
        "BMI reference ranges are screening tools and may not suit children, teens, pregnancy, athletes or every adult. They are not a personal target.",
      );
    },
  },
  {
    slug: "calories-burned",
    name: "Calories Burned Calculator",
    category: "Health & Fitness",
    description:
      "Estimate exercise energy expenditure using MET, body weight and activity duration.",
    icon: "Flame",
    fields: [
      f("weight", "Body weight", "70", "kg", 1, 0.1),
      f("met", "Activity MET value", "6", "MET", 0.1, 0.1),
      f("minutes", "Activity duration", "30", "minutes", 1, 1),
    ],
    calculate(v) {
      const kcal =
        ((n(v, "met") * 3.5 * n(v, "weight")) / 200) * n(v, "minutes");
      return R(
        "Estimated calories burned",
        `${fmt(kcal, 0)} kcal`,
        "MET-based approximation for the entered activity intensity and duration.",
        [
          { label: "Activity intensity", value: `${fmt(n(v, "met"))} MET` },
          { label: "Duration", value: `${fmt(n(v, "minutes"), 0)} minutes` },
          { label: "Body weight", value: kg(n(v, "weight")) },
        ],
      );
    },
  },
  {
    slug: "one-rep-max",
    name: "One Rep Max Calculator",
    category: "Health & Fitness",
    description:
      "Estimate one-repetition maximum from a submaximal lift and completed repetitions.",
    icon: "Dumbbell",
    fields: [
      f("weight", "Weight lifted", "60", "kg", 0.1, 0.1),
      f("reps", "Completed repetitions", "8", "reps", 1, 1),
    ],
    calculate(v) {
      const reps = n(v, "reps");
      if (reps > 12)
        throw new Error("For a more useful estimate, enter 1–12 repetitions.");
      const one = n(v, "weight") * (1 + reps / 30);
      return R(
        "Estimated one-rep maximum",
        kg(one),
        "Epley equation estimate based on a submaximal set.",
        [
          { label: "Weight lifted", value: kg(n(v, "weight")) },
          { label: "Repetitions", value: fmt(reps, 0) },
          { label: "Estimated 90% training load", value: kg(one * 0.9) },
        ],
        [
          { label: "Lifted weight", value: n(v, "weight") },
          { label: "Estimated 1RM", value: one },
        ],
        "This is an estimate, not a recommendation to attempt a maximal lift. Use safe technique, appropriate supervision and equipment.",
      );
    },
  },
  {
    slug: "target-heart-rate",
    name: "Target Heart Rate Calculator",
    category: "Health & Fitness",
    description:
      "Estimate heart-rate training zones using age and the heart-rate-reserve method.",
    icon: "HeartPulse",
    fields: [
      f("age", "Age", "30", "years", 15, 1),
      f("rest", "Resting heart rate", "65", "bpm", 30, 1),
    ],
    calculate(v) {
      const max = 208 - 0.7 * n(v, "age"),
        reserve = max - n(v, "rest"),
        zones = [
          [0.5, 0.6],
          [0.6, 0.7],
          [0.7, 0.8],
          [0.8, 0.9],
          [0.9, 1],
        ];
      return R(
        "Estimated maximum heart rate",
        `${fmt(max, 0)} bpm`,
        "Heart-rate-reserve training zones are estimates and are not individualized medical advice.",
        zones.map((z, i) => ({
          label: `Zone ${i + 1}`,
          value: `${fmt(n(v, "rest") + reserve * z[0], 0)}–${fmt(n(v, "rest") + reserve * z[1], 0)} bpm`,
        })),
        zones.map((z, i) => ({
          label: `Zone ${i + 1}`,
          value: reserve * (z[1] - z[0]),
        })),
        "Age-based maximum heart rate formulas have substantial individual error. Ask a clinician before exercise testing if you have symptoms or cardiovascular concerns.",
      );
    },
  },
  {
    slug: "protein",
    name: "Protein Calculator",
    category: "Health & Fitness",
    description:
      "Estimate a daily protein amount using body weight and a selected grams-per-kilogram factor.",
    icon: "Beef",
    fields: [
      f("weight", "Body weight", "70", "kg", 1, 0.1),
      s("factor", "Protein factor", "1.2", [
        { label: "0.8 g/kg", value: "0.8" },
        { label: "1.0 g/kg", value: "1.0" },
        { label: "1.2 g/kg", value: "1.2" },
        { label: "1.6 g/kg", value: "1.6" },
        { label: "2.0 g/kg", value: "2.0" },
      ]),
    ],
    calculate(v) {
      const g = n(v, "weight") * n(v, "factor");
      return R(
        "Illustrative daily protein amount",
        `${fmt(g)} g/day`,
        "Body weight multiplied by the selected protein factor.",
        [
          { label: "Body weight", value: kg(n(v, "weight")) },
          { label: "Selected factor", value: `${fmt(n(v, "factor"))} g/kg` },
          { label: "Per-meal amount across 4 meals", value: `${fmt(g / 4)} g` },
        ],
        undefined,
        "Protein needs vary with age, health, pregnancy, kidney function and training. This is a general arithmetic estimate, not a prescription.",
      );
    },
  },
  {
    slug: "fat-intake",
    name: "Fat Intake Calculator",
    category: "Health & Fitness",
    description:
      "Convert a daily calorie target and fat percentage into grams of dietary fat.",
    icon: "Droplet",
    fields: [
      f("calories", "Daily calorie target", "2000", "kcal", 1),
      f("percent", "Calories from fat", "30", "%", 0, 0.1),
    ],
    calculate(v) {
      const g = (n(v, "calories") * n(v, "percent")) / 100 / 9;
      return R(
        "Estimated daily fat amount",
        `${fmt(g)} g/day`,
        "Uses approximately nine kilocalories per gram of fat.",
        [
          {
            label: "Daily calories",
            value: `${fmt(n(v, "calories"), 0)} kcal`,
          },
          { label: "Fat share", value: `${fmt(n(v, "percent"))}%` },
          { label: "Energy from fat", value: `${fmt(g * 9, 0)} kcal` },
        ],
      );
    },
  },
  {
    slug: "tdee",
    name: "TDEE Calculator",
    category: "Health & Fitness",
    description:
      "Estimate total daily energy expenditure using a resting energy equation and activity multiplier.",
    icon: "Activity",
    fields: [
      f("weight", "Weight", "70", "kg", 1, 0.1),
      f("height", "Height", "175", "cm", 100, 0.1),
      f("age", "Age", "28", "years", 15, 1),
      sex,
      activity,
    ],
    calculate(v) {
      const bmr =
          10 * n(v, "weight") +
          6.25 * n(v, "height") -
          5 * n(v, "age") +
          (v.sex === "male" ? 5 : -161),
        total = bmr * n(v, "activity");
      return R(
        "Estimated total daily energy expenditure",
        kcal(total),
        "Mifflin–St Jeor resting estimate multiplied by the selected activity factor.",
        [
          { label: "Estimated BMR", value: kcal(bmr) },
          { label: "Activity multiplier", value: fmt(n(v, "activity"), 3) },
          { label: "Daily estimate", value: kcal(total) },
        ],
        [
          { label: "Resting", value: bmr },
          { label: "Activity-adjusted", value: total },
        ],
        "Energy equations are estimates and can differ from measured energy expenditure. Not a medical or dietary prescription.",
      );
    },
  },
  {
    slug: "ovulation",
    name: "Ovulation Calculator",
    category: "Health & Fitness",
    description:
      "Estimate an ovulation date and fertile window from cycle start and average cycle length.",
    icon: "CalendarHeart",
    fields: [
      d("start", "First day of last period", "2026-10-01"),
      f("cycle", "Average cycle length", "28", "days", 21, 1),
    ],
    calculate(v) {
      const ov = days(v.start, n(v, "cycle") - 14),
        start = days(ov, -5),
        end = days(ov, 1);
      return R(
        "Estimated ovulation date",
        ov,
        "Calendar estimate based on ovulation occurring about 14 days before the next period.",
        [
          { label: "Estimated fertile window", value: `${start} to ${end}` },
          {
            label: "Next period estimate",
            value: days(v.start, n(v, "cycle")),
          },
          { label: "Cycle length", value: `${fmt(n(v, "cycle"), 0)} days` },
        ],
        undefined,
        "Ovulation timing varies and calendar estimates cannot confirm ovulation or prevent pregnancy. Consider evidence-based contraception and clinical advice.",
      );
    },
  },
  {
    slug: "conception",
    name: "Conception Calculator",
    category: "Health & Fitness",
    description:
      "Estimate a likely fertile window from the first day of the last menstrual period and cycle length.",
    icon: "CalendarDays",
    fields: [
      d("start", "First day of last period", "2026-10-01"),
      f("cycle", "Average cycle length", "28", "days", 21, 1),
    ],
    calculate(v) {
      const ov = days(v.start, n(v, "cycle") - 14);
      return R(
        "Estimated ovulation date",
        ov,
        "Approximate calendar estimate of the midpoint of the fertile window.",
        [
          {
            label: "Estimated fertile window",
            value: `${days(ov, -5)} to ${days(ov, 1)}`,
          },
          {
            label: "Next period estimate",
            value: days(v.start, n(v, "cycle")),
          },
          { label: "Cycle length", value: `${fmt(n(v, "cycle"), 0)} days` },
        ],
        undefined,
        "This cannot confirm conception or pregnancy. Cycle variation can shift ovulation; use appropriate contraception or consult a healthcare professional.",
      );
    },
  },
  {
    slug: "period",
    name: "Period Calculator",
    category: "Health & Fitness",
    description:
      "Estimate the next menstrual period and a broad fertile window from cycle information.",
    icon: "CalendarDays",
    fields: [
      d("start", "First day of last period", "2026-10-01"),
      f("cycle", "Average cycle length", "28", "days", 21, 1),
      f("duration", "Typical period duration", "5", "days", 1, 1),
    ],
    calculate(v) {
      const next = days(v.start, n(v, "cycle")),
        ov = days(v.start, n(v, "cycle") - 14);
      return R(
        "Estimated next period start",
        next,
        "Calendar estimate using the entered average cycle length.",
        [
          {
            label: "Expected period duration",
            value: `${fmt(n(v, "duration"), 0)} days`,
          },
          { label: "Estimated ovulation", value: ov },
          {
            label: "Estimated fertile window",
            value: `${days(ov, -5)} to ${days(ov, 1)}`,
          },
        ],
        undefined,
        "Menstrual cycles vary. This estimate is not contraception, diagnosis or a substitute for care when periods are unusually painful, heavy or irregular.",
      );
    },
  },
  {
    slug: "gfr",
    name: "GFR Calculator",
    category: "Health & Fitness",
    description:
      "Estimate eGFR using the 2021 race-free CKD-EPI creatinine equation.",
    icon: "HeartPulse",
    fields: [
      f("creatinine", "Serum creatinine", "1.0", "mg/dL", 0.1, 0.01),
      f("age", "Age", "45", "years", 18, 1),
      sex,
    ],
    calculate(v) {
      const scr = n(v, "creatinine"),
        female = v.sex === "female",
        k = female ? 0.7 : 0.9,
        alpha = female ? -0.241 : -0.302;
      const egfr =
        142 *
        Math.pow(Math.min(scr / k, 1), alpha) *
        Math.pow(Math.max(scr / k, 1), -1.2) *
        Math.pow(0.9938, n(v, "age")) *
        (female ? 1.012 : 1);
      return R(
        "Estimated glomerular filtration rate",
        `${fmt(egfr, 0)} mL/min/1.73 m²`,
        "Calculated with the 2021 CKD-EPI creatinine equation without a race coefficient.",
        [
          { label: "Serum creatinine", value: `${fmt(scr, 2)} mg/dL` },
          { label: "Age entered", value: `${fmt(n(v, "age"), 0)} years` },
          { label: "Equation", value: "CKD-EPI 2021" },
        ],
        undefined,
        "An eGFR result alone cannot diagnose kidney disease. Interpretation requires repeat testing, urine albumin, clinical context and clinician review. Creatinine-based estimates may be less accurate in some circumstances.",
      );
    },
  },
  {
    slug: "body-type",
    name: "Body Type Calculator",
    category: "Health & Fitness",
    description:
      "Compare waist, hip and shoulder measurements as a descriptive body-proportion tool.",
    icon: "UserRound",
    fields: [
      f("shoulder", "Shoulder circumference", "105", "cm", 1, 0.1),
      f("chest", "Chest circumference", "95", "cm", 1, 0.1),
      f("waist", "Waist circumference", "80", "cm", 1, 0.1),
      f("hip", "Hip circumference", "100", "cm", 1, 0.1),
    ],
    calculate(v) {
      const sh = n(v, "shoulder"),
        ch = n(v, "chest"),
        wa = n(v, "waist"),
        hi = n(v, "hip"),
        upper = Math.max(sh, ch);
      const label =
        wa / hi > 0.9
          ? "Waist-to-hip proportion is higher"
          : upper / hi > 1.05
            ? "Upper-body circumference is greater"
            : "Hip and upper-body circumferences are relatively similar";
      return R(
        "Body proportion summary",
        label,
        "Descriptive comparison of the entered circumferences; not a health classification.",
        [
          { label: "Shoulder / hip ratio", value: fmt(sh / hi, 3) },
          { label: "Waist / hip ratio", value: fmt(wa / hi, 3) },
          { label: "Chest / hip ratio", value: fmt(ch / hi, 3) },
        ],
        undefined,
        "Body shapes are diverse. These ratios do not diagnose health, determine fitness or define an ideal body type.",
      );
    },
  },
  {
    slug: "body-surface-area",
    name: "Body Surface Area Calculator",
    category: "Health & Fitness",
    description: "Estimate body surface area using the Mosteller equation.",
    icon: "Ruler",
    fields: [
      f("weight", "Weight", "70", "kg", 1, 0.1),
      f("height", "Height", "175", "cm", 100, 0.1),
    ],
    calculate(v) {
      const bsa = Math.sqrt((n(v, "height") * n(v, "weight")) / 3600);
      return R(
        "Estimated body surface area",
        `${fmt(bsa, 3)} m²`,
        "Mosteller equation: square root of height in centimeters multiplied by weight in kilograms, divided by 3600.",
        [
          { label: "Height", value: `${fmt(n(v, "height"))} cm` },
          { label: "Weight", value: kg(n(v, "weight")) },
          { label: "Equation", value: "Mosteller" },
        ],
      );
    },
  },
  {
    slug: "bac",
    name: "BAC Calculator",
    category: "Health & Fitness",
    description:
      "Provide a rough blood-alcohol concentration estimate from drinks, body weight and elapsed time.",
    icon: "AlertTriangle",
    fields: [
      sex,
      f("weight", "Body weight", "70", "kg", 1, 0.1),
      f("drinks", "Standard drinks consumed", "2", "drinks", 0, 0.1),
      f("hours", "Hours since drinking began", "2", "hours", 0, 0.1),
    ],
    calculate(v) {
      const grams = n(v, "drinks") * 14,
        r = v.sex === "male" ? 0.68 : 0.55,
        initial = (grams / (r * n(v, "weight") * 1000)) * 100;
      const bac = Math.max(0, initial - 0.015 * n(v, "hours"));
      return R(
        "Rough BAC model output",
        `${fmt(bac, 3)}%`,
        "Simplified Widmark-style estimate assuming 14 g ethanol per standard drink and average elimination.",
        [
          { label: "Standard drinks entered", value: fmt(n(v, "drinks"), 1) },
          { label: "Ethanol assumption", value: `${fmt(grams, 0)} g` },
          { label: "Hours elapsed", value: fmt(n(v, "hours"), 1) },
        ],
        undefined,
        "This estimate can be substantially wrong and must never be used to decide whether to drive, operate machinery or consume more alcohol. The safest choice is not to drive after drinking. Laws and standard-drink sizes vary.",
      );
    },
  },
  {
    slug: "anorexic-bmi",
    name: "Anorexic BMI Calculator",
    category: "Health & Fitness",
    description:
      "A BMI screening calculator with safety-focused guidance; it does not label or diagnose eating disorders.",
    icon: "HeartHandshake",
    fields: [
      f("weight", "Weight", "60", "kg", 1, 0.1),
      f("height", "Height", "170", "cm", 100, 0.1),
      f("age", "Age", "25", "years", 1, 1),
    ],
    calculate(v) {
      const bmi = n(v, "weight") / Math.pow(n(v, "height") / 100, 2);
      return R(
        "BMI screening result",
        fmt(bmi),
        "This page intentionally provides a general BMI screening value only and does not classify or encourage an eating disorder.",
        [
          { label: "Weight entered", value: kg(n(v, "weight")) },
          { label: "Height entered", value: `${fmt(n(v, "height"))} cm` },
          { label: "Age entered", value: `${fmt(n(v, "age"), 0)} years` },
        ],
        undefined,
        "The term in this calculator's directory title can be harmful or stigmatizing. BMI is not a diagnosis of anorexia or any eating disorder, and low BMI is not a goal. If eating, weight or body-image concerns are causing distress, contact a qualified healthcare professional or eating-disorder support service. For people under 18, adult BMI cutoffs do not apply.",
      );
    },
  },
  {
    slug: "weight-watcher-points",
    name: "Weight Watcher Points Calculator",
    category: "Health & Fitness",
    description:
      "Estimate a custom food-points value using a user-defined points formula; this is not the official WeightWatchers algorithm.",
    icon: "Apple",
    fields: [
      f("calories", "Calories per serving", "200", "kcal", 0, 1),
      f("sugar", "Sugar per serving", "10", "g", 0, 0.1),
      f("protein", "Protein per serving", "10", "g", 0, 0.1),
      f(
        "factor",
        "User-selected points factor",
        "50",
        "kcal per point",
        1,
        0.1,
      ),
    ],
    calculate(v) {
      const points =
        (n(v, "calories") + 4 * n(v, "sugar") - 4 * n(v, "protein")) /
        n(v, "factor");
      return R(
        "Custom food-points estimate",
        `${fmt(Math.max(0, points), 1)} points`,
        "Transparent illustrative formula: (calories + 4 × sugar grams − 4 × protein grams) ÷ user-selected kcal-per-point factor.",
        [
          { label: "Calories", value: `${fmt(n(v, "calories"), 0)} kcal` },
          { label: "Sugar", value: `${fmt(n(v, "sugar"))} g` },
          { label: "Protein", value: `${fmt(n(v, "protein"))} g` },
        ],
        undefined,
        "This is not the proprietary WeightWatchers Points formula and is not affiliated with or endorsed by WeightWatchers. Official plans and formulas may change.",
      );
    },
  },
  {
    slug: "overweight",
    name: "Overweight Calculator",
    category: "Health & Fitness",
    description:
      "Calculate BMI and show a neutral adult screening category based on height and weight.",
    icon: "Scale",
    fields: [
      f("weight", "Weight", "80", "kg", 1, 0.1),
      f("height", "Height", "175", "cm", 100, 0.1),
    ],
    calculate(v) {
      const bmi = n(v, "weight") / Math.pow(n(v, "height") / 100, 2),
        category =
          bmi < 18.5
            ? "Below adult reference range"
            : bmi < 25
              ? "Within adult reference range"
              : bmi < 30
                ? "Above adult reference range"
                : "Higher adult BMI range";
      return R(
        "BMI screening value",
        fmt(bmi),
        category,
        [
          { label: "Screening category", value: category },
          { label: "Weight entered", value: kg(n(v, "weight")) },
          { label: "Height", value: `${fmt(n(v, "height"))} cm` },
        ],
        undefined,
        "BMI is a screening measure, not a diagnosis or a judgment. It does not directly measure body fat and adult cutoffs are not intended for children, teens or pregnancy.",
      );
    },
  },
];

export const healthExtras: CalculatorDefinition[] = defs;
