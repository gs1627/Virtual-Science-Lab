import { Beaker, Clock, Trophy, TrendingUp, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { progressData } from '../../data/experiments';

const stats = [
  {
    label: 'Experiments Completed',
    value: progressData.experimentsCompleted,
    total: progressData.totalExperiments,
    Icon: Beaker,
    color: '#2563EB',
    bg: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    label: 'Lab Learning Hours',
    value: progressData.learningHours,
    suffix: 'hrs',
    Icon: Clock,
    color: '#0D9488',
    bg: 'bg-teal-50 text-teal-600 border-teal-100',
  },
  {
    label: 'Science Badges Earned',
    value: progressData.badges,
    total: progressData.totalBadges,
    Icon: Trophy,
    color: '#8B5CF6',
    bg: 'bg-purple-50 text-purple-600 border-purple-100',
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 rounded-lg text-xs border border-slate-200 shadow-md">
        <p className="text-slate-900 font-bold">{label}</p>
        <p className="text-blue-600 font-semibold">{payload[0].value} hours active</p>
      </div>
    );
  }
  return null;
};

export default function ProgressOverview() {
  const completionPercent = Math.round(
    (progressData.experimentsCompleted / progressData.totalExperiments) * 100
  );

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Weekly Progress & Mastery</h2>
          <p className="text-xs text-slate-500">Track your experimental investigations and study hours</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Stat summary cards + Overall progress */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3.5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-xl font-bold text-slate-900">
                    {stat.value}
                    {stat.suffix && <span className="text-xs font-normal text-slate-500 ml-1">{stat.suffix}</span>}
                    {stat.total && (
                      <span className="text-xs font-medium text-slate-400 ml-1">
                        / {stat.total}
                      </span>
                    )}
                  </p>
                </div>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${stat.bg}`}>
                  <stat.Icon className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>

          {/* Curriculum Completion Progress Bar Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">Course Completion</span>
              <span className="text-xs font-bold text-blue-600">{completionPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>5 of 8 interactive simulations completed with high score</span>
            </p>
          </div>
        </div>

        {/* Right Col: Weekly Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Weekly Lab Activity</h3>
              <p className="text-xs text-slate-500">Hours spent conducting experiments per day</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18% this week</span>
            </div>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData.weeklyProgress} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  unit="h"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="hours"
                  fill="#3B82F6"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
