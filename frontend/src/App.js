import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Splash Screen */}
        <Route
          path="/"
          element={<SplashScreen />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<LoginScreen />}
        />

        {/* Sign Up */}
        <Route
          path="/signup"
          element={<SignUpScreen />}
        />

        {/* Customer Home */}
        <Route
          path="/home"
          element={<HomeScreen />}
        />

        {/* Send Parcel */}
        <Route
          path="/send-parcel"
          element={<SendParcel />}
        />

        {/* Receiver */}
        <Route
          path="/receiver"
          element={<Receiver />}
        />

        {/* Parcel Details */}
        <Route
          path="/parcel-details"
          element={<ParcelDetails />}
        />

        {/* Confirm Shipment */}
        <Route
          path="/confirm-shipment"
          element={<ConfirmShipment />}
        />

        {/* Payment */}
        <Route
          path="/payment"
          element={<PaymentScreen />}
        />

        {/* Customer Shipments */}
        <Route
          path="/shipments"
          element={<Shipments />}
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;