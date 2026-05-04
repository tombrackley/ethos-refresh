import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Camera, Shield, Globe, Clock,
  KeyRound, Smartphone, CheckCircle2, Mail, Pencil,
} from 'lucide-react'

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
  bio: 'Experienced board director with expertise in corporate governance, risk management, and regulatory compliance across the health and wellness sector.',
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

const PROFILE_SECTIONS = [
  { key: 'personal', label: 'Personal Details' },
  { key: 'professional', label: 'Professional Details' },
  { key: 'regional', label: 'Regional Settings' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'security', label: 'Security' },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState('personal')
  const [profile, setProfile] = useState(INITIAL_PROFILE)
  const [notifications, setNotifications] = useState(NOTIFICATION_PREFS)
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  function updateField(field, value) {
    setProfile(p => ({ ...p, [field]: value }))
    setSaved(false)
  }

  function toggleNotification(id) {
    setNotifications(n => n.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item))
  }

  function handleSave() {
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Profile & Settings</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage your personal details and preferences</p>
          </div>
          {saved && (
            <span className="flex items-center gap-1 text-sm text-emerald-600">
              <CheckCircle2 className="size-4" /> Saved
            </span>
          )}
        </div>

        {/* Side nav + content */}
        <div className="flex gap-8">
          <nav className="w-[200px] shrink-0 space-y-0.5">
            {PROFILE_SECTIONS.map(section => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  activeSection === section.key
                    ? 'bg-muted font-medium text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>

          <div className="flex-1 min-w-0">
            {/* Personal Details */}
            {activeSection === 'personal' && (
              <div className="rounded-lg border border-border/60 bg-white p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-foreground">Personal Details</h2>
                  {editing ? (
                    <Button size="sm" className="text-xs h-7" onClick={handleSave}>Save</Button>
                  ) : (
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7" onClick={() => setEditing(true)}>Edit <Pencil className="size-3" /></Button>
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
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
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
                  <div className="py-2.5">
                    <p className="text-sm font-medium text-foreground">Bio</p>
                    {editing ? (
                      <textarea
                        value={profile.bio}
                        onChange={(e) => updateField('bio', e.target.value)}
                        rows={3}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring resize-none mt-1"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{profile.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Professional Details */}
            {activeSection === 'professional' && (
              <div className="rounded-lg border border-border/60 bg-white p-6 space-y-6">
                <h2 className="text-lg font-medium text-foreground">Professional Details</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Qualifications', value: profile.qualifications, desc: 'Professional qualifications' },
                    { label: 'Bar admission', value: profile.barAdmission, desc: 'Practising certificate or admission' },
                    { label: 'LinkedIn', value: profile.linkedIn, desc: 'Professional profile' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-border/60 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">Board Appointments</p>
                  {profile.boardAppointments.map((appt, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-border/60 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-foreground">{appt.board}</p>
                        <p className="text-xs text-muted-foreground">{appt.role}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">Since {appt.since}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regional Settings */}
            {activeSection === 'regional' && (
              <div className="rounded-lg border border-border/60 bg-white p-6 space-y-6">
                <h2 className="text-lg font-medium text-foreground">Regional Settings</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Jurisdiction', value: profile.jurisdiction, desc: 'Primary operating jurisdiction', icon: Globe },
                    { label: 'Timezone', value: profile.timezone, desc: 'Display timezone for dates and deadlines', icon: Clock },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-border/60 last:border-0">
                      <div className="flex items-center gap-3">
                        <item.icon className="size-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeSection === 'notifications' && (
              <div className="rounded-lg border border-border/60 bg-white p-6 space-y-6">
                <h2 className="text-lg font-medium text-foreground">Notification Preferences</h2>
                <div className="space-y-1">
                  {notifications.map((pref) => (
                    <div key={pref.id} className="flex items-center justify-between py-3 border-b border-border/60 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-foreground">{pref.label}</p>
                        <p className="text-xs text-muted-foreground">{pref.desc}</p>
                      </div>
                      <Switch checked={pref.enabled} onCheckedChange={() => toggleNotification(pref.id)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security */}
            {activeSection === 'security' && (
              <div className="rounded-lg border border-border/60 bg-white p-6 space-y-6">
                <h2 className="text-lg font-medium text-foreground">Security</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2.5 border-b border-border/60">
                    <div className="flex items-center gap-3">
                      <KeyRound className="size-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Password</p>
                        <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Change password</Button>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3">
                      <Smartphone className="size-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
                        <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">Enabled</Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
