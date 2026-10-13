import { useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, Footprints, Sparkles } from 'lucide-react';
import { ChatTurn } from '../hooks/useVoiceAssistant';

interface VoiceGuideViewProps {
  isListening: boolean;
  isSpeaking: boolean;
  isHandsFree: boolean;
  onToggleHandsFree: () => void;
  onStartListening: () => void;
  onStopListening: () => void;
  transcript: string;
  interimTranscript: string;
  history: ChatTurn[];
  onSendMessage: (text: string) => void;
  onLaunchWalk: () => void;
  micError: string | null;
}

export function VoiceGuideView({
  isListening,
  isSpeaking,
  isHandsFree,
  onToggleHandsFree,
  onStartListening,
  onStopListening,
  transcript,
  interimTranscript,
  history,
  onSendMessage,
  onLaunchWalk,
  micError,
}: VoiceGuideViewProps) {
  const [inputText, setInputText] = useState('');

  const quickPrompts = [
    "I'm feeling screen fatigue",
    "Give me a 10-minute walk idea",
    "I have no motivation to step outside",
    "How can I do a mindful stroll?",
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* Hero Voice Orb Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm text-center relative overflow-hidden">
        <div className="max-w-md mx-auto space-y-6">
          <div className="relative inline-flex items-center justify-center">
            {/* Animated breathing glow */}
            <div
              className={`w-36 h-36 rounded-full flex items-center justify-center transition-all duration-700 ${
                isSpeaking
                  ? 'bg-emerald-100 border-4 border-emerald-400 scale-105 shadow-[0_0_50px_rgba(16,185,129,0.25)]'
                  : isListening
                  ? 'bg-amber-100 border-4 border-amber-400 animate-gentle-pulse shadow-[0_0_40px_rgba(245,158,11,0.25)]'
                  : 'bg-stone-100 border-2 border-stone-200'
              }`}
            >
              <button
                type="button"
                onClick={isListening ? onStopListening : onStartListening}
                className="w-24 h-24 rounded-full bg-emerald-900 text-stone-50 flex items-center justify-center shadow-md active:scale-95 transition-all hover:bg-emerald-800"
                aria-label={isListening ? 'Stop listening' : 'Start speaking'}
              >
                {isSpeaking ? (
                  <Sparkles className="w-9 h-9 animate-spin text-emerald-300" />
                ) : isListening ? (
                  <Mic className="w-9 h-9 text-amber-300 animate-pulse" />
                ) : (
                  <Mic className="w-9 h-9" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-stone-900">
              Speak Naturally with NatureHeal
            </h1>
            <p className="text-sm text-stone-600 max-w-sm mx-auto">
              {isSpeaking
                ? 'NatureHeal is speaking softly...'
                : isListening
                ? 'Listening to your voice. Speak freely...'
                : 'Tap the microphone or say how you are feeling.'}
            </p>
          </div>

          {/* Hands-free mode switch */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onToggleHandsFree}
              className={`px-4 py-2 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                isHandsFree
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-sm'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-900'
              }`}
            >
              {isHandsFree ? <Mic className="w-4 h-4 text-emerald-700" /> : <MicOff className="w-4 h-4" />}
              <span>{isHandsFree ? 'Continuous Hands-Free ON' : 'Turn On Hands-Free Mode'}</span>
            </button>

            <button
              onClick={onLaunchWalk}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-900 hover:bg-emerald-800 text-stone-50 flex items-center gap-2 shadow-sm transition-all"
            >
              <Footprints className="w-4 h-4" />
              <span>Start Outdoor Walk</span>
            </button>
          </div>

          {micError && (
            <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              {micError}
            </p>
          )}

          {/* Live speech preview if user is speaking */}
          {(transcript || interimTranscript) && (
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-left text-xs font-mono text-stone-700">
              <span className="text-stone-400 block mb-0.5 uppercase tracking-wider text-[10px]">
                Hearing you:
              </span>
              <span>{transcript}</span>
              <span className="text-stone-400 italic"> {interimTranscript}</span>
            </div>
          )}
        </div>
      </div>

      {/* Suggested Spoken Inquiries */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-stone-700 uppercase tracking-wider block px-1">
          Try saying or tapping:
        </span>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onSendMessage(prompt)}
              className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-700 hover:border-emerald-800 hover:text-emerald-900 hover:bg-emerald-50/50 transition-colors shadow-2xs text-left"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Spoken Dialogue History */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-stone-900">
          Spoken Conversation
        </h2>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {history.map((turn) => {
            const isGuide = turn.sender === 'guide';
            return (
              <div
                key={turn.id}
                className={`flex gap-3 ${isGuide ? 'justify-start' : 'justify-end'}`}
              >
                {isGuide && (
                  <div className="w-7 h-7 rounded-full bg-emerald-800 text-stone-100 flex items-center justify-center text-xs shrink-0 mt-0.5">
                    🌿
                  </div>
                )}
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isGuide
                      ? 'bg-stone-50 text-stone-800 border border-stone-200/60'
                      : 'bg-emerald-900 text-stone-50'
                  }`}
                >
                  {turn.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quiet Environment Text Fallback Input */}
        <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-stone-100">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type here if in a quiet office..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 bg-stone-50/60"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-stone-900 text-stone-50 hover:bg-stone-800 transition-colors shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
