import express, { Application } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import userRoutes from './routes/userRoutes';
import connectDB from './db/db';
import campaignRoutes from './routes/campaignRoutes';
import programRoutes from './routes/programRoutes';
import eventRoutes from './routes/eventRoutes';
import projectRoutes from './routes/projectRoutes';
import volunteerRoutes from './routes/volunteerRoutes';
import contactRoutes from './routes/contactRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import imageRoutes from './routes/imageRoutes';
import defaultImagesRoutes from './routes/defaultImagesRoutes';
import seedRoutes from './routes/seedRoutes';
import cors from "cors";
import { swaggerDocs } from './swagger/swagger';


dotenv.config();

class App {
    public app: Application;
    public port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;
        // Enable CORS for all origins
        this.app.use(cors({
            origin: '*', // This allows all origins
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Add any other methods you need
            allowedHeaders: ['Content-Type', 'Authorization'], // Allow Content-Type and other necessary headers
        }));

        this.initializeMiddlewares();
        this.initializeDBConnection();
        this.initializeRoutes();
        this.initializeSwagger();
    }

    private initializeMiddlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        
        // Serve static files from uploads directory
        const uploadsDir = path.join(__dirname, '../uploads');
        this.app.use('/uploads', express.static(uploadsDir));
    }

    private async initializeDBConnection() {
        await connectDB();
    }

    private initializeRoutes() {
        this.app.use('/api/v1', userRoutes);
        this.app.use('/api/v1', campaignRoutes);
        this.app.use('/api/v1', programRoutes);
        this.app.use('/api/v1', eventRoutes);
        this.app.use('/api/v1', projectRoutes);
        this.app.use('/api/v1', volunteerRoutes);
        this.app.use('/api/v1', contactRoutes);
        this.app.use('/api/v1', testimonialRoutes);
        this.app.use('/api/v1/images', imageRoutes);
        this.app.use('/api/v1/default-images', defaultImagesRoutes);
        this.app.use('/api/v1', seedRoutes);
    }

    private initializeSwagger() {
        swaggerDocs(this.app, this.port);
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}


export default App


// app.get('/', (req: any, res:any, next: any)  => {
//   return res.json({success: true})
// })

// app.listen(4001, () => {
//   console.log(`server is running on port 4001`)
// })