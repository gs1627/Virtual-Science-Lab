import { useState, useMemo } from 'react';
import {
  Compass,
  RotateCcw,
} from 'lucide-react';

const MEDIA = [
  { name: 'Air / Vacuum', n: 1.0, color: 'rgba(241, 245, 249, 0.4)' },
  { name: 'Water', n: 1.333, color: 'rgba(56, 189, 248, 0.2)' },
  { name: 'Crown Glass', n: 1.52, color: 'rgba(99, 102, 241, 0.25)' },
  { name: 'Flint Glass', n: 1.66, color: 'rgba(168, 85, 247, 0.28)' },
  { name: 'Diamond', n: 2.417, color: 'rgba(236, 72, 153, 0.3)' },
];

export default function RefractionExperiment() {
  const [medium1Index, setMedium1Index] = useState(0); // Top: Air by default
  const [medium2Index, setMedium2Index] = useState(1); // Bottom: Water by default
  const [incidentAngle, setIncidentAngle] = useState(45); // degrees
  const showNormal = true;
  const showProtractor = true;

  const m1 = MEDIA[medium1Index];
  const m2 = MEDIA[medium2Index];

  // Snell's Law calculations
  // n1 * sin(i) = n2 * sin(r) => sin(r) = (n1 / n2) * sin(i)
  const sinI = Math.sin((incidentAngle * Math.PI) / 180);
  const sinR = (m1.n / m2.n) * sinI;

  const isTIR = sinR > 1.0; // Total Internal Reflection occurs

  const refractedAngle = useMemo(() => {
    if (isTIR) return null;
    return (Math.asin(sinR) * 180) / Math.PI;
  }, [sinR, isTIR]);

  // Critical angle (only exists when n1 > n2)
  const criticalAngle = useMemo(() => {
    if (m1.n <= m2.n) return null;
    return (Math.asin(m2.n / m1.n) * 180) / Math.PI;
  }, [m1.n, m2.n]);

  const handleReset = () => {
    setMedium1Index(0);
    setMedium2Index(1);
    setIncidentAngle(45);
  };

  // SVG coordinate calculations (Boundary at Y = 160, Point O at (300, 160))
  const oX = 300;
  const oY = 160;
  const rayLength = 140;

  // Incident ray comes from top-left into O:
  // Angle is measured from Normal (which is vertical, X = 300)
  const incRad = (incidentAngle * Math.PI) / 180;
  const srcX = oX - rayLength * Math.sin(incRad);
  const srcY = oY - rayLength * Math.cos(incRad);

  // Reflected ray (always partially present, or 100% in TIR)
  const reflX = oX + rayLength * Math.sin(incRad);
  const reflY = oY - rayLength * Math.cos(incRad);

  // Refracted ray into medium 2 (bottom-right)
  const refrRad = refractedAngle !== null ? (refractedAngle * Math.PI) / 180 : 0;
  const refrX = oX + rayLength * Math.sin(refrRad);
  const refrY = oY + rayLength * Math.cos(refrRad);

  return (
    <div className="w-full flex flex-col space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600" />
            <span>Refraction &amp; Snell&apos;s Law Simulator</span>
          </h2>
          <p className="text-xs text-slate-500">
            Formula: <span className="font-mono font-bold text-blue-600">n₁ · sin(θ₁) = n₂ · sin(θ₂)</span> | Critical Angle: <span className="font-mono font-bold text-purple-600">θ_c = arcsin(n₂ / n₁)</span>
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Simulation</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT / CENTER: Optical Refraction Stage (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Select Media Pair:
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {/* Media 1 Selector */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-medium">Medium 1:</span>
                  <select
                    value={medium1Index}
                    onChange={(e) => setMedium1Index(Number(e.target.value))}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 font-semibold text-slate-800 text-xs outline-none focus:border-blue-500"
                  >
                    {MEDIA.map((m, i) => (
                      <option key={m.name} value={i}>{m.name} (n={m.n})</option>
                    ))}
                  </select>
                </div>

                {/* Media 2 Selector */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 font-medium">Medium 2:</span>
                  <select
                    value={medium2Index}
                    onChange={(e) => setMedium2Index(Number(e.target.value))}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 font-semibold text-slate-800 text-xs outline-none focus:border-blue-500"
                  >
                    {MEDIA.map((m, i) => (
                      <option key={m.name} value={i}>{m.name} (n={m.n})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Optical Canvas Viewport */}
            <div className="relative w-full h-[330px] bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 600 320" className="w-full h-full select-none">
                {/* Medium 1 Background (Top Half) */}
                <rect x="0" y="0" width="600" height="160" fill={m1.color} />
                <text x="30" y="30" fill="#94A3B8" fontSize="12" fontWeight="bold">
                  {m1.name} (n₁ = {m1.n})
                </text>

                {/* Medium 2 Background (Bottom Half) */}
                <rect x="0" y="160" width="600" height="160" fill={m2.color} />
                <text x="30" y="190" fill="#94A3B8" fontSize="12" fontWeight="bold">
                  {m2.name} (n₂ = {m2.n})
                </text>

                {/* Horizontal Boundary Line */}
                <line x1="0" y1="160" x2="600" y2="160" stroke="#CBD5E1" strokeWidth="2" opacity="0.6" />

                {/* Normal Line (Perpendicular) */}
                {showNormal && (
                  <line
                    x1="300"
                    y1="20"
                    x2="300"
                    y2="300"
                    stroke="#F8FAFC"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.5"
                  />
                )}

                {/* Protractor Markings */}
                {showProtractor && (
                  <circle
                    cx="300"
                    cy="160"
                    r="120"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                    opacity="0.25"
                  />
                )}

                {/* Incident Ray (Cyan glow) */}
                <line
                  x1={srcX}
                  y1={srcY}
                  x2={oX}
                  y2={oY}
                  stroke="#38BDF8"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx={srcX} cy={srcY} r="4" fill="#38BDF8" />

                {/* Reflected Ray (Partially reflected or TIR) */}
                <line
                  x1={oX}
                  y1={oY}
                  x2={reflX}
                  y2={reflY}
                  stroke="#F59E0B"
                  strokeWidth={isTIR ? '3.5' : '1.5'}
                  strokeDasharray={isTIR ? 'none' : '4 2'}
                  strokeLinecap="round"
                />

                {/* Refracted Ray (Into medium 2) */}
                {!isTIR && (
                  <line
                    x1={oX}
                    y1={oY}
                    x2={refrX}
                    y2={refrY}
                    stroke="#A855F7"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                )}

                {/* Center Point of Incidence O */}
                <circle cx={oX} cy={oY} r="4" fill="#FFFFFF" />

                {/* TIR Notification on canvas */}
                {isTIR && (
                  <g transform="translate(300, 240)">
                    <rect x="-140" y="-16" width="280" height="32" rx="8" fill="#EF4444" opacity="0.9" />
                    <text x="0" y="5" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">
                      ⚠️ Total Internal Reflection (TIR) Active
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Slider Controls */}
            <div className="mt-5 space-y-2 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">
                  Angle of Incidence (θ₁):
                </span>
                <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {incidentAngle}°
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="85"
                step="1"
                value={incidentAngle}
                onChange={(e) => setIncidentAngle(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-200 accent-blue-600 cursor-pointer appearance-none"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0° (Normal)</span>
                <span>45°</span>
                <span>85° (Grazing)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Live Formula & Status Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Refraction Metrics
            </h3>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] text-blue-700 font-bold uppercase">Angle of Incidence (θ₁)</span>
              <div className="text-2xl font-mono font-extrabold text-blue-800 mt-0.5">
                {incidentAngle}°
              </div>
              <span className="text-[10px] text-blue-600">Measured from vertical normal</span>
            </div>

            <div className={`p-3 rounded-xl border ${isTIR ? 'bg-red-50 border-red-200' : 'bg-purple-50 border-purple-200'}`}>
              <span className={`text-[10px] font-bold uppercase ${isTIR ? 'text-red-700' : 'text-purple-700'}`}>
                Angle of Refraction (θ₂)
              </span>
              <div className={`text-2xl font-mono font-extrabold mt-0.5 ${isTIR ? 'text-red-800' : 'text-purple-800'}`}>
                {isTIR ? 'TIR (No Ray)' : `${refractedAngle.toFixed(1)}°`}
              </div>
              <span className={`text-[10px] ${isTIR ? 'text-red-600' : 'text-purple-600'}`}>
                {isTIR ? 'Light is 100% reflected internally' : `sin(θ₂) = (${m1.n} / ${m2.n}) · sin(${incidentAngle}°)`}
              </span>
            </div>

            {criticalAngle !== null && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-amber-800 font-bold uppercase">Critical Angle (θ_c)</span>
                  <span className="font-mono font-bold text-amber-900 text-sm">{criticalAngle.toFixed(1)}°</span>
                </div>
                <p className="text-[11px] text-amber-700 mt-1">
                  When θ₁ &gt; {criticalAngle.toFixed(1)}°, light cannot escape into the rarer medium.
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
              <span>Scientific Principle</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              When light enters an optically denser medium ($n_2 &gt; n_1$), light slows down and bends <strong>towards the normal</strong> ($\theta_2 &lt; \theta_1$).
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Conversely, moving from denser to rarer ($n_1 &gt; n_2$), light speeds up and bends <strong>away from the normal</strong>. Beyond the critical angle, fiber optics and diamonds trap light via total internal reflection!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
