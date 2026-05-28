import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Camera, Check, Pencil, Lock } from 'lucide-react'
import { FOCUS_AREAS, LEARNING_GOALS } from '@/pages/home/getStartedContent'
import tenant from '@/config/tenant'
import {
  readCompleted,
  writeCompleted,
} from '@/lib/getStartedProgress'
import { readFocusProfile, writeFocusProfile } from '@/lib/focusProfile'
import SearchableChipPicker from '@/components/shared/SearchableChipPicker'
import { PROFILE_SECTIONS } from './profileSections'

// ─── Data ────────────────────────────────────────────────────────────────────

const INITIAL_PROFILE = {
  firstName: 'Tom',
  lastName: 'Bradley',
  email: 'tom@email.com',
  phone: '+61 412 345 678',
  jobTitle: 'Non-Executive Director',
  organisation: 'Blackmores Group Ltd',
  jurisdiction: 'Australia',
  timezone: 'AEST (UTC+10)',
  linkedIn: 'linkedin.com/in/tombradley',
  qualifications: 'GAICD, LLB (Hons), MBA',
  barAdmission: 'Admitted to the Supreme Court of NSW',
  boardAppointments: [
    { board: 'Main Board', role: 'Non-Executive Director', since: 'Jun 2025' },
    { board: 'Audit & Risk Committee', role: 'Member', since: 'Jul 2025' },
  ],
}

const NOTIFICATION_PREFS = [
  { id: 'handbook', label: 'Handbook updates', desc: 'When handbook content is updated or new sections added', enabled: true },
  { id: 'quiz', label: 'Quiz reminders', desc: 'Reminders to complete outstanding quizzes', enabled: true },
  { id: 'comments', label: 'Comments & mentions', desc: 'When someone mentions you or replies to your comments', enabled: true },
  { id: 'compliance', label: 'Compliance deadlines', desc: 'Upcoming compliance and governance deadlines', enabled: true },
  { id: 'board', label: 'Board meeting prep', desc: 'Pre-reading and meeting preparation reminders', enabled: false },
  { id: 'system', label: 'System announcements', desc: 'Platform updates and maintenance notices', enabled: false },
]

// Sections the Get Started "Set up your profile" task walks the user through.
// Save in any of these advances to the next; finishing the last clears the
// guided-mode URL param.
const GUIDED_SECTIONS = ['personal', 'focus-skills']

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedSection = searchParams.get('section')
  const fromGetStarted = searchParams.get('from') === 'get-started'
  const validSections = PROFILE_SECTIONS.map(s => s.key)
  const activeSection = validSections.includes(requestedSection) ? requestedSection : 'personal'
  const [profile, setProfile] = useState(INITIAL_PROFILE)
  const [notifications, setNotifications] = useState(NOTIFICATION_PREFS)
  const [editing, setEditing] = useState(fromGetStarted)
  const [saved, setSaved] = useState(false)

  // Sidebar-driven section changes should reset edit mode unless we're in the
  // guided flow (Get Started). Track which section we last saw editing applied to.
  const [editingForSection, setEditingForSection] = useState(activeSection)
  if (editingForSection !== activeSection) {
    setEditingForSection(activeSection)
    setEditing(fromGetStarted)
  }

  // Focus & Skills section state — persisted to localStorage, shared with
  // the Get Started widget's 'setup-profile' task and the Manage overlay
  // on the Skills Profile page.
  const [focusProfile, setFocusProfile] = useState(() => {
    const stored = readFocusProfile()
    return {
      focusAreas: new Set(stored.focusAreas ?? []),
      learningGoals: new Set(stored.learningGoals ?? []),
    }
  })

  // Mandatory skills are assigned by the organisation; shown read-only on
  // this page and managed on the Skills Profile.
  const assignedSkills = (tenant.pages.learn.skillsProfile?.skills || [])
    .filter(s => s.category === 'mandatory')

  function advanceGuided() {
    const idx = GUIDED_SECTIONS.indexOf(activeSection)
    const nextKey = GUIDED_SECTIONS[idx + 1]
    if (nextKey) {
      // Stay in guided mode (?from=get-started) for the next step.
      setSearchParams({ section: nextKey, from: 'get-started' }, { replace: true })
      setEditing(true)
    } else {
      // Guided flow finished — drop back to normal viewing mode.
      setSearchParams({ section: activeSection }, { replace: true })
      setEditing(false)
    }
  }

  function toggleFocusValue(field, value) {
    setFocusProfile(prev => {
      const next = new Set(prev[field])
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return { ...prev, [field]: next }
    })
  }

  function saveFocusProfile() {
    const payload = {
      focusAreas: [...focusProfile.focusAreas],
      learningGoals: [...focusProfile.learningGoals],
    }
    writeFocusProfile(payload)
    const hasAny = payload.focusAreas.length > 0 || payload.learningGoals.length > 0
    if (hasAny) {
      const next = new Set(readCompleted())
      next.add('setup-profile')
      writeCompleted(next)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    if (fromGetStarted) advanceGuided()
    else setEditing(false)
  }

  function updateField(field, value) {
    setProfile(p => ({ ...p, [field]: value }))
    setSaved(false)
  }

  function toggleNotification(id) {
    setNotifications(n => n.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item))
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    if (fromGetStarted) advanceGuided()
    else setEditing(false)
  }

  return (
    <div className="flex-1 overflow-auto bg-white px-16 py-6">
      <div className="max-w-3xl mx-auto space-y-6 pt-[52px]">
        <div className="flex-1 min-w-0">
            {/* Personal Details */}
            {activeSection === 'personal' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-foreground">Personal Details</h2>
                  {editing ? (
                    <Button size="sm" onClick={handleSave}>Save</Button>
                  ) : (
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => setEditing(true)}>Edit <Pencil className="size-3" /></Button>
                  )}
                </div>

                <div className="flex items-center gap-4 pb-4 border-b border-border/60">
                  <div className="relative">
                    <Avatar className="size-16">
                      <AvatarFallback className="bg-muted text-muted-foreground text-lg font-semibold">TB</AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 size-6 rounded-full bg-background border border-border flex items-center justify-center shadow-sm hover:bg-muted transition-colors">
                      <Camera className="size-3 text-muted-foreground" />
                    </button>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-foreground">{profile.firstName} {profile.lastName}</p>
                    <p className="text-sm text-muted-foreground">{profile.jobTitle} · {profile.organisation}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Full name', field: 'firstName', value: `${profile.firstName} ${profile.lastName}`, desc: 'Your display name' },
                    { label: 'Email address', field: 'email', value: profile.email, desc: 'Primary contact email' },
                    { label: 'Phone', field: 'phone', value: profile.phone, desc: 'Contact phone number' },
                    { label: 'Job title', field: 'jobTitle', value: profile.jobTitle, desc: 'Your current role' },
                    { label: 'Organisation', field: 'organisation', value: profile.organisation, desc: 'Your organisation', disabled: true },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-border/60">
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      {editing && !item.disabled ? (
                        <Input
                          value={profile[item.field]}
                          onChange={e => updateField(item.field, e.target.value)}
                          className="h-8 w-64 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">{item.value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Professional Details */}
            {activeSection === 'professional' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-foreground">Professional Details</h2>
                  {editing ? (
                    <Button size="sm" onClick={handleSave}>Save</Button>
                  ) : (
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => setEditing(true)}>Edit <Pencil className="size-3" /></Button>
                  )}
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Qualifications', field: 'qualifications', desc: 'Professional qualifications' },
                    { label: 'Bar admission', field: 'barAdmission', desc: 'Practising certificate or admission' },
                    { label: 'LinkedIn', field: 'linkedIn', desc: 'Professional profile' },
                    { label: 'Jurisdiction', field: 'jurisdiction', desc: 'Primary operating jurisdiction' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-border/60 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      {editing ? (
                        <Input
                          value={profile[item.field]}
                          onChange={e => updateField(item.field, e.target.value)}
                          className="h-8 w-64 text-sm"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">{profile[item.field]}</p>
                      )}
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">Board Appointments</p>
                    {editing && (
                      <Button variant="outline" size="sm" className="text-sm h-7" onClick={() => {
                        setProfile(p => ({
                          ...p,
                          boardAppointments: [...p.boardAppointments, { board: '', role: '', since: '' }],
                        }))
                      }}>Add appointment</Button>
                    )}
                  </div>
                  {profile.boardAppointments.map((appt, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-border/60 last:border-0 gap-3">
                      {editing ? (
                        <div className="grid grid-cols-3 gap-2 flex-1">
                          <Input
                            value={appt.board}
                            placeholder="Board"
                            onChange={(e) => setProfile(p => ({
                              ...p,
                              boardAppointments: p.boardAppointments.map((a, idx) => idx === i ? { ...a, board: e.target.value } : a),
                            }))}
                            className="h-8 text-sm"
                          />
                          <Input
                            value={appt.role}
                            placeholder="Role"
                            onChange={(e) => setProfile(p => ({
                              ...p,
                              boardAppointments: p.boardAppointments.map((a, idx) => idx === i ? { ...a, role: e.target.value } : a),
                            }))}
                            className="h-8 text-sm"
                          />
                          <Input
                            value={appt.since}
                            placeholder="Since"
                            onChange={(e) => setProfile(p => ({
                              ...p,
                              boardAppointments: p.boardAppointments.map((a, idx) => idx === i ? { ...a, since: e.target.value } : a),
                            }))}
                            className="h-8 text-sm"
                          />
                        </div>
                      ) : (
                        <>
                          <div>
                            <p className="text-sm font-medium text-foreground">{appt.board}</p>
                            <p className="text-sm text-muted-foreground">{appt.role}</p>
                          </div>
                          <span className="text-sm text-muted-foreground">Since {appt.since}</span>
                        </>
                      )}
                      {editing && (
                        <button
                          type="button"
                          aria-label="Remove appointment"
                          onClick={() => setProfile(p => ({
                            ...p,
                            boardAppointments: p.boardAppointments.filter((_, idx) => idx !== i),
                          }))}
                          className="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                        >
                          <X className="size-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Focus Areas & Learning Goals */}
            {activeSection === 'focus-skills' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-foreground">Focus Areas &amp; Learning Goals</h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Personalise what Ethos surfaces to you. Required skills are set by your organisation and shown for reference.
                    </p>
                  </div>
                  {editing ? (
                    <Button size="sm" onClick={saveFocusProfile}>Save</Button>
                  ) : (
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => setEditing(true)}>Edit <Pencil className="size-3" /></Button>
                  )}
                </div>

                {assignedSkills.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2">
                      <Lock className="size-3.5 text-muted-foreground" />
                      <h3 className="text-sm font-semibold text-foreground">Required skills</h3>
                      <span className="text-xs text-muted-foreground">{assignedSkills.length}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">Assigned by your organisation. Managed on your Skills Profile.</p>
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

                <section>
                  <h3 className="text-sm font-semibold text-foreground">Focus areas</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">Topics you want surfaced in your Insight feed and Event recommendations.</p>
                  <SearchableChipPicker
                    options={FOCUS_AREAS}
                    selected={focusProfile.focusAreas}
                    onAdd={(v) => toggleFocusValue('focusAreas', v)}
                    onRemove={(v) => toggleFocusValue('focusAreas', v)}
                    placeholder="Start typing to add a focus area"
                    editing={editing}
                  />
                </section>

                <section>
                  <h3 className="text-sm font-semibold text-foreground">Learning goals</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">Things you want to get out of Ethos this year.</p>
                  <SearchableChipPicker
                    options={LEARNING_GOALS}
                    selected={focusProfile.learningGoals}
                    onAdd={(v) => toggleFocusValue('learningGoals', v)}
                    onRemove={(v) => toggleFocusValue('learningGoals', v)}
                    placeholder="Start typing to add a learning goal"
                    editing={editing}
                  />
                </section>
              </div>
            )}


            {/* Notifications */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-foreground">Notification Preferences</h2>
                <div className="space-y-1">
                  {notifications.map((pref) => (
                    <div key={pref.id} className="flex items-center justify-between py-3 border-b border-border/60 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-foreground">{pref.label}</p>
                        <p className="text-sm text-muted-foreground">{pref.desc}</p>
                      </div>
                      <Switch checked={pref.enabled} onCheckedChange={() => toggleNotification(pref.id)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security */}
            {activeSection === 'security' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-foreground">Security</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2.5 border-b border-border/60">
                    <div>
                      <p className="text-sm font-medium text-foreground">Password</p>
                      <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                    </div>
                    <Button variant="outline" size="sm">Change password</Button>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Badge variant="outline" className="rounded-lg text-sm bg-emerald-50 text-emerald-700 border-emerald-200">Enabled</Badge>
                  </div>
                </div>
              </div>
            )}
          </div>

      </div>

      {saved && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 w-[360px] flex items-center gap-3 rounded-2xl border border-border bg-white pl-3 pr-2 py-2.5 shadow-md"
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-emerald-500 shrink-0">
            <Check className="size-4 text-white" strokeWidth={3} />
          </span>
          <span className="flex-1 text-sm font-medium text-foreground">Profile updated</span>
          <button
            type="button"
            onClick={() => setSaved(false)}
            aria-label="Dismiss"
            className="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}

