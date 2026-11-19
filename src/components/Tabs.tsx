import { useId, useRef, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from '../cx'

export interface Tab<K extends string = string> {
  key: K
  label: ReactNode
  /** Quieter text after the label (a server name, a count). */
  sub?: ReactNode
  disabled?: boolean
}

export interface TabsProps<K extends string = string> {
  tabs: Tab<K>[]
  /** The selected tab's key. */
  value: K
  onChange: (key: K) => void
  /** The tab list's accessible name. */
  label?: string
  /** Prefix for the tabs' and panels' ids, to wire `TabPanel`s (aria-controls). */
  idPrefix?: string
  /**
   * `underline` (default): the settings modals' tabs. `panel`: tabs sitting on
   * a bordered panel, the selected one joined to it; use `PanelTabs`, which
   * draws the panel too.
   */
  variant?: 'underline' | 'panel'
  className?: string
}

/**
 * A row of tabs with an underline on the selected one (the settings modals'
 * tabs). Arrow keys, Home and End move between tabs. Render the selected
 * tab's content yourself, in a `TabPanel` if you pass `idPrefix`.
 */
export function Tabs<K extends string = string>({
  tabs,
  value,
  onChange,
  label,
  idPrefix,
  variant = 'underline',
  className,
}: TabsProps<K>) {
  const listRef = useRef<HTMLDivElement>(null)
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End']
    if (!keys.includes(e.key)) return
    e.preventDefault()
    const enabled = tabs.filter((t) => !t.disabled)
    const i = enabled.findIndex((t) => t.key === value)
    const next =
      e.key === 'Home'
        ? 0
        : e.key === 'End'
          ? enabled.length - 1
          : (i + (e.key === 'ArrowRight' ? 1 : -1) + enabled.length) % enabled.length
    const tab = enabled[next]
    if (!tab) return
    onChange(tab.key)
    Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]') ?? [])
      .find((el) => el.dataset.key === tab.key)
      ?.focus()
  }
  return (
    <div
      ref={listRef}
      className={cx('hu-tabs', variant === 'panel' && 'hu-tabs--panel', className)}
      role="tablist" aria-label={label} onKeyDown={onKeyDown}>
      {tabs.map((t) => {
        const selected = t.key === value
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            data-key={t.key}
            id={idPrefix ? `${idPrefix}-tab-${t.key}` : undefined}
            aria-controls={idPrefix ? `${idPrefix}-panel-${t.key}` : undefined}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            disabled={t.disabled}
            className={cx('hu-tab', selected && 'hu-tab--active')}
            onClick={() => onChange(t.key)}
          >
            {t.label}
            {t.sub != null && (
              <>
                {' '}
                <span className="hu-tab__sub">{t.sub}</span>
              </>
            )}
          </button>
        )
      })}
    </div>
  )
}

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  idPrefix: string
  tabKey: string
}

/** The content of the selected tab, labelled by its tab. */
export function TabPanel({ idPrefix, tabKey, className, ...rest }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      id={`${idPrefix}-panel-${tabKey}`}
      aria-labelledby={`${idPrefix}-tab-${tabKey}`}
      className={cx('hu-tab-panel', className)}
      {...rest}
    />
  )
}

export interface PanelTabsProps<K extends string = string> extends Omit<TabsProps<K>, 'variant' | 'className'> {
  /** The selected tab's content, inside the panel. */
  children?: ReactNode
  /** The panel's own accessible name, in place of its tab's label. */
  panelLabel?: string
  className?: string
}

/**
 * Tabs that own a panel: the strip sits on a bordered panel and the selected
 * tab joins it, so every control inside visibly belongs to that tab
 * (AppConfig's Edges, NetConfig). Keyboard as `Tabs`. The tabs and the panel
 * are wired for screen readers (an id prefix is made if none is given).
 */
export function PanelTabs<K extends string = string>({
  children,
  panelLabel,
  className,
  idPrefix,
  ...tabs
}: PanelTabsProps<K>) {
  const autoId = useId()
  const prefix = idPrefix ?? `hu-pt${autoId.replace(/:/g, '')}`
  return (
    <div className={cx('hu-panel-tabs', className)}>
      <Tabs {...tabs} idPrefix={prefix} variant="panel" />
      <TabPanel
        idPrefix={prefix}
        tabKey={tabs.value}
        className="hu-tab-panel--joined"
        {...(panelLabel ? { 'aria-label': panelLabel, 'aria-labelledby': undefined } : {})}
      >
        {children}
      </TabPanel>
    </div>
  )
}
