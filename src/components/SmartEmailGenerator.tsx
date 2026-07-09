import React, { useState } from "react";
import { Mail, Sparkles, Copy, Check, RotateCcw, AlertTriangle, Plus, Trash2 } from "lucide-react";
import { EmailData } from "../types";

interface SmartEmailGeneratorProps {
  onSuccess: () => void;
}

export default function SmartEmailGenerator({ onSuccess }: SmartEmailGeneratorProps) {
  const [recipient, setRecipient] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState("Professional");
  const [audience, setAudience] = useState("Colleague");
  
  // Interactive key points builder
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [currentPoint, setCurrentPoint] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EmailData | null>(null);

  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  const handleAddPoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPoint.trim() !== "") {
      setKeyPoints([...keyPoints, currentPoint.trim()]);
      setCurrentPoint("");
    }
  };

  const handleRemovePoint = (index: number) => {
    setKeyPoints(keyPoints.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context.trim()) {
      setError("Please describe the context or purpose of the email.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient,
          context,
          tone,
          audience,
          keyPoints: keyPoints.length > 0 ? keyPoints : [context]
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate email");
      }

      const data: EmailData = await response.json();
      setResult(data);
      onSuccess(); // Increment analytics count
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopySubject = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.subject);
    setCopiedSubject(true);
    setTimeout(() => setCopiedSubject(false), 2000);
  };

  const handleCopyBody = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.body);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  const handleReset = () => {
    setRecipient("");
    setContext("");
    setTone("Professional");
    setAudience("Colleague");
    setKeyPoints([]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-[#E5D7C4]/40 text-cafe-noir rounded-xl border border-tan/20">
          <Mail className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-extrabold text-cafe-noir">Smart Email Generator</h1>
          <p className="text-xs text-moss-green">Draft highly tailored professional correspondence with custom tones and target audience context.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input Form Column */}
        <div className="lg:col-span-5 bg-white border border-tan/25 rounded-xl p-5 shadow-xs space-y-5">
          <h2 className="text-sm font-serif font-bold text-cafe-noir uppercase tracking-wider">Email Specifications</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="recipient" className="block text-xs font-bold text-slate-700 mb-1">Recipient Name / Title</label>
              <input
                id="recipient"
                type="text"
                placeholder="e.g. Director of Operations, Client Success Team"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 border border-tan/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-kombu-green/10 focus:border-kombu-green bg-[#FAF8F5]/30 text-kombu-green font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="audience" className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                <select
                  id="audience"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 border border-tan/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-kombu-green/10 focus:border-kombu-green bg-white font-medium text-kombu-green"
                >
                  <option value="Colleague">Colleague</option>
                  <option value="Executive">Executive</option>
                  <option value="Client">Client</option>
                  <option value="Vendor">Vendor</option>
                  <option value="General Team">General Team</option>
                </select>
              </div>

              <div>
                <label htmlFor="tone" className="block text-xs font-bold text-slate-700 mb-1">Tone & Voice</label>
                <select
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 border border-tan/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-kombu-green/10 focus:border-kombu-green bg-white font-medium text-kombu-green"
                >
                  <option value="Professional">Professional</option>
                  <option value="Warm & Friendly">Warm & Friendly</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Apologetic">Apologetic</option>
                  <option value="Persuasive">Persuasive</option>
                  <option value="Casual">Casual</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="context" className="block text-xs font-bold text-slate-700 mb-1">Core Purpose / Context *</label>
              <textarea
                id="context"
                rows={3}
                placeholder="Describe the context, e.g. Requesting a review of the Q3 design deck before our Friday board sync."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 border border-tan/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-kombu-green/10 focus:border-kombu-green bg-[#FAF8F5]/30 text-kombu-green font-medium"
                required
              />
            </div>

            {/* Key Points Sub-form */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Specific Key Points to Include (Optional)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Deadline is 3PM Friday"
                  value={currentPoint}
                  onChange={(e) => setCurrentPoint(e.target.value)}
                  className="flex-1 text-sm px-3.5 py-2.5 border border-tan/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-kombu-green/10 focus:border-kombu-green bg-[#FAF8F5]/30 text-kombu-green"
                />
                <button
                  type="button"
                  onClick={handleAddPoint}
                  className="px-3.5 bg-kombu-green hover:bg-[#404c2b] text-bone rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {keyPoints.length > 0 && (
                <ul className="mt-2.5 space-y-1.5 max-h-32 overflow-y-auto border border-dashed border-tan/30 p-2 rounded-lg bg-[#FAF8F5]">
                  {keyPoints.map((point, index) => (
                    <li key={index} className="flex items-center justify-between text-xs text-kombu-green bg-white border border-tan/15 px-2.5 py-1.5 rounded">
                      <span className="truncate pr-2">{point}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePoint(index)}
                        className="text-red-500 hover:text-red-700 shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
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
              <Sparkles className="w-4 h-4" /> {loading ? "Calibrating Wording..." : "Generate Correspondence"}
            </button>
          </form>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-7 space-y-4">
          {loading && (
            <div className="bg-white border border-tan/20 rounded-xl p-8 shadow-xs text-center space-y-4 h-full flex flex-col justify-center items-center py-20">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-tan/20 border-t-kombu-green rounded-full animate-spin"></div>
                <Mail className="w-5 h-5 text-kombu-green absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-serif font-bold text-cafe-noir">Structuring Professional Pitch...</h3>
                <p className="text-xs text-moss-green max-w-sm">Applying {tone.toLowerCase()} parameters for an elegant, human-centered {audience.toLowerCase()} draft.</p>
              </div>
            </div>
          )}

          {!loading && !result && (
            <div className="bg-[#FAF8F5]/60 border border-dashed border-tan/30 rounded-xl p-8 text-center py-24 text-moss-green space-y-3">
              <Mail className="w-12 h-12 mx-auto stroke-1 text-tan" />
              <div>
                <p className="text-sm font-serif font-bold text-cafe-noir">Specification Required</p>
                <p className="text-xs max-w-xs mx-auto">Fill out recipient details and core email goals on the left to activate our executive copywriting module.</p>
              </div>
            </div>
          )}

          {!loading && result && (
            <div className="bg-white border border-tan/25 rounded-xl shadow-xs overflow-hidden flex flex-col h-full animate-scale-up">
              {/* Output Header */}
              <div className="bg-[#FAF8F5] border-b border-tan/15 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-moss-green animate-pulse"></span>
                  <h3 className="text-sm font-serif font-bold text-cafe-noir">Correspondence Calibrated</h3>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-moss-green hover:text-cafe-noir flex items-center gap-1 cursor-pointer bg-white border border-tan/20 px-2.5 py-1.5 rounded-md hover:shadow-xs transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Start Over
                </button>
              </div>

              {/* Output Content */}
              <div className="p-5 space-y-4">
                {/* Subject Block */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Subject Line</span>
                    <button
                      onClick={handleCopySubject}
                      className="text-xs font-bold text-cafe-noir hover:text-kombu-green flex items-center gap-1 bg-[#FAF8F5] border border-tan/25 px-2.5 py-1 rounded-md cursor-pointer transition-all hover:shadow-xs"
                    >
                      {copiedSubject ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-moss-green" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Subject
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-[#FAF8F5] border border-tan/10 rounded-lg p-3 text-sm font-bold text-cafe-noir select-all">
                    {result.subject}
                  </div>
                </div>

                {/* Body Block */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Email Body</span>
                    <button
                      onClick={handleCopyBody}
                      className="text-xs font-bold text-cafe-noir hover:text-kombu-green flex items-center gap-1 bg-[#FAF8F5] border border-tan/25 px-2.5 py-1 rounded-md cursor-pointer transition-all hover:shadow-xs"
                    >
                      {copiedBody ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-moss-green" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Body
                        </>
                      )}
                    </button>
                  </div>
                  <div className="border border-tan/15 rounded-lg p-4 bg-[#FAF8F5]/30 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed min-h-[220px] max-h-[350px] overflow-y-auto font-sans select-all">
                    {result.body}
                  </div>
                </div>

                {/* Disclaimer Block */}
                <div className="border-t border-tan/15 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 text-moss-green" />
                    AI-generated content may require human review.
                  </span>
                  <span className="text-[#889063] font-mono font-bold uppercase tracking-wider text-[9px]">Calm Intelligence Suite</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
