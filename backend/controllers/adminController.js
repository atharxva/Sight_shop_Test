import AdminModel from "../database/datamodels/Admin.js";
import AppointmentModel from "../database/datamodels/apointment.js";
import UserModel from "../database/datamodels/user.js";
import DoctorModel from "../database/datamodels/doctors.js";
import bcrypt from "bcrypt";
import { sendStatusUpdateEmail } from "../utils/emailService.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Signs up a new admin.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const adminSignup = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingAdmin = await AdminModel.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new AdminModel({
      username,
      password: hashedPassword,
    });

    await newAdmin.save();
    console.log("Admin created successfully");
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res
      .status(500)
      .json({ message: "Error creating admin", error: error.message });
  }
};

/**
 * Logs in an existing admin.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(400).json({ message: "Invalid credentials" });
  }
};

/**
 * Retrieves all appointments.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const getAppointments = async (req, res) => {
  try {
    // First register the models to avoid the MissingSchemaError
    const appointments = await AppointmentModel.find();
    
    // Map the appointments to include user and doctor details
    const appointmentsWithDetails = await Promise.all(
      appointments.map(async (appointment) => {
        const user = await UserModel.findById(appointment.userId);
        const doctor = await DoctorModel.findById(appointment.doctorId);
        
        return {
          _id: appointment._id,
          appointmentDate: appointment.appointmentDate,
          appointmentTime: appointment.appointmentTime,
          purpose: appointment.purpose,
          status: appointment.status,
          userId: {
            name: user ? user.name : 'Unknown User',
            email: user ? user.email : ''
          },
          doctorId: {
            name: doctor ? doctor.name : 'Unknown Doctor',
            specialization: doctor ? doctor.specialization : ''
          }
        };
      })
    );

    res.status(200).json(appointmentsWithDetails);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Error fetching appointments", error: error.message });
  }
};

/**
 * Updates the status of an appointment.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find the appointment and update its status
    const appointment = await AppointmentModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Get user and doctor details for the email
    const user = await UserModel.findById(appointment.userId);
    const doctor = await DoctorModel.findById(appointment.doctorId);

    if (user && user.email) {
      // Send email notification
      await sendStatusUpdateEmail(
        user.email,
        user.name,
        doctor ? doctor.name : 'Unknown Doctor',
        appointment.appointmentDate,
        appointment.appointmentTime,
        status
      );
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ message: "Error updating appointment" });
  }
};
