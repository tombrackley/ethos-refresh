import { useState } from 'react'
import {
  ChevronRight, Sparkles, FileText, TrendingUp, AlertTriangle, Check,
  BookOpen, GraduationCap, Target, Users, BarChart2, Shield, Brain, Lightbulb, X,
} from 'lucide-react'

const PRIORITY_STYLE = {
  high:   'bg-[#fef2f2] text-[#7f1d1d] border border-[#fecaca]',
  medium: 'bg-amber-50 text-amber-800 border border-amber-200',
  low:    'bg-green-50 text-green-800 border border-green-200',
}

const TYPE_ICONS = {
  legislation: FileText,
  update: TrendingUp,
  risk: AlertTriangle,
  recommendation: Sparkles,
  journey: BookOpen,
  course: GraduationCap,
  skill: Target,
  peer: Users,
  analytics: BarChart2,
  compliance: Shield,
  framework: Brain,
  insight: Lightbulb,
}

/**
 * @param {Object} props
 * @param {string} props.subtitle - Panel subtitle (e.g. "Learning intelligence")
 * @param {React.ReactNode} props.contextLine - Summary line below header
 * @param {Array} props.tabs - Tab definitions: [{ key, label, filter }] where filter is (item) => boolean
 * @param {Array} props.suggestions - Suggestion items
 */
export default function EthosAIPanel({
  suggestions = [],
  subtitle = 'Regulatory intelligence',
  contextLine = '',
  tabs = null,
  onAdd = null,
}) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [addedItems, setAddedItems] = useState(new Set())

  // Default tabs if none provided — derive from suggestion types
  const resolvedTabs = tabs || [
    { key: 'all', label: 'All', filter: () => true },
    ...(() => {
      const types = [...new Set(suggestions.map(s => s.tab || s.type))]
      return types.slice(0, 4).map(t => ({
        key: t,
        label: t.charAt(0).toUpperCase() + t.slice(1),
        filter: (item) => (item.tab || item.type) === t,
      }))
    })(),
  ]

  const tabCounts = Object.fromEntries(
    resolvedTabs.map(t => [t.key, t.key === 'all' ? suggestions.length : suggestions.filter(t.filter).length])
  )

  const activeFilter = resolvedTabs.find(t => t.key === activeTab)
  const filtered = activeTab === 'all' ? suggestions : suggestions.filter(activeFilter?.filter || (() => true))

  return (
    <>
      {/* Collapsed tab */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed right-2 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 text-white px-2 py-4 rounded-l-[8px] shadow-lg hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(180deg, #1a3a35 0%, #2d7a6a 100%)' }}
        >
          <Sparkles className="size-4" />
          <span className="text-xs font-semibold tracking-wider" style={{ writingMode: 'vertical-lr' }}>ETHOS AI</span>
        </button>
      )}

      {/* Drawer */}
      <div
        className={`fixed top-[10px] right-[10px] bottom-[10px] z-50 transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-[calc(100%+10px)]'
        }`}
        style={{ width: 380 }}
      >
        <div className="h-full bg-[#f1f5f9] rounded-[14px] border border-[rgba(229,229,229,0.6)] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white px-5 pt-4 pb-3 border-b border-[rgba(229,229,229,0.6)] shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(67.5deg, #A7FFD9 17%, #C3FFD8 49%, #B9FFE3 82%)' }}>
                  <Sparkles className="size-3.5 text-[#153e40]" />
                </div>
                <p className="text-base font-semibold text-[#002022]">Ethos AI</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="size-7 flex items-center justify-center rounded-sm hover:bg-muted/50 text-muted-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Context line */}
          <div className="bg-white px-5 py-3 border-b border-[rgba(229,229,229,0.6)] shrink-0">
            <p className="text-xs text-[#64748b] leading-relaxed">
              {contextLine || (
                <>Showing <span className="font-semibold text-[#0a0a0a]">{suggestions.length} suggestions</span> based on your profile and activity.</>
              )}
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white px-5 py-3 border-b border-[rgba(229,229,229,0.6)] shrink-0">
            <div className="flex items-center gap-1 flex-wrap">
              {resolvedTabs.map(t => {
                const isActive = activeTab === t.key
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#d1fae5] border border-[#34d399] text-[#153e40]'
                        : 'text-[#64748b] hover:bg-muted/50'
                    }`}
                  >
                    {t.label}
                    <span className={`text-xs font-medium ${isActive ? 'text-[#153e40]' : 'text-[#64748b]/60'}`}>
                      {tabCounts[t.key]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Suggestions list */}
          <div className="flex-1 overflow-auto px-3 py-4 space-y-2">
            {filtered.map((item, i) => {
              const Icon = TYPE_ICONS[item.type] || FileText
              const typeLabel = item.typeLabel || item.type.charAt(0).toUpperCase() + item.type.slice(1)
              return (
                <div key={i} className="bg-white rounded-[8px] border border-[#e2e8f0] p-3 space-y-2.5">
                  {/* Type + priority */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Icon className="size-3.5 text-[#64748b]" />
                      <span className="text-xs font-medium text-[#64748b]">
                        {typeLabel}
                      </span>
                    </div>
                    {item.priority && (
                      <span className={`text-[10px] font-medium capitalize px-1.5 py-0.5 rounded-[6px] ${PRIORITY_STYLE[item.priority]}`}>
                        {item.priority}
                      </span>
                    )}
                  </div>

                  {/* Title + Description */}
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-foreground">{item.title}</h4>
                    <p className="text-xs text-[#64748b] leading-relaxed">{item.description}</p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    {(item.status === 'added' || addedItems.has(i)) ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium transition-all">
                        <Check className="size-3.5" /> Added
                      </span>
                    ) : item.status === 'new' ? (
                      <button
                        className="text-xs text-[#64748b] font-medium hover:text-foreground transition-colors"
                        onClick={() => {
                          setAddedItems(prev => new Set([...prev, i]))
                          if (onAdd) onAdd(item)
                        }}
                      >
                        + Action here
                      </button>
                    ) : item.status === 'review' ? (
                      <span className="text-xs text-[#64748b] font-medium">
                        + Action here
                      </span>
                    ) : (
                      <span className="text-xs text-[#64748b] font-medium">
                        + Action here
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/10"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}
