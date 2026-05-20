import flagsJson from './flags.json'

const RESERVED = new Set(['_meta', 'default'])
const canonicalFlags = Object.keys(flagsJson.default)

for (const [env, overrides] of Object.entries(flagsJson)) {
  if (RESERVED.has(env)) continue
  const stray = Object.keys(overrides).filter(k => !canonicalFlags.includes(k))
  if (stray.length) {
    throw new Error(`flags.json: env "${env}" has unknown flags: ${stray.join(', ')}`)
  }
}

const buildMode = import.meta.env.MODE
const modeOverrides = (buildMode in flagsJson && !RESERVED.has(buildMode)) ? flagsJson[buildMode] : {}

const devOverrides = Object.fromEntries(
  Object.entries(import.meta.env)
    .filter(([k, v]) => k.startsWith('VITE_FLAG_') && (v === 'true' || v === 'false'))
    .map(([k, v]) => [k.slice('VITE_FLAG_'.length), v === 'true'])
)

export const flags = {
  ...flagsJson.default,
  ...modeOverrides,
  ...devOverrides,
}

export function isEnabled(flagKey) {
  return flags[flagKey] === true
}

export function getBuildMode() {
  return buildMode
}
