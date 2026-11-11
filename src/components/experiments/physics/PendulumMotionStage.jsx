import { useMemo } from 'react';

export default function PendulumMotionStage({
  lengthCm,
  initialAngleDeg,
  currentThetaDeg,
  gravity,
  isRunning,
  timePeriod,
}) {
  // SVG Canvas dimensions (Enlarged, generous aspect ratio)
  const width = 900;
  const height = 540;
  const pivotX = 450;
  const pivotY = 75;

  // Visual scaling: 10cm to 100cm maps to 160px to 380px visually
  const visualLength = useMemo(() => {
    return 160 + ((lengthCm - 10) / 90) * 220;
  }, [lengthCm]);

  // Coordinates of the bob
  const currentRad = (currentThetaDeg * Math.PI) / 180;
  const bobX = pivotX + visualLength * Math.sin(currentRad);
  const bobY = pivotY + visualLength * Math.cos(currentRad);

  // Extreme positions (amplitude limits)
  const maxRad = (initialAngleDeg * Math.PI) / 180;
  const rightExtremeX = pivotX + visualLength * Math.sin(maxRad);
  const rightExtremeY = pivotY + visualLength * Math.cos(maxRad);
  const leftExtremeX = pivotX + visualLength * Math.sin(-maxRad);
  const leftExtremeY = pivotY + visualLength * Math.cos(-maxRad);

  // Mean equilibrium position bottom point
  const meanX = pivotX;
  const meanY = pivotY + visualLength;

  // Energy calculations:
  // PE = mgL(1 - cos theta), KE = mgL(cos theta - cos theta0)
  const maxDeltaH = 1 - Math.cos(maxRad);
  const currentDeltaH = 1 - Math.cos(currentRad);
  const pePct = maxDeltaH > 0.0001 ? Math.min(100, Math.max(0, (currentDeltaH / maxDeltaH) * 100)) : 0;
  const kePct = Math.max(0, 100 - pePct);

  return (
    <div className="relative w-full h-[440px] sm:h-[480px] md:h-[520px] lg:h-[560px] bg-gradient-to-b from-[#091126] via-[#070e20] to-[#050916] rounded-2xl border border-slate-700/70 overflow-hidden shadow-2xl select-none flex items-center justify-center">
      {/* Precision Lab Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:28px_28px] opacity-40 pointer-events-none" />

      {/* Real-time Instant Angle & Energy Callout (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2 pointer-events-none">
        <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md text-xs font-mono text-slate-200 shadow-xl">
          <span className="text-slate-400">Instant Angle:</span>{' '}
          <span className="text-cyan-400 font-bold text-sm">{currentThetaDeg.toFixed(1)}°</span>
        </div>

        {/* Dynamic Energy Balance Bar */}
        <div className="w-44 p-2 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md space-y-1.5 shadow-xl">
          <div className="flex justify-between text-[10px] font-mono font-bold">
            <span className="text-emerald-400">Kinetic (KE): {Math.round(kePct)}%</span>
            <span className="text-amber-400">Potential (PE): {Math.round(pePct)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
            <div className="h-full bg-emerald-500 transition-all duration-75" style={{ width: `${kePct}%` }} />
            <div className="h-full bg-amber-500 transition-all duration-75" style={{ width: `${pePct}%` }} />
          </div>
        </div>
      </div>

      {/* Gravity & Period Pill (Top Left) */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md pointer-events-none text-xs sm:text-sm font-mono shadow-xl">
        <span className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
        <span className="text-slate-300 font-semibold">{gravity.name}</span>
        <span className="text-slate-500">•</span>
        <span className="text-blue-400 font-bold">T = {timePeriod.toFixed(2)}s</span>
        {!isRunning && (
          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
            PAUSED
          </span>
        )}
      </div>

      {/* Enlarged SVG Motion Canvas */}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
        <defs>
          {/* Bob Metallic Radial Gradient */}
          <radialGradient id="bobMetallicLarge" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#e2e8f0" />
            <stop offset="65%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#1e293b" />
          </radialGradient>

          {/* Stand Gradient */}
          <linearGradient id="standGradLarge" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* String Glow Filter */}
          <filter id="stringGlowLarge" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. FIXED LABORATORY STAND & CROSSBAR MOUNT */}
        <g>
          {/* Vertical Heavy Steel Stand Column */}
          <rect x="90" y="30" width="22" height="490" rx="4" fill="url(#standGradLarge)" />
          {/* Cast Iron Heavy Base */}
          <rect x="40" y="500" width="240" height="22" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />
          {/* Horizontal Heavy Crossbar extending to pivot */}
          <rect x="90" y="65" width="370" height="18" rx="3" fill="url(#standGradLarge)" />
          {/* Clamp mechanism at joint */}
          <rect x="82" y="58" width="38" height="32" rx="5" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          {/* Center Suspension Bushing */}
          <circle cx={pivotX} cy={pivotY} r="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
          <circle cx={pivotX} cy={pivotY} r="4.5" fill="#38bdf8" />
        </g>

        {/* 2. ANGULAR PROTRACTOR REFERENCE ARC AT PIVOT */}
        <g opacity="0.75">
          {/* Protractor Arc Plate */}
          <path
            d={`M ${pivotX - 85} ${pivotY} A 85 85 0 0 0 ${pivotX + 85} ${pivotY}`}
            fill="none"
            stroke="#334155"
            strokeWidth="2"
          />
          {/* Protractor Degree Ticks (-45° to +45°) */}
          {[-45, -30, -20, -15, -10, -5, 0, 5, 10, 15, 20, 30, 45].map((deg) => {
            const r = (deg * Math.PI) / 180;
            const x1 = pivotX + 78 * Math.sin(r);
            const y1 = pivotY + 78 * Math.cos(r);
            const x2 = pivotX + 89 * Math.sin(r);
            const y2 = pivotY + 89 * Math.cos(r);
            return (
              <g key={deg}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={deg === 0 ? '#38bdf8' : Math.abs(deg) % 15 === 0 ? '#94a3b8' : '#64748b'}
                  strokeWidth={deg === 0 ? 2.5 : Math.abs(deg) % 15 === 0 ? 1.5 : 1}
                />
                {Math.abs(deg) % 15 === 0 && (
                  <text
                    x={pivotX + 104 * Math.sin(r)}
                    y={pivotY + 104 * Math.cos(r) + 4}
                    fill="#94a3b8"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {Math.abs(deg)}°
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* 3. VERTICAL EQUILIBRIUM (MEAN POSITION) DASHED LINE */}
        <g>
          <line
            x1={pivotX}
            y1={pivotY}
            x2={meanX}
            y2={meanY + 35}
            stroke="#38bdf8"
            strokeWidth="2"
            strokeDasharray="6 4"
            opacity="0.6"
          />
          {/* Mean Position Tag */}
          <text
            x={meanX}
            y={meanY + 54}
            fill="#38bdf8"
            fontSize="12"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="middle"
          >
            Mean Equilibrium (θ = 0°)
          </text>
        </g>

        {/* 4. EXTREME POSITION REFERENCE MARKERS & TRAJECTORY SWING ARC */}
        <g opacity="0.55">
          {/* Trajectory Swing Arc */}
          <path
            d={`M ${leftExtremeX} ${leftExtremeY} A ${visualLength} ${visualLength} 0 0 0 ${rightExtremeX} ${rightExtremeY}`}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeDasharray="5 3"
          />

          {/* Left Extreme Ghost Bob */}
          <circle cx={leftExtremeX} cy={leftExtremeY} r="20" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="4 3" />
          <text x={leftExtremeX - 16} y={leftExtremeY + 30} fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">
            -{initialAngleDeg}°
          </text>

          {/* Right Extreme Ghost Bob */}
          <circle cx={rightExtremeX} cy={rightExtremeY} r="20" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="4 3" />
          <text x={rightExtremeX + 16} y={rightExtremeY + 30} fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">
            +{initialAngleDeg}°
          </text>
        </g>

        {/* 5. SUSPENSION STRING (Thick, taut, glowing cord) */}
        <line
          x1={pivotX}
          y1={pivotY}
          x2={bobX}
          y2={bobY}
          stroke="#f1f5f9"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#stringGlowLarge)"
        />

        {/* Length Dimension Indicator Badge on String */}
        <g transform={`translate(${(pivotX + bobX) / 2}, ${(pivotY + bobY) / 2})`}>
          <rect x="-30" y="-12" width="60" height="24" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="0" y="4" fill="#38bdf8" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            {lengthCm}cm
          </text>
        </g>

        {/* 6. POLISHED METALLIC BOB (Enlarged) */}
        <g transform={`translate(${bobX}, ${bobY})`}>
          {/* Attachment eyelet */}
          <circle cx="0" cy="-18" r="4.5" fill="#64748b" stroke="#e2e8f0" strokeWidth="1.5" />

          {/* Spherical Bob Body */}
          <circle cx="0" cy="0" r="22" fill="url(#bobMetallicLarge)" stroke="#94a3b8" strokeWidth="2" />

          {/* Specular Highlight */}
          <circle cx="-7" cy="-7" r="7" fill="#ffffff" opacity="0.65" />
        </g>
      </svg>
    </div>
  );
}
