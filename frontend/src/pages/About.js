import React from "react";
import { useNavigate } from "react-router-dom";
import "./SimplePage.css";

function About() {
  const navigate = useNavigate();

  return (
    <div className="simple-page">

      <div className="simple-header">
        <button onClick={() => navigate(-1)}>←</button>
        <h1>About SwiftParcel</h1>
      </div>

      <div className="simple-card about-card">

        <div className="about-logo">
          SP
        </div>

        <h2>SwiftParcel</h2>

        <p className="version">
          Version 1.0.0
        </p>

        <p>
          SwiftParcel is a courier tracking and delivery
          management platform designed to make sending,
          tracking and receiving parcels simple and reliable.
        </p>

        <div className="about-feature">
          📦 Easy parcel shipping
        </div>

        <div className="about-feature">
          📍 Real-time shipment tracking
        </div>

        <div className="about-feature">
          🔔 Delivery notifications
        </div>

        <div className="about-feature">
          🔒 Secure account management
        </div>

        <p className="copyright">
          © 2026 SwiftParcel. All rights reserved.
        </p>

      </div>

    </div>
  );
}

export default About;