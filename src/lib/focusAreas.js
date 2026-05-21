const STORAGE_KEY = 'ethos_focus_areas_v1'

export function readFocusAreas() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'))
  } catch {
    return new Set()
  }
}

export function writeFocusAreas(set) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
  } catch { /* ignore */ }
}
