import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import SplashScreen from "./pages/SplashScreen";
import LoginScreen from "./pages/LoginScreen";
import SignUpScreen from "./pages/SignUpScreen";
import HomeScreen from "./pages/HomeScreen";
import SendParcel from "./pages/SendParcel";
import Receiver from "./pages/Receiver";
import ParcelDetails from "./pages/ParcelDetails";
import ConfirmShipment from "./pages/ConfirmShipment";
import PaymentScreen from "./pages/PaymentScreen";
import Shipments from "./pages/Shipments";
import AdminDashboard from "./pages/AdminDashboard";
import TrackingDetails from "./pages/TrackingDetails";

function TrackingTest() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5ff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "#3424e9" }}>
        SwiftParcel
      </h1>

      <h2>
        🗺️ TRACKING ROUTE IS WORKING
      </h2>

      <p>
        React successfully opened the tracking route.
      </p>

      <button
        onClick={() => navigate("/home")}
        style={{
          background: "#3424e9",
          color: "white",
          border: "none",
          padding: "14px 30px",
          borderRadius: "10px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Back to Home
      </button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<SplashScreen />}
        />

        <Route
          path="/login"
          element={<LoginScreen />}
        />

        <Route
          path="/signup"
          element={<SignUpScreen />}
        />

        <Route
          path="/home"
          element={<HomeScreen />}
        />

        <Route
          path="/send-parcel"
          element={<SendParcel />}
        />

        <Route
          path="/receiver"
          element={<Receiver />}
        />

        <Route
          path="/parcel-details"
          element={<ParcelDetails />}
        />

        <Route
          path="/confirm-shipment"
          element={<ConfirmShipment />}
        />

        <Route
          path="/payment"
          element={<PaymentScreen />}
        />

        <Route
          path="/shipments"
          element={<Shipments />}
        />

        {/* TEMPORARY TEST ROUTE */}
        <Route
          path="/tracking-test"
          element={<TrackingTest />}
        />

        {/* REAL TRACKING ROUTE */}
        <Route
          path="/tracking/:trackingNumber"
          element={<TrackingDetails />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;