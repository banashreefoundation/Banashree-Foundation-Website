import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/banashree-foundation-db';
        console.log(`Mongo URL: ${mongoUrl}`);
        const conn = await mongoose.connect(mongoUrl);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Error: ${(error as Error).message}`);
        process.exit(1); // Exit process if connection fails
    }
};

export default connectDB;