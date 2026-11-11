import { useEffect, useRef, useState } from 'react';
import { Activity, Zap } from 'lucide-react';

export default function ParticleCollisionViewer({
  temperature = 25,
  concentration = 1.0,
  surfaceArea = 'lumps',
  hasCatalyst = false,
  isRunning = false,
  vesselName = 'Flask A',
  compact = false,
}) {
  const canvasRef = useRef(null);
  const [stats, setStats] = useState({ collisionsPerSec: 0, effectivePerSec: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Number of particles proportional to concentration [HCl]
    const numParticles = Math.round(14 + concentration * 14);

    // RMS Speed scales with sqrt(T_Kelvin)
    const tempKelvin = temperature + 273.15;
    const baseSpeed = Math.sqrt(tempKelvin / 298.15) * 2.4;

    // Surface collision sites on solid reactant (CaCO3)
    const numSites = surfaceArea === 'powder' ? 14 : 5;

    // Spawn reactant particles (H+ hydronium and Cl- chloride)
    const particles = Array.from({ length: numParticles }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = baseSpeed * (0.6 + Math.random() * 0.8);
      return {
        x: Math.random() * (width - 24) + 12,
        y: Math.random() * (height - 48) + 12,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: i % 3 === 0 ? 4 : 3,
        type: i % 3 === 0 ? 'h_ion' : 'cl_ion',
      };
    });

    // Spark reaction flashes
    const sparks = [];

    let animId;
    let collisionsThisSec = 0;
    let effectiveThisSec = 0;
    let lastSecTime = performance.now();

    const loop = (timestamp) => {
      ctx.clearRect(0, 0, width, height);

      // Solid Reactant Floor at bottom (CaCO3 mineral lattice)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, height - 18, width, 18);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, height - 18, width, 18);

      // Reactive Surface Sites
      for (let s = 0; s < numSites; s++) {
        const siteX = (s + 0.5) * (width / numSites);
        ctx.fillStyle = surfaceArea === 'powder' ? '#e2e8f0' : '#94a3b8';
        ctx.beginPath();
        ctx.arc(siteX, height - 18, surfaceArea === 'powder' ? 4 : 7, Math.PI, 0);
        ctx.fill();
        ctx.strokeStyle = '#64748b';
        ctx.stroke();
      }

      // Catalyst Active Layer Indicator
      if (hasCatalyst) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, height - 21);
        ctx.lineTo(width, height - 21);
        ctx.stroke();
      }

      // Update & Draw Particles
      particles.forEach((p) => {
        if (isRunning) {
          p.x += p.vx;
          p.y += p.vy;

          // Elastic boundary reflections (Left, Right, Top)
          if (p.x < p.radius) {
            p.x = p.radius;
            p.vx *= -1;
          }
          if (p.x > width - p.radius) {
            p.x = width - p.radius;
            p.vx *= -1;
          }
          if (p.y < p.radius) {
            p.y = p.radius;
            p.vy *= -1;
          }

          // Solid Reactant Collision (Bottom Surface)
          if (p.y > height - 22 - p.radius) {
            p.y = height - 22 - p.radius;
            p.vy *= -1;
            collisionsThisSec += 1;

            // Kinetic energy threshold (E_k >= E_a)
            // Catalyst lowers activation energy barrier
            const kineticEnergy = p.vx * p.vx + p.vy * p.vy;
            const thresholdEa = hasCatalyst ? 3.0 : 5.2;

            if (kineticEnergy >= thresholdEa && p.type === 'h_ion') {
              effectiveThisSec += 1;
              // Spawn golden reaction flash spark
              sparks.push({
                x: p.x,
                y: p.y + p.radius,
                life: 1.0,
                radius: 7,
              });
            }
          }
        }

        // Particle Glow & Rendering
        if (p.type === 'h_ion') {
          // H+ Ion: Glowing Electric Cyan
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = isRunning ? 6 : 2;
          ctx.fillStyle = '#22d3ee';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          // Cl- Ion: Metallic Slate/Silver
          ctx.fillStyle = '#94a3b8';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Render & Fade Reaction Sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        ctx.fillStyle = `rgba(250, 204, 21, ${s.life * 0.9})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * (1.5 - s.life * 0.5), 0, Math.PI * 2);
        ctx.fill();

        s.life -= 0.08;
        if (s.life <= 0) sparks.splice(i, 1);
      }

      // Update collision frequency counters once per second
      if (timestamp - lastSecTime > 1000) {
        setStats({
          collisionsPerSec: collisionsThisSec,
          effectivePerSec: effectiveThisSec,
        });
        collisionsThisSec = 0;
        effectiveThisSec = 0;
        lastSecTime = timestamp;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [temperature, concentration, surfaceArea, hasCatalyst, isRunning]);

  return (
    <div className="bg-[#0b1220] rounded-2xl border border-slate-800/80 p-3 text-slate-100 space-y-2 select-none shadow-inner">
      {/* Header telemetry */}
      <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-800">
        <span className="font-bold flex items-center gap-1.5 text-cyan-400">
          <Activity className="w-3.5 h-3.5" />
          <span>Microscopic Particle Kinetics: {vesselName}</span>
        </span>

        <div className="flex items-center gap-2.5 text-[10px] font-mono text-slate-400">
          <span>
            Kinetic Speed: <strong className="text-amber-400">{((temperature / 20) * 1.5).toFixed(1)}×</strong>
          </span>
          <span>
            Effective Collisions: <strong className="text-emerald-400">{stats.effectivePerSec}/s</strong>
          </span>
        </div>
      </div>

      {/* 2D Particle Chamber Canvas */}
      <div
        className={`relative w-full rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800/80 ${
          compact ? 'h-[120px]' : 'h-[140px]'
        }`}
      >
        <canvas ref={canvasRef} width={420} height={compact ? 120 : 140} className="w-full h-full" />

        {/* Legend Overlay */}
        <div className="absolute top-1.5 left-2 flex items-center gap-2 text-[9px] text-slate-400 pointer-events-none">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-xs" /> H⁺ Ions
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-400" /> Cl⁻ Ions
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-slate-200" /> CaCO₃ Lattice
          </span>
          {hasCatalyst && (
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Zap className="w-2.5 h-2.5" /> Catalyst Active
            </span>
          )}
        </div>
      </div>

      <p className="text-[10px] text-slate-400 leading-tight italic">
        *Illustrative collision theory model: particles accelerate with temperature (v ∝ √T) and collide at higher frequency with concentration.
      </p>
    </div>
  );
}
