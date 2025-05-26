import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  phone: { type: String, unique: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Users", UserSchema);