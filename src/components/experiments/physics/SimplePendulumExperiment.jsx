import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Bot,
  Activity,
  Globe,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Target,
  Maximize2,
  Minimize2,
  BookMarked,
  GitCompare,
  Award,
  Compass,
} from 'lucide-react';
import PendulumMotionStage from './PendulumMotionStage';
import PendulumTermModal from './PendulumTermModal';
import LabNotebookModal from '../common/LabNotebookModal';
import CompletionReportModal from '../common/CompletionReportModal';
import ResetConfirmationModal from '../common/ResetConfirmationModal';
import { GRAVITY_PRESETS, PENDULUM_TASKS } from './pendulumData';

export default function SimplePendulumExperiment() {
  // Experiment Mode: 'guided' | 'free'
  const [experimentMode, setExperimentMode] = useState('guided');

  // Fullscreen Focus Mode
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Physical parameters
  const [lengthCm, setLengthCm] = useState(50); // cm (10 - 100 cm)
  const [initialAngleDeg, setInitialAngleDeg] = useState(15); // degrees (5 - 45°)
  const [selectedGravityKey, setSelectedGravityKey] = useState('earth');

  // Animation and stopwatch state
  const [isRunning, setIsRunning] = useState(true);
  const [stopwatchTime, setStopwatchTime] = useState(0); // seconds
  const [completedCycles, setCompletedCycles] = useState(0);
  const [currentThetaDeg, setCurrentThetaDeg] = useState(15);

  // Modals state
  const [activeTermKey, setActiveTermKey] = useState(null);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Virtual Lab Notebook entries
  const [notebookRecords, setNotebookRecords] = useState([
    {
      id: 1,
      time: 'Initial',
      title: 'Pendulum Apparatus Calibrated',
      detail: 'Suspended length set to 50.0 cm on Earth (g = 9.80 m/s²) released from 15° amplitude.',
      resultValue: 'T = 1.42 s, f = 0.70 Hz',
    },
  ]);

  // Active gravity object
  const gravity = GRAVITY_PRESETS[selectedGravityKey] || GRAVITY_PRESETS.earth;
  const g = gravity.value;
  const lengthMeters = lengthCm / 100;

  // Theoretical Period: T = 2π√(L/g)
  const theoreticalPeriod = useMemo(() => {
    return 2 * Math.PI * Math.sqrt(lengthMeters / g);
  }, [lengthMeters, g]);

  // Natural angular frequency omega = sqrt(g / L)
  const omega = useMemo(() => {
    return Math.sqrt(g / lengthMeters);
  }, [g, lengthMeters]);

  // Frequency in Hertz
  const naturalFrequency = useMemo(() => {
    return 1 / theoreticalPeriod;
  }, [theoreticalPeriod]);

  // Second-order small angle correction: T_exact ≈ T_0 * (1 + (1/16)*theta0_rad^2)
  const exactPeriod = useMemo(() => {
    const rad = (initialAngleDeg * Math.PI) / 180;
    return theoreticalPeriod * (1 + (1 / 16) * Math.pow(rad, 2));
  }, [theoreticalPeriod, initialAngleDeg]);

  // Contextual explanation notification state
  const [explanation, setExplanation] = useState({
    title: 'Simple Pendulum Oscillating',
    message: `Oscillating on Earth (g = 9.80 m/s²) with string length 50 cm. Theoretical time period T = ${theoreticalPeriod.toFixed(2)} s (f = ${naturalFrequency.toFixed(2)} Hz).`,
    type: 'info',
    timestamp: 0,
  });

  // Track previous values for differential explanation
  const prevRef = useRef({
    lengthCm: 50,
    gravityKey: 'earth',
    initialAngleDeg: 15,
    isRunning: true,
  });

  // Interactive tasks state
  const [selectedTaskIdx, setSelectedTaskIdx] = useState(0);
  const [userPredictions, setUserPredictions] = useState({});
  const [submittedTasks, setSubmittedTasks] = useState({});

  // Add notebook log entry helper
  const addNotebookEntry = useCallback((title, detail, resultValue) => {
    const entry = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      title,
      detail,
      resultValue,
    };
    setNotebookRecords((prev) => [entry, ...prev.slice(0, 49)]);
  }, []);

  const triggerExplanation = useCallback(
    (newExpl, resultStr = '') => {
      setExplanation({
        ...newExpl,
        timestamp: Date.now(),
      });
      addNotebookEntry(newExpl.title, newExpl.message, resultStr);
    },
    [addNotebookEntry]
  );

  // Handle Length Change with differential explanation
  const handleLengthChange = (newLen) => {
    const clamped = Math.max(10, Math.min(100, Math.round(newLen)));
    const prev = prevRef.current.lengthCm;
    if (clamped === prev) return;

    const newPeriod = 2 * Math.PI * Math.sqrt((clamped / 100) / g);
    const resultStr = `L = ${clamped}cm, T = ${newPeriod.toFixed(2)}s`;

    if (clamped > prev) {
      triggerExplanation(
        {
          title: `Length Increased: ${prev}cm ➔ ${clamped}cm (+${clamped - prev}cm)`,
          message: `The pendulum length increased. A longer pendulum possesses greater rotational inertia and sweeps through a longer arc, so its time period increases from ${theoreticalPeriod.toFixed(2)}s to ${newPeriod.toFixed(2)}s.`,
          type: 'length',
        },
        resultStr
      );
    } else {
      triggerExplanation(
        {
          title: `Length Decreased: ${prev}cm ➔ ${clamped}cm (-${prev - clamped}cm)`,
          message: `The pendulum is shorter, experiencing a higher natural frequency. Time period decreases from ${theoreticalPeriod.toFixed(2)}s to ${newPeriod.toFixed(2)}s.`,
          type: 'length',
        },
        resultStr
      );
    }

    prevRef.current.lengthCm = clamped;
    setLengthCm(clamped);
  };

  // Handle Gravity Change with differential explanation
  const handleGravityChange = (newKey) => {
    const prevKey = prevRef.current.gravityKey;
    if (newKey === prevKey) return;

    const newG = GRAVITY_PRESETS[newKey]?.value || 9.8;
    const newPeriod = 2 * Math.PI * Math.sqrt(lengthMeters / newG);
    const resultStr = `g = ${newG.toFixed(2)} m/s², T = ${newPeriod.toFixed(2)}s`;

    if (newKey === 'moon') {
      triggerExplanation(
        {
          title: 'Gravity Switched to Moon (1.62 m/s²)',
          message: `Gravity is ~6× weaker on the Moon than Earth. With less downward restoring force, the pendulum swings slowly with an extended period of ${newPeriod.toFixed(2)}s.`,
          type: 'gravity',
        },
        resultStr
      );
    } else if (newKey === 'jupiter') {
      triggerExplanation(
        {
          title: 'Gravity Switched to Jupiter (24.79 m/s²)',
          message: `Gravity is ~2.53× stronger on Jupiter! The intense restoring force accelerates the bob vigorously, shortening the period to ${newPeriod.toFixed(2)}s.`,
          type: 'gravity',
        },
        resultStr
      );
    } else {
      triggerExplanation(
        {
          title: 'Gravity Restored to Earth (9.80 m/s²)',
          message: `Standard terrestrial acceleration restored (g = 9.80 m/s²). Time period calibrated to ${newPeriod.toFixed(2)}s.`,
          type: 'gravity',
        },
        resultStr
      );
    }

    prevRef.current.gravityKey = newKey;
    setSelectedGravityKey(newKey);
  };

  // Handle Initial Angle Change
  const handleAngleChange = (newAngle) => {
    const clamped = Math.max(5, Math.min(45, Math.round(newAngle)));
    const prev = prevRef.current.initialAngleDeg;
    if (clamped === prev) return;

    triggerExplanation(
      {
        title: `Release Amplitude Changed: ${prev}° ➔ ${clamped}°`,
        message: `The initial release displacement is now ${clamped}°. For small angles (<15°), time period remains essentially constant (isochronism: T = ${theoreticalPeriod.toFixed(2)}s).`,
        type: 'angle',
      },
      `θ₀ = ${clamped}°, T = ${theoreticalPeriod.toFixed(2)}s`
    );

    prevRef.current.initialAngleDeg = clamped;
    setInitialAngleDeg(clamped);
    if (!isRunning) {
      setCurrentThetaDeg(clamped);
    }
  };

  // Handle Play/Pause
  const handleTogglePlay = () => {
    const nextState = !isRunning;
    setIsRunning(nextState);
    prevRef.current.isRunning = nextState;

    if (nextState) {
      triggerExplanation(
        {
          title: 'Pendulum Released & Running',
          message: `The bob has been released from ${initialAngleDeg}°. Observe the smooth harmonic motion and track oscillations using the live stopwatch.`,
          type: 'motion',
        },
        `Running at θ₀ = ${initialAngleDeg}°`
      );
    } else {
      triggerExplanation(
        {
          title: 'Pendulum Paused',
          message: `Oscillation paused at instantaneous angle ${currentThetaDeg.toFixed(1)}°. Stopwatch stopped at ${stopwatchTime.toFixed(2)}s.`,
          type: 'motion',
        },
        `Paused at ${currentThetaDeg.toFixed(1)}° (${stopwatchTime.toFixed(2)}s)`
      );
    }
  };

  // Confirmable Reset Logic
  const handleRequestReset = () => {
    if (notebookRecords.length > 2 || Object.keys(submittedTasks).length > 0) {
      setIsResetConfirmOpen(true);
    } else {
      executeReset();
    }
  };

  const executeReset = () => {
    setIsRunning(false);
    setStopwatchTime(0);
    setCompletedCycles(0);
    setCurrentThetaDeg(initialAngleDeg);
    triggerExplanation(
      {
        title: 'Experiment Reset',
        message: `Stopwatch and oscillation count cleared. Bob reset to initial release angle of ${initialAngleDeg}°.`,
        type: 'reset',
      },
      `L = ${lengthCm}cm, T = ${theoreticalPeriod.toFixed(2)}s`
    );
  };

  // Physics animation loop using requestAnimationFrame
  const animRef = useRef();

  useEffect(() => {
    if (!isRunning) {
      cancelAnimationFrame(animRef.current);
      return;
    }

    let lastTime = performance.now();

    const loop = (time) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      setStopwatchTime((prevTime) => {
        const nextTime = prevTime + dt;

        // Physical angle theta(t) = theta0 * cos(omega * t)
        const rad = ((initialAngleDeg * Math.PI) / 180) * Math.cos(omega * nextTime);
        const deg = (rad * 180) / Math.PI;
        setCurrentThetaDeg(deg);

        // Count completed full oscillations
        const cycles = Math.floor(nextTime / theoreticalPeriod);
        setCompletedCycles(cycles);

        return nextTime;
      });

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [isRunning, initialAngleDeg, omega, theoreticalPeriod]);

  // Active Task Helpers
  const currentTask = PENDULUM_TASKS[selectedTaskIdx];
  const userOption = userPredictions[currentTask.id];
  const isSubmitted = submittedTasks[currentTask.id];
  const correctOption = currentTask.options.find((o) => o.isCorrect);
  const isCorrect = userOption === correctOption?.id;

  const handleSelectOption = (optId) => {
    if (isSubmitted) return;
    setUserPredictions((prev) => ({ ...prev, [currentTask.id]: optId }));
  };

  const handleSubmitPrediction = () => {
    if (!userOption) return;
    const updated = { ...submittedTasks, [currentTask.id]: true };
    setSubmittedTasks(updated);

    const isThisCorrect = userOption === correctOption?.id;
    addNotebookEntry(
      `Task ${currentTask.id} Answer Submitted`,
      `User selected option ${userOption.toUpperCase()}. Result: ${isThisCorrect ? 'CORRECT' : 'INCORRECT'}. ${currentTask.explanation}`,
      isThisCorrect ? 'Answer Verified ✓' : 'Answer Revised'
    );

    // If all tasks completed, trigger completion certificate
    if (Object.keys(updated).length === PENDULUM_TASKS.length) {
      setTimeout(() => setIsCompletionOpen(true), 1200);
    }
  };

  const handleApplyTaskPreset = () => {
    if (currentTask.targetLength !== undefined) {
      handleLengthChange(currentTask.targetLength);
    }
    if (currentTask.targetGravity !== undefined) {
      handleGravityChange(currentTask.targetGravity);
    }
    if (currentTask.targetAngle !== undefined) {
      handleAngleChange(currentTask.targetAngle);
    }
    executeReset();
    setTimeout(() => setIsRunning(true), 150);
  };

  // Calculate score for completion
  const taskScore = useMemo(() => {
    let correct = 0;
    PENDULUM_TASKS.forEach((tk) => {
      const chosen = userPredictions[tk.id];
      const right = tk.options.find((o) => o.isCorrect)?.id;
      if (chosen === right) correct += 1;
    });
    return { correct, total: PENDULUM_TASKS.length };
  }, [userPredictions]);

  const lengthPresets = [20, 50, 80, 100];
  const anglePresets = [5, 10, 15, 20, 30, 45];

  // Current State for Comparator and Notebook
  const currentStateObject = {
    'Suspension Length': `${lengthCm} cm (${(lengthCm / 100).toFixed(2)} m)`,
    'Gravitational Field': `${g.toFixed(2)} m/s² (${gravity.name})`,
    'Release Amplitude': `${initialAngleDeg}°`,
    'Calculated Period (T)': `${theoreticalPeriod.toFixed(2)} s`,
    'Natural Frequency (f)': `${naturalFrequency.toFixed(2)} Hz`,
    'Completed Cycles': `${completedCycles} swings`,
    'Stopwatch Time': `${stopwatchTime.toFixed(2)} s`,
    lengthCm,
    g,
    timePeriod: theoreticalPeriod,
    planet: gravity.name,
  };

  return (
    <div
      className={`w-full flex flex-col space-y-5 transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-50 overflow-y-auto p-4 sm:p-6 shadow-2xl'
          : 'relative'
      }`}
    >
      {/* Clickable Scientific Term Modal */}
      <PendulumTermModal activeTermKey={activeTermKey} onClose={() => setActiveTermKey(null)} />

      {/* Virtual Lab Notebook & Comparator Modal */}
      <LabNotebookModal
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        experimentTitle="Simple Pendulum Harmonic Oscillator"
        records={notebookRecords}
        onClearRecords={() => setNotebookRecords([])}
        currentState={currentStateObject}
        comparisonType="pendulum"
      />

      {/* Experiment Completion Report Modal */}
      <CompletionReportModal
        isOpen={isCompletionOpen}
        onClose={() => setIsCompletionOpen(false)}
        experimentTitle="Simple Pendulum Mastery Certificate"
        principles={[
          'Length Dependency: Time period is directly proportional to the square root of string length (T ∝ √L).',
          'Gravity Dependency: Time period is inversely proportional to the square root of gravity (T ∝ 1/√g).',
          'Mass Independence: The mass of the bob cancels out completely and does not alter the oscillation period.',
          'Isochronism & Small Angles: For amplitudes under 15°, period is independent of release angle.',
        ]}
        formulas={['T = 2π√(L / g)', 'f = 1 / T', 'ω = √(g / L)', 'T_exact ≈ T_0(1 + θ₀²/16)']}
        measurementsCount={notebookRecords.length}
        score={taskScore}
        realWorldApp="Historically governed precision pendulum clocks (grandfather clocks) calibrated to the 1-meter 'seconds pendulum' (T ≈ 2.0s), and modern seismographs detecting earthquake tremors."
        onRetry={() => {
          setSubmittedTasks({});
          setUserPredictions({});
        }}
        onSwitchFreeMode={() => setExperimentMode('free')}
      />

      {/* Reset Confirmation Dialog */}
      <ResetConfirmationModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={executeReset}
        recordsCount={notebookRecords.length}
      />

      {/* TOP COMPACT HEADER: Title, Mode Switcher, Notebook & Fullscreen */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Simple Pendulum Harmonic Oscillator
              </h2>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                Physics Lab
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Governing Equation: <span className="font-mono font-bold text-blue-600">T = 2π√(L / g)</span> ⟺ Frequency:{' '}
              <span className="font-mono font-bold text-blue-600">f = 1 / T</span>
            </p>
          </div>
        </div>

        {/* Global Toolbar: Mode Switcher, Notebook, Comparison, Fullscreen */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher Pill (Guided vs Free Mode) */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setExperimentMode('guided')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                experimentMode === 'guided'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Guided Mode: Step-by-step oscillation challenges and instruction"
            >
              🎯 Guided Mode
            </button>
            <button
              onClick={() => setExperimentMode('free')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                experimentMode === 'free'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Free Experiment Mode: Unrestricted exploration of length, angles, and gravity"
            >
              🧪 Free Mode
            </button>
          </div>

          {/* Virtual Lab Notebook Button */}
          <button
            onClick={() => setIsNotebookOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Open Lab Notebook to view telemetry logs and comparative analysis"
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>Notebook ({notebookRecords.length})</span>
          </button>

          {/* Quick Comparator Trigger */}
          <button
            onClick={() => {
              setIsNotebookOpen(true);
            }}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Compare two pendulum readings (e.g. Earth vs Moon or length differences)"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare</span>
          </button>

          {/* Fullscreen Focus Mode Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Immersive Fullscreen Focus Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-blue-600" /> : <Maximize2 className="w-3.5 h-3.5 text-blue-600" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit Focus' : 'Focus Mode'}</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={handleRequestReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            title="Reset stopwatch and oscillations"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: DOMINANT HERO SIMULATION ARENA (65–70% of Focus) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        {/* Top Control Bar over Simulation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Harmonic Motion Oscillation Stage
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
              Mode: {experimentMode === 'guided' ? 'Guided Challenges' : 'Free Exploration'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Digital Stopwatch Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white font-mono text-xs">
              <span className="text-slate-400">Stopwatch:</span>
              <span className="text-cyan-400 font-bold text-sm">{stopwatchTime.toFixed(2)}s</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-bold">{completedCycles} cycles</span>
            </div>

            {/* Start / Pause & Reset Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePlay}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  isRunning
                    ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isRunning ? 'Pause' : 'Release'}</span>
              </button>

              <button
                onClick={handleRequestReset}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                title="Reset timer and position"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* ENLARGED DOMINANT PENDULUM MOTION STAGE */}
        <PendulumMotionStage
          lengthCm={lengthCm}
          initialAngleDeg={initialAngleDeg}
          currentThetaDeg={currentThetaDeg}
          gravity={gravity}
          isRunning={isRunning}
          timePeriod={theoreticalPeriod}
        />

        {/* CONTEXTUAL DIFFERENTIAL EXPLANATION NOTIFICATION */}
        <AnimatePresence mode="wait">
          <motion.div
            key={explanation.timestamp}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
              explanation.type === 'length'
                ? 'bg-blue-50/90 border-blue-200 text-blue-950'
                : explanation.type === 'gravity'
                ? 'bg-amber-50/90 border-amber-200 text-amber-950'
                : explanation.type === 'angle'
                ? 'bg-purple-50/90 border-purple-200 text-purple-950'
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                explanation.type === 'length'
                  ? 'bg-blue-100 text-blue-700'
                  : explanation.type === 'gravity'
                  ? 'bg-amber-100 text-amber-700'
                  : explanation.type === 'angle'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold leading-tight">{explanation.title}</p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{explanation.message}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* DIRECT INTEGRATED CONTROLS (Easily accessible right below simulation) */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. PENDULUM LENGTH CONTROL (10 - 100 cm) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-800">1. Length (L):</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleLengthChange(lengthCm - 5)}
                    disabled={lengthCm <= 10}
                    className="w-6 h-6 rounded bg-white border border-slate-200 text-slate-700 font-mono text-[11px] font-bold flex items-center justify-center hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                  >
                    -5
                  </button>
                  <button
                    onClick={() => handleLengthChange(lengthCm - 1)}
                    disabled={lengthCm <= 10}
                    className="w-6 h-6 rounded bg-white border border-slate-200 text-slate-700 font-mono text-[11px] font-bold flex items-center justify-center hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                  >
                    -1
                  </button>
                  <div className="px-2.5 py-0.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold min-w-[56px] text-center shadow-2xs">
                    {lengthCm}cm
                  </div>
                  <button
                    onClick={() => handleLengthChange(lengthCm + 1)}
                    disabled={lengthCm >= 100}
                    className="w-6 h-6 rounded bg-white border border-slate-200 text-slate-700 font-mono text-[11px] font-bold flex items-center justify-center hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => handleLengthChange(lengthCm + 5)}
                    disabled={lengthCm >= 100}
                    className="w-6 h-6 rounded bg-white border border-slate-200 text-slate-700 font-mono text-[11px] font-bold flex items-center justify-center hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                  >
                    +5
                  </button>
                </div>
              </div>

              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={lengthCm}
                onChange={(e) => handleLengthChange(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-200 accent-blue-600 cursor-pointer appearance-none"
              />

              <div className="flex items-center justify-between flex-wrap gap-1 pt-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Presets:</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {lengthPresets.map((lp) => (
                    <button
                      key={lp}
                      onClick={() => handleLengthChange(lp)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                        lengthCm === lp
                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {lp}cm
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. INITIAL RELEASE ANGLE (5 - 45°) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-800">2. Amplitude (θ₀):</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleAngleChange(initialAngleDeg - 1)}
                    disabled={initialAngleDeg <= 5}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 font-mono text-xs font-bold flex items-center justify-center hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                  >
                    -1°
                  </button>
                  <div className="px-3 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 font-mono text-xs font-bold min-w-[50px] text-center shadow-2xs">
                    {initialAngleDeg}°
                  </div>
                  <button
                    onClick={() => handleAngleChange(initialAngleDeg + 1)}
                    disabled={initialAngleDeg >= 45}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 font-mono text-xs font-bold flex items-center justify-center hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                  >
                    +1°
                  </button>
                </div>
              </div>

              <input
                type="range"
                min="5"
                max="45"
                step="1"
                value={initialAngleDeg}
                onChange={(e) => handleAngleChange(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-200 accent-purple-600 cursor-pointer appearance-none"
              />

              <div className="flex items-center justify-between flex-wrap gap-1 pt-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Presets:</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {anglePresets.map((ap) => (
                    <button
                      key={ap}
                      onClick={() => handleAngleChange(ap)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                        initialAngleDeg === ap
                          ? 'bg-purple-600 text-white font-bold shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {ap}°
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. GRAVITY ENVIRONMENT PRESETS (Earth, Moon, Jupiter) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 block">3. Gravitational Field (g):</span>
              <div className="grid grid-cols-3 gap-1.5">
                {Object.entries(GRAVITY_PRESETS).map(([key, item]) => {
                  const isSelected = selectedGravityKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleGravityChange(key)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold truncate">{item.name.split(' ')[0]}</span>
                        <Globe className={`w-3 h-3 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />
                      </div>
                      <p className="text-[10px] font-mono font-bold mt-0.5 text-slate-900">{item.unit}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: SUPPORTING WORKBENCH (Organized Below the Main Simulation) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* COLUMN 1: Live Harmonic Measurements & Approximations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Physical Harmonic Measurements</span>
            <Activity className="w-3.5 h-3.5 text-blue-600" />
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-600">Calculated Period (T):</span>
              <span className="font-mono font-bold text-blue-700">{theoreticalPeriod.toFixed(3)} s</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-600">Natural Frequency (f):</span>
              <span className="font-mono font-bold text-purple-700">{naturalFrequency.toFixed(2)} Hz</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-600">Angular Velocity (ω):</span>
              <span className="font-mono font-bold text-slate-800">{omega.toFixed(2)} rad/s</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-600">Exact T (2nd-Order):</span>
              <span className="font-mono font-semibold text-slate-700">{exactPeriod.toFixed(3)} s</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-600">Average Measured T:</span>
              <span className="font-mono font-bold text-emerald-700">
                {completedCycles > 0 ? (stopwatchTime / completedCycles).toFixed(2) : theoreticalPeriod.toFixed(2)} s
              </span>
            </div>

            {/* Small-angle approximation validation box */}
            <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-200 text-[11px] text-blue-900 leading-snug">
              {initialAngleDeg <= 15 ? (
                <span>
                  ✓ <strong>Small-angle approximation holds:</strong> Error between linear simple harmonic formula and exact motion is under 0.4%.
                </span>
              ) : (
                <span>
                  ⚠️ <strong>Large amplitude ({initialAngleDeg}°):</strong> Due to circular restoring force nonlinearity, actual period is ~{((exactPeriod / theoreticalPeriod - 1) * 100).toFixed(1)}% longer than small-angle prediction.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* COLUMN 2: Guided Oscillation Tasks OR Free Mode Benchmark */}
        {experimentMode === 'guided' ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Oscillation Experiments
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                {selectedTaskIdx + 1} / {PENDULUM_TASKS.length}
              </span>
            </div>

            {/* Task Step Selectors */}
            <div className="grid grid-cols-5 gap-1">
              {PENDULUM_TASKS.map((tk, idx) => {
                const submitted = submittedTasks[tk.id];
                const opt = userPredictions[tk.id];
                const corr = tk.options.find((o) => o.isCorrect)?.id;
                const passed = submitted && opt === corr;

                return (
                  <button
                    key={tk.id}
                    onClick={() => setSelectedTaskIdx(idx)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      selectedTaskIdx === idx
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : passed
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : submitted
                        ? 'bg-red-50 text-red-700 border-red-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    T{idx + 1} {passed ? '✓' : ''}
                  </button>
                );
              })}
            </div>

            {/* Active Task Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900">{currentTask.title}</h4>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">{currentTask.prompt}</p>

              {/* Quick Preset Sync Button */}
              {currentTask.targetLength !== undefined && (
                <button
                  onClick={handleApplyTaskPreset}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Configure Stage for Task</span>
                </button>
              )}

              {/* Multiple Choice Options */}
              <div className="space-y-1.5 pt-1">
                {currentTask.options.map((opt) => {
                  const isChosen = userOption === opt.id;
                  let optStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';

                  if (isSubmitted) {
                    if (opt.isCorrect) {
                      optStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                    } else if (isChosen && !opt.isCorrect) {
                      optStyle = 'bg-red-50 border-red-300 text-red-900 line-through';
                    }
                  } else if (isChosen) {
                    optStyle = 'bg-blue-50 border-blue-400 text-blue-900 font-bold shadow-2xs';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={isSubmitted}
                      className={`w-full p-2.5 rounded-xl text-left text-xs transition-all border cursor-pointer ${optStyle}`}
                    >
                      <span className="font-bold mr-1.5 uppercase">{opt.id})</span>
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              {/* Submit Prediction Button */}
              {!isSubmitted ? (
                <button
                  onClick={handleSubmitPrediction}
                  disabled={!userOption}
                  className="w-full py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
                >
                  Submit Answer
                </button>
              ) : (
                <div
                  className={`p-3 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
                    isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Correct!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span>Incorrect</span>
                      </>
                    )}
                  </div>
                  <p>{currentTask.explanation}</p>
                </div>
              )}
            </div>

            {/* View Completion Certificate Button */}
            {Object.keys(submittedTasks).length > 0 && (
              <button
                onClick={() => setIsCompletionOpen(true)}
                className="w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>View Laboratory Certificate ({taskScore.correct}/{taskScore.total})</span>
              </button>
            )}
          </div>
        ) : (
          /* FREE EXPERIMENT MODE: Advanced Telemetry Bench */
          <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Free Harmonic Bench
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Unrestricted Mode
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Explore custom lengths ($10 - 100\text{cm}$), amplitudes ($5 - 45^\circ$), and extraterrestrial gravities (Earth, Moon, Jupiter) without forced sequences.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-800">Exploration Prompts:</span>
              <ul className="space-y-1.5 text-slate-600 text-[11px]">
                <li>• Set length to 100 cm on Earth to observe the historical 2-second pendulum.</li>
                <li>• Switch to the Moon and measure how many times slower the oscillations become.</li>
                <li>• Use the Lab Notebook Comparator to directly evaluate period ratios.</li>
              </ul>
            </div>

            <button
              onClick={() => setIsNotebookOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <BookMarked className="w-4 h-4" />
              <span>Open Lab Notebook &amp; Comparator</span>
            </button>
          </div>
        )}

        {/* COLUMN 3: Dr. Nova AI Lab Assistant & Glossary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-purple-200/80 p-4.5 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-purple-100">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900">Dr. Nova</h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-[10px] text-purple-700 font-semibold">AI Mechanics Mentor</p>
              </div>
            </div>

            {/* Assistant Dynamic Speech */}
            <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200 text-xs text-slate-700 leading-relaxed space-y-2">
              {selectedGravityKey === 'moon' ? (
                <p>
                  <strong>Lunar Mechanics:</strong> Weak gravity on the Moon (1.62 m/s²) means the restoring force component (F = mg sin θ) is small. Notice how gracefully the bob swings!
                </p>
              ) : selectedGravityKey === 'jupiter' ? (
                <p>
                  <strong>Jupiter Gravity:</strong> Extreme acceleration (24.79 m/s²) produces rapid oscillations! The pendulum completes more than 1 full cycle per second.
                </p>
              ) : lengthCm === 100 ? (
                <p>
                  <strong>1-Meter Standard:</strong> At L = 1.0 m on Earth, time period is almost exactly 2 seconds (2.01s). This historically inspired the definition of the &quot;seconds pendulum&quot;!
                </p>
              ) : (
                <p>
                  <strong>Simple Harmonic Motion:</strong> The pendulum exchanges kinetic energy (maximum at mean position 0°) and potential energy (maximum at extremes ±{initialAngleDeg}°).
                </p>
              )}

              <div className="pt-2 border-t border-purple-200/60 flex items-center justify-between text-[11px] text-purple-800">
                <span className="font-bold">Mass Independence:</span>
                <span>T is independent of bob mass ✓</span>
              </div>
            </div>

            {/* Quick Glossary Button */}
            <button
              onClick={() => setActiveTermKey('simple-pendulum')}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Browse Pendulum Mechanics Glossary</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
