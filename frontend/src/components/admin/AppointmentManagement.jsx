import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppointmentList from './AppointmentList';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import './AdminStyles.css';

const AppointmentManagement = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('/api/admin/appointments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch appointments');
            setLoading(false);
        }
    };

    const handleStatusChange = async (appointmentId, newStatus) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.patch(
                `/api/admin/appointments/${appointmentId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            fetchAppointments();
        } catch (err) {
            setError('Failed to update appointment status');
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="appointment-management">
            <h2>Appointment Management</h2>
            <AppointmentList
                appointments={appointments}
                onStatusChange={handleStatusChange}
            />
        </div>
    );
};

export default AppointmentManagement;
