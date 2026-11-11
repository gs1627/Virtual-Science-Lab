import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FlaskConical,
  RotateCcw,
  Maximize2,
  Minimize2,
  BookMarked,
  Sparkles,
  Droplets,
} from 'lucide-react';
import { SOLUTIONS_DATA } from './acidsBasesData';
import AcidsBasesTestingBench from './AcidsBasesTestingBench';
import AcidsBasesSortingChallenge from './AcidsBasesSortingChallenge';
import LabNotebookModal from '../common/LabNotebookModal';
import ResetConfirmationModal from '../common/ResetConfirmationModal';

export default function AcidsBasesExperiment() {
  // Experiment Fullscreen State
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active solution in test tube
  const [currentSolution, setCurrentSolution] = useState(SOLUTIONS_DATA[0]); // Lemon juice default
  const [isFilled, setIsFilled] = useState(true);
  const [indicatorAdded, setIndicatorAdded] = useState(false);
  const [activeLitmus, setActiveLitmus] = useState(null); // 'red' | 'blue' | null
  const [isDroppingIndicator, setIsDroppingIndicator] = useState(false);

  // Drag and drop state
  const [draggingItem, setDraggingItem] = useState(null); // { type, id, data }
  const [isDragOverBench, setIsDragOverBench] = useState(false);

  // Click-to-Select and Click-to-Place alternative
  const [selectedItem, setSelectedItem] = useState(null);

  // Sorting Challenge State
  const [classifiedItems, setClassifiedItems] = useState({
    acidic: [],
    neutral: [],
    basic: [],
  });
  const [feedbackAlert, setFeedbackAlert] = useState(null);

  // Modals state
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Virtual Lab Notebook records
  const [notebookRecords, setNotebookRecords] = useState([
    {
      id: 1,
      time: 'Initial',
      title: 'Acids & Bases Testing Bench Ready',
      detail: '7 reagent solutions loaded into lab rack. Universal indicator dropper and litmus paper strips calibrated.',
      resultValue: 'pH Scale 0–14 Initialized',
    },
  ]);

  // Helper to add notebook records
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

  // Set transient feedback banner
  const triggerFeedback = useCallback((type, title, message) => {
    setFeedbackAlert({ type, title, message });
  }, []);

  // 1. Pour a solution into the test tube
  const handlePourSolution = useCallback(
    (solution) => {
      setCurrentSolution(solution);
      setIsFilled(true);
      setIndicatorAdded(false);
      setActiveLitmus(null);
      setSelectedItem(null);
      setDraggingItem(null);

      triggerFeedback(
        'success',
        `Poured ${solution.name} into Test Tube`,
        `Liquid filled. Natural appearance: ${solution.categoryName}. Now drag the Universal Indicator Dropper or Litmus Paper onto the tube to test it.`
      );

      addNotebookEntry(
        `Filled Test Tube: ${solution.name}`,
        `Sample of ${solution.name} (${solution.formula}) poured into testing tube. Initial appearance noted.`,
        `Ready for testing`
      );
    },
    [addNotebookEntry, triggerFeedback]
  );

  // 2. Add Universal Indicator with Dropper
  const handleAddIndicator = useCallback(() => {
    if (!isFilled) {
      triggerFeedback(
        'error',
        'Test Tube is Empty',
        'Please drag a solution bottle into the test tube station before adding indicator drops!'
      );
      setSelectedItem(null);
      return;
    }

    setIsDroppingIndicator(true);
    setSelectedItem(null);
    setDraggingItem(null);

    setTimeout(() => {
      setIsDroppingIndicator(false);
      setIndicatorAdded(true);

      triggerFeedback(
        'success',
        `Universal Indicator Added to ${currentSolution.name}`,
        `Solution turned ${currentSolution.universalColorName} (pH ${currentSolution.ph.toFixed(1)}). ${currentSolution.explanation}`
      );

      addNotebookEntry(
        `Universal Indicator Test: ${currentSolution.name}`,
        `Indicator added. Color turned ${currentSolution.universalColorName}. pH measured at ${currentSolution.ph}. ${currentSolution.hIonRatio}.`,
        `pH ${currentSolution.ph} (${currentSolution.categoryName})`
      );
    }, 600);
  }, [isFilled, currentSolution, addNotebookEntry, triggerFeedback]);

  // 3. Dip Red or Blue Litmus Paper
  const handleDipLitmus = useCallback(
    (litmusType) => {
      if (!isFilled) {
        triggerFeedback(
          'error',
          'Test Tube is Empty',
          'Please drag a solution bottle into the test tube station before dipping litmus paper!'
        );
        setSelectedItem(null);
        return;
      }

      setActiveLitmus(litmusType);
      setSelectedItem(null);
      setDraggingItem(null);

      const isRed = litmusType === 'red';
      const resultColor = isRed ? currentSolution.redLitmusResult : currentSolution.blueLitmusResult;
      const didChange = isRed ? resultColor === 'blue' : resultColor === 'red';

      let explanationText = '';
      if (didChange) {
        if (isRed && resultColor === 'blue') {
          explanationText = `Red litmus turned BLUE! This confirms an alkaline/basic solution (pH > 7) with excess hydroxide (OH⁻) ions.`;
        } else {
          explanationText = `Blue litmus turned RED! This confirms an acidic solution (pH < 7) with excess hydrogen (H⁺) ions.`;
        }
      } else {
        explanationText = `${isRed ? 'Red' : 'Blue'} litmus remained ${isRed ? 'RED' : 'BLUE'}. Litmus paper only changes color in the presence of opposite chemical ions.`;
      }

      triggerFeedback(
        'success',
        `${isRed ? 'Red' : 'Blue'} Litmus Dipped in ${currentSolution.name}`,
        explanationText
      );

      addNotebookEntry(
        `${isRed ? 'Red' : 'Blue'} Litmus Test: ${currentSolution.name}`,
        `Submerged strip: result was ${resultColor.toUpperCase()}. ${explanationText}`,
        `Litmus: ${resultColor.toUpperCase()}`
      );
    },
    [isFilled, currentSolution, addNotebookEntry, triggerFeedback]
  );

  // 4. Drop target handler on the central testing bench
  const handleBenchDrop = useCallback(() => {
    const item = draggingItem || selectedItem;
    if (!item) return;

    if (item.type === 'bottle') {
      handlePourSolution(item.data);
    } else if (item.type === 'dropper') {
      handleAddIndicator();
    } else if (item.type === 'litmus-red') {
      handleDipLitmus('red');
    } else if (item.type === 'litmus-blue') {
      handleDipLitmus('blue');
    } else if (item.type === 'test-tube') {
      setIsFilled(false);
      setIndicatorAdded(false);
      setActiveLitmus(null);
      setSelectedItem(null);
      triggerFeedback('success', 'Cleaned Test Tube', 'Fresh empty test tube placed on the testing clamp.');
    }

    setDraggingItem(null);
    setIsDragOverBench(false);
  }, [draggingItem, selectedItem, handlePourSolution, handleAddIndicator, handleDipLitmus, triggerFeedback]);

  // 5. Drop into a classification bucket (Acidic / Neutral / Basic)
  const handleDropIntoCategory = useCallback(
    (targetCategoryId) => {
      const item = draggingItem || selectedItem;
      if (!item || item.type !== 'bottle') {
        triggerFeedback('error', 'Select a Solution First', 'Please drag or select a solution bottle to categorize it.');
        return;
      }

      const solution = item.data;
      const isCorrect = solution.category === targetCategoryId;

      if (isCorrect) {
        const alreadyClassified = classifiedItems[targetCategoryId].some((s) => s.id === solution.id);
        if (!alreadyClassified) {
          setClassifiedItems((prev) => ({
            ...prev,
            [targetCategoryId]: [...prev[targetCategoryId], solution],
          }));
        }

        triggerFeedback(
          'success',
          `Correct! ${solution.name} is ${solution.categoryName}`,
          `pH is ${solution.ph}. ${solution.explanation}`
        );

        addNotebookEntry(
          `Classification Verified: ${solution.name}`,
          `Categorized into ${solution.categoryName} category. Verified via pH ${solution.ph} and litmus reactions.`,
          `Correct ✓`
        );
      } else {
        let reason = '';
        if (solution.category === 'acidic') {
          reason = `${solution.name} has a pH of ${solution.ph} (< 7), meaning it has high [H⁺] ions. It is ACIDIC, not ${targetCategoryId}. Acids turn blue litmus red!`;
        } else if (solution.category === 'neutral') {
          reason = `${solution.name} has a pH of 7.0, meaning [H⁺] and [OH⁻] are strictly balanced. It is NEUTRAL, not ${targetCategoryId}.`;
        } else {
          reason = `${solution.name} has a pH of ${solution.ph} (> 7), meaning it has excess [OH⁻] hydroxide ions. It is BASIC (alkaline), not ${targetCategoryId}. Alkalis turn red litmus blue!`;
        }

        triggerFeedback('error', `Incorrect Category for ${solution.name}`, reason);

        addNotebookEntry(
          `Classification Attempt: ${solution.name}`,
          `Mistakenly placed into ${targetCategoryId}. ${reason}`,
          `Incorrect ✗`
        );
      }

      setDraggingItem(null);
      setSelectedItem(null);
    },
    [draggingItem, selectedItem, classifiedItems, addNotebookEntry, triggerFeedback]
  );

  // Clean the test tube
  const handleCleanTube = () => {
    setIsFilled(false);
    setIndicatorAdded(false);
    setActiveLitmus(null);
    triggerFeedback('success', 'Clean Tube', 'Emptied and rinsed the test tube with distilled water.');
  };

  // Full reset execution
  const executeReset = () => {
    setCurrentSolution(SOLUTIONS_DATA[0]);
    setIsFilled(true);
    setIndicatorAdded(false);
    setActiveLitmus(null);
    setSelectedItem(null);
    setDraggingItem(null);
    setClassifiedItems({ acidic: [], neutral: [], basic: [] });
    setFeedbackAlert(null);
    setIsResetConfirmOpen(false);
    setNotebookRecords([
      {
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        title: 'Laboratory Bench Reset',
        detail: 'Rinsed all apparatus, reset classification challenge bins, and loaded lemon juice.',
        resultValue: 'Bench Calibrated',
      },
    ]);
  };

  const handleRequestReset = () => {
    if (notebookRecords.length > 2 || classifiedItems.acidic.length > 0) {
      setIsResetConfirmOpen(true);
    } else {
      executeReset();
    }
  };

  const currentStateObject = {
    'Current Solution': currentSolution.name,
    'Chemical Formula': currentSolution.formula,
    'pH Value': `${currentSolution.ph.toFixed(1)}`,
    'Acidity Category': currentSolution.categoryName,
    'Universal Indicator': indicatorAdded ? `${currentSolution.universalColorName} (Added)` : 'Not Added',
    'Litmus Tested': activeLitmus ? `${activeLitmus.toUpperCase()} litmus dipped` : 'None',
    'Categorized Count': `${classifiedItems.acidic.length + classifiedItems.neutral.length + classifiedItems.basic.length} / 7`,
  };

  return (
    <div
      className={`w-full flex flex-col space-y-4 transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-50 overflow-y-auto p-4 sm:p-6 shadow-2xl'
          : 'relative'
      }`}
    >
      {/* Virtual Lab Notebook Modal */}
      <LabNotebookModal
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        experimentTitle="Acids, Bases & Indicators Lab Notebook"
        records={notebookRecords}
        onClearRecords={() => setNotebookRecords([])}
        currentState={currentStateObject}
      />

      {/* Reset Confirmation Modal */}
      <ResetConfirmationModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={executeReset}
        recordsCount={notebookRecords.length}
      />

      {/* TOP COMPACT HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shadow-2xs shrink-0">
            <FlaskConical className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Acids, Bases &amp; pH Indicator Testing Lab
              </h2>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 uppercase tracking-wider">
                Analytical Chemistry
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Interactive laboratory testing bench with live Universal pH spectrophotometry and litmus indicators.
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Virtual Lab Notebook */}
          <button
            onClick={() => setIsNotebookOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Open Virtual Lab Notebook"
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>Notebook ({notebookRecords.length})</span>
          </button>

          {/* Clean Tube */}
          <button
            onClick={handleCleanTube}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            title="Empty and rinse test tube"
          >
            <Droplets className="w-3.5 h-3.5 text-blue-600" />
            <span>Clean Tube</span>
          </button>

          {/* Fullscreen Focus Mode */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Immersive Fullscreen Focus Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-purple-600" /> : <Maximize2 className="w-3.5 h-3.5 text-purple-600" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit Focus' : 'Focus Mode'}</span>
          </button>

          {/* Reset Bench */}
          <button
            onClick={handleRequestReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            title="Reset bench to initial state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Bench</span>
          </button>
        </div>
      </div>

      {/* REAGENT RACK & EQUIPMENT TRAY (Sleek Laboratory Glassware Shelf) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Analytical Reagents &amp; Testing Implements
          </span>
          <span className="text-[11px] text-slate-500">
            {selectedItem
              ? `Selected: ${selectedItem.name} — Click the Test Tube or Category Tray to apply`
              : 'Drag any item or click to select, then drop on the testing station'}
          </span>
        </div>

        {/* Grid of Reagent Bottles & Testing Implements */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-11 gap-2.5">
          {/* 1. Solution Bottles (7 items) */}
          {SOLUTIONS_DATA.map((sol) => {
            const isSelected = selectedItem?.type === 'bottle' && selectedItem?.id === sol.id;
            return (
              <motion.div
                key={sol.id}
                draggable
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onDragStart={(e) => {
                  setDraggingItem({ type: 'bottle', id: sol.id, data: sol, name: sol.name });
                  e.dataTransfer.setData('text/plain', sol.id);
                  e.dataTransfer.effectAllowed = 'copyMove';
                }}
                onDragEnd={() => setDraggingItem(null)}
                onClick={() => {
                  if (isSelected) {
                    setSelectedItem(null);
                  } else {
                    setSelectedItem({ type: 'bottle', id: sol.id, data: sol, name: sol.name });
                  }
                }}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-between text-center transition-all cursor-grab active:cursor-grabbing select-none shadow-2xs ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50/80 ring-2 ring-purple-200 shadow-sm'
                    : 'border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/90 text-slate-800'
                }`}
                title={`Drag ${sol.name} (${sol.formula}) to test tube or category tray`}
              >
                {/* Vector Glass Reagent Bottle with Label & Seal */}
                <svg viewBox="0 0 44 54" className="w-9 h-11 mb-1">
                  {/* Glass bottle outer shadow */}
                  <rect x="7" y="16" width="30" height="34" rx="4" fill="rgba(0,0,0,0.06)" />
                  {/* Bottle Cap */}
                  <rect x="15" y="2" width="14" height="7" rx="2" fill="#334155" stroke="#1e293b" strokeWidth="1" />
                  <line x1="18" y1="4" x2="18" y2="7" stroke="#64748b" strokeWidth="1" />
                  <line x1="22" y1="4" x2="22" y2="7" stroke="#64748b" strokeWidth="1" />
                  <line x1="26" y1="4" x2="26" y2="7" stroke="#64748b" strokeWidth="1" />
                  {/* Bottle Neck */}
                  <rect x="17" y="9" width="10" height="7" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
                  {/* Glass Bottle Body */}
                  <rect x="7" y="16" width="30" height="34" rx="4" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.2" />
                  {/* Colored Liquid Fill */}
                  <rect x="9" y="26" width="26" height="22" rx="2" fill={sol.bottleColor} opacity="0.8" />
                  {/* Analytical Label */}
                  <rect x="10" y="20" width="24" height="12" rx="1.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
                  <text x="22" y="26" fill="#1e293b" fontSize="5" fontWeight="bold" textAnchor="middle">
                    {sol.name.split(' ')[0].toUpperCase()}
                  </text>
                  <text x="22" y="30" fill="#64748b" fontSize="4" font-mono="true" textAnchor="middle">
                    pH {sol.ph}
                  </text>
                  {/* Glass specular luster glare */}
                  <line x1="10" y1="18" x2="10" y2="47" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.6" strokeLinecap="round" />
                </svg>

                <span className="text-[11px] font-bold text-slate-800 line-clamp-1 leading-tight">{sol.name.split(' ')[0]}</span>
                <span className="text-[9px] font-mono text-slate-500">pH {sol.ph}</span>
              </motion.div>
            );
          })}

          {/* 2. Universal Indicator Dropper */}
          {(() => {
            const isSelected = selectedItem?.type === 'dropper';
            return (
              <motion.div
                draggable
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onDragStart={(e) => {
                  setDraggingItem({ type: 'dropper', id: 'dropper', name: 'Universal Indicator Dropper' });
                  e.dataTransfer.setData('text/plain', 'dropper');
                }}
                onDragEnd={() => setDraggingItem(null)}
                onClick={() => {
                  setSelectedItem(isSelected ? null : { type: 'dropper', id: 'dropper', name: 'Universal Indicator Dropper' });
                }}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-between text-center transition-all cursor-grab active:cursor-grabbing select-none shadow-2xs ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200 shadow-sm'
                    : 'border-purple-200 bg-purple-50/50 hover:bg-purple-100/70 text-purple-950'
                }`}
                title="Drag onto the Test Tube to add universal indicator drops"
              >
                <svg viewBox="0 0 34 54" className="w-8 h-11 mb-1">
                  <path d="M 11,14 C 11,5 23,5 23,14 Z" fill="#dc2626" stroke="#b91c1c" strokeWidth="1" />
                  <rect x="14" y="14" width="6" height="24" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                  <rect x="15.5" y="22" width="3" height="16" fill="#10b981" />
                  <polygon points="14,38 20,38 18,48 16,48" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
                </svg>
                <span className="text-[11px] font-bold leading-tight text-purple-900">Universal</span>
                <span className="text-[9px] text-purple-700 font-semibold">Dropper</span>
              </motion.div>
            );
          })()}

          {/* 3. Red Litmus Paper Strip */}
          {(() => {
            const isSelected = selectedItem?.type === 'litmus-red';
            return (
              <motion.div
                draggable
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onDragStart={(e) => {
                  setDraggingItem({ type: 'litmus-red', id: 'litmus-red', name: 'Red Litmus Strip' });
                  e.dataTransfer.setData('text/plain', 'litmus-red');
                }}
                onDragEnd={() => setDraggingItem(null)}
                onClick={() => {
                  setSelectedItem(isSelected ? null : { type: 'litmus-red', id: 'litmus-red', name: 'Red Litmus Strip' });
                }}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-between text-center transition-all cursor-grab active:cursor-grabbing select-none shadow-2xs ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-200 shadow-sm'
                    : 'border-rose-200 bg-rose-50/50 hover:bg-rose-100/70 text-rose-950'
                }`}
                title="Drag onto the Test Tube to dip Red Litmus Paper"
              >
                <svg viewBox="0 0 26 54" className="w-6 h-11 mb-1">
                  <rect x="4" y="4" width="18" height="46" rx="2" fill="#ef4444" stroke="#dc2626" strokeWidth="1" />
                  <line x1="8" y1="14" x2="18" y2="14" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.7" />
                  <line x1="8" y1="22" x2="18" y2="22" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.7" />
                  <line x1="8" y1="30" x2="18" y2="30" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.7" />
                </svg>
                <span className="text-[11px] font-bold leading-tight text-rose-900">Red Litmus</span>
                <span className="text-[9px] text-rose-700 font-semibold">Turns Blue</span>
              </motion.div>
            );
          })()}

          {/* 4. Blue Litmus Paper Strip */}
          {(() => {
            const isSelected = selectedItem?.type === 'litmus-blue';
            return (
              <motion.div
                draggable
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onDragStart={(e) => {
                  setDraggingItem({ type: 'litmus-blue', id: 'litmus-blue', name: 'Blue Litmus Strip' });
                  e.dataTransfer.setData('text/plain', 'litmus-blue');
                }}
                onDragEnd={() => setDraggingItem(null)}
                onClick={() => {
                  setSelectedItem(isSelected ? null : { type: 'litmus-blue', id: 'litmus-blue', name: 'Blue Litmus Strip' });
                }}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-between text-center transition-all cursor-grab active:cursor-grabbing select-none shadow-2xs ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200 shadow-sm'
                    : 'border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 text-blue-950'
                }`}
                title="Drag onto the Test Tube to dip Blue Litmus Paper"
              >
                <svg viewBox="0 0 26 54" className="w-6 h-11 mb-1">
                  <rect x="4" y="4" width="18" height="46" rx="2" fill="#3b82f6" stroke="#2563eb" strokeWidth="1" />
                  <line x1="8" y1="14" x2="18" y2="14" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.7" />
                  <line x1="8" y1="22" x2="18" y2="22" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.7" />
                  <line x1="8" y1="30" x2="18" y2="30" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.7" />
                </svg>
                <span className="text-[11px] font-bold leading-tight text-blue-900">Blue Litmus</span>
                <span className="text-[9px] text-blue-700 font-semibold">Turns Red</span>
              </motion.div>
            );
          })()}

          {/* 5. Clean Empty Test Tube */}
          {(() => {
            const isSelected = selectedItem?.type === 'test-tube';
            return (
              <motion.div
                draggable
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onDragStart={(e) => {
                  setDraggingItem({ type: 'test-tube', id: 'test-tube', name: 'Empty Test Tube' });
                  e.dataTransfer.setData('text/plain', 'test-tube');
                }}
                onDragEnd={() => setDraggingItem(null)}
                onClick={() => {
                  setSelectedItem(isSelected ? null : { type: 'test-tube', id: 'test-tube', name: 'Empty Test Tube' });
                }}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-between text-center transition-all cursor-grab active:cursor-grabbing select-none shadow-2xs ${
                  isSelected
                    ? 'border-slate-400 bg-slate-100 ring-2 ring-slate-200 shadow-sm'
                    : 'border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/90 text-slate-800'
                }`}
                title="Drag onto testing station to reset with an empty clean test tube"
              >
                <svg viewBox="0 0 26 54" className="w-6 h-11 mb-1">
                  <path d="M 5,8 L 21,8 L 21,40 Q 21,48 13,48 Q 5,48 5,40 Z" fill="none" stroke="#94a3b8" strokeWidth="2" />
                  <line x1="3" y1="8" x2="23" y2="8" stroke="#64748b" strokeWidth="2" />
                </svg>
                <span className="text-[11px] font-bold leading-tight">Clean Tube</span>
                <span className="text-[9px] text-slate-500 font-semibold">Fresh Rack</span>
              </motion.div>
            );
          })()}
        </div>
      </div>

      {/* CENTERPIECE: HERO ANALYTICAL TESTING BENCH (Takes 65–75% of Focus) */}
      <AcidsBasesTestingBench
        currentSolution={currentSolution}
        isFilled={isFilled}
        indicatorAdded={indicatorAdded}
        activeLitmus={activeLitmus}
        isDroppingIndicator={isDroppingIndicator}
        onDropTarget={handleBenchDrop}
        isDragOver={isDragOverBench}
        draggingItem={draggingItem}
        selectedItem={selectedItem}
        onSelectStation={handleBenchDrop}
      />

      {/* LOWER ANALYTICAL WORKBENCH: SORTING CHALLENGE & SYSTEMATIC CLASSIFICATION */}
      <AcidsBasesSortingChallenge
        classifiedItems={classifiedItems}
        onDropIntoCategory={handleDropIntoCategory}
        onResetSorting={() => setClassifiedItems({ acidic: [], neutral: [], basic: [] })}
        draggingItem={draggingItem}
        selectedItem={selectedItem}
        feedbackAlert={feedbackAlert}
        onDismissFeedback={() => setFeedbackAlert(null)}
        totalSolutions={SOLUTIONS_DATA.length}
      />
    </div>
  );
}
