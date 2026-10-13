import { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Lock, Unlock, Pause, Play, Square, Eye, Sparkles } from 'lucide-react';
import { SensoryMission } from '../data/missions';

interface PocketModeProps {
  mission: SensoryMission | null;
  elapsedSeconds: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onEndWalk: () => void;
  onExitPocketMode: () => void;
  isListening: boolean;
  isSpeaking: boolean;
  isHandsFree: boolean;
  onToggleHandsFree: () => void;
  onTalkToGuide: () => void;
  ambientPreset: string;
  isAmbientPlaying: boolean;
  onToggleAmbient: () => void;
  lastGuideMessage?: string;
}

export function PocketMode({
  mission,
  elapsedSeconds,
  isPaused,
  onTogglePause,
  onEndWalk,
  onExitPocketMode,
  isListening,
  isSpeaking,
  isHandsFree,
  onToggleHandsFree,
  onTalkToGuide,
  ambientPreset,
  isAmbientPlaying,
  onToggleAmbient,
  lastGuideMessage,
}: PocketModeProps) {
  const [isLocked, setIsLocked] = useState(false);
  const [unlockProgress, setUnlockProgress] = useState(0);

  // Format mm:ss
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  // Approximate steps based on unhurried 100 steps/min
  const estimatedSteps = Math.floor((elapsedSeconds / 60) * 105);

  // Handle unlock hold
  useEffect(() => {
    let interval: any;
    if (unlockProgress > 0 && unlockProgress < 100) {
      interval = setInterval(() => {
        setUnlockProgress((prev) => Math.min(100, prev + 25));
      }, 100);
    } else if (unlockProgress >= 100) {
      setIsLocked(false);
      setUnlockProgress(0);
    }
    return () => clearInterval(interval);
  }, [unlockProgress]);

  return (
    <div className="fixed inset-0 z-50 bg-[#080B08] text-stone-300 flex flex-col justify-between p-6 sm:p-8 select-none transition-colors duration-700">
      {/* Top Bar in Pocket Mode */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono">
            Screen-Off Pocket Walk
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLocked(!isLocked)}
            className={`p-2.5 rounded-full border transition-all ${
              isLocked
                ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
            title={isLocked ? 'Screen Locked' : 'Lock Screen Against Accidental Pocket Taps'}
          >
            {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
          </button>

          {!isLocked && (
            <button
              onClick={onExitPocketMode}
              className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Normal View</span>
            </button>
          )}
        </div>
      </div>

      {/* Screen Lock Overlay */}
      {isLocked ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="w-20 h-20 rounded-full border border-stone-800 bg-stone-950 flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-amber-400/80" />
          </div>
          <p className="text-lg font-medium text-stone-200 mb-2">
            Pocket Protection Active
          </p>
          <p className="text-xs text-stone-400 max-w-xs mb-8">
            Phone is safe in your pocket. NatureHeal is listening and audio guidance remains active.
          </p>

          <button
            onMouseDown={() => setUnlockProgress(25)}
            onMouseUp={() => setUnlockProgress(0)}
            onTouchStart={() => setUnlockProgress(25)}
            onTouchEnd={() => setUnlockProgress(0)}
            className="relative px-8 py-4 rounded-2xl bg-stone-900 border border-stone-700 text-stone-200 text-sm font-medium overflow-hidden active:scale-98 transition-all"
          >
            <div
              className="absolute inset-0 bg-amber-500/20 transition-all"
              style={{ width: `${unlockProgress}%` }}
            />
            <span className="relative z-10">Press & Hold to Unlock</span>
          </button>
        </div>
      ) : (
        /* Center Aura & Visual State */
        <div className="flex-1 flex flex-col items-center justify-center my-auto text-center px-4 max-w-md mx-auto">
          {/* Breathing Voice Aura */}
          <div className="relative mb-8">
            <div
              className={`w-36 h-36 rounded-full flex items-center justify-center transition-all duration-700 ${
                isSpeaking
                  ? 'bg-emerald-900/40 border-2 border-emerald-400/60 scale-105 shadow-[0_0_60px_rgba(52,211,153,0.2)]'
                  : isListening
                  ? 'bg-amber-900/30 border-2 border-amber-400/60 animate-gentle-pulse shadow-[0_0_50px_rgba(251,191,36,0.15)]'
                  : 'bg-stone-900/60 border border-stone-800'
              }`}
            >
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-transform duration-500 ${
                  isSpeaking ? 'scale-110' : ''
                }`}
              >
                {isSpeaking ? (
                  <Sparkles className="w-10 h-10 text-emerald-400 animate-spin" />
                ) : isListening ? (
                  <Mic className="w-10 h-10 text-amber-400 animate-pulse" />
                ) : (
                  <span className="text-3xl">🍃</span>
                )}
              </div>
            </div>

            {/* Ripple rings */}
            {(isSpeaking || isListening) && (
              <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping pointer-events-none" />
            )}
          </div>

          {/* Time & Mission */}
          <div className="text-5xl sm:text-6xl font-mono tabular-nums font-bold tracking-tight text-white mb-2">
            {timeFormatted}
          </div>

          <div className="flex items-center justify-center gap-3 text-xs text-stone-400 font-mono mb-4">
            <span>~{estimatedSteps.toLocaleString()} steps</span>
            <span>·</span>
            <span className="text-emerald-400">{mission?.sensoryFocus || 'Mindful'} Focus</span>
          </div>

          <h2 className="text-base sm:text-lg font-semibold text-stone-200 mb-2">
            {mission?.title || 'Open Air Stroll'}
          </h2>

          <p className="text-xs text-stone-400 leading-relaxed mb-6 italic max-w-sm">
            {lastGuideMessage ||
              mission?.description ||
              'Walk naturally with your head up. Feel the crisp air on your face.'}
          </p>

          {/* Hands-free Voice Status Badge */}
          <div className="flex items-center justify-center gap-2 text-xs py-1.5 px-3 rounded-full bg-stone-900/80 border border-stone-800 text-stone-300">
            {isHandsFree ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Hands-free voice listening</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-stone-600" />
                <span>Push-to-talk voice ready</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Bottom Thumb Control Zone */}
      {!isLocked && (
        <div className="space-y-4 max-w-md mx-auto w-full">
          {/* Quick Voice & Ambient Controls */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={onTalkToGuide}
              className={`h-12 rounded-xl flex items-center justify-center gap-2 text-xs font-medium border transition-colors ${
                isListening
                  ? 'bg-amber-950/60 border-amber-500/60 text-amber-200'
                  : 'bg-stone-900 border-stone-800 text-stone-200 hover:bg-stone-800'
              }`}
            >
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>{isListening ? 'Listening...' : 'Speak Now'}</span>
            </button>

            <button
              onClick={onToggleHandsFree}
              className={`h-12 rounded-xl flex items-center justify-center gap-2 text-xs font-medium border transition-colors ${
                isHandsFree
                  ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {isHandsFree ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              <span>{isHandsFree ? 'Auto Voice On' : 'Auto Voice Off'}</span>
            </button>

            <button
              onClick={onToggleAmbient}
              className={`h-12 rounded-xl flex items-center justify-center gap-2 text-xs font-medium border transition-colors ${
                isAmbientPlaying
                  ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {isAmbientPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{isAmbientPlaying ? 'Nature Audio' : 'Muted'}</span>
            </button>
          </div>

          {/* Primary Action Buttons: Pause & Complete */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onTogglePause}
              className="h-14 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 font-semibold text-sm flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              {isPaused ? <Play className="w-5 h-5 text-emerald-400" /> : <Pause className="w-5 h-5" />}
              <span>{isPaused ? 'Resume Walk' : 'Pause Walk'}</span>
            </button>

            <button
              onClick={onEndWalk}
              className="h-14 rounded-2xl bg-emerald-900 hover:bg-emerald-800 text-stone-100 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-transform active:scale-98"
            >
              <Square className="w-5 h-5 fill-current" />
              <span>Complete Walk</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
