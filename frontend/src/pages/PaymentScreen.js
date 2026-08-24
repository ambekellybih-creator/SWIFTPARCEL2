import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentScreen.css";

function PaymentScreen() {
  const navigate = useNavigate();

  const [shipment, setShipment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedShipment = localStorage.getItem(
      "swiftparcelPendingShipment"
    );

    if (!savedShipment) {
      setError("No shipment information found.");
      return;
    }

    try {
      setShipment(JSON.parse(savedShipment));
    } catch (error) {
      console.error(
        "Error loading shipment:",
        error
      );

      setError(
        "Unable to load shipment information."
      );
    }
  }, []);

  const calculateDeliveryFee = () => {
    const weight =
      Number(shipment?.parcel?.weight) || 0;

    if (weight <= 1) {
      return 2500;
    }

    if (weight <= 5) {
      return 4000;
    }

    if (weight <= 10) {
      return 6000;
    }

    return 8000;
  };

  const deliveryFee = calculateDeliveryFee();

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      // ==========================================
      // GET CUSTOMER TOKEN
      // ==========================================

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

      console.log(
        "Customer token found:",
        !!customerToken
      );

      // ==========================================
      // TEST PAYMENT
      // ==========================================

      await new Promise((resolve) =>
        setTimeout(resolve, 1500)
      );

      // ==========================================
      // BACKEND
      // ==========================================

      const apiUrl =
        "https://swiftparcel-api-k6i6.onrender.com";

      // ==========================================
      // CREATE SHIPMENT
      // ==========================================

      const response = await fetch(
        `${apiUrl}/api/shipments`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            // VERY IMPORTANT
            Authorization:
              `Bearer ${customerToken}`,
          },

          body: JSON.stringify({
            senderName:
              shipment.sender?.fullName || "",

            senderPhone:
              shipment.sender?.phone || "",

            senderAddress:
              `${shipment.sender?.address || ""}, ${
                shipment.sender?.city || ""
              }`.trim(),

            receiverName:
              shipment.receiver?.fullName || "",

            receiverPhone:
              shipment.receiver?.phone || "",

            receiverAddress:
              `${shipment.receiver?.address || ""}, ${
                shipment.receiver?.city || ""
              }`.trim(),

            parcelType:
              shipment.parcel?.parcelType || "",

            weight:
              Number(
                shipment.parcel?.weight
              ) || 0,
          }),
        }
      );

      const responseText =
        await response.text();

      console.log(
        "Shipment creation status:",
        response.status
      );

      console.log(
        "Shipment creation response:",
        responseText
      );

      // ==========================================
      // SERVER ERROR
      // ==========================================

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}: ${responseText}`
        );
      }

      // ==========================================
      // PARSE RESPONSE
      // ==========================================

      let data;

      try {
        data = JSON.parse(
          responseText
        );
      } catch (error) {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      console.log(
        "Created shipment:",
        data
      );

      // ==========================================
      // CHECK SHIPMENT
      // ==========================================

      if (!data.shipment) {
        throw new Error(
          "The server did not return shipment information."
        );
      }

      const createdShipment =
        data.shipment;

      // ==========================================
      // SAVE SHIPMENT
      // ==========================================

      localStorage.setItem(
        "swiftparcelShipment",
        JSON.stringify(
          createdShipment
        )
      );

      // ==========================================
      // SAVE PAYMENT
      // ==========================================

      const paymentData = {
        status: "paid",

        method:
          paymentMethod,

        amount:
          deliveryFee,

        currency: "XAF",

        date:
          new Date().toISOString(),
      };

      localStorage.setItem(
        "swiftparcelPayment",
        JSON.stringify(
          paymentData
        )
      );

      // ==========================================
      // REMOVE PENDING SHIPMENT
      // ==========================================

      localStorage.removeItem(
        "swiftparcelPendingShipment"
      );

      // ==========================================
      // GO TO SHIPMENTS
      // ==========================================

      navigate("/shipments");

    } catch (error) {
      console.error(
        "Payment error:",
        error
      );

      setError(
        error.message ||
          "Payment could not be completed."
      );

      setLoading(false);

      return;
    }

    setLoading(false);
  };

  // ==========================================
  // NO SHIPMENT
  // ==========================================

  if (error && !shipment) {
    return (
      <div className="payment-screen">

        <div className="payment-error-page">

          <h2>
            Something went wrong
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/confirm-shipment"
              )
            }
          >
            Go Back
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (!shipment) {
    return (
      <div className="payment-screen">

        <div className="payment-loading">
          Loading payment details...
        </div>

      </div>
    );
  }

  // ==========================================
  // PAYMENT PAGE
  // ==========================================

  return (
    <div className="payment-screen">

      {/* HEADER */}

      <header className="payment-header">

        <button
          type="button"
          className="payment-back-button"
          onClick={() =>
            navigate(
              "/confirm-shipment"
            )
          }
          disabled={loading}
        >
          ←
        </button>

        <h1>
          Payment
        </h1>

        <div className="payment-header-space"></div>

      </header>


      {/* MAIN */}

      <main className="payment-content">

        <div className="payment-title">

          <div className="payment-icon">
            💳
          </div>

          <h2>
            Complete Your Payment
          </h2>

          <p>
            Choose your payment method
            to complete your shipment.
          </p>

        </div>


        {/* SHIPMENT SUMMARY */}

        <section className="payment-card">

          <h3>
            Shipment Summary
          </h3>

          <div className="payment-row">

            <span>
              Sender
            </span>

            <strong>
              {shipment.sender?.fullName ||
                "Not provided"}
            </strong>

          </div>

          <div className="payment-row">

            <span>
              Receiver
            </span>

            <strong>
              {shipment.receiver?.fullName ||
                "Not provided"}
            </strong>

          </div>

          <div className="payment-row">

            <span>
              Parcel Type
            </span>

            <strong>
              {shipment.parcel?.parcelType ||
                "Not provided"}
            </strong>

          </div>

          <div className="payment-row">

            <span>
              Weight
            </span>

            <strong>
              {shipment.parcel?.weight ||
                0} kg
            </strong>

          </div>

        </section>


        {/* DELIVERY */}

        <section className="payment-card">

          <h3>
            Delivery Information
          </h3>

          <div className="payment-row">

            <span>
              Estimated Delivery
            </span>

            <strong>
              2 - 4 Business Days
            </strong>

          </div>

          <div className="payment-row">

            <span>
              Delivery Fee
            </span>

            <strong>
              {deliveryFee.toLocaleString()} FCFA
            </strong>

          </div>

        </section>


        {/* PAYMENT METHOD */}

        <section className="payment-card">

          <h3>
            Choose Payment Method
          </h3>

          <label
            className={`payment-method ${
              paymentMethod === "momo"
                ? "selected"
                : ""
            }`}
          >

            <input
              type="radio"
              name="paymentMethod"
              value="momo"
              checked={
                paymentMethod === "momo"
              }
              onChange={(event) =>
                setPaymentMethod(
                  event.target.value
                )
              }
              disabled={loading}
            />

            <span className="method-icon">
              📱
            </span>

            <span className="method-info">

              <strong>
                Mobile Money
              </strong>

              <small>
                MTN MoMo / Orange Money
              </small>

            </span>

          </label>


          <label
            className={`payment-method ${
              paymentMethod === "card"
                ? "selected"
                : ""
            }`}
          >

            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={
                paymentMethod === "card"
              }
              onChange={(event) =>
                setPaymentMethod(
                  event.target.value
                )
              }
              disabled={loading}
            />

            <span className="method-icon">
              💳
            </span>

            <span className="method-info">

              <strong>
                Bank Card
              </strong>

              <small>
                Visa / Mastercard
              </small>

            </span>

          </label>

        </section>


        {/* ERROR */}

        {error && (
          <div className="payment-error">
            {error}
          </div>
        )}


        {/* TOTAL */}

        <section className="payment-total">

          <span>
            Total Amount
          </span>

          <strong>
            {deliveryFee.toLocaleString()} FCFA
          </strong>

        </section>


        {/* PAY */}

        <button
          type="button"
          className="pay-button"
          onClick={handlePayment}
          disabled={loading}
        >

          {loading
            ? "Processing Payment..."
            : `Pay ${deliveryFee.toLocaleString()} FCFA`}

        </button>


        <p className="payment-security">
          🔒 Your payment information is secure.
        </p>

      </main>

    </div>
  );
}

export default PaymentScreen;