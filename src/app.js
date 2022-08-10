const express = require('express');
require('dotenv').config();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const connectToMongo = require('./db/connection');
const router = require('./routes');
const orderRoutes = require('./routes/order');

const app = express();
const port = process.env.NODE_LOCAL_PORT;

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: '1.0.0',
      title: 'COOKIES API',
      description: 'This documentation is for cookie api endpoints',
      contact: {
        name: 'HALA, EMINE, RASHA, HAMZA, HUZEYFYE',
      },
      servers: ['http://localhost:3000'],
    },
  },
  apis: ['src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(connectToMongo);

// app.use('/api', router);
// app.use(orderRoutes);

app.listen(port, () => {
  //  console.log(`Server listening on port ${port}`);
  // connectToMongo();
});

module.exports = app;
