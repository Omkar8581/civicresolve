"""
CivicResolve AI Service - Complaint Classifier
Analyzes civic complaint text to determine Category, Severity, Priority, Suggested Department, and Summary.
"""

from typing import Dict, Any

CATEGORIES = [
    "Road Damage",
    "Garbage/Waste",
    "Streetlight",
    "Water Supply",
    "Drainage",
    "Public Infrastructure",
    "Traffic/Safety",
    "Electricity",
    "Other"
]

DEPARTMENT_MAP = {
    "Road Damage": "Public Works Department (PWD)",
    "Garbage/Waste": "Municipal Solid Waste Management",
    "Streetlight": "Electrical & Streetlighting Division",
    "Water Supply": "City Water Supply & Sewerage Board",
    "Drainage": "Stormwater & Drainage Department",
    "Public Infrastructure": "Parks & Public Facilities Department",
    "Traffic/Safety": "Traffic Police & Urban Transit Authority",
    "Electricity": "State Electricity Distribution Board",
    "Other": "General Civic Grievance Cell"
}

KEYWORDS = {
    "Road Damage": ["pothole", "road", "asphalt", "crater", "pavement", "highway", "crack", "surface", "speed breaker", "tarmac"],
    "Garbage/Waste": ["garbage", "trash", "waste", "dump", "debris", "bin", "rubbish", "litter", "smell", "rotting", "stinking", "overflow"],
    "Streetlight": ["streetlight", "lamp", "dark", "light", "bulb", "pole", "flickering", "lighting", "illumination", "night"],
    "Water Supply": ["water", "leak", "pipeline", "pipe", "tap", "drinking", "shortage", "burst", "pressure", "contamination", "sewage in water"],
    "Drainage": ["drain", "drainage", "gutter", "clogged", "overflowing", "sewage", "sewer", "manhole", "waterlogged", "stagnant", "flooding"],
    "Public Infrastructure": ["bench", "park", "playground", "fence", "bridge", "footpath", "sidewalk", "divider", "public toilet", "bus stop", "shelter"],
    "Traffic/Safety": ["traffic", "signal", "accident", "zebra crossing", "school", "hazard", "congestion", "jam", "blind spot", "barrier"],
    "Electricity": ["electricity", "power", "cable", "wire", "spark", "transformer", "shock", "hanging wire", "high voltage", "blackout"]
}

HIGH_SEVERITY_WORDS = [
    "danger", "dangerous", "hazard", "school", "hospital", "spark", "open wire",
    "accident", "collapse", "death", "urgent", "flooding", "burst", "deep pothole",
    "severely", "blocked", "heavy", "fire", "emergency", "fatal"
]

MEDIUM_SEVERITY_WORDS = [
    "difficulty", "smell", "leak", "delay", "flickering", "inconvenience",
    "overflowing", "broken", "damaged", "dirty", "uncollected", "several days"
]


def classify_complaint(text: str, has_image: bool = False, image_analysis: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Classify a complaint text and determine its attributes.
    """
    clean_text = text.lower().strip()
    
    # Category detection via keyword scoring
    scores = {cat: 0 for cat in CATEGORIES}
    for cat, keywords in KEYWORDS.items():
        for kw in keywords:
            if kw in clean_text:
                scores[cat] += 2
                
    # Consider vision tags if available
    if image_analysis and "detected_labels" in image_analysis:
        for label in image_analysis["detected_labels"]:
            label_lower = label.lower()
            for cat, keywords in KEYWORDS.items():
                for kw in keywords:
                    if kw in label_lower:
                        scores[cat] += 3

    # Pick top category
    best_cat = max(scores, key=scores.get)
    if scores[best_cat] == 0:
        best_cat = "Other"

    # Severity analysis
    high_count = sum(1 for word in HIGH_SEVERITY_WORDS if word in clean_text)
    med_count = sum(1 for word in MEDIUM_SEVERITY_WORDS if word in clean_text)
    
    if image_analysis and image_analysis.get("visual_severity") == "High":
        high_count += 2

    if high_count >= 1 or "school" in clean_text or "hospital" in clean_text or "urgent" in clean_text:
        severity = "High"
        priority = "High"
    elif med_count >= 1 or scores[best_cat] >= 4:
        severity = "Medium"
        priority = "Medium"
    else:
        severity = "Low"
        priority = "Low"

    # Department routing
    department = DEPARTMENT_MAP.get(best_cat, "General Civic Grievance Cell")

    # Generate a concise summary
    words = text.split()
    if len(words) <= 12:
        summary = text.strip()
    else:
        first_sentence = text.split(".")[0].strip()
        if len(first_sentence.split()) <= 15 and len(first_sentence) > 10:
            summary = f"{first_sentence}."
        else:
            summary = f"{best_cat} reported: {' '.join(words[:12])}..."

    return {
        "category": best_cat,
        "severity": severity,
        "priority": priority,
        "department": department,
        "summary": summary
    }
