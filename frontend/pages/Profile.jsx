import React, { useState, useEffect } from "react";
import { doSignOut } from "../firebase/auth";
import "./profile.css";
import { useNavigate } from "react-router-dom";
import AppointmentStatus from "../components/AppointmentStatus/AppointmentStatus";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User ID not found in localStorage.");
          return;
        }

        const response = await fetch(
          `http://localhost:8000/profile/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          console.log(response);
          throw new Error("Failed to fetch user profile.");
        }
        const data = await response.json();
        setUserData(data);
        console.log("User data:", data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await doSignOut();
      console.log("User signed out");
      localStorage.removeItem("userId");

      setTimeout(() => {
        navigate("/landing");
      }, 2000);
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  if (!userData) {
    return (
      <div className="profile-loading">
        <div className="loader"></div>
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="profile-picture-container">
          <img
            src={userData.profilePicture || "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="}
            alt="Profile Picture"
            className="profile-picture"
          />
          <h2 className="user-name">{userData.fname} {userData.lname}</h2>
          <p className="user-email">{userData.email}</p>
        </div>
        <nav className="profile-nav">
          <button 
            className={`nav-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Information
          </button>
          <button 
            className={`nav-button ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            My Appointments
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </nav>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' ? (
          <div className="profile-details">
            <h1>Profile Information</h1>
            <div className="info-grid">
              <div className="info-item">
                <label>First Name</label>
                <p>{userData.fname}</p>
              </div>
              <div className="info-item">
                <label>Last Name</label>
                <p>{userData.lname}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{userData.email}</p>
              </div>
              <div className="info-item">
                <label>Gender</label>
                <p>{userData.gender}</p>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <p>{userData.phone || 'Not provided'}</p>
              </div>
              <div className="info-item">
                <label>Date of Birth</label>
                <p>{userData.dob || 'Not provided'}</p>
              </div>
              <div className="info-item full-width">
                <label>Address</label>
                <p>{userData.address || 'Not provided'}</p>
              </div>
              <div className="info-item full-width">
                <label>Medical History</label>
                <p>{userData.medicalHistory || 'No medical history provided'}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="appointments-section">
            <h1>My Appointments</h1>
            <AppointmentStatus />
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
