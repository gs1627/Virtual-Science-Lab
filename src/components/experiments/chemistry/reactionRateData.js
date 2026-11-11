// Kinetics and reaction parameters for Reaction Rate Experiment

export const REACTION_INFO = {
  equation: 'CaCO₃(s) + 2HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g)↑',
  title: 'Calcium Carbonate & Hydrochloric Acid Kinetics',
  description:
    'Solid calcium carbonate marble reacts with aqueous hydrochloric acid to produce calcium chloride solution, water, and effervescent carbon dioxide gas collected in a gas syringe.',
};

export const INITIAL_VESSEL_STATE = {
  temperature: 20, // Celsius (15 to 75)
  concentration: 1.0, // Molar (0.5 to 3.0 M)
  surfaceArea: 'lumps', // 'lumps' | 'powder'
  hasCatalyst: false,
  hasThermometer: true,
  gasVolume: 0, // mL (0 to 100)
  elapsedTime: 0, // seconds
  isRunning: false,
  isCompleted: false,
};

// Calculate kinetic rate multiplier k based on Arrhenius and collision theory
export function calculateRateMultiplier(state) {
  const { temperature, concentration, surfaceArea, hasCatalyst } = state;
  // Arrhenius temperature factor: approximately doubles every 10 deg C above 20 deg C
  const tempFactor = Math.pow(1.85, (temperature - 20) / 10);
  // Concentration factor: rate scales with [HCl]^1.2
  const concFactor = Math.pow(concentration, 1.2);
  // Surface area: fine powder exposes ~2.5x more reactive surface sites than chips
  const surfaceFactor = surfaceArea === 'powder' ? 2.6 : 1.0;
  // Catalyst: lowers activation energy barrier, speeding up reaction by ~2.0x
  const catFactor = hasCatalyst ? 2.0 : 1.0;

  return 1.6 * tempFactor * concFactor * surfaceFactor * catFactor;
}

export const INVESTIGATION_PRESETS = [
  {
    id: 'temp',
    title: 'Investigation 1: Effect of Temperature',
    desc: 'Compare cold reaction (20°C) with heated reaction (50°C). Constant 1.0M HCl and marble chips.',
    vesselA: { temperature: 20, concentration: 1.0, surfaceArea: 'lumps', hasCatalyst: false },
    vesselB: { temperature: 50, concentration: 1.0, surfaceArea: 'lumps', hasCatalyst: false },
    hypothesis: 'Higher temperature gives particles more kinetic energy, increasing collision frequency and fraction exceeding Ea.',
  },
  {
    id: 'conc',
    title: 'Investigation 2: Effect of Concentration',
    desc: 'Compare dilute 0.5M HCl with concentrated 2.5M HCl at constant 25°C with marble chips.',
    vesselA: { temperature: 25, concentration: 0.5, surfaceArea: 'lumps', hasCatalyst: false },
    vesselB: { temperature: 25, concentration: 2.5, surfaceArea: 'lumps', hasCatalyst: false },
    hypothesis: 'More reactant particles per unit volume dramatically increases the frequency of collisions between H⁺ and CaCO₃.',
  },
  {
    id: 'surface',
    title: 'Investigation 3: Effect of Surface Area',
    desc: 'Compare large solid marble chips with fine crushed powder at constant 25°C and 1.0M HCl.',
    vesselA: { temperature: 25, concentration: 1.0, surfaceArea: 'lumps', hasCatalyst: false },
    vesselB: { temperature: 25, concentration: 1.0, surfaceArea: 'powder', hasCatalyst: false },
    hypothesis: 'Powder exposes internal atoms to the acid, providing vastly more collision sites per second.',
  },
  {
    id: 'catalyst',
    title: 'Investigation 4: Effect of Catalyst',
    desc: 'Compare reaction without catalyst to reaction with catalyst added at constant 20°C and 1.0M HCl.',
    vesselA: { temperature: 20, concentration: 1.0, surfaceArea: 'lumps', hasCatalyst: false },
    vesselB: { temperature: 20, concentration: 1.0, surfaceArea: 'lumps', hasCatalyst: true },
    hypothesis: 'Catalyst provides an alternative reaction pathway with lower activation energy without being consumed.',
  },
];

