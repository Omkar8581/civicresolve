"""
CivicResolve FastAPI AI Service
Exposes /analyze-complaint and /health endpoints.
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import sys
import os
import uvicorn

# Ensure ai-service directory is in python sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from classifier import classify_complaint
from vision import analyze_image_bytes

app = FastAPI(
    title="CivicResolve AI Service",
    description="AI/NLP and Computer Vision Microservice for Civic Grievance Resolution",
    version="1.0.0"
)

# Enable CORS for frontend and backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextAnalysisRequest(BaseModel):
    text: str

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CivicResolve AI Service",
        "version": "1.0.0"
    }

@app.post("/analyze-complaint")
async def analyze_complaint(
    text: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    """
    Accepts complaint text and optional image upload.
    Returns categorized complaint details: category, severity, priority, department, summary.
    """
    input_text = text or ""
    image_analysis = None
    
    if image:
        try:
            contents = await image.read()
            if len(contents) > 0:
                image_analysis = analyze_image_bytes(contents, filename=image.filename or "")
        except Exception as e:
            print(f"Vision processing warning: {e}")

    if not input_text and not image:
        raise HTTPException(status_code=400, detail="Either complaint text or image must be provided.")

    result = classify_complaint(input_text, has_image=bool(image), image_analysis=image_analysis)
    
    if image_analysis:
        result["vision_analysis"] = image_analysis
        
    return result

@app.post("/analyze-text")
def analyze_text_json(payload: TextAnalysisRequest):
    """JSON-based endpoint for simple text analysis."""
    return classify_complaint(payload.text)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
