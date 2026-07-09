import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Mail, 
  FileText, 
  Layers, 
  Search, 
  MessageSquare, 
  LayoutDashboard, 
  Menu, 
  X, 
  Clock, 
  HelpCircle,
  AlertCircle,
  Home
} from "lucide-react";
import { ActiveTab } from "./types";
import DashboardOverview from "./components/DashboardOverview";
import SmartEmailGenerator from "./components/SmartEmailGenerator";
import MeetingSummarizer from "./components/MeetingSummarizer";
import TaskPlanner from "./components/TaskPlanner";
import ResearchAssistant from "./components/ResearchAssistant";
import ChatbotInterface from "./components/ChatbotInterface";
import LandingPage from "./components/LandingPage";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [enteredWorkspace, setEnteredWorkspace] = useState(false);

  // Persistent analytics state to represent real SaaS metrics
  const [analytics, setAnalytics] = useState({
    emailsGenerated: 3,
    meetingsSummarized: 2,
    plansCreated: 1,
    researchesDone: 2,
    chatMessagesCount: 5,
  });

  // Load analytics from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ai_workplace_analytics");
    if (saved) {
      try {
        setAnalytics(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved analytics", e);
      }
    }
  }, []);

  // Save analytics helper
  const incrementMetric = (key: keyof typeof analytics) => {
    setAnalytics((prev) => {
      const updated = {
        ...prev,
        [key]: prev[key] + 1,
      };
      localStorage.setItem("ai_workplace_analytics", JSON.stringify(updated));
      return updated;
    });
  };

  const menuItems = [
    { id: "dashboard" as ActiveTab, label: "Dashboard", icon: LayoutDashboard },
    { id: "email" as ActiveTab, label: "Smart Email", icon: Mail },
    { id: "meeting" as ActiveTab, label: "Notes Summarizer", icon: FileText },
    { id: "planner" as ActiveTab, label: "AI Task Planner", icon: Layers },
    { id: "research" as ActiveTab, label: "Research Assistant", icon: Search },
    { id: "chat" as ActiveTab, label: "Productivity Chat", icon: MessageSquare },
  ];

  const handleTabSelect = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const calculatedHoursSaved = (
    analytics.emailsGenerated * 0.15 + 
    analytics.meetingsSummarized * 0.45 + 
    analytics.plansCreated * 0.3 + 
    analytics.researchesDone * 0.6 + 
    analytics.chatMessagesCount * 0.05
  ).toFixed(1);

  if (!enteredWorkspace) {
    return <LandingPage onEnterWorkspace={() => setEnteredWorkspace(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans text-kombu-green">
      
      {/* Mobile Top Navigation Bar */}
      <header className="lg:hidden shrink-0 bg-kombu-green text-bone px-4 py-3.5 flex items-center justify-between border-b border-cafe-noir/15 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-moss-green rounded-lg text-bone">
            <Sparkles className="w-5 h-5 text-bone" />
          </div>
          <span className="font-serif font-bold text-base tracking-tight text-bone">Nimbus AI</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 hover:bg-moss-green/30 rounded-lg text-bone/90 hover:text-bone cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex relative overflow-hidden">
        
        {/* Sidebar Left Navigation (Desktop & Mobile Panel) */}
        <aside className={`lg:flex flex-col shrink-0 w-64 bg-white text-slate-700 border-r border-tan/30 z-30 transition-all duration-300 absolute lg:relative inset-y-0 left-0 transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}>
          {/* Logo Brand Block */}
          <div className="px-6 py-6 border-b border-[#FAF8F5] flex items-center gap-2.5">
            <div className="p-2 bg-kombu-green rounded-xl text-bone shadow-md shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-extrabold text-cafe-noir text-lg tracking-tight leading-none">
                Nimbus AI
              </h1>
              <span className="text-[10px] font-bold text-moss-green font-mono tracking-wider uppercase mt-1 block">
                Executive Workspace
              </span>
            </div>
          </div>

          {/* Navigation Links list */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabSelect(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-kombu-green text-bone font-serif shadow-xs"
                      : "text-slate-600 hover:bg-[#FAF8F5] hover:text-kombu-green"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            <div className="pt-4 mt-4 border-t border-tan/15">
              <button
                onClick={() => setEnteredWorkspace(false)}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-extrabold text-moss-green hover:bg-tan/10 hover:text-kombu-green transition-all duration-150 cursor-pointer border border-dashed border-tan/30"
              >
                <Home className="w-4 h-4 shrink-0" />
                <span>View Landing Page</span>
              </button>
            </div>
          </nav>

          {/* Sidebar Metrics & Pro Plan Promo blocks */}
          <div className="p-4 border-t border-tan/20 space-y-3 bg-[#FAF8F5]/50">
            {/* Hours Saved Widget */}
            <div className="bg-white border border-tan/20 rounded-xl p-3 flex items-center gap-3 shadow-xs">
              <div className="p-2 bg-moss-green/15 text-moss-green rounded-lg shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. Hours Saved</p>
                <p className="text-sm font-extrabold text-kombu-green">{calculatedHoursSaved} hours</p>
              </div>
            </div>

            {/* Pro Plan promo card */}
            <div className="bg-kombu-green rounded-xl p-4 text-bone shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1 font-mono">Premium Active</p>
              <p className="text-xs font-serif italic mb-3 text-bone/90">Unlimited productivity tools & biophilic spaces.</p>
              <div className="w-full py-1.5 bg-tan text-kombu-green rounded-lg text-[11px] font-extrabold text-center select-none shadow-sm">
                Enterprise Workspace
              </div>
            </div>
            
            {/* Disclaimer in Sidebar footer */}
            <div className="text-[10px] text-slate-400 leading-relaxed font-mono px-1 flex items-start gap-1.5 pt-1">
              <AlertCircle className="w-3 h-3 text-moss-green shrink-0 mt-0.5" />
              <span>AI output requires review.</span>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar overlay backing */}
        {mobileMenuOpen && (
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden absolute inset-0 bg-[#354024]/40 z-20 backdrop-blur-xs"
          />
        )}

        {/* Inner Content Block: Top Header + Main Pane */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Top Header Bar (Desktop/Tablet) */}
          <header className="hidden lg:flex h-16 bg-white border-b border-tan/15 items-center justify-between px-8 shrink-0">
            <div className="flex items-center gap-4">
              <h2 className="text-base font-serif font-extrabold text-cafe-noir tracking-tight">Nimbus AI</h2>
              <span className="px-2.5 py-1 bg-[#889063]/10 text-moss-green text-[10px] font-extrabold rounded-full border border-[#889063]/25 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-moss-green animate-pulse" />
                BIOPHILIC CONTEXT ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-moss-green absolute left-4 top-3" />
                <input 
                  type="text" 
                  placeholder="Search workspace logs..." 
                  className="bg-[#FAF8F5] border border-tan/30 rounded-full py-2 pl-10 pr-4 text-xs w-60 focus:outline-none focus:ring-2 focus:ring-kombu-green/10 focus:border-kombu-green transition-all text-kombu-green font-medium"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-extrabold text-cafe-noir leading-none">Nimbus User</p>
                  <p className="text-[10px] text-moss-green font-medium mt-1">Workspace Member</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-bone/40 border-2 border-kombu-green flex items-center justify-center font-extrabold text-kombu-green text-xs shadow-xs">
                  NU
                </div>
              </div>
            </div>
          </header>

          {/* Right Pane Body content */}
          <main className={`flex-1 overflow-y-auto bg-[#FAF8F5]/30 ${activeTab === "dashboard" ? "" : "p-4 sm:p-6 lg:p-8 space-y-6"}`}>
            <div className={activeTab === "dashboard" ? "h-full" : "max-w-7xl mx-auto h-full"}>
              
              {/* Active view component mount */}
              {activeTab === "dashboard" && (
                <DashboardOverview 
                  onNavigate={handleTabSelect} 
                  analytics={analytics} 
                />
              )}
              
              {activeTab === "email" && (
                <SmartEmailGenerator 
                  onSuccess={() => incrementMetric("emailsGenerated")} 
                />
              )}

              {activeTab === "meeting" && (
                <MeetingSummarizer 
                  onSuccess={() => incrementMetric("meetingsSummarized")} 
                />
              )}

              {activeTab === "planner" && (
                <TaskPlanner 
                  onSuccess={() => incrementMetric("plansCreated")} 
                />
              )}

              {activeTab === "research" && (
                <ResearchAssistant 
                  onSuccess={() => incrementMetric("researchesDone")} 
                />
              )}

              {activeTab === "chat" && (
                <ChatbotInterface 
                  onSuccess={() => incrementMetric("chatMessagesCount")} 
                />
              )}

            </div>
          </main>
        </div>

      </div>
    </div>
  );
}
