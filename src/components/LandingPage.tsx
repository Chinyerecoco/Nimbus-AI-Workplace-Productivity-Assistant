import React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { 
  Sparkles, 
  Mail, 
  FileText, 
  Layers, 
  Search, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown,
  Clock,
  TrendingUp,
  Award,
  ShieldCheck,
  Zap
} from "lucide-react";
// @ts-ignore
import workspaceHero from "../assets/images/workspace_hero_1783583266817.jpg";

interface LandingPageProps {
  onEnterWorkspace: () => void;
}

export default function LandingPage({ onEnterWorkspace }: LandingPageProps) {
  const { scrollY } = useScroll();
  // Smooth subtle parallax offset
  const yBg = useTransform(scrollY, [0, 1000], [0, 150]);
  
  const features = [
    {
      icon: Mail,
      title: "Smart Email Generator",
      description: "Write professional emails instantly using audience and tone-based AI assistance.",
      color: "bg-[#CFBB99]/20 text-cafe-noir border-tan/20",
      badge: "Communications"
    },
    {
      icon: FileText,
      title: "Meeting Notes Summarizer",
      description: "Convert lengthy notes into concise summaries with actions and deadlines.",
      color: "bg-[#889063]/15 text-[#354024] border-[#889063]/20",
      badge: "Productivity"
    },
    {
      icon: Layers,
      title: "AI Task Planner",
      description: "Organize workloads through intelligent prioritization and scheduling.",
      color: "bg-[#CFBB99]/20 text-cafe-noir border-tan/20",
      badge: "Schedules"
    },
    {
      icon: Search,
      title: "AI Research Assistant",
      description: "Generate insights, summaries, recommendations, and strategic findings.",
      color: "bg-[#889063]/15 text-[#354024] border-[#889063]/20",
      badge: "Intelligence"
    },
    {
      icon: MessageSquare,
      title: "AI Chat Assistant",
      description: "Receive instant workplace support through conversational AI.",
      color: "bg-[#CFBB99]/20 text-cafe-noir border-tan/20",
      badge: "Assistant"
    }
  ];

  const benefits = [
    {
      title: "Designed to Improve Productivity",
      description: "Streamlines workplace activities and aids raw information sorting using an elegant, unified workspace interface."
    },
    {
      title: "Supports Efficient Workflows",
      description: "Helps reduce repetitive tasks by assisting with drafting and formatting, allowing you to focus on high-impact objectives."
    },
    {
      title: "Clarity & Organization",
      description: "Maps unstructured notes and data dumps directly onto clear visual frameworks and chronological blocked schedules."
    },
    {
      title: "Enhanced Decision Support",
      description: "Enables robust strategic analysis anchored by real-time Google search grounding for accurate and factual sector context."
    },
    {
      title: "Responsible Integration",
      description: "Designed with human-in-the-loop validation principles, encouraging user review for all model-generated briefs."
    }
  ];

  const handleExploreClick = () => {
    document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" });
  };

  // Staggered reveal config for the main headline lines
  const headlineLineVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.15 + i * 0.15,
        duration: 0.85,
        ease: [0.215, 0.61, 0.355, 1.0] // EaseOutCubic for high-end feeling
      }
    })
  };

  // Micro-interaction button transitions
  const buttonTapHoverConfig = {
    whileHover: { scale: 1.025, y: -1 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 400, damping: 25 }
  };

  // Feature card hover variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    visible: (idx: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: idx * 0.08, ease: "easeOut" }
    }),
    hover: {
      y: -6,
      borderColor: "rgba(207, 187, 153, 0.55)",
      boxShadow: "0 12px 30px -10px rgba(64, 76, 43, 0.08), 0 4px 12px -5px rgba(207, 187, 153, 0.15)",
      transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] }
    }
  };

  const cardArrowVariants = {
    initial: { x: 0 },
    hover: { x: 4, transition: { type: "spring", stiffness: 350, damping: 15 } }
  };

  return (
    <div id="landing-container" className="min-h-screen bg-[#FAF8F5] font-sans text-kombu-green flex flex-col selection:bg-tan/30 overflow-x-hidden">
      
      {/* 1. HERO SECTION (Full-screen, covers first viewport) */}
      <section className="relative w-full min-h-screen flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Full Screen High Quality Background Image with subtle parallax */}
        <div className="absolute inset-0 w-full h-full select-none z-0 overflow-hidden">
          <motion.img
            src={workspaceHero}
            alt="Biophilic Team Collaboration"
            style={{ y: yBg }}
            className="w-full h-full object-cover object-center scale-110 origin-top"
            referrerPolicy="no-referrer"
          />
          {/* Subtle Dark Olive overlay blending naturally to highlight text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#12180c]/95 via-[#1a2311]/85 to-[#10150a]/98 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[#252e1c]/45 mix-blend-overlay" />
        </div>

        {/* Hero Header */}
        <div className="relative z-10 w-full max-w-7xl mx-auto pt-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-tan/20 border border-tan/35 text-tan rounded-xl backdrop-blur-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-serif font-extrabold text-white text-xl tracking-tight">Nimbus AI</span>
          </div>
          <motion.button
            onClick={onEnterWorkspace}
            {...buttonTapHoverConfig}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-bone text-xs font-bold rounded-xl transition-colors cursor-pointer backdrop-blur-xs"
          >
            Enter Workspace
          </motion.button>
        </div>

        {/* Hero Body Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto text-center my-auto flex flex-col items-center space-y-8 px-2">
          
          {/* Tagline Badge with quiet organic entrance */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-tan/20 text-tan border border-tan/30 text-xs font-bold uppercase tracking-wider font-mono backdrop-blur-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#889063] animate-pulse" />
            Empowering Human-Centered Technology
          </motion.div>

          {/* Tripartite Headline with luxurious staggered entry */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-extrabold tracking-tight text-white leading-none">
            <motion.span 
              custom={0}
              initial="hidden"
              animate="visible"
              variants={headlineLineVariants}
              className="block drop-shadow-sm text-bone"
            >
              Work Smarter.
            </motion.span>
            <motion.span 
              custom={1}
              initial="hidden"
              animate="visible"
              variants={headlineLineVariants}
              className="block drop-shadow-sm text-tan/95 mt-1 sm:mt-2"
            >
              Think Clearly.
            </motion.span>
            <motion.span 
              custom={2}
              initial="hidden"
              animate="visible"
              variants={headlineLineVariants}
              className="block drop-shadow-sm text-white mt-1 sm:mt-2"
            >
              Achieve More.
            </motion.span>
          </h1>

          {/* Subheadline explaining the platform value */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="text-bone/90 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-medium drop-shadow-xs"
          >
            Nimbus AI is a workplace productivity assistant designed to automate communication, planning, research, and collaboration through intelligent AI-powered tools.
          </motion.p>

          {/* Interactivity Hero Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto pt-2"
          >
            <motion.button
              onClick={onEnterWorkspace}
              {...buttonTapHoverConfig}
              className="w-full sm:w-auto px-8 py-4 bg-tan hover:bg-[#CFBB99] text-kombu-green font-extrabold text-sm rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer group"
            >
              Get Started
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", repeatDelay: 1 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </motion.button>
            <motion.button
              onClick={handleExploreClick}
              {...buttonTapHoverConfig}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/25 text-bone font-extrabold text-sm rounded-xl transition-colors backdrop-blur-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              Explore Features
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll down mouse indicator */}
        <div 
          onClick={handleExploreClick}
          className="relative z-10 pb-8 flex flex-col items-center text-bone/45 hover:text-bone transition-colors cursor-pointer animate-bounce"
        >
          <span className="text-[9px] font-mono tracking-widest uppercase mb-1">Explore Platform</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* 2. FEATURES SHOWCASE SECTION */}
      <section id="features-section" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-tan/10 scroll-mt-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold text-moss-green uppercase tracking-widest font-mono">WORKSPACE TOOLKIT</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-cafe-noir">
            Intelligent Automation Modules
          </h2>
          <div className="w-12 h-1 bg-tan mx-auto rounded-full" />
          <p className="text-xs sm:text-sm text-moss-green max-w-xl mx-auto font-medium leading-relaxed">
            Eliminate cognitive friction. Nimbus AI consolidates essential daily micro-tasks into high-performance biophilic workflows.
          </p>
        </div>

        {/* Features Bento Grid with premium interactive cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={idx} 
                custom={idx}
                initial="initial"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
                className="bg-white border border-tan/20 p-6 rounded-2xl flex flex-col justify-between group relative cursor-default"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3.5 rounded-xl border ${feature.color}`}>
                      <Icon className="w-5 h-5 shrink-0" />
                    </div>
                    <span className="text-[9px] font-mono font-bold bg-[#FAF8F5] border border-tan/15 px-2 py-1 rounded text-moss-green">
                      {feature.badge}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-serif font-bold text-cafe-noir group-hover:text-kombu-green transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <motion.button 
                    onClick={onEnterWorkspace}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#FAF8F5] border border-tan/15 text-cafe-noir hover:bg-kombu-green hover:text-bone hover:border-kombu-green rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Launch Module</span> 
                    <motion.span variants={cardArrowVariants}>
                      <ArrowRight className="w-3 h-3" />
                    </motion.span>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. BENEFITS SECTION ("Why Nimbus?") */}

      <section className="bg-white border-y border-tan/20 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Block info */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold text-moss-green uppercase tracking-widest font-mono">THE SAAS ADVANTAGE</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-cafe-noir leading-tight">
                Why Choose Nimbus AI?
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                SaaS tools shouldn't demand complex technical training. Nimbus AI offers a peaceful, biophilic design paired with a natural, single-screen productivity interface. We focus on immediate utility:
              </p>
              
              <div className="pt-2 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-tan/20 flex items-center justify-center text-cafe-noir font-bold">
                    <Zap className="w-5 h-5 text-cafe-noir" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-cafe-noir">Secure Client-Side Persistence</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Your prompt records are saved locally in browser cache.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-moss-green/10 flex items-center justify-center text-moss-green font-bold">
                    <TrendingUp className="w-5 h-5 text-moss-green" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#354024]">Gemini-Backed Performance</h4>
                    <p className="text-[11px] text-slate-500 font-medium font-sans">Leverage fast model response queries grounded on live search indexing.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right block benefits list */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  whileHover={{ 
                    y: -4, 
                    borderColor: "rgba(207, 187, 153, 0.45)", 
                    boxShadow: "0 6px 20px -8px rgba(64, 76, 43, 0.05)" 
                  }}
                  className="p-5 rounded-2xl bg-[#FAF8F5]/80 border border-tan/15 hover:bg-white transition-colors duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#889063] shrink-0" />
                      <h4 className="text-xs font-serif font-bold text-cafe-noir">
                        {benefit.title}
                      </h4>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 4. RESPONSIBLE AI SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full text-center">
        <div className="bg-[#FAF8F5] border border-tan/30 rounded-2xl p-8 sm:p-10 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-full bg-moss-green/10 text-moss-green flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6 text-moss-green" />
          </div>
          
          <h3 className="text-sm font-serif font-bold text-cafe-noir uppercase tracking-wider">
            Responsible AI Principle
          </h3>
          
          <blockquote className="text-sm font-medium text-cafe-noir leading-relaxed max-w-xl mx-auto italic">
            "AI-generated content may require human review."
          </blockquote>
          
          <div className="w-8 h-px bg-tan/40 mx-auto" />
          
          <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed max-w-2xl mx-auto">
            While Nimbus AI simplifies and accelerates daily administration processes, it operates as a productivity accelerator rather than a final business oracle. We strongly advise that you thoroughly verify technical documentation, legal correspondence drafts, meeting task assignments, and strategic briefings before making critical decisions.
          </p>
        </div>
      </section>

      {/* 5. CALL TO ACTION & ENTRY PANEL */}
      <section className="bg-kombu-green text-bone py-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        
        {/* Subtle decorative background circles */}
        <div className="absolute right-0 top-1/2 transform translate-x-1/3 -translate-y-1/2 opacity-10">
          <Sparkles className="w-96 h-96 text-tan" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <span className="text-[10px] font-mono font-bold tracking-widest text-tan uppercase bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            SECURE ENTERPRISE CONTEXT ACTIVE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold tracking-tight">
            Ready to Streamline Your Workday?
          </h2>
          <p className="text-bone/80 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            Enter the Nimbus AI platform to access your personal dashboard. Zero configuration is needed to explore smart email templates, chronological timetables, and analytical brief engines.
          </p>

          <div className="pt-6">
            <motion.button
              onClick={onEnterWorkspace}
              {...buttonTapHoverConfig}
              className="px-8 py-4 bg-tan hover:bg-[#CFBB99] text-kombu-green font-extrabold text-sm rounded-xl transition-colors shadow-md inline-flex items-center gap-2 cursor-pointer group"
            >
              <span>Enter Nimbus Workspace</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", repeatDelay: 1 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </motion.button>
          </div>
        </div>
      </section>

      {/* Footer copyright */}
      <footer className="py-8 text-center text-slate-400 text-[10px] font-mono border-t border-tan/10 bg-[#FAF8F5]">
        <p>© 2026 Nimbus AI Productivity Platform. Built with biophilic context optimization.</p>
        <p className="mt-1 text-slate-400/70">All metrics and local histories are persistent on your device storage.</p>
      </footer>

    </div>
  );
}
