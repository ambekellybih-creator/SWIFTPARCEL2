import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginScreen.css";

function LoginScreen() {
const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Login information:", {
      emailOrPhone,
      password,
    });

    alert("Login UI works. Real authentication will be connected later.");

navigate("/home");
  };

  return (
    <div className="login-screen">
      <div className="login-container">

        {/* SwiftParcel Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <span>📦</span>
          </div>
          <span>SwiftParcel</span>
        </div>

        {/* Login / Sign Up Tabs */}
        <div className="auth-tabs">
          <button className="auth-tab active">
            Login
          </button>

          <button
            className="auth-tab"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">

          {/* Email / Phone */}
          <div className="form-group">
            <label htmlFor="emailOrPhone">
              Email or Phone
            </label>

            <input
              id="emailOrPhone"
              type="text"
              placeholder="Enter your email or phone"
              value={emailOrPhone}
              onChange={(event) =>
                setEmailOrPhone(event.target.value)
              }
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label="Show or hide password"
              >
                {showPassword ? "◉" : "◌"}
              </button>
            </div>

            <button
              type="button"
              className="forgot-password"
              onClick={() =>
                alert("Password recovery will be added later.")
              }
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>

        </form>

        {/* Divider */}
        <div className="or-divider">
          <span></span>
          <p>or continue with</p>
          <span></span>
        </div>

        {/* Social Login */}
        <div className="social-buttons">

          <button
            type="button"
            className="social-button"
            onClick={() =>
              alert("Google login will be connected later.")
            }
          >
            <span className="google-icon">G</span>
            Google
          </button>

          <button
            type="button"
            className="social-button"
            onClick={() =>
              alert("Apple login will be connected later.")
            }
          >
            <span className="apple-icon">●</span>
            Apple
          </button>

        </div>

        {/* Sign Up */}
        <p className="signup-text">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </p>

      </div>
    </div>
  );
}

export default LoginScreen;