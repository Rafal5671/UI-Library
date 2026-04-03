import type { ReactNode } from 'react'

export type BadgeVariant = 'primary' | 'accent' | 'success' | 'warning'
export type BadgeSize    = 'sm' | 'md'

export interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  children: ReactNode
  className?: string
}

export function Badge({ variant = 'primary', size = 'md', dot = false, children, className = '' }: BadgeProps) {
  return (
    <span className={['vx-badge', `vx-badge--${variant}`, `vx-badge--${size}`, dot && 'vx-badge--dot', className].filter(Boolean).join(' ')}>
      {dot && <span className="vx-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  )
}

export default Badge