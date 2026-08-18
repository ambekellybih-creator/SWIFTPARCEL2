import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ConfirmShipment.css";

function ConfirmShipment() {
  const navigate = useNavigate();

  const [sender, setSender] = useState({});
  const [receiver, setReceiver] = useState({});
  const [parcel, setParcel] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    const savedSender = localStorage.getItem("swiftparcelSender");
    const savedReceiver = localStorage.getItem("swiftparcelReceiver");
    const savedParcel = localStorage.getItem("swiftparcelParcel");

    if (savedSender) {
      setSender(JSON.parse(savedSender));
    }

    if (savedReceiver) {
      setReceiver(JSON.parse(savedReceiver));
    }

    if (savedParcel) {
      setParcel(JSON.parse(savedParcel));
    }
  }, []);

  const handleConfirm = async () => {
    setLoading(true);
    setError("");

    try {
      const apiUrl =
        process.env.REACT_APP_API_URL ||
        "http://localhost:5000";

      const response = await fetch(`${apiUrl}/api/shipments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderName: sender.fullName,
          senderPhone: sender.phone,
          senderAddress: `${sender.address}, ${sender.city}`,

          receiverName: receiver.fullName,
          receiverPhone: receiver.phone,
          receiverAddress: `${receiver.address}, ${receiver.city}`,

          parcelType: parcel.parcelType,
          weight: Number(parcel.weight),
        }),
      });

      const responseText = await response.text();

      console.log("Backend status:", response.status);
      console.log("Backend response:", responseText);

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}: ${responseText}`
        );
      }

      const data = JSON.parse(responseText);

      if (!data.shipment) {
        throw new Error(
          "The server did not return shipment information."
        );
      }

      setTrackingNumber(data.shipment.trackingNumber);
      setSuccess(true);

      // Save the created shipment
      localStorage.setItem(
        "swiftparcelShipment",
        JSON.stringify(data.shipment)
      );

    } catch (error) {
      console.error("Shipment error:", error);

      setError(
        error.message ||
          "Unable to create shipment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="confirm-shipment-screen">

      {/* Header */}
      <header className="confirm-header">

        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/parcel-details")}
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
            confirming your shipment.
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
              onClick={() => navigate("/parcel-details")}
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


        {/* Error */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* Success */}
        {success && (
          <div className="success-message">

            <h3>🎉 Shipment Confirmed!</h3>

            <p>Your shipment has been successfully created.</p>

            <p>
              <strong>Tracking Number:</strong>
            </p>

            <h2>{trackingNumber}</h2>

          </div>
        )}


        {/* Confirm Button */}
        {!success && (
          <button
            type="button"
            className="confirm-button"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading
              ? "Confirming Shipment..."
              : "Confirm Shipment"}
          </button>
        )}


        {/* Cancel */}
        {!success && (
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/home")}
            disabled={loading}
          >
            Cancel
          </button>
        )}

      </main>

    </div>
  );
}

export default ConfirmShipment;