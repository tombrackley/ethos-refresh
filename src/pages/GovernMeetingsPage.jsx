import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MeetingsTable } from '@/components/shared/MeetingsTable'
import tenant from '@/config/tenant'
import { cn } from '@/lib/utils'

const MEETINGS = tenant.pages.govern.meetings ?? []

const FILTERS = [
  { id: 'scheduled', label: 'Scheduled', test: m => m.status === 'Scheduled' || m.status === 'In Progress' },
  { id: 'passed',    label: 'Passed',    test: m => m.status === 'Completed' },
]

export default function GovernMeetingsPage() {
  const navigate = useNavigate()
  const [filterId, setFilterId] = useState('scheduled')
  const activeFilter = FILTERS.find(f => f.id === filterId) ?? FILTERS[0]

  return (
    <div className="flex flex-1">
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {FILTERS.map(f => {
                const active = filterId === f.id
                const count = MEETINGS.filter(f.test).length
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilterId(f.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 h-8 border transition-colors',
                      active
                        ? 'bg-[#dffff2] border-[rgba(14,95,91,0.5)]'
                        : 'bg-muted/60 hover:bg-muted border-transparent',
                    )}
                  >
                    <span className={cn(
                      'text-sm font-medium tracking-[-0.28px]',
                      active ? 'text-[#0e5f5b]' : 'text-foreground',
                    )}>
                      {f.label}
                    </span>
                    <span className={cn(
                      'text-xs',
                      active ? 'text-[rgba(14,95,91,0.5)]' : 'text-muted-foreground',
                    )}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Plus className="size-4" /> Schedule Meeting
            </Button>
          </div>

          <MeetingsTable
            boardId={null}
            filter={activeFilter.test}
            onRowClick={(m) => navigate(m.minutesDraft ? `/govern/meetings/${m.id}/minutes` : `/govern/meetings/${m.id}`)}
          />
        </div>
      </div>
    </div>
  )
}
