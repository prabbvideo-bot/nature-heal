import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini API client on the server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const NATURE_GUIDE_SYSTEM_PROMPT = `You are NatureHeal, a calm, grounding voice companion. 
Your singular mission is to help people step away from screens, venture outdoors, and connect with the tactile living world.
CRITICAL VOICE GUIDELINES:
- Keep all responses spoken-word friendly, concise, and soothing (1 to 3 sentences, maximum 45 words).
- Never use markdown syntax, asterisks, bullet points, emojis, code, or links—your output will be read aloud by speech synthesizers.
- Speak in a grounded, warm, unhurried tone.
- Validate how refreshing it feels to step away from glowing displays.
- If the user is on a walk, encourage them to notice sensory details: ambient breeze, tree textures, leaf colors, bird calls, the earth beneath their soles.
- If the user feels hesitant, invite a gentle 5-minute micro-break outdoors rather than a demanding workout.`;

// Conversational route for continuous outdoor voice companion
app.post('/api/guide/converse', async (req: Request, res: Response) => {
  try {
    const { userMessage, walkState, history } = req.body;

    if (!userMessage || typeof userMessage !== 'string') {
      res.status(400).json({ error: 'userMessage is required' });
      return;
    }

    let contextualPrompt = userMessage;
    if (walkState) {
      contextualPrompt = `[Context: User is currently ${walkState.isWalking ? 'actively walking outside' : 'at home or at a desk'}; Walk duration so far: ${walkState.durationMinutes || 0} minutes; Current mission: "${walkState.missionTitle || 'Mindful Outdoor Break'}"]\nUser said: "${userMessage}"`;
    }

    // Format previous turns for conversational continuity if provided
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-6);
      for (const turn of recentHistory) {
        if (turn.sender === 'user') {
          contents.push({ role: 'user', parts: [{ text: turn.text }] });
        } else if (turn.sender === 'guide') {
          contents.push({ role: 'model', parts: [{ text: turn.text }] });
        }
      }
    }

    contents.push({ role: 'user', parts: [{ text: contextualPrompt }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: NATURE_GUIDE_SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    const replyText = response.text?.trim() || "Take a slow breath. Feel the ground beneath you and step into the open air.";
    res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Gemini converse error:', error);
    // Graceful comforting fallback if API is unreachable or rate-limited
    res.json({
      reply: "Step outside for just five minutes. Look at the skyline or feel the ambient breeze. Your eyes deserve a break from the screen.",
    });
  }
});

// Generate dynamic sensory outdoor missions
app.post('/api/guide/mission', async (req: Request, res: Response) => {
  try {
    const { environment, timeAvailableMinutes, mood } = req.body;

    const prompt = `Generate a mindful, screen-free outdoor walking mission for someone who is feeling ${mood || 'fatigued by screens'} in a ${environment || 'neighborhood'} setting with ${timeAvailableMinutes || 15} minutes available.
Return a clean JSON object with:
- title: Short evocative title (2-4 words, e.g. "The Canopy Gaze", "Rhythm of Footsteps", "Textures of Bark")
- durationMinutes: integer
- sensoryFocus: One of ["Sight", "Sound", "Touch", "Breath", "Movement"]
- prompt: 2 sentences explaining what simple real-world sensory observation to engage in while walking with their phone in their pocket.
- voiceIntro: A 1-2 sentence spoken invitation to welcome the user into the walk.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.8,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Gemini mission error:', error);
    res.json({
      title: 'The Sky & Canopy Stroll',
      durationMinutes: 15,
      sensoryFocus: 'Sight',
      prompt: 'Put your phone away. Walk at an easy pace and look up at the tree branches or open sky every fifty steps. Notice how natural light softens your eye strain.',
      voiceIntro: 'Slip your phone into your pocket. Let your eyes soften and take in the natural horizon.',
    });
  }
});

// Reflection route after completing a walk
app.post('/api/guide/reflect', async (req: Request, res: Response) => {
  try {
    const { durationMinutes, userReflection, missionTitle } = req.body;
    const prompt = `A user just completed a ${durationMinutes}-minute outdoor walk titled "${missionTitle || 'Mindful Walk'}".
They shared this reflection: "${userReflection || 'It felt peaceful to be outside.'}".
Give a warm, grounding 1-2 sentence voice closing that honors their screen-free time and leaves them grounded for the rest of their day. No emojis or markdown.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: NATURE_GUIDE_SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    res.json({ closing: response.text?.trim() || "Thank you for giving your senses real air and natural light today. Welcome back." });
  } catch (error) {
    console.error('Gemini reflect error:', error);
    res.json({ closing: "Wonderful work stepping away. Notice the grounded clarity you carry back inside." });
  }
});

// Mount Vite in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: Number(PORT),
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`NatureHeal server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
