"use client";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import type { CalculationResult } from "@/lib/calculators/types";
const COLORS = ["#7652c5", "#ff9b35", "#27b98a", "#9b8bd0"];
export function ResultChart({ result }: { result: CalculationResult }) {
  if (!result.chart?.length) return null;
  const data = result.chart;
  return (
    <section className="mt-6 rounded-2xl bg-[#faf9fc] p-5">
      <div className="mb-4">
        <h3 className="font-bold">{result.chartTitle ?? "Visual breakdown"}</h3>
        <p className="mt-1 text-xs text-muted">
          Illustrative view based on your entered values
        </p>
      </div>
      <div className="h-[250px] w-full">
        {result.chartKind === "pie" ? (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius={58}
                outerRadius={88}
                paddingAngle={3}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) =>
                  Number(v).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })
                }
              />
            </PieChart>
          </ResponsiveContainer>
        ) : result.chartKind === "bar" ? (
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: -18, bottom: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e9e5f0"
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#89869b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#89869b" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip />
              <Bar dataKey="value" fill="#7652c5" radius={[7, 7, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer>
            {result.chartKind === "area" ? (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="growth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7652c5" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#7652c5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e9e5f0"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#89869b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#89869b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#7652c5"
                  fill="url(#growth)"
                  strokeWidth={3}
                />
              </AreaChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e9e5f0"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#89869b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#89869b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#7652c5"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
      {result.breakdown && (
        <div className="mt-3 flex flex-wrap gap-4">
          {result.breakdown.map((x, i) => (
            <div
              key={x.label}
              className="flex items-center gap-2 text-xs text-muted"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              {x.label}:{" "}
              <b className="text-ink">
                {x.value.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </b>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
