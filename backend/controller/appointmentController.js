import AppointmentModel from "../database/datamodels/apointment.js";
import EyeSpecialist from "../database/datamodels/doctors.js";
import userModel from "../database/datamodels/user.js";
import { sendConfirmationEmail } from "../config/nodemailer.js"; // Import the email service

const bookAppointment = async (req, res) => {
  try {
    const { userId, doctorId, appointmentDate, appointmentTime, purpose } =
      req.body;

    // Validate required fields
    if (
      !userId ||
      !doctorId ||
      !appointmentDate ||
      !appointmentTime ||
      !purpose
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const doctorExists = await EyeSpecialist.findById(doctorId);
    if (!doctorExists) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    // Check if user exists
    const userExists = await userModel.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found." });
    }

    // Create and save the new appointment
    const newAppointment = new AppointmentModel({
      userId,
      doctorId,
      appointmentDate,
      appointmentTime,
      purpose,
    });

    const savedAppointment = await newAppointment.save();

    // Prepare and send the confirmation email
    const emailSubject = "Appointment Confirmation";
    const emailText = `Hi ${userExists.name},

Your appointment with Dr. ${doctorExists.name} has been successfully booked.

Details:
Date: ${appointmentDate}
Time: ${appointmentTime}
Purpose: ${purpose}

Thank you!`;

    const emailHtml = `
      <h1>Appointment Confirmation</h1>
      <p>Hi <strong>${userExists.name}</strong>,</p>
      <p>Your appointment with Dr. <strong>${doctorExists.name}</strong> has been successfully booked.</p>
      <p><strong>Details:</strong></p>
      <ul>
        <li>Date: ${appointmentDate}</li>
        <li>Time: ${appointmentTime}</li>
        <li>Purpose: ${purpose}</li>
      </ul>
      <p>Thank you!</p>
    `;

    // Call the email service to send the email
    await sendConfirmationEmail(
      userExists.email,
      emailSubject,
      emailText,
      emailHtml
    );

    res.status(201).json({
      message: "Appointment booked successfully. Confirmation email sent.",
      appointment: savedAppointment,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export default bookAppointment;
