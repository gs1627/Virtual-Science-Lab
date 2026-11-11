import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
} from 'lucide-react';
import { CATEGORIES } from './acidsBasesData';

export default function AcidsBasesSortingChallenge({
  classifiedItems = { acidic: [], neutral: [], basic: [] },
  onDropIntoCategory,
  onResetSorting,
  draggingItem = null,
  selectedItem = null,
  feedbackAlert = null,
  onDismissFeedback,
  totalSolutions = 7,
}) {
  const totalClassified =
    (classifiedItems.acidic?.length || 0) +
    (classifiedItems.neutral?.length || 0) +
    (classifiedItems.basic?.length || 0);

  const isAllComplete = totalClassified >= totalSolutions;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header & Score Tracker */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Chemical Classification Station</span>
          </h3>
          <p className="text-xs text-slate-500">
            Drag tested reagent bottles into their respective acidity category tray.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-xs font-bold text-purple-700 shadow-2xs">
            <span>Classified:</span>
            <span className="font-mono text-sm text-purple-900">{totalClassified} / {totalSolutions}</span>
          </div>

          {totalClassified > 0 && (
            <button
              onClick={onResetSorting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              title="Reset classification categories"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Trays</span>
            </button>
          )}
        </div>
      </div>

      {/* Real-time Feedback Banner */}
      <AnimatePresence>
        {feedbackAlert && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={`p-4 rounded-2xl border flex items-start justify-between gap-3 shadow-xs ${
              feedbackAlert.type === 'success'
                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                : 'bg-rose-50/90 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex items-start gap-3">
              {feedbackAlert.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="text-xs sm:text-sm font-bold leading-snug">{feedbackAlert.title}</h4>
                <p className="text-xs leading-relaxed mt-1 opacity-90">{feedbackAlert.message}</p>
              </div>
            </div>

            <button
              onClick={onDismissFeedback}
              className="text-xs font-bold opacity-60 hover:opacity-100 p-1 cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Three High-End Analytical Trays */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => {
          const itemsInCat = classifiedItems[cat.id] || [];
          const isEligibleForDrop = draggingItem?.type === 'bottle' || selectedItem?.type === 'bottle';

          return (
            <div
              key={cat.id}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
              }}
              onDrop={(e) => {
                e.preventDefault();
                onDropIntoCategory?.(cat.id);
              }}
              onClick={() => {
                if (selectedItem?.type === 'bottle') {
                  onDropIntoCategory?.(cat.id);
                }
              }}
              className={`relative rounded-2xl border-2 p-4 transition-all min-h-[170px] flex flex-col justify-between ${
                isEligibleForDrop
                  ? `border-dashed ${cat.borderColor} ${cat.hoverBg} ring-2 ring-offset-2 ${cat.ringColor} cursor-pointer animate-pulse shadow-sm`
                  : `border-slate-200 bg-slate-50/70`
              }`}
            >
              {/* Tray Header */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${cat.badgeColor}`}>
                    {cat.name}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {itemsInCat.length} placed
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">{cat.description}</p>
              </div>

              {/* Items Placed in This Tray */}
              <div className="my-3 space-y-1.5">
                {itemsInCat.length === 0 ? (
                  <div className="py-4 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl bg-white/70">
                    {isEligibleForDrop ? 'Drop selected bottle here' : 'Empty category tray'}
                  </div>
                ) : (
                  itemsInCat.map((sol) => (
                    <motion.div
                      key={sol.id}
                      initial={{ scale: 0.92, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: sol.bottleColor }}
                        />
                        <span className="font-bold text-slate-800">{sol.name}</span>
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-slate-500">pH {sol.ph}</span>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Helper prompt */}
              <div className="pt-2 border-t border-slate-200/60 text-center">
                <span className="text-[10px] font-semibold text-slate-400">
                  {isEligibleForDrop ? 'Release to classify' : `Accepts ${cat.name.split(' ')[0]} samples`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {isAllComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex flex-wrap items-center justify-between gap-3 shadow-lg"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0 shadow-inner">
              🏆
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base">All 7 Solutions Correctly Categorized!</h4>
              <p className="text-xs text-emerald-100 mt-0.5">
                Demonstrated full mastery of the pH scale, Universal Indicator transitions, and litmus paper chemistry.
              </p>
            </div>
          </div>

          <button
            onClick={onResetSorting}
            className="px-4 py-2 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Re-test Categories
          </button>
        </motion.div>
      )}
    </div>
  );
}
