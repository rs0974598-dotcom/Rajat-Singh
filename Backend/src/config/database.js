
import mongoose from "mongoose";
import { config } from "./config.js";



export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(" Database Connected Successfully");
    } catch (error) {
        console.log(" Database Connection Failed:", error.message);
        process.exit(1);
    }
};