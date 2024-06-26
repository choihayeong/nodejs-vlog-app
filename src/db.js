import mongoose from "mongoose";

mongoose.connect(
  "mongodb://127.0.0.1:27017/vlog-app",
  // {
  //   useNewUrlParser: true,
  //   useUnifiedToplogy: true,
  //   useFindAndModify: false,
  // }
);

const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (err) => console.log("❌ DB Error", err);

db.on("error", handleError);
db.once("open", handleOpen);
