import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditShipment.css";

function EditShipment() {
  const navigate = useNavigate();
  const { trackingNumber } = useParams();

  const apiUrl =
    "https://swiftparcel-api-k6i6.onrender.com";

  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    senderName: "",
    senderPhone: "",
    senderAddress: "",
    senderCity: "",

    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
    receiverCity: "",

    parcelType: "",
    weight: "",
    deliveryDate: "",
  });

  // ==================================================
  // GET CUSTOMER TOKEN
  // ==================================================

  const getToken = () => {
    return (
      localStorage.getItem(
        "swiftparcelCustomerToken"
      ) ||
      localStorage.getItem(
        "swiftparcelToken"
      )
    );
  };

  // ==================================================
  // LOAD SHIPMENT
  // ==================================================

  useEffect(() => {
    const loadShipment = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          throw new Error(
            "You are not logged in. Please login again."
          );
        }

        if (!trackingNumber) {
          throw new Error(
            "No tracking number was provided."
          );
        }

        const response = await fetch(
          `${apiUrl}/api/shipments/${encodeURIComponent(
            trackingNumber
          )}`,
          {
            method: "GET",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const responseText =
          await response.text();

        console.log(
          "Shipment response:",
          responseText
        );

        if (!response.ok) {
          throw new Error(
            `Server returned ${response.status}: ${responseText}`
          );
        }

        let data;

        try {
          data =
            JSON.parse(responseText);
        } catch {
          throw new Error(
            "The server returned an invalid response."
          );
        }

        const loadedShipment =
          data.shipment;

        if (!loadedShipment) {
          throw new Error(
            "Shipment information could not be found."
          );
        }

        setShipment(
          loadedShipment
        );

        // ==============================================
        // FORMAT DELIVERY DATE FOR INPUT
        // ==============================================

        let formattedDate = "";

        if (
          loadedShipment.deliveryDate
        ) {
          formattedDate =
            new Date(
              loadedShipment.deliveryDate
            )
              .toISOString()
              .split("T")[0];
        }

        // ==============================================
        // FILL FORM
        // ==============================================

        setFormData({
          senderName:
            loadedShipment.senderName ||
            "",

          senderPhone:
            loadedShipment.senderPhone ||
            "",

          senderAddress:
            loadedShipment.senderAddress ||
            "",

          senderCity:
            loadedShipment.senderCity ||
            "",

          receiverName:
            loadedShipment.receiverName ||
            "",

          receiverPhone:
            loadedShipment.receiverPhone ||
            "",

          receiverAddress:
            loadedShipment.receiverAddress ||
            "",

          receiverCity:
            loadedShipment.receiverCity ||
            "",

          parcelType:
            loadedShipment.parcelType ||
            "",

          weight:
            loadedShipment.weight ||
            "",

          deliveryDate:
            formattedDate,
        });

      } catch (error) {

        console.error(
          "Load shipment error:",
          error
        );

        setError(
          error.message ||
            "Unable to load shipment."
        );

      } finally {
        setLoading(false);
      }
    };

    loadShipment();
  }, [trackingNumber]);

  // ==================================================
  // HANDLE INPUT
  // ==================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  // ==================================================
  // SAVE SHIPMENT
  // ==================================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    try {

      setSaving(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "You are not logged in. Please login again."
        );
      }

      // ==============================================
      // VALIDATION
      // ==============================================

      const requiredFields = [
        "senderName",
        "senderPhone",
        "senderAddress",
        "senderCity",

        "receiverName",
        "receiverPhone",
        "receiverAddress",
        "receiverCity",

        "parcelType",
        "weight",
        "deliveryDate",
      ];

      for (
        const field of requiredFields
      ) {

        if (
          !String(
            formData[field] || ""
          ).trim()
        ) {

          throw new Error(
            "Please fill in all shipment information."
          );
        }
      }

      // ==============================================
      // PREPARE DATA
      // ==============================================

      const updatedShipment = {
        senderName:
          formData.senderName.trim(),

        senderPhone:
          formData.senderPhone.trim(),

        senderAddress:
          formData.senderAddress.trim(),

        senderCity:
          formData.senderCity.trim(),

        receiverName:
          formData.receiverName.trim(),

        receiverPhone:
          formData.receiverPhone.trim(),

        receiverAddress:
          formData.receiverAddress.trim(),

        receiverCity:
          formData.receiverCity.trim(),

        parcelType:
          formData.parcelType.trim(),

        weight:
          Number(formData.weight),

        deliveryDate:
          formData.deliveryDate,
      };

      if (
        Number.isNaN(
          updatedShipment.weight
        ) ||
        updatedShipment.weight <= 0
      ) {
        throw new Error(
          "Please enter a valid parcel weight."
        );
      }

      // ==============================================
      // UPDATE
      // ==============================================

      const response = await fetch(
        `${apiUrl}/api/shipments/${encodeURIComponent(
          trackingNumber
        )}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body:
            JSON.stringify(
              updatedShipment
            ),
        }
      );

      const responseText =
        await response.text();

      console.log(
        "Update status:",
        response.status
      );

      console.log(
        "Update response:",
        responseText
      );

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}: ${responseText}`
        );
      }

      let data;

      try {
        data =
          JSON.parse(responseText);
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      console.log(
        "Updated shipment:",
        data
      );

      alert(
        "Shipment updated successfully!"
      );

      navigate("/shipments");

    } catch (error) {

      console.error(
        "Save shipment error:",
        error
      );

      setError(
        error.message ||
          "Failed to update shipment."
      );

    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="edit-shipment-screen">

        <header className="edit-shipment-header">

          <button
            type="button"
            onClick={() =>
              navigate("/shipments")
            }
          >
            ←
          </button>

          <h1>
            Edit Shipment
          </h1>

          <div></div>

        </header>

        <main className="edit-shipment-content">

          <div className="edit-shipment-message">

            <div>
              📦
            </div>

            <h2>
              Loading shipment...
            </h2>

            <p>
              Please wait.
            </p>

          </div>

        </main>

      </div>
    );
  }

  // ==================================================
  // ERROR / SHIPMENT NOT FOUND
  // ==================================================

  if (error && !shipment) {
    return (
      <div className="edit-shipment-screen">

        <header className="edit-shipment-header">

          <button
            type="button"
            onClick={() =>
              navigate("/shipments")
            }
          >
            ←
          </button>

          <h1>
            Edit Shipment
          </h1>

          <div></div>

        </header>

        <main className="edit-shipment-content">

          <div className="edit-shipment-message">

            <div>
              ⚠️
            </div>

            <h2>
              Unable to load shipment
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              className="edit-back-button"
              onClick={() =>
                navigate("/shipments")
              }
            >
              Back to My Shipments
            </button>

          </div>

        </main>

      </div>
    );
  }

  // ==================================================
  // MAIN PAGE
  // ==================================================

  return (
    <div className="edit-shipment-screen">

      {/* ================================================
          HEADER
      ================================================= */}

      <header className="edit-shipment-header">

        <button
          type="button"
          onClick={() =>
            navigate("/shipments")
          }
        >
          ←
        </button>

        <h1>
          Edit Shipment
        </h1>

        <div></div>

      </header>

      {/* ================================================
          CONTENT
      ================================================= */}

      <main className="edit-shipment-content">

        <div className="edit-shipment-title">

          <h2>
            Shipment Details
          </h2>

          <p>
            Update your shipment information below.
          </p>

          <div className="tracking-number-box">

            <span>
              TRACKING NUMBER
            </span>

            <strong>
              {shipment.trackingNumber}
            </strong>

          </div>

        </div>

        {/* ================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="edit-shipment-error">
            ⚠️ {error}
          </div>
        )}

        <form
          className="edit-shipment-form"
          onSubmit={handleSubmit}
        >

          {/* ==============================================
              SENDER
          =============================================== */}

          <section className="edit-section">

            <div className="edit-section-title">

              <span>
                📤
              </span>

              <div>

                <h3>
                  Sender Information
                </h3>

                <p>
                  Where the parcel is coming from.
                </p>

              </div>

            </div>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Sender Name
                </label>

                <input
                  type="text"
                  name="senderName"
                  value={
                    formData.senderName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter sender name"
                />

              </div>

              <div className="form-group">

                <label>
                  Sender Phone
                </label>

                <input
                  type="tel"
                  name="senderPhone"
                  value={
                    formData.senderPhone
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter sender phone"
                />

              </div>

              <div className="form-group full-width">

                <label>
                  Sender Address
                </label>

                <input
                  type="text"
                  name="senderAddress"
                  value={
                    formData.senderAddress
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter sender address"
                />

              </div>

              <div className="form-group">

                <label>
                  Sender City
                </label>

                <input
                  type="text"
                  name="senderCity"
                  value={
                    formData.senderCity
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter sender city"
                />

              </div>

            </div>

          </section>

          {/* ==============================================
              RECEIVER
          =============================================== */}

          <section className="edit-section">

            <div className="edit-section-title">

              <span>
                📥
              </span>

              <div>

                <h3>
                  Receiver Information
                </h3>

                <p>
                  Where the parcel is going.
                </p>

              </div>

            </div>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Receiver Name
                </label>

                <input
                  type="text"
                  name="receiverName"
                  value={
                    formData.receiverName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter receiver name"
                />

              </div>

              <div className="form-group">

                <label>
                  Receiver Phone
                </label>

                <input
                  type="tel"
                  name="receiverPhone"
                  value={
                    formData.receiverPhone
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter receiver phone"
                />

              </div>

              <div className="form-group full-width">

                <label>
                  Receiver Address
                </label>

                <input
                  type="text"
                  name="receiverAddress"
                  value={
                    formData.receiverAddress
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter receiver address"
                />

              </div>

              <div className="form-group">

                <label>
                  Receiver City
                </label>

                <input
                  type="text"
                  name="receiverCity"
                  value={
                    formData.receiverCity
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter receiver city"
                />

              </div>

            </div>

          </section>

          {/* ==============================================
              PARCEL
          =============================================== */}

          <section className="edit-section">

            <div className="edit-section-title">

              <span>
                📦
              </span>

              <div>

                <h3>
                  Parcel Information
                </h3>

                <p>
                  Details about your parcel.
                </p>

              </div>

            </div>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Parcel Type
                </label>

                <input
                  type="text"
                  name="parcelType"
                  value={
                    formData.parcelType
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="e.g. Electronics"
                />

              </div>

              <div className="form-group">

                <label>
                  Weight (kg)
                </label>

                <input
                  type="number"
                  name="weight"
                  value={
                    formData.weight
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="e.g. 2.5"
                  min="0.1"
                  step="0.1"
                />

              </div>

              <div className="form-group">

                <label>
                  Delivery Date
                </label>

                <input
                  type="date"
                  name="deliveryDate"
                  value={
                    formData.deliveryDate
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

            </div>

          </section>

          {/* ==============================================
              CURRENT STATUS
          =============================================== */}

          <div className="current-status-box">

            <span>
              CURRENT STATUS
            </span>

            <strong>
              {shipment.status ||
                "Pending"}
            </strong>

            <p>
              Shipment status can only be
              changed by the administrator.
            </p>

          </div>

          {/* ==============================================
              BUTTONS
          =============================================== */}

          <div className="edit-shipment-actions">

            <button
              type="button"
              className="cancel-edit-button"
              onClick={() =>
                navigate("/shipments")
              }
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-shipment-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default EditShipment;