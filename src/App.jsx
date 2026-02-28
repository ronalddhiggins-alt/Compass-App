import React, { useState } from 'react';

// FIELD GUIDE CONTENT
const FIELD_GUIDE = {
  intro: {
    title: "The Mirror in Your Pocket",
    content: "The Compass is not a spellchecker. It is a 'Soul-Checker.' It is designed to show you your vibration before you hit send."
  },
  chapters: [
    {
      title: "1. The Hot State",
      subtitle: "Why We Burn Bridges",
      content: "In the 'Hot State' (Amygdala Hijack), you are not You. You are a reflex. The Compass buys you the 3 seconds you need to cool the iron."
    },
    {
      title: "2. The 4 Vibrations",
      subtitle: "Reading the Map",
      content: "Red (Shadow) = Survival. Orange (Ego) = Status. Blue (Reason) = Logic. Green (Spirit) = Connection. You must take the elevator up."
    },
    {
      title: "3. The Pause",
      subtitle: "The 3 Seconds That Save You",
      content: "Between stimulus and response there is a space. The spinning circle of The Compass is that space. Breathe into it."
    },
    {
      title: "4. Dynamics",
      subtitle: "The Physics of the Spirit",
      content: "Vibrations have volume. Low Shadow is Caution; High Shadow is Terror. They also mix: Shadow + Ego = 'The Fortress'. Reason + Spirit = 'The Architect'. Watch the Intensity."
    }
  ]
};

function App() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [dailyPrompt, setDailyPrompt] = useState(null);
  const [showWiki, setShowWiki] = useState(false);
  const [wikiQuery, setWikiQuery] = useState('');
  const [wikiResults, setWikiResults] = useState([]);

  // Fetch Daily Prompt on Load
  React.useEffect(() => {
    fetch('/api/daily-prompt')
      .then(res => res.json())
      .then(data => setDailyPrompt(data))
      .catch(err => console.error("Failed to load prompt:", err));
  }, []);

  const checkVibration = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setAnalysis(null);

    // CletusMaxx Frequency Hack 🎸
    // Check if the input matches a known "Frequency"
    const normalizedText = text.toLowerCase().trim();
    if (normalizedText.includes("return of the dream") || normalizedText.includes("in the back of your mind")) {
      // Trigger "Total Sovereignty" / Spirit Mode
      setTimeout(() => {
        setAnalysis({
          dominant_vibration: "Spirit",
          vibration_score: {
            shadow: 0,
            ego: 0,
            reason: 0,
            spirit: 100
          },
          safety_status: "SAFE",
          reflection: "The frequency is resonant. The Algorithms have been bypassed. You have restored the dream.",
          suggestion: "Sovereignty Confirmed. Proceed with creation.",
          reasoning: "The input matches the CletusMaxx resonant frequency. The 'Algorithms' have been bypassed via harmonic interference."
        });
        setLoading(false);
      }, 1500); // Fake a little "processing" delay for effect
      return;
    }

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error(error);
      alert("Compass Offline. Please start the server.");
    } finally {
      // Only turn off loading if we didn't hit the hack (hack handles its own state)
      if (!normalizedText.includes("return of the dream") && !normalizedText.includes("in the back of your mind")) {
        setLoading(false);
      }
    }
  };

  const getBarColor = (type) => {
    if (type === 'Shadow') return '#ef4444'; // Red
    if (type === 'Ego') return '#f59e0b'; // Orange
    if (type === 'Reason') return '#3b82f6'; // Blue
    if (type === 'Spirit') return '#10b981'; // Green
    return '#ccc';
    return '#ccc';
  };

  const searchWiki = async (q) => {
    setWikiQuery(q);
    if (!q) {
      setWikiResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/wiki?q=${q}`);
      const data = await res.json();
      setWikiResults(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 font-sans relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)' }}>

      {/* Field Guide Toggle Button */}
      <div className="absolute top-6 right-6 flex gap-3">
        <button
          onClick={() => setShowWiki(true)}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all hover:scale-110 border border-white/10"
          title="Open Knowledge Base"
        >
          <span className="text-2xl">🔍</span>
        </button>
        <button
          onClick={() => setShowGuide(true)}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all hover:scale-110 border border-white/10"
          title="Open Field Guide"
        >
          <span className="text-2xl">📖</span>
        </button>
      </div>

      {/* WIKI MODAL */}
      {showWiki && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-gray-900 border border-indigo-500/30 rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-light tracking-widest text-indigo-400 uppercase">Knowledge Base</h2>
              <button onClick={() => setShowWiki(false)} className="text-gray-400 hover:text-white transition-colors">✕</button>
            </div>

            <div className="p-6">
              <input
                type="text"
                placeholder="Search concepts (e.g. 'Shadow', 'Hijack')..."
                className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white focus:border-indigo-500 outline-none transition-all"
                value={wikiQuery}
                onChange={(e) => searchWiki(e.target.value)}
                autoFocus
              />
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {wikiResults.length === 0 && wikiQuery && <p className="text-gray-500 text-center">No results found.</p>}
              {wikiResults.length === 0 && !wikiQuery && <p className="text-gray-500 text-center italic opacity-50">Type to search the Compass Brain...</p>}

              {wikiResults.map(item => (
                <div key={item.id} className="bg-white/5 p-4 rounded-lg border border-white/5 hover:border-indigo-500/30 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">{item.term}</h3>
                    <div className="flex gap-2">
                      {item.tags.map(tag => <span key={tag} className="text-[10px] uppercase tracking-wider bg-white/10 px-2 py-1 rounded text-gray-400">{tag}</span>)}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{item.definition}</p>
                  <p className="text-gray-400 text-xs italic border-l-2 border-indigo-500 pl-3">{item.explanation}</p>
                  <div className="mt-3 text-indigo-400 text-xs font-semibold uppercase tracking-wide">
                    👉 ACTION: {item.action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FIELD GUIDE MODAL */}
      {showGuide && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-gray-900 border border-white/20 rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">

            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-light tracking-widest text-emerald-400 uppercase">Field Guide</h2>
              <button onClick={() => setShowGuide(false)} className="text-gray-400 hover:text-white transition-colors">✕</button>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto flex-1">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-white">{FIELD_GUIDE.chapters[activeChapter].title}</h3>
                <p className="text-emerald-400 text-sm uppercase tracking-wider">{FIELD_GUIDE.chapters[activeChapter].subtitle}</p>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed font-light">
                {FIELD_GUIDE.chapters[activeChapter].content}
              </p>
            </div>

            {/* Navigation */}
            <div className="p-6 border-t border-white/10 flex justify-between items-center bg-black/20 rounded-b-2xl">
              <button
                onClick={() => setActiveChapter(Math.max(0, activeChapter - 1))}
                disabled={activeChapter === 0}
                className={`px-4 py-2 rounded-lg text-sm ${activeChapter === 0 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:bg-white/5'}`}
              >
                ← Previous
              </button>

              <div className="flex gap-2">
                {FIELD_GUIDE.chapters.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 w-2 rounded-full transition-all ${idx === activeChapter ? 'bg-emerald-500 w-4' : 'bg-gray-700'}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveChapter(Math.min(FIELD_GUIDE.chapters.length - 1, activeChapter + 1))}
                disabled={activeChapter === FIELD_GUIDE.chapters.length - 1}
                className={`px-4 py-2 rounded-lg text-sm ${activeChapter === FIELD_GUIDE.chapters.length - 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:bg-white/5'}`}
              >
                Next →
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DAILY REFLECTION CARD (New) */}
      {dailyPrompt && !analysis && (
        <div className="w-full max-w-2xl mb-6 bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-6 backdrop-blur-sm animate-fade-in relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">Daily Reflection: {dailyPrompt.title}</h3>
          <p className="text-gray-200 text-lg font-light italic mb-4">"{dailyPrompt.question}"</p>
          <div className="text-sm text-indigo-300/80 border-t border-indigo-500/20 pt-3">
            <span className="font-semibold text-indigo-400 mr-2">Action:</span>
            {dailyPrompt.action}
          </div>
        </div>
      )}

      <div className={`w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 transition-all duration-500 ${showGuide ? 'scale-95 opacity-50 blur-sm' : 'scale-100'}`}>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            The Compass
          </h1>
          <p className="text-gray-400 text-sm mt-2">Guardrails for the Spirit</p>
        </div>

        {/* Input Area */}
        <div className="relative mb-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your draft here..."
            className="w-full h-40 bg-black/30 rounded-xl p-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-all"
            style={{ fontSize: '1.1rem', lineHeight: '1.6' }}
          />
          <button
            onClick={checkVibration}
            disabled={loading || !text}
            className={`absolute bottom-4 right-4 px-6 py-2 rounded-full text-sm font-semibold transition-all ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 hover:scale-105 shadow-lg'
              }`}
          >
            {loading ? 'Sensing...' : 'Check Intent'}
          </button>
        </div>

        {/* Analysis Result */}
        {analysis && (
          <div className={`animate-fade-in p-6 rounded-xl border ${analysis.safety_status === 'MALICE' || analysis.safety_status === 'MANIPULATION'
            ? 'bg-red-500/10 border-red-500/50'
            : analysis.safety_status === 'SELF_HARM'
              ? 'bg-indigo-500/10 border-indigo-500/50'
              : 'bg-black/20 border-white/10'
            }`}>

            {/* Safety Lock (The Guardrail) */}
            {(analysis.safety_status === 'MALICE' || analysis.safety_status === 'MANIPULATION' || analysis.safety_status === 'SELF_HARM') ? (
              <div className="text-center">
                <div className="text-4xl mb-2">
                  {analysis.safety_status === 'SELF_HARM' ? '❤️‍🩹' : '🛑'}
                </div>
                <h2 className={`text-xl font-bold mb-2 ${analysis.safety_status === 'SELF_HARM' ? 'text-indigo-400' : 'text-red-400'}`}>
                  {analysis.safety_status === 'MALICE' ? 'MALICE DETECTED' :
                    analysis.safety_status === 'MANIPULATION' ? 'MANIPULATION DETECTED' : 'PLEASE PAUSE'}
                </h2>
                <p className="text-gray-300 italic mb-4">"{analysis.reflection}"</p>
                <div className={`p-4 rounded-lg text-sm ${analysis.safety_status === 'SELF_HARM' ? 'bg-indigo-900/20 text-indigo-200' : 'bg-red-900/20 text-red-200'}`}>
                  {analysis.suggestion}
                </div>
              </div>
            ) : (
              /* Vibration Analysis */
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400 text-sm">Dominant Vibration</span>
                  <span className="text-xl font-bold" style={{ color: getBarColor(analysis.dominant_vibration) }}>
                    {analysis.dominant_vibration?.toUpperCase()}
                  </span>
                </div>

                {/* Bars */}
                <div className="space-y-3 mb-6">
                  {['Shadow', 'Ego', 'Reason', 'Spirit'].map((type) => (
                    <div key={type} className="flex items-center gap-3">
                      <span className="w-16 text-xs text-gray-500 uppercase">{type}</span>
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${analysis.vibration_score?.[type.toLowerCase()] || 0}%`,
                            backgroundColor: getBarColor(type)
                          }}
                        />
                      </div>
                      <span className="w-8 text-xs text-gray-500 text-right">
                        {analysis.vibration_score?.[type.toLowerCase()] || 0}%
                      </span>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <p className="text-lg text-white mb-2">"{analysis.reflection}"</p>

                  {/* REASONING TOGGLE */}
                  <div className="mb-4">
                    <button
                      onClick={() => setShowGuide({ ...showGuide, reasoning: !showGuide.reasoning })}
                      className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-500/30 hover:decoration-blue-500 transition-all font-light tracking-wide uppercase"
                    >
                      {showGuide.reasoning ? "Hide Logic" : "❓ Why?"}
                    </button>

                    {showGuide.reasoning && (
                      <div className="mt-3 bg-blue-900/20 text-blue-200 text-sm p-3 rounded-lg border border-blue-500/20 animate-fade-in text-left leading-relaxed">
                        <span className="block text-xs uppercase tracking-widest text-blue-400 mb-1 opacity-75">Analysis Logic:</span>
                        {analysis.reasoning || "Reasoning not available for this legacy result."}
                      </div>
                    )}
                  </div>

                  <p className="text-emerald-400 text-sm border-t border-white/5 pt-4 mt-2">{analysis.suggestion}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
