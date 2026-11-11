import { useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  RotateCcw,
  Bot,
  Activity,
  Power,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Target,
  Sparkles,
  Maximize2,
  Minimize2,
  BookMarked,
  GitCompare,
  Award,
  Compass,
} from 'lucide-react';
import OhmsCircuitBoard from './OhmsCircuitBoard';
import OhmsGraph from './OhmsGraph';
import OhmsTermModal from './OhmsTermModal';
import LabNotebookModal from '../common/LabNotebookModal';
import CompletionReportModal from '../common/CompletionReportModal';
import ResetConfirmationModal from '../common/ResetConfirmationModal';
import { OHMS_CHALLENGES } from './ohmsData';

export default function OhmsLawExperiment() {
  // Experiment Mode: 'guided' | 'free'
  const [experimentMode, setExperimentMode] = useState('guided');

  // Fullscreen / Focus Mode
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Circuit electrical parameters
  const [voltage, setVoltage] = useState(10); // Volts (0 - 20V)
  const [resistance, setResistance] = useState(10); // Ohms (1 - 100Ω)
  const [isSwitchClosed, setIsSwitchClosed] = useState(true);

  // Modal Dialogs
  const [activeTermKey, setActiveTermKey] = useState(null);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Virtual Lab Notebook entries
  const [notebookRecords, setNotebookRecords] = useState([
    {
      id: 1,
      time: 'Initial',
      title: 'Circuit Setup Initialized',
      detail: 'Standard DC Bench calibrated to 10.0V across a 10Ω load resistor with knife switch closed.',
      resultValue: 'I = 1.00 A, P = 10.0 W',
    },
  ]);

  // Contextual explanation notification state
  const [explanation, setExplanation] = useState({
    title: 'Circuit Energized & Operating',
    message:
      'Circuit energized at 10V across a 10Ω resistor. Electric charges are actively circulating through the series ammeter and resistor (I = 1.00 A).',
    type: 'info',
    timestamp: 0,
  });

  // Track previous values for differential explanation
  const prevRef = useRef({ voltage: 10, resistance: 10, isSwitchClosed: true });

  // Interactive challenges state
  const [selectedChallengeIdx, setSelectedChallengeIdx] = useState(0);
  const [userPredictions, setUserPredictions] = useState({});
  const [submittedChallenges, setSubmittedChallenges] = useState({});

  // Ohm's Law live calculations: I = V / R (when circuit is closed)
  const current = useMemo(() => {
    if (!isSwitchClosed) return 0;
    if (resistance <= 0) return 0;
    return voltage / resistance; // Amperes
  }, [voltage, resistance, isSwitchClosed]);

  const currentMilliamps = (current * 1000).toFixed(0);
  const powerWatts = (voltage * current).toFixed(2);

  // Helper to record an entry into the Lab Notebook automatically
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

  // Trigger rich contextual notification whenever parameters change
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

  // Handle Voltage Change with detailed differential explanation
  const handleVoltageChange = (newV) => {
    const clampedV = Math.max(0, Math.min(20, Math.round(newV)));
    const prevV = prevRef.current.voltage;
    if (clampedV === prevV) return;

    const resultingCurrent = isSwitchClosed ? (clampedV / resistance).toFixed(2) : '0.00';
    const resultStr = `I = ${resultingCurrent} A, V = ${clampedV} V`;

    if (clampedV > prevV) {
      triggerExplanation(
        {
          title: `Voltage Increased: ${prevV}V ➔ ${clampedV}V (+${clampedV - prevV}V)`,
          message: `Voltage increased from ${prevV}V to ${clampedV}V. Because resistance remains constant at ${resistance}Ω, greater electrical potential pushes charges with more force. By Ohm's Law (I = V/R), current increases to ${resultingCurrent} A.`,
          type: 'voltage',
        },
        resultStr
      );
    } else {
      triggerExplanation(
        {
          title: `Voltage Decreased: ${prevV}V ➔ ${clampedV}V (-${prevV - clampedV}V)`,
          message: `Voltage decreased from ${prevV}V to ${clampedV}V. With resistance unchanged at ${resistance}Ω, less electromotive force pushes charges. Current decreases to ${resultingCurrent} A according to Ohm's Law.`,
          type: 'voltage',
        },
        resultStr
      );
    }

    prevRef.current.voltage = clampedV;
    setVoltage(clampedV);
  };

  // Handle Resistance Change with detailed differential explanation
  const handleResistanceChange = (newR) => {
    const clampedR = Math.max(1, Math.min(100, Math.round(newR)));
    const prevR = prevRef.current.resistance;
    if (clampedR === prevR) return;

    const resultingCurrent = isSwitchClosed ? (voltage / clampedR).toFixed(2) : '0.00';
    const resultStr = `I = ${resultingCurrent} A, R = ${clampedR} Ω`;

    if (clampedR > prevR) {
      triggerExplanation(
        {
          title: `Resistance Increased: ${prevR}Ω ➔ ${clampedR}Ω (+${clampedR - prevR}Ω)`,
          message: `Resistance increased from ${prevR}Ω to ${clampedR}Ω. The material offers stronger opposition to the flow of electrons. At constant ${voltage}V, current drops to ${resultingCurrent} A.`,
          type: 'resistance',
        },
        resultStr
      );
    } else {
      triggerExplanation(
        {
          title: `Resistance Decreased: ${prevR}Ω ➔ ${clampedR}Ω (-${prevR - clampedR}Ω)`,
          message: `Resistance decreased from ${prevR}Ω to ${clampedR}Ω. The circuit now presents less opposition to charge flow, permitting current to surge to ${resultingCurrent} A.`,
          type: 'resistance',
        },
        resultStr
      );
    }

    prevRef.current.resistance = clampedR;
    setResistance(clampedR);
  };

  // Handle Switch Toggle with clear circuit mechanics explanation
  const handleToggleSwitch = () => {
    const nextState = !isSwitchClosed;
    setIsSwitchClosed(nextState);
    prevRef.current.isSwitchClosed = nextState;

    if (nextState) {
      const resultingI = (voltage / resistance).toFixed(2);
      triggerExplanation(
        {
          title: 'Circuit Closed (Switch ON)',
          message: `The knife switch is closed, completing the conducting loop. Electrons flow freely from the power supply through the ammeter and resistor. Circuit current is ${resultingI} A.`,
          type: 'switch',
        },
        `I = ${resultingI} A (Conducting)`
      );
    } else {
      triggerExplanation(
        {
          title: 'Circuit Open (Switch OFF)',
          message:
            'The knife switch is physically opened, breaking the conducting loop. Because air has immense resistance, charges cannot jump the gap. Current immediately drops to 0.00 A.',
          type: 'switch',
        },
        'I = 0.00 A (Broken Loop)'
      );
    }
  };

  // Confirmable Reset Logic
  const handleRequestReset = () => {
    if (notebookRecords.length > 2 || Object.keys(submittedChallenges).length > 0) {
      setIsResetConfirmOpen(true);
    } else {
      executeReset();
    }
  };

  const executeReset = () => {
    setVoltage(10);
    setResistance(10);
    setIsSwitchClosed(true);
    prevRef.current = { voltage: 10, resistance: 10, isSwitchClosed: true };
    setUserPredictions({});
    setSubmittedChallenges({});
    triggerExplanation(
      {
        title: 'Experiment Reset to Defaults',
        message: 'Circuit restored to default initial parameters: 10V source, 10Ω resistor, knife switch closed (I = 1.00 A).',
        type: 'reset',
      },
      'I = 1.00 A, V = 10.0 V, R = 10 Ω'
    );
  };

  // Active Challenge Helpers
  const currentChallenge = OHMS_CHALLENGES[selectedChallengeIdx];
  const userOption = userPredictions[currentChallenge.id];
  const isSubmitted = submittedChallenges[currentChallenge.id];
  const correctOption = currentChallenge.options.find((o) => o.isCorrect);
  const isCorrect = userOption === correctOption?.id;

  const handleSelectOption = (optId) => {
    if (isSubmitted) return;
    setUserPredictions((prev) => ({ ...prev, [currentChallenge.id]: optId }));
  };

  const handleSubmitPrediction = () => {
    if (!userOption) return;
    const updated = { ...submittedChallenges, [currentChallenge.id]: true };
    setSubmittedChallenges(updated);

    const isThisCorrect = userOption === correctOption?.id;
    addNotebookEntry(
      `Task ${currentChallenge.id} Prediction Submitted`,
      `User predicted option ${userOption.toUpperCase()}. Result: ${isThisCorrect ? 'CORRECT' : 'INCORRECT'}. ${currentChallenge.explanation}`,
      isThisCorrect ? 'Prediction Verified ✓' : 'Prediction Revised'
    );

    // If all challenges completed, offer completion certificate
    if (Object.keys(updated).length === OHMS_CHALLENGES.length) {
      setTimeout(() => setIsCompletionOpen(true), 1200);
    }
  };

  const handleApplyChallengePreset = () => {
    if (currentChallenge.targetVoltage !== undefined) {
      handleVoltageChange(currentChallenge.targetVoltage);
    }
    if (currentChallenge.targetResistance !== undefined) {
      handleResistanceChange(currentChallenge.targetResistance);
    }
    if (!isSwitchClosed) {
      setIsSwitchClosed(true);
    }
  };

  // Calculate score for completion
  const challengeScore = useMemo(() => {
    let correct = 0;
    OHMS_CHALLENGES.forEach((ch) => {
      const chosen = userPredictions[ch.id];
      const right = ch.options.find((o) => o.isCorrect)?.id;
      if (chosen === right) correct += 1;
    });
    return { correct, total: OHMS_CHALLENGES.length };
  }, [userPredictions]);

  const voltagePresets = [2, 5, 10, 15, 20];
  const resistancePresets = [5, 10, 20, 50, 100];

  // Current State for Comparator and Notebook
  const currentStateObject = {
    'Voltage (V)': `${voltage} V`,
    'Resistance (R)': `${resistance} Ω`,
    'Current (I)': `${current.toFixed(2)} A`,
    'Power (P)': `${powerWatts} W`,
    'Switch State': isSwitchClosed ? 'CLOSED (Conducting)' : 'OPEN',
    voltage,
    resistance,
    current,
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
      <OhmsTermModal activeTermKey={activeTermKey} onClose={() => setActiveTermKey(null)} />

      {/* Virtual Lab Notebook & Comparator Modal */}
      <LabNotebookModal
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        experimentTitle="Ohm's Law Electrical Circuit"
        records={notebookRecords}
        onClearRecords={() => setNotebookRecords([])}
        currentState={currentStateObject}
        comparisonType="ohms"
      />

      {/* Experiment Completion Report Modal */}
      <CompletionReportModal
        isOpen={isCompletionOpen}
        onClose={() => setIsCompletionOpen(false)}
        experimentTitle="Ohm's Law Mastery Certificate"
        principles={[
          'Ohm’s Law: Current is directly proportional to voltage and inversely proportional to resistance (I = V / R).',
          'Series Metering: Ammeters measure 100% of branch current with near-zero internal resistance.',
          'Parallel Metering: Voltmeters sample the potential drop across components with near-infinite resistance.',
          'Thermal Dissipation: Resistors convert electrical energy into Joule heat according to P = I²R = VI.',
        ]}
        formulas={['V = I × R', 'I = V / R', 'R = V / I', 'P = V × I = I²R']}
        measurementsCount={notebookRecords.length}
        score={challengeScore}
        realWorldApp="Regulated smartphone chargers and microprocessors dynamically adjust resistance and voltage rails to balance battery charging speed against heat dissipation."
        onRetry={() => {
          setSubmittedChallenges({});
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
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs shrink-0">
            <Zap className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Ohm&apos;s Law Virtual Electrical Laboratory
              </h2>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
                Electrical Circuit
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Governing Equation: <span className="font-mono font-bold text-blue-600">V = I × R</span> ⟺ Current:{' '}
              <span className="font-mono font-bold text-blue-600">I = V / R</span>
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
              title="Guided Mode: Step-by-step challenges and pedagogical instruction"
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
              title="Free Experiment Mode: Unrestricted exploration of voltage and resistance"
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
            title="Compare two experimental circuit readings"
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
            title="Reset circuit to default initial settings"
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
              Interactive Electrical Laboratory Circuit
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
              Mode: {experimentMode === 'guided' ? 'Guided Challenges' : 'Free Exploration'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Live Instrument Reading Badges */}
            <div className="hidden md:flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold">
                Ammeter: {current.toFixed(2)} A ({currentMilliamps} mA)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 font-bold">
                Voltmeter: {isSwitchClosed ? voltage.toFixed(1) : '0.0'} V
              </span>
            </div>

            {/* Direct Switch Toggle Button */}
            <button
              onClick={handleToggleSwitch}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                isSwitchClosed
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>Switch: {isSwitchClosed ? 'ON (Closed Loop)' : 'OFF (Open Circuit)'}</span>
            </button>
          </div>
        </div>

        {/* ENLARGED DOMINANT CIRCUIT BOARD */}
        <OhmsCircuitBoard
          voltage={voltage}
          resistance={resistance}
          isSwitchClosed={isSwitchClosed}
          setIsSwitchClosed={setIsSwitchClosed}
          current={current}
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
              explanation.type === 'voltage'
                ? 'bg-blue-50/90 border-blue-200 text-blue-950'
                : explanation.type === 'resistance'
                ? 'bg-amber-50/90 border-amber-200 text-amber-950'
                : explanation.type === 'switch'
                ? 'bg-purple-50/90 border-purple-200 text-purple-950'
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                explanation.type === 'voltage'
                  ? 'bg-blue-100 text-blue-700'
                  : explanation.type === 'resistance'
                  ? 'bg-amber-100 text-amber-700'
                  : explanation.type === 'switch'
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. VOLTAGE CONTROL (0 - 20V) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-800">1. DC Voltage Source (V):</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleVoltageChange(voltage - 1)}
                    disabled={voltage <= 0}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 font-mono text-xs font-bold flex items-center justify-center hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                  >
                    -1V
                  </button>
                  <div className="px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold min-w-[58px] text-center shadow-2xs">
                    {voltage} V
                  </div>
                  <button
                    onClick={() => handleVoltageChange(voltage + 1)}
                    disabled={voltage >= 20}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 font-mono text-xs font-bold flex items-center justify-center hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                  >
                    +1V
                  </button>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={voltage}
                onChange={(e) => handleVoltageChange(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-200 accent-blue-600 cursor-pointer appearance-none"
              />

              <div className="flex items-center justify-between flex-wrap gap-1.5 pt-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Presets:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {voltagePresets.map((vp) => (
                    <button
                      key={vp}
                      onClick={() => handleVoltageChange(vp)}
                      className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                        voltage === vp
                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {vp}V
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. RESISTANCE CONTROL (1 - 100Ω) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-800">2. Load Resistor (R):</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleResistanceChange(resistance - 1)}
                    disabled={resistance <= 1}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 font-mono text-xs font-bold flex items-center justify-center hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                  >
                    -1Ω
                  </button>
                  <div className="px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 font-mono text-xs font-bold min-w-[58px] text-center shadow-2xs">
                    {resistance} Ω
                  </div>
                  <button
                    onClick={() => handleResistanceChange(resistance + 1)}
                    disabled={resistance >= 100}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 font-mono text-xs font-bold flex items-center justify-center hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                  >
                    +1Ω
                  </button>
                </div>
              </div>

              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={resistance}
                onChange={(e) => handleResistanceChange(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-200 accent-amber-500 cursor-pointer appearance-none"
              />

              <div className="flex items-center justify-between flex-wrap gap-1.5 pt-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Presets:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {resistancePresets.map((rp) => (
                    <button
                      key={rp}
                      onClick={() => handleResistanceChange(rp)}
                      className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                        resistance === rp
                          ? 'bg-amber-600 text-white font-bold shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {rp}Ω
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: SUPPORTING WORKBENCH (Organized Below the Main Simulation) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* COLUMN 1: Live Interactive Graph (V vs I and R vs I) */}
        <div>
          <OhmsGraph
            voltage={voltage}
            resistance={resistance}
            current={current}
            isSwitchClosed={isSwitchClosed}
          />
        </div>

        {/* COLUMN 2: Guided Prediction Challenges OR Free Mode Analytical Tools */}
        {experimentMode === 'guided' ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Ohm&apos;s Law Challenges
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                {selectedChallengeIdx + 1} / {OHMS_CHALLENGES.length}
              </span>
            </div>

            {/* Challenge Step Selectors */}
            <div className="grid grid-cols-4 gap-1.5">
              {OHMS_CHALLENGES.map((ch, idx) => {
                const submitted = submittedChallenges[ch.id];
                const opt = userPredictions[ch.id];
                const corr = ch.options.find((o) => o.isCorrect)?.id;
                const passed = submitted && opt === corr;

                return (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChallengeIdx(idx)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      selectedChallengeIdx === idx
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : passed
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : submitted
                        ? 'bg-red-50 text-red-700 border-red-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Task {idx + 1} {passed ? '✓' : ''}
                  </button>
                );
              })}
            </div>

            {/* Active Challenge Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900">{currentChallenge.title}</h4>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {currentChallenge.scenario}
              </p>

              {/* Quick Auto-Configure Button */}
              {currentChallenge.targetVoltage !== undefined && (
                <button
                  onClick={handleApplyChallengePreset}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Configure Circuit for Challenge</span>
                </button>
              )}

              {/* Multiple Choice Options */}
              <div className="space-y-1.5 pt-1">
                {currentChallenge.options.map((opt) => {
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
                  Submit Prediction
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
                        <span>Correct Prediction!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span>Incorrect Prediction</span>
                      </>
                    )}
                  </div>
                  <p>{currentChallenge.explanation}</p>
                </div>
              )}
            </div>

            {/* View Completion Certificate Button */}
            {Object.keys(submittedChallenges).length > 0 && (
              <button
                onClick={() => setIsCompletionOpen(true)}
                className="w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>View Laboratory Certificate ({challengeScore.correct}/{challengeScore.total})</span>
              </button>
            )}
          </div>
        ) : (
          /* FREE EXPERIMENT MODE: Advanced Telemetry Workbench */
          <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Free Experimentation Bench
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Unrestricted Mode
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              In Free Mode, you can test any custom combinations of voltage ($0 - 20\text{V}$) and load resistance ($1 - 100\Omega$). All physical transitions are recorded in your Lab Notebook.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-800">Quick Observation Prompts:</span>
              <ul className="space-y-1.5 text-slate-600 text-[11px]">
                <li>• What happens to current if you double voltage while keeping resistance at 10Ω?</li>
                <li>• What happens to thermal heat dissipation (Watts) when current exceeds 2.0A?</li>
                <li>• Open the Lab Notebook to compare two specific trials with the mathematical comparator.</li>
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

        {/* COLUMN 3: Dr. Nova AI Lab Assistant & Scientific Definitions */}
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
                <p className="text-[10px] text-purple-700 font-semibold">AI Electrical Mentor</p>
              </div>
            </div>

            {/* Assistant Dynamic Speech */}
            <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200 text-xs text-slate-700 leading-relaxed space-y-2">
              {!isSwitchClosed ? (
                <p>
                  <strong>Circuit is Broken:</strong> Because the knife switch is open, charges cannot bridge the gap.
                  The electric potential difference ({voltage}V) exists across the battery terminals, but without a closed loop, current is strictly 0 A.
                </p>
              ) : current > 3.0 ? (
                <p>
                  <strong>High Current Flow:</strong> At {current.toFixed(2)} A, the resistor is dissipating{' '}
                  {powerWatts} W of power! Notice how the electron markers speed up along the cyan wire.
                </p>
              ) : voltage === 0 ? (
                <p>
                  <strong>Zero Voltage Source:</strong> Even though resistance is {resistance}Ω, with zero electric pressure (0V), no net charge motion occurs.
                </p>
              ) : (
                <p>
                  <strong>Ohmic Equilibrium:</strong> Your circuit satisfies <span className="font-mono font-bold">V = IR</span>. Try doubling the voltage or halving resistance in the center panel to see how current responds in real time!
                </p>
              )}

              <div className="pt-2 border-t border-purple-200/60 flex items-center justify-between text-[11px] text-purple-800">
                <span className="font-bold">Ratio V / I = R:</span>
                <span className="font-mono font-bold">
                  {current > 0 ? (voltage / current).toFixed(1) : '—'} Ω (Constant)
                </span>
              </div>
            </div>

            {/* Quick Scientific Terms Button */}
            <button
              onClick={() => setActiveTermKey('ohms-law')}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Browse Electrical Concept Glossary</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
