import { Combobox, Transition } from "@headlessui/react"
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from "@heroicons/react/20/solid"
import React, { Fragment, useState } from "react"

import { cn } from "~/utils/cn"

export interface MultiSelectOption {
  value: string
  label: string
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  allowCustom?: boolean
  className?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select...",
  label,
  disabled = false,
  allowCustom = false,
  className
}: MultiSelectProps) {
  const [query, setQuery] = useState("")

  const selectedOptions = selected.map((value) => {
    const option = options.find((opt) => opt.value === value)
    return option || { value, label: value }
  })

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
          option.label.toLowerCase().includes(query.toLowerCase())
        )

  const handleSelect = (newSelected: MultiSelectOption[]) => {
    onChange(newSelected.map((opt) => opt.value))
  }

  const handleRemove = (value: string) => {
    onChange(selected.filter((v) => v !== value))
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && allowCustom && query.trim()) {
      e.preventDefault()
      if (!selected.includes(query.trim())) {
        onChange([...selected, query.trim()])
      }
      setQuery("")
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-dark-text-primary">
          {label}
        </label>
      )}
      <Combobox
        value={selectedOptions}
        onChange={handleSelect}
        multiple
        disabled={disabled}>
        <div className="relative">
          <div className="relative w-full">
            <Combobox.Input
              className="w-full rounded-md border border-gray-300 dark:border-dark-bg-tertiary bg-white dark:bg-dark-bg-secondary py-2 pl-3 pr-10 text-sm text-gray-900 dark:text-dark-text-primary focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={placeholder}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleInputKeyDown}
              displayValue={() => query}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}>
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-dark-bg-secondary py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredOptions.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700 dark:text-dark-text-secondary">
                  {allowCustom
                    ? "Press Enter to add custom value"
                    : "Nothing found."}
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <Combobox.Option
                    key={option.value}
                    className={({ active }) =>
                      cn(
                        "relative cursor-default select-none py-2 pl-10 pr-4",
                        active
                          ? "bg-blue-600 text-white"
                          : "text-gray-900 dark:text-dark-text-primary"
                      )
                    }
                    value={option}>
                    {({ selected, active }) => (
                      <>
                        <span
                          className={cn(
                            "block truncate",
                            selected ? "font-medium" : "font-normal"
                          )}>
                          {option.label}
                        </span>
                        {selected ? (
                          <span
                            className={cn(
                              "absolute inset-y-0 left-0 flex items-center pl-3",
                              active ? "text-white" : "text-blue-600"
                            )}>
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>

      {/* Selected items */}
      {selectedOptions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <span
              key={option.value}
              className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-200">
              {option.label}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemove(option.value)}
                  className="inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none dark:hover:bg-blue-800">
                  <XMarkIcon className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
