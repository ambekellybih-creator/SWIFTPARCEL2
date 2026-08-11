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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!acceptedTerms) {
      alert("Please accept the Terms & Conditions.");
      return;
    }

    console.log("Registration information:", {
      fullName,
      email,
      phone,
      password,
    });

    alert(
      "Account created successfully. Real registration will be connected to the backend later."
    );

    navigate("/home");
  };

  return (
    <div className="signup-screen">
      <div className="signup-container">

        {/* Logo */}
        <div className="signup-logo">
          <div className="signup-logo-icon">
            <span>📦</span>
          </div>
          <span>SwiftParcel</span>
        </div>

        {/* Heading */}
        <div className="signup-heading">
          <h1>Create Account</h1>
          <p>Join SwiftParcel and start sending with ease.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="signup-form">

          {/* Full Name */}
          <div className="signup-form-group">
            <label htmlFor="fullName">Full Name</label>

            <input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="signup-form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          {/* Phone */}
          <div className="signup-form-group">
            <label htmlFor="phone">Phone Number</label>

            <div className="phone-input-wrapper">
              <span className="country-code">
                🇨🇲 +237
              </span>

              <input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="signup-form-group">
            <label htmlFor="signupPassword">Password</label>

            <div className="signup-password-wrapper">
              <input
                id="signupPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength="6"
                required
              />

              <button
                type="button"
                className="signup-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "◉" : "◌"}
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
                setAcceptedTerms(event.target.checked)
              }
            />

            <label htmlFor="terms">
              I agree to the{" "}
              <button
                type="button"
                onClick={() =>
                  alert("Terms & Conditions will be added later.")
                }
              >
                Terms & Conditions
              </button>
            </label>
          </div>

          {/* Create Account */}
          <button
            type="submit"
            className="create-account-button"
          >
            Create Account
          </button>

        </form>

        {/* Login */}
        <p className="already-account">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
}

export default SignUpScreen;