import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ParcelDetails.css";

function ParcelDetails() {
  const navigate = useNavigate();

  const [parcelType, setParcelType] = useState("");
  const [weight, setWeight] = useState("");
  const [packageSize, setPackageSize] = useState("");
  const [description, setDescription] = useState("");
  const [fragile, setFragile] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");

  const handleContinue = (event) => {
    event.preventDefault();

    const parcelData = {
      parcelType,
      weight,
      packageSize,
      description,
      fragile,
      deliveryDate,
    };

    // Save parcel information
    localStorage.setItem(
      "swiftparcelParcel",
      JSON.stringify(parcelData)
    );

    navigate("/confirm-shipment");
  };

  return (
    <div className="parcel-details-screen">

      {/* Header */}
      <header className="parcel-details-header">

        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/receiver")}
        >
          ←
        </button>

        <h1>Send Parcel</h1>

        <div className="header-placeholder"></div>

      </header>

      {/* Progress */}
      <div className="parcel-progress">

        <div className="progress-step completed">
          <span>✓</span>
          <p>Sender</p>
        </div>

        <div className="progress-line active-line"></div>

        <div className="progress-step completed">
          <span>✓</span>
          <p>Receiver</p>
        </div>

        <div className="progress-line active-line"></div>

        <div className="progress-step active">
          <span>3</span>
          <p>Parcel</p>
        </div>

        <div className="progress-line"></div>

        <div className="progress-step">
          <span>4</span>
          <p>Confirm</p>
        </div>

      </div>

      {/* Main Content */}
      <main className="parcel-details-content">

        <div className="parcel-details-title">

          <h2>Parcel Details</h2>

          <p>
            Tell us a little about the package you want to send.
          </p>

        </div>

        <form
          className="parcel-details-form"
          onSubmit={handleContinue}
        >

          {/* Parcel Type */}
          <div className="parcel-form-group">

            <label htmlFor="parcelType">
              Parcel Type
            </label>

            <select
              id="parcelType"
              value={parcelType}
              onChange={(event) =>
                setParcelType(event.target.value)
              }
              required
            >

              <option value="">
                Select parcel type
              </option>

              <option value="document">
                Document
              </option>

              <option value="clothing">
                Clothing
              </option>

              <option value="electronics">
                Electronics
              </option>

              <option value="food">
                Food
              </option>

              <option value="personal-items">
                Personal Items
              </option>

              <option value="other">
                Other
              </option>

            </select>

          </div>

          {/* Weight */}
          <div className="parcel-form-group">

            <label htmlFor="weight">
              Weight
            </label>

            <div className="weight-wrapper">

              <input
                id="weight"
                type="number"
                min="0.1"
                step="0.1"
                placeholder="Enter weight"
                value={weight}
                onChange={(event) =>
                  setWeight(event.target.value)
                }
                required
              />

              <span>kg</span>

            </div>

          </div>

          {/* Package Size */}
          <div className="parcel-form-group">

            <label htmlFor="packageSize">
              Package Size
            </label>

            <select
              id="packageSize"
              value={packageSize}
              onChange={(event) =>
                setPackageSize(event.target.value)
              }
              required
            >

              <option value="">
                Select package size
              </option>

              <option value="small">
                Small
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="large">
                Large
              </option>

              <option value="extra-large">
                Extra Large
              </option>

            </select>

          </div>

          {/* Description */}
          <div className="parcel-form-group">

            <label htmlFor="description">
              Parcel Description
            </label>

            <textarea
              id="description"
              rows="4"
              placeholder="Describe the contents of your parcel"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              required
            ></textarea>

          </div>

          {/* Fragile */}
          <div className="fragile-option">

            <label className="checkbox-container">

              <input
                type="checkbox"
                checked={fragile}
                onChange={(event) =>
                  setFragile(event.target.checked)
                }
              />

              <span className="custom-checkbox"></span>

              <span className="fragile-text">
                This parcel contains fragile items
              </span>

            </label>

          </div>

          {/* Delivery Date */}
          <div className="parcel-form-group">

            <label htmlFor="deliveryDate">
              Preferred Delivery Date
            </label>

            <input
              id="deliveryDate"
              type="date"
              value={deliveryDate}
              onChange={(event) =>
                setDeliveryDate(event.target.value)
              }
              required
            />

          </div>

          {/* Continue */}
          <button
            type="submit"
            className="parcel-continue-button"
          >
            Continue
          </button>

        </form>

      </main>

    </div>
  );
}

export default ParcelDetails;