import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  X, HelpCircle, Calendar, Workflow, Clock, UploadCloud, Trash2, FileText,
  ArrowRight, CheckCircle2, AlertTriangle, FolderOpen, ExternalLink, Plus,
} from 'lucide-react'

const TOTAL_STEPS = 10

const SCOPE_OPTIONS = [
  { value: 'one-entity',       label: 'One entity' },
  { value: 'multiple-entities',label: 'Multiple entities' },
  { value: 'multiple-bu',      label: 'Multiple business units' },
  { value: 'multiple-jur',     label: 'Multiple jurisdictions' },
]

const STORED_OPTIONS = [
  { value: 'central',   label: 'Central repository' },
  { value: 'multiple',  label: 'Multiple Locations' },
  { value: 'none',      label: 'Not centralised' },
]

const STRUCTURE_OPTIONS = [
  { value: 'yes',       label: 'Yes, mostly consistent' },
  { value: 'varies',    label: 'Varies by entiy' },
  { value: 'no',        label: 'No consistent format' },
]

const STATUS_OPTIONS = [
  { value: 'all',       label: 'All approved' },
  { value: 'mixed',     label: 'Mixed (approved, draft, outdated)' },
  { value: 'outdated',  label: 'Mostly outdated' },
]

const PRIMARY_DRIVERS = [
  { id: 'pmi',        label: 'Post-merger integration' },
  { id: 'regulatory', label: 'Regulatory compliance uplift' },
  { id: 'simplify',   label: 'Simplification / consideration' },
  { id: 'operational',label: 'Operational clarity' },
  { id: 'digital',    label: 'Digital transformation' },
  { id: 'other',      label: 'Other' },
]

const OUTCOME_OPTIONS = [
  { value: 'single',     label: 'Single group-wide policy per topic' },
  { value: 'group-local',label: 'Group policy + local proceedures' },
  { value: 'undecided',  label: 'Not yet decided' },
]

const OWNER_OPTIONS = [
  { value: 'policy',    label: 'Policy owners' },
  { value: 'bu',        label: 'Business unit owners' },
  { value: 'other',     label: 'Other' },
]

const APPROVER_OPTIONS = [
  { value: 'authorised',label: 'Authorised policy approver' },
  { value: 'committee', label: 'Committee' },
  { value: 'board',     label: 'Board' },
]

const SME_OPTIONS = [
  { value: 'review',    label: 'Yes, during review' },
  { value: 'signoff',   label: 'Yes, at final sign-off' },
  { value: 'no',        label: 'No' },
]

const AUDIT_REQUIREMENTS = [
  { id: 'tracked',  label: 'Tracked Changes' },
  { id: 'changelog',label: 'Change Log' },
  { id: 'risk',     label: 'Risk & Remediation' },
]

const REGULATORY = [
  { id: 'tga',        label: 'TGA' },
  { id: 'asx',        label: 'ASX' },
  { id: 'asic',       label: 'ASIC' },
  { id: 'accc',       label: 'ACCC' },
  { id: 'oaic',       label: 'OAIC' },
  { id: 'modslavery', label: 'Modern Slavery' },
  { id: 'other',      label: 'Other' },
]

const ADVISERS = [
  { id: 'jane-recent', name: 'Jane Doe', role: 'Lawyer | 10+ years experience', turnaround: '48hrs typical turn around' },
]

const SUGGESTED_ADVISERS = [
  { id: 'jane',    name: 'Jane Doe',     role: 'Lawyer | 10+ years experience', turnaround: '48hrs typical turn around' },
  { id: 'suzanne', name: 'Suzanne Ford', role: 'Lawyer | 10+ years experience', turnaround: '48hrs typical turn around' },
]

const PRIORITY_OPTIONS = [
  { value: 'critical', label: 'Critical' },
  { value: 'high',     label: 'High' },
  { value: 'standard', label: 'Standard' },
]

const ADDITIONAL_SERVICES = [
  { id: 'extract',    name: 'Extract common positions', desc: 'Lorem ipsum dolor sit amet consectetur. Vel quisque eu.',  price: 120 },
  { id: 'discovery',  name: 'Discovery questions',      desc: 'Lorem ipsum dolor sit amet consectetur. Ultrices ornare.', price: 150 },
  { id: 'risk',       name: 'Risk & Remediation Report',desc: 'Lorem ipsum dolor sit amet consectetur. Arcu lacinia ac mi.', price: 120 },
  { id: 'redline',    name: 'Redline Document',         desc: 'Lorem ipsum dolor sit amet consectetur. In dis non a ut.',    price: 180 },
  { id: 'training',   name: 'Training module creation', desc: 'Lorem ipsum dolor sit amet consectetur. Auctor.',             price: 250 },
]

const VAULT_ITEMS = [
  { name: 'Company Preference Sheet', updated: 'Updated over 1yr ago', warn: true  },
  { name: 'Area',                     updated: 'Updated 5d ago',        warn: false },
  { name: 'Area',                     updated: 'Updated 6mo ago',       warn: false },
]

const BASE_PRICE   = 500
const HOURLY_RATE  = 250

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
            className={`h-[3px] w-4 rounded-full ${i < current ? 'bg-foreground' : 'bg-border'}`}
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

function CheckboxTile({ checked, title, desc, onChange }) {
  return (
    <label className={`flex items-start gap-3 rounded-lg border px-4 py-3 cursor-pointer ${
      checked ? 'border-brand-700 bg-white' : 'border-border bg-white hover:bg-muted/40'
    }`}>
      <Checkbox checked={checked} onCheckedChange={onChange} className="mt-0.5" />
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
    </label>
  )
}

export default function PolicyUpliftOverlay({ open, onClose }) {
  const [step, setStep] = useState(1)

  // Step 1
  const [numPolicies, setNumPolicies] = useState('')
  const [scope, setScope] = useState('one-entity')

  // Step 2
  const [stored, setStored] = useState('central')
  const [structure, setStructure] = useState('yes')
  const [status, setStatus] = useState('all')

  // Step 3
  const [drivers, setDrivers] = useState({ pmi: true })
  const [outcome, setOutcome] = useState('single')

  // Step 4
  const [owner, setOwner] = useState('policy')
  const [approver, setApprover] = useState('authorised')
  const [sme, setSme] = useState('review')

  // Step 5
  const [audit, setAudit] = useState({ tracked: true })
  const [regulatory, setRegulatory] = useState({ cpd: true })

  // Step 6
  const [adviserId, setAdviserId] = useState('jane-recent')

  // Step 7
  const [targetDate, setTargetDate] = useState('')
  const [priority, setPriority] = useState('critical')
  const [immovableDates, setImmovableDates] = useState([''])

  // Step 8
  const [uploads, setUploads] = useState([
    { id: 'd1', name: 'document.pdf', note: '' },
    { id: 'd2', name: 'document.pdf', note: '' },
    { id: 'd3', name: 'document.pdf', note: '' },
  ])

  // Step 9
  const [extras, setExtras] = useState({ extract: true, risk: true })

  // Step 10
  const [hoursMode, setHoursMode] = useState('fixed')
  const [hours, setHours] = useState(3)
  const [agreed, setAgreed] = useState(true)

  const estimatedPrice = useMemo(() => {
    let total = BASE_PRICE
    ADDITIONAL_SERVICES.forEach(s => { if (extras[s.id]) total += s.price })
    total += hours * HOURLY_RATE
    return total
  }, [extras, hours])

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
        <h2 className="text-2xl font-medium text-white mb-3">Policy Uplift</h2>
        <p className="text-sm text-white/70 max-w-sm leading-relaxed">
          Reviews and modernise your organisational policies to keep them current, compliant, and aligned with your goals.
        </p>

        <div className="mt-10 w-full max-w-sm rounded-2xl bg-white px-6 py-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Estimated price:&nbsp;&nbsp;<span className="text-base font-semibold text-foreground">{fmtPrice(estimatedPrice)}</span>
          </span>
          {(step === 8 || step === 9) && (
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

  // ── Steps ──

  const Step1 = (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Tell us about the policies</h1>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Number of policies</p>
        <p className="text-xs text-muted-foreground">Enter the total number of documents in this scope</p>
        <Input
          type="number"
          placeholder="eg. 10"
          value={numPolicies}
          onChange={(e) => setNumPolicies(e.target.value)}
          className="bg-white"
        />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Contract type</p>
        {SCOPE_OPTIONS.map(o => (
          <RadioTile key={o.value} checked={scope === o.value} onClick={() => setScope(o.value)} title={o.label} />
        ))}
      </div>
    </div>
  )

  const Step2 = (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Current State of Policies</h1>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Where are the policies stored</p>
        {STORED_OPTIONS.map(o => (
          <RadioTile key={o.value} checked={stored === o.value} onClick={() => setStored(o.value)} title={o.label} />
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Do policies follow a consistent structure?</p>
        {STRUCTURE_OPTIONS.map(o => (
          <RadioTile key={o.value} checked={structure === o.value} onClick={() => setStructure(o.value)} title={o.label} />
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Policy Status</p>
        {STATUS_OPTIONS.map(o => (
          <RadioTile key={o.value} checked={status === o.value} onClick={() => setStatus(o.value)} title={o.label} />
        ))}
      </div>
    </div>
  )

  const Step3 = (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Objectives</h1>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Primary Driver</p>
        {PRIMARY_DRIVERS.map(d => (
          <CheckboxTile
            key={d.id}
            checked={!!drivers[d.id]}
            onChange={(v) => setDrivers(prev => ({ ...prev, [d.id]: !!v }))}
            title={d.label}
          />
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">What is your desired outcome?</p>
        {OUTCOME_OPTIONS.map(o => (
          <RadioTile key={o.value} checked={outcome === o.value} onClick={() => setOutcome(o.value)} title={o.label} />
        ))}
      </div>
    </div>
  )

  const Step4 = (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Review & Approval</h1>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Who owns the policies?</p>
        {OWNER_OPTIONS.map(o => (
          <RadioTile key={o.value} checked={owner === o.value} onClick={() => setOwner(o.value)} title={o.label} />
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Who approves final versions?</p>
        {APPROVER_OPTIONS.map(o => (
          <RadioTile key={o.value} checked={approver === o.value} onClick={() => setApprover(o.value)} title={o.label} />
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Will SMEs be involved?</p>
        {SME_OPTIONS.map(o => (
          <RadioTile key={o.value} checked={sme === o.value} onClick={() => setSme(o.value)} title={o.label} />
        ))}
      </div>
    </div>
  )

  const Step5 = (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Output Requirements</h1>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Audit Requirements</p>
        {AUDIT_REQUIREMENTS.map(o => (
          <CheckboxTile
            key={o.id}
            checked={!!audit[o.id]}
            onChange={(v) => setAudit(prev => ({ ...prev, [o.id]: !!v }))}
            title={o.label}
          />
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Regulatory Alignment</p>
        {REGULATORY.map(o => (
          <CheckboxTile
            key={o.id}
            checked={!!regulatory[o.id]}
            onChange={(v) => setRegulatory(prev => ({ ...prev, [o.id]: !!v }))}
            title={o.label}
          />
        ))}
      </div>
    </div>
  )

  const Step6 = (
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

  const Step7 = (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Timing & Priorities</h1>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Target deadline</p>
        <Input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          placeholder="Select date"
          className="bg-white"
        />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Priority level</p>
        {PRIORITY_OPTIONS.map(o => (
          <RadioTile key={o.value} checked={priority === o.value} onClick={() => setPriority(o.value)} title={o.label} />
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Any immovable date?</p>
        {immovableDates.map((d, i) => (
          <Input
            key={i}
            type="date"
            value={d}
            onChange={(e) => setImmovableDates(prev => prev.map((x, idx) => idx === i ? e.target.value : x))}
            placeholder="Select date"
            className="bg-white"
          />
        ))}
        <button
          onClick={() => setImmovableDates(prev => [...prev, ''])}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#1a3431] hover:text-[#122423] transition-colors pt-1"
        >
          <Plus className="size-3.5" /> add another
        </button>
      </div>
    </div>
  )

  const Step8 = (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Upload Policies</h1>

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

  const Step9 = (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Additional services</h1>
      <p className="text-sm text-foreground">Select any additional services you would like</p>
      <div className="space-y-3">
        {ADDITIONAL_SERVICES.map(s => (
          <CheckboxTile
            key={s.id}
            checked={!!extras[s.id]}
            onChange={(v) => setExtras(prev => ({ ...prev, [s.id]: !!v }))}
            title={s.name}
            desc={s.desc}
          />
        ))}
      </div>
    </div>
  )

  const Step10 = (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Review Quote</h1>

      <div className="space-y-3">
        <p className="text-xs font-medium text-foreground">Product Fixed Costs</p>
        <div className="rounded-lg border border-border bg-white divide-y divide-border">
          <div className="flex items-start justify-between px-4 py-3 gap-4">
            <p className="text-sm font-medium text-foreground">Policy Uplift</p>
            <p className="text-sm font-medium text-foreground shrink-0">{fmtPrice(BASE_PRICE)}</p>
          </div>
          {ADDITIONAL_SERVICES.filter(s => extras[s.id]).map(s => (
            <div key={s.id} className="flex items-start justify-between px-4 py-3 gap-4">
              <p className="text-sm font-medium text-foreground">{s.name}</p>
              <p className="text-sm font-medium text-foreground shrink-0">{fmtPrice(s.price)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium text-foreground">Human Adviser Hours</p>
        <div className="grid grid-cols-2 gap-2">
          <RadioTile checked={hoursMode === 'optimal'} onClick={() => setHoursMode('optimal')} title="Optimial" />
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
      <h1 className="text-2xl font-semibold text-foreground text-center">Policy Uplift Started Successfully</h1>
      <p className="text-sm text-muted-foreground text-center max-w-md mt-3">
        Your Policy Uplift request is now underway. We will send email updates as progress is made.
      </p>
      <button className="mt-5 text-sm font-medium border border-border rounded-md px-4 h-9 hover:bg-muted/40 transition-colors">View Task</button>

      <div className="mt-10 w-full max-w-xl rounded-xl border border-border bg-white p-6">
        <div className="size-10 rounded-lg bg-muted flex items-center justify-center mb-4">
          <FolderOpen className="size-5 text-muted-foreground" />
        </div>
        <h3 className="text-base font-semibold text-foreground">Ensure Vault is up to date</h3>
        <p className="text-sm text-muted-foreground mt-2">
          EthikaAI uses your Vault to provide accurate, relevant insights for the Policy Uplift service.
        </p>
        <p className="text-sm text-muted-foreground mt-3">
          Keeping these documents up to date ensures more precise recommendations and fewer revisions later.
        </p>
        <p className="text-sm font-medium text-foreground mt-4">Policy Uplift will reference your:</p>
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
    step === 1  ? Step1  :
    step === 2  ? Step2  :
    step === 3  ? Step3  :
    step === 4  ? Step4  :
    step === 5  ? Step5  :
    step === 6  ? Step6  :
    step === 7  ? Step7  :
    step === 8  ? Step8  :
    step === 9  ? Step9  :
    step === 10 ? Step10 : null

  const primaryCtaLabel = step === TOTAL_STEPS ? 'Approve & Proceed' : 'Continue'

  return (
    <div className="fixed inset-0 z-50 flex bg-[#f5f6f7]">
      {step <= TOTAL_STEPS ? (
        <>
          <div className="flex flex-col w-1/2 min-w-[520px]">
            <div className="flex items-center justify-between px-6 py-5">
              <button onClick={onClose} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <X className="size-5" /> Cancel
              </button>
              <ProgressDots current={step} total={TOTAL_STEPS} />
            </div>

            <div className="flex-1 overflow-auto px-10 pb-10">
              <div className="max-w-md mx-auto">
                {stepContent}
              </div>
            </div>

            <div className="px-10 py-5">
              <div className="max-w-md mx-auto flex items-center gap-4">
                {step > 1 && (
                  <button onClick={back} className="text-sm text-foreground hover:text-muted-foreground transition-colors">Back</button>
                )}
                <Button
                  onClick={next}
                  className="flex-1 h-10"
                  disabled={step === TOTAL_STEPS && !agreed}
                >
                  {primaryCtaLabel}
                </Button>
              </div>
            </div>
          </div>

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
