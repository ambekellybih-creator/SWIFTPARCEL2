import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeScreen.css";


// ======================================================
// ICONS
// ======================================================

const Icon = ({ name, size = 24, stroke = 2 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (name) {
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      );

    case "scan":
      return (
        <svg {...common}>
          <path d="M4 8V5a1 1 0 0 1 1-1h3" />
          <path d="M16 4h3a1 1 0 0 1 1 1v3" />
          <path d="M20 16v3a1 1 0 0 1-1 1h-3" />
          <path d="M8 20H5a1 1 0 0 1-1-1v-3" />
          <path d="M7 12h10" />
          <path d="M12 7v10" />
        </svg>
      );

    case "box":
      return (
        <svg {...common}>
          <path d="m21 8-9-5-9 5 9 5 9-5Z" />
          <path d="M3 8v8l9 5 9-5V8" />
          <path d="M12 13v8" />
          <path d="m7.5 5.5 9 5" />
        </svg>
      );

    case "track":
      return (
        <svg {...common}>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 5 5" />
          <path d="M8 10.5h5" />
          <path d="M10.5 8v5" />
        </svg>
      );

    case "calculator":
      return (
        <svg {...common}>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <rect x="8" y="6" width="8" height="3" rx="1" />
          <path d="M8 13h2" />
          <path d="M14 13h2" />
          <path d="M8 17h2" />
          <path d="M14 17h2" />
        </svg>
      );

    case "location":
      return (
        <svg {...common}>
          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );

    case "bell":
      return (
        <svg {...common}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );

    case "home":
      return (
        <svg {...common}>
          <path d="m3 10 9-7 9 7" />
          <path d="M5 9v11h14V9" />
          <path d="M9 20v-6h6v6" />
        </svg>
      );

    case "shipments":
      return (
        <svg {...common}>
          <rect x="5" y="4" width="14" height="16" rx="2" />
          <path d="M9 8h6" />
          <path d="M9 12h6" />
          <path d="M9 16h3" />
        </svg>
      );

    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );

    case "profile":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );

    default:
      return null;
  }
};


// ======================================================
// PACKAGE ILLUSTRATION
// ======================================================

const PackageIllustration = () => {
  return (
    <div className="promo-package">

      <div className="package-top">
        <span />
      </div>

      <div className="package-front">
        <div className="package-tape" />
      </div>

      <div className="package-side" />

      <div className="package-label">
        SWIFT
      </div>

    </div>
  );
};


// ======================================================
// HOME SCREEN
// ======================================================

function HomeScreen() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Kelly");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [recentShipment, setRecentShipment] = useState({
    trackingNumber: "SPC7236491",
    status: "On the way",
    from: "Buea",
    to: "Yaoundé",
    date: "Aug 7, 2036",
  });


  // ======================================================
  // LOAD USER
  // ======================================================

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("swiftparcelUser") ||
        localStorage.getItem("user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        if (parsedUser.fullName) {
          setUserName(parsedUser.fullName.split(" ")[0]);
        } else if (parsedUser.name) {
          setUserName(parsedUser.name.split(" ")[0]);
        }
      }
    } catch (error) {
      console.log("Could not load user");
    }
  }, []);


  // ======================================================
  // LOAD RECENT SHIPMENT
  // ======================================================

  useEffect(() => {
    try {
      const storedShipments =
        localStorage.getItem("swiftparcelShipments");

      if (storedShipments) {
        const shipments = JSON.parse(storedShipments);

        if (Array.isArray(shipments) && shipments.length > 0) {
          const shipment = shipments[0];

          setRecentShipment({
            trackingNumber:
              shipment.trackingNumber || "SPC7236491",

            status:
              shipment.status === "delivered"
                ? "Delivered"
                : "On the way",

            from:
              shipment.pickupAddress ||
              shipment.from ||
              "Buea",

            to:
              shipment.deliveryAddress ||
              shipment.to ||
              "Yaoundé",

            date:
              shipment.date ||
              shipment.createdAt ||
              "Aug 7, 2036",
          });
        }
      }
    } catch (error) {
      console.log("Could not load shipments");
    }
  }, []);


  // ======================================================
  // TRACK SHIPMENT
  // ======================================================

  const handleTrack = () => {
    const number =
      trackingNumber.trim() ||
      recentShipment.trackingNumber;

    if (!number) return;

    navigate(
      `/tracking-details?trackingNumber=${encodeURIComponent(number)}`
    );
  };


  // ======================================================
  // QUICK ACTIONS
  // ======================================================

  const sendParcel = () => {
    navigate("/send-parcel");
  };

  const trackParcel = () => {
    navigate("/track-parcel");
  };

  const rateCalculator = () => {
    navigate("/rate-calculator");
  };

  const findLocation = () => {
    navigate("/find-location");
  };


  // ======================================================
  // NAVIGATION
  // ======================================================

  const goHome = () => {
    navigate("/home");
  };

  const goShipments = () => {
    navigate("/shipments");
  };

  const goNotifications = () => {
    navigate("/notifications");
  };

  const goProfile = () => {
    navigate("/profile");
  };

  const openSendParcel = () => {
    navigate("/send-parcel");
  };


  return (
    <div className="home-page">

      {/* ==================================================
          TOP HEADER
      ================================================== */}

      <header className="home-header">

        <div className="greeting">

          <h1>
            Hello, {userName} <span className="wave">👋</span>
          </h1>

          <p>
            Where would you like to send today?
          </p>

        </div>

        <button
          className="notification-button"
          onClick={goNotifications}
        >
          <Icon name="bell" size={22} />

          <span className="notification-dot" />
        </button>

      </header>


      {/* ==================================================
          SEARCH / TRACK BAR
      ================================================== */}

      <div className="tracking-search">

        <Icon
          name="search"
          size={20}
          stroke={2}
        />

        <input
          type="text"
          value={trackingNumber}
          onChange={(e) =>
            setTrackingNumber(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleTrack();
            }
          }}
          placeholder="Track a parcel..."
        />

        <div className="search-divider" />

        <button
          className="scan-button"
          onClick={handleTrack}
        >
          <Icon name="scan" size={20} />
        </button>

      </div>


      {/* ==================================================
          PROMOTIONAL BANNER
      ================================================== */}

      <section
        className="promo-banner"
        onClick={sendParcel}
      >

        <div className="promo-text">

          <h2>
            Send parcels
            <br />
            across the country
          </h2>

          <p>
            Quick. Reliable & Affordable
          </p>

        </div>

        <PackageIllustration />

      </section>


      {/* ==================================================
          QUICK ACTIONS
      ================================================== */}

      <section className="quick-actions">

        {/* SEND */}
        <button
          className="quick-action"
          onClick={sendParcel}
        >
          <div className="action-icon blue-icon">
            <Icon name="box" size={28} />
          </div>

          <span>
            Send Parcel
          </span>
        </button>


        {/* TRACK */}
        <button
          className="quick-action"
          onClick={trackParcel}
        >
          <div className="action-icon blue-icon">
            <Icon name="track" size={28} />
          </div>

          <span>
            Track Parcel
          </span>
        </button>


        {/* RATE */}
        <button
          className="quick-action"
          onClick={rateCalculator}
        >
          <div className="action-icon blue-icon">
            <Icon name="calculator" size={28} />
          </div>

          <span>
            Rate Calculator
          </span>
        </button>


        {/* LOCATION */}
        <button
          className="quick-action"
          onClick={findLocation}
        >
          <div className="action-icon blue-icon">
            <Icon name="location" size={28} />
          </div>

          <span>
            Find Location
          </span>
        </button>

      </section>


      {/* ==================================================
          RECENT SHIPMENTS HEADER
      ================================================== */}

      <div className="section-header">

        <h2>
          Recent Shipments
        </h2>

        <button
          onClick={goShipments}
        >
          See all
        </button>

      </div>


      {/* ==================================================
          RECENT SHIPMENT CARD
      ================================================== */}

      <button
        className="recent-shipment"
        onClick={() =>
          navigate(
            `/tracking-details?trackingNumber=${encodeURIComponent(
              recentShipment.trackingNumber
            )}`
          )
        }
      >

        <div className="shipment-icon">
          📦
        </div>


        <div className="shipment-information">

          <strong>
            {recentShipment.trackingNumber}
          </strong>

          <div className="shipment-status">

            <span className="status-icon">
              ✓
            </span>

            <span>
              {recentShipment.status}
            </span>

          </div>

          <div className="shipment-route">

            <span className="route-icon">
              ♟
            </span>

            <span>
              {recentShipment.from}
            </span>

            <span className="route-arrow">
              →
            </span>

            <span>
              {recentShipment.to}
            </span>

          </div>

        </div>


        <div className="shipment-date">
          Aug 7, 2036
        </div>

      </button>


      {/* ==================================================
          BOTTOM NAVIGATION
      ================================================== */}
{/* ==================================================
    BOTTOM NAVIGATION
================================================== */}

<nav
  className="bottom-navigation"
  aria-label="Main navigation"
>

  {/* HOME */}
  <button
    type="button"
    className="bottom-item active"
    onClick={goHome}
  >
    <Icon
      name="home"
      size={21}
    />

    <span>
      Home
    </span>
  </button>


  {/* SHIPMENTS */}
  <button
    type="button"
    className="bottom-item"
    onClick={goShipments}
  >
    <Icon
      name="shipments"
      size={21}
    />

    <span>
      Shipments
    </span>
  </button>


  {/* CENTER PLUS */}
  <button
    type="button"
    className="bottom-plus"
    onClick={openSendParcel}
    aria-label="Send Parcel"
  >
    <Icon
      name="plus"
      size={28}
      stroke={2.5}
    />
  </button>


  {/* NOTIFICATIONS */}
  <button
    type="button"
    className="bottom-item"
    onClick={goNotifications}
  >
    <Icon
      name="bell"
      size={21}
    />

    <span>
      Notifications
    </span>
  </button>


  {/* PROFILE */}
  <button
    type="button"
    className="bottom-item"
    onClick={goProfile}
  >
    <Icon
      name="profile"
      size={21}
    />

    <span>
      Profile
    </span>
  </button>

</nav>

    </div>
  );
}

export default HomeScreen;