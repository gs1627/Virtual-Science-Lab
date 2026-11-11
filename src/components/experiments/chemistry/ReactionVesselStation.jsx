import {
  Activity,
  Flame,
  Sparkles,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import { calculateRateMultiplier } from './reactionRateData';

export default function ReactionVesselStation({
  vesselId = 'A',
  vesselName = 'Flask A',
  vesselState,
  onUpdateState,
  onStart,
  onPause,
  onReset,
  draggingItem = null,
  selectedItem = null,
  onDropOnVessel,
}) {
  const {
    temperature,
    concentration,
    surfaceArea,
    hasCatalyst,
    hasThermometer,
    gasVolume,
    elapsedTime,
    isRunning,
    isCompleted,
  } = vesselState;

  const rateMultiplier = calculateRateMultiplier(vesselState);
  const currentSpeedMLs = isRunning ? (Math.max(0, 100 - gasVolume) * (rateMultiplier / 16)).toFixed(1) : '0.0';

  // Check if vessel is a valid drop target for currently dragged or selected item
  const isValidDropTarget =
    draggingItem?.type === 'acid' ||
    draggingItem?.type === 'lumps' ||
    draggingItem?.type === 'powder' ||
    draggingItem?.type === 'catalyst' ||
    draggingItem?.type === 'thermometer' ||
    draggingItem?.type === 'heater' ||
    selectedItem?.type === 'acid' ||
    selectedItem?.type === 'lumps' ||
    selectedItem?.type === 'powder' ||
    selectedItem?.type === 'catalyst' ||
    selectedItem?.type === 'thermometer' ||
    selectedItem?.type === 'heater';

  // Heating coil glow color
  const getHeatingColor = () => {
    if (temperature <= 22) return '#475569';
    if (temperature <= 38) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDropOnVessel?.(vesselId);
      }}
      onClick={() => {
        if (selectedItem) {
          onDropOnVessel?.(vesselId);
        }
      }}
      className={`relative bg-white rounded-3xl border transition-all p-4 sm:p-5 flex flex-col justify-between space-y-4 select-none shadow-xs ${
        isValidDropTarget
          ? 'border-purple-400 bg-purple-50/20 ring-4 ring-purple-100 cursor-pointer shadow-md'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      {/* Station Top Bar: Identification, Multplier & Live Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shadow-2xs ${
              vesselId === 'A'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-purple-50 text-purple-700 border border-purple-200'
            }`}
          >
            {vesselId}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{vesselName}</h4>
            <span className="text-[11px] text-slate-500 font-mono">
              k = <strong className="text-purple-700">{rateMultiplier.toFixed(1)}×</strong> kinetic rate multiplier
            </span>
          </div>
        </div>

        {/* Reaction Status Tag */}
        <div>
          {isCompleted ? (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100 mL Reaction Complete
            </span>
          ) : isRunning ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold animate-pulse shadow-2xs">
              <Activity className="w-3.5 h-3.5 text-amber-600" />
              <span>Reacting ({currentSpeedMLs} mL/s)</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold">
              Ready to React
            </span>
          )}
        </div>
      </div>

      {/* DETAILED LABORATORY SVG APPARATUS (Erlenmeyer Flask, Hotplate with Heat Waves, Gas Syringe) */}
      <div className="relative w-full h-[230px] sm:h-[260px] bg-gradient-to-b from-[#090e1a] via-[#0d1527] to-[#070b14] rounded-2xl overflow-hidden flex items-center justify-center p-2.5 border border-slate-800/80 shadow-inner">
        {/* Subtle Background Laboratory Ambient Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="w-full h-full bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>

        <svg viewBox="0 0 520 250" className="w-full h-full select-none">
          <defs>
            {/* Borosilicate conical flask gradient highlight */}
            <linearGradient id={`flaskGlass_${vesselId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="15%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.02" />
              <stop offset="88%" stopColor="#FFFFFF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.45" />
            </linearGradient>

            {/* Glowing liquid effervescence filter */}
            <filter id={`effervescenceGlow_${vesselId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Laboratory Bench Surface */}
          <line x1="20" y1="218" x2="500" y2="218" stroke="#334155" strokeWidth="4" />

          {/* LABORATORY CERAMIC HOTPLATE (Under Flask at X = 50 to 170) */}
          <g transform="translate(60, 208)">
            {/* Hotplate Aluminum Chassis */}
            <rect x="0" y="0" width="105" height="10" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1" />
            {/* Heating Ceramic Top Plate */}
            <rect x="4" y="-3" width="97" height="4" rx="1.5" fill="#334155" />
            {/* Heating Element Glow Filament */}
            <line
              x1="10"
              y1="-1"
              x2="94"
              y2="-1"
              stroke={getHeatingColor()}
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Rising Thermal Heat Wave Shimmers when T > 30°C */}
            {temperature > 30 && (
              <g opacity="0.6">
                <path
                  d="M 25,-10 Q 20,-25 25,-40 Q 30,-55 25,-70"
                  fill="none"
                  stroke={getHeatingColor()}
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                >
                  <animate attributeName="stroke-dashoffset" values="0;-14" dur="1s" repeatCount="indefinite" />
                </path>
                <path
                  d="M 52,-10 Q 47,-25 52,-40 Q 57,-55 52,-70"
                  fill="none"
                  stroke={getHeatingColor()}
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                >
                  <animate attributeName="stroke-dashoffset" values="0;-14" dur="0.9s" repeatCount="indefinite" />
                </path>
                <path
                  d="M 80,-10 Q 75,-25 80,-40 Q 85,-55 80,-70"
                  fill="none"
                  stroke={getHeatingColor()}
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                >
                  <animate attributeName="stroke-dashoffset" values="0;-14" dur="1.1s" repeatCount="indefinite" />
                </path>
              </g>
            )}
          </g>

          {/* ERLENMEYER FLASK (Centered at X = 112) */}
          <g transform="translate(62, 60)">
            {/* Acid Liquid inside flask */}
            <path
              d="M 24,110 L 6,146 L 96,146 L 78,110 Z"
              fill={hasCatalyst ? 'rgba(249, 115, 22, 0.4)' : 'rgba(147, 51, 234, 0.3)'}
              filter={`url(#effervescenceGlow_${vesselId})`}
            />

            {/* Solid Reactant Particles (CaCO3) at bottom */}
            {surfaceArea === 'lumps' ? (
              <g transform="translate(24, 132)">
                <rect x="0" y="3" width="16" height="11" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
                <rect x="20" y="0" width="17" height="14" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
                <rect x="40" y="4" width="13" height="10" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
              </g>
            ) : (
              <g transform="translate(14, 137)">
                <circle cx="5" cy="5" r="3" fill="#e2e8f0" />
                <circle cx="16" cy="6" r="2.5" fill="#cbd5e1" />
                <circle cx="28" cy="4" r="3" fill="#e2e8f0" />
                <circle cx="42" cy="6" r="3" fill="#e2e8f0" />
                <circle cx="56" cy="5" r="2.5" fill="#cbd5e1" />
                <circle cx="68" cy="6" r="3" fill="#e2e8f0" />
              </g>
            )}

            {/* Dynamic Rising Effervescence CO2 Bubbles when reacting */}
            {isRunning && (
              <g>
                <circle cx="34" cy="126" r="2" fill="#ffffff" opacity="0.9">
                  <animate attributeName="cy" values="130;110" dur={`${0.6 / Math.min(3, rateMultiplier / 2)}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0" dur={`${0.6 / Math.min(3, rateMultiplier / 2)}s`} repeatCount="indefinite" />
                </circle>
                <circle cx="50" cy="132" r="2.8" fill="#ffffff" opacity="0.85">
                  <animate attributeName="cy" values="134;110" dur={`${0.5 / Math.min(3, rateMultiplier / 2)}s`} begin="0.1s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.85;0" dur={`${0.5 / Math.min(3, rateMultiplier / 2)}s`} begin="0.1s" repeatCount="indefinite" />
                </circle>
                <circle cx="68" cy="138" r="2.2" fill="#ffffff" opacity="0.9">
                  <animate attributeName="cy" values="138;110" dur={`${0.55 / Math.min(3, rateMultiplier / 2)}s`} begin="0.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0" dur={`${0.55 / Math.min(3, rateMultiplier / 2)}s`} begin="0.2s" repeatCount="indefinite" />
                </circle>
              </g>
            )}

            {/* Immersion Digital Thermometer Probe */}
            {hasThermometer && (
              <g transform="translate(38, -12)">
                <rect x="0" y="0" width="4.5" height="135" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
                <rect x="0.8" y="65" width="3" height="70" rx="1" fill="#ef4444" />
                {/* Thermometer Digital Readout Pill */}
                <rect x="-16" y="-14" width="36" height="15" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                <text x="2" y="-3" fill="#38bdf8" fontSize="8.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  {temperature}°C
                </text>
              </g>
            )}

            {/* Conical Flask Glass Body with Refraction Shading */}
            <path
              d="M 43,0 L 43,38 L 5,148 L 97,148 L 59,38 L 59,0 Z"
              fill={`url(#flaskGlass_${vesselId})`}
              stroke="#94a3b8"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Rubber Stopper in neck */}
            <rect x="39" y="-6" width="24" height="10" rx="2" fill="#334155" />
            <text x="51" y="165" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">
              CaCO₃ + {concentration.toFixed(1)}M HCl
            </text>
          </g>

          {/* DELIVERY TUBE (Flask neck to Gas Collection Syringe) */}
          <path
            d="M 113,54 L 113,22 L 245,22 L 245,114 L 270,114"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* GRADUATED GAS COLLECTION SYRINGE (Horizontal at X = 270) */}
          <g transform="translate(270, 92)">
            {/* Glass Syringe Barrel */}
            <rect x="0" y="0" width="168" height="42" rx="4" fill="rgba(255, 255, 255, 0.04)" stroke="#64748b" strokeWidth="2" />

            {/* Translucent Cyan CO2 Gas Volume Collected */}
            <rect
              x="2"
              y="2"
              width={Math.min(164, (gasVolume / 100) * 148 + 4)}
              height="38"
              fill="rgba(56, 189, 248, 0.25)"
            />

            {/* Graduations (0, 20, 40, 60, 80, 100 mL) */}
            {[0, 20, 40, 60, 80, 100].map((v, i) => (
              <g key={v} transform={`translate(${i * 29.6 + 6}, 0)`}>
                <line x1="0" y1="0" x2="0" y2="8" stroke="#94a3b8" strokeWidth="1.2" />
                <text x="0" y="21" fill="#94a3b8" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                  {v}
                </text>
              </g>
            ))}

            {/* Syringe Plunger (Translates horizontally with gasVolume) */}
            <g transform={`translate(${6 + (gasVolume / 100) * 148}, 0)`}>
              {/* Rubber Piston Head */}
              <rect x="0" y="2" width="9" height="38" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1" />
              {/* Plunger Shaft */}
              <rect x="9" y="14" width="58" height="14" fill="#e2e8f0" />
              {/* Push Flange */}
              <rect x="67" y="5" width="7" height="32" rx="2" fill="#94a3b8" />
            </g>

            {/* Live Gas Volume Indicator Pill */}
            <g transform="translate(84, -12)">
              <rect x="-45" y="-12" width="90" height="16" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
              <text x="0" y="-1" fill="#38bdf8" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                CO₂: {gasVolume.toFixed(1)} mL
              </text>
            </g>
          </g>
        </svg>

        {/* Drop target invitation badge */}
        {isValidDropTarget && (
          <div className="absolute inset-0 flex items-center justify-center bg-purple-950/40 backdrop-blur-2xs pointer-events-none">
            <span className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-lg animate-bounce flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Drop onto {vesselName}!
            </span>
          </div>
        )}
      </div>

      {/* REFINED DIRECT CONTROLS (Temperature, Concentration, Surface Area, Catalyst) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        {/* 1. Temperature Control with Steppers */}
        <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/90 flex flex-col justify-between space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Temperature
            </span>
            <span className="font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
              {temperature}°C
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onUpdateState?.(vesselId, { temperature: Math.max(15, temperature - 5) })}
              disabled={isRunning}
              className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-bold text-xs disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              -
            </button>
            <input
              type="range"
              min="15"
              max="75"
              step="5"
              value={temperature}
              onChange={(e) => onUpdateState?.(vesselId, { temperature: Number(e.target.value) })}
              disabled={isRunning}
              className="flex-1 h-1.5 bg-slate-200 accent-purple-600 cursor-pointer disabled:opacity-40"
            />
            <button
              onClick={() => onUpdateState?.(vesselId, { temperature: Math.min(75, temperature + 5) })}
              disabled={isRunning}
              className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-bold text-xs disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              +
            </button>
          </div>
        </div>

        {/* 2. Concentration Control with Steppers */}
        <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/90 flex flex-col justify-between space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
            <span>[HCl] Acid Conc</span>
            <span className="font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
              {concentration.toFixed(1)}M
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onUpdateState?.(vesselId, { concentration: Math.max(0.5, +(concentration - 0.5).toFixed(1)) })}
              disabled={isRunning}
              className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-bold text-xs disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              -
            </button>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.5"
              value={concentration}
              onChange={(e) => onUpdateState?.(vesselId, { concentration: Number(e.target.value) })}
              disabled={isRunning}
              className="flex-1 h-1.5 bg-slate-200 accent-blue-600 cursor-pointer disabled:opacity-40"
            />
            <button
              onClick={() => onUpdateState?.(vesselId, { concentration: Math.min(3.0, +(concentration + 0.5).toFixed(1)) })}
              disabled={isRunning}
              className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-bold text-xs disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              +
            </button>
          </div>
        </div>

        {/* 3. Surface Area Toggle */}
        <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/90 flex flex-col justify-between space-y-1.5 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-700">CaCO₃ Solid State</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => onUpdateState?.(vesselId, { surfaceArea: 'lumps' })}
              disabled={isRunning}
              className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                surfaceArea === 'lumps'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Lumps
            </button>
            <button
              onClick={() => onUpdateState?.(vesselId, { surfaceArea: 'powder' })}
              disabled={isRunning}
              className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                surfaceArea === 'powder'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Powder
            </button>
          </div>
        </div>

        {/* 4. Catalyst Toggle */}
        <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/90 flex flex-col justify-between space-y-1.5 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-700">Catalytic Activation</span>
          <button
            onClick={() => onUpdateState?.(vesselId, { hasCatalyst: !hasCatalyst })}
            disabled={isRunning}
            className={`w-full py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              hasCatalyst
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {hasCatalyst ? 'Catalyst Active (2.0×)' : 'No Catalyst'}
          </button>
        </div>
      </div>

      {/* VESSEL LOCAL CONTROLS & TIMING METRICS */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-500">
            Elapsed: <strong className="text-blue-700">{elapsedTime.toFixed(1)}s</strong>
          </span>
          <span className="text-slate-500">
            CO₂: <strong className="text-purple-700">{gasVolume.toFixed(1)} mL</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={isRunning ? () => onPause?.(vesselId) : () => onStart?.(vesselId)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              isRunning
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-purple-600 text-white hover:bg-purple-700 shadow-xs'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Pause' : 'Start Vessel'}</span>
          </button>

          <button
            onClick={() => onReset?.(vesselId)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
            title={`Reset ${vesselName}`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
