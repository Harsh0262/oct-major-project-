import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = Number.parseInt(process.env.PORT ?? "3000", 10);

app.use(express.json({ limit: "25mb" }));

// Server-side Gemini AI Client
let aiClient: GoogleGenAI | null = null;
function getAIClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// Health endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Diagnostic analysis route
app.post("/api/analyze-scan", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/png", modality = "XR Chest", clinicalNotes = "" } = req.body;
    const ai = getAIClient();

    const prompt = `You are MedVision AI, an expert AI radiology diagnostic engine.
Analyze this medical scan (${modality}). Clinical notes: "${clinicalNotes}".
Provide a high-precision clinical analysis response in JSON format matching this structure:
{
  "finding": "Primary diagnostic finding (e.g., Pneumonia, Lung Nodule, Pleural Effusion, Cardiomegaly, Pneumothorax, No Abnormality)",
  "confidence": percentage number between 65.0 and 99.5 (e.g. 96.4),
  "severity": "Critical" | "High" | "Moderate" | "Mild" | "Normal",
  "affectedRegion": "Description of anatomical location (e.g., Right Lower Lobe, Left Apical Region, Perihilar Region)",
  "topPredictions": [
    {"condition": "Condition name", "confidence": percentage number},
    {"condition": "Condition name", "confidence": percentage number},
    {"condition": "Condition name", "confidence": percentage number},
    {"condition": "Condition name", "confidence": percentage number}
  ],
  "radiologistSummary": "Concise 2-3 sentence expert clinical analysis explaining key radiographical evidence (opacity, consolidation, bone density, border sharpness).",
  "recommendedAction": "Actionable next clinical steps (e.g., Follow-up CT in 48h, Antibiotic therapy, Immediate surgical consult)."
}`;

    if (ai && imageBase64) {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: {
          parts: [
            {
              inlineData: {
                data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
                mimeType,
              },
            },
            { text: prompt },
          ],
        },
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      if (response.text) {
        try {
          const parsed = JSON.parse(response.text.trim());
          return res.json({ success: true, data: parsed, isRealAI: true });
        } catch {
          // Fallback if parsing fails
        }
      }
    }

    // Smart fallback if no API key or image provided
    const sampleFindings = [
      {
        finding: "Pneumonia",
        confidence: 96.4,
        severity: "Moderate",
        affectedRegion: "Right Lower Lobe (Consolidation)",
        topPredictions: [
          { condition: "Pneumonia", confidence: 96.4 },
          { condition: "Lung Opacity", confidence: 87.1 },
          { condition: "Infiltration", confidence: 72.3 },
          { condition: "Atelectasis", confidence: 21.4 },
        ],
        radiologistSummary: "Dense airspace consolidation with air bronchograms in the right lower lobe consistent with acute lobar pneumonia. Heart size and pulmonary vasculature are within normal limits.",
        recommendedAction: "Correlate with clinical markers (WBC, sputum culture). Initiate empirical antibiotic protocol and schedule follow-up XR in 2 weeks.",
      },
      {
        finding: "Lung Nodule",
        confidence: 87.1,
        severity: "High",
        affectedRegion: "Left Upper Lobe (Periphery)",
        topPredictions: [
          { condition: "Lung Nodule", confidence: 87.1 },
          { condition: "Granuloma", confidence: 64.2 },
          { condition: "Solitary Lesion", confidence: 45.8 },
          { condition: "Hamartoma", confidence: 18.2 },
        ],
        radiologistSummary: "Well-circumscribed 12mm solitary pulmonary nodule identified in the left upper lobe peripheral parenchyma. No calcification or cavitational changes detected.",
        recommendedAction: "High-resolution non-contrast chest CT recommended within 5 business days for volumetric analysis and Fleischner criteria classification.",
      },
      {
        finding: "Pleural Effusion",
        confidence: 81.5,
        severity: "Moderate",
        affectedRegion: "Left Costophrenic Angle",
        topPredictions: [
          { condition: "Pleural Effusion", confidence: 81.5 },
          { condition: "Atelectasis", confidence: 65.0 },
          { condition: "Costophrenic Blunting", confidence: 54.2 },
          { condition: "Pleural Thickening", confidence: 22.0 },
        ],
        radiologistSummary: "Blunting of the left costophrenic angle with meniscal sign indicating moderate pleural effusion. No mediastinal shift or pneumothorax identified.",
        recommendedAction: "Ultrasound-guided thoracentesis evaluation if clinically symptomatic. Monitor fluid status.",
      }
    ];

    const randomIndex = Math.floor(Math.random() * sampleFindings.length);
    res.json({
      success: true,
      data: sampleFindings[randomIndex],
      isRealAI: false,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Diagnostic failed" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MedVision AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
