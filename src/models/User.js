import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  user_email: { type: String, required: true, unique: true },
  user_name: { type: String, required: true, unique: true },
  user_password: { type: String, required: true },
  user_location: String,
});

userSchema.pre("save", async function () {
  this.user_password = await bcrypt.hash(this.user_password, 5);
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
