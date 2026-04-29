import { useEffect, useState, useRef } from "react";
import HistoryCard from "./HistoryCard";
import DashboardSummary from "./summary";
import EmissionTrendChart from "./EmissionTrend";
import VehicleBreakdownChart from "./VehicleBreakdownChart";

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

// Determines column count from container width
function useColCount(ref) {
  const [cols, setCols] = useState(1);

  useEffect(() => {
    const update = () => {
      if (!ref.current) return;
      const w = ref.current.offsetWidth;
      if (w >= 1280) setCols(3);
      else if (w >= 640) setCols(2);
      else setCols(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [ref]);

  return cols;
}

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(false);
  const gridRef = useRef(null);
  const cols = useColCount(gridRef);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://localhost:5000/predictionEngine/getPredictions", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setHistory(data);
      } catch (error) {
        console.error("Error fetching history:", error.message);
      } finally {
        setLoading(false);
        setTimeout(() => setHeaderVisible(true), 100);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Header */}
        <div
          className="text-center mb-12"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(-20px)",
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          <h1 className="text-5xl md:text-6xl font-black mb-2 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
            Prediction History
          </h1>
          <p className="text-gray-600">
            Your past CO₂ emission estimates in one place
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          </div>
        )}

        {/* Empty */}
        {!loading && history.length === 0 && (
          <FadeIn
            direction="up"
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="text-5xl mb-4">🌿</div>
            <p className="text-gray-500 font-medium">No predictions yet.</p>
            <p className="text-sm text-gray-400 mt-1">
              Make your first trip estimate to see results here.
            </p>
          </FadeIn>
        )}

        {!loading && history.length > 0 && (
          <>
            {/* Summary */}
            <FadeIn direction="up">
              <DashboardSummary history={history} />
            </FadeIn>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              <FadeIn direction="left" className="flex flex-col h-full">
                <EmissionTrendChart history={history} />
              </FadeIn>
              <FadeIn
                direction="right"
                delay={100}
                className="flex flex-col h-full"
              >
                <VehicleBreakdownChart history={history} />
              </FadeIn>
            </div>

            {/* Cards — row-by-row stagger */}
            <section className="space-y-4">
              <FadeIn direction="up">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  All Trips · {history.length} records
                </h2>
              </FadeIn>

              <div
                ref={gridRef}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
              >
                {history.map((item, index) => {
                  const row = Math.floor(index / cols);
                  return (
                    <FadeIn key={item.id} direction="up" delay={row * 120}>
                      <HistoryCard
                        id={item.id}
                        date={new Date(item.created_at).toLocaleDateString()}
                        vehicle={item.vehicle_type}
                        fuel={item.fuel_type}
                        distance={item.distance}
                        totalCo2={item.average_prediction}
                        speed={item.speed}
                        cargoWeight={item.cargo_weight}
                        age={item.age}
                        roadType={item.road_type}
                        prediction1={item.prediction_1}
                        prediction2={item.prediction_2}
                        prediction3={item.prediction_3}
                        average_prediction={item.average_prediction}
                      />
                    </FadeIn>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
