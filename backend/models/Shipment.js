const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema(
  {
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
    },

    senderName: {
      type: String,
      required: true,
    },

    senderPhone: {
      type: String,
      required: true,
    },

    senderAddress: {
      type: String,
      required: true,
    },

    receiverName: {
      type: String,
      required: true,
    },

    receiverPhone: {
      type: String,
      required: true,
    },

    receiverAddress: {
      type: String,
      required: true,
    },

    parcelType: {
      type: String,
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    deliveryStatus: {
      type: String,
      default: "Pending",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Shipment", shipmentSchema);

