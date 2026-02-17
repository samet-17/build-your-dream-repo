import { CheckCircle2, Clock, ListTodo, StickyNote, TrendingUp, Timer } from "lucide-react";
import StatCard from "@/components/StatCard";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Task, Note, PomodoroSession, DEFAULT_SETTINGS, UserSettings } from "@/lib/types";

const Index = () => {
  const [tasks] = useLocalStorage<Task[]>("productive-tasks", []);
  const [notes] = useLocalStorage<Note[]>("productive-notes", []);
  const [sessions] = useLocalStorage<PomodoroSession[]>("productive-sessions", []);
  const [settings] = useLocalStorage<UserSettings>("productive-settings", DEFAULT_SETTINGS);

  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const inProgressCount = tasks.filter((t) => t.status === "in-progress").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);

  const today = new Date().toDateString();
  const todaySessions = sessions.filter((s) => new Date(s.completedAt).toDateString() === today);
  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.duration, 0);

  const recentTasks = tasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const priorityColors: Record<string, string> = {
    high: "text-destructive",
    medium: "text-warning",
    low: "text-success",
  };

  const statusLabels: Record<string, string> = {
    todo: "Yapılacak",
    "in-progress": "Devam Ediyor",
    done: "Tamamlandı",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Hoş geldin, {settings.username} 👋
        </h1>
        <p className="text-muted-foreground mt-1">İşte bugünkü üretkenlik özetin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Yapılacak" value={todoCount} icon={ListTodo} gradient="gradient-primary" />
        <StatCard title="Devam Eden" value={inProgressCount} icon={Clock} gradient="gradient-warm" />
        <StatCard title="Tamamlanan" value={doneCount} icon={CheckCircle2} gradient="gradient-accent" />
        <StatCard
          title="Odak Süresi"
          value={`${todayMinutes}dk`}
          icon={Timer}
          gradient="gradient-primary"
          subtitle={`Toplam: ${totalMinutes}dk`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="rounded-xl bg-card border border-border/50 shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold text-foreground">Son Görevler</h2>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          {recentTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Henüz görev yok. Kanban Board'dan ekle!
            </p>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/30"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{statusLabels[task.status]}</p>
                  </div>
                  <span className={`text-xs font-medium capitalize ${priorityColors[task.priority]}`}>
                    {task.priority === "high" ? "Yüksek" : task.priority === "medium" ? "Orta" : "Düşük"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="rounded-xl bg-card border border-border/50 shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold text-foreground">Hızlı Bakış</h2>
            <StickyNote className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50 border border-border/30">
              <span className="text-sm text-muted-foreground">Toplam Görev</span>
              <span className="text-sm font-semibold text-foreground">{tasks.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50 border border-border/30">
              <span className="text-sm text-muted-foreground">Toplam Not</span>
              <span className="text-sm font-semibold text-foreground">{notes.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50 border border-border/30">
              <span className="text-sm text-muted-foreground">Pomodoro Oturumları</span>
              <span className="text-sm font-semibold text-foreground">{sessions.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50 border border-border/30">
              <span className="text-sm text-muted-foreground">Tamamlanma Oranı</span>
              <span className="text-sm font-semibold text-foreground">
                {tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
