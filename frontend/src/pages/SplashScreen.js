import React, { useEffect } from "react";
import "./SplashScreen.css";

function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-screen">
      <div className="splash-content">

        <div className="logo-container">
          <div className="parcel-logo">
            <div className="parcel-top"></div>
            <div className="parcel-body"></div>
            <div className="parcel-tape"></div>
          </div>
        </div>

        <h1>SwiftParcel</h1>

        <p className="splash-subtitle">
          Send • Track • Receive
        </p>

      </div>

      <p className="splash-tagline">
        Your parcels, your priority.
      </p>
    </div>
  );
}

export default SplashScreen;