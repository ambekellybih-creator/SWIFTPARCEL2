const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const Shipment = require("./models/Shipment");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "SwiftParcel backend is running!",
  });
});

// Create shipment
app.post("/api/shipments", async (req, res) => {
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

    // Generate tracking number
    const trackingNumber =
      "SP" +
      Date.now().toString().slice(-8) +
      Math.floor(100 + Math.random() * 900);

    const shipment = new Shipment({
      trackingNumber,
      senderName,
      senderPhone,
      senderAddress,
      receiverName,
      receiverPhone,
      receiverAddress,
      parcelType,
      weight,
    });

    await shipment.save();

    res.status(201).json({
      message: "Shipment created successfully!",
      shipment,
    });
  } catch (error) {
    console.error("Create shipment error:", error);

    res.status(500).json({
      message: "Failed to create shipment",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});