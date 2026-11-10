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

import { calculators } from "../src/lib/calculators/definitions";
import { calculatorArticles } from "../src/lib/calculators/articles";
import catalog from "../src/lib/calculators/catalog.json";

describe("SEO content and directory", () => {
  it("has bespoke articles or generated guide coverage for every calculator", () => {
    expect(
      calculators.every(
        (c) => calculatorArticles[c.slug] || c.category === "Financial",
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
  it("contains the four reference categories and 204 sitemap calculator entries", () => {
    expect(new Set(catalog.map((item) => item.category))).toEqual(
      new Set(["Financial", "Health & Fitness", "Math", "Other"]),
    );
    expect(catalog).toHaveLength(204);
  });
});
