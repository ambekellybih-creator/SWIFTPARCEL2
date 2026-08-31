import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginScreen.css";

function LoginScreen() {
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // BACKEND
  // ==========================================

const apiUrl = "https://swiftparcel-api-k6i6.onrender.com";
  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${apiUrl}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            emailOrPhone: emailOrPhone.trim(),
            password: password,
          }),
        }
      );

      const responseText =
        await response.text();

      console.log(
        "LOGIN STATUS:",
        response.status
      );

      console.log(
        "LOGIN RESPONSE:",
        responseText
      );

      let data = {};

      try {
        data = JSON.parse(responseText);
      } catch (error) {
        throw new Error(
          responseText ||
            "The server returned an invalid response."
        );
      }

      // ==========================================
      // SERVER ERROR
      // ==========================================

      if (!response.ok) {
  throw new Error(
    `SERVER ERROR ${response.status}: ${
      data.message ||
      data.error ||
      responseText ||
      "Unknown server error"
    }`
  );
}

      // ==========================================
      // TOKEN CHECK
      // ==========================================

      if (!data.token) {
        throw new Error(
          "Login succeeded, but no authentication token was returned."
        );
      }

      // ==========================================
      // ADMIN LOGIN
      // ==========================================

      if (data.role === "admin") {
        console.log("ADMIN LOGIN");

        localStorage.setItem(
          "swiftparcelAdminToken",
          data.token
        );

        localStorage.setItem(
          "swiftparcelAdmin",
          JSON.stringify(
            data.admin || {
              email: "adminswift@gmail.com",
              role: "admin",
            }
          )
        );

        // Remove customer authentication
        localStorage.removeItem(
          "swiftparcelCustomerToken"
        );

        localStorage.removeItem(
          "swiftparcelToken"
        );

        localStorage.removeItem(
          "swiftparcelCustomer"
        );

        localStorage.removeItem(
          "swiftparcelUser"
        );

        navigate("/admin", {
          replace: true,
        });

        return;
      }

      // ==========================================
      // CUSTOMER LOGIN
      // ==========================================

      if (data.role !== "customer") {
        throw new Error(
          "Invalid account type."
        );
      }

      console.log("CUSTOMER LOGIN");

      // ==========================================
      // SAVE CUSTOMER TOKEN
      // ==========================================

      localStorage.setItem(
        "swiftparcelCustomerToken",
        data.token
      );

      localStorage.setItem(
        "swiftparcelToken",
        data.token
      );

      // ==========================================
      // SAVE CUSTOMER INFORMATION
      // ==========================================

      if (data.user) {
        localStorage.setItem(
          "swiftparcelCustomer",
          JSON.stringify(data.user)
        );

        localStorage.setItem(
          "swiftparcelUser",
          JSON.stringify(data.user)
        );
      }

      // ==========================================
      // REMOVE ADMIN AUTHENTICATION
      // ==========================================

      localStorage.removeItem(
        "swiftparcelAdminToken"
      );

      localStorage.removeItem(
        "swiftparcelAdmin"
      );

      console.log(
        "Customer login successful."
      );

      // ==========================================
      // GO HOME
      // ==========================================

      navigate("/home", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      setError(
        error.message ||
          "Unable to login. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="login-screen">

      <div className="login-container">

        {/* LOGO */}

        <div className="login-logo">

          <div className="login-logo-icon">
            <span>📦</span>
          </div>

          <span>
            SwiftParcel
          </span>

        </div>


        {/* TABS */}

        <div className="auth-tabs">

          <button
            type="button"
            className="auth-tab active"
          >
            Login
          </button>

          <button
            type="button"
            className="auth-tab"
            onClick={() =>
              navigate("/signup")
            }
          >
            Sign Up
          </button>

        </div>


        {/* LOGIN FORM */}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          {/* EMAIL / PHONE */}

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
                setEmailOrPhone(
                  event.target.value
                )
              }
              autoComplete="username"
              disabled={loading}
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <div className="password-wrapper">

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                autoComplete="current-password"
                disabled={loading}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    (previous) =>
                      !previous
                  )
                }
                disabled={loading}
              >
                {showPassword
                  ? "◉"
                  : "◌"}
              </button>

            </div>


            {/* FORGOT PASSWORD */}

            <button
              type="button"
              className="forgot-password"
              onClick={() =>
                alert(
                  "Password recovery will be added later."
                )
              }
              disabled={loading}
            >
              Forgot password?
            </button>

          </div>


          {/* ERROR */}

          {error && (
            <div
              className="login-error"
              style={{
                display: "block",
                color: "#dc2626",
                background: "#fee2e2",
                padding: "12px",
                marginBottom: "15px",
                borderRadius: "8px",
              }}
            >
              {error}
            </div>
          )}


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        {/* DIVIDER */}

        <div className="or-divider">

          <span></span>

          <p>
            or continue with
          </p>

          <span></span>

        </div>


        {/* SOCIAL BUTTONS */}

        <div className="social-buttons">

          <button
            type="button"
            className="social-button"
            onClick={() =>
              alert(
                "Google login will be connected later."
              )
            }
            disabled={loading}
          >
            <span className="google-icon">
              G
            </span>

            Google
          </button>


          <button
            type="button"
            className="social-button"
            onClick={() =>
              alert(
                "Apple login will be connected later."
              )
            }
            disabled={loading}
          >
            <span className="apple-icon">
              ●
            </span>

            Apple
          </button>

        </div>


        {/* SIGN UP */}

        <p className="signup-text">

          Don't have an account?{" "}

          <button
            type="button"
            onClick={() =>
              navigate("/signup")
            }
            disabled={loading}
          >
            Sign Up
          </button>

        </p>

      </div>

    </div>
  );
}

export default LoginScreen;