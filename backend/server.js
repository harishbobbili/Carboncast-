import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import authRoutes from "./routes/auth.js";
import predictionRoutes from "./routes/prediction.js";
import protect from "./middleware/protect.js";

const app = express();
const PORT = 5000;

// Middlewares Section

app.use(
  cors({
    // Interactin b/w the fend and bend
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

app.use(cookieParser());

app.use(
  // For the session management
  session({
    secret: "super_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // true only in production with HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  }),
);

// Mounting the authentication routes
app.use("/api/auth", authRoutes);

//Mounting the prediction routes
app.use("/predictionEngine", protect, predictionRoutes);

app.get("/", async (req, res) => {
  res.send("Hello From Backend");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
