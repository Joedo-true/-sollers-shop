import { useEffect, useState } from 'react'

/**
 * Returns a debounced copy of `value` that only updates after `delay`
 * milliseconds have passed without a change. Used by the live search field so
 * we don't re-filter the whole catalog on every single keystroke.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
