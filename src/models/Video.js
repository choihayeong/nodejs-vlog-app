import mongoose from "mongoose";

// model의 형태 => schema(스키마)를 정의
const videoSchema = new mongoose.Schema({
  vlog_title: String,
  vlog_desc: String,
  published_date: Date,
  hashtags: [{ type: String }],
  meta: {
    views: Number,
    rating: Number,
  },
});

const videoModel = mongoose.model("Video", videoSchema);

export default videoModel;
