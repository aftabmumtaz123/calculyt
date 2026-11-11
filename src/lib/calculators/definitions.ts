import type { CalculatorDefinition, CalculationResult } from "./types";
import { money, number, val, pct } from "./format";
import { financialExtras } from "./financial-extras";
import { healthExtras } from "./health-extras";
import { mathExtras } from "./math-extras";
const f = (
  name: string,
  label: string,
  defaultValue: string,
  unit?: string,
  min = 0,
  step = 1,
) => ({ name, label, type: "number" as const, defaultValue, unit, min, step });
const select = (
  name: string,
  label: string,
  defaultValue: string,
  options: { label: string; value: string }[],
) => ({ name, label, type: "select" as const, defaultValue, options });
const defs: CalculatorDefinition[] = [
  {
    slug: "compound-interest",
    name: "Compound Interest Calculator",
    category: "Financial",
    description:
      "Project how your savings or investment may grow when returns are reinvested.",
    icon: "TrendingUp",
    featured: true,
    fields: [
      f("principal", "Initial deposit", "10000", "USD"),
      f("rate", "Annual interest rate", "7", "%", 0, 0.1),
      f("years", "Years to grow", "10", "years", 1),
      f("contribution", "Regular contribution", "200", "USD", 0, 0.01),
      select("frequency", "Contribution frequency", "12", [
        { label: "Monthly", value: "12" },
        { label: "Quarterly", value: "4" },
        { label: "Annually", value: "1" },
      ]),
    ],
    calculate(v) {
      const p = val(v, "principal"),
        r = val(v, "rate") / 100,
        n = val(v, "years"),
        m = val(v, "frequency"),
        c = val(v, "contribution");
      let balance = p,
        invested = p;
      const chart = [];
      for (let y = 0; y <= n; y++) {
        if (y > 0) {
          for (let i = 0; i < m; i++) {
            balance = balance * (1 + r / m) + c;
            invested += c;
          }
        }
        chart.push({
          label: `Year ${y}`,
          value: balance,
          principal: invested,
          interest: balance - invested,
        });
      }
      const total = balance - invested;
      return {
        headline: "Projected balance",
        value: money(balance),
        description: "Estimated value at the end of your growth period.",
        metrics: [
          { label: "Total contributions", value: money(invested) },
          { label: "Interest earned", value: money(total) },
          {
            label: "Total growth",
            value: pct(invested ? (total / invested) * 100 : 0),
          },
        ],
        chart,
        chartTitle: "Your money over time",
        chartKind: "line",
        breakdown: [
          { label: "Contributions", value: invested },
          { label: "Interest earned", value: total },
        ],
        note: "Assumes a constant annual rate compounded at the selected contribution frequency. Taxes, fees and changing returns are not included.",
      };
    },
  },
  {
    slug: "mortgage",
    name: "Mortgage Calculator",
    category: "Financial",
    description:
      "Estimate your monthly principal-and-interest payment and total loan cost.",
    icon: "House",
    featured: true,
    fields: [
      f("price", "Home price", "350000", "USD"),
      f("down", "Down payment", "70000", "USD"),
      f("rate", "Annual interest rate", "6.5", "%", 0, 0.01),
      f("years", "Loan term", "30", "years", 1),
    ],
    calculate(v) {
      const p = Math.max(0, val(v, "price") - val(v, "down")),
        r = val(v, "rate") / 1200,
        n = val(v, "years") * 12,
        pmt = r === 0 ? p / n : (p * r) / (1 - Math.pow(1 + r, -n));
      let bal = p;
      const chart = [];
      for (let y = 0; y <= val(v, "years"); y++) {
        chart.push({ label: `Year ${y}`, value: bal });
        for (let i = 0; i < 12 && y < val(v, "years"); i++) {
          const interest = bal * r;
          bal = Math.max(0, bal - (pmt - interest));
        }
      }
      const total = pmt * n;
      return {
        headline: "Estimated monthly payment",
        value: money(pmt),
        description:
          "Principal and interest only; escrow and other costs are excluded.",
        metrics: [
          { label: "Loan amount", value: money(p) },
          { label: "Total interest", value: money(total - p) },
          { label: "Total paid", value: money(total) },
        ],
        chart,
        chartTitle: "Remaining loan balance",
        chartKind: "line",
        breakdown: [
          { label: "Principal", value: p },
          { label: "Interest", value: Math.max(0, total - p) },
        ],
        note: "Estimate assumes a fixed rate and regular monthly payments. Property tax, insurance, PMI and fees are not included.",
      };
    },
  },
  {
    slug: "loan",
    name: "Loan Calculator",
    category: "Financial",
    description:
      "Calculate a fixed-rate loan payment and understand the total repayment.",
    icon: "Wallet",
    fields: [
      f("amount", "Loan amount", "15000", "USD"),
      f("rate", "Annual interest rate", "8", "%", 0, 0.1),
      f("years", "Loan term", "5", "years", 1),
    ],
    calculate(v) {
      const p = val(v, "amount"),
        r = val(v, "rate") / 1200,
        n = val(v, "years") * 12,
        pmt = r === 0 ? p / n : (p * r) / (1 - Math.pow(1 + r, -n));
      return {
        headline: "Monthly payment",
        value: money(pmt),
        description: "Estimated fixed monthly payment.",
        metrics: [
          { label: "Total repayment", value: money(pmt * n) },
          { label: "Total interest", value: money(pmt * n - p) },
          { label: "Number of payments", value: number(n, 0) },
        ],
        breakdown: [
          { label: "Principal", value: p },
          { label: "Interest", value: Math.max(0, pmt * n - p) },
        ],
        chart: [
          { label: "Principal", value: p },
          { label: "Interest", value: Math.max(0, pmt * n - p) },
        ],
        chartTitle: "Repayment composition",
        chartKind: "pie",
      };
    },
  },
  {
    slug: "savings",
    name: "Savings Calculator",
    category: "Financial",
    description: "See how regular deposits can build savings over time.",
    icon: "PiggyBank",
    fields: [
      f("initial", "Starting balance", "1000", "USD"),
      f("deposit", "Monthly deposit", "150", "USD"),
      f("rate", "Annual interest rate", "4", "%", 0, 0.1),
      f("years", "Saving period", "5", "years", 1),
    ],
    calculate(v) {
      let b = val(v, "initial"),
        con = b;
      const r = val(v, "rate") / 1200,
        n = val(v, "years") * 12,
        chart = [];
      for (let i = 1; i <= n; i++) {
        b = b * (1 + r) + val(v, "deposit");
        con += val(v, "deposit");
        if (i % 12 === 0)
          chart.push({
            label: `Year ${i / 12}`,
            value: b,
            principal: con,
            interest: b - con,
          });
      }
      return {
        headline: "Future savings",
        value: money(b),
        description: "Estimated balance after your saving period.",
        metrics: [
          { label: "Your deposits", value: money(con) },
          { label: "Interest earned", value: money(b - con) },
        ],
        chart,
        chartTitle: "Savings growth",
        chartKind: "area",
        breakdown: [
          { label: "Deposits", value: con },
          { label: "Interest", value: b - con },
        ],
      };
    },
  },
  {
    slug: "bmi",
    name: "BMI Calculator",
    category: "Health & Fitness",
    description: "Calculate body mass index from your height and weight.",
    icon: "Activity",
    featured: true,
    fields: [
      f("weight", "Weight", "70", "kg", 1, 0.1),
      f("height", "Height", "175", "cm", 1, 0.1),
    ],
    calculate(v) {
      const bmi = val(v, "weight") / Math.pow(val(v, "height") / 100, 2);
      const category =
        bmi < 18.5
          ? "Underweight"
          : bmi < 25
            ? "Healthy range"
            : bmi < 30
              ? "Overweight"
              : "Obesity range";
      return {
        headline: "Your body mass index",
        value: number(bmi),
        description: category,
        metrics: [
          { label: "Healthy BMI range", value: "18.5 – 24.9" },
          { label: "Weight", value: `${number(val(v, "weight"))} kg` },
          { label: "Height", value: `${number(val(v, "height"))} cm` },
        ],
        chart: [
          { label: "Underweight", value: 18.5 },
          { label: "Healthy", value: 6.5 },
          { label: "Overweight", value: 5 },
          { label: "Obesity", value: 10 },
        ],
        chartTitle: "BMI classification bands",
        chartKind: "bar",
        note: "BMI is a screening measure, not a diagnosis. It does not directly measure body fat or account for every individual difference.",
      };
    },
  },
  {
    slug: "bmr",
    name: "BMR Calculator",
    category: "Health & Fitness",
    description:
      "Estimate the calories your body uses at rest using the Mifflin–St Jeor equation.",
    icon: "Flame",
    fields: [
      f("weight", "Weight", "70", "kg", 1, 0.1),
      f("height", "Height", "175", "cm", 1, 0.1),
      f("age", "Age", "28", "years", 1),
      select("sex", "Equation setting", "male", [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
      ]),
    ],
    calculate(v) {
      const base =
        10 * val(v, "weight") +
        6.25 * val(v, "height") -
        5 * val(v, "age") +
        (v.sex === "male" ? 5 : -161);
      return {
        headline: "Estimated resting calories",
        value: `${number(base, 0)} kcal/day`,
        description: "Basal metabolic rate (BMR) estimate.",
        metrics: [
          {
            label: "Sedentary estimate",
            value: `${number(base * 1.2, 0)} kcal/day`,
          },
          {
            label: "Moderately active",
            value: `${number(base * 1.55, 0)} kcal/day`,
          },
          {
            label: "Very active",
            value: `${number(base * 1.725, 0)} kcal/day`,
          },
        ],
        chart: [
          { label: "Resting", value: base },
          { label: "Sedentary", value: base * 1.2 },
          { label: "Moderate", value: base * 1.55 },
          { label: "Very active", value: base * 1.725 },
        ],
        chartTitle: "Estimated daily energy by activity",
        chartKind: "bar",
        note: "Uses Mifflin–St Jeor. Actual energy needs vary with body composition, health, and activity.",
      };
    },
  },
  {
    slug: "calorie",
    name: "Calorie Calculator",
    category: "Health & Fitness",
    description:
      "Estimate daily calorie needs based on body measurements and activity.",
    icon: "Apple",
    fields: [
      f("weight", "Weight", "70", "kg", 1, 0.1),
      f("height", "Height", "175", "cm", 1, 0.1),
      f("age", "Age", "28", "years", 1),
      select("sex", "Equation setting", "male", [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
      ]),
      select("activity", "Activity level", "1.55", [
        { label: "Sedentary", value: "1.2" },
        { label: "Lightly active", value: "1.375" },
        { label: "Moderately active", value: "1.55" },
        { label: "Very active", value: "1.725" },
        { label: "Extra active", value: "1.9" },
      ]),
    ],
    calculate(v) {
      const bmr =
          10 * val(v, "weight") +
          6.25 * val(v, "height") -
          5 * val(v, "age") +
          (v.sex === "male" ? 5 : -161),
        tdee = bmr * val(v, "activity");
      return {
        headline: "Estimated daily calories",
        value: `${number(tdee, 0)} kcal`,
        description: "Approximate calories to maintain your current weight.",
        metrics: [
          { label: "BMR", value: `${number(bmr, 0)} kcal` },
          {
            label: "Mild deficit (illustrative)",
            value: `${number(tdee - 250, 0)} kcal`,
          },
          {
            label: "Mild surplus (illustrative)",
            value: `${number(tdee + 250, 0)} kcal`,
          },
        ],
        chart: [
          { label: "BMR", value: bmr },
          { label: "Maintenance", value: tdee },
          { label: "+250", value: tdee + 250 },
        ],
        chartTitle: "Daily calorie estimates",
        chartKind: "bar",
        note: "Estimates are not a medical or diet prescription. Individual needs vary; seek qualified advice for weight or health concerns.",
      };
    },
  },
  {
    slug: "ideal-weight",
    name: "Ideal Weight Calculator",
    category: "Health & Fitness",
    description:
      "Compare several traditional height-based ideal-weight estimates.",
    icon: "Scale",
    fields: [
      f("height", "Height", "175", "cm", 100, 0.1),
      select("sex", "Equation setting", "male", [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
      ]),
    ],
    calculate(v) {
      const inches = val(v, "height") / 2.54 - 60,
        base = v.sex === "male" ? 50 : 45.5,
        kg = Math.max(0, base + 2.3 * inches);
      return {
        headline: "Reference weight estimate",
        value: `${number(kg)} kg`,
        description: "Devine formula estimate for the entered height.",
        metrics: [
          { label: "In pounds", value: `${number(kg * 2.20462)} lb` },
          { label: "Height", value: `${number(val(v, "height"))} cm` },
        ],
        note: "Traditional ideal-weight equations are rough population references, not a personal health target. They do not account for body composition or individual health.",
      };
    },
  },
  {
    slug: "percentage",
    name: "Percentage Calculator",
    category: "Math",
    description:
      "Find what percentage one number is of another, with a clear calculation.",
    icon: "Percent",
    featured: true,
    fields: [
      f("part", "Part / value", "25", "", 0, 0.01),
      f("whole", "Whole / total", "200", "", 0, 0.01),
    ],
    calculate(v) {
      const p =
        val(v, "whole") === 0 ? 0 : (val(v, "part") / val(v, "whole")) * 100;
      return {
        headline: "Percentage",
        value: pct(p),
        description: `${number(val(v, "part"))} is ${pct(p)} of ${number(val(v, "whole"))}.`,
        metrics: [
          { label: "Part", value: number(val(v, "part")) },
          { label: "Whole", value: number(val(v, "whole")) },
        ],
        breakdown: [
          { label: "Part", value: Math.abs(val(v, "part")) },
          {
            label: "Remaining",
            value: Math.max(0, Math.abs(val(v, "whole") - val(v, "part"))),
          },
        ],
        chart: [
          { label: "Part", value: Math.abs(val(v, "part")) },
          {
            label: "Other",
            value: Math.max(0, Math.abs(val(v, "whole") - val(v, "part"))),
          },
        ],
        chartTitle: "Part of the whole",
        chartKind: "pie",
        note: "When the whole is zero, the percentage is defined here as 0 to avoid division by zero.",
      };
    },
  },
  {
    slug: "age",
    name: "Age Calculator",
    category: "Other",
    description:
      "Calculate your age in years, months and days from a date of birth.",
    icon: "CalendarDays",
    fields: [
      {
        name: "birth",
        label: "Date of birth",
        type: "date",
        defaultValue: "1998-12-13",
      },
      {
        name: "asOf",
        label: "Age on date",
        type: "date",
        defaultValue: "2026-11-03",
      },
    ],
    calculate(v) {
      const a = new Date(v.birth + "T00:00:00"),
        b = new Date(v.asOf + "T00:00:00");
      if (b < a)
        throw new Error("The end date must be on or after the date of birth.");
      let years = b.getFullYear() - a.getFullYear(),
        months = b.getMonth() - a.getMonth(),
        days = b.getDate() - a.getDate();
      if (days < 0) {
        months--;
        days += new Date(b.getFullYear(), b.getMonth(), 0).getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }
      const total = Math.floor((b.getTime() - a.getTime()) / 86400000);
      return {
        headline: "Your age",
        value: `${years} years`,
        description: `${years} years, ${months} months and ${days} days`,
        metrics: [
          {
            label: "Total months (approx.)",
            value: number(total / 30.436875, 0),
          },
          { label: "Total days", value: number(total, 0) },
          {
            label: "Next birthday",
            value: `${new Date(b.getFullYear() + (b.getMonth() > a.getMonth() || (b.getMonth() === a.getMonth() && b.getDate() >= a.getDate()) ? 1 : 0), a.getMonth(), a.getDate()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
          },
        ],
        note: "Calendar age is calculated using the supplied dates and local calendar days.",
      };
    },
  },
  {
    slug: "date-difference",
    name: "Date Difference Calculator",
    category: "Other",
    description: "Find the time between two calendar dates.",
    icon: "CalendarRange",
    fields: [
      {
        name: "start",
        label: "Start date",
        type: "date",
        defaultValue: "2026-01-01",
      },
      {
        name: "end",
        label: "End date",
        type: "date",
        defaultValue: "2026-11-03",
      },
    ],
    calculate(v) {
      const a = new Date(v.start + "T00:00:00"),
        b = new Date(v.end + "T00:00:00");
      if (b < a) throw new Error("End date must be on or after start date.");
      const days = Math.round((b.getTime() - a.getTime()) / 86400000);
      return {
        headline: "Time between dates",
        value: `${number(days, 0)} days`,
        description: "Difference between the selected calendar dates.",
        metrics: [
          { label: "Weeks", value: number(days / 7, 1) },
          { label: "Hours", value: number(days * 24, 0) },
          { label: "Minutes", value: number(days * 1440, 0) },
        ],
        note: "The end date is exclusive of an additional day; this is the elapsed calendar-day difference.",
      };
    },
  },
  {
    slug: "gpa",
    name: "GPA Calculator",
    category: "Other",
    description:
      "Calculate a weighted GPA from course grades and credit hours.",
    icon: "GraduationCap",
    fields: [
      f("creditsA", "Course 1 credits", "3", "credits", 0, 0.5),
      f("gradeA", "Course 1 grade points", "4", "points", 0, 0.1),
      f("creditsB", "Course 2 credits", "3", "credits", 0, 0.5),
      f("gradeB", "Course 2 grade points", "3.7", "points", 0, 0.1),
      f("creditsC", "Course 3 credits", "3", "credits", 0, 0.5),
      f("gradeC", "Course 3 grade points", "3.3", "points", 0, 0.1),
    ],
    calculate(v) {
      const credits = [
          val(v, "creditsA"),
          val(v, "creditsB"),
          val(v, "creditsC"),
        ],
        grades = [val(v, "gradeA"), val(v, "gradeB"), val(v, "gradeC")],
        total = credits.reduce((a, b) => a + b, 0),
        gpa = total
          ? credits.reduce((s, c, i) => s + c * grades[i], 0) / total
          : 0;
      return {
        headline: "Weighted GPA",
        value: number(gpa, 2),
        description: "Based on the three courses entered.",
        metrics: [
          { label: "Total credits", value: number(total, 1) },
          { label: "Quality points", value: number(gpa * total, 2) },
        ],
        chart: grades.map((g, i) => ({ label: `Course ${i + 1}`, value: g })),
        chartTitle: "Grade points by course",
        chartKind: "bar",
        note: "This simple version supports three courses and assumes all grades use the same grade-point scale. Confirm your institution's grading rules.",
      };
    },
  },
  {
    slug: "tip",
    name: "Tip Calculator",
    category: "Other",
    description: "Split a bill and calculate a tip per person.",
    icon: "Receipt",
    fields: [
      f("bill", "Bill amount", "85", "USD", 0, 0.01),
      f("tip", "Tip percentage", "15", "%", 0, 0.5),
      f("people", "Number of people", "2", "people", 1, 1),
    ],
    calculate(v) {
      const bill = val(v, "bill"),
        tip = (bill * val(v, "tip")) / 100,
        total = bill + tip,
        people = Math.max(1, val(v, "people"));
      return {
        headline: "Total per person",
        value: money(total / people),
        description: "Bill plus tip, split evenly.",
        metrics: [
          { label: "Tip amount", value: money(tip) },
          { label: "Total bill", value: money(total) },
          { label: "Per-person tip", value: money(tip / people) },
        ],
        breakdown: [
          { label: "Bill", value: bill },
          { label: "Tip", value: tip },
        ],
        chart: [
          { label: "Bill", value: bill },
          { label: "Tip", value: tip },
        ],
        chartTitle: "Bill breakdown",
        chartKind: "pie",
      };
    },
  },
  {
    slug: "fuel-cost",
    name: "Fuel Cost Calculator",
    category: "Other",
    description:
      "Estimate the fuel cost of a journey from distance, efficiency and fuel price.",
    icon: "Fuel",
    fields: [
      f("distance", "Journey distance", "350", "km", 0, 0.1),
      f("efficiency", "Fuel efficiency", "12", "km/L", 0.01, 0.1),
      f("price", "Fuel price", "280", "PKR/L", 0, 0.1),
    ],
    calculate(v) {
      const liters = val(v, "distance") / val(v, "efficiency"),
        cost = liters * val(v, "price");
      return {
        headline: "Estimated fuel cost",
        value: `PKR ${number(cost)}`,
        description: "Estimated fuel required for the entered journey.",
        metrics: [
          { label: "Fuel required", value: `${number(liters)} L` },
          {
            label: "Cost per km",
            value: `PKR ${number(val(v, "price") / val(v, "efficiency"))}`,
          },
          { label: "Distance", value: `${number(val(v, "distance"))} km` },
        ],
        note: "Actual fuel use varies with traffic, driving style, load, terrain and vehicle condition.",
      };
    },
  },
  {
    slug: "random-number",
    name: "Random Number Generator",
    category: "Math",
    description:
      "Generate a random integer within an inclusive minimum and maximum range.",
    icon: "Shuffle",
    fields: [
      f("min", "Minimum", "1", "", -1000000000, 1),
      f("max", "Maximum", "100", "", -1000000000, 1),
      f("count", "How many numbers", "1", "", 1, 1),
    ],
    calculate(v) {
      const min = Math.ceil(val(v, "min")),
        max = Math.floor(val(v, "max")),
        count = Math.min(100, Math.max(1, Math.floor(val(v, "count"))));
      if (max < min)
        throw new Error("Maximum must be greater than or equal to minimum.");
      const nums = Array.from(
        { length: count },
        () => Math.floor(Math.random() * (max - min + 1)) + min,
      );
      return {
        headline: "Generated number" + (count > 1 ? "s" : ""),
        value: nums.join(", "),
        description: `${count} random integer${count > 1 ? "s" : ""} from ${min} to ${max}, inclusive.`,
        metrics: [
          { label: "Minimum", value: number(min, 0) },
          { label: "Maximum", value: number(max, 0) },
          { label: "Count", value: String(count) },
        ],
        note: "Generated with the browser's Math.random() function; not suitable for cryptographic or security-sensitive use.",
      };
    },
  },
  {
    slug: "unit-conversion",
    name: "Length Converter",
    category: "Other",
    description: "Convert between common metric and imperial length units.",
    icon: "ArrowLeftRight",
    fields: [
      f("amount", "Value", "10", "", 0, 0.01),
      select("from", "From unit", "m", [
        { label: "Meters (m)", value: "m" },
        { label: "Kilometers (km)", value: "km" },
        { label: "Centimeters (cm)", value: "cm" },
        { label: "Feet (ft)", value: "ft" },
        { label: "Inches (in)", value: "in" },
        { label: "Miles (mi)", value: "mi" },
      ]),
      select("to", "To unit", "ft", [
        { label: "Meters (m)", value: "m" },
        { label: "Kilometers (km)", value: "km" },
        { label: "Centimeters (cm)", value: "cm" },
        { label: "Feet (ft)", value: "ft" },
        { label: "Inches (in)", value: "in" },
        { label: "Miles (mi)", value: "mi" },
      ]),
    ],
    calculate(v) {
      const factor: Record<string, number> = {
          m: 1,
          km: 1000,
          cm: 0.01,
          ft: 0.3048,
          in: 0.0254,
          mi: 1609.344,
        },
        result = (val(v, "amount") * factor[v.from]) / factor[v.to];
      return {
        headline: "Converted value",
        value: `${number(result, 6)} ${v.to}`,
        description: `${number(val(v, "amount"))} ${v.from} equals ${number(result, 6)} ${v.to}.`,
        metrics: [
          {
            label: "Original value",
            value: `${number(val(v, "amount"))} ${v.from}`,
          },
          {
            label: "Conversion factor",
            value: number(factor[v.from] / factor[v.to], 8),
          },
        ],
      };
    },
  },
  ...financialExtras,
  ...healthExtras,
  ...mathExtras,
];
export const calculators = defs;
export const getCalculator = (slug: string) =>
  defs.find((d) => d.slug === slug);
export const categories = [
  {
    name: "Financial",
    description: "Plan borrowing, saving and long-term growth.",
    icon: "Wallet",
  },
  {
    name: "Health & Fitness",
    description: "Understand everyday health and fitness estimates.",
    icon: "Activity",
  },
  {
    name: "Math",
    description: "Solve common numerical problems with clarity.",
    icon: "Sigma",
  },
  {
    name: "Other",
    description: "Date, education, travel and practical everyday tools.",
    icon: "Grid3X3",
  },
];
export function calculate(
  slug: string,
  values: Record<string, string>,
): CalculationResult {
  const def = getCalculator(slug);
  if (!def) throw new Error("Calculator not found.");
  for (const field of def.fields) {
    if (!values[field.name] && values[field.name] !== "0")
      throw new Error(`${field.label} is required.`);
    if (field.type === "number") {
      const n = Number(values[field.name]);
      if (!Number.isFinite(n))
        throw new Error(`${field.label} must be a valid number.`);
      if (field.min !== undefined && n < field.min)
        throw new Error(`${field.label} must be at least ${field.min}.`);
      if (field.max !== undefined && n > field.max)
        throw new Error(`${field.label} must be no more than ${field.max}.`);
    }
  }
  return def.calculate(values);
}
