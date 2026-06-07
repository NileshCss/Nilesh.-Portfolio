"use client";

import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatsCard({ label, value, icon: Icon, trend, trendUp, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.04]",
        className
      )}
    >
      {/* Subtle gradient glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
          <p className="text-2xl font-bold text-white/90">{value}</p>
          {trend && (
            <p className={cn(
              "text-xs font-medium mt-1.5",
              trendUp ? "text-emerald-400" : "text-slate-500"
            )}>
              {trend}
            </p>
          )}
        </div>
        <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
          <Icon size={20} className="text-blue-400" />
        </div>
      </div>
    </div>
  );
}
