import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Target, Users, BarChart3, Search, ChevronDown, AlertTriangle, CheckCircle2, TrendingUp,
} from 'lucide-react'
import tenant from '@/config/tenant'

const TEAM_CAP = tenant.pages.learn.teamCapability
const SKILLS_PROFILE = tenant.pages.learn.skillsProfile
const MAX_DOTS = 4

const DOT_COLORS = {
  1: 'bg-red-400',
  2: 'bg-amber-400',
  3: 'bg-blue-400',
  4: 'bg-emerald-500',
}

function DotIndicator({ dots }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: MAX_DOTS }).map((_, i) => (
        <div
          key={i}
          className={`size-2.5 rounded-full ${i < dots ? DOT_COLORS[dots] : 'bg-[#e5e7eb]'}`}
        />
      ))}
    </div>
  )
}

// ─── Overview Tab ───────────────────────────────────────────────────────────

function OverviewTab() {
  const skills = SKILLS_PROFILE.skills
  const members = TEAM_CAP.members

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Team Avg Score', value: `${TEAM_CAP.teamAvgScore}/100`, icon: Target },
          { label: '% Meeting Required', value: `${TEAM_CAP.percentMeetingRequired}%`, icon: CheckCircle2 },
          { label: 'Skills Tracked', value: TEAM_CAP.totalSkillsTracked, icon: BarChart3 },
          { label: 'Last Assessment', value: TEAM_CAP.lastAssessmentCycle, icon: Users },
        ].map(stat => (
          <div key={stat.label} className="rounded-lg border border-border p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <stat.icon className="size-4" />
              <span className="text-xs">{stat.label}</span>
            </div>
            <p className="text-xl font-medium text-foreground tracking-[-0.5px]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Team Gaps */}
      {TEAM_CAP.teamGaps?.length > 0 && (
        <div className="rounded-lg border border-border bg-white p-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-amber-500" />
            <p className="text-sm font-medium text-foreground">Top Team Gaps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {TEAM_CAP.teamGaps.map(gap => (
              <div key={gap.skillId} className="rounded-lg border border-border p-3 space-y-2">
                <p className="text-sm font-medium text-foreground">{gap.label}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{gap.membersBelow} members below target</span>
                  <Badge variant="importance-critical">{gap.targetLevel}</Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                  <Target className="size-3.5" /> Assign Training
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Heatmap */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <p className="text-sm font-medium text-foreground">Skills Heatmap</p>
        </div>
        <div className="overflow-x-auto">
          <Table className="text-xs">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px] sticky left-0 bg-background">Team Member</TableHead>
                {skills.map(s => (
                  <TableHead key={s.id} className="text-center min-w-[90px]">
                    <span className="block truncate max-w-[80px] mx-auto" title={s.label}>{s.label.split(' ').slice(0, 2).join(' ')}</span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map(member => (
                <TableRow key={member.id} className="hover:bg-muted/20">
                  <TableCell className="sticky left-0 bg-background">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6">
                        <AvatarFallback className="text-[10px] bg-brand-50 text-brand-700">{member.initials}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground truncate">{member.name}</span>
                    </div>
                  </TableCell>
                  {skills.map(s => (
                    <TableCell key={s.id} className="text-center">
                      <div className="flex justify-center">
                        <DotIndicator dots={member.skills[s.id] || 0} />
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

// ─── By Skill Tab ───────────────────────────────────────────────────────────

function BySkillTab() {
  const [expandedSkill, setExpandedSkill] = useState(null)
  const distribution = TEAM_CAP.skillDistribution || []
  const members = TEAM_CAP.members

  return (
    <div className="space-y-2">
      {distribution.sort((a, b) => a.meetingTarget - b.meetingTarget).map(skill => {
        const isExpanded = expandedSkill === skill.skillId
        const skillMembers = members.map(m => ({ ...m, dots: m.skills[skill.skillId] || 0 }))
        const levelCounts = [0, 0, 0, 0, 0]
        skillMembers.forEach(m => { levelCounts[m.dots]++ })

        return (
          <div key={skill.skillId} className="rounded-lg border border-border bg-white">
            <div
              className="px-4 py-3 cursor-pointer hover:bg-muted/20 transition-colors"
              onClick={() => setExpandedSkill(isExpanded ? null : skill.skillId)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{skill.label}</p>
                  {skill.criticalGap && (
                    <Badge variant="importance-critical">Critical Gap</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Team avg:</span>
                    <DotIndicator dots={Math.round(skill.avgDots)} />
                  </div>
                  <div className="text-xs text-muted-foreground w-[100px] text-right">
                    {skill.meetingTarget}% meeting target
                  </div>
                  <ChevronDown className={`size-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                <p className="text-xs font-medium text-muted-foreground">Level Distribution</p>
                <div className="grid grid-cols-5 gap-2">
                  {['No data', 'Beginner', 'Intermediate', 'Advanced', 'Expert'].map((label, i) => (
                    <div key={label} className="text-center space-y-1">
                      <div className="h-16 flex items-end justify-center">
                        <div
                          className={`w-8 rounded-t ${i === 0 ? 'bg-gray-200' : DOT_COLORS[i]}`}
                          style={{ height: `${Math.max(8, (levelCounts[i] / members.length) * 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-xs font-medium text-foreground">{levelCounts[i]}</p>
                    </div>
                  ))}
                </div>

                <Button variant="outline" size="sm" className="gap-1.5 mt-2">
                  <Target className="size-4" /> Request Team Assessment
                </Button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── By Individual Tab ──────────────────────────────────────────────────────

function ByIndividualTab() {
  const [search, setSearch] = useState('')
  const [expandedMember, setExpandedMember] = useState(null)
  const members = TEAM_CAP.members
  const skills = SKILLS_PROFILE.skills

  const filtered = members.filter(m =>
    !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input placeholder="Search team members..." className="h-9 pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-center">Overall Score</TableHead>
              <TableHead>Role Progression</TableHead>
              <TableHead>Top Gap</TableHead>
              <TableHead>Last Assessed</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(member => {
              const isExpanded = expandedMember === member.id
              return (
                <>
                  <TableRow
                    key={member.id}
                    className="cursor-pointer hover:bg-muted/20"
                    onClick={() => setExpandedMember(isExpanded ? null : member.id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-7">
                          <AvatarFallback className="text-[10px] bg-brand-50 text-brand-700">{member.initials}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{member.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{member.role}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Progress value={member.overallScore} className="h-2 w-16" />
                        <span className="text-xs font-medium text-foreground">{member.overallScore}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {member.targetRole && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <TrendingUp className="size-3 text-brand-600" />
                            <span className="text-xs text-foreground">{member.targetRole}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Progress value={member.roleProgress || 0} className="h-1.5 w-16" />
                            <span className="text-xs text-muted-foreground">{member.roleProgress || 0}%</span>
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="importance-high">{member.topGap}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">{member.lastAssessed}</TableCell>
                    <TableCell>
                      <ChevronDown className={`size-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow key={`${member.id}-detail`}>
                      <TableCell colSpan={7} className="bg-muted/20 px-6 py-4">
                        <div className="grid grid-cols-4 gap-3">
                          {skills.map(s => (
                            <div key={s.id} className="flex items-center justify-between gap-2">
                              <span className="text-xs text-foreground truncate" title={s.label}>{s.label}</span>
                              <DotIndicator dots={member.skills[s.id] || 0} />
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function AdminTeamCapabilityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Team Capability</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Monitor team skills, identify gaps, and track capability development</p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Target className="size-4" /> Request Team Assessment
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="by-skill">By Skill</TabsTrigger>
          <TabsTrigger value="by-individual">By Individual</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="by-skill" className="mt-4">
          <BySkillTab />
        </TabsContent>

        <TabsContent value="by-individual" className="mt-4">
          <ByIndividualTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
