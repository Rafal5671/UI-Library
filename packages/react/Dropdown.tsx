import {
  useState,
  useRef,
  useEffect,
  useId,
  type KeyboardEvent,
} from "react";

export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface DropdownProps {
  placeholder?: string;
  options: DropdownOption[] | string[];
  value?: string;
  defaultValue?: string;
  variant?: "outline" | "filled" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  error?: string;
  label?: string;
  hint?: string;
  placement?: "bottom" | "top";
  fullWidth?: boolean;
  onChange?: (value: string) => void;
  className?: string;
}

function normalizeOption(opt: DropdownOption | string): DropdownOption {
  if (typeof opt === "string") return { value: opt, label: opt };
  return opt;
}

const CheckIcon = () => (
  <svg className="vx-dropdown__check" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={["vx-dropdown__chevron", open && "vx-dropdown__chevron--open"].filter(Boolean).join(" ")}
    width="16" height="16" viewBox="0 0 16 16" fill="none"
  >
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Dropdown({
  placeholder = "Wybierz…",
  options,
  value: controlledValue,
  defaultValue,
  variant = "outline",
  size = "md",
  disabled = false,
  error,
  label,
  hint,
  placement = "bottom",
  fullWidth = true,
  onChange,
  className = "",
}: DropdownProps) {
  const id = useId();
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const selected = isControlled ? controlledValue : internalValue;

  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const normalizedOptions = options.map(normalizeOption);
  const selectedOption = normalizedOptions.find((o) => o.value === selected);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (opt: DropdownOption) => {
    if (opt.disabled) return;
    if (!isControlled) setInternalValue(opt.value);
    onChange?.(opt.value);
    setOpen(false);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((o) => !o); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setFocusedIndex((i) => Math.min(i + 1, normalizedOptions.length - 1)); }
    else if (e.key === "ArrowUp")   { e.preventDefault(); setFocusedIndex((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Escape")    { setOpen(false); }
    else if (e.key === "Tab")       { setOpen(false); }
  };

  useEffect(() => {
    if (open && focusedIndex >= 0) {
      const items = listRef.current?.querySelectorAll<HTMLDivElement>("[data-option]");
      items?.[focusedIndex]?.focus();
    }
  }, [focusedIndex, open]);

  const triggerClass = [
    "vx-dropdown__trigger",
    `vx-dropdown__trigger--${variant}`,
    `vx-dropdown__trigger--${size}`,
    open && "vx-dropdown__trigger--open",
    !selectedOption && "vx-dropdown__trigger--placeholder",
  ].filter(Boolean).join(" ");

  const wrapperClass = [
    "vx-dropdown",
    fullWidth && "vx-dropdown--full",
    error && "vx-dropdown--error",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div ref={wrapperRef} className={wrapperClass}>
      {label && (
        <label htmlFor={id} className="vx-dropdown__label">{label}</label>
      )}

      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onKeyDown={handleKeyDown}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={triggerClass}
      >
        <span className="vx-dropdown__trigger-content">
          {selectedOption?.icon && <span>{selectedOption.icon}</span>}
          <span className="vx-dropdown__trigger-text">
            {selectedOption?.label ?? placeholder}
          </span>
        </span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div
          ref={listRef}
          role="listbox"
          className={[
            "vx-dropdown__menu",
            `vx-dropdown__menu--${placement}`,
          ].join(" ")}
        >
          {normalizedOptions.map((opt, i) => (
            <div
              key={opt.value}
              data-option
              role="option"
              aria-selected={opt.value === selected}
              aria-disabled={opt.disabled}
              tabIndex={opt.disabled ? -1 : 0}
              onClick={() => handleSelect(opt)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSelect(opt); }
                else if (e.key === "ArrowDown") { e.preventDefault(); setFocusedIndex(Math.min(i + 1, normalizedOptions.length - 1)); }
                else if (e.key === "ArrowUp")   { e.preventDefault(); setFocusedIndex(Math.max(i - 1, 0)); }
                else if (e.key === "Escape")    { setOpen(false); }
              }}
              className={[
                "vx-dropdown__item",
                opt.value === selected && "vx-dropdown__item--selected",
                opt.disabled && "vx-dropdown__item--disabled",
              ].filter(Boolean).join(" ")}
            >
              {opt.icon && <span>{opt.icon}</span>}
              <div className="vx-dropdown__item-body">
                <div className="vx-dropdown__item-label">{opt.label}</div>
                {opt.description && (
                  <div className="vx-dropdown__item-description">{opt.description}</div>
                )}
              </div>
              {opt.value === selected && <CheckIcon />}
            </div>
          ))}
        </div>
      )}

      {error && <span className="vx-dropdown__error">{error}</span>}
      {!error && hint && <span className="vx-dropdown__hint">{hint}</span>}
    </div>
  );
}