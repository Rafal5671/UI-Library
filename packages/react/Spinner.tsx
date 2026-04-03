export type SpinnerSize = 'sm' | 'md' | 'lg'

const sizeMap: Record<SpinnerSize, number> = {
  sm: 16,
  md: 28,
  lg: 40,
}

export interface SpinnerProps {
  size?: SpinnerSize
  pulse?: boolean
  className?: string
  style?: React.CSSProperties
  label?: string
}

export function Spinner({ size = 'md', pulse = false, className = '', style, label = 'Ładowanie…' }: SpinnerProps) {
  const px = sizeMap[size]
  const classes = ['vx-spinner', pulse && 'vx-spinner--pulse', className].filter(Boolean).join(' ')

  return (
    <span className="vx-spinner-wrapper" style={{ width: px, height: px, ...style }}>
      <svg
        role="status"
        aria-label={label}
        className={classes}
        width={px}
        height={px}
        viewBox="0 0 44 44"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
      >
        <circle className="vx-spinner__track" cx="22" cy="22" r="20" />
        <circle className="vx-spinner__arc"   cx="22" cy="22" r="20" transform="rotate(-90 22 22)" />
      </svg>
      {pulse && <span className="vx-spinner__pulse" aria-hidden="true" />}
    </span>
  )
}

export default Spinner