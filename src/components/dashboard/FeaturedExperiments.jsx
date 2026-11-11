import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  Clock,
  Sun,
  FlaskConical,
  Atom,
  Gauge,
  Compass,
  Filter,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { experimentsData } from '../../data/experiments';

const iconMap = {
  Zap,
  Clock,
  Sun,
  FlaskConical,
  Atom,
  Gauge,
  Compass,
  Filter,
  Sparkles,
};

const difficultyConfig = {
  Beginner: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  Intermediate: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  Advanced: {
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
};

export default function FeaturedExperiments({ searchQuery = '' }) {
  const navigate = useNavigate();

  const filteredExperiments = searchQuery.trim()
    ? experimentsData.filter(
        (exp) =>
          exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exp.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exp.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : experimentsData;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {searchQuery ? `Search Results (${filteredExperiments.length})` : 'Interactive Experiment Modules'}
          </h2>
          <p className="text-xs text-slate-500">
            {searchQuery
              ? `Experiments matching "${searchQuery}"`
              : 'Choose from 8 hands-on simulated science experiments'}
          </p>
        </div>

        {!searchQuery && (
          <button
            onClick={() => navigate('/experiments')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>View All (8)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {filteredExperiments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-sm">No experiments found for &quot;{searchQuery}&quot;</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredExperiments.map((experiment, index) => {
            const Icon = iconMap[experiment.icon] || Atom;
            const diffStyle = difficultyConfig[experiment.difficulty] || difficultyConfig.Beginner;
            const isPhysics = experiment.subject === 'Physics';

            return (
              <motion.div
                key={experiment.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                whileHover={{ y: -3 }}
                onClick={() => navigate(`/experiment/${experiment.id}`)}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                {/* Top Banner with Subject Color Bar */}
                <div>
                  <div
                    className={`h-1.5 w-full ${
                      isPhysics ? 'bg-blue-600' : 'bg-purple-600'
                    }`}
                  />

                  <div className="p-5 pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isPhysics
                            ? 'bg-blue-50 text-blue-600 border border-blue-100'
                            : 'bg-purple-50 text-purple-600 border border-purple-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isPhysics
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-purple-50 text-purple-700 border-purple-200'
                          }`}
                        >
                          {experiment.subject}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffStyle.bg}`}
                        >
                          {experiment.difficulty}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5 line-clamp-1">
                      {experiment.title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 min-h-[32px]">
                      {experiment.description}
                    </p>
                  </div>
                </div>

                {/* Footer Details */}
                <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{experiment.estimatedTime}</span>
                  </div>

                  <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                    <span>Start</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
