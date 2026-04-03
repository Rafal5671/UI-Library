import { useState } from "react";

export interface PaginationProps {
  total: number;
  defaultPage?: number;
  page?: number;
  variant?: "solid" | "outline" | "ghost" | "minimal";
  size?: "sm" | "md" | "lg";
  siblings?: number;
  showEdgeButtons?: boolean;
  prevLabel?: React.ReactNode;
  nextLabel?: React.ReactNode;
  showFirstLast?: boolean;
  onChange?: (page: number) => void;
  className?: string;
}

function buildRange(total: number, current: number, siblings: number): (number | "…")[] {
  const pages: (number | "…")[] = [1];
  const left = Math.max(2, current - siblings);
  const right = Math.min(total - 1, current + siblings);
  if (left > 2) pages.push("…");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push("…");
  if (total > 1) pages.push(total);
  return pages;
}

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronsLeft = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M12 12L8 8l4-4M7 12L3 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronsRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 4l4 4-4 4M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Pagination({
  total,
  defaultPage = 1,
  page: controlledPage,
  variant = "solid",
  size = "md",
  siblings = 1,
  showEdgeButtons = false,
  prevLabel,
  nextLabel,
  showFirstLast = false,
  onChange,
  className = "",
}: PaginationProps) {
  const isControlled = controlledPage !== undefined;
  const [internalPage, setInternalPage] = useState(defaultPage);
  const current = isControlled ? controlledPage! : internalPage;

  const go = (page: number) => {
    const clamped = Math.max(1, Math.min(total, page));
    if (!isControlled) setInternalPage(clamped);
    onChange?.(clamped);
  };

  const pages = buildRange(total, current, siblings);

  const btnSize = `vx-pagination__btn--${size}`;
  const ellipsisSize = `vx-pagination__ellipsis--${size}`;

  const activeClass = `vx-pagination__page--active vx-pagination--${variant}-active`;

  return (
    <nav
      role="navigation"
      aria-label="Paginacja"
      className={[
        "vx-pagination",
        `vx-pagination--${size}`,
        `vx-pagination--${variant}`,
        className,
      ].filter(Boolean).join(" ")}
    >
      {showFirstLast && (
        <button
          className={`vx-pagination__btn vx-pagination__nav ${btnSize}`}
          disabled={current === 1}
          aria-label="Pierwsza strona"
          onClick={() => go(1)}
        >
          <ChevronsLeft />
        </button>
      )}

      <button
        className={`vx-pagination__btn vx-pagination__nav ${btnSize}`}
        disabled={current === 1}
        aria-label="Poprzednia strona"
        onClick={() => go(current - 1)}
      >
        {prevLabel ?? (showEdgeButtons
          ? <><ChevronLeft /><span style={{ marginLeft: 4 }}>Poprzednia</span></>
          : <ChevronLeft />
        )}
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className={`vx-pagination__ellipsis ${ellipsisSize}`}>…</span>
        ) : (
          <button
            key={p}
            aria-label={`Strona ${p}`}
            aria-current={p === current ? "page" : undefined}
            onClick={() => go(p as number)}
            className={[
              "vx-pagination__btn",
              "vx-pagination__page",
              btnSize,
              p === current && activeClass,
            ].filter(Boolean).join(" ")}
          >
            {p}
          </button>
        )
      )}

      <button
        className={`vx-pagination__btn vx-pagination__nav ${btnSize}`}
        disabled={current === total}
        aria-label="Następna strona"
        onClick={() => go(current + 1)}
      >
        {nextLabel ?? (showEdgeButtons
          ? <><span style={{ marginRight: 4 }}>Następna</span><ChevronRight /></>
          : <ChevronRight />
        )}
      </button>

      {showFirstLast && (
        <button
          className={`vx-pagination__btn vx-pagination__nav ${btnSize}`}
          disabled={current === total}
          aria-label="Ostatnia strona"
          onClick={() => go(total)}
        >
          <ChevronsRight />
        </button>
      )}
    </nav>
  );
}