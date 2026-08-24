import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import "./Shipments.css";


function Shipments() {

  const navigate = useNavigate();


  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==========================================
  // LIVE BACKEND
  // ==========================================

  const apiUrl =
    "https://swiftparcel-api-k6i6.onrender.com";


  // ==========================================
  // LOAD CUSTOMER SHIPMENTS
  // ==========================================

  const loadShipments = useCallback(
    async () => {

      try {

        setLoading(true);
        setError("");


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


        console.log(
          "Customer token found:",
          !!customerToken
        );


        // ==========================================
        // CHECK LOGIN
        // ==========================================

        if (!customerToken) {

          throw new Error(
            "You are not logged in. Please login again."
          );

        }


        // ==========================================
        // GET CUSTOMER SHIPMENTS
        // ==========================================

        const response = await fetch(
          `${apiUrl}/api/my-shipments`,
          {
            method: "GET",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${customerToken}`,
            },
          }
        );


        const responseText =
          await response.text();


        console.log(
          "Shipments status:",
          response.status
        );


        console.log(
          "Shipments response:",
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

          data =
            JSON.parse(
              responseText
            );

        } catch (error) {

          throw new Error(
            "The server returned an invalid response."
          );

        }


        console.log(
          "Customer shipments:",
          data
        );


        // ==========================================
        // SAVE SHIPMENTS
        // ==========================================

        setShipments(
          data.shipments || []
        );


      } catch (error) {

        console.error(
          "Loading shipments error:",
          error
        );


        setError(
          error.message ||
          "Unable to load shipments."
        );


      } finally {

        setLoading(false);

      }

    },
    [apiUrl]
  );


  // ==========================================
  // LOAD WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {

    loadShipments();

  }, [loadShipments]);


  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (
    status
  ) => {

    return (
      status
        ?.toLowerCase()
        .replace(/\s+/g, "-") ||
      "pending"
    );

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="shipments-screen">

        <header className="shipments-header">

          <button
            className="shipments-back-button"
            type="button"
            onClick={() =>
              navigate("/home")
            }
          >
            ←
          </button>


          <h1>
            My Shipments
          </h1>


          <div></div>

        </header>


        <main className="shipments-content">

          <div className="shipments-message">

            <div className="shipments-message-icon">
              📦
            </div>


            <h2>
              Loading shipments...
            </h2>


            <p>
              Please wait while we load
              your shipments.
            </p>

          </div>

        </main>

      </div>

    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (

      <div className="shipments-screen">

        <header className="shipments-header">

          <button
            className="shipments-back-button"
            type="button"
            onClick={() =>
              navigate("/home")
            }
          >
            ←
          </button>


          <h1>
            My Shipments
          </h1>


          <div></div>

        </header>


        <main className="shipments-content">

          <div className="shipments-message">

            <div className="shipments-message-icon">
              ⚠️
            </div>


            <h2>
              Something went wrong
            </h2>


            <p>
              {error}
            </p>


            <button
              className="try-again-button"
              type="button"
              onClick={loadShipments}
            >
              Try Again
            </button>

          </div>

        </main>

      </div>

    );

  }


  // ==========================================
  // NO SHIPMENTS
  // ==========================================

  if (
    shipments.length === 0
  ) {

    return (

      <div className="shipments-screen">

        <header className="shipments-header">

          <button
            className="shipments-back-button"
            type="button"
            onClick={() =>
              navigate("/home")
            }
          >
            ←
          </button>


          <h1>
            My Shipments
          </h1>


          <div></div>

        </header>


        <main className="shipments-content">

          <div className="shipments-message">

            <div className="shipments-message-icon">
              📦
            </div>


            <h2>
              No shipments yet
            </h2>


            <p>
              Your shipments will appear here.
            </p>


            <button
              className="create-shipment-button"
              type="button"
              onClick={() =>
                navigate(
                  "/send-parcel"
                )
              }
            >
              Send a Parcel
            </button>

          </div>

        </main>

      </div>

    );

  }


  // ==========================================
  // SHIPMENTS PAGE
  // ==========================================

  return (

    <div className="shipments-screen">


      {/* HEADER */}

      <header className="shipments-header">

        <button
          className="shipments-back-button"
          type="button"
          onClick={() =>
            navigate("/home")
          }
        >
          ←
        </button>


        <h1>
          My Shipments
        </h1>


        <div></div>

      </header>


      {/* CONTENT */}

      <main className="shipments-content">

        <div className="shipments-title">

          <h2>
            Your Shipments
          </h2>


          <p>
            Manage and track your parcels.
          </p>

        </div>


        <div className="shipments-list">

          {shipments.map(
            (shipment) => (

              <div
                className="shipment-item"
                key={shipment._id}
              >


                {/* TOP */}

                <div className="shipment-item-top">

                  <div className="shipment-item-icon">
                    📦
                  </div>


                  <div className="shipment-item-info">

                    <h3>
                      {
                        shipment.trackingNumber
                      }
                    </h3>


                    <p>
                      To:{" "}
                      {
                        shipment.receiverName
                      }
                    </p>

                  </div>


                  <span
                    className={`shipment-status ${getStatusClass(
                      shipment.status
                    )}`}
                  >
                    {
                      shipment.status ||
                      "Pending"
                    }
                  </span>

                </div>


                {/* DETAILS */}

                <div className="shipment-item-details">

                  <div>

                    <span>
                      Parcel
                    </span>


                    <strong>
                      {
                        shipment.parcelType ||
                        "N/A"
                      }
                    </strong>

                  </div>


                  <div>

                    <span>
                      Weight
                    </span>


                    <strong>
                      {
                        shipment.weight ||
                        0
                      }{" "}
                      kg
                    </strong>

                  </div>


                  <div>

                    <span>
                      Sender
                    </span>


                    <strong>
                      {
                        shipment.senderName ||
                        "N/A"
                      }
                    </strong>

                  </div>

                </div>


                {/* TRACKING */}

                <button
                  className="track-shipment-button"
                  type="button"
                  onClick={() => {

                    navigate(
                      `/home?tracking=${encodeURIComponent(
                        shipment.trackingNumber
                      )}`
                    );

                  }}
                >
                  Track Shipment
                </button>

              </div>

            )
          )}

        </div>

      </main>


      {/* BOTTOM NAVIGATION */}

      <nav className="bottom-navigation">

        <button
          className="bottom-nav-item"
          type="button"
          onClick={() =>
            navigate("/home")
          }
        >

          <span>
            ⌂
          </span>


          <small>
            Home
          </small>

        </button>


        <button
          className="bottom-nav-item active"
          type="button"
        >

          <span>
            ▣
          </span>


          <small>
            Shipments
          </small>

        </button>


        <button
          className="bottom-nav-item"
          type="button"
          onClick={() =>
            navigate("/home")
          }
        >

          <span>
            ⌖
          </span>


          <small>
            Track
          </small>

        </button>


        <button
          className="bottom-nav-item"
          type="button"
          onClick={() => {

            alert(
              "Profile page will be added soon."
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


export default Shipments;