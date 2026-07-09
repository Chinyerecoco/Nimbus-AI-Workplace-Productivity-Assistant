import React, { useState } from "react";
import { 
  Layers, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  RotateCcw, 
  BookOpen, 
  Compass, 
  Flame, 
  CalendarRange, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { TaskPlanData } from "../types";

interface TaskPlannerProps {
  onSuccess: () => void;
}

export default function TaskPlanner({ onSuccess }: TaskPlannerProps) {
  const [rawTasks, setRawTasks] = useState("");
  const [workHours, setWorkHours] = useState("Standard 8-hour workday");
  const [mainGoals, setMainGoals] = useState("Draft slide deck & clear high-priority emails");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TaskPlanData | null>(null);

  const handleLoadSample = () => {
    setRawTasks(`- Reply to Sarah about onboarding mockup edits (takes 20 mins)
- Finish draft of Q3 engineering roadmap (high priority, takes 2 hours)
- Review candidate resumes for Senior Frontend hire (deadline tomorrow, takes 1 hour)
- Unsubscribe from random newsletters clogging inbox (takes 15 mins)
- Clean up workspace files and desktop folder (takes 30 mins)
- Sync with David about DB schema changes (takes 30 mins)
- Call internet provider about router slowdown (not critical, takes 20 mins)
- Book flight and hotel details for upcoming August conference (needs to be done soon, takes 45 mins)`);
    setWorkHours("6 hours focused block");
    setMainGoals("Unblock team mocks and draft tech roadmap");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawTasks.trim()) {
      setError("Please dump some raw tasks or brain ideas to organize.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/plan-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawTasks,
          workHours,
          mainGoals
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to organize task plan.");
      }

      const data: TaskPlanData = await response.json();
      setResult(data);
      onSuccess(); // Increment analytics count
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during task scheduling.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRawTasks("");
    setWorkHours("Standard 8-hour workday");
    setMainGoals("Draft slide deck & clear high-priority emails");
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-[#CFBB99]/25 text-cafe-noir rounded-xl border border-tan/30">
          <Layers className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-extrabold text-cafe-noir">AI Task Planner & Scheduler</h1>
          <p className="text-xs text-moss-green">Transform chaotic todo dumps into prioritized Eisenhower grids and chronological schedules</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Planner Inputs */}
        <div className="lg:col-span-4 bg-white border border-tan/25 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-serif font-bold text-cafe-noir uppercase tracking-wider">Plan Parameters</h2>
            <button
              onClick={handleLoadSample}
              className="text-[10px] font-bold text-kombu-green hover:bg-moss-green/15 bg-moss-green/10 border border-[#889063]/25 px-2.5 py-1.5 rounded cursor-pointer transition-all"
            >
              Load Sample Todo Dump
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="rawTasks" className="block text-xs font-bold text-slate-700 mb-1">Todo Dump / Idea List *</label>
              <textarea
                id="rawTasks"
                rows={7}
                placeholder="List everything on your mind, high priority or small chores, with rough estimates..."
                value={rawTasks}
                onChange={(e) => setRawTasks(e.target.value)}
                className="w-full text-xs font-mono px-3.5 py-2.5 border border-tan/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-kombu-green/10 focus:border-kombu-green bg-[#FAF8F5]/30 text-kombu-green leading-relaxed"
                required
              />
            </div>

            <div>
              <label htmlFor="workHours" className="block text-xs font-bold text-slate-700 mb-1">Available Work Hours</label>
              <input
                id="workHours"
                type="text"
                placeholder="e.g. Standard 8-hour workday, 4 hours morning sprint"
                value={workHours}
                onChange={(e) => setWorkHours(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 border border-tan/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-kombu-green/10 focus:border-kombu-green bg-[#FAF8F5]/30 text-kombu-green font-medium"
              />
            </div>

            <div>
              <label htmlFor="mainGoals" className="block text-xs font-bold text-slate-700 mb-1">Main Goals or Core Focus</label>
              <input
                id="mainGoals"
                type="text"
                placeholder="e.g. Unblock high-leverage engineering review tasks"
                value={mainGoals}
                onChange={(e) => setMainGoals(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 border border-tan/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-kombu-green/10 focus:border-kombu-green bg-[#FAF8F5]/30 text-kombu-green font-medium"
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
              <Sparkles className="w-4 h-4" /> {loading ? "Optimizing Workload..." : "Generate Optimized Day-Plan"}
            </button>
          </form>
        </div>

        {/* Plan Outputs */}
        <div className="lg:col-span-8 space-y-5">
          {loading && (
            <div className="bg-white border border-tan/20 rounded-xl p-8 shadow-xs text-center space-y-4 h-full flex flex-col justify-center items-center py-24">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-tan/20 border-t-kombu-green rounded-full animate-spin"></div>
                <Layers className="w-5 h-5 text-kombu-green absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-serif font-bold text-cafe-noir">Structuring Eisenhower Metrics...</h3>
                <p className="text-xs text-moss-green max-w-sm">Calculating urgency factors, plotting time-blocking slots, and preparing custom cognitive tips.</p>
              </div>
            </div>
          )}

          {!loading && !result && (
            <div className="bg-[#FAF8F5]/60 border border-dashed border-tan/30 rounded-xl p-8 text-center py-36 text-moss-green space-y-3">
              <Layers className="w-12 h-12 mx-auto stroke-1 text-tan" />
              <div>
                <p className="text-sm font-serif font-bold text-cafe-noir">Pending Scheduler Compilation</p>
                <p className="text-xs max-w-xs mx-auto">Fill out the task dump list and goal descriptions on the left to activate deep schedule blocking.</p>
              </div>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-6 animate-scale-up">
              {/* Toolbar */}
              <div className="bg-white border border-tan/25 rounded-xl p-4 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#CFBB99] animate-pulse"></span>
                  <span className="text-sm font-serif font-bold text-cafe-noir">Dynamic Productivity Blueprint</span>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-moss-green hover:text-cafe-noir flex items-center gap-1 cursor-pointer bg-white border border-tan/20 px-2.5 py-1.5 rounded-md hover:shadow-xs transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Start Over
                </button>
              </div>

              {/* 1. Eisenhower Matrix Grid */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-3 bg-kombu-green rounded-full"></span> Priority Matrix (Eisenhower Grid)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Q1: Do First */}
                  <div className="bg-white border-l-4 border-cafe-noir border-y border-r border-tan/20 rounded-xl p-4.5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cafe-noir uppercase tracking-wide flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-cafe-noir" /> Quadrant I: Do First
                      </span>
                      <span className="text-[9px] font-mono font-bold text-[#889063] bg-[#FAF8F5] border border-tan/10 px-1.5 py-0.5 rounded">Urgent & Important</span>
                    </div>
                    {result.eisenhower.urgentImportant.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No critical bottlenecks identified.</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {result.eisenhower.urgentImportant.map((item, idx) => (
                          <li key={idx} className="text-xs text-slate-800 flex items-start gap-1.5 bg-[#FAF8F5] p-2 rounded border border-tan/10">
                            <span className="text-cafe-noir font-bold shrink-0 mt-0.5">•</span>
                            <span className="font-medium text-slate-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Q2: Schedule */}
                  <div className="bg-white border-l-4 border-kombu-green border-y border-r border-tan/20 rounded-xl p-4.5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-kombu-green uppercase tracking-wide flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-kombu-green" /> Quadrant II: Schedule
                      </span>
                      <span className="text-[9px] font-mono font-bold text-[#889063] bg-[#FAF8F5] border border-tan/10 px-1.5 py-0.5 rounded">Important, Not Urgent</span>
                    </div>
                    {result.eisenhower.importantNotUrgent.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No long-term strategic projects allocated.</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {result.eisenhower.importantNotUrgent.map((item, idx) => (
                          <li key={idx} className="text-xs text-slate-800 flex items-start gap-1.5 bg-[#FAF8F5] p-2 rounded border border-tan/10">
                            <span className="text-kombu-green font-bold shrink-0 mt-0.5">•</span>
                            <span className="font-medium text-slate-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Q3: Delegate or Automate */}
                  <div className="bg-white border-l-4 border-[#889063] border-y border-r border-tan/20 rounded-xl p-4.5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#4C3D19] uppercase tracking-wide flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-[#889063]" /> Quadrant III: Delegate
                      </span>
                      <span className="text-[9px] font-mono font-bold text-[#889063] bg-[#FAF8F5] border border-tan/10 px-1.5 py-0.5 rounded">Urgent, Not Important</span>
                    </div>
                    {result.eisenhower.urgentNotImportant.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No transactional tasks detected.</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {result.eisenhower.urgentNotImportant.map((item, idx) => (
                          <li key={idx} className="text-xs text-slate-800 flex items-start gap-1.5 bg-[#FAF8F5] p-2 rounded border border-tan/10">
                            <span className="text-moss-green font-bold shrink-0 mt-0.5">•</span>
                            <span className="font-medium text-slate-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Q4: Eliminate / Postpone */}
                  <div className="bg-white border-l-4 border-tan border-y border-r border-tan/20 rounded-xl p-4.5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#889063] uppercase tracking-wide flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-tan" /> Quadrant IV: Eliminate
                      </span>
                      <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">Low Leverages</span>
                    </div>
                    {result.eisenhower.neither.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No low-leverage clutter identified.</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {result.eisenhower.neither.map((item, idx) => (
                          <li key={idx} className="text-xs text-slate-500 flex items-start gap-1.5 bg-slate-100/50 p-2 rounded border border-slate-200/50 line-through">
                            <span className="text-slate-400 font-bold shrink-0 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Chronological Schedule Blocks */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-3 bg-kombu-green rounded-full"></span> Time-Blocked Daily Schedule
                </h3>

                <div className="bg-white border border-tan/25 rounded-xl p-5 shadow-xs space-y-4">
                  <div className="relative border-l-2 border-tan/20 pl-4 ml-2.5 space-y-6">
                    {result.schedule.map((slot, idx) => {
                      const isBreak = slot.activity.toLowerCase().includes("break") || slot.activity.toLowerCase().includes("pomodoro rest");
                      
                      return (
                        <div key={idx} className="relative group">
                          {/* Chronological dot indicator */}
                          <span className={`absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full border-2 ${
                            isBreak 
                              ? "bg-white border-tan/40" 
                              : "bg-kombu-green border-[#FAF8F5]"
                          }`} />

                          <div className={`p-3.5 rounded-lg border transition-all ${
                            isBreak 
                              ? "bg-[#FAF8F5]/40 border-tan/15 border-dashed" 
                              : "bg-white border-tan/20 hover:shadow-xs hover:border-tan/30"
                          }`}>
                            <div className="flex flex-wrap items-center justify-between gap-1.5">
                              <span className="text-xs font-bold font-mono text-cafe-noir flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-moss-green" /> {slot.timeSlot}
                              </span>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                                isBreak ? "bg-[#FAF8F5] text-[#889063] border border-tan/10" : "bg-[#E5D7C4]/40 text-cafe-noir"
                              }`}>
                                {slot.duration}
                              </span>
                            </div>
                            <p className={`text-xs mt-1.5 font-medium leading-relaxed ${
                              isBreak ? "text-[#889063] italic" : "text-slate-800 font-sans"
                            }`}>
                              {slot.activity}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 3. Tactical Productivity Tips */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-3 bg-[#CFBB99] rounded-full"></span> Tailored Productivity Tips
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.tips.map((tip, idx) => (
                    <div key={idx} className="bg-[#FAF8F5] border border-tan/15 rounded-xl p-4 text-xs text-slate-700 flex items-start gap-2.5 shadow-xs">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-moss-green/10 text-moss-green font-bold shrink-0 mt-0.5 text-[10px] font-mono">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed font-sans text-cafe-noir font-medium">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="border border-tan/20 bg-[#FAF8F5] rounded-xl p-4 text-[11px] text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-moss-green shrink-0" />
                <span>
                  <strong>AI Scheduler Notice:</strong> Structured schedules are mathematical recommendations. Modify block sizes to fit cognitive focus fluctuations. AI outputs require human review.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

