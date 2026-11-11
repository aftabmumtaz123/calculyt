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
  min?: number,
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
const n = (v: Record<string, string>, k: string) => Number(v[k] ?? 0);
const fmt = (x: number, d = 6) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: d }).format(
    Number.isFinite(x) ? x : 0,
  );
const R = (
  headline: string,
  value: string,
  description: string,
  metrics: { label: string; value: string }[],
  chart?: { label: string; value: number }[],
): CalculationResult => ({
  headline,
  value,
  description,
  metrics,
  chart,
  chartTitle: "Mathematical breakdown",
  chartKind: chart ? "bar" : undefined,
});
const op = s("op", "Operation", "add", [
  { label: "Add (+)", value: "add" },
  { label: "Subtract (−)", value: "sub" },
  { label: "Multiply (×)", value: "mul" },
  { label: "Divide (÷)", value: "div" },
]);
const shapes = s("shape", "Shape", "rectangle", [
  { label: "Rectangle", value: "rectangle" },
  { label: "Triangle", value: "triangle" },
  { label: "Circle", value: "circle" },
  { label: "Trapezoid", value: "trapezoid" },
]);
const gcd = (a: number, b: number): number =>
  b === 0 ? Math.abs(a) : gcd(b, a % b);
const factorial = (x: number): number => {
  if (!Number.isInteger(x) || x < 0 || x > 170)
    throw new Error("Enter a whole number from 0 to 170.");
  let z = 1;
  for (let i = 2; i <= x; i++) z *= i;
  return z;
};
const comb = (n: number, r: number) => {
  if (r < 0 || r > n) return 0;
  let x = 1;
  for (let i = 1; i <= r; i++) x = (x * (n - r + i)) / i;
  return x;
};
const erf = (x: number) => {
  const sign = x < 0 ? -1 : 1,
    a = Math.abs(x),
    t = 1 / (1 + 0.3275911 * a),
    y =
      1 -
      ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) *
        t +
        0.254829592) *
        t *
        Math.exp(-a * a);
  return sign * y;
};
const cdf = (z: number) => 0.5 * (1 + erf(z / Math.sqrt(2)));
const primes = (num: number) => {
  let x = Math.abs(Math.trunc(num)),
    out: number[] = [];
  if (x < 2) return [x];
  for (let p = 2; p * p <= x; p++)
    while (x % p === 0) {
      out.push(p);
      x /= p;
    }
  if (x > 1) out.push(x);
  return out;
};
const defs: CalculatorDefinition[] = [
  {
    slug: "scientific-calculator",
    name: "Scientific Calculator",
    category: "Math",
    description:
      "Perform common scientific operations including powers, roots, logarithms and trigonometric functions.",
    icon: "Calculator",
    fields: [
      f("a", "First value", "45"),
      f("b", "Second value", "3"),
      s("mode", "Operation", "multiply", [
        { label: "Add", value: "add" },
        { label: "Subtract", value: "subtract" },
        { label: "Multiply", value: "multiply" },
        { label: "Divide", value: "divide" },
        { label: "Power (a^b)", value: "power" },
        { label: "Square root of a", value: "sqrt" },
        { label: "Natural log of a", value: "ln" },
        { label: "Log base 10 of a", value: "log" },
        { label: "Sine of a (degrees)", value: "sin" },
        { label: "Cosine of a (degrees)", value: "cos" },
        { label: "Tangent of a (degrees)", value: "tan" },
      ]),
    ],
    calculate(v) {
      const a = n(v, "a"),
        b = n(v, "b");
      let x = 0;
      switch (v.mode) {
        case "add":
          x = a + b;
          break;
        case "subtract":
          x = a - b;
          break;
        case "multiply":
          x = a * b;
          break;
        case "divide":
          if (!b) throw new Error("Cannot divide by zero.");
          x = a / b;
          break;
        case "power":
          x = Math.pow(a, b);
          break;
        case "sqrt":
          if (a < 0)
            throw new Error("Real square root requires a non-negative value.");
          x = Math.sqrt(a);
          break;
        case "ln":
          if (a <= 0)
            throw new Error("Natural logarithm requires a positive value.");
          x = Math.log(a);
          break;
        case "log":
          if (a <= 0) throw new Error("Logarithm requires a positive value.");
          x = Math.log10(a);
          break;
        case "sin":
          x = Math.sin((a * Math.PI) / 180);
          break;
        case "cos":
          x = Math.cos((a * Math.PI) / 180);
          break;
        default:
          x = Math.tan((a * Math.PI) / 180);
      }
      return R(
        "Calculated result",
        fmt(x, 10),
        `Scientific operation: ${v.mode}.`,
        [
          { label: "First value", value: fmt(a) },
          { label: "Second value", value: fmt(b) },
          { label: "Result", value: fmt(x, 10) },
        ],
      );
    },
  },
  {
    slug: "fraction",
    name: "Fraction Calculator",
    category: "Math",
    description:
      "Add, subtract, multiply or divide two fractions and simplify the result.",
    icon: "Divide",
    fields: [
      f("a", "Numerator 1", "1"),
      f("b", "Denominator 1", "2", undefined, 1),
      f("c", "Numerator 2", "1"),
      f("d", "Denominator 2", "3", undefined, 1),
      s("op", "Operation", "add", [
        { label: "Add", value: "add" },
        { label: "Subtract", value: "sub" },
        { label: "Multiply", value: "mul" },
        { label: "Divide", value: "div" },
      ]),
    ],
    calculate(v) {
      const a = n(v, "a"),
        b = n(v, "b"),
        c = n(v, "c"),
        d = n(v, "d");
      if (!b || !d) throw new Error("Denominators cannot be zero.");
      let top = 0,
        bot = 1;
      if (v.op === "add") {
        top = a * d + c * b;
        bot = b * d;
      } else if (v.op === "sub") {
        top = a * d - c * b;
        bot = b * d;
      } else if (v.op === "mul") {
        top = a * c;
        bot = b * d;
      } else {
        if (!c) throw new Error("Cannot divide by a zero fraction.");
        top = a * d;
        bot = b * c;
      }
      const g = gcd(top, bot);
      top /= g;
      bot /= g;
      if (bot < 0) {
        top = -top;
        bot = -bot;
      }
      return R(
        "Simplified fraction",
        `${top}/${bot}`,
        "The fractions were combined and reduced by their greatest common divisor.",
        [
          { label: "Decimal", value: fmt(top / bot) },
          { label: "Numerator", value: String(top) },
          { label: "Denominator", value: String(bot) },
        ],
      );
    },
  },
  {
    slug: "triangle",
    name: "Triangle Calculator",
    category: "Math",
    description:
      "Calculate a triangle's perimeter, area and angle validity from its three side lengths.",
    icon: "Triangle",
    fields: [
      f("a", "Side a", "3", undefined, 0.001, 0.01),
      f("b", "Side b", "4", undefined, 0.001, 0.01),
      f("c", "Side c", "5", undefined, 0.001, 0.01),
    ],
    calculate(v) {
      const a = n(v, "a"),
        b = n(v, "b"),
        c = n(v, "c");
      if (a + b <= c || a + c <= b || b + c <= a)
        throw new Error("These side lengths do not form a triangle.");
      const p = a + b + c,
        s = p / 2,
        area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      const A =
          (Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180) / Math.PI,
        B = (Math.acos((a * a + c * c - b * b) / (2 * a * c)) * 180) / Math.PI,
        C = 180 - A - B;
      return R(
        "Triangle area",
        `${fmt(area)} square units`,
        "Heron's formula is used to calculate area from three side lengths.",
        [
          { label: "Perimeter", value: fmt(p) },
          { label: "Angle A", value: `${fmt(A, 2)}°` },
          { label: "Angle B / C", value: `${fmt(B, 2)}° / ${fmt(C, 2)}°` },
        ],
      );
    },
  },
  {
    slug: "volume",
    name: "Volume Calculator",
    category: "Math",
    description: "Calculate volume for common three-dimensional shapes.",
    icon: "Box",
    fields: [
      s("shape", "Shape", "box", [
        { label: "Rectangular prism", value: "box" },
        { label: "Cylinder", value: "cylinder" },
        { label: "Sphere", value: "sphere" },
        { label: "Cone", value: "cone" },
        { label: "Pyramid (square base)", value: "pyramid" },
      ]),
      f("a", "Length / radius", "5", undefined, 0.001, 0.01),
      f("b", "Width (box) / height", "4", undefined, 0.001, 0.01),
      f("h", "Height", "10", undefined, 0.001, 0.01),
    ],
    calculate(v) {
      const a = n(v, "a"),
        b = n(v, "b"),
        h = n(v, "h");
      let vol = 0,
        formula = "";
      if (v.shape === "box") {
        vol = a * b * h;
        formula = "V = length × width × height";
      } else if (v.shape === "cylinder") {
        vol = Math.PI * a * a * h;
        formula = "V = πr²h";
      } else if (v.shape === "sphere") {
        vol = (4 / 3) * Math.PI * a ** 3;
        formula = "V = 4πr³/3";
      } else if (v.shape === "cone") {
        vol = (Math.PI * a * a * h) / 3;
        formula = "V = πr²h/3";
      } else {
        vol = (a * a * h) / 3;
        formula = "V = base area × height / 3";
      }
      return R("Volume", `${fmt(vol)} cubic units`, formula, [
        { label: "Shape", value: v.shape },
        { label: "Formula", value: formula },
        { label: "Volume", value: fmt(vol) },
      ]);
    },
  },
  {
    slug: "standard-deviation",
    name: "Standard Deviation Calculator",
    category: "Math",
    description:
      "Calculate the mean and population or sample standard deviation for five entered values.",
    icon: "ChartNoAxesCombined",
    fields: [
      f("x1", "Value 1", "4"),
      f("x2", "Value 2", "8"),
      f("x3", "Value 3", "6"),
      f("x4", "Value 4", "5"),
      f("x5", "Value 5", "7"),
      s("kind", "Standard deviation type", "population", [
        { label: "Population", value: "population" },
        { label: "Sample", value: "sample" },
      ]),
    ],
    calculate(v) {
      const a = [1, 2, 3, 4, 5].map((i) => n(v, "x" + i)),
        mean = a.reduce((x, y) => x + y, 0) / a.length,
        den = v.kind === "sample" ? a.length - 1 : a.length,
        variance = a.reduce((x, y) => x + (y - mean) ** 2, 0) / den,
        sd = Math.sqrt(variance);
      return R(
        "Standard deviation",
        fmt(sd),
        `${v.kind === "sample" ? "Sample" : "Population"} standard deviation of the five entered values.`,
        [
          { label: "Mean", value: fmt(mean) },
          { label: "Variance", value: fmt(variance) },
          { label: "Count", value: String(a.length) },
        ],
      );
    },
  },
  {
    slug: "number-sequence",
    name: "Number Sequence Calculator",
    category: "Math",
    description:
      "Generate arithmetic or geometric sequences from a starting value and common difference or ratio.",
    icon: "ListOrdered",
    fields: [
      f("start", "First term", "2"),
      f("step", "Difference / ratio", "3"),
      f("count", "Number of terms", "8", undefined, 1, 1),
      s("kind", "Sequence type", "arithmetic", [
        { label: "Arithmetic", value: "arithmetic" },
        { label: "Geometric", value: "geometric" },
      ]),
    ],
    calculate(v) {
      const a = n(v, "start"),
        step = n(v, "step"),
        count = Math.min(100, Math.floor(n(v, "count")));
      const seq = Array.from({ length: count }, (_, i) =>
        v.kind === "arithmetic" ? a + i * step : a * Math.pow(step, i),
      );
      return R(
        "Generated sequence",
        seq.map((x) => fmt(x, 4)).join(", "),
        `${v.kind === "arithmetic" ? "Arithmetic sequence" : "Geometric sequence"} with ${count} terms.`,
        [
          { label: "First term", value: fmt(seq[0] ?? 0) },
          { label: "Last term", value: fmt(seq[seq.length - 1] ?? 0) },
          { label: "Terms", value: String(count) },
        ],
      );
    },
  },
  {
    slug: "percent-error",
    name: "Percent Error Calculator",
    category: "Math",
    description:
      "Calculate percentage error between an experimental value and an accepted reference value.",
    icon: "Percent",
    fields: [
      f("experimental", "Experimental value", "9.7"),
      f("accepted", "Accepted value", "10", undefined, 0.000001),
    ],
    calculate(v) {
      const e = n(v, "experimental"),
        a = n(v, "accepted"),
        err = (Math.abs(e - a) / Math.abs(a)) * 100;
      return R(
        "Percent error",
        `${fmt(err)}%`,
        "Absolute difference divided by the absolute accepted value, multiplied by 100.",
        [
          { label: "Absolute difference", value: fmt(Math.abs(e - a)) },
          { label: "Experimental value", value: fmt(e) },
          { label: "Accepted value", value: fmt(a) },
        ],
      );
    },
  },
  {
    slug: "exponent",
    name: "Exponent Calculator",
    category: "Math",
    description: "Evaluate a base raised to a selected exponent.",
    icon: "Superscript",
    fields: [f("base", "Base", "2"), f("exponent", "Exponent", "10")],
    calculate(v) {
      const x = Math.pow(n(v, "base"), n(v, "exponent"));
      return R(
        "Power result",
        fmt(x, 10),
        `${fmt(n(v, "base"))} raised to the power ${fmt(n(v, "exponent"))}.`,
        [
          { label: "Base", value: fmt(n(v, "base")) },
          { label: "Exponent", value: fmt(n(v, "exponent")) },
          { label: "Result", value: fmt(x, 10) },
        ],
      );
    },
  },
  {
    slug: "binary",
    name: "Binary Calculator",
    category: "Math",
    description:
      "Convert decimal integers to binary or perform basic binary arithmetic.",
    icon: "Binary",
    fields: [
      f("a", "First integer", "13", undefined, undefined, 1),
      f("b", "Second integer", "5", undefined, undefined, 1),
      op,
    ],
    calculate(v) {
      const a = BigInt(Math.trunc(n(v, "a"))),
        b = BigInt(Math.trunc(n(v, "b")));
      let x = 0n;
      if (v.op === "add") x = a + b;
      else if (v.op === "sub") x = a - b;
      else if (v.op === "mul") x = a * b;
      else {
        if (b === 0n) throw new Error("Cannot divide by zero.");
        x = a / b;
      }
      return R(
        "Binary result",
        x.toString(2),
        "The entered integers are combined and the result is displayed in base 2.",
        [
          { label: "First binary value", value: a.toString(2) },
          { label: "Second binary value", value: b.toString(2) },
          { label: "Decimal result", value: x.toString() },
        ],
      );
    },
  },
  {
    slug: "hex",
    name: "Hex Calculator",
    category: "Math",
    description:
      "Perform basic integer arithmetic and display the result in hexadecimal.",
    icon: "Hash",
    fields: [
      f("a", "First integer", "255", undefined, undefined, 1),
      f("b", "Second integer", "16", undefined, undefined, 1),
      op,
    ],
    calculate(v) {
      const a = BigInt(Math.trunc(n(v, "a"))),
        b = BigInt(Math.trunc(n(v, "b")));
      let x = 0n;
      if (v.op === "add") x = a + b;
      else if (v.op === "sub") x = a - b;
      else if (v.op === "mul") x = a * b;
      else {
        if (b === 0n) throw new Error("Cannot divide by zero.");
        x = a / b;
      }
      return R(
        "Hexadecimal result",
        "0x" + x.toString(16).toUpperCase(),
        "The integer result is represented in base 16.",
        [
          { label: "First value", value: "0x" + a.toString(16).toUpperCase() },
          { label: "Second value", value: "0x" + b.toString(16).toUpperCase() },
          { label: "Decimal result", value: x.toString() },
        ],
      );
    },
  },
  {
    slug: "half-life",
    name: "Half-Life Calculator",
    category: "Math",
    description:
      "Calculate remaining quantity after a given time using a half-life value.",
    icon: "Hourglass",
    fields: [
      f("initial", "Initial quantity", "100"),
      f("half", "Half-life duration", "5", "time units", 0.0001, 0.01),
      f("time", "Elapsed time", "12", "time units", 0, 0.01),
    ],
    calculate(v) {
      const remain =
        n(v, "initial") * Math.pow(0.5, n(v, "time") / n(v, "half"));
      return R(
        "Remaining quantity",
        fmt(remain),
        "Exponential decay model using the entered half-life.",
        [
          { label: "Initial quantity", value: fmt(n(v, "initial")) },
          {
            label: "Elapsed half-lives",
            value: fmt(n(v, "time") / n(v, "half")),
          },
          { label: "Quantity decayed", value: fmt(n(v, "initial") - remain) },
        ],
        [
          { label: "Remaining", value: remain },
          { label: "Decayed", value: n(v, "initial") - remain },
        ],
      );
    },
  },
  {
    slug: "quadratic-formula",
    name: "Quadratic Formula Calculator",
    category: "Math",
    description:
      "Solve a quadratic equation ax² + bx + c = 0 and calculate its discriminant.",
    icon: "Sigma",
    fields: [
      f("a", "Coefficient a", "1", undefined, 0.000001),
      f("b", "Coefficient b", "-5"),
      f("c", "Coefficient c", "6"),
    ],
    calculate(v) {
      const a = n(v, "a"),
        b = n(v, "b"),
        c = n(v, "c"),
        disc = b * b - 4 * a * c;
      if (disc >= 0) {
        const x1 = (-b + Math.sqrt(disc)) / (2 * a),
          x2 = (-b - Math.sqrt(disc)) / (2 * a);
        return R(
          "Quadratic roots",
          `${fmt(x1)} and ${fmt(x2)}`,
          "Real roots calculated with the quadratic formula.",
          [
            { label: "Discriminant", value: fmt(disc) },
            { label: "Root 1", value: fmt(x1) },
            { label: "Root 2", value: fmt(x2) },
          ],
        );
      }
      const real = -b / (2 * a),
        imag = Math.sqrt(-disc) / (2 * Math.abs(a));
      return R(
        "Complex roots",
        `${fmt(real)} ± ${fmt(imag)}i`,
        "The negative discriminant produces a pair of complex conjugate roots.",
        [
          { label: "Discriminant", value: fmt(disc) },
          { label: "Real component", value: fmt(real) },
          { label: "Imaginary magnitude", value: fmt(imag) },
        ],
      );
    },
  },
  {
    slug: "slope",
    name: "Slope Calculator",
    category: "Math",
    description:
      "Calculate slope and line equation from two coordinate points.",
    icon: "TrendingUp",
    fields: [
      f("x1", "x₁", "1"),
      f("y1", "y₁", "2"),
      f("x2", "x₂", "5"),
      f("y2", "y₂", "10"),
    ],
    calculate(v) {
      const dx = n(v, "x2") - n(v, "x1"),
        dy = n(v, "y2") - n(v, "y1");
      if (!dx) throw new Error("The line is vertical; slope is undefined.");
      const m = dy / dx,
        b = n(v, "y1") - m * n(v, "x1");
      return R(
        "Slope",
        fmt(m),
        `Line equation: y = ${fmt(m)}x ${b < 0 ? "−" : "+"} ${fmt(Math.abs(b))}.`,
        [
          { label: "Rise", value: fmt(dy) },
          { label: "Run", value: fmt(dx) },
          { label: "Y-intercept", value: fmt(b) },
        ],
      );
    },
  },
  {
    slug: "log",
    name: "Log Calculator",
    category: "Math",
    description:
      "Calculate a logarithm for a positive number and selected base.",
    icon: "Sigma",
    fields: [
      f("value", "Number", "100", undefined, 0.000001),
      f("base", "Logarithm base", "10", undefined, 0.000001),
    ],
    calculate(v) {
      const a = n(v, "value"),
        b = n(v, "base");
      if (b === 1) throw new Error("Logarithm base cannot equal 1.");
      return R(
        "Logarithm",
        fmt(Math.log(a) / Math.log(b)),
        `Log base ${fmt(b)} of ${fmt(a)}.`,
        [
          { label: "Number", value: fmt(a) },
          { label: "Base", value: fmt(b) },
          { label: "Natural logarithm", value: fmt(Math.log(a)) },
        ],
      );
    },
  },
  {
    slug: "area",
    name: "Area Calculator",
    category: "Math",
    description: "Calculate area for common two-dimensional shapes.",
    icon: "Shapes",
    fields: [
      shapes,
      f("a", "Length / base / radius", "10", undefined, 0.0001),
      f("b", "Width / second base", "5", undefined, 0),
      f("h", "Height", "4", undefined, 0),
    ],
    calculate(v) {
      const a = n(v, "a"),
        b = n(v, "b"),
        h = n(v, "h");
      let area = 0;
      if (v.shape === "rectangle") area = a * b;
      else if (v.shape === "triangle") area = (a * h) / 2;
      else if (v.shape === "circle") area = Math.PI * a * a;
      else area = ((a + b) * h) / 2;
      return R(
        "Area",
        `${fmt(area)} square units`,
        `Area of the selected ${v.shape}.`,
        [
          { label: "Shape", value: v.shape },
          { label: "Area", value: fmt(area) },
        ],
      );
    },
  },
  {
    slug: "sample-size",
    name: "Sample Size Calculator",
    category: "Math",
    description:
      "Estimate a sample size for a proportion using confidence level, margin of error and expected proportion.",
    icon: "Users",
    fields: [
      f("z", "Z-score for confidence level", "1.96", undefined, 0.0001, 0.01),
      f("p", "Expected proportion", "0.5", undefined, 0.0001, 0.01),
      f("e", "Margin of error (decimal)", "0.05", undefined, 0.0001, 0.001),
    ],
    calculate(v) {
      const z = n(v, "z"),
        p = n(v, "p"),
        e = n(v, "e");
      if (p >= 1 || e >= 1)
        throw new Error("Proportion and margin of error must be below 1.");
      const size = Math.ceil((z * z * p * (1 - p)) / (e * e));
      return R(
        "Required sample size",
        String(size),
        "Normal-approximation sample size for estimating a population proportion without finite-population correction.",
        [
          { label: "Confidence z-score", value: fmt(z) },
          { label: "Expected proportion", value: fmt(p) },
          {
            label: "Margin of error",
            value: `±${fmt(e * 100, 2)} percentage points`,
          },
        ],
      );
    },
  },
  {
    slug: "probability",
    name: "Probability Calculator",
    category: "Math",
    description:
      "Calculate simple event probability from favorable and total equally likely outcomes.",
    icon: "Dice5",
    fields: [
      f("favorable", "Favorable outcomes", "2", undefined, 0, 1),
      f("total", "Total possible outcomes", "6", undefined, 1, 1),
    ],
    calculate(v) {
      const p = n(v, "favorable") / n(v, "total");
      if (p > 1)
        throw new Error("Favorable outcomes cannot exceed total outcomes.");
      return R(
        "Probability",
        `${fmt(p * 100, 4)}%`,
        "Assumes equally likely outcomes.",
        [
          {
            label: "Fraction",
            value: `${fmt(n(v, "favorable"), 0)}/${fmt(n(v, "total"), 0)}`,
          },
          { label: "Decimal", value: fmt(p, 6) },
          {
            label: "Odds in favor",
            value: `${fmt(n(v, "favorable"), 0)} : ${fmt(n(v, "total") - n(v, "favorable"), 0)}`,
          },
        ],
      );
    },
  },
  {
    slug: "statistics",
    name: "Statistics Calculator",
    category: "Math",
    description:
      "Summarize five data points with mean, median, range and population standard deviation.",
    icon: "ChartColumn",
    fields: [
      f("x1", "Value 1", "4"),
      f("x2", "Value 2", "8"),
      f("x3", "Value 3", "6"),
      f("x4", "Value 4", "5"),
      f("x5", "Value 5", "7"),
    ],
    calculate(v) {
      const a = [1, 2, 3, 4, 5].map((i) => n(v, "x" + i)).sort((x, y) => x - y),
        mean = a.reduce((x, y) => x + y, 0) / a.length,
        med = a[2],
        range = a[4] - a[0],
        sd = Math.sqrt(a.reduce((x, y) => x + (y - mean) ** 2, 0) / a.length);
      return R(
        "Statistical summary",
        `Mean ${fmt(mean)}`,
        "Descriptive statistics for the five entered values.",
        [
          { label: "Median", value: fmt(med) },
          { label: "Range", value: fmt(range) },
          { label: "Population standard deviation", value: fmt(sd) },
        ],
      );
    },
  },
  {
    slug: "mean-median-mode-range",
    name: "Mean, Median, Mode, Range Calculator",
    category: "Math",
    description:
      "Calculate common descriptive statistics from five numerical observations.",
    icon: "ChartColumn",
    fields: [
      f("x1", "Value 1", "2"),
      f("x2", "Value 2", "3"),
      f("x3", "Value 3", "3"),
      f("x4", "Value 4", "5"),
      f("x5", "Value 5", "7"),
    ],
    calculate(v) {
      const a = [1, 2, 3, 4, 5].map((i) => n(v, "x" + i)).sort((x, y) => x - y),
        counts = new Map<number, number>();
      a.forEach((x) => counts.set(x, (counts.get(x) || 0) + 1));
      const max = Math.max(...counts.values()),
        modes = [...counts]
          .filter(([, c]) => c === max && max > 1)
          .map(([x]) => x);
      return R(
        "Mean",
        fmt(a.reduce((x, y) => x + y, 0) / a.length),
        "Mean, median, mode and range for the entered data.",
        [
          { label: "Median", value: fmt(a[2]) },
          {
            label: "Mode",
            value: modes.length
              ? modes.map((x) => fmt(x)).join(", ")
              : "No repeated value",
          },
          { label: "Range", value: fmt(a[4] - a[0]) },
        ],
      );
    },
  },
  {
    slug: "permutation-and-combination",
    name: "Permutation and Combination Calculator",
    category: "Math",
    description:
      "Calculate permutations and combinations for selecting r items from n distinct items.",
    icon: "Workflow",
    fields: [
      f("n", "Total items (n)", "10", undefined, 0, 1),
      f("r", "Items selected (r)", "3", undefined, 0, 1),
    ],
    calculate(v) {
      const a = Math.trunc(n(v, "n")),
        b = Math.trunc(n(v, "r"));
      if (b > a || a > 170) throw new Error("Require 0 ≤ r ≤ n ≤ 170.");
      const p = factorial(a) / factorial(a - b),
        c = comb(a, b);
      return R(
        "Combination count",
        fmt(c, 0),
        "Combinations ignore order; permutations count ordered arrangements.",
        [
          { label: "Permutations nPr", value: fmt(p, 0) },
          { label: "Combinations nCr", value: fmt(c, 0) },
          { label: "Inputs", value: `n=${a}, r=${b}` },
        ],
      );
    },
  },
  {
    slug: "z-score",
    name: "Z-score Calculator",
    category: "Math",
    description:
      "Calculate how many standard deviations a value is from a distribution mean.",
    icon: "ChartLine",
    fields: [
      f("x", "Observed value", "85"),
      f("mean", "Mean", "70"),
      f("sd", "Standard deviation", "10", undefined, 0.000001),
    ],
    calculate(v) {
      const z = (n(v, "x") - n(v, "mean")) / n(v, "sd");
      return R(
        "Z-score",
        fmt(z),
        "Standardized distance between the observation and the mean.",
        [
          { label: "Observed value", value: fmt(n(v, "x")) },
          { label: "Mean", value: fmt(n(v, "mean")) },
          { label: "Standard deviation units", value: fmt(Math.abs(z)) },
        ],
      );
    },
  },
  {
    slug: "confidence-interval",
    name: "Confidence Interval Calculator",
    category: "Math",
    description:
      "Estimate a confidence interval for a population mean using a supplied z critical value.",
    icon: "ChartNoAxesCombined",
    fields: [
      f("mean", "Sample mean", "50"),
      f("sd", "Sample standard deviation", "10", undefined, 0.000001),
      f("n", "Sample size", "100", undefined, 1, 1),
      f("z", "Z critical value", "1.96", undefined, 0.000001, 0.01),
    ],
    calculate(v) {
      const margin = (n(v, "z") * n(v, "sd")) / Math.sqrt(n(v, "n"));
      return R(
        "Confidence interval",
        `${fmt(n(v, "mean") - margin)} to ${fmt(n(v, "mean") + margin)}`,
        "Normal-approximation interval using the entered z critical value.",
        [
          { label: "Margin of error", value: fmt(margin) },
          { label: "Sample mean", value: fmt(n(v, "mean")) },
          {
            label: "Standard error",
            value: fmt(n(v, "sd") / Math.sqrt(n(v, "n"))),
          },
        ],
      );
    },
  },
  {
    slug: "ratio",
    name: "Ratio Calculator",
    category: "Math",
    description: "Simplify a ratio and calculate equivalent ratios.",
    icon: "Equal",
    fields: [
      f("a", "First quantity", "12", undefined, 0, 1),
      f("b", "Second quantity", "18", undefined, 0, 1),
    ],
    calculate(v) {
      const a = Math.trunc(n(v, "a")),
        b = Math.trunc(n(v, "b"));
      if (!a && !b) throw new Error("At least one quantity must be non-zero.");
      const g = gcd(a, b);
      return R(
        "Simplified ratio",
        `${a / g}:${b / g}`,
        "Both ratio terms are divided by their greatest common divisor.",
        [
          { label: "Original ratio", value: `${a}:${b}` },
          { label: "Decimal comparison", value: fmt(a / (b || 1)) },
          {
            label: "Equivalent ratio ×2",
            value: `${(2 * a) / g}:${(2 * b) / g}`,
          },
        ],
      );
    },
  },
  {
    slug: "distance",
    name: "Distance Calculator",
    category: "Math",
    description:
      "Calculate the straight-line distance between two points in two-dimensional coordinates.",
    icon: "Route",
    fields: [
      f("x1", "x₁", "1"),
      f("y1", "y₁", "2"),
      f("x2", "x₂", "4"),
      f("y2", "y₂", "6"),
    ],
    calculate(v) {
      const dx = n(v, "x2") - n(v, "x1"),
        dy = n(v, "y2") - n(v, "y1"),
        dist = Math.hypot(dx, dy);
      return R(
        "Distance",
        fmt(dist),
        "Euclidean distance between the two entered coordinate points.",
        [
          { label: "Horizontal difference", value: fmt(dx) },
          { label: "Vertical difference", value: fmt(dy) },
          { label: "Distance squared", value: fmt(dx * dx + dy * dy) },
        ],
      );
    },
  },
  {
    slug: "circle",
    name: "Circle Calculator",
    category: "Math",
    description: "Calculate a circle's circumference and area from its radius.",
    icon: "Circle",
    fields: [f("r", "Radius", "5", undefined, 0.000001)],
    calculate(v) {
      const r = n(v, "r");
      return R(
        "Circle area",
        `${fmt(Math.PI * r * r)} square units`,
        "Area and circumference from the entered radius.",
        [
          { label: "Diameter", value: fmt(2 * r) },
          { label: "Circumference", value: fmt(2 * Math.PI * r) },
          { label: "Area", value: fmt(Math.PI * r * r) },
        ],
      );
    },
  },
  {
    slug: "surface-area",
    name: "Surface Area Calculator",
    category: "Math",
    description: "Calculate surface area for common three-dimensional shapes.",
    icon: "Box",
    fields: [
      s("shape", "Shape", "box", [
        { label: "Rectangular prism", value: "box" },
        { label: "Sphere", value: "sphere" },
        { label: "Cylinder", value: "cylinder" },
        { label: "Cube", value: "cube" },
      ]),
      f("a", "Length / radius / side", "5", undefined, 0.000001),
      f("b", "Width", "4", undefined, 0.000001),
      f("h", "Height", "10", undefined, 0.000001),
    ],
    calculate(v) {
      const a = n(v, "a"),
        b = n(v, "b"),
        h = n(v, "h");
      let area = 0;
      if (v.shape === "box") area = 2 * (a * b + a * h + b * h);
      else if (v.shape === "sphere") area = 4 * Math.PI * a * a;
      else if (v.shape === "cylinder") area = 2 * Math.PI * a * (a + h);
      else area = 6 * a * a;
      return R(
        "Surface area",
        `${fmt(area)} square units`,
        `Surface area of the selected ${v.shape}.`,
        [
          { label: "Shape", value: v.shape },
          { label: "Surface area", value: fmt(area) },
        ],
      );
    },
  },
  {
    slug: "pythagorean-theorem",
    name: "Pythagorean Theorem Calculator",
    category: "Math",
    description: "Calculate the hypotenuse or missing leg of a right triangle.",
    icon: "TriangleRight",
    fields: [
      f("a", "Leg a", "3", undefined, 0),
      f("b", "Leg b", "4", undefined, 0),
      f(
        "c",
        "Hypotenuse c (optional; use 0 to solve for c)",
        "0",
        undefined,
        0,
      ),
    ],
    calculate(v) {
      const a = n(v, "a"),
        b = n(v, "b"),
        c = n(v, "c");
      if (c === 0) {
        const x = Math.hypot(a, b);
        return R("Hypotenuse", fmt(x), "c = √(a² + b²).", [
          { label: "Leg a", value: fmt(a) },
          { label: "Leg b", value: fmt(b) },
          { label: "Hypotenuse", value: fmt(x) },
        ]);
      }
      if (
        c <= Math.max(a, b) ||
        Math.abs(a * a + b * b - c * c) > 1e-6 * Math.max(1, c * c)
      )
        throw new Error(
          "Entered lengths do not satisfy the Pythagorean theorem.",
        );
      return R(
        "Right triangle verified",
        "a² + b² = c²",
        "The entered side lengths satisfy the theorem.",
        [
          { label: "Leg a", value: fmt(a) },
          { label: "Leg b", value: fmt(b) },
          { label: "Hypotenuse", value: fmt(c) },
        ],
      );
    },
  },
  {
    slug: "right-triangle",
    name: "Right Triangle Calculator",
    category: "Math",
    description:
      "Calculate hypotenuse, area and acute angles from the two perpendicular legs.",
    icon: "TriangleRight",
    fields: [
      f("a", "Opposite leg", "3", undefined, 0.000001),
      f("b", "Adjacent leg", "4", undefined, 0.000001),
    ],
    calculate(v) {
      const a = n(v, "a"),
        b = n(v, "b"),
        c = Math.hypot(a, b),
        ang = (Math.atan2(a, b) * 180) / Math.PI;
      return R(
        "Hypotenuse",
        fmt(c),
        "Right-triangle measurements from the two perpendicular legs.",
        [
          { label: "Area", value: fmt((a * b) / 2) },
          { label: "Angle opposite leg a", value: `${fmt(ang, 2)}°` },
          { label: "Other acute angle", value: `${fmt(90 - ang, 2)}°` },
        ],
      );
    },
  },
  {
    slug: "root",
    name: "Root Calculator",
    category: "Math",
    description: "Calculate an nth root of a real number.",
    icon: "Radical",
    fields: [
      f("value", "Number", "81"),
      f("degree", "Root degree", "4", undefined, 1, 1),
    ],
    calculate(v) {
      const x = n(v, "value"),
        d = Math.trunc(n(v, "degree"));
      if (!d || d > 99)
        throw new Error("Root degree must be between 1 and 99.");
      if (x < 0 && d % 2 === 0)
        throw new Error("An even root of a negative number is not real.");
      const r = x < 0 ? -Math.pow(-x, 1 / d) : Math.pow(x, 1 / d);
      return R(
        "Root result",
        fmt(r, 10),
        `The ${d}${d === 2 ? "nd" : d === 3 ? "rd" : "th"} root of ${fmt(x)}.`,
        [
          { label: "Radicand", value: fmt(x) },
          { label: "Degree", value: String(d) },
          {
            label: "Check (root raised to degree)",
            value: fmt(Math.pow(r, d), 8),
          },
        ],
      );
    },
  },
  {
    slug: "least-common-multiple",
    name: "Least Common Multiple Calculator",
    category: "Math",
    description: "Calculate the least common multiple of two integers.",
    icon: "Sigma",
    fields: [
      f("a", "First integer", "12", undefined, 1, 1),
      f("b", "Second integer", "18", undefined, 1, 1),
    ],
    calculate(v) {
      const a = Math.abs(Math.trunc(n(v, "a"))),
        b = Math.abs(Math.trunc(n(v, "b")));
      const l = a === 0 || b === 0 ? 0 : (a / gcd(a, b)) * b;
      return R(
        "Least common multiple",
        String(l),
        "LCM(a,b) = |a × b| / GCD(a,b).",
        [
          { label: "GCD", value: String(gcd(a, b)) },
          { label: "First integer", value: String(a) },
          { label: "Second integer", value: String(b) },
        ],
      );
    },
  },
  {
    slug: "greatest-common-factor",
    name: "Greatest Common Factor Calculator",
    category: "Math",
    description: "Calculate the greatest common factor of two integers.",
    icon: "Sigma",
    fields: [
      f("a", "First integer", "48", undefined, 0, 1),
      f("b", "Second integer", "18", undefined, 0, 1),
    ],
    calculate(v) {
      const a = Math.trunc(n(v, "a")),
        b = Math.trunc(n(v, "b"));
      return R(
        "Greatest common factor",
        String(gcd(a, b)),
        "The largest positive integer that divides both values exactly.",
        [
          { label: "First integer", value: String(a) },
          { label: "Second integer", value: String(b) },
        ],
      );
    },
  },
  {
    slug: "factor",
    name: "Factor Calculator",
    category: "Math",
    description:
      "List the positive integer factors of an entered whole number.",
    icon: "List",
    fields: [f("value", "Positive integer", "36", undefined, 1, 1)],
    calculate(v) {
      const x = Math.trunc(n(v, "value"));
      if (x > 1000000000)
        throw new Error("Enter an integer no greater than 1,000,000,000.");
      const a = [];
      for (let i = 1; i <= Math.sqrt(x); i++)
        if (x % i === 0) {
          a.push(i);
          if (i !== x / i) a.push(x / i);
        }
      a.sort((p, q) => p - q);
      return R("Factors", a.join(", "), `Positive integer factors of ${x}.`, [
        { label: "Number of factors", value: String(a.length) },
        { label: "Smallest factor", value: String(a[0]) },
        { label: "Largest factor", value: String(a[a.length - 1]) },
      ]);
    },
  },
  {
    slug: "rounding",
    name: "Rounding Calculator",
    category: "Math",
    description:
      "Round a decimal value to a selected number of decimal places.",
    icon: "WholeWord",
    fields: [
      f("value", "Number", "123.456789"),
      f("places", "Decimal places", "2", undefined, 0, 1),
      s("method", "Rounding method", "nearest", [
        { label: "Nearest", value: "nearest" },
        { label: "Up (ceiling)", value: "up" },
        { label: "Down (floor)", value: "down" },
      ]),
    ],
    calculate(v) {
      const p = Math.min(12, Math.trunc(n(v, "places"))),
        scale = 10 ** p,
        x = n(v, "value"),
        r =
          (v.method === "up"
            ? Math.ceil(x * scale)
            : v.method === "down"
              ? Math.floor(x * scale)
              : Math.round(x * scale)) / scale;
      return R(
        "Rounded value",
        r.toFixed(p),
        "Rounded to the selected decimal places and method.",
        [
          { label: "Original value", value: String(x) },
          { label: "Decimal places", value: String(p) },
          { label: "Difference", value: fmt(r - x, 12) },
        ],
      );
    },
  },
  {
    slug: "matrix",
    name: "Matrix Calculator",
    category: "Math",
    description:
      "Calculate determinant, inverse and product for two 2×2 matrices.",
    icon: "Grid3X3",
    fields: [
      f("a", "Matrix A · a₁₁", "1"),
      f("b", "Matrix A · a₁₂", "2"),
      f("c", "Matrix A · a₂₁", "3"),
      f("d", "Matrix A · a₂₂", "4"),
      f("e", "Matrix B · b₁₁", "5"),
      f("g", "Matrix B · b₁₂", "6"),
      f("h", "Matrix B · b₂₁", "7"),
      f("i", "Matrix B · b₂₂", "8"),
      s("mode", "Operation", "multiply", [
        { label: "Add A + B", value: "add" },
        { label: "Subtract A − B", value: "sub" },
        { label: "Multiply A × B", value: "multiply" },
        { label: "Determinant of A", value: "det" },
      ]),
    ],
    calculate(v) {
      const a = n(v, "a"),
        b = n(v, "b"),
        c = n(v, "c"),
        d = n(v, "d"),
        e = n(v, "e"),
        g = n(v, "g"),
        h = n(v, "h"),
        i = n(v, "i");
      let vals: number[];
      if (v.mode === "det") vals = [a * d - b * c];
      else if (v.mode === "add") vals = [a + e, b + g, c + h, d + i];
      else if (v.mode === "sub") vals = [a - e, b - g, c - h, d - i];
      else vals = [a * e + b * h, a * g + b * i, c * e + d * h, c * g + d * i];
      return R(
        "Matrix result",
        v.mode === "det"
          ? fmt(vals[0])
          : `[${fmt(vals[0])}, ${fmt(vals[1])}] · [${fmt(vals[2])}, ${fmt(vals[3])}]`,
        "Operation on two 2×2 matrices.",
        [
          { label: "Operation", value: v.mode },
          { label: "Determinant of A", value: fmt(a * d - b * c) },
          { label: "Determinant of B", value: fmt(e * i - g * h) },
        ],
      );
    },
  },
  {
    slug: "scientific-notation",
    name: "Scientific Notation Calculator",
    category: "Math",
    description: "Convert a number into normalized scientific notation.",
    icon: "Sigma",
    fields: [f("value", "Number", "1234567.89")],
    calculate(v) {
      const x = n(v, "value");
      if (x === 0)
        return R(
          "Scientific notation",
          "0 × 10⁰",
          "Zero has no non-zero exponent representation.",
          [{ label: "Standard form", value: "0" }],
        );
      const exp = Math.floor(Math.log10(Math.abs(x))),
        mant = x / Math.pow(10, exp);
      return R(
        "Scientific notation",
        `${fmt(mant, 10)} × 10^${exp}`,
        "Normalized scientific notation with a mantissa whose absolute value is at least 1 and less than 10.",
        [
          { label: "Mantissa", value: fmt(mant, 10) },
          { label: "Exponent", value: String(exp) },
          { label: "Original value", value: String(x) },
        ],
      );
    },
  },
  {
    slug: "big-number",
    name: "Big Number Calculator",
    category: "Math",
    description:
      "Perform exact integer addition, subtraction, multiplication and division using arbitrary-precision integers.",
    icon: "Binary",
    fields: [
      f(
        "a",
        "First whole number",
        "12345678901234567890",
        undefined,
        undefined,
        1,
      ),
      f("b", "Second whole number", "987654321", undefined, undefined, 1),
      op,
    ],
    calculate(v) {
      let a: bigint, b: bigint;
      try {
        a = BigInt(v.a);
        b = BigInt(v.b);
      } catch {
        throw new Error("Enter whole integers without decimal points.");
      }
      let x: bigint;
      if (v.op === "add") x = a + b;
      else if (v.op === "sub") x = a - b;
      else if (v.op === "mul") x = a * b;
      else {
        if (b === 0n) throw new Error("Cannot divide by zero.");
        x = a / b;
      }
      return R(
        "Exact integer result",
        x.toString(),
        "Uses JavaScript BigInt so integer arithmetic is not limited by floating-point precision.",
        [
          { label: "First integer", value: a.toString() },
          { label: "Second integer", value: b.toString() },
          { label: "Operation", value: v.op },
        ],
      );
    },
  },
  {
    slug: "prime-factorization",
    name: "Prime Factorization Calculator",
    category: "Math",
    description: "Break a positive integer into its prime factors.",
    icon: "Sigma",
    fields: [f("value", "Positive integer", "360", undefined, 2, 1)],
    calculate(v) {
      const x = Math.trunc(n(v, "value"));
      if (x > 1e12)
        throw new Error("Enter an integer no greater than 1,000,000,000,000.");
      const ps = [];
      let y = x;
      for (let p = 2; p * p <= y; p++)
        while (y % p === 0) {
          ps.push(p);
          y /= p;
        }
      if (y > 1) ps.push(y);
      return R(
        "Prime factorization",
        ps.length ? ps.join(" × ") : String(x),
        `Prime factors of ${x}.`,
        [
          { label: "Prime factors count", value: String(ps.length) },
          { label: "Original integer", value: String(x) },
        ],
      );
    },
  },
  {
    slug: "common-factor",
    name: "Common Factor Calculator",
    category: "Math",
    description: "Find all positive common factors of two integers.",
    icon: "Sigma",
    fields: [
      f("a", "First integer", "24", undefined, 1, 1),
      f("b", "Second integer", "36", undefined, 1, 1),
    ],
    calculate(v) {
      const a = Math.abs(Math.trunc(n(v, "a"))),
        b = Math.abs(Math.trunc(n(v, "b"))),
        g = gcd(a, b),
        factors = [];
      for (let i = 1; i <= g; i++) if (g % i === 0) factors.push(i);
      return R(
        "Common factors",
        factors.join(", "),
        "Positive factors shared by both entered integers.",
        [
          { label: "Greatest common factor", value: String(g) },
          { label: "Number of common factors", value: String(factors.length) },
        ],
      );
    },
  },
  {
    slug: "basic-calculator",
    name: "Basic Calculator",
    category: "Math",
    description: "Perform basic arithmetic operations on two numbers.",
    icon: "Calculator",
    fields: [f("a", "First number", "125"), f("b", "Second number", "25"), op],
    calculate(v) {
      const a = n(v, "a"),
        b = n(v, "b");
      if (v.op === "div" && !b) throw new Error("Cannot divide by zero.");
      const x =
        v.op === "add"
          ? a + b
          : v.op === "sub"
            ? a - b
            : v.op === "mul"
              ? a * b
              : a / b;
      return R("Result", fmt(x, 12), "Basic arithmetic calculation.", [
        { label: "First number", value: fmt(a) },
        { label: "Second number", value: fmt(b) },
        { label: "Operation", value: v.op },
      ]);
    },
  },
  {
    slug: "long-division",
    name: "Long Division Calculator",
    category: "Math",
    description: "Calculate quotient and remainder for integer division.",
    icon: "Divide",
    fields: [
      f("dividend", "Dividend", "125", undefined, undefined, 1),
      f("divisor", "Divisor", "7", undefined, undefined, 1),
    ],
    calculate(v) {
      const a = Math.trunc(n(v, "dividend")),
        b = Math.trunc(n(v, "divisor"));
      if (!b) throw new Error("Divisor cannot be zero.");
      const q = Math.trunc(a / b),
        r = a - q * b;
      return R("Quotient", String(q), "Integer long division with remainder.", [
        { label: "Remainder", value: String(r) },
        { label: "Decimal quotient", value: fmt(a / b) },
        { label: "Check", value: `${b} × ${q} + ${r} = ${a}` },
      ]);
    },
  },
  {
    slug: "average",
    name: "Average Calculator",
    category: "Math",
    description: "Calculate the arithmetic mean of five entered values.",
    icon: "ChartColumn",
    fields: [
      f("x1", "Value 1", "10"),
      f("x2", "Value 2", "20"),
      f("x3", "Value 3", "30"),
      f("x4", "Value 4", "40"),
      f("x5", "Value 5", "50"),
    ],
    calculate(v) {
      const a = [1, 2, 3, 4, 5].map((i) => n(v, "x" + i)),
        sum = a.reduce((x, y) => x + y, 0),
        avg = sum / a.length;
      return R(
        "Average (mean)",
        fmt(avg),
        "Sum of the entered values divided by the number of values.",
        [
          { label: "Sum", value: fmt(sum) },
          { label: "Count", value: String(a.length) },
          { label: "Mean", value: fmt(avg) },
        ],
      );
    },
  },
  {
    slug: "p-value",
    name: "P-value Calculator",
    category: "Math",
    description:
      "Estimate a two-tailed p-value from a z test statistic using the standard normal distribution.",
    icon: "ChartLine",
    fields: [f("z", "Z test statistic", "1.96")],
    calculate(v) {
      const z = n(v, "z"),
        p = 2 * (1 - cdf(Math.abs(z)));
      return R(
        "Approximate two-tailed p-value",
        fmt(p, 8),
        "Standard normal approximation for a two-sided z test.",
        [
          { label: "Z statistic", value: fmt(z) },
          {
            label: "One-tailed upper probability",
            value: fmt(1 - cdf(Math.abs(z)), 8),
          },
          { label: "Two-tailed p-value", value: fmt(p, 8) },
        ],
      );
    },
  },
];
export const mathExtras: CalculatorDefinition[] = defs;
