import { useRef, useEffect, forwardRef, type ReactNode, type ButtonHTMLAttributes } from 'react'
import { attachRipple } from '../../src/library'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'tonal' | 'outlined' | 'ghost' | 'elevated' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  isIconOnly?: boolean 
  noRadius?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'filled',
    size,
    disabled = false,
    loading = false,
    isIconOnly = false,
    noRadius = false,
    className = '',
    children,
    onClick,
    ...props
  },
  externalRef
) {
  const internalRef = useRef<HTMLButtonElement>(null)
  const ref = (externalRef as React.RefObject<HTMLButtonElement>) || internalRef

  useEffect(() => {
    if (ref.current) attachRipple(ref.current)
  }, [ref])

  const classes = [
    'vx-btn',
    `vx-btn-${variant}`,
    `vx-btn-${size ?? 'md'}`,
    noRadius ? 'vx-btn-no-radius' : 'vx-btn-brick',
    loading && 'vx-btn-loading',
    isIconOnly && 'vx-btn-icon-only',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {children}
      {loading && <span className="vx-spinner" aria-hidden="true" />}
    </button>
  )
})

export default Button