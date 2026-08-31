import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SimplePage.css";

function EditProfile() {
  const navigate = useNavigate();

  const [name, setName] = useState(
    localStorage.getItem("swiftparcelCustomerName") || ""
  );

  const [email, setEmail] = useState(
    localStorage.getItem("swiftparcelCustomerEmail") || ""
  );

  const [phone, setPhone] = useState(
    localStorage.getItem("swiftparcelCustomerPhone") || ""
  );

  const handleSave = () => {
    localStorage.setItem("swiftparcelCustomerName", name);
    localStorage.setItem("swiftparcelCustomerEmail", email);
    localStorage.setItem("swiftparcelCustomerPhone", phone);

    navigate("/profile");
  };

  return (
    <div className="simple-page">

      <div className="simple-header">
        <button onClick={() => navigate(-1)}>←</button>
        <h1>Edit Profile</h1>
      </div>

      <div className="simple-card">

        <label>Full Name</label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />

        <label>Email</label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <label>Phone Number</label>

        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+237"
        />

        <button
          className="primary-btn"
          onClick={handleSave}
        >
          Save Changes
        </button>

      </div>

    </div>
  );
}

export default EditProfile;