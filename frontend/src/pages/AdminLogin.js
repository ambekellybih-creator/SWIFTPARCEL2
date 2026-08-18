import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();

    setError("");

    if (
      username.trim() === "admin" &&
      password === "swiftparcel123"
    ) {
      localStorage.setItem(
        "swiftparcelAdmin",
        "true"
      );

      navigate("/admin");
    } else {
      setError(
        "Incorrect username or password."
      );
    }
  };

  return (
    <div className="admin-login-screen">

      <div className="admin-login-card">

        <div className="admin-login-icon">
          🔐
        </div>

        <h1>Admin Login</h1>

        <p className="admin-login-subtitle">
          Sign in to manage SwiftParcel
        </p>

        <form
          className="admin-login-form"
          onSubmit={handleLogin}
        >

          {/* Username */}

          <div className="admin-login-group">

            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              placeholder="Enter admin username"
              value={username}
              onChange={(event) => {
                setUsername(
                  event.target.value
                );
              }}
              required
            />

          </div>


          {/* Password */}

          <div className="admin-login-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(event) => {
                setPassword(
                  event.target.value
                );
              }}
              required
            />

          </div>


          {/* Error */}

          {error && (
            <p className="admin-login-error">
              {error}
            </p>
          )}


          {/* Login Button */}

          <button
            type="submit"
            className="admin-login-button"
          >
            Login
          </button>

        </form>


        {/* Back Button */}

        <button
          type="button"
          className="admin-login-back"
          onClick={() => {
            navigate("/home");
          }}
        >
          ← Back to SwiftParcel
        </button>

      </div>

    </div>
  );
}

export default AdminLogin;