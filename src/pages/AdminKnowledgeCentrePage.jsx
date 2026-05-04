import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus, Search, X, MoreHorizontal, Pencil, Trash2, Eye,
  ChevronDown, ChevronRight, ChevronLeft, Globe, Settings,
  LayoutList, GripVertical, History, Link2, CheckCircle2,
  CircleDashed, Sparkles,
} from 'lucide-react'

// ─── Constants ──────────────────────────────────────────────────────────────

const METADATA_CATEGORIES = [
  'Governance & Duties', 'Legislation & Regulation', 'Substantive Law',
  'Ethics & Professional Standards', 'Practice Management', 'Technology & AI',
]

const METADATA_TYPES = ['Handbook', 'Guide', 'Framework', 'Course', 'External']

const METADATA_SKILLS = [
  'Governance & Board Effectiveness', 'Ethics & Professional Responsibility',
  'Risk & Compliance', 'Legal & Regulatory', 'Data Privacy & Protection',
  'ESG Reporting Frameworks', 'AML/CTF',
]

const SKILL_TO_CATEGORY = {
  'Governance & Board Effectiveness': 'Governance & Duties',
  'Ethics & Professional Responsibility': 'Ethics & Professional Standards',
  'Legal & Regulatory': 'Legislation & Regulation',
  'Risk & Compliance': 'Technology & AI',
  'Data Privacy & Protection': 'Technology & AI',
  'ESG Reporting Frameworks': 'Technology & AI',
  'AML/CTF': 'Practice Management',
}

const TYPE_LABELS = { handbook: 'Handbook', guide: 'Guide', framework: 'Framework', course: 'Course', external: 'External' }

// ─── Mock Data ──────────────────────────────────────────────────────────────

const LIBRARY_ITEMS = [
  { id: 'kc-1', title: 'Board Governance Handbook', type: 'handbook', skills: ['Governance & Board Effectiveness', 'Ethics & Professional Responsibility'], source: 'Organisation', updated: 'Updated today', status: 'published', estimatedTime: '3 hrs', cpdRelevant: true, cpdPoints: 6, quizCount: 18 },
  { id: 'kc-2', title: 'Compliance Procedures Manual', type: 'handbook', skills: ['Risk & Compliance', 'Legal & Regulatory'], source: 'Organisation', updated: 'Updated 2 days ago', status: 'published', estimatedTime: '2.5 hrs', cpdRelevant: true, cpdPoints: 4, quizCount: 12 },
  { id: 'kc-3', title: 'Data Privacy & Protection Guide', type: 'guide', skills: ['Data Privacy & Protection'], source: 'Organisation', updated: 'Updated 1 week ago', status: 'published', estimatedTime: '1.5 hrs', cpdRelevant: false, quizCount: 6 },
  { id: 'kc-4', title: 'Modern Slavery Reporting Guide', type: 'guide', skills: ['Ethics & Professional Responsibility', 'Legal & Regulatory'], source: 'Organisation', updated: 'Updated 4 days ago', status: 'draft', estimatedTime: '2 hrs', cpdRelevant: false, quizCount: 0 },
  { id: 'kc-5', title: 'Risk Management Framework', type: 'framework', skills: ['Risk & Compliance'], source: 'Organisation', updated: 'Updated 3 days ago', status: 'published', estimatedTime: '2 hrs', cpdRelevant: false, quizCount: 8 },
  { id: 'kc-6', title: 'AML/CTF Compliance Fundamentals', type: 'course', skills: ['AML/CTF', 'Risk & Compliance'], source: 'Organisation', updated: 'Updated 2 weeks ago', status: 'published', estimatedTime: '3.5 hrs', cpdRelevant: true, cpdPoints: 5, quizCount: 15 },
  { id: 'kc-7', title: 'Board Effectiveness Workshop', type: 'course', skills: ['Governance & Board Effectiveness'], source: 'Organisation', updated: 'Updated 1 week ago', status: 'draft', estimatedTime: '4 hrs', cpdRelevant: true, cpdPoints: 8, quizCount: 0 },
  { id: 'kc-8', title: 'ASX Corporate Governance Principles', type: 'external', skills: ['Governance & Board Effectiveness'], source: 'Organisation', updated: 'Updated 5 days ago', status: 'published', estimatedTime: '2 hrs', cpdRelevant: false, quizCount: 0, externalUrl: 'https://www.asx.com.au/regulation/corporate-governance-council' },
  { id: 'kc-9', title: 'AICD Director Obligations Webinar', type: 'external', skills: ['Governance & Board Effectiveness', 'Legal & Regulatory'], source: 'Organisation', updated: 'Updated 3 days ago', status: 'published', estimatedTime: '1.5 hrs', cpdRelevant: true, cpdPoints: 3, quizCount: 4, externalUrl: 'https://aicd.companydirectors.com.au' },
  { id: 'kc-10', title: 'ESG Reporting Framework', type: 'framework', skills: ['ESG Reporting Frameworks', 'Governance & Board Effectiveness'], source: 'Organisation', updated: 'Updated 1 week ago', status: 'draft', estimatedTime: '2.5 hrs', cpdRelevant: false, quizCount: 3 },
]

const PARTS = {
  'kc-1': [
    { id: 1, title: 'Introduction', topics: [
      { id: 't1-1', title: 'Welcome & Overview', version: 1, status: 'live', quizCount: 3 },
      { id: 't1-2', title: 'How to Use This Handbook', version: 2, status: 'live', quizCount: 2 },
    ]},
    { id: 2, title: 'Director Duties', topics: [
      { id: 't2-1', title: 'Core Statutory Duties', version: 3, status: 'live', quizCount: 5 },
      { id: 't2-2', title: 'Fiduciary Obligations', version: 2, status: 'draft', quizCount: 4 },
      { id: 't2-3', title: 'Duty of Care & Diligence', version: 1, status: 'live', quizCount: 4 },
    ]},
    { id: 3, title: 'Board Operations', topics: [
      { id: 't3-1', title: 'Meeting Procedures', version: 1, status: 'live', quizCount: 0 },
      { id: 't3-2', title: 'Decision Making', version: 1, status: 'draft', quizCount: 0 },
    ]},
  ],
  'kc-2': [
    { id: 1, title: 'Compliance Framework', topics: [
      { id: 'tc1-1', title: 'Regulatory Landscape', version: 2, status: 'live', quizCount: 3 },
      { id: 'tc1-2', title: 'Obligations Register', version: 1, status: 'live', quizCount: 4 },
    ]},
    { id: 2, title: 'Monitoring & Reporting', topics: [
      { id: 'tc2-1', title: 'Compliance Testing', version: 1, status: 'live', quizCount: 2 },
      { id: 'tc2-2', title: 'Breach Management', version: 1, status: 'draft', quizCount: 3 },
    ]},
  ],
  'kc-5': [
    { id: 1, title: 'Risk Identification', topics: [
      { id: 'tr1-1', title: 'Risk Categories', version: 1, status: 'live', quizCount: 4 },
      { id: 'tr1-2', title: 'Risk Assessment Methods', version: 2, status: 'live', quizCount: 4 },
    ]},
    { id: 2, title: 'Risk Controls', topics: [
      { id: 'tr2-1', title: 'Control Framework', version: 1, status: 'live', quizCount: 0 },
    ]},
  ],
}

// ─── Handbook Manager ───────────────────────────────────────────────────────

function HandbookManagerPage({ item, parts: initialParts, onBack }) {
  const [parts, setParts] = useState(initialParts)
  const [expandedParts, setExpandedParts] = useState(parts.length > 0 ? [parts[0].id] : [])
  const [addPartOpen, setAddPartOpen] = useState(false)
  const [newPartTitle, setNewPartTitle] = useState('')
  const [newPartSubText, setNewPartSubText] = useState('')
  const [editingTopic, setEditingTopic] = useState(null)
  const [editorTab, setEditorTab] = useState('content')
  const [metadataOpen, setMetadataOpen] = useState(false)

  const isExternal = item.type === 'external'
  const totalParts = parts.length
  const totalTopics = parts.reduce((a, p) => a + p.topics.length, 0)

  const togglePart = (id) => {
    setExpandedParts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div className="space-y-6">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="size-4" /> Back
        </button>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">{item.title}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage content and quizzes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setMetadataOpen(true)}>
            <Settings className="size-4" /> Settings
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Eye className="size-4" /> Preview
          </Button>
        </div>
      </div>

      {isExternal ? (
        <div className="border border-dashed border-border rounded-lg bg-muted/30 p-10 flex flex-col items-center justify-center gap-3 text-center">
          <Globe className="size-8 text-muted-foreground/40" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">This is an external module</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Configure the external URL in <button onClick={() => setMetadataOpen(true)} className="text-brand-700 hover:underline">Settings</button>
            </p>
          </div>
        </div>
      ) : parts.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg bg-white p-12 flex flex-col items-center justify-center gap-4 text-center">
          <div className="size-14 rounded-full bg-brand-50 flex items-center justify-center">
            <LayoutList className="size-7 text-brand-600" />
          </div>
          <div className="max-w-sm space-y-2">
            <h3 className="text-lg font-medium text-foreground">Start building your content</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Organise your content into parts, then add topics within each part.
            </p>
          </div>
          <Button className="gap-1.5 mt-2" onClick={() => setAddPartOpen(true)}>
            <Plus className="size-4" /> Add First Part
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{totalParts} parts &middot; {totalTopics} topics</span>
            <p className="text-sm text-muted-foreground">Last updated: {item.updated}</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{totalParts} parts – drag to reorder</p>
            <Button size="sm" className="gap-1.5" onClick={() => setAddPartOpen(true)}>
              <Plus className="size-4" /> Add Part
            </Button>
          </div>

          <div className="space-y-3">
            {parts.map((part) => {
              const isExpanded = expandedParts.includes(part.id)
              return (
                <div key={part.id} className="border border-border/60 rounded-lg overflow-hidden bg-white">
                  <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => togglePart(part.id)}>
                    <GripVertical className="size-4 text-muted-foreground/40 shrink-0 cursor-grab" />
                    {isExpanded ? <ChevronDown className="size-4 text-muted-foreground shrink-0" /> : <ChevronRight className="size-4 text-muted-foreground shrink-0" />}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-sm font-medium text-foreground">Part {part.id}</span>
                      <span className="text-sm text-foreground">{part.title}</span>
                      <span className="text-xs text-muted-foreground ml-1">({part.topics.length} topic{part.topics.length !== 1 ? 's' : ''})</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground shrink-0" onClick={e => e.stopPropagation()}>
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2 text-sm"><Pencil className="size-3.5" /> Rename part</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-sm" onClick={() => {
                          const topicId = `t${part.id}-${part.topics.length + 1}-${Date.now()}`
                          setParts(prev => prev.map(p =>
                            p.id === part.id
                              ? { ...p, topics: [...p.topics, { id: topicId, title: 'New Topic', version: 1, status: 'draft', quizCount: 0 }] }
                              : p
                          ))
                          if (!expandedParts.includes(part.id)) setExpandedParts(prev => [...prev, part.id])
                        }}><Plus className="size-3.5" /> Add topic</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-sm text-destructive" onClick={() => {
                          setParts(prev => prev.filter(p => p.id !== part.id))
                        }}><Trash2 className="size-3.5" /> Delete part</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-border/60">
                      {part.topics.map((topic) => (
                        <div key={topic.id} className="flex items-center gap-3 px-4 py-2.5 pl-12 hover:bg-muted/20 transition-colors border-b border-border/30 last:border-b-0">
                          <GripVertical className="size-3.5 text-muted-foreground/30 shrink-0 cursor-grab" />
                          <span className="text-sm text-brand-700 hover:underline cursor-pointer flex-1 min-w-0 truncate" onClick={() => { setEditingTopic(topic); setEditorTab('content') }}>
                            {topic.title}
                          </span>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${topic.status === 'live' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                              v{topic.version} {topic.status === 'live' ? 'Live' : 'Draft'}
                            </span>
                            <span className="text-xs text-muted-foreground">Quiz ({topic.quizCount})</span>
                            <button className="text-muted-foreground hover:text-foreground transition-colors"><History className="size-3.5" /></button>
                          </div>
                        </div>
                      ))}
                      <div className="px-4 py-2.5 pl-12 border-t border-border/30">
                        <button
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => {
                            const topicId = `t${part.id}-${part.topics.length + 1}-${Date.now()}`
                            setParts(prev => prev.map(p =>
                              p.id === part.id
                                ? { ...p, topics: [...p.topics, { id: topicId, title: 'New Topic', version: 1, status: 'draft', quizCount: 0 }] }
                                : p
                            ))
                          }}
                        >
                          <Plus className="size-3.5" /> Add topic
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Add Part Modal */}
      {addPartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAddPartOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-[480px] p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-foreground">Add Part</h2>
              <button onClick={() => setAddPartOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X className="size-5" /></button>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Part Title</label>
              <Input value={newPartTitle} onChange={e => setNewPartTitle(e.target.value)} placeholder="Eg. Introduction" className="h-10" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Sub Text</label>
              <textarea value={newPartSubText} onChange={e => setNewPartSubText(e.target.value)} placeholder="Enter part sub text" rows={3} className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-ring focus:ring-ring/50 focus:ring-[3px] shadow-xs resize-y" />
            </div>
            <Button className="w-full" disabled={!newPartTitle.trim()} onClick={() => {
              const newId = parts.length > 0 ? Math.max(...parts.map(p => p.id)) + 1 : 1
              setParts(prev => [...prev, { id: newId, title: newPartTitle.trim(), topics: [] }])
              setExpandedParts(prev => [...prev, newId])
              setAddPartOpen(false)
              setNewPartTitle('')
              setNewPartSubText('')
            }}>Add Part</Button>
          </div>
        </div>
      )}

      {/* Topic Editor Overlay */}
      {editingTopic && createPortal(
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between px-5 h-14 border-b border-border/60 shrink-0">
            <div className="flex items-center gap-4">
              <button onClick={() => { setEditingTopic(null); setEditorTab('content') }} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="size-5" />
              </button>
              <div>
                <p className="text-sm font-medium text-foreground leading-tight">{editingTopic.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Pencil className="size-3" /> Editing v{editingTopic.status === 'draft' ? editingTopic.version : editingTopic.version + 1} draft
                  </span>
                  <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    v{editingTopic.status === 'live' ? editingTopic.version : editingTopic.version - 1} live
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center bg-muted/50 rounded-lg p-0.5">
              <button onClick={() => setEditorTab('content')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${editorTab === 'content' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                Edit Content
              </button>
              <button onClick={() => setEditorTab('quiz')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${editorTab === 'quiz' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                Quiz Questions ({editingTopic.quizCount})
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground"><Eye className="size-4" /> Preview Changes</Button>
              <Button variant="outline" size="sm">Save Draft</Button>
              <Button size="sm" className="gap-1.5"><CheckCircle2 className="size-4" /> Publish</Button>
            </div>
          </div>

          {editorTab === 'content' ? (
            <div className="flex-1 overflow-auto flex flex-col">
              <div className="flex items-center gap-1 px-5 py-2.5 border-b border-border/60 shrink-0">
                <select className="h-8 rounded border border-border bg-white px-2 text-xs text-foreground cursor-pointer focus:outline-none">
                  <option>Paragraph</option>
                  <option>Heading 1</option>
                  <option>Heading 2</option>
                  <option>Heading 3</option>
                </select>
                <select className="h-8 w-14 rounded border border-border bg-white px-2 text-xs text-foreground cursor-pointer focus:outline-none ml-1">
                  <option>16</option>
                  <option>14</option>
                  <option>18</option>
                  <option>20</option>
                </select>
                <div className="w-px h-5 bg-border/60 mx-1" />
                <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-foreground font-bold text-sm">B</button>
                <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-foreground italic text-sm">I</button>
                <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-foreground underline text-sm">U</button>
                <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-foreground line-through text-sm">S</button>
                <div className="w-px h-5 bg-border/60 mx-1" />
                <button className="size-8 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground"><Link2 className="size-4" /></button>
              </div>
              <div className="flex-1 overflow-auto">
                <div className="max-w-3xl mx-auto py-10 px-6">
                  <div className="prose prose-sm max-w-none focus:outline-none min-h-[500px]" contentEditable suppressContentEditableWarning>
                    <h2>Content for: {editingTopic.title}</h2>
                    <p>Start writing your content here. This is a rich text editor where you can format text, add links, and structure your content.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-auto p-6">
              <div className="max-w-3xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-foreground">Quiz Questions</h2>
                  <Button size="sm" className="gap-1.5"><Plus className="size-4" /> Add Question</Button>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3">
                  <Sparkles className="size-5 text-brand-700 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-brand-800">AI-generated quizzes coming soon</p>
                    <p className="text-xs text-brand-700">AI will suggest quiz questions from your content for you to review and edit.</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{editingTopic.quizCount} questions configured for this topic.</p>
                {Array.from({ length: editingTopic.quizCount }, (_, i) => (
                  <div key={i} className="border border-border/60 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">Question {i + 1}</p>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="size-7 text-muted-foreground"><Pencil className="size-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="size-7 text-muted-foreground"><Trash2 className="size-3.5" /></Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Sample question placeholder for quiz item {i + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>,
        document.body,
      )}

      {/* Settings Modal */}
      {metadataOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMetadataOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-[640px] max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 shrink-0">
              <h2 className="text-lg font-semibold text-foreground">Settings</h2>
              <button onClick={() => setMetadataOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X className="size-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              <div className="space-y-4">
                <p className="text-sm font-medium text-foreground">General</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-medium text-muted-foreground">Title</label>
                    <Input value={item.title} readOnly className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Category</label>
                    <select className="w-full h-9 rounded-md border border-border bg-white px-3 text-sm text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring">
                      {METADATA_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Content Type</label>
                    <select defaultValue={item.type} className="w-full h-9 rounded-md border border-border bg-white px-3 text-sm text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring">
                      {METADATA_TYPES.map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}
                    </select>
                  </div>
                  {item.type === 'external' && (
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-xs font-medium text-muted-foreground">External URL</label>
                      <Input defaultValue={item.externalUrl || ''} placeholder="https://..." className="h-9 text-sm" />
                    </div>
                  )}
                </div>
              </div>
              <div className="border-t border-border/40" />
              <div className="space-y-4">
                <p className="text-sm font-medium text-foreground">Time & CPD</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Estimated Time</label>
                    <Input defaultValue={item.estimatedTime} className="h-9 text-sm" />
                  </div>
                  <div />
                  <div className="flex items-center justify-between col-span-2">
                    <div>
                      <label className="text-sm font-medium text-foreground">CPD Relevant</label>
                      <p className="text-xs text-muted-foreground">Enable to assign CPD points</p>
                    </div>
                    <Switch defaultChecked={item.cpdRelevant} />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border/60 shrink-0 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setMetadataOpen(false)}>Cancel</Button>
              <Button onClick={() => setMetadataOpen(false)}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function AdminKnowledgeCentrePage() {
  const [search, setSearch] = useState('')
  const [libraryItems, setLibraryItems] = useState(LIBRARY_ITEMS)
  const [selectedItem, setSelectedItem] = useState(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  // Create form state
  const [createTitle, setCreateTitle] = useState('')
  const [createCategory, setCreateCategory] = useState('')
  const [createType, setCreateType] = useState('handbook')
  const [createExternalUrl, setCreateExternalUrl] = useState('')
  const [createSkills, setCreateSkills] = useState([])
  const [createSkillSearch, setCreateSkillSearch] = useState('')
  const [createEstimatedTime, setCreateEstimatedTime] = useState('')
  const [createCpdRelevant, setCreateCpdRelevant] = useState(false)
  const [createCpdPoints, setCreateCpdPoints] = useState('')

  const resetCreateForm = () => {
    setCreateTitle(''); setCreateCategory(''); setCreateType('handbook'); setCreateExternalUrl('')
    setCreateSkills([]); setCreateSkillSearch(''); setCreateEstimatedTime(''); setCreateCpdRelevant(false); setCreateCpdPoints('')
  }

  const handleCreateContent = () => {
    if (!createTitle.trim()) return
    const newItem = {
      id: `kc-${Date.now()}`, title: createTitle.trim(), type: createType, skills: createSkills,
      source: 'Organisation', updated: 'Just now', status: 'draft', estimatedTime: createEstimatedTime || '',
      cpdRelevant: createCpdRelevant, cpdPoints: createCpdRelevant ? (parseInt(createCpdPoints) || 0) : undefined,
      quizCount: 0, externalUrl: createType === 'external' ? createExternalUrl : undefined,
    }
    setLibraryItems(prev => [newItem, ...prev])
    setCreateModalOpen(false)
    resetCreateForm()
    setSelectedItem(newItem)
  }

  if (selectedItem) {
    const itemParts = PARTS[selectedItem.id] || []
    return (
      <HandbookManagerPage
        item={selectedItem}
        parts={itemParts}
        onBack={() => setSelectedItem(null)}
      />
    )
  }

  const filtered = libraryItems.filter(item => {
    if (search.trim() && !item.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const publishedCount = libraryItems.filter(i => i.status === 'published').length
  const draftCount = libraryItems.filter(i => i.status === 'draft').length

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Knowledge Centre</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage knowledge centre content</p>
          </div>
          <Button className="gap-1.5" onClick={() => setCreateModalOpen(true)}>
            <Plus className="size-4" /> Add Content
          </Button>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Total items</span>
            <span className="font-semibold text-foreground">{libraryItems.length}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Published</span>
            <span className="font-semibold text-foreground">{publishedCount}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="size-2 rounded-full bg-gray-400" />
            <span className="text-muted-foreground">Draft</span>
            <span className="font-semibold text-foreground">{draftCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title..." className="pl-9" />
          </div>
        </div>

        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quiz:</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(item => {
                const category = item.skills?.[0] ? (SKILL_TO_CATEGORY[item.skills[0]] || item.skills[0]) : '—'
                return (
                  <TableRow key={item.id} className="cursor-pointer hover:bg-muted/30" onClick={() => setSelectedItem(item)}>
                    <TableCell className="pl-5 font-medium text-brand-700 hover:underline">{item.title}</TableCell>
                    <TableCell>
                      <Badge variant={`content-${item.type}`}>{TYPE_LABELS[item.type] || item.type}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{category}</TableCell>
                    <TableCell>
                      {item.status === 'published' ? (
                        <Badge variant="status-published">
                          <img src="/solid-check.svg" alt="" className="size-3" /> Published
                        </Badge>
                      ) : (
                        <Badge variant="status-draft">
                          <CircleDashed className="size-3.5 text-gray-400" /> Draft
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {(item.quizCount || 0) > 0 ? (
                        <span className="inline-flex items-center justify-center size-5 rounded-full bg-muted text-[11px] font-medium text-foreground">{item.quizCount}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.updated}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={e => { e.stopPropagation(); setSelectedItem(item) }}><Pencil className="size-4 mr-2" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem><Eye className="size-4 mr-2" /> View</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">No items match your search.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create Content Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setCreateModalOpen(false); resetCreateForm() }} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-[640px] max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 shrink-0">
              <h2 className="text-lg font-semibold text-foreground">Add Content</h2>
              <button onClick={() => { setCreateModalOpen(false); resetCreateForm() }} className="text-muted-foreground hover:text-foreground transition-colors"><X className="size-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* General */}
              <div className="space-y-4">
                <p className="text-sm font-medium text-foreground">General</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-medium text-muted-foreground">Title</label>
                    <Input value={createTitle} onChange={e => setCreateTitle(e.target.value)} placeholder="Enter content title" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Category</label>
                    <select value={createCategory} onChange={e => setCreateCategory(e.target.value)} className="w-full h-9 rounded-md border border-border bg-white px-3 text-sm text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring">
                      <option value="">Select category</option>
                      {METADATA_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Content Type</label>
                    <select value={createType} onChange={e => setCreateType(e.target.value)} className="w-full h-9 rounded-md border border-border bg-white px-3 text-sm text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring">
                      {METADATA_TYPES.map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}
                    </select>
                  </div>
                  {createType === 'external' && (
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-xs font-medium text-muted-foreground">External URL</label>
                      <Input value={createExternalUrl} onChange={e => setCreateExternalUrl(e.target.value)} placeholder="https://..." className="h-9 text-sm" />
                    </div>
                  )}
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-medium text-muted-foreground">Skills</label>
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input value={createSkillSearch} onChange={e => setCreateSkillSearch(e.target.value)} placeholder="Search skills..." className="pl-9 h-9 text-sm" />
                      </div>
                      {createSkillSearch.trim() && (
                        <div className="border border-border rounded-md bg-white max-h-[140px] overflow-y-auto">
                          {METADATA_SKILLS.filter(s => s.toLowerCase().includes(createSkillSearch.toLowerCase()) && !createSkills.includes(s)).map(s => (
                            <button key={s} onClick={() => { setCreateSkills(prev => [...prev, s]); setCreateSkillSearch('') }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/30 transition-colors text-left">
                              {s}
                            </button>
                          ))}
                          {METADATA_SKILLS.filter(s => s.toLowerCase().includes(createSkillSearch.toLowerCase()) && !createSkills.includes(s)).length === 0 && (
                            <p className="px-3 py-2 text-xs text-muted-foreground">No matching skills</p>
                          )}
                        </div>
                      )}
                      {createSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {createSkills.map(s => (
                            <span key={s} className="inline-flex items-center gap-1 text-xs font-medium text-foreground bg-muted rounded-full px-2 h-6">
                              {s}
                              <X className="size-3 text-muted-foreground cursor-pointer" onClick={() => setCreateSkills(prev => prev.filter(x => x !== s))} />
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-border/40" />

              {/* Time & CPD */}
              <div className="space-y-4">
                <p className="text-sm font-medium text-foreground">Time & CPD</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Estimated Time</label>
                    <Input value={createEstimatedTime} onChange={e => setCreateEstimatedTime(e.target.value)} placeholder="e.g. 2.5 hrs" className="h-9 text-sm" />
                  </div>
                  <div />
                  <div className="flex items-center justify-between col-span-2">
                    <div>
                      <label className="text-sm font-medium text-foreground">CPD Relevant</label>
                      <p className="text-xs text-muted-foreground">Enable to assign CPD points to this content</p>
                    </div>
                    <Switch checked={createCpdRelevant} onCheckedChange={setCreateCpdRelevant} />
                  </div>
                  {createCpdRelevant && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">CPD Points</label>
                      <Input type="number" value={createCpdPoints} onChange={e => setCreateCpdPoints(e.target.value)} className="h-9 text-sm" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border/60 shrink-0 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => { setCreateModalOpen(false); resetCreateForm() }}>Cancel</Button>
              <Button onClick={handleCreateContent} disabled={!createTitle.trim()}>Create Content</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
