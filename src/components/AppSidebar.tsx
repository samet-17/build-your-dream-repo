import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, KanbanSquare, StickyNote, Timer, Settings, Zap } from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/kanban", icon: KanbanSquare, label: "Kanban Board" },
  { to: "/notes", icon: StickyNote, label: "Notlar" },
  { to: "/pomodoro", icon: Timer, label: "Pomodoro" },
  { to: "/settings", icon: Settings, label: "Ayarlar" },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        <h1 className="text-lg font-heading font-bold text-foreground tracking-tight">
          ProducTive
        </h1>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-glow"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className={`w-4.5 h-4.5 ${isActive ? "text-primary" : ""}`} />
              {label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 m-3 rounded-lg gradient-card border border-border/50">
        <p className="text-xs text-muted-foreground">Bugün üretken ol 🚀</p>
        <p className="text-xs text-muted-foreground mt-1">Tüm veriler yerel olarak saklanır.</p>
      </div>
    </aside>
  );
};

export default AppSidebar;
