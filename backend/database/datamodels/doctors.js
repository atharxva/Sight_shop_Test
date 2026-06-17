import mongoose from "mongoose";

const doctorModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  specialization: {
    type: [String],
    required: true,
  },
  experience: {
    type: Number,
    required: true,
    min: 0,
  },
  clinicName: {
    type: String,
    required: true,
    trim: true,
  },
  clinicAddress: {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zipCode: { type: String, required: true, trim: true },
  },
  consultationFee: {
    type: Number,
    required: true,
    min: 0,
  },
  availability: {
    days: {
      type: [String],
      required: true,
    },
    timeSlots: {
      type: [String],
      required: true,
    },
  },
  reviews: {
    type: [
      {
        patientName: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String, trim: true },
        date: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const EyeSpecialist = mongoose.model("EyeSpecialist", doctorModel);

export default EyeSpecialist;
