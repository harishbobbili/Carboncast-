import { useState, useEffect, useRef } from "react";
import CarbonEngine from "./CarbonEngine.js";

// ── Shared transition primitives ──────────────────────────────────────────────
function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, visible] = useFadeIn();
  const transforms = {
    up: visible ? "translateY(0)" : "translateY(32px)",
    down: visible ? "translateY(0)" : "translateY(-32px)",
    left: visible ? "translateX(0)" : "translateX(-32px)",
    right: visible ? "translateX(0)" : "translateX(32px)",
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: transforms[direction],
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function Predict() {
  const [speed, setSpeed] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [cargoWt, setCargoWt] = useState("");
  const [age, setAge] = useState("");
  const [roadType, setRoadType] = useState("");
  const [distance, setDistance] = useState("");
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeaderVisible(true), 100);
  }, []);

  const vehicleConstraints = {
    Motorcycle: { allowedFuels: ["Petrol", "Electric"], maxCargo: 100 },
    Car: {
      allowedFuels: ["Petrol", "Diesel", "CNG", "Hybrid", "Electric"],
      maxCargo: 500,
    },
    Van: { allowedFuels: ["Petrol", "Diesel", "CNG"], maxCargo: 2000 },
    Truck: { allowedFuels: ["Diesel"], maxCargo: 12000 },
    Bus: { allowedFuels: ["Diesel", "CNG"], maxCargo: 5000 },
  };

  const getAllowedFuels = () =>
    vehicleConstraints[vehicleType]?.allowedFuels || [];
  const getMaxCargo = () => vehicleConstraints[vehicleType]?.maxCargo || null;

  useEffect(() => {
    if (vehicleType && fuelType && !getAllowedFuels().includes(fuelType))
      setFuelType("");
    if (!vehicleType) setFuelType("");
  }, [vehicleType]);

  const validateForm = () => {
    const e = {};
    if (!speed || Number(speed) <= 0)
      e.speed = "Please enter a valid speed (must be greater than 0)";
    if (!vehicleType) e.vehicleType = "Please select a vehicle type";
    if (!fuelType) e.fuelType = "Please select a fuel type";
    if (cargoWt === "" || Number(cargoWt) < 0)
      e.cargoWt = "Cargo weight cannot be negative";
    if (age === "" || Number(age) < 0) e.age = "Vehicle age cannot be negative";
    if (!roadType) e.roadType = "Please select a road type";
    if (!distance || Number(distance) <= 0)
      e.distance = "Please enter a valid distance (must be greater than 0)";
    if (vehicleType && fuelType && !getAllowedFuels().includes(fuelType))
      e.fuelType = `${vehicleType} only supports: ${getAllowedFuels().join(", ")}`;
    if (vehicleType && cargoWt !== "" && Number(cargoWt) > getMaxCargo())
      e.cargoWt = `Maximum cargo for ${vehicleType} is ${getMaxCargo()} kg`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePredict = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      setErrors({});
      const payload = {
        speed: Number(speed),
        vehicleType,
        fuelType,
        cargoWt: Number(cargoWt),
        age: Number(age),
        roadType,
        distance: Number(distance),
      };
      const response = await fetch("http://localhost:5000/predictionEngine/predict", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to get prediction");
      const result = await response.json();
      const emission = result.emission;
      setPredictionData({
        emission,
        category: CarbonEngine.getEmissionCategory(emission),
        score: CarbonEngine.calculateScore(emission),
        trees: CarbonEngine.calculateTrees(
          CarbonEngine.calculateTotalEmission(emission, 1),
        ),
        recommendations: CarbonEngine.generateRecommendations(
          emission,
          fuelType,
          1,
        ),
      });
      setLoading(false);
      setTimeout(() => {
        document
          .getElementById("results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (error) {
      console.error("Prediction error:", error);
      setLoading(false);
      alert("Error making prediction. Please check your inputs and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 pt-8 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header — mount-based */}
        <div
          className="text-center mb-12"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(-20px)",
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          <h1 className="text-5xl md:text-6xl font-black mb-2 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
            Emission Prediction
          </h1>
          <p className="text-gray-600">Enter your trip details below</p>
        </div>

        {/* Input cards — slide in from opposite sides */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <FadeIn direction="left">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 h-full">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                Vehicle Details
              </h3>
              <div className="space-y-3">
                <div>
                  <input
                    type="number"
                    placeholder="Speed (km/h)"
                    value={speed}
                    onChange={(e) => {
                      setSpeed(e.target.value);
                      if (errors.speed) setErrors({ ...errors, speed: null });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.speed ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.speed && (
                    <p className="text-xs text-red-500 mt-1">{errors.speed}</p>
                  )}
                </div>
                <div>
                  <select
                    value={vehicleType}
                    onChange={(e) => {
                      setVehicleType(e.target.value);
                      if (errors.vehicleType)
                        setErrors({ ...errors, vehicleType: null });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.vehicleType ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Vehicle Type</option>
                    {["Motorcycle", "Car", "Van", "Truck", "Bus"].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                  {errors.vehicleType && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.vehicleType}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Vehicle Age (years)"
                    value={age}
                    onChange={(e) => {
                      setAge(e.target.value);
                      if (errors.age) setErrors({ ...errors, age: null });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.age ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.age && (
                    <p className="text-xs text-red-500 mt-1">{errors.age}</p>
                  )}
                </div>
                <div>
                  <select
                    value={fuelType}
                    disabled={!vehicleType}
                    onChange={(e) => {
                      setFuelType(e.target.value);
                      if (errors.fuelType)
                        setErrors({ ...errors, fuelType: null });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${errors.fuelType ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">
                      {vehicleType ? "Fuel Type" : "Select vehicle first"}
                    </option>
                    {getAllowedFuels().map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                  {errors.fuelType && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.fuelType}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={100}>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 h-full">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                Trip Details
              </h3>
              <div className="space-y-3">
                <div>
                  <input
                    type="number"
                    placeholder={
                      vehicleType
                        ? `Cargo Weight (max: ${getMaxCargo()} kg)`
                        : "Cargo Weight (kg)"
                    }
                    value={cargoWt}
                    onChange={(e) => {
                      setCargoWt(e.target.value);
                      if (errors.cargoWt)
                        setErrors({ ...errors, cargoWt: null });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.cargoWt ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.cargoWt && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.cargoWt}
                    </p>
                  )}
                </div>
                <div>
                  <select
                    value={roadType}
                    onChange={(e) => {
                      setRoadType(e.target.value);
                      if (errors.roadType)
                        setErrors({ ...errors, roadType: null });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.roadType ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Road Type</option>
                    {["Highway", "Urban", "Rural"].map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  {errors.roadType && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.roadType}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Distance (km)"
                    value={distance}
                    onChange={(e) => {
                      setDistance(e.target.value);
                      if (errors.distance)
                        setErrors({ ...errors, distance: null });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.distance ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.distance && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.distance}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Button */}
        <FadeIn direction="up" delay={100}>
          <div className="flex justify-center mb-12">
            <button
              onClick={handlePredict}
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold px-10 py-3 rounded-full shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Calculating..." : "Generate Prediction"}
            </button>
          </div>
        </FadeIn>

        {/* Results */}
        {predictionData && (
          <div id="results" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "CO₂ per km",
                  value: (predictionData.emission / distance).toFixed(3),
                  unit: "kg/km",
                  color: "green",
                  border: "border-green-100",
                },
                {
                  label: "Total CO₂",
                  value: predictionData.emission.toFixed(2),
                  unit: "kg",
                  color: "blue",
                  border: "border-blue-100",
                },
                {
                  label: "Eco Score",
                  value: predictionData.score,
                  unit: "/ 100",
                  color: "purple",
                  border: "border-purple-100",
                },
                {
                  label: "Trees Needed",
                  value: predictionData.trees,
                  unit: "trees",
                  color: "orange",
                  border: "border-orange-100",
                },
              ].map(({ label, value, unit, color, border }, i) => (
                <FadeIn key={label} direction="up" delay={i * 80}>
                  <div
                    className={`bg-white rounded-xl p-4 shadow-md border ${border}`}
                  >
                    <p className="text-xs text-gray-500 mb-1">{label}</p>
                    <h3 className={`text-2xl font-bold text-${color}-600`}>
                      {value}
                    </h3>
                    <p className="text-xs text-gray-400">{unit}</p>
                  </div>
                </FadeIn>
              ))}
            </div>

            {/* Impact + Model Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <FadeIn direction="left">
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 h-full">
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <span>🌳</span> Environmental Impact
                  </h3>
                  <p className="text-gray-700">
                    To offset this emission, plant{" "}
                    <span className="font-bold text-2xl text-green-600">
                      {predictionData.trees}
                    </span>{" "}
                    tree{predictionData.trees !== 1 ? "s" : ""}
                  </p>
                </div>
              </FadeIn>
              <FadeIn direction="right" delay={100}>
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 h-full">
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <span>⚙️</span> Model Details
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-green-600 pt-2 border-t mt-2">
                      Average: {predictionData.emission.toFixed(4)}
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Recommendations */}
            <FadeIn direction="up">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>💡</span> Recommendations
                </h3>
                <div className="space-y-2">
                  {predictionData.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-100"
                      style={{
                        opacity: 1,
                        animation: `fadeSlideUp 0.4s ease-out ${i * 60}ms both`,
                      }}
                    >
                      <span className="text-green-600 font-bold flex-shrink-0">
                        {i + 1}.
                      </span>
                      <span className="text-sm text-gray-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
