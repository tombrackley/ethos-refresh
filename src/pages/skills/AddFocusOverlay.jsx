import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Search } from 'lucide-react'

const AVAILABLE_FOCUS_OPTIONS = [
  { label: 'Cyber Security Fundamentals', description: 'Understanding cyber threats, incident response, and organisational resilience.' },
  { label: 'Modern Slavery & Supply Chain', description: 'Due diligence frameworks and reporting obligations under the Modern Slavery Act.' },
  { label: 'Dispute Resolution & Mediation', description: 'Alternative dispute resolution strategies and mediation techniques.' },
  { label: 'Financial Crime & Fraud Prevention', description: 'Fraud detection, prevention strategies, and regulatory reporting.' },
  { label: 'Digital Transformation & Change', description: 'Leading and managing digital transformation initiatives.' },
  { label: 'Stakeholder Engagement', description: 'Building and managing relationships with key internal and external stakeholders.' },
]

export default function AddFocusOverlay({ currentLabels, onClose, onAdd }) {
  const [search, setSearch] = useState('')

  const available = AVAILABLE_FOCUS_OPTIONS.filter(
    opt => !currentLabels.includes(opt.label) &&
      (opt.label.toLowerCase().includes(search.toLowerCase()) ||
       opt.description.toLowerCase().includes(search.toLowerCase()))
  )

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl border border-border shadow-xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Add Focus Area</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Choose an area of interest to personalise your learning</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <div className="px-6 pt-4 pb-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search focus areas..."
              className="h-9 pl-9"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto px-6 py-3 space-y-2">
          {available.map(opt => (
            <button
              key={opt.label}
              onClick={() => onAdd(opt)}
              className="w-full text-left rounded-lg border border-border p-3.5 hover:bg-muted/30 transition-colors"
            >
              <p className="text-sm font-medium text-foreground">{opt.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
            </button>
          ))}

          {available.length === 0 && (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">
                {search ? `No areas matching "${search}"` : 'All available focus areas have been added'}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end px-6 py-4 border-t border-border shrink-0">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
