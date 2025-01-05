import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  comment_text: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
  published_date: { type: Date, required: true, default: Date.now },
});

const commentModel = mongoose.model("Comment", commentSchema);

export default commentModel;
