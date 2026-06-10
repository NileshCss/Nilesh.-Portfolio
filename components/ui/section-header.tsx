import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
  accentUnderline?: boolean;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  align = "left",
  accentUnderline = false,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-12", align === "center" && "text-center", className)}>
      {/* Eyebrow */}
      <div
        className={cn(
          "inline-flex items-center gap-1.5 mb-3.5",
          align === "center" && "justify-center"
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" />
        <span
          className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.1em]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {eyebrow}
        </span>
      </div>

      {/* Title */}
      <h2
        className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight mb-2.5"
        style={{ letterSpacing: "-0.03em" }}
      >
        {title}
      </h2>

      {/* Blue accent underline */}
      {accentUnderline && (
        <div
          className={cn("w-12 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-full mb-10", align === "center" && "mx-auto")}
        />
      )}

      {/* Description */}
      {description && (
        <p className="text-foreground-muted text-[0.9375rem] leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
