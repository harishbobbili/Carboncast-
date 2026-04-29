export default function DashboardSummary({ history }) {
  const totalTrips = history.length;
  console.log(history);
  const totalCo2 = history.reduce(
    (sum, item) => sum + item.prediction_1,
    0
  );

  const avgCo2 =
    totalTrips > 0 ? (totalCo2 / totalTrips).toFixed(2) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      
      {/* Total Trips */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-green-100">
        <p className="text-gray-500 text-sm">Total Trips</p>
        <h2 className="text-3xl font-bold text-gray-800 mt-2">
          {totalTrips}
        </h2>
      </div>

      {/* Total CO2 */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-green-100">
        <p className="text-gray-500 text-sm">Total CO₂ Emitted</p>
        <h2 className="text-3xl font-bold text-emerald-700 mt-2">
          {totalCo2.toFixed(2)} kg
        </h2>
      </div>

      {/* Average CO2 */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-green-100">
        <p className="text-gray-500 text-sm">Average per Trip</p>
        <h2 className="text-3xl font-bold text-gray-800 mt-2">
          {avgCo2} kg
        </h2>
      </div>

    </div>
  );
}
