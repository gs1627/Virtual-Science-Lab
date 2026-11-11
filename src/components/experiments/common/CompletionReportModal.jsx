import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  X,
} from 'lucide-react';

export default function CompletionReportModal({
  isOpen,
  onClose,
  experimentTitle,
  principles = [],
  formulas = [],
  measurementsCount = 0,
  score = { correct: 4, total: 4 },
  realWorldApp = '',
  onRetry,
  onSwitchFreeMode,
}) {
  if (!isOpen) return null;

  const percentage = Math.round((score.correct / Math.max(1, score.total)) * 100);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-white border border-slate-200 shadow-2xl z-10 text-slate-800 overflow-hidden"
        >
          {/* Header Banner with celebratory laurels */}
          <div className="p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/20 to-transparent pointer-events-none" />

            <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Award className="w-8 h-8 text-yellow-300" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 border border-white/30 tracking-wider uppercase mb-1">
              Laboratory Mastery Achieved
            </span>
            <h2 className="text-xl sm:text-2xl font-black">{experimentTitle}</h2>
            <p className="text-xs text-blue-100 mt-1">Official Virtual Science Laboratory Completion Certificate</p>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Report Body */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
            {/* Score & Telemetry Metrics Cards */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Challenges</span>
                <span className="text-lg font-mono font-black text-slate-900 mt-0.5 block">
                  {score.correct} / {score.total}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">{percentage}% Accuracy</span>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200">
                <span className="text-[10px] text-blue-700 font-bold uppercase block">Telemetry Logs</span>
                <span className="text-lg font-mono font-black text-blue-900 mt-0.5 block">
                  {measurementsCount}
                </span>
                <span className="text-[10px] text-blue-600 font-semibold">Recorded</span>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200">
                <span className="text-[10px] text-purple-700 font-bold uppercase block">Grade</span>
                <span className="text-lg font-mono font-black text-purple-900 mt-0.5 block">
                  {percentage >= 80 ? 'A+' : 'A'}
                </span>
                <span className="text-[10px] text-purple-600 font-semibold">Mastered</span>
              </div>
            </div>

            {/* Core Scientific Principles Learned */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Core Scientific Principles Mastered:</span>
              </span>
              <ul className="space-y-1.5 pl-2 text-slate-600 leading-relaxed">
                {principles.map((pr, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <span>{pr}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Governing Formulas */}
            {formulas.length > 0 && (
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                <span className="font-bold text-blue-900 uppercase tracking-wider text-[11px] block">
                  Governing Mathematical Equations:
                </span>
                <div className="flex flex-wrap gap-2">
                  {formulas.map((f, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-white border border-blue-200 font-mono font-bold text-blue-700 text-xs shadow-2xs"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Real-World Technology Application */}
            {realWorldApp && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-1">
                <span className="font-bold text-[11px] uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Real-World Engineering Application:</span>
                </span>
                <p className="leading-relaxed text-[11px] text-amber-900">{realWorldApp}</p>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
            {onRetry && (
              <button
                onClick={() => {
                  onRetry();
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Challenges</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              {onSwitchFreeMode && (
                <button
                  onClick={() => {
                    onSwitchFreeMode();
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  Explore in Free Mode 🧪
                </button>
              )}

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
