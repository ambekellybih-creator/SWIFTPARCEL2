import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SendParcel.css";

function SendParcel() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const handleContinue = (event) => {
    event.preventDefault();

    const senderData = {
      fullName,
      phone,
      email,
      address,
      city,
    };

    // Save sender information
    localStorage.setItem(
      "swiftparcelSender",
      JSON.stringify(senderData)
    );

    navigate("/receiver");
  };

  return (
    <div className="send-parcel-screen">

      <header className="send-parcel-header">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/home")}
        >
          ←
        </button>

        <h1>Send Parcel</h1>

        <div className="header-placeholder"></div>
      </header>

      <div className="parcel-progress">

        <div className="progress-step active">
          <span>1</span>
          <p>Sender</p>
        </div>

        <div className="progress-line"></div>

        <div className="progress-step">
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

      <main className="send-parcel-content">

        <div className="send-parcel-title">
          <h2>Sender Information</h2>

          <p>
            Tell us where the parcel will be picked up.
          </p>
        </div>

        <form
          className="sender-form"
          onSubmit={handleContinue}
        >

          <div className="sender-form-group">
            <label htmlFor="senderName">
              Full Name
            </label>

            <input
              id="senderName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              required
            />
          </div>

          <div className="sender-form-group">
            <label htmlFor="senderPhone">
              Phone Number
            </label>

            <div className="sender-phone-wrapper">
              <span>🇨🇲 +237</span>

              <input
                id="senderPhone"
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="sender-form-group">
            <label htmlFor="senderEmail">
              Email Address
            </label>

            <input
              id="senderEmail"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          <div className="sender-form-group">
            <label htmlFor="senderAddress">
              Pickup Address
            </label>

            <textarea
              id="senderAddress"
              placeholder="Enter the pickup address"
              value={address}
              onChange={(event) =>
                setAddress(event.target.value)
              }
              rows="3"
              required
            ></textarea>
          </div>

          <div className="sender-form-group">
            <label htmlFor="senderCity">
              City
            </label>

            <input
              id="senderCity"
              type="text"
              placeholder="e.g. Buea"
              value={city}
              onChange={(event) =>
                setCity(event.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="continue-button"
          >
            Continue
          </button>

        </form>

      </main>

    </div>
  );
}

export default SendParcel;