// Educational data and challenges for Ohm's Law Virtual Laboratory

export const OHMS_TERMS = {
  voltage: {
    id: 'voltage',
    name: 'Voltage (Potential Difference)',
    symbol: 'V',
    unit: 'Volts (V)',
    summary: 'The electric pressure or potential difference that drives electric charges through a conductor.',
    detailed:
      'Voltage represents the energy transferred per unit charge (1 Volt = 1 Joule per Coulomb). It is created by a power supply or battery between two points. A higher voltage exerts a stronger electromotive force, propelling more electrons through the circuit.',
    formula: 'V = W / Q = I × R',
    tip: 'Think of voltage as the water pressure in a pipe: higher pressure pushes water through faster.',
  },
  current: {
    id: 'current',
    name: 'Electric Current',
    symbol: 'I',
    unit: 'Amperes (A) or Milliamperes (mA)',
    summary: 'The rate at which electric charge flows past a specific point in a complete circuit.',
    detailed:
      'Current measures the flow of electric charge over time (1 Ampere = 1 Coulomb of charge per second). In metal wires, current is physically the movement of free conduction electrons moving from the negative to positive terminal, though conventional current is defined from positive to negative.',
    formula: 'I = Q / t = V / R',
    tip: '1 Ampere (A) = 1,000 Milliamperes (mA).',
  },
  resistance: {
    id: 'resistance',
    name: 'Electrical Resistance',
    symbol: 'R',
    unit: 'Ohms (Ω)',
    summary: 'The opposition that a material or component presents to the flow of electric current.',
    detailed:
      'When electrons travel through a conductor, they collide with atoms in the crystal lattice. These collisions impede electron flow and convert electrical potential energy into thermal energy (heat). Factors determining resistance include material resistivity (ρ), length (L), and cross-sectional area (A).',
    formula: 'R = V / I = ρL / A',
    tip: 'A resistor with higher ohms opposes current more strongly, reducing the total current.',
  },
  'ohms-law': {
    id: 'ohms-law',
    name: "Ohm's Law",
    symbol: 'V = IR',
    unit: 'Governing Law',
    summary: 'The electric current through a conductor between two points is directly proportional to the voltage across the two points, provided temperature remains constant.',
    detailed:
      'Discovered by German physicist Georg Simon Ohm in 1827. For an "ohmic" conductor, the ratio of voltage to current is constant and equals the resistance: V / I = R. If resistance is fixed, doubling voltage doubles current. If voltage is fixed, doubling resistance halves current.',
    formula: 'V = I × R ⟺ I = V / R ⟺ R = V / I',
    tip: 'Use the Ohm Triangle: cover the variable you want to solve for!',
  },
  ammeter: {
    id: 'ammeter',
    name: 'Ammeter',
    symbol: 'A',
    unit: 'Instrument',
    summary: 'An instrument used to measure the electric current flowing through a circuit branch.',
    detailed:
      'An ammeter must always be connected IN SERIES with the component being measured so that all the current flows directly through the meter. An ideal ammeter has zero internal resistance (0 Ω) so it does not alter the circuit current.',
    formula: 'Connected in Series (R_meter ≈ 0 Ω)',
    tip: 'Never connect an ammeter in parallel across a power source; this would cause a dangerous short circuit!',
  },
  voltmeter: {
    id: 'voltmeter',
    name: 'Voltmeter',
    symbol: 'V',
    unit: 'Instrument',
    summary: 'An instrument used to measure the electrical potential difference between two points.',
    detailed:
      'A voltmeter is always connected IN PARALLEL across the component whose voltage drop is being measured. An ideal voltmeter has infinitely high internal resistance (R_meter → ∞) so that virtually no current diverts away from the main circuit.',
    formula: 'Connected in Parallel (R_meter ≈ ∞)',
    tip: 'Voltmeter probes touch the entrance and exit of the component without breaking the wire.',
  },
  'series-connection': {
    id: 'series-connection',
    name: 'Series Connection',
    symbol: 'R_total = R₁ + R₂ + ...',
    unit: 'Circuit Topology',
    summary: 'Components arranged in a single continuous path so the exact same current flows through each.',
    detailed:
      'In a series circuit, there is only one pathway for charge. If any component or switch opens, the entire circuit stops conducting. The total resistance is the sum of individual resistances, and the total voltage is divided across the components.',
    formula: 'I_total = I₁ = I₂ = ... | V_total = V₁ + V₂ + ...',
    tip: 'Ammeters are placed in series so they sample 100% of the circuit current.',
  },
  'parallel-connection': {
    id: 'parallel-connection',
    name: 'Parallel Connection',
    symbol: '1/R_total = 1/R₁ + 1/R₂',
    unit: 'Circuit Topology',
    summary: 'Components connected across the same two common electrical nodes, sharing the same voltage.',
    detailed:
      'In a parallel circuit, each branch experiences the identical potential difference (voltage), but the total current divides among the branches according to their resistances. If one branch is disconnected, other branches continue operating.',
    formula: 'V_total = V₁ = V₂ | I_total = I₁ + I₂',
    tip: 'Voltmeters are placed in parallel across components to measure the potential difference across their terminals.',
  },
};

export const OHMS_CHALLENGES = [
  {
    id: 1,
    title: 'Challenge 1: Basic Ohm’s Law Prediction',
    scenario: 'Set the power supply to 10 V and configure the resistor to 5 Ω. What will the ammeter read when the switch is closed?',
    targetVoltage: 10,
    targetResistance: 5,
    options: [
      { id: 'a', text: '0.5 A (500 mA)', isCorrect: false },
      { id: 'b', text: '2.0 A (2000 mA)', isCorrect: true },
      { id: 'c', text: '50.0 A', isCorrect: false },
      { id: 'd', text: '15.0 A', isCorrect: false },
    ],
    explanation:
      'Using Ohm’s Law: I = V / R = 10 V / 5 Ω = 2.0 A. When voltage is twice the resistance, two amperes of current flow through the loop.',
  },
  {
    id: 2,
    title: 'Challenge 2: Effect of Doubling Resistance',
    scenario: 'Keep the voltage constant at 10 V and double the resistance from 10 Ω to 20 Ω. What happens to the circuit current?',
    targetVoltage: 10,
    targetResistance: 20,
    options: [
      { id: 'a', text: 'Current doubles from 1.0 A to 2.0 A', isCorrect: false },
      { id: 'b', text: 'Current remains exactly 1.0 A', isCorrect: false },
      { id: 'c', text: 'Current is halved from 1.0 A to 0.5 A', isCorrect: true },
      { id: 'd', text: 'Current drops instantly to zero', isCorrect: false },
    ],
    explanation:
      'Current is inversely proportional to resistance (I ∝ 1/R). At 10 V and 10 Ω, I = 1.0 A. Doubling resistance to 20 Ω doubles the opposition to charge flow, halving current to 10 V / 20 Ω = 0.5 A.',
  },
  {
    id: 3,
    title: 'Challenge 3: Effect of Doubling Voltage',
    scenario: 'Keep the resistance constant at 10 Ω and double the voltage from 5 V to 10 V. What happens to the circuit current?',
    targetVoltage: 10,
    targetResistance: 10,
    options: [
      { id: 'a', text: 'Current doubles from 0.5 A to 1.0 A', isCorrect: true },
      { id: 'b', text: 'Current is halved to 0.25 A', isCorrect: false },
      { id: 'c', text: 'Current remains unchanged at 0.5 A', isCorrect: false },
      { id: 'd', text: 'Resistance increases to 20 Ω', isCorrect: false },
    ],
    explanation:
      'Current is directly proportional to voltage (I ∝ V). Doubling the electromotive force with constant resistance doubles the rate of charge flow: 5V/10Ω = 0.5A → 10V/10Ω = 1.0A.',
  },
  {
    id: 4,
    title: 'Challenge 4: Voltage Calibration for Target Current',
    scenario: 'You have a fixed 10 Ω resistor. What voltage must the DC power supply deliver to produce exactly 1.0 A of current?',
    targetVoltage: 10,
    targetResistance: 10,
    options: [
      { id: 'a', text: '1 V', isCorrect: false },
      { id: 'b', text: '5 V', isCorrect: false },
      { id: 'c', text: '10 V', isCorrect: true },
      { id: 'd', text: '100 V', isCorrect: false },
    ],
    explanation:
      'Rearranging Ohm’s Law for voltage: V = I × R = 1.0 A × 10 Ω = 10 V. Delivering 10 volts creates the exact potential gradient needed to produce 1 ampere through 10 ohms.',
  },
];

export const REAL_WORLD_APPS = [
  {
    title: 'Smartphone & USB Chargers',
    description: 'Regulate voltage and internal resistance to safely deliver fast charging currents (e.g. 5V at 2A = 10W or 9V at 2.22A = 20W) without overheating.',
  },
  {
    title: 'Electric Heaters & Toasters',
    description: 'Nichrome heating elements are engineered with calibrated resistance to convert electrical current directly into thermal heat (P = I²R).',
  },
  {
    title: 'Circuit Breakers & Fuses',
    description: 'Fuses contain thin wires with specific current limits; if voltage spikes or resistance drops causing excess current, the fuse melts to protect appliances.',
  },
  {
    title: 'Volume & Brightness Knobs (Potentiometers)',
    description: 'Rotary dials change the length of a resistive strip, smoothly altering resistance to vary audio amplifier current or LED dimmer brightness.',
  },
];

