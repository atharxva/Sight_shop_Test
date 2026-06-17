import express from "express";
import bookAppointment from "../controller/appointmentController.js";

const apointmentRouter = express.Router();

apointmentRouter.post("/book", bookAppointment);

export default apointmentRouter;
