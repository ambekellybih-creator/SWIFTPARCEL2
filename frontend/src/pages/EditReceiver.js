import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

function EditReceiver() {
  const navigate = useNavigate();

  const {
    trackingNumber,
  } = useParams();

  const [receiverName, setReceiverName] =
    useState("");

  const [receiverPhone, setReceiverPhone] =
    useState("");

  const [receiverAddress, setReceiverAddress] =
    useState("");

  const [receiverCity, setReceiverCity] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const apiUrl =
    process.env.REACT_APP_API_URL ||
    "https://swiftparcel-api-k6i6.onrender.com";

  // ====================================================
  // LOAD EXISTING SHIPMENT
  // ====================================================

  useEffect(() => {
    const loadShipment = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${apiUrl}/api/shipments/${encodeURIComponent(
              trackingNumber
            )}`
          );

        const responseText =
          await response.text();

        let data;

        try {
          data =
            JSON.parse(
              responseText
            );
        } catch {
          throw new Error(
            "The server returned an invalid response."
          );
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load shipment."
          );
        }

        if (!data.shipment) {
          throw new Error(
            "Shipment information was not found."
          );
        }

        const shipment =
          data.shipment;

        // ============================================
        // DON'T ALLOW EDITING DELIVERED SHIPMENTS
        // ============================================

        if (
          shipment.status ===
          "Delivered"
        ) {
          setError(
            "This shipment has already been delivered and can no longer be edited."
          );

          setLoading(false);

          return;
        }

        setReceiverName(
          shipment.receiverName || ""
        );

        setReceiverPhone(
          shipment.receiverPhone || ""
        );

        setReceiverAddress(
          shipment.receiverAddress || ""
        );

        setReceiverCity(
          shipment.receiverCity || ""
        );

      } catch (err) {
        console.error(
          "Load shipment error:",
          err
        );

        setError(
          err.message ||
            "Unable to load shipment."
        );
      } finally {
        setLoading(false);
      }
    };

    if (trackingNumber) {
      loadShipment();
    }
  }, [
    trackingNumber,
    apiUrl,
  ]);

  // ====================================================
  // SAVE CHANGES
  // ====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // ================================================
    // VALIDATION
    // ================================================

    if (
      !receiverName.trim() ||
      !receiverPhone.trim() ||
      !receiverAddress.trim() ||
      !receiverCity.trim()
    ) {
      setError(
        "Please fill in all receiver information."
      );

      return;
    }

    try {
      setSaving(true);

      const customerToken =
        localStorage.getItem(
          "swiftparcelCustomerToken"
        ) ||
        localStorage.getItem(
          "swiftparcelToken"
        );

      if (!customerToken) {
        throw new Error(
          "You are not logged in. Please login again."
        );
      }

      // ================================================
      // UPDATE EXISTING SHIPMENT
      // ================================================

      const response =
        await fetch(
          `${apiUrl}/api/shipments/${encodeURIComponent(
            trackingNumber
          )}/receiver`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${customerToken}`,
            },

            body: JSON.stringify({
              receiverName:
                receiverName.trim(),

              receiverPhone:
                receiverPhone.trim(),

              receiverAddress:
                receiverAddress.trim(),

              receiverCity:
                receiverCity.trim(),
            }),
          }
        );

      const responseText =
        await response.text();

      let data;

      try {
        data =
          JSON.parse(
            responseText
          );
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update receiver."
        );
      }

      setSuccess(
        "Receiver information updated successfully!"
      );

      // ================================================
      // GO BACK AFTER SHORT DELAY
      // ================================================

      setTimeout(() => {
        navigate("/shipments");
      }, 1200);

    } catch (err) {
      console.error(
        "Save receiver error:",
        err
      );

      setError(
        err.message ||
          "Failed to update receiver."
      );
    } finally {
      setSaving(false);
    }
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.icon}>
            📦
          </div>

          <h2>
            Loading shipment...
          </h2>

          <p style={styles.muted}>
            Please wait.
          </p>
        </div>
      </div>
    );
  }

  // ====================================================
  // ERROR WITHOUT FORM
  // ====================================================

  if (
    error &&
    !receiverName &&
    !receiverPhone &&
    !receiverAddress &&
    !receiverCity
  ) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.icon}>
            ⚠️
          </div>

          <h2>
            Unable to edit shipment
          </h2>

          <p style={styles.errorText}>
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/shipments")
            }
            style={styles.primaryButton}
          >
            Back to My Shipments
          </button>
        </div>
      </div>
    );
  }

  // ====================================================
  // MAIN
  // ====================================================

  return (
    <div style={styles.page}>

      {/* HEADER */}

      <header style={styles.header}>
        <button
          type="button"
          onClick={() =>
            navigate("/shipments")
          }
          style={styles.backButton}
        >
          ←
        </button>

        <div>
          <p style={styles.brand}>
            SwiftParcel
          </p>

          <h1 style={styles.title}>
            Edit Receiver
          </h1>
        </div>
      </header>

      {/* FORM */}

      <main style={styles.container}>

        <div style={styles.card}>

          <div style={styles.topIcon}>
            👤
          </div>

          <h2 style={styles.heading}>
            Receiver Information
          </h2>

          <p style={styles.muted}>
            Update the receiver details for
            shipment{" "}
            <strong>
              {trackingNumber}
            </strong>
            .
          </p>

          {/* ERROR */}

          {error && (
            <div style={styles.errorBox}>
              ⚠️ {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div style={styles.successBox}>
              ✓ {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
          >

            {/* NAME */}

            <label style={styles.label}>
              Receiver Name
            </label>

            <input
              type="text"
              value={receiverName}
              onChange={(e) =>
                setReceiverName(
                  e.target.value
                )
              }
              placeholder="Enter receiver name"
              style={styles.input}
            />

            {/* PHONE */}

            <label style={styles.label}>
              Receiver Phone
            </label>

            <input
              type="tel"
              value={receiverPhone}
              onChange={(e) =>
                setReceiverPhone(
                  e.target.value
                )
              }
              placeholder="Enter receiver phone"
              style={styles.input}
            />

            {/* ADDRESS */}

            <label style={styles.label}>
              Receiver Address
            </label>

            <input
              type="text"
              value={receiverAddress}
              onChange={(e) =>
                setReceiverAddress(
                  e.target.value
                )
              }
              placeholder="Enter receiver address"
              style={styles.input}
            />

            {/* CITY */}

            <label style={styles.label}>
              Receiver City
            </label>

            <input
              type="text"
              value={receiverCity}
              onChange={(e) =>
                setReceiverCity(
                  e.target.value
                )
              }
              placeholder="e.g. Buea, Limbe, Douala"
              style={styles.input}
            />

            {/* SAVE */}

            <button
              type="submit"
              disabled={saving}
              style={{
                ...styles.primaryButton,
                opacity:
                  saving ? 0.7 : 1,
              }}
            >
              {saving
                ? "Saving Changes..."
                : "Save Changes"}
            </button>

          </form>

          <button
            type="button"
            onClick={() =>
              navigate("/shipments")
            }
            style={styles.cancelButton}
          >
            Cancel
          </button>

        </div>

      </main>
    </div>
  );
}

// ======================================================
// STYLES
// ======================================================

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f6ff",
    fontFamily:
      "Arial, sans-serif",
    paddingBottom: "40px",
  },

  header: {
    background: "white",
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.05)",
  },

  backButton: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "none",
    background: "#f0f0f5",
    fontSize: "22px",
    cursor: "pointer",
  },

  brand: {
    margin: 0,
    color: "#3424e9",
    fontSize: "12px",
    fontWeight: "bold",
  },

  title: {
    margin: "3px 0 0",
    fontSize: "21px",
  },

  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "20px",
    boxShadow:
      "0 5px 25px rgba(0,0,0,0.07)",
  },

  icon: {
    fontSize: "55px",
    textAlign: "center",
  },

  topIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#eef0ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    margin: "0 auto 15px",
  },

  heading: {
    margin:
      "0 0 8px",
    textAlign: "center",
  },

  muted: {
    color: "#777",
    fontSize: "13px",
    lineHeight: "1.5",
    textAlign: "center",
  },

  label: {
    display: "block",
    marginTop: "18px",
    marginBottom: "7px",
    fontSize: "13px",
    fontWeight: "bold",
    color: "#333",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    border:
      "1px solid #ddd",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
  },

  primaryButton: {
    width: "100%",
    marginTop: "25px",
    padding: "15px",
    border: "none",
    borderRadius: "12px",
    background: "#3424e9",
    color: "white",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  cancelButton: {
    width: "100%",
    marginTop: "10px",
    padding: "14px",
    border:
      "1px solid #ddd",
    borderRadius: "12px",
    background: "white",
    color: "#555",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  errorBox: {
    marginTop: "18px",
    padding: "12px",
    borderRadius: "10px",
    background: "#fff0f0",
    color: "#c62828",
    fontSize: "13px",
  },

  successBox: {
    marginTop: "18px",
    padding: "12px",
    borderRadius: "10px",
    background: "#e8f8ed",
    color: "#16833a",
    fontSize: "13px",
  },

  errorText: {
    color: "#c62828",
    lineHeight: "1.5",
    textAlign: "center",
  },
};

export default EditReceiver;