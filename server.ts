import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API: Multimodal Image Identification for BASKT
app.post('/api/gemini/identify-image', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64 in request' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9]+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            mimeType,
            data: cleanBase64,
          },
        },
        {
          text: `You are BASKT's visual product scanner for elevated everyday goods ($50-$2,000 range, e.g. watches, luxury audio/electronics, niche perfumes, designer utility bags, organic fine food).
Analyze this uploaded image and return a JSON object with:
{
  "productName": "Most likely specific product name",
  "brand": "Identified brand name or close match",
  "category": "One of: Electronics | Watches | Perfume/Toiletries | Branded Bags | Organic Expensive Food",
  "estimatedPriceSGD": number (e.g. 180),
  "confidence": "High" | "Medium" | "Low",
  "keyVisualFeatures": ["3-4 bullet points detailing dial, materials, packaging, model code"],
  "recommendedQuery": "Best keyword query for price comparison",
  "curatorComment": "1-2 sentence assessment of authenticity traits or what to look for when buying"
}
Return ONLY valid JSON without markdown fences.`,
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : { productName: 'Identified Product', brand: 'Unknown' };
    }

    return res.json({ success: true, result: parsed });
  } catch (error: any) {
    console.error('Image identification error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze product image',
      fallback: {
        productName: 'Elevated Everyday Good',
        brand: 'Detected Item',
        category: 'Electronics',
        recommendedQuery: 'premium electronics',
      },
    });
  }
});

// API: Conversational Scout / AI Assistant
// Matches the deck: "Scenario: User have item needed but no specific brand or feature, AI assistant can help to suggest features to narrow selection. e.g. user needs a mouse, the chat will suggest if you need a silent mouse or gaming purpose etc. and narrow down to the selection"
app.post('/api/gemini/assistant', async (req, res) => {
  try {
    const { message, history = [], currentCategory, currentSearch } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemInstruction = `You are BASKT Concierge, the elevated everyday goods personal shopping and price comparison advisor (focusing on products $50 - $2,000 across Singapore and Southeast Asia).
Your job is to help users narrow down what they want when they only have a rough need or desire (e.g., "I need a work mouse", "recommend a daily signature scent", "rugged waterproof bag for commute", "Swiss everyday watch under $1000", "organic honey").
Be crisp, knowledgeable, tasteful, and decisive like a premier editorial gear guide (Wirecutter meets Monocle).

Always output pure JSON with the following structure:
{
  "reply": "Crisp, helpful response (max 3-4 sentences) that directly advises them on the key trade-offs and explains what to look for.",
  "suggestedRefinements": [
    "Short 2-4 word pill label 1 (e.g. 'Silent Click Office')",
    "Short 2-4 word pill label 2 (e.g. 'Ergonomic Thumb Rest')",
    "Short 2-4 word pill label 3 (e.g. 'Under S$150')",
    "Short 2-4 word pill label 4"
  ],
  "recommendedSearchQuery": "Optimized keyword to filter the comparison engine (e.g. 'Logitech MX Master 3S' or 'Tissot PRX')",
  "matchedCategory": "Electronics" | "Watches" | "Perfume/Toiletries" | "Branded Bags" | "Organic Expensive Food" | null,
  "curatorTip": "1 insider tip on Singapore warranty, landed shipping fees, or voucher timing"
}
Return ONLY valid JSON.`;

    const contents = [
      ...history.map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }],
      })),
      {
        role: 'user',
        parts: [
          {
            text: `Current user context: Category: ${currentCategory || 'All'}, Current Search: ${currentSearch || 'None'}. User input: "${message}"`,
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : {
        reply: "Here are some elevated recommendations matching your style.",
        suggestedRefinements: ["High Durability", "Best Value", "Singapore Warranty"],
        recommendedSearchQuery: message
      };
    }

    return res.json({ success: true, result: parsed });
  } catch (error: any) {
    console.error('Assistant error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process assistant request',
      fallback: {
        reply: "I can help you filter down to the best product. Would you prefer maximum durability, fastest local Singapore delivery, or lowest landed price?",
        suggestedRefinements: ["Next-Day SG Delivery", "Official Warranty", "Sub-$300", "Top Rated"],
        recommendedSearchQuery: req.body.message || ''
      }
    });
  }
});

// API: Live Retailer Price Refresh Simulation
app.post('/api/retailers/live-refresh', (req, res) => {
  const { productId } = req.body;
  const timestamp = new Date().toLocaleTimeString('en-SG', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return res.json({
    success: true,
    productId,
    lastChecked: timestamp,
    checkedRetailers: ['Shopee Mall', 'Lazada LazMall', 'Amazon SG', 'Taobao Tmall Global', 'Brand.com Flagship'],
    status: 'All live API channels synchronized. Best price verified.',
    exchangeRateSGD: 1.0,
  });
});

import http from 'http';

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const httpServer = http.createServer(app);

  if (!isProd) {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`BASKT Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
