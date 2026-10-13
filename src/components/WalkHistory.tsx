import { Footprints, Sun, Calendar, Trash2, Download } from 'lucide-react';
import { WalkLogEntry } from './WalkReflection';

interface WalkHistoryProps {
  logs: WalkLogEntry[];
  onClearLogs: () => void;
  onQuickStart: () => void;
}

export function WalkHistory({ logs, onClearLogs, onQuickStart }: WalkHistoryProps) {
  // Aggregate metrics
  const totalMinutes = logs.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalSteps = logs.reduce((acc, curr) => acc + curr.estimatedSteps, 0);
  const totalSessions = logs.length;

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `natureheal-logs-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
            Digital Detox & Sunlight Log
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Every minute logged here is time your eyes and nervous system spent in real nature rather than digital pixels.
          </p>
        </div>

        {logs.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              onClick={onClearLogs}
              className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-500 hover:text-rose-700 hover:border-rose-200 bg-white shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-800 mb-2">
            <Sun className="w-4 h-4" />
            <span className="text-xs uppercase font-mono font-semibold tracking-wider">
              Open Sky Minutes
            </span>
          </div>
          <div className="text-3xl font-bold font-mono tabular-nums text-stone-900">
            {totalMinutes} <span className="text-sm font-normal text-stone-500">mins</span>
          </div>
          <p className="text-xs text-stone-700 mt-2">
            ~{(totalMinutes / 60).toFixed(1)} hours saved from screen exposure
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-800 mb-2">
            <Footprints className="w-4 h-4" />
            <span className="text-xs uppercase font-mono font-semibold tracking-wider">
              Cadence Outdoors
            </span>
          </div>
          <div className="text-3xl font-bold font-mono tabular-nums text-stone-900">
            {totalSteps.toLocaleString()} <span className="text-sm font-normal text-stone-500">steps</span>
          </div>
          <p className="text-xs text-stone-700 mt-2">
            Natural bilateral sensory movement
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-800 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-xs uppercase font-mono font-semibold tracking-wider">
              Sensory Walks
            </span>
          </div>
          <div className="text-3xl font-bold font-mono tabular-nums text-stone-900">
            {totalSessions} <span className="text-sm font-normal text-stone-500">sessions</span>
          </div>
          <p className="text-xs text-stone-700 mt-2">
            {totalSessions > 0 ? 'Consistent real-world breaks' : 'Ready for your first stroll'}
          </p>
        </div>
      </div>

      {/* Log Feed */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-stone-900">
          Walk History & Sensory Journal
        </h2>

        {logs.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-stone-200/80 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto text-xl">
              🌿
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-stone-900">
                No Outdoor Walks Logged Yet
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Step away from your keyboard or phone for just 10 minutes. Your eyes and mind will thank you.
              </p>
            </div>
            <button
              onClick={onQuickStart}
              className="px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-stone-50 font-semibold text-xs transition-colors shadow-sm"
            >
              Start First Walk Now
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => {
              const formattedDate = new Date(log.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={log.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-sm sm:text-base font-bold text-stone-900">
                      {log.missionTitle}
                    </h3>
                    {/* Clean unboxed metadata (anti-pill) */}
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                      <span>{log.durationMinutes} minutes</span>
                      <span aria-hidden="true">·</span>
                      <span>~{log.estimatedSteps.toLocaleString()} steps</span>
                      <span aria-hidden="true">·</span>
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  {log.moodAfter && (
                    <div className="flex items-center gap-2 text-xs text-emerald-900 font-medium">
                      <span>Feeling afterward:</span>
                      <span className="font-semibold">{log.moodAfter}</span>
                    </div>
                  )}

                  {log.reflectionNotes && (
                    <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100 italic">
                      "{log.reflectionNotes}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
