import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  BookOpen, Shield, TrendingUp, AlertTriangle, CheckCircle2, Award,
} from 'lucide-react'
import tenant from '@/config/tenant'

const SKILLS_PROFILE = tenant.pages.learn.skillsProfile
const SKILLS_GAPS = tenant.pages.learn.skillsGaps

const IMPORTANCE_VARIANT = {
  Critical: 'importance-critical',
  High: 'importance-high',
  Medium: 'importance-medium',
}

export default function ThreeQuestionsRow({ onCloseGap }) {
  const skills = SKILLS_PROFILE.skills
  const gapSkills = skills.filter(s => s.status === 'Gap')
  const compliance = SKILLS_PROFILE.complianceStatus
  const metCount = skills.filter(s => s.status === 'Proficient').length
  const certificates = SKILLS_PROFILE.certificates || []
  const milestones = SKILLS_PROFILE.milestones || []
  const latestMilestone = milestones[0]

  const getImportance = (label) => {
    const gap = SKILLS_GAPS?.find(g => g.skill === label)
    return gap?.importance || 'Medium'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* What do I need to learn? */}
      <div className="rounded-lg border border-border bg-white p-5 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="size-4 text-amber-500" />
          <p className="text-sm font-medium text-foreground">What do I need to learn?</p>
        </div>
        {gapSkills.length > 0 ? (
          <div className="space-y-2.5">
            {gapSkills.slice(0, 3).map(skill => {
              const importance = getImportance(skill.label)
              return (
                <div key={skill.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <AlertTriangle className="size-3.5 text-amber-500 shrink-0" />
                    <span className="text-sm text-foreground truncate">{skill.label}</span>
                  </div>
                  <Badge variant={IMPORTANCE_VARIANT[importance]} className="shrink-0">{importance}</Badge>
                </div>
              )
            })}
            {gapSkills.length > 0 && (
              <Button variant="outline" size="sm" className="w-full gap-1.5 mt-1" onClick={() => onCloseGap(gapSkills[0].id)}>
                <TrendingUp className="size-3.5" /> Close Top Gap
              </Button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-emerald-700">
            <CheckCircle2 className="size-4" />
            <span>All skills at or above target</span>
          </div>
        )}
      </div>

      {/* Am I compliant? */}
      <div className="rounded-lg border border-border bg-white p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="size-4 text-brand-600" />
          <p className="text-sm font-medium text-foreground">Am I compliant?</p>
        </div>
        {compliance ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Mandatory skills</span>
              <span className="text-sm font-medium text-foreground">{compliance.mandatoryMet}/{compliance.mandatoryTotal} met</span>
            </div>
            {compliance.regimeSummary.map(r => (
              <div key={r.regime} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{r.regime}</span>
                <Badge variant={r.status === 'On Track' ? 'skill-proficient' : r.status === 'At Risk' ? 'skill-gap' : 'skill-developing'}>
                  {r.status}
                </Badge>
              </div>
            ))}
            {compliance.nextDeadline && (
              <p className="text-xs text-muted-foreground">Next deadline: {compliance.nextDeadline}</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No compliance data available</p>
        )}
      </div>

      {/* Am I progressing? */}
      <div className="rounded-lg border border-border bg-white p-5 space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-emerald-600" />
          <p className="text-sm font-medium text-foreground">Am I progressing?</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overall score</span>
            <span className="text-sm font-medium text-foreground">{SKILLS_PROFILE.overallScore}/100</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Skills proficient</span>
            <span className="text-sm font-medium text-foreground">{metCount}/{skills.length}</span>
          </div>
          {certificates.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Certificates</span>
              <span className="text-sm font-medium text-foreground flex items-center gap-1"><Award className="size-3.5 text-brand-600" /> {certificates.length}</span>
            </div>
          )}
          {latestMilestone && (
            <div className="rounded-md bg-muted/50 px-3 py-2">
              <p className="text-xs text-muted-foreground">Latest: <span className="text-foreground font-medium">{latestMilestone.event}</span></p>
              <p className="text-xs text-muted-foreground">{latestMilestone.date}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
