import type { HTMLAttributes } from "react";

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "primary" | "accent" | "success" | "error" | "warning" | "secondary";
  gradient?: boolean;
  striped?: boolean;
  animated?: boolean;
  label?: string;
  showValue?: boolean;
  valueLabel?: string;
  trackVisible?: boolean;
}

export function ProgressBar({
  value,
  size = "md",
  variant = "primary",
  gradient = false,
  striped = false,
  animated = false,
  label,
  showValue = false,
  valueLabel,
  trackVisible = true,
  className = "",
  style,
  ...props
}: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  const fillClasses = [
    "vx-progress__fill",
    gradient ? "vx-progress__fill--gradient" : `vx-progress__fill--${variant}`,
    striped && "vx-progress__fill--striped",
    striped && animated && "vx-progress__fill--animated-stripes",
    !striped && animated && "vx-progress__fill--shimmer",
  ].filter(Boolean).join(" ");

  const trackClasses = [
    "vx-progress__track",
    `vx-progress__track--${size}`,
    !trackVisible && "vx-progress__track--hidden",
  ].filter(Boolean).join(" ");

  return (
    <div
      className={["vx-progress", className].filter(Boolean).join(" ")}
      style={style}
      {...props}
    >
      {(label || showValue) && (
        <div className="vx-progress__header">
          {label && <span className="vx-progress__label">{label}</span>}
          {showValue && (
            <span className={`vx-progress__value vx-progress__value--${variant}`}>
              {valueLabel ?? `${safeValue}%`}
            </span>
          )}
        </div>
      )}

      <div className={trackClasses}>
        <div className={fillClasses} style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}