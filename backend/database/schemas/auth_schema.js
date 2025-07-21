import mongoose from "mongoose";

const model = new mongoose.model(
  "users",
  mongoose.Schema({
    id: String,
    username: String,
    password: String,
    lastLoggedIn: Number
  }, { versionKey: false })
);

export default model;