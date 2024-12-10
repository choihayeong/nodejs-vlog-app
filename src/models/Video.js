import mongoose from "mongoose";

// model의 형태 => schema(스키마)를 정의
const videoSchema = new mongoose.Schema({
  vlog_title: { type: String, required: true, trim: true, maxLength: 80 },
  vlog_desc: { type: String, required: true, trim: true, minLength: 10 },
  file_url: { type: String, required: true },
  thumbnail_url: { type: String, required: true, default: "https://dummyimage.com/600x400/000/fff" },
  published_date: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((item) =>
      item.startsWith("#")
        ? item.replaceAll(" ", "")
        : `#${item.replaceAll(" ", "")}`,
    );
});

const videoModel = mongoose.model("Video", videoSchema);

export default videoModel;
