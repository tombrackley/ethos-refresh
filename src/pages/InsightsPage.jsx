import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import {
  Search, Bell, ChevronRight, Play, ThumbsUp, ThumbsDown,
  Zap, TrendingUp, Minus, TrendingDown, Quote, MessageCircle,
  Heart, ExternalLink, Bookmark, AlertTriangle, Clock,
  FileText, Scale, Shield, Gavel, Eye, ArrowRight, ArrowLeft,
  Share2, Send, Lock, Printer, CheckCircle2, Copy, GraduationCap,
  CheckSquare, ListTodo, Info,
} from 'lucide-react'
import tenant from '@/config/tenant'

// ─── Data ────────────────────────────────────────────────────────────────────

const t = tenant.pages?.insights ?? {}
const HERO = t.hero ?? {}
const ACTIONS = t.suggestedActions ?? []
const BRIEFING = t.briefingItems ?? []
const LISTEN = t.listenLearn ?? []
const FOCUS = t.focusAreas ?? []
const REGULATORY = t.regulatory ?? []
const COMMUNITY = t.communityVoices ?? []
const RISKS = t.emergingRisks ?? []

const TABS = ['For You', 'News', 'Regulatory', 'Articles', 'Podcasts', 'Webinars', 'Community']

const PRIORITY_VARIANT = {
  Critical: 'priority-critical',
  'High Priority': 'priority-high',
}

const URGENCY_DOT = {
  urgent:      'bg-red-500',
  recommended: 'bg-blue-500',
}

const URGENCY_VARIANT = {
  High: 'urgency-high',
  Elevated: 'urgency-elevated',
  Medium: 'urgency-medium',
  Low: 'urgency-low',
}

const REG_DOT = {
  critical: 'bg-red-500',
  high:     'bg-amber-500',
  medium:   'bg-yellow-500',
  low:      'bg-slate-400',
}

const REG_TYPE_ICON = {
  Legislation:   FileText,
  Enforcement:   Gavel,
  Deadline:      Clock,
  Consultation:  Eye,
  Guidance:      Scale,
}

const TREND_ICON = {
  rising:  TrendingUp,
  stable:  Minus,
  falling: TrendingDown,
}

const TREND_COLOR = {
  rising:  'text-red-600',
  stable:  'text-slate-500',
  falling: 'text-green-600',
}

const CONTENT_TYPE_ICON = {
  Regulatory:  { icon: Scale, bg: 'bg-blue-100', text: 'text-blue-900' },
  Enforcement: { icon: Gavel, bg: 'bg-red-100', text: 'text-red-900' },
  News:        { icon: FileText, bg: 'bg-slate-100', text: 'text-slate-700' },
  Articles:    { icon: FileText, bg: 'bg-violet-100', text: 'text-violet-900' },
  Podcasts:    { icon: Play, bg: 'bg-orange-100', text: 'text-orange-900' },
  Webinars:    { icon: Eye, bg: 'bg-emerald-100', text: 'text-emerald-900' },
}

const TYPE_VARIANT = {
  Regulatory:  'content-regulatory',
  Enforcement: 'content-enforcement',
  News:        'content-news',
  Articles:    'content-articles',
  Podcasts:    'content-podcasts',
  Webinars:    'content-webinars',
}

// ─── Impact badge variants ────────────────────────────────────────────────────

const IMPACT_STYLE = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-slate-100 text-slate-600',
}

const CHANGE_STATUS_STYLE = {
  New: 'resource-under-review',
  'In Force': 'resource-approved',
  Amended: 'content-regulatory',
  Consultation: 'content-news',
}

const ACTION_URGENCY_STYLE = {
  Urgent: 'text-red-600',
  Recommended: 'text-blue-600',
  Optional: 'text-muted-foreground',
}

// ─── Insight Detail ───────────────────────────────────────────────────────────

function InsightDetail({ insight, onBack }) {
  const [draftTab, setDraftTab] = useState('client')
  const [completedActions, setCompletedActions] = useState(new Set())
  const ct = CONTENT_TYPE_ICON[insight.contentType] || CONTENT_TYPE_ICON.News
  const CtIcon = ct.icon

  const toggleAction = (idx) => {
    setCompletedActions(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="max-w-7xl mx-auto px-6 pt-[60px] pb-6">

        {/* Back */}
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="size-4" />
          Back to insights
        </button>

        {/* Header */}
        <div className="space-y-5 mb-8">
          <div className={cn('flex size-11 items-center justify-center rounded', ct.bg)}>
            <CtIcon className={cn('size-6', ct.text)} strokeWidth={1.5} />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-[9px]">
              <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">{insight.title}</h1>
              <Badge variant={TYPE_VARIANT[insight.contentType]}>{insight.contentType}</Badge>
              {insight.impact_level && (
                <Badge className={IMPACT_STYLE[insight.impact_level]}>
                  {insight.impact_level.charAt(0).toUpperCase() + insight.impact_level.slice(1)} Impact
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{insight.excerpt}</p>
          </div>

          <div className="flex items-center gap-2.5">
            <Avatar className="size-8">
              <AvatarFallback className="text-xs bg-gray-200 text-gray-500">
                {insight.source.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground leading-tight">{insight.source}</p>
              <p className="text-xs text-muted-foreground leading-tight">
                {insight.id} · {insight.readTime} read · {insight.time}
                {insight.jurisdiction && ` · ${insight.jurisdiction}`}
              </p>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Two-column layout */}
        <div className="flex gap-8">

          {/* Left column */}
          <div className="flex-1 min-w-0 space-y-8">

            {/* Executive Summary */}
            {insight.executive_summary && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-foreground">Executive Summary</h2>
                <div className="bg-brand-50 border border-brand-200 rounded-lg p-5">
                  {insight.executive_summary.split('\n\n').map((para, i) => (
                    <p key={i} className={cn('text-sm text-gray-700 leading-relaxed', i > 0 && 'mt-3')}>{para}</p>
                  ))}
                </div>
                {insight.key_points?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Key Points</h3>
                    <ul className="space-y-1.5">
                      {insight.key_points.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-brand-600 mt-0.5">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <Separator />

            {/* What Has Changed */}
            {insight.what_has_changed?.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-foreground">What Has Changed</h2>
                <div className="space-y-3">
                  {insight.what_has_changed.map((change, i) => (
                    <div key={i} className="border border-border/60 rounded-lg p-4 bg-slate-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={CHANGE_STATUS_STYLE[change.status] || 'category'}>{change.status}</Badge>
                        <Badge variant="category">{change.change_type}</Badge>
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">{change.title}</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{change.description}</p>
                      <p className="text-xs text-muted-foreground mt-2 italic">{change.citation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {insight.what_has_changed?.length > 0 && <Separator />}

            {/* Why It Matters */}
            {insight.why_it_matters && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-foreground">Why It Matters</h2>

                {insight.why_it_matters.org_impact?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Impact on Your Organisation</h3>
                    <ul className="space-y-1.5">
                      {insight.why_it_matters.org_impact.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-brand-600 mt-0.5">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {insight.why_it_matters.client_impact?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Impact on Your Clients</h3>
                    <ul className="space-y-1.5">
                      {insight.why_it_matters.client_impact.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-brand-600 mt-0.5">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {insight.why_it_matters.risk_level && (
                  <div className="flex items-start gap-3 rounded-lg border px-4 py-3 bg-amber-50 border-amber-200">
                    <AlertTriangle className="size-4 shrink-0 mt-0.5 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Risk Level: {insight.why_it_matters.risk_level.charAt(0).toUpperCase() + insight.why_it_matters.risk_level.slice(1)}</p>
                      <p className="text-sm text-amber-700 mt-0.5">{insight.why_it_matters.risk_explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Separator />

            {/* Recommended Actions */}
            {insight.recommended_actions?.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-foreground">Recommended Actions</h2>
                  <span className="text-xs text-muted-foreground">{completedActions.size} of {insight.recommended_actions.length} completed</span>
                </div>
                <div className="space-y-2">
                  {insight.recommended_actions.map((action, i) => (
                    <div key={i} className={cn('flex items-start gap-3 rounded-lg border border-border/60 p-4 transition-colors', completedActions.has(i) ? 'bg-green-50/50' : 'bg-white')}>
                      <button onClick={() => toggleAction(i)} className="mt-0.5 shrink-0">
                        {completedActions.has(i) ? (
                          <CheckCircle2 className="size-5 text-green-600" />
                        ) : (
                          <div className="size-5 rounded-full border-2 border-border" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={cn('text-sm font-medium', completedActions.has(i) ? 'text-muted-foreground line-through' : 'text-foreground')}>{action.title}</p>
                          <span className={cn('text-xs font-medium', ACTION_URGENCY_STYLE[action.urgency])}>{action.urgency}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI-Generated Drafts */}
            {(insight.ai_draft_client_alert || insight.ai_draft_internal_brief) && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h2 className="text-base font-semibold text-foreground">AI-Generated Drafts</h2>
                  <p className="text-xs text-muted-foreground italic">AI-generated draft — review before sending</p>
                  <Tabs value={draftTab} onValueChange={setDraftTab}>
                    <TabsList className="h-9 bg-muted/50 p-0.5 rounded-lg gap-0.5">
                      {insight.ai_draft_client_alert && <TabsTrigger value="client" className="h-8 rounded-md text-sm px-4">Client Alert</TabsTrigger>}
                      {insight.ai_draft_internal_brief && <TabsTrigger value="internal" className="h-8 rounded-md text-sm px-4">Internal Brief</TabsTrigger>}
                    </TabsList>

                    {insight.ai_draft_client_alert && (
                      <TabsContent value="client" className="mt-4">
                        <div className="border border-border/60 rounded-lg p-5 bg-slate-50">
                          <pre className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">{insight.ai_draft_client_alert}</pre>
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/40">
                            <Button size="sm"><Send className="size-3.5 mr-1.5" /> Send Alert</Button>
                            <Button variant="outline" size="sm"><Copy className="size-3.5 mr-1.5" /> Copy</Button>
                          </div>
                        </div>
                      </TabsContent>
                    )}

                    {insight.ai_draft_internal_brief && (
                      <TabsContent value="internal" className="mt-4">
                        <div className="border border-border/60 rounded-lg p-5 bg-slate-50">
                          <pre className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">{insight.ai_draft_internal_brief}</pre>
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/40">
                            <Button size="sm"><Send className="size-3.5 mr-1.5" /> Send Brief</Button>
                            <Button variant="outline" size="sm"><Copy className="size-3.5 mr-1.5" /> Copy</Button>
                          </div>
                        </div>
                      </TabsContent>
                    )}
                  </Tabs>
                </div>
              </>
            )}
          </div>

          {/* Right column */}
          <div className="w-96 shrink-0 space-y-4 sticky top-6 self-start">

            {/* Actions panel */}
            <div className="border border-border/60 rounded-lg bg-gray-50/50 p-5 space-y-3">
              <h2 className="text-base font-semibold text-foreground">Actions</h2>
              <div className="space-y-1">
                {[
                  { icon: Share2, label: 'Share with colleague' },
                  { icon: Send, label: 'Push to Work' },
                  { icon: Lock, label: 'Save to Vault' },
                  { icon: Bookmark, label: 'Bookmark' },
                  { icon: Printer, label: 'Export / Print as PDF' },
                ].map(action => (
                  <button key={action.label} className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-foreground hover:bg-white transition-colors text-left">
                    <action.icon className="size-4 text-muted-foreground shrink-0" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Risk Considerations */}
            {insight.risk_considerations?.length > 0 && (
              <div className="border border-border/60 rounded-lg bg-white p-5 space-y-3">
                <h2 className="text-base font-semibold text-foreground">Risk Considerations</h2>
                <ul className="space-y-2">
                  {insight.risk_considerations.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <AlertTriangle className="size-3.5 text-amber-500 shrink-0 mt-0.5" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Linked Content */}
            {(insight.linked_content?.learning?.length > 0 || insight.linked_content?.policies?.length > 0) && (
              <div className="space-y-3">
                <h2 className="text-base font-semibold text-foreground">Linked Content</h2>
                {insight.linked_content.learning?.length > 0 && (
                  <div className="space-y-2">
                    {insight.linked_content.learning.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 py-2 px-2 hover:bg-slate-50 rounded-md transition-colors cursor-pointer">
                        <div className="flex size-7 items-center justify-center rounded shrink-0 bg-amber-100">
                          <GraduationCap className="size-3.5 text-amber-900" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.type} · {item.time}</p>
                        </div>
                        <ChevronRight className="size-4 text-muted-foreground/40 shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
                {insight.linked_content.policies?.length > 0 && (
                  <div className="space-y-2">
                    {insight.linked_content.policies.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 py-2 px-2 hover:bg-slate-50 rounded-md transition-colors cursor-pointer">
                        <div className="flex size-7 items-center justify-center rounded shrink-0 bg-cyan-100">
                          <FileText className="size-3.5 text-cyan-900" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.type}</p>
                        </div>
                        <ChevronRight className="size-4 text-muted-foreground/40 shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Board Discussion Prompt */}
            {insight.board_discussion && (
              <div className="border border-brand-200 rounded-lg bg-brand-50 p-5 space-y-3">
                <h2 className="text-sm font-semibold text-brand-800">Board Discussion Prompt</h2>
                <p className="text-sm text-brand-700">{insight.board_discussion.prompt}</p>
                <ul className="space-y-2">
                  {insight.board_discussion.questions.map((q, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-brand-800">
                      <span className="text-brand-600 mt-0.5 font-medium">{i + 1}.</span>
                      {q}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" size="sm" className="bg-white">
                  <Copy className="size-3.5 mr-1.5" /> Copy questions
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState('For You')
  const [searchQuery, setSearchQuery] = useState('')
  const [dismissed, setDismissed] = useState({})
  const [relevance, setRelevance] = useState({})
  const [dismissToast, setDismissToast] = useState(null)
  const [selectedInsight, setSelectedInsight] = useState(null)

  const today = new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const filteredBriefing = BRIEFING.filter(item => {
    if (dismissed[item.id]) return false
    if (activeTab !== 'For You' && activeTab !== 'Community' && item.contentType !== activeTab) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return item.title.toLowerCase().includes(q) || item.excerpt.toLowerCase().includes(q)
    }
    return true
  })

  function handleNotRelevant(id) {
    setDismissed(prev => ({ ...prev, [id]: true }))
    setRelevance(prev => ({ ...prev, [id]: 'not_relevant' }))
    setDismissToast(id)
    setTimeout(() => setDismissToast(null), 2500)
  }

  function handleRelevant(id) {
    setRelevance(prev => ({ ...prev, [id]: 'relevant' }))
  }

  // Split briefing: first 3 for featured grid, rest for feed
  const featuredItems = filteredBriefing.slice(0, 3)
  const feedItems = filteredBriefing.slice(3)

  // Detail view
  if (selectedInsight) {
    return (
      <div className="flex flex-1 overflow-hidden">
        <InsightDetail insight={selectedInsight} onBack={() => setSelectedInsight(null)} />
      </div>
    )
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto bg-white">
        <div className="max-w-7xl mx-auto px-6 pt-[60px] pb-6">

          {/* ── Header ── */}
          <div className="space-y-4 mb-6">
            <div>
              <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Insights</h1>
              <p className="text-sm text-muted-foreground mt-[9px]">{tenant.greeting}. {t.greetingSuffix ?? "Here's what matters today across your practice."}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search insights..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Bell className="size-4" />
              </Button>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="flex items-center gap-1 border-b border-border mb-8">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => tab !== 'Community' && setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
                  tab === activeTab
                    ? 'text-brand-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-800'
                    : tab === 'Community'
                    ? 'text-muted-foreground/50 cursor-default'
                    : 'text-muted-foreground hover:text-foreground cursor-pointer'
                }`}
              >
                {tab}
                {tab === 'Community' && (
                  <span className="ml-1.5 text-xs text-muted-foreground/40">Soon</span>
                )}
              </button>
            ))}
          </div>

          {/* ── Two-Column Layout ── */}
          <div className="flex gap-8">

            {/* ── Main Content ── */}
            <div className="flex-1 min-w-0 space-y-10">

              {/* Featured Grid — hero large + 2 smaller */}
              {featuredItems.length > 0 && (
                <div className="grid grid-cols-3 grid-rows-2 gap-3" style={{ gridTemplateRows: 'auto auto' }}>
                  {/* Large hero card — spans 2 cols, 2 rows */}
                  {featuredItems[0] && (
                    <div onClick={() => setSelectedInsight(featuredItems[0])} className="col-span-2 row-span-2 rounded-lg border border-border overflow-hidden bg-white group cursor-pointer hover:shadow-md transition-shadow relative">
                      <div className="relative h-full min-h-[340px] overflow-hidden">
                        <img src={HERO.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-5 left-5 right-5">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={TYPE_VARIANT[featuredItems[0].contentType]}>{featuredItems[0].contentType}</Badge>
                            <span className="text-xs text-white/80">{featuredItems[0].readTime}</span>
                          </div>
                          <h2 className="text-xl font-semibold text-white leading-snug mb-2">{featuredItems[0].title}</h2>
                          <p className="text-sm text-white/70">{featuredItems[0].source} · {featuredItems[0].time}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Two smaller cards stacked */}
                  {featuredItems.slice(1, 3).map(item => {
                    const ct = CONTENT_TYPE_ICON[item.contentType] || CONTENT_TYPE_ICON.News
                    return (
                      <div key={item.id} onClick={() => setSelectedInsight(item)} className="rounded-lg border border-border overflow-hidden bg-white group cursor-pointer hover:shadow-md transition-shadow flex flex-col">
                        <div className="relative h-32 overflow-hidden shrink-0">
                          <div className={`w-full h-full ${ct.bg} flex items-center justify-center`}>
                            <ct.icon className={`size-8 ${ct.text} opacity-30`} strokeWidth={1} />
                          </div>
                          <div className="absolute top-2.5 left-2.5">
                            <Badge variant={TYPE_VARIANT[item.contentType]}>{item.contentType}</Badge>
                          </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <p className="text-sm font-semibold text-foreground leading-snug group-hover:text-brand-800 transition-colors flex-1">{item.title}</p>
                          <p className="text-xs text-muted-foreground mt-2">{item.source} · {item.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Suggested Actions — compact strip */}
              {ACTIONS.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="size-4 text-brand-800" />
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suggested Actions</h2>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {ACTIONS.slice(0, 5).map((action, i) => (
                      <button key={i} className="flex items-center gap-1.5 text-sm text-foreground hover:text-brand-800 transition-colors px-3 py-1.5 rounded-full border border-border hover:border-brand-200 hover:bg-brand-50">
                        <span className={`size-1.5 rounded-full shrink-0 ${URGENCY_DOT[action.urgency]}`} />
                        {action.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Briefing Feed */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Latest Insights</h2>
                  <span className="text-xs text-muted-foreground">{today}</span>
                </div>

                <div>
                  {feedItems.map((item, idx) => {
                    const ct = CONTENT_TYPE_ICON[item.contentType] || CONTENT_TYPE_ICON.News
                    const CtIcon = ct.icon
                    return (
                      <div key={item.id} onClick={() => setSelectedInsight(item)} className={`flex items-start gap-3 py-4 cursor-pointer group/brief ${idx > 0 ? 'border-t border-border/40' : ''}`}>
                        <div className={`flex size-9 items-center justify-center rounded shrink-0 mt-0.5 ${ct.bg}`}>
                          <CtIcon className={`size-4 ${ct.text}`} strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Badge variant={TYPE_VARIANT[item.contentType]}>{item.contentType}</Badge>
                            <span className="text-xs text-muted-foreground">{item.source}</span>
                            {item.priority && (
                              <Badge variant={PRIORITY_VARIANT[item.priority]}>{item.priority}</Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium text-foreground leading-snug group-hover/brief:text-brand-800 transition-colors">{item.title}</p>
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-2">{item.excerpt}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-muted-foreground">{item.time}</span>
                            <span className="text-xs text-muted-foreground">{item.readTime}</span>
                            {item.tags.map(tag => (
                              <Badge key={tag} variant="category">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover/brief:opacity-100 transition-opacity">
                          <button
                            onClick={e => { e.stopPropagation(); handleRelevant(item.id) }}
                            className={`p-1.5 rounded-md hover:bg-green-50 transition-colors ${relevance[item.id] === 'relevant' ? 'text-green-600 bg-green-50' : 'text-muted-foreground'}`}
                            title="Relevant"
                          >
                            <ThumbsUp className="size-3.5" />
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); handleNotRelevant(item.id) }}
                            className="p-1.5 rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Not relevant"
                          >
                            <ThumbsDown className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                  {filteredBriefing.length === 0 && (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      No insights match your current filters.
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Listen & Learn */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Listen & Learn</h2>
                  <button className="text-xs text-brand-800 hover:underline font-medium">Browse all</button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {LISTEN.map((item, i) => (
                    <div key={i} className="rounded-lg border border-border bg-white overflow-hidden hover:shadow-md transition-shadow cursor-pointer group/media">
                      <div className="relative h-32 overflow-hidden">
                        <img src={item.image} alt="" className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="size-9 rounded-full bg-white/90 flex items-center justify-center">
                            <Play className="size-3.5 text-brand-800 ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute top-2.5 left-2.5">
                          <Badge variant={item.type === 'Podcast' ? 'content-podcasts' : 'content-webinars'}>{item.type}</Badge>
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <span className="text-xs text-white bg-black/60 px-1.5 py-0.5 rounded">{item.duration}</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-foreground leading-snug">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.speaker} · {item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Regulatory & Enforcement */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Regulatory & Enforcement</h2>
                  <button className="text-xs text-muted-foreground hover:text-foreground font-medium">Full register</button>
                </div>
                <div className="rounded-lg border border-border bg-white overflow-hidden">
                  {REGULATORY.map((item, i) => {
                    const RegIcon = REG_TYPE_ICON[item.type] ?? FileText
                    const isDeadlineSoon = item.deadline && new Date(item.deadline) - new Date() < 90 * 24 * 60 * 60 * 1000
                    return (
                      <div key={i} className={`flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer ${i > 0 ? 'border-t border-border/50' : ''}`}>
                        <span className={`size-2 rounded-full shrink-0 ${REG_DOT[item.urgency]}`} />
                        <RegIcon className="size-4 text-muted-foreground shrink-0" />
                        <Badge variant="outline" className="text-xs shrink-0">{item.type}</Badge>
                        <span className="text-xs text-muted-foreground shrink-0">{item.source}</span>
                        <p className="text-sm text-foreground flex-1 min-w-0 truncate">{item.title}</p>
                        <span className="text-xs text-muted-foreground shrink-0">{item.date}</span>
                        {item.deadline && (
                          <span className={`text-xs shrink-0 ${isDeadlineSoon ? 'text-amber-600 font-medium' : 'text-muted-foreground'}`}>
                            Due {item.deadline}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-border pt-4 pb-8">
                <p className="text-xs text-muted-foreground text-center">
                  ETHOS Insights · Curated for your practice · {today} · AI-assisted curation. Verify before acting on regulatory content. ·{' '}
                  <button className="text-brand-800 hover:underline">Sources</button>
                </p>
              </div>
            </div>

            {/* ── Right Sidebar ── */}
            <div className="w-72 shrink-0">
              <div className="sticky top-6 space-y-8">

                {/* Community Voices */}
                <div className="space-y-4">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Community Voices</h2>
                  <div className="space-y-4">
                    {COMMUNITY.slice(0, 3).map((item, i) => (
                      <div key={i} className="space-y-2">
                        <Quote className="size-3.5 text-brand-300" />
                        <p className="text-sm text-foreground leading-relaxed line-clamp-3">&ldquo;{item.quote}&rdquo;</p>
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.author}</p>
                          <p className="text-xs text-muted-foreground">{item.role}</p>
                        </div>
                        {i < 2 && <Separator />}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Your Focus Areas */}
                <div className="space-y-3">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Focus Areas</h2>
                  <div className="space-y-2">
                    {FOCUS.map((area, i) => (
                      <div key={i} className="rounded-lg border border-border bg-white px-3.5 py-3 hover:shadow-sm transition-shadow cursor-pointer">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-muted-foreground">{area.count} items</span>
                          <Badge variant={URGENCY_VARIANT[area.urgency]}>{area.urgency}</Badge>
                        </div>
                        <p className="text-sm font-medium text-foreground">{area.name}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{area.snippet}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Emerging Risks */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="size-3.5 text-amber-600" />
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Emerging Risks</h2>
                  </div>
                  <div>
                    {RISKS.map((risk, i) => {
                      const TrendIcon = TREND_ICON[risk.trend] ?? Minus
                      return (
                        <div key={i} className={`py-3 cursor-pointer group/risk ${i > 0 ? 'border-t border-border/40' : ''}`}>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-foreground group-hover/risk:text-brand-800 transition-colors">{risk.theme}</p>
                            <div className={`flex items-center gap-1 text-xs ${TREND_COLOR[risk.trend]}`}>
                              <TrendIcon className="size-3" />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">{risk.headline}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dismiss toast */}
        {dismissToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-foreground text-background px-4 py-2.5 rounded-lg shadow-lg text-sm animate-in fade-in slide-in-from-bottom-2 z-50">
            Got it — we&apos;ll show you less of this.
          </div>
        )}
      </div>
    </div>
  )
}
