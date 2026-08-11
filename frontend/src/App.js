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
import ParcelDetails from "./pages/ParcelDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Splash Screen */}
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

        {/* Send Parcel - Step 1 */}
        <Route
          path="/send-parcel"
          element={<SendParcel />}
        />

        {/* Receiver - Step 2 */}
        <Route
          path="/receiver"
          element={<Receiver />}
        />

        {/* Parcel Details - Step 3 */}
        <Route
          path="/parcel-details"
          element={<ParcelDetails />}
        />

        {/* Unknown Page */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;