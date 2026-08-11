import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Receiver.css";

function Receiver() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const handleContinue = (event) => {
    event.preventDefault();

    console.log("Receiver Information:", {
      fullName,
      phone,
      email,
      address,
      city,
    });

    navigate("/parcel-details");
  };

  return (
    <div className="receiver-screen">

      {/* Header */}
      <header className="receiver-header">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/send-parcel")}
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

        <div className="progress-step active">
          <span>2</span>
          <p>Receiver</p>
        </div>

        <div className="progress-line"></div>

        <div className="progress-step">
          <span>3</span>
          <p>Parcel</p>
        </div>

        <div className="progress-line"></div>

        <div className="progress-step">
          <span>4</span>
          <p>Confirm</p>
        </div>

      </div>

      {/* Main content */}
      <main className="receiver-content">

        <div className="receiver-title">
          <h2>Receiver Information</h2>

          <p>
            Tell us where the parcel will be delivered.
          </p>
        </div>

        <form
          className="receiver-form"
          onSubmit={handleContinue}
        >

          {/* Full Name */}
          <div className="receiver-form-group">
            <label htmlFor="receiverName">
              Full Name
            </label>

            <input
              id="receiverName"
              type="text"
              placeholder="Enter receiver's full name"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              required
            />
          </div>

          {/* Phone */}
          <div className="receiver-form-group">
            <label htmlFor="receiverPhone">
              Phone Number
            </label>

            <div className="receiver-phone-wrapper">

              <span>
                🇨🇲 +237
              </span>

              <input
                id="receiverPhone"
                type="tel"
                placeholder="Enter receiver's phone"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                required
              />

            </div>
          </div>

          {/* Email */}
          <div className="receiver-form-group">
            <label htmlFor="receiverEmail">
              Email Address
            </label>

            <input
              id="receiverEmail"
              type="email"
              placeholder="Enter receiver's email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          {/* Delivery Address */}
          <div className="receiver-form-group">
            <label htmlFor="receiverAddress">
              Delivery Address
            </label>

            <textarea
              id="receiverAddress"
              placeholder="Enter the delivery address"
              value={address}
              onChange={(event) =>
                setAddress(event.target.value)
              }
              rows="3"
              required
            ></textarea>
          </div>

          {/* City */}
          <div className="receiver-form-group">
            <label htmlFor="receiverCity">
              City
            </label>

            <input
              id="receiverCity"
              type="text"
              placeholder="e.g. Limbe"
              value={city}
              onChange={(event) =>
                setCity(event.target.value)
              }
              required
            />
          </div>

          {/* Continue */}
          <button
            type="submit"
            className="receiver-continue-button"
          >
            Continue
          </button>

        </form>

      </main>

    </div>
  );
}

export default Receiver;