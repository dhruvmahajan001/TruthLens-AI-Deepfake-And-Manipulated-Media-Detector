const express = require("express");
const router = express.Router();
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const axios = require("axios");
const FormData = require("form-data");

router.post("/", async (req, res) => {
  console.log("📩 WhatsApp webhook hit");

  const msg = req.body.Body;
  const numMedia = parseInt(req.body.NumMedia);
  let reply = "";

  try {
    // 🔹 CASE 1: MEDIA (image/video)
    if (numMedia > 0) {
      const mediaUrl = req.body.MediaUrl0;
      const mediaType = req.body.MediaContentType0;

      console.log("📸 Media received");
      console.log("URL:", mediaUrl);
      console.log("Type:", mediaType);

      // ✅ FIX: Twilio AUTH added
      const mediaResponse = await axios.get(mediaUrl, {
        responseType: "arraybuffer",
        auth: {
          username: process.env.TWILIO_ACCOUNT_SID,
          password: process.env.TWILIO_AUTH_TOKEN,
        },
      });

      console.log("✅ Media downloaded:", mediaResponse.data.length);

      const formData = new FormData();
      formData.append("file", mediaResponse.data, "file");

      let aiResponse;

      // 🔥 Decide image or video
      if (mediaType.includes("image")) {
        aiResponse = await axios.post(
          "http://localhost:8000/analyze-image",
          formData,
          { headers: formData.getHeaders() },
        );
      } else if (mediaType.includes("video")) {
        aiResponse = await axios.post(
          "http://localhost:8000/analyze-video",
          formData,
          { headers: formData.getHeaders() },
        );
      } else {
        reply = "❌ Unsupported media type";
      }

      if (aiResponse) {
        const data = aiResponse.data;

        reply = `🔍 *TruthLens AI Report*

📌 Type: ${data.type}
🧠 Result: *${data.label}*
📊 Confidence: ${data.confidence}%

💬 ${data.message}

⚡ Powered by TruthLens`;
      }
    }

    // 🔹 CASE 2: TEXT
    else {
      console.log("🧠 Text received:", msg);

      const aiRes = await axios.post("http://localhost:8000/analyze-text", {
        text: msg,
      });

      const data = aiRes.data;

      reply = `🔍 *TruthLens AI Report*

🧠 Result: *${data.label}*
📊 Confidence: ${data.confidence}%

💬 ${data.message}

⚡ Powered by TruthLens`;
    }
  } catch (err) {
    console.error("❌ FULL WHATSAPP ERROR:", err);

    reply = `⚠️ *TruthLens Error*

Something went wrong while analyzing your content.

Please try again later.`;
  }

  const twiml = new MessagingResponse();
  twiml.message(reply);

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

module.exports = router;
