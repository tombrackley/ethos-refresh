import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  X, HelpCircle, Calendar, Workflow, Clock, UploadCloud, Trash2, FileText,
  ArrowRight, CheckCircle2, AlertTriangle, FolderOpen, ExternalLink, ChevronDown,
} from 'lucide-react'

const TOTAL_STEPS = 6

const RELATED_TASKS = [
  'Henderson & Corp Ltd — Corporate',
  'Project Atlas NDA',
  'Thompson Estate — Probate',
  'Baker v. Hall — Litigation',
]

const ADVISERS = [
  { id: 'jane-recent',  name: 'Jane Doe',      role: 'Lawyer | 10+ years experience', turnaround: '48hrs typical turn around' },
]

const SUGGESTED_ADVISERS = [
  { id: 'jane',    name: 'Jane Doe',     role: 'Lawyer | 10+ years experience', turnaround: '48hrs typical turn around' },
  { id: 'suzanne', name: 'Suzanne Ford', role: 'Lawyer | 10+ years experience', turnaround: '48hrs typical turn around' },
]

const ADDITIONAL_SERVICES = [
  { id: 'risk-report',   name: 'Risk and remediation report', desc: 'Detailed risk analysis with actionable recommendations', price: 120 },
  { id: 'playbook',      name: 'Create Playbook',             desc: 'Custom guidelines for future negotiations',              price: 150 },
  { id: 'departure',     name: 'Departure Table',             desc: 'Summary of key deviations from standard terms',          price: 120 },
  { id: 'creation',      name: 'Contract Creation',           desc: 'Draft new contracts based on your requirements',         price: 200 },
]

const VAULT_ITEMS = [
  { name: 'Company Preference Sheet', updated: 'Updated over 1yr ago', warn: true  },
  { name: 'Area',                     updated: 'Updated 5d ago',        warn: false },
  { name: 'Area',                     updated: 'Updated 6mo ago',       warn: false },
]

const BASE_PRICE_COMPLEX = 500
const BASE_PRICE_SIMPLE  = 200
const URGENCY_SURCHARGE  = 100
const HOURLY_RATE        = 250

function Avatar({ initials }) {
  return (
    <span className="inline-flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 text-[11px] font-semibold text-white shrink-0">
      {initials}
    </span>
  )
}

function ProgressDots({ current, total }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`h-[3px] w-6 rounded-full ${i < current ? 'bg-foreground' : 'bg-border'}`}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground ml-2">{current}/{total}</span>
    </div>
  )
}

function RadioTile({ checked, title, desc, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-lg border px-4 py-3 transition-colors ${
        checked ? 'border-brand-700 bg-white' : 'border-border bg-white hover:bg-muted/40'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border ${
            checked ? 'border-brand-700' : 'border-border'
          }`}
        >
          {checked && <span className="size-2 rounded-full bg-brand-800" />}
        </span>
        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>
          {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
        </div>
      </div>
    </button>
  )
}

export default function ContractCoachOverlay({ open, onClose }) {
  const [step, setStep] = useState(1)
  const [contractType, setContractType] = useState('simple')
  const [numDocs, setNumDocs] = useState('')
  const [relatedTask, setRelatedTask] = useState('')
  const [reviewType, setReviewType] = useState('ai-human')
  const [urgency, setUrgency] = useState('standard')
  const [adviserId, setAdviserId] = useState('jane-recent')
  const [uploads, setUploads] = useState([
    { id: 'd1', name: 'document.pdf', note: '' },
    { id: 'd2', name: 'document.pdf', note: '' },
    { id: 'd3', name: 'document.pdf', note: '' },
  ])
  const [extras, setExtras] = useState({ 'risk-report': true, 'playbook': false, 'departure': true, 'creation': false })
  const [hoursMode, setHoursMode] = useState('fixed')
  const [hours, setHours] = useState(3)
  const [agreed, setAgreed] = useState(true)

  const estimatedPrice = useMemo(() => {
    if (step < 1) return 0
    let total = 0
    if (contractType === 'complex') total += BASE_PRICE_COMPLEX
    else if (contractType === 'simple') total += BASE_PRICE_SIMPLE
    if (urgency === '24h') total += URGENCY_SURCHARGE
    ADDITIONAL_SERVICES.forEach(s => { if (extras[s.id]) total += s.price })
    if (reviewType === 'ai-human') total += hours * HOURLY_RATE
    return total
  }, [step, contractType, urgency, extras, reviewType, hours])

  if (!open) return null

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS + 1))
  const back = () => setStep(s => Math.max(s - 1, 1))

  const fmtPrice = (n) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const RightPanel = (
    <div className="flex-1 bg-[#1a3431] rounded-3xl m-4 flex flex-col relative overflow-hidden">
      <button className="absolute top-6 right-6 inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors">
        Help <HelpCircle className="size-4" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center px-10 text-center">
        <div className="size-16 rounded-xl bg-[#c8ebd8] flex items-center justify-center mb-6">
          <Workflow className="size-7 text-[#1a3431]" strokeWidth={1.75} />
        </div>
        <h2 className="text-2xl font-medium text-white mb-3">Contract Coach</h2>
        <p className="text-sm text-white/70 max-w-sm leading-relaxed">
          AI-powered contract review and analysis with expert legal support. Customize your package below to get an instant quote.
        </p>

        <div className="mt-10 w-full max-w-sm rounded-2xl bg-white px-6 py-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Estimated price:&nbsp;&nbsp;<span className="text-base font-semibold text-foreground">{fmtPrice(estimatedPrice)}</span>
          </span>
          {(step === 4 || step === 5) && (
            <button onClick={next} className="inline-flex items-center gap-1.5 text-sm font-medium bg-[#c8ebd8] text-[#1a3431] rounded-lg px-3 py-1.5 hover:bg-[#b6e2cc] transition-colors">
              Continue <ArrowRight className="size-4" />
            </button>
          )}
        </div>

        <p className="mt-6 text-xs text-white/60">If you are unsure what you need or require additional guidance:</p>
        <button className="mt-2 inline-flex items-center gap-2 text-sm text-white hover:text-white/80 transition-colors">
          <Calendar className="size-4" /> Book a meeting
        </button>
      </div>
    </div>
  )

  // ── Step content ───────────────────────────────────────────────────────────

  const Step1 = (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Tell us about the contract</h1>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Contract type</p>
        <RadioTile
          checked={contractType === 'simple'}
          onClick={() => setContractType('simple')}
          title="Simple Contract"
          desc="Includes basic agreements"
        />
        <RadioTile
          checked={contractType === 'complex'}
          onClick={() => setContractType('complex')}
          title="Complex Contract"
          desc="Involves multiple parties or detailed terms"
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Number of documents</p>
        <p className="text-xs text-muted-foreground">Enter the total number of documents to be analysed</p>
        <Input
          type="number"
          placeholder="eg. 10"
          value={numDocs}
          onChange={(e) => setNumDocs(e.target.value)}
          className="bg-white"
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Related Tasks/Services</p>
        <p className="text-xs text-muted-foreground">Select any related projects/services where documents may be able to be leverageed</p>
        <div className="relative">
          <select
            value={relatedTask}
            onChange={(e) => setRelatedTask(e.target.value)}
            className="w-full appearance-none rounded-md border border-border bg-white px-3 h-9 text-sm text-foreground pr-9 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Select</option>
            {RELATED_TASKS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <ChevronDown className="size-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  )

  const Step2 = (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Review Type</h1>
      <div className="space-y-3">
        <RadioTile
          checked={reviewType === 'ai'}
          onClick={() => setReviewType('ai')}
          title="AI Only"
          desc="Faster results"
        />
        <RadioTile
          checked={reviewType === 'ai-human'}
          onClick={() => setReviewType('ai-human')}
          title="AI + Human Review"
          desc="Initially fast results that are reviewed by professionals to ensure accuracy"
        />
      </div>

      <div className="space-y-3 pt-2">
        <p className="text-sm font-medium text-foreground">Urgency</p>
        <RadioTile
          checked={urgency === 'standard'}
          onClick={() => setUrgency('standard')}
          title="Standard"
          desc="3-5 business days"
        />
        <RadioTile
          checked={urgency === '24h'}
          onClick={() => setUrgency('24h')}
          title="Within 24-hours"
          desc="Available for reviews requiring fast turn around"
        />
      </div>
    </div>
  )

  const Step3 = (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Select Adviser for review</h1>

      <div className="space-y-3">
        <p className="text-xs font-medium text-foreground">Recent advisers</p>
        {ADVISERS.map(a => {
          const selected = adviserId === a.id
          return (
            <div key={a.id} className="rounded-lg border border-border bg-white px-4 py-3 flex items-center gap-3">
              <Avatar initials={a.name.split(' ').map(n => n[0]).join('')} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{a.name}</p>
                <p className="text-xs text-muted-foreground">{a.role}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5"><Clock className="size-3" />{a.turnaround}</p>
              </div>
              {selected ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#c8ebd8] text-[#1a3431] rounded-md px-2.5 h-7">Selected</span>
              ) : (
                <button onClick={() => setAdviserId(a.id)} className="text-xs font-medium border border-border rounded-md px-2.5 h-7 hover:bg-muted/40 transition-colors">Select</button>
              )}
            </div>
          )
        })}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-foreground">Suggested</p>
          <button className="text-xs text-muted-foreground hover:text-foreground">View all</button>
        </div>
        {SUGGESTED_ADVISERS.map(a => {
          const selected = adviserId === a.id
          return (
            <div key={a.id} className="rounded-lg border border-border bg-white px-4 py-3 flex items-center gap-3">
              <Avatar initials={a.name.split(' ').map(n => n[0]).join('')} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{a.name}</p>
                <p className="text-xs text-muted-foreground">{a.role}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5"><Clock className="size-3" />{a.turnaround}</p>
              </div>
              {selected ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#c8ebd8] text-[#1a3431] rounded-md px-2.5 h-7">Selected</span>
              ) : (
                <button onClick={() => setAdviserId(a.id)} className="text-xs font-medium border border-border rounded-md px-2.5 h-7 hover:bg-muted/40 transition-colors">Select</button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  const Step4 = (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Upload Documents</h1>

      <div className="rounded-xl border border-dashed border-[#a7d7c1] bg-[#e9f5ee] p-6 text-center">
        <p className="text-sm text-foreground">Click to browse or drag and drop files here.</p>
        <p className="text-xs text-muted-foreground mt-1">You can upload multiple files one time</p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <button className="inline-flex items-center gap-1.5 text-xs font-medium bg-white border border-border rounded-md px-3 h-8">
            <UploadCloud className="size-3.5" /> Upload
          </button>
          <button className="inline-flex items-center gap-1.5 text-xs font-medium bg-white border border-border rounded-md px-3 h-8">
            <span className="size-3.5 rounded-sm bg-[#0364b8]" /> Select from Onedrive
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Uploaded Documents</p>
        {uploads.map((u) => (
          <div key={u.id} className="rounded-lg border border-border bg-white">
            <div className="flex items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <FileText className="size-4 text-muted-foreground" />
                {u.name}
              </div>
              <button
                onClick={() => setUploads(prev => prev.filter(x => x.id !== u.id))}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            <div className="px-4 pb-3">
              <textarea
                value={u.note}
                onChange={(e) => setUploads(prev => prev.map(x => x.id === u.id ? { ...x, note: e.target.value } : x))}
                placeholder="Eg. Please observe lorem ipsum dolar…"
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm min-h-[64px] focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const Step5 = (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Additional services</h1>
      <p className="text-sm text-foreground">Select any additional services you would like</p>
      <div className="space-y-3">
        {ADDITIONAL_SERVICES.map(s => {
          const checked = !!extras[s.id]
          return (
            <label key={s.id} className="flex items-start gap-3 rounded-lg border border-border bg-white px-4 py-3 cursor-pointer">
              <Checkbox
                checked={checked}
                onCheckedChange={(v) => setExtras(prev => ({ ...prev, [s.id]: !!v }))}
                className="mt-0.5"
              />
              <div>
                <p className="text-sm font-medium text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )

  const Step6 = (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Review Quote</h1>

      <div className="space-y-3">
        <p className="text-xs font-medium text-foreground">Product Fixed Costs</p>
        <div className="rounded-lg border border-border bg-white divide-y divide-border">
          <div className="flex items-start justify-between px-4 py-3 gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Contract Coach</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {contractType === 'complex' ? 'Complex' : 'Simple'} contract{numDocs ? `, ${numDocs} documents` : ''}, {reviewType === 'ai-human' ? 'AI + human review' : 'AI only'}, {urgency === '24h' ? '24h' : 'Standard'} delivery
              </p>
            </div>
            <p className="text-sm font-medium text-foreground shrink-0">{fmtPrice(contractType === 'complex' ? BASE_PRICE_COMPLEX : BASE_PRICE_SIMPLE)}</p>
          </div>
          {ADDITIONAL_SERVICES.filter(s => extras[s.id]).map(s => (
            <div key={s.id} className="flex items-start justify-between px-4 py-3 gap-4">
              <p className="text-sm font-medium text-foreground">{s.name}</p>
              <p className="text-sm font-medium text-foreground shrink-0">{fmtPrice(s.price)}</p>
            </div>
          ))}
        </div>
      </div>

      {reviewType === 'ai-human' && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-foreground">Human Adviser Hours</p>
          <div className="grid grid-cols-2 gap-2">
            <RadioTile checked={hoursMode === 'optimal'} onClick={() => setHoursMode('optimal')} title="Optimal" />
            <RadioTile checked={hoursMode === 'fixed'}   onClick={() => setHoursMode('fixed')}   title="Fixed" />
          </div>
          <div className="rounded-lg border border-border bg-white px-4 py-3 flex items-center gap-3">
            <Avatar initials="JS" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Josh Smith</p>
              {hoursMode === 'fixed' && (
                <div className="mt-1 flex items-center gap-1.5">
                  <input
                    type="number"
                    min={0}
                    value={hours}
                    onChange={(e) => setHours(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-14 h-7 rounded-md border border-border text-sm px-2 bg-white"
                  />
                  <span className="text-xs text-muted-foreground">hrs</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{fmtPrice(hours * HOURLY_RATE)}</p>
              <p className="text-xs text-muted-foreground">${HOURLY_RATE}/hr</p>
            </div>
          </div>
        </div>
      )}

      <label className="flex items-start gap-2 cursor-pointer">
        <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(!!v)} className="mt-0.5" />
        <span className="text-xs text-foreground">
          I agree to the terms and conditions of this service outlined in the{' '}
          <span className="underline">letter of engagement</span>
        </span>
      </label>
    </div>
  )

  const StepSuccess = (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
      <div className="size-14 rounded-full bg-[#c8ebd8] flex items-center justify-center mb-6">
        <CheckCircle2 className="size-7 text-[#1a3431]" strokeWidth={2} />
      </div>
      <h1 className="text-2xl font-semibold text-foreground text-center">Contract Coach Started Successfully</h1>
      <p className="text-sm text-muted-foreground text-center max-w-md mt-3">
        Your Contract Coach request is now underway. We will send email updates as progress is made.
      </p>
      <button className="mt-5 text-sm font-medium border border-border rounded-md px-4 h-9 hover:bg-muted/40 transition-colors">View Task</button>

      <div className="mt-10 w-full max-w-xl rounded-xl border border-border bg-white p-6">
        <div className="size-10 rounded-lg bg-muted flex items-center justify-center mb-4">
          <FolderOpen className="size-5 text-muted-foreground" />
        </div>
        <h3 className="text-base font-semibold text-foreground">Ensure Vault is up to date</h3>
        <p className="text-sm text-muted-foreground mt-2">
          EthikaAI uses your Vault to provide accurate, relevant insights for the Contract Coach service.
        </p>
        <p className="text-sm text-muted-foreground mt-3">
          Keeping these documents up to date ensures more precise recommendations and fewer revisions later.
        </p>
        <p className="text-sm font-medium text-foreground mt-4">Contract coach will reference your:</p>
        <div className="mt-3 space-y-2">
          {VAULT_ITEMS.map((v, i) => (
            <div key={i} className={`flex items-center justify-between rounded-md px-3 py-2 ${v.warn ? 'bg-[#fff4eb]' : 'bg-[#ebf6f0]'}`}>
              <div>
                <p className="text-sm text-foreground">{v.name}</p>
                <p className={`text-xs flex items-center gap-1 mt-0.5 ${v.warn ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {v.warn && <AlertTriangle className="size-3" />}
                  {v.updated}
                </p>
              </div>
              <button className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline">
                Update <ExternalLink className="size-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const stepContent =
    step === 1 ? Step1 :
    step === 2 ? Step2 :
    step === 3 ? Step3 :
    step === 4 ? Step4 :
    step === 5 ? Step5 :
    step === 6 ? Step6 : null

  const primaryCtaLabel = step === 6 ? 'Approve & Proceed' : 'Continue'

  return (
    <div className="fixed inset-0 z-50 flex bg-[#f5f6f7]">
      {step <= TOTAL_STEPS ? (
        <>
          {/* Left form */}
          <div className="flex flex-col w-1/2 min-w-[520px]">
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-5">
              <button onClick={onClose} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <X className="size-5" /> Cancel
              </button>
              <ProgressDots current={step} total={TOTAL_STEPS} />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto px-10 pb-10">
              <div className="max-w-md mx-auto">
                {stepContent}
              </div>
            </div>

            {/* Footer */}
            <div className="px-10 py-5">
              <div className="max-w-md mx-auto flex items-center gap-4">
                {step > 1 && (
                  <button onClick={back} className="text-sm text-foreground hover:text-muted-foreground transition-colors">Back</button>
                )}
                <Button
                  onClick={next}
                  className="flex-1 h-10"
                  disabled={step === 6 && !agreed}
                >
                  {primaryCtaLabel}
                </Button>
              </div>
            </div>
          </div>

          {/* Right preview panel */}
          {RightPanel}
        </>
      ) : (
        <div className="flex-1 flex flex-col overflow-auto">
          <div className="px-6 py-5">
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="size-5" />
            </button>
          </div>
          {StepSuccess}
        </div>
      )}
    </div>
  )
}
