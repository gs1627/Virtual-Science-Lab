import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Gauge,
  Play,
  Pause,
  RotateCcw,
  Activity,
  Flame,
  Maximize2,
  Minimize2,
  BookMarked,
  Sparkles,
  Zap,
  Thermometer,
} from 'lucide-react';
import {
  INITIAL_VESSEL_STATE,
  INVESTIGATION_PRESETS,
  calculateRateMultiplier,
} from './reactionRateData';
import ReactionVesselStation from './ReactionVesselStation';
import ParticleCollisionViewer from './ParticleCollisionViewer';
import ReactionRateComparison from './ReactionRateComparison';
import LabNotebookModal from '../common/LabNotebookModal';
import ResetConfirmationModal from '../common/ResetConfirmationModal';

export default function ReactionRateExperiment() {
  // Experiment Fullscreen State
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reaction Vessels State (Flask A and Flask B)
  const [vesselA, setVesselA] = useState({ ...INITIAL_VESSEL_STATE });
  const [vesselB, setVesselB] = useState({
    ...INITIAL_VESSEL_STATE,
    temperature: 45, // Default comparison: Vessel B heated to 45°C
    surfaceArea: 'powder', // Powdered CaCO3
  });

  // Selected Active Investigation Preset
  const [activePresetId, setActivePresetId] = useState('temp');

  // Active Microscopic Particle Viewer Vessel ('A' or 'B')
  const [particleVesselId, setParticleVesselId] = useState('A');

  // Drag and drop state
  const [draggingItem, setDraggingItem] = useState(null); // { type, name, data }
  const [selectedItem, setSelectedItem] = useState(null); // Click-to-select alternative

  // Modals state
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Virtual Lab Notebook records
  const [notebookRecords, setNotebookRecords] = useState([
    {
      id: 1,
      time: 'Initial',
      title: 'Reaction Kinetics Lab Initialized',
      detail: 'Dual-vessel testing station configured. Flask A calibrated at 20°C (1.0M HCl, Lumps); Flask B calibrated at 45°C (1.0M HCl, Powder).',
      resultValue: 'Dual Vessels Ready',
    },
  ]);

  // Helper to append notebook entry
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

  // Update state of Vessel A or B
  const handleUpdateVessel = useCallback(
    (vesselId, updates) => {
      if (vesselId === 'A') {
        setVesselA((prev) => ({ ...prev, ...updates }));
      } else {
        setVesselB((prev) => ({ ...prev, ...updates }));
      }
    },
    []
  );

  // Start a specific vessel reaction
  const handleStartVessel = useCallback(
    (vesselId) => {
      handleUpdateVessel(vesselId, { isRunning: true });
      addNotebookEntry(
        `Reaction Started in Flask ${vesselId}`,
        `Effervescence initialized. Calcium carbonate reacting with HCl to produce CO₂ gas collected in the syringe.`,
        `Reaction Running`
      );
    },
    [handleUpdateVessel, addNotebookEntry]
  );

  // Pause a specific vessel reaction
  const handlePauseVessel = useCallback(
    (vesselId) => {
      handleUpdateVessel(vesselId, { isRunning: false });
    },
    [handleUpdateVessel]
  );

  // Reset a specific vessel
  const handleResetVessel = useCallback(
    (vesselId) => {
      handleUpdateVessel(vesselId, {
        gasVolume: 0,
        elapsedTime: 0,
        isRunning: false,
        isCompleted: false,
      });
      addNotebookEntry(`Reset Flask ${vesselId}`, `Cleared syringe and reset elapsed timer to 0.0s.`, `Reset`);
    },
    [handleUpdateVessel, addNotebookEntry]
  );

  // Start both reactions simultaneously
  const handleStartBoth = () => {
    setVesselA((prev) => ({ ...prev, isRunning: true }));
    setVesselB((prev) => ({ ...prev, isRunning: true }));
    addNotebookEntry(
      'Simultaneous Dual Reaction Started',
      `Flask A (${vesselA.temperature}°C, ${vesselA.concentration}M, ${vesselA.surfaceArea}) vs Flask B (${vesselB.temperature}°C, ${vesselB.concentration}M, ${vesselB.surfaceArea}) initiated in parallel.`,
      `Dual Run`
    );
  };

  // Pause both reactions
  const handlePauseBoth = () => {
    setVesselA((prev) => ({ ...prev, isRunning: false }));
    setVesselB((prev) => ({ ...prev, isRunning: false }));
  };

  // Reset both reactions
  const handleResetBoth = () => {
    handleResetVessel('A');
    handleResetVessel('B');
  };

  // Animation Loop for kinetics time integration
  const animRef = useRef();

  useEffect(() => {
    const isAnyRunning = vesselA.isRunning || vesselB.isRunning;
    if (!isAnyRunning) {
      cancelAnimationFrame(animRef.current);
      return;
    }

    let lastTime = performance.now();

    const loop = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Update Vessel A if running
      if (vesselA.isRunning && !vesselA.isCompleted) {
        setVesselA((prev) => {
          const nextT = prev.elapsedTime + dt;
          const k = calculateRateMultiplier(prev) / 16;
          const currentV = Math.min(100, 100 * (1 - Math.exp(-k * nextT)));
          const completed = currentV >= 99.5;
          return {
            ...prev,
            elapsedTime: nextT,
            gasVolume: currentV,
            isRunning: !completed,
            isCompleted: completed,
          };
        });
      }

      // Update Vessel B if running
      if (vesselB.isRunning && !vesselB.isCompleted) {
        setVesselB((prev) => {
          const nextT = prev.elapsedTime + dt;
          const k = calculateRateMultiplier(prev) / 16;
          const currentV = Math.min(100, 100 * (1 - Math.exp(-k * nextT)));
          const completed = currentV >= 99.5;
          return {
            ...prev,
            elapsedTime: nextT,
            gasVolume: currentV,
            isRunning: !completed,
            isCompleted: completed,
          };
        });
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [vesselA.isRunning, vesselA.isCompleted, vesselB.isRunning, vesselB.isCompleted]);

  // DRAG & DROP HANDLER ONTO VESSEL A OR B
  const handleDropOnVessel = (targetVesselId) => {
    const item = draggingItem || selectedItem;
    if (!item) return;

    const vessel = targetVesselId === 'A' ? vesselA : vesselB;

    if (item.type === 'acid') {
      const newConc = Math.min(3.0, +(vessel.concentration + 0.5).toFixed(1));
      handleUpdateVessel(targetVesselId, { concentration: newConc });
      addNotebookEntry(
        `Added Hydrochloric Acid to Flask ${targetVesselId}`,
        `Concentration raised from ${vessel.concentration.toFixed(1)}M to ${newConc.toFixed(1)}M (+0.5M). Collision frequency between H⁺ and CaCO₃ increased.`,
        `[HCl] = ${newConc.toFixed(1)}M`
      );
    } else if (item.type === 'lumps') {
      handleUpdateVessel(targetVesselId, { surfaceArea: 'lumps' });
      addNotebookEntry(
        `Loaded Marble Chips (Lumps) into Flask ${targetVesselId}`,
        `Large chips configured. Lower exposed surface area reduces collision frequency with acid.`,
        `Solid: Lumps`
      );
    } else if (item.type === 'powder') {
      handleUpdateVessel(targetVesselId, { surfaceArea: 'powder' });
      addNotebookEntry(
        `Loaded CaCO₃ Fine Powder into Flask ${targetVesselId}`,
        `Fine powder configured. Vastly larger exposed surface area (~2.6x) enables rapid multi-site collision.`,
        `Solid: Powder`
      );
    } else if (item.type === 'catalyst') {
      const nextCat = !vessel.hasCatalyst;
      handleUpdateVessel(targetVesselId, { hasCatalyst: nextCat });
      addNotebookEntry(
        `Catalyst ${nextCat ? 'Added' : 'Removed'} in Flask ${targetVesselId}`,
        `Catalyst provides an alternate pathway with lower activation energy barrier without being consumed.`,
        nextCat ? `Catalyst Active ✓` : `No Catalyst`
      );
    } else if (item.type === 'heater') {
      const nextTemp = Math.min(75, vessel.temperature + 10);
      handleUpdateVessel(targetVesselId, { temperature: nextTemp });
      addNotebookEntry(
        `Heated Flask ${targetVesselId}`,
        `Temperature increased from ${vessel.temperature}°C to ${nextTemp}°C (+10°C). By Arrhenius kinetics, fraction of energetic particles exceeding Ea roughly doubled.`,
        `Temp: ${nextTemp}°C`
      );
    } else if (item.type === 'thermometer') {
      handleUpdateVessel(targetVesselId, { hasThermometer: true });
      addNotebookEntry(
        `Dipped Digital Thermometer in Flask ${targetVesselId}`,
        `Current liquid temperature measured at ${vessel.temperature}°C.`,
        `${vessel.temperature}°C`
      );
    }

    setDraggingItem(null);
    setSelectedItem(null);
  };

  // Apply an investigation preset
  const handleApplyPreset = (preset) => {
    setActivePresetId(preset.id);
    setVesselA((prev) => ({
      ...prev,
      ...preset.vesselA,
      gasVolume: 0,
      elapsedTime: 0,
      isRunning: false,
      isCompleted: false,
    }));
    setVesselB((prev) => ({
      ...prev,
      ...preset.vesselB,
      gasVolume: 0,
      elapsedTime: 0,
      isRunning: false,
      isCompleted: false,
    }));

    addNotebookEntry(
      `Loaded ${preset.title}`,
      `${preset.desc}. Hypothesis: ${preset.hypothesis}`,
      `Investigation Ready`
    );
  };

  // Full reset
  const executeReset = () => {
    handleResetBoth();
    setVesselA({ ...INITIAL_VESSEL_STATE });
    setVesselB({
      ...INITIAL_VESSEL_STATE,
      temperature: 45,
      surfaceArea: 'powder',
    });
    setSelectedItem(null);
    setDraggingItem(null);
    setIsResetConfirmOpen(false);
    setNotebookRecords([
      {
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        title: 'Laboratory Reset to Initial Settings',
        detail: 'Rinsed reaction vessels and reset gas collection syringes to 0.0 mL.',
        resultValue: 'Reset Complete',
      },
    ]);
  };

  const handleRequestReset = () => {
    if (notebookRecords.length > 2 || vesselA.elapsedTime > 0 || vesselB.elapsedTime > 0) {
      setIsResetConfirmOpen(true);
    } else {
      executeReset();
    }
  };

  const isBothRunning = vesselA.isRunning && vesselB.isRunning;
  const isAnyRunning = vesselA.isRunning || vesselB.isRunning;

  const currentStateObject = {
    'Flask A Conditions': `${vesselA.temperature}°C, ${vesselA.concentration}M HCl, ${vesselA.surfaceArea}`,
    'Flask A Gas Volume': `${vesselA.gasVolume.toFixed(1)} mL in ${vesselA.elapsedTime.toFixed(1)}s`,
    'Flask B Conditions': `${vesselB.temperature}°C, ${vesselB.concentration}M HCl, ${vesselB.surfaceArea}`,
    'Flask B Gas Volume': `${vesselB.gasVolume.toFixed(1)} mL in ${vesselB.elapsedTime.toFixed(1)}s`,
    'Rate Multiplier Ratio': `${(calculateRateMultiplier(vesselB) / calculateRateMultiplier(vesselA)).toFixed(2)}×`,
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
        experimentTitle="Reaction Kinetics & Collision Dynamics"
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
            <Gauge className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Chemical Reaction Kinetics &amp; Collision Theory
              </h2>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 uppercase tracking-wider">
                Reaction Laboratory
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Reaction:{' '}
              <span className="font-mono font-bold text-purple-700">
                CaCO₃(s) + 2HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g)↑
              </span>
            </p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Start Both Reactions Button */}
          <button
            onClick={isAnyRunning ? handlePauseBoth : handleStartBoth}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isAnyRunning
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-purple-600 text-white shadow-xs hover:bg-purple-700'
            }`}
          >
            {isAnyRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAnyRunning ? 'Pause Both' : 'Start Both Vessels'}</span>
          </button>

          {/* Reset Bench */}
          <button
            onClick={handleRequestReset}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
            title="Reset both vessels and bench"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Bench</span>
          </button>

          {/* Virtual Lab Notebook */}
          <button
            onClick={() => setIsNotebookOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Open Virtual Lab Notebook"
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>Notebook ({notebookRecords.length})</span>
          </button>

          {/* Fullscreen Focus Mode */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Immersive Fullscreen Focus Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-purple-600" /> : <Maximize2 className="w-3.5 h-3.5 text-purple-600" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit Focus' : 'Focus Mode'}</span>
          </button>
        </div>
      </div>

      {/* DRAGGABLE REAGENTS & APPARATUS TRAY */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600" />
            Draggable Reactants &amp; Laboratory Implements
          </span>
          <span className="text-[11px] text-slate-500">
            {selectedItem
              ? `Selected: ${selectedItem.name} — Click Flask A or Flask B to apply`
              : 'Drag any item or click to select, then drop into Flask A or Flask B'}
          </span>
        </div>

        {/* Draggable Reagents Grid with Realistic Glassware & Minerals */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {/* 1. Acid Bottle (Adds +0.5M concentration) */}
          {(() => {
            const isSelected = selectedItem?.type === 'acid';
            return (
              <motion.div
                draggable
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onDragStart={(e) => {
                  setDraggingItem({ type: 'acid', name: 'Hydrochloric Acid Bottle' });
                  e.dataTransfer.setData('text/plain', 'acid');
                }}
                onDragEnd={() => setDraggingItem(null)}
                onClick={() => setSelectedItem(isSelected ? null : { type: 'acid', name: 'Hydrochloric Acid Bottle' })}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-between text-center transition-all cursor-grab active:cursor-grabbing select-none shadow-2xs ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-200 shadow-sm'
                    : 'border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/90 text-slate-800'
                }`}
                title="Drag into Flask A or B to add acid and increase concentration (+0.5M)"
              >
                <svg viewBox="0 0 36 46" className="w-8 h-10 mb-1">
                  <rect x="12" y="2" width="12" height="6" rx="1.5" fill="#334155" stroke="#1e293b" strokeWidth="1" />
                  <rect x="14" y="8" width="8" height="6" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
                  <rect x="6" y="14" width="24" height="30" rx="3" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.2" />
                  <rect x="8" y="22" width="20" height="20" rx="1.5" fill="#3b82f6" opacity="0.75" />
                  <rect x="9" y="17" width="18" height="10" rx="1" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.6" />
                  <text x="18" y="24" fill="#1e293b" fontSize="6" fontWeight="bold" textAnchor="middle">HCl</text>
                  <line x1="8" y1="16" x2="8" y2="42" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.6" />
                </svg>
                <span className="text-[11px] font-bold text-slate-800 leading-tight">Acid Reagent</span>
                <span className="text-[9px] text-blue-600 font-semibold">+0.5M Conc</span>
              </motion.div>
            );
          })()}

          {/* 2. Marble Chips (Lumps) */}
          {(() => {
            const isSelected = selectedItem?.type === 'lumps';
            return (
              <motion.div
                draggable
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onDragStart={(e) => {
                  setDraggingItem({ type: 'lumps', name: 'CaCO₃ Marble Chips' });
                  e.dataTransfer.setData('text/plain', 'lumps');
                }}
                onDragEnd={() => setDraggingItem(null)}
                onClick={() => setSelectedItem(isSelected ? null : { type: 'lumps', name: 'CaCO₃ Marble Chips' })}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-between text-center transition-all cursor-grab active:cursor-grabbing select-none shadow-2xs ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50/80 ring-2 ring-purple-200 shadow-sm'
                    : 'border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/90 text-slate-800'
                }`}
                title="Drag into Flask A or B to use large solid marble chips (lower surface area)"
              >
                <svg viewBox="0 0 36 46" className="w-8 h-10 mb-1">
                  <rect x="5" y="10" width="13" height="11" rx="2" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
                  <rect x="16" y="21" width="15" height="13" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                  <rect x="7" y="25" width="11" height="10" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                </svg>
                <span className="text-[11px] font-bold text-slate-800 leading-tight">Marble Chips</span>
                <span className="text-[9px] text-slate-500 font-semibold">Solid Lumps</span>
              </motion.div>
            );
          })()}

          {/* 3. Fine Powder (High Surface Area) */}
          {(() => {
            const isSelected = selectedItem?.type === 'powder';
            return (
              <motion.div
                draggable
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onDragStart={(e) => {
                  setDraggingItem({ type: 'powder', name: 'CaCO₃ Fine Powder' });
                  e.dataTransfer.setData('text/plain', 'powder');
                }}
                onDragEnd={() => setDraggingItem(null)}
                onClick={() => setSelectedItem(isSelected ? null : { type: 'powder', name: 'CaCO₃ Fine Powder' })}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-between text-center transition-all cursor-grab active:cursor-grabbing select-none shadow-2xs ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50/80 ring-2 ring-purple-200 shadow-sm'
                    : 'border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/90 text-slate-800'
                }`}
                title="Drag into Flask A or B to use fine crushed powder (~2.6x surface area)"
              >
                <svg viewBox="0 0 36 46" className="w-8 h-10 mb-1">
                  <circle cx="10" cy="18" r="2.8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
                  <circle cx="18" cy="15" r="2.4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
                  <circle cx="26" cy="18" r="2.8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
                  <circle cx="14" cy="26" r="2.6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
                  <circle cx="22" cy="28" r="2.4" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
                  <circle cx="18" cy="34" r="2.6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
                </svg>
                <span className="text-[11px] font-bold text-slate-800 leading-tight">Fine Powder</span>
                <span className="text-[9px] text-purple-700 font-semibold">High Area (2.6×)</span>
              </motion.div>
            );
          })()}

          {/* 4. Catalyst Dropper */}
          {(() => {
            const isSelected = selectedItem?.type === 'catalyst';
            return (
              <motion.div
                draggable
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onDragStart={(e) => {
                  setDraggingItem({ type: 'catalyst', name: 'Transition Catalyst Dropper' });
                  e.dataTransfer.setData('text/plain', 'catalyst');
                }}
                onDragEnd={() => setDraggingItem(null)}
                onClick={() => setSelectedItem(isSelected ? null : { type: 'catalyst', name: 'Transition Catalyst Dropper' })}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-between text-center transition-all cursor-grab active:cursor-grabbing select-none shadow-2xs ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-200 shadow-sm'
                    : 'border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/90 text-slate-800'
                }`}
                title="Drag into Flask A or B to add catalyst (lowers activation energy Ea, ~2.0x rate)"
              >
                <svg viewBox="0 0 36 46" className="w-8 h-10 mb-1">
                  <path d="M 12,12 C 12,5 24,5 24,12 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
                  <rect x="15" y="12" width="6" height="20" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
                  <rect x="16" y="18" width="4" height="13" fill="#ea580c" />
                  <polygon points="15,32 21,32 19,40 17,40" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
                </svg>
                <span className="text-[11px] font-bold text-slate-800 leading-tight">Catalyst Pipette</span>
                <span className="text-[9px] text-amber-600 font-semibold">Lowers Ea (2.0×)</span>
              </motion.div>
            );
          })()}

          {/* 5. Electric Heating Plate (Adds +10°C) */}
          {(() => {
            const isSelected = selectedItem?.type === 'heater';
            return (
              <motion.div
                draggable
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onDragStart={(e) => {
                  setDraggingItem({ type: 'heater', name: 'Heating Plate' });
                  e.dataTransfer.setData('text/plain', 'heater');
                }}
                onDragEnd={() => setDraggingItem(null)}
                onClick={() => setSelectedItem(isSelected ? null : { type: 'heater', name: 'Heating Plate' })}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-between text-center transition-all cursor-grab active:cursor-grabbing select-none shadow-2xs ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/80 ring-2 ring-rose-200 shadow-sm'
                    : 'border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/90 text-slate-800'
                }`}
                title="Drag into Flask A or B to increase temperature (+10°C)"
              >
                <Flame className="w-7 h-9 mb-1 text-rose-500" />
                <span className="text-[11px] font-bold text-slate-800 leading-tight">Thermal Plate</span>
                <span className="text-[9px] text-rose-600 font-semibold">+10°C Heat</span>
              </motion.div>
            );
          })()}

          {/* 6. Digital Immersion Thermometer */}
          {(() => {
            const isSelected = selectedItem?.type === 'thermometer';
            return (
              <motion.div
                draggable
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onDragStart={(e) => {
                  setDraggingItem({ type: 'thermometer', name: 'Digital Thermometer' });
                  e.dataTransfer.setData('text/plain', 'thermometer');
                }}
                onDragEnd={() => setDraggingItem(null)}
                onClick={() => setSelectedItem(isSelected ? null : { type: 'thermometer', name: 'Digital Thermometer' })}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-between text-center transition-all cursor-grab active:cursor-grabbing select-none shadow-2xs ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-200 shadow-sm'
                    : 'border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/90 text-slate-800'
                }`}
                title="Drag into Flask A or B to monitor temperature"
              >
                <Thermometer className="w-7 h-9 mb-1 text-blue-500" />
                <span className="text-[11px] font-bold text-slate-800 leading-tight">Thermometer</span>
                <span className="text-[9px] text-blue-600 font-semibold">Probe Reading</span>
              </motion.div>
            );
          })()}
        </div>
      </div>

      {/* INVESTIGATION PRESETS ROW */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
          <Activity className="w-4 h-4 text-purple-600" /> Investigation Presets:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {INVESTIGATION_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer text-xs border ${
                activePresetId === preset.id
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {preset.title.split(':')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* CENTERPIECE: DUAL SIDE-BY-SIDE REACTION STATIONS (Hero Section: 65–75% of Focus) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Flask A Station */}
        <ReactionVesselStation
          vesselId="A"
          vesselName="Flask A (Control Vessel)"
          vesselState={vesselA}
          onUpdateState={handleUpdateVessel}
          onStart={handleStartVessel}
          onPause={handlePauseVessel}
          onReset={handleResetVessel}
          draggingItem={draggingItem}
          selectedItem={selectedItem}
          onDropOnVessel={handleDropOnVessel}
        />

        {/* Flask B Station */}
        <ReactionVesselStation
          vesselId="B"
          vesselName="Flask B (Comparison Vessel)"
          vesselState={vesselB}
          onUpdateState={handleUpdateVessel}
          onStart={handleStartVessel}
          onPause={handlePauseVessel}
          onReset={handleResetVessel}
          draggingItem={draggingItem}
          selectedItem={selectedItem}
          onDropOnVessel={handleDropOnVessel}
        />
      </div>

      {/* MICROSCOPIC COLLISION THEORY SIMULATOR INSET */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">
              Microscopic Particle Collision Theory Simulator
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Inspect Vessel:</span>
            <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
              <button
                onClick={() => setParticleVesselId('A')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  particleVesselId === 'A'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Flask A ({vesselA.temperature}°C, {vesselA.concentration.toFixed(1)}M)
              </button>
              <button
                onClick={() => setParticleVesselId('B')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  particleVesselId === 'B'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Flask B ({vesselB.temperature}°C, {vesselB.concentration.toFixed(1)}M)
              </button>
            </div>
          </div>
        </div>

        {/* Active Particle Chamber */}
        {particleVesselId === 'A' ? (
          <ParticleCollisionViewer
            temperature={vesselA.temperature}
            concentration={vesselA.concentration}
            surfaceArea={vesselA.surfaceArea}
            hasCatalyst={vesselA.hasCatalyst}
            isRunning={vesselA.isRunning || isBothRunning}
            vesselName="Flask A"
          />
        ) : (
          <ParticleCollisionViewer
            temperature={vesselB.temperature}
            concentration={vesselB.concentration}
            surfaceArea={vesselB.surfaceArea}
            hasCatalyst={vesselB.hasCatalyst}
            isRunning={vesselB.isRunning || isBothRunning}
            vesselName="Flask B"
          />
        )}
      </div>

      {/* DUAL-VESSEL COMPARATIVE ANALYSIS */}
      <ReactionRateComparison vesselA={vesselA} vesselB={vesselB} />
    </div>
  );
}
