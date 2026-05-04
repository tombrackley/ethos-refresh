import { Fragment, useState, useMemo } from 'react'
import flagsJson from '@/config/flags.json'
import { getActiveEnv, getBuildMode } from '@/config/flags'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Flag, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const ENV_META = {
  prototype:        { label: 'Prototype',            dot: 'bg-amber-500'   },
  development:      { label: 'Dev',                  dot: 'bg-blue-500'    },
  production:       { label: 'Production',           dot: 'bg-slate-600'   },
  blackmores:       { label: 'Blackmores',           dot: 'bg-emerald-500' },
  migration:        { label: 'Migration (Playfair)', dot: 'bg-rose-500'    },
  fshd:             { label: 'FSHD',                 dot: 'bg-cyan-500'    },
  cooperip:         { label: 'Cooper IP',            dot: 'bg-orange-500'  },
  gallagherbassett: { label: 'Gallagher Bassett',    dot: 'bg-teal-500'    },
}

const ENV_ORDER = flagsJson._meta?.envOrder ?? []
const ENVIRONMENTS = [
  ...ENV_ORDER.filter(id => id in flagsJson && id !== 'default' && id !== '_meta'),
  ...Object.keys(flagsJson).filter(
    id => id !== 'default' && id !== '_meta' && !ENV_ORDER.includes(id)
  ),
].map(id => ({ id, ...(ENV_META[id] ?? { label: id, dot: 'bg-slate-400' }) }))

const SECTION_META = flagsJson._meta?.sections ?? {}
const SECTION_ORDER = flagsJson._meta?.sectionOrder ?? []

function effectiveState(flagKey, envId) {
  return flagsJson[envId]?.[flagKey] ?? flagsJson.default[flagKey] ?? false
}

export default function FeatureFlagManagerPage() {
  const activeEnv = getActiveEnv()
  const buildMode = getBuildMode()
  const [query, setQuery] = useState('')

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase()
    const bySection = new Map()

    for (const key of Object.keys(flagsJson.default)) {
      const section = SECTION_META[key] ?? 'Other'
      if (q && !key.toLowerCase().includes(q) && !section.toLowerCase().includes(q)) continue
      if (!bySection.has(section)) bySection.set(section, [])
      bySection.get(section).push(key)
    }
    for (const keys of bySection.values()) keys.sort((a, b) => a.localeCompare(b))

    const ordered = []
    for (const s of SECTION_ORDER) {
      if (bySection.has(s)) {
        ordered.push([s, bySection.get(s)])
        bySection.delete(s)
      }
    }
    for (const [s, keys] of bySection) ordered.push([s, keys])
    return ordered
  }, [query])

  const gridCols = {
    gridTemplateColumns: `minmax(280px, 1.6fr) repeat(${ENVIRONMENTS.length}, minmax(120px, 1fr))`,
  }

  return (
    <div className="flex-1 overflow-auto p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Flag className="size-5 text-brand-800" />
        <div>
          <h1 className="text-lg font-semibold">Flags</h1>
          <p className="text-sm text-muted-foreground">
            Compiled from <span className="font-mono">src/config/flags.json</span>
            <span className="mx-2">·</span>
            Active tenant: <Badge variant="secondary" className="ml-1">{activeEnv}</Badge>
            <span className="mx-2">·</span>
            Build mode: <Badge variant="outline" className="ml-1">{buildMode}</Badge>
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-[#E2E8F0] bg-background overflow-x-auto">
        <div
          className="grid items-center gap-2 border-b border-[#E2E8F0] bg-muted/30 px-3 py-2"
          style={gridCols}
        >
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search flags by name or section"
              className="h-8 pl-8 bg-background"
            />
          </div>
          {ENVIRONMENTS.map(env => (
            <div key={env.id} className="flex items-center gap-2 px-2">
              <span className={cn('size-2 rounded-full', env.dot)} />
              <span className="text-sm font-medium">{env.label}</span>
              {env.id === activeEnv && (
                <Badge variant="outline" className="text-[10px] h-4 px-1.5">active</Badge>
              )}
            </div>
          ))}
        </div>

        {grouped.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-muted-foreground">
            No flags match "{query}"
          </div>
        ) : (
          grouped.map(([section, keys]) => (
            <Fragment key={section}>
              <div className="border-b border-[#E2E8F0] bg-muted/50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {section}
                <span className="ml-2 font-normal normal-case tracking-normal text-muted-foreground/70">
                  ({keys.length})
                </span>
              </div>
              {keys.map(key => (
                <div
                  key={key}
                  className="grid items-center gap-2 border-b border-[#E2E8F0] px-3 py-2.5 last:border-b-0 hover:bg-muted/20"
                  style={gridCols}
                >
                  <div className="min-w-0 text-sm font-mono font-medium truncate">{key}</div>
                  {ENVIRONMENTS.map(env => {
                    const on = effectiveState(key, env.id)
                    return (
                      <div key={env.id} className="flex items-center gap-2 px-2">
                        <span className={cn('size-2 rounded-full', on ? 'bg-emerald-500' : 'bg-slate-300')} />
                        <span className={cn(
                          'inline-flex h-5 items-center rounded px-1.5 text-xs font-medium',
                          on ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        )}>
                          {on ? 'On' : 'Off'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ))}
            </Fragment>
          ))
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Values are compiled at build time. To change a flag, edit{' '}
        <span className="font-mono">src/config/flags.json</span> and redeploy.
      </p>
    </div>
  )
}
