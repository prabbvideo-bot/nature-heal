import { useState } from 'react';
import { Footprints, Sparkles, Clock, Compass, ArrowRight, Loader2 } from 'lucide-react';
import { SensoryMission, CURATED_MISSIONS } from '../data/missions';

interface MissionsCatalogProps {
  onStartMission: (mission: SensoryMission) => void;
  speak: (text: string) => void;
}

export function MissionsCatalog({ onStartMission, speak }: MissionsCatalogProps) {
  const [missions, setMissions] = useState<SensoryMission[]>(CURATED_MISSIONS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [environment, setEnvironment] = useState('Urban neighborhood');
  const [timeMinutes, setTimeMinutes] = useState(15);
  const [mood, setMood] = useState('Screen fatigue & heavy eyes');

  const handleGenerateCustom = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/guide/mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          environment,
          timeAvailableMinutes: timeMinutes,
          mood,
        }),
      });

      const data = await res.json();
      const newMission: SensoryMission = {
        id: `custom-${Date.now()}`,
        title: data.title || 'Spontaneous Sky Walk',
        subtitle: `Custom tailored for ${environment}`,
        durationMinutes: data.durationMinutes || timeMinutes,
        sensoryFocus: data.sensoryFocus || 'Sight',
        description: data.prompt || 'Walk outside with hands free and open your senses.',
        guidanceSteps: [
          'Put your device into your pocket immediately.',
          data.prompt || 'Observe the sky and natural movement around you.',
          'Notice three non-digital colors.',
          'Take three deep belly breaths.',
        ],
        voiceIntro: data.voiceIntro || 'Welcome outside. Let your eyes soften and take in the natural horizon.',
        recommendedTime: 'Anytime',
      };

      setMissions((prev) => [newMission, ...prev]);
      speak(newMission.voiceIntro);
    } catch (e) {
      console.warn('Failed to generate custom mission:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-8">
      {/* Header and Philosophy */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
          Sensory Strolls & Digital Detox Breaks
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
          NatureHeal is designed around a simple principle: AI should give you reasons to put your phone down. Choose a walk below, plug in your headphones, and slide your device into your pocket.
        </p>
      </div>

      {/* AI Tailored Walk Generator Bar */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-800" />
          <h2 className="text-base font-semibold text-stone-900">
            Generate a Bespoke Stroll for Right Now
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-mono text-stone-700 uppercase block mb-1">
              Your Surroundings
            </label>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
            >
              <option value="Urban street with sidewalk">Urban street & sidewalk</option>
              <option value="Residential neighborhood">Residential neighborhood</option>
              <option value="Park or tree-lined path">Park or tree-lined path</option>
              <option value="Office building courtyard">Office building courtyard</option>
              <option value="Balcony or front steps">Balcony or outdoor steps</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-mono text-stone-700 uppercase block mb-1">
              Current Feeling
            </label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
            >
              <option value="Eye strain & heavy screen fatigue">Eye strain & screen fatigue</option>
              <option value="Stressed from back-to-back meetings">Stressed from meetings</option>
              <option value="Sluggish afternoon mental dip">Sluggish afternoon dip</option>
              <option value="Restless and anxious">Restless and anxious</option>
              <option value="Seeking creative flow & clarity">Seeking creative clarity</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-mono text-stone-700 uppercase block mb-1">
              Time Available
            </label>
            <select
              value={timeMinutes}
              onChange={(e) => setTimeMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
            >
              <option value={10}>10 minutes (micro-reset)</option>
              <option value={15}>15 minutes (recommended)</option>
              <option value={20}>20 minutes (deep ground)</option>
              <option value={30}>30 minutes (full detox walk)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleGenerateCustom}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-stone-50 font-medium text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-transform active:scale-98 disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Crafting walk prompt...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Create Personalized Walk</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid of Missions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm flex flex-col justify-between hover:border-emerald-800/40 transition-colors"
          >
            <div className="space-y-3">
              {/* Clean unboxed metadata with typographic separators (anti-pill) */}
              <div className="flex items-center gap-2 text-xs text-stone-700 font-mono">
                <span>{mission.sensoryFocus} Sensory Focus</span>
                <span aria-hidden="true">·</span>
                <span>{mission.durationMinutes} minutes</span>
                <span aria-hidden="true">·</span>
                <span>{mission.recommendedTime}</span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-stone-900 mb-1">
                  {mission.title}
                </h2>
                <p className="text-xs text-emerald-900 font-medium mb-2">
                  {mission.subtitle}
                </p>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {mission.description}
                </p>
              </div>

              {/* Guidance preview */}
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 text-xs text-stone-700 space-y-1">
                <span className="font-semibold text-stone-800 block text-[11px] uppercase tracking-wider font-mono">
                  Audio Cue:
                </span>
                <p className="italic text-stone-700">
                  "{mission.voiceIntro}"
                </p>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-700 font-mono">
                Hands-free audio ready
              </span>

              <button
                onClick={() => onStartMission(mission)}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-emerald-900 text-stone-50 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs active:scale-98"
              >
                <span>Start This Walk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
