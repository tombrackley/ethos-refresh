import { useLayoutEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const STORAGE_KEY = 'ethos_launch_tour_v1'

const STEPS = [
  {
    tourKey: 'spaces',
    title: 'Spaces',
    body: 'Spaces group the work you do in Ethos by focus area — Learn for CPD and knowledge, Comply for risk and obligations, Govern for boards and meetings. You\'ll unlock more spaces as your account is configured.',
  },
  {
    tourKey: 'core',
    title: 'Core',
    body: 'Core is where you shape Ethos\'s understanding of you and your organisation — your context, preferences, key documents and reference material. The more you set up here, the smarter every space gets.',
  },
  {
    tourKey: 'manage',
    title: 'Manage',
    body: 'Admins use Manage to configure the workspace — invite users, set permissions, connect integrations and tailor each space to how your team operates.',
  },
]

function wasDismissed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'done'
  } catch {
    return false
  }
}

function markDone() {
  try {
    localStorage.setItem(STORAGE_KEY, 'done')
  } catch { /* ignore */ }
}

export function LaunchTour({ onComplete }) {
  const [active, setActive] = useState(() => !wasDismissed())
  const [step, setStep] = useState(0)
  const [rect, setRect] = useState(null)

  const current = STEPS[step]

  useLayoutEffect(() => {
    if (!active) return
    function measure() {
      const target = document.querySelector(`[data-tour="${current.tourKey}"]`)
      if (target) setRect(target.getBoundingClientRect())
      else setRect(null)
    }
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    const interval = setInterval(measure, 250)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
      clearInterval(interval)
    }
  }, [active, current.tourKey])

  function finish() {
    markDone()
    setActive(false)
    onComplete?.()
  }

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1)
    else finish()
  }

  if (!active || !rect) return null

  const tooltipTop = Math.max(16, rect.top - 8)
  const tooltipLeft = rect.right + 16

  return (
    <>
      {/* Dim everything */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
        onClick={finish}
        aria-hidden="true"
      />

      {/* Highlight ring around target */}
      <div
        className="fixed z-50 rounded-md ring-2 ring-white/90 ring-offset-2 ring-offset-transparent pointer-events-none transition-all duration-200"
        style={{
          top: rect.top - 2,
          left: rect.left - 2,
          width: rect.width + 4,
          height: rect.height + 4,
        }}
      />

      {/* Tooltip card */}
      <div
        role="dialog"
        aria-labelledby="launch-tour-title"
        className="fixed z-50 w-[320px] rounded-lg bg-white p-5 shadow-xl border border-border"
        style={{ top: tooltipTop, left: tooltipLeft }}
      >
        <div className="flex items-center justify-between gap-2">
          <h3 id="launch-tour-title" className="text-sm font-semibold text-foreground">
            {current.title}
          </h3>
          <span className="text-xs text-muted-foreground tabular-nums">
            {step + 1} of {STEPS.length}
          </span>
        </div>
        <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
          {current.body}
        </p>
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={finish} className="h-8">
            Dismiss
          </Button>
          <Button size="sm" onClick={next} className="h-8 gap-1">
            {step < STEPS.length - 1 ? 'Next' : 'Done'}
            {step < STEPS.length - 1 && <ArrowRight className="size-3.5" />}
          </Button>
        </div>
      </div>
    </>
  )
}
