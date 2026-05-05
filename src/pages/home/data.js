import tenant from '@/config/tenant'

const MONTHS = {
  JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
  JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
}

// Handles "28 Mar 2026, 9:00am" and {month:'MAR', day:'12', year:'2026'} shapes.
function parseDateTime(input) {
  if (!input) return Infinity
  if (typeof input === 'object' && input.month && input.day) {
    const month = MONTHS[String(input.month).toUpperCase()] ?? 0
    const day = parseInt(input.day, 10) || 1
    const year = parseInt(input.year, 10) || new Date().getFullYear()
    return new Date(year, month, day).getTime()
  }
  const t = Date.parse(String(input).replace(/(\d)(am|pm)/i, '$1 $2'))
  return Number.isNaN(t) ? Infinity : t
}

const PRIORITY_WEIGHT = { Critical: 0, High: 1, Medium: 2, Low: 3 }
const RAG_WEIGHT = { red: 0, amber: 1, green: 2 }
const PAPER_STAGES = new Set(['Draft', 'CoSec Review', 'Submitted'])
const POLICY_STAGES = new Set(['Draft', 'Review', 'Approve', 'Identify'])
const TASK_OPEN = new Set(['Behind', 'In Progress', 'Open', 'Pending'])

export function getUpcoming() {
  const meetings = (tenant?.pages?.govern?.meetings ?? [])
    .filter((m) => m.status !== 'Completed')
    .map((m) => ({ kind: 'meeting', record: m, sortKey: parseDateTime(m.dateTime) }))

  const events = (tenant?.pages?.meet?.upcoming ?? [])
    .map((e) => ({ kind: 'event', record: e, sortKey: parseDateTime(e) }))

  return [...meetings, ...events]
    .sort((a, b) => a.sortKey - b.sortKey)
    .slice(0, 5)
}

export function getRecommended() {
  const workshops = (tenant?.pages?.learn?.suggestedWorkshops ?? [])
    .map((w) => ({ kind: 'workshop', record: w, sortKey: 100 - (w.matchScore ?? 0) }))

  const briefings = (tenant?.pages?.insights?.briefingItems ?? [])
    .filter((b) => b.priority === 'High Priority' || b.impact_level === 'high' || b.impact_level === 'medium')
    .map((b) => ({
      kind: 'briefing',
      record: b,
      sortKey: b.priority === 'High Priority' ? 0 : b.impact_level === 'high' ? 1 : 2,
    }))

  const posts = (tenant?.pages?.community?.posts ?? [])
    .filter((p) => p.type === 'AI Win' || p.type === 'Win')
    .map((p) => ({ kind: 'post', record: p, sortKey: 50 }))

  return [...workshops, ...briefings, ...posts]
    .sort((a, b) => a.sortKey - b.sortKey)
    .slice(0, 5)
}

export function getToDo() {
  const tasks = (tenant?.pages?.control?.tasks ?? [])
    .filter((t) => t.status === 'Behind' || t.priority === 'Critical' || TASK_OPEN.has(t.status))
    .map((t) => ({
      kind: 'task',
      record: t,
      sortKey: (PRIORITY_WEIGHT[t.priority] ?? 4) + (t.status === 'Behind' ? -0.5 : 0),
    }))

  const policies = (tenant?.pages?.govern?.policies ?? [])
    .filter((p) => POLICY_STAGES.has(p.stage))
    .map((p) => ({
      kind: 'policy',
      record: p,
      sortKey: (RAG_WEIGHT[p.rag] ?? 3) + 0.1,
    }))

  const papers = (tenant?.pages?.govern?.boardPapers ?? [])
    .filter((bp) => PAPER_STAGES.has(bp.stage))
    .map((bp) => ({
      kind: 'paper',
      record: bp,
      sortKey: (bp.blocked ? 0 : 2) + 0.2,
    }))

  return [...tasks, ...policies, ...papers]
    .sort((a, b) => a.sortKey - b.sortKey)
    .slice(0, 6)
}
