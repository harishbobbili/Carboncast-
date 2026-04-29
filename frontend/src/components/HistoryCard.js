import { useState } from "react";

export default function HistoryCard({
  id,
  date,
  vehicle,
  fuel,
  distance,
  totalCo2,
  speed,
  cargoWeight,
  age,
  roadType,
  prediction1,  
}) {
  const [showDetails, setShowDetails] = useState(false);

  const co2Level =
    prediction1 < 50 ? "low" : totalCo2 < 120 ? "medium" : "high";

  const co2Color = {
    low: { text: "text-emerald-600", bg: "bg-emerald-50", bar: "bg-emerald-400", badge: "bg-emerald-100 text-emerald-700" },
    medium: { text: "text-amber-600", bg: "bg-amber-50", bar: "bg-amber-400", badge: "bg-amber-100 text-amber-700" },
    high: { text: "text-red-500", bg: "bg-red-50", bar: "bg-red-400", badge: "bg-red-100 text-red-700" },
  }[co2Level];

  const co2Label = { low: "Low Emission", medium: "Moderate", high: "High Emission" }[co2Level];

  const modelPredictions = [
    { label: "Model", value: prediction1 },
  ];

  const fuelIcon = {
    Diesel: "⛽",
    Electric: "⚡",
    Petrol: "🔥",
    Hybrid: "🌿",
  }[fuel] ?? "⛽";

  return (
    <div
      style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}
      className={`
        relative bg-white rounded-2xl border overflow-hidden
        transition-all duration-300 ease-out
        hover:shadow-[0_8px_32px_rgba(16,185,129,0.12)]
        ${showDetails ? "border-green-300 shadow-md" : "border-gray-100 shadow-sm hover:border-green-200"}
      `}
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full ${co2Color.bar} opacity-80`} />

      <div className="px-6 pt-5 pb-4 space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-base">
              {fuelIcon}
            </div>
            <div>
              <p className="text-[0.95rem] font-semibold text-gray-900 leading-tight">{vehicle}</p>
              <p className="text-xs text-gray-400 mt-0.5">{fuel} · {roadType ?? "—"}</p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <p className="text-xs text-gray-400">{date}</p>
            <span className={`mt-1 inline-block text-[11px] font-medium px-2 py-0.5 rounded-full ${co2Color.badge}`}>
              {co2Label}
            </span>
          </div>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-2 divide-x divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
          <div className="px-4 py-3">
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Distance</p>
            <p className="text-xl font-bold text-gray-800 mt-0.5">
              {distance}
              <span className="text-sm font-normal text-gray-400 ml-1">km</span>
            </p>
          </div>
          <div className={`px-4 py-3 ${co2Color.bg}`}>
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">CO₂ Emitted</p>
            <p className={`text-xl font-bold mt-0.5 ${co2Color.text}`}>
              {prediction1.toFixed(2)}
              <span className="text-sm font-normal text-gray-400 ml-1">kg</span>
            </p>
          </div>
        </div>

        {/* Expandable details */}
        <div
          style={{
            display: "grid",
            gridTemplateRows: showDetails ? "1fr" : "0fr",
            transition: "grid-template-rows 0.3s ease",
          }}
        >
          <div className="overflow-hidden">
            <div className="pt-1 pb-2 space-y-4">

              {/* Trip info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Avg Speed", value: `${speed} km/h` },
                  { label: "Cargo Weight", value: `${cargoWeight} kg` },
                  { label: "Vehicle Age", value: `${age} yrs` },
                  { label: "Road Type", value: roadType },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl px-3 py-2.5">
                    <p className="text-[11px] text-gray-400 uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-semibold text-gray-700 mt-0.5">{value ?? "—"}</p>
                  </div>
                ))}
              </div>

              {/* Model predictions */}
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Model Predictions</p>
                </div>
                <div className="divide-y divide-gray-50">
                  {modelPredictions.map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between px-3 py-2.5">
                      <span className="text-xs text-gray-500">{label}</span>
                      <span className="text-sm font-semibold text-gray-800">{value ?? "—"}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-gray-400 uppercase tracking-wide">Estimated emission</span>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`
              flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg
              transition-all duration-20
              ${showDetails
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }
            `}
          >
            {showDetails ? (
              <>Hide Details <span className="text-[15px]">▲</span></>
            ) : (
              <>View Details <span className="text-[15px]">▼</span></>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}