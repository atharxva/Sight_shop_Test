import EyeSpecialist from "../database/datamodels/doctors.js";

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await EyeSpecialist.find();
    console.log(doctors);
    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await EyeSpecialist.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
