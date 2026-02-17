import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { PomodoroSession, UserSettings, DEFAULT_SETTINGS, generateId } from "@/lib/types";
import { Button } from "@/components/ui/button";

type TimerMode = "work" | "break" | "long-break";

const PomodoroTimer = () => {
  const [settings] = useLocalStorage<UserSettings>("productive-settings", DEFAULT_SETTINGS);
  const [sessions, setSessions] = useLocalStorage<PomodoroSession[]>("productive-sessions", []);

  const [mode, setMode] = useState<TimerMode>("work");
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  const getDuration = useCallback(
    (m: TimerMode) => {
      const p = settings.pomodoroSettings;
      switch (m) {
        case "work": return p.workDuration * 60;
        case "break": return p.breakDuration * 60;
        case "long-break": return p.longBreakDuration * 60;
      }
    },
    [settings]
  );

  const [timeLeft, setTimeLeft] = useState(getDuration(mode));
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) setTimeLeft(getDuration(mode));
  }, [mode, getDuration, isRunning]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);

          // Save session
          const session: PomodoroSession = {
            id: generateId(),
            type: mode,
            duration: getDuration(mode) / 60,
            completedAt: new Date().toISOString(),
          };
          setSessions((prev) => [...prev, session]);

          // Auto switch
          if (mode === "work") {
            const next = sessionCount + 1;
            setSessionCount(next);
            if (next % settings.pomodoroSettings.sessionsBeforeLongBreak === 0) {
              setMode("long-break");
            } else {
              setMode("break");
            }
          } else {
            setMode("work");
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, mode, getDuration, sessionCount, settings.pomodoroSettings.sessionsBeforeLongBreak, setSessions]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 1 - timeLeft / getDuration(mode);
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference * (1 - progress);

  const modeConfig: Record<TimerMode, { label: string; icon: typeof Brain; gradient: string }> = {
    work: { label: "Odaklan", icon: Brain, gradient: "gradient-primary" },
    break: { label: "Mola", icon: Coffee, gradient: "gradient-accent" },
    "long-break": { label: "Uzun Mola", icon: Coffee, gradient: "gradient-warm" },
  };

  const currentMode = modeConfig[mode];
  const Icon = currentMode.icon;

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(getDuration(mode));
  };

  const todaySessions = sessions.filter(
    (s) => new Date(s.completedAt).toDateString() === new Date().toDateString() && s.type === "work"
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold text-foreground">Pomodoro Timer</h1>
        <p className="text-muted-foreground mt-1">Odaklanma zamanı!</p>
      </div>

      {/* Mode Tabs */}
      <div className="flex justify-center gap-2">
        {(["work", "break", "long-break"] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => { if (!isRunning) { setMode(m); } }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === m
                ? "bg-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            {modeConfig[m].label}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="flex justify-center">
        <div className="relative w-80 h-80">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 300 300">
            <circle cx="150" cy="150" r="140" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
            <circle
              cx="150"
              cy="150"
              r="140"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Icon className="w-8 h-8 text-primary mb-2" />
            <span className="text-6xl font-heading font-bold text-foreground tabular-nums">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
            <span className="text-sm text-muted-foreground mt-2">{currentMode.label}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          size="lg"
          className={`${currentMode.gradient} text-primary-foreground shadow-glow hover:opacity-90 px-8`}
        >
          {isRunning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
          {isRunning ? "Duraklat" : "Başlat"}
        </Button>
        <Button onClick={reset} size="lg" variant="outline" className="border-border">
          <RotateCcw className="w-5 h-5 mr-2" /> Sıfırla
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
        <div className="text-center p-4 rounded-xl bg-card border border-border/50">
          <p className="text-2xl font-heading font-bold text-foreground">{todaySessions.length}</p>
          <p className="text-xs text-muted-foreground">Bugünkü Oturumlar</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-card border border-border/50">
          <p className="text-2xl font-heading font-bold text-foreground">{sessionCount}</p>
          <p className="text-xs text-muted-foreground">Mevcut Seri</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-card border border-border/50">
          <p className="text-2xl font-heading font-bold text-foreground">
            {todaySessions.reduce((a, s) => a + s.duration, 0)}dk
          </p>
          <p className="text-xs text-muted-foreground">Bugün Odak</p>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
