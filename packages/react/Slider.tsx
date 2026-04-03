import { useState, useId } from "react";
import type { InputHTMLAttributes } from "react";

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type" | "size"> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  formatValue?: (v: number) => string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "accent" | "success" | "error" | "warning";
  showRange?: boolean;
  showFill?: boolean;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

const variantColor: Record<string, string> = {
  primary: "var(--vx-primary)",
  accent:  "var(--vx-accent)",
  success: "var(--vx-success)",
  error:   "var(--vx-error)",
  warning: "var(--vx-warning)",
};

export function Slider({
  value: controlledValue,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  formatValue = (v) => String(v),
  size = "md",
  variant = "primary",
  showRange = false,
  showFill = true,
  onChange,
  disabled = false,
  className = "",
  style,
  ...props
}: SliderProps) {
  const id = useId();
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = isControlled ? controlledValue! : internalValue;

  const color = variantColor[variant];
  const fillPercent = ((value - min) / (max - min)) * 100;

  const trackBackground = showFill
    ? `linear-gradient(to right, ${color} ${fillPercent}%, var(--vx-surface-container-high) ${fillPercent}%)`
    : "var(--vx-surface-container-high)";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  return (
    <div
      className={[
        "vx-slider-wrapper",
        disabled && "vx-slider-wrapper--disabled",
        className,
      ].filter(Boolean).join(" ")}
      style={style}
    >
      {(label || showValue) && (
        <div className="vx-slider__header">
          {label && (
            <label
              htmlFor={id}
              className={[
                "vx-slider__label",
                disabled && "vx-slider__label--disabled",
              ].filter(Boolean).join(" ")}
            >
              {label}
            </label>
          )}
          {showValue && (
            <span className={`vx-slider__value vx-slider__value--${variant}`}>
              {formatValue(value)}
            </span>
          )}
        </div>
      )}

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={["vx-slider", `vx-slider--${size}`, className].filter(Boolean).join(" ")}
        style={{
          background: trackBackground,
          "--vx-thumb-color": color,
        } as React.CSSProperties}
        {...props}
      />

      {showRange && (
        <div className="vx-slider__range">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      )}
    </div>
  );
}