import flagsJson from './flags.json'
import { tenantId } from './tenant'

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
const modeOverrides   = (buildMode in flagsJson && !RESERVED.has(buildMode)) ? flagsJson[buildMode] : {}
const tenantOverrides = (tenantId  in flagsJson && !RESERVED.has(tenantId))  ? flagsJson[tenantId]  : {}

if (Object.keys(modeOverrides).length === 0 && Object.keys(tenantOverrides).length === 0
    && !(buildMode in flagsJson) && !(tenantId in flagsJson)) {
  // eslint-disable-next-line no-console
  console.warn(`[flags] no overrides for mode "${buildMode}" or tenant "${tenantId}", using default`)
}

const devOverrides = Object.fromEntries(
  Object.entries(import.meta.env)
    .filter(([k, v]) => k.startsWith('VITE_FLAG_') && (v === 'true' || v === 'false'))
    .map(([k, v]) => [k.slice('VITE_FLAG_'.length), v === 'true'])
)

export const flags = {
  ...flagsJson.default,
  ...modeOverrides,
  ...tenantOverrides,
  ...devOverrides,
}

export function isEnabled(flagKey) {
  return flags[flagKey] === true
}

export function getBuildMode() {
  return buildMode
}

export function getActiveEnv() {
  return tenantId
}
