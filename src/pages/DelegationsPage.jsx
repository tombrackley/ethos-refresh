import { SubsectionRail } from '@/components/shared/SubsectionRail'
import { Badge } from '@/components/ui/badge'
import tenant from '@/config/tenant'

const REGISTER = tenant.pages.govern.delegations?.register ?? []
const MATRIX = tenant.pages.govern.delegations?.matrix ?? { roles: [], categories: [], cells: {} }

const STATUS_STYLE = {
  Active:           'border-emerald-200 bg-emerald-50 text-emerald-700',
  'Expiring Soon':  'border-amber-200 bg-amber-50 text-amber-700',
  Expired:          'border-destructive/30 bg-destructive/10 text-destructive',
}

function RegisterTable() {
  if (REGISTER.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center">
        <p className="text-sm text-muted-foreground">No delegations.</p>
      </div>
    )
  }
  return (
    <div className="border border-border/60 rounded bg-white overflow-hidden">
      <div className="grid grid-cols-12 gap-3 px-5 py-2 border-b border-border/60 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/30">
        <div className="col-span-3">Delegation</div>
        <div className="col-span-2">Delegate</div>
        <div className="col-span-3">Scope</div>
        <div className="col-span-2">Financial limit</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Expiry</div>
      </div>
      <div>
        {REGISTER.map(d => (
          <div key={d.id} className="grid grid-cols-12 gap-3 items-center px-5 py-3 border-b border-border/40 last:border-0 text-sm">
            <div className="col-span-3 text-foreground font-medium truncate">{d.delegation}</div>
            <div className="col-span-2 text-muted-foreground truncate">{d.delegate}</div>
            <div className="col-span-3 text-muted-foreground truncate">{d.scope}</div>
            <div className="col-span-2 text-foreground truncate">{d.financialLimit}</div>
            <div className="col-span-1">
              <Badge variant="outline" className={`text-xs h-5 px-1.5 ${STATUS_STYLE[d.status] ?? ''}`}>{d.status}</Badge>
            </div>
            <div className="col-span-1 text-muted-foreground">{d.expiry}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ApprovalMatrix() {
  if (MATRIX.roles.length === 0 || MATRIX.categories.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center">
        <p className="text-sm text-muted-foreground">No approval matrix configured.</p>
      </div>
    )
  }
  return (
    <div className="border border-border/60 rounded bg-white overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/30 border-b border-border/60">
            <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
            {MATRIX.categories.map(c => (
              <th key={c} className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MATRIX.roles.map(role => (
            <tr key={role} className="border-b border-border/40 last:border-0">
              <td className="px-5 py-3 font-medium text-foreground">{role}</td>
              {MATRIX.categories.map(cat => (
                <td key={cat} className="px-5 py-3 text-foreground">
                  {MATRIX.cells[`${role}|${cat}`] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const SECTIONS = [
  { id: 'register', label: 'Register',        render: () => <RegisterTable /> },
  { id: 'matrix',   label: 'Approval matrix', render: () => <ApprovalMatrix /> },
]

export default function DelegationsPage() {
  return (
    <div className="flex flex-1">
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <SubsectionRail items={SECTIONS} />
        </div>
      </div>
    </div>
  )
}
