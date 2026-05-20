import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconX } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconX'
import { IconShieldCheck3 } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconShieldCheck3'
import { IconLaw } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconLaw'
import { IconTasks } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconTasks'
import { IconGraduateCap } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconGraduateCap'
import { IconLightbulbGlow } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconLightbulbGlow'
import { IconTrending1 } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconTrending1'
import { IconHeartBeat } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconHeartBeat'
import { IconGovernment } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconGovernment'
import { IconHandshake } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconHandshake'
import { IconLightningBolt } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconLightningBolt'
import { IconShoppingBag1 } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconShoppingBag1'
import { IconChip } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconChip'
import { IconDotGrid1x3Horizontal } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconDotGrid1x3Horizontal'
import { IconGlobe } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconGlobe'
import { IconDirectorChair } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconDirectorChair'
import { IconUserSettings } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconUserSettings'
import { IconUserGroup } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconUserGroup'
import { IconBoard } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconBoard'
import { IconSettingsGear1 } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconSettingsGear1'
import { IconUser } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconUser'
import { IconRadar } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconRadar'
import { IconCircleCheck } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconCircleCheck'
import { IconCircleMinus } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconCircleMinus'
import { IconCircleDashed } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconCircleDashed'
import { IconSparkleCentral } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconSparkleCentral'
import { IconLock } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconLock'
import { IconTree } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconTree'
import { IconFolders } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconFolders'
import { IconLayersThree } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconLayersThree'
import { IconMicrosoftCopilot } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconMicrosoftCopilot'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import tenant from '@/config/tenant'

const ACCOUNT_TYPES = [
  { value: 'individual',   label: 'Individual',                description: "I'm setting Ethos up just for me.",                  icon: IconUser,      iconBg: 'bg-blue-200',    iconColor: 'text-blue-900' },
  { value: 'organisation', label: 'Organisation',              description: "I'm setting Ethos up for my team, firm, or company.", icon: IconUserGroup, iconBg: 'bg-violet-200',  iconColor: 'text-violet-900' },
]

// Vertical packs aligned with the Ethos Questions Tree (C3).
const INDUSTRIES = [
  { value: 'apra',         label: 'APRA-regulated',     description: 'Insurance, super, banking',                        icon: IconShieldCheck3 },
  { value: 'listed',       label: 'Listed company',     description: 'ASX-regulated',                                     icon: IconTrending1 },
  { value: 'profserv',     label: 'Law firm / profserv',description: 'Professional services',                             icon: IconLaw },
  { value: 'finsvc',       label: 'Financial services', description: 'AFSL, AML/CTF, payments',                           icon: IconChip },
  { value: 'healthcare',   label: 'Healthcare',         description: 'Medical, clinical, allied health',                  icon: IconHeartBeat },
  { value: 'industrial',   label: 'Industrial',         description: 'Manufacturing, supply chain, resources',            icon: IconLightningBolt },
  { value: 'nfp',          label: 'Not-for-profit',     description: 'Charity, community, NGO',                           icon: IconHandshake },
  { value: 'education',    label: 'Education',          description: 'University, school, training provider',             icon: IconGraduateCap },
  { value: 'government',   label: 'Government',         description: 'Public sector, agency, statutory body',             icon: IconGovernment },
  { value: 'other',        label: 'Other / not sure',   description: 'Cross-cutting',                                     icon: IconDotGrid1x3Horizontal },
]

const LOCATIONS = [
  { value: 'au', label: 'Australia',      flag: 'au' },
  { value: 'nz', label: 'New Zealand',    flag: 'nz' },
  { value: 'uk', label: 'United Kingdom', flag: 'gb' },
  { value: 'us', label: 'United States',  flag: 'us' },
  { value: 'ca', label: 'Canada',         flag: 'ca' },
  { value: 'eu', label: 'Europe',         flag: 'eu' },
  { value: 'apac', label: 'Asia-Pacific' },
  { value: 'other', label: 'Other' },
]

// C4 — the single biggest challenge anchor. Maps to a primary space.
const CHALLENGES = [
  { value: 'govern',   label: 'Governance operations',   description: 'Managing boards, meetings, policies, and governance paperwork.',         icon: IconLaw,           iconBg: 'bg-violet-200',  iconColor: 'text-violet-900' },
  { value: 'comply',   label: 'Regulatory monitoring',   description: 'Staying on top of regulatory changes and obligations across my sector.', icon: IconShieldCheck3,  iconBg: 'bg-blue-200',    iconColor: 'text-blue-900' },
  { value: 'work',     label: 'Legal work',              description: 'Managing legal matters, contracts, or document review.',                  icon: IconTasks,         iconBg: 'bg-amber-200',   iconColor: 'text-amber-900' },
  { value: 'learn',    label: 'Learning & CPD',          description: 'Professional development, CPD compliance, and team capability tracking.', icon: IconGraduateCap,   iconBg: 'bg-emerald-200', iconColor: 'text-emerald-900' },
  { value: 'insights', label: 'Leadership visibility',   description: 'Getting cross-team visibility, daily briefings, and a single source of signal.', icon: IconLightbulbGlow, iconBg: 'bg-rose-200', iconColor: 'text-rose-900' },
]

const COMPANY_SIZES = [
  { value: '1-10',    label: '1–10' },
  { value: '11-50',   label: '11–50' },
  { value: '51-200',  label: '51–200' },
  { value: '201-500', label: '201–500' },
  { value: '501-1k',  label: '501–1,000' },
  { value: '1k+',     label: '1,000+' },
]

// C2 — tech area selector. Routes which spaces and CPD regimes load.
const ROLES = [
  { value: 'legal',       label: 'Legal',       description: 'Lawyer, GC, in-house counsel, legal ops',            icon: IconLaw,           iconBg: 'bg-amber-200',   iconColor: 'text-amber-900' },
  { value: 'governance',  label: 'Governance',  description: 'Director, CoSec, board secretary, governance pro',   icon: IconDirectorChair, iconBg: 'bg-violet-200',  iconColor: 'text-violet-900' },
  { value: 'risk',        label: 'Risk',        description: 'Risk manager, CRO, enterprise or operational risk',  icon: IconRadar,         iconBg: 'bg-rose-200',    iconColor: 'text-rose-900' },
  { value: 'compliance',  label: 'Compliance',  description: 'Compliance officer, AML, regulatory affairs',        icon: IconShieldCheck3,  iconBg: 'bg-blue-200',    iconColor: 'text-blue-900' },
  { value: 'executive',   label: 'Executive',   description: 'CEO, MD, founder, practice principal, SME owner',    icon: IconUserSettings,  iconBg: 'bg-emerald-200', iconColor: 'text-emerald-900' },
  { value: 'other',       label: 'Other',       description: 'Multi-disciplinary or doesn’t quite fit',         icon: IconDotGrid1x3Horizontal, iconBg: 'bg-slate-200', iconColor: 'text-slate-900' },
]

// M1 — board involvement (drives Govern config + ASIC integration).
const BOARDS = [
  { value: 'yes_aus',  label: 'Yes — in Australia',     description: 'Triggers ASIC integration and an Australian governance map.',  icon: IconGovernment,  iconBg: 'bg-emerald-200', iconColor: 'text-emerald-900' },
  { value: 'yes_intl', label: 'Yes — internationally',  description: 'Multi-jurisdiction support with a world board map.',           icon: IconGlobe,       iconBg: 'bg-blue-200',    iconColor: 'text-blue-900' },
  { value: 'no',       label: 'No / not applicable',    description: 'We’ll minimise Govern in your workspace.',                icon: IconCircleMinus, iconBg: 'bg-slate-200',   iconColor: 'text-slate-900' },
]

// M2 — focus areas (filters Insights & Learn).
const FOCUS_AREAS = [
  { value: 'ai_gov',         label: 'AI governance',          icon: IconSparkleCentral },
  { value: 'cyber',          label: 'Cybersecurity',          icon: IconLock },
  { value: 'esg',            label: 'ESG & sustainability',   icon: IconTree },
  { value: 'risk_compliance',label: 'Risk & compliance',      icon: IconRadar },
  { value: 'cpd',            label: 'CPD & skills',           icon: IconGraduateCap },
  { value: 'transactions',   label: 'M&A / transactions',     icon: IconTrending1 },
]

// M4 — AI policy readiness.
const AI_POLICIES = [
  { value: 'yes',         label: 'Yes, we have AI policies',     description: "We'll align Ethos with your existing AI governance.",       icon: IconCircleCheck,  iconBg: 'bg-emerald-200', iconColor: 'text-emerald-900' },
  { value: 'in_progress', label: "We're exploring it",           description: "We'll lead with AI governance content + policy templates.", icon: IconCircleDashed, iconBg: 'bg-amber-200',   iconColor: 'text-amber-900' },
  { value: 'no',          label: 'No / unsure',                  description: 'Trust Centre + human-in-the-loop framing surfaced first.',  icon: IconCircleMinus,  iconBg: 'bg-slate-200',   iconColor: 'text-slate-900' },
]

// M5 — existing tools to integrate (multi-select).
const INTEGRATIONS = [
  { value: 'm365',         label: 'Microsoft 365',         icon: IconMicrosoftCopilot },
  { value: 'dms',          label: 'Document management',   icon: IconFolders },
  { value: 'board_portal', label: 'Board portal',          icon: IconBoard },
  { value: 'practice_mgmt',label: 'Practice management',   icon: IconLayersThree },
  { value: 'none',         label: 'None for now',          icon: IconCircleMinus },
]

// Flow step keys. C1 answer determines which flow is active.
// Individual: Critical only.
// Organisation: Critical + Mid-level (boards, focus areas, AI policy, integrations).
const FLOW_INDIVIDUAL = ['nameEmail', 'accountType', 'role', 'industry', 'countries', 'challenge', 'thanks']
const FLOW_ORG        = ['nameEmail', 'accountType', 'company', 'role', 'industry', 'countries', 'challenge', 'boards', 'focusAreas', 'aiPolicy', 'integrations', 'thanks']

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    name: '',
    email: '',
    accountType: '',
    companyName: '',
    companySize: '',
    role: '',
    industry: '',
    locations: [],
    challenge: '',
    // Mid-level (Organisation flow only)
    boards: '',
    focusAreas: [],
    aiPolicy: '',
    integrations: [],
  })

  // Active flow depends on C1 (account type). Default to org until the user
  // picks, so progress dots show the longer flow on first paint.
  const flow = data.accountType === 'individual' ? FLOW_INDIVIDUAL : FLOW_ORG
  const stepKey = flow[step] ?? 'thanks'
  const questionStepCount = flow.length - 1 // exclude final 'thanks'

  function next() {
    setStep(s => Math.min(s + 1, flow.length - 1))
  }
  function back() {
    setStep(s => Math.max(s - 1, 0))
  }
  function update(k, v) {
    setData(d => ({ ...d, [k]: v }))
  }
  function pickAndAdvance(k, v) {
    update(k, v)
    next()
  }
  function toggleLocation(v) {
    setData(d => {
      const set = new Set(d.locations)
      if (set.has(v)) set.delete(v)
      else set.add(v)
      return { ...d, locations: [...set] }
    })
  }
  function toggleMulti(key, v) {
    setData(d => {
      const set = new Set(d[key])
      if (set.has(v)) set.delete(v)
      else set.add(v)
      return { ...d, [key]: [...set] }
    })
  }

  const canContinueStep0 = data.name.trim() && /\S+@\S+\.\S+/.test(data.email)
  const showDots = stepKey !== 'thanks'

  return (
    <div className="flex h-screen w-full flex-col bg-white">
      {/* Top bar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
        <img src={tenant.logo} alt={tenant.appName} className="h-7 w-auto rounded-sm" />
        <button
          type="button"
          aria-label="Close onboarding"
          onClick={() => navigate('/')}
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <IconX className="size-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-12 flex items-center justify-center">
        <div className="w-full max-w-3xl">
          {stepKey === 'nameEmail' && (
            <div className="mx-auto max-w-[600px]">
              <Step heading="Help us personalize your experience">
                <div className="flex flex-col gap-5">
                  <Field label="What's your name?">
                    <Input
                      value={data.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="Jane Doe"
                      className="h-11 rounded-lg"
                    />
                  </Field>
                  <Field label="What's your work email?">
                    <Input
                      type="email"
                      value={data.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="jane@company.com"
                      className="h-11 rounded-lg"
                    />
                  </Field>
                </div>
                <NavRow onNext={next} nextDisabled={!canContinueStep0} />
              </Step>
            </div>
          )}

          {stepKey === 'accountType' && (
            <Step heading="Are you joining as an individual, or setting Ethos up for your whole organisation?">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {ACCOUNT_TYPES.map(opt => (
                  <LargeOptionCard
                    key={opt.value}
                    icon={opt.icon}
                    iconBg={opt.iconBg}
                    iconColor={opt.iconColor}
                    label={opt.label}
                    description={opt.description}
                    selected={data.accountType === opt.value}
                    onClick={() => pickAndAdvance('accountType', opt.value)}
                  />
                ))}
              </div>
              <NavRow onBack={back} onSkip={next} />
            </Step>
          )}

          {stepKey === 'company' && (
            <div className="mx-auto max-w-[600px]">
              <Step heading="Tell us about your organisation">
                <div className="flex flex-col gap-5">
                  <Field label="Company name">
                    <Input
                      value={data.companyName}
                      onChange={(e) => update('companyName', e.target.value)}
                      placeholder="Acme Co."
                      className="h-11 rounded-lg"
                    />
                  </Field>
                  <div>
                    <span className="mb-2 block text-sm font-medium text-foreground">Company size</span>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {COMPANY_SIZES.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => update('companySize', opt.value)}
                          className={cn(
                            'rounded-xl border bg-white px-4 py-3 text-left text-sm font-medium text-foreground transition-colors',
                            data.companySize === opt.value
                              ? 'border-[#77AFA6] bg-[#DFFFF2]'
                              : 'border-border hover:border-foreground/30 hover:bg-muted/40'
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <NavRow onBack={back} onSkip={next} onNext={next} nextLabel="Continue" />
              </Step>
            </div>
          )}

          {stepKey === 'role' && (
            <Step heading="What best describes your professional role?">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {ROLES.map(opt => (
                  <LargeOptionCard
                    key={opt.value}
                    icon={opt.icon}
                    iconBg={opt.iconBg}
                    iconColor={opt.iconColor}
                    label={opt.label}
                    description={opt.description}
                    selected={data.role === opt.value}
                    onClick={() => pickAndAdvance('role', opt.value)}
                  />
                ))}
              </div>
              <NavRow onBack={back} onSkip={next} />
            </Step>
          )}

          {stepKey === 'industry' && (
            <Step heading="What industry or sector are you in?">
              <CardGrid>
                {INDUSTRIES.map(opt => (
                  <OptionCard
                    key={opt.value}
                    icon={opt.icon}
                    label={opt.label}
                    selected={data.industry === opt.value}
                    onClick={() => pickAndAdvance('industry', opt.value)}
                  />
                ))}
              </CardGrid>
              <NavRow onBack={back} onSkip={next} />
            </Step>
          )}

          {stepKey === 'countries' && (
            <Step
              heading={data.accountType === 'individual' ? 'Where do you practise?' : 'Countries you operate within'}
              subheading="Select all that apply"
            >
              <CardGrid>
                {LOCATIONS.map(opt => (
                  <OptionCard
                    key={opt.value}
                    leading={
                      opt.flag
                        ? <span className={`fi fi-${opt.flag} shrink-0 !w-5 !h-3.5 rounded-sm`} />
                        : <IconGlobe className="size-4 shrink-0 text-foreground/80" />
                    }
                    label={opt.label}
                    selected={data.locations.includes(opt.value)}
                    onClick={() => toggleLocation(opt.value)}
                  />
                ))}
              </CardGrid>
              <NavRow onBack={back} onSkip={next} onNext={next} nextLabel="Continue" />
            </Step>
          )}

          {stepKey === 'challenge' && (
            <Step heading="What's the single biggest challenge you're hoping Ethos helps with right now?">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {CHALLENGES.map(opt => (
                  <LargeOptionCard
                    key={opt.value}
                    icon={opt.icon}
                    iconBg={opt.iconBg}
                    iconColor={opt.iconColor}
                    label={opt.label}
                    description={opt.description}
                    selected={data.challenge === opt.value}
                    onClick={() => pickAndAdvance('challenge', opt.value)}
                  />
                ))}
              </div>
              <NavRow onBack={back} onSkip={next} />
            </Step>
          )}

          {stepKey === 'boards' && (
            <Step heading="Do you have a board, or sit on any boards?">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {BOARDS.map(opt => (
                  <LargeOptionCard
                    key={opt.value}
                    icon={opt.icon}
                    iconBg={opt.iconBg}
                    iconColor={opt.iconColor}
                    label={opt.label}
                    description={opt.description}
                    selected={data.boards === opt.value}
                    onClick={() => pickAndAdvance('boards', opt.value)}
                  />
                ))}
              </div>
              <NavRow onBack={back} onSkip={next} />
            </Step>
          )}

          {stepKey === 'focusAreas' && (
            <Step heading="What are your key focus areas?" subheading="Select all that apply">
              <CardGrid>
                {FOCUS_AREAS.map(opt => (
                  <OptionCard
                    key={opt.value}
                    icon={opt.icon}
                    label={opt.label}
                    selected={data.focusAreas.includes(opt.value)}
                    onClick={() => toggleMulti('focusAreas', opt.value)}
                  />
                ))}
              </CardGrid>
              <NavRow onBack={back} onSkip={next} onNext={next} nextLabel="Continue" />
            </Step>
          )}

          {stepKey === 'aiPolicy' && (
            <Step heading="Are AI tools permitted in your organisation?">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {AI_POLICIES.map(opt => (
                  <LargeOptionCard
                    key={opt.value}
                    icon={opt.icon}
                    iconBg={opt.iconBg}
                    iconColor={opt.iconColor}
                    label={opt.label}
                    description={opt.description}
                    selected={data.aiPolicy === opt.value}
                    onClick={() => pickAndAdvance('aiPolicy', opt.value)}
                  />
                ))}
              </div>
              <NavRow onBack={back} onSkip={next} />
            </Step>
          )}

          {stepKey === 'integrations' && (
            <Step heading="Any existing tools you'd want Ethos to connect with?" subheading="Select all that apply">
              <CardGrid>
                {INTEGRATIONS.map(opt => (
                  <OptionCard
                    key={opt.value}
                    icon={opt.icon}
                    label={opt.label}
                    selected={data.integrations.includes(opt.value)}
                    onClick={() => toggleMulti('integrations', opt.value)}
                  />
                ))}
              </CardGrid>
              <NavRow onBack={back} onSkip={next} onNext={next} nextLabel="Continue" />
            </Step>
          )}

          {stepKey === 'thanks' && (
            <div className="mx-auto max-w-[600px]">
              <Step heading={`Thanks${data.name ? `, ${data.name.split(' ')[0]}` : ''}.`}>
                <p className="text-base text-foreground/70 leading-relaxed">
                  We've received your details. The Ethika team will be in touch shortly to set up your
                  account and walk you through the platform.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button onClick={() => navigate('/')} className="h-10 px-5">
                    Back to start
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      sessionStorage.setItem('ethos_auth', JSON.stringify({ mode: 'user', demo: 'launch' }))
                      window.location.href = '/home'
                    }}
                    className="h-10 px-5"
                  >
                    View launch dashboard
                  </Button>
                </div>
              </Step>
            </div>
          )}
        </div>
      </div>

      {/* Footer: progress dots */}
      {showDots && (
        <div className="shrink-0 px-6 pb-8 flex justify-center">
          <ProgressDots count={questionStepCount} active={step} />
        </div>
      )}
    </div>
  )
}

function NavRow({ onBack, onSkip, onNext, nextLabel = 'Next', nextDisabled }) {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      {onBack && (
        <Button variant="outline" onClick={onBack} className="h-10 px-5">Back</Button>
      )}
      {onSkip && (
        <Button variant="outline" onClick={onSkip} className="h-10 px-5">Skip</Button>
      )}
      {onNext && (
        <Button onClick={onNext} disabled={nextDisabled} className="h-10 px-5">
          {nextLabel}
        </Button>
      )}
    </div>
  )
}

function Step({ heading, subheading, children }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-medium tracking-[-0.03em] text-foreground">{heading}</h1>
        {subheading && (
          <p className="mt-1 text-sm text-muted-foreground">{subheading}</p>
        )}
      </div>
      {children}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  )
}

function CardGrid({ children }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {children}
    </div>
  )
}

function OptionCard({ icon: Icon, leading, label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex min-h-[84px] items-start gap-3 rounded-xl border bg-white px-5 py-4 text-left text-sm font-medium text-foreground transition-colors',
        selected
          ? 'border-[#77AFA6] bg-[#DFFFF2]'
          : 'border-border hover:border-foreground/30 hover:bg-muted/40'
      )}
    >
      <span className="flex h-5 items-center shrink-0">
        {leading ?? (Icon && <Icon className="size-4 text-foreground/80" />)}
      </span>
      <span>{label}</span>
    </button>
  )
}

function LargeOptionCard({ icon: Icon, iconBg, iconColor, label, description, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-start gap-3 rounded-xl border bg-white p-5 text-left transition-colors',
        selected
          ? 'border-[#77AFA6] bg-[#DFFFF2]'
          : 'border-border hover:border-foreground/30 hover:bg-muted/40'
      )}
    >
      <span className={cn('flex h-9 w-9 items-center justify-center rounded-md shrink-0', iconBg)}>
        {Icon && <Icon className={cn('size-5 [&_path]:stroke-2', iconColor)} />}
      </span>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-[13px] text-foreground/70 leading-relaxed">{description}</span>
      </div>
    </button>
  )
}

function ProgressDots({ count, active }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'rounded-full transition-all duration-200',
            i === active
              ? 'h-1.5 w-5 bg-foreground'
              : 'h-1.5 w-1.5 bg-foreground/20'
          )}
        />
      ))}
    </div>
  )
}
