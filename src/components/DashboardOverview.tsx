import React from "react";
import { 
  Sparkles, 
  Mail, 
  FileText, 
  Layers, 
  Search, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight 
} from "lucide-react";
import { ActiveTab } from "../types";
// @ts-ignore
import workspaceHero from "../assets/images/workspace_hero_1783583266817.jpg";

interface DashboardOverviewProps {
  onNavigate: (tab: ActiveTab) => void;
  analytics: {
    emailsGenerated: number;
    meetingsSummarized: number;
    plansCreated: number;
    researchesDone: number;
    chatMessagesCount: number;
  };
}

export default function DashboardOverview({ onNavigate, analytics }: DashboardOverviewProps) {
  const totalAutomations = 
    analytics.emailsGenerated + 
    analytics.meetingsSummarized + 
    analytics.plansCreated + 
    analytics.researchesDone + 
    analytics.chatMessagesCount;

  const estimatedHoursSaved = (
    analytics.emailsGenerated * 0.15 + 
    analytics.meetingsSummarized * 0.45 + 
    analytics.plansCreated * 0.3 + 
    analytics.researchesDone * 0.6 + 
    analytics.chatMessagesCount * 0.05
  ).toFixed(1);

  const tools = [
    {
      id: "email" as ActiveTab,
      title: "Smart Email Generator",
      description: "Draft highly tailored professional correspondence with custom tones and target audience context.",
      icon: Mail,
      color: "bg-[#E5D7C4]/40 text-cafe-noir border-[#CFBB99]/20",
      accent: "text-cafe-noir",
      metric: `${analytics.emailsGenerated} drafted`
    },
    {
      id: "meeting" as ActiveTab,
      title: "Meeting Notes Summarizer",
      description: "Convert chaotic, unstructured notes or transcripts into structured summaries, key decisions, and action items.",
      icon: FileText,
      color: "bg-[#889063]/15 text-kombu-green border-[#889063]/25",
      accent: "text-kombu-green",
      metric: `${analytics.meetingsSummarized} summarized`
    },
    {
      id: "planner" as ActiveTab,
      title: "AI Task Planner",
      description: "Structure raw task dumps into an Eisenhower priority grid and an optimized chronologically blocked schedule.",
      icon: Layers,
      color: "bg-[#CFBB99]/20 text-[#4C3D19] border-[#CFBB99]/30",
      accent: "text-cafe-noir",
      metric: `${analytics.plansCreated} schedules`
    },
    {
      id: "research" as ActiveTab,
      title: "AI Research Assistant",
      description: "Perform fast in-depth topic analyses, market driver highlights, and optional real-time Google search grounding.",
      icon: Search,
      color: "bg-kombu-green/10 text-kombu-green border-kombu-green/15",
      accent: "text-kombu-green",
      metric: `${analytics.researchesDone} reports`
    },
    {
      id: "chat" as ActiveTab,
      title: "AI Workplace Chatbot",
      description: "Consult with an elite corporate strategist and copywriting partner for prompt brainstorming, editing, and guidance.",
      icon: MessageSquare,
      color: "bg-[#FAF8F5] text-cafe-noir border-[#CFBB99]/40",
      accent: "text-cafe-noir",
      metric: `${analytics.chatMessagesCount} exchanges`
    }
  ];

  return (
    <div className="animate-fade-in flex flex-col min-h-screen w-full bg-[#FAF8F5]">
      
      {/* Immersive Full-Screen Hero Section */}
      <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-tan/10 shadow-sm">
        
        {/* Background Image - Covers entire first screen, preserves high quality */}
        <img
          src={workspaceHero}
          alt="Biophilic Team Collaboration"
          className="absolute inset-0 object-cover w-full h-full object-center select-none scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Subtle Dark Olive Overlay for extreme readability & biophilic atmospheric theme */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#141b0d]/94 via-[#1c2412]/85 to-[#1c2412]/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[#252e1c]/40 mix-blend-overlay" />

        {/* Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-tan/20 text-tan border border-tan/35 text-xs font-semibold uppercase tracking-wider font-mono backdrop-blur-xs animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-[#889063] animate-pulse" />
            Biophilic Workspace Active
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-white leading-tight max-w-4xl drop-shadow-sm">
            Cultivate Operational Intelligence
          </h1>
          
          <p className="text-bone/90 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl font-medium drop-shadow-xs">
            Nimbus AI bridges organic biophilic design with high-performance cognitive automation. Draft flawless correspondence, distill meeting decisions, optimize priority timelines, and compile Google-grounded sector briefs within a unified, natural workspace.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <a 
              href="#toolkit"
              className="px-6 py-3 bg-tan hover:bg-[#CFBB99] text-kombu-green font-extrabold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer group"
            >
              Explore Automation Modules
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <button 
              onClick={() => onNavigate("chat")}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/25 hover:border-white/40 text-bone font-extrabold text-sm rounded-xl transition-all backdrop-blur-xs cursor-pointer"
            >
              Consult Workspace AI
            </button>
          </div>

          {/* Strategic Value Blocks communicating Productivity, Collaboration, Growth, Innovation, and Human-centered Tech */}
          <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 pt-12 text-left">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-4 transition-all hover:bg-white/10">
              <p className="text-[10px] font-bold text-tan uppercase tracking-widest font-mono">Productivity</p>
              <p className="text-sm font-bold text-bone mt-1">Improved Productivity</p>
              <p className="text-[11px] text-bone/60 mt-0.5 font-medium leading-tight">Instant copy-drafting & decision maps</p>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-4 transition-all hover:bg-white/10">
              <p className="text-[10px] font-bold text-tan uppercase tracking-widest font-mono">Collaboration</p>
              <p className="text-sm font-bold text-bone mt-1">Unified Workflows</p>
              <p className="text-[11px] text-bone/60 mt-0.5 font-medium leading-tight">Shared templates, summaries & chat</p>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-4 transition-all hover:bg-white/10">
              <p className="text-[10px] font-bold text-tan uppercase tracking-widest font-mono">Growth & Innovation</p>
              <p className="text-sm font-bold text-bone mt-1">Grounded Intel</p>
              <p className="text-[11px] text-bone/60 mt-0.5 font-medium leading-tight">Deep real-time search research briefs</p>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-4 transition-all hover:bg-white/10">
              <p className="text-[10px] font-bold text-tan uppercase tracking-widest font-mono">Human-Centered Tech</p>
              <p className="text-sm font-bold text-bone mt-1">Biophilic System</p>
              <p className="text-[11px] text-bone/60 mt-0.5 font-medium leading-tight">Calming plant-rich executive focus</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center text-bone/40 animate-bounce">
          <span className="text-[9px] font-mono tracking-widest uppercase mb-1">Scroll</span>
          <span className="text-xs">↓</span>
        </div>
      </div>

      {/* Main Dashboard Utilities Section */}
      <div id="toolkit" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 w-full">
        {/* Analytics Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-tan/20 rounded-xl p-5 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-[#FAF8F5] text-kombu-green rounded-lg border border-tan/10">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Workspace Activity</p>
              <p className="text-xl font-serif font-extrabold text-cafe-noir">{totalAutomations}</p>
            </div>
          </div>

          <div className="bg-white border border-tan/20 rounded-xl p-5 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-moss-green/10 text-moss-green rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Hours Saved</p>
              <p className="text-xl font-serif font-extrabold text-cafe-noir">{estimatedHoursSaved}h</p>
            </div>
          </div>

          <div className="bg-white border border-tan/20 rounded-xl p-5 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-[#E5D7C4]/30 text-cafe-noir rounded-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Workspace Health</p>
              <p className="text-xl font-serif font-extrabold text-cafe-noir">Workspace Ready</p>
            </div>
          </div>

          <div className="bg-white border border-tan/20 rounded-xl p-5 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-kombu-green/10 text-kombu-green rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Agent Latency</p>
              <p className="text-xl font-serif font-extrabold text-cafe-noir">Fast Response</p>
            </div>
          </div>
        </div>

        {/* Workspace Toolkit Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-extrabold text-cafe-noir tracking-tight">Executive Automation Modules</h2>
            <span className="text-xs text-moss-green font-mono">Select a platform module to focus</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div 
                  key={tool.id} 
                  className="group relative bg-white border border-tan/25 rounded-xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-lg border ${tool.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono bg-[#FAF8F5] border border-tan/15 px-2 py-1 rounded text-moss-green font-bold">
                        {tool.metric}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-serif font-bold text-cafe-noir group-hover:text-kombu-green transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => onNavigate(tool.id)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#FAF8F5] border border-tan/20 text-cafe-noir hover:bg-kombu-green hover:text-bone hover:border-kombu-green rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs"
                    >
                      Open Workspace <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Help Tips / Information Banner */}
        <div className="border border-tan/20 bg-[#FAF8F5] rounded-xl p-6 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-moss-green/10 text-moss-green rounded-lg shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-serif font-bold text-cafe-noir">Refining Output with Authentic Context</h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                To maximize the focus and strategic utility of Nimbus AI, provide deep raw context, realistic meeting notes, or specific audience profiles. Our Gemini models utilize natural workspace presets tailored for high-contrast presentation grids, succinct professional phrasing, and robust Google-powered research reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
