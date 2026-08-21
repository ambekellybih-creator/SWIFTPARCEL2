import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpScreen.css";

function SignUpScreen() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl =
    process.env.REACT_APP_API_URL ||
    "https://swiftparcel-api-k6i6.onrender.com";

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!acceptedTerms) {
      setError(
        "Please accept the Terms & Conditions."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${apiUrl}/api/auth/signup`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fullName,
            email,
            phone,
            password,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "Signup response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to create account."
        );
      }

      // Save customer authentication token
      localStorage.setItem(
        "swiftparcelToken",
        data.token
      );

      // Save customer information
      localStorage.setItem(
        "swiftparcelUser",
        JSON.stringify(data.user)
      );

      alert(
        "Account created successfully!"
      );

      // Go to Home
      navigate("/home");

    } catch (error) {
      console.error(
        "Signup error:",
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

  return (
    <div className="signup-screen">

      <div className="signup-container">

        {/* Logo */}
        <div className="signup-logo">

          <div className="signup-logo-icon">
            <span>📦</span>
          </div>

          <span>
            SwiftParcel
          </span>

        </div>


        {/* Heading */}
        <div className="signup-heading">

          <h1>
            Create Account
          </h1>

          <p>
            Join SwiftParcel and start
            sending with ease.
          </p>

        </div>


        {/* Error */}
        {error && (
          <div className="signup-error">
            {error}
          </div>
        )}


        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="signup-form"
        >

          {/* Full Name */}
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


          {/* Email */}
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


          {/* Phone */}
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


          {/* Password */}
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
                    !showPassword
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


          {/* Terms */}
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


          {/* Create Account */}
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


        {/* Login */}
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