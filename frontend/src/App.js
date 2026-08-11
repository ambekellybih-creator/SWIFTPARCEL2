import React, { useState } from "react";
import SplashScreen from "./pages/SplashScreen";
import OnboardingScreen from "./pages/OnboardingScreen";
import LoginScreen from "./pages/LoginScreen";
import SignUpScreen from "./pages/SignUpScreen";

function App() {
  const [currentScreen, setCurrentScreen] = useState("splash");

  if (currentScreen === "splash") {
    return (
      <SplashScreen
        onFinish={() => setCurrentScreen("onboarding")}
      />
    );
  }

  if (currentScreen === "onboarding") {
    return (
      <OnboardingScreen
        onGetStarted={() => setCurrentScreen("login")}
      />
    );
  }

  if (currentScreen === "login") {
    return (
      <LoginScreen
        onSignUp={() => setCurrentScreen("signup")}
      />
    );
  }

  if (currentScreen === "signup") {
    return (
      <SignUpScreen
        onLogin={() => setCurrentScreen("login")}
      />
    );
  }

  return null;
}

export default App;