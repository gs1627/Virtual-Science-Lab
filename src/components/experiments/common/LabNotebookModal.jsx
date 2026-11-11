import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  BookMarked,
  Download,
  Trash2,
  GitCompare,
  Plus,
  FileText,
  Clock,
} from 'lucide-react';

export default function LabNotebookModal({
  isOpen,
  onClose,
  experimentTitle,
  records = [],
  onClearRecords,
  currentState = {},
  comparisonType = 'ohms', // 'ohms' | 'pendulum' | 'reflection'
}) {
  const [activeTab, setActiveTab] = useState('notebook'); // 'notebook' | 'compare'
  const [customNote, setCustomNote] = useState('');
  const [notesList, setNotesList] = useState([]);
  const [copied, setCopied] = useState(false);

  // Comparison State
  const [trialA, setTrialA] = useState(null);
  const [trialB, setTrialB] = useState(null);

  if (!isOpen) return null;

  const handleAddNote = () => {
    if (!customNote.trim()) return;
    const newEntry = {
      id: Date.now(),
      text: customNote.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setNotesList((prev) => [newEntry, ...prev]);
    setCustomNote('');
  };

  const handleExportReport = () => {
    const dateStr = new Date().toLocaleDateString();
    const timeStr = new Date().toLocaleTimeString();

    let reportText = `=====================================================\n`;
    reportText += `       VIRTUAL SCIENCE LAB - EXPERIMENT REPORT        \n`;
    reportText += `=====================================================\n\n`;
    reportText += `Experiment: ${experimentTitle}\n`;
    reportText += `Date: ${dateStr} at ${timeStr}\n\n`;
    reportText += `-----------------------------------------------------\n`;
    reportText += `1. CURRENT LABORATORY STATE\n`;
    reportText += `-----------------------------------------------------\n`;
    Object.entries(currentState).forEach(([k, v]) => {
      reportText += `• ${k}: ${v}\n`;
    });

    reportText += `\n-----------------------------------------------------\n`;
    reportText += `2. EXPERIMENTAL OBSERVATIONS & LOGS (${records.length} entries)\n`;
    reportText += `-----------------------------------------------------\n`;
    if (records.length === 0) {
      reportText += `No automatic log records recorded yet.\n`;
    } else {
      records.forEach((rec, idx) => {
        reportText += `[#${idx + 1}] ${rec.time || ''} - ${rec.title}\n`;
        reportText += `    Details: ${rec.detail || rec.message || ''}\n`;
        if (rec.resultValue) {
          reportText += `    Result: ${rec.resultValue}\n`;
        }
        reportText += `\n`;
      });
    }

    if (notesList.length > 0) {
      reportText += `-----------------------------------------------------\n`;
      reportText += `3. STUDENT HYPOTHESES & FIELD NOTES\n`;
      reportText += `-----------------------------------------------------\n`;
      notesList.forEach((n) => {
        reportText += `• [${n.timestamp}] ${n.text}\n`;
      });
      reportText += `\n`;
    }

    if (trialA && trialB) {
      reportText += `-----------------------------------------------------\n`;
      reportText += `4. COMPARATIVE ANALYSIS (TRIAL A vs TRIAL B)\n`;
      reportText += `-----------------------------------------------------\n`;
      reportText += `Trial A: ${JSON.stringify(trialA)}\n`;
      reportText += `Trial B: ${JSON.stringify(trialB)}\n`;
      reportText += `\n`;
    }

    reportText += `=====================================================\n`;
    reportText += `Verified by Dr. Nova AI Lab Assistant\n`;
    reportText += `Virtual Science Lab Platform\n`;

    // Download text file
    const element = document.createElement('a');
    const file = new Blob([reportText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${experimentTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-report.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Comparison Calculations & Analysis
  const renderComparisonAnalysis = () => {
    if (!trialA || !trialB) {
      return (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
          Capture or set both <strong className="text-slate-700">Trial A</strong> and{' '}
          <strong className="text-slate-700">Trial B</strong> to generate mathematical comparison analysis.
        </div>
      );
    }

    if (comparisonType === 'ohms') {
      const vA = trialA.voltage || 0;
      const rA = trialA.resistance || 1;
      const iA = trialA.current || (vA / rA);

      const vB = trialB.voltage || 0;
      const rB = trialB.resistance || 1;
      const iB = trialB.current || (vB / rB);

      const deltaV = vB - vA;
      const deltaR = rB - rA;
      const deltaI = iB - iA;

      let explanation = '';
      if (rA === rB && vA !== vB) {
        const vRatio = (vB / vA).toFixed(2);
        const iRatio = (iB / iA).toFixed(2);
        explanation = `Resistance is held constant at ${rA} Ω. Voltage changed by a factor of ${vRatio}× (${vA}V ➔ ${vB}V), and current changed by exactly ${iRatio}× (${iA.toFixed(2)}A ➔ ${iB.toFixed(2)}A). This directly demonstrates Ohm's Law linearity: I ∝ V.`;
      } else if (vA === vB && rA !== rB) {
        const rRatio = (rB / rA).toFixed(2);
        const iRatio = (iA / iB).toFixed(2);
        explanation = `Voltage is held constant at ${vA} V. Resistance changed by a factor of ${rRatio}× (${rA}Ω ➔ ${rB}Ω), causing current to change inversely by ${iRatio}× (${iA.toFixed(2)}A ➔ ${iB.toFixed(2)}A). This confirms inverse proportionality: I ∝ 1/R.`;
      } else {
        explanation = `Comparing (${vA}V, ${rA}Ω, ${iA.toFixed(2)}A) with (${vB}V, ${rB}Ω, ${iB.toFixed(2)}A). In both cases, the fundamental ratio V / I equals R precisely.`;
      }

      return (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] text-blue-700 font-bold uppercase block">Trial A</span>
              <p className="font-mono font-bold text-slate-800 mt-1">{vA}V • {rA}Ω</p>
              <p className="font-mono font-extrabold text-blue-700 text-sm">{iA.toFixed(2)} A</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
              <span className="text-[10px] text-purple-700 font-bold uppercase block">Trial B</span>
              <p className="font-mono font-bold text-slate-800 mt-1">{vB}V • {rB}Ω</p>
              <p className="font-mono font-extrabold text-purple-700 text-sm">{iB.toFixed(2)} A</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] text-emerald-700 font-bold uppercase block">Delta (Δ)</span>
              <p className="font-mono font-bold text-slate-800 mt-1">
                ΔV: {deltaV > 0 ? `+${deltaV}` : deltaV}V • ΔR: {deltaR > 0 ? `+${deltaR}` : deltaR}Ω
              </p>
              <p className="font-mono font-extrabold text-emerald-700 text-sm">
                ΔI: {deltaI > 0 ? `+${deltaI.toFixed(2)}` : deltaI.toFixed(2)} A
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-700">
            <strong className="text-blue-700">Scientific Law Demonstrated: </strong>
            {explanation}
          </div>
        </div>
      );
    }

    if (comparisonType === 'pendulum') {
      const lA = trialA.lengthCm || 50;
      const gA = trialA.g || 9.8;
      const tA = trialA.timePeriod || (2 * Math.PI * Math.sqrt((lA / 100) / gA));

      const lB = trialB.lengthCm || 100;
      const gB = trialB.g || 9.8;
      const tB = trialB.timePeriod || (2 * Math.PI * Math.sqrt((lB / 100) / gB));

      const deltaL = lB - lA;
      const deltaT = tB - tA;

      let explanation = '';
      if (gA === gB && lA !== lB) {
        const lRatio = lB / lA;
        const sqrtRatio = Math.sqrt(lRatio).toFixed(3);
        const tRatio = (tB / tA).toFixed(3);
        explanation = `Gravity is held constant at ${gA} m/s². The length ratio L_B / L_A is ${lRatio.toFixed(2)}×. The period ratio T_B / T_A is ${tRatio}×, which closely matches √(L_B / L_A) = ${sqrtRatio}. This directly proves T ∝ √L.`;
      } else if (lA === lB && gA !== gB) {
        const gRatio = gA / gB;
        const sqrtGRatio = Math.sqrt(gRatio).toFixed(3);
        const tRatio = (tB / tA).toFixed(3);
        explanation = `Length is held constant at ${lA} cm. Gravitational field changed from ${gA} m/s² to ${gB} m/s². The period ratio is ${tRatio}× (matching √(g_A / g_B) = ${sqrtGRatio}), verifying inverse square-root dependency: T ∝ 1/√g.`;
      } else {
        explanation = `Comparing pendulum A (${lA}cm on ${trialA.planet || 'Earth'}) with pendulum B (${lB}cm on ${trialB.planet || 'Earth'}). The time period difference is ${deltaT > 0 ? `+${deltaT.toFixed(2)}` : deltaT.toFixed(2)}s.`;
      }

      return (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] text-blue-700 font-bold uppercase block">Trial A</span>
              <p className="font-mono font-bold text-slate-800 mt-1">{lA}cm • {gA}m/s²</p>
              <p className="font-mono font-extrabold text-blue-700 text-sm">T = {tA.toFixed(2)} s</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
              <span className="text-[10px] text-purple-700 font-bold uppercase block">Trial B</span>
              <p className="font-mono font-bold text-slate-800 mt-1">{lB}cm • {gB}m/s²</p>
              <p className="font-mono font-extrabold text-purple-700 text-sm">T = {tB.toFixed(2)} s</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] text-emerald-700 font-bold uppercase block">Delta (Δ)</span>
              <p className="font-mono font-bold text-slate-800 mt-1">ΔL: {deltaL > 0 ? `+${deltaL}` : deltaL}cm</p>
              <p className="font-mono font-extrabold text-emerald-700 text-sm">
                ΔT: {deltaT > 0 ? `+${deltaT.toFixed(2)}` : deltaT.toFixed(2)} s
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-700">
            <strong className="text-blue-700">Harmonic Mechanics Principle: </strong>
            {explanation}
          </div>
        </div>
      );
    }

    if (comparisonType === 'reflection') {
      const aA = trialA.angle || 30;
      const aB = trialB.angle || 60;
      const deltaAngle = aB - aA;

      return (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] text-blue-700 font-bold uppercase block">Trial A</span>
              <p className="font-mono font-bold text-slate-800 mt-1">∠i = {aA}°</p>
              <p className="font-mono font-extrabold text-blue-700 text-sm">∠r = {aA}°</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
              <span className="text-[10px] text-purple-700 font-bold uppercase block">Trial B</span>
              <p className="font-mono font-bold text-slate-800 mt-1">∠i = {aB}°</p>
              <p className="font-mono font-extrabold text-purple-700 text-sm">∠r = {aB}°</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] text-emerald-700 font-bold uppercase block">Delta (Δ)</span>
              <p className="font-mono font-bold text-slate-800 mt-1">Δ∠i: {deltaAngle > 0 ? `+${deltaAngle}` : deltaAngle}°</p>
              <p className="font-mono font-extrabold text-emerald-700 text-sm">
                Δ∠r: {deltaAngle > 0 ? `+${deltaAngle}` : deltaAngle}°
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-700">
            <strong className="text-blue-700">Optical Law of Reflection: </strong>
            Changing the angle of incidence from {aA}° to {aB}° causes the angle of reflection to change by the exact same amount (+{deltaAngle}°). In every optical trial, ∠i = ∠r remains strictly satisfied.
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-2xl bg-white border border-slate-200 shadow-2xl z-10 text-slate-800 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <BookMarked className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">Virtual Lab Notebook</h3>
                <p className="text-[11px] text-slate-500">{experimentTitle}</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setActiveTab('notebook')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'notebook'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Notebook ({records.length})
              </button>
              <button
                onClick={() => setActiveTab('compare')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'compare'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare Trials</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {activeTab === 'notebook' ? (
              <>
                {/* Actions Bar */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportReport}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{copied ? 'Report Downloaded!' : 'Export Lab Report (.txt)'}</span>
                    </button>
                  </div>

                  {records.length > 0 && onClearRecords && (
                    <button
                      onClick={onClearRecords}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-200 hover:border-red-200 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear Records</span>
                    </button>
                  )}
                </div>

                {/* Add Custom Student Note / Hypothesis Input */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Record Student Hypothesis or Field Note</span>
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g., At 10V and 5Ω, observed current jumps to 2.0A without lag..."
                      value={customNote}
                      onChange={(e) => setCustomNote(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                    <button
                      onClick={handleAddNote}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Student Custom Notes */}
                {notesList.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Student Notes:
                    </span>
                    {notesList.map((note) => (
                      <div key={note.id} className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start justify-between gap-2">
                        <span className="font-medium">{note.text}</span>
                        <span className="text-[10px] text-amber-700 font-mono shrink-0">{note.timestamp}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Automatic Log Records Stream */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Automatic Experiment Telemetry ({records.length} records):
                  </span>

                  {records.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-xs text-slate-500">
                      No parameters changed yet. Adjust controls in the simulation to automatically record telemetry!
                    </div>
                  ) : (
                    records.map((rec, idx) => (
                      <div
                        key={rec.id || idx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 hover:bg-slate-100/70 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{rec.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{rec.time}</span>
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">{rec.detail || rec.message}</p>
                        {rec.resultValue && (
                          <div className="pt-1 text-[11px] font-mono font-bold text-blue-700">
                            Result: {rec.resultValue}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              /* TAB 2: Comparative Analysis */
              <div className="space-y-4">
                <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900 leading-relaxed">
                  <strong>Scientific Comparator:</strong> Capture two distinct experimental states to measure mathematical ratios, deltas, and verify governing physical laws.
                </div>

                {/* Capture Controls */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-900 block">Baseline Trial A</span>
                    <button
                      onClick={() => setTrialA(currentState)}
                      className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      Set Trial A = Current State
                    </button>
                    {trialA ? (
                      <div className="text-[11px] font-mono text-slate-600 space-y-0.5 pt-1">
                        {Object.entries(trialA).map(([k, v]) => (
                          <div key={k} className="truncate">• {k}: <strong className="text-slate-800">{v}</strong></div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">No state captured for Trial A</p>
                    )}
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-900 block">Comparison Trial B</span>
                    <button
                      onClick={() => setTrialB(currentState)}
                      className="w-full py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      Set Trial B = Current State
                    </button>
                    {trialB ? (
                      <div className="text-[11px] font-mono text-slate-600 space-y-0.5 pt-1">
                        {Object.entries(trialB).map(([k, v]) => (
                          <div key={k} className="truncate">• {k}: <strong className="text-slate-800">{v}</strong></div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">No state captured for Trial B</p>
                    )}
                  </div>
                </div>

                {/* Comparison Analysis Output */}
                {renderComparisonAnalysis()}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
