const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Shipment = require("./models/Shipment");
const Admin = require("./models/Admin");
const User = require("./models/User");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "swiftparcel-development-secret-change-this";

// ======================================================
// FIXED ADMIN LOGIN
// ======================================================

const ADMIN_EMAIL = "adminswift@gmail.com";

const ADMIN_PASSWORD = "swiftparcel123";

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// ======================================================
// ENVIRONMENT CHECK
// ======================================================

console.log(
  "MONGO_URI loaded:",
  !!process.env.MONGO_URI
);

console.log(
  "JWT_SECRET loaded:",
  !!process.env.JWT_SECRET
);

// ======================================================
// MONGODB CONNECTION
// ======================================================

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log(
      "MongoDB connected successfully!"
    );
  })
  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error.message
    );
  });

// ======================================================
// TRACKING LOCATIONS
// ======================================================

const PICKUP_LOCATION = {
  city: "Buea",
  latitude: 4.156,
  longitude: 9.232,
};

const DESTINATION_LOCATION = {
  city: "Yaoundé",
  latitude: 3.848,
  longitude: 11.502,
};

// ======================================================
// CALCULATE TRACKING INFORMATION
// ======================================================

function calculateTrackingData(shipment) {
  const now = new Date();

  const createdAt =
    new Date(shipment.createdAt);

  const deliveryDate =
    shipment.deliveryDate
      ? new Date(shipment.deliveryDate)
      : null;

  // ----------------------------------------------------
  // If no delivery date exists
  // ----------------------------------------------------

  if (
    !deliveryDate ||
    Number.isNaN(
      deliveryDate.getTime()
    )
  ) {
    return {
      progress: 0,

      currentLocation: {
        city:
          PICKUP_LOCATION.city,

        latitude:
          PICKUP_LOCATION.latitude,

        longitude:
          PICKUP_LOCATION.longitude,
      },

      pickupLocation:
        PICKUP_LOCATION,

      destinationLocation:
        DESTINATION_LOCATION,
    };
  }

  // ----------------------------------------------------
  // Calculate progress based on time
  // ----------------------------------------------------

  let progress = 0;

  const totalDuration =
    deliveryDate.getTime() -
    createdAt.getTime();

  const elapsed =
    now.getTime() -
    createdAt.getTime();

  if (now < createdAt) {
    progress = 0;
  } else if (
    now >= deliveryDate
  ) {
    progress = 100;
  } else if (
    totalDuration > 0
  ) {
    progress =
      (elapsed /
        totalDuration) *
      100;
  }

  // Keep progress between 0 and 100
  progress = Math.max(
    0,
    Math.min(
      100,
      progress
    )
  );

  // ----------------------------------------------------
  // Calculate current position
  // ----------------------------------------------------

  const latitude =
    PICKUP_LOCATION.latitude +
    (
      DESTINATION_LOCATION.latitude -
      PICKUP_LOCATION.latitude
    ) *
      (progress / 100);

  const longitude =
    PICKUP_LOCATION.longitude +
    (
      DESTINATION_LOCATION.longitude -
      PICKUP_LOCATION.longitude
    ) *
      (progress / 100);

  // ----------------------------------------------------
  // Determine current city
  // ----------------------------------------------------

  let currentCity =
    "Buea";

  if (progress >= 90) {
    currentCity =
      "Yaoundé";
  } else if (progress >= 50) {
    currentCity =
      "En route";
  } else if (progress > 0) {
    currentCity =
      "In Transit";
  }

  // ----------------------------------------------------
  // Return tracking data
  // ----------------------------------------------------

  return {
    progress:
      Number(
        progress.toFixed(2)
      ),

    currentLocation: {
      city:
        currentCity,

      latitude:
        Number(
          latitude.toFixed(6)
        ),

      longitude:
        Number(
          longitude.toFixed(6)
        ),
    },

    pickupLocation:
      PICKUP_LOCATION,

    destinationLocation:
      DESTINATION_LOCATION,
  };
}

// ======================================================
// ADD TRACKING DATA TO SHIPMENT
// ======================================================

function shipmentWithTracking(
  shipment
) {
  const shipmentObject =
    shipment.toObject
      ? shipment.toObject()
      : shipment;

  const tracking =
    calculateTrackingData(
      shipment
    );

  return {
    ...shipmentObject,

    trackingProgress:
      tracking.progress,

    currentLocation:
      tracking.currentLocation,

    pickupLocation:
      tracking.pickupLocation,

    destinationLocation:
      tracking.destinationLocation,
  };
}

// ======================================================
// TEST ROUTE
// ======================================================

app.get("/", (req, res) => {
  res.json({
    message:
      "SwiftParcel backend is running!",
  });
});

// ======================================================
// CUSTOMER SIGN UP
// ======================================================

app.post(
  "/api/auth/signup",
  async (req, res) => {
    try {
      const {
        fullName,
        email,
        phone,
        password,
      } = req.body;

      if (
        !fullName ||
        !email ||
        !phone ||
        !password
      ) {
        return res.status(400).json({
          message:
            "Full name, email, phone and password are required.",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          message:
            "Password must be at least 6 characters.",
        });
      }

      const cleanEmail =
        email
          .trim()
          .toLowerCase();

      const cleanPhone =
        phone.trim();

      const existingEmail =
        await User.findOne({
          email:
            cleanEmail,
        });

      if (existingEmail) {
        return res.status(409).json({
          message:
            "An account with this email already exists.",
        });
      }

      const existingPhone =
        await User.findOne({
          phone:
            cleanPhone,
        });

      if (existingPhone) {
        return res.status(409).json({
          message:
            "An account with this phone number already exists.",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const user =
        new User({
          fullName:
            fullName.trim(),

          email:
            cleanEmail,

          phone:
            cleanPhone,

          password:
            hashedPassword,
        });

      await user.save();

      const token =
        jwt.sign(
          {
            userId:
              user._id,

            email:
              user.email,

            role:
              "customer",
          },

          JWT_SECRET,

          {
            expiresIn:
              "7d",
          }
        );

      return res.status(201).json({
        message:
          "Account created successfully.",

        token,

        role:
          "customer",

        user: {
          id:
            user._id,

          fullName:
            user.fullName,

          email:
            user.email,

          phone:
            user.phone,
        },
      });

    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to create account.",

        error:
          error.message,
      });
    }
  }
);

// ======================================================
// CUSTOMER LOGIN + ADMIN LOGIN
// ======================================================

app.post(
  "/api/auth/login",
  async (req, res) => {
    try {
      const {
        emailOrPhone,
        password,
      } = req.body;

      if (
        !emailOrPhone ||
        !password
      ) {
        return res.status(400).json({
          message:
            "Email/phone and password are required.",
        });
      }

      const loginValue =
        emailOrPhone.trim();

      // ==================================================
      // ADMIN LOGIN
      // ==================================================

      if (
        loginValue.toLowerCase() ===
          ADMIN_EMAIL &&
        password ===
          ADMIN_PASSWORD
      ) {
        const adminToken =
          jwt.sign(
            {
              adminId:
                "swiftparcel-admin",

              email:
                ADMIN_EMAIL,

              role:
                "admin",
            },

            JWT_SECRET,

            {
              expiresIn:
                "24h",
            }
          );

        console.log(
          "Admin login successful."
        );

        return res.status(200).json({
          message:
            "Admin login successful.",

          token:
            adminToken,

          role:
            "admin",

          admin: {
            email:
              ADMIN_EMAIL,

            role:
              "admin",
          },
        });
      }

      // ==================================================
      // CUSTOMER LOGIN
      // ==================================================

      let user;

      if (
        loginValue.includes("@")
      ) {
        user =
          await User.findOne({
            email:
              loginValue.toLowerCase(),
          });
      } else {
        user =
          await User.findOne({
            phone:
              loginValue,
          });
      }

      if (!user) {
        return res.status(401).json({
          message:
            "Invalid email/phone or password.",
        });
      }

      const passwordMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!passwordMatch) {
        return res.status(401).json({
          message:
            "Invalid email/phone or password.",
        });
      }

      const token =
        jwt.sign(
          {
            userId:
              user._id,

            email:
              user.email,

            role:
              "customer",
          },

          JWT_SECRET,

          {
            expiresIn:
              "7d",
          }
        );

      return res.status(200).json({
        message:
          "Login successful.",

        token,

        role:
          "customer",

        user: {
          id:
            user._id,

          fullName:
            user.fullName,

          email:
            user.email,

          phone:
            user.phone,
        },
      });

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      return res.status(500).json({
        message:
          error.message ||
          "Unknown login server error.",
      });
    }
  }
);

// ======================================================
// CUSTOMER AUTHENTICATION
// ======================================================

const authenticateUser = (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message:
          "Authentication required.",
      });
    }

    const parts =
      authHeader.split(" ");

    if (
      parts.length !== 2 ||
      parts[0] !== "Bearer"
    ) {
      return res.status(401).json({
        message:
          "Invalid authentication format.",
      });
    }

    const token =
      parts[1];

    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      );

    if (
      !decoded.userId ||
      decoded.role !==
        "customer"
    ) {
      return res.status(401).json({
        message:
          "Customer authentication required.",
      });
    }

    req.user =
      decoded;

    next();

  } catch (error) {
    console.error(
      "User authentication error:",
      error.message
    );

    return res.status(401).json({
      message:
        "Invalid or expired user token.",
    });
  }
};

// ======================================================
// ADMIN AUTHENTICATION
// ======================================================

const authenticateAdmin = (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message:
          "Authentication required.",
      });
    }

    const parts =
      authHeader.split(" ");

    if (
      parts.length !== 2 ||
      parts[0] !== "Bearer"
    ) {
      return res.status(401).json({
        message:
          "Invalid authentication format.",
      });
    }

    const token =
      parts[1];

    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      );

    if (
      !decoded.adminId ||
      decoded.role !==
        "admin"
    ) {
      return res.status(401).json({
        message:
          "Admin authentication required.",
      });
    }

    req.admin =
      decoded;

    next();

  } catch (error) {
    console.error(
      "Admin authentication error:",
      error.message
    );

    return res.status(401).json({
      message:
        "Invalid or expired admin token.",
    });
  }
};

// ======================================================
// CURRENT CUSTOMER
// ======================================================

app.get(
  "/api/auth/me",
  authenticateUser,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user.userId
        ).select("-password");

      if (!user) {
        return res.status(404).json({
          message:
            "User not found.",
        });
      }

      return res.status(200).json({
        user,
      });

    } catch (error) {
      console.error(
        "Get current user error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to get user information.",
      });
    }
  }
);

// ======================================================
// VERIFY ADMIN
// ======================================================

app.get(
  "/api/admin/verify",
  authenticateAdmin,
  (req, res) => {
    return res.status(200).json({
      authenticated:
        true,

      admin:
        req.admin,
    });
  }
);

// ======================================================
// CREATE SHIPMENT - CUSTOMER
// ======================================================

app.post(
  "/api/shipments",
  authenticateUser,
  async (req, res) => {
    try {
      const {
        senderName,
        senderPhone,
        senderAddress,
        senderCity,

        receiverName,
        receiverPhone,
        receiverAddress,
        receiverCity,

        parcelType,
        weight,
        deliveryDate,
      } = req.body;

      if (
        !senderName ||
        !senderPhone ||
        !senderAddress ||
        !senderCity ||

        !receiverName ||
        !receiverPhone ||
        !receiverAddress ||
        !receiverCity ||

        !parcelType ||
        weight === undefined ||
        weight === null ||
        !deliveryDate
      ) {
        return res.status(400).json({
          message:
            "Please provide all required shipment information.",
        });
      }

      if (
        Number(weight) <= 0 ||
        Number.isNaN(
          Number(weight)
        )
      ) {
        return res.status(400).json({
          message:
            "Parcel weight must be greater than 0.",
        });
      }

      const parsedDeliveryDate =
        new Date(deliveryDate);

      if (
        Number.isNaN(
          parsedDeliveryDate.getTime()
        )
      ) {
        return res.status(400).json({
          message:
            "Please provide a valid delivery date.",
        });
      }

      // Delivery date cannot be before now
      if (
        parsedDeliveryDate <
        new Date()
      ) {
        return res.status(400).json({
          message:
            "Delivery date cannot be in the past.",
        });
      }

      const trackingNumber =
        "SP" +
        Date.now()
          .toString()
          .slice(-8) +
        Math.floor(
          100 +
          Math.random() *
            900
        );

      const shipment =
        new Shipment({
          user:
            req.user.userId,

          trackingNumber,

          senderName:
            senderName.trim(),

          senderPhone:
            senderPhone.trim(),

          senderAddress:
            senderAddress.trim(),

          senderCity:
            senderCity.trim(),

          receiverName:
            receiverName.trim(),

          receiverPhone:
            receiverPhone.trim(),

          receiverAddress:
            receiverAddress.trim(),

          receiverCity:
            receiverCity.trim(),

          parcelType:
            parcelType.trim(),

          weight:
            Number(weight),

          deliveryDate:
            parsedDeliveryDate,

          status:
            "Pending",

          pickupLocation:
            PICKUP_LOCATION,

          destinationLocation:
            DESTINATION_LOCATION,

          currentLocation:
            PICKUP_LOCATION,

          trackingProgress:
            0,
        });

      await shipment.save();

      console.log(
        "Shipment created:",
        trackingNumber
      );

      return res.status(201).json({
        message:
          "Shipment created successfully!",

        shipment:
          shipmentWithTracking(
            shipment
          ),
      });

    } catch (error) {
      console.error(
        "Create shipment error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to create shipment.",

        error:
          error.message,
      });
    }
  }
);

// ======================================================
// CUSTOMER SHIPMENTS
// ======================================================

app.get(
  "/api/my-shipments",
  authenticateUser,
  async (req, res) => {
    try {
      const shipments =
        await Shipment.find({
          user:
            req.user.userId,
        }).sort({
          createdAt:
            -1,
        });

      const shipmentsWithTracking =
        shipments.map(
          shipment =>
            shipmentWithTracking(
              shipment
            )
        );

      return res.status(200).json({
        shipments:
          shipmentsWithTracking,
      });

    } catch (error) {
      console.error(
        "Get customer shipments error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to get your shipments.",

        error:
          error.message,
      });
    }
  }
);

// ======================================================
// GET ONE SHIPMENT - CUSTOMER
// ======================================================

app.get(
  "/api/my-shipments/:trackingNumber",
  authenticateUser,
  async (req, res) => {
    try {
      const trackingNumber =
        req.params.trackingNumber.trim();

      const shipment =
        await Shipment.findOne({
          trackingNumber,

          user:
            req.user.userId,
        });

      if (!shipment) {
        return res.status(404).json({
          message:
            "Shipment not found.",
        });
      }

      return res.status(200).json({
        shipment:
          shipmentWithTracking(
            shipment
          ),
      });

    } catch (error) {
      console.error(
        "Get customer shipment error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to get shipment.",
      });
    }
  }
);

// ======================================================
// EDIT ENTIRE SHIPMENT - CUSTOMER
// ======================================================

app.put(
  "/api/shipments/:trackingNumber",
  authenticateUser,
  async (req, res) => {
    try {
      const trackingNumber =
        req.params.trackingNumber.trim();

      const {
        senderName,
        senderPhone,
        senderAddress,
        senderCity,

        receiverName,
        receiverPhone,
        receiverAddress,
        receiverCity,

        parcelType,
        weight,
        deliveryDate,
      } = req.body;

      if (
        !senderName ||
        !senderPhone ||
        !senderAddress ||
        !senderCity ||

        !receiverName ||
        !receiverPhone ||
        !receiverAddress ||
        !receiverCity ||

        !parcelType ||
        weight === undefined ||
        weight === null ||
        !deliveryDate
      ) {
        return res.status(400).json({
          message:
            "Please provide all required shipment information.",
        });
      }

      if (
        Number(weight) <= 0 ||
        Number.isNaN(
          Number(weight)
        )
      ) {
        return res.status(400).json({
          message:
            "Parcel weight must be greater than 0.",
        });
      }

      const parsedDeliveryDate =
        new Date(deliveryDate);

      if (
        Number.isNaN(
          parsedDeliveryDate.getTime()
        )
      ) {
        return res.status(400).json({
          message:
            "Please provide a valid delivery date.",
        });
      }

      const shipment =
        await Shipment.findOne({
          trackingNumber,

          user:
            req.user.userId,
        });

      if (!shipment) {
        return res.status(404).json({
          message:
            "Shipment not found or you do not have permission to edit it.",
        });
      }

      if (
        shipment.status ===
        "Delivered"
      ) {
        return res.status(400).json({
          message:
            "A delivered shipment can no longer be edited.",
        });
      }

      shipment.senderName =
        senderName.trim();

      shipment.senderPhone =
        senderPhone.trim();

      shipment.senderAddress =
        senderAddress.trim();

      shipment.senderCity =
        senderCity.trim();

      shipment.receiverName =
        receiverName.trim();

      shipment.receiverPhone =
        receiverPhone.trim();

      shipment.receiverAddress =
        receiverAddress.trim();

      shipment.receiverCity =
        receiverCity.trim();

      shipment.parcelType =
        parcelType.trim();

      shipment.weight =
        Number(weight);

      shipment.deliveryDate =
        parsedDeliveryDate;

      await shipment.save();

      return res.status(200).json({
        message:
          "Shipment updated successfully.",

        shipment:
          shipmentWithTracking(
            shipment
          ),
      });

    } catch (error) {
      console.error(
        "Edit shipment error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to update shipment.",

        error:
          error.message,
      });
    }
  }
);

// ======================================================
// EDIT RECEIVER - CUSTOMER
// ======================================================

app.put(
  "/api/shipments/:trackingNumber/receiver",
  authenticateUser,
  async (req, res) => {
    try {
      const trackingNumber =
        req.params.trackingNumber.trim();

      const {
        receiverName,
        receiverPhone,
        receiverAddress,
        receiverCity,
      } = req.body;

      if (
        !receiverName ||
        !receiverPhone ||
        !receiverAddress ||
        !receiverCity
      ) {
        return res.status(400).json({
          message:
            "Receiver name, phone, address and city are required.",
        });
      }

      const shipment =
        await Shipment.findOne({
          trackingNumber,

          user:
            req.user.userId,
        });

      if (!shipment) {
        return res.status(404).json({
          message:
            "Shipment not found or you do not have permission to edit it.",
        });
      }

      if (
        shipment.status ===
        "Delivered"
      ) {
        return res.status(400).json({
          message:
            "A delivered shipment can no longer be edited.",
        });
      }

      shipment.receiverName =
        receiverName.trim();

      shipment.receiverPhone =
        receiverPhone.trim();

      shipment.receiverAddress =
        receiverAddress.trim();

      shipment.receiverCity =
        receiverCity.trim();

      await shipment.save();

      return res.status(200).json({
        message:
          "Receiver information updated successfully.",

        shipment:
          shipmentWithTracking(
            shipment
          ),
      });

    } catch (error) {
      console.error(
        "Edit receiver error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to update receiver information.",
      });
    }
  }
);

// ======================================================
// PUBLIC TRACK SHIPMENT
// ======================================================

app.get(
  "/api/shipments/:trackingNumber",
  async (req, res) => {
    try {
      const trackingNumber =
        req.params.trackingNumber.trim();

      const shipment =
        await Shipment.findOne({
          trackingNumber,
        });

      if (!shipment) {
        return res.status(404).json({
          message:
            "Shipment not found.",
        });
      }

      return res.status(200).json({
        message:
          "Shipment found.",

        shipment:
          shipmentWithTracking(
            shipment
          ),
      });

    } catch (error) {
      console.error(
        "Tracking error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to track shipment.",

        error:
          error.message,
      });
    }
  }
);

// ======================================================
// GET ALL SHIPMENTS - ADMIN
// ======================================================

app.get(
  "/api/shipments",
  authenticateAdmin,
  async (req, res) => {
    try {
      const shipments =
        await Shipment.find()
          .sort({
            createdAt:
              -1,
          });

      const shipmentsWithTracking =
        shipments.map(
          shipment =>
            shipmentWithTracking(
              shipment
            )
        );

      return res.status(200).json({
        shipments:
          shipmentsWithTracking,
      });

    } catch (error) {
      console.error(
        "Get shipments error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to get shipments.",

        error:
          error.message,
      });
    }
  }
);

// ======================================================
// UPDATE SHIPMENT STATUS - ADMIN
// ======================================================

app.put(
  "/api/shipments/:trackingNumber/status",
  authenticateAdmin,
  async (req, res) => {
    try {
      const trackingNumber =
        req.params.trackingNumber.trim();

      const {
        status,
      } = req.body;

      const allowedStatuses = [
        "Pending",
        "Picked Up",
        "In Transit",
        "Out for Delivery",
        "Delivered",
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid shipment status.",
        });
      }

      const shipment =
        await Shipment.findOneAndUpdate(
          {
            trackingNumber,
          },

          {
            status,
          },

          {
            new: true,
          }
        );

      if (!shipment) {
        return res.status(404).json({
          message:
            "Shipment not found.",
        });
      }

      return res.status(200).json({
        message:
          "Shipment status updated successfully.",

        shipment:
          shipmentWithTracking(
            shipment
          ),
      });

    } catch (error) {
      console.error(
        "Update status error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to update shipment status.",

        error:
          error.message,
      });
    }
  }
);

// ======================================================
// DELETE SHIPMENT - ADMIN
// ======================================================

app.delete(
  "/api/shipments/:trackingNumber",
  authenticateAdmin,
  async (req, res) => {
    try {
      const trackingNumber =
        req.params.trackingNumber.trim();

      const shipment =
        await Shipment.findOneAndDelete({
          trackingNumber,
        });

      if (!shipment) {
        return res.status(404).json({
          message:
            "Shipment not found.",
        });
      }

      return res.status(200).json({
        message:
          "Shipment deleted successfully!",
      });

    } catch (error) {
      console.error(
        "Delete shipment error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to delete shipment.",

        error:
          error.message,
      });
    }
  }
);

// ======================================================
// START SERVER
// ======================================================

app.listen(
  PORT,
  () => {
    console.log(
      `SwiftParcel backend running on port ${PORT}`
    );
  }
);