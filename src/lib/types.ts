export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  createdAt: string;
  dueDate?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
}

export interface PomodoroSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
}

export interface PomodoroSession {
  id: string;
  type: "work" | "break" | "long-break";
  duration: number;
  completedAt: string;
}

export interface UserSettings {
  username: string;
  pomodoroSettings: PomodoroSettings;
}

export const DEFAULT_SETTINGS: UserSettings = {
  username: "Kullanıcı",
  pomodoroSettings: {
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
  },
};

export const NOTE_COLORS = [
  "hsl(245 80% 67% / 0.15)",
  "hsl(170 70% 50% / 0.15)",
  "hsl(35 90% 55% / 0.15)",
  "hsl(0 72% 55% / 0.15)",
  "hsl(280 70% 60% / 0.15)",
  "hsl(205 85% 55% / 0.15)",
];

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
