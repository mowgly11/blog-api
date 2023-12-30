import mongoose from "mongoose";

class MongoDBConnect {
    async connect(url) {
        mongoose.connect(url);
        
        mongoose.connection.on("connected", () => console.log("Connected to database"));
        mongoose.connection.on("disconnected", () => console.log("Connected to database"));
        mongoose.connection.on("error", (err) => console.log(err));
    }
}

export default new MongoDBConnect();