import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SplashScreen from "./pages/SplashScreen";
import OnboardingScreen from "./pages/OnboardingScreen";
import LoginScreen from "./pages/LoginScreen";
import SignUpScreen from "./pages/SignUpScreen";
import HomeScreen from "./pages/HomeScreen";
import SendParcel from "./pages/SendParcel";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Splash */}
        <Route path="/" element={<SplashScreen />} />

        {/* Onboarding */}
        <Route
          path="/onboarding"
          element={<OnboardingScreen />}
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<LoginScreen />}
        />

        <Route
          path="/signup"
          element={<SignUpScreen />}
        />

        {/* Home */}
        <Route
          path="/home"
          element={<HomeScreen />}
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
<Route
  path="/send-parcel"
  element={<SendParcel />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;