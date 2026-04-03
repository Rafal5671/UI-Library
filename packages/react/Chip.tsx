import type { ReactNode } from 'react'

export type ChipVariant = 'primary' | 'accent' | 'success' | 'warning'

export interface ChipProps {
  variant?: ChipVariant
  selected?: boolean
  onSelect?: () => void
  onRemove?: () => void
  icon?: ReactNode
  children: ReactNode
  className?: string
  disabled?: boolean
}

export function Chip({
  variant = 'primary',
  selected = false,
  onSelect,
  onRemove,
  icon,
  children,
  className = '',
  disabled = false,
}: ChipProps) {
  const isClickable = !!onSelect

  const classes = [
    'vx-chip',
    `vx-chip--${variant}`,
    selected   && 'vx-chip--selected',
    isClickable && 'vx-chip--clickable',
    disabled   && 'vx-chip--disabled',
    className,
  ].filter(Boolean).join(' ')

  return (
    <span
      className={classes}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable && !disabled ? 0 : undefined}
      aria-pressed={isClickable ? selected : undefined}
      onClick={!disabled && isClickable ? onSelect : undefined}
      onKeyDown={isClickable && !disabled ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.() } } : undefined}
    >
      {icon && <span className="vx-chip__icon" aria-hidden="true">{icon}</span>}
      <span className="vx-chip__label">{children}</span>
      {onRemove && (
        <button
          className="vx-chip__remove"
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          disabled={disabled}
          aria-label="Usuń"
          tabIndex={-1}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </span>
  )
}

export default Chip