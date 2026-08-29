import swaggerJSDoc from "swagger-jsdoc";
import { envVars } from "./env";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "VenRaz E-Commerce API Documentation",
      version: "1.0.0",
      description:
        "Comprehensive API documentation for VenRaz E-Commerce Ecosystem",
    },
    servers: [
      {
        url: `http://localhost:${envVars.port}/api/v1`,
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
