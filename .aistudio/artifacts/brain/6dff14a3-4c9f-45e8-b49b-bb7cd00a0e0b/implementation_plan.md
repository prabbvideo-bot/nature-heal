# NatureHeal: Voice-First Outdoor Activity & Digital Detox Companion

NatureHeal is a voice-first companion designed to liberate users from screen addiction by naturally speaking with them, gently nudging them to step outside, take mindful walks, and complete tactile real-world sensory activities with their phones stowed in their pockets.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The conversational and interaction defaults confirmed in Phase 1 have been integrated as core architectural foundations:

- **Confirmed Persona & Voice**: Calm, grounding nature guide who speaks with a warm, steady cadence—nudging users gently past initial inertia rather than pushing aggressive fitness benchmarks.
- **Confirmed Activities**: Mindful walking, sensory strolls (e.g., 5-senses nature grounding, looking for light patterns, feeling wind texture), and screen-break digital detox pauses.
- **Confirmed Voice Architecture**: Full hands-free voice dialogue utilizing Web Speech recognition / push-to-talk fallback with AI voice synthesis, coupled with an interactive **"Screen-Off / Pocket Mode"** that dims the display to save battery and prevent accidental screen taps while the user walks with headphones.

---

### 1. Overview & Core Concept

- **What It Does**: NatureHeal initiates or receives spoken conversations to help users detach from screen fatigue. It proposes personalized 10-to-30-minute outdoor micro-walks, accompanies users via gentle periodic voice check-ins (e.g., "Look up at the tree canopy for 10 seconds; what colors do you notice?"), monitors walking duration and cadence, and reflects with the user when they return.
- **Target Audience / Persona**: Remote workers, students, desk-bound professionals, and anyone experiencing digital burnout who needs a soft, companionable push to step outside into natural air.
- **Key Value**: Reverses the typical AI paradigm—rather than trapping user attention inside a screen interface, AI acts as a bridge to real-world sensory presence and outdoor physical movement.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **The Invitation (Zero-State)**: User opens NatureHeal. The screen presents an organic, breathing outdoor aesthetic with a prominent hands-free voice prompt: *"Ready to step away from your screen?"* Users can tap the voice button or speak directly.
2. **The Outdoor Nudge & Prompting**: The AI asks how the user is feeling and what their immediate surroundings look like (e.g., residential street, neighborhood park, balcony, urban sidewalk). It crafts a custom 15-minute sensory stroll or gentle stroll challenge.
3. **Pocket Mode (Screen-Off Outdoor Walk)**: When the walk begins, NatureHeal enters Pocket Mode. The screen turns deeply dimmed with high-contrast, essential controls (Pause Walk, End Walk, Talk to Guide) and an optional tap lock to prevent accidental pocket touches. Hands-free audio guidance triggers at gentle intervals, or whenever the user speaks into their headset.
4. **Ambient Nature Soundscape**: An optional, generative Web Audio ambient outdoor soundscape (rustling leaves, distant birds, soft mountain wind, stream flow) for users walking in noisy urban zones.
5. **The Return & Sensory Reflection**: Upon completing the walk, the guide warmly invites a 60-second voice reflection (*"How did the fresh air feel? What caught your attention out there?"*), logs the session (time outdoors, sensory tags, mood uplift), and celebrates screen-free time.

#### Visual Identity & Theme
- **Aesthetic Direction**: Organic Japandi & Biophilic Modernism. Earthy, serene, airy, and tactile. High outdoor daylight legibility.
- **Color Palette**:
  - Neutral Canvas (60%): Soft earthen chalk (`#FBFBF7` light mode / `#121512` dark mode).
  - Structural Surfaces (30%): Moss slate (`#E8ECE5` light / `#1B221B` dark), gentle forest moss boundaries, hairline organic dividers.
  - Accent Budget (10%): Sage forest green (`#2D5A3D`), sunlit amber highlight (`#C47A2B`), and crisp unboxed text indicators.
- **Typography & Hierarchy**:
  - Display Font: `Plus Jakarta Sans` for clean, welcoming editorial confidence.
  - Body Prose: `DM Sans` for effortless legibility.
  - Numerals: Tabular monospace figures (`tabular-nums`) for outdoor timers and step estimates.
- **Motion & Tactile Feedback**:
  - Gentle pulsing circular aura during voice listening and speaking states.
  - Instant $(<150\text{ms})$ touch responses with tactile scale settles.
  - Smooth transitions into Pocket Mode with subtle safety wake instructions.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Hands-Free Voice Dialogue + Pocket Mode**
  - *Chosen Approach*: Web Speech API (`webkitSpeechRecognition`) for low-latency client speech-to-text with auto-restart loop, backed by Gemini 3.8 Flash for intelligent grounding responses, and Gemini TTS / SpeechSynthesis for natural voice responses. A dedicated Pocket Mode dims the screen, keeps the audio session awake, and supports hands-free conversation.
  - *Why*: True digital detox requires the user to put the phone in their pocket or hold it facing away. Standard chat interfaces force constant visual attention.
  - *Alternatives Considered*: Pure text chat (rejected because it forces users to keep staring at the screen while walking).

- **Decision 2: Ambient Web Audio Generator vs Heavy Remote MP3s**
  - *Chosen Approach*: Synthesize subtle procedural nature frequencies (gentle pink-noise wind filter, harmonic chimes, stream ripple) directly in browser Web Audio API.
  - *Why*: Instant loading, zero external asset dependencies, zero network latency, and works reliably offline or in low-signal park areas.

- **Decision 3: Local Session Memory & Daily Sunlight Log**
  - *Chosen Approach*: Client-side `localStorage` persistence with exportable activity history, streak tracker, and outdoor minutes tally.
  - *Why*: Instant access, privacy-first (no login barriers between the user and stepping out the door immediately), zero server database lock-in.

---

### 4. Technical Architecture & Data Strategy

#### System Architecture & Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    NatureHeal User Experience                   │
└─────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┴───────────────────────┐
        ▼                                               ▼
┌───────────────────────────────┐     ┌──────────────────────────┐
│     Voice Interaction Hub     │     │     Outdoor Walk Mode    │
│  - Speech Recognition Loop    │     │  - Dimmed Pocket Screen  │
│  - Gemini AI Guide Prompts    │     │  - Hands-Free Check-ins  │
│  - Natural Speech Playback    │     │  - Ambient Soundscape    │
└───────────────┬───────────────┘     └─────────────┬────────────┘
                │                                   │
                ▼                                   ▼
┌───────────────────────────────┐     ┌──────────────────────────┐
│      Express Backend API      │     │    Local Walk Journal    │
│  - /api/guide/converse        │     │  - Outdoor minutes tally │
│  - Gemini 3.8 Flash Model     │     │  - Sensory stroll logs   │
│  - Grounding System Prompts   │     │  - Mood before/after     │
└───────────────────────────────┘     └──────────────────────────┘
```

#### Component & State Structure
- `App.tsx`: Top-level router and active mode coordinator (`Home`, `WalkSession`, `PocketMode`, `History`, `Settings`).
- `VoiceGuide.tsx`: Continuous voice interaction bubble with visual breath aura, microphone state, listening status, and transcript streaming.
- `WalkSession.tsx`: Active walk timer, outdoor mission prompt, audio ambient soundscape player, and Pocket Mode trigger.
- `PocketMode.tsx`: Ultra-low glare, high-contrast pocket display with lock protection, big accessible emergency buttons, and hands-free voice guidance.
- `SensoryMissions.tsx`: Curated list and dynamic AI generator of outdoor strolls (e.g., "The Canopy Gaze", "Wind & Texture", "5-Senses Grounding", "Color Spotting").
- `WalkHistory.tsx`: Outdoor detox stats, weekly streak, total minutes under the open sky, and reflective notes.
- `server.ts`: Server proxy route for Gemini API using `@google/genai` with `gemini-3.8-flash` to craft gentle, brief, audio-friendly responses under 40 words each (ideal for speech synthesis).

---

### 5. Implementation Steps

1. **Server & Gemini Integration**: Set up Express server route `/api/guide/converse` initialized with `@google/genai` SDK using `gemini-3.8-flash` with strict speech-first concise grounding system instructions.
2. **Voice Engine & Audio Hooks**: Implement `useVoiceAssistant` custom hook managing Web Speech recognition, speech synthesis, transcript history, and microphone permission recovery.
3. **Procedural Ambient Nature Sound**: Implement lightweight Web Audio synthesizer for soothing natural soundscapes (wind, rustling foliage, tranquil stream).
4. **Pocket Mode & Walk Session**: Create the active outdoor walk screen with Pocket Mode (dimmed black canvas, large touch-friendly actions, speech recognition loop).
5. **Sensory Missions & Journaling**: Build sensory outdoor mission cards and a journal to review past outdoor sessions and track digital detox time.
6. **Polished Styling & Verification**: Apply Tailwind Japandi aesthetic, full keyboard and touch accessibility, test build with `compile_applet`.
