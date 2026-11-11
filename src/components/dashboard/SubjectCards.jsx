import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Atom, FlaskConical, ArrowRight, Orbit, Droplets } from 'lucide-react';

const subjects = [
  {
    title: 'Physics Lab',
    path: '/physics',
    description: 'Explore motion, electricity, optical reflection, refraction, and the harmonic laws of nature.',
    experimentsCount: '4 Active Modules',
    badge: 'Optics & Mechanics',
    Icon: Atom,
    theme: {
      accent: '#2563EB',
      bgCard: 'bg-gradient-to-br from-blue-50/70 via-white to-blue-50/30',
      border: 'border-blue-200/80 hover:border-blue-400',
      badgeBg: 'bg-blue-100 text-blue-700',
      iconBg: 'bg-blue-600 text-white',
      btnBg: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    DecoIcon: Orbit,
  },
  {
    title: 'Chemistry Lab',
    path: '/chemistry',
    description: 'Investigate acids & bases, reaction kinetics, mixture separation, and physical versus chemical changes.',
    experimentsCount: '4 Active Modules',
    badge: 'Reactions & Analysis',
    Icon: FlaskConical,
    theme: {
      accent: '#8B5CF6',
      bgCard: 'bg-gradient-to-br from-purple-50/70 via-white to-purple-50/30',
      border: 'border-purple-200/80 hover:border-purple-400',
      badgeBg: 'bg-purple-100 text-purple-700',
      iconBg: 'bg-purple-600 text-white',
      btnBg: 'bg-purple-600 hover:bg-purple-700 text-white',
    },
    DecoIcon: Droplets,
  },
];

export default function SubjectCards() {
  const navigate = useNavigate();

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Explore Laboratory Disciplines</h2>
          <p className="text-xs text-slate-500">Select a discipline to start your hands-on simulations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {subjects.map((subject, index) => {
          const { theme, Icon, DecoIcon } = subject;
          return (
            <motion.div
              key={subject.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.1 }}
              whileHover={{ y: -3 }}
              onClick={() => navigate(subject.path)}
              className={`relative rounded-2xl p-6 sm:p-7 border ${theme.border} ${theme.bgCard} shadow-sm transition-all duration-200 cursor-pointer overflow-hidden group`}
            >
              {/* Background watermark icon */}
              <DecoIcon className="absolute -right-4 -bottom-4 w-32 h-32 opacity-[0.06] text-slate-900 group-hover:scale-105 transition-transform duration-500 pointer-events-none" />

              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs ${theme.iconBg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${theme.badgeBg}`}>
                      {subject.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {subject.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {subject.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    {subject.experimentsCount}
                  </span>

                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-xs ${theme.btnBg}`}>
                    <span>Enter Lab</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
