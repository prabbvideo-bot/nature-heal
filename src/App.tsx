/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { MissionsCatalog } from './components/MissionsCatalog';
import { VoiceGuideView } from './components/VoiceGuideView';
import { WalkSession } from './components/WalkSession';
import { PocketMode } from './components/PocketMode';
import { WalkReflection, WalkLogEntry } from './components/WalkReflection';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';
import { SensoryMission, CURATED_MISSIONS } from './data/missions';
import { ambientSound, SoundscapeType } from './utils/ambientSound';
import { Sun, Footprints, Mic, Calendar } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'today' | 'missions' | 'history' | 'guide'>('today');
  
  // Active Walk State
  const [isWalkActive, setIsWalkActive] = useState(false);
  const [activeMission, setActiveMission] = useState<SensoryMission | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isPocketMode, setIsPocketMode] = useState(false);
  
  // Post-Walk Reflection State
  const [showReflection, setShowReflection] = useState(false);
  const [finishedWalkData, setFinishedWalkData] = useState<{
    mission: SensoryMission | null;
    durationMinutes: number;
    estimatedSteps: number;
  } | null>(null);

  // Soundscape State
  const [ambientPreset, setAmbientPreset] = useState<SoundscapeType>('canopy_wind');
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);

  // Walk History State (LocalStorage)
  const [logs, setLogs] = useState<WalkLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('natureheal_logs_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Default initial seed log for immediate visual satisfaction
    return [
      {
        id: 'seed-1',
        date: new Date(Date.now() - 86400000).toISOString(),
        missionTitle: 'The Canopy & Horizon Gaze',
        durationMinutes: 15,
        estimatedSteps: 1570,
        sensoryFocus: 'Sight',
        moodAfter: 'Refreshed & Grounded',
        reflectionNotes: 'Noticed the golden autumn leaves fluttering against the blue sky. Eye strain was noticeably gone.',
      },
    ];
  });

  // Save logs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('natureheal_logs_v1', JSON.stringify(logs));
    } catch {}
  }, [logs]);

  // Voice Assistant Hook
  const voice = useVoiceAssistant(
    isWalkActive
      ? {
          isWalking: true,
          durationMinutes: Math.floor(elapsedSeconds / 60),
          missionTitle: activeMission?.title || 'Sensory Walk',
        }
      : undefined
  );

  // Walk Timer Interval
  const timerRef = useRef<any>(null);
  useEffect(() => {
    if (isWalkActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isWalkActive, isPaused]);

  // Periodic Voice Nudge during Outdoor Walk (e.g., every 5 minutes)
  const lastNudgeMinuteRef = useRef<number>(0);
  useEffect(() => {
    if (!isWalkActive || isPaused) return;
    const currentMin = Math.floor(elapsedSeconds / 60);

    if (currentMin > 0 && currentMin % 5 === 0 && currentMin !== lastNudgeMinuteRef.current) {
      lastNudgeMinuteRef.current = currentMin;
      const nudges = [
        "Take a slow breath. Let your shoulders drop away from your ears.",
        "Look up past the roofs into the open sky. Soften your gaze.",
        "Notice the texture of the air against your hands and cheeks.",
        "Feel the rhythm of your shoes connecting with the ground.",
      ];
      const selected = nudges[Math.floor(Math.random() * nudges.length)];
      voice.speak(selected);
    }
  }, [elapsedSeconds, isWalkActive, isPaused, voice]);

  // Start a specific sensory walk
  const handleStartMission = (mission: SensoryMission) => {
    setActiveMission(mission);
    setElapsedSeconds(0);
    setIsPaused(false);
    setIsWalkActive(true);
    setIsPocketMode(false);
    lastNudgeMinuteRef.current = 0;

    // Start ambient sound if selected
    if (ambientPreset !== 'silent') {
      ambientSound.start(ambientPreset, 0.25);
      setIsAmbientPlaying(true);
    }

    // Speak intro invitation
    voice.speak(mission.voiceIntro);
  };

  // Quick Start Default Walk
  const handleQuickStart = () => {
    handleStartMission(CURATED_MISSIONS[0]);
  };

  // End active walk and trigger reflection
  const handleEndWalk = () => {
    setIsWalkActive(false);
    setIsPocketMode(false);
    ambientSound.stop();
    setIsAmbientPlaying(false);

    const durationMins = Math.max(1, Math.round(elapsedSeconds / 60));
    const steps = Math.floor(durationMins * 105);

    setFinishedWalkData({
      mission: activeMission,
      durationMinutes: durationMins,
      estimatedSteps: steps,
    });
    setShowReflection(true);
  };

  const handleSaveLog = (entry: WalkLogEntry) => {
    setLogs((prev) => [entry, ...prev]);
  };

  const handleDismissReflection = () => {
    setShowReflection(false);
    setFinishedWalkData(null);
    setActiveMission(null);
    setCurrentTab('history');
  };

  // Ambient sound controls
  const handleToggleAmbient = () => {
    if (isAmbientPlaying) {
      ambientSound.stop();
      setIsAmbientPlaying(false);
    } else {
      ambientSound.start(ambientPreset, 0.25);
      setIsAmbientPlaying(true);
    }
  };

  const handleChangeSoundscape = (type: SoundscapeType) => {
    setAmbientPreset(type);
    if (type === 'silent') {
      ambientSound.stop();
      setIsAmbientPlaying(false);
    } else {
      ambientSound.start(type, 0.25);
      setIsAmbientPlaying(true);
    }
  };

  const handleQuickVoicePrompt = (promptText: string) => {
    setCurrentTab('guide');
    voice.sendUserMessage(promptText);
  };

  // Today's total outdoor minutes calculation
  const todayDateStr = new Date().toISOString().slice(0, 10);
  const todayOutdoorMinutes = logs
    .filter((l) => l.date.startsWith(todayDateStr))
    .reduce((acc, l) => acc + l.durationMinutes, 0);

  // Pocket Mode View takes over screen if active
  if (isWalkActive && isPocketMode) {
    return (
      <PocketMode
        mission={activeMission}
        elapsedSeconds={elapsedSeconds}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused((prev) => !prev)}
        onEndWalk={handleEndWalk}
        onExitPocketMode={() => setIsPocketMode(false)}
        isListening={voice.isListening}
        isSpeaking={voice.isSpeaking}
        isHandsFree={voice.isHandsFree}
        onToggleHandsFree={voice.toggleHandsFree}
        onTalkToGuide={voice.isListening ? voice.stopListening : voice.startListening}
        ambientPreset={ambientPreset}
        isAmbientPlaying={isAmbientPlaying}
        onToggleAmbient={handleToggleAmbient}
        lastGuideMessage={voice.history[voice.history.length - 1]?.text}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9F5] text-stone-900 flex flex-col font-sans">
      {/* Top Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isWalkActive={isWalkActive}
        onOpenWalk={() => setIsPocketMode(false)}
        onQuickStart={handleQuickStart}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* If Walk is currently active, render WalkSession */}
        {isWalkActive ? (
          <WalkSession
            mission={activeMission}
            elapsedSeconds={elapsedSeconds}
            isPaused={isPaused}
            onTogglePause={() => setIsPaused((prev) => !prev)}
            onEndWalk={handleEndWalk}
            onEnterPocketMode={() => setIsPocketMode(true)}
            isListening={voice.isListening}
            isSpeaking={voice.isSpeaking}
            isHandsFree={voice.isHandsFree}
            onToggleHandsFree={voice.toggleHandsFree}
            onTalkToGuide={voice.isListening ? voice.stopListening : voice.startListening}
            ambientPreset={ambientPreset}
            onChangeSoundscape={handleChangeSoundscape}
            isAmbientPlaying={isAmbientPlaying}
            onToggleAmbient={handleToggleAmbient}
            lastGuideMessage={voice.history[voice.history.length - 1]?.text}
          />
        ) : (
          <>
            {currentTab === 'today' && (
              <Dashboard
                onStartMission={handleStartMission}
                onOpenVoiceGuide={() => setCurrentTab('guide')}
                isListening={voice.isListening}
                isSpeaking={voice.isSpeaking}
                onQuickVoicePrompt={handleQuickVoicePrompt}
                todayOutdoorMinutes={todayOutdoorMinutes}
                streakDays={logs.length > 0 ? 3 : 1}
                isAmbientPlaying={isAmbientPlaying}
                ambientPreset={ambientPreset}
                onToggleAmbient={handleToggleAmbient}
              />
            )}

            {currentTab === 'missions' && (
              <MissionsCatalog
                onStartMission={handleStartMission}
                speak={voice.speak}
              />
            )}

            {currentTab === 'guide' && (
              <VoiceGuideView
                isListening={voice.isListening}
                isSpeaking={voice.isSpeaking}
                isHandsFree={voice.isHandsFree}
                onToggleHandsFree={voice.toggleHandsFree}
                onStartListening={voice.startListening}
                onStopListening={voice.stopListening}
                transcript={voice.transcript}
                interimTranscript={voice.interimTranscript}
                history={voice.history}
                onSendMessage={voice.sendUserMessage}
                onLaunchWalk={handleQuickStart}
                micError={voice.micError}
              />
            )}

            {currentTab === 'history' && (
              <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
                      Digital Detox & Sunlight Log
                    </h1>
                    <p className="text-sm text-stone-600 mt-1">
                      Every minute logged here is time spent in physical reality away from displays.
                    </p>
                  </div>
                  {logs.length > 0 && (
                    <button
                      onClick={() => setLogs([])}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-500 hover:text-rose-700 bg-white shadow-2xs transition-colors self-start sm:self-auto"
                    >
                      Clear Log
                    </button>
                  )}
                </div>

                {/* Primary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm">
                    <div className="flex items-center gap-2 text-emerald-800 mb-2">
                      <Sun className="w-4 h-4" />
                      <span className="text-xs uppercase font-mono font-semibold tracking-wider">
                        Open Air Time
                      </span>
                    </div>
                    <div className="text-3xl font-bold font-mono tabular-nums text-stone-900">
                      {logs.reduce((acc, l) => acc + l.durationMinutes, 0)} <span className="text-sm font-normal text-stone-500">mins</span>
                    </div>
                    <p className="text-xs text-stone-700 mt-2">
                      Healthy photon soak & eye rest
                    </p>
                  </div>

                  <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm">
                    <div className="flex items-center gap-2 text-emerald-800 mb-2">
                      <Footprints className="w-4 h-4" />
                      <span className="text-xs uppercase font-mono font-semibold tracking-wider">
                        Cadence
                      </span>
                    </div>
                    <div className="text-3xl font-bold font-mono tabular-nums text-stone-900">
                      {logs.reduce((acc, l) => acc + l.estimatedSteps, 0).toLocaleString()} <span className="text-sm font-normal text-stone-500">steps</span>
                    </div>
                    <p className="text-xs text-stone-700 mt-2">
                      Bilateral physical movement
                    </p>
                  </div>

                  <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm">
                    <div className="flex items-center gap-2 text-emerald-800 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs uppercase font-mono font-semibold tracking-wider">
                        Screen-Free Walks
                      </span>
                    </div>
                    <div className="text-3xl font-bold font-mono tabular-nums text-stone-900">
                      {logs.length} <span className="text-sm font-normal text-stone-500">walks</span>
                    </div>
                    <p className="text-xs text-stone-700 mt-2">
                      Recorded outdoor pauses
                    </p>
                  </div>
                </div>

                {/* History List */}
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs space-y-2.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h2 className="text-base font-bold text-stone-900">
                          {log.missionTitle}
                        </h2>
                        <div className="flex items-center gap-2 text-xs text-stone-700 font-mono">
                          <span>{log.durationMinutes} min</span>
                          <span aria-hidden="true">·</span>
                          <span>~{log.estimatedSteps.toLocaleString()} steps</span>
                          <span aria-hidden="true">·</span>
                          <span>{new Date(log.date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {log.moodAfter && (
                        <p className="text-xs text-emerald-900 font-medium">
                          Feeling after: <span className="font-semibold">{log.moodAfter}</span>
                        </p>
                      )}

                      {log.reflectionNotes && (
                        <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100 italic">
                          "{log.reflectionNotes}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Post-Walk Reflection Dialog */}
      {showReflection && finishedWalkData && (
        <WalkReflection
          mission={finishedWalkData.mission}
          durationMinutes={finishedWalkData.durationMinutes}
          estimatedSteps={finishedWalkData.estimatedSteps}
          onSaveLog={handleSaveLog}
          onDismiss={handleDismissReflection}
          speak={voice.speak}
        />
      )}

      {/* Fixed Bottom Mobile Tab Bar (Thumb-Zone Navigation Pattern 1 from mobile design reference) */}
      {!isPocketMode && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F8F9F5]/95 backdrop-blur-md border-t border-stone-200/80">
          <div className="grid grid-cols-4 items-center h-16 px-2">
            <button
              onClick={() => setCurrentTab('today')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                currentTab === 'today' ? 'text-emerald-900 font-bold' : 'text-stone-500'
              }`}
            >
              <span className="text-base">🌿</span>
              <span className="text-[10px] tracking-tight mt-0.5">Today</span>
            </button>

            <button
              onClick={() => setCurrentTab('missions')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                currentTab === 'missions' ? 'text-emerald-900 font-bold' : 'text-stone-500'
              }`}
            >
              <Footprints className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Walks</span>
            </button>

            <button
              onClick={() => setCurrentTab('guide')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                currentTab === 'guide' ? 'text-emerald-900 font-bold' : 'text-stone-500'
              }`}
            >
              <Mic className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Voice Guide</span>
            </button>

            <button
              onClick={() => setCurrentTab('history')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                currentTab === 'history' ? 'text-emerald-900 font-bold' : 'text-stone-500'
              }`}
            >
              <Sun className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-0.5">Detox Log</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
