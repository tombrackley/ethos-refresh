// ─── Tenant Configuration ─────────────────────────────────────────────────────
//
// Single-tenant prototype. All mock/demo data lives here under `configs.default`.
// Pages import `tenant` and read from `tenant.pages.*`, `tenant.user`, etc.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Global CPD Categories ────────────────────────────────────────────────────
// Shared category definitions used across all tenants. Individual tenants may
// only use a subset of these depending on their regulatory context.

// Map category names to badge colour variants
const CATEGORY_COLORS = {
  'Risk & Compliance': 'category-teal',
  'Ethics & Professional Responsibility': 'category-purple',
  'Governance & Board Effectiveness': 'category-blue',
  'Professional Skills': 'category-amber',
  'Legal & Regulatory': 'category-cyan',
  'Substantive Law': 'category-indigo',
  'Migration Law': 'category-rose',
  'Specialist Knowledge': 'category-cyan',
  'Practice Management': 'category-orange',
  'Financial Reporting': 'category-amber',
  'Governance & Compliance': 'category-blue',
  'Research Compliance': 'category-teal',
}

export function getCategoryBadgeVariant(category) {
  return CATEGORY_COLORS[category] || 'category'
}

export const CPD_CATEGORIES = [
  'Risk & Compliance',
  'Ethics & Professional Responsibility',
  'Governance & Board Effectiveness',
  'Professional Skills',
  'Legal & Regulatory',
  'Substantive Law',
  'Migration Law',
  'Specialist Knowledge',
  'Practice Management',
  'Financial Reporting',
  'Governance & Compliance',
  'Research Compliance',
]

const configs = {

  // ── Default (general legal / governance) ──────────────────────────────────
  default: {
    appName: 'Ethos',
    logo: '/default-logo.svg',
    icon: '/default-logo.svg',
    greeting: 'Good morning, Tom',
    user: { name: 'Tom Bradley', initials: 'TB', email: 'tom@ethikagroup.com.au' },

    term: {
      matter: 'matter', matters: 'matters', Matter: 'Matter', Matters: 'Matters',
      firm: 'firm', Firm: 'Firm',
    },

    nav: { work: 'Matters' },

    complySubItems: [
      { title: 'Overview', page: 'Comply' },
      { title: 'Legislation & Regulatory Landscape', page: 'Legislation & Regulatory Landscape' },
      { title: 'Obligations Register', page: 'Obligations Register' },
      { title: 'Contracts & Obligations', page: 'Contracts & Obligations' },
      { title: 'Conflict Management', page: 'Conflict Management' },
      { title: 'Incidents & Breaches', page: 'Incidents & Breaches' },
      { title: 'Risk & Controls', page: 'Risk & Controls' },
      { title: 'Audit & Evidence', page: 'Audit & Evidence' },
    ],

    pages: {

      // ── Control ─────────────────────────────────────────────
      control: {
        kpiActiveMatters: 'Active Matters',
        mattersOverview: 'Matters Overview',
        mattersOverviewSub: '47 active across 23 clients',
        firmHealth: 'Firm Health',
        kpis: [
          { label: 'Compliance Score', value: '87%',  prev: '87% last month',  delta: '0.0%', dir: 'flat', primary: true },
          { label: 'Active Matters',   value: '47',   prev: '45 last month',   delta: '+2',   dir: 'up' },
          { label: 'Utilization',      value: '78%',  prev: '74.8% last month', delta: '+3.2%', dir: 'up' },
          { label: 'Revenue MTD',      value: '$2.4M', prev: '$2.1M last month', delta: '+12%', dir: 'up' },
        ],
        matters: [
          { name: 'Henderson Merger', client: 'Henderson Corp', type: 'M&A', status: 'Active', days: 34, value: '$1.2M', lead: 'JW' },
          { name: 'Rialto IP Dispute', client: 'Rialto Systems', type: 'Litigation', status: 'Review', days: 89, value: '$680K', lead: 'KL' },
          { name: 'Apex Due Diligence', client: 'Apex Industries', type: 'Corporate', status: 'Active', days: 12, value: '$340K', lead: 'SM' },
          { name: 'Meridian Restructure', client: 'Meridian LLC', type: 'Restructuring', status: 'On Hold', days: 156, value: '$890K', lead: 'DP' },
          { name: 'Vanguard Regulatory', client: 'Vanguard Financial', type: 'Regulatory', status: 'Active', days: 7, value: '$210K', lead: 'JW' },
        ],
        compliance: [
          { label: 'AML / KYC Reviews', status: 'good', value: '24/24', sub: 'All current' },
          { label: 'Conflict Checks', status: 'warning', value: '18/21', sub: '3 overdue' },
          { label: 'CPD Requirements', status: 'good', value: '96%', sub: 'On track' },
          { label: 'Data Protection', status: 'warning', value: '3 pending', sub: 'Due this week' },
          { label: 'Risk Assessments', status: 'neutral', value: '12/15', sub: '3 in progress' },
        ],
        firmHealthMetrics: [
          { label: 'Utilization Rate', value: 78, target: 80, delta: '+3.2%', above: true },
          { label: 'Realization Rate', value: 91, target: 90, delta: '+1.8%', above: true },
          { label: 'Collection Rate', value: 86, target: 92, delta: '-0.5%', above: false },
          { label: 'Client NPS', value: 72, target: 75, delta: '0.0', above: false },
        ],
        team: [
          { initials: 'JW', name: 'James Walker', role: 'Managing Partner', matters: 8, util: 92, level: 'over' },
          { initials: 'KL', name: 'Karen Liu', role: 'Senior Associate', matters: 12, util: 88, level: 'high' },
          { initials: 'SM', name: 'Sarah Mitchell', role: 'Partner', matters: 6, util: 76, level: 'good' },
          { initials: 'DP', name: 'David Park', role: 'Associate', matters: 14, util: 95, level: 'over' },
          { initials: 'RL', name: 'Rachel Lee', role: 'Counsel', matters: 4, util: 64, level: 'good' },
        ],
        aiActions: [
          { priority: 'High', title: 'Conflict check required', desc: 'Henderson Merger — new counterparty identified. Review recommended before Thursday deadline.' },
          { priority: 'Medium', title: 'Document review overdue', desc: 'Rialto IP Dispute — 3 documents pending partner review for more than 5 days.' },
          { priority: 'Medium', title: 'Capacity rebalancing', desc: 'David Park is at 95% utilisation. Consider reassigning 2 matters to Rachel Lee (64%).' },
          { priority: 'Low', title: 'Billing optimisation', desc: 'Apex Due Diligence has $45K unbilled WIP. Recommend generating interim invoice.' },
        ],
        importantDates: [
          { label: 'Conflict check — Henderson Merger', month: 'FEB', day: '20', year: '2026', sub: 'Thursday · Action required', urgency: 'high' },
          { label: 'Data protection review deadline', month: 'FEB', day: '21', year: '2026', sub: 'Friday · Compliance', urgency: 'high' },
          { label: 'Rialto IP — partner sign-off due', month: 'FEB', day: '14', year: '2026', sub: 'Overdue · Litigation', urgency: 'overdue' },
          { label: 'Apex interim invoice', month: 'FEB', day: '24', year: '2026', sub: 'Monday · Billing', urgency: 'medium' },
          { label: 'Quarterly compliance report', month: 'FEB', day: '26', year: '2026', sub: 'Wednesday · Reporting', urgency: 'low' },
          { label: 'CPD submission window closes', month: 'FEB', day: '28', year: '2026', sub: 'Friday · Professional Development', urgency: 'medium' },
        ],
        upcomingEvents: [
          { title: 'Client call — Vanguard Financial', month: 'FEB', day: '21', year: '2026', time: '2:00 PM', location: 'Video call' },
          { title: 'Henderson Merger status update', month: 'FEB', day: '20', year: '2026', time: '10:00 AM', location: 'Board Room 1' },
          { title: 'Board compliance review', month: 'FEB', day: '26', year: '2026', time: '9:00 AM', location: 'Board Room 2' },
          { title: 'Team capacity review', month: 'FEB', day: '27', year: '2026', time: '11:00 AM', location: 'Online' },
          { title: 'Apex due diligence closing call', month: 'FEB', day: '28', year: '2026', time: '3:00 PM', location: 'Video call' },
        ],
        aiSummary: [
          'Overall compliance sits at 87% — conflict checks and data protection items require attention before end of week.',
          'Team capacity is under pressure: David Park (95%) and James Walker (92%) are at or above capacity and may need rebalancing.',
          'Revenue MTD is tracking 12% ahead of target at $2.4M, however collection rate has slipped 0.5% below the 92% goal.',
          'Henderson Merger has a new counterparty identified — a conflict check is recommended before Thursday\'s deadline.',
          'Realization rate is performing above target at 91%, indicating strong matter efficiency across the current active portfolio.',
        ],
        priorities: [
          { label: 'Conflict check — Henderson Merger', urgency: 'High', due: 'Thu 20 Feb' },
          { label: 'Data protection items pending', urgency: 'High', due: 'This week' },
          { label: 'Reassign matters from David Park', urgency: 'Medium', due: 'This week' },
          { label: 'Rialto document review sign-off', urgency: 'Medium', due: 'Overdue' },
          { label: 'Generate Apex interim invoice', urgency: 'Low', due: 'No deadline' },
        ],
      },

      // ── Work ────────────────────────────────────────────────
      work: {
        title: 'Work',
        description: 'Matter delivery, performance & task operations',
        newButton: 'New Matter',
        overviewTitle: 'Matters Overview',
        overviewSub: (total) => `Distribution across ${total} active matters`,
        donutLabel: 'MATTERS',
        matterStats: {
          total: 142,
          weekDelta: '+4',
          breakdown: [
            { label: 'On Track', value: 111, pct: 78, hex: '#a7f3d0', textHex: '#065f46' },
            { label: 'At Risk',  value: 9,   pct: 6,  hex: '#fde68a', textHex: '#92400e' },
            { label: 'Overdue',  value: 3,   pct: 2,  hex: '#fecaca', textHex: '#991b1b' },
            { label: 'On Hold',  value: 19,  pct: 13, hex: '#e2e8f0', textHex: '#475569' },
          ],
        },
        performance: [
          { label: 'Quality Compliance', value: '97%',   bar: 97, onTarget: true,  note: 'target 95%'  },
          { label: 'Milestone Delivery', value: '94%',   bar: 94, onTarget: false, note: 'target 100%' },
          { label: 'Avg Response',       value: '3.2h',  bar: 68, onTarget: true,  note: '−0.4h'       },
          { label: 'Avg Cycle Time',     value: '12.5d', bar: 75, onTarget: true,  note: 'on target'   },
          { label: 'Team Capacity',      value: '78%',   bar: 78, onTarget: false, note: 'of 100%'     },
        ],
        workMatters: [
          { id: 1, name: 'Henderson Merger', ref: 'MAT-2401', client: 'Henderson Corp', practice: 'M&A', status: 'Active', priority: 'Critical', progress: 72, due: 'Feb 28', value: '$1.2M', lead: 'JW', leadColor: 'bg-brand-800 text-brand-50' },
          { id: 2, name: 'Rialto IP Dispute', ref: 'MAT-2398', client: 'Rialto Systems', practice: 'Litigation', status: 'Behind', priority: 'High', progress: 45, due: 'Mar 15', value: '$680K', lead: 'KL', leadColor: 'bg-teal-600 text-white' },
          { id: 3, name: 'Apex Due Diligence', ref: 'MAT-2412', client: 'Apex Industries', practice: 'Corporate', status: 'On Track', priority: 'Medium', progress: 28, due: 'Apr 10', value: '$340K', lead: 'SM', leadColor: 'bg-slate-500 text-white' },
          { id: 4, name: 'Meridian Restructure', ref: 'MAT-2356', client: 'Meridian LLC', practice: 'Restructuring', status: 'On Hold', priority: 'Low', progress: 60, due: 'TBD', value: '$890K', lead: 'DP', leadColor: 'bg-orange-500 text-white' },
          { id: 5, name: 'Vanguard Regulatory', ref: 'MAT-2418', client: 'Vanguard Financial', practice: 'Regulatory', status: 'On Track', priority: 'High', progress: 15, due: 'Mar 30', value: '$210K', lead: 'JW', leadColor: 'bg-brand-800 text-brand-50' },
          { id: 6, name: 'Calloway Estate Plan', ref: 'MAT-2420', client: 'Calloway Family Trust', practice: 'Wills & Estates', status: 'Active', priority: 'Medium', progress: 55, due: 'Mar 20', value: '$95K', lead: 'RL', leadColor: 'bg-violet-500 text-white' },
          { id: 7, name: 'Pinnacle Lease Dispute', ref: 'MAT-2415', client: 'Pinnacle Properties', practice: 'Litigation', status: 'Behind', priority: 'High', progress: 38, due: 'Feb 25', value: '$420K', lead: 'KL', leadColor: 'bg-teal-600 text-white' },
          { id: 8, name: 'BlueChip Compliance Audit', ref: 'MAT-2422', client: 'BlueChip Finance', practice: 'Regulatory', status: 'On Track', priority: 'Medium', progress: 10, due: 'May 15', value: '$180K', lead: 'SM', leadColor: 'bg-slate-500 text-white' },
          { id: 9, name: 'Nexus IP Licensing', ref: 'MAT-2409', client: 'Nexus Technologies', practice: 'IP', status: 'Active', priority: 'Low', progress: 85, due: 'Feb 20', value: '$150K', lead: 'RL', leadColor: 'bg-violet-500 text-white' },
          { id: 10, name: 'Solaris Board Advisory', ref: 'MAT-2425', client: 'Solaris Energy', practice: 'Governance', status: 'Active', priority: 'Medium', progress: 20, due: 'Jun 01', value: '$275K', lead: 'JW', leadColor: 'bg-brand-800 text-brand-50' },
        ],
        aiPoints: [
          '3 matters are flagged as Behind schedule — Henderson Merger, Rialto IP Dispute and Pinnacle Lease Dispute need attention.',
          'David Park is assigned to Meridian Restructure (On Hold) — consider reallocating capacity to active matters.',
          'Henderson Merger (Critical priority) is at 72% with a Feb 28 deadline — 6 tasks remain open.',
          'Nexus IP Licensing is at 85% and due Feb 20 — on track for completion this week.',
          'WIP has grown $120K this month; consider interim billing on Apex Due Diligence ($340K) and Vanguard Regulatory ($210K).',
        ],
        aiActions: [
          { text: 'Review delayed milestones on Baker v. Hall Settlement before Feb 22 deadline' },
          { text: 'Schedule priority check-in with JW on Henderson Merger risk escalation' },
          { text: 'Chase outstanding reports — 2 overdue reports linked to compliance review' },
        ],
        teamWorkload: [
          { name: 'James Whitfield', initials: 'JW', utilisation: 92, capacity: 100 },
          { name: 'Sarah Mitchell',  initials: 'SM', utilisation: 78, capacity: 100 },
          { name: 'Karen Liu',        initials: 'KL', utilisation: 88, capacity: 100 },
          { name: 'David Park',       initials: 'DP', utilisation: 64, capacity: 100 },
          { name: 'Rachel Lee',       initials: 'RL', utilisation: 82, capacity: 100 },
        ],
        upcomingDeadlines: [
          { id: 'wd-1', label: 'Henderson Merger — definitive agreements signing',  matter: 'Henderson Merger',     month: 'MAY', day: '02', year: '2026', urgency: 'high'   },
          { id: 'wd-2', label: 'Rialto IP — court extension response due',           matter: 'Rialto IP Dispute',    month: 'MAY', day: '05', year: '2026', urgency: 'high'   },
          { id: 'wd-3', label: 'Apex Due Diligence — data room close-out memo',       matter: 'Apex Due Diligence',   month: 'MAY', day: '12', year: '2026', urgency: 'medium' },
          { id: 'wd-4', label: 'Vanguard Regulatory — APRA submission',                matter: 'Vanguard Regulatory',  month: 'MAY', day: '15', year: '2026', urgency: 'medium' },
          { id: 'wd-5', label: 'Nexus IP Licensing — final draft to client',            matter: 'Nexus IP Licensing',   month: 'MAY', day: '20', year: '2026', urgency: 'low'    },
        ],
      },

      // ── Vault ───────────────────────────────────────────────
      vault: {
        description: 'The documentation base that informs and automates your governance',
        status: {
          label: 'Excellent',
          body: 'Your vault has the foundational documents Ethos needs to understand your organisation — governance, policies, frameworks and strategic direction. This baseline drives more accurate risk and compliance recommendations.',
          lastSynced: 'Last synced 4d ago',
        },
        categories: [
          { id: 'governing',  name: 'Governing Documents',  description: 'Constitution, deeds, board charter, delegations of authority' },
          { id: 'policies',   name: 'Policies',             description: 'Code of conduct, conflict of interest, whistleblower, privacy' },
          { id: 'frameworks', name: 'Frameworks',           description: 'Risk management, compliance, cyber security, ESG' },
          { id: 'strategy',   name: 'Strategy & Reporting', description: 'Strategic plan, annual report, modern slavery, sustainability' },
        ],
        files: [
          // Governing Documents (5)
          { id: 'f-1',  name: 'Company Constitution',                  type: 'document',    categoryId: 'governing',  status: 'healthy', lastUpdated: '04 Feb 2026 at 9:14am'  },
          { id: 'f-2',  name: 'Shareholders Deed (2024 Amendment)',     type: 'document',    categoryId: 'governing',  status: 'healthy', lastUpdated: '12 Sep 2024 at 11:42am' },
          { id: 'f-3',  name: 'Board Charter v3',                       type: 'document',    categoryId: 'governing',  status: 'healthy', lastUpdated: '18 Mar 2026 at 2:30pm'  },
          { id: 'f-4',  name: 'Audit & Risk Committee Charter',         type: 'document',    categoryId: 'governing',  status: 'stale',   lastUpdated: '02 Jul 2024 at 4:08pm'  },
          { id: 'f-5',  name: 'Delegations of Authority Matrix',       type: 'spreadsheet', categoryId: 'governing',  status: 'healthy', lastUpdated: '21 Jan 2026 at 10:32am' },
          // Policies (5)
          { id: 'f-6',  name: 'Code of Conduct',                        type: 'document',    categoryId: 'policies',   status: 'healthy', lastUpdated: '08 Feb 2026 at 9:00am'  },
          { id: 'f-7',  name: 'Conflict of Interest Policy',            type: 'document',    categoryId: 'policies',   status: 'healthy', lastUpdated: '14 Jan 2026 at 3:55pm'  },
          { id: 'f-8',  name: 'Whistleblower Policy',                   type: 'document',    categoryId: 'policies',   status: 'healthy', lastUpdated: '02 Feb 2026 at 11:18am' },
          { id: 'f-9',  name: 'Anti-Bribery & Corruption Policy',       type: 'document',    categoryId: 'policies',   status: 'check',   lastUpdated: '18 Nov 2025 at 5:44pm'  },
          { id: 'f-10', name: 'Privacy Policy v3',                      type: 'document',    categoryId: 'policies',   status: 'healthy', lastUpdated: '08 Jan 2026 at 9:14am'  },
          // Frameworks (5)
          { id: 'f-11', name: 'Risk Management Framework v2',           type: 'document',    categoryId: 'frameworks', status: 'healthy', lastUpdated: '01 Mar 2026 at 4:00pm'  },
          { id: 'f-12', name: 'Risk Appetite Statement FY26',           type: 'document',    categoryId: 'frameworks', status: 'healthy', lastUpdated: '15 Feb 2026 at 10:00am' },
          { id: 'f-13', name: 'Compliance Management Framework',        type: 'document',    categoryId: 'frameworks', status: 'healthy', lastUpdated: '22 Mar 2026 at 11:30am' },
          { id: 'f-14', name: 'Cyber Security Framework',               type: 'document',    categoryId: 'frameworks', status: 'stale',   lastUpdated: '14 Aug 2024 at 4:02pm'  },
          { id: 'f-15', name: 'ESG Framework',                          type: 'document',    categoryId: 'frameworks', status: 'healthy', lastUpdated: '04 Apr 2026 at 10:11am' },
          // Strategy & Reporting (5)
          { id: 'f-16', name: 'Strategic Plan FY26-28',                 type: 'document',    categoryId: 'strategy',   status: 'healthy', lastUpdated: '12 Jan 2026 at 10:32am' },
          { id: 'f-17', name: 'Annual Report FY25',                     type: 'document',    categoryId: 'strategy',   status: 'healthy', lastUpdated: '30 Sep 2025 at 5:00pm'  },
          { id: 'f-18', name: 'Modern Slavery Statement FY25',          type: 'document',    categoryId: 'strategy',   status: 'healthy', lastUpdated: '30 Jun 2025 at 3:18pm'  },
          { id: 'f-19', name: 'Sustainability Report FY25',             type: 'document',    categoryId: 'strategy',   status: 'healthy', lastUpdated: '15 Oct 2025 at 9:45am'  },
          { id: 'f-20', name: 'Audit & Risk Committee Annual Report',   type: 'document',    categoryId: 'strategy',   status: 'healthy', lastUpdated: '20 Oct 2025 at 11:00am' },
          // Extras — uploaded beyond the baseline checklist.
          { id: 'f-21', name: 'Q1 FY26 Risk Update',                    type: 'document',    categoryId: 'frameworks', status: 'healthy', lastUpdated: '02 Apr 2026 at 9:30am'  },
          { id: 'f-22', name: 'Vendor Due Diligence Notes',             type: 'document',    categoryId: 'policies',   status: 'healthy', lastUpdated: '12 Mar 2026 at 4:15pm'  },
          { id: 'f-23', name: 'Office Lease — 200 Queen St',            type: 'document',    categoryId: 'governing',  status: 'healthy', lastUpdated: '05 Feb 2026 at 11:00am' },
        ],
      },

      // ── Meet ────────────────────────────────────────────────
      meet: {
        summaryPoints: [
          "You've attended 4 board meetings this quarter, averaging 2.5 hours per session.",
          "Efficiency and follow-through are trending up 12% month-on-month.",
          "Your strongest contributions are in strategy and risk alignment, with governance actions closing faster than last quarter.",
        ],
        upcoming: [
          { id: 1, month: 'MAY', day: '4', year: '2026', name: 'August Board Meeting',         time: '9:00am',  location: 'Blackmores HQ, Sydney',     hasAgenda: true,  hasBoardPack: true,  hasMinutes: false, type: 'Board',     attendees: 9, status: 'Scheduled', ageDays: 6  },
          { id: 2, month: 'MAY', day: '12', year: '2026', name: 'Legal Tech Innovation Summit', time: '10:30am', location: 'Online',                     hasAgenda: false, hasBoardPack: false, hasMinutes: false, type: 'Internal',  attendees: 14, status: 'Scheduled', ageDays: 14 },
          { id: 3, month: 'MAY', day: '18', year: '2026', name: 'Governance & Compliance Review', time: '2:00pm', location: 'Blackmores HQ, Sydney',     hasAgenda: true,  hasBoardPack: false, hasMinutes: false, type: 'Committee', attendees: 5, status: 'Scheduled', ageDays: 20 },
          { id: 4, month: 'JUN', day: '5', year: '2026', name: 'Annual Strategy Workshop',     time: '9:00am',  location: 'Sydney Convention Centre',  hasAgenda: false, hasBoardPack: false, hasMinutes: false, type: 'Internal',  attendees: 22, status: 'Scheduled', ageDays: 38 },
        ],
        past: [
          { id: 5, month: 'APR', day: '15', year: '2026', name: 'Q3 Board Review',           time: '9:00am',  location: 'Blackmores HQ, Sydney',     hasAgenda: true, hasBoardPack: true,  hasMinutes: true, type: 'Board',     attendees: 9, status: 'Completed', ageDays: 13 },
          { id: 6, month: 'APR', day: '3', year: '2026', name: 'Risk Committee Meeting',     time: '11:00am', location: 'Online',                     hasAgenda: true, hasBoardPack: false, hasMinutes: true, type: 'Committee', attendees: 5, status: 'Completed', ageDays: 25 },
          { id: 7, month: 'MAR', day: '22', year: '2026', name: 'Audit & Finance Committee', time: '2:00pm',  location: 'Level 30, 1 Martin Place',  hasAgenda: true, hasBoardPack: true,  hasMinutes: true, type: 'Committee', attendees: 5, status: 'Completed', ageDays: 37 },
        ],
      },

      // ── Time Entry ──────────────────────────────────────────
      timeEntry: {
        todayEntries: [
          { id: 'te-1', matterId: 1,  matterName: 'Henderson Merger',     description: 'Reviewed term sheet redline',                    durationMinutes: 75,  billable: true  },
          { id: 'te-2', matterId: 5,  matterName: 'Vanguard Regulatory',   description: 'Drafted APRA response letter',                  durationMinutes: 110, billable: true  },
          { id: 'te-3', matterId: 2,  matterName: 'Rialto IP Dispute',     description: 'Call with opposing counsel re extension',       durationMinutes: 45,  billable: true  },
          { id: 'te-4', matterId: null, matterName: 'Internal',             description: 'Team standup and admin',                         durationMinutes: 30,  billable: false },
          { id: 'te-5', matterId: 3,  matterName: 'Apex Due Diligence',    description: 'Data room indexing review',                       durationMinutes: 90,  billable: true  },
        ],
        matters: [
          { id: 1,  name: 'Henderson Merger',          client: 'Henderson Corp'         },
          { id: 2,  name: 'Rialto IP Dispute',         client: 'Rialto Systems'         },
          { id: 3,  name: 'Apex Due Diligence',        client: 'Apex Industries'        },
          { id: 5,  name: 'Vanguard Regulatory',        client: 'Vanguard Financial'     },
          { id: 6,  name: 'Calloway Estate Plan',       client: 'Calloway Family Trust'  },
          { id: 9,  name: 'Nexus IP Licensing',          client: 'Nexus Technologies'     },
          { id: 10, name: 'Solaris Board Advisory',     client: 'Solaris Energy'         },
        ],
        weeklyGrid: {
          weekOf: '27 Apr 2026',
          matters: [
            { id: 1, name: 'Henderson Merger' },
            { id: 5, name: 'Vanguard Regulatory' },
            { id: 2, name: 'Rialto IP Dispute' },
            { id: 3, name: 'Apex Due Diligence' },
          ],
          daily: [
            { day: 'Mon', date: '28 Apr', hoursByMatter: { 1: 3.5, 5: 1.5, 2: 0.75, 3: 1.5 } },
            { day: 'Tue', date: '29 Apr', hoursByMatter: { 1: 2.0, 5: 2.5, 2: 1.0, 3: 0.5 } },
            { day: 'Wed', date: '30 Apr', hoursByMatter: { 1: 1.0, 5: 3.0, 2: 1.5, 3: 0.5 } },
            { day: 'Thu', date: '01 May', hoursByMatter: { 1: 4.0, 5: 0.5, 2: 1.0, 3: 1.0 } },
            { day: 'Fri', date: '02 May', hoursByMatter: { 1: 3.0, 5: 2.0, 2: 0.5, 3: 1.5 } },
            { day: 'Sat', date: '03 May', hoursByMatter: { 1: 0,   5: 0,   2: 0,   3: 0   } },
            { day: 'Sun', date: '04 May', hoursByMatter: { 1: 0,   5: 0,   2: 0,   3: 0   } },
          ],
        },
      },

      // ── Resource Library ────────────────────────────────────
      resource: {
        categories: [
          { id: 'all', label: 'All' },
          { id: 'governance', label: 'Governance' },
          { id: 'compliance', label: 'Compliance' },
          { id: 'risk', label: 'Risk Management' },
          { id: 'employment', label: 'Employment' },
          { id: 'commercial', label: 'Commercial' },
          { id: 'data-privacy', label: 'Data & Privacy' },
        ],
        contentTypes: [
          { id: 'all', label: 'All Types' },
          { id: 'policy', label: 'Policies' },
          { id: 'template', label: 'Templates' },
          { id: 'playbook', label: 'Playbooks' },
          { id: 'article', label: 'Articles' },
          { id: 'legislation', label: 'Legislation' },
          { id: 'guide', label: 'Guides' },
        ],
        statuses: [
          { id: 'all', label: 'All Statuses' },
          { id: 'approved', label: 'Approved' },
          { id: 'draft', label: 'Draft' },
          { id: 'under_review', label: 'Under Review' },
        ],
        sources: [
          { id: 'all', label: 'All Sources' },
          { id: 'ethika', label: 'Ethika' },
          { id: 'org', label: 'Organisation' },
        ],
        classifications: [
          { id: 'public', label: 'Public' },
          { id: 'internal', label: 'Internal' },
          { id: 'confidential', label: 'Confidential' },
          { id: 'legal-privilege', label: 'Legal Privilege' },
          { id: 'board-confidential', label: 'Board Confidential' },
        ],
        resources: [
          {
            id: 'rl-1', title: 'Non-Disclosure Agreement', description: 'Standard mutual NDA suitable for commercial negotiations and exploratory discussions between parties.',
            resource_type: 'template', category: 'commercial', tags: ['NDA', 'Contracts', 'Commercial'], jurisdiction: null,
            author: { name: 'Sarah Mitchell', role: 'Senior Legal Counsel' }, source: 'ethika', status: 'approved', ai_assisted: false,
            file_type: 'DOCX', file_size: '42 KB', last_updated: '2026-02-15', review_due: '2026-05-15', review_frequency: '6 months',
            version: '2.1', page_count: 8,
            purpose: 'Provides a standardised framework for protecting confidential information shared during commercial negotiations, due diligence, or exploratory business discussions.',
            when_to_use: ['Before sharing proprietary information with potential partners or vendors', 'During early-stage M&A discussions', 'When engaging consultants who will access sensitive data', 'Before joint venture or collaboration exploratory meetings'],
            linked_categories: ['Commercial', 'Risk Management'],
            compliance_flags: [
              { type: 'info', message: 'Compliant with Australian Privacy Principles (APPs) for information handling obligations.' },
              { type: 'neutral', message: 'Consider jurisdiction-specific enforceability for cross-border NDAs. Seek local counsel for multi-jurisdiction use.' },
            ],
            key_clauses: [
              { name: 'Definition of Confidential Information', description: 'Broadly defines what constitutes confidential information including written, oral, and electronic disclosures.', clause_ref: 'Clause 1.1' },
              { name: 'Permitted Disclosure', description: 'Carve-outs for disclosure required by law, regulation, or court order with prior notice obligation.', clause_ref: 'Clause 3.2' },
              { name: 'Term and Survival', description: 'Confidentiality obligations survive for 3 years after termination of the agreement.', clause_ref: 'Clause 7.1' },
              { name: 'Return or Destruction', description: 'Receiving party must return or certify destruction of all confidential materials on request.', clause_ref: 'Clause 5.4' },
            ],
            sections: [
              { number: '1', title: 'Definitions and Interpretation' },
              { number: '2', title: 'Obligations of Confidentiality' },
              { number: '3', title: 'Permitted Disclosures' },
              { number: '4', title: 'Intellectual Property' },
              { number: '5', title: 'Return of Information' },
              { number: '6', title: 'Remedies' },
              { number: '7', title: 'Term and Termination' },
              { number: '8', title: 'General Provisions' },
            ],
            versions: [
              { number: '2.1', date: '2026-02-15', author: 'Sarah Mitchell', summary: 'Updated permitted disclosure carve-outs for new privacy legislation.', current: true },
              { number: '2.0', date: '2025-09-01', author: 'Sarah Mitchell', summary: 'Major revision — restructured clauses, added IP provisions.', current: false },
              { number: '1.0', date: '2024-06-15', author: 'James Whitfield', summary: 'Initial version.', current: false },
            ],
            related_learning: [
              { title: 'Confidentiality & Information Barriers', type: 'Course', estimated_time: '45 min', kc_id: 'kc-info-barriers' },
              { title: 'Contract Fundamentals', type: 'Guide', estimated_time: '1.5 hrs', kc_id: 'kc-contracts' },
            ],
          },
          {
            id: 'rl-2', title: 'Board Governance Policy', description: 'Comprehensive governance policy defining board composition, responsibilities, delegations and meeting protocols.',
            resource_type: 'policy', category: 'governance', tags: ['Governance', 'Board', 'Policy', 'Directors'], jurisdiction: 'Australia',
            author: { name: 'James Whitfield', role: 'General Counsel' }, source: 'ethika', status: 'approved', ai_assisted: true,
            file_type: 'PDF', file_size: '340 KB', last_updated: '2026-01-10', review_due: '2026-04-10', review_frequency: '6 months',
            version: '3.2', page_count: 24,
            purpose: 'Establishes the governance framework for the board of directors, including roles, responsibilities, delegation of authority, and decision-making protocols.',
            when_to_use: ['When onboarding new directors', 'During annual governance reviews', 'When establishing board sub-committees', 'As a reference for delegation of authority queries'],
            linked_categories: ['Governance', 'Compliance'],
            compliance_flags: [
              { type: 'info', message: 'Aligned with ASX Corporate Governance Principles and Recommendations (4th Edition).' },
              { type: 'neutral', message: 'This policy should be read alongside the Board Charter and Delegation of Authority framework.' },
            ],
            key_clauses: [
              { name: 'Board Composition', description: 'Requires a majority of independent non-executive directors with diverse skills and experience.', clause_ref: 'Section 3.1' },
              { name: 'Delegation of Authority', description: 'Defines matters reserved for the board vs those delegated to management. Includes financial thresholds.', clause_ref: 'Section 5.2' },
              { name: 'Board Evaluation', description: 'Annual performance evaluation of the board, its committees, and individual directors.', clause_ref: 'Section 8.1' },
              { name: 'Conflicts of Interest', description: 'Directors must declare conflicts and abstain from voting on conflicted matters.', clause_ref: 'Section 6.3' },
            ],
            sections: [
              { number: '1', title: 'Purpose and Scope' },
              { number: '2', title: 'Definitions' },
              { number: '3', title: 'Board Composition and Independence' },
              { number: '4', title: 'Roles and Responsibilities' },
              { number: '5', title: 'Delegation of Authority' },
              { number: '6', title: 'Conflicts of Interest' },
              { number: '7', title: 'Meeting Protocols' },
              { number: '8', title: 'Performance Evaluation' },
              { number: '9', title: 'Review and Amendment' },
            ],
            versions: [
              { number: '3.2', date: '2026-01-10', author: 'James Whitfield', summary: 'Updated board evaluation criteria and added ESG oversight responsibilities.', current: true },
              { number: '3.1', date: '2025-07-22', author: 'James Whitfield', summary: 'Minor updates to delegation thresholds.', current: false },
              { number: '3.0', date: '2025-01-15', author: 'James Whitfield', summary: 'Major revision for ASX 4th Edition alignment.', current: false },
            ],
            related_learning: [
              { title: 'Board Governance Fundamentals', type: 'Course', estimated_time: '3 hrs', kc_id: 'kc-governance' },
              { title: 'Director Duties Deep Dive', type: 'Learning Module', estimated_time: '2 hrs', kc_id: 'kc-duties' },
            ],
          },
          {
            id: 'rl-3', title: 'Data Breach Response Playbook', description: 'Step-by-step operational playbook for responding to data breaches, including notification timelines and escalation procedures.',
            resource_type: 'playbook', category: 'data-privacy', tags: ['Data Breach', 'Privacy', 'Incident Response', 'OAIC'], jurisdiction: 'Australia',
            author: { name: 'Priya Nair', role: 'Privacy & Compliance Manager' }, source: 'ethika', status: 'approved', ai_assisted: true,
            file_type: 'PDF', file_size: '186 KB', last_updated: '2026-03-01', review_due: '2026-09-01', review_frequency: '12 months',
            version: '1.4', page_count: 16,
            purpose: 'Provides a structured, time-critical response framework for data breaches to ensure legal obligations are met and organisational risk is minimised.',
            when_to_use: ['Immediately upon discovering or suspecting a data breach', 'During tabletop exercises and breach simulation drills', 'When reviewing or updating incident response procedures', 'As a training resource for privacy officers and IT security teams'],
            linked_categories: ['Data & Privacy', 'Risk Management', 'Compliance'],
            compliance_flags: [
              { type: 'info', message: 'Aligned with the Notifiable Data Breaches (NDB) scheme under the Privacy Act 1988.' },
              { type: 'info', message: 'Includes OAIC notification templates and 30-day assessment timeline requirements.' },
            ],
            key_clauses: [
              { name: 'Initial Containment', description: 'Immediate steps to contain the breach within the first 4 hours including system isolation and evidence preservation.', clause_ref: 'Step 1' },
              { name: 'Assessment Criteria', description: 'Framework for determining whether a breach is likely to result in serious harm — triggering mandatory notification.', clause_ref: 'Step 3' },
              { name: 'Notification Requirements', description: 'OAIC and affected individual notification obligations, timelines, and template communications.', clause_ref: 'Step 5' },
              { name: 'Post-Incident Review', description: 'Root cause analysis, remediation actions, and lessons-learned process within 30 days of resolution.', clause_ref: 'Step 7' },
            ],
            sections: [
              { number: '1', title: 'Containment and Preliminary Assessment' },
              { number: '2', title: 'Escalation and Team Activation' },
              { number: '3', title: 'Breach Assessment Framework' },
              { number: '4', title: 'Legal and Regulatory Obligations' },
              { number: '5', title: 'Notification Procedures' },
              { number: '6', title: 'Communication Templates' },
              { number: '7', title: 'Post-Incident Review' },
            ],
            versions: [
              { number: '1.4', date: '2026-03-01', author: 'Priya Nair', summary: 'Updated OAIC notification templates and added EU cross-border breach guidance.', current: true },
              { number: '1.3', date: '2025-11-10', author: 'Priya Nair', summary: 'Added tabletop exercise guide as appendix.', current: false },
              { number: '1.0', date: '2025-03-01', author: 'Priya Nair', summary: 'Initial version.', current: false },
            ],
            related_learning: [
              { title: 'Privacy & Data Protection', type: 'Course', estimated_time: '2 hrs', kc_id: 'kc-privacy' },
              { title: 'Cyber Security Essentials', type: 'Guide', estimated_time: '1 hr', kc_id: 'kc-cyber' },
            ],
          },
          {
            id: 'rl-4', title: 'Employment Contract Template', description: 'Full-time employment agreement template covering remuneration, IP assignment, restraint of trade and termination provisions.',
            resource_type: 'template', category: 'employment', tags: ['Employment', 'HR', 'Contracts'], jurisdiction: 'Australia',
            author: { name: 'Claire Morrison', role: 'Employment Lawyer' }, source: 'ethika', status: 'approved', ai_assisted: false,
            file_type: 'DOCX', file_size: '54 KB', last_updated: '2026-02-28', review_due: '2026-08-28', review_frequency: '12 months',
            version: '4.0', page_count: 12,
            purpose: 'Provides a compliant, best-practice employment agreement for full-time employees covering all key terms required under the Fair Work Act.',
            when_to_use: ['When hiring a new full-time employee', 'When updating existing employment terms', 'As a base for role-specific contract variations', 'During employment law compliance audits'],
            linked_categories: ['Employment', 'Compliance'],
            compliance_flags: [
              { type: 'info', message: 'Compliant with Fair Work Act 2009 and National Employment Standards (NES).' },
              { type: 'neutral', message: 'Restraint of trade clauses should be reviewed for reasonableness on a case-by-case basis.' },
            ],
            key_clauses: [
              { name: 'Remuneration and Benefits', description: 'Base salary, superannuation, bonus eligibility, and salary review provisions.', clause_ref: 'Clause 4' },
              { name: 'Intellectual Property', description: 'All IP created during employment vests in the employer. Includes moral rights waiver.', clause_ref: 'Clause 9' },
              { name: 'Restraint of Trade', description: 'Non-compete and non-solicitation periods with cascading enforceability provisions.', clause_ref: 'Clause 12' },
              { name: 'Termination', description: 'Notice periods, summary termination grounds, and post-termination obligations.', clause_ref: 'Clause 14' },
            ],
            sections: [
              { number: '1', title: 'Parties and Commencement' },
              { number: '2', title: 'Position and Duties' },
              { number: '3', title: 'Hours of Work' },
              { number: '4', title: 'Remuneration and Benefits' },
              { number: '5', title: 'Leave Entitlements' },
              { number: '6', title: 'Confidentiality' },
              { number: '7', title: 'Intellectual Property' },
              { number: '8', title: 'Restraint of Trade' },
              { number: '9', title: 'Termination' },
              { number: '10', title: 'General Provisions' },
            ],
            versions: [
              { number: '4.0', date: '2026-02-28', author: 'Claire Morrison', summary: 'Major update — restructured for Fair Work Act amendments effective Jan 2026.', current: true },
              { number: '3.5', date: '2025-08-15', author: 'Claire Morrison', summary: 'Updated leave entitlements for new NES provisions.', current: false },
              { number: '3.0', date: '2025-01-10', author: 'Sarah Mitchell', summary: 'Added IP assignment and moral rights clauses.', current: false },
            ],
            related_learning: [
              { title: 'Employment Law Essentials', type: 'Course', estimated_time: '2.5 hrs', kc_id: 'kc-employment' },
            ],
          },
          {
            id: 'rl-5', title: 'Anti-Money Laundering Policy', description: 'Organisation-wide AML/CTF policy covering customer due diligence, transaction monitoring, and suspicious matter reporting.',
            resource_type: 'policy', category: 'compliance', tags: ['AML', 'CTF', 'Compliance', 'Financial Crime'], jurisdiction: 'Australia',
            author: { name: 'Marcus Reid', role: 'Regulatory Specialist' }, source: 'ethika', status: 'approved', ai_assisted: true,
            file_type: 'PDF', file_size: '220 KB', last_updated: '2025-12-05', review_due: '2026-03-05', review_frequency: '6 months',
            version: '2.3', page_count: 28,
            purpose: 'Defines the organisation\'s obligations and procedures for preventing money laundering and terrorism financing in compliance with the AML/CTF Act.',
            when_to_use: ['During client onboarding to guide CDD procedures', 'When training staff on AML obligations', 'As reference for AUSTRAC reporting requirements', 'During internal or external AML compliance audits'],
            linked_categories: ['Compliance', 'Risk Management'],
            compliance_flags: [
              { type: 'info', message: 'Aligned with Anti-Money Laundering and Counter-Terrorism Financing Act 2006.' },
              { type: 'neutral', message: 'AUSTRAC released updated guidance on digital currency providers in Nov 2025 — review for applicability.' },
            ],
            key_clauses: [
              { name: 'Customer Due Diligence', description: 'Tiered CDD requirements: standard, simplified, and enhanced due diligence based on risk assessment.', clause_ref: 'Section 4' },
              { name: 'Suspicious Matter Reporting', description: 'Obligation to report suspicious matters to AUSTRAC within prescribed timeframes.', clause_ref: 'Section 7' },
              { name: 'Record Keeping', description: 'Minimum 7-year retention for all CDD records, transaction records, and SMR documentation.', clause_ref: 'Section 9' },
            ],
            sections: [
              { number: '1', title: 'Purpose and Scope' },
              { number: '2', title: 'Definitions' },
              { number: '3', title: 'Risk Assessment Framework' },
              { number: '4', title: 'Customer Due Diligence' },
              { number: '5', title: 'Ongoing Monitoring' },
              { number: '6', title: 'Transaction Monitoring' },
              { number: '7', title: 'Suspicious Matter Reporting' },
              { number: '8', title: 'Tipping Off Prohibition' },
              { number: '9', title: 'Record Keeping' },
              { number: '10', title: 'Training and Awareness' },
            ],
            versions: [
              { number: '2.3', date: '2025-12-05', author: 'Marcus Reid', summary: 'Updated for AUSTRAC digital currency guidance.', current: true },
              { number: '2.0', date: '2025-06-01', author: 'Marcus Reid', summary: 'Major revision — added enhanced CDD tier.', current: false },
            ],
            related_learning: [
              { title: 'AML/CTF Compliance', type: 'Course', estimated_time: '4 hrs', kc_id: 'kc-aml' },
              { title: 'Financial Crime Prevention', type: 'Learning Module', estimated_time: '1.5 hrs', kc_id: 'kc-fincrime' },
            ],
          },
          {
            id: 'rl-6', title: 'Risk Management Framework', description: 'Enterprise risk management framework covering risk identification, assessment, treatment and reporting processes.',
            resource_type: 'guide', category: 'risk', tags: ['Risk', 'ERM', 'Framework', 'ISO 31000'], jurisdiction: null,
            author: { name: 'Tom Barker', role: 'Risk & Policy Advisor' }, source: 'ethika', status: 'approved', ai_assisted: false,
            file_type: 'PDF', file_size: '156 KB', last_updated: '2026-03-10', review_due: '2026-09-10',
            version: '1.2', page_count: 18,
            purpose: 'Provides a structured approach to identifying, assessing, treating and monitoring risks across the organisation, aligned with ISO 31000.',
            when_to_use: ['When establishing or reviewing the organisation\'s risk appetite', 'During quarterly risk reviews', 'When assessing a new project or initiative for risk', 'As a training resource for risk management practices'],
            linked_categories: ['Risk Management', 'Governance'],
            compliance_flags: [
              { type: 'info', message: 'Aligned with ISO 31000:2018 Risk Management Guidelines.' },
            ],
            key_clauses: [
              { name: 'Risk Appetite Statement', description: 'Defines the organisation\'s risk appetite across strategic, operational, financial and compliance risk categories.', clause_ref: 'Section 3' },
              { name: 'Risk Assessment Matrix', description: '5x5 likelihood-impact matrix with risk rating criteria and escalation thresholds.', clause_ref: 'Section 5' },
              { name: 'Risk Treatment Options', description: 'Four treatment strategies: avoid, mitigate, transfer, accept — with decision criteria.', clause_ref: 'Section 6' },
            ],
            sections: [
              { number: '1', title: 'Introduction and Scope' },
              { number: '2', title: 'Risk Management Principles' },
              { number: '3', title: 'Risk Appetite and Tolerance' },
              { number: '4', title: 'Risk Identification' },
              { number: '5', title: 'Risk Assessment' },
              { number: '6', title: 'Risk Treatment' },
              { number: '7', title: 'Monitoring and Reporting' },
            ],
            versions: [
              { number: '1.2', date: '2026-03-10', author: 'Tom Barker', summary: 'Updated risk appetite statement and added ESG risk category.', current: true },
              { number: '1.0', date: '2025-06-01', author: 'Tom Barker', summary: 'Initial version.', current: false },
            ],
            related_learning: [
              { title: 'Risk Management Essentials', type: 'Course', estimated_time: '3 hrs', kc_id: 'kc-risk' },
            ],
          },
          {
            id: 'rl-7', title: 'Whistleblower Protection Policy', description: 'Organisation policy for handling whistleblower disclosures in compliance with the Corporations Act and Tax Administration Act.',
            resource_type: 'policy', category: 'compliance', tags: ['Whistleblower', 'Compliance', 'Policy'], jurisdiction: 'Australia', classification: 'legal-privilege',
            author: { name: 'James Whitfield', role: 'General Counsel' }, source: 'org', status: 'approved', ai_assisted: false,
            file_type: 'PDF', file_size: '89 KB', last_updated: '2026-01-20', review_due: '2027-01-20',
            version: '2.0', page_count: 14,
            purpose: 'Ensures the organisation meets its legal obligations for protecting whistleblowers and provides a clear, safe process for making and handling disclosures.',
            when_to_use: ['When an employee or officer wishes to make a protected disclosure', 'During compliance training on whistleblower rights', 'When reviewing internal reporting mechanisms', 'As part of annual policy review cycle'],
            linked_categories: ['Compliance', 'Governance'],
            compliance_flags: [
              { type: 'info', message: 'Compliant with Part 9.4AAA of the Corporations Act 2001 and Tax Administration Act 1953.' },
            ],
            key_clauses: [
              { name: 'Eligible Disclosers', description: 'Defines who qualifies as a whistleblower — employees, officers, contractors, suppliers, and their relatives.', clause_ref: 'Section 3' },
              { name: 'Protected Disclosure Criteria', description: 'Disclosure must relate to misconduct or an improper state of affairs. Personal work-related grievances excluded.', clause_ref: 'Section 4' },
              { name: 'Confidentiality Protections', description: 'Identity of the discloser must not be disclosed without consent, except as required by law.', clause_ref: 'Section 7' },
            ],
            sections: [
              { number: '1', title: 'Purpose' },
              { number: '2', title: 'Scope and Application' },
              { number: '3', title: 'Eligible Disclosers' },
              { number: '4', title: 'Qualifying Disclosures' },
              { number: '5', title: 'How to Make a Disclosure' },
              { number: '6', title: 'Investigation Process' },
              { number: '7', title: 'Confidentiality and Protection' },
              { number: '8', title: 'Reporting and Oversight' },
            ],
            versions: [
              { number: '2.0', date: '2026-01-20', author: 'James Whitfield', summary: 'Major update for Corporations Act amendments. Added tax whistleblower provisions.', current: true },
              { number: '1.0', date: '2024-08-01', author: 'Sarah Mitchell', summary: 'Initial version.', current: false },
            ],
            related_learning: [
              { title: 'Ethics & Professional Standards', type: 'Course', estimated_time: '2 hrs', kc_id: 'kc-ethics' },
            ],
          },
          {
            id: 'rl-8', title: 'Vendor Due Diligence Checklist', description: 'Structured checklist for assessing third-party vendors covering financial stability, security, compliance and operational risk.',
            resource_type: 'template', category: 'risk', tags: ['Vendor', 'Due Diligence', 'Third Party', 'Risk'], jurisdiction: null,
            author: { name: 'Priya Nair', role: 'Privacy & Compliance Manager' }, source: 'ethika', status: 'approved', ai_assisted: true,
            file_type: 'DOCX', file_size: '36 KB', last_updated: '2026-03-15', review_due: '2026-09-15',
            version: '1.1', page_count: 6,
            purpose: 'Provides a standardised assessment framework to evaluate third-party vendors before engagement, ensuring they meet the organisation\'s risk and compliance requirements.',
            when_to_use: ['Before engaging any new third-party vendor', 'During annual vendor review cycles', 'When a vendor undergoes a material change (ownership, location, breach)', 'As part of procurement policy compliance'],
            linked_categories: ['Risk Management', 'Compliance', 'Commercial'],
            compliance_flags: [
              { type: 'info', message: 'Incorporates APRA CPS 234 information security requirements for vendor assessments.' },
              { type: 'neutral', message: 'For high-risk vendors, supplement with on-site audit or SOC 2 report review.' },
            ],
            key_clauses: [
              { name: 'Financial Stability Assessment', description: 'Credit checks, financial statement review, and business continuity evaluation criteria.', clause_ref: 'Section A' },
              { name: 'Information Security Review', description: 'Assessment of vendor\'s data handling, encryption, access controls and incident response capability.', clause_ref: 'Section C' },
              { name: 'Regulatory Compliance Check', description: 'Verification of vendor\'s compliance with relevant industry regulations and certifications.', clause_ref: 'Section D' },
            ],
            sections: [
              { number: 'A', title: 'Financial Stability' },
              { number: 'B', title: 'Operational Capability' },
              { number: 'C', title: 'Information Security' },
              { number: 'D', title: 'Regulatory Compliance' },
              { number: 'E', title: 'Contractual Risk' },
              { number: 'F', title: 'Overall Risk Rating' },
            ],
            versions: [
              { number: '1.1', date: '2026-03-15', author: 'Priya Nair', summary: 'Added APRA CPS 234 information security criteria.', current: true },
              { number: '1.0', date: '2025-10-01', author: 'Priya Nair', summary: 'Initial version.', current: false },
            ],
            related_learning: [
              { title: 'Third-Party Risk Management', type: 'Learning Module', estimated_time: '1 hr', kc_id: 'kc-tprm' },
            ],
          },
          {
            id: 'rl-9', title: 'Modern Slavery Statement Guide', description: 'Guide for preparing and publishing a compliant modern slavery statement under the Modern Slavery Act 2018.',
            resource_type: 'guide', category: 'compliance', tags: ['Modern Slavery', 'ESG', 'Supply Chain', 'Compliance'], jurisdiction: 'Australia',
            author: { name: 'Aisha Okonkwo', role: 'ESG & Compliance Lead' }, source: 'ethika', status: 'approved', ai_assisted: true,
            file_type: 'PDF', file_size: '112 KB', last_updated: '2026-02-20', review_due: '2026-08-20',
            version: '1.3', page_count: 20,
            purpose: 'Provides practical guidance on meeting modern slavery reporting obligations, including supply chain assessment, risk identification, and statement drafting.',
            when_to_use: ['When preparing the annual modern slavery statement', 'During supply chain due diligence reviews', 'When onboarding new suppliers in high-risk jurisdictions', 'As a training resource for procurement and compliance teams'],
            linked_categories: ['Compliance', 'Governance'],
            compliance_flags: [
              { type: 'info', message: 'Aligned with the Modern Slavery Act 2018 (Cth) reporting requirements.' },
              { type: 'neutral', message: 'Entities with consolidated revenue over $100M AUD must publish an annual statement.' },
            ],
            key_clauses: [
              { name: 'Mandatory Reporting Criteria', description: 'Seven mandatory criteria that must be addressed in the modern slavery statement.', clause_ref: 'Section 3' },
              { name: 'Supply Chain Mapping', description: 'Framework for identifying and assessing modern slavery risks across supply chain tiers.', clause_ref: 'Section 5' },
              { name: 'Remediation Actions', description: 'Guidance on actions to take when modern slavery risks or instances are identified.', clause_ref: 'Section 7' },
            ],
            sections: [
              { number: '1', title: 'Overview of Obligations' },
              { number: '2', title: 'Who Must Report' },
              { number: '3', title: 'Mandatory Reporting Criteria' },
              { number: '4', title: 'Identifying Modern Slavery Risks' },
              { number: '5', title: 'Supply Chain Assessment' },
              { number: '6', title: 'Due Diligence Procedures' },
              { number: '7', title: 'Remediation and Response' },
              { number: '8', title: 'Drafting the Statement' },
              { number: '9', title: 'Board Approval and Publication' },
            ],
            versions: [
              { number: '1.3', date: '2026-02-20', author: 'Aisha Okonkwo', summary: 'Updated with ABF guidance on joint statements and added supplier questionnaire template.', current: true },
              { number: '1.0', date: '2025-04-01', author: 'Aisha Okonkwo', summary: 'Initial version.', current: false },
            ],
            related_learning: [
              { title: 'Modern Slavery & Supply Chain Ethics', type: 'Course', estimated_time: '2 hrs', kc_id: 'kc-modern-slavery' },
              { title: 'ESG Reporting Frameworks', type: 'Learning Module', estimated_time: '3 hrs', kc_id: 'kc-esg' },
            ],
          },
          {
            id: 'rl-10', title: 'Privacy Impact Assessment Template', description: 'Structured PIA template for assessing privacy risks associated with new projects, systems or data handling changes.',
            resource_type: 'template', category: 'data-privacy', tags: ['Privacy', 'PIA', 'Data Protection', 'OAIC'], jurisdiction: 'Australia',
            author: { name: 'Priya Nair', role: 'Privacy & Compliance Manager' }, source: 'ethika', status: 'approved', ai_assisted: false,
            file_type: 'DOCX', file_size: '48 KB', last_updated: '2026-01-30', review_due: '2026-07-30',
            version: '2.0', page_count: 10,
            purpose: 'Enables project teams to systematically identify, assess, and mitigate privacy risks before implementing changes that affect personal information handling.',
            when_to_use: ['Before launching a new system or process that handles personal information', 'When making significant changes to existing data handling practices', 'As part of project governance checkpoints', 'When required by the Privacy Officer as part of change management'],
            linked_categories: ['Data & Privacy', 'Risk Management'],
            compliance_flags: [
              { type: 'info', message: 'Based on OAIC PIA Guide and Australian Privacy Principles.' },
            ],
            key_clauses: [
              { name: 'Data Flow Mapping', description: 'Document all personal information flows — collection, use, disclosure, storage, and destruction.', clause_ref: 'Part B' },
              { name: 'Risk Assessment Matrix', description: 'Assess privacy risks using likelihood-impact scoring aligned with the organisation\'s risk framework.', clause_ref: 'Part D' },
              { name: 'Mitigation Actions', description: 'Documented controls and design changes to reduce identified privacy risks to acceptable levels.', clause_ref: 'Part E' },
            ],
            sections: [
              { number: 'A', title: 'Project Overview' },
              { number: 'B', title: 'Data Flow Mapping' },
              { number: 'C', title: 'Privacy Principles Compliance Check' },
              { number: 'D', title: 'Risk Assessment' },
              { number: 'E', title: 'Mitigation Actions' },
              { number: 'F', title: 'Sign-off and Review Schedule' },
            ],
            versions: [
              { number: '2.0', date: '2026-01-30', author: 'Priya Nair', summary: 'Restructured with OAIC PIA Guide alignment. Added data flow mapping section.', current: true },
              { number: '1.0', date: '2025-02-15', author: 'Priya Nair', summary: 'Initial version.', current: false },
            ],
            related_learning: [
              { title: 'Privacy & Data Protection', type: 'Course', estimated_time: '2 hrs', kc_id: 'kc-privacy' },
            ],
          },
          {
            id: 'rl-11', title: 'Corporations Act 2001 — Key Provisions', description: 'Curated reference to key provisions of the Corporations Act relevant to directors, governance and corporate compliance.',
            resource_type: 'legislation', category: 'governance', tags: ['Legislation', 'Corporations Act', 'Directors', 'Governance'], jurisdiction: 'Australia',
            author: { name: 'Ethika Editorial', role: 'Ethika Content Team' }, source: 'ethika', status: 'approved', ai_assisted: false,
            file_type: 'PDF', file_size: '95 KB', last_updated: '2026-03-20', review_due: '2027-03-20',
            version: '1.0', page_count: 32,
            purpose: 'Provides a practitioner-friendly reference to the most relevant sections of the Corporations Act for directors, company secretaries and governance professionals.',
            when_to_use: ['When advising on director duties and obligations', 'During governance framework reviews', 'As a quick reference for regulatory compliance queries', 'When preparing board papers referencing statutory requirements'],
            linked_categories: ['Governance', 'Compliance'],
            compliance_flags: [
              { type: 'info', message: 'Current as at March 2026. Check Federal Register of Legislation for recent amendments.' },
            ],
            key_clauses: [
              { name: 'Director Duties (s 180-184)', description: 'Care and diligence, good faith, proper purpose, no improper use of position or information.', clause_ref: 'Part 2D.1' },
              { name: 'Related Party Transactions (Ch 2E)', description: 'Requirements for member approval of financial benefits to related parties.', clause_ref: 'Chapter 2E' },
              { name: 'Continuous Disclosure (s 674)', description: 'Obligations for listed entities to disclose material information to the market.', clause_ref: 'Part 6CA' },
            ],
            sections: [
              { number: '1', title: 'Directors\' Duties and Officers' },
              { number: '2', title: 'Related Party Transactions' },
              { number: '3', title: 'Financial Reporting' },
              { number: '4', title: 'Continuous Disclosure' },
              { number: '5', title: 'Members\' Rights and Meetings' },
              { number: '6', title: 'Corporate Insolvency' },
            ],
            versions: [
              { number: '1.0', date: '2026-03-20', author: 'Ethika Editorial', summary: 'Initial curated reference — key provisions for governance practitioners.', current: true },
            ],
            related_learning: [
              { title: 'Director Duties Deep Dive', type: 'Learning Module', estimated_time: '2 hrs', kc_id: 'kc-duties' },
              { title: 'Board Governance Fundamentals', type: 'Course', estimated_time: '3 hrs', kc_id: 'kc-governance' },
            ],
          },
          {
            id: 'rl-12', title: 'Conflict of Interest Management Playbook', description: 'Operational playbook for identifying, declaring and managing conflicts of interest at board and management level.',
            resource_type: 'playbook', category: 'governance', tags: ['Conflicts', 'Governance', 'Board', 'Ethics'], jurisdiction: null, classification: 'board-confidential',
            author: { name: 'James Whitfield', role: 'General Counsel' }, source: 'org', status: 'approved', ai_assisted: false,
            file_type: 'PDF', file_size: '72 KB', last_updated: '2026-02-01', review_due: '2026-04-01', review_frequency: '6 months',
            version: '1.5', page_count: 11,
            purpose: 'Provides practical, step-by-step guidance for managing conflicts of interest to protect organisational integrity and meet governance obligations.',
            when_to_use: ['When a director or officer identifies a potential conflict', 'During annual conflict of interest declaration cycles', 'When evaluating transactions involving related parties', 'As part of governance training for board members and executives'],
            linked_categories: ['Governance', 'Compliance'],
            compliance_flags: [
              { type: 'info', message: 'Aligned with ASX CGC Recommendation 1.7 — disclose material details of any director conflict.' },
              { type: 'neutral', message: 'Supplement with legal advice for complex or material conflicts involving related party transactions.' },
            ],
            key_clauses: [
              { name: 'Conflict Identification', description: 'Categories of conflict — actual, potential, and perceived — with examples for each.', clause_ref: 'Section 2' },
              { name: 'Declaration Process', description: 'Standing declarations at appointment, meeting-specific declarations, and register maintenance.', clause_ref: 'Section 3' },
              { name: 'Management Actions', description: 'Decision tree for managing conflicts: monitor, restrict, recuse, or divest.', clause_ref: 'Section 4' },
            ],
            sections: [
              { number: '1', title: 'Introduction and Scope' },
              { number: '2', title: 'Types of Conflict' },
              { number: '3', title: 'Declaration Procedures' },
              { number: '4', title: 'Conflict Management Actions' },
              { number: '5', title: 'Register and Record Keeping' },
              { number: '6', title: 'Reporting and Review' },
            ],
            versions: [
              { number: '1.5', date: '2026-02-01', author: 'James Whitfield', summary: 'Added decision tree for conflict management and updated register template.', current: true },
              { number: '1.0', date: '2025-05-01', author: 'James Whitfield', summary: 'Initial version.', current: false },
            ],
            related_learning: [
              { title: 'Ethics & Professional Standards', type: 'Course', estimated_time: '2 hrs', kc_id: 'kc-ethics' },
            ],
          },
          {
            id: 'rl-13', title: 'ASIC Regulatory Guide RG 259 — Risk Management', description: 'ASIC\'s regulatory guidance on risk management systems for responsible entities and operators of investor directed portfolio services.',
            resource_type: 'legislation', category: 'risk', tags: ['ASIC', 'Risk Management', 'Regulatory Guide', 'RG 259'], jurisdiction: 'Australia',
            author: { name: 'Ethika Editorial', role: 'Ethika Content Team' }, source: 'ethika', status: 'approved', ai_assisted: false,
            input_type: 'external-url', external_url: 'https://asic.gov.au/regulatory-resources/find-a-document/regulatory-guides/rg-259/',
            file_type: null, file_size: null, last_updated: '2026-03-25', review_due: '2027-03-25',
            version: '1.0', page_count: null,
            preview_text: 'RG 259 sets out ASIC\'s expectations for risk management systems of responsible entities of registered managed investment schemes and operators of investor directed portfolio services. It covers governance and oversight, risk culture, risk appetite, identification and assessment of risks, management and monitoring of risks, and incident management. The guide applies to all responsible entities and IDPS operators, with heightened expectations for larger and more complex operations. It was last updated in March 2026 and should be read alongside ASIC\'s broader regulatory guidance on funds management.',
            purpose: 'Provides ASIC\'s expectations for risk management frameworks, including governance, risk culture, and operational risk controls.',
            when_to_use: ['When designing or reviewing the organisation\'s risk management framework', 'During regulatory audits or ASIC compliance reviews', 'When training risk officers on regulatory expectations'],
            linked_categories: ['Risk Management', 'Compliance'],
            compliance_flags: [
              { type: 'neutral', message: 'External regulatory content — check ASIC website for the most current version.' },
            ],
            key_clauses: [],
            sections: [],
            versions: [
              { number: '1.0', date: '2026-03-25', author: 'Ethika Editorial', summary: 'Initial link to ASIC RG 259.', current: true },
            ],
            related_learning: [
              { title: 'Risk Management Framework', type: 'Course', estimated_time: '2.5 hrs', kc_id: 'kc-risk' },
            ],
          },
          {
            id: 'rl-14', title: 'Board Governance Best Practices — AICD Webinar', description: 'Australian Institute of Company Directors webinar covering contemporary governance challenges and board effectiveness strategies.',
            resource_type: 'guide', category: 'governance', tags: ['AICD', 'Board', 'Governance', 'Webinar'], jurisdiction: 'Australia',
            author: { name: 'Ethika Editorial', role: 'Ethika Content Team' }, source: 'ethika', status: 'approved', ai_assisted: false,
            input_type: 'video-url', video_url: 'https://example.com/aicd-governance-webinar',
            file_type: null, file_size: null, last_updated: '2026-04-01', review_due: '2027-04-01',
            version: '1.0', page_count: null,
            preview_text: 'This 45-minute webinar features a panel of experienced non-executive directors discussing the evolving governance landscape in Australia. Topics covered include the shifting expectations around director accountability, practical approaches to risk oversight in an AI-driven environment, strategies for improving board diversity and effectiveness, and navigating the tension between stakeholder expectations and fiduciary duties. The session includes a live Q&A segment and is moderated by the AICD\'s Head of Governance Leadership.',
            purpose: 'Covers practical governance strategies for board members, including risk oversight, stakeholder engagement, and emerging regulatory trends.',
            when_to_use: ['As part of board member onboarding and development', 'When reviewing governance practices against current best practice', 'During annual board effectiveness reviews'],
            linked_categories: ['Governance'],
            compliance_flags: [],
            key_clauses: [],
            sections: [],
            versions: [
              { number: '1.0', date: '2026-04-01', author: 'Ethika Editorial', summary: 'Added AICD governance webinar.', current: true },
            ],
            related_learning: [
              { title: 'Board Governance Fundamentals', type: 'Course', estimated_time: '3 hrs', kc_id: 'kc-governance' },
            ],
          },
        ],
      },

      // ── Talent ──────────────────────────────────────────────
      talent: {
        practiceAreas: ['Legal', 'Commercial', 'Governance', 'Regulatory', 'Litigation', 'ESG'],
        professionals: [
          { id: 1, name: 'Sarah Chen', initials: 'SC', color: 'bg-violet-100 text-violet-700', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&h=128&fit=crop&crop=faces', title: 'Corporate Lawyer', experience: '12+ years', tags: ['Contracts', 'M&A', 'Governance', 'Corporate', 'Compliance'], location: 'Sydney, NSW', availability: 'Available now', availType: 'Immediately', rating: 4.9, hires: 87, seniority: 'Senior', practiceAreas: ['Legal', 'Commercial', 'Governance'] },
          { id: 2, name: 'Marcus Reid', initials: 'MR', color: 'bg-brand-100 text-brand-700', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=faces', title: 'Regulatory Specialist', experience: '8+ years', tags: ['Regulatory', 'Compliance', 'ESG', 'Policy', 'Risk'], location: 'Melbourne, VIC', availability: 'Available now', availType: 'Immediately', rating: 4.7, hires: 54, seniority: 'Senior', practiceAreas: ['Regulatory', 'ESG'] },
          { id: 3, name: 'Priya Nair', initials: 'PN', color: 'bg-teal-100 text-teal-700', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=128&h=128&fit=crop&crop=faces', title: 'Contracts Manager', experience: '6+ years', tags: ['Contracts', 'Procurement', 'Vendor', 'NDA', 'SLA'], location: 'Brisbane, QLD', availability: '1–2 weeks', availType: '1–2 weeks', rating: 4.8, hires: 112, seniority: 'Mid', practiceAreas: ['Legal', 'Commercial'] },
          { id: 4, name: 'James Whitfield', initials: 'JW', color: 'bg-amber-100 text-amber-700', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=faces', title: 'General Counsel', experience: '15+ years', tags: ['Governance', 'Board', 'Strategy', 'Litigation', 'Risk'], location: 'Sydney, NSW', availability: '2–4 weeks', availType: '2–4 weeks', rating: 5.0, hires: 203, seniority: 'Executive', practiceAreas: ['Legal', 'Governance', 'Litigation'] },
          { id: 5, name: 'Aisha Okonkwo', initials: 'AO', color: 'bg-rose-100 text-rose-700', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=128&h=128&fit=crop&crop=faces', title: 'ESG & Compliance Lead', experience: '9+ years', tags: ['ESG', 'Sustainability', 'Compliance', 'Reporting', 'Policy'], location: 'Sydney, NSW', availability: 'Available now', availType: 'Immediately', rating: 4.6, hires: 38, seniority: 'Senior', practiceAreas: ['ESG', 'Regulatory'] },
          { id: 6, name: 'Tom Barker', initials: 'TB', color: 'bg-slate-100 text-slate-700', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=faces', title: 'Risk & Policy Advisor', experience: '5+ years', tags: ['Risk', 'Policy', 'Regulatory', 'AML', 'Controls'], location: 'Perth, WA', availability: '1–2 weeks', availType: '1–2 weeks', rating: 4.5, hires: 29, seniority: 'Mid', practiceAreas: ['Regulatory', 'Commercial'] },
          { id: 7, name: 'Claire Morrison', initials: 'CM', color: 'bg-pink-100 text-pink-700', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=faces', title: 'Employment Lawyer', experience: '7+ years', tags: ['Employment', 'Litigation', 'HR', 'Disputes', 'Contracts'], location: 'Melbourne, VIC', availability: 'Available now', availType: 'Immediately', rating: 4.8, hires: 65, seniority: 'Senior', practiceAreas: ['Legal', 'Litigation'] },
          { id: 8, name: 'David Lim', initials: 'DL', color: 'bg-cyan-100 text-cyan-700', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=128&h=128&fit=crop&crop=faces', title: 'Junior Legal Analyst', experience: '2+ years', tags: ['Research', 'Contracts', 'Compliance', 'Drafting', 'Due Diligence'], location: 'Sydney, NSW', availability: 'Available now', availType: 'Immediately', rating: 4.3, hires: 12, seniority: 'Junior', practiceAreas: ['Legal', 'Commercial'] },
        ],
        aiSummary: [
          '4 professionals are available immediately across Legal and Regulatory practice areas — ideal for urgent resourcing needs.',
          'Sarah Chen and James Whitfield are your most engaged talent with 87 and 203 hires respectively. Consider them for high-priority matters.',
          'ESG & Sustainability expertise is in high demand — Aisha Okonkwo and Marcus Reid are your strongest options in this area.',
          'Current talent pool skews Senior (4 of 8). Consider expanding Junior and Mid-level pipeline for cost-effective resourcing.',
        ],
        aiActions: [
          { priority: 'High', title: 'Fill ESG reporting gap', desc: 'You have an open ESG Disclosure matter with no assigned specialist. Aisha Okonkwo (available now) is a 95% match.' },
          { priority: 'High', title: 'Capacity alert — Litigation', desc: 'Claire Morrison is the only available litigator. Consider onboarding a second option for risk mitigation.' },
          { priority: 'Medium', title: 'Review contractor rates', desc: '3 professionals have rates above budget median. Schedule rate reviews before next quarter.' },
          { priority: 'Low', title: 'Expand junior pipeline', desc: 'Only 1 junior analyst in pool. Post to graduate networks to build bench strength.' },
        ],
        aiRecommendations: [
          { label: 'Engage Aisha Okonkwo for ESG matter', due: 'This week' },
          { label: 'Review Sarah Chen availability for M&A', due: 'Mar 5' },
          { label: 'Shortlist candidates for regulatory review', due: 'Mar 10' },
          { label: 'Schedule talent pool quarterly review', due: 'Mar 31' },
        ],
      },

      // ── Learn ───────────────────────────────────────────────
      learn: {
        cpdSummary: { hoursCompleted: 18.5, hoursRequired: 25, hoursRemaining: 6.5, periodEnd: '30 Jun 2026', categoriesComplete: 3, categoriesTotal: 5, upcomingHours: 8.5, upcomingCount: 3 },
        focusAreas: [
          { id: 1, label: 'Regulatory Change Management', progress: 65, description: 'Interpreting and applying evolving regulatory frameworks to client advisory work.' },
          { id: 2, label: 'Data Privacy & Protection', progress: 40, description: 'GDPR, Privacy Act and cross-border data handling compliance.' },
          { id: 3, label: 'ESG Reporting Frameworks', progress: 20, description: 'Sustainability disclosure standards and climate risk integration.' },
        ],
        completedAreas: [
          { id: 4, label: 'Anti-Money Laundering', completedDate: '12 Jan 2026', hours: 4, cpdPoints: 4, category: 'Risk & Compliance', categories: ['Risk & Compliance'], regimes: ['law-society-nsw'], badge: 'Certified', description: 'Comprehensive overview of AML/CTF obligations, customer due diligence requirements, and suspicious matter reporting under Australian legislation.' },
          { id: 5, label: 'Conflict of Interest Protocols', completedDate: '28 Nov 2025', hours: 2.5, cpdPoints: 2.5, category: 'Ethics & Professional Responsibility', categories: ['Ethics & Professional Responsibility'], regimes: ['law-society-nsw', 'aicd'], badge: 'Complete', description: 'Practical guidance on identifying, declaring, and managing conflicts of interest in professional practice and board settings.' },
          { id: 6, label: 'Board Governance Fundamentals', completedDate: '15 Oct 2025', hours: 3, cpdPoints: 3, category: 'Governance & Board Effectiveness', categories: ['Governance & Board Effectiveness'], regimes: ['aicd'], badge: 'Complete', description: 'Foundation course covering director duties, board structure, governance frameworks, and effective decision-making processes.' },
          { id: 7, label: 'Contract Drafting Masterclass', completedDate: '02 Sep 2025', hours: 5, cpdPoints: 5, category: 'Professional Skills', categories: ['Professional Skills'], regimes: ['law-society-nsw'], badge: 'Certified', description: 'Advanced workshop on drafting clear, enforceable contracts with a focus on risk allocation, indemnities, and limitation clauses.' },
        ],
        skillsGaps: [
          { skill: 'ESG & Sustainability Reporting', importance: 'Critical', currentLevel: 'Beginner', targetLevel: 'Proficient', gap: 75 },
          { skill: 'AI & Legal Technology', importance: 'High', currentLevel: 'Beginner', targetLevel: 'Intermediate', gap: 60 },
          { skill: 'Cross-border Data Transfers', importance: 'High', currentLevel: 'Intermediate', targetLevel: 'Advanced', gap: 40 },
          { skill: 'Whistleblower Legislation', importance: 'Medium', currentLevel: 'Intermediate', targetLevel: 'Proficient', gap: 30 },
        ],
        upcomingWorkshops: [
          { id: 1, title: 'ESG Disclosure & Reporting Standards', month: 'MAR', day: '12', year: '2026', time: '10:00 AM – 12:30 PM', location: 'Online', provider: 'Ethika Academy', type: 'Workshop', price: 0, cpdHours: 2.5, cpdPoints: 2.5, category: 'Risk & Compliance', categories: ['Risk & Compliance', 'Governance & Board Effectiveness'], regimes: ['law-society-nsw', 'aicd'], isEthika: true, capacity: 40, registered: 32, waitlistCount: 0, status: 'Booked', description: 'Learn the latest ESG disclosure frameworks including ISSB standards, ASRS requirements, and practical approaches to sustainability reporting for Australian organisations.' },
          { id: 2, title: 'Privacy Act Amendments — What You Need to Know', month: 'MAR', day: '19', year: '2026', time: '2:00 PM – 4:00 PM', location: 'Board Room 2', provider: 'Internal', type: 'Seminar', price: 0, cpdHours: 2, cpdPoints: 2, category: 'Legal & Regulatory', categories: ['Legal & Regulatory'], regimes: ['law-society-nsw'], isEthika: false, status: 'Booked', description: 'Internal briefing on the 2026 Privacy Act amendments covering enhanced enforcement powers, the new privacy tort, and updated APP requirements for data handling.', externalDisclaimer: 'This event is organised and managed by your organisation. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
          { id: 3, title: 'Advanced Contract Negotiation', month: 'APR', day: '03', year: '2026', time: '9:00 AM – 1:00 PM', location: 'Sydney CBD', provider: 'Law Society NSW', type: 'Workshop', price: 145, cpdHours: 4, cpdPoints: 4, category: 'Professional Skills', categories: ['Professional Skills', 'Substantive Law'], regimes: ['law-society-nsw'], isEthika: false, status: 'Waitlisted', description: 'Hands-on workshop covering advanced negotiation strategies, BATNA analysis, multi-party negotiations, and dealing with complex commercial terms.', externalDisclaimer: 'This event is organised and managed by Law Society NSW. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
        ],
        suggestedWorkshops: [
          { id: 4, title: 'AI in Legal Practice — Tools & Ethics', month: 'APR', day: '08', year: '2026', time: '9:00 AM – 12:00 PM', location: 'Online', provider: 'Ethika Academy', type: 'Workshop', price: 0, cpdHours: 3, cpdPoints: 3, category: 'Substantive Law', categories: ['Substantive Law', 'Ethics & Professional Responsibility'], regimes: ['law-society-nsw', 'aicd'], isEthika: true, capacity: 30, registered: 30, waitlistCount: 4, relevance: 'Addresses AI & Legal Technology skills gap', matchScore: 95, description: 'Explore the practical applications of AI in legal work including document review, contract analysis, and research automation, alongside ethical considerations and responsible use frameworks.' },
          { id: 5, title: 'Modern Slavery & Supply Chain Due Diligence', month: 'APR', day: '16', year: '2026', time: '1:00 PM – 3:00 PM', location: 'Board Room 1', provider: 'Law Society NSW', type: 'Seminar', price: 95, cpdHours: 2, cpdPoints: 2, category: 'Ethics & Professional Responsibility', categories: ['Ethics & Professional Responsibility', 'Risk & Compliance'], regimes: ['law-society-nsw'], isEthika: false, registrationUrl: 'https://www.lawsociety.com.au/cpd/events/modern-slavery-due-diligence', relevance: 'Supports ESG & Sustainability focus area', matchScore: 88, description: 'Understand Modern Slavery Act reporting obligations, supply chain risk assessment methodologies, and practical due diligence frameworks for identifying and addressing forced labour risks.', externalDisclaimer: 'This event is organised and managed by Law Society NSW. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
          { id: 6, title: 'Cross-border Data Transfer Masterclass', month: 'MAY', day: '02', year: '2026', time: '10:00 AM – 1:30 PM', location: 'Sydney CBD', provider: 'International Bar Assoc.', type: 'Workshop', price: 250, cpdHours: 3.5, cpdPoints: 3.5, category: 'Legal & Regulatory', categories: ['Legal & Regulatory'], regimes: ['law-society-nsw'], isEthika: false, relevance: 'Directly addresses Cross-border Data Transfers gap', matchScore: 92, description: 'Deep dive into cross-border data transfer mechanisms including standard contractual clauses, binding corporate rules, and navigating the evolving landscape of international data protection regulations.', externalDisclaimer: 'This event is organised and managed by International Bar Association. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
          { id: 7, title: 'Effective Board Reporting for Lawyers', month: 'MAY', day: '14', year: '2026', time: '12:30 PM – 1:30 PM', location: 'Board Room 2', provider: 'Internal', type: 'Lunch & Learn', price: 0, cpdHours: 1, cpdPoints: 1, category: 'Governance & Board Effectiveness', categories: ['Governance & Board Effectiveness'], regimes: ['aicd'], isEthika: false, relevance: 'Builds on Board Governance Fundamentals', matchScore: 70, description: 'Practical session on preparing concise, decision-ready board papers and legal updates that drive effective governance outcomes.', externalDisclaimer: 'This event is organised internally by your organisation. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
        ],
        aiSummary: [
          'You have completed 18.5 of 25 required CPD points (74%) with 4 months remaining — on track to meet the June 30 deadline.',
          'Ethics & Professional Responsibility and Professional Skills categories are complete. Focus remaining points on Substantive Law (4 pts needed) and Elective (3 pts needed).',
          'Your highest-priority skills gap is ESG & Sustainability Reporting (Critical). The upcoming ESG Disclosure workshop on Mar 12 directly addresses this.',
          'AI & Legal Technology is flagged as a growing competency requirement for your role. Consider enrolling in the suggested AI in Legal Practice workshop.',
        ],
        aiActions: [
          { priority: 'High', title: 'Enrol in AI in Legal Practice workshop', desc: 'Addresses your highest-scoring skills gap recommendation (95% match). 3 CPD points toward Substantive Law.' },
          { priority: 'High', title: 'Prioritise Substantive Law points', desc: 'You need 4 more points in this category. Your booked workshops cover 4.5pt — ensure attendance.' },
          { priority: 'Medium', title: 'Complete Data Privacy module', desc: 'Your Data Privacy & Protection focus area is at 40%. Completing the next module will unlock the assessment.' },
          { priority: 'Low', title: 'Log external CPD activity', desc: 'You attended the Law Council webinar on Feb 10 — points have not yet been logged to your record.' },
        ],
        learningGoals: [
          { label: 'Complete ESG Disclosure workshop', due: 'Mar 12' },
          { label: 'Finish Privacy Act module 3 of 5', due: 'Mar 15' },
          { label: 'Enrol in AI workshop before cutoff', due: 'Mar 20' },
          { label: 'Submit CPD record for H1 review', due: 'Jun 30' },
        ],
        activeJourney: {
          name: 'Regulatory & Compliance Specialist Pathway',
          timeline: '12 months',
          description: 'A curated guide to developing your regulatory and compliance advisory skills. Work through these recommended items at your own pace.',
          elements: [
            { id: 'e1', title: 'Read: APRA Prudential Standards Overview', description: 'Review the key prudential standards relevant to compliance advisory work.' },
            { id: 'e2', title: 'Anti-Money Laundering Certification', description: 'Complete the AML/CTF fundamentals certification covering reporting obligations and customer due diligence.' },
            { id: 'e3', title: 'Review current AML policy documentation', description: 'Read through the organisation\'s AML/CTF program and identify any gaps against current AUSTRAC guidance.' },
            { id: 'e4', title: 'Meet with mentor to discuss AML knowledge', description: 'Arrange a conversation with your mentor to review AML concepts and discuss practical application in your role.' },
            { id: 'e5', title: 'Regulatory Change Management course', description: 'Ongoing course on managing regulatory change across financial services.' },
            { id: 'e6', title: 'Shadow senior associate on APRA advisory matter', description: 'Attend client meetings and observe how regulatory advice is structured and delivered. Take notes on stakeholder management.' },
            { id: 'e7', title: 'Watch: Effective Regulatory Submissions (video)', description: '60-minute masterclass on drafting regulatory submissions and responding to regulator queries.' },
            { id: 'e8', title: 'ESG Reporting Frameworks Course', description: 'Comprehensive course on ESG disclosure standards and their intersection with regulatory compliance.' },
            { id: 'e9', title: 'Chat with Head of Finance about regulatory reporting', description: 'Arrange an informal conversation about how financial reporting intersects with regulatory obligations.' },
          ],
        },
        knowledgeItems: [
          { id: 'k1', type: 'regulatory', title: 'Privacy Act Amendments — Key Changes for Practitioners', snippet: 'Exposure draft introduces direct right of action and mandatory data retention limits. Review impact on current client engagements.', source: 'Ethika Insights', readTime: '4 min read', isNew: true },
          { id: 'k2', type: 'insight', title: 'ESG Disclosure: What AASB S1/S2 Means for Corporate Advisory', snippet: 'New sustainability disclosure standards effective July 2026. Early preparation checklist for advisory teams.', source: 'Ethika Academy', readTime: '6 min read', isNew: true },
          { id: 'k3', type: 'thought-leadership', title: 'The Role of AI in Modern Legal Practice', snippet: 'How leading firms are integrating AI tools while managing ethical obligations and client confidentiality.', source: 'Law Society NSW', readTime: '8 min read', isNew: false },
          { id: 'k4', type: 'community', title: 'Peer Discussion: Managing Cross-border Data Transfer Risk', snippet: 'Summary of key takeaways from the Feb practitioner roundtable on international data flows.', source: 'Community', readTime: '3 min read', isNew: false },
        ],
        practicalResources: [
          { id: 'r1', title: 'Conflict of Interest Checklist', description: 'Step-by-step screening checklist for new matter intake.', type: 'Checklist' },
          { id: 'r2', title: 'ESG Due Diligence Framework', description: 'Framework for assessing ESG risks in corporate transactions.', type: 'Framework' },
          { id: 'r3', title: 'Data Breach Response Playbook', description: 'Incident response procedures for notifiable data breaches.', type: 'Playbook' },
          { id: 'r4', title: 'Board Paper Template', description: 'Standard template for governance committee papers.', type: 'Template' },
          { id: 'r5', title: 'Whistleblower Policy Template', description: 'Model policy compliant with current whistleblower protections.', type: 'Template' },
          { id: 'r6', title: 'CPD Activity Log', description: 'Record template for tracking external CPD activities.', type: 'Template' },
        ],
        skillsProfile: {
          overallScore: 62,
          lastAssessedDate: 'Feb 2026',
          skills: [
            { id: 'sk1', label: 'Ethics & Professional Responsibility', category: 'mandatory', level: 'Advanced', targetLevel: 'Advanced', dots: 4, source: 'Law Society NSW · AICD', status: 'Proficient', description: 'Comprehensive understanding of ethical obligations, conflicts of interest, and professional conduct standards for legal practitioners.', lastActivity: 'Jan 2026' },
            { id: 'sk2', label: 'Anti-Money Laundering & CTF', category: 'mandatory', level: 'Advanced', targetLevel: 'Advanced', dots: 4, source: 'Law Society NSW · AUSTRAC', status: 'Proficient', description: 'AML/CTF obligations, customer due diligence, suspicious matter reporting, and compliance program management.', lastActivity: 'Jan 2026' },
            { id: 'sk3', label: 'Corporate Governance', category: 'mandatory', level: 'Intermediate', targetLevel: 'Advanced', dots: 3, source: 'AICD', status: 'Developing', description: 'Board governance frameworks, director duties, governance standards, and effective board decision-making.', lastActivity: 'Dec 2025' },
            { id: 'sk4', label: 'Regulatory Change Management', category: 'mandatory', level: 'Intermediate', targetLevel: 'Proficient', dots: 3, source: 'Law Society NSW', status: 'Developing', description: 'Interpreting and applying evolving regulatory frameworks to client advisory work.', lastActivity: 'Feb 2026' },
            { id: 'sk5', label: 'Contract Drafting & Negotiation', category: 'mandatory', level: 'Advanced', targetLevel: 'Advanced', dots: 4, source: 'Law Society NSW', status: 'Proficient', description: 'Advanced contract drafting, risk allocation, indemnities, limitation clauses, and negotiation strategies.', lastActivity: 'Nov 2025' },
            { id: 'sk6', label: 'Data Privacy & Protection', category: 'personal', level: 'Intermediate', targetLevel: 'Advanced', dots: 3, source: 'Law Society NSW', status: 'Developing', description: 'GDPR, Privacy Act, cross-border data handling compliance and emerging privacy frameworks.', lastActivity: 'Feb 2026' },
            { id: 'sk7', label: 'ESG & Sustainability Reporting', category: 'personal', level: 'Beginner', targetLevel: 'Proficient', dots: 1, source: 'AICD', status: 'Gap', description: 'Sustainability disclosure standards, ISSB frameworks, and climate risk integration for corporate advisory.', lastActivity: 'Oct 2025' },
            { id: 'sk8', label: 'AI & Legal Technology', category: 'personal', level: 'Beginner', targetLevel: 'Intermediate', dots: 1, source: 'Law Society NSW', status: 'Gap', description: 'Practical applications of AI in legal work, ethical considerations, and responsible use frameworks.', lastActivity: 'Sep 2025' },
          ],
          milestones: [
            { date: 'Jan 2026', skillId: 'sk2', event: 'Completed AML Certification', type: 'certification', points: 4 },
            { date: 'Dec 2025', skillId: 'sk3', event: 'Board Governance Fundamentals — module complete', type: 'completion', points: 3 },
            { date: 'Nov 2025', skillId: 'sk5', event: 'Contract Drafting Masterclass — certified', type: 'certification', points: 5 },
            { date: 'Oct 2025', skillId: 'sk1', event: 'Conflict of Interest Protocols — complete', type: 'completion', points: 2.5 },
            { date: 'Sep 2025', skillId: 'sk5', event: 'Advanced Negotiation Workshop', type: 'milestone', points: 2 },
            { date: 'Aug 2025', skillId: 'sk4', event: 'Regulatory Frameworks Foundations — complete', type: 'completion', points: 3 },
          ],
          scoreBreakdown: [
            { label: 'Scenario Assessment', weight: 40, score: 72 },
            { label: 'Course Completion', weight: 20, score: 85 },
            { label: 'Work Signals', weight: 20, score: 45 },
            { label: 'Org Config', weight: 20, score: 50 },
            { label: 'Self-Assessment', weight: 0, score: 65 },
          ],
          evidence: {
            sk1: {
              sources: [
                { signal: 'Course Completion', detail: 'Ethics & Professional Responsibility — Advanced', date: 'Jan 2026', score: '95%' },
                { signal: 'Scenario Assessment', detail: 'Ethical dilemma scenarios', date: 'Jan 2026', score: '88/100' },
                { signal: 'Work Signal', detail: '12 ethics-related matters handled in last 6 months', date: 'Dec 2025' },
              ],
              cpdBodies: ['Law Society NSW', 'AICD'],
              recommendedAction: 'Maintain proficiency — consider mentoring junior staff on ethical decision-making frameworks.',
            },
            sk2: {
              sources: [
                { signal: 'Course Completion', detail: 'AML/CTF Certification — Passed', date: 'Jan 2026', score: '92%' },
                { signal: 'Work Signal', detail: '8 compliance reviews completed in last quarter', date: 'Dec 2025' },
                { signal: 'Scenario Assessment', detail: 'Suspicious transaction identification', date: 'Jan 2026', score: '85/100' },
              ],
              cpdBodies: ['Law Society NSW', 'AUSTRAC'],
              recommendedAction: 'Maintain certification currency — next renewal due Aug 2026.',
            },
            sk3: {
              sources: [
                { signal: 'Course Completion', detail: 'Board Governance Fundamentals — Complete', date: 'Dec 2025', score: '78%' },
                { signal: 'Scenario Assessment', detail: 'Director duties scenarios', date: 'Dec 2025', score: '62/100' },
              ],
              cpdBodies: ['AICD'],
              recommendedAction: 'Complete Board Governance Advanced module to reach target level.',
            },
            sk4: {
              sources: [
                { signal: 'Course Completion', detail: 'Regulatory Frameworks Foundations — Complete', date: 'Aug 2025', score: '80%' },
                { signal: 'Work Signal', detail: '5 regulatory change assessments performed this year', date: 'Feb 2026' },
              ],
              cpdBodies: ['Law Society NSW'],
              recommendedAction: 'Attend upcoming Regulatory Change Workshop (Mar 2026) for additional CPD.',
            },
            sk5: {
              sources: [
                { signal: 'Course Completion', detail: 'Contract Drafting Masterclass — Certified', date: 'Nov 2025', score: '90%' },
                { signal: 'Work Signal', detail: '22 contracts drafted or reviewed in last 6 months', date: 'Nov 2025' },
              ],
              cpdBodies: ['Law Society NSW'],
              recommendedAction: 'Advanced proficiency achieved — share negotiation frameworks with team.',
            },
            sk6: {
              sources: [
                { signal: 'Course Completion', detail: 'Privacy Act Essentials — In Progress', date: 'Feb 2026', score: '60%' },
                { signal: 'Self-Assessment', detail: 'Self-rated intermediate on GDPR cross-border concepts', date: 'Feb 2026' },
              ],
              cpdBodies: ['OAIC', 'IAPP'],
              recommendedAction: 'Enrol in Cross-border Data Transfer Masterclass (95% match).',
            },
            sk7: {
              sources: [
                { signal: 'Work Signal', detail: 'Limited engagement — 1 ESG-related matter in last 12 months', date: 'Oct 2025' },
              ],
              cpdBodies: [],
              recommendedAction: 'Critical gap — enrol in ESG Disclosure workshop on Mar 12.',
            },
            sk8: {
              sources: [
                { signal: 'Course Completion', detail: 'AI Tools for Legal Professionals — Introductory', date: 'Sep 2025', score: '45%' },
              ],
              cpdBodies: [],
              recommendedAction: 'Growing requirement — start AI in Legal Practice workshop (4 CPD points).',
            },
          },
          closeGapRecommendations: {
            sk3: {
              learning: [
                { title: 'Board Governance Advanced', type: 'course', cpdPoints: 4, matchScore: 92, provider: 'AICD' },
                { title: 'Effective Board Decision-Making', type: 'workshop', cpdPoints: 2, matchScore: 75, provider: 'Governance Institute' },
              ],
              assessments: [
                { title: 'Corporate Governance Assessment', questions: 8, estimatedTime: '15 min' },
              ],
              events: [
                { title: 'ASX Corporate Governance Principles Briefing', date: '2026-04-10', time: '10:00 AM – 12:00 PM', cpdPoints: 2, provider: 'AICD' },
              ],
            },
            sk4: {
              learning: [
                { title: 'Regulatory Change Workshop', type: 'workshop', cpdPoints: 3, matchScore: 88, provider: 'Law Society NSW' },
              ],
              assessments: [
                { title: 'Regulatory Frameworks Assessment', questions: 6, estimatedTime: '12 min' },
              ],
              events: [
                { title: 'Regulatory Change Pipeline Workshop', date: '2026-04-28', time: '1:00 PM – 3:30 PM', cpdPoints: 2.5, provider: 'Law Society NSW' },
              ],
            },
            sk6: {
              learning: [
                { title: 'Cross-border Data Transfer Masterclass', type: 'course', cpdPoints: 3.5, matchScore: 95, provider: 'UNSW Law' },
                { title: 'Privacy Act Reform Update', type: 'workshop', cpdPoints: 2, matchScore: 80, provider: 'OAIC' },
              ],
              assessments: [
                { title: 'Data Privacy Assessment', questions: 8, estimatedTime: '15 min' },
              ],
              events: [
                { title: 'Privacy Act Amendments Seminar', date: '2026-04-22', time: '2:00 PM – 4:00 PM', cpdPoints: 2, provider: 'OAIC' },
              ],
            },
            sk7: {
              learning: [
                { title: 'ESG Disclosure & Reporting Fundamentals', type: 'course', cpdPoints: 3.5, matchScore: 95, provider: 'Law Society NSW' },
                { title: 'Climate Risk in Corporate Advisory', type: 'workshop', cpdPoints: 2, matchScore: 82, provider: 'AICD' },
              ],
              assessments: [
                { title: 'ESG Knowledge Assessment', questions: 8, estimatedTime: '15 min' },
              ],
              events: [
                { title: 'ESG Disclosure & Reporting Workshop', date: '2026-04-15', time: '09:00 – 12:00', cpdPoints: 2.5, provider: 'Ethika Academy' },
                { title: 'Climate Risk Reporting Roundtable', date: '2026-05-06', time: '10:00 AM – 12:00 PM', cpdPoints: 2, provider: 'AICD' },
              ],
            },
            sk8: {
              learning: [
                { title: 'AI in Legal Practice', type: 'workshop', cpdPoints: 4, matchScore: 95, provider: 'Law Society NSW' },
                { title: 'Responsible AI Frameworks', type: 'course', cpdPoints: 2.5, matchScore: 78, provider: 'UNSW Law' },
              ],
              assessments: [
                { title: 'AI & Legal Technology Assessment', questions: 6, estimatedTime: '12 min' },
              ],
              events: [
                { title: 'AI in Legal Practice Live Demo', date: '2026-05-12', time: '2:00 PM – 4:00 PM', cpdPoints: 2, provider: 'Law Society NSW' },
                { title: 'ALRC AI & Law Forum', date: '2026-05-20', time: '9:30 AM – 12:30 PM', cpdPoints: 3, provider: 'ALRC' },
              ],
            },
          },
          certificates: [
            { journeyName: 'Ethics & Professional Responsibility', skillId: 'sk1', issuedDate: 'Jan 2026', capabilityScore: 92, status: 'claimable' },
            { journeyName: 'Anti-Money Laundering & CTF', skillId: 'sk2', issuedDate: 'Jan 2026', capabilityScore: 88, status: 'claimed' },
          ],
          assessmentQuestions: {
            sk7: [
              { question: 'Which framework is the global baseline for sustainability disclosure?', options: ['GRI Standards', 'ISSB IFRS S1/S2', 'CDP Questionnaire', 'SASB Standards'], correct: 1, explanation: 'The ISSB IFRS S1 and S2 standards set the global baseline for sustainability-related financial disclosures.' },
              { question: 'What is the primary purpose of a double materiality assessment?', options: ['To reduce carbon emissions', 'To assess both financial impact on the company and company impact on society/environment', 'To calculate ESG scores for investors', 'To comply with tax obligations'], correct: 1, explanation: 'Double materiality considers both how sustainability issues affect the company financially, and how the company impacts society and the environment.' },
              { question: 'Under Australian climate reporting requirements, which entities must report first?', options: ['All ASX-listed companies', 'Large entities meeting two of three size thresholds', 'Only mining companies', 'Companies with more than 500 employees'], correct: 1, explanation: 'Australia\'s mandatory climate reporting starts with large entities meeting specific revenue, asset, and employee thresholds.' },
              { question: 'What does Scope 3 emissions cover?', options: ['Direct emissions from owned facilities', 'Emissions from purchased electricity', 'All indirect emissions in the value chain', 'Emissions from company vehicles only'], correct: 2, explanation: 'Scope 3 covers all other indirect emissions in a company\'s value chain, including supply chain, business travel, and product use.' },
              { question: 'What is greenwashing in the context of ESG reporting?', options: ['Using green energy for office operations', 'Making misleading claims about environmental credentials', 'Publishing sustainability reports annually', 'Investing in renewable energy projects'], correct: 1, explanation: 'Greenwashing involves making misleading or unsubstantiated claims about environmental or sustainability performance.' },
              { question: 'Which Australian regulator has taken action on greenwashing?', options: ['ATO', 'ASIC', 'APRA', 'RBA'], correct: 1, explanation: 'ASIC has taken enforcement action against greenwashing, particularly in financial products and corporate disclosures.' },
            ],
            sk8: [
              { question: 'What is the primary ethical concern with using AI for legal research?', options: ['Speed of results', 'Hallucination of non-existent case citations', 'Cost of AI tools', 'Compatibility with existing software'], correct: 1, explanation: 'AI language models can generate plausible but fictitious case citations, which is a significant professional risk for legal practitioners.' },
              { question: 'Under what circumstances can AI-generated content be used in court filings?', options: ['Never, AI is banned from courts', 'Always, if it saves time', 'When reviewed and verified by the responsible practitioner', 'Only with judge approval'], correct: 2, explanation: 'AI-generated content must be thoroughly reviewed and verified by the practitioner, who remains professionally responsible for accuracy.' },
              { question: 'What is a key consideration for client confidentiality when using AI tools?', options: ['AI tools are always secure', 'Data entered into AI tools may be used for training or stored externally', 'Client data is automatically anonymised', 'Law firms are exempt from data concerns'], correct: 1, explanation: 'Many AI tools process and store input data, potentially exposing confidential client information to third-party servers.' },
              { question: 'Which AI application is most mature in legal practice today?', options: ['Autonomous case strategy', 'AI judges for small claims', 'Document review and contract analysis', 'Automated court appearances'], correct: 2, explanation: 'Document review and contract analysis are the most established and widely adopted AI applications in legal practice.' },
              { question: 'What does "human-in-the-loop" mean for AI in legal work?', options: ['A human must supervise all AI operations', 'AI and humans take turns on tasks', 'A human reviews, validates, and takes responsibility for AI outputs', 'Only humans can input data into AI systems'], correct: 2, explanation: 'Human-in-the-loop means a qualified professional reviews and takes responsibility for AI-generated outputs before they are used.' },
              { question: 'What is the main risk of over-reliance on AI for legal drafting?', options: ['Increased billing costs', 'Erosion of practitioner skill development and critical analysis', 'Faster document turnaround', 'Improved consistency'], correct: 1, explanation: 'Over-reliance on AI can erode practitioners\' ability to develop critical legal analysis skills and independent judgment.' },
            ],
          },
          roleProgression: {
            currentRole: 'Senior Associate',
            targetRole: 'Partner',
            progress: 72,
            requiredSkills: ['sk1', 'sk2', 'sk3', 'sk4', 'sk5'],
            metSkills: ['sk1', 'sk2', 'sk5'],
          },
          complianceStatus: {
            mandatoryMet: 3,
            mandatoryTotal: 5,
            nextDeadline: 'Jun 30, 2026',
            regimeSummary: [
              { regime: 'Law Society NSW', status: 'On Track', progress: 74 },
              { regime: 'AICD', status: 'At Risk', progress: 45 },
            ],
          },
          crossSpaceSignals: [
            { skillId: 'sk7', source: 'Insights', event: 'New ISSB sustainability standards published', date: 'Mar 2026' },
            { skillId: 'sk6', source: 'Comply', event: 'Privacy Act amendment detected', date: 'Feb 2026' },
          ],
        },
        teamCapability: {
          teamAvgScore: 68,
          percentMeetingRequired: 72,
          totalSkillsTracked: 8,
          lastAssessmentCycle: 'Feb 2026',
          // Category groups for the org-tracked skills matrix. The matrix axis
          // only shows skills that belong to a group here — personal skills
          // users add to their own profile sit outside this.
          skillGroups: [
            { id: 'reg-comp',       label: 'Regulatory & Compliance', skillIds: ['sk1', 'sk2', 'sk4'] },
            { id: 'governance',     label: 'Governance',              skillIds: ['sk3'] },
            { id: 'legal-practice', label: 'Legal Practice',          skillIds: ['sk5'] },
            { id: 'emerging',       label: 'Emerging Areas',          skillIds: ['sk6', 'sk7', 'sk8'] },
          ],
          // Role profiles — each role draws a subset of the org skills catalog
          // with a required target level. Same skill, different targets at
          // different career stages. `requirements` is keyed by skillId →
          // target level (1 Emerging | 2 Established | 3 Expert).
          roles: [
            {
              id: 'general-counsel',
              label: 'General Counsel',
              description: 'Sets legal strategy, advises the board, owns regulatory posture across the org.',
              requirements: { sk1: 3, sk2: 3, sk3: 3, sk4: 3, sk5: 3, sk6: 2, sk7: 2, sk8: 2 },
            },
            {
              id: 'senior-lawyer',
              label: 'Senior Lawyer',
              description: 'Runs matters independently; supports the GC and reviews junior work.',
              requirements: { sk1: 3, sk2: 2, sk3: 2, sk4: 2, sk5: 3, sk6: 2, sk7: 1, sk8: 1 },
            },
            {
              id: 'compliance-officer',
              label: 'Compliance Officer',
              description: 'Owns the obligations register, runs AML / data privacy controls and reporting.',
              requirements: { sk1: 3, sk2: 3, sk4: 3, sk6: 3, sk7: 2 },
            },
            {
              id: 'junior-lawyer',
              label: 'Junior Lawyer',
              description: 'Builds foundational capability under supervision; drafts and supports senior work.',
              requirements: { sk1: 2, sk2: 1, sk4: 1, sk5: 1 },
            },
            {
              id: 'board-member',
              label: 'Board Member',
              description: 'Non-executive director; oversees strategy, governance and risk appetite.',
              requirements: { sk1: 2, sk3: 3, sk7: 2, sk8: 1 },
            },
            {
              id: 'company-secretary',
              label: 'Company Secretary',
              description: 'Governance custodian — board administration, statutory filings, policy stewardship.',
              requirements: { sk1: 3, sk3: 3, sk4: 2, sk7: 2 },
            },
          ],
          teamGaps: [
            { skillId: 'sk7', label: 'ESG & Sustainability Reporting', membersBelow: 7, targetLevel: 'Established' },
            { skillId: 'sk8', label: 'AI & Legal Technology',         membersBelow: 8, targetLevel: 'Established' },
            { skillId: 'sk6', label: 'Data Privacy & Protection',     membersBelow: 6, targetLevel: 'Established' },
          ],
          // Self-assessed skill levels per member, on the 3-point
          // Emerging (1) → Established (2) → Expert (3) scale.
          // `personalSkills`: skills the member added to their own profile
          // outside the org-tracked list (two-tier model).
          members: [
            { id: 1, name: 'Sarah Chen',       initials: 'SC', role: 'Senior Lawyer',      overallScore: 78, topGap: 'ESG Reporting',        lastAssessed: 'Feb 2026', skills: { sk1: 3, sk2: 3, sk3: 2, sk4: 2, sk5: 3, sk6: 2, sk7: 1, sk8: 1 }, personalSkills: [{ label: 'Mediation', level: 2 }, { label: 'Spanish', level: 1 }],                 targetRole: 'General Counsel',     roleProgress: 78 },
            { id: 2, name: 'James Harrington', initials: 'JH', role: 'General Counsel',    overallScore: 85, topGap: 'AI & Legal Tech',      lastAssessed: 'Feb 2026', skills: { sk1: 3, sk2: 3, sk3: 3, sk4: 3, sk5: 3, sk6: 2, sk7: 2, sk8: 1 }, personalSkills: [{ label: 'M&A', level: 3 }, { label: 'International tax', level: 2 }],            targetRole: 'Chief Legal Officer', roleProgress: 85 },
            { id: 3, name: 'Priya Patel',      initials: 'PP', role: 'Compliance Officer', overallScore: 72, topGap: 'ESG Reporting',        lastAssessed: 'Jan 2026', skills: { sk1: 3, sk2: 3, sk3: 1, sk4: 2, sk5: 2, sk6: 1, sk7: 1, sk8: 1 }, personalSkills: [{ label: 'AML investigations', level: 3 }, { label: 'Mediation', level: 1 }],     targetRole: 'Head of Compliance',  roleProgress: 65 },
            { id: 4, name: 'Michael Torres',   initials: 'MT', role: 'Junior Lawyer',      overallScore: 45, topGap: 'Corporate Governance', lastAssessed: 'Feb 2026', skills: { sk1: 1, sk2: 1, sk3: 1, sk4: 1, sk5: 1, sk6: 1, sk7: 1, sk8: 1 }, personalSkills: [{ label: 'Spanish', level: 2 }],                                                targetRole: 'Senior Lawyer',       roleProgress: 35 },
            { id: 5, name: 'Emily Watson',     initials: 'EW', role: 'HR Manager',         overallScore: 62, topGap: 'Data Privacy',         lastAssessed: 'Jan 2026', skills: { sk1: 2, sk2: 2, sk3: 1, sk4: 2, sk5: 2, sk6: 1, sk7: 1, sk8: 1 }, personalSkills: [{ label: 'Employment law', level: 3 }, { label: 'Workplace investigations', level: 2 }], targetRole: 'HR Director',     roleProgress: 60 },
            { id: 6, name: 'David Kim',        initials: 'DK', role: 'Finance Manager',    overallScore: 58, topGap: 'Reg Change',           lastAssessed: 'Dec 2025', skills: { sk1: 2, sk2: 1, sk3: 2, sk4: 1, sk5: 2, sk6: 1, sk7: 1, sk8: 1 }, personalSkills: [{ label: 'Tax planning', level: 3 }, { label: 'M&A', level: 1 }],                targetRole: 'CFO',                 roleProgress: 50 },
            { id: 7, name: 'Rachel Adams',     initials: 'RA', role: 'Company Secretary',  overallScore: 75, topGap: 'AI & Legal Tech',      lastAssessed: 'Feb 2026', skills: { sk1: 3, sk2: 2, sk3: 3, sk4: 2, sk5: 3, sk6: 1, sk7: 1, sk8: 1 }, personalSkills: [{ label: 'Board secretarial', level: 3 }, { label: 'AML investigations', level: 2 }], targetRole: 'Head of Governance', roleProgress: 75 },
            { id: 8, name: 'Tom Bradley',      initials: 'TB', role: 'Board Member',       overallScore: 52, topGap: 'Data Privacy',         lastAssessed: 'Nov 2025', skills: { sk1: 2, sk2: 1, sk3: 1, sk4: 1, sk5: 2, sk6: 1, sk7: 1, sk8: 1 }, personalSkills: [{ label: 'Strategy', level: 3 }, { label: 'Risk appetite', level: 2 }],         targetRole: 'Board Chair',         roleProgress: 45 },
          ],
          skillDistribution: [
            { skillId: 'sk1', label: 'Ethics & Professional Responsibility', avgDots: 2.4, meetingTarget: 50, criticalGap: false },
            { skillId: 'sk2', label: 'Anti-Money Laundering & CTF',          avgDots: 2.0, meetingTarget: 38, criticalGap: false },
            { skillId: 'sk3', label: 'Corporate Governance',                 avgDots: 1.8, meetingTarget: 50, criticalGap: false },
            { skillId: 'sk4', label: 'Regulatory Change Management',         avgDots: 1.8, meetingTarget: 63, criticalGap: false },
            { skillId: 'sk5', label: 'Contract Drafting & Negotiation',      avgDots: 2.3, meetingTarget: 88, criticalGap: false },
            { skillId: 'sk6', label: 'Data Privacy & Protection',            avgDots: 1.3, meetingTarget: 25, criticalGap: true  },
            { skillId: 'sk7', label: 'ESG & Sustainability Reporting',       avgDots: 1.1, meetingTarget: 13, criticalGap: true  },
            { skillId: 'sk8', label: 'AI & Legal Technology',                avgDots: 1.0, meetingTarget: 0,  criticalGap: true  },
          ],
        },
      },

      // ── Skills Settings ──────────────────────────────────────
      skillsSettings: {
        assessmentsRequired: 'optional',
        assessmentSchedule: 'on-demand',
        dueDateReminders: true,
        matrixSource: 'ethika-defaults',
        customMatrix: null,
        teamVisibility: 'individual-aggregate',
      },

      // ── Govern ───────────────────────────────────────────────
      govern: {
        aiPoints: [
          'Governance score is 92% — 2 board resolutions pending formal sign-off and 1 overdue policy review are the main gaps.',
          'All fiduciary duties are current. Annual director declarations were completed on schedule.',
          '3 governance tasks are overdue — delegated authority register update, risk appetite statement review, and committee terms of reference refresh.',
          'Next board meeting is in 14 days — 2 agenda items require pre-reading distribution this week.',
          'Duties handbook was last reviewed 8 months ago — annual review is due within 4 months.',
        ],
        aiActions: [
          { priority: 'High', title: 'Finalise board resolutions', desc: '2 resolutions from the last board meeting are awaiting formal sign-off. Chase signatories before Friday.' },
          { priority: 'High', title: 'Complete overdue policy review', desc: 'Whistleblower policy is 14 days overdue for annual review. Assign to governance lead.' },
          { priority: 'Medium', title: 'Distribute board pre-reading', desc: 'Board meeting in 14 days — 2 papers need to be circulated to directors this week.' },
          { priority: 'Low', title: 'Schedule duties handbook review', desc: 'Annual review due in 4 months. Book a working session with the governance committee.' },
        ],
        priorities: [
          { label: 'Sign off pending board resolutions (2)', urgency: 'High', due: 'This week' },
          { label: 'Whistleblower policy review overdue', urgency: 'High', due: 'Overdue' },
          { label: 'Distribute board pre-reading papers', urgency: 'Medium', due: 'This week' },
          { label: 'Delegated authority register update', urgency: 'Medium', due: 'Mar 14' },
          { label: 'Schedule duties handbook review', urgency: 'Low', due: 'Jun 2026' },
        ],
        kpis: [
          { label: 'Board Health Score', value: '92%', prev: '90.5% last month', delta: '+1.5%', dir: 'up', primary: true },
          { label: 'Upcoming Meetings',  value: '4',   prev: '3 last month',     delta: '+1',    dir: 'up' },
          { label: 'Policies on Track',  value: '88%', prev: '86% last month',   delta: '+2%',   dir: 'up' },
          { label: 'Open Actions',       value: '7',   prev: '9 last month',     delta: '-2',    dir: 'up', invert: true },
        ],
        boards: [
          { id: 'au',         name: 'Australian Board',       description: 'Oversees the Australian legal entity strategy, performance and ASIC governance obligations.', icon: 'flag-au', accent: 'brand',  memberCount: 9, members: [{ name: 'Margaret Chen', initials: 'MC' }, { name: 'James Whitfield', initials: 'JW' }, { name: 'Sarah Mitchell', initials: 'SM' }, { name: 'David Park', initials: 'DP' }], cadence: 'Monthly',    nextMeeting: '28 Mar 2026', tasks: 3, overdue: 1, resolutions: 2 },
          { id: 'cn',         name: 'China Board',            description: 'Oversees the China entity, regulatory licences and Greater China market strategy.',           icon: 'flag-cn', accent: 'amber',  memberCount: 7, members: [{ name: 'Wei Zhang', initials: 'WZ' }, { name: 'Lucy Wang', initials: 'LW' }, { name: 'James Whitfield', initials: 'JW' }],                                                                            cadence: 'Bi-monthly', nextMeeting: '05 May 2026', tasks: 2, overdue: 0, resolutions: 1 },
          { id: 'audit-risk', name: 'Audit & Risk Committee', description: 'Reviews financial reporting, internal controls and enterprise risk across the group.',        icon: 'Users',   accent: 'slate',  memberCount: 5, members: [{ name: 'Laura Singh', initials: 'LS' }, { name: 'David Park', initials: 'DP' }, { name: 'Margaret Chen', initials: 'MC' }],                                                                            cadence: 'Quarterly',  nextMeeting: '15 Apr 2026', tasks: 2, overdue: 0, resolutions: 1 },
          { id: 'governance', name: 'Governance Committee',   description: 'Oversees board composition, effectiveness and corporate governance standards.',               icon: 'Users',   accent: 'indigo', memberCount: 5, members: [{ name: 'Sarah Mitchell', initials: 'SM' }, { name: 'David Park', initials: 'DP' }, { name: 'Margaret Chen', initials: 'MC' }, { name: 'Laura Singh', initials: 'LS' }],                                 cadence: 'Bi-monthly', nextMeeting: '22 Apr 2026', tasks: 4, overdue: 1, resolutions: 0 },
        ],
        currentUserBoardIds: ['au', 'cn', 'audit-risk', 'governance'],
        boardsCommittees: [
          { id: 'board',      name: 'Board',                  type: 'Board',     jurisdiction: 'Australia', memberCount: 9, nextMeeting: '28 Mar 2026', health: 'green' },
          { id: 'audit-cmte', name: 'Audit Committee',        type: 'Committee', jurisdiction: 'Group',     memberCount: 5, nextMeeting: '15 Apr 2026', health: 'green' },
          { id: 'risk-cmte',  name: 'Risk Committee',         type: 'Committee', jurisdiction: 'Group',     memberCount: 5, nextMeeting: '08 Apr 2026', health: 'amber' },
          { id: 'rem-cmte',   name: 'Remuneration Committee', type: 'Committee', jurisdiction: 'Group',     memberCount: 4, nextMeeting: '22 Apr 2026', health: 'green' },
        ],
        meetings: [
          { id: 'm-1',  name: 'March Board Meeting',           boardId: 'au',         dateTime: '28 Mar 2026, 9:00am',  type: 'Board',     status: 'Scheduled',   attendees: 8, agenda: true,  boardPack: true,  minutes: 'Pending' },
          { id: 'm-2',  name: 'Audit Committee — Q1 review',   boardId: 'audit-risk', dateTime: '15 Apr 2026, 10:00am', type: 'Committee', status: 'Scheduled',   attendees: 5, agenda: true,  boardPack: false, minutes: 'Pending' },
          { id: 'm-3',  name: 'Risk Committee — quarterly',    boardId: 'audit-risk', dateTime: '08 Apr 2026, 2:00pm',  type: 'Committee', status: 'Scheduled',   attendees: 5, agenda: true,  boardPack: false, minutes: 'Pending' },
          { id: 'm-4',  name: 'Annual General Meeting',        boardId: 'au',         dateTime: '22 May 2026, 9:30am',  type: 'AGM',       status: 'Scheduled',   attendees: 0, agenda: false, boardPack: false, minutes: 'Pending' },
          { id: 'm-5',  name: 'Remuneration Committee',        boardId: 'governance', dateTime: '22 Apr 2026, 11:00am', type: 'Committee', status: 'Scheduled',   attendees: 4, agenda: true,  boardPack: false, minutes: 'Pending' },
          { id: 'm-6',  name: 'February Board Meeting',        boardId: 'au',         dateTime: '28 Feb 2026, 9:00am',  type: 'Board',     status: 'Completed',   attendees: 8, agenda: true,  boardPack: true,  minutes: 'Final'   },
          { id: 'm-7',  name: 'China Board — bi-monthly',      boardId: 'cn',         dateTime: '05 May 2026, 8:00am',  type: 'Board',     status: 'Scheduled',   attendees: 7, agenda: false, boardPack: false, minutes: 'Pending' },
          { id: 'm-8',  name: 'Governance Committee — Q2',     boardId: 'governance', dateTime: '12 May 2026, 1:00pm',  type: 'Committee', status: 'In Progress', attendees: 5, agenda: true,  boardPack: true,  minutes: 'Draft'   },
          { id: 'm-9',  name: 'January Board Meeting',         boardId: 'au',         dateTime: '24 Jan 2026, 9:00am',  type: 'Board',     status: 'Completed',   attendees: 8, agenda: true,  boardPack: true,  minutes: 'Pending' },
        ],
        delegations: {
          register: [
            { id: 'd-1', delegation: 'Capital expenditure — Tier 1', delegate: 'Margaret Chen',   scope: 'Approve capex up to limit',          financialLimit: '$2,000,000', status: 'Active',         expiry: '31 Dec 2026' },
            { id: 'd-2', delegation: 'Operating expenditure',         delegate: 'James Whitfield', scope: 'Day-to-day operating spend',         financialLimit: '$500,000',   status: 'Active',         expiry: '31 Dec 2026' },
            { id: 'd-3', delegation: 'Vendor contracts',              delegate: 'David Park',      scope: 'Sign vendor SaaS / services',        financialLimit: '$250,000',   status: 'Expiring Soon',  expiry: '15 May 2026' },
            { id: 'd-4', delegation: 'Recruitment — senior',          delegate: 'Sarah Mitchell',  scope: 'Approve senior hires (band 5+)',     financialLimit: 'N/A',        status: 'Active',         expiry: '30 Jun 2026' },
            { id: 'd-5', delegation: 'Legal settlements',             delegate: 'Laura Singh',     scope: 'Settle disputes within authority',   financialLimit: '$150,000',   status: 'Active',         expiry: '31 Dec 2026' },
            { id: 'd-6', delegation: 'Bank facility drawdown',        delegate: 'Margaret Chen',   scope: 'Authorise drawdowns under facility', financialLimit: '$5,000,000', status: 'Expired',        expiry: '01 Mar 2026' },
          ],
          matrix: {
            roles: ['CEO', 'CFO', 'GM Operations', 'Manager'],
            categories: ['Capex', 'Opex', 'Recruitment', 'Legal Settlements'],
            cells: {
              'CEO|Capex':              '$2,000,000',
              'CEO|Opex':               '$1,000,000',
              'CEO|Recruitment':        'All bands',
              'CEO|Legal Settlements':  '$500,000',
              'CFO|Capex':              '$500,000',
              'CFO|Opex':               '$500,000',
              'CFO|Recruitment':        'Band 5+',
              'CFO|Legal Settlements':  '$150,000',
              'GM Operations|Capex':    '$100,000',
              'GM Operations|Opex':     '$250,000',
              'GM Operations|Recruitment': 'Band 4+',
              'GM Operations|Legal Settlements': '$50,000',
              'Manager|Capex':          '$25,000',
              'Manager|Opex':           '$50,000',
              'Manager|Recruitment':    'Band 1–3',
              'Manager|Legal Settlements': '—',
            },
          },
        },
        companyRegister: {
          entities: [
            { id: 'e-1', name: 'Acme Holdings Pty Ltd',     type: 'Holding',          abn: '12 345 678 901', status: 'Active' },
            { id: 'e-2', name: 'Acme Operations Pty Ltd',   type: 'Operating',        abn: '23 456 789 012', status: 'Active' },
            { id: 'e-3', name: 'Acme Australia Pty Ltd',    type: 'Subsidiary',       abn: '34 567 890 123', status: 'Active' },
            { id: 'e-4', name: 'Acme China Ltd',            type: 'Foreign branch',   abn: '—',              status: 'Active' },
          ],
          directors: [
            { id: 'di-1', name: 'Margaret Chen',   role: 'Chair',           boardId: 'au',         appointmentDate: '01 Jan 2022', term: '3 years', end: '31 Dec 2026', status: 'Current'      },
            { id: 'di-2', name: 'James Whitfield', role: 'Managing Director', boardId: 'au',       appointmentDate: '01 Jul 2021', term: '3 years', end: '30 Jun 2026', status: 'Needs Review' },
            { id: 'di-3', name: 'David Park',      role: 'Non-executive',   boardId: 'au',         appointmentDate: '01 Mar 2023', term: '3 years', end: '28 Feb 2027', status: 'Current'      },
            { id: 'di-4', name: 'Sarah Mitchell',  role: 'Non-executive',   boardId: 'governance', appointmentDate: '01 Jun 2024', term: '3 years', end: '31 May 2027', status: 'Current'      },
            { id: 'di-5', name: 'Laura Singh',     role: 'Non-executive',   boardId: 'audit-risk', appointmentDate: '01 Sep 2022', term: '3 years', end: '31 Aug 2025', status: 'Missing'      },
            { id: 'di-6', name: 'Wei Zhang',       role: 'Non-executive',   boardId: 'cn',         appointmentDate: '01 Apr 2023', term: '3 years', end: '31 Mar 2026', status: 'Needs Review' },
          ],
          officers: [
            { id: 'o-1', name: 'David Park',     role: 'Company Secretary',  appointmentDate: '01 Mar 2023', status: 'Active' },
            { id: 'o-2', name: 'James Whitfield', role: 'Chief Executive',   appointmentDate: '01 Jul 2021', status: 'Active' },
            { id: 'o-3', name: 'Lin Chen',        role: 'Chief Financial Officer', appointmentDate: '15 Aug 2022', status: 'Active' },
          ],
          relatedParties: [
            { id: 'rp-1', name: 'Whitfield Family Trust',     relationship: 'MD-related',      lastReview: '01 Mar 2026' },
            { id: 'rp-2', name: 'Northern Capital Partners',  relationship: 'Major shareholder', lastReview: '15 Feb 2026' },
            { id: 'rp-3', name: 'Park Advisory Pty Ltd',      relationship: 'CoSec-related',   lastReview: '20 Jan 2026' },
          ],
          deeds: [
            { id: 'dd-1', name: 'Director indemnity deed — Margaret Chen', parties: 'Acme Holdings / M. Chen',   executed: '01 Jan 2022', expires: 'On exit'   },
            { id: 'dd-2', name: 'Group cross-guarantee deed',              parties: 'All AU entities',           executed: '15 Mar 2024', expires: 'Open-ended' },
            { id: 'dd-3', name: 'Shareholders deed (2023 amendment)',      parties: 'Acme Holdings / shareholders', executed: '12 Sep 2023', expires: 'Open-ended' },
          ],
        },
        policies: [
          { id: 'p-1', name: 'Whistleblower Policy',          owner: { name: 'Sarah Mitchell',  initials: 'SM' }, stage: 'Approve',  daysAtStage: 5,  rag: 'amber', status: 'At Risk',  blockingParty: 'Legal review pending' },
          { id: 'p-2', name: 'Conflict of Interest Policy',   owner: { name: 'David Park',      initials: 'DP' }, stage: 'Review',   daysAtStage: 12, rag: 'red',   status: 'Overdue',  blockingParty: 'Awaiting Audit Cmte' },
          { id: 'p-3', name: 'Modern Slavery Statement',      owner: { name: 'Laura Singh',     initials: 'LS' }, stage: 'Draft',    daysAtStage: 8,  rag: 'green', status: 'On Track' },
          { id: 'p-4', name: 'Privacy Policy refresh',        owner: { name: 'David Park',      initials: 'DP' }, stage: 'Identify', daysAtStage: 3,  rag: 'green', status: 'On Track' },
          { id: 'p-5', name: 'AML/CTF Program update',        owner: { name: 'James Whitfield', initials: 'JW' }, stage: 'Publish',  daysAtStage: 2,  rag: 'green', status: 'On Track' },
          { id: 'p-6', name: 'Code of Conduct refresh',       owner: { name: 'Margaret Chen',   initials: 'MC' }, stage: 'Approve',  daysAtStage: 22, rag: 'red',   status: 'Blocked',  blockingParty: 'Awaiting Chair sign-off' },
          { id: 'p-7', name: 'Board Charter review',          owner: { name: 'Sarah Mitchell',  initials: 'SM' }, stage: 'Review',   daysAtStage: 6,  rag: 'amber', status: 'At Risk',  blockingParty: 'Director feedback open' },
          { id: 'p-8', name: 'Risk Appetite Statement',       owner: { name: 'Laura Singh',     initials: 'LS' }, stage: 'Draft',    daysAtStage: 4,  rag: 'green', status: 'On Track' },
        ],
        boardPapers: [
          { id: 'bp-1', title: 'CFO report — March',                meetingId: 'm-1', boardId: 'au',         responsibleOfficer: { name: 'Lin Chen',        initials: 'LC' }, stage: 'In Pack',      daysAtStage: 1,  blocked: false, readingTime: 12, readStatus: 'Read'         },
          { id: 'bp-2', title: 'CEO strategy update',                meetingId: 'm-1', boardId: 'au',         responsibleOfficer: { name: 'James Whitfield', initials: 'JW' }, stage: 'In Pack',      daysAtStage: 1,  blocked: false, readingTime: 18, readStatus: 'Acknowledged' },
          { id: 'bp-3', title: 'Risk dashboard — Q1',                meetingId: 'm-1', boardId: 'au',         responsibleOfficer: { name: 'Laura Singh',     initials: 'LS' }, stage: 'CoSec Review', daysAtStage: 4,  blocked: true,  readingTime: 9,  readStatus: 'Unread'       },
          { id: 'bp-4', title: 'Audit findings — external auditor',  meetingId: 'm-2', boardId: 'audit-risk', responsibleOfficer: { name: 'David Park',      initials: 'DP' }, stage: 'Submitted',    daysAtStage: 3,  blocked: false, readingTime: 14, readStatus: 'Unread'       },
          { id: 'bp-5', title: 'Risk register quarterly review',     meetingId: 'm-3', boardId: 'audit-risk', responsibleOfficer: { name: 'Laura Singh',     initials: 'LS' }, stage: 'Draft',        daysAtStage: 6,  blocked: false, readingTime: 11, readStatus: 'Unread'       },
          { id: 'bp-6', title: 'Remuneration framework FY26',        meetingId: 'm-5', boardId: 'governance', responsibleOfficer: { name: 'Sarah Mitchell',  initials: 'SM' }, stage: 'Approved',     daysAtStage: 2,  blocked: false, readingTime: 16, readStatus: 'Read'         },
          { id: 'bp-7', title: 'AGM agenda + chair script',          meetingId: 'm-4', boardId: 'au',         responsibleOfficer: { name: 'David Park',      initials: 'DP' }, stage: 'Draft',        daysAtStage: 9,  blocked: true,  readingTime: 8,  readStatus: 'Unread'       },
          { id: 'bp-8', title: 'China entity update',                meetingId: 'm-7', boardId: 'cn',         responsibleOfficer: { name: 'Wei Zhang',       initials: 'WZ' }, stage: 'CoSec Review', daysAtStage: 2,  blocked: false, readingTime: 7,  readStatus: 'Unread'       },
        ],
      },

      // ── Comply ───────────────────────────────────────────────
      comply: {
        aiPoints: [
          'Overall compliance score is 87% — 3 overdue conflict checks and 3 pending data protection items are the primary gaps.',
          'MARA/CPD requirements are at 96% completion across the team — on track for the quarterly deadline.',
          'Risk register has 8 active risks; 2 are rated Critical and require immediate mitigation plans.',
          'Last audit cycle completed with 2 findings — both remediation actions are in progress.',
          'Training completion rate is 84% — 4 team members have overdue modules.',
        ],
        aiActions: [
          { priority: 'High', title: 'Resolve overdue conflict checks', desc: '3 conflict checks are overdue — oldest is 12 days past deadline. Complete before end of week.' },
          { priority: 'High', title: 'Address data protection items', desc: '3 data protection items due this week. Assign to David Park who has available capacity.' },
          { priority: 'Medium', title: 'Update risk register', desc: '2 Critical risks need updated mitigation plans and owner assignment.' },
          { priority: 'Low', title: 'Chase training completion', desc: '4 team members have overdue compliance training modules. Send reminders.' },
        ],
        priorities: [
          { label: 'Complete overdue conflict checks (3)', urgency: 'High', due: 'This week' },
          { label: 'Data protection items pending (3)', urgency: 'High', due: 'This week' },
          { label: 'Risk register mitigation updates', urgency: 'Medium', due: 'Feb 28' },
          { label: 'Training module completion chase', urgency: 'Low', due: 'Mar 5' },
        ],
        kpis: [
          { label: 'Compliance Score',   value: '87%', prev: '87% last month', delta: '0.0%', dir: 'flat', primary: true },
          { label: 'Active Obligations', value: '124', prev: '121 last month', delta: '+3',   dir: 'up' },
          { label: 'Open Incidents',     value: '5',   prev: '6 last month',   delta: '-1',   dir: 'up',   invert: true },
          { label: 'Risk Score',         value: '6.4', prev: '6.7 last month', delta: '-0.3', dir: 'up',   invert: true },
          { label: 'Audit Readiness',    value: '78%', prev: '74% last month', delta: '+4%',  dir: 'up' },
        ],
      },

      // ── Obligations ─────────────────────────────────────────
      obligations: {
        items: [
          { id: 'ob-1',  name: 'AML/CTF program review',                   source: 'AUSTRAC',  regulator: 'AUSTRAC',  category: 'AML/CTF',          frequency: 'Annual',    owner: { name: 'David Park',      initials: 'DP' }, status: 'Compliant',     dueDate: '30 Jun 2026', evidenceCount: 8 },
          { id: 'ob-2',  name: 'Privacy Act 2026 amendments compliance',   source: 'OAIC',     regulator: 'OAIC',     category: 'Privacy',          frequency: 'Ongoing',   owner: { name: 'Sarah Mitchell',  initials: 'SM' }, status: 'At Risk',       dueDate: '01 Mar 2026', evidenceCount: 3 },
          { id: 'ob-3',  name: 'Continuous disclosure obligations',         source: 'Corporations Act 2001',  regulator: 'ASIC', category: 'Corporations Act', frequency: 'Ongoing', owner: { name: 'Margaret Chen', initials: 'MC' }, status: 'Compliant',     dueDate: 'Ongoing',     evidenceCount: 12 },
          { id: 'ob-4',  name: 'Whistleblower policy refresh',             source: 'Corporations Act 2001',  regulator: 'ASIC', category: 'Corporations Act', frequency: 'Annual',  owner: { name: 'Sarah Mitchell',  initials: 'SM' }, status: 'At Risk',       dueDate: '14 May 2026', evidenceCount: 2 },
          { id: 'ob-5',  name: 'Modern slavery statement',                 source: 'Modern Slavery Act',     regulator: 'AGD',  category: 'Human Rights',     frequency: 'Annual',  owner: { name: 'Laura Singh',     initials: 'LS' }, status: 'Compliant',     dueDate: '30 Sep 2026', evidenceCount: 5 },
          { id: 'ob-6',  name: 'WHS psychosocial hazard reporting',        source: 'WHS Regulation',         regulator: 'SafeWork', category: 'WHS',          frequency: 'Quarterly', owner: { name: 'James Whitfield', initials: 'JW' }, status: 'Compliant',     dueDate: '30 Jun 2026', evidenceCount: 4 },
          { id: 'ob-7',  name: 'BAS lodgement',                            source: 'GST Act',                regulator: 'ATO',  category: 'Tax',              frequency: 'Quarterly', owner: { name: 'Lin Chen',        initials: 'LC' }, status: 'Compliant',     dueDate: '28 May 2026', evidenceCount: 6 },
          { id: 'ob-8',  name: 'FBT annual return',                        source: 'FBT Act',                regulator: 'ATO',  category: 'Tax',              frequency: 'Annual',    owner: { name: 'Lin Chen',        initials: 'LC' }, status: 'At Risk',       dueDate: '21 May 2026', evidenceCount: 1 },
          { id: 'ob-9',  name: 'OAIC eligible data breach notifications',  source: 'Privacy Act',            regulator: 'OAIC', category: 'Privacy',          frequency: 'Ongoing',   owner: { name: 'David Park',      initials: 'DP' }, status: 'Non-compliant', dueDate: 'Overdue',     evidenceCount: 0 },
          { id: 'ob-10', name: 'Director ID register maintenance',          source: 'Corporations Act 2001',  regulator: 'ASIC', category: 'Corporations Act', frequency: 'Ongoing',   owner: { name: 'David Park',      initials: 'DP' }, status: 'At Risk',       dueDate: '15 May 2026', evidenceCount: 3 },
          { id: 'ob-11', name: 'Annual review of risk appetite statement', source: 'APRA CPS 220',           regulator: 'APRA', category: 'Risk',             frequency: 'Annual',    owner: { name: 'Laura Singh',     initials: 'LS' }, status: 'Compliant',     dueDate: '31 Aug 2026', evidenceCount: 7 },
          { id: 'ob-12', name: 'CPS 230 operational resilience tests',     source: 'APRA CPS 230',           regulator: 'APRA', category: 'Risk',             frequency: 'Quarterly', owner: { name: 'James Whitfield', initials: 'JW' }, status: 'Compliant',     dueDate: '30 Jun 2026', evidenceCount: 5 },
        ],
      },

      // ── Contracts ───────────────────────────────────────────
      contracts: {
        aiPoints: [
          '7 active contracts under management with a combined value of $4.2M.',
          '2 contracts have obligation deadlines within the next 14 days — Vendor NDA renewal and SLA performance review.',
          'Counterparty obligations compliance is at 89% — 3 items flagged as behind schedule.',
          'Evidence collection for Q1 audit is 72% complete — 6 items still pending.',
        ],
        aiActions: [
          { priority: 'High', title: 'Vendor NDA renewal due', desc: 'Vendor NDA with Apex Industries expires Feb 28. Initiate renewal negotiations this week.' },
          { priority: 'Medium', title: 'SLA performance review', desc: 'Annual SLA review for Rialto Systems is due Mar 5. Schedule review meeting.' },
          { priority: 'Low', title: 'Archive expired contracts', desc: '3 contracts expired in Q4 2025 and should be moved to the archive.' },
        ],
      },

      // ── Conflict ────────────────────────────────────────────
      conflict: {
        aiPoints: [
          '6 potential conflicts identified across the active matter portfolio.',
          '2 conflicts are rated High risk — Henderson Merger counterparty overlap and Pinnacle Properties related-party issue.',
          'Conflict screening completion rate is 86% — 3 new matters pending initial checks.',
          'Average conflict resolution time has improved to 3.2 days from 4.8 days last quarter.',
        ],
        aiActions: [
          { priority: 'High', title: 'Henderson Merger conflict check', desc: 'New counterparty identified requires immediate conflict screening before Thursday deadline.' },
          { priority: 'High', title: 'Pinnacle related-party review', desc: 'Potential related-party conflict flagged — requires partner-level review and determination.' },
          { priority: 'Medium', title: 'Complete pending conflict screens', desc: '3 new matters awaiting initial conflict checks. Assign to Rachel Lee.' },
        ],
      },

      // ── Risk ────────────────────────────────────────────────
      risk: {
        aiPoints: [
          '8 risks on the active register — 2 Critical, 3 High, 2 Medium, 1 Low.',
          'Filing deadline breach is the highest-rated risk (Critical/Almost Certain) — requires immediate attention.',
          'Client data handling risk has been upgraded from Medium to High following new regulatory guidance.',
          'Mitigation effectiveness is at 74% — 3 risks have overdue mitigation actions.',
        ],
        aiActions: [
          { priority: 'High', title: 'Address filing deadline risk', desc: 'Critical risk — settlement brief overdue. Escalate to partner level and assign additional resource.' },
          { priority: 'High', title: 'Review data handling controls', desc: 'Risk upgraded to High. Review current data handling procedures against new regulatory guidance.' },
          { priority: 'Medium', title: 'Update overdue mitigations', desc: '3 risks have mitigation actions past their review date. Schedule risk review meeting.' },
        ],
      },

      // ── Incident ────────────────────────────────────────────
      incident: {
        aiPoints: [
          '7 incidents logged this quarter — 3 escalated, 2 resolved, 2 under investigation.',
          'Most common theme is "Communication Delays" (3 incidents) followed by "Document Version Control" (2 incidents).',
          'Average resolution time is 4.2 days — within the 5-day SLA target.',
          'Client complaint regarding missed deadline on Rialto matter requires partner review.',
        ],
        aiActions: [
          { priority: 'High', title: 'Review Rialto client complaint', desc: 'Client has raised a formal complaint about missed document review deadline. Partner response required within 48 hours.' },
          { priority: 'Medium', title: 'Address communication delays pattern', desc: '3 incidents relate to communication delays. Consider implementing automated status updates.' },
          { priority: 'Low', title: 'Close resolved incidents', desc: '2 incidents are resolved but not formally closed. Complete closure documentation.' },
        ],
        incidents: [
          { id: 'INC-2026-001', type: 'Breach',    title: 'Unauthorised disclosure of client data',       client: 'Kensington Capital',  matter: 'M-4821',            severity: 'Critical', status: 'Investigating',       owner: 'Sarah Mitchell'  },
          { id: 'INC-2026-002', type: 'Complaint', title: 'Client complaint regarding delayed resolution', client: 'Hargrove Industries', matter: 'M-3917',            severity: 'Medium',   status: 'Open',                owner: 'James Thornton'  },
          { id: 'INC-2026-003', type: 'Incident',  title: 'System outage affecting document management',  client: 'Firm-wide',           matter: 'IT Infrastructure', severity: 'High',     status: 'Resolved',            owner: 'Rachel Adams'    },
          { id: 'INC-2026-004', type: 'Near miss', title: 'Potential conflict of interest identified',    client: 'Whitmore Partners',   matter: 'M-5023',            severity: 'Low',      status: 'Closed',              owner: 'David Chen'      },
          { id: 'INC-2026-005', type: 'Breach',    title: 'Late filing of anti-money laundering report',  client: 'Meridian Holdings',   matter: 'M-4456',            severity: 'High',     status: 'Reported externally', owner: 'Laura Beckford'  },
          { id: 'INC-2026-006', type: 'Complaint', title: 'Fee dispute and billing transparency concern', client: 'Ashford Group',       matter: 'M-3784',            severity: 'Low',      status: 'Resolved',            owner: "Michael O'Brien" },
          { id: 'INC-2026-007', type: 'Incident',  title: 'Phishing attack targeting partner email',      client: 'Firm-wide',           matter: 'Cyber Security',    severity: 'High',     status: 'Investigating',       owner: 'Rachel Adams'    },
        ],
      },

      // ── Audit ───────────────────────────────────────────────
      audit: {
        aiPoints: [
          'Q1 2026 audit evidence collection is 72% complete with 4 weeks remaining.',
          '3 evidence items are expiring within 30 days and need renewal — professional indemnity certificate, CPD records, and AML policy review.',
          'Last external audit (Dec 2025) had 2 findings — both remediation actions are in progress and on track.',
          'Assurance coverage is strong across Governance (94%) and Compliance (88%) but weak in Data Protection (62%).',
        ],
        aiActions: [
          { priority: 'High', title: 'Renew expiring evidence items', desc: '3 items expiring within 30 days. Professional indemnity certificate is highest priority (expires Mar 1).' },
          { priority: 'Medium', title: 'Improve Data Protection coverage', desc: 'Assurance coverage at 62% — below 80% threshold. Schedule evidence gathering session.' },
          { priority: 'Low', title: 'Prepare Q1 audit report', desc: 'Internal audit report due Mar 31. Begin drafting executive summary and findings section.' },
        ],
      },

      // ── Legislation ─────────────────────────────────────────
      legislation: {
        aiPoints: [
          '14 regulatory updates tracked this quarter — 3 have direct impact on active matters.',
          'Privacy Act amendments effective Mar 1 require updated data handling procedures across all client engagements.',
          'New whistleblower protections expand reporting obligations — firm policy update recommended.',
          'ESG disclosure standards (AASB S1/S2) effective Jul 1 will impact corporate advisory practice.',
        ],
        aiSuggestions: [
          'Update data handling procedures before Mar 1 Privacy Act amendments take effect.',
          'Review whistleblower policy and update to reflect expanded protections.',
          'Brief corporate advisory team on AASB S1/S2 requirements before Jul 1 effective date.',
          'Consider adding Modern Slavery Act compliance to standard client due diligence checklist.',
        ],
      },

      // ── Respond ─────────────────────────────────────────────
      respond: {
        draftActions: [
          { id: 1, title: 'Draft client update — Henderson Merger', status: 'Ready for review', time: '2 min ago' },
          { id: 2, title: 'Prepare settlement brief summary', status: 'In progress', time: '15 min ago' },
          { id: 3, title: 'Generate compliance report Q1', status: 'Queued', time: '1 hr ago' },
        ],
        featuredAgents: [
          { id: 1, name: 'Contract Reviewer', description: 'Analyses contracts and flags key clauses, risks and obligations.', category: 'Legal' },
          { id: 2, name: 'Compliance Checker', description: 'Reviews documents against regulatory requirements and internal policies.', category: 'Compliance' },
          { id: 3, name: 'Research Assistant', description: 'Searches legislation, case law and precedents for relevant authorities.', category: 'Research' },
        ],
      },

      // ── MatterDetail ────────────────────────────────────────
      matterDetail: {
        actors: {
          SM: { color: 'bg-slate-500 text-white', name: 'Sarah Mitchell' },
          JW: { color: 'bg-brand-800 text-brand-50', name: 'James Ward' },
          RL: { color: 'bg-violet-500 text-white', name: 'Rachel Lee' },
          KL: { color: 'bg-teal-600 text-white', name: 'Karen Liu' },
          DP: { color: 'bg-orange-500 text-white', name: 'David Park' },
        },
        tasks: [
          { id: 1, task: "File response to defendant's motion", assignee: 'SM', due: 'Feb 20', status: 'Behind', priority: 'Critical' },
          { id: 2, task: 'Client review and sign-off on strategy', assignee: 'JW', due: 'Feb 21', status: 'In Progress', priority: 'High' },
          { id: 3, task: 'Prepare and finalise settlement brief', assignee: 'SM', due: 'Feb 22', status: 'In Progress', priority: 'Critical' },
          { id: 4, task: 'Serve opposing counsel with documents', assignee: 'RL', due: 'Feb 23', status: 'Open', priority: 'High' },
          { id: 5, task: 'Court filing submission', assignee: 'SM', due: 'Feb 24', status: 'Open', priority: 'Critical' },
          { id: 6, task: 'Client debrief and next steps memo', assignee: 'JW', due: 'Mar 01', status: 'Open', priority: 'Medium' },
          { id: 7, task: 'Post-settlement compliance check', assignee: 'KL', due: 'Mar 10', status: 'Open', priority: 'Low' },
        ],
        risks: [
          { risk: 'Filing deadline breach — brief overdue', severity: 'Critical', status: 'Open', owner: 'SM' },
          { risk: 'Client communication gap during key period', severity: 'High', status: 'Mitigated', owner: 'JW' },
          { risk: 'Missing deposition transcripts (vol. 2)', severity: 'Medium', status: 'Open', owner: 'RL' },
          { risk: 'Opposing counsel procedural objection raised', severity: 'Low', status: 'Monitored', owner: 'SM' },
        ],
        documents: [
          { name: 'Settlement Brief (Draft v2)', type: 'Legal', date: 'Feb 18', status: 'Draft' },
          { name: 'Client Strategy Brief', type: 'Communications', date: 'Feb 10', status: 'Final' },
          { name: 'Motion to Dismiss Response', type: 'Legal', date: 'Feb 14', status: 'Under Review' },
          { name: 'Court Summons', type: 'Court', date: 'Jan 12', status: 'Filed' },
          { name: 'Evidence Bundle Vol. 1', type: 'Evidence', date: 'Feb 01', status: 'Complete' },
        ],
        fileCompleteness: [
          { label: 'Legal Documents', pct: 80 },
          { label: 'Court Filings', pct: 100 },
          { label: 'Client Correspondence', pct: 60 },
          { label: 'Evidence Bundle', pct: 45 },
        ],
        timeline: [
          { date: 'Feb 18', text: 'Settlement brief updated — draft v2 prepared', actor: 'SM' },
          { date: 'Feb 17', text: 'Court confirmed extended filing deadline to Feb 22', actor: null },
          { date: 'Feb 15', text: 'Mediation session concluded — no agreement reached', actor: 'JW' },
          { date: 'Feb 14', text: 'Motion to Dismiss Response reviewed and approved', actor: 'JW' },
          { date: 'Feb 10', text: 'Client strategy brief submitted', actor: 'SM' },
          { date: 'Feb 05', text: 'Expert witness deposition scheduled', actor: 'RL' },
          { date: 'Jan 28', text: 'Initial discovery phase completed', actor: 'SM' },
          { date: 'Jan 10', text: 'Matter opened and team assigned', actor: 'JW' },
        ],
        aiPoints: [
          'Settlement brief is overdue — Feb 22 filing deadline has passed with 3 critical tasks still open.',
          'SM has 4 critical-priority tasks with overlapping deadlines between Feb 20–24.',
          'Mediation concluded without agreement on Feb 15 — trial date set for Mar 15 if no resolution.',
          'File completeness at 71% overall — evidence bundle at 45% is the primary gap.',
          'Client communication continuity plan is in place — JW covering the Feb 18–20 period.',
        ],
      },

      // ── Insights ───────────────────────────────────────────
      insights: {
        hero: {
          contentType: 'Regulatory',
          title: 'ASIC Releases Updated Guidance on Director Obligations Under the Financial Accountability Regime',
          excerpt: 'New guidance clarifies how the Financial Accountability Regime (FAR) applies to directors of regulated entities, with specific focus on accountability statements, reasonable steps obligations, and enhanced notification requirements effective 15 March 2026.',
          image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop',
          author: 'Ethika Intelligence',
          readTime: '8 min read',
          date: 'Today',
          tags: ['FAR', 'Director Duties', 'ASIC'],
        },
        suggestedActions: [
          { title: 'Review FAR accountability statements', source: 'ASIC Updated Guidance', urgency: 'urgent' },
          { title: 'Update client advisory on privacy changes', source: 'Privacy Act Reform', urgency: 'urgent' },
          { title: 'Brief board on new ESG disclosure rules', source: 'AASB Sustainability Standards', urgency: 'recommended' },
          { title: 'Check AML/CTF program against new thresholds', source: 'AUSTRAC Guidance Note', urgency: 'recommended' },
          { title: 'Schedule compliance training update', source: 'Multiple regulatory changes', urgency: 'recommended' },
        ],
        briefingItems: [
          {
            id: 'INS-2026-0247', contentType: 'Regulatory', source: 'ASIC', priority: 'Critical',
            title: 'Financial Accountability Regime — Updated Director Guidance',
            excerpt: 'ASIC has released comprehensive guidance on director obligations under FAR, including new accountability statement templates and reasonable steps frameworks.',
            time: '2h ago', readTime: '8 min', tags: ['FAR', 'Director Duties'], contributor: null,
            impact_level: 'high', jurisdiction: 'Australia',
            executive_summary: 'ASIC has released Information Sheet 284, providing comprehensive guidance on how the Financial Accountability Regime (FAR) applies to directors of regulated entities. The guidance clarifies the "reasonable steps" obligation, introduces standardised accountability statement templates, and sets out enhanced notification requirements that take effect on 15 March 2026.\n\nThis represents the most significant regulatory guidance on director obligations since FAR commenced. Boards must now review their accountability frameworks against the new guidance and update accountability statements to meet ASIC\'s expectations. The guidance signals a more prescriptive approach to director accountability than many in the industry anticipated.',
            key_points: [
              'ASIC has published standardised accountability statement templates that set a new benchmark for specificity and measurability',
              'The "reasonable steps" obligation now includes explicit requirements for documented evidence of active oversight',
              'Enhanced notification requirements mean boards must report changes to accountability arrangements within 30 days',
              'ASIC signals it will take enforcement action where accountability statements are "generic or vague"',
              'Transitional period: existing statements must be updated by 15 September 2026',
            ],
            what_has_changed: [
              { change_type: 'Regulation', status: 'In Force', title: 'Accountability Statement Templates', description: 'New standardised templates require specific, measurable responsibilities for each accountable person. Generic role descriptions no longer meet ASIC expectations.', citation: 'ASIC Information Sheet 284, Section 3' },
              { change_type: 'Guidance', status: 'New', title: 'Reasonable Steps Framework', description: 'ASIC now expects documented evidence that directors are taking active, ongoing steps to discharge their accountability obligations — not merely delegating to management.', citation: 'ASIC Information Sheet 284, Section 5' },
              { change_type: 'Regulation', status: 'In Force', title: 'Notification Requirements', description: 'Changes to accountability arrangements must be notified to ASIC within 30 days (previously 60 days). Includes changes to reporting lines, committee structures, and delegations.', citation: 'Financial Accountability Regime Act 2023, s 37A (as amended)' },
            ],
            why_it_matters: {
              org_impact: [
                'All existing accountability statements must be reviewed and updated against the new templates by 15 September 2026',
                'Board and committee charters may need amendment to align with the more prescriptive accountability framework',
                'Enhanced notification requirements increase the compliance burden on company secretaries and governance teams',
                'Documentation requirements for "reasonable steps" will require new governance processes and evidence trails',
              ],
              client_impact: [
                'Clients in regulated industries will need advisory support to update their accountability frameworks',
                'Board advisory engagements should include FAR accountability statement reviews',
                'Directors serving on multiple boards face compounding compliance obligations',
              ],
              risk_level: 'high',
              risk_explanation: 'ASIC has explicitly stated it will take enforcement action against entities with non-compliant accountability statements after the transition period. The reputational and financial risk of non-compliance is significant.',
            },
            recommended_actions: [
              { title: 'Review current accountability statements', description: 'Compare existing accountability statements against ASIC\'s new templates and identify gaps.', urgency: 'Urgent', action_type: 'task' },
              { title: 'Brief the board on new requirements', description: 'Prepare a board paper summarising the key changes and proposed remediation timeline.', urgency: 'Urgent', action_type: 'task' },
              { title: 'Update governance documentation', description: 'Amend board and committee charters to align with the prescriptive accountability framework.', urgency: 'Recommended', action_type: 'task' },
              { title: 'Notify clients in regulated industries', description: 'Send a client alert summarising the changes and offering advisory support.', urgency: 'Recommended', action_type: 'draft' },
              { title: 'Establish reasonable steps evidence trail', description: 'Implement processes for documenting director oversight activities on an ongoing basis.', urgency: 'Recommended', action_type: 'task' },
            ],
            ai_draft_client_alert: 'Dear [Client],\n\nWe are writing to bring to your attention significant new guidance from ASIC regarding director obligations under the Financial Accountability Regime (FAR).\n\nASIC Information Sheet 284, released on [date], introduces standardised accountability statement templates, clarifies the "reasonable steps" obligation, and imposes enhanced notification requirements. Key implications for your board include:\n\n• All existing accountability statements must be reviewed and updated by 15 September 2026\n• Directors must now maintain documented evidence of active oversight activities\n• Changes to accountability arrangements must be reported to ASIC within 30 days\n\nWe recommend scheduling a governance review to assess your current framework against the new requirements. Our team is available to assist with accountability statement updates and board briefing preparation.\n\nPlease do not hesitate to contact us to discuss.\n\nKind regards,\n[Name]',
            ai_draft_internal_brief: 'INTERNAL BRIEF — FAR Updated Director Guidance\n\nPriority: Critical | Source: ASIC Information Sheet 284\n\nSummary: ASIC has released comprehensive guidance on FAR director obligations. Accountability statements must be updated by 15 September 2026. The "reasonable steps" standard is now more prescriptive.\n\nKey Actions Required:\n1. Immediate: Review all existing accountability statements against new templates\n2. Within 30 days: Brief the board on new requirements and proposed remediation plan\n3. Within 90 days: Update governance documentation and implement evidence trail processes\n\nRisk: High — ASIC has signalled enforcement action for non-compliance.\n\nOwner: [Governance Lead]\nDeadline: 15 September 2026',
            risk_considerations: [
              'Non-compliance after the transition period may result in ASIC enforcement action including civil penalties',
              'Generic accountability statements that do not meet the new specificity requirements create regulatory risk',
              'Directors serving on multiple regulated entity boards face compounding compliance obligations and potential conflicts',
              'Insufficient documentation of "reasonable steps" could be used as evidence of non-compliance in future enforcement proceedings',
            ],
            linked_content: {
              learning: [
                { title: 'Director Duties Deep Dive', type: 'Learning Module', time: '2 hrs' },
                { title: 'Board Governance Fundamentals', type: 'Course', time: '3 hrs' },
              ],
              policies: [
                { title: 'Board Governance Policy', type: 'Policy' },
                { title: 'Conflict of Interest Management Playbook', type: 'Playbook' },
              ],
            },
            board_discussion: {
              prompt: 'Consider raising this at your next board or committee meeting.',
              questions: [
                'Are our current accountability statements sufficiently specific and measurable to meet ASIC\'s new expectations?',
                'What evidence are we currently maintaining to demonstrate "reasonable steps" — and is it adequate?',
                'Do we need external advisory support to update our FAR compliance framework within the transition period?',
              ],
            },
          },
          {
            id: 'INS-2026-0246', contentType: 'Enforcement', source: 'ASIC', priority: 'High Priority',
            title: 'ASIC Commences Civil Penalty Proceedings Against Former Fund Director',
            excerpt: 'Proceedings allege breach of duty of care and diligence in oversight of investment strategy, resulting in $42M in client losses.',
            time: '3h ago', readTime: '5 min', tags: ['Enforcement', 'Fund Directors'], contributor: null,
            impact_level: 'high', jurisdiction: 'Australia',
            executive_summary: 'ASIC has commenced civil penalty proceedings in the Federal Court against a former director of a mid-tier fund manager, alleging breaches of the duty of care and diligence under section 180 of the Corporations Act. The proceedings relate to the director\'s oversight of investment strategy decisions that resulted in approximately $42 million in client losses.\n\nThis case is significant because it targets a non-executive director\'s oversight role rather than direct decision-making. ASIC alleges the director failed to adequately scrutinise investment recommendations, did not seek independent expert advice when red flags emerged, and continued to approve strategies despite deteriorating fund performance.',
            key_points: [
              'First ASIC enforcement action targeting a non-executive director\'s oversight of investment strategy since the FAR commenced',
              'Allegations centre on failure to scrutinise, failure to seek independent advice, and failure to act on red flags',
              'ASIC seeking civil penalties, disqualification orders, and compensation for affected investors',
              '$42M in client losses across three managed investment schemes',
              'Case signals ASIC\'s willingness to pursue individual directors — not just entities — under the current enforcement strategy',
            ],
            what_has_changed: [
              { change_type: 'Case Law', status: 'New', title: 'Enforcement Proceedings Filed', description: 'Federal Court proceedings commenced against former non-executive director for breach of s 180 duty of care and diligence.', citation: 'ASIC v [Defendant] [2026] FCA (proceedings commenced 22 March 2026)' },
              { change_type: 'Guidance', status: 'New', title: 'ASIC Enforcement Priorities Signal', description: 'This action signals ASIC\'s intent to hold individual directors accountable for oversight failures, particularly in the funds management sector.', citation: 'ASIC Media Release 26-065MR' },
            ],
            why_it_matters: {
              org_impact: [
                'Directors overseeing investment committees should review their scrutiny processes and documentation',
                'Board minutes should clearly evidence the questioning, challenge, and independent analysis undertaken by directors',
                'D&O insurance coverage and limits should be reviewed in light of ASIC\'s individual enforcement approach',
              ],
              client_impact: [
                'Fund manager clients should brief their boards on the implications of this enforcement action',
                'Investment governance frameworks may need strengthening to demonstrate adequate director oversight',
              ],
              risk_level: 'high',
              risk_explanation: 'This case establishes a potential precedent for ASIC enforcement action against non-executive directors for oversight failures. Directors who rely on management recommendations without independent scrutiny face increased personal liability risk.',
            },
            recommended_actions: [
              { title: 'Review investment oversight documentation', description: 'Ensure board minutes evidence adequate director scrutiny of investment strategy recommendations.', urgency: 'Urgent', action_type: 'task' },
              { title: 'Brief investment committee directors', description: 'Advise directors on the case implications and review individual oversight practices.', urgency: 'Urgent', action_type: 'task' },
              { title: 'Review D&O insurance coverage', description: 'Check current D&O policy limits and exclusions in light of individual enforcement trend.', urgency: 'Recommended', action_type: 'task' },
            ],
            ai_draft_client_alert: 'Dear [Client],\n\nASIC has commenced civil penalty proceedings against a former fund director, alleging breach of the duty of care and diligence in oversight of investment strategy. The case resulted in $42M in client losses.\n\nThis is significant because ASIC is targeting a non-executive director\'s oversight role. We recommend reviewing your investment governance framework and ensuring board minutes adequately evidence director scrutiny.\n\nWe are available to assist with a governance health check.\n\nKind regards,\n[Name]',
            ai_draft_internal_brief: 'INTERNAL BRIEF — ASIC Enforcement: Fund Director\n\nPriority: High | Source: ASIC Media Release 26-065MR\n\nSummary: ASIC pursuing civil penalties against a non-executive director for oversight failures. $42M client losses. Signals individual accountability enforcement trend.\n\nKey Actions: Review investment committee oversight documentation. Brief directors. Check D&O coverage.\n\nOwner: [Governance Lead]',
            risk_considerations: [
              'Non-executive directors who rely solely on management recommendations without independent scrutiny face personal liability risk',
              'Board minutes that lack evidence of questioning and challenge may be used as evidence of inadequate oversight',
              'This case may encourage ASIC to pursue similar actions against directors in other sectors',
            ],
            linked_content: {
              learning: [{ title: 'Director Duties Deep Dive', type: 'Learning Module', time: '2 hrs' }],
              policies: [{ title: 'Board Governance Policy', type: 'Policy' }],
            },
            board_discussion: {
              prompt: 'Consider raising this at your next board or committee meeting.',
              questions: [
                'How do we currently evidence director scrutiny of investment strategy recommendations in our board minutes?',
                'Do we have adequate independent expert advisory arrangements to support director oversight?',
              ],
            },
          },
          {
            id: 'INS-2026-0245', contentType: 'News', source: 'Australian Financial Review', priority: null,
            title: 'Privacy Act Reform Bill Passes Senate — What Boards Need to Know',
            excerpt: 'Key amendments include mandatory privacy impact assessments for high-risk processing and expanded individual rights framework.',
            time: '5h ago', readTime: '6 min', tags: ['Privacy', 'Legislation'], contributor: null,
            impact_level: 'medium', jurisdiction: 'Australia',
            executive_summary: 'The Privacy Act Reform Bill 2026 has passed the Senate, introducing the most significant changes to Australian privacy law in over a decade. The reforms include mandatory privacy impact assessments for high-risk data processing, an expanded individual rights framework (including a right to erasure), and new enforcement powers for the OAIC.\n\nOrganisations have until 1 July 2026 to comply with the first tranche of reforms. Boards should prioritise understanding the new obligations and ensuring their privacy frameworks are updated accordingly.',
            key_points: [
              'Mandatory privacy impact assessments required for all high-risk data processing activities',
              'New individual rights including right to erasure, right to object to automated decision-making',
              'OAIC enforcement powers expanded — maximum penalties increased to $50M or 30% of turnover',
              'First tranche effective 1 July 2026; second tranche (including children\'s privacy code) effective 1 January 2027',
            ],
            what_has_changed: [
              { change_type: 'Legislation', status: 'New', title: 'Privacy Act Reform Bill 2026', description: 'Comprehensive reform introducing mandatory PIAs, expanded individual rights, and enhanced enforcement powers.', citation: 'Privacy Act 1988 (Cth), as amended by Privacy Act Reform Bill 2026' },
            ],
            why_it_matters: {
              org_impact: [
                'Privacy impact assessment processes must be established or updated before 1 July 2026',
                'Data handling procedures need review to accommodate the right to erasure',
                'Privacy policies and notices must be updated to reflect the new individual rights framework',
              ],
              client_impact: [
                'Clients across all sectors will need guidance on compliance with the new privacy obligations',
                'Organisations handling children\'s data face additional requirements under the second tranche',
              ],
              risk_level: 'medium',
              risk_explanation: 'The significantly increased penalties make non-compliance a material financial risk. However, the 1 July 2026 deadline provides adequate time for preparation.',
            },
            recommended_actions: [
              { title: 'Conduct privacy framework gap analysis', description: 'Assess current privacy practices against the new requirements.', urgency: 'Recommended', action_type: 'task' },
              { title: 'Update privacy policies', description: 'Revise privacy notices to reflect expanded individual rights.', urgency: 'Recommended', action_type: 'task' },
              { title: 'Brief the board on penalty changes', description: 'Ensure directors understand the increased enforcement risk.', urgency: 'Recommended', action_type: 'task' },
            ],
            ai_draft_client_alert: 'Dear [Client],\n\nThe Privacy Act Reform Bill 2026 has passed the Senate. Key changes include mandatory privacy impact assessments, expanded individual rights, and increased penalties (up to $50M). First tranche effective 1 July 2026.\n\nWe recommend conducting a gap analysis of your current privacy framework. Our team can assist.\n\nKind regards,\n[Name]',
            ai_draft_internal_brief: 'INTERNAL BRIEF — Privacy Act Reform\n\nPriority: Medium | Source: Federal Parliament\n\nSummary: Privacy Act reforms passed. Mandatory PIAs, right to erasure, penalties up to $50M. Effective 1 July 2026.\n\nKey Actions: Gap analysis, policy updates, board briefing.\n\nOwner: [Privacy Lead]',
            risk_considerations: [
              'Maximum penalties of $50M or 30% of turnover make non-compliance a material financial risk',
              'The right to erasure creates technical challenges for organisations with legacy data systems',
            ],
            linked_content: {
              learning: [{ title: 'Privacy & Data Protection', type: 'Course', time: '2 hrs' }],
              policies: [{ title: 'Privacy Impact Assessment Template', type: 'Template' }, { title: 'Data Breach Response Playbook', type: 'Playbook' }],
            },
            board_discussion: null,
          },
          { id: 'INS-2026-0244', contentType: 'Articles', source: 'Governance Institute', priority: null, title: 'ESG Reporting: Preparing for Mandatory Climate Disclosures in 2026', excerpt: 'Practical guidance on implementing AASB sustainability disclosure standards ahead of the January 2027 reporting deadline for Group 2 entities.', time: '6h ago', readTime: '10 min', tags: ['ESG', 'Climate Disclosure'], contributor: { name: 'Prof. Sarah Chen', role: 'ESG Advisory Board' }, impact_level: 'medium', jurisdiction: 'Australia', executive_summary: 'With Group 2 entities facing a January 2027 deadline for mandatory climate disclosures under the AASB sustainability standards, this article provides practical guidance on implementation. Key areas covered include scope 1 and 2 emissions measurement, governance disclosure requirements, and the transition relief provisions available in the first reporting period.', key_points: ['Group 2 entities must comply with AASB S1 and S2 from 1 January 2027', 'Transition relief available for scope 3 emissions in the first reporting period', 'Governance disclosures require board-level climate competence evidence', 'Early adopters report 6-12 month implementation timelines'], what_has_changed: [{ change_type: 'Legislation', status: 'In Force', title: 'AASB Sustainability Disclosure Standards', description: 'Mandatory climate disclosure requirements for Group 2 entities effective January 2027.', citation: 'Treasury Laws Amendment (Financial Market Infrastructure and Other Measures) Act 2024' }], why_it_matters: { org_impact: ['Implementation planning should begin now — early adopters report 6-12 month timelines', 'Board climate competence needs to be assessed and gaps addressed'], client_impact: ['Advisory clients in Group 2 will need implementation support'], risk_level: 'medium', risk_explanation: 'While the deadline is January 2027, implementation complexity means organisations need to begin preparation now.' }, recommended_actions: [{ title: 'Assess readiness for climate disclosures', description: 'Evaluate current data collection, governance, and reporting capabilities.', urgency: 'Recommended', action_type: 'task' }], ai_draft_client_alert: null, ai_draft_internal_brief: null, risk_considerations: ['Inadequate preparation may result in qualified disclosures or regulatory scrutiny', 'Scope 3 emissions data remains challenging for most organisations'], linked_content: { learning: [{ title: 'ESG Reporting Frameworks', type: 'Learning Module', time: '3 hrs' }], policies: [{ title: 'Modern Slavery Statement Guide', type: 'Guide' }] }, board_discussion: null },
          { id: 'INS-2026-0243', contentType: 'Regulatory', source: 'APRA', priority: 'High Priority', title: 'CPS 230 Operational Resilience — Final Compliance Deadline Approaching', excerpt: 'APRA confirms 1 July 2026 deadline for full CPS 230 compliance. Material service provider registers and business continuity plans must be finalised.', time: '8h ago', readTime: '7 min', tags: ['CPS 230', 'Operational Resilience'], contributor: null, impact_level: 'high', jurisdiction: 'Australia', executive_summary: 'APRA has confirmed there will be no further extensions to the 1 July 2026 deadline for full CPS 230 compliance. Regulated entities must have their material service provider registers, business continuity plans, and tolerance level documentation finalised and tested.', key_points: ['1 July 2026 deadline confirmed — no further extensions', 'Material service provider registers must be complete', 'Business continuity plans must be tested', 'APRA will commence supervisory reviews from Q3 2026'], what_has_changed: [{ change_type: 'Regulation', status: 'In Force', title: 'CPS 230 Final Deadline Confirmation', description: 'APRA confirms no extension to the 1 July 2026 compliance deadline for CPS 230 Operational Risk Management.', citation: 'APRA Letter to Industry, March 2026' }], why_it_matters: { org_impact: ['Compliance programs must be finalised within the next 3 months', 'Testing of business continuity plans should be completed before the deadline'], client_impact: ['Regulated entity clients need immediate support if compliance gaps remain'], risk_level: 'high', risk_explanation: 'APRA has signalled active supervisory enforcement from Q3 2026.' }, recommended_actions: [{ title: 'Conduct CPS 230 readiness assessment', description: 'Identify any remaining compliance gaps.', urgency: 'Urgent', action_type: 'task' }, { title: 'Complete BCP testing', description: 'Ensure business continuity plans have been tested before the deadline.', urgency: 'Urgent', action_type: 'task' }], ai_draft_client_alert: null, ai_draft_internal_brief: null, risk_considerations: ['APRA supervisory reviews from Q3 2026 may result in formal directions for non-compliant entities'], linked_content: { learning: [{ title: 'Risk Management Essentials', type: 'Course', time: '3 hrs' }], policies: [{ title: 'Risk Management Framework', type: 'Guide' }] }, board_discussion: { prompt: 'Consider raising this at your next board or committee meeting.', questions: ['Are we on track for full CPS 230 compliance by 1 July 2026?', 'Have our business continuity plans been adequately tested?'] } },
          { id: 'INS-2026-0242', contentType: 'News', source: 'Law Council of Australia', priority: null, title: 'AI in Legal Practice — New Ethical Guidelines Released', excerpt: 'The guidelines address client confidentiality when using AI tools, disclosure obligations, and competence requirements for technology-assisted legal services.', time: '10h ago', readTime: '4 min', tags: ['AI', 'Legal Ethics'], contributor: { name: 'Dr. Michael Torres', role: 'Legal Tech Research Fellow' }, impact_level: 'low', jurisdiction: 'Australia', executive_summary: 'The Law Council of Australia has released ethical guidelines for AI use in legal practice, addressing confidentiality, disclosure, and competence requirements.', key_points: ['Client data must not be entered into public AI tools without consent', 'Practitioners must disclose AI-assisted work to clients', 'Competence obligations extend to understanding AI tool limitations'], what_has_changed: [{ change_type: 'Guidance', status: 'New', title: 'AI Ethical Guidelines for Legal Practice', description: 'New professional conduct guidance on AI use.', citation: 'Law Council of Australia, AI Ethics Guidelines 2026' }], why_it_matters: { org_impact: ['Internal AI use policies should be reviewed against the new guidelines'], client_impact: ['Disclosure obligations may require updates to engagement letters'], risk_level: 'low', risk_explanation: 'Guidelines are non-binding but represent emerging professional standards.' }, recommended_actions: [{ title: 'Review internal AI use policy', description: 'Compare current policy against the new guidelines.', urgency: 'Recommended', action_type: 'task' }], ai_draft_client_alert: null, ai_draft_internal_brief: null, risk_considerations: ['Non-compliance with professional guidelines may be relevant in disciplinary proceedings'], linked_content: { learning: [], policies: [] }, board_discussion: null },
          { id: 'INS-2026-0241', contentType: 'Regulatory', source: 'AUSTRAC', priority: null, title: 'Updated AML/CTF Guidance — Threshold Transaction Reporting Changes', excerpt: 'New thresholds for cash transaction reporting and enhanced customer due diligence requirements for designated services.', time: '12h ago', readTime: '5 min', tags: ['AML/CTF', 'AUSTRAC'], contributor: null, impact_level: 'medium', jurisdiction: 'Australia', executive_summary: 'AUSTRAC has updated threshold transaction reporting requirements and enhanced CDD guidance for designated services.', key_points: ['Cash transaction reporting threshold adjusted', 'Enhanced CDD for high-risk designated services', 'New guidance on digital currency reporting'], what_has_changed: [{ change_type: 'Regulation', status: 'Amended', title: 'Threshold Transaction Reporting', description: 'Adjusted thresholds and new digital currency reporting requirements.', citation: 'AML/CTF Rules, Chapter 16 (as amended)' }], why_it_matters: { org_impact: ['Transaction monitoring systems may need updating', 'Staff training on new thresholds required'], client_impact: ['Financial services clients need to update their reporting procedures'], risk_level: 'medium', risk_explanation: 'AUSTRAC has increased enforcement activity in recent quarters.' }, recommended_actions: [{ title: 'Update transaction monitoring thresholds', description: 'Adjust automated monitoring systems to reflect new requirements.', urgency: 'Recommended', action_type: 'task' }], ai_draft_client_alert: null, ai_draft_internal_brief: null, risk_considerations: ['AUSTRAC enforcement fines have increased significantly — non-compliance is costly'], linked_content: { learning: [{ title: 'AML/CTF Compliance', type: 'Course', time: '4 hrs' }], policies: [{ title: 'Anti-Money Laundering Policy', type: 'Policy' }] }, board_discussion: null },
          { id: 'INS-2026-0240', contentType: 'Articles', source: 'Ethika Intelligence', priority: null, title: 'Board Governance Trends — What Directors Should Watch in H2 2026', excerpt: 'Analysis of emerging governance themes including cyber resilience, supply chain due diligence, and director liability in the age of AI.', time: '1d ago', readTime: '12 min', tags: ['Governance', 'Board Trends'], contributor: null, impact_level: 'low', jurisdiction: null, executive_summary: 'An analysis of the key governance themes that will shape board agendas in the second half of 2026, covering cyber resilience, supply chain ESG due diligence, AI governance frameworks, and evolving director liability standards.', key_points: ['Cyber resilience moving from IT agenda to board-level strategic risk', 'Supply chain due diligence obligations expanding under EU and Australian regulation', 'AI governance frameworks becoming a board competence requirement', 'Director liability exposure increasing across multiple regulatory fronts'], what_has_changed: [], why_it_matters: { org_impact: ['Boards should review their H2 agenda to ensure coverage of emerging themes'], client_impact: ['Advisory clients benefit from forward-looking governance intelligence'], risk_level: 'low', risk_explanation: 'These are emerging trends rather than immediate compliance obligations.' }, recommended_actions: [{ title: 'Review board agenda for H2 2026', description: 'Ensure emerging governance themes are on the forward agenda.', urgency: 'Optional', action_type: 'task' }], ai_draft_client_alert: null, ai_draft_internal_brief: null, risk_considerations: [], linked_content: { learning: [{ title: 'Board Governance Fundamentals', type: 'Course', time: '3 hrs' }], policies: [] }, board_discussion: null },
        ],
        listenLearn: [
          { type: 'Podcast', title: 'The Governance Edge: Director Duties in the FAR Era', speaker: 'Prof. Sarah Chen & James Whitfield', duration: '42 min', date: 'Mar 22', image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=300&fit=crop', upcoming: false },
          { type: 'Webinar', title: 'Navigating CPS 230 — Practical Implementation Guide', speaker: 'APRA Panel Discussion', duration: '60 min', date: 'Mar 28', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop', upcoming: true, registrations: 234 },
          { type: 'Podcast', title: 'Privacy Act Reform — Board-Level Implications', speaker: 'Dr. Michael Torres', duration: '35 min', date: 'Mar 20', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop', upcoming: false },
          { type: 'Webinar', title: 'ESG Disclosure Masterclass — From Framework to Filing', speaker: 'Governance Institute Panel', duration: '90 min', date: 'Apr 3', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop', upcoming: true, registrations: 187 },
        ],
        focusAreas: [
          { name: 'Director Duties & FAR', count: 12, urgency: 'High', snippet: 'ASIC updated FAR guidance — accountability statement review required', time: '2h ago' },
          { name: 'Privacy & Data Protection', count: 8, urgency: 'Elevated', snippet: 'Privacy Act reform passes Senate — new compliance obligations', time: '5h ago' },
          { name: 'ESG & Climate Disclosure', count: 15, urgency: 'Medium', snippet: 'AASB sustainability standards — Group 2 deadline Jan 2027', time: '6h ago' },
          { name: 'AML/CTF Compliance', count: 6, urgency: 'Medium', snippet: 'Updated threshold reporting requirements from AUSTRAC', time: '12h ago' },
          { name: 'Operational Resilience', count: 9, urgency: 'High', snippet: 'CPS 230 final compliance deadline 1 July 2026', time: '8h ago' },
          { name: 'AI & Legal Technology', count: 4, urgency: 'Low', snippet: 'New ethical guidelines for AI use in legal practice', time: '10h ago' },
        ],
        regulatory: [
          { urgency: 'critical', type: 'Legislation', source: 'Federal Parliament', jurisdiction: 'AU', title: 'Privacy Act Reform Bill 2026', date: 'Mar 22', deadline: 'Jul 1, 2026' },
          { urgency: 'high', type: 'Enforcement', source: 'ASIC', jurisdiction: 'AU', title: 'Civil proceedings — former fund director breach of duty', date: 'Mar 22', deadline: null },
          { urgency: 'high', type: 'Deadline', source: 'APRA', jurisdiction: 'AU', title: 'CPS 230 Operational Resilience — full compliance', date: 'Mar 20', deadline: 'Jul 1, 2026' },
          { urgency: 'medium', type: 'Consultation', source: 'Treasury', jurisdiction: 'AU', title: 'Sustainable finance taxonomy — public consultation', date: 'Mar 19', deadline: 'Jun 15, 2026' },
          { urgency: 'medium', type: 'Legislation', source: 'AUSTRAC', jurisdiction: 'AU', title: 'AML/CTF threshold transaction reporting amendments', date: 'Mar 18', deadline: 'Sep 1, 2026' },
          { urgency: 'low', type: 'Guidance', source: 'Law Council', jurisdiction: 'AU', title: 'AI in legal practice — ethical guidelines', date: 'Mar 17', deadline: null },
        ],
        communityVoices: [
          { quote: 'The FAR accountability statement requirements are a step in the right direction, but the lack of clear safe harbour provisions creates real uncertainty for non-executive directors.', author: 'Rebecca Thornton', role: 'Non-Executive Director', org: 'ASX 200 Board', tag: 'FAR', likes: 47, comments: 12 },
          { quote: 'Every board I advise is asking the same question — how do we demonstrate "reasonable steps" under FAR without turning directors into compliance officers?', author: 'Michael Greer', role: 'Governance Consultant', org: 'BoardAdvisory Group', tag: 'Director Duties', likes: 63, comments: 21 },
          { quote: 'The Privacy Act reforms finally bring Australia closer to GDPR standards. Boards need to start treating data governance as a strategic priority, not just a compliance checkbox.', author: 'Dr. Anita Kapoor', role: 'Privacy Commissioner (former)', org: '', tag: 'Privacy Reform', likes: 89, comments: 34 },
        ],
        emergingRisks: [
          { theme: 'AI Governance & Liability', count: 18, trend: 'rising', headline: 'Regulators globally intensifying scrutiny of AI use in regulated industries' },
          { theme: 'Supply Chain Due Diligence', count: 12, trend: 'rising', headline: 'New EU due diligence directive creating extraterritorial compliance pressure' },
          { theme: 'Cyber Resilience', count: 15, trend: 'stable', headline: 'CPS 234 enforcement actions driving uplift in board-level cyber reporting' },
          { theme: 'Greenwashing Enforcement', count: 8, trend: 'rising', headline: 'ACCC and ASIC coordinating on misleading sustainability claims' },
          { theme: 'Director Personal Liability', count: 6, trend: 'stable', headline: 'Rising trend in personal liability actions against non-executive directors' },
        ],
      },

      // ── Community / Connect ────────────────────────────────────
      community: {
        promptOfDay: {
          title: 'What AI tool or workflow has saved you the most time this quarter?',
          author: 'Ethika Community Team',
          responses: 34,
        },
        topics: [
          { name: 'AI in Practice', count: 127 },
          { name: 'Governance', count: 94 },
          { name: 'Risk & Compliance', count: 82 },
          { name: 'Director Duties', count: 68 },
          { name: 'ESG & Sustainability', count: 55 },
          { name: 'Privacy & Data', count: 47 },
          { name: 'Legal Tech', count: 41 },
          { name: 'Board Effectiveness', count: 36 },
        ],
        joinedGroups: [
          { name: 'AI Governance', members: 342 },
          { name: 'Boards & Directors', members: 218 },
          { name: 'Legal Professionals', members: 567 },
        ],
        posts: [
          { id: 'CP-001', type: 'AI Win', author: 'Sarah Mitchell', role: 'Governance Lead', org: 'Whitfield Legal', time: '2h ago', title: 'Using Claude to draft board paper summaries — cut prep time by 60%', snippet: 'We integrated Claude into our board paper workflow to generate executive summaries for each agenda item. Directors now receive a 2-page brief instead of a 40-page pack, with the full pack available on request.', tags: ['AI in Practice', 'Board Effectiveness'], replies: 18, saved: false },
          { id: 'CP-002', type: 'Question', author: 'David Park', role: 'Company Secretary', org: 'Meridian Group', time: '4h ago', title: 'How are you handling CPS 230 material service provider assessments?', snippet: 'We have 40+ third-party providers and the register requirement feels overwhelming. Has anyone found a practical approach to the materiality assessment that doesn\'t require a full-time role?', tags: ['Risk & Compliance', 'CPS 230'], replies: 24, saved: false },
          { id: 'CP-003', type: 'Discussion', author: 'Prof. Sarah Chen', role: 'ESG Advisory Board', org: 'Governance Institute', time: '6h ago', title: 'Mandatory climate disclosures — are boards really ready?', snippet: 'With Group 2 entities facing January 2027 deadlines, I\'m seeing a significant gap between board awareness and operational readiness. The governance frameworks are there but the data pipelines aren\'t.', tags: ['ESG & Sustainability', 'Governance'], replies: 31, saved: true },
          { id: 'CP-004', type: 'Ethika', author: 'Ethika Intelligence', role: 'Editorial Team', org: 'Ethika', time: '8h ago', title: 'Weekly roundup: Top 5 regulatory developments you may have missed', snippet: 'This week\'s highlights include ASIC\'s updated FAR guidance, the Privacy Act reform passing Senate, APRA\'s CPS 230 reminder, new AUSTRAC thresholds, and the Law Council\'s AI ethics guidelines.', tags: ['Governance', 'Risk & Compliance'], replies: 12, saved: false },
          { id: 'CP-005', type: 'AI Win', author: 'Laura Singh', role: 'Risk Committee Chair', org: 'Whitfield Legal', time: '1d ago', title: 'Automated conflict checking with AI — lessons from 6 months live', snippet: 'We built an AI-powered conflict checking workflow that cross-references new matters against our entire client and matter history. False positive rate dropped from 35% to 8% after fine-tuning.', tags: ['AI in Practice', 'Legal Tech'], replies: 42, saved: false },
          { id: 'CP-006', type: 'Question', author: 'James Wilson', role: 'Senior Associate', org: 'Norton Rose', time: '1d ago', title: 'Best practices for AI disclosure to clients?', snippet: 'Our firm is finalising its AI use policy and we\'re debating how transparent to be with clients about AI-assisted work. What level of disclosure are others adopting?', tags: ['AI in Practice', 'Legal Ethics'], replies: 37, saved: false },
        ],
        featuredMentors: [
          { name: 'Prof. Sarah Chen', role: 'ESG & Governance Advisor', tags: ['ESG', 'Board Governance', 'Climate Risk'], avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&h=128&fit=crop&crop=faces' },
          { name: 'Michael Greer', role: 'Governance Consultant', tags: ['Director Duties', 'FAR', 'Risk'], avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=faces' },
          { name: 'Dr. Anita Kapoor', role: 'Privacy & Data Specialist', tags: ['Privacy', 'Data Governance', 'GDPR'], avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=128&h=128&fit=crop&crop=faces' },
          { name: 'Tom Barker', role: 'Risk & Policy Advisor', tags: ['AML/CTF', 'Regulatory', 'Controls'], avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=faces' },
        ],
        upcomingEvents: [
          { title: 'CPS 230 Implementation Workshop', date: 'Mar 28', format: 'Webinar', cpdPoints: 2, rsvps: 234 },
          { title: 'AI Ethics in Legal Practice Roundtable', date: 'Apr 3', format: 'Panel', cpdPoints: 1.5, rsvps: 87 },
          { title: 'ESG Disclosure Masterclass', date: 'Apr 10', format: 'Workshop', cpdPoints: 3, rsvps: 156 },
          { title: 'Board Effectiveness Review Bootcamp', date: 'Apr 17', format: 'In-person', cpdPoints: 4, rsvps: 62 },
        ],
        collaborationGroups: [
          { name: 'AI Governance', description: 'Exploring responsible AI adoption in professional practice', members: 342, category: 'Topic', joined: true },
          { name: 'Legal Professionals', description: 'General discussion for lawyers and legal practitioners', members: 567, category: 'Profession', joined: true },
          { name: 'Boards & Directors', description: 'Governance, strategy, and director duties', members: 218, category: 'Profession', joined: true },
          { name: 'Risk & Compliance', description: 'Risk management, compliance frameworks, and regulatory change', members: 289, category: 'Topic', joined: false },
          { name: 'NFP Governance', description: 'Not-for-profit board governance and compliance', members: 124, category: 'Profession', joined: false },
          { name: 'Financial Services', description: 'Banking, insurance, and superannuation governance', members: 198, category: 'Profession', joined: false },
        ],
      },

    }, // end pages
  }, // end default
}

const tenant = configs.default

export default tenant
