import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RateCalculator.css";


// ======================================================
// ICON
// ======================================================

const Icon = ({ name, size = 22, stroke = 2 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (name) {
    case "arrow-left":
      return (
        <svg {...common}>
          <path d="M15 18l-6-6 6-6" />
        </svg>
      );

    case "location":
      return (
        <svg {...common}>
          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );

    case "chevron":
      return (
        <svg {...common}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );

    case "weight":
      return (
        <svg {...common}>
          <path d="M6 7h12l2 14H4L6 7Z" />
          <path d="M9 7a3 3 0 0 1 6 0" />
        </svg>
      );

    case "document":
      return (
        <svg {...common}>
          <path d="M6 3h8l4 4v14H6z" />
          <path d="M14 3v5h5" />
          <path d="M9 13h6" />
          <path d="M9 17h6" />
        </svg>
      );

    case "package":
      return (
        <svg {...common}>
          <path d="m21 8-9-5-9 5 9 5 9-5Z" />
          <path d="M3 8v8l9 5 9-5V8" />
          <path d="M12 13v8" />
        </svg>
      );

    case "fragile":
      return (
        <svg {...common}>
          <path d="M8 3h8" />
          <path d="M9 3v6l-4 8a3 3 0 0 0 3 4h8a3 3 0 0 0 3-4l-4-8V3" />
          <path d="M8 15h8" />
        </svg>
      );

    default:
      return null;
  }
};


// ======================================================
// RATE CALCULATOR
// ======================================================

function RateCalculator() {
  const navigate = useNavigate();


  // ======================================================
  // STATE
  // ======================================================

  const [from, setFrom] = useState("Buea, Cameroon");

  const [to, setTo] = useState("Yaoundé, Cameroon");

  const [weight, setWeight] = useState("2");

  const [unit, setUnit] = useState("kg");

  const [parcelType, setParcelType] =
    useState("Documents");

  const [price, setPrice] = useState(3500);

  const [deliveryTime, setDeliveryTime] =
    useState("2 - 3 days");


  // ======================================================
  // CALCULATE RATE
  // ======================================================

  useEffect(() => {
    const numericWeight =
      parseFloat(weight) || 0;

    let basePrice = 3500;

    // --------------------------------------------------
    // LOCATION
    // --------------------------------------------------

    const fromLower = from.toLowerCase();
    const toLower = to.toLowerCase();

    const isBueaYaounde =
      fromLower.includes("buea") &&
      toLower.includes("yaound");

    const isYaoundeBuea =
      fromLower.includes("yaound") &&
      toLower.includes("buea");

    if (isBueaYaounde || isYaoundeBuea) {
      basePrice = 3500;
      setDeliveryTime("2 - 3 days");
    } else {
      basePrice = 4000;
      setDeliveryTime("2 - 4 days");
    }


    // --------------------------------------------------
    // WEIGHT
    // --------------------------------------------------

    if (numericWeight <= 1) {
      basePrice = basePrice - 500;
    } else if (numericWeight <= 2) {
      // Default/reference price
      basePrice = basePrice;
    } else if (numericWeight <= 5) {
      basePrice += 1000;
    } else if (numericWeight <= 10) {
      basePrice += 2500;
    } else {
      basePrice += 2500;

      const extraWeight =
        Math.ceil(numericWeight - 10);

      basePrice += extraWeight * 500;
    }


    // --------------------------------------------------
    // PARCEL TYPE
    // --------------------------------------------------

    if (parcelType === "Package") {
      basePrice += 500;
    }

    if (parcelType === "Fragile") {
      basePrice += 1000;
    }


    // --------------------------------------------------
    // MINIMUM PRICE
    // --------------------------------------------------

    if (basePrice < 2500) {
      basePrice = 2500;
    }


    setPrice(basePrice);

  }, [
    from,
    to,
    weight,
    parcelType,
  ]);


  // ======================================================
  // FORMAT PRICE
  // ======================================================

  const formattedPrice =
    new Intl.NumberFormat("en-US").format(price);


  // ======================================================
  // CONTINUE
  // ======================================================

  const handleGetStarted = () => {

    navigate("/send-parcel", {
      state: {
        from,
        to,
        weight,
        unit,
        parcelType,
        estimatedPrice: price,
      },
    });

  };


  // ======================================================
  // BACK
  // ======================================================

  const handleBack = () => {
    navigate(-1);
  };


  return (
    <div className="rate-page">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="rate-header">

        <button
          className="back-button"
          onClick={handleBack}
          aria-label="Go back"
        >
          <Icon
            name="arrow-left"
            size={23}
          />
        </button>

        <h1>
          Rate Calculator
        </h1>

        <div className="header-spacer" />

      </header>


      {/* ==================================================
          FORM
      ================================================== */}

      <main className="rate-content">


        {/* ==================================================
            FROM
        ================================================== */}

        <div className="rate-field">

          <label>
            From
          </label>

          <div className="input-wrapper">

            <Icon
              name="location"
              size={18}
            />

            <input
              type="text"
              value={from}
              onChange={(e) =>
                setFrom(e.target.value)
              }
              placeholder="Enter pickup location"
            />

          </div>

        </div>


        {/* ==================================================
            TO
        ================================================== */}

        <div className="rate-field">

          <label>
            To
          </label>

          <div className="input-wrapper">

            <Icon
              name="location"
              size={18}
            />

            <input
              type="text"
              value={to}
              onChange={(e) =>
                setTo(e.target.value)
              }
              placeholder="Enter destination"
            />

          </div>

        </div>


        {/* ==================================================
            WEIGHT
        ================================================== */}

        <div className="rate-field">

          <label>
            Weight
          </label>

          <div className="weight-row">

            <div className="weight-input">

              <input
                type="number"
                min="0.1"
                step="0.1"
                value={weight}
                onChange={(e) =>
                  setWeight(e.target.value)
                }
                placeholder="0"
              />

            </div>


            <div className="unit-select">

              <select
                value={unit}
                onChange={(e) =>
                  setUnit(e.target.value)
                }
              >
                <option value="kg">
                  kg
                </option>

                <option value="g">
                  g
                </option>
              </select>

              <Icon
                name="chevron"
                size={16}
              />

            </div>

          </div>

        </div>


        {/* ==================================================
            PARCEL TYPE
        ================================================== */}

        <div className="rate-field">

          <label>
            Parcel type
          </label>

          <div className="parcel-select">

            <div className="parcel-select-icon">

              {parcelType === "Documents" && (
                <Icon
                  name="document"
                  size={17}
                />
              )}

              {parcelType === "Package" && (
                <Icon
                  name="package"
                  size={17}
                />
              )}

              {parcelType === "Fragile" && (
                <Icon
                  name="fragile"
                  size={17}
                />
              )}

            </div>


            <select
              value={parcelType}
              onChange={(e) =>
                setParcelType(e.target.value)
              }
            >

              <option value="Documents">
                Documents
              </option>

              <option value="Package">
                Package
              </option>

              <option value="Fragile">
                Fragile
              </option>

            </select>


            <Icon
              name="chevron"
              size={17}
            />

          </div>

        </div>


        {/* ==================================================
            ESTIMATED PRICE
        ================================================== */}

        <section className="price-card">

          <p className="price-label">
            Estimated Price
          </p>

          <h2>
            {formattedPrice}
            <span>
              {" "}XAF
            </span>
          </h2>

          <div className="delivery-info">

            <span className="delivery-dot" />

            <span>
              Delivery: {deliveryTime}
            </span>

          </div>

        </section>


        {/* ==================================================
            GET STARTED
        ================================================== */}

        <button
          className="get-started-button"
          onClick={handleGetStarted}
        >
          Get Started
        </button>


      </main>

    </div>
  );
}

export default RateCalculator;