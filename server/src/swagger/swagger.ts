import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger_output.json'; 
import { Application } from 'express';

export const swaggerDocs = (app: Application, port: number) => {
    app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log(`Swagger docs available at http://localhost:${port}/api/v1/api-docs`);
};