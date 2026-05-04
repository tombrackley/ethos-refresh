import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet'
import tenant from '@/config/tenant'

const SKILLS_PROFILE = tenant.pages.learn.skillsProfile

export default function ScoreBreakdownSheet({ open, onOpenChange }) {
  const breakdown = SKILLS_PROFILE.scoreBreakdown
  if (!breakdown) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-auto">
        <SheetHeader>
          <SheetTitle>How is your score calculated?</SheetTitle>
          <SheetDescription>
            Your overall proficiency score is a weighted average of multiple signal streams.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-6 space-y-6">
          <div className="space-y-4">
            {breakdown.map(stream => (
              <div key={stream.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{stream.label}</span>
                  <span className="text-xs text-muted-foreground">{stream.weight > 0 ? `${stream.weight}% weight` : 'Calibration only'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Progress value={stream.score} className="h-2" />
                  </div>
                  <span className="text-sm font-medium text-foreground w-8 text-right">{stream.score}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-muted/50 px-3 py-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Scenario-based assessments carry the highest weight (40%) as they measure applied judgement. Self-assessment is used for calibration only and does not contribute to the weighted score.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
