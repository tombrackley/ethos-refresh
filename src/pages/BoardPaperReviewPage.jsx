import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Sparkles, ChevronLeft, AlertCircle, RefreshCw, BookOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import tenant from '@/config/tenant'
import { cn } from '@/lib/utils'

const PAPERS = tenant.pages.govern?.boardPapers ?? []

const SEVERITY_STYLE = {
  High:   { pill: 'border-rose-300 bg-rose-50 text-rose-800',    border: 'border-rose-200' },
  Medium: { pill: 'border-amber-300 bg-amber-50 text-amber-800', border: 'border-amber-200' },
  Low:    { pill: 'border-slate-300 bg-slate-50 text-slate-700', border: 'border-border' },
}

function NotFound({ message, onBack, backLabel = 'Back to board papers' }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-10">
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" size="sm" onClick={onBack}>
        <ChevronLeft className="size-4" /> {backLabel}
      </Button>
    </div>
  )
}

function IssueCard({ issue }) {
  const style = SEVERITY_STYLE[issue.severity] ?? SEVERITY_STYLE.Low
  return (
    <div className={cn('rounded-lg border bg-white p-4 space-y-2', style.border)}>
      <Badge variant="outline" className={cn('h-5 px-2 text-[11px] gap-1', style.pill)}>
        <AlertCircle className="size-3" />
        {issue.severity} — {issue.label}
      </Badge>
      <p className="text-sm text-foreground/80 leading-relaxed">{issue.body}</p>
    </div>
  )
}

function DocumentPreviewCard({ preview }) {
  return (
    <div className="relative max-w-3xl mx-auto bg-white border border-border/60 rounded-lg shadow-xs my-6 px-12 py-10 space-y-4">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Preview only — opens read-only</p>
      <div className="border-b border-border/60 pb-4 space-y-1.5">
        <h2 className="text-xl font-semibold text-foreground">{preview.heading}</h2>
        <p className="text-xs text-muted-foreground">{preview.meta}</p>
      </div>
      <div className="space-y-3 pb-12">
        {preview.body.map((line, i) => {
          const isHeading = /^\d+\./.test(line.trim())
          return isHeading ? (
            <h3 key={i} className="text-sm font-semibold text-foreground pt-2">{line}</h3>
          ) : (
            <p key={i} className="text-sm text-foreground/80 leading-relaxed">{line}</p>
          )
        })}
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 rounded-b-lg bg-gradient-to-t from-white via-white/80 to-transparent" />
    </div>
  )
}

function ValidatorPanel({ submission, onResubmit }) {
  const issues = submission.issues ?? []
  return (
    <aside className="w-[420px] shrink-0 border-l border-border/60 bg-muted/20 overflow-y-auto flex flex-col">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border/60 bg-background">
        <Sparkles className="size-4 text-blue-600 shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">Template validator</p>
          <p className="text-[11px] text-muted-foreground">Powered by Ethos AI</p>
        </div>
        <Badge variant="outline" className="ml-auto h-5 px-1.5 text-[10px] border-border bg-background text-muted-foreground">
          {issues.length} {issues.length === 1 ? 'issue' : 'issues'}
        </Badge>
      </div>

      <div className="flex-1 px-5 py-4 space-y-3">
        {issues.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No issues detected.</p>
        ) : issues.map(issue => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>

      <div className="border-t border-border/60 bg-background px-5 py-4 space-y-3">
        <div className="flex items-center gap-2">
          <Button size="sm" className="gap-1.5 flex-1 bg-blue-600 text-white hover:bg-blue-700" onClick={onResubmit}>
            <RefreshCw className="size-3.5" /> Resubmit for Review
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5">
            <BookOpen className="size-3.5" /> View guidelines
          </Button>
        </div>
        {submission.cosecNotice && (
          <p className="text-[11px] text-muted-foreground leading-relaxed">{submission.cosecNotice}</p>
        )}
      </div>
    </aside>
  )
}

export default function BoardPaperReviewPage() {
  const { paperId } = useParams()
  const navigate = useNavigate()
  const paper = useMemo(() => PAPERS.find(p => p.id === paperId), [paperId])

  if (!paper) {
    return <NotFound message="Paper not found." onBack={() => navigate('/govern/board-papers')} />
  }
  if (!paper.submission) {
    return <NotFound message="No review available for this paper." onBack={() => navigate('/govern/board-papers')} />
  }

  const submission = paper.submission

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-border/60 bg-background px-6 py-4">
        <button
          type="button"
          onClick={() => navigate('/govern/board-papers')}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2"
        >
          <ChevronLeft className="size-3.5" /> All board papers
        </button>
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-semibold tracking-tight text-foreground truncate">
                {submission.documentPreview?.heading ?? paper.title}
              </h1>
              <Badge
                variant="outline"
                className="h-6 px-2 text-[11px] border-rose-300 bg-rose-50 text-rose-800 gap-1 shrink-0"
              >
                <AlertCircle className="size-3" /> {submission.state}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Submitted by: <span className="text-foreground/80">{submission.submittedBy}</span>, {submission.submittedAgo}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto bg-muted/30 px-6">
          <DocumentPreviewCard preview={submission.documentPreview} />
        </main>
        <ValidatorPanel
          submission={submission}
          onResubmit={() => { /* no-op stub */ }}
        />
      </div>
    </div>
  )
}
