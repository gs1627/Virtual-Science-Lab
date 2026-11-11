import { useState } from 'react';
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Bot,
} from 'lucide-react';

const SCENARIOS = [
  {
    id: 'melting-ice',
    title: 'Melting Ice Cube',
    type: 'Physical Change',
    isChemical: false,
    summary: 'Solid ice absorbs ambient heat and melts into liquid water.',
    equation: 'H₂O(s) + heat → H₂O(l)',
    reversible: 'Yes (refreeze by cooling)',
    newSubstance: 'No (still H₂O molecules)',
    energyChange: 'Endothermic phase change',
    visualStateBefore: 'Solid translucent ice crystal (0°C)',
    visualStateAfter: 'Clear liquid pool of water',
    explanation:
      'Only the physical state of matter changed from solid to liquid. The molecular identity remains H2O with no chemical bonds broken or formed.',
  },
  {
    id: 'dissolving-sugar',
    title: 'Dissolving Sugar in Water',
    type: 'Physical Change',
    isChemical: false,
    summary: 'Granular sucrose dissolves homogeneously between water molecules.',
    equation: 'C₁₂H₂₂O₁₁(s) → C₁₂H₂₂O₁₁(aq)',
    reversible: 'Yes (evaporate water to recover sugar crystals)',
    newSubstance: 'No (sucrose molecules remain intact)',
    energyChange: 'Minimal thermal effect',
    visualStateBefore: 'Solid white sugar crystals in water',
    visualStateAfter: 'Uniform transparent sweet solution',
    explanation:
      'The sugar crystals disperse at the molecular level, but can be 100% recovered through physical evaporation.',
  },
  {
    id: 'rusting-nail',
    title: 'Rusting of an Iron Nail',
    type: 'Chemical Change',
    isChemical: true,
    summary: 'Iron reacts with oxygen and moisture over time to form hydrated iron oxide.',
    equation: '4Fe(s) + 3O₂(g) + 6H₂O(l) → 4Fe(OH)₃(s)',
    reversible: 'No (cannot un-rust by simple cooling or heating)',
    newSubstance: 'Yes (Iron(III) oxide rust, flaky reddish-brown)',
    energyChange: 'Exothermic (slow oxidation)',
    visualStateBefore: 'Shiny silver-grey steel nail',
    visualStateAfter: 'Flaky crumbly reddish-brown rust coating',
    explanation:
      'A brand new substance (rust) has formed through chemical bond restructuring. The original metallic iron cannot be recovered without a chemical blast furnace.',
  },
  {
    id: 'burning-paper',
    title: 'Burning a Strip of Paper',
    type: 'Chemical Change',
    isChemical: true,
    summary: 'Cellulose combustion releasing smoke, water vapor, and carbon ash.',
    equation: 'C₆H₁₀O₅(s) + 6O₂(g) → 6CO₂(g) + 5H₂O(g) + Ash',
    reversible: 'No (ashes cannot be turned back into paper)',
    newSubstance: 'Yes (Carbon ash, CO2 gas, water vapor)',
    energyChange: 'Highly exothermic (releases light and heat flame)',
    visualStateBefore: 'White flexible cellulose paper sheet',
    visualStateAfter: 'Fragile grey-black carbon ash and smoke',
    explanation:
      'Combustion completely broke the cellulose covalent bonds. Carbon dioxide and water vapor escaped into the air, creating totally new substances.',
  },
  {
    id: 'baking-soda-vinegar',
    title: 'Baking Soda + Vinegar',
    type: 'Chemical Change',
    isChemical: true,
    summary: 'Acid-base neutralization with vigorous carbon dioxide effervescence.',
    equation: 'NaHCO₃(s) + CH₃COOH(aq) → CH₃COONa + H₂O + CO₂(g)↑',
    reversible: 'No (carbon dioxide gas is liberated)',
    newSubstance: 'Yes (Sodium acetate salt, water, and CO2 gas)',
    energyChange: 'Endothermic (temperature of solution drops)',
    visualStateBefore: 'Clear liquid vinegar and white powder',
    visualStateAfter: 'Vigorous bubbling foam with gas release',
    explanation:
      'New chemical bonds formed, producing sodium acetate, liquid water, and bubbling CO2 gas. The temperature noticeably drops.',
  },
];

export default function PhysicalChemicalChangesExperiment() {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [isReacted, setIsReacted] = useState(false);
  const [userGuess, setUserGuess] = useState(null); // 'physical' | 'chemical'

  const currentScenario = SCENARIOS[selectedScenarioIndex];

  const handleSelectScenario = (idx) => {
    setSelectedScenarioIndex(idx);
    setIsReacted(false);
    setUserGuess(null);
  };

  const handleTriggerReaction = () => {
    setIsReacted(true);
  };

  const handleGuess = (guess) => {
    setUserGuess(guess);
    setIsReacted(true);
  };

  const handleReset = () => {
    setSelectedScenarioIndex(0);
    setIsReacted(false);
    setUserGuess(null);
  };

  return (
    <div className="w-full flex flex-col space-y-5">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>Physical vs. Chemical Changes Laboratory</span>
          </h2>
          <p className="text-xs text-slate-500">
            Compare 5 real-world transformations to identify whether a new substance is formed and if the process is reversible.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Lab</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT / CENTER: Interactive Demonstration Stage (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            {/* Scenarios Selector Bar */}
            <div className="mb-4 pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Select Transformation Station:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {SCENARIOS.map((sc, idx) => (
                  <button
                    key={sc.id}
                    onClick={() => handleSelectScenario(idx)}
                    className={`p-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center min-h-[60px] ${
                      selectedScenarioIndex === idx
                        ? 'bg-purple-50 border-purple-400 text-purple-900 shadow-xs ring-2 ring-purple-100'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-[11px] font-bold leading-tight">{sc.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Animation / Graphic Chamber */}
            <div className="relative w-full h-[280px] bg-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4">
              <svg viewBox="0 0 500 240" className="w-full h-full select-none">
                {/* Stage Table */}
                <line x1="50" y1="200" x2="450" y2="200" stroke="#475569" strokeWidth="4" />

                {/* SCENARIO 0: MELTING ICE */}
                {selectedScenarioIndex === 0 && (
                  <g transform="translate(200, 110)">
                    {isReacted ? (
                      /* Melted water puddle */
                      <ellipse cx="50" cy="85" rx="70" ry="12" fill="rgba(56, 189, 248, 0.4)" stroke="#38BDF8" strokeWidth="2" />
                    ) : (
                      /* Solid ice cube */
                      <rect x="20" y="40" width="60" height="50" rx="6" fill="rgba(186, 230, 253, 0.7)" stroke="#38BDF8" strokeWidth="2" />
                    )}
                    <text x="50" y="115" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">
                      {isReacted ? 'Liquid Water Pool (H2O)' : 'Solid Ice Crystal (0°C)'}
                    </text>
                  </g>
                )}

                {/* SCENARIO 1: DISSOLVING SUGAR */}
                {selectedScenarioIndex === 1 && (
                  <g transform="translate(200, 80)">
                    {/* Beaker */}
                    <rect x="0" y="0" width="100" height="120" rx="4" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                    <rect x="3" y="30" width="94" height="87" rx="2" fill="rgba(56, 189, 248, 0.2)" />
                    {isReacted ? (
                      /* Homogeneous clear solution with dissolved sugar molecules */
                      <g>
                        <circle cx="30" cy="50" r="2" fill="#E2E8F0" opacity="0.6" />
                        <circle cx="70" cy="70" r="2" fill="#E2E8F0" opacity="0.6" />
                        <circle cx="50" cy="90" r="2" fill="#E2E8F0" opacity="0.6" />
                      </g>
                    ) : (
                      /* Visible white sugar grains at bottom */
                      <g transform="translate(10, 100)">
                        {[15, 30, 45, 60, 75].map((x, i) => (
                          <circle key={i} cx={x} cy={8} r="4" fill="#FFFFFF" />
                        ))}
                      </g>
                    )}
                    <text x="50" y="145" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">
                      {isReacted ? 'Homogeneous Sugar Solution' : 'Sugar Crystals in Water'}
                    </text>
                  </g>
                )}

                {/* SCENARIO 2: RUSTING NAIL */}
                {selectedScenarioIndex === 2 && (
                  <g transform="translate(150, 120)">
                    {/* Steel Nail */}
                    <rect
                      x="0"
                      y="50"
                      width="200"
                      height="16"
                      rx="2"
                      fill={isReacted ? '#92400E' : '#94A3B8'}
                      stroke={isReacted ? '#78350F' : '#64748B'}
                      strokeWidth="2"
                    />
                    {/* Nail Head */}
                    <rect
                      x="-8"
                      y="42"
                      width="10"
                      height="32"
                      rx="2"
                      fill={isReacted ? '#78350F' : '#64748B'}
                    />
                    {/* Flaky rust particles when reacted */}
                    {isReacted && (
                      <g fill="#B45309">
                        <circle cx="40" cy="45" r="4" />
                        <circle cx="100" cy="43" r="5" />
                        <circle cx="160" cy="46" r="4" />
                      </g>
                    )}
                    <text x="100" y="95" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">
                      {isReacted ? 'Iron(III) Oxide Rust Coating (Fe2O3·nH2O)' : 'Clean Shiny Steel Nail (Fe)'}
                    </text>
                  </g>
                )}

                {/* SCENARIO 3: BURNING PAPER */}
                {selectedScenarioIndex === 3 && (
                  <g transform="translate(190, 80)">
                    {isReacted ? (
                      /* Crumbly black carbon ash + smoke */
                      <g>
                        <ellipse cx="60" cy="115" rx="45" ry="8" fill="#334155" />
                        <circle cx="45" cy="112" r="6" fill="#1E293B" />
                        <circle cx="75" cy="114" r="5" fill="#1E293B" />
                        {/* Rising Smoke particles */}
                        <circle cx="60" cy="80" r="10" fill="#64748B" opacity="0.4" />
                        <circle cx="50" cy="50" r="14" fill="#64748B" opacity="0.3" />
                      </g>
                    ) : (
                      /* Intact white paper sheet */
                      <g>
                        <rect x="20" y="20" width="80" height="100" rx="3" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
                        <line x1="30" y1="40" x2="90" y2="40" stroke="#94A3B8" strokeWidth="2" />
                        <line x1="30" y1="60" x2="80" y2="60" stroke="#94A3B8" strokeWidth="2" />
                      </g>
                    )}
                    <text x="60" y="145" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">
                      {isReacted ? 'Carbon Ash, CO2 & Water Vapor' : 'Pure Cellulose Sheet'}
                    </text>
                  </g>
                )}

                {/* SCENARIO 4: BAKING SODA + VINEGAR */}
                {selectedScenarioIndex === 4 && (
                  <g transform="translate(190, 80)">
                    <rect x="0" y="0" width="120" height="120" rx="4" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                    <rect x="3" y="50" width="114" height="67" rx="2" fill="rgba(56, 189, 248, 0.25)" />
                    {isReacted && (
                      /* Vigorous foam & effervescence bubbles */
                      <g>
                        <ellipse cx="60" cy="50" rx="50" ry="12" fill="#FFFFFF" opacity="0.8" />
                        <circle cx="35" cy="40" r="5" fill="#FFFFFF" opacity="0.7" />
                        <circle cx="65" cy="35" r="7" fill="#FFFFFF" opacity="0.8" />
                        <circle cx="85" cy="42" r="6" fill="#FFFFFF" opacity="0.7" />
                      </g>
                    )}
                    <text x="60" y="145" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">
                      {isReacted ? 'Effervescent CO2 Gas + Sodium Acetate' : 'Vinegar + Baking Soda Reagents'}
                    </text>
                  </g>
                )}
              </svg>

              {/* Trigger Transformation Button */}
              {!isReacted && (
                <div className="absolute bottom-4">
                  <button
                    onClick={handleTriggerReaction}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Trigger Transformation</span>
                  </button>
                </div>
              )}
            </div>

            {/* Interactive Student Classification Question */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                Challenge: Classify this transformation:
              </span>

              <div className="flex gap-3">
                <button
                  onClick={() => handleGuess('physical')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    userGuess === 'physical'
                      ? !currentScenario.isChemical
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-xs'
                        : 'bg-red-50 border-red-300 text-red-800'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>Physical Change</span>
                  {userGuess === 'physical' && (!currentScenario.isChemical ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />)}
                </button>

                <button
                  onClick={() => handleGuess('chemical')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    userGuess === 'chemical'
                      ? currentScenario.isChemical
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-xs'
                        : 'bg-red-50 border-red-300 text-red-800'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>Chemical Change</span>
                  {userGuess === 'chemical' && (currentScenario.isChemical ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />)}
                </button>
              </div>

              {userGuess && (
                <div className={`mt-3 p-3 rounded-xl border text-xs leading-relaxed ${
                  (userGuess === 'chemical' && currentScenario.isChemical) || (userGuess === 'physical' && !currentScenario.isChemical)
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}>
                  <p>{currentScenario.explanation}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Checklist & Criteria Table (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Diagnostic Criteria Checklist
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">New Substance Formed?</span>
                <span className="font-bold text-slate-900">{currentScenario.newSubstance}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Reversibility</span>
                <span className="font-bold text-slate-900">{currentScenario.reversible}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Chemical Equation</span>
                <span className="font-mono text-xs font-bold text-purple-700">{currentScenario.equation}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase tracking-wider">
              <Bot className="w-4 h-4" />
              <span>General Rule of Thumb</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Physical changes</strong> alter physical state, shape, or particle separation without creating new chemical formulas ($H_2O$ solid $\leftrightarrow$ liquid).
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Chemical changes</strong> break chemical bonds and form entirely new substances with distinct chemical identities, often accompanied by color shifts, gas release, or significant temperature changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
