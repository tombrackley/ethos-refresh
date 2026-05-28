import { useSyncExternalStore } from 'react'

function read() {
  try {
    const stored = sessionStorage.getItem('ethos_auth')
    if (stored) return JSON.parse(stored).demo ?? null
  } catch { /* ignore */ }
  return null
}

function subscribe(callback) {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

export function useDemoMode() {
  return useSyncExternalStore(subscribe, read, () => null)
}
