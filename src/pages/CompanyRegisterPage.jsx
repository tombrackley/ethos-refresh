import { SubsectionRail } from '@/components/shared/SubsectionRail'
import { Badge } from '@/components/ui/badge'
import tenant from '@/config/tenant'

const CR = tenant.pages.govern.companyRegister ?? {
  entities: [], directors: [], officers: [], relatedParties: [], deeds: [],
}
const BOARDS = tenant.pages.govern.boards ?? []
const BOARDS_COMMITTEES = tenant.pages.govern.boardsCommittees ?? []

const STATUS_STYLE = {
  Active:        'border-emerald-200 bg-emerald-50 text-emerald-700',
  Current:       'border-emerald-200 bg-emerald-50 text-emerald-700',
  'Needs Review':'border-amber-200 bg-amber-50 text-amber-700',
  Missing:       'border-destructive/30 bg-destructive/10 text-destructive',
}

function boardName(id) {
  return BOARDS.find(b => b.id === id)?.name
    ?? BOARDS_COMMITTEES.find(b => b.id === id)?.name
    ?? id
}

function SummaryChip({ label, value, tone = 'neutral' }) {
  const toneCls =
    tone === 'amber' ? 'text-amber-700' :
    tone === 'red'   ? 'text-destructive' :
                       'text-foreground'
  return (
    <div className="rounded-lg border border-border/60 bg-white px-4 py-3">
      <p className={`text-2xl font-medium ${toneCls}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  )
}

function EmptyTab({ label }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center">
      <p className="text-sm text-muted-foreground">No {label.toLowerCase()} records.</p>
    </div>
  )
}

function EntitiesTab() {
  if (CR.entities.length === 0) return <EmptyTab label="entity" />
  return (
    <div className="border border-border/60 rounded bg-white overflow-hidden">
      <div className="grid grid-cols-12 gap-3 px-5 py-2 border-b border-border/60 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/30">
        <div className="col-span-5">Entity</div>
        <div className="col-span-3">Type</div>
        <div className="col-span-3">ABN</div>
        <div className="col-span-1">Status</div>
      </div>
      {CR.entities.map(e => (
        <div key={e.id} className="grid grid-cols-12 gap-3 items-center px-5 py-3 border-b border-border/40 last:border-0 text-sm">
          <div className="col-span-5 text-foreground font-medium truncate">{e.name}</div>
          <div className="col-span-3 text-muted-foreground">{e.type}</div>
          <div className="col-span-3 text-muted-foreground">{e.abn}</div>
          <div className="col-span-1">
            <Badge variant="outline" className={`text-xs h-5 px-1.5 ${STATUS_STYLE[e.status] ?? ''}`}>{e.status}</Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

function DirectorsTab() {
  const counts = CR.directors.reduce((acc, d) => {
    acc[d.status] = (acc[d.status] ?? 0) + 1
    return acc
  }, {})
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <SummaryChip label="Current Directors" value={counts.Current ?? 0} />
        <SummaryChip label="Needs Review"      value={counts['Needs Review'] ?? 0} tone="amber" />
        <SummaryChip label="Missing"           value={counts.Missing ?? 0} tone="red" />
      </div>

      {CR.directors.length === 0 ? <EmptyTab label="director" /> : (
        <div className="border border-border/60 rounded bg-white overflow-hidden">
          <div className="grid grid-cols-12 gap-3 px-5 py-2 border-b border-border/60 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/30">
            <div className="col-span-3">Name</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Board</div>
            <div className="col-span-2">Appointed</div>
            <div className="col-span-1">Term</div>
            <div className="col-span-1">End</div>
            <div className="col-span-1">Status</div>
          </div>
          {CR.directors.map(d => (
            <div key={d.id} className="grid grid-cols-12 gap-3 items-center px-5 py-3 border-b border-border/40 last:border-0 text-sm">
              <div className="col-span-3 text-foreground font-medium truncate">{d.name}</div>
              <div className="col-span-2 text-muted-foreground truncate">{d.role}</div>
              <div className="col-span-2 text-muted-foreground truncate">{boardName(d.boardId)}</div>
              <div className="col-span-2 text-muted-foreground">{d.appointmentDate}</div>
              <div className="col-span-1 text-muted-foreground">{d.term}</div>
              <div className="col-span-1 text-muted-foreground">{d.end}</div>
              <div className="col-span-1">
                <Badge variant="outline" className={`text-xs h-5 px-1.5 ${STATUS_STYLE[d.status] ?? ''}`}>{d.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function OfficersTab() {
  if (CR.officers.length === 0) return <EmptyTab label="officer" />
  return (
    <div className="border border-border/60 rounded bg-white overflow-hidden">
      <div className="grid grid-cols-12 gap-3 px-5 py-2 border-b border-border/60 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/30">
        <div className="col-span-4">Name</div>
        <div className="col-span-4">Role</div>
        <div className="col-span-3">Appointed</div>
        <div className="col-span-1">Status</div>
      </div>
      {CR.officers.map(o => (
        <div key={o.id} className="grid grid-cols-12 gap-3 items-center px-5 py-3 border-b border-border/40 last:border-0 text-sm">
          <div className="col-span-4 text-foreground font-medium truncate">{o.name}</div>
          <div className="col-span-4 text-muted-foreground truncate">{o.role}</div>
          <div className="col-span-3 text-muted-foreground">{o.appointmentDate}</div>
          <div className="col-span-1">
            <Badge variant="outline" className={`text-xs h-5 px-1.5 ${STATUS_STYLE[o.status] ?? ''}`}>{o.status}</Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

function RelatedPartiesTab() {
  if (CR.relatedParties.length === 0) return <EmptyTab label="related party" />
  return (
    <div className="border border-border/60 rounded bg-white overflow-hidden">
      <div className="grid grid-cols-12 gap-3 px-5 py-2 border-b border-border/60 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/30">
        <div className="col-span-5">Party</div>
        <div className="col-span-4">Relationship</div>
        <div className="col-span-3">Last review</div>
      </div>
      {CR.relatedParties.map(p => (
        <div key={p.id} className="grid grid-cols-12 gap-3 items-center px-5 py-3 border-b border-border/40 last:border-0 text-sm">
          <div className="col-span-5 text-foreground font-medium truncate">{p.name}</div>
          <div className="col-span-4 text-muted-foreground truncate">{p.relationship}</div>
          <div className="col-span-3 text-muted-foreground">{p.lastReview}</div>
        </div>
      ))}
    </div>
  )
}

function DeedsTab() {
  if (CR.deeds.length === 0) return <EmptyTab label="deed" />
  return (
    <div className="border border-border/60 rounded bg-white overflow-hidden">
      <div className="grid grid-cols-12 gap-3 px-5 py-2 border-b border-border/60 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/30">
        <div className="col-span-5">Deed</div>
        <div className="col-span-4">Parties</div>
        <div className="col-span-2">Executed</div>
        <div className="col-span-1">Expires</div>
      </div>
      {CR.deeds.map(d => (
        <div key={d.id} className="grid grid-cols-12 gap-3 items-center px-5 py-3 border-b border-border/40 last:border-0 text-sm">
          <div className="col-span-5 text-foreground font-medium truncate">{d.name}</div>
          <div className="col-span-4 text-muted-foreground truncate">{d.parties}</div>
          <div className="col-span-2 text-muted-foreground">{d.executed}</div>
          <div className="col-span-1 text-muted-foreground">{d.expires}</div>
        </div>
      ))}
    </div>
  )
}

const SECTIONS = [
  { id: 'entities',  label: 'Entity Structure',  render: () => <EntitiesTab /> },
  { id: 'directors', label: 'Director Register', render: () => <DirectorsTab /> },
  { id: 'officers',  label: 'Officer Register',  render: () => <OfficersTab /> },
  { id: 'related',   label: 'Related Parties',   render: () => <RelatedPartiesTab /> },
  { id: 'deeds',     label: 'Deeds',             render: () => <DeedsTab /> },
]

export default function CompanyRegisterPage() {
  return (
    <div className="flex flex-1">
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <SubsectionRail items={SECTIONS} defaultId="directors" />
        </div>
      </div>
    </div>
  )
}
