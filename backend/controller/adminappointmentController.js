
import AppointmentModel from "./database/datamodels/apointment.js";


export const getPendingAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find({ status: "Pending" });
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching pending appointments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getConfirmedAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find({ status: "Confirmed" });
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching confirmed appointments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const changeAppointmentStatus = async (req, res) => {
  const { appointmentId, status } = req.body;

  try {
    const validStatuses = ["Pending", "Confirmed", "Cancelled", "Completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const appointment = await AppointmentModel.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json(appointment);
  } catch (error) {
    console.error("Error changing appointment status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
