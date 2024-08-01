import mongoose from "mongoose";
import bcrypt from "bcrypt";

const memberSchema = new mongoose.Schema({
  member_email: { type: String, required: true, unique: true },
  member_name: { type: String, required: true, unique: true },
  member_password: { type: String, required: true },
  member_realname: { type: String, required: true },
  member_location: String,
});

memberSchema.pre("save", async function () {
  this.member_password = await bcrypt.hash(this.member_password, 5);
});

const memberModel = mongoose.model("Member", memberSchema);

export default memberModel;
