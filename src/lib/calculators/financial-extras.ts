import type {
  CalculatorDefinition,
  CalculationResult,
  CalculatorField,
} from "./types";

const num = (v: Record<string, string>, k: string) => Number(v[k] ?? 0);
const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);
const fmt = (n: number, d = 2) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: d }).format(
    Number.isFinite(n) ? n : 0,
  );
const field = (
  name: string,
  label: string,
  def: string,
  unit?: string,
  min = 0,
  step = 1,
): CalculatorField => ({
  name,
  label,
  type: "number",
  defaultValue: def,
  unit,
  min,
  step,
});
const baseFields: Record<string, CalculatorField[]> = {
  amortizing: [
    field("principal", "Amount financed", "25000", "USD", 0, 0.01),
    field("rate", "Annual interest rate", "7", "%", 0, 0.01),
    field("years", "Term", "5", "years", 0.1, 0.5),
  ],
  "simple-interest": [
    field("principal", "Principal", "10000", "USD", 0, 0.01),
    field("rate", "Annual simple interest rate", "5", "%", 0, 0.01),
    field("years", "Time", "3", "years", 0, 0.1),
  ],
  retirement: [
    field("balance", "Current retirement balance", "25000", "USD", 0, 0.01),
    field("contribution", "Monthly contribution", "500", "USD", 0, 0.01),
    field("return", "Expected annual return", "6", "%", 0, 0.1),
    field("years", "Years until retirement", "25", "years", 1, 1),
  ],
  investment: [
    field("initial", "Initial investment", "10000", "USD", 0, 0.01),
    field("contribution", "Monthly contribution", "200", "USD", 0, 0.01),
    field("return", "Annual return", "7", "%", -99, 0.1),
    field("years", "Investment period", "10", "years", 1, 1),
  ],
  currency: [
    field("amount", "Amount to convert", "100", "units", 0, 0.01),
    field(
      "rate",
      "Exchange rate (target units per 1 source unit)",
      "1.35",
      "",
      0,
      0.0001,
    ),
  ],
  inflation: [
    field("amount", "Current amount", "1000", "USD", 0, 0.01),
    field("inflation", "Annual inflation rate", "3", "%", -99, 0.1),
    field("years", "Years", "10", "years", 0, 1),
  ],
  payoff: [
    field("balance", "Remaining balance", "180000", "USD", 0, 0.01),
    field("rate", "Annual interest rate", "6", "%", 0, 0.01),
    field("payment", "Monthly payment", "1400", "USD", 0.01, 0.01),
    field("extra", "Extra monthly payment", "100", "USD", 0, 0.01),
  ],
  tax: [
    field("income", "Annual taxable income", "75000", "USD", 0, 0.01),
    field("rate", "Estimated effective tax rate", "18", "%", 0, 0.1),
  ],
  salary: [
    field("gross", "Gross pay per period", "5000", "USD", 0, 0.01),
    field("tax", "Estimated deductions rate", "20", "%", 0, 0.1),
    field("periods", "Pay periods per year", "12", "", 1, 1),
  ],
  "tax-percent": [
    field("price", "Taxable amount", "100", "USD", 0, 0.01),
    field("rate", "Tax rate", "8", "%", 0, 0.01),
  ],
  "rate-solve": [
    field("principal", "Starting amount", "10000", "USD", 0, 0.01),
    field("future", "Ending amount", "15000", "USD", 0, 0.01),
    field("years", "Time period", "5", "years", 0.01, 0.1),
  ],
  affordability: [
    field("income", "Gross monthly household income", "8000", "USD", 0, 0.01),
    field("debts", "Other monthly debt payments", "500", "USD", 0, 0.01),
    field("rate", "Mortgage annual rate", "6.5", "%", 0, 0.01),
    field("years", "Mortgage term", "30", "years", 1, 1),
    field("down", "Down payment available", "60000", "USD", 0, 0.01),
  ],
  rent: [
    field("monthly", "Monthly rent", "1500", "USD", 0, 0.01),
    field("utilities", "Monthly utilities and fees", "200", "USD", 0, 0.01),
    field("income", "Monthly take-home income", "5000", "USD", 0, 0.01),
  ],
  annuity: [
    field("principal", "Starting principal", "250000", "USD", 0, 0.01),
    field("rate", "Annual return / discount rate", "5", "%", 0, 0.01),
    field("years", "Years", "20", "years", 1, 1),
  ],
  "annuity-payout": [
    field("principal", "Annuity value", "250000", "USD", 0, 0.01),
    field("rate", "Annual rate", "4", "%", 0, 0.01),
    field("years", "Payout period", "20", "years", 1, 1),
  ],
  "credit-card": [
    field("balance", "Card balance", "5000", "USD", 0, 0.01),
    field("apr", "Annual percentage rate", "22", "%", 0, 0.01),
    field("payment", "Monthly payment", "200", "USD", 0.01, 0.01),
  ],
  "debt-payoff": [
    field("balance", "Total debt balance", "12000", "USD", 0, 0.01),
    field("rate", "Average annual interest rate", "18", "%", 0, 0.01),
    field("payment", "Monthly payment", "500", "USD", 0.01, 0.01),
  ],
  college: [
    field("annual", "Current annual college cost", "25000", "USD", 0, 0.01),
    field("inflation", "Annual cost increase", "4", "%", 0, 0.1),
    field("years", "Years until enrollment", "5", "years", 0, 1),
    field("duration", "Study duration", "4", "years", 1, 1),
  ],
  compound: [
    field("principal", "Deposit amount", "10000", "USD", 0, 0.01),
    field("rate", "Annual interest rate", "4", "%", 0, 0.01),
    field("years", "Term", "5", "years", 0, 1),
    field("periods", "Compounds per year", "12", "", 1, 1),
  ],
  bond: [
    field("face", "Face value", "1000", "USD", 0, 0.01),
    field("coupon", "Annual coupon rate", "5", "%", 0, 0.01),
    field("market", "Market price", "950", "USD", 0.01, 0.01),
  ],
  rmd: [
    field("balance", "Retirement account balance", "500000", "USD", 0, 0.01),
    field(
      "factor",
      "Applicable distribution period factor",
      "25.5",
      "years",
      0.01,
      0.01,
    ),
  ],
  cashback: [
    field("spend", "Planned purchase amount", "3000", "USD", 0, 0.01),
    field("cashback", "Cash-back percentage", "3", "%", 0, 0.01),
    field("promo", "Alternative promotional discount", "100", "USD", 0, 0.01),
    field("apr", "Alternative financing APR", "0", "%", 0, 0.01),
    field("months", "Financing months", "12", "months", 1, 1),
  ],
  lease: [
    field("price", "Vehicle / asset price", "35000", "USD", 0, 0.01),
    field("residual", "Expected residual value", "20000", "USD", 0, 0.01),
    field("rate", "Annual money factor equivalent rate", "5", "%", 0, 0.01),
    field("months", "Lease term", "36", "months", 1, 1),
    field("down", "Amount due at signing", "3000", "USD", 0, 0.01),
  ],
  depreciation: [
    field("cost", "Asset purchase cost", "30000", "USD", 0, 0.01),
    field("salvage", "Salvage value", "5000", "USD", 0, 0.01),
    field("years", "Useful life", "5", "years", 1, 1),
    field("age", "Elapsed years", "2", "years", 0, 0.1),
  ],
  "average-return": [
    field("start", "Beginning value", "10000", "USD", 0.01, 0.01),
    field("end", "Ending value", "16000", "USD", 0.01, 0.01),
    field("years", "Years held", "5", "years", 0.01, 0.1),
  ],
  margin: [
    field("cost", "Cost", "60", "USD", 0, 0.01),
    field("price", "Selling price", "100", "USD", 0.01, 0.01),
  ],
  discount: [
    field("price", "Original price", "120", "USD", 0, 0.01),
    field("discount", "Discount percentage", "20", "%", 0, 0.01),
  ],
  dti: [
    field("debts", "Total monthly debt payments", "1800", "USD", 0, 0.01),
    field("income", "Gross monthly income", "6000", "USD", 0.01, 0.01),
  ],
  "real-estate": [
    field("price", "Property value", "250000", "USD", 0, 0.01),
    field("rent", "Monthly rental income", "1800", "USD", 0, 0.01),
    field("expenses", "Annual operating expenses", "6000", "USD", 0, 0.01),
  ],
  "rental-property": [
    field("price", "Property purchase price", "250000", "USD", 0, 0.01),
    field("rent", "Monthly rent", "2000", "USD", 0, 0.01),
    field("expenses", "Monthly expenses", "500", "USD", 0, 0.01),
    field("down", "Initial cash invested", "50000", "USD", 0, 0.01),
  ],
  refinance: [
    field("balance", "Current mortgage balance", "250000", "USD", 0, 0.01),
    field("oldrate", "Current annual rate", "7", "%", 0, 0.01),
    field("newrate", "New annual rate", "5.5", "%", 0, 0.01),
    field("years", "Remaining term", "25", "years", 1, 1),
    field("costs", "Refinance closing costs", "5000", "USD", 0, 0.01),
  ],
  budget: [
    field("income", "Monthly after-tax income", "5000", "USD", 0, 0.01),
    field("housing", "Housing costs", "1500", "USD", 0, 0.01),
    field("needs", "Other essential expenses", "1000", "USD", 0, 0.01),
    field("wants", "Discretionary spending", "800", "USD", 0, 0.01),
    field("savings", "Savings and debt goals", "700", "USD", 0, 0.01),
  ],
  roi: [
    field("investment", "Initial investment", "10000", "USD", 0.01, 0.01),
    field("value", "Final value / proceeds", "15000", "USD", 0, 0.01),
    field("costs", "Additional costs", "500", "USD", 0, 0.01),
  ],
  apr: [
    field("principal", "Loan principal", "10000", "USD", 0.01, 0.01),
    field("fees", "Upfront fees", "300", "USD", 0, 0.01),
    field("rate", "Nominal annual interest rate", "8", "%", 0, 0.01),
    field("years", "Term", "3", "years", 0.1, 0.1),
  ],
  "down-payment": [
    field("price", "Purchase price", "300000", "USD", 0.01, 0.01),
    field("down", "Down payment percentage", "20", "%", 0, 0.01),
  ],
  "rent-vs-buy": [
    field("price", "Home purchase price", "300000", "USD", 0, 0.01),
    field("rent", "Monthly rent", "1800", "USD", 0, 0.01),
    field("rate", "Mortgage rate", "6", "%", 0, 0.01),
    field("years", "Comparison years", "7", "years", 1, 1),
    field("down", "Down payment", "60000", "USD", 0, 0.01),
  ],
  payback: [
    field("investment", "Initial investment", "25000", "USD", 0.01, 0.01),
    field("annual", "Annual net cash flow", "7500", "USD", 0.01, 0.01),
  ],
  "present-value": [
    field("future", "Future amount", "20000", "USD", 0, 0.01),
    field("rate", "Annual discount rate", "5", "%", -99, 0.01),
    field("years", "Years", "5", "years", 0, 0.1),
  ],
  "future-value": [
    field("present", "Present amount", "10000", "USD", 0, 0.01),
    field("rate", "Annual growth rate", "5", "%", -99, 0.01),
    field("years", "Years", "10", "years", 0, 0.1),
  ],
  commission: [
    field("sales", "Sales amount", "25000", "USD", 0, 0.01),
    field("rate", "Commission rate", "5", "%", 0, 0.01),
    field("base", "Base pay", "1000", "USD", 0, 0.01),
  ],
};

function result(
  headline: string,
  value: string,
  description: string,
  metrics: { label: string; value: string }[],
  chart?: { label: string; value: number }[],
  note?: string,
): CalculationResult {
  return {
    headline,
    value,
    description,
    metrics,
    chart,
    chartTitle: "Illustrative financial breakdown",
    chartKind: chart && chart.length > 2 ? "bar" : "pie",
    note:
      note ??
      "This is an educational estimate based on the values and simplified assumptions entered. It is not tax, legal, investment, lending or financial advice. Confirm local rules, fees, product terms and professional guidance before making decisions.",
  };
}
function calc(kind: string, v: Record<string, string>): CalculationResult {
  const n = (k: string) => num(v, k),
    pmt = (p: number, r: number, months: number) =>
      r === 0 ? p / months : (p * r) / (1 - Math.pow(1 + r, -months));
  switch (kind) {
    case "amortizing": {
      const p = n("principal"),
        r = n("rate") / 1200,
        months = Math.max(1, Math.round(n("years") * 12)),
        pay = pmt(p, r, months),
        total = pay * months;
      return result(
        "Estimated monthly payment",
        money(pay),
        "Fixed-payment loan estimate.",
        [
          { label: "Principal", value: money(p) },
          { label: "Total interest", value: money(total - p) },
          { label: "Total repayment", value: money(total) },
        ],
        [
          { label: "Principal", value: p },
          { label: "Interest", value: Math.max(0, total - p) },
        ],
      );
    }
    case "simple-interest": {
      const p = n("principal"),
        i = ((p * n("rate")) / 100) * n("years");
      return result(
        "Total simple interest",
        money(i),
        "Interest calculated only on the original principal.",
        [
          { label: "Principal", value: money(p) },
          { label: "Interest", value: money(i) },
          { label: "Ending amount", value: money(p + i) },
        ],
        [
          { label: "Principal", value: p },
          { label: "Interest", value: i },
        ],
      );
    }
    case "retirement":
    case "investment": {
      const b = n(kind === "retirement" ? "balance" : "initial"),
        c = n("contribution"),
        r = n("return") / 1200,
        m = Math.round(n("years") * 12);
      let x = b,
        con = b,
        chart = [];
      for (let i = 1; i <= m; i++) {
        x = x * (1 + r) + c;
        con += c;
        if (i % 12 === 0) chart.push({ label: `Year ${i / 12}`, value: x });
      }
      return result(
        "Projected account value",
        money(x),
        "Projection assumes a steady monthly contribution and constant return.",
        [
          { label: "Starting amount", value: money(b) },
          { label: "Total contributed", value: money(con) },
          { label: "Estimated growth", value: money(x - con) },
        ],
        chart,
      );
    }
    case "currency": {
      const a = n("amount"),
        r = n("rate"),
        out = a * r;
      return result(
        "Converted amount",
        fmt(out, 4),
        "Uses the exchange rate entered by you.",
        [
          { label: "Source amount", value: fmt(a) },
          { label: "Exchange rate", value: fmt(r, 6) },
        ],
      );
    }
    case "inflation": {
      const a = n("amount"),
        r = n("inflation") / 100,
        y = n("years"),
        future = a * Math.pow(1 + r, y);
      return result(
        "Equivalent future cost",
        money(future),
        `Estimated cost after ${fmt(y, 1)} years of inflation.`,
        [
          { label: "Current amount", value: money(a) },
          { label: "Increase", value: money(future - a) },
          {
            label: "Purchasing power of current amount",
            value: money(a / Math.pow(1 + r, y)),
          },
        ],
        [
          { label: "Today", value: a },
          { label: "Future", value: future },
        ],
      );
    }
    case "payoff":
    case "credit-card":
    case "debt-payoff": {
      const b = n("balance"),
        r = n(kind === "credit-card" ? "apr" : "rate") / 1200,
        pay = n(kind === "payoff" ? "payment" : "payment") + n("extra");
      if (r > 0 && pay <= b * r)
        throw new Error(
          "Payment must be greater than the first month's interest.",
        );
      const months =
        r === 0
          ? Math.ceil(b / pay)
          : Math.ceil(-Math.log(1 - (r * b) / pay) / Math.log(1 + r));
      const total = r === 0 ? b : (pay * (1 - Math.pow(1 + r, -months))) / r;
      return result(
        "Estimated payoff time",
        `${months} months`,
        "Assumes the payment remains constant and no new charges are added.",
        [
          { label: "Monthly payment", value: money(pay) },
          { label: "Estimated total paid", value: money(total) },
          { label: "Estimated interest", value: money(Math.max(0, total - b)) },
        ],
      );
    }
    case "tax": {
      const inc = n("income"),
        tax = (inc * n("rate")) / 100;
      return result(
        "Estimated tax",
        money(tax),
        "Uses a single effective tax rate entered by you, not statutory tax brackets.",
        [
          { label: "Gross taxable income", value: money(inc) },
          { label: "Effective rate", value: `${fmt(n("rate"))}%` },
          { label: "After-tax amount", value: money(inc - tax) },
        ],
        [
          { label: "Estimated tax", value: tax },
          { label: "After-tax", value: inc - tax },
        ],
        "Tax systems depend on jurisdiction, filing status, deductions, credits and tax year. This simplified effective-rate estimate is not a tax return.",
      );
    }
    case "salary": {
      const gross = n("gross"),
        net = gross * (1 - n("tax") / 100),
        annual = net * n("periods");
      return result(
        "Estimated take-home pay",
        money(net),
        "Net pay per entered pay period after the assumed deduction rate.",
        [
          { label: "Annual gross pay", value: money(gross * n("periods")) },
          { label: "Annual estimated net pay", value: money(annual) },
          {
            label: "Estimated deductions",
            value: money((gross - net) * n("periods")),
          },
        ],
      );
    }
    case "tax-percent": {
      const a = n("price"),
        t = (a * n("rate")) / 100;
      return result(
        "Tax amount",
        money(t),
        "A flat percentage applied to the taxable amount.",
        [
          { label: "Pre-tax amount", value: money(a) },
          { label: "Tax rate", value: `${fmt(n("rate"))}%` },
          { label: "Total including tax", value: money(a + t) },
        ],
        [
          { label: "Amount", value: a },
          { label: "Tax", value: t },
        ],
      );
    }
    case "rate-solve": {
      const p = n("principal"),
        f = n("future"),
        y = n("years"),
        r = (Math.pow(f / p, 1 / y) - 1) * 100;
      return result(
        "Implied annual growth rate",
        `${fmt(r)}%`,
        "Annualized compound growth rate implied by the starting and ending amounts.",
        [
          { label: "Starting amount", value: money(p) },
          { label: "Ending amount", value: money(f) },
          { label: "Period", value: `${fmt(y)} years` },
        ],
      );
    }
    case "affordability": {
      const income = n("income"),
        debts = n("debts"),
        r = n("rate") / 1200,
        months = n("years") * 12,
        maxPay = Math.max(0, income * 0.28),
        loan = maxPay * (r === 0 ? months : (1 - Math.pow(1 + r, -months)) / r),
        house = loan + n("down");
      return result(
        "Illustrative home price range",
        money(house),
        "Uses a 28% gross-income housing payment guideline before lender-specific underwriting.",
        [
          { label: "Estimated monthly housing budget", value: money(maxPay) },
          { label: "Estimated loan amount", value: money(loan) },
          { label: "Other monthly debts", value: money(debts) },
        ],
      );
    }
    case "rent": {
      const cost = n("monthly") + n("utilities"),
        income = n("income");
      return result(
        "Monthly housing cost",
        money(cost),
        "Rent plus recurring utilities and fees.",
        [
          {
            label: "Share of take-home income",
            value: `${fmt(income ? (cost / income) * 100 : 0)}%`,
          },
          { label: "Annual housing cost", value: money(cost * 12) },
          { label: "Remaining monthly income", value: money(income - cost) },
        ],
      );
    }
    case "annuity":
    case "annuity-payout": {
      const p = n("principal"),
        r = n("rate") / 1200,
        m = n("years") * 12,
        monthly =
          kind === "annuity-payout" ? pmt(p, r, m) : p * Math.pow(1 + r, m);
      return result(
        kind === "annuity-payout"
          ? "Estimated monthly payout"
          : "Future annuity value",
        money(monthly),
        kind === "annuity-payout"
          ? "Level monthly payout over the selected term."
          : "Illustrative accumulated value with monthly compounding.",
        [
          { label: "Starting value", value: money(p) },
          { label: "Term", value: `${fmt(n("years"))} years` },
          {
            label: "Total scheduled payouts",
            value: money(kind === "annuity-payout" ? monthly * m : monthly),
          },
        ],
      );
    }
    case "college": {
      let total = 0;
      for (let i = 0; i < n("duration"); i++)
        total +=
          n("annual") * Math.pow(1 + n("inflation") / 100, n("years") + i);
      return result(
        "Estimated total college cost",
        money(total),
        "Projects annual tuition and cost growth over the study period.",
        [
          {
            label: "First-year estimated cost",
            value: money(
              n("annual") * Math.pow(1 + n("inflation") / 100, n("years")),
            ),
          },
          { label: "Study duration", value: `${fmt(n("duration"), 0)} years` },
          { label: "Total projected cost", value: money(total) },
        ],
      );
    }
    case "compound": {
      const p = n("principal"),
        r = n("rate") / 100,
        periods = n("periods"),
        y = n("years"),
        fv = p * Math.pow(1 + r / periods, periods * y);
      return result(
        "Maturity value",
        money(fv),
        "Compound growth on a single deposit.",
        [
          { label: "Principal", value: money(p) },
          { label: "Interest earned", value: money(fv - p) },
          {
            label: "Effective annual rate",
            value: `${fmt((Math.pow(1 + r / periods, periods) - 1) * 100)}%`,
          },
        ],
        [
          { label: "Principal", value: p },
          { label: "Interest", value: fv - p },
        ],
      );
    }
    case "bond": {
      const face = n("face"),
        coupon = (face * n("coupon")) / 100,
        price = n("market");
      return result(
        "Current bond yield",
        `${fmt((coupon / price) * 100)}%`,
        "Annual coupon divided by current market price; not yield to maturity.",
        [
          { label: "Annual coupon", value: money(coupon) },
          { label: "Market price", value: money(price) },
          { label: "Par value", value: money(face) },
        ],
      );
    }
    case "rmd": {
      const a = n("balance"),
        f = n("factor");
      return result(
        "Estimated required distribution",
        money(a / f),
        "Account balance divided by the entered distribution period factor.",
        [
          { label: "Account balance", value: money(a) },
          { label: "Distribution factor", value: fmt(f, 2) },
        ],
        undefined,
        "Distribution rules and applicable factors depend on jurisdiction, account type, age and tax year. Verify current official guidance.",
      );
    }
    case "cashback": {
      const spend = n("spend"),
        cash = (spend * n("cashback")) / 100,
        finRate = n("apr") / 1200,
        months = n("months"),
        payment =
          finRate === 0
            ? spend / months
            : (spend * finRate) / (1 - Math.pow(1 + finRate, -months)),
        financeTotal = payment * months;
      return result(
        cash > n("promo")
          ? "Cash-back option has higher stated value"
          : "Promotional discount has higher stated value",
        money(Math.max(cash, n("promo"))),
        "Compares stated cash back with the promotional discount; financing cost is shown separately.",
        [
          { label: "Cash-back value", value: money(cash) },
          { label: "Promotional discount", value: money(n("promo")) },
          {
            label: "Financing total at entered APR",
            value: money(financeTotal),
          },
        ],
      );
    }
    case "lease": {
      const dep = n("price") - n("residual"),
        months = n("months"),
        monthlyDep = dep / months,
        monthlyInterest = ((n("price") + n("residual")) * n("rate")) / 2400,
        pay = monthlyDep + monthlyInterest;
      return result(
        "Estimated monthly lease payment",
        money(pay),
        "Simplified lease estimate before taxes, fees and negotiated incentives.",
        [
          { label: "Monthly depreciation", value: money(monthlyDep) },
          { label: "Estimated finance charge", value: money(monthlyInterest) },
          { label: "Amount due at signing", value: money(n("down")) },
        ],
      );
    }
    case "depreciation": {
      const cost = n("cost"),
        salvage = n("salvage"),
        life = n("years"),
        age = n("age"),
        annual = (cost - salvage) / life,
        book = Math.max(salvage, cost - annual * age);
      return result(
        "Estimated current book value",
        money(book),
        "Straight-line depreciation estimate.",
        [
          { label: "Annual depreciation", value: money(annual) },
          {
            label: "Accumulated depreciation",
            value: money(Math.min(cost - salvage, annual * age)),
          },
          { label: "Salvage value", value: money(salvage) },
        ],
      );
    }
    case "average-return": {
      const start = n("start"),
        end = n("end"),
        years = n("years"),
        annual = (Math.pow(end / start, 1 / years) - 1) * 100;
      return result(
        "Annualized return",
        `${fmt(annual)}%`,
        "Compound annual growth rate based on start value, end value and holding period.",
        [
          { label: "Total return", value: `${fmt((end / start - 1) * 100)}%` },
          { label: "Beginning value", value: money(start) },
          { label: "Ending value", value: money(end) },
        ],
      );
    }
    case "margin": {
      const c = n("cost"),
        p = n("price"),
        profit = p - c;
      return result(
        "Gross profit margin",
        `${fmt((profit / p) * 100)}%`,
        "Profit as a percentage of selling price.",
        [
          { label: "Gross profit", value: money(profit) },
          { label: "Markup on cost", value: `${fmt((profit / c) * 100)}%` },
          { label: "Selling price", value: money(p) },
        ],
      );
    }
    case "discount": {
      const p = n("price"),
        d = (p * n("discount")) / 100;
      return result(
        "Price after discount",
        money(p - d),
        "Original price less the entered percentage discount.",
        [
          { label: "You save", value: money(d) },
          { label: "Discount rate", value: `${fmt(n("discount"))}%` },
          { label: "Original price", value: money(p) },
        ],
        [
          { label: "Discounted price", value: p - d },
          { label: "Savings", value: d },
        ],
      );
    }
    case "dti": {
      const ratio = (n("debts") / n("income")) * 100;
      return result(
        "Debt-to-income ratio",
        `${fmt(ratio)}%`,
        "Monthly debt payments divided by gross monthly income.",
        [
          { label: "Monthly debts", value: money(n("debts")) },
          { label: "Gross monthly income", value: money(n("income")) },
          {
            label: "Income after listed debts",
            value: money(n("income") - n("debts")),
          },
        ],
      );
    }
    case "real-estate":
    case "rental-property": {
      const price = n("price"),
        rent = n("rent"),
        expenses = n("expenses"),
        annual = rent * 12 - expenses;
      return result(
        "Estimated annual net operating income",
        money(annual),
        "Simple property income estimate before financing, taxes and capital expenditures.",
        [
          { label: "Gross annual rent", value: money(rent * 12) },
          { label: "Operating expenses", value: money(expenses) },
          {
            label: "Gross yield",
            value: `${fmt(price ? ((rent * 12) / price) * 100 : 0)}%`,
          },
        ],
      );
    }
    case "refinance": {
      const p = n("balance"),
        old = n("oldrate") / 1200,
        nr = n("newrate") / 1200,
        m = n("years") * 12,
        oldPay = pmt(p, old, m),
        newPay = pmt(p, nr, m),
        saving = (oldPay - newPay) * m - n("costs");
      return result(
        "Estimated monthly payment after refinance",
        money(newPay),
        "Compares new payment with the current rate over the same remaining term.",
        [
          { label: "Current estimated payment", value: money(oldPay) },
          {
            label: "Monthly payment difference",
            value: money(oldPay - newPay),
          },
          { label: "Net term savings after costs", value: money(saving) },
        ],
      );
    }
    case "budget": {
      const income = n("income"),
        out = n("housing") + n("needs") + n("wants") + n("savings");
      return result(
        "Monthly unallocated balance",
        money(income - out),
        "Compares entered monthly income with the expense and goal categories.",
        [
          { label: "Total planned allocations", value: money(out) },
          {
            label: "Allocation percentage",
            value: `${fmt(income ? (out / income) * 100 : 0)}%`,
          },
          { label: "Monthly income", value: money(income) },
        ],
        [
          { label: "Housing", value: n("housing") },
          { label: "Essentials", value: n("needs") },
          { label: "Wants", value: n("wants") },
          { label: "Savings / debt", value: n("savings") },
        ],
      );
    }
    case "roi": {
      const inv = n("investment"),
        gain = n("value") - inv - n("costs"),
        roi = (gain / inv) * 100;
      return result(
        "Return on investment",
        `${fmt(roi)}%`,
        "Net gain divided by initial investment.",
        [
          { label: "Net gain / loss", value: money(gain) },
          { label: "Initial investment", value: money(inv) },
          { label: "Total costs", value: money(n("costs")) },
        ],
      );
    }
    case "apr": {
      const p = n("principal"),
        fee = n("fees"),
        r = n("rate") / 1200,
        m = n("years") * 12,
        monthly = pmt(p, r, m),
        net = p - fee,
        apr =
          (Math.pow(
            monthly / (net * (r === 0 ? 1 / m : r / (1 - Math.pow(1 + r, -m)))),
            12,
          ) -
            1) *
          100;
      return result(
        "Approximate annualized borrowing cost",
        `${fmt(apr)}%`,
        "Simplified fee-adjusted estimate; legal APR methods can include additional timing and fee rules.",
        [
          { label: "Scheduled monthly payment", value: money(monthly) },
          { label: "Net amount received", value: money(net) },
          { label: "Upfront fees", value: money(fee) },
        ],
      );
    }
    case "down-payment": {
      const price = n("price"),
        down = (price * n("down")) / 100;
      return result(
        "Required down payment",
        money(down),
        "Purchase price multiplied by the selected down-payment percentage.",
        [
          { label: "Down payment percentage", value: `${fmt(n("down"))}%` },
          { label: "Estimated financed amount", value: money(price - down) },
          { label: "Purchase price", value: money(price) },
        ],
        [
          { label: "Down payment", value: down },
          { label: "Financed amount", value: price - down },
        ],
      );
    }
    case "rent-vs-buy": {
      const rent = n("rent") * 12 * n("years"),
        loan = n("price") - n("down"),
        r = n("rate") / 1200,
        m = n("years") * 12,
        payment = pmt(loan, r, m),
        buy = payment * m + n("down");
      return result(
        rent < buy
          ? "Renting has lower modeled cash outlay"
          : "Buying has lower modeled cash outlay",
        money(Math.abs(rent - buy)),
        "Simplified cash-outlay comparison; excludes home appreciation, rent increases, taxes, maintenance and investment returns.",
        [
          { label: "Rent paid over period", value: money(rent) },
          { label: "Mortgage payments plus down payment", value: money(buy) },
          { label: "Modeled difference", value: money(Math.abs(rent - buy)) },
        ],
      );
    }
    case "payback": {
      const years = n("investment") / n("annual");
      return result(
        "Payback period",
        `${fmt(years, 2)} years`,
        "Initial investment divided by constant annual net cash flow.",
        [
          { label: "Initial investment", value: money(n("investment")) },
          { label: "Annual net cash flow", value: money(n("annual")) },
          { label: "Approximate months", value: fmt(years * 12, 1) },
        ],
      );
    }
    case "present-value": {
      const pv = n("future") / Math.pow(1 + n("rate") / 100, n("years"));
      return result(
        "Present value",
        money(pv),
        "Discounts the future amount at the entered annual rate.",
        [
          { label: "Future amount", value: money(n("future")) },
          { label: "Discount rate", value: `${fmt(n("rate"))}%` },
          { label: "Discount amount", value: money(n("future") - pv) },
        ],
      );
    }
    case "future-value": {
      const fv = n("present") * Math.pow(1 + n("rate") / 100, n("years"));
      return result(
        "Future value",
        money(fv),
        "Compounds the present amount annually at the entered rate.",
        [
          { label: "Present amount", value: money(n("present")) },
          { label: "Growth", value: money(fv - n("present")) },
          { label: "Growth rate", value: `${fmt(n("rate"))}%` },
        ],
      );
    }
    case "commission": {
      const c = (n("sales") * n("rate")) / 100;
      return result(
        "Total earnings including commission",
        money(n("base") + c),
        "Base pay plus commission calculated on sales.",
        [
          { label: "Commission earned", value: money(c) },
          { label: "Base pay", value: money(n("base")) },
          { label: "Commission rate", value: `${fmt(n("rate"))}%` },
        ],
      );
    }
    default:
      throw new Error("This financial calculator is not configured yet.");
  }
}

const specs = [
  {
    slug: "auto-loan",
    name: "Auto Loan Calculator",
    description:
      "Calculate and explore auto loan scenarios with transparent assumptions and an interactive result summary.",
    kind: "amortizing",
  },
  {
    slug: "interest",
    name: "Interest Calculator",
    description:
      "Calculate and explore interest scenarios with transparent assumptions and an interactive result summary.",
    kind: "simple-interest",
  },
  {
    slug: "payment",
    name: "Payment Calculator",
    description:
      "Calculate and explore payment scenarios with transparent assumptions and an interactive result summary.",
    kind: "amortizing",
  },
  {
    slug: "retirement",
    name: "Retirement Calculator",
    description:
      "Calculate and explore retirement scenarios with transparent assumptions and an interactive result summary.",
    kind: "retirement",
  },
  {
    slug: "amortization",
    name: "Amortization Calculator",
    description:
      "Calculate and explore amortization scenarios with transparent assumptions and an interactive result summary.",
    kind: "amortizing",
  },
  {
    slug: "investment",
    name: "Investment Calculator",
    description:
      "Calculate and explore investment scenarios with transparent assumptions and an interactive result summary.",
    kind: "investment",
  },
  {
    slug: "currency",
    name: "Currency Calculator",
    description:
      "Calculate and explore currency scenarios with transparent assumptions and an interactive result summary.",
    kind: "currency",
  },
  {
    slug: "inflation",
    name: "Inflation Calculator",
    description:
      "Calculate and explore inflation scenarios with transparent assumptions and an interactive result summary.",
    kind: "inflation",
  },
  {
    slug: "finance",
    name: "Finance Calculator",
    description:
      "Calculate and explore finance scenarios with transparent assumptions and an interactive result summary.",
    kind: "amortizing",
  },
  {
    slug: "mortgage-payoff",
    name: "Mortgage Payoff Calculator",
    description:
      "Calculate and explore mortgage payoff scenarios with transparent assumptions and an interactive result summary.",
    kind: "payoff",
  },
  {
    slug: "income-tax",
    name: "Income Tax Calculator",
    description:
      "Calculate and explore income tax scenarios with transparent assumptions and an interactive result summary.",
    kind: "tax",
  },
  {
    slug: "salary",
    name: "Salary Calculator",
    description:
      "Calculate and explore salary scenarios with transparent assumptions and an interactive result summary.",
    kind: "salary",
  },
  {
    slug: "401k",
    name: "401K Calculator",
    description:
      "Calculate and explore 401k scenarios with transparent assumptions and an interactive result summary.",
    kind: "retirement",
  },
  {
    slug: "interest-rate",
    name: "Interest Rate Calculator",
    description:
      "Calculate and explore interest rate scenarios with transparent assumptions and an interactive result summary.",
    kind: "rate-solve",
  },
  {
    slug: "sales-tax",
    name: "Sales Tax Calculator",
    description:
      "Calculate and explore sales tax scenarios with transparent assumptions and an interactive result summary.",
    kind: "tax-percent",
  },
  {
    slug: "house-affordability",
    name: "House Affordability Calculator",
    description:
      "Calculate and explore house affordability scenarios with transparent assumptions and an interactive result summary.",
    kind: "affordability",
  },
  {
    slug: "rent",
    name: "Rent Calculator",
    description:
      "Calculate and explore rent scenarios with transparent assumptions and an interactive result summary.",
    kind: "rent",
  },
  {
    slug: "marriage-tax",
    name: "Marriage Tax Calculator",
    description:
      "Calculate and explore marriage tax scenarios with transparent assumptions and an interactive result summary.",
    kind: "tax",
  },
  {
    slug: "estate-tax",
    name: "Estate Tax Calculator",
    description:
      "Calculate and explore estate tax scenarios with transparent assumptions and an interactive result summary.",
    kind: "tax-percent",
  },
  {
    slug: "pension",
    name: "Pension Calculator",
    description:
      "Calculate and explore pension scenarios with transparent assumptions and an interactive result summary.",
    kind: "annuity",
  },
  {
    slug: "social-security",
    name: "Social Security Calculator",
    description:
      "Calculate and explore social security scenarios with transparent assumptions and an interactive result summary.",
    kind: "annuity",
  },
  {
    slug: "annuity",
    name: "Annuity Calculator",
    description:
      "Calculate and explore annuity scenarios with transparent assumptions and an interactive result summary.",
    kind: "annuity",
  },
  {
    slug: "annuity-payout",
    name: "Annuity Payout Calculator",
    description:
      "Calculate and explore annuity payout scenarios with transparent assumptions and an interactive result summary.",
    kind: "annuity-payout",
  },
  {
    slug: "credit-card",
    name: "Credit Card Calculator",
    description:
      "Calculate and explore credit card scenarios with transparent assumptions and an interactive result summary.",
    kind: "credit-card",
  },
  {
    slug: "credit-cards-payoff",
    name: "Credit Cards Payoff Calculator",
    description:
      "Calculate and explore credit cards payoff scenarios with transparent assumptions and an interactive result summary.",
    kind: "debt-payoff",
  },
  {
    slug: "debt-payoff",
    name: "Debt Payoff Calculator",
    description:
      "Calculate and explore debt payoff scenarios with transparent assumptions and an interactive result summary.",
    kind: "debt-payoff",
  },
  {
    slug: "debt-consolidation",
    name: "Debt Consolidation Calculator",
    description:
      "Calculate and explore debt consolidation scenarios with transparent assumptions and an interactive result summary.",
    kind: "amortizing",
  },
  {
    slug: "repayment",
    name: "Repayment Calculator",
    description:
      "Calculate and explore repayment scenarios with transparent assumptions and an interactive result summary.",
    kind: "amortizing",
  },
  {
    slug: "student-loan",
    name: "Student Loan Calculator",
    description:
      "Calculate and explore student loan scenarios with transparent assumptions and an interactive result summary.",
    kind: "amortizing",
  },
  {
    slug: "college-cost",
    name: "College Cost Calculator",
    description:
      "Calculate and explore college cost scenarios with transparent assumptions and an interactive result summary.",
    kind: "college",
  },
  {
    slug: "simple-interest",
    name: "Simple Interest Calculator",
    description:
      "Calculate and explore simple interest scenarios with transparent assumptions and an interactive result summary.",
    kind: "simple-interest",
  },
  {
    slug: "cd",
    name: "CD Calculator",
    description:
      "Calculate and explore cd scenarios with transparent assumptions and an interactive result summary.",
    kind: "compound",
  },
  {
    slug: "bond",
    name: "Bond Calculator",
    description:
      "Calculate and explore bond scenarios with transparent assumptions and an interactive result summary.",
    kind: "bond",
  },
  {
    slug: "mutual-fund",
    name: "Mutual Fund Calculator",
    description:
      "Calculate and explore mutual fund scenarios with transparent assumptions and an interactive result summary.",
    kind: "investment",
  },
  {
    slug: "roth-ira",
    name: "Roth IRA Calculator",
    description:
      "Calculate and explore roth ira scenarios with transparent assumptions and an interactive result summary.",
    kind: "retirement",
  },
  {
    slug: "ira",
    name: "IRA Calculator",
    description:
      "Calculate and explore ira scenarios with transparent assumptions and an interactive result summary.",
    kind: "retirement",
  },
  {
    slug: "rmd",
    name: "RMD Calculator",
    description:
      "Calculate and explore rmd scenarios with transparent assumptions and an interactive result summary.",
    kind: "rmd",
  },
  {
    slug: "vat",
    name: "VAT Calculator",
    description:
      "Calculate and explore vat scenarios with transparent assumptions and an interactive result summary.",
    kind: "tax-percent",
  },
  {
    slug: "cash-back-or-low-interest",
    name: "Cash Back or Low Interest Calculator",
    description:
      "Calculate and explore cash back or low interest scenarios with transparent assumptions and an interactive result summary.",
    kind: "cashback",
  },
  {
    slug: "auto-lease",
    name: "Auto Lease Calculator",
    description:
      "Calculate and explore auto lease scenarios with transparent assumptions and an interactive result summary.",
    kind: "lease",
  },
  {
    slug: "depreciation",
    name: "Depreciation Calculator",
    description:
      "Calculate and explore depreciation scenarios with transparent assumptions and an interactive result summary.",
    kind: "depreciation",
  },
  {
    slug: "average-return",
    name: "Average Return Calculator",
    description:
      "Calculate and explore average return scenarios with transparent assumptions and an interactive result summary.",
    kind: "average-return",
  },
  {
    slug: "margin",
    name: "Margin Calculator",
    description:
      "Calculate and explore margin scenarios with transparent assumptions and an interactive result summary.",
    kind: "margin",
  },
  {
    slug: "discount",
    name: "Discount Calculator",
    description:
      "Calculate and explore discount scenarios with transparent assumptions and an interactive result summary.",
    kind: "discount",
  },
  {
    slug: "business-loan",
    name: "Business Loan Calculator",
    description:
      "Calculate and explore business loan scenarios with transparent assumptions and an interactive result summary.",
    kind: "amortizing",
  },
  {
    slug: "debt-to-income-ratio",
    name: "Debt-to-Income Ratio Calculator",
    description:
      "Calculate and explore debt-to-income ratio scenarios with transparent assumptions and an interactive result summary.",
    kind: "dti",
  },
  {
    slug: "real-estate",
    name: "Real Estate Calculator",
    description:
      "Calculate and explore real estate scenarios with transparent assumptions and an interactive result summary.",
    kind: "real-estate",
  },
  {
    slug: "take-home-paycheck",
    name: "Take-Home-Paycheck Calculator",
    description:
      "Calculate and explore take-home-paycheck scenarios with transparent assumptions and an interactive result summary.",
    kind: "salary",
  },
  {
    slug: "personal-loan",
    name: "Personal Loan Calculator",
    description:
      "Calculate and explore personal loan scenarios with transparent assumptions and an interactive result summary.",
    kind: "amortizing",
  },
  {
    slug: "boat-loan",
    name: "Boat Loan Calculator",
    description:
      "Calculate and explore boat loan scenarios with transparent assumptions and an interactive result summary.",
    kind: "amortizing",
  },
  {
    slug: "lease",
    name: "Lease Calculator",
    description:
      "Calculate and explore lease scenarios with transparent assumptions and an interactive result summary.",
    kind: "lease",
  },
  {
    slug: "refinance",
    name: "Refinance Calculator",
    description:
      "Calculate and explore refinance scenarios with transparent assumptions and an interactive result summary.",
    kind: "refinance",
  },
  {
    slug: "budget",
    name: "Budget Calculator",
    description:
      "Calculate and explore budget scenarios with transparent assumptions and an interactive result summary.",
    kind: "budget",
  },
  {
    slug: "rental-property",
    name: "Rental Property Calculator",
    description:
      "Calculate and explore rental property scenarios with transparent assumptions and an interactive result summary.",
    kind: "rental-property",
  },
  {
    slug: "irr",
    name: "IRR Calculator",
    description:
      "Calculate and explore irr scenarios with transparent assumptions and an interactive result summary.",
    kind: "roi",
  },
  {
    slug: "roi",
    name: "ROI Calculator",
    description:
      "Calculate and explore roi scenarios with transparent assumptions and an interactive result summary.",
    kind: "roi",
  },
  {
    slug: "apr",
    name: "APR Calculator",
    description:
      "Calculate and explore apr scenarios with transparent assumptions and an interactive result summary.",
    kind: "apr",
  },
  {
    slug: "fha-loan",
    name: "FHA Loan Calculator",
    description:
      "Calculate and explore fha loan scenarios with transparent assumptions and an interactive result summary.",
    kind: "amortizing",
  },
  {
    slug: "va-mortgage",
    name: "VA Mortgage Calculator",
    description:
      "Calculate and explore va mortgage scenarios with transparent assumptions and an interactive result summary.",
    kind: "amortizing",
  },
  {
    slug: "home-equity-loan",
    name: "Home Equity Loan Calculator",
    description:
      "Calculate and explore home equity loan scenarios with transparent assumptions and an interactive result summary.",
    kind: "amortizing",
  },
  {
    slug: "heloc",
    name: "HELOC Calculator",
    description:
      "Calculate and explore heloc scenarios with transparent assumptions and an interactive result summary.",
    kind: "amortizing",
  },
  {
    slug: "down-payment",
    name: "Down Payment Calculator",
    description:
      "Calculate and explore down payment scenarios with transparent assumptions and an interactive result summary.",
    kind: "down-payment",
  },
  {
    slug: "rent-vs-buy",
    name: "Rent vs. Buy Calculator",
    description:
      "Calculate and explore rent vs. buy scenarios with transparent assumptions and an interactive result summary.",
    kind: "rent-vs-buy",
  },
  {
    slug: "payback-period",
    name: "Payback Period Calculator",
    description:
      "Calculate and explore payback period scenarios with transparent assumptions and an interactive result summary.",
    kind: "payback",
  },
  {
    slug: "present-value",
    name: "Present Value Calculator",
    description:
      "Calculate and explore present value scenarios with transparent assumptions and an interactive result summary.",
    kind: "present-value",
  },
  {
    slug: "future-value",
    name: "Future Value Calculator",
    description:
      "Calculate and explore future value scenarios with transparent assumptions and an interactive result summary.",
    kind: "future-value",
  },
  {
    slug: "commission",
    name: "Commission Calculator",
    description:
      "Calculate and explore commission scenarios with transparent assumptions and an interactive result summary.",
    kind: "commission",
  },
  {
    slug: "mortgage-calculator-uk",
    name: "Mortgage Calculator UK",
    description:
      "Calculate and explore mortgage uk scenarios with transparent assumptions and an interactive result summary.",
    kind: "amortizing",
  },
  {
    slug: "canadian-mortgage",
    name: "Canadian Mortgage Calculator",
    description:
      "Calculate and explore canadian mortgage scenarios with transparent assumptions and an interactive result summary.",
    kind: "amortizing",
  },
  {
    slug: "mortgage-amortization",
    name: "Mortgage Amortization Calculator",
    description:
      "Calculate and explore mortgage amortization scenarios with transparent assumptions and an interactive result summary.",
    kind: "amortizing",
  },
  {
    slug: "percent-off",
    name: "Percent Off Calculator",
    description:
      "Calculate and explore percent off scenarios with transparent assumptions and an interactive result summary.",
    kind: "discount",
  },
] as { slug: string; name: string; description: string; kind: string }[];
export const financialExtras: CalculatorDefinition[] = specs.map((spec) => ({
  slug: spec.slug,
  name: spec.name,
  category: "Financial",
  description: spec.description,
  icon: "Wallet",
  fields: baseFields[spec.kind] ?? baseFields.amortizing,
  calculate(values) {
    return calc(spec.kind, values);
  },
}));
