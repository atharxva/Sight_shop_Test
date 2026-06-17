import React, { useState, useEffect } from "react";

function Address({ userId }) {
  const [address, setAddress] = useState({
    flatNo: "",
    building: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const [error, setError] = useState("");




  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`http://localhost:8000/address/${userId}`, {
        method: "PUT", // Assuming you're updating the address
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(address),
      });
      if (!response.ok) {
        throw new Error("Failed to update address");
      }
      alert("Address updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };



  return (
    <div className="address-form-container">
      <h2>Update Address</h2>
      <form className="address-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="flatNo">Flat No:</label>
          <input
            type="text"
            id="flatNo"
            name="flatNo"
            value={address.flatNo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="building">Building:</label>
          <input
            type="text"
            id="building"
            name="building"
            value={address.building}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="street">Street:</label>
          <input
            type="text"
            id="street"
            name="street"
            value={address.street}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={address.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="state">State:</label>
          <input
            type="text"
            id="state"
            name="state"
            value={address.state}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="zip">ZIP Code:</label>
          <input
            type="number"
            id="zip"
            name="zip"
            value={address.zip}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Save Address</button>
      </form>
    </div>
  );
}

export default Address;
