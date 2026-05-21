import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FOCUS_AREAS } from '@/pages/home/getStartedContent'
import { readFocusAreas, writeFocusAreas } from '@/lib/focusAreas'

export function FocusAreasModal({ open, onClose, onSave }) {
  const [selected, setSelected] = useState(() => readFocusAreas())

  if (!open) return null

  function toggle(value) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return next
    })
  }

  function save() {
    writeFocusAreas(selected)
    onSave?.([...selected])
    onClose?.()
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="focus-areas-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2 px-6 pt-5 pb-2">
          <div>
            <h2 id="focus-areas-title" className="text-base font-semibold text-foreground">
              Personalise your feed
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick the topics you want Ethos to surface first in Insights, Learn and briefings. Select any that apply.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mt-1 -mr-2 size-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="px-6 pt-3 pb-2">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {FOCUS_AREAS.map(opt => {
              const Icon = opt.icon
              const isOn = selected.has(opt.value)
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggle(opt.value)}
                  className={cn(
                    'flex items-start gap-2.5 rounded-xl border bg-white px-4 py-3 text-left text-sm font-medium text-foreground transition-colors',
                    isOn
                      ? 'border-[#77AFA6] bg-[#DFFFF2]'
                      : 'border-border hover:border-foreground/30 hover:bg-muted/40'
                  )}
                >
                  <Icon className="size-4 shrink-0 text-foreground/80 mt-0.5" />
                  <span>{opt.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-muted/30">
          <Button variant="outline" size="sm" onClick={onClose} className="h-9">
            Cancel
          </Button>
          <Button size="sm" onClick={save} className="h-9">
            Save preferences
          </Button>
        </div>
      </div>
    </div>
  )
}
