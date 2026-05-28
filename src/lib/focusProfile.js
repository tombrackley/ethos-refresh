// Shared storage for the user's focus areas / skills / learning goals selections.
// Used by the Profile page (Focus & Skills section) and the Skills Profile page
// (Manage overlay). Single localStorage key so changes propagate.

export const FOCUS_PROFILE_KEY = 'ethos_profile_setup_v1'

export function readFocusProfile() {
  try {
    return JSON.parse(localStorage.getItem(FOCUS_PROFILE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export function writeFocusProfile(data) {
  try {
    localStorage.setItem(FOCUS_PROFILE_KEY, JSON.stringify(data))
  } catch { /* ignore */ }
}
