import {
  Children,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react'
import { createPortal } from 'react-dom'

import { cn } from '../lib/cn'
import { MaterialIcon } from './MaterialIcon'

interface SelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'>,
    PropsWithChildren {
  className?: string
  wrapperClassName?: string
  iconClassName?: string
}

interface SelectOption {
  value: string
  label: string
  disabled: boolean
}

const triggerBaseClassName =
  'flex w-full items-center justify-between gap-3 rounded-xl border border-transparent bg-surface-container-low px-4 py-3.5 text-left text-sm text-on-surface shadow-sm outline-none transition focus-visible:border-primary/30 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60'

function parseOptions(children: ReactNode): SelectOption[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child) || child.type !== 'option') {
      return []
    }

    const option = child as ReactElement<{
      value?: string | number
      children?: ReactNode
      disabled?: boolean
    }>
    const valueProp = option.props.value
    const value = valueProp == null ? '' : String(valueProp)
    const label = typeof option.props.children === 'string'
      ? option.props.children
      : String(option.props.children ?? value)

    return [
      {
        value,
        label,
        disabled: Boolean(option.props.disabled),
      },
    ]
  })
}

export function SelectField({
  children,
  className,
  wrapperClassName,
  iconClassName,
  value,
  defaultValue,
  onChange,
  disabled,
  id,
  name,
  required,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  autoFocus,
  tabIndex,
}: SelectFieldProps) {
  const reactId = useId()
  const selectId = id ?? `select-${reactId}`
  const listboxId = `${selectId}-listbox`
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const listboxRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 })

  const options = useMemo(() => parseOptions(children), [children])
  const controlledValue = value == null ? defaultValue : value
  const selectedValue = controlledValue == null ? '' : String(controlledValue)
  const selectedOption = options.find((option) => option.value === selectedValue) ?? options[0]

  const selectedLabel = selectedOption?.label ?? ''

  const updateMenuPosition = () => {
    const trigger = triggerRef.current
    if (!trigger) {
      return
    }

    const rect = trigger.getBoundingClientRect()
    setMenuPosition({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    })
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }

    updateMenuPosition()
    const onWindowChange = () => updateMenuPosition()
    window.addEventListener('resize', onWindowChange)
    window.addEventListener('scroll', onWindowChange, true)

    return () => {
      window.removeEventListener('resize', onWindowChange)
      window.removeEventListener('scroll', onWindowChange, true)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleDocumentMouseDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (triggerRef.current?.contains(target) || listboxRef.current?.contains(target)) {
        return
      }

      setIsOpen(false)
    }

    const handleDocumentEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleDocumentMouseDown)
    document.addEventListener('keydown', handleDocumentEscape)

    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown)
      document.removeEventListener('keydown', handleDocumentEscape)
    }
  }, [isOpen])

  const selectOption = (nextValue: string) => {
    if (!onChange) {
      setIsOpen(false)
      return
    }

    const event = {
      target: { value: nextValue },
      currentTarget: { value: nextValue },
    } as ChangeEvent<HTMLSelectElement>

    onChange(event)
    setIsOpen(false)
  }

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (disabled) {
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setIsOpen(true)
    }
  }

  return (
    <div className={cn('relative', wrapperClassName)}>
      {name ? <input type="hidden" name={name} value={selectedValue} required={required} /> : null}

      <button
        id={selectId}
        ref={triggerRef}
        type="button"
        className={cn(triggerBaseClassName, className)}
        onClick={() => {
          if (!disabled) {
            setIsOpen((current) => !current)
          }
        }}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        autoFocus={autoFocus}
        tabIndex={tabIndex}
        disabled={disabled}
      >
        <span className="truncate">{selectedLabel}</span>
        <MaterialIcon
          name="expand_more"
          className={cn(
            'shrink-0 text-on-surface-variant transition-transform duration-200',
            isOpen ? 'rotate-180' : undefined,
            iconClassName,
          )}
        />
      </button>

      {isOpen
        ? createPortal(
            <div
              id={listboxId}
              ref={listboxRef}
              role="listbox"
              aria-labelledby={selectId}
              className="fixed z-[120] max-h-72 overflow-y-auto rounded-2xl border border-primary/15 bg-white/95 p-2 shadow-2xl backdrop-blur"
              style={{
                top: menuPosition.top,
                left: menuPosition.left,
                width: menuPosition.width,
              }}
            >
              {options.map((option) => {
                const isSelected = option.value === selectedValue
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={option.disabled}
                    onClick={() => selectOption(option.value)}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition',
                      option.disabled
                        ? 'cursor-not-allowed text-on-surface-variant/60'
                        : isSelected
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-on-surface hover:bg-surface-container-low',
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected ? <MaterialIcon name="check" className="text-base text-current" /> : null}
                  </button>
                )
              })}
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
