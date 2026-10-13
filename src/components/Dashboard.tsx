import { useState } from 'react';
import { 
  Footprints, Mic, Smartphone, Sun, Wind, Sparkles, 
  ArrowRight, Compass, Volume2, ShieldCheck, Heart 
} from 'lucide-react';
import { SensoryMission, CURATED_MISSIONS } from '../data/missions';
import { SoundscapeType } from '../utils/ambientSound';

interface DashboardProps {
  onStartMission: (mission: SensoryMission) => void;
  onOpenVoiceGuide: () => void;
  isListening: boolean;
  isSpeaking: boolean;
  onQuickVoicePrompt: (promptText: string) => void;
  todayOutdoorMinutes: number;
  streakDays: number;
  isAmbientPlaying: boolean;
  ambientPreset: SoundscapeType;
  onToggleAmbient: () => void;
}

export function Dashboard({
  onStartMission,
  onOpenVoiceGuide,
  isListening,
  isSpeaking,
  onQuickVoicePrompt,
  todayOutdoorMinutes,
  streakDays,
  isAmbientPlaying,
  ambientPreset,
  onToggleAmbient,
}: DashboardProps) {
  const [selectedQuickTime, setSelectedQuickTime] = useState<number>(15);

  const featuredMissions = CURATED_MISSIONS.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-8">
      {/* Hero: Voice Sanctuary & Screen Detachment Invitation */}
      <div className="bg-gradient-to-b from-white to-[#F4F6F0] rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm relative overflow-hidden">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          {/* Unboxed editorial kicker */}
          <div className="flex items-center justify-center gap-2 text-xs text-stone-700 font-mono">
            <span>Voice-First Presence</span>
            <span aria-hidden="true">·</span>
            <span>Digital Detox</span>
            <span aria-hidden="true">·</span>
            <span>Physical Grounding</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
            AI that gives you a reason to <span className="text-emerald-900">put your phone down.</span>
          </h1>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl mx-auto">
            Instead of demanding your eyes stay locked on glass, NatureHeal speaks naturally with you, invites you into open daylight, and stays quiet in your pocket while you walk.
          </p>

          {/* Central Voice Breath Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenVoiceGuide}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-emerald-900 hover:bg-emerald-800 text-stone-50 font-semibold text-sm sm:text-base shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-3 transition-all active:scale-98"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-800 flex items-center justify-center">
                <Mic className="w-4 h-4 text-emerald-300" />
              </div>
              <span>Speak with NatureHeal</span>
            </button>

            <button
              onClick={() => onStartMission(featuredMissions[0])}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-stone-50 text-stone-900 font-semibold text-sm sm:text-base border border-stone-200 shadow-2xs flex items-center justify-center gap-2.5 transition-all active:scale-98"
            >
              <Footprints className="w-5 h-5 text-emerald-800" />
              <span>Step Outside Now (15m)</span>
            </button>
          </div>

          {/* Quick Voice Starters */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-stone-700 font-mono mr-1">Ask:</span>
            <button
              onClick={() => onQuickVoicePrompt("I've been staring at a screen for four hours straight.")}
              className="text-xs text-stone-700 hover:text-emerald-900 hover:underline px-2 py-1 rounded bg-stone-100/80 transition-colors"
            >
              "I've been on screens for hours..."
            </button>
            <button
              onClick={() => onQuickVoicePrompt("Give me a quick 10-minute reason to walk outside.")}
              className="text-xs text-stone-700 hover:text-emerald-900 hover:underline px-2 py-1 rounded bg-stone-100/80 transition-colors"
            >
              "Quick 10-minute reason to walk..."
            </button>
            <button
              onClick={() => onQuickVoicePrompt("What should I look for on my walk today?")}
              className="text-xs text-stone-700 hover:text-emerald-900 hover:underline px-2 py-1 rounded bg-stone-100/80 transition-colors"
            >
              "What should I look for today?"
            </button>
          </div>
        </div>
      </div>

      {/* Today's Natural Daylight & Screen Detox Status Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Sun className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-700 font-mono uppercase block">Today Outdoors</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">
              {todayOutdoorMinutes} min
            </span>
            <span className="text-[11px] text-stone-700 block mt-0.5">
              Goal: 20 min natural light
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-700 font-mono uppercase block">Screen-Off Mode</span>
            <span className="text-sm font-bold text-stone-900 block mt-1">
              Pocket & Earphone Ready
            </span>
            <span className="text-[11px] text-stone-700 block">
              Audio cues with zero screen glance
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-2xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
              <Volume2 className="w-6 h-6 text-emerald-800" />
            </div>
            <div>
              <span className="text-xs text-stone-700 font-mono uppercase block">Ambient Nature</span>
              <span className="text-xs font-semibold text-stone-800 block mt-0.5">
                {isAmbientPlaying ? 'Canopy Breeze Playing' : 'Silent Presence'}
              </span>
            </div>
          </div>
          <button
            onClick={onToggleAmbient}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              isAmbientPlaying
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
          >
            {isAmbientPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>

      {/* Featured Sensory Strolls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              Recommended Sensory Strolls
            </h2>
            <p className="text-xs text-stone-500">
              Each walk offers tactile guidance to shift focus from mental chatter to sensory presence.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredMissions.map((mission) => (
            <div
              key={mission.id}
              className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm flex flex-col justify-between hover:border-emerald-800/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-stone-700 font-mono">
                  <span>{mission.sensoryFocus} Focus</span>
                  <span aria-hidden="true">·</span>
                  <span>{mission.durationMinutes} min</span>
                </div>

                <h3 className="text-base font-bold text-stone-900">
                  {mission.title}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {mission.description}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-700 font-mono">
                  Hands-free
                </span>
                <button
                  onClick={() => onStartMission(mission)}
                  className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-emerald-900 text-stone-50 font-semibold text-xs flex items-center gap-1.5 transition-colors active:scale-98"
                >
                  <span>Start Walk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The Pocket Mode Manifesto Card */}
      <div className="bg-stone-900 text-stone-200 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-md">
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-xs uppercase font-mono tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Built Around Hands-Free Movement</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            How Pocket Mode Works
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            1. Put your wired or bluetooth headphones on.<br />
            2. Tap <strong>Start Walk</strong> and select <strong>Enter Pocket Mode</strong>.<br />
            3. Your screen will dim completely and lock against accidental fabric touches.<br />
            4. Speak into your microphone whenever you want to converse with NatureHeal, or enjoy unhurried audio nudges at gentle intervals.
          </p>
        </div>
      </div>
    </div>
  );
}
