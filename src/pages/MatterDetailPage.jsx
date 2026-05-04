import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { AiSummaryBar } from '@/components/shared/AiSummaryBar'
import Feature from '@/components/Feature'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  ArrowLeft, Plus, FileText, Zap, X, TrendingUp, Lightbulb,
  ListChecks, Upload, Check, ChevronDown, Mail, ExternalLink, Clock, Eye, Sparkles,
} from 'lucide-react'
import tenant from '@/config/tenant'

const TIME_ENTRIES_ALL = tenant.pages.timeEntry?.todayEntries ?? []

const t = tenant.pages.matterDetail

// ─── Actors ───────────────────────────────────────────────────────────────────

const ACTORS = t.actors

// ─── Static mock data ─────────────────────────────────────────────────────────

const TASKS = t.tasks

const TASK_NOTES = {
  1: [
    { actor: 'SM', text: "Still working on the response — expecting to complete by end of today. Encountered portal access issues, IT have been notified.", time: 'Feb 18, 2:15pm' },
    { actor: 'JW', text: "This is now overdue. Please prioritise above all other current work and escalate blockers immediately.", time: 'Feb 18, 10:00am' },
    { actor: 'SM', text: "Court filing portal access issue raised with IT support — ticket #4421 open.", time: 'Feb 17, 4:30pm' },
  ],
  2: [
    { actor: 'JW', text: "Meeting confirmed for Feb 21 at 2pm. Client has received the pre-read strategy brief.", time: 'Feb 17, 11:20am' },
    { actor: 'SM', text: "Strategy brief sent to client for review ahead of the call.", time: 'Feb 16, 9:00am' },
  ],
  3: [
    { actor: 'SM', text: "Draft v2 now complete and sent to JW for partner review before submission.", time: 'Feb 18, 10:32am' },
    { actor: 'JW', text: "Draft v1 reviewed — comments left in the document, please revise section 4 before resubmitting.", time: 'Feb 17, 3:15pm' },
    { actor: 'SM', text: "Identified a potential conflict with the court filing schedule — flagged to JW for direction.", time: 'Feb 16, 9:00am' },
  ],
  4: [
    { actor: 'RL', text: "Queued. Will begin preparation once task 3 (settlement brief) is signed off.", time: 'Feb 18, 9:00am' },
  ],
  5: [
    { actor: 'SM', text: "This is blocked pending completion of the settlement brief. Will submit immediately after sign-off.", time: 'Feb 18, 9:15am' },
  ],
  6: [
    { actor: 'JW', text: "Scheduled for post-settlement phase. Pending outcome of the Feb 22 filing.", time: 'Feb 17, 10:00am' },
  ],
  7: [
    { actor: 'KL', text: "Will commence once the settlement terms are confirmed and documented.", time: 'Feb 17, 9:00am' },
  ],
}

const TASK_STATUS = {
  'Open':        { dot: 'bg-slate-300',   text: 'text-muted-foreground' },
  'In Progress': { dot: 'bg-blue-400',    text: 'text-blue-600'         },
  'Behind':      { dot: 'bg-red-400',     text: 'text-red-600'          },
  'Complete':    { dot: 'bg-emerald-400', text: 'text-emerald-600'      },
  'Blocked':     { dot: 'bg-amber-400',   text: 'text-amber-600'        },
}

const ALL_TASK_STATUSES = ['Open', 'In Progress', 'Behind', 'Complete', 'Blocked']

const SEVERITY_PILL = {
  Critical: 'bg-pink-300 text-slate-800',
  High:     'bg-amber-200 text-slate-800',
  Medium:   'bg-violet-100 text-slate-800',
  Low:      'bg-blue-100 text-slate-800',
}

const RISKS = t.risks

const RISK_STATUS = {
  'Open':      { dot: 'bg-red-400',     text: 'text-red-600'     },
  'Mitigated': { dot: 'bg-emerald-400', text: 'text-emerald-600' },
  'Monitored': { dot: 'bg-amber-400',   text: 'text-amber-700'   },
}

const DOCUMENTS = t.documents

const DOC_STATUS = {
  'Draft':        'text-amber-700 bg-amber-50 border-amber-200',
  'Final':        'text-emerald-700 bg-emerald-50 border-emerald-200',
  'Under Review': 'text-blue-700 bg-blue-50 border-blue-200',
  'Filed':        'text-muted-foreground bg-muted/60 border-border',
  'Complete':     'text-emerald-700 bg-emerald-50 border-emerald-200',
}

const FILE_COMPLETENESS = t.fileCompleteness

const TIMELINE = t.timeline

const MATTER_STATUS_STYLES = {
  'On Track': { dot: 'bg-emerald-500', text: 'text-muted-foreground', pill: 'bg-muted/60 border-border'      },
  'At Risk':  { dot: 'bg-amber-400',   text: 'text-amber-700',        pill: 'bg-amber-50 border-amber-200'   },
  'Behind':   { dot: 'bg-red-400',     text: 'text-red-600',          pill: 'bg-red-50 border-red-200'       },
  'On Hold':  { dot: 'bg-slate-300',   text: 'text-muted-foreground', pill: 'bg-muted/60 border-border'      },
  'Complete': { dot: 'bg-emerald-400', text: 'text-muted-foreground', pill: 'bg-muted/60 border-border'      },
}

const MATTER_AI_POINTS = t.aiPoints

// ─── Task Detail Data ─────────────────────────────────────────────────────────

const TASK_DETAILS = {
  1: {
    title: 'Contract Coach',
    objective: 'Review and provide recommendations on the Master Supply Agreement with Nexus Manufacturing Pty Ltd, focusing on liability clauses, termination provisions, and compliance with Australian Consumer Law.',
    scope: ['AI + Human Review', '10 documents', 'Standard delivery time', 'Include Risk & Remediation Report'],
    documents: ['Master-Supply-Agreement-v3.pdf', 'Schedule-A-Pricing.pdf', 'Nexus-Due-Diligence-Report.pdf'],
    requester: { name: 'Blackmores', person: 'Jane Doe', role: 'Admin' },
    adviser: { name: 'Josh Smith', role: 'Senior Legal Counsel', initials: 'JS' },
    status: 'Awaiting Review',
    timeline: [
      { step: 'Request Submitted', actor: 'Jane Doe — Admin', actorType: 'client', date: '14 Dec 2025, 10:12am', complete: true },
      { step: 'EthikaAI Review & Analysis', actor: 'Ethika', actorType: 'ethika', date: '14 Dec 2025, 10:12am', complete: true },
      { step: 'Ethika Analysis Provided', actor: 'Ethika', actorType: 'ethika', date: '14 Dec 2025, 10:12am', complete: true, file: 'Analysis-Report.pdf' },
      { step: 'Proposed Changes Reviewed and Delivered', actor: 'Josh Smith — Adviser', actorType: 'adviser', date: '14 Dec 2025, 10:12am', complete: true, file: 'Proposed-Changes.pdf' },
      { step: 'Client Revision Required', actor: 'Blackmores', actorType: 'client', date: null, complete: false, current: true, file: 'Revised-Agreement.pdf', statusLabel: 'Awaiting review' },
      { step: 'Final Review', actor: 'Josh Smith — Adviser', actorType: 'adviser', date: null, complete: false },
      { step: 'Task complete', actor: null, date: null, complete: false },
    ],
  },
  2: {
    title: 'Settlement Strategy Review',
    objective: 'Prepare and review settlement strategy for Henderson v Clarke, including risk assessment and recommended negotiation approach.',
    scope: ['Human Review', '5 documents', 'Priority delivery', 'Include Settlement Recommendation'],
    documents: ['Settlement-Brief-v2.pdf', 'Risk-Assessment.pdf'],
    requester: { name: 'Henderson Group', person: 'David Henderson', role: 'Director' },
    adviser: { name: 'Sarah Mitchell', role: 'Senior Associate', initials: 'SM' },
    status: 'In Progress',
    timeline: [
      { step: 'Request Submitted', actor: 'David Henderson — Director', actorType: 'client', date: '10 Feb 2026, 9:00am', complete: true },
      { step: 'EthikaAI Review & Analysis', actor: 'Ethika', actorType: 'ethika', date: '10 Feb 2026, 9:05am', complete: true },
      { step: 'Adviser Review', actor: 'Sarah Mitchell — Adviser', actorType: 'adviser', date: null, complete: false, current: true, statusLabel: 'In progress' },
      { step: 'Client Delivery', actor: 'Henderson Group', actorType: 'client', date: null, complete: false },
      { step: 'Task complete', actor: null, date: null, complete: false },
    ],
  },
}

// Fallback task detail for tasks without specific data
const DEFAULT_TASK_DETAIL = {
  objective: 'Review and complete the assigned task according to matter requirements.',
  scope: ['Standard Review', 'Standard delivery time'],
  documents: [],
  requester: { name: 'Blackmores', person: 'Jane Doe', role: 'Admin' },
  adviser: { name: 'James Ward', role: 'Partner', initials: 'JW' },
  status: 'Open',
  timeline: [
    { step: 'Request Submitted', actor: 'Jane Doe — Admin', actorType: 'client', date: '15 Feb 2026, 9:00am', complete: true },
    { step: 'In Progress', actor: null, date: null, complete: false, current: true },
    { step: 'Task complete', actor: null, date: null, complete: false },
  ],
}

// ─── Task Detail Panel ────────────────────────────────────────────────────────

function TaskDetailPanel({ task, taskStatus, onClose }) {
  const detail = TASK_DETAILS[task.id] || { ...DEFAULT_TASK_DETAIL, title: task.task }
  const [showAllDocs, setShowAllDocs] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const visibleDocs = showAllDocs ? detail.documents : detail.documents.slice(0, 3)
  const ts = TASK_STATUS[taskStatus] ?? TASK_STATUS['Open']

  return (
    <div className="flex flex-1 overflow-hidden bg-white">
      <div className="flex-1 overflow-auto px-6 pt-[60px] pb-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Back button */}
          <button onClick={onClose} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-4" /> Back
          </button>

          {/* Title + status + actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">{detail.title || task.task}</h1>
              <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded border border-border whitespace-nowrap ${ts.text}`}>
                <span className={`size-1.5 rounded-full ${ts.dot}`} />
                {taskStatus}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowPreview(true)}>
                <Eye className="size-4" /> Preview
              </Button>
              <Button size="sm" className="gap-1.5">
                <ExternalLink className="size-4" /> Share to Client
              </Button>
            </div>
          </div>

          <div className="flex gap-6">
          {/* Left — Task content */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Task Summary card */}
            <div className="rounded-[6px] border border-[#E2E8F0] bg-white p-6 space-y-4">
              <p className="text-[20px] leading-[28px] tracking-[-0.6px] font-medium text-[#0a0a0a]">Task Summary</p>

              <div className="space-y-1">
                <p className="text-sm font-medium text-brand-700">Objective</p>
                <p className="text-sm text-foreground leading-relaxed">{detail.objective}</p>
              </div>

              {detail.scope.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-brand-700">Scope</p>
                  <ul className="list-disc list-inside text-sm text-foreground space-y-0.5">
                    {detail.scope.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {detail.documents.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-brand-700">Documents Supplied</p>
                  <div className="space-y-1.5">
                    {visibleDocs.map((doc, i) => (
                      <div key={i} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border bg-muted/20">
                        <FileText className="size-4 text-muted-foreground shrink-0" />
                        <span className="text-sm text-foreground">{doc}</span>
                      </div>
                    ))}
                  </div>
                  {detail.documents.length > 3 && !showAllDocs && (
                    <button onClick={() => setShowAllDocs(true)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <ChevronDown className="size-4" /> Show all
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Progress Timeline card */}
            <div className="rounded-[6px] border border-[#E2E8F0] bg-white p-6 space-y-6">
              <p className="text-[20px] leading-[28px] tracking-[-0.6px] font-medium text-[#0a0a0a]">Progress Timeline</p>

              <div>
                {detail.timeline.map((step, i) => {
                  const isLast = i === detail.timeline.length - 1
                  return (
                    <div key={i} className="flex gap-4">
                      {/* Timeline indicator */}
                      <div className="flex flex-col items-center w-5 shrink-0">
                        {step.complete ? (
                          <div className="size-5 rounded-full bg-[#D1FAE5] flex items-center justify-center shrink-0">
                            <Check className="size-3 text-brand-900" strokeWidth={2.5} />
                          </div>
                        ) : step.current ? (
                          <div className="size-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                            <div className="size-2.5 rounded-full bg-blue-500" />
                          </div>
                        ) : (
                          <div className="size-5 flex items-center justify-center shrink-0">
                            <div className="size-2.5 rounded-full bg-[#e2e8f0]" />
                          </div>
                        )}
                        {!isLast && (
                          <div className={`w-px flex-1 min-h-[24px] ${step.complete ? 'bg-[#D1FAE5]' : 'bg-[#e2e8f0]'}`} />
                        )}
                      </div>

                      {/* Content */}
                      <div className={`pb-7 flex-1 min-w-0 -mt-0.5 ${!step.complete && !step.current ? 'opacity-35' : ''}`}>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-foreground">{step.step}</p>
                          {step.date && <span className="text-xs text-muted-foreground shrink-0">{step.date}</span>}
                          {step.statusLabel && !step.date && <span className="text-xs text-brand-700 font-medium shrink-0">{step.statusLabel}</span>}
                        </div>
                        {step.actor && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className={`size-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-semibold text-white ${
                              step.actorType === 'ethika' ? 'bg-brand-700' : step.actorType === 'adviser' ? 'bg-[#94a3b8]' : 'bg-[#34d399]'
                            }`}>
                              {step.actorType === 'ethika' ? 'E' : step.actor.charAt(0)}
                            </span>
                            <span className="text-xs text-muted-foreground">{step.actor}</span>
                          </div>
                        )}
                        {step.file && (
                          <div className="flex items-center gap-2.5 mt-2.5 px-3 py-2 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] w-fit">
                            <FileText className="size-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">{step.file}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right — Sidebar */}
          <div className="w-[376px] shrink-0 space-y-4">
            {/* Action card */}
            <div className="rounded-lg border border-border bg-white p-4 space-y-4">
              <span className="inline-flex items-center text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5">
                {detail.status}
              </span>

              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-brand-100 text-brand-800 text-sm font-semibold">
                    {detail.requester.person.split(' ').map(w => w[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">{detail.requester.name}</p>
                  <p className="text-xs text-muted-foreground">{detail.requester.person} — {detail.requester.role}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">What's needed</p>
                <p className="text-sm text-foreground leading-relaxed">Review the proposed changes and either accept, request modifications, or upload a revised version.</p>
              </div>

              {detail.documents.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border">
                  <FileText className="size-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground flex-1 truncate">{detail.documents[0]}</span>
                  <ExternalLink className="size-3.5 text-muted-foreground shrink-0" />
                </div>
              )}

              <Button className="w-full gap-1.5">
                <Upload className="size-4" /> Upload Revised Document
              </Button>
              <Button variant="outline" className="w-full text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                Accept Changes
              </Button>
            </div>

            {/* Adviser card */}
            <div className="rounded-lg border border-border bg-white p-4 space-y-3">
              <p className="text-xs text-muted-foreground">Adviser</p>
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-slate-200 text-slate-700 text-sm font-semibold">
                    {detail.adviser.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">{detail.adviser.name}</p>
                  <p className="text-xs text-muted-foreground">{detail.adviser.role}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full gap-1.5">
                <Mail className="size-4" /> Email
              </Button>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Client Preview Overlay */}
      {showPreview && createPortal(
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          {/* Preview header */}
          <div className="flex items-center justify-between px-8 py-4 border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-brand-800 flex items-center justify-center">
                <span className="text-xs font-bold text-white">E</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Client Preview</p>
                <p className="text-xs text-muted-foreground">This is how {detail.requester.name} will see this task</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>
              Close Preview
            </Button>
          </div>

          {/* Preview content */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-3xl mx-auto py-10 px-6 space-y-8">
              {/* Title */}
              <div className="space-y-2">
                <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded border border-border ${ts.text}`}>
                  <span className={`size-1.5 rounded-full ${ts.dot}`} />
                  {taskStatus}
                </span>
                <h1 className="text-3xl font-medium tracking-[-0.045em] text-foreground">{detail.title || task.task}</h1>
                <p className="text-sm text-muted-foreground">Adviser: {detail.adviser.name} · {detail.adviser.role}</p>
              </div>

              {/* What's needed */}
              <div className="rounded-lg border border-brand-200 bg-brand-50/30 p-5 space-y-3">
                <p className="text-sm font-medium text-foreground">Action Required</p>
                <p className="text-sm text-foreground leading-relaxed">Review the proposed changes and either accept, request modifications, or upload a revised version of the agreement.</p>
                <div className="flex items-center gap-2">
                  <Button size="sm">
                    <Upload className="size-4 mr-1.5" /> Upload Revised Document
                  </Button>
                  <Button variant="outline" size="sm" className="text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                    Accept Changes
                  </Button>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-3">
                <p className="text-lg font-medium text-foreground">Summary</p>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Objective</p>
                  <p className="text-sm text-foreground leading-relaxed">{detail.objective}</p>
                </div>
                {detail.scope.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Scope</p>
                    <ul className="list-disc list-inside text-sm text-foreground space-y-0.5">
                      {detail.scope.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              {/* Documents */}
              {detail.documents.length > 0 && (
                <div className="space-y-3">
                  <p className="text-lg font-medium text-foreground">Documents</p>
                  <div className="space-y-2">
                    {detail.documents.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-3 rounded-lg border border-border">
                        <div className="flex items-center gap-2.5">
                          <FileText className="size-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">{doc}</span>
                        </div>
                        <ExternalLink className="size-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="space-y-4">
                <p className="text-lg font-medium text-foreground">Progress</p>
                <div>
                  {detail.timeline.map((step, i) => {
                    const isLast = i === detail.timeline.length - 1
                    return (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center w-5 shrink-0">
                          {step.complete ? (
                            <div className="size-5 rounded-full bg-[#D1FAE5] flex items-center justify-center shrink-0">
                              <Check className="size-3 text-brand-900" strokeWidth={2.5} />
                            </div>
                          ) : step.current ? (
                            <div className="size-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                              <div className="size-2.5 rounded-full bg-blue-500" />
                            </div>
                          ) : (
                            <div className="size-5 flex items-center justify-center shrink-0">
                              <div className="size-2.5 rounded-full bg-[#e2e8f0]" />
                            </div>
                          )}
                          {!isLast && (
                            <div className={`w-px flex-1 min-h-[20px] ${step.complete ? 'bg-[#D1FAE5]' : 'bg-[#e2e8f0]'}`} />
                          )}
                        </div>
                        <div className={`pb-5 flex-1 -mt-0.5 ${!step.complete && !step.current ? 'opacity-35' : ''}`}>
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-foreground">{step.step}</p>
                            {step.date && <span className="text-xs text-muted-foreground">{step.date}</span>}
                            {step.statusLabel && !step.date && <span className="text-xs text-brand-700 font-medium">{step.statusLabel}</span>}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

// ─── AI Panel ─────────────────────────────────────────────────────────────────

function MatterAiPanel({ matter, onClose }) {
  return (
    <div className="flex flex-col h-full border-l border-border/60 bg-background">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-brand-800 text-white">
            <Zap className="size-3" />
          </div>
          <span className="text-sm font-semibold">Ethos AI</span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4 border-b border-border/60">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp className="size-3.5 text-brand-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Matter Analysis</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">{matter.name} · {matter.ref}</p>
          <ul className="space-y-2.5">
            {MATTER_AI_POINTS.map((pt, i) => (
              <li key={i} className="flex gap-2 text-xs text-foreground/80 leading-relaxed">
                <span className="mt-0.5 shrink-0 text-muted-foreground">›</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-4 py-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Lightbulb className="size-3.5 text-brand-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suggested Actions</span>
          </div>
          <ul className="space-y-3">
            {[
              'Escalate filing delay with SM — identify blocker and resolve before court deadline',
              'Request deposition transcripts vol. 2 from opposing counsel immediately',
              'Brief JW on client contact requirements for Feb 20 check-in call',
            ].map((action, i) => (
              <li key={i} className="border border-border/60 rounded p-3 space-y-2">
                <p className="text-xs leading-relaxed text-foreground/90">{action}</p>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border/60 rounded px-2 py-1 transition-colors">
                  <ListChecks className="size-3" /> Add to Tasks
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MatterDetailPage({ matter, onBack }) {
  const [rightPanel, setRightPanel] = useState(null) // null | 'ai' | 'task'
  const [selectedTask, setSelectedTask] = useState(null)
  const [taskStatuses, _SetTaskStatuses] = useState(
    Object.fromEntries(TASKS.map(t => [t.id, t.status]))
  )

  const ss = MATTER_STATUS_STYLES[matter.status] ?? MATTER_STATUS_STYLES['On Hold']
  const openTasks = TASKS.filter(t => taskStatuses[t.id] !== 'Complete').length
  const completedTasks = TASKS.filter(t => taskStatuses[t.id] === 'Complete').length

  function openTask(task) {
    setSelectedTask(task)
  }

  function closePanel() {
    setRightPanel(null)
    setSelectedTask(null)
  }

  // Full-page task detail view
  if (selectedTask) {
    return (
      <TaskDetailPanel
        task={selectedTask}
        taskStatus={taskStatuses[selectedTask.id]}
        onClose={() => setSelectedTask(null)}
      />
    )
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-5">

          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <button
                onClick={onBack}
                className="mb-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-3" /> Matters
              </button>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">{matter.name}</h1>
                <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded border whitespace-nowrap ${ss.pill} ${ss.text}`}>
                  <span className={`size-1.5 rounded-full shrink-0 ${ss.dot}`} />
                  {matter.status}
                </span>
                {matter.priority === 'Critical' && (
                  <span className="text-xs border border-red-200 bg-red-50 text-red-600 rounded px-2 py-0.5 whitespace-nowrap">Critical</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                <span>{matter.client}</span>
                <span className="opacity-30">·</span>
                <span>{matter.ref}</span>
                <span className="opacity-30">·</span>
                <span>{matter.practice}</span>
                <span className="opacity-30">·</span>
                <span>Due {matter.due}</span>
                <span className="opacity-30">·</span>
                <span>{matter.value}</span>
                <span className="opacity-30">·</span>
                <span className={`inline-flex size-5 items-center justify-center rounded-full text-xs font-semibold ${matter.leadColor}`}>
                  {matter.lead}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                <Upload className="size-3.5" /> Upload
              </Button>
              <Button size="sm" className="h-8 text-xs gap-1.5">
                <Plus className="size-3.5" /> Add Task
              </Button>
            </div>
          </div>

          {/* AI Summary Bar */}
          <Feature flag="FEATURE_AI_SUMMARY_BAR">
            <AiSummaryBar points={MATTER_AI_POINTS} onOpenDrawer={() => setRightPanel('ai')} />
          </Feature>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList variant="line" className="border-b border-border w-full justify-start">
              <TabsTrigger value="overview"       className="h-9 px-4 text-sm grow-0 basis-auto">Overview</TabsTrigger>
              <TabsTrigger value="tasks"          className="h-9 px-4 text-sm grow-0 basis-auto">Tasks</TabsTrigger>
              <TabsTrigger value="documents"      className="h-9 px-4 text-sm grow-0 basis-auto">Documents</TabsTrigger>
              <TabsTrigger value="time"           className="h-9 px-4 text-sm grow-0 basis-auto">Time</TabsTrigger>
              <TabsTrigger value="communications" className="h-9 px-4 text-sm grow-0 basis-auto">Communications</TabsTrigger>
              <TabsTrigger value="ai-assistant"   className="h-9 px-4 text-sm grow-0 basis-auto">AI Assistant</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 focus-visible:outline-none space-y-5">

          {/* KPI Row */}
          <div className="grid grid-cols-4 divide-x divide-border/60 border border-border/60 rounded overflow-hidden bg-white">
            <div className="px-5 py-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1.5">Progress</p>
              <p className="text-2xl font-semibold text-foreground tabular-nums">{matter.progress}%</p>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-foreground/30" style={{ width: `${matter.progress}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                {matter.progress < 33 ? 'Early stage' : matter.progress < 66 ? 'Progressing' : matter.progress < 100 ? 'Near completion' : 'Complete'}
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1.5">Open Tasks</p>
              <p className="text-2xl font-semibold text-foreground tabular-nums">{openTasks}</p>
              <p className="text-xs text-muted-foreground mt-1.5">{completedTasks} of {TASKS.length} complete</p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1.5">Due Date</p>
              <p className={`text-2xl font-semibold tabular-nums ${matter.status === 'Behind' ? 'text-red-500' : 'text-foreground'}`}>
                {matter.due}
              </p>
              <p className={`text-xs mt-1.5 font-medium ${matter.status === 'Behind' ? 'text-red-500' : 'text-muted-foreground'}`}>
                {matter.status === 'Behind' ? 'Overdue' : matter.status === 'On Hold' ? 'On hold' : 'On schedule'}
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1.5">Matter Value</p>
              <p className="text-2xl font-semibold text-foreground">{matter.value}</p>
              <p className="text-xs text-muted-foreground mt-1.5">{matter.practice}</p>
            </div>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-5 gap-4 items-start">

            {/* Left: Tasks + Timeline */}
            <div className="col-span-3 space-y-4">

              {/* Tasks table */}
              <div className="border border-border/60 rounded overflow-hidden bg-white">
                <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                  <p className="text-sm font-medium text-foreground">Tasks & Next Actions</p>
                  <span className="text-xs text-muted-foreground">{openTasks} open · {completedTasks} complete</span>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border">
                      <TableHead className="text-xs font-medium text-muted-foreground pl-4">Task</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Priority</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Due</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground text-right pr-4">Owner</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TASKS.map((t) => {
                      const status = taskStatuses[t.id]
                      const ts = TASK_STATUS[status] ?? TASK_STATUS['Open']
                      const actorColor = ACTORS[t.assignee]?.color ?? 'bg-muted text-muted-foreground'
                      const isSelected = rightPanel === 'task' && selectedTask?.id === t.id
                      return (
                        <TableRow
                          key={t.id}
                          onClick={() => openTask(t)}
                          className={`border-border cursor-pointer transition-colors ${isSelected ? 'bg-muted/60' : 'hover:bg-muted/40'}`}
                        >
                          <TableCell className="pl-4 py-2.5 text-sm text-foreground">{t.task}</TableCell>
                          <TableCell className="py-2.5">
                            {t.priority === 'Critical'
                              ? <span className="text-xs border border-red-200 bg-red-50 text-red-600 rounded px-2 py-0.5 whitespace-nowrap">Critical</span>
                              : <span className={`text-xs ${t.priority === 'High' ? 'text-amber-600' : 'text-muted-foreground'}`}>{t.priority}</span>
                            }
                          </TableCell>
                          <TableCell className={`py-2.5 text-xs whitespace-nowrap ${status === 'Behind' ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                            {t.due}
                          </TableCell>
                          <TableCell className="py-2.5">
                            <span className={`inline-flex items-center gap-1.5 text-xs whitespace-nowrap ${ts.text}`}>
                              <span className={`size-1.5 rounded-full shrink-0 ${ts.dot}`} />
                              {status}
                            </span>
                          </TableCell>
                          <TableCell className="py-2.5 text-right pr-4">
                            <span className={`inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold ${actorColor}`}>
                              {t.assignee}
                            </span>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Timeline */}
              <div className="border border-border/60 rounded overflow-hidden bg-white">
                <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                  <p className="text-sm font-medium text-foreground">Matter Timeline</p>
                  <span className="text-xs text-muted-foreground">{TIMELINE.length} events</span>
                </div>
                <div className="px-5 py-4">
                  <div className="relative pl-3 space-y-0">
                    {TIMELINE.map((event, i) => (
                      <div key={i} className="relative flex gap-4 pb-4 last:pb-0">
                        {i < TIMELINE.length - 1 && (
                          <div className="absolute left-0 top-2 bottom-0 w-px bg-border/60" />
                        )}
                        <div className={`relative z-10 mt-1.5 size-2 rounded-full shrink-0 -ml-[3px] ${i === 0 ? 'bg-brand-600' : 'bg-border'}`} />
                        <div className="flex-1 min-w-0 -mt-0.5">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-xs text-foreground/85 leading-relaxed">{event.text}</p>
                            <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                              {event.actor && (
                                <span className={`inline-flex size-5 items-center justify-center rounded-full text-xs font-semibold ${ACTORS[event.actor]?.color ?? 'bg-muted text-muted-foreground'}`}>
                                  {event.actor}
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground whitespace-nowrap">{event.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Risks + Documents + File Completeness */}
            <div className="col-span-2 space-y-4">

              {/* Risks & Issues */}
              <div className="border border-border/60 rounded overflow-hidden bg-white">
                <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                  <p className="text-sm font-medium text-foreground">Risks & Issues</p>
                  <span className="text-xs text-muted-foreground">{RISKS.filter(r => r.status === 'Open').length} open</span>
                </div>
                <div className="divide-y divide-border/40">
                  {RISKS.map((r, i) => {
                    const rs = RISK_STATUS[r.status] ?? RISK_STATUS['Open']
                    return (
                      <div key={i} className="flex items-start gap-3 px-5 py-3">
                        <span className={`mt-1.5 size-1.5 rounded-full shrink-0 ${rs.dot}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground/85 leading-snug">{r.risk}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`inline-flex items-center px-1.5 h-4 rounded text-xs font-medium ${SEVERITY_PILL[r.severity]}`}>
                              {r.severity}
                            </span>
                            <span className={`text-xs ${rs.text}`}>{r.status}</span>
                          </div>
                        </div>
                        <span className={`inline-flex size-5 items-center justify-center rounded-full text-xs font-semibold shrink-0 mt-0.5 ${ACTORS[r.owner]?.color ?? 'bg-muted text-muted-foreground'}`}>
                          {r.owner}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Documents */}
              <div className="border border-border/60 rounded overflow-hidden bg-white">
                <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                  <p className="text-sm font-medium text-foreground">Documents</p>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Upload className="size-3" /> Upload
                  </button>
                </div>
                <div className="divide-y divide-border/40">
                  {DOCUMENTS.map((doc, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-2.5">
                      <FileText className="size-3.5 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.type} · {doc.date}</p>
                      </div>
                      <span className={`inline-flex items-center border rounded px-1.5 h-4 text-xs font-medium whitespace-nowrap shrink-0 ${DOC_STATUS[doc.status]}`}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* File Completeness */}
              <div className="border border-border/60 rounded overflow-hidden bg-white">
                <div className="px-5 py-3 border-b border-border/60">
                  <p className="text-sm font-medium text-foreground">File Completeness</p>
                </div>
                <div className="px-5 py-4 space-y-3.5">
                  {FILE_COMPLETENESS.map((f) => (
                    <div key={f.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-foreground/80">{f.label}</span>
                        <span className={`text-xs font-medium tabular-nums ${f.pct === 100 ? 'text-emerald-600' : f.pct < 50 ? 'text-amber-600' : 'text-foreground'}`}>
                          {f.pct}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${f.pct === 100 ? 'bg-emerald-400' : f.pct < 50 ? 'bg-amber-300' : 'bg-foreground/25'}`}
                          style={{ width: `${f.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

            </TabsContent>

            <TabsContent value="tasks" className="mt-6 focus-visible:outline-none">
              <div className="rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center">
                <p className="text-sm font-medium text-foreground">Tasks</p>
                <p className="text-xs text-muted-foreground mt-1">Full tasks list — see Overview tab for the current task table.</p>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-6 focus-visible:outline-none">
              <div className="rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center">
                <p className="text-sm font-medium text-foreground">Documents</p>
                <p className="text-xs text-muted-foreground mt-1">Document explorer — see Overview tab for the document panel.</p>
              </div>
            </TabsContent>

            <TabsContent value="time" className="mt-6 focus-visible:outline-none">
              {(() => {
                const matterEntries = TIME_ENTRIES_ALL.filter(e => e.matterId === matter.id)
                if (matterEntries.length === 0) {
                  return (
                    <div className="rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center">
                      <p className="text-sm font-medium text-foreground">No time entries</p>
                      <p className="text-xs text-muted-foreground mt-1">No recorded time on this matter today.</p>
                    </div>
                  )
                }
                return (
                  <div className="border border-border/60 rounded bg-white overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                      <p className="text-sm font-medium text-foreground">Today's time entries</p>
                      <span className="text-xs text-muted-foreground">{matterEntries.length} entries</span>
                    </div>
                    <div className="divide-y divide-border/60">
                      {matterEntries.map(e => (
                        <div key={e.id} className="flex items-center gap-3 px-5 py-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground truncate">{e.description}</p>
                          </div>
                          <span className="text-sm text-foreground tabular-nums shrink-0">
                            {Math.floor(e.durationMinutes / 60) > 0 ? `${Math.floor(e.durationMinutes / 60)}h ` : ''}{e.durationMinutes % 60}m
                          </span>
                          <span className={`text-xs shrink-0 ${e.billable ? 'text-emerald-700' : 'text-muted-foreground'}`}>{e.billable ? 'Billable' : 'Non-billable'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}
            </TabsContent>

            <TabsContent value="communications" className="mt-6 focus-visible:outline-none">
              <div className="rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center">
                <p className="text-sm font-medium text-foreground">Communications</p>
                <p className="text-xs text-muted-foreground mt-1">Coming soon.</p>
              </div>
            </TabsContent>

            <TabsContent value="ai-assistant" className="mt-6 focus-visible:outline-none">
              <div className="rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center space-y-3">
                <Sparkles className="size-6 text-brand-700 mx-auto" />
                <p className="text-sm font-medium text-foreground">AI Assistant</p>
                <p className="text-xs text-muted-foreground">Open the assistant panel for tailored insights on this matter.</p>
                <Button size="sm" onClick={() => setRightPanel('ai')} className="gap-1.5">
                  <Sparkles className="size-3.5" /> Open assistant
                </Button>
              </div>
            </TabsContent>

          </Tabs>

        </div>
      </div>

      {/* Right panel — AI only */}
      <div className={`shrink-0 overflow-hidden transition-all duration-300 ${rightPanel === 'ai' ? 'w-[360px]' : 'w-0'}`}>
        {rightPanel === 'ai' && (
          <MatterAiPanel matter={matter} onClose={closePanel} />
        )}
      </div>
    </div>
  )
}
