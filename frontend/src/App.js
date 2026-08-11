import React, { useState } from "react";
import SplashScreen from "./pages/SplashScreen";
import OnboardingScreen from "./pages/OnboardingScreen";

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

  return (
    <div>
      <h1>Login Screen Coming Soon</h1>
    </div>
  );
}

export default App;