import { useNavigate, useParams } from 'react-router-dom'
import tenant from '@/config/tenant'
import { InsightDetail } from '@/pages/InsightsPage'

const BRIEFING = tenant.pages?.insights?.briefingItems ?? []

export default function InsightDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const insight = BRIEFING.find(item => item.id === id)

  if (!insight) {
    return (
      <div className="flex-1 overflow-auto bg-white">
        <div className="max-w-7xl mx-auto px-6 pt-[60px] pb-6">
          <button
            onClick={() => navigate('/insights')}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to insights
          </button>
          <p className="mt-8 text-sm text-muted-foreground">Insight not found.</p>
        </div>
      </div>
    )
  }

  return <InsightDetail insight={insight} onBack={() => navigate('/insights')} variant="v3" />
}
