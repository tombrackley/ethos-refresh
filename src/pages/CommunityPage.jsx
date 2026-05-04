import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Users2, MessageCircle, Bookmark, BookmarkCheck, Sparkles,
  Plus, Calendar, Award, HelpCircle, Megaphone, Lightbulb,
  ChevronRight, ArrowRight, X, Hash, UserCircle,
} from 'lucide-react'
import tenant from '@/config/tenant'

// ─── Data ────────────────────────────────────────────────────────────────────

const t = tenant.pages?.community ?? {}
const PROMPT = t.promptOfDay ?? {}
const TOPICS = t.topics ?? []
const JOINED_GROUPS = t.joinedGroups ?? []
const POSTS = t.posts ?? []
const MENTORS = t.featuredMentors ?? []
const EVENTS = t.upcomingEvents ?? []
const GROUPS = t.collaborationGroups ?? []

const TABS = ['All', 'AI Wins', 'Questions', 'Trending']

const TYPE_STYLE = {
  'AI Win':     { bg: 'bg-emerald-100 text-emerald-700', icon: Sparkles },
  'Question':   { bg: 'bg-blue-100 text-blue-700', icon: HelpCircle },
  'Discussion': { bg: 'bg-violet-100 text-violet-700', icon: MessageCircle },
  'Ethika':     { bg: 'bg-brand-100 text-brand-800', icon: Megaphone },
}

const FORMAT_STYLE = {
  Webinar:     'bg-emerald-100 text-emerald-700',
  Panel:       'bg-violet-100 text-violet-700',
  Workshop:    'bg-amber-100 text-amber-700',
  'In-person': 'bg-blue-100 text-blue-700',
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [savedPosts, setSavedPosts] = useState(() => {
    const initial = {}
    POSTS.forEach(p => { if (p.saved) initial[p.id] = true })
    return initial
  })
  const [promptDismissed, setPromptDismissed] = useState(false)
  const [joinedGroupIds, setJoinedGroupIds] = useState(() =>
    new Set(GROUPS.filter(g => g.joined).map(g => g.name))
  )

  const filteredPosts = POSTS.filter(p => {
    if (activeTab === 'All') return true
    if (activeTab === 'AI Wins') return p.type === 'AI Win'
    if (activeTab === 'Questions') return p.type === 'Question'
    if (activeTab === 'Trending') return p.replies >= 30
    return true
  })

  function toggleSave(id) {
    setSavedPosts(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function toggleGroup(name) {
    setJoinedGroupIds(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex gap-6">

            {/* ── Left Sidebar ── */}
            <div className="w-56 shrink-0 space-y-6">
              {/* Topics */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Topics</h3>
                <div className="space-y-1">
                  {TOPICS.map(topic => (
                    <button key={topic.name} className="flex items-center justify-between w-full px-2.5 py-1.5 text-sm text-foreground hover:bg-muted/50 rounded-md transition-colors">
                      <span className="flex items-center gap-2 truncate">
                        <Hash className="size-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{topic.name}</span>
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">{topic.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Joined Groups */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Your Groups</h3>
                <div className="space-y-1">
                  {JOINED_GROUPS.map(group => (
                    <button key={group.name} className="flex items-center gap-2 w-full px-2.5 py-1.5 text-sm text-foreground hover:bg-muted/50 rounded-md transition-colors">
                      <Users2 className="size-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate">{group.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* My Activity */}
              <button className="flex items-center gap-2 px-2.5 py-1.5 text-sm text-brand-800 hover:bg-muted/50 rounded-md transition-colors w-full">
                <UserCircle className="size-3.5 shrink-0" />
                My Activity
              </button>
            </div>

            {/* ── Centre Feed ── */}
            <div className="flex-1 min-w-0 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-medium text-foreground">Connect</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Share learnings, ask questions, and connect with your professional community.</p>
                </div>
                <Button size="sm" className="gap-1.5">
                  <Plus className="size-4" /> New Post
                </Button>
              </div>

              {/* Prompt of the Day */}
              {!promptDismissed && PROMPT.title && (
                <div className="rounded-lg border border-brand-200 bg-brand-50/50 px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="size-5 text-brand-700 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider mb-1">Prompt of the Day</p>
                        <p className="text-sm font-medium text-foreground">{PROMPT.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{PROMPT.responses} responses &middot; {PROMPT.author}</p>
                      </div>
                    </div>
                    <button onClick={() => setPromptDismissed(true)} className="text-muted-foreground hover:text-foreground transition-colors">
                      <X className="size-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="flex items-center gap-1 border-b border-border">
                {TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
                      tab === activeTab
                        ? 'text-brand-800 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-800'
                        : 'text-muted-foreground hover:text-foreground cursor-pointer'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Post Cards */}
              <div className="space-y-3">
                {filteredPosts.map(post => {
                  const typeStyle = TYPE_STYLE[post.type] ?? TYPE_STYLE.Discussion
                  const TypeIcon = typeStyle.icon
                  return (
                    <div key={post.id} className="rounded-lg border border-border bg-white px-5 py-4 hover:shadow-sm transition-shadow cursor-pointer">
                      {/* Author row */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                          {post.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">{post.author}</span>
                            <span className="text-xs text-muted-foreground">{post.role}{post.org ? ` · ${post.org}` : ''}</span>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">{post.time}</span>
                      </div>

                      {/* Type badge + Title */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <Badge className={`text-xs gap-1 ${typeStyle.bg}`}>
                          <TypeIcon className="size-3" />
                          {post.type}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-foreground leading-snug">{post.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{post.snippet}</p>

                      {/* Tags + actions */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          {post.tags.map(tag => (
                            <span key={tag} className="text-xs text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded">{tag}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MessageCircle className="size-3.5" /> {post.replies}
                          </span>
                          <button
                            onClick={e => { e.stopPropagation(); toggleSave(post.id) }}
                            className={`transition-colors ${savedPosts[post.id] ? 'text-brand-800' : 'text-muted-foreground hover:text-foreground'}`}
                          >
                            {savedPosts[post.id] ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {filteredPosts.length === 0 && (
                  <div className="text-center py-12 text-sm text-muted-foreground">
                    No posts match this filter yet.
                  </div>
                )}
              </div>
            </div>

            {/* ── Right Panel ── */}
            <div className="w-72 shrink-0 space-y-6">

              {/* Featured Mentors */}
              <div className="rounded-lg border border-border bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">Featured Mentors</h3>
                  <button className="text-xs text-brand-800 hover:underline font-medium">View all</button>
                </div>
                <div className="space-y-3">
                  {MENTORS.map((mentor, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <img src={mentor.avatar} alt="" className="size-9 rounded-full object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{mentor.name}</p>
                        <p className="text-xs text-muted-foreground">{mentor.role}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {mentor.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs h-7 px-2 shrink-0">
                        Connect
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="rounded-lg border border-border bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">Upcoming Events</h3>
                  <button className="text-xs text-brand-800 hover:underline font-medium">View all</button>
                </div>
                <div className="space-y-3">
                  {EVENTS.map((event, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center justify-center rounded-md bg-muted/40 px-2 py-1.5 shrink-0 w-12 text-center">
                        <Calendar className="size-3.5 text-muted-foreground mb-0.5" />
                        <span className="text-xs font-medium text-foreground">{event.date}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-snug">{event.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${FORMAT_STYLE[event.format] ?? 'bg-slate-100 text-slate-700'}`}>{event.format}</Badge>
                          {event.cpdPoints && (
                            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                              <Award className="size-3" /> {event.cpdPoints} CPD
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{event.rsvps} attending</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Collaboration Groups */}
              <div className="rounded-lg border border-border bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">Collaboration Groups</h3>
                  <button className="text-xs text-brand-800 hover:underline font-medium">Browse all</button>
                </div>
                <div className="space-y-2.5">
                  {GROUPS.slice(0, 4).map((group, i) => {
                    const isJoined = joinedGroupIds.has(group.name)
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className="size-9 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
                          <Users2 className="size-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{group.name}</p>
                          <p className="text-xs text-muted-foreground">{group.members} members</p>
                        </div>
                        <Button
                          variant={isJoined ? 'secondary' : 'outline'}
                          size="sm"
                          className="text-xs h-7 px-2 shrink-0"
                          onClick={() => toggleGroup(group.name)}
                        >
                          {isJoined ? 'Joined' : 'Join'}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
