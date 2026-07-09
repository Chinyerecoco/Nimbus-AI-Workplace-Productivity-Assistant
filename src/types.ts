export type ActiveTab = "dashboard" | "email" | "meeting" | "planner" | "research" | "chat";

export interface EmailData {
  subject: string;
  body: string;
}

export interface ActionItem {
  task: string;
  owner: string;
  priority: string;
  completed?: boolean; // added client-side for interactive task tracking
}

export interface DeadlineItem {
  item: string;
  date: string;
}

export interface MeetingSummaryData {
  summary: string;
  keyDecisions: string[];
  actionItems: ActionItem[];
  deadlines: DeadlineItem[];
  nextSteps: string[];
}

export interface EisenhowerMatrix {
  urgentImportant: string[];
  importantNotUrgent: string[];
  urgentNotImportant: string[];
  neither: string[];
}

export interface ScheduleItem {
  timeSlot: string;
  activity: string;
  duration: string;
}

export interface TaskPlanData {
  eisenhower: EisenhowerMatrix;
  schedule: ScheduleItem[];
  tips: string[];
}

export interface WebSource {
  title: string;
  url: string;
}

export interface ResearchData {
  executiveBriefing: string;
  coreInsights: string[];
  marketTrends: string[];
  challenges: string[];
  recommendations: string[];
  sources?: WebSource[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
