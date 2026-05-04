/* Session-storage backed registry of Resource Library items saved to the
   Vault. Lets the Resource Library page and the Vault page stay in sync
   across navigation without pulling in a global store for the prototype. */

const STORAGE_KEY = 'vault.resourceSaves'

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

export function readResourceSaves() {
  return readAll()
}

export function getResourceSave(resourceId) {
  return readAll()[resourceId] ?? null
}

export function saveResource(resourceId, folderName, metadata = {}) {
  const saves = readAll()
  saves[resourceId] = {
    folderName,
    savedAt: new Date().toISOString(),
    ...metadata,
  }
  writeAll(saves)
  return saves[resourceId]
}

export function unsaveResource(resourceId) {
  const saves = readAll()
  delete saves[resourceId]
  writeAll(saves)
}
