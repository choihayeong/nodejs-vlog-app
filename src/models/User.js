import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  user_email: { type: String, required: true, unique: true },
  social_only: { type: Boolean, default: false },
  avatar_url: { type: String },
  user_name: { type: String, required: true, unique: true },
  user_password: { type: String },
  user_location: String,
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});

userSchema.pre("save", async function () {
  if (this.isModified("user_password")) {
    this.user_password = await bcrypt.hash(this.user_password, 5);
  }
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
