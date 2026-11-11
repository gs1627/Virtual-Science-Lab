import {
  TrendingUp,
  Beaker,
  Clock,
  Trophy,
  Target,
  Star,
  Award,
  Medal,
  Flame,
  Lightbulb,
  Microscope,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { progressData } from '../data/experiments';

const monthlyData = [
  { month: 'Jul', hours: 8 },
  { month: 'Aug', hours: 14 },
  { month: 'Sep', hours: 11 },
  { month: 'Oct', hours: 18 },
  { month: 'Nov', hours: 22 },
  { month: 'Dec', hours: 26 },
];

const badges = [
  { name: 'First Experiment', icon: Star, earned: true, desc: 'Completed first virtual simulation' },
  { name: 'Physics Explorer', icon: Lightbulb, earned: true, desc: 'Mastered Reflection and Ohm\'s Law' },
  { name: 'Chemistry Novice', icon: Beaker, earned: true, desc: 'Conducted litmus & acid/base testing' },
  { name: 'Optics Specialist', icon: Target, earned: true, desc: 'Solved Snell\'s law & 55° laser challenge' },
  { name: 'Rapid Learner', icon: Flame, earned: true, desc: 'Investigated reaction kinetics' },
  { name: '10+ Lab Hours', icon: Clock, earned: true, desc: 'Spent over 10 hours exploring science' },
  { name: 'Master Investigator', icon: Microscope, earned: true, desc: 'Completed mixture separation' },
  { name: 'Lab Honor Roll', icon: Award, earned: true, desc: 'Scored 100% on lab mastery quizzes' },
  { name: 'Nobel Aspirant', icon: Trophy, earned: false, desc: 'Complete all 8 advanced lab experiments' },
  { name: 'Distinguished Fellow', icon: Medal, earned: false, desc: 'Publish all lab notes' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 rounded-lg text-xs border border-slate-200 shadow-md">
        <p className="text-slate-900 font-bold">{label}</p>
        <p className="text-blue-600 font-semibold">{payload[0].value} hours studied</p>
      </div>
    );
  }
  return null;
};

export default function MyProgress() {
  const completionPercent = Math.round(
    (progressData.experimentsCompleted / progressData.totalExperiments) * 100
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Learning Progress & Milestones
          </h1>
          <p className="text-sm text-slate-500">
            Overview of your scientific journey, laboratory hours, and earned certificates
          </p>
        </div>
      </div>

      {/* Primary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Completed Modules</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Beaker className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-2">
            {progressData.experimentsCompleted}{' '}
            <span className="text-sm font-normal text-slate-400">/ {progressData.totalExperiments}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${completionPercent}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Investigation Hours</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-2">
            {progressData.learningHours}{' '}
            <span className="text-sm font-normal text-slate-400">hours</span>
          </div>
          <p className="text-xs text-teal-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +2.5 hrs logged this weekend
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Mastery Badges</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-2">
            {progressData.badges}{' '}
            <span className="text-sm font-normal text-slate-400">/ {progressData.totalBadges}</span>
          </div>
          <p className="text-xs text-purple-700 font-semibold flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> Level 2 Junior Scientist
          </p>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Monthly Learning Hours</h2>
            <p className="text-xs text-slate-500">Longitudinal study time logged across semesters</p>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} unit="h" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="hours" fill="#2563EB" radius={[6, 6, 0, 0]} maxBarSize={45} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Achievement Badges Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-1">Badges & Honors</h2>
        <p className="text-xs text-slate-500 mb-5">Earn honors by completing objectives and acing post-experiment quizzes</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {badges.map((b) => (
            <div
              key={b.name}
              className={`p-4 rounded-xl border text-center flex flex-col items-center justify-between transition-all ${b.earned
                ? 'bg-slate-50/70 border-slate-200 shadow-xs'
                : 'bg-slate-50/20 border-slate-100 opacity-50'
                }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 ${b.earned
                  ? 'bg-amber-100 text-amber-600 shadow-xs'
                  : 'bg-slate-200 text-slate-400'
                  }`}
              >
                <b.icon className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-slate-900 line-clamp-1">{b.name}</div>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{b.desc}</p>
              <div className="mt-2.5">
                {b.earned ? (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    Earned
                  </span>
                ) : (
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    Locked
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
