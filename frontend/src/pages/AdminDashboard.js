import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import "./AdminDashboard.css";


const getAdminToken = () => {
  return localStorage.getItem(
    "swiftparcelAdminToken"
  );
};


function AdminDashboard() {

  const navigate = useNavigate();


  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [
    updatingTrackingNumber,
    setUpdatingTrackingNumber,
  ] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");


  const apiUrl =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";


  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = useCallback(() => {

    localStorage.removeItem(
      "swiftparcelAdminToken"
    );

    localStorage.removeItem(
      "swiftparcelAdmin"
    );

    localStorage.removeItem(
      "swiftparcelAdminUsername"
    );


    navigate("/admin-login", {
      replace: true,
    });

  }, [navigate]);


  // ======================================================
  // CHECK ADMIN LOGIN
  // ======================================================

  useEffect(() => {

    const token = getAdminToken();


    if (!token) {

      navigate("/admin-login", {
        replace: true,
      });

    }

  }, [navigate]);


  // ======================================================
  // LOAD SHIPMENTS
  // ======================================================

  const loadShipments = useCallback(
    async () => {

      const token = getAdminToken();


      if (!token) {

        navigate("/admin-login", {
          replace: true,
        });

        return;

      }


      try {

        setLoading(true);
        setError("");


        const response = await fetch(
          `${apiUrl}/api/shipments`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


        let data = {};


        try {

          data = await response.json();

        } catch (jsonError) {

          data = {};

        }


        if (response.status === 401) {

          handleLogout();

          return;

        }


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to load shipments."
          );

        }


        setShipments(
          Array.isArray(data.shipments)
            ? data.shipments
            : []
        );


      } catch (err) {

        console.error(
          "Load shipments error:",
          err
        );


        setError(
          err.message ||
          "Unable to load shipments."
        );


      } finally {

        setLoading(false);

      }

    },
    [
      apiUrl,
      handleLogout,
      navigate,
    ]
  );


  // ======================================================
  // LOAD SHIPMENTS WHEN PAGE OPENS
  // ======================================================

  useEffect(() => {

    const token = getAdminToken();


    if (token) {

      loadShipments();

    }

  }, [loadShipments]);


  // ======================================================
  // UPDATE SHIPMENT STATUS
  // ======================================================

  const handleStatusChange = async (
    trackingNumber,
    newStatus
  ) => {

    const token = getAdminToken();


    if (!token) {

      navigate("/admin-login", {
        replace: true,
      });

      return;

    }


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
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );


      let data = {};


      try {

        data = await response.json();

      } catch (jsonError) {

        data = {};

      }


      if (response.status === 401) {

        handleLogout();

        return;

      }


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
                      data.shipment?.status ||
                      newStatus,
                  }
                : shipment
          )
      );


    } catch (err) {

      console.error(
        "Update status error:",
        err
      );


      window.alert(
        err.message ||
        "Failed to update shipment status."
      );


    } finally {

      setUpdatingTrackingNumber("");

    }

  };


  // ======================================================
  // DELETE SHIPMENT
  // ======================================================

  const handleDelete = async (
    trackingNumber
  ) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete shipment ${trackingNumber}?`
      );


    if (!confirmed) {

      return;

    }


    const token = getAdminToken();


    if (!token) {

      navigate("/admin-login", {
        replace: true,
      });

      return;

    }


    try {

      const response = await fetch(
        `${apiUrl}/api/shipments/${encodeURIComponent(
          trackingNumber
        )}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      let data = {};


      try {

        data = await response.json();

      } catch (jsonError) {

        data = {};

      }


      if (response.status === 401) {

        handleLogout();

        return;

      }


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


      window.alert(
        "Shipment deleted successfully."
      );


    } catch (err) {

      console.error(
        "Delete shipment error:",
        err
      );


      window.alert(
        err.message ||
        "Failed to delete shipment."
      );

    }

  };


  // ======================================================
  // TRACK SHIPMENT
  // ======================================================

  const handleTrack = (
    trackingNumber
  ) => {

    navigate(
      `/home?tracking=${encodeURIComponent(
        trackingNumber
      )}`
    );

  };


  // ======================================================
  // STATISTICS
  // ======================================================

  const totalShipments =
    shipments.length;


  const pendingShipments =
    shipments.filter(
      (shipment) =>
        shipment.status === "Pending"
    ).length;


  const pickedUpShipments =
    shipments.filter(
      (shipment) =>
        shipment.status === "Picked Up"
    ).length;


  const inTransitShipments =
    shipments.filter(
      (shipment) =>
        shipment.status === "In Transit"
    ).length;


  const outForDeliveryShipments =
    shipments.filter(
      (shipment) =>
        shipment.status ===
        "Out for Delivery"
    ).length;


  const deliveredShipments =
    shipments.filter(
      (shipment) =>
        shipment.status === "Delivered"
    ).length;


  // ======================================================
  // SEARCH AND FILTER
  // ======================================================

  const search =
    searchTerm.trim().toLowerCase();


  const filteredShipments =
    shipments.filter(
      (shipment) => {

        const trackingNumber =
          String(
            shipment.trackingNumber ||
            ""
          ).toLowerCase();


        const senderName =
          String(
            shipment.senderName ||
            ""
          ).toLowerCase();


        const receiverName =
          String(
            shipment.receiverName ||
            ""
          ).toLowerCase();


        const senderPhone =
          String(
            shipment.senderPhone ||
            ""
          ).toLowerCase();


        const receiverPhone =
          String(
            shipment.receiverPhone ||
            ""
          ).toLowerCase();


        const matchesSearch =
          search === "" ||
          trackingNumber.includes(search) ||
          senderName.includes(search) ||
          receiverName.includes(search) ||
          senderPhone.includes(search) ||
          receiverPhone.includes(search);


        const matchesStatus =
          statusFilter === "All" ||
          shipment.status ===
            statusFilter;


        return (
          matchesSearch &&
          matchesStatus
        );

      }
    );


  // ======================================================
  // CLEAR FILTERS
  // ======================================================

  const clearFilters = () => {

    setSearchTerm("");
    setStatusFilter("All");

  };


  // ======================================================
  // LOADING SCREEN
  // ======================================================

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


  // ======================================================
  // ERROR SCREEN
  // ======================================================

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


  // ======================================================
  // MAIN DASHBOARD
  // ======================================================

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


      {/* CONTENT */}

      <main className="admin-content">


        {/* WELCOME */}

        <section className="admin-welcome">

          <h2>
            Welcome, Admin 👋
          </h2>


          <p>
            Manage and monitor all
            SwiftParcel shipments
            from here.
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
              📍
            </div>


            <div>

              <span>
                Picked Up
              </span>


              <strong>
                {pickedUpShipments}
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
              🛵
            </div>


            <div>

              <span>
                Out for Delivery
              </span>


              <strong>
                {outForDeliveryShipments}
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
              Update shipment status
              or manage shipments.
            </p>

          </div>


          {/* SEARCH */}

          <div className="admin-search-filter">

            <input
              type="text"
              placeholder="Search tracking number, sender or receiver..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />


            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
            >

              <option value="All">
                All Statuses
              </option>


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

          </div>


          {/* RESULT COUNT */}

          <div className="admin-result-count">

            Showing{" "}

            <strong>
              {filteredShipments.length}
            </strong>{" "}

            of{" "}

            <strong>
              {shipments.length}
            </strong>{" "}

            shipments

          </div>


          {/* NO SHIPMENTS */}

          {shipments.length === 0 ? (

            <div className="admin-empty">

              <div>
                📦
              </div>


              <h3>
                No shipments yet
              </h3>


              <p>
                New shipments will appear
                here.
              </p>

            </div>

          ) : filteredShipments.length === 0 ? (

            <div className="admin-empty">

              <div>
                🔍
              </div>


              <h3>
                No matching shipments
              </h3>


              <p>
                Try another search or
                status filter.
              </p>


              <button
                type="button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            </div>

          ) : (

            <div className="admin-shipment-list">

              {filteredShipments.map(
                (shipment) => {

                  const trackingNumber =
                    shipment.trackingNumber ||
                    shipment._id;


                  const status =
                    shipment.status ||
                    "Pending";


                  const statusClass =
                    status
                      .toLowerCase()
                      .replace(
                        /\s+/g,
                        "-"
                      );


                  return (

                    <div
                      className="admin-shipment-card"
                      key={
                        shipment._id ||
                        trackingNumber
                      }
                    >


                      {/* TOP */}

                      <div className="admin-shipment-top">

                        <div className="admin-shipment-icon">
                          📦
                        </div>


                        <div className="admin-shipment-info">

                          <h3>
                            {trackingNumber}
                          </h3>


                          <p>
                            To:{" "}
                            {shipment.receiverName ||
                              "N/A"}
                          </p>

                        </div>


                        <span
                          className={`admin-status ${statusClass}`}
                        >
                          {status}
                        </span>

                      </div>


                      {/* DETAILS */}

                      <div className="admin-shipment-details">


                        <div>

                          <span>
                            Sender
                          </span>


                          <strong>
                            {shipment.senderName ||
                              "N/A"}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Receiver
                          </span>


                          <strong>
                            {shipment.receiverName ||
                              "N/A"}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Parcel
                          </span>


                          <strong>
                            {shipment.parcelType ||
                              "N/A"}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Weight
                          </span>


                          <strong>
                            {shipment.weight
                              ? `${shipment.weight} kg`
                              : "N/A"}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Sender Phone
                          </span>


                          <strong>
                            {shipment.senderPhone ||
                              "N/A"}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Receiver Phone
                          </span>


                          <strong>
                            {shipment.receiverPhone ||
                              "N/A"}
                          </strong>

                        </div>


                      </div>


                      {/* ACTIONS */}

                      <div className="admin-shipment-actions">


                        <select
                          value={status}
                          disabled={
                            updatingTrackingNumber ===
                            trackingNumber
                          }
                          onChange={(event) =>
                            handleStatusChange(
                              trackingNumber,
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
                              trackingNumber
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
                              trackingNumber
                            )
                          }
                        >
                          Delete
                        </button>


                      </div>


                    </div>

                  );

                }
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