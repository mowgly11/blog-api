import mongoose from "mongoose";
import logger from '../utils/logger.js';

class MongoDBConnect {
    static async connect(url) {
        mongoose.connect(url);
        
        mongoose.connection.on("connected", () => logger.info("Connected to database"));
        mongoose.connection.on("disconnected", () => logger.error("Disconnected from database"));
        mongoose.connection.on("error", (err) => logger.error(err));
    }
}

export default MongoDBConnect;