const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const shipmentRoutes = require("./routes/shipmentRoutes");

const app = express();

const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());


// MongoDB Connection
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
// Home route
app.get("/", (req, res) => {
  res.json({
    message: "SwiftParcel backend is running!",
  });
});


// Shipment routes
app.use("/api/shipments", shipmentRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});