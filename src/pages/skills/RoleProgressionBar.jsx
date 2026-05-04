import { Progress } from '@/components/ui/progress'
import { TrendingUp } from 'lucide-react'
import tenant from '@/config/tenant'

const SKILLS_PROFILE = tenant.pages.learn.skillsProfile

export default function RoleProgressionBar() {
  const rp = SKILLS_PROFILE.roleProgression
  if (!rp) return null

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-white px-4 py-3">
      <div className="flex items-center gap-2 shrink-0">
        <TrendingUp className="size-4 text-brand-600" />
        <span className="text-sm text-foreground">
          On track toward <span className="font-semibold">{rp.targetRole}</span>
        </span>
      </div>
      <div className="flex-1 flex items-center gap-3">
        <Progress value={rp.progress} className="h-2 flex-1" />
        <span className="text-xs font-medium text-muted-foreground shrink-0">{rp.progress}%</span>
      </div>
      <span className="text-xs text-muted-foreground shrink-0">
        {rp.metSkills.length}/{rp.requiredSkills.length} skills met
      </span>
    </div>
  )
}
