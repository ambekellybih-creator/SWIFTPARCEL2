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
// MIDDLEWARE
// ======================================================

app.use(cors());

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
      error
    );
  });


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
        email.trim().toLowerCase();

      const cleanPhone =
        phone.trim();

      const existingEmail =
        await User.findOne({
          email: cleanEmail,
        });

      if (existingEmail) {
        return res.status(409).json({
          message:
            "An account with this email already exists.",
        });
      }

      const existingPhone =
        await User.findOne({
          phone: cleanPhone,
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
          },
          JWT_SECRET,
          {
            expiresIn:
              "7d",
          }
        );

      res.status(201).json({
        message:
          "Account created successfully.",

        token,

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

      res.status(500).json({
        message:
          "Failed to create account.",

        error:
          error.message,
      });
    }
  }
);


// ======================================================
// CUSTOMER LOGIN
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
          },
          JWT_SECRET,
          {
            expiresIn:
              "7d",
          }
        );

      res.status(200).json({
        message:
          "Login successful.",

        token,

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
        "Customer login error:",
        error
      );

      res.status(500).json({
        message:
          "Login failed.",

        error:
          error.message,
      });
    }
  }
);


// ======================================================
// CUSTOMER AUTHENTICATION MIDDLEWARE
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

    if (!decoded.userId) {
      return res.status(401).json({
        message:
          "Invalid user token.",
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
// GET CURRENT CUSTOMER
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

      res.status(200).json({
        user,
      });

    } catch (error) {
      console.error(
        "Get current user error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to get user information.",
      });
    }
  }
);


// ======================================================
// CREATE ADMIN ACCOUNT
// ======================================================

app.post(
  "/api/admin/create",
  async (req, res) => {
    try {
      const {
        username,
        password,
      } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          message:
            "Username and password are required.",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          message:
            "Password must be at least 6 characters.",
        });
      }

      const existingAdmin =
        await Admin.findOne({
          username:
            username.trim(),
        });

      if (existingAdmin) {
        return res.status(409).json({
          message:
            "Admin username already exists.",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const admin =
        new Admin({
          username:
            username.trim(),

          password:
            hashedPassword,
        });

      await admin.save();

      res.status(201).json({
        message:
          "Admin account created successfully!",
      });

    } catch (error) {
      console.error(
        "Create admin error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to create admin account.",

        error:
          error.message,
      });
    }
  }
);


// ======================================================
// RESET ADMIN PASSWORD
// ======================================================

app.post(
  "/api/admin/reset-password",
  async (req, res) => {
    try {
      const {
        username,
        newPassword,
      } = req.body;

      if (
        !username ||
        !newPassword
      ) {
        return res.status(400).json({
          message:
            "Username and new password are required.",
        });
      }

      const admin =
        await Admin.findOne({
          username:
            username.trim(),
        });

      if (!admin) {
        return res.status(404).json({
          message:
            "Admin username not found.",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      admin.password =
        hashedPassword;

      await admin.save();

      res.status(200).json({
        message:
          "Admin password reset successfully!",
      });

    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to reset admin password.",

        error:
          error.message,
      });
    }
  }
);


// ======================================================
// ADMIN LOGIN
// ======================================================

app.post(
  "/api/admin/login",
  async (req, res) => {
    try {
      const {
        username,
        password,
      } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          message:
            "Username and password are required.",
        });
      }

      const admin =
        await Admin.findOne({
          username:
            username.trim(),
        });

      if (!admin) {
        return res.status(401).json({
          message:
            "Invalid username or password.",
        });
      }

      const passwordMatch =
        await bcrypt.compare(
          password,
          admin.password
        );

      if (!passwordMatch) {
        return res.status(401).json({
          message:
            "Invalid username or password.",
        });
      }

      const token =
        jwt.sign(
          {
            adminId:
              admin._id,

            username:
              admin.username,
          },
          JWT_SECRET,
          {
            expiresIn:
              "24h",
          }
        );

      res.status(200).json({
        message:
          "Admin login successful.",

        token,

        admin: {
          id:
            admin._id,

          username:
            admin.username,
        },
      });

    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      res.status(500).json({
        message:
          "Login failed.",

        error:
          error.message,
      });
    }
  }
);


// ======================================================
// ADMIN AUTHENTICATION MIDDLEWARE
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

    if (!decoded.adminId) {
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
// VERIFY ADMIN TOKEN
// ======================================================

app.get(
  "/api/admin/verify",
  authenticateAdmin,
  (req, res) => {
    res.status(200).json({
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
        receiverName,
        receiverPhone,
        receiverAddress,
        parcelType,
        weight,
      } = req.body;

      if (
        !senderName ||
        !senderPhone ||
        !senderAddress ||
        !receiverName ||
        !receiverPhone ||
        !receiverAddress ||
        !parcelType ||
        !weight
      ) {
        return res.status(400).json({
          message:
            "Please provide all required shipment information.",
        });
      }

      const trackingNumber =
        "SP" +
        Date.now()
          .toString()
          .slice(-8) +
        Math.floor(
          100 +
          Math.random() * 900
        );

      const shipment =
        new Shipment({
          user:
            req.user.userId,

          trackingNumber,

          senderName,

          senderPhone,

          senderAddress,

          receiverName,

          receiverPhone,

          receiverAddress,

          parcelType,

          weight,

          status:
            "Pending",
        });

      await shipment.save();

      res.status(201).json({
        message:
          "Shipment created successfully!",

        shipment,
      });

    } catch (error) {
      console.error(
        "Create shipment error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to create shipment.",

        error:
          error.message,
      });
    }
  }
);


// ======================================================
// GET CUSTOMER'S SHIPMENTS
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

      res.status(200).json({
        shipments,
      });

    } catch (error) {
      console.error(
        "Get customer shipments error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to get your shipments.",

        error:
          error.message,
      });
    }
  }
);


// ======================================================
// FIND SHIPMENT BY TRACKING NUMBER
// ======================================================

app.get(
  "/api/shipments/:trackingNumber",
  async (req, res) => {
    try {
      const trackingNumber =
        req.params.trackingNumber.trim();

      const shipment =
        await Shipment.findOne({
          trackingNumber:
            trackingNumber,
        });

      if (!shipment) {
        return res.status(404).json({
          message:
            "Shipment not found.",
        });
      }

      res.status(200).json({
        message:
          "Shipment found.",

        shipment,
      });

    } catch (error) {
      console.error(
        "Tracking error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to track shipment.",

        error:
          error.message,
      });
    }
  }
);


// ======================================================
// GET ALL SHIPMENTS - ADMIN ONLY
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

      res.status(200).json({
        shipments,
      });

    } catch (error) {
      console.error(
        "Get shipments error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to get shipments.",

        error:
          error.message,
      });
    }
  }
);


// ======================================================
// UPDATE SHIPMENT STATUS - ADMIN ONLY
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
            trackingNumber:
              trackingNumber,
          },

          {
            status:
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

      res.status(200).json({
        message:
          "Shipment status updated successfully.",

        shipment,
      });

    } catch (error) {
      console.error(
        "Update status error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update shipment status.",

        error:
          error.message,
      });
    }
  }
);


// ======================================================
// DELETE SHIPMENT - ADMIN ONLY
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
          trackingNumber:
            trackingNumber,
        });

      if (!shipment) {
        return res.status(404).json({
          message:
            "Shipment not found.",
        });
      }

      res.status(200).json({
        message:
          "Shipment deleted successfully!",
      });

    } catch (error) {
      console.error(
        "Delete shipment error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to delete shipment.",

        error:
          error.message,
      });
    }
  }
);


// ======================================================
// CHECK ADMINS
// ======================================================

app.get(
  "/api/admin/check",
  async (req, res) => {
    try {
      const admins =
        await Admin.find()
          .select("username");

      res.json({
        admins,
      });

    } catch (error) {
      res.status(500).json({
        message:
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
      `Server running on port ${PORT}`
    );
  }
);