import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminStyles.css';

const AppointmentList = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/admin/appointments');
            setAppointments(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError('Failed to load appointments');
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:8000/api/admin/appointments/${id}`, {
                status: newStatus
            });
            fetchAppointments();
        } catch (err) {
            console.error('Error updating appointment:', err);
            alert('Failed to update appointment status');
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return '#ffd700';
            case 'confirmed':
                return '#28a745';
            case 'cancelled':
                return '#dc3545';
            case 'completed':
                return '#6c757d';
            default:
                return '#6c757d';
        }
    };

    const filteredAppointments = appointments.filter(appointment => {
        if (filterStatus === 'all') return true;
        return appointment.status.toLowerCase() === filterStatus.toLowerCase();
    });

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading appointments...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
        </div>
    );

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Appointment Management</h1>
                <div className="filter-section">
                    <label>Filter by Status:</label>
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Appointments</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            <div className="appointments-grid">
                {filteredAppointments.map(appointment => (
                    <div key={appointment._id} className="appointment-card">
                        <div className="appointment-header">
                            <h3>{appointment.userId.name}</h3>
                            <span 
                                className="status-badge"
                                style={{ backgroundColor: getStatusColor(appointment.status) }}
                            >
                                {appointment.status}
                            </span>
                        </div>
                        
                        <div className="appointment-details">
                            <div className="detail-item">
                                <span className="detail-label">Doctor:</span>
                                <span>{appointment.doctorId.name}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Specialization:</span>
                                <span>{appointment.doctorId.specialization}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Date:</span>
                                <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Time:</span>
                                <span>{appointment.appointmentTime}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Purpose:</span>
                                <span>{appointment.purpose}</span>
                            </div>
                        </div>

                        <div className="appointment-actions">
                            <select
                                value={appointment.status}
                                onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                                className="status-select"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>

            {filteredAppointments.length === 0 && (
                <div className="no-appointments">
                    <p>No appointments found</p>
                </div>
            )}
        </div>
    );
};

export default AppointmentList;
