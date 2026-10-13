# NatureHeal 🌿

> **"AI should sometimes give us a reason to put our phones down."**

NatureHeal is a voice-first outdoor movement and digital detox companion. Instead of requiring you to stare at a glowing screen, NatureHeal engages in natural, unhurried voice conversation, encourages you to step into daylight, and accompanies you on sensory walks with your phone stowed safely in your pocket.

---

## 🌟 Key Features

- 🎙️ **Hands-Free Natural Voice Interaction**: Continuous speech recognition and soothing voice synthesis powered by Gemini 3.8 Flash, delivering concise (under 40 words) spoken guidance.
- 📱 **Screen-Off Pocket Mode**:
  - Dims the display to near-black (`#080B08`) to preserve battery life and prevent glare.
  - Includes an accidental tap lock (press-and-hold to unlock) so fabric friction won't pause or cancel your walk.
  - Hands-free microphone stays alert, allowing you to speak to NatureHeal anytime through your headphones.
  - Gentle periodic audio check-ins (every 5 minutes) encouraging sensory awareness.
- 🍃 **Sensory Walking Missions**:
  - *The Canopy & Horizon Gaze*: Shifting visual focal distance to infinity to relieve ciliary muscle eye strain.
  - *5-Senses Nature Grounding*: Anchoring overstimulated nervous systems in textures, sounds, and ambient temperatures.
  - *Cadence of Footsteps*: 4-step bilateral nasal breathing synchronized with walking movement.
  - *Micro-Nature Safari*: Discovering spontaneous plant and wildlife life cycles in urban cracks.
  - *AI Custom Walk Generator*: Dynamically generates tailored sensory walks based on your immediate environment (neighborhood, urban street, park, balcony) and time available.
- 🎵 **Procedural Web Audio Soundscapes**:
  - Synthesizes organic nature sounds (Canopy Breeze, Mountain Brook, Peaceful Meadow) using browser Web Audio API oscillator and noise nodes.
  - Zero external MP3 downloads, zero network latency, and works completely offline.
- ☀️ **Digital Detox & Sunlight Log**:
  - Records minutes spent outdoors away from digital displays.
  - Estimates step cadence and tracks mood improvements before and after walks.
  - Preserves privacy with local storage (`localStorage`) and one-click JSON export.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React
- **Voice & Audio**: Web Speech API (`SpeechRecognition` & `SpeechSynthesis`), Web Audio API
- **Backend & AI**: Express, tsx, `@google/genai` TypeScript SDK (Model: `gemini-3.8-flash`)
- **Bundler & Tooling**: Vite 8, Node.js (v22+)
- **Cloud Deployment**: Render.com Blueprint (`render.yaml`)

---

## 📋 Prerequisites

Before getting started, make sure you have:

1. **Node.js**: Version 20.x or 22.x+ (Node 22 is recommended).
   - Check with: `node -v`
2. **npm** (comes with Node.js) or **pnpm** / **yarn**.
   - Check with: `npm -v`
3. **Google Gemini API Key**:
   - Obtain an API key from [Google AI Studio](https://aistudio.google.com/).

---

## 🚀 Local Installation & Setup

### Step 1: Clone or Open the Repository

```bash
git clone <repository-url>
cd natureheal
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory by copying the provided `.env.example`:

```bash
cp .env.example .env
```

Open `.env` and configure:

```env
# Gemini API Key for outdoor voice companion
GEMINI_API_KEY="your-gemini-api-key-here"

# Port configuration (default is 3000)
PORT=3000
```

### Step 4: Run the Development Server

Start the full-stack Express + Vite development server:

```bash
npm run dev
```

Open `http://localhost:3000` in Google Chrome, Microsoft Edge, or Safari.

---

## ☁️ Deploying to Render (render.com)

NatureHeal is fully configured for deployment on [Render](https://render.com) as a full-stack Node.js Web Service.

### Method 1: Automated Deployment via Render Blueprint (Recommended)

This repository includes a `render.yaml` Blueprint file for automatic configuration.

1. **Push your code to GitHub / GitLab**.
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** in the top right and select **Blueprint**.
4. Connect your NatureHeal GitHub repository.
5. Render will automatically detect `render.yaml` and configure:
   - **Service Name**: `natureheal`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
6. Under **Environment Variables**, enter your secret **`GEMINI_API_KEY`**.
7. Click **Apply**. Render will automatically build the React assets into `dist/` and start the Express server.

---

### Method 2: Manual Web Service Setup on Render

If you prefer to configure the service manually on Render without Blueprints:

1. Go to the [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Web Service**.
3. Choose **Build and deploy from a Git repository** and connect your repository.
4. Fill in the following settings:

| Setting | Value |
| :--- | :--- |
| **Name** | `natureheal` (or your preferred name) |
| **Region** | Select the region closest to you (e.g. Oregon, Frankfurt) |
| **Branch** | `main` |
| **Root Directory** | *(Leave blank)* |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` (or `Starter`) |

5. Scroll down to **Environment Variables** and add:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Tells Express to serve pre-built Vite assets from `dist/` |
| `GEMINI_API_KEY` | `AIzaSy...` | Your Gemini API Key from Google AI Studio |

6. Click **Create Web Service**.
7. Render will install dependencies, execute `vite build`, and launch the Express production server. Once deployed, Render provides an HTTPS URL (e.g. `https://natureheal.onrender.com`).

---

### 🔒 Crucial Render & Production Notes

- **Microphone Permissions (HTTPS Required)**: The browser's Web Speech API (`SpeechRecognition`) strictly requires a secure context (`https://` or `localhost`). Render provides free SSL/HTTPS certificates automatically on all `.onrender.com` domains, ensuring the microphone works out of the box on both desktop and mobile devices.
- **Port Binding**: Render dynamically injects a `PORT` environment variable (e.g. `10000`). NatureHeal's `server.ts` is already programmed to bind to `process.env.PORT || 3000` on `0.0.0.0`, so no manual port configuration is needed.
- **Node Version**: The `package.json` specifies `"engines": { "node": ">=22.0.0" }`, instructing Render's build environment to provision Node 22+.

---

## 🎧 Best Experience & Tips

1. **Microphone Permission**:
   - When prompted by the browser, click **Allow** for microphone access.
2. **Headphones / Earbuds**:
   - For the best outdoor walk, connect wireless earbuds or wired headphones with an inline mic.
3. **Pocket Mode**:
   - Start any walk from the **Today** or **Sensory Walks** tab.
   - Tap **Enter Pocket Mode**.
   - Toggle **Lock Screen** to protect against inadvertent pocket taps, and place your phone in your pocket.
   - Speak naturally whenever you want to converse with NatureHeal.

---

## 📂 Project Structure

```
├── render.yaml                # Render Blueprint automated deployment file
├── index.html                 # Entry HTML with synced metadata & Google fonts
├── metadata.json              # Applet metadata & permission configuration
├── package.json               # Dependencies, Node engines, and build scripts
├── server.ts                  # Express backend proxy for Gemini 3.8 Flash
├── tsconfig.json              # TypeScript compilation config
├── vite.config.ts             # Vite build & Tailwind CSS plugin configuration
└── src/
    ├── main.tsx               # React DOM entry point
    ├── App.tsx                # Master app layout, walk state machine, & navigation
    ├── index.css              # Tailwind CSS base and motion keyframes
    ├── data/
    │   └── missions.ts        # Curated sensory outdoor walks catalog
    ├── hooks/
    │   └── useVoiceAssistant.ts # Web Speech recognition & audio synthesis hook
    ├── utils/
    │   └── ambientSound.ts    # Procedural Web Audio nature sound generator
    └── components/
        ├── Navbar.tsx         # Responsive header adhering to 3-zone contract
        ├── Dashboard.tsx      # Main sanctuary: voice orb & daylight tracker
        ├── WalkSession.tsx    # Active walk metrics, guidance, & soundscapes
        ├── PocketMode.tsx     # Dimmed OLED pocket interface with tap lock
        ├── WalkReflection.tsx # Post-walk sensory reflection & audio closing
        ├── MissionsCatalog.tsx# Stroll directory & bespoke AI walk generator
        └── WalkHistory.tsx    # Screen-free daylight log & session history
```

---

## 📜 License

This project is licensed under the Apache License, Version 2.0.
