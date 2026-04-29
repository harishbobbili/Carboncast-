function getEmissionCategory(avg) {
  console.log(avg);
  if (avg < 0.05) return "Low";
  if (avg < 0.2) return "Moderate";
  return "High";
}

function calculateTotalEmission(avg, distance) {
  console.log(distance);
  return avg * distance;
}

function calculateScore(avg) {
  const maxThreshold = 0.3;

  let score = 100 - (avg / maxThreshold) * 100;

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  return Math.round(score);
}

function calculateTrees(totalEmission) {
  const treeAbsorption = 21; // kg per year
  return (totalEmission / treeAbsorption).toFixed(2);
}

function generateRecommendations(avg, fuelType, distance) {
  const recs = [];

  if (avg > 0.2) {
    recs.push("High emissions detected.");
    recs.push("Consider switching to electric vehicles.");
    recs.push("Carpooling can reduce carbon footprint.");
  }

  if (avg <= 0.2 && avg > 0.05) {
    recs.push("Moderate emissions.");
    recs.push("Ensure regular vehicle servicing.");
  }

  if (avg <= 0.05) {
    recs.push("Excellent low emission performance!");
  }

  if (fuelType === "Petrol" || fuelType === "Diesel") {
    recs.push("Hybrid or electric options can significantly reduce impact.");
  }

  if (distance > 100) {
    recs.push("For long trips, consider shared mobility.");
  }

  return recs;
}

export default {
  getEmissionCategory,
  calculateTotalEmission,
  calculateScore,
  calculateTrees,
  generateRecommendations
};
