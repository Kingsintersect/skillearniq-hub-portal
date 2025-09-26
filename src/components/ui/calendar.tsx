"use client"
import * as React from "react"
import DatePicker, { DatePickerProps } from "react-date-picker"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
// @ts-ignore - CSS has no types
import "react-date-picker/dist/DatePicker.css";
// @ts-ignore - CSS has no types
import "react-calendar/dist/Calendar.css";

import { Value } from "react-date-picker/dist/shared/types.js"

interface CalendarProps extends Omit<DatePickerProps, "onChange" | "value"> {
  value?: Date | null
  onChange?: (date: Date | null) => void
  className?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  clearIcon?: React.ReactNode | null
  calendarIcon?: React.ReactNode | null
  showLeadingZeros?: boolean
  format?: string
  locale?: string
  // [key: string]: any
}

function Calendar({
  className,
  value,
  onChange,
  disabled = false,
  minDate,
  maxDate,
  clearIcon = null,
  calendarIcon = <CalendarIcon className="w-4 h-4" />,
  showLeadingZeros = true,
  format = "y-MM-dd",
  locale = "en-US",
  ...props
}: CalendarProps) {
  return (
    <div className={cn("calendar-wrapper", className)}>
      <DatePicker
        value={value}
        onChange={(val: Value) => {
          if (!onChange) return
          if (Array.isArray(val)) {
            // val is a range: [Date | null, Date | null]
            onChange(val[0] ?? null)
          } else {
            // val is Date | null
            onChange(val)
          }
        }}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        clearIcon={clearIcon}
        calendarIcon={calendarIcon}
        showLeadingZeros={showLeadingZeros}
        format={format}
        locale={locale}
        className="react-date-picker react-calendar"
        {...props}
      />
      <style jsx global>{`
        /* DatePicker Input Styles */
        .react-date-picker {
          display: inline-flex;
          position: relative;
          width: 100%;
        }
        
        .react-date-picker__wrapper {
          display: flex;
          flex-grow: 1;
          flex-shrink: 0;
          border: 1px solid hsl(var(--border));
          border-radius: calc(var(--radius) - 2px);
          padding: 0.5rem 0.75rem;
          background-color: hsl(var(--background));
          font-size: 0.875rem;
          transition: border-color 0.2s ease-in-out;
        }
        
        .react-date-picker__wrapper:hover {
          border-color: hsl(var(--border));
        }
        
        .react-date-picker__wrapper:focus-within {
          outline: 2px solid hsl(var(--ring));
          outline-offset: 2px;
          border-color: hsl(var(--ring));
        }
        
        .react-date-picker__inputGroup {
          min-width: calc(4px + (4px * 3) + 0.54em * 6 + 0.217em * 2);
          flex-grow: 1;
          padding: 0;
          box-sizing: content-box;
        }
        
        .react-date-picker__inputGroup__divider {
          color: hsl(var(--muted-foreground));
        }
        
        .react-date-picker__inputGroup__input {
          min-width: 0.54em;
          height: 100%;
          position: relative;
          padding: 0;
          border: 0;
          background: none;
          font: inherit;
          box-sizing: content-box;
          -moz-appearance: textfield;
          outline: none;
          color: hsl(var(--foreground));
        }
        
        .react-date-picker__inputGroup__input::-webkit-outer-spin-button,
        .react-date-picker__inputGroup__input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        .react-date-picker__inputGroup__input:invalid {
          background: hsl(var(--destructive) / 0.1);
        }
        
        .react-date-picker__button {
          border: 0;
          background: transparent;
          padding: 4px 6px;
          cursor: pointer;
          color: hsl(var(--muted-foreground));
          transition: color 0.2s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .react-date-picker__button:hover {
          color: hsl(var(--foreground));
        }
        
        .react-date-picker__button:disabled {
          cursor: default;
        }
        
        .react-date-picker__button svg {
          width: 1rem;
          height: 1rem;
        }
        
        /* Calendar Popup Styles */
        .react-calendar {
          width: 100%;
          max-width: 100%;
          background: hsl(var(--popover));
          border: 1px solid hsl(var(--border));
          border-radius: var(--radius);
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
          font-family: inherit;
          line-height: 1.125em;
          padding: 0.75rem;
        }
        
        .react-calendar--selectRange .react-calendar__tile--hover {
          background-color: hsl(var(--accent));
        }
        
        .react-calendar button {
          margin: 0;
          border: 0;
          outline: none;
          font: inherit;
          color: hsl(var(--foreground));
        }
        
        .react-calendar button:enabled:hover,
        .react-calendar button:enabled:focus {
          background-color: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
        }
        
        .react-calendar__navigation {
          display: flex;
          height: 2.5rem;
          margin-bottom: 1em;
        }
        
        .react-calendar__navigation button {
          min-width: 2.5rem;
          background: none;
          border-radius: calc(var(--radius) - 2px);
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.5rem;
          transition: background-color 0.2s ease-in-out;
        }
        
        .react-calendar__navigation button:disabled {
          cursor: default;
        }
        
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: hsl(var(--accent));
        }
        
        .react-calendar__navigation__label {
          flex-grow: 1;
          font-weight: 500;
          text-align: center;
        }
        
        .react-calendar__navigation__arrow {
          flex-grow: 0;
          flex-shrink: 0;
          width: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: 400;
          font-size: 0.75rem;
          color: hsl(var(--muted-foreground));
        }
        
        .react-calendar__month-view__weekdays__weekday {
          padding: 0.5rem;
        }
        
        .react-calendar__month-view__weekNumbers .react-calendar__tile {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 400;
          color: hsl(var(--muted-foreground));
        }
        
        .react-calendar__month-view__days__day--weekend {
          color: hsl(var(--foreground));
        }
        
        .react-calendar__month-view__days__day--neighboringMonth {
          color: hsl(var(--muted-foreground));
        }
        
        .react-calendar__year-view .react-calendar__tile,
        .react-calendar__decade-view .react-calendar__tile,
        .react-calendar__century-view .react-calendar__tile {
          padding: 2em 0.5em;
        }
        
        .react-calendar__tile {
          max-width: 100%;
          padding: 0.5rem;
          background: none;
          text-align: center;
          line-height: 1;
          border-radius: calc(var(--radius) - 2px);
          font-size: 0.875rem;
          transition: all 0.2s ease-in-out;
          cursor: pointer;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .react-calendar__tile:disabled {
          background-color: white;
          color: hsl(var(--muted-foreground));
          cursor: default;
        }
        
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
        }
        
        .react-calendar__tile--now {
          background: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
        }
        
        .react-calendar__tile--now:enabled:hover,
        .react-calendar__tile--now:enabled:focus {
          background: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
        }
        
        .react-calendar__tile--hasActive {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }
        
        .react-calendar__tile--hasActive:enabled:hover,
        .react-calendar__tile--hasActive:enabled:focus {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }
        
        .react-calendar__tile--active {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }
        
        .react-calendar__tile--active:enabled:hover,
        .react-calendar__tile--active:enabled:focus {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }
        
        .react-calendar--selectRange .react-calendar__tile--hover {
          background-color: hsl(var(--accent));
        }
        
        /* Dark mode support */
        .dark .react-date-picker__wrapper {
          background-color: hsl(var(--background));
          border-color: hsl(var(--border));
        }
        
        .dark .react-calendar {
          background: hsl(var(--popover));
          border-color: hsl(var(--border));
        }
      `}</style>
    </div>
  )
}

export { Calendar }