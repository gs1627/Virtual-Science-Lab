import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Lightbulb, CheckCircle2 } from 'lucide-react';
import { SCIENTIFIC_TERMS, REAL_WORLD_APPLICATIONS } from './reflectionData';

export default function TermExplanationModal({ activeTermKey, onClose }) {
  const [activeTab, setActiveTab] = useState('term'); // 'term' | 'applications' | 'laws'
  const [selectedTermKey, setSelectedTermKey] = useState(activeTermKey || 'incident-ray');

  // Sync when activeTermKey changes
  if (activeTermKey && selectedTermKey !== activeTermKey && activeTab !== 'term') {
    setSelectedTermKey(activeTermKey);
    setActiveTab('term');
  }

  if (!activeTermKey && activeTab === 'term') return null;

  const currentKey = activeTermKey || selectedTermKey;
  const term = SCIENTIFIC_TERMS[currentKey] || SCIENTIFIC_TERMS['incident-ray'];

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
          {/* Top Bar with Navigation Tabs & Close */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setActiveTab('term')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'term'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                  }`}
              >
                Scientific Concept
              </button>

              <button
                onClick={() => setActiveTab('laws')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'laws'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                  }`}
              >
                The Two Laws
              </button>

              <button
                onClick={() => setActiveTab('applications')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'applications'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                  }`}
              >
                Real-World Apps
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* TAB 1: INDIVIDUAL TERM DETAILS */}
            {activeTab === 'term' && (
              <div className="space-y-4">
                {/* Term Header */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                    style={{
                      background: `${term.color}18`,
                      border: `1px solid ${term.color}40`,
                    }}
                  >
                    <BookOpen className="w-6 h-6" style={{ color: term.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">{term.name}</h3>
                      {term.symbol && (
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-bold">
                          Symbol: {term.symbol}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-mono">
                      Category: Fundamental Optics Concept
                    </p>
                  </div>
                </div>

                {/* Definition Box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                    Scientific Definition
                  </span>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    {term.definition}
                  </p>
                </div>

                {/* Explanation */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                    Detailed Explanation
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {term.explanation}
                  </p>
                </div>

                {/* Important Common Misconception Callout */}
                {term.misconception && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-amber-800">
                        Common Student Misconception:
                      </span>
                      <p className="text-xs text-amber-900 leading-relaxed mt-0.5">
                        {term.misconception}
                      </p>
                    </div>
                  </div>
                )}

                {/* Related Terms Browser Bar */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Select Other Terms:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(SCIENTIFIC_TERMS).map(([k, t]) => (
                      <button
                        key={k}
                        onClick={() => setSelectedTermKey(k)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${currentKey === k
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                          }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: THE TWO LAWS OF REFLECTION */}
            {activeTab === 'laws' && (
              <div className="space-y-4">
                <div className="text-center py-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    The Fundamental Laws of Reflection
                  </h3>
                  <p className="text-xs text-slate-500">
                    Discovered and formulated over 2,000 years of optical experimentation
                  </p>
                </div>

                {/* 1st Law Card */}
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                      First Law of Reflection
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white border border-blue-300 font-mono text-xs font-extrabold text-blue-700">
                      ∠i = ∠r
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                    The angle of incidence is always equal to the angle of reflection.
                  </p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Both angles are strictly measured with respect to the normal line perpendicular to the mirror at the point of incidence. If light arrives at 40° to the normal, it departs at exactly 40°.
                  </p>
                </div>

                {/* 2nd Law Card */}
                <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                      Second Law of Reflection (Coplanarity)
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white border border-purple-300 text-xs font-bold text-purple-700">
                      Single 2D Plane
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                    The incident ray, the reflected ray, and the normal to the mirror at the point of incidence all lie in the same geometric plane.
                  </p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Light never deflects out of the plane defined by the incoming ray and the normal. You can verify this in the 3D lab by toggling the &quot;Coplanar Plane&quot; visualizer and viewing from the side!
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: REAL-WORLD APPLICATIONS */}
            {activeTab === 'applications' && (
              <div className="space-y-3">
                <div className="text-center py-1">
                  <h3 className="text-base font-bold text-slate-900">
                    Real-World Applications of Reflection
                  </h3>
                  <p className="text-xs text-slate-500">
                    How the law of reflection powers modern optics and daily life
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {REAL_WORLD_APPLICATIONS.map((app, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{app.icon}</span>
                        <h4 className="text-xs font-bold text-slate-900">{app.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {app.description}
                      </p>
                      <div className="pt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{app.badge}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Virtual Science Lab • Optics Curriculum</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors cursor-pointer shadow-xs"
            >
              Close Guide
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
