import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import SplashScreen from "./pages/SplashScreen";
import OnboardingScreen from "./pages/OnboardingScreen";
import LoginScreen from "./pages/LoginScreen";
import SignUpScreen from "./pages/SignUpScreen";
import HomeScreen from "./pages/HomeScreen";
import SendParcel from "./pages/SendParcel";
import Receiver from "./pages/Receiver";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Splash */}
        <Route
          path="/"
          element={<SplashScreen />}
        />

        {/* Onboarding */}
        <Route
          path="/onboarding"
          element={<OnboardingScreen />}
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

        {/* Home */}
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

        {/* Future Parcel Details page */}
        <Route
          path="/parcel-details"
          element={
            <div
              style={{
                padding: "40px",
                textAlign: "center",
              }}
            >
              <h2>Parcel Details</h2>
              <p>
                This page will be built next.
              </p>
            </div>
          }
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={
            <Navigate to="/" replace />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;