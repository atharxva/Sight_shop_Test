import React from 'react';
import PropTypes from 'prop-types';
import './AdminStyles.css';

const AppointmentCard = ({ appointment, onStatusChange }) => {
    return (
        <div className="appointment-card">
            <div className="appointment-info">
                <h3>Patient: {appointment.userId.name}</h3>
                <p>Doctor: {appointment.doctorId.name}</p>
                <p>Date: {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                <p>Time: {appointment.appointmentTime}</p>
                <p>Purpose: {appointment.purpose}</p>
                <p>Current Status: 
                    <span className={`status ${appointment.status.toLowerCase()}`}>
                        {appointment.status}
                    </span>
                </p>
            </div>
            <div className="status-actions">
                <select
                    value={appointment.status}
                    onChange={(e) => onStatusChange(appointment._id, e.target.value)}
                    className="status-select"
                >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
        </div>
    );
};

AppointmentCard.propTypes = {
    appointment: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        userId: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }).isRequired,
        doctorId: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }).isRequired,
        appointmentDate: PropTypes.string.isRequired,
        appointmentTime: PropTypes.string.isRequired,
        purpose: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
    }).isRequired,
    onStatusChange: PropTypes.func.isRequired,
};

export default AppointmentCard;
