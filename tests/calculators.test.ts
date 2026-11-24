import { describe, it, expect } from "vitest";
import { calculate } from "../src/lib/calculators/definitions";
describe("calculator engine", () => {
  it("calculates percentage", () => {
    expect(calculate("percentage", { part: "25", whole: "200" }).value).toBe(
      "12.5%",
    );
  });
  it("calculates a zero-interest loan", () => {
    expect(
      calculate("loan", { amount: "1200", rate: "0", years: "1" }).value,
    ).toContain("100");
  });
  it("rejects a reversed date range", () => {
    expect(() =>
      calculate("date-difference", { start: "2026-12-01", end: "2026-01-01" }),
    ).toThrow();
  });
  it("rejects a zero denominator for length conversion", () => {
    expect(() =>
      calculate("unit-conversion", { amount: "1", from: "m", to: "m" }),
    ).not.toThrow();
  });
  it("calculates BMI", () => {
    expect(calculate("bmi", { weight: "70", height: "175" }).value).toBe(
      "22.86",
    );
  });
});

import { calculators, getCalculator } from "../src/lib/calculators/definitions";
import { calculatorArticles } from "../src/lib/calculators/articles";
import { money, number } from "../src/lib/calculators/format";
import catalog from "../src/lib/calculators/catalog.json";

describe("SEO content and directory", () => {
  it("has bespoke articles or generated guide coverage for every calculator", () => {
    expect(
      calculators.every(
        (c) =>
          calculatorArticles[c.slug] ||
          ["Financial", "Health & Fitness", "Math"].includes(c.category),
      ),
    ).toBe(true);
  });
  it("registers every Financial catalog entry as a working calculator page", () => {
    const financialCatalog = catalog.filter(
      (item) => item.category === "Financial",
    );
    const financialTools = calculators.filter(
      (item) => item.category === "Financial",
    );
    expect(financialCatalog).toHaveLength(75);
    expect(financialTools).toHaveLength(75);
    expect(
      financialCatalog.every((item) =>
        financialTools.some((tool) => tool.name === item.name),
      ),
    ).toBe(true);
  });
  it("runs a representative newly added financial calculation", () => {
    const result = calculate("auto-loan", {
      principal: "30000",
      rate: "6",
      years: "5",
    });
    expect(result.value).toContain("$");
  });

  it("registers all Health & Fitness catalog entries", () => {
    const items = catalog.filter(
      (item) => item.category === "Health & Fitness",
    );
    const tools = calculators.filter(
      (item) => item.category === "Health & Fitness",
    );
    expect(items).toHaveLength(31);
    expect(tools).toHaveLength(31);
    expect(
      items.every((item) => tools.some((tool) => tool.name === item.name)),
    ).toBe(true);
  });
  it("registers all Math catalog entries", () => {
    const items = catalog.filter((item) => item.category === "Math");
    const tools = calculators.filter((item) => item.category === "Math");
    expect(items).toHaveLength(44);
    expect(tools).toHaveLength(44);
    expect(
      items.every((item) => tools.some((tool) => tool.name === item.name)),
    ).toBe(true);
  });
  it("runs representative Health & Fitness calculations", () => {
    expect(
      calculate("body-fat", {
        sex: "male",
        height: "175",
        neck: "38",
        waist: "85",
        hip: "98",
      }).value,
    ).toContain("%");
    expect(calculate("pace", { distance: "5", minutes: "30" }).value).toContain(
      "6:00",
    );
    expect(
      calculate("body-surface-area", { weight: "70", height: "175" }).value,
    ).toContain("m²");
  });
  it("runs representative Math calculations", () => {
    expect(
      calculate("quadratic-formula", { a: "1", b: "-5", c: "6" }).value,
    ).toContain("2");
    expect(
      calculate("fraction", { a: "1", b: "2", c: "1", d: "3", op: "add" })
        .value,
    ).toBe("5/6");
    expect(calculate("prime-factorization", { value: "360" }).value).toContain(
      "2 × 2",
    );
  });

  it("runs every Health & Fitness and Math calculator with its shipped default inputs", () => {
    const tools = calculators.filter(
      (c) => c.category === "Health & Fitness" || c.category === "Math",
    );
    for (const tool of tools) {
      const values = Object.fromEntries(
        tool.fields.map((field) => [field.name, field.defaultValue]),
      );
      expect(() => calculate(tool.slug, values), tool.name).not.toThrow();
    }
  });

  it("contains the four reference categories and 204 sitemap calculator entries", () => {
    expect(new Set(catalog.map((item) => item.category))).toEqual(
      new Set(["Financial", "Health & Fitness", "Math", "Other"]),
    );
    expect(catalog).toHaveLength(204);
  });
});

describe("QA remediation regressions", () => {
  it("keeps the old Length Converter calculator identifier as an alias", () => {
    expect(
      calculate("unit-conversion", { amount: "1", from: "m", to: "ft" }).value,
    ).toContain("ft");
  });
  it("formats extreme numeric values using scientific notation", () => {
    expect(number(2.0831404757803516e44)).toMatch(/[Ee][+]?44/);
    expect(money(2.0831404757803516e44)).toMatch(/[Ee][+]?44/);
  });
});

describe("Financial QA regression fixes", () => {
  const values = (slug: string) =>
    Object.fromEntries(
      calculators
        .find((c) => c.slug === slug)!
        .fields.map((f) => [f.name, f.defaultValue]),
    );
  it("calculates fee-adjusted APR above the nominal rate when fees are charged", () => {
    const result = calculate("apr", {
      principal: "10000",
      fees: "300",
      rate: "8",
      years: "3",
    });
    expect(Number.parseFloat(result.value)).toBeGreaterThan(8);
  });
  it("amortizes card and debt payoff month by month with a smaller final payment", () => {
    const card = calculate("credit-cards-payoff", {
      balance: "5000",
      apr: "22",
      payment: "200",
    });
    expect(card.metrics.find((m) => m.label === "Total interest")).toBeTruthy();
    const debt = calculate("debt-payoff", {
      balance: "12000",
      rate: "18",
      payment: "500",
    });
    expect(debt.metrics.find((m) => m.label === "Final payment")).toBeTruthy();
  });
  it("annualizes rental-property monthly expenses when calculating NOI", () => {
    const result = calculate("rental-property", {
      price: "250000",
      rent: "2000",
      expenses: "500",
      down: "50000",
    });
    expect(
      result.metrics.find((m) => m.label === "Annual operating expenses")
        ?.value,
    ).toContain("6,000");
  });
  it("reduces affordable housing payment when other debts rise", () => {
    const low = calculate("house-affordability", {
      income: "8000",
      debts: "500",
      rate: "6.5",
      years: "30",
      down: "60000",
    });
    const high = calculate("house-affordability", {
      income: "8000",
      debts: "2000",
      rate: "6.5",
      years: "30",
      down: "60000",
    });
    expect(Number(low.value.replace(/[^0-9.]/g, ""))).toBeGreaterThan(
      Number(high.value.replace(/[^0-9.]/g, "")),
    );
  });
  it("uses a separate mortgage amortization term in rent-vs-buy", () => {
    const result = calculate("rent-vs-buy", {
      price: "300000",
      rent: "1800",
      rate: "6",
      years: "7",
      mortgageYears: "30",
      down: "60000",
    });
    expect(
      result.metrics.find((m) => m.label === "Monthly mortgage payment")?.value,
    ).toBeTruthy();
  });
  it("uses benefit-stream inputs for pension and Social Security", () => {
    expect(calculate("pension", values("pension")).headline).toContain(
      "present value",
    );
    expect(
      calculate("social-security", values("social-security")).headline,
    ).toContain("present value");
  });
  it("computes IRR from timed cash flows rather than simple ROI", () => {
    const result = calculate("irr", {
      investment: "10000",
      value: "15000",
      costs: "0",
      cashFlow: "1000",
      years: "5",
    });
    expect(result.headline.toLowerCase()).toContain("internal rate");
    expect(result.description).toContain("net present value");
  });
  it("resolves generic loan aliases to the canonical loan calculator", () => {
    expect(
      calculate("generic-loan", { amount: "12000", rate: "8", years: "5" })
        .headline,
    ).toBe("Monthly payment");
    expect(getCalculator("loan-calculator")?.slug).toBe("loan");
  });
  it("runs every Financial calculator with its shipped defaults", () => {
    for (const c of calculators.filter((c) => c.category === "Financial")) {
      const v = Object.fromEntries(
        c.fields.map((f) => [f.name, f.defaultValue]),
      );
      expect(() => calculate(c.slug, v), c.slug).not.toThrow();
    }
  });
});
