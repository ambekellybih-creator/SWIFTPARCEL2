import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Shipments.css";

function Shipments() {
  const navigate = useNavigate();

  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingTrackingNumber, setUpdatingTrackingNumber] =
    useState("");

  const apiUrl =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";


  // ==========================================
  // LOAD SHIPMENTS
  // ==========================================

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

      setShipments(
        data.shipments || []
      );

    } catch (error) {
      console.error(
        "Loading shipments error:",
        error
      );

      setError(
        "Unable to load shipments."
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // LOAD WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    loadShipments();
  }, []);


  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const handleStatusChange = async (
    trackingNumber,
    newStatus
  ) => {

    try {

      setUpdatingTrackingNumber(
        trackingNumber
      );

      const response = await fetch(
        `${apiUrl}/api/shipments/${encodeURIComponent(
          trackingNumber
        )}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            status: newStatus
          })
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to update status."
        );

      }


      // Update shipment on the page

      setShipments((currentShipments) =>
        currentShipments.map(
          (shipment) =>
            shipment.trackingNumber ===
            trackingNumber
              ? {
                  ...shipment,
                  status:
                    data.shipment.status
                }
              : shipment
        )
      );


    } catch (error) {

      console.error(
        "Status update error:",
        error
      );

      alert(
        error.message ||
        "Unable to update shipment status."
      );

    } finally {

      setUpdatingTrackingNumber("");

    }
  };


  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {

    return (
      status
        ?.toLowerCase()
        .replace(/\s+/g, "-") ||
      "pending"
    );

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="shipments-screen">

        <header className="shipments-header">

          <button
            className="shipments-back-button"
            type="button"
            onClick={() =>
              navigate("/home")
            }
          >
            ←
          </button>

          <h1>
            My Shipments
          </h1>

          <div></div>

        </header>


        <main className="shipments-content">

          <div className="shipments-message">

            <div className="shipments-message-icon">
              📦
            </div>

            <h2>
              Loading shipments...
            </h2>

            <p>
              Please wait while we load your shipments.
            </p>

          </div>

        </main>

      </div>

    );
  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (

      <div className="shipments-screen">

        <header className="shipments-header">

          <button
            className="shipments-back-button"
            type="button"
            onClick={() =>
              navigate("/home")
            }
          >
            ←
          </button>

          <h1>
            My Shipments
          </h1>

          <div></div>

        </header>


        <main className="shipments-content">

          <div className="shipments-message">

            <div className="shipments-message-icon">
              ⚠️
            </div>

            <h2>
              Something went wrong
            </h2>

            <p>
              {error}
            </p>

            <button
              className="try-again-button"
              type="button"
              onClick={loadShipments}
            >
              Try Again
            </button>

          </div>

        </main>

      </div>

    );
  }


  // ==========================================
  // NO SHIPMENTS
  // ==========================================

  if (shipments.length === 0) {

    return (

      <div className="shipments-screen">

        <header className="shipments-header">

          <button
            className="shipments-back-button"
            type="button"
            onClick={() =>
              navigate("/home")
            }
          >
            ←
          </button>

          <h1>
            My Shipments
          </h1>

          <div></div>

        </header>


        <main className="shipments-content">

          <div className="shipments-message">

            <div className="shipments-message-icon">
              📦
            </div>

            <h2>
              No shipments yet
            </h2>

            <p>
              Your shipments will appear here.
            </p>

            <button
              className="create-shipment-button"
              type="button"
              onClick={() =>
                navigate("/send-parcel")
              }
            >
              Send a Parcel
            </button>

          </div>

        </main>

      </div>

    );
  }


  // ==========================================
  // SHIPMENTS PAGE
  // ==========================================

  return (

    <div className="shipments-screen">

      {/* HEADER */}

      <header className="shipments-header">

        <button
          className="shipments-back-button"
          type="button"
          onClick={() =>
            navigate("/home")
          }
        >
          ←
        </button>

        <h1>
          My Shipments
        </h1>

        <div></div>

      </header>


      {/* CONTENT */}

      <main className="shipments-content">

        <div className="shipments-title">

          <h2>
            Your Shipments
          </h2>

          <p>
            Manage and track your parcels.
          </p>

        </div>


        <div className="shipments-list">

          {shipments.map((shipment) => (

            <div
              className="shipment-item"
              key={shipment._id}
            >

              {/* TOP */}

              <div className="shipment-item-top">

                <div className="shipment-item-icon">
                  📦
                </div>


                <div className="shipment-item-info">

                  <h3>
                    {shipment.trackingNumber}
                  </h3>

                  <p>
                    To: {shipment.receiverName}
                  </p>

                </div>


                <span
                  className={`shipment-status ${getStatusClass(
                    shipment.status
                  )}`}
                >
                  {shipment.status}
                </span>

              </div>


              {/* DETAILS */}

              <div className="shipment-item-details">

                <div>
                  <span>
                    Parcel
                  </span>

                  <strong>
                    {shipment.parcelType}
                  </strong>
                </div>


                <div>
                  <span>
                    Weight
                  </span>

                  <strong>
                    {shipment.weight} kg
                  </strong>
                </div>


                <div>
                  <span>
                    Sender
                  </span>

                  <strong>
                    {shipment.senderName}
                  </strong>
                </div>

              </div>


              {/* STATUS UPDATE */}

              <div className="status-update-section">

                <label
                  htmlFor={`status-${shipment._id}`}
                >
                  Update Shipment Status
                </label>


                <select
                  id={`status-${shipment._id}`}
                  value={
                    shipment.status ||
                    "Pending"
                  }
                  disabled={
                    updatingTrackingNumber ===
                    shipment.trackingNumber
                  }
                  onChange={(event) =>
                    handleStatusChange(
                      shipment.trackingNumber,
                      event.target.value
                    )
                  }
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Picked Up">
                    Picked Up
                  </option>

                  <option value="In Transit">
                    In Transit
                  </option>

                  <option value="Out for Delivery">
                    Out for Delivery
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>

                </select>


                {updatingTrackingNumber ===
                  shipment.trackingNumber && (

                  <p className="status-updating">
                    Updating status...
                  </p>

                )}

              </div>


              {/* BUTTON */}

              <button
                className="track-shipment-button"
                type="button"
                onClick={() => {

                  navigate(
                    `/home?tracking=${encodeURIComponent(
                      shipment.trackingNumber
                    )}`
                  );

                }}
              >
                Track Shipment
              </button>

            </div>

          ))}

        </div>

      </main>


      {/* BOTTOM NAVIGATION */}

      <nav className="bottom-navigation">

        <button
          className="bottom-nav-item"
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


        <button
          className="bottom-nav-item active"
          type="button"
        >

          <span>
            ▣
          </span>

          <small>
            Shipments
          </small>

        </button>


        <button
          className="bottom-nav-item"
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


        <button
          className="bottom-nav-item"
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