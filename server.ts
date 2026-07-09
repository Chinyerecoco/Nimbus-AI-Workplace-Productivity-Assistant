import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialization helper for the Gemini API
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    throw new Error("GEMINI_API_KEY environment variable is not configured. Please add your Gemini API Key in the Secrets panel under Settings.");
  }
  
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Helper to retry Gemini API calls with exponential backoff on transient errors (503 / 429) and fallback model support
async function callGeminiWithRetry<T>(
  apiCall: (modelName: string) => Promise<T>,
  options: { maxRetries?: number; initialDelayMs?: number; models?: string[] } = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3;
  const initialDelayMs = options.initialDelayMs ?? 1000;
  // Try gemini-3.5-flash first, and if that gets 503 or 429, try gemini-3.1-flash-lite as fallback
  const models = options.models ?? ["gemini-3.5-flash", "gemini-3.1-flash-lite"];

  let lastError: any = null;

  for (const model of models) {
    let delay = initialDelayMs;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall(model);
      } catch (error: any) {
        lastError = error;
        console.warn(`[Gemini API] Attempt ${attempt} with model ${model} failed:`, error.message || error);
        
        const errorMessage = String(error.message || "").toLowerCase();
        const errorStatus = error.status;
        const isTransient = 
          errorStatus === 503 || 
          errorStatus === 429 || 
          errorMessage.includes("503") || 
          errorMessage.includes("429") || 
          errorMessage.includes("unavailable") || 
          errorMessage.includes("demand") || 
          errorMessage.includes("resource_exhausted") || 
          errorMessage.includes("limit");

        if (!isTransient) {
          // Structural or configuration error (e.g., bad API key, schema error) - do not retry or fallback
          throw error;
        }

        if (attempt < maxRetries) {
          console.log(`[Gemini API] Retrying in ${delay}ms after transient error...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // exponential backoff
        }
      }
    }
    console.warn(`[Gemini API] Model ${model} exhausted after ${maxRetries} attempts. Trying next fallback model if available...`);
  }

  throw lastError || new Error("Failed to contact Gemini API after multiple retries and model fallbacks.");
}

// 1. Smart Email Generator Endpoint
app.post("/api/generate-email", async (req, res) => {
  try {
    const { recipient, context, tone, audience, keyPoints } = req.body;
    const ai = getGeminiClient();

    const prompt = `Generate a highly professional, ready-to-send workplace email based on the following specifications:
- Recipient: ${recipient || "N/A"}
- Target Audience: ${audience || "Colleague"}
- Key Context/Purpose: ${context}
- Desired Tone: ${tone || "Professional"}
- Core Points to Include: ${Array.isArray(keyPoints) ? keyPoints.join(", ") : (keyPoints || "Use general context")}

Ensure the output adheres to professional workplace standards and provides a clean Subject Line and a beautifully formatted Email Body. Use bracketed placeholders like [Your Name] or [Your Title] where personalization is needed. Do not include any meta-commentary or conversational filler in your response. Just output the content in JSON format with "subject" and "body" properties.`;

    const response = await callGeminiWithRetry((modelName) =>
      ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              subject: {
                type: Type.STRING,
                description: "The subject line of the email."
              },
              body: {
                type: Type.STRING,
                description: "The main body text of the email, formatted with line breaks."
              }
            },
            required: ["subject", "body"]
          }
        }
      })
    );

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Email generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate email" });
  }
});

// 2. Meeting Notes Summarizer Endpoint
app.post("/api/summarize-meeting", async (req, res) => {
  try {
    const { rawNotes } = req.body;
    if (!rawNotes || rawNotes.trim() === "") {
      return res.status(400).json({ error: "Raw notes are required for summarization." });
    }

    const ai = getGeminiClient();

    const prompt = `You are an expert executive secretary. Summarize the following raw meeting transcript or scratch notes into a highly structured corporate brief.
Raw Notes:
"""
${rawNotes}
"""

Extract and organize the information into the following categories:
1. Executive Summary (a short 2-3 sentence overview of the meeting's main purpose and alignment)
2. Key Decisions (decisions that were made during the meeting)
3. Action Items (discrete tasks, assigned owners, and priorities)
4. Deadlines & Milestones (important dates, deadlines, or milestones)
5. Next Steps (strategic follow-ups or next scheduled checkpoints)

Output strictly in JSON format matching the expected schema. If any category has no mentioned details, do not omit it; instead provide a brief logical deduction or a placeholder indicating more clarity is needed.`;

    const response = await callGeminiWithRetry((modelName) =>
      ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: "High-level 2-3 sentence overview of the meeting."
              },
              keyDecisions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of decisions finalized in the meeting."
              },
              actionItems: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    task: { type: Type.STRING, description: "Specific action task description." },
                    owner: { type: Type.STRING, description: "Person responsible. Use 'Unassigned' if none specified." },
                    priority: { type: Type.STRING, description: "High, Medium, or Low based on context." }
                  },
                  required: ["task", "owner", "priority"]
                },
                description: "List of structured tasks extracted from notes."
              },
              deadlines: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    item: { type: Type.STRING, description: "What is due or happening." },
                    date: { type: Type.STRING, description: "The deadline date or time constraint." }
                  },
                  required: ["item", "date"]
                },
                description: "List of milestones or deadlines with date constraints."
              },
              nextSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of high-level next steps and follow-up activities."
              }
            },
            required: ["summary", "keyDecisions", "actionItems", "deadlines", "nextSteps"]
          }
        }
      })
    );

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Meeting summary error:", error);
    res.status(500).json({ error: error.message || "Failed to summarize notes" });
  }
});

// 3. AI Task Planner Endpoint
app.post("/api/plan-tasks", async (req, res) => {
  try {
    const { rawTasks, workHours, mainGoals } = req.body;
    if (!rawTasks || rawTasks.trim() === "") {
      return res.status(400).json({ error: "Please enter some tasks or ideas to plan." });
    }

    const ai = getGeminiClient();

    const prompt = `You are a professional workflow optimization expert and coach.
Organize, prioritize, and structure a highly efficient planner based on the user's raw tasks list and goals.

User's Input:
- Raw Tasks/Ideas:
"""
${rawTasks}
"""
- Working Hours Available: ${workHours || "Standard 8-hour workday"}
- Core Goals/Focus for this block: ${mainGoals || "General efficiency & stress-reduction"}

Categorize and prioritize these tasks using the Eisenhower Matrix (Urgent & Important, Important but Not Urgent, Urgent but Not Important, neither/delegate/eliminate).
Also, construct a step-by-step timed schedule for their work block, factoring in productivity techniques like Pomodoro or time-blocking.
Finally, provide 3 short, actionable tactical tips to successfully execute this plan.

Return your response strictly as JSON matching the schema.`;

    const response = await callGeminiWithRetry((modelName) =>
      ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              eisenhower: {
                type: Type.OBJECT,
                properties: {
                  urgentImportant: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Quadrant 1: Do First. Urgent and highly critical tasks."
                  },
                  importantNotUrgent: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Quadrant 2: Schedule. Strategic, long-term tasks to plan ahead."
                  },
                  urgentNotImportant: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Quadrant 3: Delegate or Automate. Urgent but low-leverage."
                  },
                  neither: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Quadrant 4: Eliminate or Postpone. Distractions or fillers."
                  }
                },
                required: ["urgentImportant", "importantNotUrgent", "urgentNotImportant", "neither"]
              },
              schedule: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    timeSlot: { type: Type.STRING, description: "e.g. '09:00 AM - 10:30 AM'" },
                    activity: { type: Type.STRING, description: "Task or break block description." },
                    duration: { type: Type.STRING, description: "e.g. '90 mins'" }
                  },
                  required: ["timeSlot", "activity", "duration"]
                },
                description: "Hour-by-hour structured block schedule."
              },
              tips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 strategic productivity tips tailored to this workload."
              }
            },
            required: ["eisenhower", "schedule", "tips"]
          }
        }
      })
    );

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Task planner error:", error);
    res.status(500).json({ error: error.message || "Failed to create task plan" });
  }
});

// 4. AI Research Assistant Endpoint (with optional Search Grounding)
app.post("/api/research-assistant", async (req, res) => {
  try {
    const { topic, depth, focus, enableWebSearch } = req.body;
    if (!topic || topic.trim() === "") {
      return res.status(400).json({ error: "Please enter a research topic." });
    }

    const ai = getGeminiClient();

    const prompt = `You are an elite corporate research analyst. Conduct a thorough and structured research briefing on the topic: "${topic}".
- Research Depth: ${depth || "Comprehensive"}
- Focus Industry/Angle: ${focus || "General Professional"}
- Real-time Web Search: ${enableWebSearch ? "ENABLED" : "DISABLED"}

Produce a high-quality analysis that details:
1. Executive Briefing: High-level overview of the current landscape.
2. Core Insights & Real-world Context: Key factual points, details, and context.
3. Market Trends & Drivers: Strategic forces shaping this topic.
4. Challenges & Critical Risks: Hurdles or warning signs professionals should monitor.
5. Actionable Recommendations: Concrete, strategic advice for professionals looking to utilize these findings.

If real-time web search is enabled, synthesize recent live data and ground your analysis in verified facts.
Provide the final output in structured JSON format matching the schema.`;

    const config: any = {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          executiveBriefing: { type: Type.STRING, description: "High-level summary of the research topic." },
          coreInsights: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Detailed key findings and factual points."
          },
          marketTrends: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Trends, industry drivers, and forward-looking triggers."
          },
          challenges: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Risks, roadblocks, and potential bottlenecks."
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Strategic tactical actions based on research findings."
          }
        },
        required: ["executiveBriefing", "coreInsights", "marketTrends", "challenges", "recommendations"]
      }
    };

    // Integrate Search Grounding if enabled
    if (enableWebSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await callGeminiWithRetry((modelName) =>
      ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: config
      })
    );

    const resultText = response.text || "{}";
    const parsedData = JSON.parse(resultText);

    // If search grounding was used, let's extract sources if present
    const sources: any[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && Array.isArray(chunks)) {
      chunks.forEach((chunk: any) => {
        if (chunk.web && chunk.web.uri) {
          sources.push({
            title: chunk.web.title || "Web Search Source",
            url: chunk.web.uri
          });
        }
      });
    }

    // De-duplicate sources
    const uniqueSources = Array.from(new Map(sources.map(s => [s.url, s])).values());

    res.json({
      ...parsedData,
      sources: uniqueSources
    });
  } catch (error: any) {
    console.error("Research assistant error:", error);
    res.status(500).json({ error: error.message || "Failed to perform research" });
  }
});

// 5. AI Chatbot Interface Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getGeminiClient();

    // Map message history to Gemini format (user vs model)
    const geminiContents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));

    // We can use a standard chat generateContent call
    const response = await callGeminiWithRetry((modelName) =>
      ai.models.generateContent({
        model: modelName,
        contents: geminiContents,
        config: {
          systemInstruction: "You are the AI Workplace Productivity Assistant, an elite executive coach, copywriting expert, and workspace automation partner. Your role is to help professionals compose texts, audit emails, brainstorm productivity workflows, draft action plans, and clarify administrative challenges. Be direct, crisp, professional, and practical. Always maintain a warm yet highly competent corporate tone."
        }
      })
    );

    res.json({ content: response.text || "I was unable to formulate a response. Please try again." });
  } catch (error: any) {
    console.error("Chat interface error:", error);
    res.status(500).json({ error: error.message || "Failed to run chat assistant" });
  }
});

// Vite server connection (Vite handles asset serving during dev, built bundles serve in production)
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Workplace Productivity Assistant running on http://localhost:${PORT}`);
  });
}

startServer();
