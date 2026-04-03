import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  value: string;
  onChange: (iso: string) => void;
  label: string;
  minDate?: string;
}

const DAYS = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];
const MONTHS = [
  "Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec",
  "Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień",
];

export function DatePicker({ value, onChange, label, minDate }: Props) {
  const parsed = value ? new Date(value) : null;
  const [open, setOpen]           = useState(false);
  const [viewYear, setViewYear]   = useState(parsed?.getFullYear() ?? new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.getMonth() ?? new Date().getMonth());
  const [selDate, setSelDate]     = useState<Date | null>(parsed);
  const [hour, setHour]     = useState(parsed ? String(parsed.getHours()).padStart(2,"0")   : "09");
  const [minute, setMinute] = useState(parsed ? String(parsed.getMinutes()).padStart(2,"0") : "00");

  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({
    position: "fixed", top: -9999, left: -9999, visibility: "hidden",
  });

  const triggerRef = useRef<HTMLDivElement>(null);
  const popupRef   = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !popupRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popupRect   = popupRef.current.getBoundingClientRect();
    const GAP = 6;
    const vpH = window.innerHeight;
    const vpW = window.innerWidth;
    const spaceBelow = vpH - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    const openUp = spaceBelow < popupRect.height + GAP && spaceAbove > spaceBelow;
    let top = openUp ? triggerRect.top - popupRect.height - GAP : triggerRect.bottom + GAP;
    top = Math.max(8, Math.min(top, vpH - popupRect.height - 8));
    let left = triggerRect.left;
    left = Math.max(8, Math.min(left, vpW - popupRect.width - 8));
    setPopupStyle({ position: "fixed", top, left, width: popupRect.width || 300, visibility: "visible", zIndex: 99999 });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || popupRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleOpen = () => {
    if (!open) setPopupStyle({ position: "fixed", top: -9999, left: -9999, visibility: "hidden" });
    setOpen(o => !o);
  };

  const buildCalendar = () => {
    const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
    const offset      = (firstDay + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  };

  const selectDay = (day: number) => setSelDate(new Date(viewYear, viewMonth, day));

  const confirm = () => {
    if (!selDate) return;
    const d = new Date(selDate);
    d.setHours(Number(hour), Number(minute), 0, 0);
    onChange(d.toISOString());
    setOpen(false);
  };

  const clear = () => { setSelDate(null); onChange(""); setOpen(false); };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const isDisabled = (day: number) => {
    if (!minDate) return false;
    const min = new Date(minDate); min.setHours(0,0,0,0);
    return new Date(viewYear, viewMonth, day) < min;
  };
  const isSelected = (day: number) =>
    selDate?.getDate() === day && selDate?.getMonth() === viewMonth && selDate?.getFullYear() === viewYear;
  const isToday = (day: number) => {
    const t = new Date();
    return t.getDate() === day && t.getMonth() === viewMonth && t.getFullYear() === viewYear;
  };

  const displayValue = parsed
    ? parsed.toLocaleString("pl-PL", { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit" })
    : "";

  const popup = (
    <div ref={popupRef} className="dtp__popup" style={popupStyle}>
      <div className="dtp__nav">
        <button type="button" className="dtp__nav-btn" onClick={prevMonth} aria-label="Poprzedni miesiąc">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="dtp__nav-label">{MONTHS[viewMonth]} {viewYear}</span>
        <button type="button" className="dtp__nav-btn" onClick={nextMonth} aria-label="Następny miesiąc">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="dtp__grid">
        {DAYS.map(d => <div key={d} className="dtp__day-name">{d}</div>)}
        {buildCalendar().map((day, i) => (
          <div
            key={i}
            className={[
              "dtp__cell",
              !day                   ? "dtp__cell--empty"    : "",
              day && isToday(day)    ? "dtp__cell--today"    : "",
              day && isSelected(day) ? "dtp__cell--selected" : "",
              day && isDisabled(day) ? "dtp__cell--disabled" : "",
            ].filter(Boolean).join(" ")}
            onClick={() => day && !isDisabled(day) && selectDay(day)}
            role={day ? "button" : undefined}
            tabIndex={day && !isDisabled(day) ? 0 : undefined}
            aria-label={day ? `${day} ${MONTHS[viewMonth]} ${viewYear}` : undefined}
            aria-pressed={day ? isSelected(day) : undefined}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="dtp__time">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <input
          className="dtp__time-input" type="number" min="0" max="23" value={hour}
          onChange={e => setHour(String(Math.min(23, Math.max(0, Number(e.target.value)))).padStart(2,"0"))}
        />
        <span className="dtp__time-sep">:</span>
        <input
          className="dtp__time-input" type="number" min="0" max="59" value={minute}
          onChange={e => setMinute(String(Math.min(59, Math.max(0, Number(e.target.value)))).padStart(2,"0"))}
        />
      </div>

      <div className="dtp__footer">
        <button type="button" className="dtp__btn dtp__btn--cancel" onClick={() => setOpen(false)}>Anuluj</button>
        <button type="button" className="dtp__btn dtp__btn--confirm" onClick={confirm} disabled={!selDate}>Zatwierdź</button>
      </div>
    </div>
  );

  return (
    <div className="dtp" ref={triggerRef}>
      <button
        type="button"
        className={["dtp__trigger", value ? "dtp__trigger--set" : "", open ? "dtp__trigger--open" : ""].filter(Boolean).join(" ")}
        onClick={handleOpen}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        {displayValue || <span className="dtp__placeholder">{label}</span>}
        {value && (
          <span
            className="dtp__clear"
            role="button"
            aria-label="Wyczyść"
            onClick={e => { e.stopPropagation(); clear(); }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          </span>
        )}
      </button>

      {createPortal(open ? popup : null, document.body)}
    </div>
  );
}

export default DatePicker;