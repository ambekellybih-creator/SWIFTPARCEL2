const express = require("express");
const Shipment = require("../models/Shipment");

const router = express.Router();


// Create a shipment
router.post("/", async (req, res) => {
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

    const trackingNumber =
      "SP" +
      Date.now().toString().slice(-8);

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
      success: true,
      message: "Shipment created successfully",
      shipment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create shipment",
      error: error.message,
    });
  }
});


// Get a shipment by tracking number
router.get("/:trackingNumber", async (req, res) => {
  try {
    const shipment = await Shipment.findOne({
      trackingNumber: req.params.trackingNumber,
    });

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    res.json({
      success: true,
      shipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to find shipment",
    });
  }
});


module.exports = router;