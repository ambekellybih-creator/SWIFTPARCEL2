import React, { useState } from "react";
import SplashScreen from "./pages/SplashScreen";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div>
      <h1>Welcome to SwiftParcel</h1>
      <p>The next screen will be built here.</p>
    </div>
  );
}

export default App;