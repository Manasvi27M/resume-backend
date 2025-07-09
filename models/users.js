import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  phone: { type: String, unique: true },
  created_at: { type: Date, default: Date.now },
});

// Instance method to validate password
UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password_hash);
}

// Instance method to generate JWT
UserSchema.methods.generateJWT = function() {
  return jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
}


export default mongoose.model("Users", UserSchema);