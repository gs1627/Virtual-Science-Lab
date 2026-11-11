import { GitCompare, Sparkles } from 'lucide-react';
import { calculateRateMultiplier } from './reactionRateData';

export default function ReactionRateComparison({
  vesselA,
  vesselB,
}) {
  const rateA = calculateRateMultiplier(vesselA);
  const rateB = calculateRateMultiplier(vesselB);

  const ratio = rateA > 0 ? (rateB / rateA).toFixed(2) : '1.00';
  const isBFaster = rateB > rateA;
  const isEqual = Math.abs(rateA - rateB) < 0.1;

  // Generate scientific comparison explanation
  const getScientificExplanation = () => {
    const reasons = [];

    // Temperature difference
    if (vesselB.temperature !== vesselA.temperature) {
      const deltaT = vesselB.temperature - vesselA.temperature;
      reasons.push(
        `Temperature differs by ${deltaT > 0 ? `+${deltaT}` : deltaT}°C (${vesselA.temperature}°C vs ${vesselB.temperature}°C). By the Arrhenius equation (k = A e^(-Ea/RT)), a 10°C increase roughly doubles the fraction of reactant molecules possessing kinetic energy greater than or equal to the activation energy barrier Ea.`
      );
    }

    // Concentration difference
    if (vesselB.concentration !== vesselA.concentration) {
      reasons.push(
        `Hydrochloric acid concentration differs (${vesselA.concentration.toFixed(1)}M vs ${vesselB.concentration.toFixed(1)}M). Higher concentration increases particle density per unit volume, multiplying the frequency of successful collisions with solid CaCO₃.`
      );
    }

    // Surface area difference
    if (vesselB.surfaceArea !== vesselA.surfaceArea) {
      reasons.push(
        `Physical surface area differs (${vesselA.surfaceArea} vs ${vesselB.surfaceArea}). Crushing marble chips into fine powder exposes vast internal particle sites (~2.6x surface area), allowing far more simultaneous collisions.`
      );
    }

    // Catalyst difference
    if (vesselB.hasCatalyst !== vesselA.hasCatalyst) {
      reasons.push(
        `Catalytic activation differs. The catalyst provides an alternative reaction pathway with lower activation energy without being consumed.`
      );
    }

    if (reasons.length === 0) {
      return 'Flask A and Flask B are configured with identical kinetic parameters. Both vessels will react at the exact same rate.';
    }

    return reasons.join(' ');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-purple-600" />
          <span>Comparative Chemical Kinetics: Flask A vs Flask B</span>
        </h3>

        <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs">
          {isEqual
            ? 'Equal Reaction Rates (1.00×)'
            : isBFaster
            ? `Flask B is ${ratio}× Faster`
            : `Flask A is ${(rateA / rateB).toFixed(2)}× Faster`}
        </span>
      </div>

      {/* Unified Comparison Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Flask A Station Summary */}
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs space-y-2.5">
          <div className="flex items-center justify-between font-bold text-blue-950">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Flask A (Control)
            </span>
            <span className="font-mono text-xs text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
              k = {rateA.toFixed(1)}×
            </span>
          </div>

          <div className="space-y-1.5 text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Temperature:</span>
              <strong className="font-mono">{vesselA.temperature}°C</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Acid [HCl]:</span>
              <strong className="font-mono">{vesselA.concentration.toFixed(1)} M</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Solid State:</span>
              <strong className="capitalize">{vesselA.surfaceArea}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Catalyst:</span>
              <strong>{vesselA.hasCatalyst ? 'Active ✓' : 'None'}</strong>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-blue-200/80 text-blue-950 font-bold">
              <span>Gas Collected:</span>
              <span className="font-mono text-blue-800">{vesselA.gasVolume.toFixed(1)} mL ({vesselA.elapsedTime.toFixed(1)}s)</span>
            </div>
          </div>
        </div>

        {/* Flask B Station Summary */}
        <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 text-xs space-y-2.5">
          <div className="flex items-center justify-between font-bold text-purple-950">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Flask B (Comparison)
            </span>
            <span className="font-mono text-xs text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200">
              k = {rateB.toFixed(1)}×
            </span>
          </div>

          <div className="space-y-1.5 text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Temperature:</span>
              <strong className="font-mono">{vesselB.temperature}°C</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Acid [HCl]:</span>
              <strong className="font-mono">{vesselB.concentration.toFixed(1)} M</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Solid State:</span>
              <strong className="capitalize">{vesselB.surfaceArea}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Catalyst:</span>
              <strong>{vesselB.hasCatalyst ? 'Active ✓' : 'None'}</strong>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-purple-200/80 text-purple-950 font-bold">
              <span>Gas Collected:</span>
              <span className="font-mono text-purple-800">{vesselB.gasVolume.toFixed(1)} mL ({vesselB.elapsedTime.toFixed(1)}s)</span>
            </div>
          </div>
        </div>

        {/* Delta Comparison & Velocity Factor */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between font-bold text-emerald-950">
            <span>Kinetics Delta (Δ)</span>
            <span className="font-mono text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
              Ratio: {ratio}×
            </span>
          </div>

          <div className="space-y-1.5 text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Temp Delta:</span>
              <strong className="font-mono">
                {vesselB.temperature - vesselA.temperature > 0 ? `+` : ''}
                {vesselB.temperature - vesselA.temperature}°C
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Conc Delta:</span>
              <strong className="font-mono">
                {vesselB.concentration - vesselA.concentration > 0 ? `+` : ''}
                {(vesselB.concentration - vesselA.concentration).toFixed(1)} M
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Gas Lead:</span>
              <strong className="font-mono text-emerald-800">
                {(vesselB.gasVolume - vesselA.gasVolume).toFixed(1)} mL
              </strong>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-200 text-[11px] text-emerald-900 font-bold">
            {isEqual
              ? 'Both reactions proceeding in unison.'
              : isBFaster
              ? `Flask B is generating CO₂ at ${ratio}× the speed of Flask A.`
              : `Flask A is generating CO₂ at ${(rateA / rateB).toFixed(2)}× the speed of Flask B.`}
          </div>
        </div>
      </div>

      {/* Scientific Explanation Card */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-1">
        <strong className="text-purple-900 block flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          Collision Theory &amp; Arrhenius Dynamics:
        </strong>
        <p>{getScientificExplanation()}</p>
      </div>
    </div>
  );
}
