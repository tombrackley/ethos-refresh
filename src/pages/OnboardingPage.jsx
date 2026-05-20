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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import tenant from '@/config/tenant'

const INDUSTRIES = [
  { value: 'legal',          label: 'Legal services',         icon: IconLaw },
  { value: 'financial',      label: 'Financial services',     icon: IconTrending1 },
  { value: 'healthcare',     label: 'Healthcare',             icon: IconHeartBeat },
  { value: 'insurance',      label: 'Insurance',              icon: IconShieldCheck3 },
  { value: 'government',     label: 'Government',             icon: IconGovernment },
  { value: 'education',      label: 'Education',              icon: IconGraduateCap },
  { value: 'nonprofit',      label: 'Non-profit',             icon: IconHandshake },
  { value: 'energy',         label: 'Energy & utilities',     icon: IconLightningBolt },
  { value: 'retail',         label: 'Retail',                 icon: IconShoppingBag1 },
  { value: 'technology',     label: 'Technology',             icon: IconChip },
  { value: 'other',          label: 'Other',                  icon: IconDotGrid1x3Horizontal },
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

const INTENTIONS = [
  { value: 'govern',   label: 'Govern',   description: 'Manage your board, run meetings, maintain policies, and track director duties.',  icon: IconLaw,           iconBg: 'bg-violet-200',  iconColor: 'text-violet-900' },
  { value: 'comply',   label: 'Comply',   description: 'Track compliance obligations, manage risks and incidents, and prepare for audits.', icon: IconShieldCheck3,  iconBg: 'bg-blue-200',    iconColor: 'text-blue-900' },
  { value: 'work',     label: 'Work',     description: 'Coordinate matters, manage tasks, and run day-to-day operational work with your team.', icon: IconTasks, iconBg: 'bg-amber-200', iconColor: 'text-amber-900' },
  { value: 'learn',    label: 'Learn',    description: 'Track CPD, deliver training, and grow team capability with structured learning journeys.', icon: IconGraduateCap, iconBg: 'bg-emerald-200', iconColor: 'text-emerald-900' },
  { value: 'insights', label: 'Insights', description: 'Curated regulatory intelligence, news, and briefings tailored to your industry.',  icon: IconLightbulbGlow, iconBg: 'bg-rose-200',    iconColor: 'text-rose-900' },
]

const COMPANY_SIZES = [
  { value: '1-10',    label: '1–10' },
  { value: '11-50',   label: '11–50' },
  { value: '51-200',  label: '51–200' },
  { value: '201-500', label: '201–500' },
  { value: '501-1k',  label: '501–1,000' },
  { value: '1k+',     label: '1,000+' },
]

const ROLES = [
  { value: 'director',    label: 'Director / Board member',  icon: IconDirectorChair },
  { value: 'compliance',  label: 'Compliance / Risk',         icon: IconShieldCheck3 },
  { value: 'legal',       label: 'Legal / GC',                icon: IconLaw },
  { value: 'cosec',       label: 'Company Secretary',          icon: IconBoard },
  { value: 'ops',         label: 'Operations / IT',           icon: IconSettingsGear1 },
  { value: 'people',      label: 'HR / People',                icon: IconUserGroup },
  { value: 'exec',        label: 'Executive leadership',       icon: IconUserSettings },
  { value: 'other',       label: 'Other',                      icon: IconDotGrid1x3Horizontal },
]

// 0 name+email · 1 company · 2 role · 3 industry · 4 locations · 5 intentions · 6 thanks
const TOTAL_STEPS = 7
const QUESTION_STEPS = 6 // progress dot count (steps 0-5)

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    name: '',
    email: '',
    industry: '',
    locations: [],
    intentions: [],
    companyName: '',
    companySize: '',
    role: '',
  })

  function next() {
    setStep(s => Math.min(s + 1, TOTAL_STEPS - 1))
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
  function toggleIntent(v) {
    setData(d => {
      const set = new Set(d.intentions)
      if (set.has(v)) set.delete(v)
      else set.add(v)
      return { ...d, intentions: [...set] }
    })
  }
  function toggleLocation(v) {
    setData(d => {
      const set = new Set(d.locations)
      if (set.has(v)) set.delete(v)
      else set.add(v)
      return { ...d, locations: [...set] }
    })
  }

  const canContinueStep0 = data.name.trim() && /\S+@\S+\.\S+/.test(data.email)
  // Progress dots: shown on every question step (0-5), hidden on final thanks
  const showDots = step < QUESTION_STEPS

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
          {step === 0 && (
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

          {step === 1 && (
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

          {step === 2 && (
            <Step heading="What best describes your role?">
              <CardGrid>
                {ROLES.map(opt => (
                  <OptionCard
                    key={opt.value}
                    icon={opt.icon}
                    label={opt.label}
                    selected={data.role === opt.value}
                    onClick={() => pickAndAdvance('role', opt.value)}
                  />
                ))}
              </CardGrid>
              <NavRow onBack={back} onSkip={next} />
            </Step>
          )}

          {step === 3 && (
            <Step heading="Which industry are you in?">
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

          {step === 4 && (
            <Step heading="Countries you operate within" subheading="Select all that apply">
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

          {step === 5 && (
            <Step heading="What would you like to do with Ethos?" subheading="Select all that apply">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {INTENTIONS.map(opt => (
                  <LargeOptionCard
                    key={opt.value}
                    icon={opt.icon}
                    iconBg={opt.iconBg}
                    iconColor={opt.iconColor}
                    label={opt.label}
                    description={opt.description}
                    selected={data.intentions.includes(opt.value)}
                    onClick={() => toggleIntent(opt.value)}
                  />
                ))}
              </div>
              <NavRow onBack={back} onSkip={next} onNext={next} nextLabel="Continue" />
            </Step>
          )}

          {step === 6 && (
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
          <ProgressDots count={QUESTION_STEPS} active={step} />
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
