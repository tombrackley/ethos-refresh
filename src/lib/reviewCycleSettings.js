// Simple shared state for the org-level review cycle setting.
// Uses localStorage so it persists across page navigations in the prototype.
// Components call useReviewCyclesEnabled() to read, and setReviewCyclesEnabled() to write.

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'ethos_review_cycles_enabled'
const listeners = new Set()

function getStored() {
  try {
    const val = localStorage.getItem(STORAGE_KEY)
    return val === null ? true : val === 'true' // default: enabled
  } catch { return true }
}

export function setReviewCyclesEnabled(enabled) {
  localStorage.setItem(STORAGE_KEY, String(enabled))
  listeners.forEach(fn => fn(enabled))
}

export function useReviewCyclesEnabled() {
  const [enabled, setEnabled] = useState(getStored)

  useEffect(() => {
    const handler = (val) => setEnabled(val)
    listeners.add(handler)
    return () => listeners.delete(handler)
  }, [])

  return enabled
}
