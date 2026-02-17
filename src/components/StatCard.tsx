import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient: string;
  subtitle?: string;
}

const StatCard = ({ title, value, icon: Icon, gradient, subtitle }: StatCardProps) => (
  <div className="rounded-xl bg-card border border-border/50 p-5 shadow-card hover:shadow-elevated transition-all duration-300 group">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-3xl font-heading font-bold text-foreground mt-1">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <div className={`w-10 h-10 rounded-lg ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-5 h-5 text-primary-foreground" />
      </div>
    </div>
  </div>
);

export default StatCard;
