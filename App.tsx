import React, { useState } from 'react';
import { Sparkles, Copy, Check, Info, AlertCircle } from 'lucide-react';
import { PLATFORM_CONFIG, TONE_CONFIG } from './constants';
import { Platform, Tone, GeneratedPost } from './types';
import { generateSocialContent } from './services/geminiService';
import { PreviewCard } from './components/PreviewCard';

const App: React.FC = () => {
  // State
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<Platform>(Platform.LINKEDIN);
  const [tone, setTone] = useState<Tone>(Tone.PROFESSIONAL);
  const [audience, setAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<GeneratedPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Character Limit Logic
  const maxLength = PLATFORM_CONFIG[platform].maxLength;
  const currentLength = topic.length;
  const charsRemaining = maxLength - currentLength;
  const isOverLimit = charsRemaining < 0;
  const isNearLimit = charsRemaining <= 20 && !isOverLimit;

  // Handlers
  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setError(null);
    setCopied(false);
    
    // Clear previous results while loading to show skeleton
    // Optionally keep old result but gray it out, but skeleton is cleaner
    // setGeneratedData(null); 

    try {
      const result = await generateSocialContent({
        topic,
        platform,
        tone,
        audience: audience || 'General Professional Audience'
      });
      setGeneratedData(result);
    } catch (err) {
      setError("Failed to generate content. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedData) return;
    const fullText = `${generatedData.content}\n\n${generatedData.hashtags.map(t => t.startsWith('#') ? t : `#${t}`).join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">SocialPulse AI</span>
          </div>
          <div className="text-sm text-slate-500 font-medium hidden sm:block">
            Powered by Gemini 2.5
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Post Configuration</h2>
              
              {/* Platform Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Platform</label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.values(Platform).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                        platform === p 
                          ? `${PLATFORM_CONFIG[p].bgColor} ${PLATFORM_CONFIG[p].borderColor} ring-2 ring-offset-1 ring-indigo-500 border-transparent`
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`mb-2 ${platform === p ? PLATFORM_CONFIG[p].color : 'text-slate-500'}`}>
                        {PLATFORM_CONFIG[p].icon}
                      </div>
                      <span className={`text-xs font-medium ${platform === p ? 'text-indigo-900' : 'text-slate-600'}`}>
                        {p}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Input */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="topic" className="block text-sm font-medium text-slate-700">
                    What is this post about?
                  </label>
                </div>
                <textarea
                  id="topic"
                  rows={4}
                  className={`w-full rounded-xl shadow-sm text-slate-900 resize-none p-3 border transition-all bg-white ${
                    isOverLimit
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : isNearLimit
                      ? 'border-orange-300 focus:border-orange-500 focus:ring-orange-500'
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                  placeholder={PLATFORM_CONFIG[platform].placeholder}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                ></textarea>
                <div className={`text-right mt-1.5 text-xs font-medium transition-colors flex justify-end items-center gap-1 ${
                  isOverLimit ? 'text-red-600' : isNearLimit ? 'text-orange-600' : 'text-slate-400'
                }`}>
                  {isOverLimit && <AlertCircle className="w-3 h-3" />}
                  <span>
                    {isOverLimit 
                      ? `${Math.abs(charsRemaining)} characters over limit` 
                      : `${charsRemaining} characters remaining`}
                  </span>
                </div>
              </div>

              {/* Tone Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Tone of Voice</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(Tone).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors ${
                        tone === t
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {TONE_CONFIG[t].icon}
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Audience Input */}
              <div className="mb-8">
                <label htmlFor="audience" className="block text-sm font-medium text-slate-700 mb-2">
                  Target Audience <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="audience"
                  className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-slate-900 p-2.5 border bg-white"
                  placeholder="e.g. UX Designers, Small Business Owners..."
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!topic.trim() || isGenerating}
                className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-white font-semibold text-lg shadow-lg shadow-indigo-500/20 transition-all ${
                  !topic.trim() || isGenerating
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30 active:transform active:scale-[0.98]'
                }`}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Content
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}
            </div>
            
            <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="font-semibold text-lg mb-2">Pro Tip</h3>
                <p className="text-indigo-200 text-sm leading-relaxed">
                  For better results, mention specific key points or data you want included in the post. The AI works best with specific direction!
                </p>
              </div>
              <Sparkles className="absolute -bottom-4 -right-4 w-24 h-24 text-indigo-800 opacity-50" />
            </div>

          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-7">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  {platform} Preview
                </h2>
                
                {generatedData && (
                  <div className="flex gap-2">
                     <div className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 shadow-sm">
                        <Info className="w-3.5 h-3.5" />
                        Est. Reach: {generatedData.estimatedReach}
                     </div>
                    <button 
                      onClick={handleCopy}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        copied 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-sm'
                      }`}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy Text'}
                    </button>
                  </div>
                )}
              </div>

              <PreviewCard 
                platform={platform} 
                data={generatedData} 
                isLoading={isGenerating} 
              />

              {/* Character Count Warning if applicable */}
              {generatedData && generatedData.content.length > PLATFORM_CONFIG[platform].maxLength && (
                <div className="mt-4 p-3 bg-orange-50 text-orange-800 rounded-lg border border-orange-100 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Warning: Content exceeds {platform}'s character limit ({generatedData.content.length}/{PLATFORM_CONFIG[platform].maxLength}).
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;