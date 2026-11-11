import { useState } from 'react';
import { Bot, Sparkles, CheckCircle } from 'lucide-react';

const samplePrompts = [
  'Why does light reflect at the exact same angle?',
  'What is the formula for Ohm\'s Law?',
  'Why does pH 7 represent a neutral solution?',
  'How does temperature affect chemical reaction speed?',
];

export default function LabAssistant() {
  const [activePrompt, setActivePrompt] = useState(null);
  const [response, setResponse] = useState(null);

  const handlePromptClick = (prompt) => {
    setActivePrompt(prompt);
    if (prompt.includes('angle')) {
      setResponse(
        'Light reflects at the exact same angle according to Fermat\'s Principle of Least Time. The incident ray, the reflected ray, and the normal line at the point of incidence all lie in the same geometric plane, making the path length minimal.'
      );
    } else if (prompt.includes('Ohm')) {
      setResponse(
        'Ohm\'s Law states that current (I) is directly proportional to voltage (V) and inversely proportional to resistance (R): V = I × R (or I = V / R). Double the voltage, and the current doubles!'
      );
    } else if (prompt.includes('pH 7')) {
      setResponse(
        'Pure water at 25°C auto-ionizes equally into H⁺ and OH⁻ ions: [H⁺] = 10⁻⁷ M. Since pH = -log₁₀[H⁺], this yields exactly 7.0, meaning neither acid nor alkaline ions dominate.'
      );
    } else {
      setResponse(
        'Higher temperature increases molecular kinetic energy. Molecules move faster and collide more frequently with energy exceeding the activation energy (Arrhenius equation), dramatically accelerating the reaction rate!'
      );
    }
  };

  return (
    <section className="mb-8">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
              <span>Dr. Nova • Virtual Lab Mentor</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Have questions about an experiment or formula?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Ask your real-time AI lab assistant for instant concept breakdowns, troubleshooting hints, or scientific mathematical derivations.
            </p>

            {/* Quick Prompt Pills */}
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handlePromptClick(prompt)}
                  className={`text-xs px-3 py-1.5 rounded-lg border text-left transition-all cursor-pointer ${activePrompt === prompt
                    ? 'bg-violet-50 border-violet-400 text-violet-700 font-semibold shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chat Bubble Card */}
          <div className="w-full lg:w-96 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between min-h-[170px]">
            <div>
              <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-slate-200/80">
                <div className="w-7 h-7 rounded-lg bg-violet-600 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Dr. Nova</div>
                  <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online & Ready
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {response || (
                  <span className="text-slate-500 italic">
                    &quot;Click any of the science inquiry questions on the left or test a simulation in our labs to receive contextual scientific explanations!&quot;
                  </span>
                )}
              </p>
            </div>

            {response && (
              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                <span>Verified Scientific Law</span>
                <span className="text-violet-600 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Lab Assistant
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
