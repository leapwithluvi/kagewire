import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { rateLimiter } from "./configs/rateLimit.js";
import { corsConfig } from "./configs/cors.js";
import { swaggerSpec } from "./configs/swagger.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsConfig);
app.use(helmet());
app.use(hpp());
app.use(compression({ level: Number(process.env.COMPRESSION_LEVEL) || 6 }));
app.use(
    morgan(process.env.LOG_FORMAT || "dev"),
);
app.use(rateLimiter);
app.use(cookieParser());
app.use(express.static("public"));

// Swagger API Documentation Interface
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (_req, res) => {
    res.json({
        status: "success",
        message: "Welcome to KageWire Chronicles API Gateway",
        system: {
            name: "KageWire Chronicles Core API",
            version: "1.0.0",
            description: "Advanced Anime Tracking, Discovery, and News API Service.",
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString()
        },
        endpoints: [
            {
                path: "/api-docs",
                description: "Interactive Swagger API Documentation",
            },
            {
                path: "/api/v1/health",
                description: "API Server Health Status",
            },
        ],
        support: {
            repository: "https://github.com/leapwithluvi/kagewire",
            author: "leapwithluvi"
        }
    });
});

app.get("/api/v1/health", (_req, res) => {
    res.json({
        status: "success",
        message: "API Server is running",
        system: {
            name: "KageWire Chronicles Core API",
            version: "1.0.0",
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString()
        },
        support: {
            repository: "https://github.com/leapwithluvi/kagewire",
            author: "leapwithluvi"
        }
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});