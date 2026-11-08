from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="SafeRoute AI Safety Prediction Service",
    description="Microservice providing AI-based safety score prediction for women safety route planning",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SafetyRequest(BaseModel):
    crime_score: float = Field(..., description="Crime density score (0 to 100)")
    community_report_score: float = Field(..., description="Community safety rating (0 to 100)")
    safe_zone_score: float = Field(..., description="Proximity to safe zones (0 to 100)")
    time_risk: float = Field(..., description="Time of day risk factor (0 to 50)")

class SafetyResponse(BaseModel):
    safety_score: float
    risk_level: str
    recommendation: str

@app.get("/")
def read_root():
    return {"service": "SafeRoute AI Service", "status": "ONLINE"}

@app.post("/predict-safety", response_model=SafetyResponse)
def predict_safety(req: SafetyRequest):
    # Weighted AI Model Calculation
    weighted_score = (
        (req.crime_score * 0.40) +
        (req.community_report_score * 0.30) +
        (req.safe_zone_score * 0.30) -
        (req.time_risk * 0.45)
    )

    final_score = round(max(5.0, min(100.0, weighted_score)), 1)

    if final_score >= 80.0:
        risk_level = "SAFE"
        recommendation = "Highly Recommended: High CCTV density, well-lit, and verified safe zones along the route."
    elif final_score >= 55.0:
        risk_level = "MODERATE"
        recommendation = "Exercise Caution: Moderate lighting and mixed community safety reports."
    else:
        risk_level = "HIGH_RISK"
        recommendation = "Avoid Route: High historical incident reports or isolated unlit stretches."

    return SafetyResponse(
        safety_score=final_score,
        risk_level=risk_level,
        recommendation=recommendation
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
