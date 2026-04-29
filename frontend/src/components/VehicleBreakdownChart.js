import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
  Cell,
  Legend,
} from "recharts";

const VEHICLE_COLORS = {
  Car: "#10B981",
  Truck: "#3B82F6",
  Bus: "#F59E0B",
  Motorcycle: "#8B5CF6",
  Van: "#EF4444",
  SUV: "#06B6D4",
};

const DEFAULT_COLOR = "#6B7280";

function getColor(vehicle, index) {
  return (
    VEHICLE_COLORS[vehicle] ||
    Object.values(VEHICLE_COLORS)[index % Object.values(VEHICLE_COLORS).length] ||
    DEFAULT_COLOR
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 min-w-[160px]">
      <p className="text-sm font-bold text-gray-700 mb-2">{d.vehicle}</p>
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs text-gray-500">Total CO₂</span>
        <span className="text-sm font-semibold text-emerald-600">
          {d.co2.toLocaleString()} kg
        </span>
      </div>
      <div className="flex items-center justify-between gap-4 mt-1">
        <span className="text-xs text-gray-500">Trips</span>
        <span className="text-sm font-semibold text-blue-600">{d.trips}</span>
      </div>
      <div className="flex items-center justify-between gap-4 mt-1">
        <span className="text-xs text-gray-500">Avg / Trip</span>
        <span className="text-sm font-semibold text-purple-600">
          {d.avg.toLocaleString()} kg
        </span>
      </div>
    </div>
  );
};

export default function VehicleBreakdownChart({ history }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [metric, setMetric] = useState("co2"); // "co2" | "avg" | "trips"

  const chartData = useMemo(() => {
    const vehicleMap = {};
    history.forEach((item) => {
      if (!vehicleMap[item.vehicle_type]) {
        vehicleMap[item.vehicle_type] = { co2: 0, trips: 0 };
      }
      vehicleMap[item.vehicle_type].co2 += item.prediction_1;
      vehicleMap[item.vehicle_type].trips += 1;
    });

    return Object.keys(vehicleMap)
      .map((vehicle, i) => {
        const { co2, trips } = vehicleMap[vehicle];
        return {
          vehicle,
          co2: Number(co2.toFixed(2)),
          trips,
          avg: Number((co2 / trips).toFixed(2)),
          color: getColor(vehicle, i),
        };
      })
      .sort((a, b) => b[metric] - a[metric]);
  }, [history, metric]);

  const metricConfig = {
    co2: { label: "Total CO₂ (kg)", color: "#10B981" },
    avg: { label: "Avg CO₂ / Trip (kg)", color: "#8B5CF6" },
    trips: { label: "Number of Trips", color: "#3B82F6" },
  };

  const totalCO2 = chartData.reduce((s, d) => s + d.co2, 0);
  const totalTrips = chartData.reduce((s, d) => s + d.trips, 0);
  const topVehicle = chartData[0]?.vehicle ?? "—";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-green-100 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Emissions by Vehicle Type
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Aggregated from {history.length} records
          </p>
        </div>

        {/* Metric Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1 text-xs font-medium">
          {Object.entries(metricConfig).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setMetric(key)}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                metric === key
                  ? "bg-white shadow text-gray-800"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {key === "co2" ? "Total CO₂" : key === "avg" ? "Avg / Trip" : "Trips"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total CO₂", value: `${totalCO2.toLocaleString()} kg`, color: "emerald" },
          { label: "Total Trips", value: totalTrips.toLocaleString(), color: "blue" },
          { label: "Top Emitter", value: topVehicle, color: "purple" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className={`bg-${color}-50 border border-${color}-100 rounded-xl p-3 text-center`}
          >
            <p className={`text-xs text-${color}-500 font-medium`}>{label}</p>
            <p className={`text-sm font-bold text-${color}-700 mt-0.5 truncate`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis
            dataKey="vehicle"
            tick={{ fontSize: 12, fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
            label={{
              value: metricConfig[metric].label,
              angle: -90,
              position: "insideLeft",
              offset: 10,
              style: { fontSize: 11, fill: "#9CA3AF" },
            }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F9FAFB" }} />
          <Bar
            dataKey={metric}
            radius={[6, 6, 0, 0]}
            isAnimationActive
            animationDuration={600}
            animationEasing="ease-out"
            onMouseEnter={(_, index) => setActiveIndex(index)}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={entry.vehicle}
                fill={entry.color}
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.35}
                style={{ transition: "opacity 0.2s" }}
              />
            ))}
            <LabelList
              dataKey={metric}
              position="top"
              style={{ fontSize: 11, fontWeight: 600, fill: "#374151" }}
              formatter={(v) =>
                metric === "trips" ? v : `${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`
              }
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}