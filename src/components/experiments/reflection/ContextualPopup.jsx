import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Lightbulb, CheckCircle2, Info } from 'lucide-react';

export default function ContextualPopup({ message, type = 'info', onDismiss }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  const iconMap = {
    info: <Info className="w-4 h-4 text-cyan-400" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    tip: <Lightbulb className="w-4 h-4 text-amber-400" />,
    celebrate: <Sparkles className="w-4 h-4 text-yellow-300" />,
  };

  const borderMap = {
    info: 'border-cyan-500/30 bg-cyan-950/40 text-cyan-100',
    success: 'border-emerald-500/30 bg-emerald-950/40 text-emerald-100',
    tip: 'border-amber-500/30 bg-amber-950/40 text-amber-100',
    celebrate: 'border-yellow-500/30 bg-yellow-950/40 text-yellow-100',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -16, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.95 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`pointer-events-auto flex items-start gap-2.5 p-3 sm:p-3.5 rounded-xl border backdrop-blur-md shadow-2xl max-w-sm sm:max-w-md ${borderMap[type] || borderMap.info}`}
      >
        <div className="shrink-0 mt-0.5">{iconMap[type] || iconMap.info}</div>

        <div className="flex-1 min-w-0 text-xs leading-relaxed font-medium">
          {message}
        </div>

        <button
          onClick={onDismiss}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
          aria-label="Dismiss message"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

