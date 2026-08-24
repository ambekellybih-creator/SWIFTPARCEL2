import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ConfirmShipment.css";

function ConfirmShipment() {
  const navigate = useNavigate();

  const [sender, setSender] = useState({});
  const [receiver, setReceiver] = useState({});
  const [parcel, setParcel] = useState({});

  useEffect(() => {
    const savedSender = localStorage.getItem("swiftparcelSender");
    const savedReceiver = localStorage.getItem("swiftparcelReceiver");
    const savedParcel = localStorage.getItem("swiftparcelParcel");

    if (savedSender) {
      try {
        setSender(JSON.parse(savedSender));
      } catch (error) {
        console.error("Error loading sender information:", error);
      }
    }

    if (savedReceiver) {
      try {
        setReceiver(JSON.parse(savedReceiver));
      } catch (error) {
        console.error("Error loading receiver information:", error);
      }
    }

    if (savedParcel) {
      try {
        setParcel(JSON.parse(savedParcel));
      } catch (error) {
        console.error("Error loading parcel information:", error);
      }
    }
  }, []);

  const handleContinueToPayment = () => {
    const shipmentDetails = {
      sender,
      receiver,
      parcel,
    };

    localStorage.setItem(
      "swiftparcelPendingShipment",
      JSON.stringify(shipmentDetails)
    );

    navigate("/payment");
  };

  return (
    <div className="confirm-shipment-screen">

      {/* Header */}
      <header className="confirm-header">

        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/send-parcel")}
        >
          ←
        </button>

        <h1>Send Parcel</h1>

        <div className="header-placeholder"></div>

      </header>


      {/* Progress */}
      <div className="parcel-progress">

        <div className="progress-step completed">
          <span>✓</span>
          <p>Sender</p>
        </div>

        <div className="progress-line active-line"></div>

        <div className="progress-step completed">
          <span>✓</span>
          <p>Receiver</p>
        </div>

        <div className="progress-line active-line"></div>

        <div className="progress-step completed">
          <span>✓</span>
          <p>Parcel</p>
        </div>

        <div className="progress-line active-line"></div>

        <div className="progress-step active">
          <span>4</span>
          <p>Confirm</p>
        </div>

      </div>


      {/* Main Content */}
      <main className="confirm-content">

        <div className="confirm-title">

          <div className="confirmation-icon">
            ✓
          </div>

          <h2>Review Your Shipment</h2>

          <p>
            Please check your information before
            continuing to payment.
          </p>

        </div>


        {/* Sender */}
        <section className="summary-card">

          <div className="summary-header">

            <h3>Sender Information</h3>

            <button
              type="button"
              onClick={() => navigate("/send-parcel")}
            >
              Edit
            </button>

          </div>

          <div className="summary-details">

            <p>
              <strong>Name:</strong>{" "}
              {sender.fullName || "Not provided"}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {sender.phone || "Not provided"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {sender.email || "Not provided"}
            </p>

            <p>
              <strong>Address:</strong>{" "}
              {sender.address || "Not provided"}
            </p>

            <p>
              <strong>City:</strong>{" "}
              {sender.city || "Not provided"}
            </p>

          </div>

        </section>


        {/* Receiver */}
        <section className="summary-card">

          <div className="summary-header">

            <h3>Receiver Information</h3>

            <button
              type="button"
              onClick={() => navigate("/receiver")}
            >
              Edit
            </button>

          </div>

          <div className="summary-details">

            <p>
              <strong>Name:</strong>{" "}
              {receiver.fullName || "Not provided"}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {receiver.phone || "Not provided"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {receiver.email || "Not provided"}
            </p>

            <p>
              <strong>Address:</strong>{" "}
              {receiver.address || "Not provided"}
            </p>

            <p>
              <strong>City:</strong>{" "}
              {receiver.city || "Not provided"}
            </p>

          </div>

        </section>


        {/* Parcel */}
        <section className="summary-card">

          <div className="summary-header">

            <h3>Parcel Details</h3>

            <button
              type="button"
              onClick={() => navigate("/send-parcel")}
            >
              Edit
            </button>

          </div>

          <div className="summary-details">

            <p>
              <strong>Type:</strong>{" "}
              {parcel.parcelType || "Not provided"}
            </p>

            <p>
              <strong>Weight:</strong>{" "}
              {parcel.weight || "Not provided"} kg
            </p>

            <p>
              <strong>Size:</strong>{" "}
              {parcel.packageSize || "Not provided"}
            </p>

            <p>
              <strong>Description:</strong>{" "}
              {parcel.description || "Not provided"}
            </p>

            <p>
              <strong>Fragile:</strong>{" "}
              {parcel.fragile ? "Yes" : "No"}
            </p>

            <p>
              <strong>Delivery Date:</strong>{" "}
              {parcel.deliveryDate || "Not provided"}
            </p>

          </div>

        </section>


        {/* Delivery Summary */}
        <section className="delivery-summary">

          <div>
            <span>Estimated Delivery</span>
            <strong>2 - 4 Business Days</strong>
          </div>

          <div>
            <span>Delivery Fee</span>
            <strong>Calculated at checkout</strong>
          </div>

        </section>


        {/* Continue to Payment */}
        <button
          type="button"
          className="confirm-button"
          onClick={handleContinueToPayment}
        >
          Continue to Payment
        </button>


        {/* Cancel */}
        <button
          type="button"
          className="cancel-button"
          onClick={() => navigate("/home")}
        >
          Cancel
        </button>

      </main>

    </div>
  );
}

export default ConfirmShipment;