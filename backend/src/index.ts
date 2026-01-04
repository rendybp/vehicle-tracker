// Import dependencies
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";

// Import route handlers
import authRoutes from "./routes/authRoutes";
import vehicleRoutes from "./routes/vehicleRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true, // Allow cookies
})); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  // Dynamically provide API documentation link
  const protocol = req.protocol;
  const host = req.get('host');
  const fullUrl = `${protocol}://${host}`;

  res.json({
    success: true,
    message: "Vehicle Tracker API is running",
    version: "1.0.0",
    documentation: `${fullUrl}/api-docs`,
  });
});

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vehicle Tracker API",
      version: "1.0.0",
      description: "API documentation for the Vehicle Tracker application",
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token in the format: Bearer <token>",
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      {
        name: "Authentication",
        description: "User authentication and authorization endpoints",
      },
      {
        name: "Vehicles",
        description: "Vehicle management endpoints (CRUD operations)",
      },
      {
        name: "Users",
        description: "User management endpoints (ADMIN only)",
      },
    ],
    servers: [
      {
        url: "/",
        description: "Current server",
      },
    ],
  },
  apis: [
    path.resolve(__dirname, "../src/routes/*.ts"),
    path.resolve(__dirname, "./routes/*.js"),
  ], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Swagger UI options
const swaggerUiOptions = {
  // explorer: true,
  customCss: '.swagger-ui.topbar { display: none }',
  customSiteTitle: "Vehicle Tracker API Documentation",
  customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
  customJs: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js",
  ],
  swaggerOptions: {
    persistAuthorization: true, // Persist authorization data
    displayRequestDuration: true,
    docExpansion: "none", // Collapse all endpoints by default
    // filter: true, // Enable search/filter
    showExtensions: true,
    showCommonExtensions: true,
  },
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

app.use(helmet({
    contentSecurityPolicy: false // Security policy is disabled to allow Swagger UI to function properly
}));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  });
}

export default app;
