import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import SplashScreen from "./pages/SplashScreen";
import OnboardingScreen from "./pages/OnboardingScreen";
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
import EditReceiver from "./pages/EditReceiver";
import EditShipment from "./pages/EditShipment";
import RateCalculator from "./pages/RateCalculator";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import HelpSupport from "./pages/HelpSupport";
import About from "./pages/About";


// ======================================================
// TRACKING ROUTE TEST
// ======================================================

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
        type="button"
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


// ======================================================
// APP
// ======================================================

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==================================================
            START
        ================================================== */}

        <Route
          path="/"
          element={<SplashScreen />}
        />


        {/* ==================================================
            ONBOARDING
        ================================================== */}

        <Route
          path="/onboarding"
          element={<OnboardingScreen />}
        />


        {/* ==================================================
            AUTHENTICATION
        ================================================== */}

        <Route
          path="/login"
          element={<LoginScreen />}
        />

        <Route
          path="/signup"
          element={<SignUpScreen />}
        />


        {/* ==================================================
            HOME
        ================================================== */}

        <Route
          path="/home"
          element={<HomeScreen />}
        />


        {/* ==================================================
            SEND PARCEL
        ================================================== */}

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


        {/* ==================================================
            SHIPMENTS
        ================================================== */}

        <Route
          path="/shipments"
          element={<Shipments />}
        />


        {/* ==================================================
            TRACKING TEST
        ================================================== */}

        <Route
          path="/tracking-test"
          element={<TrackingTest />}
        />


        {/* ==================================================
            REAL TRACKING
            IMPORTANT:
            trackingNumber comes from the URL.
            
            Example:
            /tracking/SP123456789
        ================================================== */}

        <Route
          path="/tracking/:trackingNumber"
          element={<TrackingDetails />}
        />


        {/* ==================================================
            ADMIN
        ================================================== */}

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />


        {/* ==================================================
            FALLBACK
            If someone opens an unknown URL, send them home.
        ================================================== */}

        <Route
          path="*"
          element={<HomeScreen />}
        />

<Route
  path="/edit-receiver/:trackingNumber"
  element={<EditReceiver />}
/>

<Route
  path="/edit-shipment/:trackingNumber"
  element={<EditShipment />}
/>

<Route
  path="/rate-calculator"
  element={<RateCalculator />}
/>
<Route
  path="/notifications"
  element={<Notifications />}
/>

<Route path="/profile" element={<Profile />} />
      

      <Route path="/profile" element={<Profile />} />
<Route path="/edit-profile" element={<EditProfile />} />

<Route path="/change-password" element={<ChangePassword />} />
<Route path="/help-support" element={<HelpSupport />} />
<Route path="/about" element={<About />} />
</Routes>
    </BrowserRouter>
  );
}

export default App;