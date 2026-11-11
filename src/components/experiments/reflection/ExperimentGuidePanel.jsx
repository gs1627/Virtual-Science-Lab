import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Target,
  Compass,
} from 'lucide-react';
import { REFLECTION_STEPS } from './reflectionData';

export default function ExperimentGuidePanel({
  currentStep,
  setCurrentStep,
  targetHit,
  quizCompleted,
  onReset,
  onOpenGuide,
  onSelectTerm,
}) {
  const [showStory, setShowStory] = useState(true);
  const [showObjectives, setShowObjectives] = useState(true);

  // Calculate overall progress percentage
  const progressPercent = Math.round(((currentStep - 1) / (REFLECTION_STEPS.length - 1)) * 100);

  // Dynamic objectives with status
  const objectives = [
    {
      title: 'Navigate 3D Scene (Rotate, Zoom, Pan)',
      completed: currentStep >= 2,
    },
    {
      title: 'Identify Normal, Incident & Reflected Rays',
      completed: currentStep >= 4,
    },
    {
      title: 'Verify ∠i = ∠r across multiple angles',
      completed: currentStep >= 5,
    },
    {
      title: 'Direct beam onto 55° Sensor Target',
      completed: targetHit || currentStep >= 6,
    },
    {
      title: 'Test 2nd Law (Coplanar Vector Plane)',
      completed: currentStep >= 8,
    },
    {
      title: 'Complete 3D Optics Mastery Quiz',
      completed: quizCompleted,
    },
  ];

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
      {/* Panel Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">Experiment Guide</h3>
            <p className="text-[11px] text-blue-600 font-semibold">Reflection of Light (3D)</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold transition-colors cursor-pointer"
              title="Open Scientific Terms & Laws Reference"
            >
              <Compass className="w-3 h-3" />
              <span>Guide</span>
            </button>
          )}

          <button
            onClick={onReset}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-medium transition-colors cursor-pointer"
            title="Reset entire experiment progress"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Scrollable Guide Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {/* Progress Tracker Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Student Progress
            </span>
            <span className="text-xs font-bold text-blue-600 font-mono">
              Step {currentStep} of {REFLECTION_STEPS.length} ({progressPercent}%)
            </span>
          </div>

          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Scenario Card */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 overflow-hidden">
          <button
            onClick={() => setShowStory(!showStory)}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-100/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-slate-800">The Mystery of the Mirror</span>
            </div>
            {showStory ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          <AnimatePresence>
            {showStory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-3.5 pb-3 text-slate-600 leading-relaxed border-t border-slate-200 pt-2"
              >
                <p className="italic text-slate-700">
                  &quot;A student is trying to direct a beam of light onto a target sensor using a plane mirror.
                  Help them understand how light reflects and find the correct angle to direct the beam.&quot;
                </p>
                <div className="mt-2.5 p-2 rounded-lg bg-blue-50 border border-blue-200 text-[11px] text-blue-800 font-medium">
                  <span className="font-bold">3D Mission:</span> Use OrbitControls to rotate the 3D scene, calibrate the angle of incidence, observe ray coplanarity, and solve the optical puzzle!
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Objectives Card */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 overflow-hidden">
          <button
            onClick={() => setShowObjectives(!showObjectives)}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-100/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="font-bold text-slate-800">Learning Objectives</span>
            </div>
            {showObjectives ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          <AnimatePresence>
            {showObjectives && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-3 pb-3 space-y-2 border-t border-slate-200 pt-2.5"
              >
                {objectives.map((obj, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    {obj.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <span className={obj.completed ? 'text-slate-800 font-semibold' : 'text-slate-500'}>
                      {obj.title}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Clickable Quick Terms Link */}
        <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-600">Want concept definitions?</span>
          <button
            onClick={() => onSelectTerm && onSelectTerm('first-law')}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer"
          >
            Scientific Terms →
          </button>
        </div>

        {/* Step-by-Step Interactive Workflow */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Step-by-Step Stages
          </div>

          {REFLECTION_STEPS.map((step) => {
            const isCurrent = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-50 border border-blue-300 text-blue-900 shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50/50 border border-emerald-200 text-slate-800 hover:bg-emerald-50'
                    : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {/* Step indicator icon */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? '✓' : step.id}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`font-bold text-xs truncate ${isCurrent ? 'text-blue-700' : ''}`}>
                      {step.title}
                    </p>
                    {isCurrent && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 uppercase tracking-widest shrink-0">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {step.shortDesc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
