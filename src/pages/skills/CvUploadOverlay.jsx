import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Upload, Sparkles, FileText } from 'lucide-react'

// Mock skills an AI pass would surface from an uploaded CV.
const CV_SUGGESTED = [
  'Contract Negotiation',
  'Stakeholder Management',
  'Financial Analysis',
  'Mergers & Acquisitions',
  'Project Management',
  'Regulatory Strategy',
]

export default function CvUploadOverlay({ onClose, onAddSkills }) {
  const [status, setStatus] = useState('idle') // idle | processing | done
  const [selected, setSelected] = useState(() => new Set())

  function analyse() {
    setStatus('processing')
    setTimeout(() => {
      setSelected(new Set(CV_SUGGESTED))
      setStatus('done')
    }, 1100)
  }

  function toggle(skill) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(skill)) next.delete(skill)
      else next.add(skill)
      return next
    })
  }

  function handleAdd() {
    onAddSkills([...selected])
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl border border-border shadow-xl w-full max-w-[560px] max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Upload your CV</h2>
            <p className="text-sm text-muted-foreground mt-0.5">We'll analyse it and pull out skills you can add to your matrix.</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {status === 'idle' && (
            <button
              onClick={analyse}
              className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/20 py-12 hover:bg-muted/40 hover:border-brand-300 transition-colors"
            >
              <span className="size-12 rounded-full bg-brand-50 flex items-center justify-center">
                <Upload className="size-5 text-brand-700" />
              </span>
              <span className="text-center">
                <span className="block text-sm font-medium text-foreground">Click to upload your CV</span>
                <span className="block text-sm text-muted-foreground mt-0.5">PDF or Word · up to 10MB</span>
              </span>
            </button>
          )}

          {status === 'processing' && (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <Sparkles className="size-6 text-brand-600 animate-pulse" />
              <p className="text-sm text-muted-foreground">Analysing your CV…</p>
            </div>
          )}

          {status === 'done' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2">
                <FileText className="size-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground flex-1 min-w-0 truncate">Tom_Brackley_CV.pdf</span>
                <span className="inline-flex items-center gap-1 text-sm text-emerald-700">
                  <Sparkles className="size-3.5" /> Analysed
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">
                  Skills found ({CV_SUGGESTED.length}) — select which to add:
                </p>
                <div className="space-y-1">
                  {CV_SUGGESTED.map(skill => (
                    <label key={skill} className="flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-muted/40 cursor-pointer transition-colors">
                      <Checkbox checked={selected.has(skill)} onCheckedChange={() => toggle(skill)} />
                      <span className="text-sm text-foreground">{skill}</span>
                    </label>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Added skills start in Emerging — drag them or use the card menu to set your level.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          {status === 'done' && (
            <Button size="sm" onClick={handleAdd} disabled={selected.size === 0}>
              Add {selected.size} {selected.size === 1 ? 'skill' : 'skills'}
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
