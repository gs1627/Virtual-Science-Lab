import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Atom, FlaskConical, Award } from 'lucide-react';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 border border-slate-200 shadow-sm"
    >
      {/* Decorative background grid and shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft radial gradients */}
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
          }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #CBD5E1 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Floating subtle scientific icons in background */}
        <Atom className="absolute right-12 top-8 w-32 h-32 text-blue-100/50 -rotate-12 pointer-events-none hidden sm:block" />
        <FlaskConical className="absolute right-48 bottom-4 w-24 h-24 text-violet-100/50 rotate-12 pointer-events-none hidden md:block" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 px-6 sm:px-10 py-8 sm:py-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Next-Generation STEM Learning</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight leading-tight">
          Science comes alive when you{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            experiment.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 max-w-xl">
          Step into your interactive virtual laboratory. Explore the physical laws of nature, simulate chemical reactions, and discover how scientific principles shape our universe.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/experiments')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm hover:shadow cursor-pointer"
          >
            <span>Explore Experiments</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/progress')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-xs cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>My Achievements</span>
          </button>
        </div>
      </div>
    </motion.section>
  );
}
