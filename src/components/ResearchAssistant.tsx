import React, { useState } from "react";
import { 
  Search, 
  Sparkles, 
  AlertTriangle, 
  RotateCcw, 
  Globe, 
  FileText, 
  TrendingUp, 
  ShieldAlert, 
  ExternalLink,
  BookOpen
} from "lucide-react";
import { ResearchData, WebSource } from "../types";

interface ResearchAssistantProps {
  onSuccess: () => void;
}

export default function ResearchAssistant({ onSuccess }: ResearchAssistantProps) {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("Comprehensive");
  const [focus, setFocus] = useState("General Professional");
  const [enableWebSearch, setEnableWebSearch] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResearchData | null>(null);

  const handleLoadSample = () => {
    setTopic("Global raw lithium market pricing trends and battery factory demands for 2026-2027");
    setDepth("Market Analysis");
    setFocus("Financial & Supply Chain");
    setEnableWebSearch(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Please enter a research topic.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/research-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          depth,
          focus,
          enableWebSearch
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to compile research briefing.");
      }

      const data: ResearchData = await response.json();
      setResult(data);
      onSuccess(); // Increment analytics count
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during research compilations.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTopic("");
    setDepth("Comprehensive");
    setFocus("General Professional");
    setEnableWebSearch(true);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-[#CFBB99]/25 text-cafe-noir rounded-xl border border-tan/30">
          <Search className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-extrabold text-cafe-noir">AI Research Assistant</h1>
          <p className="text-xs text-moss-green">Perform deep domain briefs and market analyses, backed by optional live search engine grounding</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Research Specifications Form */}
        <div className="lg:col-span-4 bg-white border border-tan/25 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-serif font-bold text-cafe-noir uppercase tracking-wider">Research Scope</h2>
            <button
              onClick={handleLoadSample}
              className="text-[10px] font-bold text-kombu-green hover:bg-moss-green/15 bg-moss-green/10 border border-[#889063]/25 px-2.5 py-1.5 rounded cursor-pointer transition-all"
            >
              Load Sample Subject
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="topic" className="block text-xs font-bold text-slate-700 mb-1">Target Topic / Question *</label>
              <textarea
                id="topic"
                rows={4}
                placeholder="e.g. Impact of next-generation solid state batteries on drone delivery companies, including technical constraints..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 border border-tan/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-kombu-green/10 focus:border-kombu-green bg-[#FAF8F5]/30 text-kombu-green leading-relaxed"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="depth" className="block text-xs font-bold text-slate-700 mb-1">Research Depth</label>
                <select
                  id="depth"
                  value={depth}
                  onChange={(e) => setDepth(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-tan/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-kombu-green/10 focus:border-kombu-green bg-[#FAF8F5]/30 text-kombu-green font-medium cursor-pointer"
                >
                  <option value="Quick Briefing">Quick Briefing</option>
                  <option value="Comprehensive">Comprehensive</option>
                  <option value="Market Analysis">Market Analysis</option>
                </select>
              </div>

              <div>
                <label htmlFor="focus" className="block text-xs font-bold text-slate-700 mb-1">Focus Industry</label>
                <select
                  id="focus"
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-tan/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-kombu-green/10 focus:border-kombu-green bg-[#FAF8F5]/30 text-kombu-green font-medium cursor-pointer"
                >
                  <option value="General Professional">General Business</option>
                  <option value="Technical & Engineering">Technical / Eng</option>
                  <option value="Financial & Supply Chain">Finance & Supply</option>
                  <option value="Policy & Legal Constraints">Policy & Legal</option>
                </select>
              </div>
            </div>

            {/* Toggle Real-time Google Search */}
            <div className="bg-[#FAF8F5]/60 border border-tan/20 rounded-lg p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cafe-noir flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-kombu-green animate-pulse" /> Live Web Grounding
                </span>
                <input
                  type="checkbox"
                  checked={enableWebSearch}
                  onChange={(e) => setEnableWebSearch(e.target.checked)}
                  className="w-4 h-4 rounded text-kombu-green focus:ring-kombu-green/30 border-tan/40"
                />
              </div>
              <p className="text-[10px] text-moss-green leading-relaxed">
                Connects Gemini to live Google Search indices to verify current trends, retrieve URLs, and avoid obsolete database knowledge.
              </p>
            </div>

            {error && (
              <div className="text-xs bg-red-50 text-red-600 border border-red-100 p-3 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-bold text-sm text-bone shadow transition-all flex items-center justify-center gap-2 cursor-pointer ${
                loading ? "bg-slate-300 cursor-not-allowed text-slate-500" : "bg-kombu-green hover:bg-[#404c2b]"
              }`}
            >
              <Sparkles className="w-4 h-4" /> {loading ? "Conducting Research..." : "Compile Analytical Briefing"}
            </button>
          </form>
        </div>

        {/* Research Outputs */}
        <div className="lg:col-span-8 space-y-5">
          {loading && (
            <div className="bg-white border border-tan/20 rounded-xl p-8 shadow-xs text-center space-y-4 h-full flex flex-col justify-center items-center py-24">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-tan/20 border-t-kombu-green rounded-full animate-spin"></div>
                <Search className="w-5 h-5 text-kombu-green absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-serif font-bold text-cafe-noir">
                  {enableWebSearch ? "Querying Google Search Indexes..." : "Compiling Deep Domain Knowledge..."}
                </h3>
                <p className="text-xs text-moss-green max-w-sm">
                  {enableWebSearch 
                    ? "Retrieving live web URLs, parsing modern articles, and synthesizing real-time facts." 
                    : "Extracting parametric business intelligence models and generating structured summaries."}
                </p>
              </div>
            </div>
          )}

          {!loading && !result && (
            <div className="bg-[#FAF8F5]/60 border border-dashed border-tan/30 rounded-xl p-8 text-center py-36 text-moss-green space-y-3">
              <Search className="w-12 h-12 mx-auto stroke-1 text-tan" />
              <div>
                <p className="text-sm font-serif font-bold text-cafe-noir">Pending Research Compilation</p>
                <p className="text-xs max-w-xs mx-auto">Input your corporate thesis or analysis topic on the left and trigger compilation to build real analytical reports.</p>
              </div>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-6 animate-scale-up">
              {/* Toolbar */}
              <div className="bg-white border border-tan/25 rounded-xl p-4 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#CFBB99] animate-pulse"></span>
                  <span className="text-sm font-serif font-bold text-cafe-noir">Analytical Research Briefing</span>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-moss-green hover:text-cafe-noir flex items-center gap-1 cursor-pointer bg-white border border-tan/20 px-2.5 py-1.5 rounded-md hover:shadow-xs transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Start Over
                </button>
              </div>

              {/* Research Layout */}
              <div className="space-y-5">
                {/* 1. Executive Briefing */}
                <div className="bg-white border border-tan/25 rounded-xl p-5 shadow-xs space-y-3">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <FileText className="w-4 h-4 text-kombu-green" /> Executive Briefing
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-sans font-medium">
                    {result.executiveBriefing}
                  </p>
                </div>

                {/* 2. Core Insights & Trends Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Core Insights */}
                  <div className="bg-white border border-tan/25 rounded-xl p-5 shadow-xs space-y-3">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <BookOpen className="w-4 h-4 text-kombu-green" /> Key Insights & Factual Context
                    </h3>
                    <ul className="space-y-2.5">
                      {result.coreInsights.map((insight, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 bg-[#FAF8F5] p-2.5 rounded-lg border border-tan/10">
                          <span className="font-bold text-[#889063] shrink-0 mt-0.5">•</span>
                          <span className="leading-relaxed font-medium text-cafe-noir">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Market Trends */}
                  <div className="bg-white border border-tan/25 rounded-xl p-5 shadow-xs space-y-3">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <TrendingUp className="w-4 h-4 text-[#889063]" /> Emerging Market Drivers
                    </h3>
                    <ul className="space-y-2.5">
                      {result.marketTrends.map((trend, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 bg-[#FAF8F5] p-2.5 rounded-lg border border-tan/10">
                          <span className="font-bold text-[#889063] shrink-0 mt-0.5">•</span>
                          <span className="leading-relaxed font-medium text-cafe-noir">{trend}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 3. Challenges & Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Challenges & Risks */}
                  <div className="bg-white border border-tan/25 rounded-xl p-5 shadow-xs space-y-3">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <ShieldAlert className="w-4 h-4 text-red-500" /> Risks & Obstacles
                    </h3>
                    <ul className="space-y-2.5">
                      {result.challenges.map((challenge, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 bg-red-50/10 p-2.5 rounded-lg border border-red-100/20">
                          <span className="font-bold text-red-500 shrink-0 mt-0.5">•</span>
                          <span className="leading-relaxed font-medium text-cafe-noir">{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Strategic Recommendations */}
                  <div className="bg-white border border-tan/25 rounded-xl p-5 shadow-xs space-y-3">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <Sparkles className="w-4 h-4 text-[#CFBB99]" /> Tactical Recommendations
                    </h3>
                    <ul className="space-y-2.5">
                      {result.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 bg-[#FAF8F5] p-2.5 rounded-lg border border-tan/10">
                          <span className="font-bold text-kombu-green shrink-0 mt-0.5">•</span>
                          <span className="leading-relaxed font-medium text-cafe-noir">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 4. Google Grounding Search Sources */}
                {result.sources && result.sources.length > 0 && (
                  <div className="bg-white border border-tan/25 rounded-xl p-5 shadow-xs space-y-3">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <Globe className="w-4 h-4 text-kombu-green" /> Verified Sources via Google Grounding
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {result.sources.map((src, idx) => (
                        <a 
                          key={idx} 
                          href={src.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="bg-[#FAF8F5] border border-tan/15 p-3 rounded-lg flex items-center justify-between hover:bg-white hover:border-tan/30 transition-all duration-150 group cursor-pointer"
                        >
                          <div className="min-w-0 pr-3">
                            <p className="text-xs font-bold text-cafe-noir truncate group-hover:text-kombu-green transition-colors">
                              {src.title}
                            </p>
                            <p className="text-[10px] font-mono text-moss-green truncate mt-0.5">
                              {src.url}
                            </p>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-moss-green group-hover:text-kombu-green shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div className="border border-tan/20 bg-[#FAF8F5] rounded-xl p-4 text-[11px] text-slate-500 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-moss-green shrink-0" />
                <span>
                  <strong>AI Research Disclaimer:</strong> AI-generated sector briefs synthesize public domains. Double-check technical specifications and regulations. AI outputs should undergo manual review.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
