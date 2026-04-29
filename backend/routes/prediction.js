import express from "express";
import db from "../config/db.js";
import axios from "axios";

const router = express.Router();

//New Prediction Route
router.post("/predict", async (req, res) => {
  console.log("In the predict mode");

  try {
    const userId = req.session.user.id;

    const { speed, vehicleType, fuelType, cargoWt, age, roadType, distance } =
      req.body;

    // Basic validation
    if (
      speed == null ||
      !vehicleType ||
      !fuelType ||
      cargoWt == null ||
      age == null ||
      !roadType ||
      distance == null
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // -----------------------------
    // Call FastAPI - Model 1
    // -----------------------------
    const response = await axios.post("http://127.0.0.1:8000/predict", {
      Model_Number: 1,
      Speed: speed,
      Vehicle_Type: vehicleType,
      Fuel_Type: fuelType,
      CargoWeight: cargoWt,
      Age_of_Vehicle: age,
      Road_Type: roadType,
      Distance: distance,
    });
    console.log(response.data);
    const prediction1 = response.data.total_emission;
    console.log(prediction1);
    // Store in MySQL
    await db.query(
      `INSERT INTO predictions
      (user_id, speed, vehicle_type, fuel_type, cargo_weight, age, road_type, distance,
       prediction_1)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        speed,
        vehicleType,
        fuelType,
        cargoWt,
        age,
        roadType,
        distance,
        prediction1,
      ],
    );

    res.json({
      emission: prediction1,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Prediction failed" });
  }
});

//Route to get all the previous predictions

router.get("/getPredictions", async (req, res) => {
  console.log("In the history zone");
  try {
    const userId = req.session.user.id;
    const [rows] = await db.query(
      `SELECT 
          id,
          speed,
          vehicle_type,
          fuel_type,
          cargo_weight,
          age,
          road_type,
          distance,
          prediction_1,          
          created_at
       FROM predictions
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId],
    );
    console.log(rows);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
