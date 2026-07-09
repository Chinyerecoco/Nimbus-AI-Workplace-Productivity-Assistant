import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Sparkles, Send, Trash2, AlertTriangle, HelpCircle } from "lucide-react";
import { ChatMessage } from "../types";

interface ChatbotInterfaceProps {
  onSuccess: () => void;
}

export default function ChatbotInterface({ onSuccess }: ChatbotInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I am your AI Workplace Productivity Assistant. I am specialized in professional copywriting edits, brainstorming workflow automations, structuring agendas, or answering workspace questions. What can I help you accomplish today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const promptSuggestions = [
    "Audit an email for professional clarity & succinctness",
    "Structure an onboarding agenda for a Senior Designer",
    "Draft a professional 'Out of Office' responder template",
    "Brainstorm 5 ideas to reduce internal Slack fatigue"
  ];

  useEffect(() => {
    // Smoothly scroll to the bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to retrieve chatbot response.");
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
      onSuccess(); // Increment analytics count
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during chat.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hello! I am your AI Workplace Productivity Assistant. I am specialized in professional copywriting edits, brainstorming workflow automations, structuring agendas, or answering workspace questions. What can I help you accomplish today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setError(null);
  };

  return (
    <div className="space-y-6 animate-fade-in flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#CFBB99]/25 text-cafe-noir rounded-xl border border-tan/30">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-extrabold text-cafe-noir">Workplace Productivity Companion</h1>
            <p className="text-xs text-moss-green">Consult with your workspace agent for copy improvements, planning, or brainstorming</p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="text-xs font-semibold text-[#889063] hover:text-red-700 bg-white hover:bg-red-50/50 border border-tan/20 hover:border-red-200 px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear History
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 items-stretch">
        
        {/* Chat Threads Window */}
        <div className="lg:col-span-8 flex flex-col bg-white border border-tan/25 rounded-xl shadow-xs overflow-hidden h-full">
          {/* Thread Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 font-sans bg-[#FAF8F5]/30">
            {messages.map((m) => {
              const isAssistant = m.role === "assistant";
              return (
                <div 
                   key={m.id} 
                   className={`flex gap-3 max-w-[85%] ${
                     isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"
                   }`}
                >
                  {/* Icon Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold font-mono border ${
                    isAssistant 
                      ? "bg-[#354024] text-bone border-[#354024]" 
                      : "bg-[#E5D7C4] text-cafe-noir border-tan/30"
                  }`}>
                    {isAssistant ? "AI" : "ME"}
                  </div>

                  {/* Message Bubble */}
                  <div className="space-y-1">
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      isAssistant 
                        ? "bg-white border border-tan/20 text-cafe-noir shadow-xs font-medium" 
                        : "bg-cafe-noir text-bone font-medium"
                    }`}>
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    </div>
                    <p className={`text-[9px] text-moss-green font-mono ${
                      isAssistant ? "text-left" : "text-right"
                    }`}>
                      {m.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="w-8 h-8 rounded-full bg-[#354024] text-bone flex items-center justify-center text-xs font-bold border border-[#354024]">
                  AI
                </div>
                <div className="bg-white border border-tan/20 p-4 rounded-2xl text-sm shadow-xs flex items-center gap-2 text-moss-green">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#889063] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#889063] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#889063] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="font-semibold text-xs font-mono ml-1 text-cafe-noir">Analyzing workspace metrics...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="text-xs bg-red-50 text-red-600 border border-red-100 p-3.5 rounded-xl flex items-start gap-2 max-w-md mx-auto animate-fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Form Input Box */}
          <div className="border-t border-tan/20 p-4 bg-white shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your productivity agent a question, or ask it to draft a meeting plan (Press Enter to Send)..."
                rows={2}
                className="flex-1 text-sm px-4 py-2.5 border border-tan/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-kombu-green/10 focus:border-kombu-green resize-none bg-[#FAF8F5]/30 text-kombu-green"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className={`px-5 rounded-xl text-bone font-bold text-sm shadow flex items-center justify-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  loading || !input.trim() 
                    ? "bg-slate-300 cursor-not-allowed text-slate-500" 
                    : "bg-kombu-green hover:bg-[#404c2b]"
                }`}
              >
                <Send className="w-4 h-4" /> Send
              </button>
            </form>
            <div className="mt-2 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-moss-green" />
              AI-generated content may require human review.
            </div>
          </div>
        </div>

        {/* Prompt Suggestions Column */}
        <div className="lg:col-span-4 bg-white border border-tan/25 rounded-xl p-5 shadow-xs flex flex-col justify-between h-full">
          <div className="space-y-4">
            <h3 className="text-xs font-serif font-bold text-cafe-noir uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-moss-green" /> Quick-Start Prompts
            </h3>
            <p className="text-xs text-moss-green leading-relaxed">
              Click any chip below to instantly populate or run a pre-drafted workspace optimization prompt in the active chat container:
            </p>

            <div className="space-y-3 pt-2">
              {promptSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(suggestion)}
                  disabled={loading}
                  className="w-full text-left text-xs bg-[#FAF8F5] border border-tan/15 hover:bg-white hover:border-tan/45 rounded-xl p-3.5 transition-all duration-150 cursor-pointer block leading-relaxed hover:shadow-xs"
                >
                  <span className="font-semibold text-cafe-noir hover:text-kombu-green transition-colors block">
                    {suggestion}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#E5D7C4]/40 border border-tan/20 rounded-xl p-4 mt-6">
            <h4 className="text-xs font-serif font-bold text-cafe-noir flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-kombu-green" /> Custom System Persona
            </h4>
            <p className="text-[11px] text-[#4C3D19] leading-relaxed mt-1 font-medium">
              The agent is configured as an elite workplace consultant. It is primed to suggest workflows, audit text for crisp readability, and draft action tables.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
