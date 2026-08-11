import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomeScreen.css";

function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="home-screen">

      {/* ================= HEADER ================= */}

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
            alert("Notifications will be available soon.");
          }}
        >
          🔔
        </button>

      </header>


      {/* ================= TRACKING CARD ================= */}

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
            />

            <button
              type="button"
              onClick={() => {
                alert(
                  "Parcel tracking will be connected next."
                );
              }}
            >
              Track
            </button>

          </div>

        </div>

      </section>


      {/* ================= QUICK ACTIONS ================= */}

      <section className="home-section">

        <div className="section-heading">

          <h2>
            Quick Actions
          </h2>

        </div>


        <div className="quick-actions">

          {/* SEND PARCEL */}

          <button
            className="action-card"
            type="button"
            onClick={() => navigate("/send-parcel")}
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


          {/* TRACK PARCEL */}

          <button
            className="action-card"
            type="button"
            onClick={() => {
              alert(
                "Track Parcel will be built next."
              );
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


      {/* ================= RECENT SHIPMENTS ================= */}

      <section className="home-section">

        <div className="section-heading">

          <h2>
            Recent Shipments
          </h2>

          <button
            type="button"
            onClick={() => {
              alert(
                "Your shipments will appear here."
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
            onClick={() => navigate("/send-parcel")}
          >
            Send your first parcel
          </button>

        </div>

      </section>


      {/* ================= BOTTOM NAVIGATION ================= */}

      <nav className="bottom-navigation">

        {/* HOME */}

        <button
          className="bottom-nav-item active"
          type="button"
          onClick={() => navigate("/home")}
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


        {/* TRACK */}

        <button
          className="bottom-nav-item"
          type="button"
          onClick={() => {
            alert(
              "Tracking page will be built soon."
            );
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