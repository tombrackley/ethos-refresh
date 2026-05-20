/* Session-storage backed registry of insights the user has opened the
   Detail page for. Used to drive the All / Unread / Read filter on the
   Reading List. */

const STORAGE_KEY = 'insights.readItems'

function readAll() {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeAll(reads) {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(reads))
}

export function isInsightRead(insightId) {
  return readAll()[insightId] != null
}

export function markInsightRead(insightId) {
  if (!insightId) return
  const reads = readAll()
  if (reads[insightId]) return
  reads[insightId] = { readAt: new Date().toISOString() }
  writeAll(reads)
}
