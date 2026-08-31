import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SimplePage.css";

function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    alert("Password changed successfully.");

    navigate("/profile");
  };

  return (
    <div className="simple-page">

      <div className="simple-header">
        <button onClick={() => navigate(-1)}>←</button>
        <h1>Change Password</h1>
      </div>

      <div className="simple-card">

        <label>Current Password</label>

        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <label>New Password</label>

        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <label>Confirm New Password</label>

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          className="primary-btn"
          onClick={handleChangePassword}
        >
          Change Password
        </button>

      </div>

    </div>
  );
}

export default ChangePassword;