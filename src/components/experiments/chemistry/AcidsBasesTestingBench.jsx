import { motion } from 'framer-motion';
import {
  Activity,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function AcidsBasesTestingBench({
  currentSolution,
  isFilled = false,
  indicatorAdded = false,
  activeLitmus = null, // 'red' | 'blue' | null
  isDroppingIndicator = false,
  onDropTarget,
  isDragOver = false,
  draggingItem = null,
  selectedItem = null,
  onSelectStation,
}) {
  // Determine current liquid color inside test tube
  const getLiquidDisplayColor = () => {
    if (!isFilled) return 'transparent';
    if (indicatorAdded) return currentSolution.universalColor;
    return currentSolution.naturalColor;
  };

  // Determine litmus paper submerged tip color
  const getLitmusTipColor = () => {
    if (!activeLitmus || !isFilled) return null;
    if (activeLitmus === 'red') {
      return currentSolution.redLitmusColor; // Red stays Red or turns Blue
    }
    if (activeLitmus === 'blue') {
      return currentSolution.blueLitmusColor; // Blue turns Red or stays Blue
    }
    return null;
  };

  // Determine if this testing station is currently a valid target for the dragging / selected item
  const isValidDropTarget =
    draggingItem?.type === 'bottle' ||
    draggingItem?.type === 'dropper' ||
    draggingItem?.type === 'litmus-red' ||
    draggingItem?.type === 'litmus-blue' ||
    draggingItem?.type === 'test-tube' ||
    selectedItem?.type === 'bottle' ||
    selectedItem?.type === 'dropper' ||
    selectedItem?.type === 'litmus-red' ||
    selectedItem?.type === 'litmus-blue';

  const tipColor = getLitmusTipColor();

  // Percentage position of current solution on 0-14 pH scale
  const phPercent = isFilled ? Math.max(0, Math.min(100, (currentSolution.ph / 14) * 100)) : 50;

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDropTarget?.();
      }}
      onClick={() => {
        if (selectedItem) {
          onSelectStation?.();
        }
      }}
      className={`relative w-full h-[400px] sm:h-[440px] rounded-3xl border transition-all overflow-hidden flex flex-col justify-between p-4 sm:p-5 select-none shadow-sm ${
        isDragOver
          ? 'border-cyan-500 bg-cyan-950/20 ring-4 ring-cyan-200 shadow-xl'
          : isValidDropTarget
          ? 'border-dashed border-cyan-400/80 bg-cyan-950/10 cursor-pointer shadow-md'
          : 'border-slate-200/90 bg-gradient-to-b from-[#090e1a] via-[#0d1527] to-[#070b14]'
      }`}
    >
      {/* Background Subtle Lab Ambient Grid & Overhead Spotlight */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="w-full h-full bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER: Analytical Station Status & Intelligent Feedback */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5 px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-md text-xs shadow-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-slate-100 truncate block">
              {isFilled ? currentSolution.name : 'Analytical Test Station — Empty Tube'}
            </span>
            {isFilled && (
              <span className="text-[11px] font-mono text-cyan-300 block truncate">
                {currentSolution.formula} • {currentSolution.hIonRatio}
              </span>
            )}
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-2">
          {isFilled && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-xs ${
                currentSolution.category === 'acidic'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : currentSolution.category === 'neutral'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
              }`}
            >
              {currentSolution.categoryName} (pH {currentSolution.ph.toFixed(1)})
            </span>
          )}

          {isValidDropTarget ? (
            <span className="font-bold text-cyan-300 flex items-center gap-1.5 animate-pulse text-[11px]">
              <Sparkles className="w-3.5 h-3.5" /> Ready for Drop
            </span>
          ) : !isFilled ? (
            <span className="text-slate-400 text-[11px]">Drop solution bottle to fill tube</span>
          ) : indicatorAdded ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Indicator Active
            </span>
          ) : activeLitmus ? (
            <span className="text-cyan-300 font-semibold flex items-center gap-1 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Litmus Tested
            </span>
          ) : (
            <span className="text-slate-400 text-[11px]">Drop Universal Dropper or Litmus Strip</span>
          )}
        </div>
      </div>

      {/* CENTERPIECE SVG: High-Detail Laboratory Stand, Borosilicate Glassware & Analytical Probe */}
      <div className="relative flex-1 w-full flex items-center justify-center my-1">
        <svg viewBox="0 0 600 300" className="w-full h-full max-h-[320px] select-none">
          <defs>
            {/* Stainless steel stand gradient */}
            <linearGradient id="metalChrome" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="35%" stopColor="#CBD5E1" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* Borosilicate cylindrical glass highlight */}
            <linearGradient id="boroGlass" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
              <stop offset="12%" stopColor="#FFFFFF" stopOpacity="0.12" />
              <stop offset="65%" stopColor="#FFFFFF" stopOpacity="0.03" />
              <stop offset="85%" stopColor="#FFFFFF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.5" />
            </linearGradient>

            {/* Glowing liquid drop shadow */}
            <filter id="liquidGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* LABORATORY WORKTOP BENCH SURFACE (Polished Dark Epoxy) */}
          <g transform="translate(40, 260)">
            <rect x="0" y="0" width="520" height="16" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <line x1="5" y1="2" x2="515" y2="2" stroke="#64748b" strokeWidth="1" strokeOpacity="0.6" />
            {/* Bench leg supports */}
            <rect x="30" y="16" width="16" height="20" fill="#0f172a" rx="2" />
            <rect x="474" y="16" width="16" height="20" fill="#0f172a" rx="2" />
          </g>

          {/* LABORATORY RETORT STAND (Heavy Cast-Iron Base & Stainless Steel Rod) */}
          <g transform="translate(190, 50)">
            {/* Cast-Iron Base at bench level */}
            <rect x="0" y="200" width="140" height="12" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <rect x="10" y="196" width="120" height="5" rx="2" fill="#334155" />

            {/* Vertical Stainless Steel Support Rod */}
            <rect x="25" y="0" width="9" height="200" rx="3" fill="url(#metalChrome)" />

            {/* Bosshead Clamp on vertical rod */}
            <rect x="20" y="55" width="19" height="22" rx="3" fill="#334155" stroke="#1e293b" strokeWidth="1" />
            <circle cx="38" cy="66" r="4" fill="#64748b" />
            <line x1="39" y1="62" x2="48" y2="62" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />

            {/* Horizontal Clamp Arm extending to Test Tube */}
            <rect x="36" y="62" width="60" height="7" rx="2" fill="url(#metalChrome)" />

            {/* Double-prong rubber-sleeved clamp gripping test tube neck */}
            <path
              d="M 94,56 C 98,56 106,58 106,66 C 106,74 98,76 94,76"
              fill="none"
              stroke="#0f172a"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 94,56 C 98,56 106,58 106,66 C 106,74 98,76 94,76"
              fill="none"
              stroke="#ef4444"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeOpacity="0.8"
            />
          </g>

          {/* VALID DROP TARGET PULSE RING WHEN ITEM HOVERING */}
          {(isDragOver || isValidDropTarget) && (
            <ellipse
              cx="300"
              cy="165"
              rx="55"
              ry="105"
              fill="rgba(56, 189, 248, 0.12)"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              className="animate-pulse"
            />
          )}

          {/* MAIN BOROSILICATE TEST TUBE (X = 300) */}
          <g transform="translate(276, 50)">
            {/* Tube Rear Glass Shading */}
            <rect x="0" y="24" width="48" height="160" fill="rgba(255, 255, 255, 0.03)" />
            <path d="M 0,184 Q 0,212 24,212 Q 48,212 48,184 Z" fill="rgba(255, 255, 255, 0.03)" />

            {/* CHEMICAL LIQUID FILL */}
            {isFilled && (
              <g>
                {/* Liquid Body */}
                <rect
                  x="3"
                  y="90"
                  width="42"
                  height="95"
                  fill={getLiquidDisplayColor()}
                  filter={indicatorAdded ? 'url(#liquidGlowFilter)' : undefined}
                />
                {/* Liquid Hemispherical Bottom */}
                <path
                  d="M 3,184 Q 3,209 24,209 Q 45,209 45,184 Z"
                  fill={getLiquidDisplayColor()}
                />

                {/* Liquid Meniscus Curved Surface */}
                <ellipse
                  cx="24"
                  cy="90"
                  rx="21"
                  ry="4.5"
                  fill={getLiquidDisplayColor()}
                  opacity="0.9"
                />
                <ellipse
                  cx="24"
                  cy="89"
                  rx="20.5"
                  ry="3.5"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.8"
                  strokeOpacity="0.5"
                />

                {/* Sub-surface rising effervescence micro-bubbles */}
                <circle cx="14" cy="130" r="1.5" fill="#FFFFFF" opacity="0.6" />
                <circle cx="32" cy="150" r="2" fill="#FFFFFF" opacity="0.5" />
                <circle cx="20" cy="175" r="1.8" fill="#FFFFFF" opacity="0.6" />
                <circle cx="36" cy="190" r="1.5" fill="#FFFFFF" opacity="0.5" />

                {/* Ripple rings on indicator drop strike */}
                {isDroppingIndicator && (
                  <ellipse
                    cx="24"
                    cy="90"
                    rx="14"
                    ry="3"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    className="animate-ping"
                  />
                )}
              </g>
            )}

            {/* DIPPED LITMUS PAPER STRIP */}
            {activeLitmus && isFilled && (
              <g transform="translate(15, 28)">
                {/* Dry upper portion */}
                <rect
                  x="0"
                  y="0"
                  width="18"
                  height="72"
                  fill={activeLitmus === 'red' ? '#ef4444' : '#3b82f6'}
                  rx="1"
                  stroke={activeLitmus === 'red' ? '#b91c1c' : '#1d4ed8'}
                  strokeWidth="0.8"
                />
                {/* Submerged reacted portion */}
                <rect
                  x="0"
                  y="72"
                  width="18"
                  height="90"
                  fill={tipColor || '#ef4444'}
                  rx="1"
                  filter="url(#liquidGlowFilter)"
                />
                {/* Wet boundary mark */}
                <line x1="-1" y1="72" x2="19" y2="72" stroke="#FFFFFF" strokeWidth="1.2" strokeDasharray="3 1" />
                <text x="9" y="50" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle" opacity="0.95">
                  {activeLitmus === 'red' ? 'RED' : 'BLUE'}
                </text>
              </g>
            )}

            {/* IMMERSED pH ELECTRODE SENSOR PROBE */}
            {isFilled && !activeLitmus && (
              <g transform="translate(29, 30)">
                {/* Glass electrode body */}
                <rect x="0" y="0" width="6" height="150" rx="2" fill="#334155" stroke="#64748b" strokeWidth="0.8" />
                {/* Sensitive glass sensing bulb at tip */}
                <circle cx="3" cy="150" r="5" fill="#06b6d4" opacity="0.85" filter="url(#liquidGlowFilter)" />
                {/* Internal reference element */}
                <line x1="3" y1="10" x2="3" y2="148" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 2" />
              </g>
            )}

            {/* Cylindrical Glass Tube Outline & Specular Highlight */}
            <path
              d="M -4,18 L 52,18 L 52,26 L 48,26 L 48,184 Q 48,212 24,212 Q 0,212 0,184 L 0,26 L -4,26 Z"
              fill="url(#boroGlass)"
              stroke="#94a3b8"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Frosted White Volumetric Graduations */}
            <line x1="34" y1="65" x2="46" y2="65" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.75" />
            <text x="30" y="67" fill="#cbd5e1" fontSize="7" fontWeight="bold" textAnchor="end">20 mL</text>

            <line x1="37" y1="95" x2="46" y2="95" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.75" />
            <text x="33" y="97" fill="#cbd5e1" fontSize="7" fontWeight="bold" textAnchor="end">15 mL</text>

            <line x1="34" y1="125" x2="46" y2="125" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.75" />
            <text x="30" y="127" fill="#cbd5e1" fontSize="7" fontWeight="bold" textAnchor="end">10 mL</text>

            <line x1="37" y1="155" x2="46" y2="155" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.75" />
            <text x="33" y="157" fill="#cbd5e1" fontSize="7" fontWeight="bold" textAnchor="end">5 mL</text>

            <text x="24" y="232" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Borosilicate Test Tube
            </text>
          </g>

          {/* FALLING INDICATOR DROPLET ANIMATION */}
          {isDroppingIndicator && (
            <g transform="translate(300, 42)">
              {/* Dropper tip hovering above tube */}
              <polygon points="-4,-20 4,-20 2,0 -2,0" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
              {/* Animated falling drop */}
              <circle cx="0" cy="18" r="3.5" fill="#10b981">
                <animate attributeName="cy" values="0;95" dur="0.55s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.3" dur="0.55s" repeatCount="indefinite" />
              </circle>
            </g>
          )}

          {/* DIGITAL pH ANALYTICAL METER STATION (Left Console at X = 55) */}
          <g transform="translate(55, 45)">
            {/* Monitor Chassis */}
            <rect x="0" y="0" width="138" height="175" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <rect x="8" y="8" width="122" height="74" rx="6" fill="#020617" stroke="#1e293b" strokeWidth="1.5" />

            <text x="14" y="24" fill="#64748b" fontSize="8" fontWeight="bold" letterSpacing="1">
              DIGITAL pH METER
            </text>
            <text x="124" y="24" fill="#10b981" fontSize="8" fontWeight="bold" textAnchor="end">
              25.0°C
            </text>

            {/* Glowing Big pH Value */}
            <text
              x="69"
              y="62"
              fill={isFilled ? currentSolution.bottleColor : '#475569'}
              fontSize="30"
              fontWeight="bold"
              fontFamily="monospace"
              textAnchor="middle"
              filter={isFilled ? 'url(#liquidGlowFilter)' : undefined}
            >
              {isFilled ? currentSolution.ph.toFixed(2) : '--.--'}
            </text>

            <text x="69" y="74" fill="#64748b" fontSize="8" textAnchor="middle">
              {isFilled ? currentSolution.categoryName : 'PROBE DISCONNECTED'}
            </text>

            {/* Logarithmic Ion Balance Gauges */}
            <g transform="translate(12, 94)">
              <div className="flex justify-between">
                <text x="0" y="0" fill="#f43f5e" fontSize="8" fontWeight="bold">
                  [H⁺] Hydronium
                </text>
                <text x="114" y="0" fill="#f43f5e" fontSize="7" font-mono="true" textAnchor="end">
                  {isFilled ? `10^-${currentSolution.ph.toFixed(1)} M` : ''}
                </text>
              </div>
              <rect x="0" y="4" width="114" height="7" rx="2" fill="#1e293b" />
              <rect
                x="0"
                y="4"
                width={isFilled ? Math.max(8, (14 - currentSolution.ph) * 8.1) : 0}
                height="7"
                rx="2"
                fill="#f43f5e"
              />

              <div className="flex justify-between">
                <text x="0" y="24" fill="#38bdf8" fontSize="8" fontWeight="bold">
                  [OH⁻] Hydroxide
                </text>
                <text x="114" y="24" fill="#38bdf8" fontSize="7" font-mono="true" textAnchor="end">
                  {isFilled ? `10^-${(14 - currentSolution.ph).toFixed(1)} M` : ''}
                </text>
              </div>
              <rect x="0" y="28" width="114" height="7" rx="2" fill="#1e293b" />
              <rect
                x="0"
                y="28"
                width={isFilled ? Math.max(8, currentSolution.ph * 8.1) : 0}
                height="7"
                rx="2"
                fill="#38bdf8"
              />
            </g>

            {/* Electrode Coiled Cable to Test Tube */}
            <path
              d="M 138,135 C 170,135 190,210 240,160 C 265,130 285,110 305,65"
              fill="none"
              stroke="#475569"
              strokeWidth="2.5"
              strokeDasharray="4 2"
            />
          </g>

          {/* INDICATOR & LITMUS SENSOR PANEL (Right Console at X = 405) */}
          <g transform="translate(405, 45)">
            <rect x="0" y="0" width="145" height="175" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <text x="14" y="22" fill="#94a3b8" fontSize="9" fontWeight="bold">
              CHEMICAL SENSORS
            </text>

            {/* Red Litmus Card */}
            <g transform="translate(12, 34)">
              <rect x="0" y="0" width="121" height="38" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
              <rect
                x="8"
                y="8"
                width="14"
                height="22"
                rx="2"
                fill={isFilled && activeLitmus === 'red' ? currentSolution.redLitmusColor : '#ef4444'}
              />
              <text x="28" y="18" fill="#f8fafc" fontSize="9" fontWeight="bold">
                Red Litmus Paper
              </text>
              <text x="28" y="29" fill="#94a3b8" fontSize="8">
                {isFilled && activeLitmus === 'red'
                  ? currentSolution.redLitmusResult === 'blue'
                    ? 'Turned BLUE (Base ✓)'
                    : 'Remained RED'
                  : 'Untested'}
              </text>
            </g>

            {/* Blue Litmus Card */}
            <g transform="translate(12, 78)">
              <rect x="0" y="0" width="121" height="38" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
              <rect
                x="8"
                y="8"
                width="14"
                height="22"
                rx="2"
                fill={isFilled && activeLitmus === 'blue' ? currentSolution.blueLitmusColor : '#3b82f6'}
              />
              <text x="28" y="18" fill="#f8fafc" fontSize="9" fontWeight="bold">
                Blue Litmus Paper
              </text>
              <text x="28" y="29" fill="#94a3b8" fontSize="8">
                {isFilled && activeLitmus === 'blue'
                  ? currentSolution.blueLitmusResult === 'red'
                    ? 'Turned RED (Acid ✓)'
                    : 'Remained BLUE'
                  : 'Untested'}
              </text>
            </g>

            {/* Universal Indicator Color Card */}
            <g transform="translate(12, 122)">
              <rect x="0" y="0" width="121" height="42" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
              <circle
                cx="16"
                cy="21"
                r="8"
                fill={indicatorAdded ? currentSolution.universalColor : '#475569'}
                stroke="#64748b"
                strokeWidth="1.5"
              />
              <text x="30" y="17" fill="#f8fafc" fontSize="9" fontWeight="bold">
                Universal pH
              </text>
              <text x="30" y="29" fill="#94a3b8" fontSize="8">
                {indicatorAdded ? currentSolution.universalColorName : 'No Drops Added'}
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* BOTTOM SCIENTIFIC pH COLOR SPECTRUM BAR WITH LIVE ANIMATED POINTER */}
      <div className="relative z-10 bg-slate-900/90 p-3 rounded-2xl border border-slate-700/70 backdrop-blur-md space-y-2 shadow-lg">
        {/* Scale labels */}
        <div className="flex items-center justify-between text-[11px] font-bold px-1">
          <span className="text-rose-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Acidic Range (pH 0.0 - 6.9)
          </span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Neutral (pH 7.0)
          </span>
          <span className="text-blue-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Basic / Alkaline Range (pH 7.1 - 14.0)
          </span>
        </div>

        {/* Continuous Scientific Rainbow Spectrum Bar with Animated Cursor */}
        <div className="relative w-full">
          {/* Rainbow Gradient Track */}
          <div
            className="w-full h-5 rounded-xl border border-slate-700/80 shadow-inner flex items-center overflow-hidden"
            style={{
              background:
                'linear-gradient(to right, #991b1b, #dc2626 7%, #ea580c 14%, #f97316 21%, #f59e0b 28%, #eab308 35%, #84cc16 42%, #10b981 50%, #06b6d4 57%, #0284c7 64%, #3b82f6 71%, #6366f1 78%, #8b5cf6 85%, #9333ea 92%, #581c87 100%)',
            }}
          >
            {/* Tick lines for each integer pH 0 to 14 */}
            {Array.from({ length: 15 }, (_, i) => (
              <div
                key={i}
                className="flex-1 h-full border-r border-black/20 flex items-end justify-center pb-0.5"
              >
                <span className="text-[8px] font-mono font-bold text-black/50 select-none">
                  {i}
                </span>
              </div>
            ))}
          </div>

          {/* Floating Live Indicator Position Pointer (Smoothly Eased) */}
          {isFilled && (
            <motion.div
              initial={false}
              animate={{ left: `${phPercent}%` }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              className="absolute -top-3.5 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20"
            >
              {/* Floating Pill with pH Value */}
              <div
                className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-md border border-white/30 whitespace-nowrap"
                style={{ backgroundColor: currentSolution.universalColor }}
              >
                pH {currentSolution.ph.toFixed(1)}: {currentSolution.name.split(' ')[0]}
              </div>
              {/* Pointer triangle */}
              <div
                className="w-0 h-0 border-x-4 border-x-transparent border-t-6 drop-shadow-sm"
                style={{ borderTopColor: currentSolution.universalColor }}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
