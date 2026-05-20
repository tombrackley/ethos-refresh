/* Session-storage backed registry of insights saved to the Reading List. */

const STORAGE_KEY = 'insights.savedItems'

function readAll() {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeAll(saves) {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(saves))
}

export function getSavedInsights() {
  const saves = readAll()
  return Object.values(saves).sort((a, b) => (b.savedAt ?? '').localeCompare(a.savedAt ?? ''))
}

export function isInsightSaved(insightId) {
  return readAll()[insightId] != null
}

export function saveInsight(insightId, metadata = {}) {
  const saves = readAll()
  saves[insightId] = {
    id: insightId,
    savedAt: new Date().toISOString(),
    ...metadata,
  }
  writeAll(saves)
  return saves[insightId]
}

export function unsaveInsight(insightId) {
  const saves = readAll()
  delete saves[insightId]
  writeAll(saves)
}

export function toggleInsightSave(insightId, metadata = {}) {
  return isInsightSaved(insightId)
    ? (unsaveInsight(insightId), false)
    : (saveInsight(insightId, metadata), true)
}
