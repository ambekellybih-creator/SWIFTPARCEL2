import React, { useState } from "react";
import SplashScreen from "./pages/SplashScreen";
import OnboardingScreen from "./pages/OnboardingScreen";
import LoginScreen from "./pages/LoginScreen";

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

  return (
    <div>
      <h1>Sign Up Screen Coming Soon</h1>
    </div>
  );
}

export default App;