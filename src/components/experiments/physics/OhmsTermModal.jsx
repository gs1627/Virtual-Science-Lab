import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, Zap, Activity } from 'lucide-react';
import { OHMS_TERMS, REAL_WORLD_APPS } from './ohmsData';

export default function OhmsTermModal({ activeTermKey, onClose }) {
  const [activeTab, setActiveTab] = useState('terms'); // 'terms' | 'apps'
  const [selectedKey, setSelectedKey] = useState(activeTermKey || 'ohms-law');

  if (!activeTermKey) return null;

  const currentTerm = OHMS_TERMS[selectedKey] || OHMS_TERMS[activeTermKey] || OHMS_TERMS['ohms-law'];

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
              <button
                onClick={() => setActiveTab('terms')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'terms'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                }`}
              >
                Electrical Concepts
              </button>
              <button
                onClick={() => setActiveTab('apps')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'apps'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                }`}
              >
                Real-World Applications
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
            {activeTab === 'terms' ? (
              <>
                {/* Horizontal Term Selector Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {Object.entries(OHMS_TERMS).map(([key, item]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedKey(key)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        selectedKey === key
                          ? 'bg-blue-50 border border-blue-400 text-blue-700 shadow-2xs'
                          : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {item.name.split(' (')[0]}
                    </button>
                  ))}
                </div>

                {/* Term Details Card */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>{currentTerm.name}</span>
                      </h3>
                      <p className="text-xs text-blue-600 font-semibold mt-0.5">
                        Unit: {currentTerm.unit} • Symbol: {currentTerm.symbol}
                      </p>
                    </div>

                    <div className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-mono font-bold text-slate-800 shrink-0">
                      {currentTerm.formula}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {currentTerm.summary}
                  </p>

                  <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 leading-relaxed">
                    {currentTerm.detailed}
                  </div>

                  {currentTerm.tip && (
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2 text-xs text-amber-900">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{currentTerm.tip}</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Real-World Applications Tab */
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 font-medium">
                  <strong>Why Ohm’s Law powers the modern world:</strong> Every electronic device from smartphones to city power grids relies on calculating voltage drops, current thresholds, and thermal dissipation.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {REAL_WORLD_APPS.map((app, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-blue-600" />
                        <span>{app.title}</span>
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {app.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
