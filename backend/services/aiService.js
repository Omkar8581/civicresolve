/**
 * AI Bridge Service
 * Connects Express backend to the Python FastAPI AI Microservice (port 8000),
 * with resilient local NLP fallback.
 */

let rawAiUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
if (rawAiUrl && !rawAiUrl.startsWith('http://') && !rawAiUrl.startsWith('https://')) {
  rawAiUrl = `http://${rawAiUrl}`;
}
const AI_SERVICE_URL = rawAiUrl;

export async function analyzeComplaintText(text, imageFilename = '') {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const formData = new FormData();
    formData.append('text', text);

    const response = await fetch(`${AI_SERVICE_URL}/analyze-complaint`, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    // Graceful fallback to built-in NLP heuristics if AI service is starting up
    console.log('ℹ️ Utilizing built-in NLP pipeline (FastAPI bridging):', err.message);
  }

  // Built-in intelligent fallback
  return fallbackClassifier(text);
}

function fallbackClassifier(text) {
  const t = text.toLowerCase();

  let category = "General Civic Grievance";
  let department = "General Civic Grievance Cell";
  let severity = "Medium";
  let priority = "Medium";

  if (t.includes('pothole') || t.includes('road') || t.includes('asphalt') || t.includes('pavement')) {
    category = "Road Damage";
    department = "Public Works Department (PWD)";
  } else if (t.includes('garbage') || t.includes('trash') || t.includes('waste') || t.includes('dustbin')) {
    category = "Garbage/Waste";
    department = "Municipal Solid Waste Management";
  } else if (t.includes('streetlight') || t.includes('lamp') || t.includes('dark') || t.includes('bulb')) {
    category = "Streetlight";
    department = "Electrical & Streetlighting Division";
  } else if (t.includes('water') || t.includes('leak') || t.includes('pipe') || t.includes('tap')) {
    category = "Water Supply";
    department = "City Water Supply & Sewerage Board";
  } else if (t.includes('drain') || t.includes('gutter') || t.includes('sewage') || t.includes('clogged') || t.includes('flooding')) {
    category = "Drainage";
    department = "Stormwater & Drainage Department";
  } else if (t.includes('bench') || t.includes('park') || t.includes('fence') || t.includes('sidewalk')) {
    category = "Public Infrastructure";
    department = "Parks & Public Facilities Department";
  } else if (t.includes('traffic') || t.includes('signal') || t.includes('crossing') || t.includes('accident')) {
    category = "Traffic/Safety";
    department = "Traffic Police & Urban Transit Authority";
  } else if (t.includes('electricity') || t.includes('wire') || t.includes('cable') || t.includes('spark')) {
    category = "Electricity";
    department = "State Electricity Distribution Board";
  }

  if (t.includes('danger') || t.includes('school') || t.includes('hospital') || t.includes('urgent') || t.includes('deep pothole') || t.includes('burst')) {
    severity = "High";
    priority = "High";
  } else if (t.includes('bench') || t.includes('paint') || t.includes('small') || t.includes('minor')) {
    severity = "Low";
    priority = "Low";
  }

  const words = text.split(' ');
  const summary = words.length > 12 ? `${words.slice(0, 12).join(' ')}...` : text;

  return {
    category,
    severity,
    priority,
    department,
    summary
  };
}
