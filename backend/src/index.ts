import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import vehicleRoutes from "./routes/vehicleRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Vehicle Tracker API is running",
    version: "1.0.0",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
