import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock } from 'lucide-react';
import { PENDULUM_TERMS } from './pendulumData';

export default function PendulumTermModal({ activeTermKey, onClose }) {
  const [selectedKey, setSelectedKey] = useState(activeTermKey || 'simple-pendulum');

  if (!activeTermKey) return null;

  const currentTerm = PENDULUM_TERMS[selectedKey] || PENDULUM_TERMS[activeTermKey] || PENDULUM_TERMS['simple-pendulum'];

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
          className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-white border border-slate-200 shadow-2xl z-10 text-slate-800 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">Pendulum Mechanics Glossary</h3>
                <p className="text-[11px] text-slate-500">Definitions &amp; Governing Equations</p>
              </div>
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
            {/* Horizontal Term Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {Object.entries(PENDULUM_TERMS).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setSelectedKey(key)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedKey === key
                      ? 'bg-blue-50 border border-blue-400 text-blue-700 shadow-2xs'
                      : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Term Details Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <h4 className="text-base font-bold text-slate-900">{currentTerm.name}</h4>
                  <p className="text-xs text-blue-600 font-semibold mt-0.5">Physical Concept &amp; Principles</p>
                </div>

                {currentTerm.formula && (
                  <div className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-mono font-bold text-slate-800 shrink-0">
                    {currentTerm.formula}
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {currentTerm.summary}
              </p>

              <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 leading-relaxed">
                {currentTerm.detailed}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
