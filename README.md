# CarbonCast

CarbonCast is a full-stack application that provides an Emission Prediction API. It uses machine learning models (LightGBM and Gradient Boosting Regressors) to predict carbon emissions based on various vehicle parameters, such as vehicle type, fuel type, speed, cargo weight, road type, and travel distance.

## 🏗️ Architecture

The system consists of three main components:
1. **Frontend (React)**: User interface for the application, running on `http://localhost:3000`.
2. **Backend (Node.js + Express)**: API Gateway that handles communication between the frontend and the ML prediction engine, running on `http://localhost:5000`.
3. **ML API (FastAPI)**: Serves the Machine Learning models via a REST API, running on `http://127.0.0.1:8000`.

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your system:
- **Node.js** (v18 or above)
- **Python** (v3.9 or above)
- **Git**

You can verify your installations using:
```bash
node -v
npm -v
python --version
```

## 🚀 Setup & Installation

### 1. ML API Setup (FastAPI)
Navigate to the ML API folder and set up a Python virtual environment:
```bash
cd ml-api/Fast_Api
python -m venv venv

# Activate the environment:
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn scikit-learn pandas numpy lightgbm joblib
```

### 2. Backend Setup (Node.js)
Navigate to the backend folder and install the NPM packages:
```bash
cd backend
npm install
```

### 3. Frontend Setup (React)
Navigate to the frontend folder and install the NPM packages:
```bash
cd frontend
npm install
```

## 🏃‍♂️ Running the Application

To run the full application, you need to start all three services. **It is highly recommended to start them in the following order:**

**Terminal 1: Start the ML API**
```bash
cd ml-api/Fast_Api
venv\Scripts\activate
uvicorn main:app --reload
```
*Runs on http://127.0.0.1:8000*

**Terminal 2: Start the Backend**
```bash
cd backend
node server.js
```
*Runs on http://localhost:5000*

**Terminal 3: Start the Frontend**
```bash
cd frontend
npm start
```
*Runs on http://localhost:3000*

## 🔄 System Flow

1. The React frontend sends prediction requests to the Node.js backend.
2. The Node.js backend acts as an intermediary and forwards the request to the FastAPI ML service.
3. FastAPI processes the input data, runs it through the loaded LightGBM/Gradient Boosting models, and returns the emission predictions back through the backend to the frontend.
