import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ======================================================
// FIX LEAFLET MARKER ICONS
// ======================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


// ======================================================
// TRACKING DETAILS
// ======================================================

function TrackingDetails() {

  const navigate = useNavigate();

  const { trackingNumber } = useParams();

  const [shipment, setShipment] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ====================================================
  // BACKEND URL
  // ====================================================

  const apiUrl =
    process.env.REACT_APP_API_URL ||
    "https://swiftparcel-api-k6i6.onrender.com";


  // ====================================================
  // LOAD SHIPMENT
  // ====================================================

  useEffect(() => {

    const loadShipment = async () => {

      try {

        setLoading(true);

        setError("");

        console.log(
          "Looking for tracking number:",
          trackingNumber
        );

        console.log(
          "Using API:",
          apiUrl
        );


        const response = await fetch(
          `${apiUrl}/api/shipments/${encodeURIComponent(
            trackingNumber
          )}`
        );


        const responseText =
          await response.text();


        console.log(
          "Server response:",
          responseText
        );


        let data;

        try {

          data = JSON.parse(
            responseText
          );

        } catch (jsonError) {

          throw new Error(
            "The server returned an invalid response."
          );

        }


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Shipment could not be found."
          );

        }


        if (!data.shipment) {

          throw new Error(
            "The server did not return shipment information."
          );

        }


        setShipment(
          data.shipment
        );


      } catch (err) {

        console.error(
          "Tracking error:",
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

    } else {

      setError(
        "No tracking number was provided."
      );

      setLoading(false);

    }

  }, [trackingNumber, apiUrl]);


  // ====================================================
  // LOADING SCREEN
  // ====================================================

  if (loading) {

    return (

      <div
        style={{
          minHeight: "100vh",
          background: "#f5f6ff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >

        <div
          style={{
            fontSize: "55px",
            marginBottom: "15px",
          }}
        >
          🚚
        </div>

        <h2>
          Loading shipment...
        </h2>

        <p>
          Tracking number: {trackingNumber}
        </p>

      </div>

    );

  }


  // ====================================================
  // ERROR SCREEN
  // ====================================================

  if (error) {

    return (

      <div
        style={{
          minHeight: "100vh",
          background: "#f5f6ff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "30px",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >

        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "30px",
            maxWidth: "500px",
            width: "100%",
            boxSizing: "border-box",
            boxShadow:
              "0 5px 25px rgba(0,0,0,0.08)",
          }}
        >

          <div
            style={{
              fontSize: "50px",
              marginBottom: "10px",
            }}
          >
            ⚠️
          </div>

          <h2>
            Unable to track shipment
          </h2>

          <p
            style={{
              color: "#666",
              lineHeight: "1.5",
            }}
          >
            {error}
          </p>

          <p
            style={{
              fontSize: "13px",
              color: "#999",
              wordBreak: "break-word",
            }}
          >
            Tracking number:
            <br />
            <strong>
              {trackingNumber}
            </strong>
          </p>


          <button
            type="button"
            onClick={() =>
              navigate("/home")
            }
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "12px",
              background: "#3424e9",
              color: "white",
              fontSize: "15px",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "15px",
            }}
          >
            Back to Home
          </button>

        </div>

      </div>

    );

  }


  // ====================================================
  // SAFETY CHECK
  // ====================================================

  if (!shipment) {

    return (

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >

        <h2>
          Shipment not found
        </h2>

        <button
          type="button"
          onClick={() =>
            navigate("/home")
          }
        >
          Back to Home
        </button>

      </div>

    );

  }


  // ====================================================
  // MAP LOCATIONS
  //
  // For now we use Buea and Yaoundé.
  // Later we can connect this to the driver's
  // actual GPS location.
  // ====================================================

  const bueaPosition = [
    4.156,
    9.232,
  ];


  const yaoundePosition = [
    3.848,
    11.502,
  ];


  // Current simulated parcel location
  const currentPosition = [
    4.35,
    10.05,
  ];


  // Route between Buea and Yaoundé

  const shipmentRoute = [

    bueaPosition,

    [
      4.28,
      9.65,
    ],

    currentPosition,

    [
      4.05,
      10.75,
    ],

    yaoundePosition,

  ];


  // ====================================================
  // MAIN PAGE
  // ====================================================

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6ff",
        fontFamily:
          "Arial, sans-serif",
        paddingBottom: "30px",
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={{
          background: "white",
          padding:
            "18px 20px",
          display: "flex",
          alignItems: "center",
          gap: "15px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >

        <button
          type="button"
          onClick={() =>
            navigate("/home")
          }
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            border: "none",
            background: "#f0f0f5",
            fontSize: "22px",
            cursor: "pointer",
          }}
        >
          ←
        </button>


        <div>

          <p
            style={{
              margin: 0,
              color: "#3424e9",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            SwiftParcel
          </p>

          <h1
            style={{
              margin:
                "3px 0 0",
              fontSize: "21px",
            }}
          >
            Tracking Details
          </h1>

        </div>

      </div>


      {/* =================================================
          TRACKING INFORMATION
      ================================================= */}

      <div
        style={{
          background: "white",
          margin: "18px",
          padding: "20px",
          borderRadius: "18px",
          boxShadow:
            "0 3px 15px rgba(0,0,0,0.05)",
        }}
      >

        <p
          style={{
            margin: 0,
            fontSize: "11px",
            color: "#777",
            fontWeight: "bold",
          }}
        >
          TRACKING NUMBER
        </p>


        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: "10px",
          }}
        >

          <h2
            style={{
              margin:
                "6px 0",
              fontSize: "21px",
            }}
          >
            {shipment.trackingNumber}
          </h2>


          <div
            style={{
              background:
                "#e7f8ec",
              color: "#16833a",
              padding:
                "7px 12px",
              borderRadius:
                "20px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {shipment.status ||
              "In Transit"}
          </div>

        </div>

      </div>


      {/* =================================================
          MAP CARD
      ================================================= */}

      <div
        style={{
          margin: "18px",
          background: "white",
          borderRadius: "18px",
          overflow: "hidden",
          boxShadow:
            "0 3px 15px rgba(0,0,0,0.05)",
        }}
      >

        <div
          style={{
            padding:
              "18px 20px",
          }}
        >

          <p
            style={{
              margin: 0,
              fontSize: "11px",
              color: "#777",
              fontWeight: "bold",
            }}
          >
            LIVE SHIPMENT MAP
          </p>


          <h2
            style={{
              margin:
                "5px 0 0",
              fontSize: "18px",
            }}
          >
            🚚 Your parcel is on the way
          </h2>

        </div>


        {/* =================================================
            REAL OPENSTREETMAP
        ================================================= */}

        <MapContainer
          center={
            currentPosition
          }
          zoom={7}
          scrollWheelZoom={true}
          style={{
            width: "100%",
            height: "430px",
          }}
        >

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />


          {/* ROUTE */}

          <Polyline
            positions={
              shipmentRoute
            }
            pathOptions={{
              color: "#3424e9",
              weight: 5,
            }}
          />


          {/* BUEA */}

          <Marker
            position={
              bueaPosition
            }
          >

            <Popup>

              <strong>
                📦 Pickup Location
              </strong>

              <br />

              Buea, Cameroon

            </Popup>

          </Marker>


          {/* CURRENT PARCEL */}

          <Marker
            position={
              currentPosition
            }
          >

            <Popup>

              <strong>
                🚚 Parcel
              </strong>

              <br />

              Tracking:
              <br />

              {shipment.trackingNumber}

              <br />

              Status:
              {" "}
              {shipment.status ||
                "In Transit"}

            </Popup>

          </Marker>


          {/* YAOUNDE */}

          <Marker
            position={
              yaoundePosition
            }
          >

            <Popup>

              <strong>
                📍 Delivery Destination
              </strong>

              <br />

              Yaoundé, Cameroon

            </Popup>

          </Marker>

        </MapContainer>

      </div>


      {/* =================================================
          ROUTE INFORMATION
      ================================================= */}

      <div
        style={{
          background: "white",
          margin: "18px",
          padding: "20px",
          borderRadius: "18px",
          boxShadow:
            "0 3px 15px rgba(0,0,0,0.05)",
        }}
      >

        <h2
          style={{
            marginTop: 0,
          }}
        >
          Shipment Progress
        </h2>


        {/* PICKED UP */}

        <div
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "20px",
          }}
        >

          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background:
                "#20b85a",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
              flexShrink: 0,
            }}
          >
            ✓
          </div>

          <div>

            <strong>
              Parcel Booked
            </strong>

            <p
              style={{
                margin:
                  "4px 0 0",
                color: "#777",
                fontSize: "13px",
              }}
            >
              Your shipment has
              been created.
            </p>

          </div>

        </div>


        {/* PICKED UP */}

        <div
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "20px",
          }}
        >

          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background:
                "#20b85a",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
              flexShrink: 0,
            }}
          >
            ✓
          </div>

          <div>

            <strong>
              Picked Up
            </strong>

            <p
              style={{
                margin:
                  "4px 0 0",
                color: "#777",
                fontSize: "13px",
              }}
            >
              Parcel collected
              from Buea.
            </p>

          </div>

        </div>


        {/* IN TRANSIT */}

        <div
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "20px",
          }}
        >

          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background:
                "#3424e9",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
              flexShrink: 0,
            }}
          >
            🚚
          </div>

          <div>

            <strong>
              In Transit
            </strong>

            <p
              style={{
                margin:
                  "4px 0 0",
                color: "#777",
                fontSize: "13px",
              }}
            >
              Your parcel is
              currently on its
              way to Yaoundé.
            </p>

          </div>

        </div>


        {/* DESTINATION */}

        <div
          style={{
            display: "flex",
            gap: "15px",
          }}
        >

          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background:
                "#e8e8ee",
              color: "#888",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
              flexShrink: 0,
            }}
          >
            📍
          </div>

          <div>

            <strong>
              Delivery
            </strong>

            <p
              style={{
                margin:
                  "4px 0 0",
                color: "#777",
                fontSize: "13px",
              }}
            >
              Destination:
              {" "}
              Yaoundé
            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          SHIPMENT INFORMATION
      ================================================= */}

      <div
        style={{
          background: "white",
          margin: "18px",
          padding: "20px",
          borderRadius: "18px",
          boxShadow:
            "0 3px 15px rgba(0,0,0,0.05)",
        }}
      >

        <h2
          style={{
            marginTop: 0,
          }}
        >
          Shipment Information
        </h2>


        <p>
          <strong>
            Sender:
          </strong>
          {" "}
          {shipment.senderName ||
            "Not available"}
        </p>


        <p>
          <strong>
            Receiver:
          </strong>
          {" "}
          {shipment.receiverName ||
            "Not available"}
        </p>


        <p>
          <strong>
            Parcel Type:
          </strong>
          {" "}
          {shipment.parcelType ||
            "Not available"}
        </p>


        <p>
          <strong>
            Weight:
          </strong>
          {" "}
          {shipment.weight ||
            "0"}
          {" "}
          kg
        </p>


        <p>
          <strong>
            From:
          </strong>
          {" "}
          {shipment.senderAddress ||
            "Buea"}
        </p>


        <p>
          <strong>
            To:
          </strong>
          {" "}
          {shipment.receiverAddress ||
            "Yaoundé"}
        </p>

      </div>


      {/* =================================================
          BACK BUTTON
      ================================================= */}

      <button
        type="button"
        onClick={() =>
          navigate("/home")
        }
        style={{
          display: "block",
          width:
            "calc(100% - 36px)",
          margin: "18px",
          padding: "15px",
          border: "none",
          borderRadius: "12px",
          background: "#3424e9",
          color: "white",
          fontSize: "15px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Back to Home
      </button>

    </div>

  );
}

export default TrackingDetails;