const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const Shipment = require("./models/Shipment");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());


// ==========================================
// CHECK MONGO URI
// ==========================================

console.log(
  "MONGO_URI loaded:",
  !!process.env.MONGO_URI
);


// ==========================================
// MONGODB CONNECTION
// ==========================================

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000
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


// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {

  res.json({
    message:
      "SwiftParcel backend is running!"
  });

});


// ==========================================
// CREATE SHIPMENT
// ==========================================

app.post(
  "/api/shipments",
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
        weight
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
            "Please provide all required shipment information."

        });

      }


      const trackingNumber =
        "SP" +
        Date.now()
          .toString()
          .slice(-8) +
        Math.floor(
          100 + Math.random() * 900
        );


      const shipment =
        new Shipment({

          trackingNumber,

          senderName,

          senderPhone,

          senderAddress,

          receiverName,

          receiverPhone,

          receiverAddress,

          parcelType,

          weight,

          status: "Pending"

        });


      await shipment.save();


      res.status(201).json({

        message:
          "Shipment created successfully!",

        shipment

      });


    } catch (error) {

      console.error(
        "Create shipment error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to create shipment",

        error:
          error.message

      });

    }

  }
);


// ==========================================
// GET ALL SHIPMENTS
// ==========================================

app.get(
  "/api/shipments",
  async (req, res) => {

    try {

      const shipments =
        await Shipment.find()
          .sort({
            createdAt: -1
          });


      res.status(200).json({

        shipments

      });


    } catch (error) {

      console.error(
        "Get shipments error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to get shipments",

        error:
          error.message

      });

    }

  }
);


// ==========================================
// FIND ONE SHIPMENT
// ==========================================

app.get(
  "/api/shipments/:trackingNumber",
  async (req, res) => {

    try {

      const trackingNumber =
        req.params.trackingNumber.trim();


      const shipment =
        await Shipment.findOne({

          trackingNumber:
            trackingNumber

        });


      if (!shipment) {

        return res.status(404).json({

          message:
            "Shipment not found"

        });

      }


      res.status(200).json({

        message:
          "Shipment found",

        shipment

      });


    } catch (error) {

      console.error(
        "Tracking error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to track shipment",

        error:
          error.message

      });

    }

  }
);


// ==========================================
// UPDATE SHIPMENT STATUS
// ==========================================

app.put(
  "/api/shipments/:trackingNumber/status",
  async (req, res) => {

    try {

      const trackingNumber =
        req.params.trackingNumber.trim();

      const {
        status
      } = req.body;


      const allowedStatuses = [

        "Pending",

        "Picked Up",

        "In Transit",

        "Out for Delivery",

        "Delivered"

      ];


      if (
        !allowedStatuses.includes(status)
      ) {

        return res.status(400).json({

          message:
            "Invalid shipment status"

        });

      }


      const shipment =
        await Shipment.findOneAndUpdate(

          {
            trackingNumber:
              trackingNumber
          },

          {
            status:
              status
          },

          {
            new: true
          }

        );


      if (!shipment) {

        return res.status(404).json({

          message:
            "Shipment not found"

        });

      }


      res.status(200).json({

        message:
          "Shipment status updated successfully!",

        shipment

      });


    } catch (error) {

      console.error(
        "Update status error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to update shipment status",

        error:
          error.message

      });

    }

  }
);


// ==========================================
// DELETE SHIPMENT
// ==========================================

app.delete(
  "/api/shipments/:trackingNumber",
  async (req, res) => {

    try {

      const trackingNumber =
        req.params.trackingNumber.trim();


      const shipment =
        await Shipment.findOneAndDelete({

          trackingNumber:
            trackingNumber

        });


      if (!shipment) {

        return res.status(404).json({

          message:
            "Shipment not found"

        });

      }


      res.status(200).json({

        message:
          "Shipment deleted successfully!"

      });


    } catch (error) {

      console.error(
        "Delete shipment error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to delete shipment",

        error:
          error.message

      });

    }

  }
);


// ==========================================
// START SERVER
// ==========================================

app.listen(
  PORT,
  () => {

    console.log(
      `Server running on port ${PORT}`
    );

  }
);