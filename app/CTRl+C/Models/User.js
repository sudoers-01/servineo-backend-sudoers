import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {type: String, required: true},
  passwordHash:{type: String, required: true},
  language: {type:String, requiered:true},
  createdAt:{type:String, required:true}
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("Users", userSchema);
