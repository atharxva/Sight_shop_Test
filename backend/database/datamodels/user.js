import mongoose from "mongoose";

const validGenders = ["Male", "Female", "male", "female"];
const userSchema = mongoose.Schema({
  fname: { type: String },
  lname: { type: String },
  firebaseUid: { type: String },
  email: { type: String },
  gender: { type: String, enum: validGenders },
  address: {
    type: Array,
  },
});
const userModel = mongoose.model("users", userSchema);

export default userModel;
