import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpScreen.css";

function SignUpScreen() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [acceptedTerms, setAcceptedTerms] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================
  // BACKEND
  // ==========================================

  const apiUrl =
    "https://swiftparcel-api-k6i6.onrender.com";

  // ==========================================
  // SIGN UP
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // ==========================================
    // TERMS
    // ==========================================

    if (!acceptedTerms) {
      setError(
        "Please accept the Terms & Conditions."
      );
      return;
    }

    // ==========================================
    // PASSWORD
    // ==========================================

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      console.log(
        "SIGNUP STARTED"
      );

      const response = await fetch(
        `${apiUrl}/api/auth/signup`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fullName:
              fullName.trim(),

            email:
              email.trim().toLowerCase(),

            phone:
              phone.trim(),

            password:
              password,
          }),
        }
      );

      const responseText =
        await response.text();

      console.log(
        "SIGNUP STATUS:",
        response.status
      );

      console.log(
        "SIGNUP RESPONSE:",
        responseText
      );

      let data = {};

      try {
        data = JSON.parse(
          responseText
        );
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
          data.message ||
            "Unable to create account."
        );
      }

      // ==========================================
      // TOKEN CHECK
      // ==========================================

      if (!data.token) {
        throw new Error(
          "Account was created, but no login token was returned."
        );
      }

      // ==========================================
      // CUSTOMER TOKEN
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
      // CUSTOMER INFORMATION
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
        "ACCOUNT CREATED SUCCESSFULLY"
      );

      // ==========================================
      // GO HOME
      // ==========================================

      navigate("/home", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "SIGNUP ERROR:",
        error
      );

      setError(
        error.message ||
          "Unable to create your account."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="signup-screen">

      <div className="signup-container">

        {/* LOGO */}

        <div className="signup-logo">

          <div className="signup-logo-icon">
            <span>📦</span>
          </div>

          <span>
            SwiftParcel
          </span>

        </div>


        {/* HEADING */}

        <div className="signup-heading">

          <h1>
            Create Account
          </h1>

          <p>
            Join SwiftParcel and start
            sending with ease.
          </p>

        </div>


        {/* ERROR */}

        {error && (
          <div
            className="signup-error"
            style={{
              display: "block",
              color: "#b91c1c",
              backgroundColor: "#fee2e2",
              border: "1px solid #fca5a5",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "8px",
              lineHeight: "1.5",
            }}
          >
            {error}
          </div>
        )}


        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="signup-form"
        >

          {/* FULL NAME */}

          <div className="signup-form-group">

            <label htmlFor="fullName">
              Full Name
            </label>

            <input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(event) =>
                setFullName(
                  event.target.value
                )
              }
              disabled={loading}
              required
            />

          </div>


          {/* EMAIL */}

          <div className="signup-form-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              disabled={loading}
              required
            />

          </div>


          {/* PHONE */}

          <div className="signup-form-group">

            <label htmlFor="phone">
              Phone Number
            </label>

            <div className="phone-input-wrapper">

              <span className="country-code">
                🇨🇲 +237
              </span>

              <input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value
                  )
                }
                disabled={loading}
                required
              />

            </div>

          </div>


          {/* PASSWORD */}

          <div className="signup-form-group">

            <label htmlFor="signupPassword">
              Password
            </label>

            <div className="signup-password-wrapper">

              <input
                id="signupPassword"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Create a password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                minLength="6"
                disabled={loading}
                required
              />

              <button
                type="button"
                className="signup-password-toggle"
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

          </div>


          {/* TERMS */}

          <div className="terms-container">

            <input
              id="terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) =>
                setAcceptedTerms(
                  event.target.checked
                )
              }
              disabled={loading}
            />

            <label htmlFor="terms">

              I agree to the{" "}

              <button
                type="button"
                onClick={() =>
                  alert(
                    "Terms & Conditions will be added later."
                  )
                }
                disabled={loading}
              >
                Terms & Conditions
              </button>

            </label>

          </div>


          {/* CREATE ACCOUNT */}

          <button
            type="submit"
            className="create-account-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>


        {/* LOGIN */}

        <p className="already-account">

          Already have an account?{" "}

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
            disabled={loading}
          >
            Login
          </button>

        </p>

      </div>

    </div>
  );
}

export default SignUpScreen;