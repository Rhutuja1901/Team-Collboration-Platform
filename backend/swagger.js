const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Team Collaboration Platform API",
      version: "1.0.0",
      description: "API Documentation for Team Collaboration Platform",
    },
    servers: [
      {
        url: "http://localhost:5001",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;