import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { X, Lock } from 'lucide-react'
import SearchableChipPicker from '@/components/shared/SearchableChipPicker'
import { readFocusProfile, writeFocusProfile } from '@/lib/focusProfile'
import { SKILLS } from '@/pages/home/getStartedContent'
import tenant from '@/config/tenant'

// "Manage Skills" overlay launched from the Skills Profile page.
// Required skills are read-only (org-assigned). Additional skills are
// user-chosen extras the user wants to track for development. Persisted
// to the shared focus profile localStorage so it stays in sync with the
// Profile page.
//
// Focus areas (feed preferences) and Learning goals (aspirations) live
// on the Profile page — they're not skills and don't belong here.
export default function FocusSkillsOverlay({ onClose }) {
  const [profile, setProfile] = useState(() => {
    const stored = readFocusProfile()
    return {
      additionalSkills: new Set(stored.additionalSkills ?? []),
    }
  })
  const [saved, setSaved] = useState(false)

  const assignedSkills = (tenant.pages.learn.skillsProfile?.skills || [])
    .filter(s => s.category === 'mandatory')

  function toggle(field, value) {
    setProfile(prev => {
      const next = new Set(prev[field])
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return { ...prev, [field]: next }
    })
    setSaved(false)
  }

  function handleSave() {
    // Preserve other focus-profile keys (focusAreas, learningGoals owned
    // by the Profile page) — only overwrite additionalSkills here.
    const existing = readFocusProfile()
    writeFocusProfile({
      ...existing,
      additionalSkills: [...profile.additionalSkills],
    })
    setSaved(true)
    setTimeout(() => onClose(), 600)
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl border border-border shadow-xl w-full max-w-[640px] max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Manage Skills</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Required skills are set by your organisation. Add additional skills you want to track.
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Read-only: required skills */}
          {assignedSkills.length > 0 && (
            <section>
              <div className="flex items-center gap-2">
                <Lock className="size-3.5 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Required skills</h3>
                <span className="text-xs text-muted-foreground">{assignedSkills.length}</span>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">Assigned by your organisation.</p>
              <div className="mt-3 rounded-lg bg-muted/30 p-3">
                <div className="flex flex-wrap gap-2">
                  {assignedSkills.map(s => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/60 px-3 py-1 text-sm font-medium text-muted-foreground"
                    >
                      <Lock className="size-3 text-muted-foreground/70" />
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Editable: additional skills */}
          <section>
            <h3 className="text-sm font-semibold text-foreground">Additional skills</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">Skills you want to track for development beyond what your organisation requires.</p>
            <SearchableChipPicker
              options={SKILLS}
              selected={profile.additionalSkills}
              onAdd={(v) => toggle('additionalSkills', v)}
              onRemove={(v) => toggle('additionalSkills', v)}
              placeholder="Start typing to add a skill"
            />
          </section>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSave}>{saved ? 'Saved' : 'Save'}</Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
