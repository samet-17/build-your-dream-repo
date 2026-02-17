import { useState } from "react";
import { Plus, Trash2, GripVertical, Calendar } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Task, generateId } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const columns: { id: Task["status"]; title: string; color: string }[] = [
  { id: "todo", title: "Yapılacak", color: "bg-primary/20 text-primary" },
  { id: "in-progress", title: "Devam Ediyor", color: "bg-warning/20 text-warning" },
  { id: "done", title: "Tamamlandı", color: "bg-success/20 text-success" },
];

const KanbanBoard = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>("productive-tasks", []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "medium" as Task["priority"], dueDate: "" });
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    const task: Task = {
      id: generateId(),
      title: newTask.title,
      description: newTask.description,
      status: "todo",
      priority: newTask.priority,
      createdAt: new Date().toISOString(),
      dueDate: newTask.dueDate || undefined,
    };
    setTasks((prev) => [...prev, task]);
    setNewTask({ title: "", description: "", priority: "medium", dueDate: "" });
    setDialogOpen(false);
  };

  const handleUpdateTask = () => {
    if (!editingTask) return;
    setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? editingTask : t)));
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setEditingTask(null);
  };

  const handleDragStart = (taskId: string) => setDraggedTask(taskId);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (status: Task["status"]) => {
    if (!draggedTask) return;
    setTasks((prev) => prev.map((t) => (t.id === draggedTask ? { ...t, status } : t)));
    setDraggedTask(null);
  };

  const priorityLabels: Record<string, string> = { high: "Yüksek", medium: "Orta", low: "Düşük" };
  const priorityDots: Record<string, string> = {
    high: "bg-destructive",
    medium: "bg-warning",
    low: "bg-success",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Kanban Board</h1>
          <p className="text-muted-foreground mt-1">Görevlerini sürükle-bırak ile yönet.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" /> Yeni Görev
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-heading">Yeni Görev Ekle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <Input
                placeholder="Görev başlığı"
                value={newTask.title}
                onChange={(e) => setNewTask((p) => ({ ...p, title: e.target.value }))}
                className="bg-secondary border-border"
              />
              <Textarea
                placeholder="Açıklama (isteğe bağlı)"
                value={newTask.description}
                onChange={(e) => setNewTask((p) => ({ ...p, description: e.target.value }))}
                className="bg-secondary border-border"
              />
              <Select value={newTask.priority} onValueChange={(v) => setNewTask((p) => ({ ...p, priority: v as Task["priority"] }))}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Düşük Öncelik</SelectItem>
                  <SelectItem value="medium">Orta Öncelik</SelectItem>
                  <SelectItem value="high">Yüksek Öncelik</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask((p) => ({ ...p, dueDate: e.target.value }))}
                className="bg-secondary border-border"
              />
              <Button onClick={handleAddTask} className="w-full gradient-primary text-primary-foreground">
                Ekle
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-heading">Görevi Düzenle</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4 mt-2">
              <Input
                value={editingTask.title}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                className="bg-secondary border-border"
              />
              <Textarea
                value={editingTask.description}
                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                className="bg-secondary border-border"
              />
              <Select value={editingTask.priority} onValueChange={(v) => setEditingTask({ ...editingTask, priority: v as Task["priority"] })}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Düşük</SelectItem>
                  <SelectItem value="medium">Orta</SelectItem>
                  <SelectItem value="high">Yüksek</SelectItem>
                </SelectContent>
              </Select>
              <Select value={editingTask.status} onValueChange={(v) => setEditingTask({ ...editingTask, status: v as Task["status"] })}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Yapılacak</SelectItem>
                  <SelectItem value="in-progress">Devam Ediyor</SelectItem>
                  <SelectItem value="done">Tamamlandı</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button onClick={handleUpdateTask} className="flex-1 gradient-primary text-primary-foreground">
                  Kaydet
                </Button>
                <Button onClick={() => handleDeleteTask(editingTask.id)} variant="destructive" size="icon">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className="rounded-xl bg-card/50 border border-border/50 p-4 min-h-[400px]"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(col.id)}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${col.color}`}>
                  {col.title}
                </span>
                <span className="text-xs text-muted-foreground">{colTasks.length}</span>
              </div>
              <div className="space-y-3">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    onClick={() => setEditingTask(task)}
                    className="rounded-lg bg-secondary/80 border border-border/40 p-3 cursor-pointer hover:border-primary/40 hover:shadow-glow transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                        {task.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`w-2 h-2 rounded-full ${priorityDots[task.priority]}`} />
                          <span className="text-xs text-muted-foreground">{priorityLabels[task.priority]}</span>
                          {task.dueDate && (
                            <>
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;
