import { useNavigate } from 'react-router-dom'
import { MeetingsTable } from '@/components/shared/MeetingsTable'

export default function GovernMeetingsPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-1">
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <MeetingsTable
            boardId={null}
            onRowClick={(m) => navigate(m.minutesDraft ? `/govern/meetings/${m.id}/minutes` : `/govern/meetings/${m.id}`)}
          />
        </div>
      </div>
    </div>
  )
}
