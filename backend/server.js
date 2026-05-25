// Import required packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const analysisRoutes = require("./routes/analysis");
const whatsappRoutes = require("./routes/whatsapp");
const fileUpload = require("express-fileupload");






// Create app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // allows JSON data
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload()); // 🔥 VERY IMPORTANT

// Test route

app.use("/api/auth", authRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/whatsapp", whatsappRoutes);



app.get("/", (req, res) => {
  res.send("API is running...");
});

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("DB Error:", err);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

