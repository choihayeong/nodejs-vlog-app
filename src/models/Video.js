import mongoose from "mongoose";

// model의 형태 => schema(스키마)를 정의
const videoSchema = new mongoose.Schema({
  vlog_title: { type: String, required: true, trim: true, maxLength: 80 },
  vlog_desc: { type: String, required: true, trim: true, minLength: 30 },
  file_url: { type: String, required: true },
  published_date: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
  },
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((item) => (item.startsWith("#") ? item : `#${item}`));
});

const videoModel = mongoose.model("Video", videoSchema);

export default videoModel;
