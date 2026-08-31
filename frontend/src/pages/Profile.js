import React from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const userName =
    localStorage.getItem("swiftparcelCustomerName") || "SwiftParcel User";

  const userEmail =
    localStorage.getItem("swiftparcelCustomerEmail") ||
    "customer@example.com";

  const userPhone =
    localStorage.getItem("swiftparcelCustomerPhone") ||
    "+237 6XX XXX XXX";

  const handleLogout = () => {
    localStorage.removeItem("swiftparcelCustomerToken");
    localStorage.removeItem("swiftparcelToken");
    localStorage.removeItem("swiftparcelCustomerName");
    localStorage.removeItem("swiftparcelCustomerEmail");
    localStorage.removeItem("swiftparcelCustomerPhone");

    navigate("/login");
  };

  return (
    <div className="profile-page">

      {/* HEADER */}
      <div className="profile-header">
        <button
          className="profile-back-btn"
          onClick={() => navigate(-1)}
        >
          ←
        </button>

        <h1>My Profile</h1>

        <div className="profile-header-space"></div>
      </div>

      <div className="profile-main">

        {/* PROFILE CARD */}
        <div className="profile-card">

          <div className="profile-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>

          <h2>{userName}</h2>

          <p className="profile-email">
            {userEmail}
          </p>

          <p className="profile-phone">
            {userPhone}
          </p>

          <button
            className="edit-profile-btn"
            onClick={() => navigate("/edit-profile")}
          >
            ✏️ Edit Profile
          </button>

        </div>

        {/* ACCOUNT */}
        <div className="profile-section">

          <h3>Account</h3>

          <button
            className="profile-option"
            onClick={() => navigate("/shipments")}
          >
            <div className="option-icon">📦</div>

            <div className="option-content">
              <strong>My Shipments</strong>
              <span>View and track your parcels</span>
            </div>

            <span className="option-arrow">›</span>
          </button>

          <button
            className="profile-option"
            onClick={() => navigate("/notifications")}
          >
            <div className="option-icon">🔔</div>

            <div className="option-content">
              <strong>Notifications</strong>
              <span>Manage your notifications</span>
            </div>

            <span className="option-arrow">›</span>
          </button>

          <button
            className="profile-option"
            onClick={() => navigate("/change-password")}
          >
            <div className="option-icon">🔒</div>

            <div className="option-content">
              <strong>Change Password</strong>
              <span>Update your account password</span>
            </div>

            <span className="option-arrow">›</span>
          </button>

        </div>

        {/* SUPPORT */}
        <div className="profile-section">

          <h3>Support</h3>

          <button
            className="profile-option"
            onClick={() => navigate("/help-support")}
          >
            <div className="option-icon">❓</div>

            <div className="option-content">
              <strong>Help & Support</strong>
              <span>Get help with SwiftParcel</span>
            </div>

            <span className="option-arrow">›</span>
          </button>

          <button
            className="profile-option"
            onClick={() => navigate("/about")}
          >
            <div className="option-icon">ℹ️</div>

            <div className="option-content">
              <strong>About SwiftParcel</strong>
              <span>Learn more about SwiftParcel</span>
            </div>

            <span className="option-arrow">›</span>
          </button>

        </div>

        {/* LOGOUT */}
        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          🚪 Log Out
        </button>

      </div>
    </div>
  );
}

export default Profile;