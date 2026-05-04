import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { MeetingsTable } from '@/components/shared/MeetingsTable'
import tenant from '@/config/tenant'

const BOARDS = tenant.pages.govern.boards ?? []
const BOARDS_COMMITTEES = tenant.pages.govern.boardsCommittees ?? []

const FILTER_BOARDS = [
  { id: null, name: 'All boards' },
  ...BOARDS.map(b => ({ id: b.id, name: b.name })),
  ...BOARDS_COMMITTEES.filter(b => !BOARDS.find(x => x.id === b.id)).map(b => ({ id: b.id, name: b.name })),
]

export default function GovernMeetingsPage() {
  const navigate = useNavigate()
  const [boardFilter, setBoardFilter] = useState(null)
  const activeLabel = FILTER_BOARDS.find(b => b.id === boardFilter)?.name ?? 'All boards'

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Meetings</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Scheduled and completed board, committee, and general meetings.
              </p>
            </div>
            <Button size="sm" className="gap-1.5">
              <Plus className="size-4" /> Schedule Meeting
            </Button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Filter className="size-3.5" />
                  {activeLabel}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {FILTER_BOARDS.map(b => (
                  <DropdownMenuItem key={b.id ?? 'all'} onClick={() => setBoardFilter(b.id)}>
                    {b.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <MeetingsTable
            boardId={boardFilter}
            onRowClick={(m) => navigate(m.minutesDraft ? `/govern/meetings/${m.id}/minutes` : `/govern/meetings/${m.id}`)}
          />

        </div>
      </div>
    </div>
  )
}
