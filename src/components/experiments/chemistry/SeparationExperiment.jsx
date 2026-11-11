import { useState } from 'react';
import {
  Filter,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';

const STAGES = [
  {
    id: 1,
    title: 'Stage 1: Dissolving Soluble Salt',
    desc: 'Add water and stir the heterogeneous mixture. Salt (NaCl) dissolves into aqueous solution while insoluble sand grains settle at the bottom.',
    action: 'Stir & Dissolve',
  },
  {
    id: 2,
    title: 'Stage 2: Gravity Filtration',
    desc: 'Pour the mixture through a conical funnel lined with filter paper. Sand residue is trapped on the paper, while clear salt-water filtrate collects below.',
    action: 'Filter Insoluble Sand',
  },
  {
    id: 3,
    title: 'Stage 3: Thermal Evaporation',
    desc: 'Heat the salt-water filtrate in an evaporating dish using a Bunsen burner. Water boils off as steam (H2O vapor), leaving pure crystalline white salt crystals.',
    action: 'Ignite Burner & Evaporate',
  },
];

export default function SeparationExperiment() {
  const [currentStage, setCurrentStage] = useState(1);
  const [isEvaporated, setIsEvaporated] = useState(false);
  const burnerHeat = 50; // %

  const handleNextStage = () => {
    if (currentStage === 1) {
      setTimeout(() => setCurrentStage(2), 300);
    } else if (currentStage === 2) {
      setTimeout(() => setCurrentStage(3), 300);
    } else if (currentStage === 3) {
      setIsEvaporated(true);
    }
  };

  const handleReset = () => {
    setCurrentStage(1);
    setIsEvaporated(false);
  };

  return (
    <div className="w-full flex flex-col space-y-5">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-600" />
            <span>Separation of Insoluble &amp; Soluble Mixtures</span>
          </h2>
          <p className="text-xs text-slate-500">
            Separate a ternary mixture of <strong>Sand + Salt (NaCl) + Water</strong> using progressive dissolving, gravity filtration, and crystallization.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Procedure</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT / CENTER: Apparatus Stage (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            {/* Stage Progress Pills */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                  <button
                    key={s}
                    onClick={() => setCurrentStage(s)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      currentStage === s
                        ? 'bg-purple-600 text-white shadow-xs'
                        : currentStage > s
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <span>{currentStage > s ? '✓' : s}.</span>
                    <span>{s === 1 ? 'Dissolve' : s === 2 ? 'Filter' : 'Evaporate'}</span>
                  </button>
                ))}
              </div>

              <span className="text-xs font-bold text-purple-700">
                Step {currentStage} of 3
              </span>
            </div>

            {/* Visual SVG Stage Display */}
            <div className="relative w-full h-[320px] bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-4">
              <svg viewBox="0 0 500 280" className="w-full h-full select-none">
                {/* Lab Bench */}
                <line x1="40" y1="240" x2="460" y2="240" stroke="#475569" strokeWidth="4" />

                {/* STAGE 1: DISSOLVING */}
                {currentStage === 1 && (
                  <g transform="translate(180, 70)">
                    {/* Beaker */}
                    <rect x="0" y="0" width="140" height="170" rx="4" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                    {/* Water with dissolved salt */}
                    <rect x="3" y="60" width="134" height="107" rx="2" fill="rgba(56, 189, 248, 0.25)" />
                    {/* Sand grains at bottom */}
                    <g transform="translate(10, 150)">
                      {[15, 30, 45, 60, 75, 90, 105].map((x, i) => (
                        <circle key={i} cx={x} cy={i % 2 === 0 ? 8 : 12} r="4" fill="#F59E0B" />
                      ))}
                    </g>
                    {/* Glass Stirring Rod */}
                    <line x1="30" y1="-20" x2="100" y2="130" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
                    <text x="70" y="195" fill="#E2E8F0" fontSize="12" fontWeight="bold" textAnchor="middle">
                      Beaker: Insoluble Sand + Salt Solution
                    </text>
                  </g>
                )}

                {/* STAGE 2: FILTRATION */}
                {currentStage === 2 && (
                  <g transform="translate(170, 40)">
                    {/* Conical Flask */}
                    <path
                      d="M 50,70 L 50,90 L 10,190 L 150,190 L 110,90 L 110,70 Z"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="3"
                    />
                    {/* Clear filtrate collecting in flask */}
                    <path d="M 25,160 L 10,190 L 150,190 L 135,160 Z" fill="rgba(56, 189, 248, 0.3)" />

                    {/* Filter Funnel sitting on flask neck */}
                    <polygon points="30,10 130,10 85,75 75,75" fill="none" stroke="#CBD5E1" strokeWidth="3" />
                    <rect x="75" y="75" width="10" height="35" fill="none" stroke="#CBD5E1" strokeWidth="2" />

                    {/* Filter Paper Cone (White) */}
                    <polygon points="35,15 125,15 80,70" fill="rgba(255, 255, 255, 0.15)" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 2" />

                    {/* Sand Residue trapped on filter paper */}
                    <circle cx="70" cy="40" r="4" fill="#F59E0B" />
                    <circle cx="85" cy="45" r="5" fill="#F59E0B" />
                    <circle cx="95" cy="38" r="4" fill="#F59E0B" />
                    <text x="145" y="42" fill="#F59E0B" fontSize="10" fontWeight="bold">Residue (Sand)</text>

                    {/* Dripping drops */}
                    <circle cx="80" cy="120" r="2.5" fill="#38BDF8">
                      <animate attributeName="cy" values="115;160" dur="0.9s" repeatCount="indefinite" />
                    </circle>

                    <text x="80" y="215" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">
                      Filtrate: Pure Salt Solution (NaCl in Water)
                    </text>
                  </g>
                )}

                {/* STAGE 3: EVAPORATION */}
                {currentStage === 3 && (
                  <g transform="translate(170, 50)">
                    {/* Tripod Stand */}
                    <line x1="40" y1="120" x2="20" y2="190" stroke="#64748B" strokeWidth="3" />
                    <line x1="120" y1="120" x2="140" y2="190" stroke="#64748B" strokeWidth="3" />
                    <line x1="40" y1="120" x2="120" y2="120" stroke="#94A3B8" strokeWidth="3" />

                    {/* Wire Gauze */}
                    <line x1="30" y1="118" x2="130" y2="118" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="2 2" />

                    {/* Evaporating Dish (Porcelain Basin) */}
                    <ellipse cx="80" cy="110" rx="45" ry="12" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
                    {/* Salt solution / crystals */}
                    {isEvaporated ? (
                      /* White salt crystals deposit */
                      <g transform="translate(55, 106)">
                        <rect x="0" y="0" width="8" height="5" rx="1" fill="#FFFFFF" />
                        <rect x="12" y="-2" width="9" height="6" rx="1" fill="#F8FAFC" />
                        <rect x="25" y="0" width="8" height="5" rx="1" fill="#FFFFFF" />
                        <rect x="38" y="-1" width="10" height="6" rx="1" fill="#F8FAFC" />
                      </g>
                    ) : (
                      <ellipse cx="80" cy="110" rx="35" ry="8" fill="rgba(56, 189, 248, 0.4)" />
                    )}

                    {/* Bunsen Burner below tripod */}
                    <rect x="70" y="150" width="20" height="40" rx="2" fill="#475569" stroke="#334155" strokeWidth="1" />
                    <rect x="60" y="185" width="40" height="6" rx="1" fill="#334155" />

                    {/* Dynamic Burner Flame */}
                    <path
                      d="M 75,150 Q 80,125 85,150 Z"
                      fill="#38BDF8"
                      opacity={burnerHeat / 100}
                    />
                    <path
                      d="M 77,150 Q 80,135 83,150 Z"
                      fill="#FEF08A"
                      opacity={burnerHeat / 100}
                    />

                    {/* Steam rising */}
                    <path d="M 70,95 Q 65,75 75,60" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 3" opacity="0.5">
                      <animate attributeName="opacity" values="0.2;0.7;0.2" dur="1.2s" repeatCount="indefinite" />
                    </path>
                    <path d="M 90,95 Q 95,75 85,60" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 3" opacity="0.6">
                      <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.2s" repeatCount="indefinite" />
                    </path>

                    <text x="80" y="215" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">
                      {isEvaporated ? 'Pure Dry NaCl Crystals Recovered!' : 'Boiling Off H2O Solvent'}
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Action Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">{STAGES[currentStage - 1].title}</p>
                <p className="text-[11px] text-slate-500 max-w-md">{STAGES[currentStage - 1].desc}</p>
              </div>

              <button
                onClick={handleNextStage}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{STAGES[currentStage - 1].action}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Technique Summary & Substance Analysis (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Separation Products Log
            </h3>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] text-amber-800 font-bold uppercase">Residue Recovered</span>
              <div className="text-sm font-bold text-amber-900 mt-0.5">Insoluble Sand (SiO2)</div>
              <p className="text-[11px] text-amber-700 mt-1">
                Particles &gt; 11 μm cannot pass through porous filter paper matrix.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
              <span className="text-[10px] text-purple-700 font-bold uppercase">Filtrate Crystal</span>
              <div className="text-sm font-bold text-purple-900 mt-0.5">Sodium Chloride (NaCl)</div>
              <p className="text-[11px] text-purple-600 mt-1">
                Recovered through boiling point difference: Water b.p. 100°C vs NaCl b.p. 1,465°C.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase tracking-wider">
              <span>Scientific Principle</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mixtures are physically combined substances whose components retain their individual physical properties (solubility, particle size, boiling points).
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Because no chemical bonds formed between sand, salt, and water, we can separate them using non-destructive physical techniques!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
