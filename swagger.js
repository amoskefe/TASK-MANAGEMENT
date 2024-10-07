const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  openapi: '3.0.0', // Move 'openapi' outside of 'swaggerDefinition'
  swaggerDefinition: {
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'API for managing tasks'
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
