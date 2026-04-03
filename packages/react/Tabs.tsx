import { useState, useRef, useEffect, type ReactNode } from 'react'

export interface TabItem {
  id: string
  label: string
  icon?: ReactNode
  content: ReactNode
  disabled?: boolean
}

export type TabsVariant = 'pill' | 'underline'
export type TabsOrientation = 'horizontal' | 'vertical'

export interface TabsProps {
  items: TabItem[]
  defaultTab?: string
  variant?: TabsVariant
  orientation?: TabsOrientation
  className?: string
}

export function Tabs({ items, defaultTab, variant = 'pill', orientation = 'horizontal', className = '' }: TabsProps) {
  const [activeId, setActiveId] = useState<string>(defaultTab ?? items[0]?.id)
  const [indicatorStyle, setIndicatorStyle] = useState<{ left?: number; top?: number; width?: number; height?: number }>({})
  const listRef = useRef<HTMLDivElement>(null)
  const isVertical = orientation === 'vertical'
  const isPill = variant === 'pill'

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const btn = list.querySelector<HTMLButtonElement>(`[data-tab="${activeId}"]`)
    if (!btn) return

    if (isPill) {
      if (isVertical) {
        setIndicatorStyle({ top: btn.offsetTop, height: btn.offsetHeight })
      } else {
        setIndicatorStyle({ left: btn.offsetLeft, width: btn.offsetWidth })
      }
    } else {
      // underline
      if (isVertical) {
        setIndicatorStyle({ top: btn.offsetTop, height: btn.offsetHeight })
      } else {
        setIndicatorStyle({ left: btn.offsetLeft, width: btn.offsetWidth })
      }
    }
  }, [activeId, variant, orientation])

  const rootClass = [
    'vx-tabs',
    `vx-tabs--${variant}`,
    `vx-tabs--${orientation}`,
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={rootClass}>
      <div className="vx-tabs__list" ref={listRef} role="tablist" aria-orientation={orientation}>
        <span
          className="vx-tabs__indicator"
          style={indicatorStyle}
          aria-hidden="true"
        />
        {items.map(item => (
          <button
            key={item.id}
            data-tab={item.id}
            role="tab"
            aria-selected={activeId === item.id}
            aria-controls={`vx-tabpanel-${item.id}`}
            disabled={item.disabled}
            className={[
              'vx-tabs__tab',
              activeId === item.id && 'vx-tabs__tab--active',
              item.disabled && 'vx-tabs__tab--disabled',
            ].filter(Boolean).join(' ')}
            onClick={() => setActiveId(item.id)}
          >
            {item.icon && <span className="vx-tabs__tab-icon" aria-hidden="true">{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="vx-tabs__panels">
        {items.map(item => (
          <div
            key={item.id}
            id={`vx-tabpanel-${item.id}`}
            role="tabpanel"
            hidden={activeId !== item.id}
            className="vx-tabs__panel"
          >
            {activeId === item.id && item.content}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tabs