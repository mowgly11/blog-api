import mongoose from "mongoose";

const model = new mongoose.model(
  "blogs",
  mongoose.Schema({
    title: String,
    author: String,
    postedAt: Number,
    lastModified: Number,
    content: String,
    upVotes: Number,
    downVotes: Number,
    visible: Boolean,
    views: Number,
  })
);

export default model;