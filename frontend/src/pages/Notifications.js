import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Notifications.css";


// ======================================================
// ICON
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
    case "arrow":
      return (
        <svg {...common}>
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
      );

    case "bell":
      return (
        <svg {...common}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );

    case "box":
      return (
        <svg {...common}>
          <path d="m21 8-9-5-9 5 9 5 9-5Z" />
          <path d="M3 8v8l9 5 9-5V8" />
          <path d="M12 13v8" />
        </svg>
      );

    case "truck":
      return (
        <svg {...common}>
          <path d="M3 6h11v10H3z" />
          <path d="M14 10h4l3 3v3h-7z" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "info":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5" />
          <path d="M12 8h.01" />
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

    default:
      return null;
  }
};


// ======================================================
// NOTIFICATIONS
// ======================================================

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "shipment",
      title: "Parcel picked up",
      message:
        "Your parcel SPC7236491 has been picked up and is now in transit.",
      time: "10 min ago",
      unread: true,
      trackingNumber: "SPC7236491",
    },

    {
      id: 2,
      type: "delivery",
      title: "Parcel on the way",
      message:
        "Your parcel is currently on its way to Yaoundé.",
      time: "1 hour ago",
      unread: true,
      trackingNumber: "SPC7236491",
    },

    {
      id: 3,
      type: "success",
      title: "Shipment created",
      message:
        "Your shipment was successfully created.",
      time: "Yesterday",
      unread: false,
      trackingNumber: "SPC7236491",
    },

    {
      id: 4,
      type: "info",
      title: "Welcome to SwiftParcel",
      message:
        "Thanks for choosing SwiftParcel for your deliveries.",
      time: "2 days ago",
      unread: false,
      trackingNumber: null,
    },
  ]);


  // ======================================================
  // MARK ALL READ
  // ======================================================

  const markAllRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };


  // ======================================================
  // OPEN NOTIFICATION
  // ======================================================

  const openNotification = (notification) => {
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === notification.id
          ? {
              ...item,
              unread: false,
            }
          : item
      )
    );

    if (notification.trackingNumber) {
      navigate(
        `/tracking/${encodeURIComponent(
          notification.trackingNumber
        )}`
      );
    }
  };


  // ======================================================
  // ICON TYPE
  // ======================================================

  const notificationIcon = (type) => {
    if (type === "shipment") {
      return <Icon name="box" size={22} />;
    }

    if (type === "delivery") {
      return <Icon name="truck" size={22} />;
    }

    if (type === "success") {
      return <Icon name="check" size={22} />;
    }

    return <Icon name="info" size={22} />;
  };


  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="notifications-page">

      {/* ================================================
          HEADER
      ================================================ */}

      <header className="notifications-header">

        <button
          type="button"
          className="notifications-back"
          onClick={() => navigate("/home")}
          aria-label="Go back"
        >
          <Icon name="arrow" size={21} />
        </button>


        <h1>
          Notifications
        </h1>


        <button
          type="button"
          className="mark-all-button"
          onClick={markAllRead}
        >
          Mark all
        </button>

      </header>


      {/* ================================================
          CONTENT
      ================================================ */}

      <main className="notifications-content">

        <div className="notifications-title-row">

          <h2>
            Recent
          </h2>

          {notifications.some(
            (notification) => notification.unread
          ) && (
            <span className="new-count">
              {
                notifications.filter(
                  (notification) =>
                    notification.unread
                ).length
              } new
            </span>
          )}

        </div>


        <div className="notification-list">

          {notifications.length === 0 ? (

            <div className="notifications-empty">

              <div className="empty-bell">
                <Icon name="bell" size={30} />
              </div>

              <h2>
                No notifications
              </h2>

              <p>
                You're all caught up.
              </p>

            </div>

          ) : (

            notifications.map((notification) => (

              <button
                type="button"
                key={notification.id}
                className={`notification-card ${
                  notification.unread
                    ? "notification-unread"
                    : ""
                }`}
                onClick={() =>
                  openNotification(notification)
                }
              >

                {/* ICON */}

                <div
                  className={`notification-icon notification-${notification.type}`}
                >
                  {notificationIcon(
                    notification.type
                  )}
                </div>


                {/* INFORMATION */}

                <div className="notification-info">

                  <div className="notification-heading">

                    <h3>
                      {notification.title}
                    </h3>

                    {notification.unread && (
                      <span className="notification-new-dot" />
                    )}

                  </div>


                  <p>
                    {notification.message}
                  </p>


                  <span className="notification-time">
                    {notification.time}
                  </span>

                </div>

              </button>

            ))

          )}

        </div>

      </main>


      {/* ================================================
          BOTTOM NAVIGATION
      ================================================ */}

      <nav className="notifications-navigation">

        {/* HOME */}

        <button
          type="button"
          className="notification-nav-item"
          onClick={() => navigate("/home")}
        >
          <Icon name="home" size={21} />

          <span>
            Home
          </span>
        </button>


        {/* SHIPMENTS */}

        <button
          type="button"
          className="notification-nav-item"
          onClick={() => navigate("/shipments")}
        >
          <Icon name="shipments" size={21} />

          <span>
            Shipments
          </span>
        </button>


        {/* PLUS */}

        <button
          type="button"
          className="notification-plus"
          onClick={() => navigate("/send-parcel")}
          aria-label="Send parcel"
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
          className="notification-nav-item notification-nav-active"
        >
          <Icon name="bell" size={21} />

          <span>
            Notifications
          </span>
        </button>


        {/* PROFILE */}

        <button
          type="button"
          className="notification-nav-item"
          onClick={() => navigate("/profile")}
        >
          <Icon name="profile" size={21} />

          <span>
            Profile
          </span>
        </button>

      </nav>

    </div>
  );
}

export default Notifications;