"use client"

import * as React from "react"
import { forwardRef, useId } from "react"
import DatePicker from "react-date-picker"
import { Calendar, X, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import "react-date-picker/dist/DatePicker.css"
import "react-calendar/dist/Calendar.css"

// Variants for the DatePicker component
const datePickerVariants = cva(
  "relative inline-flex w-full",
  {
    variants: {
      variant: {
        default: "",
        outline: "",
        ghost: "",
        secondary: "",
      },
      size: {
        default: "",
        sm: "",
        lg: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface DatePickerProps
  extends Omit<React.ComponentProps<typeof DatePicker>, "className" | "onChange" | "value">,
  VariantProps<typeof datePickerVariants> {
  className?: string
  value?: Date | null
  onChange?: (date: Date | null) => void
  placeholder?: string
  error?: string
  label?: string
  helperText?: string
  required?: boolean
  showClearButton?: boolean
  showTodayButton?: boolean
  dateFormat?: string
  timeFormat?: string
  showTime?: boolean
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  onFocus?: () => void
  onBlur?: () => void
  id?: string
  name?: string
}

const CustomDatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      className,
      variant,
      size,
      value,
      onChange,
      // placeholder = "Select date...",
      error,
      label,
      helperText,
      required = false,
      showClearButton = true,
      showTodayButton = false,
      dateFormat = "MM/dd/yyyy",
      // showTime = false,
      minDate,
      maxDate,
      // disabledDates = [],
      onFocus,
      onBlur,
      disabled = false,
      id,
      name,
      ...props
    },
    ref
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isOpen, setIsOpen] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState<Date | null>(value || null)

    // Use React's useId hook for stable SSR-safe IDs
    const reactId = useId()
    const inputId = id || `datepicker-${reactId}`

    // Sync internal value with prop value
    React.useEffect(() => {
      setInternalValue(value || null)
    }, [value])

    const handleDateChange = (value: Date | null | [Date | null, Date | null]) => {
      if (value instanceof Date || value === null) {
        setInternalValue(value)
        onChange?.(value)
      }
    }

    // const handleClear = () => {
    //     setInternalValue(null)
    //     onChange?.(null)
    // }

    const handleToday = () => {
      const today = new Date()
      setInternalValue(today)
      onChange?.(today)
    }

    // const isDateDisabled = (date: Date) => {
    //   return disabledDates.some(disabledDate =>
    //     disabledDate.toDateString() === date.toDateString()
    //   )
    // }

    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              error ? "text-destructive" : "text-foreground"
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        {/* DatePicker Container */}
        <div className={cn(datePickerVariants({ variant, size }))}>
          <DatePicker
            value={internalValue}
            onChange={handleDateChange}
            format={dateFormat}
            disabled={disabled}
            minDate={minDate}
            maxDate={maxDate}
            clearIcon={showClearButton ? <X className="w-4 h-4" /> : null}
            calendarIcon={<Calendar className="w-4 h-4" />}
            onCalendarOpen={() => {
              setIsOpen(true)
              onFocus?.()
            }}
            onCalendarClose={() => {
              setIsOpen(false)
              onBlur?.()
            }}
            // disabled={disabled}
            className="custom-datepicker"
            name={name}
            {...props}
          />

          {/* Today Button */}
          {showTodayButton && !disabled && (
            <button
              type="button"
              onClick={handleToday}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-xs px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Today
            </button>
          )}
        </div>

        {/* Helper Text or Error */}
        {(helperText || error) && (
          <div className="flex items-center gap-1 text-sm">
            {error && <AlertCircle className="w-4 h-4 text-destructive" />}
            <span className={error ? "text-destructive" : "text-muted-foreground"}>
              {error || helperText}
            </span>
          </div>
        )}

        {/* Custom Styles */}
        <style jsx global>{`
          /* DatePicker Base Styles */
          .custom-datepicker {
            width: 100%;
            display: flex;
          }

          .custom-datepicker .react-date-picker__wrapper {
            display: flex;
            flex-grow: 1;
            flex-shrink: 0;
            align-items: center;
            justify-content: space-between;
            border: 1px solid hsl(var(--border));
            border-radius: calc(var(--radius) - 2px);
            padding: ${size === "sm" ? "0.375rem 0.5rem" : size === "lg" ? "0.625rem 1rem" : "0.5rem 0.75rem"};
            background-color: ${variant === "ghost" ? "transparent" : variant === "secondary" ? "hsl(var(--secondary))" : "hsl(var(--background))"};
            font-size: ${size === "sm" ? "0.75rem" : size === "lg" ? "1rem" : "0.875rem"};
            min-height: ${size === "sm" ? "2rem" : size === "lg" ? "2.75rem" : "2.25rem"};
            transition: all 0.2s ease-in-out;
            gap: 0.5rem;
            ${error ? "border-color: hsl(var(--destructive));" : ""}
          }

          .custom-datepicker .react-date-picker__wrapper:hover {
            border-color: ${error ? "hsl(var(--destructive))" : "hsl(var(--ring))"};
          }

          .custom-datepicker .react-date-picker__wrapper:focus-within {
            outline: 2px solid hsl(var(--ring));
            outline-offset: 2px;
            border-color: hsl(var(--ring));
          }

          .custom-datepicker .react-date-picker__wrapper--disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background-color: hsl(var(--muted));
          }

          .custom-datepicker .react-date-picker__inputGroup {
            min-width: calc(4px + (4px * 3) + 0.54em * 8 + 0.217em * 2);
            flex-grow: 1;
            padding: 0;
            box-sizing: content-box;
            display: flex;
            align-items: center;
            gap: 0.125rem;
          }

          .custom-datepicker .react-date-picker__inputGroup__divider {
            padding: 0 0.375rem;
            color: hsl(var(--muted-foreground));
            font-weight: 400;
            user-select: none;
          }

          .custom-datepicker .react-date-picker__inputGroup__input {
            min-width: 2ch;
            max-width: 4ch;
            height: 100%;
            position: relative;
            padding: 0.125rem 0.25rem;
            border: 0;
            background: none;
            font: inherit;
            font-variant-numeric: tabular-nums;
            box-sizing: content-box;
            -moz-appearance: textfield;
            outline: none;
            color: hsl(var(--foreground));
            text-align: center;
            border-radius: 2px;
          }

          .custom-datepicker .react-date-picker__inputGroup__input::placeholder {
            color: hsl(var(--muted-foreground));
          }

          .custom-datepicker .react-date-picker__inputGroup__input:focus {
            background-color: hsl(var(--accent) / 0.1);
            outline: none;
          }

          .custom-datepicker .react-date-picker__inputGroup__input::-webkit-outer-spin-button,
          .custom-datepicker .react-date-picker__inputGroup__input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          .custom-datepicker .react-date-picker__inputGroup__input:invalid {
            background: hsl(var(--destructive) / 0.1);
          }

          /* Ensure proper spacing between input groups */
          .custom-datepicker .react-date-picker__inputGroup__input + .react-date-picker__inputGroup__divider {
            margin-left: 0.125rem;
          }

          .custom-datepicker .react-date-picker__inputGroup__divider + .react-date-picker__inputGroup__input {
            margin-left: 0.125rem;
          }

          .custom-datepicker .react-date-picker__button {
            border: 0;
            background: transparent;
            padding: 0.25rem;
            cursor: pointer;
            color: hsl(var(--muted-foreground));
            transition: color 0.2s ease-in-out;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: calc(var(--radius) - 4px);
            flex-shrink: 0;
            margin-left: 0.25rem;
          }

          .custom-datepicker .react-date-picker__button:hover:not(:disabled) {
            color: hsl(var(--foreground));
            background-color: hsl(var(--accent));
          }

          .custom-datepicker .react-date-picker__button:disabled {
            cursor: default;
            opacity: 0.5;
          }

          .custom-datepicker .react-date-picker__button svg {
            width: 1rem;
            height: 1rem;
          }

          /* Calendar Popup Styles */
          .custom-calendar {
            width: 100%;
            max-width: 350px;
            background: hsl(var(--popover));
            border: 1px solid hsl(var(--border));
            border-radius: var(--radius);
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04);
            font-family: inherit;
            line-height: 1.125em;
            padding: 1rem;
            z-index: 1000;
          }

          .custom-calendar .react-calendar__navigation {
            display: flex;
            height: 2.5rem;
            margin-bottom: 1em;
            align-items: center;
          }

          .custom-calendar .react-calendar__navigation button {
            min-width: 2.5rem;
            background: none;
            border: 0;
            border-radius: calc(var(--radius) - 2px);
            font-size: 0.875rem;
            font-weight: 500;
            padding: 0.5rem;
            transition: background-color 0.2s ease-in-out;
            color: hsl(var(--foreground));
            cursor: pointer;
          }

          .custom-calendar .react-calendar__navigation button:disabled {
            opacity: 0.5;
            cursor: default;
          }

          .custom-calendar .react-calendar__navigation button:enabled:hover,
          .custom-calendar .react-calendar__navigation button:enabled:focus {
            background-color: hsl(var(--accent));
          }

          .custom-calendar .react-calendar__navigation__label {
            flex-grow: 1;
            font-weight: 600;
            text-align: center;
          }

          .custom-calendar .react-calendar__navigation__arrow {
            flex-grow: 0;
            flex-shrink: 0;
            width: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .custom-calendar .react-calendar__month-view__weekdays {
            text-align: center;
            text-transform: uppercase;
            font-weight: 500;
            font-size: 0.75rem;
            color: hsl(var(--muted-foreground));
            margin-bottom: 0.5rem;
          }

          .custom-calendar .react-calendar__month-view__weekdays__weekday {
            padding: 0.5rem 0.25rem;
          }

          .custom-calendar .react-calendar__tile {
            max-width: 100%;
            padding: 0.5rem;
            background: none;
            text-align: center;
            line-height: 1;
            border: 0;
            border-radius: calc(var(--radius) - 2px);
            font-size: 0.875rem;
            transition: all 0.2s ease-in-out;
            cursor: pointer;
            height: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: hsl(var(--foreground));
            position: relative;
          }

          .custom-calendar .react-calendar__tile:disabled {
            background-color: transparent;
            color: hsl(var(--muted-foreground));
            opacity: 0.5;
            cursor: default;
          }

          .custom-calendar .react-calendar__tile:enabled:hover,
          .custom-calendar .react-calendar__tile:enabled:focus {
            background-color: hsl(var(--accent));
            color: hsl(var(--accent-foreground));
          }

          .custom-calendar .react-calendar__tile--now {
            background: hsl(var(--accent));
            color: hsl(var(--accent-foreground));
            font-weight: 600;
          }

          .custom-calendar .react-calendar__tile--active {
            background: hsl(var(--primary));
            color: hsl(var(--primary-foreground));
            font-weight: 600;
          }

          .custom-calendar .react-calendar__tile--active:enabled:hover,
          .custom-calendar .react-calendar__tile--active:enabled:focus {
            background: hsl(var(--primary));
            color: hsl(var(--primary-foreground));
          }

          .custom-calendar .react-calendar__month-view__days__day--neighboringMonth {
            color: hsl(var(--muted-foreground));
            opacity: 0.5;
          }

          /* Dark mode support */
          .dark .custom-datepicker .react-date-picker__wrapper {
            background-color: hsl(var(--background));
            border-color: hsl(var(--border));
          }

          .dark .custom-calendar {
            background: hsl(var(--popover));
            border-color: hsl(var(--border));
          }

          /* Focus visible styles */
          .custom-calendar .react-calendar__tile:focus-visible {
            outline: 2px solid hsl(var(--ring));
            outline-offset: 2px;
          }

          .custom-datepicker .react-date-picker__button:focus-visible {
            outline: 2px solid hsl(var(--ring));
            outline-offset: 2px;
          }
        `}</style>
      </div>
    )
  }
)

CustomDatePicker.displayName = "DatePicker"

// Additional utility components
export const DatePickerRange = forwardRef<HTMLDivElement, {
  startDate?: Date | null
  endDate?: Date | null
  onStartDateChange?: (date: Date | null) => void
  onEndDateChange?: (date: Date | null) => void
  className?: string
  startLabel?: string
  endLabel?: string
  error?: string
}>(({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className,
  startLabel = "Start Date",
  endLabel = "End Date",
  error,
  ...props
}, ref) => {
  return (
    <div ref={ref} className={cn("space-y-4", className)} {...props}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomDatePicker
          label={startLabel}
          value={startDate}
          onChange={onStartDateChange}
          maxDate={endDate || undefined}
          error={error}
        />
        <CustomDatePicker
          label={endLabel}
          value={endDate}
          onChange={onEndDateChange}
          minDate={startDate || undefined}
          error={error}
        />
      </div>
    </div>
  )
})

DatePickerRange.displayName = "DatePickerRange"

export { CustomDatePicker as DatePicker, datePickerVariants }
