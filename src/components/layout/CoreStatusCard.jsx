import { useNavigate } from 'react-router-dom'
import { IconAtom } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconAtom'
import { useSidebar } from '@/components/ui/sidebar'

const STATUS_PREFIX = 'STATUS:'

// `baseline` is the fresh/onboarding state — Core has no documents yet, so it
// sits at the first maturity stage (see Vault page STAGES: Baseline → Good →
// Excellent → Supercharged across 19 baseline documents).
const STATUS = {
  default: { value: 'EXCELLENT', valueClass: 'text-emerald-700', detail: '1,432 files synced' },
  baseline: { value: 'BASELINE', valueClass: 'text-amber-600', detail: '0 of 19 baseline documents' },
}

export function CoreStatusCard({ baseline = false }) {
  const navigate = useNavigate()
  const { state, toggleSidebar } = useSidebar()
  const collapsed = state === 'collapsed'
  const status = baseline ? STATUS.baseline : STATUS.default

  function handleClick() {
    if (collapsed) {
      toggleSidebar()
      return
    }
    navigate('/vault')
  }

  const shimmerIcon = (size) => (
    <span className={`relative inline-block ${size} shrink-0`} aria-hidden="true">
      <IconAtom className={`absolute inset-0 w-full h-full [&_path]:stroke-2 core-shimmer-base`} />
      <IconAtom className={`absolute inset-0 w-full h-full [&_path]:stroke-2 core-shimmer-flow`} />
    </span>
  )

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label="Core status"
        className="w-full flex items-center justify-center rounded-lg border border-border bg-white p-2 hover:shadow-sm transition-all"
      >
        {shimmerIcon('size-4')}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full text-left rounded-lg border border-border bg-white p-3 cursor-pointer hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-1.5">
        {shimmerIcon('size-3.5')}
        <span className="font-mono text-[11px] font-semibold tracking-wider truncate">
          <span className="text-muted-foreground">{STATUS_PREFIX}</span>{' '}
          <span className={status.valueClass}>{status.value}</span>
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground leading-snug">
        {status.detail}
      </p>
    </button>
  )
}
