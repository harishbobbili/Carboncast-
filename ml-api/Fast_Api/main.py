from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import numpy as np

app = FastAPI(title="Emission Prediction API")

# -----------------------------
# CORS
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Load Models
# -----------------------------
model_1 = joblib.load("../SavedModels/final_lgbm_emission_model.pkl")
model_2 = joblib.load("../SavedModels/GradientBoostingRegressor01.pkl")

# -----------------------------
# Vehicle Constraints
# -----------------------------
vehicle_constraints = {
    "Motorcycle": {"maxCargo": 100, "k": 0.25},
    "Car": {"maxCargo": 500, "k": 0.18},
    "Van": {"maxCargo": 2000, "k": 0.15},
    "Truck": {"maxCargo": 12000, "k": 0.12},
    "HeavyTruck": {"maxCargo": 25000, "k": 0.08},
    "Bus": {"maxCargo": 5000, "k": 0.10}
}

# -----------------------------
# Input Schema
# -----------------------------
class InputData(BaseModel):
    Model_Number: int
    Speed: float
    Vehicle_Type: str
    Fuel_Type: str
    CargoWeight: float
    Age_of_Vehicle: float
    Road_Type: str
    Distance: float


# -----------------------------
# Model 1
# -----------------------------
def predict_model_1(data: InputData):

    if data.Fuel_Type == "Electric":
        return {
            "model_used": 1,
            "emission_per_km": 0.0,
            "total_emission": 0.0
        }

    input_df = pd.DataFrame([{
        "Speed": data.Speed,
        "Vehicle Type": data.Vehicle_Type,
        "Fuel Type": data.Fuel_Type,
        "CargoWeight": data.CargoWeight,
        "Age of Vehicle": data.Age_of_Vehicle,
        "Road Type": data.Road_Type
    }])

    prediction_per_km = np.maximum(model_1.predict(input_df), 0)
    total = float(prediction_per_km[0] * data.Distance)

    return {
        "model_used": 1,
        "emission_per_km": float(prediction_per_km[0]),
        "total_emission": total
    }


# -----------------------------
# Model 2
# -----------------------------
def predict_model_2(data: InputData):

    input_df = pd.DataFrame([{
        "Speed": data.Speed,
        "Vehicle Type": data.Vehicle_Type,
        "Fuel_Type": data.Fuel_Type,
        "Age of Vehicle": data.Age_of_Vehicle,
        "Road Type": data.Road_Type
    }])

    prediction_per_km = np.maximum(model_2.predict(input_df), 0)
    base_per_km = float(prediction_per_km[0])

    # Cargo Adjustment
    vehicle_type = data.Vehicle_Type

    if vehicle_type in vehicle_constraints:
        max_capacity = vehicle_constraints[vehicle_type]["maxCargo"]
        k = vehicle_constraints[vehicle_type]["k"]

        load_ratio = data.CargoWeight / max_capacity if max_capacity > 0 else 0
        load_ratio = min(load_ratio, 1)

        adjustment_factor = 1 + (k * load_ratio)
    else:
        adjustment_factor = 1

    adjusted_per_km = base_per_km * adjustment_factor
    adjusted_total = adjusted_per_km * data.Distance

    return {
        "model_used": 2,
        "adjusted_emission_per_km": adjusted_per_km,
        "adjusted_total_emission": adjusted_total
    }


# -----------------------------
# Health Route
# -----------------------------
@app.get("/")
def root():
    return {"message": "Emission Prediction API is running"}


# -----------------------------
# Prediction Route
# -----------------------------
@app.post("/predict")
def predict(data: InputData):

    if data.Model_Number == 1:
        return predict_model_1(data)

    elif data.Model_Number == 2:
        return predict_model_2(data)

    else:
        return {
            "success": False,
            "error": "Invalid Model_Number. Use 1 or 2."
        }