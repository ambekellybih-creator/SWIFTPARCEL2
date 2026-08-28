const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    trackingNumber: {
      type: String,
      unique: true,
      required: true,
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

    senderCity: {
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

    receiverCity: {
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

    deliveryDate: {
      type: Date,
      required: false,
    },

    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Shipment",
  shipmentSchema
);