import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./HomeScreen.css";


// =====================================================
// FIX LEAFLET DEFAULT MARKER ICONS
// =====================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


// =====================================================
// CAMEROON CITY COORDINATES
// =====================================================

const cityCoordinates = {
  buea: [
    4.1527,
    9.2410,
  ],

  yaounde: [
    3.8480,
    11.5021,
  ],

  douala: [
    4.0511,
    9.7679,
  ],

  limbe: [
    4.0236,
    9.2066,
  ],

  bamenda: [
    5.9631,
    10.1591,
  ],

  bafoussam: [
    5.4781,
    10.4176,
  ],

  bertoua: [
    4.5773,
    13.6846,
  ],

  garoua: [
    9.3014,
    13.3977,
  ],

  maroua: [
    10.5910,
    14.3159,
  ],

  ngaoundere: [
    7.3167,
    13.5833,
  ],

  kribi: [
    2.9406,
    9.9103,
  ],
};


// =====================================================
// FIND CITY COORDINATES
// =====================================================

const getCoordinates = (address) => {
  if (!address) {
    return null;
  }

  const text = address.toLowerCase();

  for (const city in cityCoordinates) {
    if (text.includes(city)) {
      return cityCoordinates[city];
    }
  }

  return null;
};


// =====================================================
// MAP UPDATER
// =====================================================

function MapUpdater({
  pickup,
  destination,
}) {
  const map = useMap();

  useEffect(() => {
    if (
      pickup &&
      destination
    ) {
      const bounds =
        L.latLngBounds([
          pickup,
          destination,
        ]);

      map.fitBounds(
        bounds,
        {
          padding: [
            40,
            40,
          ],
        }
      );
    }
  }, [
    map,
    pickup,
    destination,
  ]);

  return null;
}


// =====================================================
// HOME SCREEN
// =====================================================

function HomeScreen() {
  const navigate =
    useNavigate();

  const location =
    useLocation();


  // =====================================================
  // STATE
  // =====================================================

  const [
    trackingNumber,
    setTrackingNumber,
  ] = useState("");


  const [
    trackingLoading,
    setTrackingLoading,
  ] = useState(false);


  const [
    trackingError,
    setTrackingError,
  ] = useState("");


  const [
    shipment,
    setShipment,
  ] = useState(null);


  // =====================================================
  // BACKEND URL
  // =====================================================

  const apiUrl =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";


  // =====================================================
  // TRACK SHIPMENT
  // =====================================================

  const handleTrack =
    useCallback(
      async (
        numberOverride = ""
      ) => {

        const number = (
          numberOverride ||
          trackingNumber
        ).trim();


        if (!number) {
          setTrackingError(
            "Please enter a tracking number."
          );

          return;
        }


        setTrackingLoading(
          true
        );

        setTrackingError("");

        setShipment(null);


        try {

          const response =
            await fetch(
              `${apiUrl}/api/shipments/${encodeURIComponent(
                number
              )}`
            );


          const responseText =
            await response.text();


          console.log(
            "Tracking status:",
            response.status
          );


          console.log(
            "Tracking response:",
            responseText
          );


          if (!response.ok) {

            let message =
              "Shipment not found.";


            try {

              const errorData =
                JSON.parse(
                  responseText
                );


              message =
                errorData.message ||
                message;

            } catch {
              // Keep default message
            }


            throw new Error(
              message
            );
          }


          const data =
            JSON.parse(
              responseText
            );


          console.log(
            "Shipment data:",
            data.shipment
          );


          setShipment(
            data.shipment
          );


          setTrackingNumber(
            data.shipment
              ?.trackingNumber ||
            number
          );


        } catch (
          error
        ) {

          console.error(
            "Tracking error:",
            error
          );


          setTrackingError(
            error.message ||
            "Unable to track shipment."
          );


        } finally {

          setTrackingLoading(
            false
          );

        }

      },
      [
        apiUrl,
        trackingNumber,
      ]
    );


  // =====================================================
  // READ TRACKING NUMBER FROM URL
  // =====================================================

  useEffect(() => {

    const params =
      new URLSearchParams(
        location.search
      );


    const urlTrackingNumber =
      params.get(
        "tracking"
      );


    if (
      urlTrackingNumber
    ) {

      setTrackingNumber(
        urlTrackingNumber
      );


      handleTrack(
        urlTrackingNumber
      );

    }

  }, [
    location.search,
    handleTrack,
  ]);


  // =====================================================
  // TRACKING TIMELINE
  // =====================================================

  const getStatusStep = (
    status
  ) => {

    const statuses = [
      "Pending",
      "Picked Up",
      "In Transit",
      "Out for Delivery",
      "Delivered",
    ];


    const currentIndex =
      statuses.indexOf(
        status
      );


    return statuses.map(
      (
        item,
        index
      ) => ({

        name:
          item,

        completed:
          currentIndex >=
          index,

        current:
          currentIndex ===
          index,

      })
    );

  };


  // =====================================================
  // MAP LOCATIONS
  // =====================================================

  const pickupCoordinates =
    shipment
      ? getCoordinates(
          shipment.senderAddress
        )
      : null;


  const destinationCoordinates =
    shipment
      ? getCoordinates(
          shipment.receiverAddress
        )
      : null;


  // =====================================================
  // CURRENT DELIVERY POSITION
  // =====================================================

  let currentCoordinates =
    pickupCoordinates;


  // IN TRANSIT
  if (
    shipment?.status ===
    "In Transit"
  ) {

    if (
      pickupCoordinates &&
      destinationCoordinates
    ) {

      const middleLatitude =
        (
          pickupCoordinates[0] +
          destinationCoordinates[0]
        ) / 2;


      const middleLongitude =
        (
          pickupCoordinates[1] +
          destinationCoordinates[1]
        ) / 2;


      currentCoordinates = [
        middleLatitude,
        middleLongitude,
      ];

    }

  }


  // OUT FOR DELIVERY
  if (
    shipment?.status ===
    "Out for Delivery"
  ) {

    if (
      pickupCoordinates &&
      destinationCoordinates
    ) {

      const latitude =
        pickupCoordinates[0] +
        (
          destinationCoordinates[0] -
          pickupCoordinates[0]
        ) *
        0.8;


      const longitude =
        pickupCoordinates[1] +
        (
          destinationCoordinates[1] -
          pickupCoordinates[1]
        ) *
        0.8;


      currentCoordinates = [
        latitude,
        longitude,
      ];

    }

  }


  // DELIVERED
  if (
    shipment?.status ===
    "Delivered"
  ) {

    currentCoordinates =
      destinationCoordinates;

  }


  // =====================================================
  // MAP CENTER
  // =====================================================

  const mapCenter =
    pickupCoordinates ||
    destinationCoordinates ||
    [
      4.1527,
      9.2410,
    ];


  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="home-screen">


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="home-header">

        <div>

          <p className="home-greeting">
            Good day 👋
          </p>


          <h1>
            Welcome to SwiftParcel
          </h1>

        </div>


        <button
          className="notification-button"
          type="button"
          aria-label="Notifications"
          onClick={() => {

            alert(
              "Notifications will be available soon."
            );

          }}
        >
          🔔
        </button>

      </header>


      {/* =================================================
          TRACKING CARD
      ================================================= */}

      <section className="tracking-card">

        <div className="tracking-card-content">

          <p>
            Track your parcel
          </p>


          <h2>
            Where is your parcel?
          </h2>


          <div className="tracking-input">

            <input
              type="text"
              placeholder="Enter tracking number"
              value={
                trackingNumber
              }
              onChange={(
                event
              ) =>
                setTrackingNumber(
                  event.target.value
                )
              }
              onKeyDown={(
                event
              ) => {

                if (
                  event.key ===
                  "Enter"
                ) {

                  handleTrack();

                }

              }}
            />


            <button
              type="button"
              onClick={() =>
                handleTrack()
              }
              disabled={
                trackingLoading
              }
            >

              {trackingLoading
                ? "Tracking..."
                : "Track"}

            </button>

          </div>


          {trackingError && (

            <p className="tracking-error">
              {trackingError}
            </p>

          )}

        </div>

      </section>


      {/* =================================================
          TRACKING RESULT
      ================================================= */}

      {shipment && (

        <section className="tracking-details-section">


          {/* =================================================
              MAP
          ================================================= */}

          <div className="tracking-map-card">

            <div className="tracking-map-header">

              <div>

                <span>
                  Tracking Details
                </span>


                <h2>
                  {
                    shipment.trackingNumber
                  }
                </h2>

              </div>


              <span
                className={`map-status ${
                  (
                    shipment.status ||
                    "Pending"
                  )
                    .toLowerCase()
                    .replace(
                      /\s+/g,
                      "-"
                    )
                }`}
              >
                {
                  shipment.status ||
                  "Pending"
                }
              </span>

            </div>


            {pickupCoordinates &&
            destinationCoordinates ? (

              <div className="tracking-map">

                <MapContainer
                  center={
                    mapCenter
                  }
                  zoom={7}
                  scrollWheelZoom={
                    false
                  }
                  style={{
                    width:
                      "100%",
                    height:
                      "100%",
                  }}
                >

                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />


                  <MapUpdater
                    pickup={
                      pickupCoordinates
                    }
                    destination={
                      destinationCoordinates
                    }
                  />


                  {/* PICKUP MARKER */}

                  <Marker
                    position={
                      pickupCoordinates
                    }
                  >

                    <Popup>

                      <strong>
                        Pickup Location
                      </strong>

                      <br />

                      {
                        shipment.senderAddress
                      }

                    </Popup>

                  </Marker>


                  {/* DESTINATION MARKER */}

                  <Marker
                    position={
                      destinationCoordinates
                    }
                  >

                    <Popup>

                      <strong>
                        Destination
                      </strong>

                      <br />

                      {
                        shipment.receiverAddress
                      }

                    </Popup>

                  </Marker>


                  {/* DELIVERY VEHICLE */}

                  {currentCoordinates && (

                    <Marker
                      position={
                        currentCoordinates
                      }
                    >

                      <Popup>

                        <strong>
                          🚚 SwiftParcel
                        </strong>

                        <br />

                        {
                          shipment.status ||
                          "Pending"
                        }

                      </Popup>

                    </Marker>

                  )}


                  {/* ROUTE */}

                  <Polyline
                    positions={[
                      pickupCoordinates,
                      destinationCoordinates,
                    ]}
                    pathOptions={{
                      color:
                        "#3030e8",
                      weight:
                        5,
                      opacity:
                        0.8,
                    }}
                  />

                </MapContainer>

              </div>

            ) : (

              <div className="tracking-map-unavailable">

                <div>
                  🗺️
                </div>


                <h3>
                  Map unavailable
                </h3>


                <p>
                  We could not determine
                  the pickup or destination
                  location for this shipment.
                </p>

              </div>

            )}

          </div>


          {/* =================================================
              LOCATION SUMMARY
          ================================================= */}

          <div className="tracking-location-card">

            <div className="location-point">

              <div className="location-dot pickup">
                ●
              </div>


              <div>

                <small>
                  PICKUP
                </small>


                <strong>
                  {
                    shipment.senderAddress ||
                    shipment.senderName ||
                    "Pickup location"
                  }
                </strong>

              </div>

            </div>


            <div className="location-line"></div>


            <div className="location-point">

              <div className="location-dot destination">
                ●
              </div>


              <div>

                <small>
                  DESTINATION
                </small>


                <strong>
                  {
                    shipment.receiverAddress ||
                    shipment.receiverName ||
                    "Destination"
                  }
                </strong>

              </div>

            </div>

          </div>


          {/* =================================================
              DELIVERY AGENT
          ================================================= */}

          <div className="delivery-agent-card">

            <div className="delivery-agent-avatar">
              🚚
            </div>


            <div className="delivery-agent-info">

              <small>
                DELIVERY AGENT
              </small>


              <h3>
                SwiftParcel Delivery Agent
              </h3>


              <p>

                {
                  shipment.status ===
                  "Delivered"
                    ? "Delivery completed"
                    : "Rider • In Transit"
                }

              </p>

            </div>


            <div className="delivery-agent-actions">

              <button
                type="button"
                onClick={() =>
                  alert(
                    "Calling the delivery agent will be available soon."
                  )
                }
              >
                📞
              </button>


              <button
                type="button"
                onClick={() =>
                  alert(
                    "Messaging the delivery agent will be available soon."
                  )
                }
              >
                💬
              </button>

            </div>

          </div>


          {/* =================================================
              ESTIMATED ARRIVAL
          ================================================= */}

          <div className="estimated-arrival">

            <div>

              <small>
                ESTIMATED ARRIVAL
              </small>


              <strong>

                {
                  shipment.status ===
                  "Delivered"
                    ? "Delivered"
                    : shipment.status ===
                      "Out for Delivery"
                    ? "Today"
                    : "2 - 4 Business Days"
                }

              </strong>

            </div>


            <span>
              ⏱️
            </span>

          </div>


          {/* =================================================
              SHIPMENT TIMELINE
          ================================================= */}

          <div className="tracking-timeline">

            <h3>
              Shipment Progress
            </h3>


            {getStatusStep(
              shipment.status
            ).map(
              (
                step,
                index
              ) => (

                <div
                  className={`timeline-step ${
                    step.completed
                      ? "completed"
                      : ""
                  } ${
                    step.current
                      ? "current"
                      : ""
                  }`}
                  key={
                    step.name
                  }
                >

                  <div className="timeline-icon">

                    {
                      step.completed
                        ? "✓"
                        : index + 1
                    }

                  </div>


                  <div className="timeline-content">

                    <strong>
                      {step.name}
                    </strong>


                    <p>

                      {
                        step.current
                          ? "Your shipment is currently at this stage."
                          : step.completed
                          ? "Completed"
                          : "Not yet reached"
                      }

                    </p>

                  </div>

                </div>

              )
            )}

          </div>


          {/* =================================================
              VIEW SHIPMENTS
          ================================================= */}

          <button
            className="view-shipments-button"
            type="button"
            onClick={() =>
              navigate(
                "/shipments"
              )
            }
          >
            View My Shipments
          </button>

        </section>

      )}


      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <section className="home-section">

        <div className="section-heading">

          <h2>
            Quick Actions
          </h2>

        </div>


        <div className="quick-actions">


          {/* SEND PARCEL */}

          <button
            className="action-card"
            type="button"
            onClick={() =>
              navigate(
                "/send-parcel"
              )
            }
          >

            <div className="action-icon">
              📦
            </div>


            <div>

              <h3>
                Send Parcel
              </h3>


              <p>
                Send a package
              </p>

            </div>

          </button>


          {/* TRACK PARCEL */}

          <button
            className="action-card"
            type="button"
            onClick={() => {

              document
                .querySelector(
                  ".tracking-input input"
                )
                ?.focus();

            }}
          >

            <div className="action-icon">
              🚚
            </div>


            <div>

              <h3>
                Track Parcel
              </h3>


              <p>
                Track your delivery
              </p>

            </div>

          </button>

        </div>

      </section>


      {/* =================================================
          RECENT SHIPMENTS
      ================================================= */}

      <section className="home-section">

        <div className="section-heading">

          <h2>
            Recent Shipments
          </h2>


          <button
            type="button"
            onClick={() =>
              navigate(
                "/shipments"
              )
            }
          >
            View all
          </button>

        </div>


        <div className="empty-shipments">

          <div className="empty-icon">
            📦
          </div>


          <h3>
            No shipments yet
          </h3>


          <p>
            Your recent shipments
            will appear here.
          </p>


          <button
            type="button"
            onClick={() =>
              navigate(
                "/send-parcel"
              )
            }
          >
            Send your first parcel
          </button>

        </div>

      </section>


      {/* =================================================
          BOTTOM NAVIGATION
      ================================================= */}

      <nav className="bottom-navigation">


        {/* HOME */}

        <button
          className="bottom-nav-item active"
          type="button"
          onClick={() =>
            navigate(
              "/home"
            )
          }
        >

          <span>
            ⌂
          </span>


          <small>
            Home
          </small>

        </button>


        {/* SHIPMENTS */}

        <button
          className="bottom-nav-item"
          type="button"
          onClick={() =>
            navigate(
              "/shipments"
            )
          }
        >

          <span>
            ▣
          </span>


          <small>
            Shipments
          </small>

        </button>


        {/* TRACK */}

        <button
          className="bottom-nav-item"
          type="button"
          onClick={() => {

            document
              .querySelector(
                ".tracking-input input"
              )
              ?.focus();

          }}
        >

          <span>
            ⌖
          </span>


          <small>
            Track
          </small>

        </button>


        {/* PROFILE */}

        <button
          className="bottom-nav-item"
          type="button"
          onClick={() => {

            alert(
              "Profile page will be built soon."
            );

          }}
        >

          <span>
            ◯
          </span>


          <small>
            Profile
          </small>

        </button>

      </nav>

    </div>
  );
}


export default HomeScreen;