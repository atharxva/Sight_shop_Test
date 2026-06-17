import express from "express";
import {
  getAllDoctors,
  getDoctorById,
} from "../controller/doctorController.js";

const doctorRoute = express.Router();

doctorRoute.get("/", getAllDoctors);

doctorRoute.get("/:doctorId", getDoctorById);

export default doctorRoute;
