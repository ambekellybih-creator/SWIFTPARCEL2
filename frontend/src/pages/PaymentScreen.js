import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentScreen.css";

function PaymentScreen() {
  const navigate = useNavigate();

  const [shipment, setShipment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD PENDING SHIPMENT
  // ==========================================

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

  // ==========================================
  // DELIVERY FEE
  // ==========================================

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

  // ==========================================
  // PAYMENT
  // ==========================================

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      // ========================================
      // TOKEN
      // ========================================

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

      // ========================================
      // CHECK DELIVERY DATE
      // ========================================

      const deliveryDate =
        shipment?.parcel?.deliveryDate;

      if (!deliveryDate) {
        throw new Error(
          "No delivery date was selected."
        );
      }

      // ========================================
      // TEST PAYMENT
      // ========================================

      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      // ========================================
      // BACKEND
      // ========================================

      const apiUrl =
        process.env.REACT_APP_API_URL ||
        "https://swiftparcel-api-k6i6.onrender.com";

      // ========================================
      // CREATE SHIPMENT
      // ========================================

      const response = await fetch(
        `${apiUrl}/api/shipments`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization:
              `Bearer ${customerToken}`,
          },

          body: JSON.stringify({
            senderName:
              shipment.sender?.fullName || "",

            senderPhone:
              shipment.sender?.phone || "",

            senderAddress:
  shipment.sender?.address || "",

  senderCity:
  shipment.sender?.city || "",

            receiverName:
              shipment.receiver?.fullName || "",

            receiverPhone:
              shipment.receiver?.phone || "",

            receiverAddress:
  shipment.receiver?.address || "",
  receiverCity:
  shipment.receiver?.city || "",

            parcelType:
              shipment.parcel?.parcelType || "",

            weight:
              Number(
                shipment.parcel?.weight
              ) || 0,

            // ==================================
            // IMPORTANT
            // ==================================

            deliveryDate:
              deliveryDate,
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

      // ========================================
      // SERVER ERROR
      // ========================================

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}: ${responseText}`
        );
      }

      // ========================================
      // PARSE RESPONSE
      // ========================================

      let data;

      try {
        data = JSON.parse(
          responseText
        );
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      // ========================================
      // CHECK SHIPMENT
      // ========================================

      if (!data.shipment) {
        throw new Error(
          "The server did not return shipment information."
        );
      }

      const createdShipment =
        data.shipment;

      // ========================================
      // SAVE SHIPMENT
      // ========================================

      localStorage.setItem(
        "swiftparcelShipment",
        JSON.stringify(
          createdShipment
        )
      );

      // ========================================
      // SAVE PAYMENT
      // ========================================

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

      // ========================================
      // REMOVE PENDING
      // ========================================

      localStorage.removeItem(
        "swiftparcelPendingShipment"
      );

      // ========================================
      // GO TO SHIPMENTS
      // ========================================

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
              navigate("/home")
            }
          >
            Back to Home
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // LOADING SHIPMENT
  // ==========================================

  if (!shipment) {
    return (
      <div className="payment-screen">

        <div className="payment-error-page">

          <h2>
            Loading shipment...
          </h2>

        </div>

      </div>
    );
  }

  // ==========================================
  // PAYMENT PAGE
  // ==========================================

  return (
    <div className="payment-screen">

      <header className="payment-header">

        <button
          type="button"
          onClick={() =>
            navigate("/confirm-shipment")
          }
        >
          ←
        </button>

        <h1>
          Payment
        </h1>

        <div></div>

      </header>

      <main className="payment-content">

        <div className="payment-card">

          <h2>
            Complete Your Payment
          </h2>

          <p>
            Choose your preferred payment method.
          </p>

          <div className="payment-summary">

            <div>
              <span>
                Delivery Fee
              </span>

              <strong>
                {deliveryFee.toLocaleString()} FCFA
              </strong>
            </div>

            <div>
              <span>
                Delivery Date
              </span>

              <strong>
                {shipment.parcel?.deliveryDate ||
                  "Not provided"}
              </strong>
            </div>

          </div>

          <div className="payment-methods">

            <button
              type="button"
              className={
                paymentMethod === "momo"
                  ? "payment-method active"
                  : "payment-method"
              }
              onClick={() =>
                setPaymentMethod("momo")
              }
            >
              📱 Mobile Money
            </button>

            <button
              type="button"
              className={
                paymentMethod === "cash"
                  ? "payment-method active"
                  : "payment-method"
              }
              onClick={() =>
                setPaymentMethod("cash")
              }
            >
              💵 Cash
            </button>

          </div>

          {error && (
            <p className="payment-error">
              {error}
            </p>
          )}

          <button
            type="button"
            className="pay-button"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : `Pay ${deliveryFee.toLocaleString()} FCFA`}
          </button>

        </div>

      </main>

    </div>
  );
}

export default PaymentScreen;