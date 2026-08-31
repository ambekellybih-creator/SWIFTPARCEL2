import React from "react";
import { useNavigate } from "react-router-dom";
import "./SimplePage.css";

function HelpSupport() {
  const navigate = useNavigate();

  return (
    <div className="simple-page">

      <div className="simple-header">
        <button onClick={() => navigate(-1)}>←</button>
        <h1>Help & Support</h1>
      </div>

      <div className="simple-card">

        <h2>How can we help?</h2>

        <p>
          If you are experiencing a problem with SwiftParcel,
          we're here to help.
        </p>

        <button className="support-button">
          📞 Contact Support
        </button>

        <button className="support-button">
          📧 Email Support
        </button>

        <button className="support-button">
          💬 WhatsApp Support
        </button>

        <div className="faq-box">
          <h3>Frequently Asked Questions</h3>

          <p>• How do I track my parcel?</p>
          <p>• How long does delivery take?</p>
          <p>• How do I cancel a shipment?</p>
          <p>• What happens if my parcel is delayed?</p>
        </div>

      </div>

    </div>
  );
}

export default HelpSupport;