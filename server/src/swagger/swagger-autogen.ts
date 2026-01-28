const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'API Documentation',
        description: 'API documentation for the application',
    },
    host: 'localhost:4001', // Change this to your host and port
    schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['../routes/userRoutes.ts','../routes/loginRoutes.ts', '../routes/campaignRoutes.ts', '../routes/programRoutes.ts', '../routes/eventRoutes.ts', '../routes/projectRoutes.ts'];

// Generates swagger-output.json
swaggerAutogen(outputFile, endpointsFiles, doc);