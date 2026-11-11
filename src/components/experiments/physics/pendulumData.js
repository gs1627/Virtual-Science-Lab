// Educational data, gravity environments, and tasks for Simple Pendulum Virtual Lab

export const GRAVITY_PRESETS = {
  earth: {
    id: 'earth',
    name: 'Earth (Standard)',
    value: 9.8,
    symbol: 'g_earth',
    unit: '9.80 m/s²',
    description: 'Standard sea-level terrestrial gravity. Restoring force drives standard harmonic oscillation.',
    color: '#3b82f6',
  },
  moon: {
    id: 'moon',
    name: 'Moon',
    value: 1.62,
    symbol: 'g_moon',
    unit: '1.62 m/s²',
    description: 'Lunar gravity is approximately 1/6th of Earth. The weak restoring force causes slow, graceful swinging.',
    color: '#94a3b8',
  },
  jupiter: {
    id: 'jupiter',
    name: 'Jupiter',
    value: 24.79,
    symbol: 'g_jupiter',
    unit: '24.79 m/s²',
    description: 'Immense gas giant gravity (~2.53× Earth). The strong gravitational pull accelerates oscillations rapidly.',
    color: '#f59e0b',
  },
};

export const PENDULUM_TERMS = {
  'simple-pendulum': {
    id: 'simple-pendulum',
    name: 'Simple Pendulum',
    summary: 'An idealized mechanical system consisting of a point mass (bob) suspended from a frictionless pivot by a light, inextensible string.',
    detailed:
      'When displaced sideways from its resting equilibrium position and released, the restoring force due to gravity causes the pendulum to oscillate back and forth about its mean position in periodic harmonic motion.',
    formula: 'T = 2π√(L / g)',
  },
  bob: {
    id: 'bob',
    name: 'Pendulum Bob',
    summary: 'The dense metallic weight suspended at the free end of the pendulum string.',
    detailed:
      'The mass of the bob does NOT affect the time period of oscillation! Because both gravitational pull (F = mg) and inertial resistance to acceleration (F = ma) are directly proportional to mass (m), the mass cancels out completely in the equation of motion.',
    formula: 'Mass Independence: T does not depend on m',
  },
  string: {
    id: 'string',
    name: 'Suspension String',
    summary: 'The flexible, lightweight cord connecting the fixed pivot to the center of mass of the bob.',
    detailed:
      'In ideal physics calculations, the string is assumed to be massless and inextensible (does not stretch). The effective length L is measured precisely from the pivot point to the center of gravity of the bob.',
    formula: 'Effective Length L = string length + r_bob',
  },
  'mean-position': {
    id: 'mean-position',
    name: 'Mean Position (Equilibrium)',
    summary: 'The central resting point where the suspended pendulum hangs vertically motionless.',
    detailed:
      'At the mean position, the net horizontal force on the bob is zero. As the bob swings through the mean position, its potential energy is at a minimum while its kinetic energy and velocity reach their maximum values.',
    formula: 'θ = 0° | Maximum Velocity v_max = √(2gL(1 - cos θ₀))',
  },
  'extreme-position': {
    id: 'extreme-position',
    name: 'Extreme Position',
    summary: 'The highest points of the swing on either side of the mean position where the bob momentarily comes to a halt.',
    detailed:
      'At the extreme position, instantaneous velocity drops to zero (v = 0) as kinetic energy is completely converted into gravitational potential energy. The restoring force and acceleration back toward the center are at their maximum.',
    formula: 'v = 0 | Maximum Restoring Force F_net = -mg sin θ₀',
  },
  amplitude: {
    id: 'amplitude',
    name: 'Amplitude (θ₀)',
    summary: 'The maximum angular or linear displacement of the bob from its central mean equilibrium position.',
    detailed:
      'For small angular amplitudes (typically θ₀ < 15° or ~0.26 rad), the period of oscillation is virtually independent of amplitude—a fundamental principle called isochronism discovered by Galileo Galilei.',
    formula: 'Small Angle: sin θ ≈ θ (in radians)',
  },
  oscillation: {
    id: 'oscillation',
    name: 'Oscillation (Cycle)',
    summary: 'One complete back-and-forth swing of the bob.',
    detailed:
      'One complete oscillation starts from an extreme position, travels through the mean position to the opposite extreme, and returns all the way back to the starting extreme position.',
    formula: '1 Cycle = Extreme A ➔ Mean ➔ Extreme B ➔ Mean ➔ Extreme A',
  },
  'time-period': {
    id: 'time-period',
    name: 'Time Period (T)',
    summary: 'The time taken by the pendulum to complete exactly one full oscillation.',
    detailed:
      'The time period depends only on two physical parameters: the length of the string L and local acceleration due to gravity g. Doubling the length increases period by a factor of √2 (~1.414).',
    formula: 'T = 2π√(L / g)',
  },
  frequency: {
    id: 'frequency',
    name: 'Frequency (f)',
    summary: 'The number of complete oscillations executed per unit time (seconds).',
    detailed:
      'Frequency is the reciprocal of the time period. Measured in Hertz (Hz), where 1 Hz represents one complete oscillation per second.',
    formula: 'f = 1 / T = (1 / 2π) √(g / L)',
  },
  'effect-of-length': {
    id: 'effect-of-length',
    name: 'Effect of Length',
    summary: 'Time period is directly proportional to the square root of the pendulum length (T ∝ √L).',
    detailed:
      'A longer pendulum has greater rotational inertia and sweeps through a longer arc, requiring more time to complete each swing. To double the time period (2T), the length must be increased fourfold (4L).',
    formula: 'T₁ / T₂ = √(L₁ / L₂)',
  },
  'effect-of-gravity': {
    id: 'effect-of-gravity',
    name: 'Effect of Gravity',
    summary: 'Time period is inversely proportional to the square root of gravitational acceleration (T ∝ 1/√g).',
    detailed:
      'On a planet with weaker gravity like the Moon, the restoring force is small, so the pendulum swings much more slowly. On massive planets like Jupiter, strong gravity accelerates the bob quickly, making the period shorter.',
    formula: 'T₁ / T₂ = √(g₂ / g₁)',
  },
  'small-angle-approximation': {
    id: 'small-angle-approximation',
    name: 'Small-Angle Approximation',
    summary: 'The mathematical simplification sin θ ≈ θ that enables true simple harmonic motion.',
    detailed:
      'When the swing angle θ is small (< 15°), the restoring force F = -mg sin θ can be approximated as F ≈ -mg θ. This linearizes the differential equation into true simple harmonic motion. At larger angles (e.g. 45°), the actual period is slightly longer than predicted by T = 2π√(L/g) by a factor of (1 + (1/16)θ₀²).',
    formula: 'sin θ ≈ θ - θ³/6 + ...',
  },
};

export const PENDULUM_TASKS = [
  {
    id: 1,
    title: 'Task 1: Period on Earth (L = 50 cm)',
    prompt: 'Configure a pendulum of length 50 cm (0.50 m) on Earth (g = 9.80 m/s²). Calculate or observe its theoretical time period T.',
    targetLength: 50,
    targetGravity: 'earth',
    targetAngle: 15,
    options: [
      { id: 'a', text: '0.71 s', isCorrect: false },
      { id: 'b', text: '1.42 s', isCorrect: true },
      { id: 'c', text: '2.01 s', isCorrect: false },
      { id: 'd', text: '3.14 s', isCorrect: false },
    ],
    explanation:
      'Using T = 2π√(L/g) = 2π√(0.50 / 9.80) = 2π√(0.05102) = 2π × 0.2259 ≈ 1.42 seconds. Each full swing takes approximately 1.42 s.',
  },
  {
    id: 2,
    title: 'Task 2: Doubling the Length (50 cm ➔ 100 cm)',
    prompt: 'Double the string length from 50 cm to 100 cm on Earth. By what factor does the time period increase?',
    targetLength: 100,
    targetGravity: 'earth',
    targetAngle: 15,
    options: [
      { id: 'a', text: 'Period doubles (2.0×)', isCorrect: false },
      { id: 'b', text: 'Period increases by √2 (~1.414× to 2.01 s)', isCorrect: true },
      { id: 'c', text: 'Period stays exactly the same', isCorrect: false },
      { id: 'd', text: 'Period quadruples (4.0×)', isCorrect: false },
    ],
    explanation:
      'Because T ∝ √L, doubling the length multiplies the period by √2 ≈ 1.414. Thus: T = 1.42 s × 1.414 ≈ 2.01 seconds. To double the period completely, you would need 4× the length!',
  },
  {
    id: 3,
    title: 'Task 3: Earth vs Moon Comparison',
    prompt: 'Take a 100 cm (1.0 m) pendulum to the Moon where g = 1.62 m/s². What happens to the time period compared to Earth?',
    targetLength: 100,
    targetGravity: 'moon',
    targetAngle: 15,
    options: [
      { id: 'a', text: 'Period increases significantly to ~4.94 s', isCorrect: true },
      { id: 'b', text: 'Period decreases to ~0.50 s', isCorrect: false },
      { id: 'c', text: 'The pendulum stops swinging entirely', isCorrect: false },
      { id: 'd', text: 'Period remains exactly 2.01 s', isCorrect: false },
    ],
    explanation:
      'Because lunar gravity (1.62 m/s²) is roughly 1/6th of Earth, the restoring force is much weaker. T = 2π√(1.0 / 1.62) ≈ 4.94 seconds—nearly 2.5× longer than on Earth!',
  },
  {
    id: 4,
    title: 'Task 4: Fastest Oscillation Environment',
    prompt: 'With string length fixed at 50 cm, which gravity setting produces the fastest oscillation (highest frequency / shortest period)?',
    targetLength: 50,
    targetGravity: 'jupiter',
    targetAngle: 15,
    options: [
      { id: 'a', text: 'Moon (1.62 m/s²)', isCorrect: false },
      { id: 'b', text: 'Earth (9.80 m/s²)', isCorrect: false },
      { id: 'c', text: 'Jupiter (24.79 m/s²)', isCorrect: true },
      { id: 'd', text: 'All planets produce identical oscillation rates', isCorrect: false },
    ],
    explanation:
      'Jupiter possesses the strongest gravitational field (24.79 m/s²). Strong gravity pulls the bob vigorously toward the center, completing oscillations in only T = 2π√(0.50 / 24.79) ≈ 0.89 s (frequency ~1.12 Hz).',
  },
  {
    id: 5,
    title: 'Task 5: 10 Oscillations Timing Benchmark',
    prompt: 'For a 50 cm pendulum on Earth (T = 1.42 s), how long will the stopwatch take to record exactly 10 complete oscillations?',
    targetLength: 50,
    targetGravity: 'earth',
    targetAngle: 15,
    options: [
      { id: 'a', text: '5.0 seconds', isCorrect: false },
      { id: 'b', text: '14.2 seconds', isCorrect: true },
      { id: 'c', text: '28.4 seconds', isCorrect: false },
      { id: 'd', text: '100.0 seconds', isCorrect: false },
    ],
    explanation:
      'Total time for 10 oscillations is t₁₀ = 10 × T = 10 × 1.42 s = 14.2 seconds. In laboratory experiments, timing 10 cycles and dividing by 10 minimizes human reaction-time error!',
  },
];

