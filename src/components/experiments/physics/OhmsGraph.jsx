import { useState, useMemo } from 'react';
import { TrendingUp } from 'lucide-react';

// Dimensions for SVG plotting
const width = 480;
const height = 240;
const padding = { top: 20, right: 30, bottom: 40, left: 55 };
const plotWidth = width - padding.left - padding.right;
const plotHeight = height - padding.top - padding.bottom;

export default function OhmsGraph({ voltage, resistance, current, isSwitchClosed }) {
  const [graphMode, setGraphMode] = useState('v_vs_i'); // 'v_vs_i' | 'r_vs_i'

  // Data for V vs I graph: Voltage from 0 to 20V with current Resistance
  const vPoints = useMemo(() => {
    const pts = [];
    const maxV = 20;
    const maxI = maxV / Math.max(1, resistance); // Max current at 20V
    const yMax = Math.max(0.5, maxI * 1.15); // Add headroom

    for (let v = 0; v <= maxV; v += 1) {
      const i = isSwitchClosed ? v / resistance : 0;
      const x = padding.left + (v / maxV) * plotWidth;
      const y = padding.top + plotHeight - (i / yMax) * plotHeight;
      pts.push({ v, i, x, y });
    }
    return { pts, maxV, yMax };
  }, [resistance, isSwitchClosed]);

  // Data for R vs I graph: Resistance from 1 to 100 Ohms with current Voltage
  const rPoints = useMemo(() => {
    const pts = [];
    const minR = 1;
    const maxR = 100;
    const yMax = Math.max(0.5, isSwitchClosed ? (voltage / 5) * 1.2 : 1);

    for (let r = 1; r <= maxR; r += 2) {
      const i = isSwitchClosed ? voltage / r : 0;
      const clampedI = Math.min(yMax, i);
      const x = padding.left + ((r - minR) / (maxR - minR)) * plotWidth;
      const y = padding.top + plotHeight - (clampedI / yMax) * plotHeight;
      pts.push({ r, i, x, y });
    }
    return { pts, maxR, yMax };
  }, [voltage, isSwitchClosed]);

  // Current Operating Point Coordinates
  const currentOperatingPoint = useMemo(() => {
    if (graphMode === 'v_vs_i') {
      const { maxV, yMax } = vPoints;
      const operatingI = isSwitchClosed ? current : 0;
      const x = padding.left + (voltage / maxV) * plotWidth;
      const y = padding.top + plotHeight - (operatingI / yMax) * plotHeight;
      return { x, y, label: `(${voltage}V, ${operatingI.toFixed(2)}A)` };
    } else {
      const { maxR, yMax } = rPoints;
      const operatingI = isSwitchClosed ? current : 0;
      const clampedI = Math.min(yMax, operatingI);
      const x = padding.left + ((resistance - 1) / (maxR - 1)) * plotWidth;
      const y = padding.top + plotHeight - (clampedI / yMax) * plotHeight;
      return { x, y, label: `(${resistance}Ω, ${operatingI.toFixed(2)}A)` };
    }
  }, [graphMode, vPoints, rPoints, voltage, resistance, current, isSwitchClosed]);

  // Generate SVG path string from points
  const pathD = useMemo(() => {
    const pts = graphMode === 'v_vs_i' ? vPoints.pts : rPoints.pts;
    if (pts.length === 0) return '';
    return pts.reduce((acc, curr, idx) => (idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`), '');
  }, [graphMode, vPoints, rPoints]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
      {/* Header & Graph Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Live Mathematical Graph</h4>
            <p className="text-[11px] text-slate-500">
              {graphMode === 'v_vs_i' ? 'Ohmic Linearity (I ∝ V)' : 'Inverse Proportionality (I ∝ 1/R)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={() => setGraphMode('v_vs_i')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              graphMode === 'v_vs_i'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            V vs I (Linear)
          </button>
          <button
            onClick={() => setGraphMode('r_vs_i')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              graphMode === 'r_vs_i'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            R vs I (Inverse)
          </button>
        </div>
      </div>

      {/* SVG Plotting Viewport */}
      <div className="relative w-full overflow-hidden bg-slate-950 rounded-xl p-2 select-none">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = padding.top + plotHeight * pct;
            return (
              <line
                key={`h-${idx}`}
                x1={padding.left}
                y1={y}
                x2={padding.left + plotWidth}
                y2={y}
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
            );
          })}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const x = padding.left + plotWidth * pct;
            return (
              <line
                key={`v-${idx}`}
                x1={x}
                y1={padding.top}
                x2={x}
                y2={padding.top + plotHeight}
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
            );
          })}

          {/* Axes */}
          <line
            x1={padding.left}
            y1={padding.top + plotHeight}
            x2={padding.left + plotWidth + 10}
            y2={padding.top + plotHeight}
            stroke="#64748b"
            strokeWidth="2"
          />
          <line
            x1={padding.left}
            y1={padding.top - 5}
            x2={padding.left}
            y2={padding.top + plotHeight}
            stroke="#64748b"
            strokeWidth="2"
          />

          {/* Axis Labels */}
          {/* Y-axis Label */}
          <text
            x={-height / 2}
            y={16}
            transform="rotate(-90)"
            fill="#94a3b8"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
          >
            Current I (Amperes)
          </text>
          {/* X-axis Label */}
          <text
            x={padding.left + plotWidth / 2}
            y={height - 8}
            fill="#94a3b8"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
          >
            {graphMode === 'v_vs_i' ? 'Voltage V (Volts)' : 'Resistance R (Ohms, Ω)'}
          </text>

          {/* Max value ticks */}
          <text x={padding.left - 8} y={padding.top + 6} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">
            {graphMode === 'v_vs_i' ? vPoints.yMax.toFixed(2) : rPoints.yMax.toFixed(2)}A
          </text>
          <text x={padding.left - 8} y={padding.top + plotHeight} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">
            0A
          </text>

          <text x={padding.left} y={padding.top + plotHeight + 15} fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="monospace">
            {graphMode === 'v_vs_i' ? '0V' : '1Ω'}
          </text>
          <text x={padding.left + plotWidth} y={padding.top + plotHeight + 15} fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="monospace">
            {graphMode === 'v_vs_i' ? '20V' : '100Ω'}
          </text>

          {/* Plotted Line */}
          <path
            d={pathD}
            fill="none"
            stroke={graphMode === 'v_vs_i' ? '#38bdf8' : '#a855f7'}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Current Operating Point Marker */}
          {isSwitchClosed && (
            <g transform={`translate(${currentOperatingPoint.x}, ${currentOperatingPoint.y})`}>
              <circle r="7" fill="#fde047" opacity="0.4">
                <animate attributeName="r" values="5;10;5" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle r="4.5" fill="#fde047" stroke="#ffffff" strokeWidth="1.5" />
              {/* Tooltip callout */}
              <rect x="-35" y="-24" width="70" height="18" rx="4" fill="#0f172a" stroke="#fde047" strokeWidth="1" />
              <text x="0" y="-12" fill="#fde047" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                {currentOperatingPoint.label}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Educational Explanation of the Graph */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
        {graphMode === 'v_vs_i' ? (
          <div>
            <strong className="text-blue-700 font-bold">V vs I (Direct Linearity): </strong>
            Because resistance is fixed at <span className="font-mono font-bold text-slate-900">{resistance} Ω</span>, the line is straight. The slope of this line equals <span className="font-mono font-bold text-slate-900">1 / R = {(1 / resistance).toFixed(4)} S</span> (conductance). Higher voltage pushes proportionally more current.
          </div>
        ) : (
          <div>
            <strong className="text-purple-700 font-bold">R vs I (Inverse Hyperbola): </strong>
            Because voltage is fixed at <span className="font-mono font-bold text-slate-900">{voltage} V</span>, current drops sharply as resistance increases (<span className="font-mono font-bold text-slate-900">I = {voltage} / R</span>). At low resistance, current is huge; at high resistance, current approaches zero asymptotically.
          </div>
        )}
      </div>
    </div>
  );
}
