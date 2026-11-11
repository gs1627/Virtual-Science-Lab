import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  BookMarked,
  Award,
  RotateCcw,
} from 'lucide-react';
import { REFLECTION_STEPS, PROGRESSIVE_HINTS } from './reflectionData';

export default function LabAssistantPanel({
  currentStep,
  setCurrentStep,
  angle,
  laserPower = true,
  targetHit,
  preConceptAnswer,
  setPreConceptAnswer,
  predictionAnswer,
  setPredictionAnswer,
  quizAnswers,
  setQuizAnswers,
  quizCompleted,
  setQuizCompleted,
  onReset,
  onOpenGuide,
  onSelectTerm,
}) {
  const [hintIndex, setHintIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showPrinciple, setShowPrinciple] = useState(false);

  // Additional prediction answers for step 4 and step 7
  const [step4Answer, setStep4Answer] = useState(null);
  const [step7Answer, setStep7Answer] = useState(null);

  const stepData = REFLECTION_STEPS.find((s) => s.id === currentStep) || REFLECTION_STEPS[0];
  const hintsForStep = PROGRESSIVE_HINTS[currentStep] || [];

  // Dynamic contextual observation based on state changes (angle, laser, target)
  const getContextualObservation = () => {
    if (!laserPower) {
      return {
        type: 'warning',
        title: 'Laser Emitter Standby',
        text: 'The laser beam is currently turned OFF. Toggle the "Laser ON" button in the center toolbar to resume ray tracing.',
      };
    }
    if (targetHit) {
      return {
        type: 'success',
        title: 'Target Sensor Hit! 🎯',
        text: 'Optical sensor reached! At ∠i = 55°, the reflected beam strikes the target with 100% precision.',
      };
    }
    if (angle === 0) {
      return {
        type: 'info',
        title: 'Normal Incidence (0°)',
        text: 'The beam enters directly along the normal line and reflects backward on itself along the exact same path (∠r = 0°).',
      };
    }
    if (angle === 45) {
      return {
        type: 'info',
        title: 'Right-Angle Reflection (45°)',
        text: 'At 45° incidence, the incident and reflected beams form a perpendicular 90° angle between each other (∠i + ∠r = 90°).',
      };
    }
    if (angle >= 70) {
      return {
        type: 'info',
        title: 'Grazing Incidence',
        text: `At a steep angle of ∠i = ${angle}°, the beam skims nearly parallel across the surface of the mirror.`,
      };
    }
    return {
      type: 'info',
      title: 'Active Ray Tracing',
      text: `Beam aligned at ∠i = ${angle}°. Notice that the reflected angle automatically equals ∠r = ${angle}° (1st Law).`,
    };
  };

  const observation = getContextualObservation();

  // Helper for quiz completion
  const handleQuizOption = (questionId, optionId) => {
    const updated = { ...quizAnswers, [questionId]: optionId };
    setQuizAnswers(updated);

    // If all questions answered, calculate score
    if (stepData.quizQuestions && Object.keys(updated).length === stepData.quizQuestions.length) {
      setQuizCompleted(true);
    }
  };

  const getQuizScore = () => {
    if (!stepData.quizQuestions) return 0;
    let score = 0;
    stepData.quizQuestions.forEach((q) => {
      const correctOption = q.options.find((o) => o.isCorrect);
      if (quizAnswers[q.id] === correctOption?.id) {
        score += 1;
      }
    });
    return score;
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
      {/* Panel Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Dr. Nova</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-purple-700 font-semibold">AI Lab Assistant</p>
          </div>
        </div>

        {/* Science Principle Toggle Button */}
        <button
          onClick={() => {
            if (onOpenGuide) {
              onOpenGuide();
            } else {
              setShowPrinciple(!showPrinciple);
            }
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-all cursor-pointer"
          title="Open Comprehensive Science Guide & Two Laws"
        >
          <BookMarked className="w-3.5 h-3.5" />
          <span>Laws & Apps</span>
        </button>
      </div>

      {/* Scientific Principle Card (Collapsible) */}
      <AnimatePresence>
        {showPrinciple && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-3.5 bg-purple-50/70 border-b border-purple-200 text-xs overflow-hidden"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-purple-800 text-[11px] uppercase tracking-wider">
                Laws of Reflection
              </span>
              <span className="font-mono text-purple-700 font-bold px-2 py-0.5 rounded bg-white border border-purple-200">
                ∠i = ∠r
              </span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              <strong>1st Law:</strong> Angle of incidence equals angle of reflection.<br />
              <strong>2nd Law:</strong> Incident ray, reflected ray, and normal all lie in the same geometric plane.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Assistant Chat Content Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {/* Dynamic Real-Time Observation & Assistant Telemetry */}
        <div
          className={`p-3 rounded-xl border transition-all ${
            !laserPower
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : targetHit
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
              : 'bg-purple-50/70 border-purple-200/80 text-purple-950'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`w-2 h-2 rounded-full ${
                !laserPower
                  ? 'bg-amber-500'
                  : targetHit
                  ? 'bg-emerald-500 animate-ping'
                  : 'bg-purple-600'
              }`}
            />
            <span className="font-bold text-[11px] uppercase tracking-wider">
              {observation.title}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed">
            {observation.text}
          </p>
        </div>

        {/* Assistant Speech Bubble */}
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-1">
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <div className="flex-1 p-3.5 rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed space-y-2">
            <div className="font-bold text-purple-700 text-[11px] uppercase tracking-wider">
              {stepData.title}
            </div>

            {/* Step 1 Introduction */}
            {currentStep === 1 && (
              <p>
                Welcome to the 3D Optics Laboratory, scientist! Today we are tackling
                <strong> &quot;The Mystery of the Mirror&quot;</strong>.
                Rotate the 3D canvas with your mouse, examine the mirror apparatus, and prepare to master the laws of reflection!
              </p>
            )}

            {/* Step 2 Pre-Concept Question */}
            {currentStep === 2 && (
              <p>
                Before we fire the laser, let&apos;s check your intuition. What happens when a ray of light strikes a flat plane mirror?
              </p>
            )}

            {/* Step 3 Apparatus Tour */}
            {currentStep === 3 && (
              <div className="space-y-1.5">
                <p>Great! Rotate the 3D view to examine each part:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                  <li>
                    <button onClick={() => onSelectTerm && onSelectTerm('normal-line')} className="text-blue-600 underline font-semibold hover:text-blue-700">
                      Normal (N):
                    </button>{' '}
                    The perpendicular (90°) dashed line.
                  </li>
                  <li>
                    <button onClick={() => onSelectTerm && onSelectTerm('point-of-incidence')} className="text-amber-600 underline font-semibold hover:text-amber-700">
                      Point O:
                    </button>{' '}
                    Point of incidence on the mirror surface.
                  </li>
                  <li>
                    <button onClick={() => onSelectTerm && onSelectTerm('incident-ray')} className="text-blue-600 underline font-semibold hover:text-blue-700">
                      Incident Ray:
                    </button>{' '}
                    Blue beam traveling from laser to point O.
                  </li>
                  <li>
                    <button onClick={() => onSelectTerm && onSelectTerm('reflected-ray')} className="text-purple-600 underline font-semibold hover:text-purple-700">
                      Reflected Ray:
                    </button>{' '}
                    Purple beam bouncing away from point O.
                  </li>
                </ul>
              </div>
            )}

            {/* Step 4 Prediction Question 1 */}
            {currentStep === 4 && (
              <div>
                <p className="font-bold text-slate-900">Prediction Challenge 1:</p>
                <p className="mt-1">
                  What happens to the reflected angle when the incident angle increases?
                </p>
                <p className="mt-1 text-blue-700 font-semibold text-[11px]">
                  Current Angle: ∠i = {angle}° → Reflected Angle: ∠r = {angle}°.
                </p>
              </div>
            )}

            {/* Step 5 Target Challenge */}
            {currentStep === 5 && (
              <div>
                <p>
                  🎯 <strong>Target Challenge:</strong> The sensor detector is stationed at <strong>55°</strong> on the reflection side.
                </p>
                <p className="mt-1">
                  Adjust the angle slider until the reflected beam strikes the target detector!
                </p>
                {targetHit ? (
                  <div className="mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Target Hit! Fantastic calibration!</span>
                  </div>
                ) : (
                  <p className="mt-1 text-amber-700 font-medium text-[11px]">
                    Current reflected angle is {angle}°. Calibrate to 55°!
                  </p>
                )}
              </div>
            )}

            {/* Step 6 Prediction Question 2 */}
            {currentStep === 6 && (
              <div>
                <p className="font-bold text-slate-900">Prediction Challenge 2:</p>
                <p className="mt-1">
                  What happens when the incident ray strikes the mirror at 0° to the normal (straight down)?
                </p>
              </div>
            )}

            {/* Step 7 Prediction Question 3 & 2nd Law */}
            {currentStep === 7 && (
              <div>
                <p className="font-bold text-slate-900">Prediction Challenge 3 (2nd Law):</p>
                <p className="mt-1">
                  Are the incident ray, reflected ray and normal line always in the same geometric plane?
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Tip: Rotate the 3D scene or toggle the &quot;Coplanar Plane&quot; button in the toolbar!
                </p>
              </div>
            )}

            {/* Step 8 Quiz */}
            {currentStep === 8 && (
              <p>
                Let&apos;s consolidate your mastery with our final 3-question quiz. Choose the best answer for each question below.
              </p>
            )}
          </div>
        </div>

        {/* STEP 2 INTERACTIVE QUESTION */}
        {currentStep === 2 && stepData.options && (
          <div className="space-y-2 pt-1">
            <p className="font-bold text-slate-900 text-xs">Choose the best answer:</p>
            {stepData.options.map((opt) => {
              const isSelected = preConceptAnswer === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setPreConceptAnswer(opt.id)}
                  className={`w-full p-3 rounded-xl text-left transition-all border cursor-pointer ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-red-50 border-red-300 text-red-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="font-bold font-mono text-blue-600 mt-0.5">{opt.id})</span>
                    <div className="flex-1">
                      <p className="leading-snug">{opt.text}</p>
                      {isSelected && (
                        <p className={`mt-1.5 text-[11px] font-semibold ${opt.isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                          {opt.feedback}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* STEP 4 PREDICTION QUESTION 1 */}
        {currentStep === 4 && stepData.options && (
          <div className="space-y-2 pt-1">
            <p className="font-bold text-slate-900 text-xs">Select your prediction:</p>
            {stepData.options.map((opt) => {
              const isSelected = step4Answer === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setStep4Answer(opt.id)}
                  className={`w-full p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-red-50 border-red-300 text-red-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="font-bold font-mono text-blue-600">{opt.id})</span>
                    <div className="flex-1">
                      <p className="leading-snug">{opt.text}</p>
                      {isSelected && (
                        <p className={`mt-1 text-[11px] font-semibold ${opt.isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                          {opt.feedback}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* STEP 6 PREDICTION QUESTION 2 */}
        {currentStep === 6 && stepData.options && (
          <div className="space-y-2 pt-1">
            <p className="font-bold text-slate-900 text-xs">Select your answer:</p>
            {stepData.options.map((opt) => {
              const isSelected = predictionAnswer === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setPredictionAnswer(opt.id)}
                  className={`w-full p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-red-50 border-red-300 text-red-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="font-bold font-mono text-purple-600">{opt.id})</span>
                    <div className="flex-1">
                      <p className="leading-snug">{opt.text}</p>
                      {isSelected && (
                        <p className={`mt-1 text-[11px] font-semibold ${opt.isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                          {opt.feedback}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* STEP 7 PREDICTION QUESTION 3 */}
        {currentStep === 7 && stepData.options && (
          <div className="space-y-2 pt-1">
            <p className="font-bold text-slate-900 text-xs">Test the Coplanar Rule:</p>
            {stepData.options.map((opt) => {
              const isSelected = step7Answer === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setStep7Answer(opt.id)}
                  className={`w-full p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-red-50 border-red-300 text-red-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="font-bold font-mono text-blue-600">{opt.id})</span>
                    <div className="flex-1">
                      <p className="leading-snug">{opt.text}</p>
                      {isSelected && (
                        <p className={`mt-1 text-[11px] font-semibold ${opt.isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                          {opt.feedback}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* STEP 8 3-QUESTION MASTERY QUIZ */}
        {currentStep === 8 && stepData.quizQuestions && (
          <div className="space-y-4 pt-1">
            {stepData.quizQuestions.map((q, idx) => (
              <div key={q.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="font-bold text-slate-900 text-xs">
                  {idx + 1}. {q.prompt}
                </p>

                <div className="space-y-1.5">
                  {q.options.map((opt) => {
                    const isSelected = quizAnswers[q.id] === opt.id;
                    const showCorrectness = quizCompleted;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleQuizOption(q.id, opt.id)}
                        className={`w-full p-2 rounded-lg text-left text-[11px] transition-all border cursor-pointer ${
                          isSelected
                            ? showCorrectness
                              ? opt.isCorrect
                                ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-semibold'
                                : 'bg-red-100 border-red-300 text-red-900 font-medium'
                              : 'bg-blue-100 border-blue-300 text-blue-900 font-medium'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="font-bold font-mono mr-1.5 text-slate-400">{opt.id.toUpperCase()})</span>
                        {opt.text}
                      </button>
                    );
                  })}
                </div>

                {quizCompleted && (
                  <p className="text-[10px] text-slate-600 pt-1 border-t border-slate-200 italic">
                    {q.explanation}
                  </p>
                )}
              </div>
            ))}

            {/* Quiz Result Banner */}
            {quizCompleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2 shadow-xs"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Experiment Completed!</h4>
                <p className="text-xs text-emerald-800 font-semibold">
                  Your Score: {getQuizScore()} / {stepData.quizQuestions.length} ({Math.round((getQuizScore() / stepData.quizQuestions.length) * 100)}%)
                </p>
                <p className="text-[11px] text-slate-600">
                  Badge Awarded: <strong>Master of Reflection 🏆</strong>
                </p>
                <button
                  onClick={onReset}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart Experiment</span>
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* PROGRESSIVE HINTS DRAWER */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 text-xs text-purple-700 hover:text-purple-800 font-semibold cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
          </button>

          <AnimatePresence>
            {showHint && hintsForStep.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed"
              >
                <p className="font-bold text-amber-800 mb-1">
                  💡 Hint {hintIndex + 1} of {hintsForStep.length}:
                </p>
                <p>{hintsForStep[hintIndex]}</p>

                {hintsForStep.length > 1 && (
                  <button
                    onClick={() => setHintIndex((hintIndex + 1) % hintsForStep.length)}
                    className="mt-2 text-[10px] text-amber-700 underline font-semibold cursor-pointer"
                  >
                    Next Hint →
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Panel Bottom Navigation Action Button */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Previous
        </button>

        <span className="text-[11px] text-slate-500 font-mono">
          Step {currentStep} / {REFLECTION_STEPS.length}
        </span>

        <button
          onClick={() => setCurrentStep(Math.min(REFLECTION_STEPS.length, currentStep + 1))}
          disabled={currentStep === REFLECTION_STEPS.length}
          className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
