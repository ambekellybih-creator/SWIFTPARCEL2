import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SplashScreen.css";

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen">
      <div className="splash-content">

        <div className="splash-logo">
          <div className="splash-logo-icon">
            <span>📦</span>
          </div>

          <h1>SwiftParcel</h1>
        </div>

        <p className="splash-tagline">
          Send • Track • Receive
        </p>

        <p className="splash-description">
          Your parcels, your priority.
        </p>

      </div>
    </div>
  );
}

export default SplashScreen;