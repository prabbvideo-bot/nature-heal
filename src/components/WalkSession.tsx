import { useState } from 'react';
import { 
  Play, Pause, Square, Mic, MicOff, Volume2, VolumeX, 
  Smartphone, Compass, Footprints, Wind, Droplets, CheckCircle2 
} from 'lucide-react';
import { SensoryMission } from '../data/missions';
import { SoundscapeType } from '../utils/ambientSound';

interface WalkSessionProps {
  mission: SensoryMission | null;
  elapsedSeconds: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onEndWalk: () => void;
  onEnterPocketMode: () => void;
  isListening: boolean;
  isSpeaking: boolean;
  isHandsFree: boolean;
  onToggleHandsFree: () => void;
  onTalkToGuide: () => void;
  ambientPreset: SoundscapeType;
  onChangeSoundscape: (type: SoundscapeType) => void;
  isAmbientPlaying: boolean;
  onToggleAmbient: () => void;
  lastGuideMessage?: string;
}

export function WalkSession({
  mission,
  elapsedSeconds,
  isPaused,
  onTogglePause,
  onEndWalk,
  onEnterPocketMode,
  isListening,
  isSpeaking,
  isHandsFree,
  onToggleHandsFree,
  onTalkToGuide,
  ambientPreset,
  onChangeSoundscape,
  isAmbientPlaying,
  onToggleAmbient,
  lastGuideMessage,
}: WalkSessionProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const estimatedSteps = Math.floor((elapsedSeconds / 60) * 105);

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* Top Banner: Pocket Mode Callout */}
      <div className="bg-gradient-to-r from-emerald-900 to-stone-900 text-stone-100 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-800/80 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-semibold">
              Ready to put your phone away?
            </h2>
            <p className="text-xs text-emerald-200/90">
              Screen-off Pocket Mode keeps audio active while locking the screen against accidental touches.
            </p>
          </div>
        </div>

        <button
          onClick={onEnterPocketMode}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-semibold text-xs sm:text-sm whitespace-nowrap shrink-0 transition-transform active:scale-98 shadow-sm flex items-center justify-center gap-2"
        >
          <Smartphone className="w-4 h-4" />
          <span>Enter Pocket Mode</span>
        </button>
      </div>

      {/* Main Walk Metric & Timer Display */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm text-center relative overflow-hidden">
        {/* Subtle background nature texture */}
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 rounded-full bg-emerald-50 pointer-events-none" />

        <div className="flex items-center justify-center gap-3 text-xs text-stone-700 font-mono mb-2">
          <span>{mission?.sensoryFocus || 'Mindful'} Focus</span>
          <span>·</span>
          <span>Target: {mission?.durationMinutes || 15} mins</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-4">
          {mission?.title || 'Open Air Stroll'}
        </h1>

        {/* Big Monospace Stopwatch */}
        <div className="text-6xl sm:text-7xl font-bold font-mono tabular-nums tracking-tight text-stone-900 my-4">
          {timeFormatted}
        </div>

        <div className="flex items-center justify-center gap-6 text-sm text-stone-600 font-mono mb-6">
          <div className="flex items-center gap-1.5">
            <Footprints className="w-4 h-4 text-emerald-700" />
            <span>~{estimatedSteps.toLocaleString()} paces</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-emerald-700" />
            <span>{isPaused ? 'Paused' : 'Active Movement'}</span>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center justify-center gap-3 max-w-sm mx-auto">
          <button
            onClick={onTogglePause}
            className="flex-1 h-12 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-medium text-sm flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-700" /> : <Pause className="w-4 h-4" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <button
            onClick={onEndWalk}
            className="flex-1 h-12 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-stone-50 font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>Complete Walk</span>
          </button>
        </div>
      </div>

      {/* Voice Assistant Interaction Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-3 h-3 rounded-full ${
                isSpeaking
                  ? 'bg-emerald-500 animate-pulse'
                  : isListening
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-stone-400'
              }`}
            />
            <h2 className="text-base font-semibold text-stone-900">
              Voice Guide Companion
            </h2>
          </div>

          <button
            onClick={onToggleHandsFree}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              isHandsFree
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
          >
            {isHandsFree ? <Mic className="w-3.5 h-3.5 text-emerald-700" /> : <MicOff className="w-3.5 h-3.5" />}
            <span>{isHandsFree ? 'Hands-Free Active' : 'Hands-Free Off'}</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60">
          <p className="text-xs text-stone-700 uppercase tracking-wider font-mono mb-1">
            NatureHeal Whispers:
          </p>
          <p className="text-sm text-stone-800 leading-relaxed italic">
            "{lastGuideMessage || mission?.voiceIntro || 'Breathe in the outdoor air. Notice the gentle movement around you.'}"
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onTalkToGuide}
            className={`flex-1 h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-medium border transition-colors ${
              isListening
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-800'
            }`}
          >
            <Mic className="w-4 h-4 text-emerald-800" />
            <span>{isListening ? 'Listening to your voice...' : 'Talk with NatureHeal'}</span>
          </button>
        </div>
      </div>

      {/* Sensory Guidance Steps Checklist */}
      {mission?.guidanceSteps && mission.guidanceSteps.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-stone-900">
            Sensory Observational Guide
          </h2>
          <p className="text-xs text-stone-700">
            Take note of these as you walk. Tap to check them off when you notice them:
          </p>

          <div className="space-y-2.5">
            {mission.guidanceSteps.map((step, idx) => {
              const isDone = completedSteps.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                    isDone
                      ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950'
                      : 'bg-stone-50/60 border-stone-200/60 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <CheckCircle2
                    className={`w-5 h-5 shrink-0 mt-0.5 transition-colors ${
                      isDone ? 'text-emerald-700 fill-emerald-100' : 'text-stone-300'
                    }`}
                  />
                  <span className={`text-xs sm:text-sm leading-relaxed ${isDone ? 'line-through text-stone-700' : ''}`}>
                    {step}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Ambient Nature Soundscapes Selector */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-800" />
            <h2 className="text-base font-semibold text-stone-900">
              Procedural Nature Soundscape
            </h2>
          </div>

          <button
            onClick={onToggleAmbient}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              isAmbientPlaying
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-stone-50 border-stone-200 text-stone-600'
            }`}
          >
            {isAmbientPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{isAmbientPlaying ? 'Audio Playing' : 'Muted'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => onChangeSoundscape('canopy_wind')}
            className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-colors ${
              ambientPreset === 'canopy_wind' && isAmbientPlaying
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Wind className="w-4 h-4 text-emerald-700" />
            <span className="text-xs">Canopy Breeze</span>
          </button>

          <button
            onClick={() => onChangeSoundscape('mountain_brook')}
            className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-colors ${
              ambientPreset === 'mountain_brook' && isAmbientPlaying
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Droplets className="w-4 h-4 text-emerald-700" />
            <span className="text-xs">Mountain Brook</span>
          </button>

          <button
            onClick={() => onChangeSoundscape('peaceful_meadow')}
            className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-colors ${
              ambientPreset === 'peaceful_meadow' && isAmbientPlaying
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <span className="text-base">🌾</span>
            <span className="text-xs">Quiet Meadow</span>
          </button>

          <button
            onClick={() => onChangeSoundscape('silent')}
            className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-colors ${
              ambientPreset === 'silent' || !isAmbientPlaying
                ? 'bg-stone-200 border-stone-300 text-stone-900 font-medium'
                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <VolumeX className="w-4 h-4 text-stone-500" />
            <span className="text-xs">Real World Sound</span>
          </button>
        </div>
      </div>
    </div>
  );
}
