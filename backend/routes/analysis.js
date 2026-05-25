const express = require("express");
const router = express.Router();
const axios = require("axios");
const FormData = require("form-data");

// 🔹 TEXT ANALYSIS
router.post("/analyze", async (req, res) => {
  try {
    const { inputType, content } = req.body;

    if (inputType === "text") {
      const response = await axios.post("http://localhost:8000/analyze-text", {
        text: content,
      });

      return res.json(response.data);
    }

    return res.status(400).json({ message: "Invalid input type" });
  } catch (err) {
    console.error("TEXT ERROR:", err.message);
    res.status(500).json({ message: "AI text service failed" });
  }
});

// 🔹 IMAGE ANALYSIS
router.post("/analyze-image", async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const formData = new FormData();
    formData.append("file", req.files.file.data, req.files.file.name);

    const response = await axios.post(
      "http://localhost:8000/analyze-image",
      formData,
      { headers: formData.getHeaders() },
    );

    res.json(response.data);
  } catch (err) {
    console.error("IMAGE ERROR:", err.message);
    res.status(500).json({ message: "AI image service failed" });
  }
});

// 🔹 VIDEO ANALYSIS
router.post("/analyze-video", async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const formData = new FormData();
    formData.append("file", req.files.file.data, req.files.file.name);

    const response = await axios.post(
      "http://localhost:8000/analyze-video",
      formData,
      { headers: formData.getHeaders() },
    );

    res.json(response.data);
  } catch (err) {
    console.error("VIDEO ERROR:", err.message);
    res.status(500).json({ message: "AI video service failed" });
  }
});

module.exports = router;
