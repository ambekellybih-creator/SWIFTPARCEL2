const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Check if MongoDB URI is being loaded
console.log("MONGO_URI loaded:", !!process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
  console.error("ERROR: MONGO_URI was not found in .env");
} else {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error.message);
    });
}

app.get("/", (req, res) => {
  res.json({
    message: "SwiftParcel backend is running!",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});