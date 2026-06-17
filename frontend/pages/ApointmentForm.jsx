import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./AppointmentFrom.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const AppointmentForm = () => {
  const { doctorId } = useParams(); // Get doctorId from the URL
  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({
    userId: localStorage.getItem("userId") || "",
    doctorId: doctorId,
    appointmentDate: "",
    appointmentTime: "",
    purpose: "",
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/doctors/${doctorId}`
        );
        const data = await response.json();
        setDoctor(data);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8000/api/appointments/book",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        // Show success toast
        toast.success(
          "Appointment booked successfully! A confirmation email has been sent."
        );
      } else {
        // Show error toast
        toast.error(result.message || "Failed to book appointment.");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Error booking appointment.");
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="appointment-form-container">
      <h1>Book Appointment</h1>
      {doctor ? (
        <div className="appointment-doctor-info">
          <h2>Doctor: {doctor.name}</h2>
          <p>Specialization: {doctor.specialization.join(", ")}</p>
          <p>Experience: {doctor.experience} years</p>
        </div>
      ) : (
        <p>Loading doctor details...</p>
      )}

      <form onSubmit={handleSubmit}>
        {/* User ID */}
        <label>
          User ID:
          <input
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            placeholder="Enter your User ID"
            required
          />
        </label>

        {/* Appointment Date */}
        <label>
          Appointment Date:
          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            required
          />
        </label>

        {/* Appointment Time */}
        <label>
          Appointment Time:
          <input
            type="time"
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Purpose:
          <textarea
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            placeholder="Enter the purpose of the appointment"
            required
          />
        </label>

        <button type="submit">Book Appointment</button>
      </form>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default AppointmentForm;
