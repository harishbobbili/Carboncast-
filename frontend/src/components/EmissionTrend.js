import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const RANGES = [
  { label: "Day",   days: 1 },
  { label: "Week",  days: 7 },
  { label: "Month", days: 30 },
  { label: "Year",  days: 365 },
];

export default function EmissionTrendChart({ history }) {
  const [range, setRange] = useState("Day");

  const allData = useMemo(() =>
    [...history]
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .map((item) => {
        const d = new Date(item.created_at);
        return {
          date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          co2: Number(item.prediction_1.toFixed(2)),
          _ts: d.getTime(),
          _date: d.toDateString(),
        };
      }),
    [history]
  );

  const isSameDay = useMemo(() =>
    allData.length > 0 && allData.every((d) => d._date === allData[0]._date),
    [allData]
  );

  const chartData = useMemo(() => {
    const selected = RANGES.find((r) => r.label === range);
    const latestTs = allData.length ? allData[allData.length - 1]._ts : Date.now();
    const cutoff = latestTs - selected.days * 86400000;
    return allData.filter((d) => d._ts >= cutoff);
  }, [allData, range]);

  const avg = useMemo(() =>
    chartData.length
      ? Number((chartData.reduce((s, d) => s + d.co2, 0) / chartData.length).toFixed(2))
      : 0,
    [chartData]
  );

  const minCo2 = useMemo(() => Math.min(...chartData.map((d) => d.co2)), [chartData]);
  const maxCo2 = useMemo(() => Math.max(...chartData.map((d) => d.co2)), [chartData]);
  const padding = (maxCo2 - minCo2) * 0.2 || 5;
  const yMin = Math.max(0, Math.floor(minCo2 - padding));
  const yMax = Math.ceil(maxCo2 + padding);

  // Use time label if same day, date label otherwise
  const xKey = isSameDay ? "time" : "date";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-green-100 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Emission Trend</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Average:{" "}
            <span className="font-semibold text-emerald-600">
              {avg.toLocaleString()} kg CO₂
            </span>
          </p>
        </div>

        {/* Range Buttons */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1 text-xs font-medium">
          {RANGES.map(({ label }) => (
            <button
              key={label}
              onClick={() => setRange(label)}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                range === label
                  ? "bg-white shadow text-gray-800"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* No data fallback */}
      {chartData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          No data available for this range.
        </div>
      ) : (
        <div className="flex-1">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="co2Fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
              width={40}
              domain={[yMin, yMax]}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
            />
            <Tooltip formatter={(value) => [`${value.toLocaleString()} kg`, "CO₂"]} />
            <ReferenceLine
              y={avg}
              stroke="#059669"
              strokeDasharray="4 4"
              strokeOpacity={0.5}
              label={{
                value: "avg",
                position: "insideTopRight",
                style: { fontSize: 10, fill: "#059669" },
              }}
            />
            <Area
              type="monotone"
              dataKey="co2"
              stroke="#059669"
              strokeWidth={2.5}
              fill="url(#co2Fill)"
              dot={false}
              activeDot={{ r: 5, fill: "#059669", stroke: "white", strokeWidth: 2 }}
              isAnimationActive
              animationDuration={500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}