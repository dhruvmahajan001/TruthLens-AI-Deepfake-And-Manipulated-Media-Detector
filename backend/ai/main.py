from fastapi import FastAPI, UploadFile, File # type: ignore
from pydantic import BaseModel # type: ignore
from transformers import pipeline, AutoImageProcessor, SiglipForImageClassification # type: ignore
from PIL import Image  # type: ignore
import torch  # type: ignore
import cv2 # type: ignore
import tempfile
import io

app = FastAPI()


class TextRequest(BaseModel):
    text: str

fake_news_model = pipeline(
    "zero-shot-classification",
    model="facebook/bart-large-mnli"
)

suspicious_keywords = [
    "cure cancer", "miracle cure", "instant cure", "100% cure",
    "drink petrol", "aliens", "earn money fast", "free money",
    "forward this", "urgent message", "secret government"
]

# =========================
# 🖼 IMAGE MODEL 
# =========================
model_name = "prithivMLmods/deepfake-detector-model-v1"

image_model = SiglipForImageClassification.from_pretrained(model_name)
image_processor = AutoImageProcessor.from_pretrained(model_name)

id2label = {
    "0": "Real",
    "1": "Fake"
}

# =========================
#  TEXT ANALYSIS
# =========================
@app.post("/analyze-text")
def analyze_text(request: TextRequest):
    text = request.text.lower()

    try:
        result = fake_news_model(
            text,
            candidate_labels=["real news", "fake news"]
        )

        label = result["labels"][0]
        confidence = result["scores"][0] * 100

        final_label = "Real" if label == "real news" else "Fake"

        # 🔥 RULE LOGIC
        score_boost = 0
        for keyword in suspicious_keywords:
            if keyword in text:
                score_boost += 1

        if score_boost >= 2:
            final_label = "Fake"
            confidence = 95
        elif score_boost == 1:
            final_label = "Fake"
            confidence = max(confidence, 75)

        return {
            "type": "text",
            "label": final_label,
            "confidence": round(confidence, 2),
            "message": "Content appears authentic"
            if final_label == "Real"
            else "Content is likely fake or misleading"
        }

    except Exception as e:
        print("TEXT ERROR:", e)
        return {"type": "text", "label": "Unknown", "confidence": 0}


# =========================
# 🖼 IMAGE ANALYSIS 
# =========================
@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        inputs = image_processor(images=image, return_tensors="pt")

        with torch.no_grad():
            outputs = image_model(**inputs)
            logits = outputs.logits
            probs = torch.nn.functional.softmax(logits, dim=1).squeeze().tolist()

        prediction = {
            id2label[str(i)]: probs[i] for i in range(len(probs))
        }

        label = max(prediction, key=prediction.get)
        confidence = prediction[label] * 100

        return {
            "type": "image",
            "label": label,
            "confidence": round(confidence, 2),
            "message": "Deepfake detection completed"
        }

    except Exception as e:
        print("IMAGE ERROR:", e)
        return {"type": "image", "label": "Unknown", "confidence": 0}


# =========================
# 🎥 VIDEO ANALYSIS 
# =========================
@app.post("/analyze-video")
async def analyze_video(file: UploadFile = File(...)):
    try:
        temp = tempfile.NamedTemporaryFile(delete=False)
        temp.write(await file.read())
        temp.close()

        cap = cv2.VideoCapture(temp.name)

        scores = []
        frame_count = 0

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret or frame_count > 10:
                break

            image = Image.fromarray(frame).convert("RGB")
            inputs = image_processor(images=image, return_tensors="pt")

            with torch.no_grad():
                outputs = image_model(**inputs)
                logits = outputs.logits
                probs = torch.nn.functional.softmax(logits, dim=1).squeeze().tolist()

            scores.append(probs[0])  # Fake score
            frame_count += 1

        cap.release()

        avg_fake_score = sum(scores) / len(scores) if scores else 0
        label = "Fake" if avg_fake_score > 0.5 else "Real"

        return {
            "type": "video",
            "label": label,
            "confidence": round(avg_fake_score * 100, 2),
            "message": "Video analyzed using deepfake model"
        }

    except Exception as e:
        print("VIDEO ERROR:", e)
        return {"type": "video", "label": "Unknown", "confidence": 0}