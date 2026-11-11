import { useMemo } from 'react';

export default function OhmsCircuitBoard({
  voltage,
  resistance,
  isSwitchClosed,
  setIsSwitchClosed,
  current,
}) {
  const powerWatts = (voltage * current).toFixed(1);

  // Ammeter needle deflection: scale from 0 to 5 Amperes max
  const ammeterAngle = useMemo(() => {
    if (!isSwitchClosed) return -45;
    const clampedCurrent = Math.min(5, Math.max(0, current));
    return -45 + (clampedCurrent / 5) * 90;
  }, [isSwitchClosed, current]);

  // Voltmeter needle deflection: scale from 0 to 20 Volts
  const voltmeterAngle = useMemo(() => {
    if (!isSwitchClosed) return -45;
    const clampedVoltage = Math.min(20, Math.max(0, voltage));
    return -45 + (clampedVoltage / 20) * 90;
  }, [isSwitchClosed, voltage]);

  // Animation cycle duration inversely proportional to current
  const flowDuration = useMemo(() => {
    if (!isSwitchClosed || current <= 0.001) return '0s';
    const dur = Math.max(0.6, 3.0 / Math.sqrt(Math.max(0.05, current)));
    return `${dur.toFixed(2)}s`;
  }, [isSwitchClosed, current]);

  // Resistor thermal glow intensity
  const thermalIntensity = isSwitchClosed && Number(powerWatts) > 10 ? Math.min(1, Number(powerWatts) / 60) : 0;

  return (
    <div className="relative w-full h-[440px] sm:h-[480px] md:h-[520px] lg:h-[560px] bg-gradient-to-br from-[#0a1122] via-[#080e1b] to-[#050914] rounded-2xl border border-slate-700/70 overflow-hidden shadow-2xl select-none flex items-center justify-center">
      {/* Precision Lab Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:28px_28px] opacity-40 pointer-events-none" />

      {/* Circuit State Notification Overlay when Switch is Open */}
      {!isSwitchClosed && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 px-5 py-2.5 rounded-2xl bg-red-950/90 border border-red-500/80 text-red-100 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-2xl flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
          <span>Circuit is OPEN (Broken Conducting Path) — Electric current is zero (I = 0.00 A)</span>
        </div>
      )}

      {/* Enlarged SVG Circuit Canvas */}
      <svg viewBox="0 0 1000 560" className="w-full h-full p-2 select-none">
        <defs>
          {/* Wire Glow Filters */}
          <filter id="circuitWireGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Particle Glow Filter */}
          <filter id="chargeParticleGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Resistor Thermal Heat Glow Filter */}
          <filter id="resistorThermalHeat" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0.35 0 0 0  0 0 0 0 0  0 0 0 1 0" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Linear Gradients for metallic 3D components */}
          <linearGradient id="chassisGradLarge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="brassGradLarge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          <linearGradient id="meterDialLarge" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>

        {/* 1. HEAVY CONNECTING WIRES (Enlarged, high-contrast copper/cyan conductors) */}
        <g>
          {/* Base shadow trace */}
          <path
            d="M 220 110 L 220 80 L 820 80 L 820 480 L 220 480 L 220 450"
            fill="none"
            stroke="#020617"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Core conductor wire */}
          <path
            d="M 220 110 L 220 80 L 820 80 L 820 480 L 220 480 L 220 450"
            fill="none"
            stroke={isSwitchClosed ? '#38bdf8' : '#475569'}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={isSwitchClosed ? 'url(#circuitWireGlow)' : undefined}
          />
        </g>

        {/* 2. PARALLEL VOLTMETER PROBE LEADS (Tapped across resistor terminals) */}
        <g>
          {/* Top lead (high potential tap at 820, 190) */}
          <path
            d="M 820 190 L 710 190 L 710 310 L 640 310"
            fill="none"
            stroke={isSwitchClosed ? '#a855f7' : '#475569'}
            strokeWidth="4"
            strokeDasharray="8 4"
            strokeLinejoin="round"
          />
          {/* Bottom lead (low potential tap at 820, 370) */}
          <path
            d="M 820 370 L 710 370 L 710 350 L 640 350"
            fill="none"
            stroke={isSwitchClosed ? '#c084fc' : '#475569'}
            strokeWidth="4"
            strokeDasharray="8 4"
            strokeLinejoin="round"
          />
          {/* Solder junction nodes */}
          <circle cx="820" cy="190" r="7" fill="#a855f7" stroke="#ffffff" strokeWidth="2" />
          <circle cx="820" cy="370" r="7" fill="#c084fc" stroke="#ffffff" strokeWidth="2" />
        </g>

        {/* 3. ANIMATED CHARGE CARRIERS (Enlarged Glowing Electrons when Circuit is Closed) */}
        {isSwitchClosed && current > 0.001 && (
          <g>
            {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((offset, idx) => (
              <circle key={idx} r="6.5" fill="#fde047" filter="url(#chargeParticleGlow)">
                <animateMotion
                  path="M 220 110 L 220 80 L 820 80 L 820 480 L 220 480 L 220 450"
                  dur={flowDuration}
                  begin={`${offset * parseFloat(flowDuration)}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        )}

        {/* 4. DC BENCH POWER SUPPLY (Enlarged, centered at left vertical trace) */}
        <g transform="translate(110, 150)">
          {/* Main Enclosure */}
          <rect x="-10" y="0" width="220" height="260" rx="16" fill="url(#chassisGradLarge)" stroke="#334155" strokeWidth="3" />
          {/* Front Bezel */}
          <rect x="6" y="10" width="188" height="116" rx="10" fill="#020617" stroke="#1e293b" strokeWidth="2" />

          {/* Large Digital Voltage 7-Segment Display */}
          <text x="100" y="48" fill="#38bdf8" fontSize="28" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            {voltage.toFixed(1)} V
          </text>
          <text x="100" y="66" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">
            DC VOLTAGE
          </text>

          {/* Digital Current Readout on Power Supply */}
          <text x="100" y="98" fill="#34d399" fontSize="20" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            {isSwitchClosed ? `${current.toFixed(2)} A` : '0.00 A'}
          </text>
          <text x="100" y="114" fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="1">
            CURRENT DRAW
          </text>

          {/* Unit Brand Identification */}
          <text x="100" y="152" fill="#94a3b8" fontSize="13" fontWeight="bold" textAnchor="middle">
            DC POWER SUPPLY
          </text>
          <text x="100" y="168" fill="#475569" fontSize="10" textAnchor="middle">
            0–20V Precision Regulated
          </text>

          {/* Terminals */}
          {/* Positive Binding Post (+) */}
          <g transform="translate(100, -20)">
            <circle cx="0" cy="0" r="18" fill="#ef4444" stroke="#991b1b" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="8" fill="#7f1d1d" />
            <text x="0" y="5" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">+</text>
          </g>

          {/* Negative Binding Post (-) */}
          <g transform="translate(100, 280)">
            <circle cx="0" cy="0" r="18" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="8" fill="#020617" />
            <text x="0" y="4" fill="#38bdf8" fontSize="18" fontWeight="bold" textAnchor="middle">-</text>
          </g>

          {/* Power On Indicator Light */}
          <circle cx="28" cy="220" r="5.5" fill="#22c55e" filter="url(#circuitWireGlow)" />
          <text x="42" cy="224" fill="#22c55e" fontSize="11" fontWeight="bold">POWER ON</text>
        </g>

        {/* 5. HEAVY KNIFE SWITCH (Enlarged, centered at top trace x=430, y=80) */}
        <g
          transform="translate(430, 80)"
          className="cursor-pointer group"
          onClick={() => setIsSwitchClosed(!isSwitchClosed)}
        >
          {/* Mounting Insulating Base Block */}
          <rect x="-48" y="-24" width="96" height="48" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2.5" />

          {/* Left hinge contact terminal */}
          <circle cx="-28" cy="0" r="8" fill="url(#brassGradLarge)" stroke="#78350f" strokeWidth="2" />
          {/* Right receiving jaw contact */}
          <rect x="20" y="-12" width="16" height="24" rx="3" fill="url(#brassGradLarge)" stroke="#78350f" strokeWidth="1.5" />

          {/* Pivoting Knife Blade (Rotates smoothly on toggle) */}
          <g transform={isSwitchClosed ? 'rotate(0, -28, 0)' : 'rotate(-42, -28, 0)'} className="transition-transform duration-300">
            {/* Brass blade bar */}
            <rect x="-28" y="-5" width="56" height="10" rx="3" fill="url(#brassGradLarge)" stroke="#78350f" strokeWidth="1.5" />
            {/* Red insulated safety handle */}
            <rect x="26" y="-10" width="18" height="20" rx="5" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
          </g>

          {/* Switch Interactive State Label */}
          <text x="0" y="-32" fill={isSwitchClosed ? '#22c55e' : '#ef4444'} fontSize="13" fontWeight="bold" textAnchor="middle">
            Switch: {isSwitchClosed ? 'CLOSED (Conducting)' : 'OPEN (Click to Close)'}
          </text>
        </g>

        {/* 6. SERIES BENCH AMMETER (Enlarged, top-right trace x=650, y=80) */}
        <g transform="translate(650, 80)">
          {/* Outer Meter Casing */}
          <circle cx="0" cy="0" r="58" fill="#0f172a" stroke="#38bdf8" strokeWidth="4" />
          <circle cx="0" cy="0" r="52" fill="url(#meterDialLarge)" />

          {/* Calibrated Dial Scale Arc */}
          <path d="M -36,10 A 38 38 0 0 1 36,10" fill="none" stroke="#475569" strokeWidth="3" />
          {/* Scale Markings (0, 1, 2, 3, 4, 5A) */}
          <line x1="-36" y1="10" x2="-42" y2="15" stroke="#0f172a" strokeWidth="2" />
          <line x1="0" y1="-28" x2="0" y2="-34" stroke="#0f172a" strokeWidth="2" />
          <line x1="36" y1="10" x2="42" y2="15" stroke="#0f172a" strokeWidth="2" />

          {/* Scale Digits */}
          <text x="-40" y="24" fill="#334155" fontSize="10" fontWeight="bold" textAnchor="middle">0A</text>
          <text x="0" y="-14" fill="#334155" fontSize="10" fontWeight="bold" textAnchor="middle">2.5A</text>
          <text x="40" y="24" fill="#334155" fontSize="10" fontWeight="bold" textAnchor="middle">5A</text>

          {/* Pivoting Needle */}
          <g transform={`rotate(${ammeterAngle}, 0, 14)`} className="transition-transform duration-200">
            <line x1="0" y1="14" x2="0" y2="-36" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="0" cy="14" r="4.5" fill="#0f172a" />
          </g>

          {/* Digital Current LCD Display */}
          <rect x="-40" y="20" width="80" height="22" rx="5" fill="#0f172a" />
          <text x="0" y="36" fill="#38bdf8" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            {isSwitchClosed ? `${current.toFixed(2)} A` : '0.00 A'}
          </text>

          {/* Ammeter Descriptive Badge */}
          <text x="0" y="76" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
            AMMETER (In Series)
          </text>
        </g>

        {/* 7. PRECISION LOAD RESISTOR (Enlarged, right vertical trace x=820, y=280) */}
        <g transform="translate(820, 280)">
          {/* Intense Thermal Dissipation Glow if high wattage */}
          {thermalIntensity > 0 && (
            <ellipse cx="0" cy="0" rx="46" ry="68" fill="#f97316" opacity={thermalIntensity * 0.5} filter="url(#resistorThermalHeat)" />
          )}

          {/* Ceramic Cylindrical Resistor Body */}
          <rect x="-24" y="-50" width="48" height="100" rx="14" fill="#fde68a" stroke="#d97706" strokeWidth="3" />

          {/* Resistor Color Code Bands */}
          <rect x="-23" y="-32" width="46" height="8" fill="#78350f" />
          <rect x="-23" y="-12" width="46" height="8" fill="#dc2626" />
          <rect x="-23" y="8" width="46" height="8" fill="#2563eb" />
          <rect x="-23" y="28" width="46" height="7" fill="#ca8a04" />

          {/* Resistor Specification Tag */}
          <g transform="translate(56, 0)">
            <rect x="0" y="-22" width="88" height="44" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
            <text x="44" y="-1" fill="#fde047" fontSize="16" fontWeight="bold" textAnchor="middle">
              {resistance} Ω
            </text>
            <text x="44" y="14" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              RESISTOR
            </text>
          </g>

          {/* Electrical Power Dissipation Readout */}
          <text x="0" y="74" fill="#cbd5e1" fontSize="12" fontWeight="bold" textAnchor="middle">
            {isSwitchClosed ? `P = ${powerWatts} W (Heat)` : 'P = 0.0 W'}
          </text>
        </g>

        {/* 8. PARALLEL BENCH VOLTMETER (Enlarged, parallel across resistor x=570, y=330) */}
        <g transform="translate(570, 330)">
          {/* Meter Housing */}
          <circle cx="0" cy="0" r="58" fill="#0f172a" stroke="#a855f7" strokeWidth="4" />
          <circle cx="0" cy="0" r="52" fill="url(#meterDialLarge)" />

          {/* Dial Scale Arc */}
          <path d="M -36,10 A 38 38 0 0 1 36,10" fill="none" stroke="#475569" strokeWidth="3" />
          <line x1="-36" y1="10" x2="-42" y2="15" stroke="#0f172a" strokeWidth="2" />
          <line x1="0" y1="-28" x2="0" y2="-34" stroke="#0f172a" strokeWidth="2" />
          <line x1="36" y1="10" x2="42" y2="15" stroke="#0f172a" strokeWidth="2" />

          {/* Scale Digits */}
          <text x="-40" y="24" fill="#334155" fontSize="10" fontWeight="bold" textAnchor="middle">0V</text>
          <text x="0" y="-14" fill="#334155" fontSize="10" fontWeight="bold" textAnchor="middle">10V</text>
          <text x="40" y="24" fill="#334155" fontSize="10" fontWeight="bold" textAnchor="middle">20V</text>

          {/* Pivoting Needle */}
          <g transform={`rotate(${voltmeterAngle}, 0, 14)`} className="transition-transform duration-200">
            <line x1="0" y1="14" x2="0" y2="-36" stroke="#9333ea" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="0" cy="14" r="4.5" fill="#0f172a" />
          </g>

          {/* Digital Voltage LCD Display */}
          <rect x="-40" y="20" width="80" height="22" rx="5" fill="#0f172a" />
          <text x="0" y="36" fill="#c084fc" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            {isSwitchClosed ? `${voltage.toFixed(1)} V` : '0.0 V'}
          </text>

          {/* Voltmeter Descriptive Badge */}
          <text x="0" y="76" fill="#c084fc" fontSize="12" fontWeight="bold" textAnchor="middle">
            VOLTMETER (In Parallel)
          </text>
        </g>
      </svg>
    </div>
  );
}
