import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const apiUrl =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";


  const handleLogin = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    if (
      !username.trim() ||
      !password
    ) {
      setError(
        "Please enter your username and password."
      );

      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          `${apiUrl}/api/admin/login`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              username:
                username.trim(),

              password:
                password,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Login failed."
        );
      }

      localStorage.setItem(
        "swiftparcelAdminToken",
        data.token
      );

      localStorage.setItem(
        "swiftparcelAdmin",
        "true"
      );

      localStorage.setItem(
        "swiftparcelAdminUsername",
        data.admin.username
      );

      navigate("/admin", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Admin login error:",
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


  return (
    <div className="admin-login-screen">

      <div className="admin-login-card">

        <div className="admin-login-icon">
          🔐
        </div>

        <h1>
          Admin Login
        </h1>

        <p className="admin-login-subtitle">
          Sign in to manage SwiftParcel
        </p>


        <form
          className="admin-login-form"
          onSubmit={
            handleLogin
          }
        >

          <div className="admin-login-group">

            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              placeholder="Enter admin username"
              value={username}
              onChange={(
                event
              ) =>
                setUsername(
                  event.target.value
                )
              }
              disabled={loading}
              required
            />

          </div>


          <div className="admin-login-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(
                event
              ) =>
                setPassword(
                  event.target.value
                )
              }
              disabled={loading}
              required
            />

          </div>


          {error && (
            <p className="admin-login-error">
              {error}
            </p>
          )}


          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Login"}
          </button>

        </form>


        <button
          type="button"
          className="admin-login-back"
          onClick={() =>
            navigate("/home")
          }
          disabled={loading}
        >
          ← Back to SwiftParcel
        </button>

      </div>

    </div>
  );
}

export default AdminLogin;