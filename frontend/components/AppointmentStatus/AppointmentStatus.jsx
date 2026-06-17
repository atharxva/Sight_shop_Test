import React, { useEffect, useState } from 'react';
import styles from './AppointmentStatus.module.css';

const AppointmentStatus = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      const userId = localStorage.getItem('userId');
      console.log('UserId from localStorage:', userId);
      
      if (!userId) {
        console.log('No userId found in localStorage');
        setError('Please log in to view appointments');
        setLoading(false);
        return;
      }

      const query = `
        query GetAppointmentsByUserId($userId: String!) {
          getAppointmentsByUserId(userId: $userId) {
            _id
            appointmentDate
            appointmentTime
            purpose
            status
            doctor {
              _id
              name
              specialization
            }
          }
        }
      `;

      try {
        console.log('Sending GraphQL query with userId:', userId);
        const response = await fetch('http://localhost:8000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables: { userId },
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('GraphQL response:', result);

        if (result.errors) {
          const errorMessage = result.errors[0].message;
          console.error('GraphQL errors:', result.errors);
          setError(errorMessage);
        } else if (result.data?.getAppointmentsByUserId) {
          console.log('Setting appointments:', result.data.getAppointmentsByUserId);
          setAppointments(result.data.getAppointmentsByUserId);
        } else {
          console.log('No appointments data in response');
          setAppointments([]);
        }
      } catch (error) {
        console.error('Network error:', error);
        setError('Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      Pending: '#ffd700',
      Confirmed: '#28a745',
      Cancelled: '#dc3545',
      Completed: '#6c757d'
    };
    return colors[status] || '#6c757d';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours, 10));
    time.setMinutes(parseInt(minutes, 10));
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading appointments...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Appointments</h2>
      {appointments.length === 0 ? (
        <p className={styles.noAppointments}>No appointments found</p>
      ) : (
        <div className={styles.appointmentsList}>
          {appointments.map((appointment) => (
            <div key={appointment._id} className={styles.appointmentCard}>
              <div className={styles.header}>
                <h3 className={styles.doctorName}>
                  Dr. {appointment.doctor?.name || 'Unknown'}
                </h3>
                <span 
                  className={styles.status}
                  style={{ backgroundColor: getStatusColor(appointment.status) }}
                >
                  {appointment.status}
                </span>
              </div>
              <div className={styles.details}>
                <p>
                  <strong>Date:</strong>{' '}
                  {formatDate(appointment.appointmentDate)}
                </p>
                <p>
                  <strong>Time:</strong>{' '}
                  {formatTime(appointment.appointmentTime)}
                </p>
                <p>
                  <strong>Purpose:</strong> {appointment.purpose}
                </p>
                <p>
                  <strong>Specialization:</strong>{' '}
                  {appointment.doctor?.specialization || 'Not specified'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentStatus;
