import { useSyncExternalStore } from 'react'

const COMPLETE_KEY = 'ethos_launch_getstarted_complete_v1'
const DISMISS_KEY = 'ethos_launch_getstarted_dismissed_v1'
const EVENT_NAME = 'ethos:getstarted-changed'

function readJson() {
  try {
    return localStorage.getItem(COMPLETE_KEY) ?? '[]'
  } catch {
    return '[]'
  }
}

export function readCompleted() {
  try {
    return new Set(JSON.parse(readJson()))
  } catch {
    return new Set()
  }
}

export function writeCompleted(set) {
  try {
    localStorage.setItem(COMPLETE_KEY, JSON.stringify([...set]))
  } catch { /* ignore */ }
  window.dispatchEvent(new Event(EVENT_NAME))
}

export function readDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === 'true'
  } catch {
    return false
  }
}

export function writeDismissed(value) {
  try {
    localStorage.setItem(DISMISS_KEY, value ? 'true' : 'false')
  } catch { /* ignore */ }
  window.dispatchEvent(new Event(EVENT_NAME))
}

function subscribe(callback) {
  window.addEventListener(EVENT_NAME, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(EVENT_NAME, callback)
    window.removeEventListener('storage', callback)
  }
}

// Returns the raw JSON string so referential equality holds across renders
// when nothing has changed (useSyncExternalStore requirement).
export function useCompletedJson() {
  return useSyncExternalStore(subscribe, readJson, () => '[]')
}
