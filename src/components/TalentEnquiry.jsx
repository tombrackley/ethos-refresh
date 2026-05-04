import { useState } from 'react'
import {
  X, HelpCircle, ChevronRight, ChevronLeft, Search,
  MessageSquare, FileText, Link2, CalendarDays, CheckCircle2,
  Video, ArrowRight, Folder, Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// ─── Products catalogue ──────────────────────────────────────────────────────

const PRODUCTS = [
  { id: 1, icon: '📋', title: 'Contract Review', desc: 'Review and markup of commercial contracts', tags: ['Legal', 'Contracts'] },
  { id: 2, icon: '🛡️', title: 'Compliance Audit', desc: 'End-to-end compliance health check', tags: ['Compliance', 'Audit'] },
  { id: 3, icon: '📊', title: 'Risk Assessment', desc: 'Enterprise risk identification and scoring', tags: ['Risk', 'Advisory'] },
  { id: 4, icon: '⚖️', title: 'Governance Review', desc: 'Board governance framework assessment', tags: ['Governance'] },
  { id: 5, icon: '📝', title: 'Policy Drafting', desc: 'Custom policy and procedure development', tags: ['Policy', 'Compliance'] },
  { id: 6, icon: '🔍', title: 'Due Diligence', desc: 'Comprehensive M&A due diligence', tags: ['Legal', 'M&A'] },
  { id: 7, icon: '🏛️', title: 'Regulatory Advisory', desc: 'Regulatory change impact assessment', tags: ['Regulatory'] },
  { id: 8, icon: '📑', title: 'Board Pack Preparation', desc: 'Board meeting documentation and packs', tags: ['Governance', 'Advisory'] },
]

// ─── Step progress ───────────────────────────────────────────────────────────

function StepProgress({ current, total }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all ${
            i < current ? 'w-8 bg-brand-600' : i === current ? 'w-8 bg-brand-400' : 'w-8 bg-muted-foreground/20'
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-2">{current + 1}/{total}</span>
    </div>
  )
}

// ─── Product picker modal ────────────────────────────────────────────────────

function ProductPicker({ onSelect, onClose }) {
  const [search, setSearch] = useState('')

  const filtered = PRODUCTS.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.desc.toLowerCase().includes(search.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Link to a Product or Service</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="size-8 text-muted-foreground">
            <X className="size-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="px-6 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products & services..."
              className="pl-9 text-sm"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-auto px-6 pb-6">
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(product => (
              <div
                key={product.id}
                className="border border-border/60 rounded-lg p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-lg">{product.icon}</span>
                      <p className="text-sm font-medium text-foreground">{product.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{product.desc}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.tags.map(tag => (
                        <span key={tag} className="text-xs font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 text-xs h-7"
                    onClick={() => onSelect(product)}
                  >
                    Add
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Not sure modal ──────────────────────────────────────────────────────────

function NotSureModal({ professional, onClose }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-base font-semibold text-foreground">Not sure what you need?</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          No problem — book a quick meeting with {professional.name} to discuss your requirements and
          they can help scope the engagement for you.
        </p>
        <div className="flex items-center gap-3 bg-muted/40 border border-border/60 rounded-lg p-4">
          <Video className="size-5 text-brand-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Book a 15-min discovery call</p>
            <p className="text-xs text-muted-foreground">Free, no commitment</p>
          </div>
          <Button size="sm" className="shrink-0">Book</Button>
        </div>
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function TalentEnquiry({ professional, onClose }) {
  const [enquiryType, setEnquiryType] = useState(null)        // 'simple' | 'specific' | 'product'
  const [step, setStep] = useState(0)                          // 0 = type selection
  const [message, setMessage] = useState('')
  const [linkedProduct, setLinkedProduct] = useState(null)
  const [showProductPicker, setShowProductPicker] = useState(false)
  const [showNotSure, setShowNotSure] = useState(false)
  const [supportType, setSupportType] = useState('')
  const [startDate, setStartDate] = useState('')
  const [contractType, setContractType] = useState(null)       // 'simple' | 'complex'
  const [numDocuments, setNumDocuments] = useState('')
  const [completed, setCompleted] = useState(false)

  // Determine total steps based on enquiry type
  function getTotalSteps() {
    if (enquiryType === 'simple') return 1
    if (enquiryType === 'product') return 2
    if (enquiryType === 'specific') return 3
    return 1
  }

  function handleSubmitSimple() {
    setCompleted(true)
  }

  function handleNext() {
    if (enquiryType === 'product' && step === 0) {
      setStep(1)
    } else if (enquiryType === 'specific' && step === 0) {
      setStep(1)
    } else if (enquiryType === 'specific' && step === 1) {
      setStep(2)
    } else {
      setCompleted(true)
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1)
  }

  // ─── Success screen ─────────────────────────────────────────────────────────
  if (completed) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <div className="size-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="size-8 text-emerald-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-semibold text-foreground">
                {enquiryType === 'simple' ? 'Enquiry Sent Successfully' : 'Contract Coach Started Successfully'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {enquiryType === 'simple'
                  ? `Your enquiry has been sent to ${professional.name}. You'll receive an email update shortly.`
                  : `Great — we've notified ${professional.name} and started the engagement process. You'll receive an email update shortly.`
                }
              </p>
            </div>

            <Button size="sm" className="gap-1.5">
              View Task <ArrowRight className="size-4" />
            </Button>

            {enquiryType !== 'simple' && (
              <>
                <Separator />
                <div className="border border-border/60 rounded-lg p-4 text-left space-y-3">
                  <div className="flex items-center gap-2">
                    <Folder className="size-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">Vault Documents</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Remember to upload any relevant documents to your Vault so {professional.name.split(' ')[0]} can access them.
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-xs gap-1.5">
                      <Upload className="size-3.5" /> Upload documents
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Go to Vault
                    </Button>
                  </div>
                </div>
              </>
            )}

            <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground">
              Close
            </Button>
          </div>
        </div>

        {/* Right sidebar */}
        <RightSidebar professional={professional} />
      </div>
    )
  }

  const totalSteps = getTotalSteps()

  return (
    <div className="fixed inset-0 z-50 bg-background flex">
      {/* Left: form area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 h-14 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <X className="size-4" />
              <span>Cancel</span>
            </button>
          </div>

          <StepProgress current={step} total={totalSteps} />

          <Button variant="ghost" size="sm" className="gap-1.5 text-sm text-muted-foreground">
            <HelpCircle className="size-4" /> Help
          </Button>
        </header>

        {/* Form content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-lg mx-auto">
            {/* ── Step 0: Enquiry type selection ── */}
            {step === 0 && !enquiryType && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">What type of enquiry?</h2>
                  <p className="text-sm text-muted-foreground mt-1">Select how you'd like to engage with {professional.name}</p>
                </div>

                <div className="space-y-3">
                  <EnquiryTypeOption
                    icon={<MessageSquare className="size-5" />}
                    title="Simple Enquiry"
                    desc="Send a quick message or question"
                    selected={false}
                    onClick={() => setEnquiryType('simple')}
                  />
                  <EnquiryTypeOption
                    icon={<FileText className="size-5" />}
                    title="Specific Enquiry"
                    desc="Detailed engagement with requirements and contract"
                    selected={false}
                    onClick={() => setEnquiryType('specific')}
                  />
                  <EnquiryTypeOption
                    icon={<Link2 className="size-5" />}
                    title="Link to Ethika Product or Service"
                    desc="Connect a specific product to this enquiry"
                    selected={false}
                    onClick={() => setEnquiryType('product')}
                  />
                </div>
              </div>
            )}

            {/* ── Simple enquiry: message ── */}
            {step === 0 && enquiryType === 'simple' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Simple Enquiry</h2>
                  <p className="text-sm text-muted-foreground mt-1">Send a message to {professional.name}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Your message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    placeholder="Describe your question or requirements..."
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring resize-none"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={() => setEnquiryType(null)} className="gap-1.5 text-muted-foreground">
                    <ChevronLeft className="size-4" /> Back
                  </Button>
                  <Button size="sm" onClick={handleSubmitSimple} disabled={!message.trim()} className="gap-1.5">
                    Send Enquiry <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ── Specific enquiry step 0: type selected, show continue ── */}
            {step === 0 && enquiryType === 'specific' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">What type of enquiry?</h2>
                  <p className="text-sm text-muted-foreground mt-1">Select how you'd like to engage with {professional.name}</p>
                </div>

                <div className="space-y-3">
                  <EnquiryTypeOption
                    icon={<MessageSquare className="size-5" />}
                    title="Simple Enquiry"
                    desc="Send a quick message or question"
                    selected={false}
                    onClick={() => setEnquiryType('simple')}
                  />
                  <EnquiryTypeOption
                    icon={<FileText className="size-5" />}
                    title="Specific Enquiry"
                    desc="Detailed engagement with requirements and contract"
                    selected={true}
                    onClick={() => {}}
                  />
                  <EnquiryTypeOption
                    icon={<Link2 className="size-5" />}
                    title="Link to Ethika Product or Service"
                    desc="Connect a specific product to this enquiry"
                    selected={false}
                    onClick={() => setEnquiryType('product')}
                  />
                </div>

                <div className="flex justify-end">
                  <Button size="sm" onClick={handleNext} className="gap-1.5">
                    Continue <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ── Product enquiry step 0: link product ── */}
            {step === 0 && enquiryType === 'product' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">What type of enquiry?</h2>
                  <p className="text-sm text-muted-foreground mt-1">Select how you'd like to engage with {professional.name}</p>
                </div>

                <div className="space-y-3">
                  <EnquiryTypeOption
                    icon={<MessageSquare className="size-5" />}
                    title="Simple Enquiry"
                    desc="Send a quick message or question"
                    selected={false}
                    onClick={() => { setEnquiryType('simple'); setLinkedProduct(null) }}
                  />
                  <EnquiryTypeOption
                    icon={<FileText className="size-5" />}
                    title="Specific Enquiry"
                    desc="Detailed engagement with requirements and contract"
                    selected={false}
                    onClick={() => { setEnquiryType('specific'); setLinkedProduct(null) }}
                  />
                  <EnquiryTypeOption
                    icon={<Link2 className="size-5" />}
                    title="Link to Ethika Product or Service"
                    desc="Connect a specific product to this enquiry"
                    selected={true}
                    onClick={() => {}}
                  />
                </div>

                {/* Product link area */}
                {!linkedProduct ? (
                  <button
                    onClick={() => setShowProductPicker(true)}
                    className="w-full border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-2 text-muted-foreground hover:border-brand-400 hover:bg-muted/20 transition-colors"
                  >
                    <Link2 className="size-5" />
                    <span className="text-sm font-medium">Add product</span>
                    <span className="text-xs">Click to browse and link a product or service</span>
                  </button>
                ) : (
                  <div className="border border-border/60 rounded-lg p-4 flex items-center gap-3">
                    <span className="text-lg">{linkedProduct.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{linkedProduct.title}</p>
                      <p className="text-xs text-muted-foreground">{linkedProduct.desc}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-destructive hover:text-destructive"
                      onClick={() => setLinkedProduct(null)}
                    >
                      Remove
                    </Button>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={() => { setEnquiryType(null); setLinkedProduct(null) }} className="gap-1.5 text-muted-foreground">
                    <ChevronLeft className="size-4" /> Back
                  </Button>
                  <Button size="sm" onClick={handleNext} disabled={!linkedProduct} className="gap-1.5">
                    Continue <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ── Step 1: Requirements (specific & product) ── */}
            {step === 1 && (enquiryType === 'specific' || enquiryType === 'product') && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Tell us about your needs</h2>
                  <p className="text-sm text-muted-foreground mt-1">Help us understand what you're looking for</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Type of support required?</label>
                    <Input
                      value={supportType}
                      onChange={(e) => setSupportType(e.target.value)}
                      placeholder="e.g. Contract review, governance advisory..."
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Preferred start date</label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Additional details (optional)</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      placeholder="Provide any additional context..."
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1.5 text-muted-foreground">
                    <ChevronLeft className="size-4" /> Back
                  </Button>
                  {enquiryType === 'product' ? (
                    <Button size="sm" onClick={() => setCompleted(true)} disabled={!supportType.trim()} className="gap-1.5">
                      Submit <ChevronRight className="size-4" />
                    </Button>
                  ) : (
                    <Button size="sm" onClick={handleNext} disabled={!supportType.trim()} className="gap-1.5">
                      Next <ChevronRight className="size-4" />
                    </Button>
                  )}
                </div>

                <button
                  onClick={() => setShowNotSure(true)}
                  className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
                >
                  Not sure what you need?
                </button>
              </div>
            )}

            {/* ── Step 2: Contract details (specific only) ── */}
            {step === 2 && enquiryType === 'specific' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Contract Details</h2>
                  <p className="text-sm text-muted-foreground mt-1">Help us determine the right engagement type</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Contract type</label>
                    <div className="space-y-2">
                      <label
                        className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                          contractType === 'simple' ? 'border-brand-600 bg-brand-50/50' : 'border-border/60 hover:bg-muted/20'
                        }`}
                      >
                        <input
                          type="radio"
                          name="contractType"
                          checked={contractType === 'simple'}
                          onChange={() => setContractType('simple')}
                          className="accent-brand-600"
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">Simple</p>
                          <p className="text-xs text-muted-foreground">Standard engagement with a clear scope</p>
                        </div>
                      </label>
                      <label
                        className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                          contractType === 'complex' ? 'border-brand-600 bg-brand-50/50' : 'border-border/60 hover:bg-muted/20'
                        }`}
                      >
                        <input
                          type="radio"
                          name="contractType"
                          checked={contractType === 'complex'}
                          onChange={() => setContractType('complex')}
                          className="accent-brand-600"
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">Complex</p>
                          <p className="text-xs text-muted-foreground">Multi-phase engagement or custom terms required</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Number of documents (estimated)</label>
                    <Input
                      type="number"
                      value={numDocuments}
                      onChange={(e) => setNumDocuments(e.target.value)}
                      placeholder="e.g. 5"
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1.5 text-muted-foreground">
                    <ChevronLeft className="size-4" /> Back
                  </Button>
                  <Button size="sm" onClick={() => setCompleted(true)} disabled={!contractType} className="gap-1.5">
                    Continue <ChevronRight className="size-4" />
                  </Button>
                </div>

                <button
                  onClick={() => setShowNotSure(true)}
                  className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
                >
                  Not sure what you need?
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <RightSidebar professional={professional} />

      {/* Modals */}
      {showProductPicker && (
        <ProductPicker
          onSelect={(product) => { setLinkedProduct(product); setShowProductPicker(false) }}
          onClose={() => setShowProductPicker(false)}
        />
      )}
      {showNotSure && (
        <NotSureModal professional={professional} onClose={() => setShowNotSure(false)} />
      )}
    </div>
  )
}

// ─── Shared sub-components ───────────────────────────────────────────────────

function RightSidebar({ professional }) {
  return (
    <div className="w-[340px] shrink-0 bg-brand-900 text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center space-y-6">
        <p className="text-sm text-brand-200">Requesting support or professional advice from:</p>

        <div className={`flex size-20 items-center justify-center rounded-full text-xl font-bold ${professional.color} ring-4 ring-brand-700`}>
          {professional.initials}
        </div>

        <div className="space-y-1">
          <p className="text-lg font-semibold">{professional.name}</p>
          <p className="text-sm text-brand-200">{professional.title} &middot; {professional.experience}</p>
        </div>

        <button className="flex items-center gap-1.5 text-sm text-brand-300 hover:text-white transition-colors underline underline-offset-2">
          <CalendarDays className="size-4" /> Book a meeting
        </button>
      </div>
    </div>
  )
}

function EnquiryTypeOption({ icon, title, desc, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 border rounded-lg p-4 text-left transition-colors ${
        selected ? 'border-brand-600 bg-brand-50/50' : 'border-border/60 hover:bg-muted/20'
      }`}
    >
      <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${
        selected ? 'bg-brand-100 text-brand-700' : 'bg-muted text-muted-foreground'
      }`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      {selected && (
        <div className="size-5 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
          <CheckCircle2 className="size-3.5 text-white" />
        </div>
      )}
    </button>
  )
}
