import { useState, useRef, useCallback, useMemo } from 'react';
import {
  BookOpen,
  Bot,
  Sliders,
  Compass,
  Maximize2,
  Minimize2,
  RotateCcw,
  BookMarked,
  GitCompare,
  Sparkles,
  Zap,
  Activity,
  ChevronRight,
  Award,
} from 'lucide-react';
import ReflectionSimulationCanvas from './ReflectionSimulationCanvas';
import ExperimentGuidePanel from './ExperimentGuidePanel';
import LabAssistantPanel from './LabAssistantPanel';
import TermExplanationModal from './TermExplanationModal';
import LabNotebookModal from '../common/LabNotebookModal';
import CompletionReportModal from '../common/CompletionReportModal';
import ResetConfirmationModal from '../common/ResetConfirmationModal';
import { REFLECTION_STEPS, REAL_WORLD_APPLICATIONS } from './reflectionData';

export default function ReflectionOfLightExperiment() {
  // Experiment Mode: 'guided' | 'free'
  const [experimentMode, setExperimentMode] = useState('guided');

  // Fullscreen / Focus Mode
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Optical parameters
  const [angle, setAngle] = useState(45);
  const [currentStep, setCurrentStep] = useState(1);
  const [laserPower, setLaserPower] = useState(true);
  const [preConceptAnswer, setPreConceptAnswer] = useState(null);
  const [predictionAnswer, setPredictionAnswer] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [mobileTab, setMobileTab] = useState('simulation'); // 'guide', 'simulation', 'assistant'
  const [isExpanded, setIsExpanded] = useState(false); // Expanded 3D view toggle

  // Modals state
  const [activeTermKey, setActiveTermKey] = useState(null);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Virtual Lab Notebook records
  const [notebookRecords, setNotebookRecords] = useState([
    {
      id: 1,
      time: 'Initial',
      title: '3D Optics Bench Initialized',
      detail: 'Plane mirror positioned at origin with normal line perpendicular at 90°. Laser incident at 45° with power ON.',
      resultValue: '∠i = 45°, ∠r = 45° (∠i = ∠r)',
    },
  ]);

  const prevAngleRef = useRef(45);
  const targetAngle = 55;
  const targetHit = Math.abs(angle - targetAngle) <= 1 && laserPower;

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

  // Handle angle change with differential telemetry and physical law logging
  const handleAngleChange = useCallback(
    (newAngle) => {
      const clampedAngle = Math.max(0, Math.min(85, Math.round(newAngle)));
      const prevAngle = prevAngleRef.current;
      if (clampedAngle === prevAngle) return;

      const delta = clampedAngle - prevAngle;
      const resultStr = `∠i = ${clampedAngle}°, ∠r = ${clampedAngle}°`;
      const sign = delta > 0 ? `+${delta}` : `${delta}`;

      let detail = '';
      if (clampedAngle === 0) {
        detail = `Incident angle adjusted to normal incidence (0°). The beam strikes perpendicular to the plane mirror and rebounds straight back along the normal line. ∠i = ∠r = 0°.`;
      } else if (clampedAngle === targetAngle) {
        detail = `Incident angle adjusted from ${prevAngle}° to 55° (${sign}°). By the First Law of Reflection (∠i = ∠r), the reflected ray deflects at 55°, hitting the optical sensor target bullseye!`;
      } else {
        detail = `Incident angle changed from ${prevAngle}° to ${clampedAngle}° (${sign}°). The First Law dictates that the reflected ray deflects by the exact same amount relative to the normal line: ∠r = ${clampedAngle}°.`;
      }

      addNotebookEntry(
        `Angle Adjusted: ${prevAngle}° ➔ ${clampedAngle}° (${sign}°)`,
        detail,
        resultStr
      );

      prevAngleRef.current = clampedAngle;
      setAngle(clampedAngle);
    },
    [addNotebookEntry, targetAngle]
  );

  // Handle laser power toggle
  const handleLaserPowerToggle = useCallback(
    (power) => {
      setLaserPower(power);
      addNotebookEntry(
        `Laser Source ${power ? 'Powered ON' : 'Powered OFF'}`,
        `Coherent 532nm laser diode emission ${power ? 'active and tracing optical vectors' : 'suspended'}.`,
        power ? 'Laser Active' : 'Standby'
      );
    },
    [addNotebookEntry]
  );

  // Handle pre-concept submission
  const handlePreConceptAnswer = useCallback(
    (ans) => {
      setPreConceptAnswer(ans);
      if (ans) {
        addNotebookEntry(
          'Pre-Concept Hypothesis Submitted',
          `Selected hypothesis: Option ${ans.toUpperCase()}. Light rebounds into the original medium following specular reflection (∠i = ∠r).`,
          'Hypothesis Recorded'
        );
      }
    },
    [addNotebookEntry]
  );

  // Handle prediction submission
  const handlePredictionAnswer = useCallback(
    (ans) => {
      setPredictionAnswer(ans);
      if (ans) {
        addNotebookEntry(
          'Prediction 1 Submitted',
          `Prediction: When the angle of incidence increases, the angle of reflection increases by the exact same amount to maintain ∠i = ∠r.`,
          'Prediction Verified ✓'
        );
      }
    },
    [addNotebookEntry]
  );

  // Handle quiz completion and calculate score
  const quizScore = useMemo(() => {
    const quizStep = REFLECTION_STEPS.find((s) => s.id === 8);
    if (!quizStep || !quizStep.quizQuestions) return { correct: 0, total: 3 };
    let correct = 0;
    quizStep.quizQuestions.forEach((q) => {
      const chosen = quizAnswers[q.id];
      const right = q.options.find((o) => o.isCorrect)?.id;
      if (chosen === right) correct += 1;
    });
    return { correct, total: quizStep.quizQuestions.length };
  }, [quizAnswers]);

  const handleQuizCompleted = useCallback(
    (completed) => {
      setQuizCompleted(completed);
      if (completed) {
        addNotebookEntry(
          'Optics Mastery Quiz Completed',
          `Student completed the 3-question assessment on the Laws of Reflection with score ${quizScore.correct}/${quizScore.total}.`,
          'Evaluation Completed'
        );
        setTimeout(() => setIsCompletionOpen(true), 1200);
      }
    },
    [addNotebookEntry, quizScore]
  );

  // Reset confirmation handling
  const handleRequestReset = () => {
    if (notebookRecords.length > 1 || quizCompleted || preConceptAnswer) {
      setIsResetConfirmOpen(true);
    } else {
      executeReset();
    }
  };

  const executeReset = () => {
    setAngle(45);
    prevAngleRef.current = 45;
    setCurrentStep(1);
    setLaserPower(true);
    setPreConceptAnswer(null);
    setPredictionAnswer(null);
    setQuizAnswers({});
    setQuizCompleted(false);
    setIsResetConfirmOpen(false);
    setNotebookRecords([
      {
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        title: '3D Optics Bench Re-calibrated',
        detail: 'Laser reset to 45°, normal at 90°, target reset, and instructions set to Step 1.',
        resultValue: '∠i = 45°, ∠r = 45°',
      },
    ]);
  };

  // Current State for Comparator and Notebook
  const currentStateObject = {
    'Angle of Incidence (∠i)': `${angle}°`,
    'Angle of Reflection (∠r)': `${angle}°`,
    'Deviation Angle (δ)': `${180 - 2 * angle}°`,
    'Laser Status': laserPower ? 'ACTIVE (ON)' : 'STANDBY (OFF)',
    'Target Sensor (55°)': targetHit ? 'SENSOR HIT (ALIGNED)' : 'NOT ALIGNED',
    'Law of Reflection': '∠i = ∠r (Strictly Valid)',
    angle,
  };

  const anglePresets = [0, 30, 45, 55, 60, 75];

  return (
    <div
      className={`w-full flex flex-col space-y-4 transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-50 overflow-y-auto p-4 sm:p-6 shadow-2xl'
          : 'relative'
      }`}
    >
      {/* Clickable Scientific Term Modal */}
      <TermExplanationModal
        activeTermKey={activeTermKey}
        onClose={() => setActiveTermKey(null)}
      />

      {/* Virtual Lab Notebook & Comparator Modal */}
      <LabNotebookModal
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        experimentTitle="Reflection of Light 3D Optics Lab"
        records={notebookRecords}
        onClearRecords={() => setNotebookRecords([])}
        currentState={currentStateObject}
        comparisonType="reflection"
      />

      {/* Experiment Completion Report Modal */}
      <CompletionReportModal
        isOpen={isCompletionOpen}
        onClose={() => setIsCompletionOpen(false)}
        experimentTitle="Optics & Light Reflection Mastery"
        principles={[
          'First Law of Reflection: The angle of incidence equals the angle of reflection (∠i = ∠r).',
          'Second Law of Reflection: The incident ray, reflected ray, and normal at the point of incidence all lie in the same geometric plane.',
          'Normal Reference: All reflection angles are measured relative to the perpendicular normal line (90° to the surface), never from the mirror face.',
          'Reversibility of Light: If the direction of a reflected ray is reversed, it retraces the exact path of the incident ray.',
        ]}
        formulas={['∠i = ∠r', 'θ_normal = 90° - θ_glance', 'θ_deviation = 180° - 2(∠i)', 'v_incident = v_reflected = c']}
        measurementsCount={notebookRecords.length}
        score={quizScore}
        realWorldApp="Fiber optic telecommunications rely on successive reflections along high-purity glass cores to guide multi-gigabit laser signals across oceans with virtually zero light leakage."
        onRetry={() => {
          setQuizAnswers({});
          setQuizCompleted(false);
          setCurrentStep(8);
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
            <Compass className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Reflection of Light 3D Virtual Optics Lab
              </h2>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                Geometrical Optics
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Fundamental Law:{' '}
              <span className="font-mono font-bold text-blue-600">∠i = ∠r</span> (Angle of Incidence = Angle of Reflection)
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
              title="Free Experiment Mode: Unrestricted exploration of incident angles and reflection physics"
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
            onClick={() => setIsNotebookOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Compare two experimental optical reflection angles"
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
            title="Reset optics bench to default initial settings"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* GUIDED MODE LAYOUT */}
      {experimentMode === 'guided' && (
        <div className="space-y-4">
          {/* Mobile / Tablet Tab Selector (< xl screens) */}
          <div className="flex xl:hidden items-center justify-between p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setMobileTab('guide')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mobileTab === 'guide'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Guide</span>
            </button>

            <button
              onClick={() => setMobileTab('simulation')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mobileTab === 'simulation'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>3D Simulation</span>
              {targetHit && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
            </button>

            <button
              onClick={() => setMobileTab('assistant')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mobileTab === 'assistant'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Assistant</span>
            </button>
          </div>

          {/* Main Grid: Left Guide (~260px), Center 3D Simulation (65–70%), Right Assistant (~290px) */}
          <div
            className={`grid grid-cols-1 ${
              isExpanded
                ? 'xl:grid-cols-1'
                : 'xl:grid-cols-[250px_minmax(0,1fr)_280px] 2xl:grid-cols-[265px_minmax(0,1fr)_295px]'
            } gap-4 items-stretch min-h-[700px] xl:h-[760px]`}
          >
            {/* LEFT PANEL: Experiment Guide */}
            <div
              className={`${
                mobileTab === 'guide' ? 'block' : isExpanded ? 'hidden' : 'hidden xl:block'
              } h-full min-h-[540px] xl:min-h-0`}
            >
              <ExperimentGuidePanel
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                targetHit={targetHit}
                quizCompleted={quizCompleted}
                onReset={handleRequestReset}
                onOpenGuide={() => setActiveTermKey('first-law')}
                onSelectTerm={(termKey) => setActiveTermKey(termKey)}
              />
            </div>

            {/* CENTRE PANEL: Interactive 3D Simulation Canvas (Dominant Hero Viewport) */}
            <div
              className={`${
                mobileTab === 'simulation' ? 'block' : 'hidden xl:block'
              } h-full min-h-[620px] xl:min-h-0`}
            >
              <ReflectionSimulationCanvas
                angle={angle}
                setAngle={handleAngleChange}
                targetAngle={targetAngle}
                targetHit={targetHit}
                laserPower={laserPower}
                setLaserPower={handleLaserPowerToggle}
                onResetExperiment={handleRequestReset}
                isExpanded={isExpanded}
                onToggleExpand={() => setIsExpanded(!isExpanded)}
              />
            </div>

            {/* RIGHT PANEL: Lab Assistant */}
            <div
              className={`${
                mobileTab === 'assistant' ? 'block' : isExpanded ? 'hidden' : 'hidden xl:block'
              } h-full min-h-[540px] xl:min-h-0`}
            >
              <LabAssistantPanel
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                angle={angle}
                laserPower={laserPower}
                targetHit={targetHit}
                preConceptAnswer={preConceptAnswer}
                setPreConceptAnswer={handlePreConceptAnswer}
                predictionAnswer={predictionAnswer}
                setPredictionAnswer={handlePredictionAnswer}
                quizAnswers={quizAnswers}
                setQuizAnswers={setQuizAnswers}
                quizCompleted={quizCompleted}
                setQuizCompleted={handleQuizCompleted}
                onReset={handleRequestReset}
                onOpenGuide={() => setActiveTermKey('first-law')}
                onSelectTerm={(termKey) => setActiveTermKey(termKey)}
              />
            </div>
          </div>
        </div>
      )}

      {/* FREE EXPERIMENT MODE LAYOUT (Simulation Dominates 100% + Lower Workbench) */}
      {experimentMode === 'free' && (
        <div className="space-y-4">
          {/* Hero 3D Simulation Viewport */}
          <div className="h-[600px] sm:h-[680px]">
            <ReflectionSimulationCanvas
              angle={angle}
              setAngle={handleAngleChange}
              targetAngle={targetAngle}
              targetHit={targetHit}
              laserPower={laserPower}
              setLaserPower={handleLaserPowerToggle}
              onResetExperiment={handleRequestReset}
              isExpanded={true}
              onToggleExpand={() => setExperimentMode('guided')}
            />
          </div>

          {/* LOWER OPTICS WORKBENCH (3 Columns: Direct Calibration, Live Law Verification, Real-World Applications) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* COLUMN 1: Direct Angle Calibration & Quick Presets */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  Angle Calibration
                </span>
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  ∠i = {angle}°
                </span>
              </div>

              {/* Angle Slider with Fine Nudge Controls */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Incident Angle (from normal)</span>
                  <span className="font-mono font-semibold">{angle}°</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAngleChange(Math.max(0, angle - 1))}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm cursor-pointer"
                    title="Nudge -1°"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="85"
                    step="1"
                    value={angle}
                    onChange={(e) => handleAngleChange(Number(e.target.value))}
                    className="flex-1 accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <button
                    onClick={() => handleAngleChange(Math.min(85, angle + 1))}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm cursor-pointer"
                    title="Nudge +1°"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Optical Presets:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {anglePresets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleAngleChange(preset)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        angle === preset
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {preset === 0
                        ? '0° Normal'
                        : preset === 45
                        ? '45° 90° Turn'
                        : preset === 55
                        ? '55° Target 🎯'
                        : preset === 75
                        ? '75° Grazing'
                        : `${preset}°`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Laser Power & Fast Navigation */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleLaserPowerToggle(!laserPower)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    laserPower
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{laserPower ? 'Laser Diode Active' : 'Laser Diode Inactive'}</span>
                </button>

                <button
                  onClick={() => setIsNotebookOpen(true)}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
                >
                  <span>Open Notebook</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* COLUMN 2: Live Law Verification & Optical Telemetry */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  Law of Reflection Telemetry
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Strictly Verified ✓
                </span>
              </div>

              {/* Telemetry Metric Cards */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <span className="text-[10px] text-blue-700 font-bold uppercase block">Incident Angle (∠i)</span>
                  <p className="font-mono font-extrabold text-blue-800 text-lg mt-0.5">{angle}°</p>
                  <span className="text-[10px] text-slate-500">From Normal Line</span>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                  <span className="text-[10px] text-purple-700 font-bold uppercase block">Reflected Angle (∠r)</span>
                  <p className="font-mono font-extrabold text-purple-800 text-lg mt-0.5">{angle}°</p>
                  <span className="text-[10px] text-slate-500">From Normal Line</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-600 font-bold uppercase block">Total Beam Deviation</span>
                  <p className="font-mono font-bold text-slate-800 text-sm mt-0.5">{180 - 2 * angle}°</p>
                  <span className="text-[10px] text-slate-500">δ = 180° - 2i</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-600 font-bold uppercase block">Target Status</span>
                  <p className="font-mono font-bold text-slate-800 text-sm mt-0.5">
                    {targetHit ? 'TARGET HIT 🎯' : 'Target at 55°'}
                  </p>
                  <span className="text-[10px] text-slate-500">{targetHit ? 'Bullseye aligned' : 'Not aligned'}</span>
                </div>
              </div>

              {/* Explanatory Scientific Principle */}
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-slate-700 leading-relaxed space-y-1">
                <strong className="text-emerald-800 block">First & Second Laws of Reflection:</strong>
                <p>
                  1. The angle of incidence equals the angle of reflection: <span className="font-mono font-bold">∠i = ∠r = {angle}°</span>.
                </p>
                <p>
                  2. Incident beam, normal vector, and reflected ray are completely coplanar in 3D Euclidean space.
                </p>
              </div>
            </div>

            {/* COLUMN 3: Real-World Applications & Scientific Terms */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Engineering Applications
                </span>
                <span className="text-[11px] font-bold text-slate-500">Optical Systems</span>
              </div>

              {/* Applications List */}
              <div className="space-y-2">
                {REAL_WORLD_APPLICATIONS.slice(0, 3).map((app, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-800 block">{app.title}</span>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{app.desc}</p>
                  </div>
                ))}
              </div>

              {/* Switch back to guided or open certificate */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveTermKey('first-law')}
                  className="text-xs text-slate-600 hover:text-blue-600 font-semibold cursor-pointer"
                >
                  Glossary Terms →
                </button>

                <button
                  onClick={() => setIsCompletionOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Mastery Certificate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
