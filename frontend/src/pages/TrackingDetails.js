import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

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

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import "./TrackingDetails.css";

// ======================================================
// FIX LEAFLET DEFAULT MARKER ICON
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
// CITY COORDINATES
// ======================================================

const cityCoordinates = {
  buea: [4.156, 9.232],

  limbe: [4.0236, 9.2043],

  douala: [4.0511, 9.7679],

  yaounde: [3.848, 11.5021],

  bamenda: [5.9631, 10.1591],

  bafoussam: [5.4781, 10.4173],

  kribi: [2.9406, 9.9103],

  edea: [3.7995, 10.1289],

  bertoua: [4.5773, 13.6846],

  ngaoundere: [7.3277, 13.5847],

  garoua: [9.3009, 13.3971],

  maroua: [10.5913, 14.3159],
};

// ======================================================
// FIND CITY COORDINATES
// ======================================================

const getCityCoordinates = (city) => {
  if (!city) {
    return null;
  }

  const cleanCity = String(city)
    .trim()
    .toLowerCase()
    .replace(/,/g, " ")
    .replace(/\s+/g, " ");

  if (cityCoordinates[cleanCity]) {
    return cityCoordinates[cleanCity];
  }

  if (cleanCity.includes("buea")) {
    return cityCoordinates.buea;
  }

  if (cleanCity.includes("limbe")) {
    return cityCoordinates.limbe;
  }

  if (cleanCity.includes("douala")) {
    return cityCoordinates.douala;
  }

  if (
    cleanCity.includes("yaound") ||
    cleanCity.includes("yaounde")
  ) {
    return cityCoordinates.yaounde;
  }

  if (cleanCity.includes("bamenda")) {
    return cityCoordinates.bamenda;
  }

  if (cleanCity.includes("bafoussam")) {
    return cityCoordinates.bafoussam;
  }

  if (cleanCity.includes("kribi")) {
    return cityCoordinates.kribi;
  }

  if (cleanCity.includes("edea")) {
    return cityCoordinates.edea;
  }

  if (cleanCity.includes("bertoua")) {
    return cityCoordinates.bertoua;
  }

  if (cleanCity.includes("ngaoundere")) {
    return cityCoordinates.ngaoundere;
  }

  if (cleanCity.includes("garoua")) {
    return cityCoordinates.garoua;
  }

  if (cleanCity.includes("maroua")) {
    return cityCoordinates.maroua;
  }

  return null;
};

// ======================================================
// EXTRACT LOCATION
// ======================================================
//
// This handles both the current Shipment model fields
// and possible older/alternate field names.
//
// ======================================================

const getPickupLocation = (shipment) => {
  if (!shipment) {
    return "";
  }

  return (
    shipment.senderCity ||
    shipment.pickupCity ||
    shipment.pickupLocation ||
    shipment.pickup ||
    shipment.senderAddress ||
    shipment.sender ||
    ""
  );
};

const getDestinationLocation = (shipment) => {
  if (!shipment) {
    return "";
  }

  return (
    shipment.receiverCity ||
    shipment.destinationCity ||
    shipment.destinationLocation ||
    shipment.destination ||
    shipment.receiverAddress ||
    shipment.receiver ||
    ""
  );
};

// ======================================================
// CUSTOM PICKUP ICON
// ======================================================

const pickupIcon = new L.DivIcon({
  className: "custom-map-marker",

  html: `
    <div class="pickup-marker">
      <span>📦</span>
    </div>
  `,

  iconSize: [44, 44],
  iconAnchor: [22, 44],
});

// ======================================================
// CUSTOM DESTINATION ICON
// ======================================================

const destinationIcon = new L.DivIcon({
  className: "custom-map-marker",

  html: `
    <div class="destination-marker">
      <span>📍</span>
    </div>
  `,

  iconSize: [44, 44],
  iconAnchor: [22, 44],
});

// ======================================================
// CUSTOM VEHICLE ICON
// ======================================================

const vehicleIcon = new L.DivIcon({
  className: "custom-map-marker",

  html: `
    <div class="vehicle-marker">
      🚚
    </div>
  `,

  iconSize: [48, 48],
  iconAnchor: [24, 24],
});

// ======================================================
// MAP VIEW CONTROLLER
// ======================================================

function MapController({
  pickupPosition,
  destinationPosition,
  route,
}) {
  const map = useMap();

  useEffect(() => {
    if (
      !pickupPosition ||
      !destinationPosition
    ) {
      return;
    }

    if (
      route &&
      route.length > 1
    ) {
      const bounds =
        L.latLngBounds(route);

      map.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 12,
      });

      return;
    }

    const bounds =
      L.latLngBounds([
        pickupPosition,
        destinationPosition,
      ]);

    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 12,
    });
  }, [
    map,
    pickupPosition,
    destinationPosition,
    route,
  ]);

  return null;
}

// ======================================================
// FIND POSITION ALONG ACTUAL ROAD ROUTE
// ======================================================

const getPositionOnRoute = (
  route,
  progress
) => {
  if (
    !route ||
    route.length === 0
  ) {
    return null;
  }

  if (route.length === 1) {
    return route[0];
  }

  if (progress <= 0) {
    return route[0];
  }

  if (progress >= 1) {
    return route[
      route.length - 1
    ];
  }

  const segmentLengths = [];

  let totalLength = 0;

  for (
    let i = 0;
    i < route.length - 1;
    i++
  ) {
    const start =
      route[i];

    const end =
      route[i + 1];

    const dx =
      end[0] - start[0];

    const dy =
      end[1] - start[1];

    const length =
      Math.sqrt(
        dx * dx +
          dy * dy
      );

    segmentLengths.push(
      length
    );

    totalLength += length;
  }

  if (totalLength === 0) {
    return route[0];
  }

  const targetDistance =
    totalLength * progress;

  let travelled = 0;

  for (
    let i = 0;
    i < segmentLengths.length;
    i++
  ) {
    const segmentLength =
      segmentLengths[i];

    if (
      travelled +
        segmentLength >=
      targetDistance
    ) {
      const remaining =
        targetDistance -
        travelled;

      const ratio =
        segmentLength === 0
          ? 0
          : remaining /
            segmentLength;

      const start =
        route[i];

      const end =
        route[i + 1];

      return [
        start[0] +
          (end[0] -
            start[0]) *
            ratio,

        start[1] +
          (end[1] -
            start[1]) *
            ratio,
      ];
    }

    travelled +=
      segmentLength;
  }

  return route[
    route.length - 1
  ];
};

// ======================================================
// CALCULATE DELIVERY PROGRESS
// ======================================================

const calculateProgress = (
  shipment
) => {
  if (!shipment) {
    return 0;
  }

  const status =
    shipment.status;

  if (
    status ===
      "Delivered"
  ) {
    return 1;
  }

  if (
    status ===
      "Pending"
  ) {
    return 0;
  }

  if (shipment.deliveryDate) {
    const deliveryTime =
      new Date(
        shipment.deliveryDate
      ).getTime();

    const createdTime =
      shipment.createdAt
        ? new Date(
            shipment.createdAt
          ).getTime()
        : Date.now();

    const now =
      Date.now();

    const totalTime =
      deliveryTime -
      createdTime;

    const elapsed =
      now -
      createdTime;

    if (totalTime > 0) {
      let calculated =
        elapsed /
        totalTime;

      calculated =
        Math.max(
          0,
          Math.min(
            1,
            calculated
          )
        );

      return calculated;
    }
  }

  switch (status) {
    case "Picked Up":
      return 0.2;

    case "In Transit":
      return 0.5;

    case "Out for Delivery":
      return 0.8;

    default:
      return 0;
  }
};

// ======================================================
// MAIN COMPONENT
// ======================================================

function TrackingDetails() {
  const {
    trackingNumber,
  } = useParams();

  const navigate =
    useNavigate();

  const apiUrl =
    "https://swiftparcel-api-k6i6.onrender.com";

  const [shipment, setShipment] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [progress, setProgress] =
    useState(0);

  const [route, setRoute] =
    useState([]);

  const [routeLoading, setRouteLoading] =
    useState(false);

  const [routeError, setRouteError] =
    useState("");

  // ====================================================
  // LOAD SHIPMENT
  // ====================================================

  useEffect(() => {
    const loadShipment =
      async () => {
        try {
          setLoading(true);
          setError("");

          if (!trackingNumber) {
            throw new Error(
              "No tracking number was provided."
            );
          }

          const response =
            await fetch(
              `${apiUrl}/api/shipments/${encodeURIComponent(
                trackingNumber
              )}`
            );

          const responseText =
            await response.text();

          if (!response.ok) {
            throw new Error(
              `Server returned ${response.status}: ${responseText}`
            );
          }

          let data;

          try {
            data =
              JSON.parse(
                responseText
              );
          } catch {
            throw new Error(
              "The server returned invalid JSON."
            );
          }

          if (!data.shipment) {
            throw new Error(
              "Shipment not found."
            );
          }

          console.log(
            "TRACKING SHIPMENT:",
            data.shipment
          );

          setShipment(
            data.shipment
          );
        } catch (error) {
          console.error(
            "Tracking error:",
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
  }, [
    trackingNumber,
  ]);

  // ====================================================
  // UPDATE PROGRESS
  // ====================================================

  useEffect(() => {
    if (!shipment) {
      return;
    }

    const updateProgress =
      () => {
        const newProgress =
          calculateProgress(
            shipment
          );

        setProgress(
          newProgress
        );
      };

    updateProgress();

    const interval =
      setInterval(
        updateProgress,
        60000
      );

    return () =>
      clearInterval(
        interval
      );
  }, [shipment]);

  // ====================================================
  // GET LOCATION TEXT
  // ====================================================

  const pickupLocation =
    useMemo(() => {
      return getPickupLocation(
        shipment
      );
    }, [shipment]);

  const destinationLocation =
    useMemo(() => {
      return getDestinationLocation(
        shipment
      );
    }, [shipment]);

  // ====================================================
  // GET COORDINATES
  // ====================================================

  const pickupPosition =
    useMemo(() => {
      return getCityCoordinates(
        pickupLocation
      );
    }, [
      pickupLocation,
    ]);

  const destinationPosition =
    useMemo(() => {
      return getCityCoordinates(
        destinationLocation
      );
    }, [
      destinationLocation,
    ]);

  // ====================================================
  // GET ACTUAL ROAD ROUTE FROM OSRM
  // ====================================================

  useEffect(() => {
    const loadRoute =
      async () => {
        if (
          !pickupPosition ||
          !destinationPosition
        ) {
          setRoute([]);
          return;
        }

        // Same city
        if (
          pickupPosition[0] ===
            destinationPosition[0] &&
          pickupPosition[1] ===
            destinationPosition[1]
        ) {
          setRoute([
            pickupPosition,
          ]);

          return;
        }

        try {
          setRouteLoading(
            true
          );

          setRouteError("");

          /*
           * OSRM expects:
           *
           * longitude,latitude;
           * longitude,latitude
           */

          const start =
            `${pickupPosition[1]},${pickupPosition[0]}`;

          const end =
            `${destinationPosition[1]},${destinationPosition[0]}`;

          const url =
            `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`;

          console.log(
            "OSRM REQUEST:",
            url
          );

          const response =
            await fetch(url);

          if (!response.ok) {
            throw new Error(
              `Route server returned ${response.status}`
            );
          }

          const data =
            await response.json();

          console.log(
            "OSRM RESPONSE:",
            data
          );

          if (
            data.code !==
              "Ok" ||
            !data.routes ||
            !data.routes.length
          ) {
            throw new Error(
              "No driving route was found."
            );
          }

          const geometry =
            data.routes[0]
              .geometry;

          if (
            !geometry ||
            !geometry.coordinates ||
            !geometry.coordinates.length
          ) {
            throw new Error(
              "Route geometry was not returned."
            );
          }

          /*
           * GeoJSON uses:
           *
           * [longitude, latitude]
           *
           * Leaflet uses:
           *
           * [latitude, longitude]
           */

          const leafletRoute =
            geometry.coordinates.map(
              (coordinate) => [
                coordinate[1],
                coordinate[0],
              ]
            );

          setRoute(
            leafletRoute
          );
        } catch (error) {
          console.error(
            "Route error:",
            error
          );

          setRouteError(
            error.message ||
              "Unable to load road route."
          );

          /*
           * Fallback to a simple line
           * if OSRM fails.
           */

          setRoute([
            pickupPosition,
            destinationPosition,
          ]);
        } finally {
          setRouteLoading(
            false
          );
        }
      };

    loadRoute();
  }, [
    pickupPosition,
    destinationPosition,
  ]);

  // ====================================================
  // VEHICLE POSITION
  // ====================================================

  const vehiclePosition =
    useMemo(() => {
      if (
        !route ||
        route.length === 0
      ) {
        return null;
      }

      return getPositionOnRoute(
        route,
        progress
      );
    }, [
      route,
      progress,
    ]);

  // ====================================================
  // STATUS TEXT
  // ====================================================

  const getStatusText =
    () => {
      if (!shipment) {
        return "Loading...";
      }

      switch (
        shipment.status
      ) {
        case "Pending":
          return "Shipment is being prepared";

        case "Picked Up":
          return "Your parcel has been picked up";

        case "In Transit":
          return "Your parcel is on the way";

        case "Out for Delivery":
          return "Your parcel is out for delivery";

        case "Delivered":
          return "Your parcel has been delivered";

        default:
          return "Your parcel is on the way";
      }
    };

  // ====================================================
  // LOADING SCREEN
  // ====================================================

  if (loading) {
    return (
      <div className="tracking-details-screen">

        <div className="tracking-loading">

          <div className="tracking-loading-icon">
            📦
          </div>

          <h2>
            Loading shipment...
          </h2>

          <p>
            Please wait while we
            get your tracking
            information.
          </p>

        </div>

      </div>
    );
  }

  // ====================================================
  // ERROR SCREEN
  // ====================================================

  if (error) {
    return (
      <div className="tracking-details-screen">

        <div className="tracking-error">

          <div className="tracking-error-icon">
            ⚠️
          </div>

          <h2>
            Unable to display shipment
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/shipments")
            }
          >
            Back to My Shipments
          </button>

        </div>

      </div>
    );
  }

  // ====================================================
  // MAIN UI
  // ====================================================

  return (
    <div className="tracking-details-screen">

      {/* ==============================================
          HEADER
      =============================================== */}

      <header className="tracking-details-header">

        <button
          type="button"
          onClick={() =>
            navigate("/shipments")
          }
          className="tracking-back-button"
        >
          ←
        </button>

        <h1>
          Track Shipment
        </h1>

        <div></div>

      </header>

      {/* ==============================================
          SHIPMENT SUMMARY
      =============================================== */}

      <section className="tracking-summary">

        <div>

          <span className="tracking-label">
            TRACKING NUMBER
          </span>

          <strong>
            {shipment.trackingNumber}
          </strong>

        </div>

        <span className="tracking-status">
          {shipment.status}
        </span>

      </section>

      {/* ==============================================
          LIVE SHIPMENT MESSAGE
      =============================================== */}

      <section className="live-shipment-card">

        <div className="live-shipment-title">

          <span>
            🚚
          </span>

          <div>

            <h2>
              {getStatusText()}
            </h2>

            <p>
              {pickupLocation ||
                "Pickup"}{" "}
              →
              {" "}
              {destinationLocation ||
                "Destination"}
            </p>

          </div>

        </div>

      </section>

      {/* ==============================================
          MAP
      =============================================== */}

      <section className="tracking-map-wrapper">

        {pickupPosition &&
        destinationPosition ? (

          <MapContainer
            center={
              pickupPosition
            }
            zoom={10}
            scrollWheelZoom={true}
            className="tracking-map"
          >

            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* ========================================
                ACTUAL ROAD ROUTE
            ======================================== */}

            {route.length >
              1 && (

              <Polyline
                positions={
                  route
                }
                pathOptions={{
                  color:
                    "#168b4b",

                  weight: 6,

                  opacity: 0.9,
                }}
              />

            )}

            {/* ========================================
                PICKUP MARKER
            ======================================== */}

            <Marker
              position={
                pickupPosition
              }
              icon={
                pickupIcon
              }
            >

              <Popup>

                <strong>
                  Pickup Location
                </strong>

                <br />

                {pickupLocation}

              </Popup>

            </Marker>

            {/* ========================================
                DESTINATION MARKER
            ======================================== */}

            <Marker
              position={
                destinationPosition
              }
              icon={
                destinationIcon
              }
            >

              <Popup>

                <strong>
                  Destination
                </strong>

                <br />

                {destinationLocation}

              </Popup>

            </Marker>

            {/* ========================================
                VEHICLE
            ======================================== */}

            {vehiclePosition && (
              <Marker
                position={
                  vehiclePosition
                }
                icon={
                  vehicleIcon
                }
              >

                <Popup>

                  <strong>
                    Delivery Vehicle
                  </strong>

                  <br />

                  {Math.round(
                    progress *
                      100
                  )}
                  % of route completed

                </Popup>

              </Marker>
            )}

            {/* ========================================
                MAP CONTROLLER
            ======================================== */}

            <MapController
              pickupPosition={
                pickupPosition
              }
              destinationPosition={
                destinationPosition
              }
              route={
                route
              }
            />

          </MapContainer>

        ) : (

          <div className="map-location-error">

            <div>
              📍
            </div>

            <h3>
              Location unavailable
            </h3>

            <p>
              We could not find map
              coordinates for this
              shipment.
            </p>

            <small>

              Pickup:{" "}
              {pickupLocation ||
                "Not provided"}

              <br />

              Destination:{" "}
              {destinationLocation ||
                "Not provided"}

            </small>

          </div>

        )}

        {/* ==============================================
            ROUTE LOADING
        =============================================== */}

        {routeLoading && (
          <div className="route-loading-message">
            🛣️ Loading road route...
          </div>
        )}

        {/* ==============================================
            ROUTE ERROR
        =============================================== */}

        {!routeLoading &&
          routeError && (
            <div className="route-error-message">
              ⚠️ Road route unavailable.
              Showing a direct route instead.
            </div>
          )}

      </section>

      {/* ==============================================
          ROUTE INFORMATION
      =============================================== */}

      <section className="route-information">

        <div className="route-location">

          <div className="route-dot pickup-dot">
            📦
          </div>

          <div>

            <span>
              PICKUP
            </span>

            <strong>
              {pickupLocation ||
                "Not available"}
            </strong>

          </div>

        </div>

        <div className="route-line"></div>

        <div className="route-location">

          <div className="route-dot destination-dot">
            📍
          </div>

          <div>

            <span>
              DESTINATION
            </span>

            <strong>
              {destinationLocation ||
                "Not available"}
            </strong>

          </div>

        </div>

      </section>

      {/* ==============================================
          PROGRESS
      =============================================== */}

      <section className="shipment-progress-card">

        <div className="progress-header">

          <div>

            <h3>
              Shipment Progress
            </h3>

            <p>
              {Math.round(
                progress * 100
              )}
              % complete
            </p>

          </div>

        </div>

        <div className="progress-bar">

          <div
            className="progress-fill"
            style={{
              width: `${
                progress *
                100
              }%`,
            }}
          ></div>

        </div>

        <div className="progress-stages">

          <div
            className={
              progress >=
              0.2
                ? "progress-stage active"
                : "progress-stage"
            }
          >

            <span>
              ✓
            </span>

            <small>
              Picked Up
            </small>

          </div>

          <div
            className={
              progress >=
              0.5
                ? "progress-stage active"
                : "progress-stage"
            }
          >

            <span>
              ✓
            </span>

            <small>
              In Transit
            </small>

          </div>

          <div
            className={
              progress >=
              0.8
                ? "progress-stage active"
                : "progress-stage"
            }
          >

            <span>
              ✓
            </span>

            <small>
              Out for Delivery
            </small>

          </div>

          <div
            className={
              progress >=
              1
                ? "progress-stage active"
                : "progress-stage"
            }
          >

            <span>
              ✓
            </span>

            <small>
              Delivered
            </small>

          </div>

        </div>

      </section>

    </div>
  );
}

export default TrackingDetails;