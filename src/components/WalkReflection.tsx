import { useState } from 'react';
import { Sparkles, Mic, Check, ArrowRight } from 'lucide-react';
import { SensoryMission } from '../data/missions';

export interface WalkLogEntry {
  id: string;
  date: string;
  missionTitle: string;
  durationMinutes: number;
  estimatedSteps: number;
  sensoryFocus: string;
  moodBefore?: string;
  moodAfter?: string;
  reflectionNotes?: string;
}

interface WalkReflectionProps {
  mission: SensoryMission | null;
  durationMinutes: number;
  estimatedSteps: number;
  onSaveLog: (entry: WalkLogEntry) => void;
  onDismiss: () => void;
  speak: (text: string) => void;
}

export function WalkReflection({
  mission,
  durationMinutes,
  estimatedSteps,
  onSaveLog,
  onDismiss,
  speak,
}: WalkReflectionProps) {
  const [moodAfter, setMoodAfter] = useState<string>('Refreshed & Grounded');
  const [reflectionText, setReflectionText] = useState<string>('');
  const [closingMessage, setClosingMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moodOptions = [
    'Refreshed & Grounded',
    'Eyes Less Strained',
    'Calm & Unhurried',
    'Physically Energized',
    'Mentally Clear',
  ];

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/guide/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          durationMinutes: Math.max(1, durationMinutes),
          missionTitle: mission?.title || 'Mindful Outdoor Stroll',
          userReflection: reflectionText || moodAfter,
        }),
      });

      const data = await res.json();
      const closing = data.closing || "Welcome back. Take this grounded clarity with you into the rest of your day.";
      setClosingMessage(closing);
      speak(closing);
    } catch {
      const closing = "Welcome back. Notice the physical freshness you carry inside.";
      setClosingMessage(closing);
      speak(closing);
    } finally {
      setIsSubmitting(false);

      const entry: WalkLogEntry = {
        id: `walk-${Date.now()}`,
        date: new Date().toISOString(),
        missionTitle: mission?.title || 'Open Air Stroll',
        durationMinutes: Math.max(1, durationMinutes),
        estimatedSteps,
        sensoryFocus: mission?.sensoryFocus || 'Presence',
        moodAfter,
        reflectionNotes: reflectionText,
      };

      onSaveLog(entry);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto text-2xl">
            🌱
          </div>
          <h2 className="text-2xl font-bold text-stone-900">
            Welcome Back Inside
          </h2>
          <p className="text-sm text-stone-600">
            You just gave yourself <span className="font-semibold text-emerald-900 font-mono tabular-nums">{Math.max(1, durationMinutes)} minutes</span> of pure screen-free real world presence.
          </p>
        </div>

        {/* Walk Stat Summary Strip */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-center">
          <div>
            <span className="text-xs text-stone-700 uppercase font-mono block">Outdoors Time</span>
            <span className="text-xl font-bold font-mono tabular-nums text-stone-900">
              {Math.max(1, durationMinutes)} min
            </span>
          </div>
          <div>
            <span className="text-xs text-stone-700 uppercase font-mono block">Physical Cadence</span>
            <span className="text-xl font-bold font-mono tabular-nums text-stone-900">
              ~{estimatedSteps.toLocaleString()} steps
            </span>
          </div>
        </div>

        {closingMessage ? (
          /* Closing Guide Speech Card */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-center space-y-2">
              <Sparkles className="w-5 h-5 text-emerald-800 mx-auto" />
              <p className="text-xs uppercase tracking-wider text-emerald-800 font-mono font-medium">
                NatureHeal Closing
              </p>
              <p className="text-sm text-emerald-950 italic leading-relaxed">
                "{closingMessage}"
              </p>
            </div>

            <button
              onClick={onDismiss}
              className="w-full h-12 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-stone-50 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98"
            >
              <span>Return to Sanctuary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Reflection Input Form */
          <div className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-2 font-mono">
                How do your eyes & nervous system feel now?
              </label>
              <div className="flex flex-wrap gap-2">
                {moodOptions.map((mood) => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => setMoodAfter(mood)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      moodAfter === mood
                        ? 'bg-emerald-900 text-stone-50 border-emerald-900'
                        : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-2 font-mono">
                Sensory Memory (Optional note)
              </label>
              <textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="What did you notice out there? Light through leaves, cold breeze, bird calls..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 bg-stone-50/50"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleFinish}
                disabled={isSubmitting}
                className="flex-1 h-12 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-stone-50 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmitting ? 'Reflecting...' : 'Save to Walk Log'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
