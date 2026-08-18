import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
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
  // CHECK ADMIN LOGIN
  // ==========================================

  useEffect(() => {
    const isAdmin =
      localStorage.getItem("swiftparcelAdmin");

    if (isAdmin !== "true") {
      navigate("/admin-login", {
        replace: true
      });
    }
  }, [navigate]);


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
        "Load shipments error:",
        error
      );

      setError(
        error.message ||
        "Unable to load shipments."
      );
    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // LOAD SHIPMENTS WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    const isAdmin =
      localStorage.getItem("swiftparcelAdmin");

    if (isAdmin === "true") {
      loadShipments();
    }
  }, []);


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem(
      "swiftparcelAdmin"
    );

    navigate("/admin-login", {
      replace: true
    });
  };


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
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
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
          "Failed to update shipment status."
        );
      }

      setShipments(
        (currentShipments) =>
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

      alert(
        "Shipment status updated successfully! 👌"
      );
    } catch (error) {
      console.error(
        "Update status error:",
        error
      );

      alert(
        error.message ||
        "Failed to update shipment status."
      );
    } finally {
      setUpdatingTrackingNumber("");
    }
  };


  // ==========================================
  // DELETE SHIPMENT
  // ==========================================

  const handleDelete = async (
    trackingNumber
  ) => {
    const confirmDelete =
      window.confirm(
        `Are you sure you want to delete shipment ${trackingNumber}?`
      );

    if (!confirmDelete) {
      return;
    }

    try {
      const response =
        await fetch(
          `${apiUrl}/api/shipments/${encodeURIComponent(
            trackingNumber
          )}`,
          {
            method: "DELETE"
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to delete shipment."
        );
      }

      setShipments(
        (currentShipments) =>
          currentShipments.filter(
            (shipment) =>
              shipment.trackingNumber !==
              trackingNumber
          )
      );

      alert(
        "Shipment deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete shipment error:",
        error
      );

      alert(
        error.message ||
        "Failed to delete shipment."
      );
    }
  };


  // ==========================================
  // TRACK SHIPMENT
  // ==========================================

  const handleTrack = (
    trackingNumber
  ) => {
    navigate(
      `/home?tracking=${encodeURIComponent(
        trackingNumber
      )}`
    );
  };


  // ==========================================
  // STATISTICS
  // ==========================================

  const totalShipments =
    shipments.length;

  const pendingShipments =
    shipments.filter(
      (shipment) =>
        shipment.status === "Pending"
    ).length;

  const inTransitShipments =
    shipments.filter(
      (shipment) =>
        shipment.status === "In Transit"
    ).length;

  const deliveredShipments =
    shipments.filter(
      (shipment) =>
        shipment.status === "Delivered"
    ).length;


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="admin-dashboard">

        <div className="admin-loading">

          <div className="admin-loading-icon">
            📦
          </div>

          <h2>
            Loading dashboard...
          </h2>

          <p>
            Please wait.
          </p>

        </div>

      </div>
    );
  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="admin-dashboard">

        <header className="admin-header">

          <button
            type="button"
            className="admin-back-button"
            onClick={() =>
              navigate("/home")
            }
          >
            ←
          </button>

          <div className="admin-header-title">

            <p>
              SwiftParcel
            </p>

            <h1>
              Admin Dashboard
            </h1>

          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={loadShipments}
          >
            ↻
          </button>

        </header>

        <div className="admin-error">

          <div>
            ⚠️
          </div>

          <h2>
            Unable to load shipments
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={loadShipments}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }


  // ==========================================
  // MAIN DASHBOARD
  // ==========================================

  return (
    <div className="admin-dashboard">

      {/* HEADER */}

      <header className="admin-header">

        <button
          type="button"
          className="admin-back-button"
          onClick={() =>
            navigate("/home")
          }
        >
          ←
        </button>


        <div className="admin-header-title">

          <p>
            SwiftParcel
          </p>

          <h1>
            Admin Dashboard
          </h1>

        </div>


        <div className="admin-header-actions">

          <button
            type="button"
            className="admin-refresh-button"
            onClick={loadShipments}
            aria-label="Refresh"
          >
            ↻
          </button>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* MAIN */}

      <main className="admin-content">

        {/* WELCOME */}

        <section className="admin-welcome">

          <h2>
            Welcome, Admin 👋
          </h2>

          <p>
            Manage and monitor all SwiftParcel
            shipments from here.
          </p>

        </section>


        {/* STATISTICS */}

        <section className="admin-stats">

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              📦
            </div>

            <div>

              <span>
                Total Shipments
              </span>

              <strong>
                {totalShipments}
              </strong>

            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              ⏳
            </div>

            <div>

              <span>
                Pending
              </span>

              <strong>
                {pendingShipments}
              </strong>

            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              🚚
            </div>

            <div>

              <span>
                In Transit
              </span>

              <strong>
                {inTransitShipments}
              </strong>

            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              ✅
            </div>

            <div>

              <span>
                Delivered
              </span>

              <strong>
                {deliveredShipments}
              </strong>

            </div>

          </div>

        </section>


        {/* SHIPMENTS */}

        <section className="admin-shipments-section">

          <div className="admin-section-heading">

            <h2>
              All Shipments
            </h2>

            <p>
              Update shipment status or manage
              individual shipments.
            </p>

          </div>


          {shipments.length === 0 ? (

            <div className="admin-empty">

              <div>
                📦
              </div>

              <h3>
                No shipments yet
              </h3>

              <p>
                New shipments will appear here.
              </p>

            </div>

          ) : (

            <div className="admin-shipment-list">

              {shipments.map(
                (shipment) => (

                  <div
                    className="admin-shipment-card"
                    key={shipment._id}
                  >

                    {/* TOP */}

                    <div className="admin-shipment-top">

                      <div className="admin-shipment-icon">
                        📦
                      </div>

                      <div className="admin-shipment-info">

                        <h3>
                          {shipment.trackingNumber}
                        </h3>

                        <p>
                          To:{" "}
                          {shipment.receiverName}
                        </p>

                      </div>

                      <span
                        className={`admin-status ${
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


                    {/* DETAILS */}

                    <div className="admin-shipment-details">

                      <div>
                        <span>
                          Sender
                        </span>

                        <strong>
                          {shipment.senderName}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Receiver
                        </span>

                        <strong>
                          {shipment.receiverName}
                        </strong>
                      </div>

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
                          Sender Phone
                        </span>

                        <strong>
                          {shipment.senderPhone}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Receiver Phone
                        </span>

                        <strong>
                          {shipment.receiverPhone}
                        </strong>
                      </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="admin-shipment-actions">

                      <select
                        value={
                          shipment.status
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


                      <button
                        type="button"
                        className="admin-track-button"
                        onClick={() =>
                          handleTrack(
                            shipment.trackingNumber
                          )
                        }
                      >
                        Track
                      </button>


                      <button
                        type="button"
                        className="admin-delete-button"
                        onClick={() =>
                          handleDelete(
                            shipment.trackingNumber
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>


      {/* BOTTOM NAVIGATION */}

      <nav className="bottom-navigation">

        <button
          className="bottom-nav-item active"
          type="button"
          onClick={() =>
            navigate("/admin")
          }
        >
          <span>
            ⌂
          </span>

          <small>
            Dashboard
          </small>
        </button>


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
            Tracking
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
            ◯
          </span>

          <small>
            Home
          </small>
        </button>

      </nav>

    </div>
  );
}

export default AdminDashboard;