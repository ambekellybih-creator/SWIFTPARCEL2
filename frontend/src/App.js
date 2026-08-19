import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import SplashScreen from "./pages/SplashScreen";
import LoginScreen from "./pages/LoginScreen";
import SignUpScreen from "./pages/SignUpScreen";
import HomeScreen from "./pages/HomeScreen";
import ParcelDetails from "./pages/ParcelDetails";
import ConfirmShipment from "./pages/ConfirmShipment";
import Shipments from "./pages/Shipments";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* SPLASH */}
        <Route
          path="/"
          element={
            <SplashScreen />
          }
        />


        {/* LOGIN */}
        <Route
          path="/login"
          element={
            <LoginScreen />
          }
        />


        {/* SIGN UP */}
        <Route
          path="/signup"
          element={
            <SignUpScreen />
          }
        />


        {/* HOME */}
        <Route
          path="/home"
          element={
            <HomeScreen />
          }
        />


        {/* SEND PARCEL */}
        <Route
          path="/send-parcel"
          element={
            <ParcelDetails />
          }
        />


        {/* CONFIRM SHIPMENT */}
        <Route
          path="/confirm-shipment"
          element={
            <ConfirmShipment />
          }
        />


        {/* SHIPMENTS */}
        <Route
          path="/shipments"
          element={
            <Shipments />
          }
        />


        {/* ADMIN LOGIN */}
        <Route
          path="/admin-login"
          element={
            <AdminLogin />
          }
        />


        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            <AdminDashboard />
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;