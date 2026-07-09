import React, { useState } from "react";
import { 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  Check, 
  CheckSquare, 
  Square, 
  ChevronRight, 
  RotateCcw, 
  Calendar, 
  User, 
  UserCheck 
} from "lucide-react";
import { MeetingSummaryData, ActionItem } from "../types";

interface MeetingSummarizerProps {
  onSuccess: () => void;
}

export default function MeetingSummarizer({ onSuccess }: MeetingSummarizerProps) {
  const [rawNotes, setRawNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MeetingSummaryData | null>(null);

  const handleLoadSample = () => {
    const sample = `Meeting: Q3 Product Design & Sync Review
Date: July 8, 2026
Attendees: Sarah (Product Lead), Marcus (UX Architect), David (Tech Lead), Clara (Marketing Manager)

Transcript/Notes:
Sarah: Let's jump in. We need to lock down the redesign for the onboarding funnel. Current checkout completion rate is stuck at 52%, and we want to hit 70% by the end of Q3.
Marcus: I've prepared three new checkout layouts. In our micro-testing, the two-step bento layout had a 18% lift. I recommend we go with Option B (Bento grid summary layout).
Clara: Marketing is ready to align. We can build promotional email templates for the relaunch.
Sarah: Perfect, let's finalize the Bento Option B design. Clara, can you start drafting the email newsletters? Let's aim to have the drafts ready by next Tuesday.
Clara: Yes, I can own that.
David: Tech-wise, we need to make sure the backend endpoint for user state supports the pre-saved bento items. I can run a load-test audit this Friday.
Sarah: Excellent. David, what is the deadline for full development?
David: If design is completed by Clara's copywriting sync on July 18, we can finish coding by August 10 and target deployment on August 15.
Sarah: Great. So let's lock Option B design. Marcus, deliver completed mockups to Clara and David by Monday, July 13.
Marcus: Will do.
David: I also need to coordinate with the database team about state schemas, I will schedule a short sync for Thursday morning.`;
    
    setRawNotes(sample);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawNotes.trim()) {
      setError("Please paste or type raw notes to summarize.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/summarize-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawNotes })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to summarize notes.");
      }

      const data: MeetingSummaryData = await response.json();
      
      // Initialize completed state client-side for action items
      const enrichedItems = data.actionItems.map(item => ({
        ...item,
        completed: false
      }));

      setResult({
        ...data,
        actionItems: enrichedItems
      });
      onSuccess(); // Update analytics count
    } catch (err: any) {
      setError(err.message || "An error occurred during summarization.");
    } finally {
      setLoading(false);
    }
  };

  const toggleActionItem = (index: number) => {
    if (!result) return;
    const items = [...result.actionItems];
    items[index] = { ...items[index], completed: !items[index].completed };
    setResult({ ...result, actionItems: items });
  };

  const handleReset = () => {
    setRawNotes("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-[#889063]/15 text-kombu-green rounded-xl border border-[#889063]/25">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-extrabold text-cafe-noir">Meeting Notes Summarizer</h1>
          <p className="text-xs text-moss-green">Synthesize transcripts and rough minutes into executive summaries and trackable action points</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input Block */}
        <div className="lg:col-span-4 bg-white border border-tan/25 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-serif font-bold text-cafe-noir uppercase tracking-wider">Minutes Input</h2>
            <button
              onClick={handleLoadSample}
              className="text-[10px] font-bold text-kombu-green hover:bg-moss-green/15 bg-moss-green/10 border border-[#889063]/25 px-2.5 py-1.5 rounded cursor-pointer transition-all"
            >
              Load Sample Transcript
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="rawNotes" className="block text-xs font-bold text-slate-700 mb-1">Raw Notes / Transcript Content</label>
              <textarea
                id="rawNotes"
                rows={11}
                placeholder="Paste conversational drafts, loose chat backups, or unstructured scratch notes here..."
                value={rawNotes}
                onChange={(e) => setRawNotes(e.target.value)}
                className="w-full text-xs font-mono px-3.5 py-2.5 border border-tan/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-kombu-green/10 focus:border-kombu-green bg-[#FAF8F5]/30 text-kombu-green leading-relaxed"
                required
              />
            </div>

            {error && (
              <div className="text-xs bg-red-50 text-red-600 border border-red-100 p-3 rounded-lg flex items-start gap-2 animate-fade-in">
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
              <Sparkles className="w-4 h-4" /> {loading ? "Analyzing Transcript..." : "Generate Structured Brief"}
            </button>
          </form>
        </div>

        {/* Output Block */}
        <div className="lg:col-span-8 space-y-4">
          {loading && (
            <div className="bg-white border border-tan/20 rounded-xl p-8 shadow-xs text-center space-y-4 h-full flex flex-col justify-center items-center py-24">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-tan/20 border-t-kombu-green rounded-full animate-spin"></div>
                <FileText className="w-5 h-5 text-kombu-green absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-serif font-bold text-cafe-noir">Extracting Action Parameters...</h3>
                <p className="text-xs text-moss-green max-w-sm">Deducing core decisions, compiling owner assignments, and structuring deadlines chronologically.</p>
              </div>
            </div>
          )}

          {!loading && !result && (
            <div className="bg-[#FAF8F5]/60 border border-dashed border-tan/30 rounded-xl p-8 text-center py-36 text-moss-green space-y-3">
              <FileText className="w-12 h-12 mx-auto stroke-1 text-tan" />
              <div>
                <p className="text-sm font-serif font-bold text-cafe-noir">Pending Summarization Engine</p>
                <p className="text-xs max-w-sm mx-auto">Paste transcript notes or click the sample button on the left to activate full executive summaries and tracking cards.</p>
              </div>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-5 animate-scale-up">
              {/* Brief Toolbar */}
              <div className="bg-white border border-tan/25 rounded-xl p-4 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#889063] animate-pulse"></span>
                  <span className="text-sm font-serif font-bold text-cafe-noir">Executive Corporate Briefing</span>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-moss-green hover:text-cafe-noir flex items-center gap-1 cursor-pointer bg-white border border-tan/20 px-2.5 py-1.5 rounded-md hover:shadow-xs transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Start Over
                </button>
              </div>

              {/* Bento Output Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. Executive Summary */}
                <div className="bg-white border border-tan/25 rounded-xl p-5 shadow-xs space-y-3 md:col-span-2">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <span className="w-1.5 h-3 bg-kombu-green rounded-full"></span> Executive Summary
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-sans">
                    {result.summary}
                  </p>
                </div>

                {/* 2. Key Decisions */}
                <div className="bg-white border border-tan/25 rounded-xl p-5 shadow-xs space-y-3">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <span className="w-1.5 h-3 bg-[#889063] rounded-full"></span> Key Decisions
                  </h3>
                  {result.keyDecisions.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No formal decisions finalized in notes.</p>
                  ) : (
                    <ul className="space-y-2">
                      {result.keyDecisions.map((decision, index) => (
                        <li key={index} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                          <ChevronRight className="w-4 h-4 text-[#CFBB99] shrink-0 mt-0.5" />
                          <span>{decision}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* 3. Deadlines & Milestones */}
                <div className="bg-white border border-tan/25 rounded-xl p-5 shadow-xs space-y-3">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <span className="w-1.5 h-3 bg-tan rounded-full"></span> Deadlines & Milestones
                  </h3>
                  {result.deadlines.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No explicit dates scheduled.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {result.deadlines.map((dl, index) => (
                        <div key={index} className="flex items-center gap-3 bg-[#FAF8F5] border border-tan/10 p-2.5 rounded-lg">
                          <div className="p-1.5 bg-[#E5D7C4]/40 text-cafe-noir rounded-md shrink-0">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{dl.item}</p>
                            <p className="text-[10px] font-mono text-[#889063] font-semibold">{dl.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Action Items (Interactive Tracking) */}
                <div className="bg-white border border-tan/25 rounded-xl p-5 shadow-xs space-y-3 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <span className="w-1.5 h-3 bg-[#CFBB99] rounded-full"></span> Interactive Action Items
                    </h3>
                    <span className="text-[10px] font-mono text-moss-green">Click to toggle progress</span>
                  </div>

                  {result.actionItems.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No explicit action owners extracted.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {result.actionItems.map((item, index) => {
                        const priorityColor = 
                          item.priority.toLowerCase() === "high" ? "bg-red-50 text-red-700 border-red-100" :
                          item.priority.toLowerCase() === "medium" ? "bg-amber-50 text-amber-700 border-amber-100" :
                          "bg-[#FAF8F5] text-kombu-green border-tan/15";

                        return (
                          <div 
                            key={index}
                            onClick={() => toggleActionItem(index)}
                            className={`border rounded-xl p-3.5 transition-all duration-200 cursor-pointer flex items-start gap-3 select-none ${
                              item.completed 
                                ? "bg-[#FAF8F5]/80 border-tan/10 opacity-60 line-through text-slate-400" 
                                : "bg-white border-tan/20 hover:border-tan/35 shadow-xs"
                            }`}
                          >
                            <button className="shrink-0 text-tan hover:text-kombu-green transition-colors mt-0.5">
                              {item.completed ? (
                                <CheckSquare className="w-4 h-4 text-kombu-green" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                            <div className="min-w-0 flex-1 space-y-1.5">
                              <p className={`text-xs font-semibold leading-relaxed text-cafe-noir ${item.completed ? "text-slate-400" : ""}`}>
                                {item.task}
                              </p>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 text-[10px] bg-[#FAF8F5] border border-tan/10 px-2 py-0.5 rounded text-moss-green font-bold">
                                  <User className="w-3 h-3 text-slate-400" /> {item.owner}
                                </span>
                                <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${priorityColor}`}>
                                  {item.priority}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 5. Strategic Next Steps */}
                <div className="bg-white border border-tan/25 rounded-xl p-5 shadow-xs space-y-3 md:col-span-2">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <span className="w-1.5 h-3 bg-kombu-green rounded-full"></span> Future Strategic Steps
                  </h3>
                  <div className="space-y-2">
                    {result.nextSteps.map((step, index) => (
                      <div key={index} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed bg-[#FAF8F5]/50 p-2.5 rounded-lg border border-tan/10">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-moss-green/10 text-moss-green text-[10px] font-bold font-mono shrink-0">
                          {index + 1}
                        </span>
                        <span className="pt-0.5 text-cafe-noir font-medium">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="border border-tan/20 bg-[#FAF8F5] rounded-xl p-4 text-[11px] text-slate-500 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-moss-green shrink-0" />
                <span>
                  <strong>AI Assurance Disclaimer:</strong> AI-generated corporate summaries and action items should be cross-verified with official meeting agendas before deployment.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

