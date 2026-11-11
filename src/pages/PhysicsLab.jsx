import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Atom,
  Zap,
  Clock,
  Sun,
  Compass,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { experimentsData } from '../data/experiments';

const iconMap = {
  Sun,
  Zap,
  Clock,
  Compass,
};

const physicsExperiments = experimentsData.filter((e) => e.subject === 'Physics');

const difficultyConfig = {
  Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
  Advanced: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

export default function PhysicsLab() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-10">
      {/* Physics Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-50 via-white to-blue-50/60 border border-blue-200/80 p-6 sm:p-8 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Atom className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Physics Laboratory</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Optics, Circuits & Harmonic Mechanics
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-xl">
                Explore real-time physical simulations. Manipulate laser beams, adjust electrical circuits, and discover the mathematics governing natural phenomena.
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            <span className="text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-xs">
              4 Active Simulations
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
              Interactive Mode
            </span>
          </div>
        </div>
      </motion.div>

      {/* Experiment Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Physics Experiment Modules</h2>
          <span className="text-xs text-slate-500">All modules fully interactive</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {physicsExperiments.map((exp, i) => {
            const Icon = iconMap[exp.icon] || Atom;
            const diffClass = difficultyConfig[exp.difficulty] || difficultyConfig.Beginner;

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -3 }}
                onClick={() => navigate(`/experiment/${exp.id}`)}
                className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                        {exp.subject}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${diffClass}`}>
                        {exp.difficulty}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                    {exp.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {exp.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{exp.estimatedTime}</span>
                  </div>

                  <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 group-hover:bg-blue-700 transition-colors shadow-xs cursor-pointer">
                    <span>Launch Simulator</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
