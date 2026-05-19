import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "🌟 KageWire API Documentation",
            version: "1.0.0",
            description: "Enterprise-grade API service for KageWire, an advanced anime tracking, discovery, and news platform.",
            contact: {
                name: "KageWire Development Team",
                url: "https://github.com/leapwithluvi/kagewire",
            },
        },
        servers: [
            {
                url: "http://localhost:3000/api/v1",
                description: "Local Development Server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter your short-lived Access Token in the format: Bearer <token>",
                },
            },
        },
        // Apply JWT bearer authentication globally to API docs (optional, routes can override)
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    // Target files containing JSDoc comments for API specification
    apis: [
        "./src/routes/**/*.ts",
        "./src/routes/**/*.js",
        "./src/index.ts",
        "./src/configs/swagger.ts"
    ],
};

export const swaggerSpec = swaggerJsdoc(options);
