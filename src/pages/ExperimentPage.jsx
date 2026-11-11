import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  BarChart3,
  Zap,
  Sun,
  FlaskConical,
  Atom,
  Gauge,
  Beaker,
  Sparkles,
  Compass,
  Filter,
} from 'lucide-react';
import { experimentsData, allExperimentsData } from '../data/experiments';

// Import all 8 interactive experiment modules
import ReflectionOfLightExperiment from '../components/experiments/reflection/ReflectionOfLightExperiment';
import OhmsLawExperiment from '../components/experiments/physics/OhmsLawExperiment';
import SimplePendulumExperiment from '../components/experiments/physics/SimplePendulumExperiment';
import RefractionExperiment from '../components/experiments/physics/RefractionExperiment';
import AcidsBasesExperiment from '../components/experiments/chemistry/AcidsBasesExperiment';
import ReactionRateExperiment from '../components/experiments/chemistry/ReactionRateExperiment';
import SeparationExperiment from '../components/experiments/chemistry/SeparationExperiment';
import PhysicalChemicalChangesExperiment from '../components/experiments/chemistry/PhysicalChemicalChangesExperiment';

const iconMap = {
  Sun,
  Zap,
  Clock,
  Compass,
  FlaskConical,
  Gauge,
  Filter,
  Sparkles,
  Atom,
};

const difficultyConfig = {
  Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
  Advanced: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

export default function ExperimentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const experiment = (allExperimentsData || experimentsData).find((e) => e.id === id);

  if (!experiment) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8">
        <Beaker className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Experiment Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">
          This experiment doesn&apos;t exist or the URL is invalid.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>
    );
  }

  const isPhysics = experiment.subject === 'Physics';
  const Icon = iconMap[experiment.icon] || Atom;
  const diffClass = difficultyConfig[experiment.difficulty] || difficultyConfig.Beginner;

  // Render the appropriate simulation based on ID
  const renderExperimentComponent = () => {
    switch (experiment.id) {
      case 'reflection-of-light':
        return <ReflectionOfLightExperiment />;
      case 'ohms-law':
        return <OhmsLawExperiment />;
      case 'simple-pendulum':
        return <SimplePendulumExperiment />;
      case 'refraction-of-light':
        return <RefractionExperiment />;
      case 'acids-and-bases':
        return <AcidsBasesExperiment />;
      case 'reaction-rate':
        return <ReactionRateExperiment />;
      case 'separation-of-mixtures':
        return <SeparationExperiment />;
      case 'physical-chemical-changes':
        return <PhysicalChemicalChangesExperiment />;
      default:
        return <ReflectionOfLightExperiment />;
    }
  };

  return (
    <div className="space-y-4 pb-8 w-full">
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer group"
        >
          <div className="p-1.5 rounded-lg bg-white border border-slate-200 group-hover:bg-slate-50 transition-colors shadow-2xs">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span>Back to Laboratory</span>
        </button>

        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Simulation Active &amp; Ready
        </span>
      </div>

      {/* Hero banner (Compact & Spacious) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative rounded-2xl overflow-hidden p-4 sm:p-5 border shadow-xs ${
          isPhysics
            ? 'bg-gradient-to-r from-blue-50/80 via-white to-blue-50/30 border-blue-200'
            : 'bg-gradient-to-r from-purple-50/80 via-white to-purple-50/30 border-purple-200'
        }`}
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                isPhysics ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
              }`}
            >
              <Icon className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isPhysics
                      ? 'bg-blue-100/70 text-blue-800 border-blue-200'
                      : 'bg-purple-100/70 text-purple-800 border-purple-200'
                  }`}
                >
                  {experiment.subject}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffClass}`}>
                  {experiment.difficulty}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                  Interactive Module
                </span>
              </div>

              <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">
                {experiment.title}
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm max-w-3xl leading-relaxed mt-0.5">
                {experiment.description}
              </p>
            </div>
          </div>

          {/* Quick Info Badges inline */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>{experiment.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs">
              <BarChart3 className="w-3.5 h-3.5 text-amber-500" />
              <span>{experiment.difficulty}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* EXPERIMENT SIMULATION WORKSPACE */}
      <section className="space-y-2 pt-0.5">
        {/* Dynamic Interactive Component for this Experiment */}
        {renderExperimentComponent()}
      </section>
    </div>
  );
}
