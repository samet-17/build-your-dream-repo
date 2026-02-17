import { useLocalStorage } from "@/hooks/useLocalStorage";
import { UserSettings, DEFAULT_SETTINGS } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, RotateCcw, Trash2 } from "lucide-react";

const SettingsPage = () => {
  const [settings, setSettings] = useLocalStorage<UserSettings>("productive-settings", DEFAULT_SETTINGS);

  const handleSave = () => {
    toast.success("Ayarlar kaydedildi!");
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    toast.info("Ayarlar sıfırlandı.");
  };

  const handleClearData = () => {
    if (window.confirm("Tüm veriler silinecek. Emin misiniz?")) {
      localStorage.removeItem("productive-tasks");
      localStorage.removeItem("productive-notes");
      localStorage.removeItem("productive-sessions");
      toast.success("Tüm veriler temizlendi.");
    }
  };

  const updatePomodoro = (key: string, value: number) => {
    setSettings((prev) => ({
      ...prev,
      pomodoroSettings: { ...prev.pomodoroSettings, [key]: value },
    }));
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Ayarlar</h1>
        <p className="text-muted-foreground mt-1">Uygulama tercihlerini özelleştir.</p>
      </div>

      {/* Profile */}
      <section className="rounded-xl bg-card border border-border/50 shadow-card p-6 space-y-4">
        <h2 className="text-lg font-heading font-semibold text-foreground">Profil</h2>
        <div className="space-y-2">
          <Label className="text-muted-foreground">Kullanıcı Adı</Label>
          <Input
            value={settings.username}
            onChange={(e) => setSettings((p) => ({ ...p, username: e.target.value }))}
            className="bg-secondary border-border max-w-sm"
          />
        </div>
      </section>

      {/* Pomodoro Settings */}
      <section className="rounded-xl bg-card border border-border/50 shadow-card p-6 space-y-4">
        <h2 className="text-lg font-heading font-semibold text-foreground">Pomodoro Ayarları</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Çalışma Süresi (dk)</Label>
            <Input
              type="number"
              min={1}
              max={120}
              value={settings.pomodoroSettings.workDuration}
              onChange={(e) => updatePomodoro("workDuration", Number(e.target.value))}
              className="bg-secondary border-border"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Kısa Mola (dk)</Label>
            <Input
              type="number"
              min={1}
              max={30}
              value={settings.pomodoroSettings.breakDuration}
              onChange={(e) => updatePomodoro("breakDuration", Number(e.target.value))}
              className="bg-secondary border-border"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Uzun Mola (dk)</Label>
            <Input
              type="number"
              min={1}
              max={60}
              value={settings.pomodoroSettings.longBreakDuration}
              onChange={(e) => updatePomodoro("longBreakDuration", Number(e.target.value))}
              className="bg-secondary border-border"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Uzun Mola Öncesi Oturum</Label>
            <Input
              type="number"
              min={1}
              max={10}
              value={settings.pomodoroSettings.sessionsBeforeLongBreak}
              onChange={(e) => updatePomodoro("sessionsBeforeLongBreak", Number(e.target.value))}
              className="bg-secondary border-border"
            />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleSave} className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
          <Save className="w-4 h-4 mr-2" /> Kaydet
        </Button>
        <Button onClick={handleReset} variant="outline" className="border-border">
          <RotateCcw className="w-4 h-4 mr-2" /> Sıfırla
        </Button>
        <Button onClick={handleClearData} variant="destructive">
          <Trash2 className="w-4 h-4 mr-2" /> Tüm Verileri Temizle
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
