import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeScreen.css";

function HomeScreen() {
  const navigate = useNavigate();

  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState("");
  const [shipment, setShipment] = useState(null);

  // ======================================================
  // TRACK SHIPMENT
  // ======================================================

  const handleTrack = async () => {
    const number = trackingNumber.trim();

    // Check if tracking number is empty
    if (!number) {
      setTrackingError("Please enter a tracking number.");
      return;
    }

    setTrackingLoading(true);
    setTrackingError("");
    setShipment(null);

    try {
      const apiUrl =
  process.env.REACT_APP_API_URL ||
  "https://swiftparcel-api-k6i6.onrender.com";
      // Find shipment using tracking number
      const response = await fetch(
        `${apiUrl}/api/shipments/${encodeURIComponent(number)}`
      );

      const responseText = await response.text();

      let data = {};

      // Try to read server response
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      // Shipment not found
      if (!response.ok) {
        throw new Error(
          data.message || "Shipment not found."
        );
      }

      // Make sure shipment exists
      if (!data.shipment) {
        throw new Error("Shipment information was not found.");
      }

      // Save shipment
      setShipment(data.shipment);

      // ==================================================
      // AUTOMATICALLY OPEN TRACKING MAP
      // ==================================================

      navigate(
        `/tracking/${encodeURIComponent(
          data.shipment.trackingNumber
        )}`
      );

    } catch (error) {
      console.error("Tracking error:", error);

      setTrackingError(
        error.message ||
          "Unable to track shipment."
      );
    } finally {
      setTrackingLoading(false);
    }
  };

  // ======================================================
  // TRACKING TIMELINE
  // ======================================================

  const getStatusStep = (status) => {
    const statuses = [
      "Pending",
      "Picked Up",
      "In Transit",
      "Out for Delivery",
      "Delivered",
    ];

    const currentIndex =
      statuses.indexOf(status);

    return statuses.map((item, index) => ({
      name: item,
      completed:
        currentIndex >= index,
      current:
        currentIndex === index,
    }));
  };

  return (
    <div className="home-screen">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="home-header">

        <div>
          <p className="home-greeting">
            Good day 👋
          </p>

          <h1>
            Welcome to SwiftParcel
          </h1>
        </div>

        <button
          className="notification-button"
          type="button"
          aria-label="Notifications"
          onClick={() => {
            alert(
              "Notifications will be available soon."
            );
          }}
        >
          🔔
        </button>

      </header>


      {/* ==================================================
          TRACKING CARD
      ================================================== */}

      <section className="tracking-card">

        <div className="tracking-card-content">

          <p>
            Track your parcel
          </p>

          <h2>
            Where is your parcel?
          </h2>

          <div className="tracking-input">

            <input
              type="text"
              placeholder="Enter tracking number"
              value={trackingNumber}
              onChange={(event) => {
                setTrackingNumber(
                  event.target.value
                );

                // Clear previous error
                if (trackingError) {
                  setTrackingError("");
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleTrack();
                }
              }}
            />

            <button
              type="button"
              onClick={handleTrack}
              disabled={trackingLoading}
            >
              {trackingLoading
                ? "Tracking..."
                : "Track"}
            </button>

          </div>

          {/* Tracking error */}

          {trackingError && (
            <p className="tracking-error">
              {trackingError}
            </p>
          )}

        </div>

      </section>


      {/* ==================================================
          TRACKING RESULT
          
          This is kept here in case shipment data is
          returned, although successful tracking now
          automatically opens the map page.
      ================================================== */}

      {shipment && (
        <section className="home-section">

          <div className="tracking-result">

            <h2>
              Shipment Found 🎉
            </h2>

            <div className="tracking-result-details">

              <p>
                <strong>
                  Tracking Number:
                </strong>{" "}
                {shipment.trackingNumber}
              </p>

              <p>
                <strong>
                  Current Status:
                </strong>{" "}
                {shipment.status}
              </p>

              <p>
                <strong>
                  Sender:
                </strong>{" "}
                {shipment.senderName}
              </p>

              <p>
                <strong>
                  Receiver:
                </strong>{" "}
                {shipment.receiverName}
              </p>

              <p>
                <strong>
                  Parcel Type:
                </strong>{" "}
                {shipment.parcelType}
              </p>

              <p>
                <strong>
                  Weight:
                </strong>{" "}
                {shipment.weight} kg
              </p>

            </div>


            {/* ==================================================
                TIMELINE
            ================================================== */}

            <div className="tracking-timeline">

              <h3>
                Shipment Progress
              </h3>

              {getStatusStep(
                shipment.status
              ).map((step, index) => (

                <div
                  className={`timeline-step ${
                    step.completed
                      ? "completed"
                      : ""
                  } ${
                    step.current
                      ? "current"
                      : ""
                  }`}
                  key={step.name}
                >

                  <div className="timeline-icon">

                    {step.completed
                      ? "✓"
                      : index + 1}

                  </div>

                  <div className="timeline-content">

                    <strong>
                      {step.name}
                    </strong>

                    <p>
                      {step.current
                        ? "Your shipment is currently at this stage."
                        : step.completed
                        ? "Completed"
                        : "Not yet reached"}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </section>
      )}


      {/* ==================================================
          QUICK ACTIONS
      ================================================== */}

      <section className="home-section">

        <div className="section-heading">

          <h2>
            Quick Actions
          </h2>

        </div>


        <div className="quick-actions">

          {/* Send Parcel */}

          <button
            className="action-card"
            type="button"
            onClick={() =>
              navigate("/send-parcel")
            }
          >

            <div className="action-icon">
              📦
            </div>

            <div>

              <h3>
                Send Parcel
              </h3>

              <p>
                Send a package
              </p>

            </div>

          </button>


          {/* Track Parcel */}

          <button
            className="action-card"
            type="button"
            onClick={() => {
              document
                .querySelector(
                  ".tracking-input input"
                )
                ?.focus();
            }}
          >

            <div className="action-icon">
              🚚
            </div>

            <div>

              <h3>
                Track Parcel
              </h3>

              <p>
                Track your delivery
              </p>

            </div>

          </button>

        </div>

      </section>


      {/* ==================================================
          RECENT SHIPMENTS
      ================================================== */}

      <section className="home-section">

        <div className="section-heading">

          <h2>
            Recent Shipments
          </h2>

          <button
            type="button"
            onClick={() => {
              alert(
                "Recent shipments will be expanded soon."
              );
            }}
          >
            View all
          </button>

        </div>


        <div className="empty-shipments">

          <div className="empty-icon">
            📦
          </div>

          <h3>
            No shipments yet
          </h3>

          <p>
            Your recent shipments will appear here.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/send-parcel")
            }
          >
            Send your first parcel
          </button>

        </div>

      </section>


      {/* ==================================================
          BOTTOM NAVIGATION
      ================================================== */}

      <nav className="bottom-navigation">

        {/* Home */}

        <button
          className="bottom-nav-item active"
          type="button"
          onClick={() =>
            navigate("/home")
          }
        >

          <span>
            ⌂
          </span>

          <small>
            Home
          </small>

        </button>


        {/* Shipments */}

        <button
          className="bottom-nav-item"
          type="button"
          onClick={() => {
            alert(
              "Shipments page will be built soon."
            );
          }}
        >

          <span>
            ▣
          </span>

          <small>
            Shipments
          </small>

        </button>


        {/* Track */}

        <button
          className="bottom-nav-item"
          type="button"
          onClick={() => {
            document
              .querySelector(
                ".tracking-input input"
              )
              ?.focus();
          }}
        >

          <span>
            ⌖
          </span>

          <small>
            Track
          </small>

        </button>


        {/* Profile */}

        <button
          className="bottom-nav-item"
          type="button"
          onClick={() => {
            alert(
              "Profile page will be built soon."
            );
          }}
        >

          <span>
            ◯
          </span>

          <small>
            Profile
          </small>

        </button>

      </nav>

    </div>
  );
}

export default HomeScreen;