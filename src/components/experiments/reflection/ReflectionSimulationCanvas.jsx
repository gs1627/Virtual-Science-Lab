import { useState, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Sliders,
  Power,
  RotateCcw,
  Compass,
  Tag,
  Eye,
  EyeOff,
  Play,
  Pause,
  Layers,
  Sparkles,
  Move3d,
  BookOpen,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import ReflectionScene3D from './ReflectionScene3D';
import ContextualPopup from './ContextualPopup';
import TermExplanationModal from './TermExplanationModal';
import { SCIENTIFIC_TERMS } from './reflectionData';

export default function ReflectionSimulationCanvas({
  angle,
  setAngle,
  targetAngle = 55,
  targetHit,
  laserPower = true,
  setLaserPower,
  onResetExperiment,
  isExpanded = false,
  onToggleExpand,
}) {
  const controlsRef = useRef();

  // Additional 3D and visibility controls
  const [laserDistance, setLaserDistance] = useState(5.2);
  const [showNormal, setShowNormal] = useState(true);
  const [showAngles, setShowAngles] = useState(true);
  const [showIncidentRay, setShowIncidentRay] = useState(true);
  const [showReflectedRay, setShowReflectedRay] = useState(true);
  const [showCoplanarPlane, setShowCoplanarPlane] = useState(false);
  const [showProtractor, setShowProtractor] = useState(true);
  const [isAnimated, setIsAnimated] = useState(true);

  // Contextual popup message state
  const [toast, setToast] = useState({
    message: 'Welcome to the 3D Optics Lab! Left-click and drag inside the viewport to rotate in 3D.',
    type: 'info',
  });

  // Clickable scientific term modal state
  const [activeTermKey, setActiveTermKey] = useState(null);

  const triggerToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
  }, []);

  // Handle angle change with contextual feedback explaining why ∠i = ∠r
  const handleAngleChange = (newAngle) => {
    setAngle(newAngle);

    if (newAngle === 0) {
      triggerToast(
        'Normal Incidence (0°): The beam strikes perpendicular to the mirror surface and reflects straight back along the normal line. Therefore, ∠i = ∠r = 0° (both angles are equal).',
        'tip'
      );
    } else if (newAngle === targetAngle) {
      triggerToast(
        '🎯 Target Hit! At ∠i = 55°, the reflected angle is also 55° (∠i = ∠r), directing the reflected beam straight onto the optical sensor detector.',
        'celebrate'
      );
    } else if (newAngle === 45) {
      triggerToast(
        'At ∠i = 45°, the reflected angle is also 45°. Because ∠i = ∠r, the angle between the incident ray and reflected ray is exactly 90° (perpendicular rays).',
        'info'
      );
    } else if (newAngle === 60) {
      triggerToast(
        'Angle calibrated to 60°. By the 1st Law of Reflection, the reflected ray deflects by the exact same amount: ∠i = ∠r = 60° (Confirmed equal).',
        'success'
      );
    } else if (newAngle > 70) {
      triggerToast(
        `Grazing Incidence (∠i = ${newAngle}°): The reflected beam also skims at ∠r = ${newAngle}°. Both angles remain strictly equal.`,
        'info'
      );
    } else {
      triggerToast(
        `Angle of incidence set to ${newAngle}°. The 1st Law of Reflection dictates that light bounces off at the exact same angle relative to the normal: ∠i = ∠r = ${newAngle}° (Confirmed equal).`,
        'info'
      );
    }
  };

  // Reset Camera View
  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      triggerToast('3D Camera angle reset to default perspective.', 'info');
    }
  };

  // Toggle normal with feedback
  const handleToggleNormal = () => {
    const next = !showNormal;
    setShowNormal(next);
    if (!next) {
      triggerToast('The normal line is hidden. Remember: angles are measured from the normal, NOT the mirror surface!', 'tip');
    } else {
      triggerToast('The normal line is an imaginary line perpendicular (90°) to the reflecting plane.', 'info');
    }
  };

  // Toggle coplanar plane with feedback
  const handleToggleCoplanar = () => {
    const next = !showCoplanarPlane;
    setShowCoplanarPlane(next);
    if (next) {
      triggerToast('Second Law: The incident ray, reflected ray, and normal all lie in the exact same geometric plane.', 'success');
    }
  };

  const presetAngles = [0, 30, 45, 55, 60, 75];

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
      {/* TOP HEADER: 3D Lab Title, Live Angle Badges & Global Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                3D Laser Optics Bench
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700 shrink-0">
                WebGL
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block truncate">
              Law of Reflection: <span className="font-semibold text-slate-700">∠i = ∠r</span>
            </p>
          </div>
        </div>

        {/* Live Angle Display Badges and Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Numerical Angle Badges & Confirmation of Equality */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-xs font-mono">
              <span className="text-slate-500 text-[11px] font-medium hidden md:inline">Incident:</span>
              <span className="text-blue-700 font-bold">∠i = {angle}°</span>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-50 border border-violet-200 text-xs font-mono">
              <span className="text-slate-500 text-[11px] font-medium hidden md:inline">Reflected:</span>
              <span className="text-violet-700 font-bold">∠r = {angle}°</span>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Equal: ∠i = ∠r ({angle}° = {angle}°) ✓</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {onToggleExpand && (
              <button
                onClick={onToggleExpand}
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold transition-colors cursor-pointer"
                title={isExpanded ? 'Restore Standard Panels' : 'Expand 3D Workspace Full Width'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span className="hidden 2xl:inline">{isExpanded ? 'Standard' : 'Expand 3D'}</span>
              </button>
            )}

            <button
              onClick={handleResetCamera}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
              title="Reset 3D Camera Position"
            >
              <Move3d className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Reset Camera</span>
            </button>

            <button
              onClick={() => {
                const next = !laserPower;
                setLaserPower(next);
                triggerToast(next ? 'Laser source powered ON.' : 'Laser source powered OFF.', 'info');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                laserPower
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{laserPower ? 'Laser ON' : 'Laser OFF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* QUICK CLICKABLE TERMS BAR (Legible, Comfortable Button Sizing) */}
      <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs select-none scrollbar-thin">
        <span className="text-slate-700 font-bold text-xs shrink-0 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Terms:
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {Object.entries(SCIENTIFIC_TERMS).slice(0, 7).map(([key, term]) => (
            <button
              key={key}
              onClick={() => setActiveTermKey(key)}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-700 transition-all cursor-pointer text-xs font-semibold shadow-2xs whitespace-nowrap"
            >
              {term.name}
            </button>
          ))}
          <button
            onClick={() => setActiveTermKey('second-law')}
            className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 transition-all cursor-pointer text-xs font-bold whitespace-nowrap shadow-2xs"
          >
            2nd Law (Coplanar)
          </button>
        </div>
      </div>

      {/* 3D WEBGL SIMULATION CANVAS CONTAINER (Substantially Enlarged Viewport) */}
      <div className="relative flex-1 min-h-[420px] sm:min-h-[460px] bg-gradient-to-b from-[#080d1a] via-[#0b1226] to-[#070b14] overflow-hidden select-none">
        {/* Toast Popup Notification Overlay */}
        <div className="absolute top-3 left-3 right-3 z-30 flex justify-center pointer-events-none">
          <ContextualPopup
            message={toast.message}
            type={toast.type}
            onDismiss={() => setToast({ message: null, type: 'info' })}
          />
        </div>

        {/* 3D Navigation Hint Pill */}
        <div className="absolute bottom-3 left-3 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-[10px] font-medium text-slate-300 backdrop-blur-sm">
          <span>🖱️ Left-Click + Drag: Rotate</span>
          <span>•</span>
          <span>Scroll: Zoom</span>
          <span>•</span>
          <span>Right-Click: Pan</span>
        </div>

        {/* Target Hit Notification Pill */}
        {targetHit && laserPower && (
          <div className="absolute bottom-3 right-3 z-20 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.3)] backdrop-blur-md animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Target Hit! (55°)</span>
          </div>
        )}

        {/* Three.js R3F Canvas */}
        <Canvas
          shadows
          camera={{ position: [0, 4.5, 9.5], fov: 42 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <color attach="background" args={['#080d1a']} />
          <fog attach="fog" args={['#080d1a', 15, 30]} />

          <ReflectionScene3D
            angle={angle}
            laserDistance={laserDistance}
            showNormal={showNormal}
            showAngles={showAngles}
            showIncidentRay={showIncidentRay}
            showReflectedRay={showReflectedRay}
            showCoplanarPlane={showCoplanarPlane}
            showProtractor={showProtractor}
            isAnimated={isAnimated}
            laserPower={laserPower}
            targetAngle={targetAngle}
            targetHit={targetHit}
            controlsRef={controlsRef}
          />
        </Canvas>
      </div>

      {/* COMPREHENSIVE EXPERIMENT CONTROLS SECTION (Fully Visible, Clean Grouping) */}
      <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 space-y-3 overflow-y-auto max-h-[280px] scrollbar-thin">
        {/* ROW 1: Angle of Incidence Slider with Stepper Controls & Value grouped together */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                1. Angle of Incidence (∠i):
              </span>
            </div>

            {/* Stepper Buttons & Angle Value grouped together */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleAngleChange(Math.max(0, angle - 1))}
                disabled={angle <= 0}
                className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs font-bold flex items-center justify-center hover:bg-slate-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Decrease by 1°"
              >
                -1°
              </button>
              <div className="px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-mono text-sm font-bold min-w-[56px] text-center shadow-2xs">
                {angle}°
              </div>
              <button
                onClick={() => handleAngleChange(Math.min(90, angle + 1))}
                disabled={angle >= 90}
                className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs font-bold flex items-center justify-center hover:bg-slate-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Increase by 1°"
              >
                +1°
              </button>
            </div>
          </div>

          {/* Full-width Range Slider */}
          <input
            type="range"
            min="0"
            max="90"
            step="1"
            value={angle}
            onChange={(e) => handleAngleChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg bg-slate-200 accent-blue-600 cursor-pointer appearance-none outline-none focus:ring-2 focus:ring-blue-200"
          />

          {/* Presets and Quick Reset Angle */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-500 font-bold uppercase mr-0.5">Presets:</span>
              {presetAngles.map((pa) => (
                <button
                  key={pa}
                  onClick={() => handleAngleChange(pa)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                    angle === pa
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  } ${pa === targetAngle ? 'ring-1 ring-emerald-400 text-emerald-700 bg-emerald-50' : ''}`}
                >
                  {pa}°{pa === targetAngle ? ' 🎯' : ''}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleAngleChange(45)}
              className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-blue-600 font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Angle (45°)</span>
            </button>
          </div>
        </div>

        {/* ROW 2: Light Source Position (Distance Slider) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              2. Light Source Distance:
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-500 font-mono">Distance: {laserDistance.toFixed(1)}m</span>
            <input
              type="range"
              min="3.8"
              max="7.0"
              step="0.1"
              value={laserDistance}
              onChange={(e) => {
                setLaserDistance(Number(e.target.value));
                triggerToast('Laser emitter distance adjusted. Ray continues to strike at point O.', 'info');
              }}
              className="w-32 h-1.5 rounded-lg bg-slate-200 accent-purple-600 cursor-pointer appearance-none"
            />
          </div>
        </div>

        {/* ROW 3: Visibility Toggles & Animation Controls */}
        <div className="pt-1.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          {/* Visibility Toggles */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">Toggles:</span>

            {/* Normal Line Toggle */}
            <button
              onClick={handleToggleNormal}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                showNormal
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 line-through opacity-60'
              }`}
            >
              {showNormal ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              <span>Normal</span>
            </button>

            {/* Angle Labels Toggle */}
            <button
              onClick={() => setShowAngles(!showAngles)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                showAngles
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 line-through opacity-60'
              }`}
            >
              <Tag className="w-3 h-3" />
              <span>Labels</span>
            </button>

            {/* Incident Ray Toggle */}
            <button
              onClick={() => setShowIncidentRay(!showIncidentRay)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                showIncidentRay
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 line-through opacity-60'
              }`}
            >
              <span>Incident</span>
            </button>

            {/* Reflected Ray Toggle */}
            <button
              onClick={() => setShowReflectedRay(!showReflectedRay)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                showReflectedRay
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 line-through opacity-60'
              }`}
            >
              <span>Reflected</span>
            </button>

            {/* Protractor Scale Toggle */}
            <button
              onClick={() => {
                const next = !showProtractor;
                setShowProtractor(next);
                triggerToast(next ? 'Protractor markings shown on the bench.' : 'Protractor markings hidden.', 'info');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                showProtractor
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 line-through opacity-60'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>Protractor</span>
            </button>

            {/* Coplanar Plane Toggle (2nd Law) */}
            <button
              onClick={handleToggleCoplanar}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                showCoplanarPlane
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
              }`}
              title="Visualize the Coplanar Plane (2nd Law of Reflection)"
            >
              <Layers className="w-3 h-3" />
              <span>Coplanar Plane (2nd Law)</span>
            </button>
          </div>

          {/* Animation & Reset Controls */}
          <div className="flex items-center gap-2">
            {/* Play/Pause beam animation */}
            <button
              onClick={() => {
                const next = !isAnimated;
                setIsAnimated(next);
                triggerToast(next ? 'Beam animation resumed.' : 'Beam animation paused.', 'info');
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {isAnimated ? <Pause className="w-3 h-3 text-amber-600" /> : <Play className="w-3 h-3 text-emerald-600" />}
              <span>{isAnimated ? 'Pause' : 'Resume'}</span>
            </button>

            {/* Reset Entire Experiment */}
            {onResetExperiment && (
              <button
                onClick={onResetExperiment}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-50 border border-red-200 text-[11px] font-medium text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Clickable Scientific Term Explanation Modal */}
      <TermExplanationModal
        activeTermKey={activeTermKey}
        onClose={() => setActiveTermKey(null)}
      />
    </div>
  );
}
