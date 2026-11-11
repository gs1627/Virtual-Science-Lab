import { useState } from 'react';
import {
  User,
  Bell,
  Volume2,
  Check,
  Save,
} from 'lucide-react';

const settingSections = [
  {
    title: 'Student Profile',
    icon: User,
    settings: [
      { label: 'Display Name', type: 'text', value: 'Alex Chen (Student)' },
      { label: 'Academic Grade', type: 'text', value: 'Grade 9 - Advanced Sciences' },
      { label: 'Registered Email', type: 'text', value: 'alex.chen@school.edu' },
    ],
  },
  {
    title: 'Notifications & Alerts',
    icon: Bell,
    settings: [
      { label: 'Daily experiment review reminders', type: 'toggle', value: true },
      { label: 'Quiz mastery achievement badges', type: 'toggle', value: true },
      { label: 'Weekly lab progress email digest', type: 'toggle', value: false },
    ],
  },
  {
    title: 'Simulation & Audio Settings',
    icon: Volume2,
    settings: [
      { label: 'Laser & optical audio reflections', type: 'toggle', value: true },
      { label: 'Dynamic 3D particle animations', type: 'toggle', value: true },
      { label: 'Show step-by-step assistant hints automatically', type: 'toggle', value: true },
    ],
  },
];

export default function Settings() {
  const [toggles, setToggles] = useState(() => {
    const map = {};
    settingSections.forEach((section) => {
      section.settings.forEach((s) => {
        if (s.type === 'toggle') {
          map[`${section.title}-${s.label}`] = s.value;
        }
      });
    });
    return map;
  });

  const [saved, setSaved] = useState(false);

  const toggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Platform Settings &amp; Preferences
          </h1>
          <p className="text-sm text-slate-500">
            Configure your virtual lab profile, simulation graphics, and notification rules
          </p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Sections */}
      <div className="space-y-5">
        {settingSections.map((section) => (
          <div
            key={section.title}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <section.icon className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900">{section.title}</h2>
            </div>

            <div className="space-y-4">
              {section.settings.map((s) => {
                const key = `${section.title}-${s.label}`;
                if (s.type === 'toggle') {
                  const isChecked = toggles[key];
                  return (
                    <div
                      key={s.label}
                      className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800">{s.label}</p>
                        <p className="text-xs text-slate-400">Default laboratory behavior</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggle(key)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                          isChecked ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                            isChecked ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  );
                }

                return (
                  <div key={s.label} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium text-slate-700">{s.label}</label>
                    <input
                      type="text"
                      defaultValue={s.value}
                      className="sm:col-span-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
