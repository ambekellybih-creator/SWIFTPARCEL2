import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Shipments.css";

function Shipments() {
  const navigate = useNavigate();

  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiUrl =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";

  // =========================================
  // LOAD SHIPMENTS
  // =========================================

  const loadShipments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${apiUrl}/api/shipments`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load shipments."
        );
      }

      const data = await response.json();

      setShipments(data.shipments || []);
    } catch (error) {
      console.error(
        "Loading shipments error:",
        error
      );

      setError(
        "Unable to load your shipments."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOAD WHEN PAGE OPENS
  // =========================================

  useEffect(() => {
    loadShipments();
  }, []);

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================
  // TRACK SHIPMENT
  // =========================================

  const handleTrackShipment = (trackingNumber) => {
    navigate(
      `/home?tracking=${encodeURIComponent(
        trackingNumber
      )}`
    );
  };

  return (
    <div className="shipments-screen">

      {/* =====================================
          HEADER
      ===================================== */}

      <header className="shipments-header">

        <button
          type="button"
          className="shipments-back-button"
          onClick={() => navigate("/home")}
        >
          ←
        </button>

        <h1>My Shipments</h1>

        <div className="shipments-header-placeholder"></div>

      </header>


      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main className="shipments-content">

        <div className="shipments-title">

          <h2>Recent Shipments</h2>

          <p>
            View and track all your parcels.
          </p>

        </div>


        {/* ===================================
            LOADING
        =================================== */}

        {loading && (

          <div className="shipments-loading">

            <p>
              Loading your shipments...
            </p>

          </div>

        )}


        {/* ===================================
            ERROR
        =================================== */}

        {!loading && error && (

          <div className="shipments-empty">

            <div className="shipments-empty-icon">
              ⚠️
            </div>

            <h3>
              Something went wrong
            </h3>

            <p>
              {error}
            </p>

            <button
              type="button"
              className="shipments-try-again-button"
              onClick={loadShipments}
            >
              Try Again
            </button>

          </div>

        )}


        {/* ===================================
            NO SHIPMENTS
        =================================== */}

        {!loading &&
          !error &&
          shipments.length === 0 && (

            <div className="shipments-empty">

              <div className="shipments-empty-icon">
                📦
              </div>

              <h3>
                No shipments yet
              </h3>

              <p>
                You haven't created any
                shipments yet.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/send-parcel")
                }
              >
                Send a Parcel
              </button>

            </div>

          )}


        {/* ===================================
            SHIPMENT LIST
        =================================== */}

        {!loading &&
          !error &&
          shipments.length > 0 && (

            <div className="shipments-list">

              {shipments.map((shipment) => (

                <div
                  className="shipment-item"
                  key={shipment._id}
                >

                  {/* CARD TOP */}

                  <div className="shipment-item-top">

                    <div className="shipment-item-info">

                      <div className="shipment-item-icon">
                        📦
                      </div>

                      <div>

                        <h3>
                          {shipment.trackingNumber}
                        </h3>

                        <p>
                          To:{" "}
                          {shipment.receiverName}
                        </p>

                      </div>

                    </div>


                    {/* STATUS */}

                    <span
                      className={`shipment-status ${
                        shipment.status
                          ?.toLowerCase()
                          .replace(
                            /\s+/g,
                            "-"
                          )
                      }`}
                    >
                      {shipment.status}
                    </span>

                  </div>


                  {/* CARD DETAILS */}

                  <div className="shipment-item-details">

                    <div className="shipment-detail">

                      <span>
                        Sender
                      </span>

                      <strong>
                        {shipment.senderName}
                      </strong>

                    </div>


                    <div className="shipment-detail">

                      <span>
                        Receiver
                      </span>

                      <strong>
                        {shipment.receiverName}
                      </strong>

                    </div>


                    <div className="shipment-detail">

                      <span>
                        Parcel Type
                      </span>

                      <strong>
                        {shipment.parcelType}
                      </strong>

                    </div>


                    <div className="shipment-detail">

                      <span>
                        Weight
                      </span>

                      <strong>
                        {shipment.weight} kg
                      </strong>

                    </div>


                    <div className="shipment-detail">

                      <span>
                        Date
                      </span>

                      <strong>
                        {formatDate(
                          shipment.createdAt
                        )}
                      </strong>

                    </div>


                    <div className="shipment-detail">

                      <span>
                        Tracking Number
                      </span>

                      <strong>
                        {shipment.trackingNumber}
                      </strong>

                    </div>

                  </div>


                  {/* TRACK BUTTON */}

                  <button
                    type="button"
                    className="shipment-track-button"
                    onClick={() =>
                      handleTrackShipment(
                        shipment.trackingNumber
                      )
                    }
                  >
                    Track Shipment
                  </button>

                </div>

              ))}

            </div>

          )}

      </main>


      {/* =====================================
          BOTTOM NAVIGATION
      ===================================== */}

      <nav className="shipments-bottom-navigation">

        {/* HOME */}

        <button
          className="shipments-bottom-nav-item"
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
          className="shipments-bottom-nav-item active"
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
          className="shipments-bottom-nav-item"
          type="button"
          onClick={() =>
            navigate("/home")
          }
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
          className="shipments-bottom-nav-item"
          type="button"
          onClick={() => {
            alert(
              "Profile page will be added soon."
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

export default Shipments;