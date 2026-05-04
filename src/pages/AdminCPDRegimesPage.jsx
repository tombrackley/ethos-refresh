import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, X, Check } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

// ─── Mock Data (shared with AdminCPDPage) ───────────────────────────────────

const CPD_TEAM = [
  { id: 1, name: 'Sarah Chen', initials: 'SC', role: 'Senior Lawyer' },
  { id: 2, name: 'James Harrington', initials: 'JH', role: 'General Counsel' },
  { id: 3, name: 'Priya Patel', initials: 'PP', role: 'Compliance Officer' },
  { id: 4, name: 'Michael Torres', initials: 'MT', role: 'Junior Lawyer' },
  { id: 5, name: 'Emily Watson', initials: 'EW', role: 'HR Manager' },
  { id: 6, name: 'David Kim', initials: 'DK', role: 'Finance Manager' },
  { id: 7, name: 'Rachel Adams', initials: 'RA', role: 'Company Secretary' },
  { id: 8, name: 'Tom Bradley', initials: 'TB', role: 'Board Member' },
  { id: 9, name: 'Aisha Mohammed', initials: 'AM', role: 'Senior Lawyer' },
  { id: 10, name: 'Liam O\'Brien', initials: 'LO', role: 'Junior Lawyer' },
]

const ALL_CPD_REGIMES = [
  { id: 'law-society-nsw', name: 'Law Society NSW', description: 'Mandatory CPD for NSW solicitors', period: 'Annual (Apr–Mar)', totalPoints: 10, categories: 4 },
  { id: 'aicd', name: 'AICD', description: 'Director professional development', period: 'Annual', totalPoints: 15, categories: 3 },
  { id: 'governance-institute', name: 'Governance Institute', description: 'Governance professionals CPD', period: 'Annual', totalPoints: 20, categories: 5 },
  { id: 'cpa-australia', name: 'CPA Australia', description: 'Accounting professionals CPD', period: 'Triennial', totalPoints: 120, categories: 6 },
]

const INITIAL_REGIME_ASSIGNMENTS = {
  'law-society-nsw': [1, 4, 9, 10],
  'aicd': [2, 7, 8],
  'governance-institute': [3, 7],
  'cpa-australia': [5, 6],
}

// ─── Overlays ───────────────────────────────────────────────────────────────

function RegimeDetailsOverlay({ regime, assignedCount, onClose }) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md h-full shadow-lg flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <h3 className="text-base font-medium text-foreground">{regime.name}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
        </div>
        <div className="flex-1 overflow-auto px-5 py-4 space-y-4">
          <p className="text-sm text-muted-foreground">{regime.description}</p>
          <div className="space-y-2">
            {[
              { label: 'Period', value: regime.period },
              { label: 'Total Points Required', value: `${regime.totalPoints} pts` },
              { label: 'Categories', value: regime.categories },
              { label: 'Assigned Members', value: assignedCount },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/60 last:border-0">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function RegimeManageOverlay({ regime, assignedIds, allMembers, onClose, onSave }) {
  const [selected, setSelected] = useState(new Set(assignedIds))

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md h-full shadow-lg flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <h3 className="text-base font-medium text-foreground">Assign: {regime.name}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
        </div>
        <div className="flex-1 overflow-auto">
          {allMembers.map(m => (
            <button
              key={m.id}
              onClick={() => toggle(m.id)}
              className="flex items-center gap-3 w-full px-5 py-3 hover:bg-muted/30 transition-colors border-b border-border/60 last:border-0"
            >
              <Avatar className="size-8">
                <AvatarFallback className="bg-muted text-muted-foreground text-xs">{m.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.role}</p>
              </div>
              {selected.has(m.id) && <Check className="size-4 text-emerald-600" />}
            </button>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-border/60">
          <Button className="w-full" onClick={() => onSave([...selected])}>Save ({selected.size} assigned)</Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function AdminCPDRegimesPage() {
  const [regimeAssignments, setRegimeAssignments] = useState(INITIAL_REGIME_ASSIGNMENTS)
  const [managingRegime, setManagingRegime] = useState(null)
  const [viewingRegime, setViewingRegime] = useState(null)

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">CPD Regimes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage which CPD regimes are available and assign them to team members</p>
        </div>

        <div className="border border-border/60 rounded-lg overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-xs font-medium text-muted-foreground pl-4">Regime</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Period</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Points Required</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Categories</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Assigned To</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground w-10 pr-4" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {ALL_CPD_REGIMES.map(regime => {
                const assignedIds = regimeAssignments[regime.id] || []
                const assignedMembers = CPD_TEAM.filter(m => assignedIds.includes(m.id))
                return (
                  <TableRow key={regime.id} className="hover:bg-muted/30">
                    <TableCell className="pl-4">
                      <div>
                        <p className="text-sm font-medium text-foreground leading-tight">{regime.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{regime.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{regime.period}</TableCell>
                    <TableCell className="text-sm font-medium">{regime.totalPoints}pts</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{regime.categories}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{assignedMembers.length}</TableCell>
                    <TableCell className="pr-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-7">
                            <MoreHorizontal className="size-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewingRegime(regime)}>View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setManagingRegime(regime)}>Manage Assignments</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {viewingRegime && (
        <RegimeDetailsOverlay regime={viewingRegime} assignedCount={(regimeAssignments[viewingRegime.id] || []).length} onClose={() => setViewingRegime(null)} />
      )}

      {managingRegime && (
        <RegimeManageOverlay
          regime={managingRegime}
          assignedIds={regimeAssignments[managingRegime.id] || []}
          allMembers={CPD_TEAM}
          onClose={() => setManagingRegime(null)}
          onSave={(ids) => {
            setRegimeAssignments(prev => ({ ...prev, [managingRegime.id]: ids }))
            setManagingRegime(null)
          }}
        />
      )}
    </>
  )
}
