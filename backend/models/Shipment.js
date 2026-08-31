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

    // ==================================================
    // SENDER
    // ==================================================

    senderName: {
      type: String,
      required: true,
      trim: true,
    },

    senderPhone: {
      type: String,
      required: true,
      trim: true,
    },

    senderAddress: {
      type: String,
      required: true,
      trim: true,
    },

    senderCity: {
      type: String,
      required: true,
      trim: true,
    },

    // ==================================================
    // RECEIVER
    // ==================================================

    receiverName: {
      type: String,
      required: true,
      trim: true,
    },

    receiverPhone: {
      type: String,
      required: true,
      trim: true,
    },

    receiverAddress: {
      type: String,
      required: true,
      trim: true,
    },

    receiverCity: {
      type: String,
      required: true,
      trim: true,
    },

    // ==================================================
    // PARCEL
    // ==================================================

    parcelType: {
      type: String,
      required: true,
      trim: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    // ==================================================
    // DELIVERY
    // ==================================================

    deliveryDate: {
      type: Date,
      required: false,
    },

    // ==================================================
    // SHIPMENT STATUS
    // ==================================================

    status: {
      type: String,
      enum: [
        "Pending",
        "Picked Up",
        "In Transit",
        "Out for Delivery",
        "Delivered",
      ],
      default: "Pending",
    },

    // ==================================================
    // TRACKING MAP
    // ==================================================

    // Pickup location
    pickupLocation: {
      city: {
        type: String,
        default: "Buea",
      },

      latitude: {
        type: Number,
        default: 4.156,
      },

      longitude: {
        type: Number,
        default: 9.232,
      },
    },

    // Destination location
    destinationLocation: {
      city: {
        type: String,
        default: "Yaoundé",
      },

      latitude: {
        type: Number,
        default: 3.848,
      },

      longitude: {
        type: Number,
        default: 11.502,
      },
    },

    // Current parcel position
    currentLocation: {
      city: {
        type: String,
        default: "Buea",
      },

      latitude: {
        type: Number,
        default: 4.156,
      },

      longitude: {
        type: Number,
        default: 9.232,
      },
    },

    // ==================================================
    // TRACKING PROGRESS
    // ==================================================

    trackingProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // ==================================================
    // DELIVERY AGENT
    // ==================================================

    deliveryAgent: {
      name: {
        type: String,
        default: "SwiftParcel Agent",
      },

      phone: {
        type: String,
        default: "",
      },
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