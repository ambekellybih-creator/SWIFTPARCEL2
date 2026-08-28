import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeScreen.css";

function HomeScreen() {
  const navigate = useNavigate();

  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState("");
  const [shipment, setShipment] = useState(null);

  const apiUrl =
    process.env.REACT_APP_API_URL ||
    "https://swiftparcel-api-k6i6.onrender.com";

  // ======================================================
  // OPEN TRACKING PAGE
  // ======================================================

  const openTracking = (number) => {
    const cleanNumber = String(number || "").trim();

    if (!cleanNumber) {
      setTrackingError("No tracking number was provided.");
      return;
    }

    navigate(
      `/tracking/${encodeURIComponent(cleanNumber)}`
    );
  };

  // ======================================================
  // TRACK SHIPMENT
  // ======================================================

  const handleTrack = async () => {
    const number = trackingNumber.trim();

    if (!number) {
      setTrackingError("Please enter a tracking number.");
      return;
    }

    setTrackingLoading(true);
    setTrackingError("");
    setShipment(null);

    try {
      const response = await fetch(
        `${apiUrl}/api/shipments/${encodeURIComponent(number)}`
      );

      const responseText = await response.text();

      let data = {};

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Shipment not found."
        );
      }

      if (!data.shipment) {
        throw new Error(
          "Shipment information was not found."
        );
      }

      setShipment(data.shipment);

      // Automatically open tracking page
      openTracking(data.shipment.trackingNumber);
    } catch (error) {
      console.error("Tracking error:", error);

      setTrackingError(
        error.message || "Unable to track shipment."
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

    const currentIndex = statuses.indexOf(status);

    return statuses.map((item, index) => ({
      name: item,
      completed: currentIndex >= index,
      current: currentIndex === index,
    }));
  };

  return (
    <div className="home-screen">

      {/* HEADER */}

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
          onClick={() =>
            alert(
              "Notifications will be available soon."
            )
          }
        >
          🔔
        </button>

      </header>


      {/* TRACKING CARD */}

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
                setTrackingNumber(event.target.value);

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

          {trackingError && (
            <p className="tracking-error">
              {trackingError}
            </p>
          )}

        </div>

      </section>


      {/* TRACKING RESULT */}

      {shipment && (
        <section className="home-section">

          <div
            className="tracking-result"
            onClick={() =>
              openTracking(
                shipment.trackingNumber
              )
            }
            style={{
              cursor: "pointer",
            }}
          >

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

            {/* TRACK BUTTON */}

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();

                openTracking(
                  shipment.trackingNumber
                );
              }}
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "14px",
                border: "none",
                borderRadius: "12px",
                background: "#3424e9",
                color: "white",
                fontSize: "15px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              🗺️ View Shipment on Map
            </button>

          </div>

        </section>
      )}


      {/* QUICK ACTIONS */}

      <section className="home-section">

        <div className="section-heading">

          <h2>
            Quick Actions
          </h2>

        </div>

        <div className="quick-actions">

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


      {/* RECENT SHIPMENTS */}

      <section className="home-section">

        <div className="section-heading">

          <h2>
            Recent Shipments
          </h2>

          <button
            type="button"
            onClick={() =>
              navigate("/shipments")
            }
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


      {/* BOTTOM NAVIGATION */}

      <nav className="bottom-navigation">

        {/* HOME */}

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


        {/* SHIPMENTS */}

        <button
          className="bottom-nav-item"
          type="button"
          onClick={() =>
            navigate("/shipments")
          }
        >

          <span>
            ▣
          </span>

          <small>
            Shipments
          </small>

        </button>


        {/* TRACK */}

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


        {/* PROFILE */}

        <button
          className="bottom-nav-item"
          type="button"
          onClick={() =>
            alert(
              "Profile page will be built soon."
            )
          }
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