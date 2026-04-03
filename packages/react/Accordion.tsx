import { useState, useRef, useEffect, type ReactNode } from 'react'

export interface AccordionItem {
  id: string
  trigger: ReactNode
  content: ReactNode
  disabled?: boolean
}

export interface AccordionProps {
  items: AccordionItem[]
  multiple?: boolean
  defaultOpen?: string | string[]
  className?: string
}

function AccordionPanel({
  item, isOpen, onToggle, isFocused, onFocus, onBlur, showDivider,
}: {
  item: AccordionItem
  isOpen: boolean
  onToggle: () => void
  isFocused: boolean
  onFocus: () => void
  onBlur: () => void
  showDivider: boolean
}) {
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    if (isOpen) {
      el.style.height = el.scrollHeight + 'px'
      const t = setTimeout(() => { el.style.height = 'auto' }, 280)
      return () => clearTimeout(t)
    } else {
      el.style.height = el.scrollHeight + 'px'
      requestAnimationFrame(() => { el.style.height = '0px' })
    }
  }, [isOpen])

  const classes = [
    'vx-accordion-item',
    isOpen        && 'vx-accordion-item--open',
    item.disabled && 'vx-accordion-item--disabled',
    isFocused     && 'vx-accordion-item--focused',
  ].filter(Boolean).join(' ')

  return (
    <>
      {showDivider && <div className="vx-accordion-divider" aria-hidden="true" />}
      <div className={classes}>
        <button
          className="vx-accordion-trigger"
          onClick={onToggle}
          disabled={item.disabled}
          aria-expanded={isOpen}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <span className="vx-accordion-trigger__label">{item.trigger}</span>
          <span className="vx-accordion-trigger__icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
        <div ref={bodyRef} className="vx-accordion-body" style={{ height: isOpen ? 'auto' : '0px' }}>
          <div className="vx-accordion-body__inner">{item.content}</div>
        </div>
      </div>
    </>
  )
}

export function Accordion({ items, multiple = false, defaultOpen, className = '' }: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    if (!defaultOpen) return new Set()
    return new Set(Array.isArray(defaultOpen) ? defaultOpen : [defaultOpen])
  })
  const [focusedId, setFocusedId] = useState<string | null>(null)

  const toggle = (id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (!multiple) next.clear()
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className={['vx-accordion', className].filter(Boolean).join(' ')}>
      {items.map((item, i) => (
        <AccordionPanel
          key={item.id}
          item={item}
          isOpen={openIds.has(item.id)}
          onToggle={() => toggle(item.id)}
          isFocused={focusedId === item.id}
          onFocus={() => setFocusedId(item.id)}
          onBlur={() => setFocusedId(null)}
          showDivider={i > 0}
        />
      ))}
    </div>
  )
}

export default Accordion