// ─── Tenant Configuration ─────────────────────────────────────────────────────
//
// Add a new key to `configs` for each tenant variant.
// Run a specific tenant locally with:  npm run dev:migration
// Or inline:  VITE_TENANT=migration npm run dev
//
// For Vercel deployments, set VITE_TENANT in the project's Environment Variables.
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
    appName: 'Ethika Ethos',
    logo: '/ethos-logo.svg',
    icon: '/ethos-icon.svg',
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
          { id: 1, title: 'ESG Disclosure & Reporting Standards', month: 'MAR', day: '12', year: '2026', time: '10:00 AM – 12:30 PM', location: 'Online', provider: 'Ethika Academy', type: 'Workshop', cpdHours: 2.5, cpdPoints: 2.5, category: 'Risk & Compliance', categories: ['Risk & Compliance', 'Governance & Board Effectiveness'], regimes: ['law-society-nsw', 'aicd'], isEthika: true, capacity: 40, registered: 32, waitlistCount: 0, status: 'Booked', description: 'Learn the latest ESG disclosure frameworks including ISSB standards, ASRS requirements, and practical approaches to sustainability reporting for Australian organisations.' },
          { id: 2, title: 'Privacy Act Amendments — What You Need to Know', month: 'MAR', day: '19', year: '2026', time: '2:00 PM – 4:00 PM', location: 'Board Room 2', provider: 'Internal', type: 'Seminar', cpdHours: 2, cpdPoints: 2, category: 'Legal & Regulatory', categories: ['Legal & Regulatory'], regimes: ['law-society-nsw'], isEthika: false, status: 'Booked', description: 'Internal briefing on the 2026 Privacy Act amendments covering enhanced enforcement powers, the new privacy tort, and updated APP requirements for data handling.', externalDisclaimer: 'This event is organised and managed by your organisation. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
          { id: 3, title: 'Advanced Contract Negotiation', month: 'APR', day: '03', year: '2026', time: '9:00 AM – 1:00 PM', location: 'Sydney CBD', provider: 'Law Society NSW', type: 'Workshop', cpdHours: 4, cpdPoints: 4, category: 'Professional Skills', categories: ['Professional Skills', 'Substantive Law'], regimes: ['law-society-nsw'], isEthika: false, status: 'Waitlisted', description: 'Hands-on workshop covering advanced negotiation strategies, BATNA analysis, multi-party negotiations, and dealing with complex commercial terms.', externalDisclaimer: 'This event is organised and managed by Law Society NSW. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
        ],
        suggestedWorkshops: [
          { id: 4, title: 'AI in Legal Practice — Tools & Ethics', month: 'APR', day: '08', year: '2026', time: '9:00 AM – 12:00 PM', location: 'Online', provider: 'Ethika Academy', type: 'Workshop', cpdHours: 3, cpdPoints: 3, category: 'Substantive Law', categories: ['Substantive Law', 'Ethics & Professional Responsibility'], regimes: ['law-society-nsw', 'aicd'], isEthika: true, capacity: 30, registered: 30, waitlistCount: 4, relevance: 'Addresses AI & Legal Technology skills gap', matchScore: 95, description: 'Explore the practical applications of AI in legal work including document review, contract analysis, and research automation, alongside ethical considerations and responsible use frameworks.' },
          { id: 5, title: 'Modern Slavery & Supply Chain Due Diligence', month: 'APR', day: '16', year: '2026', time: '1:00 PM – 3:00 PM', location: 'Board Room 1', provider: 'Law Society NSW', type: 'Seminar', cpdHours: 2, cpdPoints: 2, category: 'Ethics & Professional Responsibility', categories: ['Ethics & Professional Responsibility', 'Risk & Compliance'], regimes: ['law-society-nsw'], isEthika: false, registrationUrl: 'https://www.lawsociety.com.au/cpd/events/modern-slavery-due-diligence', relevance: 'Supports ESG & Sustainability focus area', matchScore: 88, description: 'Understand Modern Slavery Act reporting obligations, supply chain risk assessment methodologies, and practical due diligence frameworks for identifying and addressing forced labour risks.', externalDisclaimer: 'This event is organised and managed by Law Society NSW. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
          { id: 6, title: 'Cross-border Data Transfer Masterclass', month: 'MAY', day: '02', year: '2026', time: '10:00 AM – 1:30 PM', location: 'Sydney CBD', provider: 'International Bar Assoc.', type: 'Workshop', cpdHours: 3.5, cpdPoints: 3.5, category: 'Legal & Regulatory', categories: ['Legal & Regulatory'], regimes: ['law-society-nsw'], isEthika: false, relevance: 'Directly addresses Cross-border Data Transfers gap', matchScore: 92, description: 'Deep dive into cross-border data transfer mechanisms including standard contractual clauses, binding corporate rules, and navigating the evolving landscape of international data protection regulations.', externalDisclaimer: 'This event is organised and managed by International Bar Association. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
          { id: 7, title: 'Effective Board Reporting for Lawyers', month: 'MAY', day: '14', year: '2026', time: '12:30 PM – 1:30 PM', location: 'Board Room 2', provider: 'Internal', type: 'Lunch & Learn', cpdHours: 1, cpdPoints: 1, category: 'Governance & Board Effectiveness', categories: ['Governance & Board Effectiveness'], regimes: ['aicd'], isEthika: false, relevance: 'Builds on Board Governance Fundamentals', matchScore: 70, description: 'Practical session on preparing concise, decision-ready board papers and legal updates that drive effective governance outcomes.', externalDisclaimer: 'This event is organised internally by your organisation. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
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
                { signal: 'Course Completion', detail: 'Ethics & Professional Responsibility — Advanced (95%)', weight: 'High' },
                { signal: 'Scenario Assessment', detail: 'Scored 88/100 on ethical dilemma scenarios', weight: 'High' },
                { signal: 'Work Signal', detail: '12 ethics-related matters handled in last 6 months', weight: 'Medium' },
              ],
              cpdBodies: ['Law Society NSW', 'AICD'],
              recommendedAction: 'Maintain proficiency — consider mentoring junior staff on ethical decision-making frameworks.',
            },
            sk2: {
              sources: [
                { signal: 'Course Completion', detail: 'AML/CTF Certification — Passed (92%)', weight: 'High' },
                { signal: 'Work Signal', detail: '8 compliance reviews completed in last quarter', weight: 'Medium' },
                { signal: 'Scenario Assessment', detail: 'Scored 85/100 on suspicious transaction identification', weight: 'High' },
              ],
              cpdBodies: ['Law Society NSW', 'AUSTRAC'],
              recommendedAction: 'Maintain certification currency — next renewal due Aug 2026.',
            },
            sk3: {
              sources: [
                { signal: 'Course Completion', detail: 'Board Governance Fundamentals — Complete (78%)', weight: 'Medium' },
                { signal: 'Scenario Assessment', detail: 'Scored 62/100 on director duties scenarios', weight: 'Medium' },
              ],
              cpdBodies: ['AICD'],
              recommendedAction: 'Complete Board Governance Advanced module to reach target level.',
            },
            sk4: {
              sources: [
                { signal: 'Course Completion', detail: 'Regulatory Frameworks Foundations — Complete (80%)', weight: 'Medium' },
                { signal: 'Work Signal', detail: '5 regulatory change assessments performed this year', weight: 'Medium' },
              ],
              cpdBodies: ['Law Society NSW'],
              recommendedAction: 'Attend upcoming Regulatory Change Workshop (Mar 2026) for additional CPD.',
            },
            sk5: {
              sources: [
                { signal: 'Course Completion', detail: 'Contract Drafting Masterclass — Certified (90%)', weight: 'High' },
                { signal: 'Work Signal', detail: '22 contracts drafted or reviewed in last 6 months', weight: 'High' },
              ],
              cpdBodies: ['Law Society NSW'],
              recommendedAction: 'Advanced proficiency achieved — share negotiation frameworks with team.',
            },
            sk6: {
              sources: [
                { signal: 'Course Completion', detail: 'Privacy Act Essentials — In Progress (60%)', weight: 'Medium' },
                { signal: 'Self-Assessment', detail: 'Self-rated intermediate on GDPR cross-border concepts', weight: 'Low' },
              ],
              cpdBodies: ['OAIC', 'IAPP'],
              recommendedAction: 'Enrol in Cross-border Data Transfer Masterclass (95% match).',
            },
            sk7: {
              sources: [
                { signal: 'Work Signal', detail: 'Limited engagement — 1 ESG-related matter in last 12 months', weight: 'Low' },
              ],
              cpdBodies: [],
              recommendedAction: 'Critical gap — enrol in ESG Disclosure workshop on Mar 12.',
            },
            sk8: {
              sources: [
                { signal: 'Course Completion', detail: 'AI Tools for Legal Professionals — Introductory (45%)', weight: 'Low' },
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
          teamGaps: [
            { skillId: 'sk7', label: 'ESG & Sustainability Reporting', membersBelow: 7, targetLevel: 'Proficient' },
            { skillId: 'sk8', label: 'AI & Legal Technology', membersBelow: 7, targetLevel: 'Intermediate' },
            { skillId: 'sk6', label: 'Data Privacy & Protection', membersBelow: 6, targetLevel: 'Proficient' },
          ],
          members: [
            { id: 1, name: 'Sarah Chen', initials: 'SC', role: 'Senior Lawyer', overallScore: 78, topGap: 'ESG Reporting', lastAssessed: 'Feb 2026', skills: { sk1: 4, sk2: 4, sk3: 3, sk4: 3, sk5: 4, sk6: 3, sk7: 2, sk8: 2 }, targetRole: 'General Counsel', roleProgress: 78 },
            { id: 2, name: 'James Harrington', initials: 'JH', role: 'General Counsel', overallScore: 85, topGap: 'AI & Legal Tech', lastAssessed: 'Feb 2026', skills: { sk1: 4, sk2: 4, sk3: 4, sk4: 4, sk5: 4, sk6: 3, sk7: 3, sk8: 1 }, targetRole: 'Chief Legal Officer', roleProgress: 85 },
            { id: 3, name: 'Priya Patel', initials: 'PP', role: 'Compliance Officer', overallScore: 72, topGap: 'ESG Reporting', lastAssessed: 'Jan 2026', skills: { sk1: 4, sk2: 4, sk3: 2, sk4: 3, sk5: 3, sk6: 2, sk7: 1, sk8: 2 }, targetRole: 'Head of Compliance', roleProgress: 65 },
            { id: 4, name: 'Michael Torres', initials: 'MT', role: 'Junior Lawyer', overallScore: 45, topGap: 'Corporate Governance', lastAssessed: 'Feb 2026', skills: { sk1: 2, sk2: 2, sk3: 1, sk4: 2, sk5: 2, sk6: 1, sk7: 1, sk8: 2 }, targetRole: 'Senior Lawyer', roleProgress: 35 },
            { id: 5, name: 'Emily Watson', initials: 'EW', role: 'HR Manager', overallScore: 62, topGap: 'Data Privacy', lastAssessed: 'Jan 2026', skills: { sk1: 3, sk2: 3, sk3: 2, sk4: 3, sk5: 3, sk6: 1, sk7: 2, sk8: 2 }, targetRole: 'HR Director', roleProgress: 60 },
            { id: 6, name: 'David Kim', initials: 'DK', role: 'Finance Manager', overallScore: 58, topGap: 'Reg Change', lastAssessed: 'Dec 2025', skills: { sk1: 3, sk2: 2, sk3: 3, sk4: 1, sk5: 3, sk6: 2, sk7: 1, sk8: 2 }, targetRole: 'CFO', roleProgress: 50 },
            { id: 7, name: 'Rachel Adams', initials: 'RA', role: 'Company Secretary', overallScore: 75, topGap: 'AI & Legal Tech', lastAssessed: 'Feb 2026', skills: { sk1: 4, sk2: 3, sk3: 4, sk4: 3, sk5: 4, sk6: 2, sk7: 2, sk8: 1 }, targetRole: 'Head of Governance', roleProgress: 75 },
            { id: 8, name: 'Tom Bradley', initials: 'TB', role: 'Board Member', overallScore: 52, topGap: 'Data Privacy', lastAssessed: 'Nov 2025', skills: { sk1: 3, sk2: 2, sk3: 2, sk4: 2, sk5: 3, sk6: 1, sk7: 1, sk8: 1 }, targetRole: 'Board Chair', roleProgress: 45 },
          ],
          skillDistribution: [
            { skillId: 'sk1', label: 'Ethics & Professional Responsibility', avgDots: 3.4, meetingTarget: 88, criticalGap: false },
            { skillId: 'sk2', label: 'Anti-Money Laundering & CTF', avgDots: 3.0, meetingTarget: 75, criticalGap: false },
            { skillId: 'sk3', label: 'Corporate Governance', avgDots: 2.6, meetingTarget: 50, criticalGap: false },
            { skillId: 'sk4', label: 'Regulatory Change Management', avgDots: 2.6, meetingTarget: 63, criticalGap: false },
            { skillId: 'sk5', label: 'Contract Drafting & Negotiation', avgDots: 3.3, meetingTarget: 75, criticalGap: false },
            { skillId: 'sk6', label: 'Data Privacy & Protection', avgDots: 1.9, meetingTarget: 25, criticalGap: true },
            { skillId: 'sk7', label: 'ESG & Sustainability Reporting', avgDots: 1.6, meetingTarget: 13, criticalGap: true },
            { skillId: 'sk8', label: 'AI & Legal Technology', avgDots: 1.6, meetingTarget: 13, criticalGap: true },
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
          { id: 'm-1',  name: 'March Board Meeting',           boardId: 'au',         dateTime: '28 Mar 2026, 9:00am',  type: 'Board',     status: 'Scheduled',   attendees: 8, minutes: 'Pending' },
          { id: 'm-2',  name: 'Audit Committee — Q1 review',   boardId: 'audit-risk', dateTime: '15 Apr 2026, 10:00am', type: 'Committee', status: 'Scheduled',   attendees: 5, minutes: 'Pending' },
          { id: 'm-3',  name: 'Risk Committee — quarterly',    boardId: 'audit-risk', dateTime: '08 Apr 2026, 2:00pm',  type: 'Committee', status: 'Scheduled',   attendees: 5, minutes: 'Pending' },
          { id: 'm-4',  name: 'Annual General Meeting',        boardId: 'au',         dateTime: '22 May 2026, 9:30am',  type: 'AGM',       status: 'Scheduled',   attendees: 0, minutes: 'Pending' },
          { id: 'm-5',  name: 'Remuneration Committee',        boardId: 'governance', dateTime: '22 Apr 2026, 11:00am', type: 'Committee', status: 'Scheduled',   attendees: 4, minutes: 'Pending' },
          { id: 'm-6',  name: 'February Board Meeting',        boardId: 'au',         dateTime: '28 Feb 2026, 9:00am',  type: 'Board',     status: 'Completed',   attendees: 8, minutes: 'Final'   },
          { id: 'm-7',  name: 'China Board — bi-monthly',      boardId: 'cn',         dateTime: '05 May 2026, 8:00am',  type: 'Board',     status: 'Scheduled',   attendees: 7, minutes: 'Pending' },
          { id: 'm-8',  name: 'Governance Committee — Q2',     boardId: 'governance', dateTime: '12 May 2026, 1:00pm',  type: 'Committee', status: 'In Progress', attendees: 5, minutes: 'Draft'   },
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

  // ── Migration Law ──────────────────────────────────────────────────────────
  migration: {
    appName: 'Playfair Migration',
    logo: '/playfair-logo.png',
    icon: '/playfair-icon.png',
    greeting: 'Good morning, James',

    term: {
      matter: 'matter', matters: 'matters', Matter: 'Matter', Matters: 'Matters',
      firm: 'practice', Firm: 'Practice',
    },

    nav: { work: 'Matters' },

    complySubItems: [
      { title: 'Overview', page: 'Comply' },
      { title: 'Migration Legislation & Policy', page: 'Legislation & Regulatory Landscape' },
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
        mattersOverviewSub: '47 active across 31 clients',
        firmHealth: 'Practice Health',
        kpis: [
          { label: 'MARA Compliance', value: '94%', delta: '+1.2%', dir: 'up', primary: true },
          { label: 'Active Matters', value: '47', delta: '+5', dir: 'up' },
          { label: 'Avg Processing', value: '42d', delta: '-3d', dir: 'up' },
          { label: 'Revenue MTD', value: '$1.8M', delta: '+8%', dir: 'up' },
        ],
        matters: [
          { name: 'Chen Family — 820 Partner Visa', client: 'Wei Chen', type: 'Partner Visa', status: 'Active', days: 45, value: '$8.5K', lead: 'JW' },
          { name: 'Patel — 482 TSS Sponsorship', client: 'TechCorp Australia', type: 'Employer Sponsored', status: 'Active', days: 28, value: '$12K', lead: 'KL' },
          { name: 'Al-Rashid — Protection Visa 866', client: 'Ahmed Al-Rashid', type: 'Protection', status: 'Review', days: 120, value: '$15K', lead: 'SM' },
          { name: 'Kim — 189 Skilled Independent', client: 'Soo-Jin Kim', type: 'Skilled Migration', status: 'Active', days: 14, value: '$6K', lead: 'DP' },
          { name: 'Santos — Citizenship Application', client: 'Maria Santos', type: 'Citizenship', status: 'Active', days: 60, value: '$3.5K', lead: 'JW' },
        ],
        compliance: [
          { label: 'MARA CPD Points', status: 'good', value: '18/20', sub: 'On track' },
          { label: 'Client File Audits', status: 'warning', value: '12/15', sub: '3 overdue' },
          { label: 'Conflict Checks', status: 'good', value: '31/31', sub: 'All current' },
          { label: 'Fee Agreements', status: 'warning', value: '2 unsigned', sub: 'Action needed' },
          { label: 'Identity Verification', status: 'neutral', value: '28/31', sub: '3 pending' },
        ],
        firmHealthMetrics: [
          { label: 'Grant Rate', value: 92, target: 90, delta: '+2%', above: true },
          { label: 'Avg Processing Time', value: 42, target: 45, delta: '-3 days', above: true },
          { label: 'Client Satisfaction', value: 88, target: 85, delta: '+3%', above: true },
          { label: 'Collection Rate', value: 82, target: 90, delta: '-4%', above: false },
        ],
        team: [
          { initials: 'JW', name: 'James Walker', role: 'Principal Agent (MARN 123456)', matters: 15, util: 90, level: 'over' },
          { initials: 'KL', name: 'Karen Liu', role: 'Registered Agent (MARN 234567)', matters: 12, util: 85, level: 'high' },
          { initials: 'SM', name: 'Sarah Mitchell', role: 'Senior Migration Lawyer', matters: 8, util: 72, level: 'good' },
          { initials: 'DP', name: 'David Park', role: 'Migration Consultant', matters: 10, util: 88, level: 'high' },
          { initials: 'RL', name: 'Rachel Lee', role: 'Case Officer', matters: 6, util: 60, level: 'good' },
        ],
        aiActions: [
          { priority: 'High', title: 'Al-Rashid protection visa deadline', desc: 'Statutory deadline for additional evidence is Feb 25. Character references and country information still outstanding.' },
          { priority: 'High', title: 'Patel sponsorship nomination expiring', desc: 'TechCorp nomination approval expires Mar 5. Visa application must be lodged before then.' },
          { priority: 'Medium', title: 'MARA CPD shortfall risk', desc: 'James Walker has 18 of 20 required CPD points with registration renewal on Mar 31.' },
          { priority: 'Low', title: 'Citizenship ceremony scheduling', desc: 'Maria Santos citizenship approved — ceremony scheduling notification expected this week.' },
        ],
        importantDates: [
          { label: 'Al-Rashid — evidence deadline', month: 'FEB', day: '25', year: '2026', sub: 'Wednesday · Protection Visa', urgency: 'high' },
          { label: 'Patel — nomination expiry', month: 'MAR', day: '5', year: '2026', sub: 'Thursday · Employer Sponsored', urgency: 'high' },
          { label: 'Chen — relationship evidence due', month: 'FEB', day: '14', year: '2026', sub: 'Overdue · Partner Visa', urgency: 'overdue' },
          { label: 'MARA registration renewal', month: 'MAR', day: '31', year: '2026', sub: 'Tuesday · Compliance', urgency: 'medium' },
          { label: 'Kim — skills assessment expiry', month: 'APR', day: '15', year: '2026', sub: 'Wednesday · Skilled Migration', urgency: 'low' },
          { label: 'Quarterly OMARA compliance report', month: 'MAR', day: '15', year: '2026', sub: 'Monday · Regulatory', urgency: 'medium' },
        ],
        upcomingEvents: [
          { title: 'Client consult — Al-Rashid family', month: 'FEB', day: '21', year: '2026', time: '10:00 AM', location: 'Office' },
          { title: 'Home Affairs — Patel status inquiry', month: 'FEB', day: '22', year: '2026', time: '2:00 PM', location: 'Phone' },
          { title: 'MARA CPD webinar — Migration Act updates', month: 'FEB', day: '26', year: '2026', time: '12:00 PM', location: 'Online' },
          { title: 'Chen interview preparation', month: 'FEB', day: '27', year: '2026', time: '3:00 PM', location: 'Video call' },
          { title: 'AAT hearing — Nguyen visa refusal', month: 'FEB', day: '28', year: '2026', time: '9:30 AM', location: 'AAT Sydney' },
        ],
        aiSummary: [
          'MARA compliance is strong at 94% — 2 CPD points needed before Mar 31 renewal. Client file audits have 3 overdue items requiring attention.',
          'Active matters total 47 across 31 clients — Partner and Employer Sponsored visas make up 60% of active matters.',
          'Al-Rashid protection visa has a critical evidence deadline on Feb 25 — character references and country information still outstanding.',
          'Grant rate is tracking above target at 92%, with average processing time 3 days faster than benchmark.',
          'Collection rate at 82% is below the 90% target — 4 clients have overdue invoices totalling $18K.',
        ],
        priorities: [
          { label: 'Al-Rashid evidence deadline (Protection Visa)', urgency: 'High', due: 'Feb 25' },
          { label: 'Patel nomination expiry — lodge visa application', urgency: 'High', due: 'Before Mar 5' },
          { label: 'Complete overdue client file audits', urgency: 'Medium', due: 'This week' },
          { label: 'Chen relationship evidence follow-up', urgency: 'Medium', due: 'Overdue' },
          { label: 'Chase overdue client invoices ($18K)', urgency: 'Low', due: 'No deadline' },
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
          total: 47,
          weekDelta: '+3',
          breakdown: [
            { label: 'Lodged',            value: 18, pct: 38, hex: '#a7f3d0', textHex: '#065f46' },
            { label: 'Preparing',         value: 14, pct: 30, hex: '#fde68a', textHex: '#92400e' },
            { label: 'Awaiting Decision', value: 10, pct: 21, hex: '#e2e8f0', textHex: '#475569' },
            { label: 'RFI Outstanding',   value: 5,  pct: 11, hex: '#fecaca', textHex: '#991b1b' },
          ],
        },
        performance: [
          { label: 'Grant Rate',          value: '92%',  bar: 92, onTarget: true,  note: '+2% vs benchmark' },
          { label: 'Avg Days to Decision', value: '42d', bar: 70, onTarget: true,  note: '−3 vs prev qtr'   },
          { label: 'Client Satisfaction',  value: '88%',  bar: 88, onTarget: true,  note: '+3% MoM'          },
          { label: 'RFI Response Time',    value: '4.1d', bar: 65, onTarget: false, note: 'target 3d'        },
          { label: 'Team Capacity',        value: '82%',  bar: 82, onTarget: true,  note: 'of 100%'          },
        ],
        workMatters: [
          { id: 1, name: 'Chen Family — 820 Partner Visa', ref: 'MIG-2401', client: 'Wei Chen', practice: 'Partner Visa', status: 'Active', priority: 'Critical', progress: 65, due: 'Mar 15', value: '$8.5K', lead: 'JW', leadColor: 'bg-brand-800 text-brand-50' },
          { id: 2, name: 'Patel — 482 TSS Sponsorship', ref: 'MIG-2398', client: 'TechCorp Australia', practice: 'Employer Sponsored', status: 'Behind', priority: 'High', progress: 40, due: 'Mar 5', value: '$12K', lead: 'KL', leadColor: 'bg-teal-600 text-white' },
          { id: 3, name: 'Al-Rashid — Protection Visa 866', ref: 'MIG-2412', client: 'Ahmed Al-Rashid', practice: 'Protection', status: 'Behind', priority: 'Critical', progress: 55, due: 'Feb 25', value: '$15K', lead: 'SM', leadColor: 'bg-slate-500 text-white' },
          { id: 4, name: 'Kim — 189 Skilled Independent', ref: 'MIG-2415', client: 'Soo-Jin Kim', practice: 'Skilled Migration', status: 'On Track', priority: 'Medium', progress: 30, due: 'Apr 10', value: '$6K', lead: 'DP', leadColor: 'bg-orange-500 text-white' },
          { id: 5, name: 'Santos — Citizenship', ref: 'MIG-2418', client: 'Maria Santos', practice: 'Citizenship', status: 'On Track', priority: 'Low', progress: 80, due: 'Mar 1', value: '$3.5K', lead: 'JW', leadColor: 'bg-brand-800 text-brand-50' },
          { id: 6, name: 'Nguyen — AAT Appeal (Visitor Visa)', ref: 'MIG-2420', client: 'Thi Nguyen', practice: 'AAT Appeal', status: 'Active', priority: 'High', progress: 45, due: 'Feb 28', value: '$9K', lead: 'SM', leadColor: 'bg-slate-500 text-white' },
          { id: 7, name: 'Okafor — 494 Regional Sponsored', ref: 'MIG-2422', client: 'Emeka Okafor', practice: 'Employer Sponsored', status: 'On Track', priority: 'Medium', progress: 20, due: 'May 1', value: '$8K', lead: 'KL', leadColor: 'bg-teal-600 text-white' },
          { id: 8, name: 'Garcia — 500 Student Visa', ref: 'MIG-2425', client: 'Isabella Garcia', practice: 'Student Visa', status: 'Active', priority: 'Low', progress: 90, due: 'Feb 22', value: '$2.5K', lead: 'RL', leadColor: 'bg-violet-500 text-white' },
          { id: 9, name: 'Li — 188 Business Innovation', ref: 'MIG-2409', client: 'Jian Li', practice: 'Business Visa', status: 'On Hold', priority: 'Medium', progress: 50, due: 'TBD', value: '$18K', lead: 'JW', leadColor: 'bg-brand-800 text-brand-50' },
          { id: 10, name: 'Hassan — 202 Global Talent', ref: 'MIG-2430', client: 'Fatima Hassan', practice: 'Global Talent', status: 'Active', priority: 'High', progress: 35, due: 'Apr 15', value: '$10K', lead: 'DP', leadColor: 'bg-orange-500 text-white' },
        ],
        aiPoints: [
          '2 matters have critical deadlines this week — Al-Rashid Protection Visa (Feb 25) and Garcia Student Visa (Feb 22) need immediate attention.',
          'Patel 482 TSS nomination expires Mar 5 — visa application must be lodged before then. Currently at 40% progress.',
          'Grant rate is strong at 92% across all visa subclasses, 2% above benchmark.',
          'Nguyen AAT Appeal hearing is scheduled Feb 28 — all submissions and evidence bundles should be finalised by Feb 26.',
          'Outstanding fees of $48K have grown $8K this month. 3 clients have invoices overdue by 30+ days.',
        ],
        aiActions: [
          { text: 'Finalise Al-Rashid protection visa evidence package — character references and country info due Feb 25' },
          { text: 'Lodge Patel 482 TSS visa application before nomination expiry on Mar 5' },
          { text: 'Prepare Nguyen AAT appeal submissions and evidence bundles by Feb 26 for Feb 28 hearing' },
        ],
      },

      // ── Vault ───────────────────────────────────────────────
      vault: {
        description: 'The documentation base that informs and automates your migration practice',
        status: {
          label: 'Good',
          body: 'Your vault has the foundational documents Ethos needs to understand your practice — governing structure, MARA policies, supervision frameworks and strategic direction. A few items are due for review.',
          lastSynced: 'Last synced 6 min ago',
        },
        categories: [
          { id: 'governing',  name: 'Governing Documents'  },
          { id: 'policies',   name: 'Policies'             },
          { id: 'frameworks', name: 'Frameworks'           },
          { id: 'strategy',   name: 'Strategy & Reporting' },
        ],
        files: [
          // Governing Documents (5)
          { id: 'm-1',  name: 'Practice Constitution',                  type: 'document',    categoryId: 'governing',  status: 'healthy', lastUpdated: '14 Feb 2026 at 9:00am'  },
          { id: 'm-2',  name: 'Partnership Agreement (2024)',           type: 'document',    categoryId: 'governing',  status: 'stale',   lastUpdated: '02 Sep 2024 at 11:18am' },
          { id: 'm-3',  name: 'MARA Membership Certificate',            type: 'document',    categoryId: 'governing',  status: 'healthy', lastUpdated: '04 Jan 2026 at 3:42pm'  },
          { id: 'm-4',  name: 'Practice Structure & ASIC Records',      type: 'document',    categoryId: 'governing',  status: 'healthy', lastUpdated: '12 Mar 2026 at 10:11am' },
          { id: 'm-5',  name: 'Delegations of Authority',              type: 'spreadsheet', categoryId: 'governing',  status: 'healthy', lastUpdated: '20 Feb 2026 at 4:30pm'  },
          // Policies (5)
          { id: 'm-6',  name: 'Code of Conduct (MARA-aligned)',         type: 'document',    categoryId: 'policies',   status: 'healthy', lastUpdated: '08 Feb 2026 at 9:00am'  },
          { id: 'm-7',  name: 'Conflict of Interest Policy',            type: 'document',    categoryId: 'policies',   status: 'healthy', lastUpdated: '14 Jan 2026 at 3:55pm'  },
          { id: 'm-8',  name: 'Fee & Disbursement Policy',              type: 'document',    categoryId: 'policies',   status: 'check',   lastUpdated: '11 Dec 2025 at 9:05am'  },
          { id: 'm-9',  name: 'Client Confidentiality Policy',          type: 'document',    categoryId: 'policies',   status: 'healthy', lastUpdated: '02 Feb 2026 at 11:18am' },
          { id: 'm-10', name: 'Privacy Policy',                         type: 'document',    categoryId: 'policies',   status: 'healthy', lastUpdated: '08 Jan 2026 at 9:14am'  },
          // Frameworks (5)
          { id: 'm-11', name: 'Risk & Compliance Framework',            type: 'document',    categoryId: 'frameworks', status: 'healthy', lastUpdated: '01 Mar 2026 at 4:00pm'  },
          { id: 'm-12', name: 'Supervision Framework',                  type: 'document',    categoryId: 'frameworks', status: 'healthy', lastUpdated: '15 Feb 2026 at 10:00am' },
          { id: 'm-13', name: 'AML/CTF Program',                        type: 'document',    categoryId: 'frameworks', status: 'stale',   lastUpdated: '14 Aug 2024 at 4:02pm'  },
          { id: 'm-14', name: 'File Retention Policy',                  type: 'document',    categoryId: 'frameworks', status: 'healthy', lastUpdated: '22 Mar 2026 at 11:30am' },
          { id: 'm-15', name: 'Cyber & Data Handling Framework',        type: 'document',    categoryId: 'frameworks', status: 'healthy', lastUpdated: '04 Apr 2026 at 10:11am' },
          // Strategy & Reporting (5)
          { id: 'm-16', name: 'Practice Strategy FY26',                 type: 'document',    categoryId: 'strategy',   status: 'healthy', lastUpdated: '12 Jan 2026 at 10:32am' },
          { id: 'm-17', name: 'OMARA Annual Compliance Return',         type: 'document',    categoryId: 'strategy',   status: 'healthy', lastUpdated: '03 Apr 2026 at 1:14pm'  },
          { id: 'm-18', name: 'CPD Plan FY26',                          type: 'document',    categoryId: 'strategy',   status: 'healthy', lastUpdated: '20 Jan 2026 at 5:20pm'  },
          { id: 'm-19', name: 'Insurance Certificates (PI & Cyber)',    type: 'document',    categoryId: 'strategy',   status: 'check',   lastUpdated: '15 Dec 2025 at 9:00am'  },
          { id: 'm-20', name: 'AAT Practice Notes — Reference Set',     type: 'document',    categoryId: 'strategy',   status: 'healthy', lastUpdated: '14 Mar 2026 at 11:28am' },
        ],
      },

      // ── Meet ────────────────────────────────────────────────
      meet: {
        summaryPoints: [
          "You've attended 6 client consultations this month, averaging 45 minutes per session.",
          "AAT hearing preparation is on track — 2 hearings scheduled this quarter with full evidence bundles prepared.",
          "Home Affairs response times are averaging 8 weeks for skilled migration and 14 weeks for partner visas.",
        ],
        upcoming: [
          { id: 1, month: 'FEB', day: '21', year: '2026', name: 'Client Consultation — Al-Rashid Family', time: '10:00am', location: 'Office', hasAgenda: true, hasBoardPack: true, hasMinutes: false },
          { id: 2, month: 'FEB', day: '26', year: '2026', name: 'MARA CPD Webinar — Migration Act Updates', time: '12:00pm', location: 'Online', hasAgenda: false, hasBoardPack: false, hasMinutes: false },
          { id: 3, month: 'FEB', day: '27', year: '2026', name: 'Chen Partner Visa — Interview Prep', time: '3:00pm', location: 'Video call', hasAgenda: true, hasBoardPack: false, hasMinutes: false },
          { id: 4, month: 'FEB', day: '28', year: '2026', name: 'AAT Hearing — Nguyen Visa Appeal', time: '9:30am', location: 'AAT Sydney', hasAgenda: true, hasBoardPack: true, hasMinutes: false },
        ],
        past: [
          { id: 5, month: 'FEB', day: '14', year: '2026', name: 'Patel Sponsorship — TechCorp Meeting', time: '2:00pm', location: 'Client Office', hasAgenda: true, hasBoardPack: true, hasMinutes: true },
          { id: 6, month: 'FEB', day: '10', year: '2026', name: 'Kim Skills Assessment Review', time: '11:00am', location: 'Online', hasAgenda: true, hasBoardPack: false, hasMinutes: true },
          { id: 7, month: 'FEB', day: '5', year: '2026', name: 'OMARA Compliance Review', time: '9:00am', location: 'Office', hasAgenda: true, hasBoardPack: true, hasMinutes: true },
        ],
      },

      // ── Resource Library ────────────────────────────────────
      resource: {
        categories: [
          { id: 'all', label: 'All' },
          { id: 'skilled-migration', label: 'Skilled Migration' },
          { id: 'family-visa', label: 'Family Visa' },
          { id: 'employer-sponsored', label: 'Employer Sponsored' },
          { id: 'compliance', label: 'Compliance' },
          { id: 'citizenship', label: 'Citizenship' },
          { id: 'appeals', label: 'Appeals' },
        ],
        contentTypes: [
          { id: 'all', label: 'All Types' },
          { id: 'template', label: 'Templates' },
          { id: 'guide', label: 'Guides' },
          { id: 'policy', label: 'Policies' },
          { id: 'playbook', label: 'Playbooks' },
          { id: 'legislation', label: 'Legislation' },
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
            id: 'rl-m1', title: 'Partner Visa (820/801) Checklist', description: 'Complete document checklist for onshore partner visa applications including relationship evidence requirements.',
            resource_type: 'template', category: 'family-visa', tags: ['Partner Visa', 'Checklist', '820/801'], jurisdiction: 'Australia',
            author: { name: 'Mei Lin Wong', role: 'Senior Migration Agent' }, source: 'ethika', status: 'approved', ai_assisted: false,
            file_type: 'PDF', file_size: '48 KB', last_updated: '2026-02-10', review_due: '2026-08-10',
            version: '2.0', page_count: 8,
            purpose: 'Ensures all required documents are gathered before lodging an onshore partner visa application.',
            when_to_use: ['When preparing a partner visa application', 'During client onboarding for family visa matters', 'As a quality check before lodgement'],
            linked_categories: ['Family Visa', 'Compliance'],
            compliance_flags: [{ type: 'info', message: 'Aligned with current Dept of Home Affairs partner visa requirements.' }],
            key_clauses: [
              { name: 'Identity Documents', description: 'Passports, birth certificates, and national ID requirements for both applicant and sponsor.', clause_ref: 'Section A' },
              { name: 'Relationship Evidence', description: 'Financial, social, household, and commitment evidence categories with minimum requirements.', clause_ref: 'Section C' },
            ],
            sections: [{ number: 'A', title: 'Identity Documents' }, { number: 'B', title: 'Character & Health' }, { number: 'C', title: 'Relationship Evidence' }, { number: 'D', title: 'Sponsor Documents' }],
            versions: [{ number: '2.0', date: '2026-02-10', author: 'Mei Lin Wong', summary: 'Updated for 2026 evidence requirements.', current: true }],
            related_learning: [{ title: 'Family Migration Law', type: 'Course', estimated_time: '3 hrs', kc_id: 'kc-family' }],
          },
          {
            id: 'rl-m2', title: 'Employer Sponsored (482) Checklist', description: 'Step-by-step checklist for TSS visa applications including nomination and sponsorship requirements.',
            resource_type: 'template', category: 'employer-sponsored', tags: ['TSS', '482', 'Employer Sponsored'], jurisdiction: 'Australia',
            author: { name: 'Mei Lin Wong', role: 'Senior Migration Agent' }, source: 'ethika', status: 'approved', ai_assisted: false,
            file_type: 'PDF', file_size: '52 KB', last_updated: '2026-01-15', review_due: '2026-07-15',
            version: '3.1', page_count: 10,
            purpose: 'Provides a structured checklist for preparing TSS 482 visa applications across all three stages.',
            when_to_use: ['When preparing a new 482 application', 'During sponsorship renewals', 'For nomination lodgement preparation'],
            linked_categories: ['Employer Sponsored', 'Compliance'],
            compliance_flags: [{ type: 'info', message: 'Current with Migration Regulations as at January 2026.' }],
            key_clauses: [
              { name: 'Sponsorship Requirements', description: 'Standard Business Sponsor obligations including training benchmarks.', clause_ref: 'Stage 1' },
              { name: 'Nomination Requirements', description: 'Position, salary, and labour market testing requirements.', clause_ref: 'Stage 2' },
            ],
            sections: [{ number: '1', title: 'Sponsorship' }, { number: '2', title: 'Nomination' }, { number: '3', title: 'Visa Application' }],
            versions: [{ number: '3.1', date: '2026-01-15', author: 'Mei Lin Wong', summary: 'Updated salary thresholds and TSMIT changes.', current: true }],
            related_learning: [{ title: 'Employer Sponsored Visas', type: 'Course', estimated_time: '2 hrs', kc_id: 'kc-employer' }],
          },
          {
            id: 'rl-m3', title: 'Skills Assessment Guide — ACS', description: 'Guide to Australian Computer Society skills assessments for ICT professionals seeking skilled migration.',
            resource_type: 'guide', category: 'skilled-migration', tags: ['Skills Assessment', 'ACS', 'ICT'], jurisdiction: 'Australia',
            author: { name: 'David Chen', role: 'Migration Consultant' }, source: 'ethika', status: 'approved', ai_assisted: true,
            file_type: 'PDF', file_size: '65 KB', last_updated: '2026-03-01', review_due: '2026-09-01',
            version: '1.2', page_count: 14,
            purpose: 'Guides ICT professionals through the ACS skills assessment process for skilled migration visa applications.',
            when_to_use: ['When advising ICT clients on skills assessments', 'Before lodging a skilled visa requiring ACS assessment', 'During RPL application preparation'],
            linked_categories: ['Skilled Migration'],
            compliance_flags: [{ type: 'info', message: 'Based on current ACS assessment guidelines.' }],
            key_clauses: [
              { name: 'Qualification Requirements', description: 'Mapping ICT qualifications to ANZSCO occupation codes.', clause_ref: 'Section 2' },
              { name: 'RPL Pathway', description: 'Recognition of Prior Learning requirements for non-ICT degree holders.', clause_ref: 'Section 4' },
            ],
            sections: [{ number: '1', title: 'Overview' }, { number: '2', title: 'Qualifications' }, { number: '3', title: 'Employment References' }, { number: '4', title: 'RPL Pathway' }],
            versions: [{ number: '1.2', date: '2026-03-01', author: 'David Chen', summary: 'Updated for new ACS fee schedule and processing times.', current: true }],
            related_learning: [{ title: 'Skilled Migration Pathways', type: 'Learning Module', estimated_time: '1.5 hrs', kc_id: 'kc-skilled' }],
          },
          {
            id: 'rl-m4', title: 'AAT Appeal Submission Template', description: 'Precedent AAT submission template for migration review tribunal appeals with standard legal arguments.',
            resource_type: 'template', category: 'appeals', tags: ['AAT', 'Appeal', 'Tribunal'], jurisdiction: 'Australia',
            author: { name: 'Rajesh Patel', role: 'Principal Solicitor' }, source: 'org', status: 'approved', ai_assisted: false,
            file_type: 'DOCX', file_size: '72 KB', last_updated: '2025-11-20', review_due: '2026-05-20',
            version: '2.5', page_count: 16,
            purpose: 'Provides a structured template for preparing written submissions for AAT migration review hearings.',
            when_to_use: ['When preparing for an AAT hearing', 'After receiving a visa refusal decision', 'As a framework for legal arguments in tribunal matters'],
            linked_categories: ['Appeals', 'Compliance'],
            compliance_flags: [
              { type: 'neutral', message: 'AAT procedural changes effective Jan 2026 — check current Practice Directions.' },
            ],
            key_clauses: [
              { name: 'Jurisdictional Error Arguments', description: 'Standard arguments for demonstrating jurisdictional error in delegate decisions.', clause_ref: 'Part B' },
              { name: 'Evidence Submission', description: 'Framework for organising and referencing documentary evidence.', clause_ref: 'Part C' },
            ],
            sections: [{ number: 'A', title: 'Background and Facts' }, { number: 'B', title: 'Legal Arguments' }, { number: 'C', title: 'Evidence' }, { number: 'D', title: 'Relief Sought' }],
            versions: [{ number: '2.5', date: '2025-11-20', author: 'Rajesh Patel', summary: 'Updated standard arguments for recent AAT decisions.', current: true }],
            related_learning: [{ title: 'Migration Appeals Process', type: 'Course', estimated_time: '2.5 hrs', kc_id: 'kc-appeals' }],
          },
          {
            id: 'rl-m5', title: 'MARA Code of Conduct Summary', description: 'Summary of the Code of Conduct for registered migration agents — key obligations and compliance requirements.',
            resource_type: 'policy', category: 'compliance', tags: ['MARA', 'Code of Conduct', 'Compliance'], jurisdiction: 'Australia',
            author: { name: 'Mei Lin Wong', role: 'Senior Migration Agent' }, source: 'ethika', status: 'approved', ai_assisted: false,
            file_type: 'PDF', file_size: '32 KB', last_updated: '2026-02-28', review_due: '2027-02-28',
            version: '1.1', page_count: 12,
            purpose: 'Provides a concise reference to key obligations under the MARA Code of Conduct for registered migration agents.',
            when_to_use: ['During agent onboarding and training', 'As a compliance reference for practice management', 'When responding to OMARA complaints'],
            linked_categories: ['Compliance'],
            compliance_flags: [{ type: 'info', message: 'Based on the Migration Agents Regulations 1998 — Schedule 2.' }],
            key_clauses: [
              { name: 'Client Communication', description: 'Obligations around written agreements, cost disclosures, and progress updates.', clause_ref: 'Part 2' },
              { name: 'Record Keeping', description: 'Minimum record retention periods and required documentation.', clause_ref: 'Part 5' },
            ],
            sections: [{ number: '1', title: 'Overview' }, { number: '2', title: 'Client Relations' }, { number: '3', title: 'Competence' }, { number: '4', title: 'Confidentiality' }, { number: '5', title: 'Records' }],
            versions: [{ number: '1.1', date: '2026-02-28', author: 'Mei Lin Wong', summary: 'Updated for recent OMARA guidance notes.', current: true }],
            related_learning: [{ title: 'Professional Ethics for Migration Agents', type: 'Course', estimated_time: '2 hrs', kc_id: 'kc-ethics' }],
          },
          {
            id: 'rl-m6', title: 'Points Test Calculator Guide', description: 'Guide to calculating points for skilled migration visas (189, 190, 491) including age, English, and experience.',
            resource_type: 'guide', category: 'skilled-migration', tags: ['Points Test', 'Skilled Visa', '189', '190'], jurisdiction: 'Australia',
            author: { name: 'David Chen', role: 'Migration Consultant' }, source: 'ethika', status: 'approved', ai_assisted: true,
            file_type: 'PDF', file_size: '42 KB', last_updated: '2026-03-15', review_due: '2026-09-15',
            version: '2.0', page_count: 8,
            purpose: 'Helps agents and clients accurately calculate points scores for skilled migration visa applications.',
            when_to_use: ['During initial client consultations for skilled visas', 'When assessing eligibility before EOI lodgement', 'As a training resource for junior agents'],
            linked_categories: ['Skilled Migration'],
            compliance_flags: [{ type: 'info', message: 'Points values current as at March 2026.' }],
            key_clauses: [
              { name: 'Age Points', description: 'Points allocation by age band from 18 to 44 years.', clause_ref: 'Section 1' },
              { name: 'English Language Points', description: 'Points for IELTS, PTE, TOEFL iBT, and OET score ranges.', clause_ref: 'Section 2' },
            ],
            sections: [{ number: '1', title: 'Age' }, { number: '2', title: 'English' }, { number: '3', title: 'Experience' }, { number: '4', title: 'Qualifications' }, { number: '5', title: 'Other Factors' }],
            versions: [{ number: '2.0', date: '2026-03-15', author: 'David Chen', summary: 'Updated points table for 2026 program year changes.', current: true }],
            related_learning: [{ title: 'Skilled Migration Pathways', type: 'Learning Module', estimated_time: '1.5 hrs', kc_id: 'kc-skilled' }],
          },
          {
            id: 'rl-m7', title: 'Sponsorship Obligations Guide', description: 'Comprehensive guide to employer sponsor obligations under the Migration Act and Regulations.',
            resource_type: 'guide', category: 'employer-sponsored', tags: ['Sponsorship', 'Obligations', 'Employer'], jurisdiction: 'Australia',
            author: { name: 'Mei Lin Wong', role: 'Senior Migration Agent' }, source: 'ethika', status: 'approved', ai_assisted: false,
            file_type: 'PDF', file_size: '55 KB', last_updated: '2026-01-05', review_due: '2026-07-05',
            version: '1.3', page_count: 12,
            purpose: 'Outlines the key obligations for approved business sponsors including record keeping, notification, and non-discrimination requirements.',
            when_to_use: ['When advising new sponsors on their obligations', 'During sponsor compliance audits', 'As a reference for responding to Home Affairs monitoring inquiries'],
            linked_categories: ['Employer Sponsored', 'Compliance'],
            compliance_flags: [{ type: 'info', message: 'Covers obligations under Division 3A of Part 2 of the Migration Act 1958.' }],
            key_clauses: [
              { name: 'Record Keeping', description: 'Obligation to keep records of sponsored employees for specified periods.', clause_ref: 'Section 3' },
              { name: 'Notification Events', description: 'Events that must be reported to Home Affairs within 28 days.', clause_ref: 'Section 4' },
            ],
            sections: [{ number: '1', title: 'Overview' }, { number: '2', title: 'Types of Obligations' }, { number: '3', title: 'Record Keeping' }, { number: '4', title: 'Notifications' }, { number: '5', title: 'Sanctions' }],
            versions: [{ number: '1.3', date: '2026-01-05', author: 'Mei Lin Wong', summary: 'Updated for recent sponsor sanction framework changes.', current: true }],
            related_learning: [{ title: 'Employer Sponsored Visas', type: 'Course', estimated_time: '2 hrs', kc_id: 'kc-employer' }],
          },
          {
            id: 'rl-m8', title: 'Relationship Evidence Guide', description: 'Comprehensive guide to compiling relationship evidence for partner visa applications — financial, social, household.',
            resource_type: 'guide', category: 'family-visa', tags: ['Relationship Evidence', 'Partner Visa', 'Family'], jurisdiction: 'Australia',
            author: { name: 'Mei Lin Wong', role: 'Senior Migration Agent' }, source: 'ethika', status: 'approved', ai_assisted: false,
            file_type: 'PDF', file_size: '55 KB', last_updated: '2026-02-20', review_due: '2026-08-20',
            version: '1.5', page_count: 16,
            purpose: 'Provides detailed guidance on the four categories of relationship evidence required for partner visa applications.',
            when_to_use: ['When advising clients on evidence gathering for partner visas', 'As a client handout during onboarding', 'To benchmark evidence quality before lodgement'],
            linked_categories: ['Family Visa'],
            compliance_flags: [{ type: 'info', message: 'Based on Regulation 1.15A relationship criteria.' }],
            key_clauses: [
              { name: 'Financial Aspects', description: 'Joint accounts, shared expenses, financial dependency evidence.', clause_ref: 'Part 1' },
              { name: 'Social Recognition', description: 'Evidence of the relationship being recognised by family, friends, and community.', clause_ref: 'Part 3' },
            ],
            sections: [{ number: '1', title: 'Financial Aspects' }, { number: '2', title: 'Nature of Household' }, { number: '3', title: 'Social Aspects' }, { number: '4', title: 'Commitment' }],
            versions: [{ number: '1.5', date: '2026-02-20', author: 'Mei Lin Wong', summary: 'Added examples of strong vs weak evidence for each category.', current: true }],
            related_learning: [{ title: 'Family Migration Law', type: 'Course', estimated_time: '3 hrs', kc_id: 'kc-family' }],
          },
        ],
      },

      // ── Talent ──────────────────────────────────────────────
      talent: {
        practiceAreas: ['Migration', 'Employment', 'Family', 'Refugee & Humanitarian', 'Business & Investment', 'Citizenship'],
        professionals: [
          { id: 1, name: 'Mei Lin Wong', initials: 'MW', color: 'bg-violet-100 text-violet-700', title: 'Registered Migration Agent', experience: '14+ years', tags: ['Skilled Migration', 'Employer Sponsored', 'Points Test', 'MARA', 'Compliance'], location: 'Sydney, NSW', availability: 'Available now', availType: 'Immediately', rating: 4.9, hires: 124, seniority: 'Senior', practiceAreas: ['Migration', 'Business & Investment'] },
          { id: 2, name: 'Raj Sharma', initials: 'RS', color: 'bg-brand-100 text-brand-700', title: 'Migration Lawyer', experience: '10+ years', tags: ['Protection Visas', 'AAT Appeals', 'Federal Court', 'Refugee Law', 'Human Rights'], location: 'Melbourne, VIC', availability: 'Available now', availType: 'Immediately', rating: 4.8, hires: 89, seniority: 'Senior', practiceAreas: ['Refugee & Humanitarian', 'Migration'] },
          { id: 3, name: 'Sophie Tran', initials: 'ST', color: 'bg-teal-100 text-teal-700', title: 'Partner Visa Specialist', experience: '7+ years', tags: ['Partner Visas', 'Family Migration', 'Relationship Evidence', 'Interviews', 'AAT'], location: 'Brisbane, QLD', availability: '1–2 weeks', availType: '1–2 weeks', rating: 4.7, hires: 76, seniority: 'Mid', practiceAreas: ['Family', 'Migration'] },
          { id: 4, name: 'Andrew McPherson', initials: 'AM', color: 'bg-amber-100 text-amber-700', title: 'Principal Migration Agent', experience: '18+ years', tags: ['Business Visas', '188/888', 'Global Talent', 'Sponsorship', 'Compliance'], location: 'Sydney, NSW', availability: '2–4 weeks', availType: '2–4 weeks', rating: 5.0, hires: 215, seniority: 'Executive', practiceAreas: ['Business & Investment', 'Migration', 'Citizenship'] },
          { id: 5, name: 'Amara Osei', initials: 'AO', color: 'bg-rose-100 text-rose-700', title: 'Refugee & Humanitarian Specialist', experience: '9+ years', tags: ['Protection Visas', 'SHEV', 'TPV', 'Country Information', 'Torture/Trauma'], location: 'Sydney, NSW', availability: 'Available now', availType: 'Immediately', rating: 4.6, hires: 52, seniority: 'Senior', practiceAreas: ['Refugee & Humanitarian', 'Migration'] },
          { id: 6, name: 'Daniel Kim', initials: 'DK', color: 'bg-slate-100 text-slate-700', title: 'Employer Sponsorship Specialist', experience: '5+ years', tags: ['482 TSS', '494 Regional', 'Labour Market Testing', 'Nominations', 'Compliance'], location: 'Perth, WA', availability: '1–2 weeks', availType: '1–2 weeks', rating: 4.5, hires: 38, seniority: 'Mid', practiceAreas: ['Employment', 'Migration'] },
          { id: 7, name: 'Elena Petrov', initials: 'EP', color: 'bg-pink-100 text-pink-700', title: 'Citizenship & Character Specialist', experience: '6+ years', tags: ['Citizenship', 'Character Issues', 'Cancellations', 'AAT', 'Ministerial'], location: 'Melbourne, VIC', availability: 'Available now', availType: 'Immediately', rating: 4.7, hires: 43, seniority: 'Senior', practiceAreas: ['Citizenship', 'Migration'] },
          { id: 8, name: 'Tom Nguyen', initials: 'TN', color: 'bg-cyan-100 text-cyan-700', title: 'Junior Migration Consultant', experience: '2+ years', tags: ['Student Visas', 'Graduate Visas', 'Points Calculations', 'EOIs', 'Research'], location: 'Sydney, NSW', availability: 'Available now', availType: 'Immediately', rating: 4.3, hires: 18, seniority: 'Junior', practiceAreas: ['Migration', 'Employment'] },
        ],
        aiSummary: [
          '5 migration specialists are available immediately — strong coverage across Protection, Partner, and Skilled visa subclasses.',
          'Mei Lin Wong and Andrew McPherson are your most engaged talent with 124 and 215 engagements respectively. Ideal for complex matters.',
          'Refugee & Humanitarian expertise is well covered — Raj Sharma and Amara Osei provide strong protection visa capability.',
          'Current talent pool has good MARA registration coverage. Consider adding specialists for emerging Global Talent (858) demand.',
        ],
        aiActions: [
          { priority: 'High', title: 'Assign protection visa specialist', desc: 'Al-Rashid case needs additional support. Amara Osei (available now) specialises in protection visas and country information.' },
          { priority: 'High', title: 'Employer sponsorship demand increasing', desc: '3 new 482 TSS enquiries this week. Daniel Kim and Mei Lin Wong are your available options.' },
          { priority: 'Medium', title: 'Review MARA registration status', desc: '2 professionals have registrations expiring Q2 2026. Schedule CPD reviews and renewal reminders.' },
          { priority: 'Low', title: 'Expand student visa capability', desc: 'Only 1 junior consultant handles student visas. Consider onboarding a specialist for peak intake season.' },
        ],
        aiRecommendations: [
          { label: 'Engage Amara Osei for Al-Rashid protection case', due: 'This week' },
          { label: 'Brief Daniel Kim on new TSS sponsorship enquiries', due: 'Mar 5' },
          { label: 'Schedule MARA CPD review for all registered agents', due: 'Mar 15' },
          { label: 'Quarterly talent pool review', due: 'Mar 31' },
        ],
      },

      // ── Learn ───────────────────────────────────────────────
      learn: {
        cpdSummary: { hoursCompleted: 14, hoursRequired: 20, hoursRemaining: 6, periodEnd: '31 Mar 2026', categoriesComplete: 2, categoriesTotal: 4, upcomingHours: 7, upcomingCount: 3 },
        focusAreas: [
          { id: 1, label: 'Migration Act & Regulations Updates', progress: 70, description: 'Staying current with amendments to the Migration Act 1958 and Migration Regulations 1994.' },
          { id: 2, label: 'Protection Visa Case Law', progress: 45, description: 'Recent Federal Court and High Court decisions affecting refugee and protection visa assessments.' },
          { id: 3, label: 'Employer Sponsorship Compliance', progress: 25, description: 'Sponsor obligations, monitoring requirements and enforcement under the Migration Act.' },
        ],
        completedAreas: [
          { id: 4, label: 'MARA Code of Conduct', completedDate: '15 Jan 2026', hours: 3, cpdPoints: 3, category: 'Ethics & Professional Responsibility', categories: ['Ethics & Professional Responsibility'], regimes: ['mara'], badge: 'Certified', description: 'Comprehensive review of the MARA Code of Conduct including ethical obligations, client communication standards, and professional behaviour requirements for registered migration agents.' },
          { id: 5, label: 'Character & Identity Assessment', completedDate: '28 Nov 2025', hours: 2, cpdPoints: 2, category: 'Specialist Knowledge', categories: ['Specialist Knowledge'], regimes: ['mara'], badge: 'Complete', description: 'Practical guidance on assessing character and identity requirements across visa subclasses, including police clearances and biometric processes.' },
          { id: 6, label: 'Points Test & SkillSelect', completedDate: '10 Oct 2025', hours: 2.5, cpdPoints: 2.5, category: 'Migration Law', categories: ['Migration Law'], regimes: ['mara'], badge: 'Complete', description: 'Detailed walkthrough of the points test calculation, SkillSelect EOI process, and strategies for maximising client outcomes in the skilled migration pathway.' },
          { id: 7, label: 'Partner Visa Evidence Standards', completedDate: '05 Sep 2025', hours: 4, cpdPoints: 4, category: 'Specialist Knowledge', categories: ['Specialist Knowledge'], regimes: ['mara'], badge: 'Certified', description: 'In-depth training on evidence requirements for partner visa applications including relationship evidence, statutory declarations, and sponsor assessments.' },
        ],
        skillsGaps: [
          { skill: 'Global Talent (858) Visa Program', importance: 'Critical', currentLevel: 'Beginner', targetLevel: 'Proficient', gap: 75 },
          { skill: 'Business Innovation & Investment (188/888)', importance: 'High', currentLevel: 'Beginner', targetLevel: 'Intermediate', gap: 60 },
          { skill: 'Ministerial Intervention Requests', importance: 'High', currentLevel: 'Intermediate', targetLevel: 'Advanced', gap: 40 },
          { skill: 'Migration Tribunal Advocacy', importance: 'Medium', currentLevel: 'Intermediate', targetLevel: 'Proficient', gap: 30 },
        ],
        upcomingWorkshops: [
          { id: 1, title: 'Migration Act Amendments 2026 — Key Changes', month: 'MAR', day: '5', year: '2026', time: '10:00 AM – 12:30 PM', location: 'Online', provider: 'MIA', type: 'Webinar', cpdHours: 2.5, cpdPoints: 2.5, category: 'Migration Law', categories: ['Migration Law', 'Practice Management'], regimes: ['mara'], isEthika: false, status: 'Booked', description: 'Overview of the 2026 Migration Act amendments including changes to visa processing, compliance frameworks, and new ministerial direction impacts on case strategy.', externalDisclaimer: 'This event is organised and managed by MIA. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
          { id: 2, title: 'Protection Visa Assessment — Advanced', month: 'MAR', day: '12', year: '2026', time: '9:00 AM – 12:00 PM', location: 'MIA Sydney', provider: 'MIA', type: 'Workshop', cpdHours: 3, cpdPoints: 3, category: 'Specialist Knowledge', categories: ['Specialist Knowledge'], regimes: ['mara'], isEthika: false, status: 'Booked', description: 'Advanced workshop on protection visa assessments covering complementary protection, sur place claims, and recent tribunal and court decisions shaping refugee law.', externalDisclaimer: 'This event is organised and managed by MIA. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
          { id: 3, title: 'Employer Sponsorship Masterclass', month: 'APR', day: '02', year: '2026', time: '1:00 PM – 3:30 PM', location: 'Online', provider: 'MARA', type: 'Workshop', cpdHours: 2.5, cpdPoints: 2.5, category: 'Specialist Knowledge', categories: ['Specialist Knowledge', 'Practice Management'], regimes: ['mara'], isEthika: false, status: 'Waitlisted', description: 'Detailed training on employer-sponsored visa pathways including TSS, ENS, and RSMS, covering nomination requirements, labour market testing, and sponsor obligations.', externalDisclaimer: 'This event is organised and managed by MARA. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
        ],
        suggestedWorkshops: [
          { id: 4, title: 'Global Talent Visa (858) — Practical Guide', month: 'APR', day: '15', year: '2026', time: '10:00 AM – 1:00 PM', location: 'Online', provider: 'MIA', type: 'Workshop', cpdHours: 3, cpdPoints: 3, category: 'Specialist Knowledge', categories: ['Specialist Knowledge'], regimes: ['mara'], isEthika: false, relevance: 'Addresses Global Talent visa skills gap', matchScore: 96, description: 'Practical guide to the Global Talent visa program covering eligibility criteria, nominator requirements, salary threshold evidence, and strategies for building compelling applications.', externalDisclaimer: 'This event is organised and managed by MIA. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
          { id: 5, title: 'Business & Investment Visa Pathways', month: 'APR', day: '22', year: '2026', time: '2:00 PM – 4:00 PM', location: 'Online', provider: 'MARA', type: 'Seminar', cpdHours: 2, cpdPoints: 2, category: 'Specialist Knowledge', categories: ['Specialist Knowledge'], regimes: ['mara'], isEthika: false, relevance: 'Supports Business Innovation focus area', matchScore: 90, description: 'Seminar covering subclass 188 and 888 visa pathways including business innovation, investor, and significant investor streams with compliance and reporting requirements.', externalDisclaimer: 'This event is organised and managed by MARA. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
          { id: 6, title: 'Ministerial Intervention — Strategy & Drafting', month: 'MAY', day: '06', year: '2026', time: '9:00 AM – 12:00 PM', location: 'Sydney CBD', provider: 'Law Council', type: 'Workshop', cpdHours: 3, cpdPoints: 3, category: 'Specialist Knowledge', categories: ['Specialist Knowledge', 'Ethics & Professional Responsibility'], regimes: ['mara'], isEthika: false, relevance: 'Directly addresses Ministerial Intervention gap', matchScore: 93, description: 'Workshop on preparing effective ministerial intervention requests under s351 and s417, including case selection criteria, drafting compelling submissions, and managing client expectations.', externalDisclaimer: 'This event is organised and managed by Law Council. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
          { id: 7, title: 'AAT Advocacy for Migration Agents', month: 'MAY', day: '20', year: '2026', time: '9:00 AM – 4:00 PM', location: 'MIA Sydney', provider: 'MIA', type: 'Intensive', cpdHours: 4, cpdPoints: 4, category: 'Practice Management', categories: ['Practice Management', 'Specialist Knowledge'], regimes: ['mara'], isEthika: false, relevance: 'Builds Migration Tribunal Advocacy skills', matchScore: 85, description: 'Intensive training on AAT advocacy skills including hearing preparation, oral submissions, cross-examination techniques, and working with interpreters in tribunal proceedings.', externalDisclaimer: 'This event is organised and managed by MIA. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
        ],
        aiSummary: [
          'You have completed 14 of 20 required MARA CPD points (70%) with 5 weeks remaining — registration renewal deadline is March 31.',
          'Migration Law and Ethics categories are complete. Focus remaining points on Practice Management (3 pts needed) and Specialist Knowledge (3 pts needed).',
          'Your highest-priority skills gap is Global Talent (858) Visa Program (Critical). The suggested MIA workshop directly addresses this.',
          'Business & Investment visa enquiries are growing — enrolling in the 188/888 pathways seminar would strengthen your service offering.',
        ],
        aiActions: [
          { priority: 'High', title: 'Complete MARA CPD before Mar 31', desc: '6 points remaining with 5 weeks to deadline. Your booked workshops cover 5.5pt — consider adding 1 more session.' },
          { priority: 'High', title: 'Enrol in Global Talent workshop', desc: 'Addresses your highest-scoring skills gap (96% match). 3 CPD points toward Specialist Knowledge.' },
          { priority: 'Medium', title: 'Complete Employer Sponsorship module', desc: 'Employer Sponsorship Compliance focus area at 25%. Critical for growing TSS matter volume.' },
          { priority: 'Low', title: 'Log MIA webinar attendance', desc: 'You attended the Feb 10 MIA update webinar — 1.5 CPD points not yet recorded.' },
        ],
        learningGoals: [
          { label: 'Complete MARA CPD renewal requirements', due: 'Mar 31' },
          { label: 'Attend Migration Act Amendments webinar', due: 'Mar 5' },
          { label: 'Enrol in Global Talent workshop', due: 'Mar 10' },
          { label: 'Finish Employer Sponsorship module', due: 'Apr 15' },
        ],
        activeJourney: {
          name: 'Migration Law Specialist Pathway',
          timeline: '12 months',
          description: 'A curated guide to building your migration law expertise. Work through these recommended items at your own pace.',
          elements: [
            { id: 'e1', title: 'Migration Act Fundamentals Certification', description: 'Core certification covering the Migration Act 1958 and Migration Regulations.' },
            { id: 'e2', title: 'Read: MARA Code of Conduct', description: 'Review the Office of the MARA Code of Conduct and professional obligations.' },
            { id: 'e3', title: 'Review current visa processing procedures', description: 'Audit your team\'s visa application workflows against current Department guidelines.' },
            { id: 'e4', title: 'Review progress with mentor', description: 'Arrange a conversation with your mentor to discuss migration law foundations and readiness for advanced modules.' },
            { id: 'e5', title: 'Migration Act Amendments course', description: 'Ongoing course covering recent legislative amendments and their practical implications.' },
            { id: 'e6', title: 'Observe AAT hearing with senior practitioner', description: 'Attend an Administrative Appeals Tribunal hearing. Note advocacy techniques and procedural requirements.' },
            { id: 'e7', title: 'Global Talent Visa Pathway Course', description: 'Specialised course on Global Talent visa program requirements and nomination processes.' },
          ],
        },
        knowledgeItems: [
          { id: 'k1', type: 'regulatory', title: 'Migration Act Amendments — Key Changes for 2026', snippet: 'New employer sponsorship obligations and streamlined processing pathways. Review impact on current client applications.', source: 'Ethika Insights', readTime: '5 min read', isNew: true },
          { id: 'k2', type: 'insight', title: 'Global Talent Visa: Program Updates & Strategy', snippet: 'Recent changes to nomination requirements and processing priorities for the Global Talent visa program.', source: 'Ethika Academy', readTime: '4 min read', isNew: true },
          { id: 'k3', type: 'thought-leadership', title: 'AI-Assisted Migration Case Assessment', snippet: 'How firms are leveraging AI tools for visa eligibility assessment while maintaining professional obligations.', source: 'Migration Institute', readTime: '6 min read', isNew: false },
          { id: 'k4', type: 'community', title: 'Peer Discussion: AAT Review Strategy Best Practices', snippet: 'Key insights from the practitioner roundtable on effective AAT review preparation and advocacy.', source: 'Community', readTime: '3 min read', isNew: false },
        ],
        practicalResources: [
          { id: 'r1', title: 'Visa Application Checklist', description: 'Comprehensive checklist for common visa subclass applications.', type: 'Checklist' },
          { id: 'r2', title: 'Employer Sponsorship Framework', description: 'End-to-end framework for managing employer-sponsored visa processes.', type: 'Framework' },
          { id: 'r3', title: 'AAT Review Preparation Playbook', description: 'Step-by-step guide for preparing AAT review submissions.', type: 'Playbook' },
          { id: 'r4', title: 'Client Advice Letter Template', description: 'Standard template for visa assessment advice letters.', type: 'Template' },
          { id: 'r5', title: 'Skills Assessment Guide', description: 'Guide for navigating skills assessment requirements by occupation.', type: 'Template' },
          { id: 'r6', title: 'CPD Activity Log', description: 'Record template for tracking MARA CPD activities.', type: 'Template' },
        ],
        skillsProfile: {
          overallScore: 58,
          lastAssessedDate: 'Feb 2026',
          skills: [
            { id: 'sk1', label: 'Migration Act & Regulations', category: 'mandatory', level: 'Advanced', targetLevel: 'Advanced', dots: 4, source: 'MARA · MIA', status: 'Proficient', description: 'Comprehensive knowledge of the Migration Act 1958, Migration Regulations 1994, and legislative instruments.', lastActivity: 'Feb 2026' },
            { id: 'sk2', label: 'MARA Code of Conduct', category: 'mandatory', level: 'Advanced', targetLevel: 'Advanced', dots: 4, source: 'MARA', status: 'Proficient', description: 'Ethical obligations, client communication standards, and professional behaviour requirements for registered migration agents.', lastActivity: 'Jan 2026' },
            { id: 'sk3', label: 'Protection Visa Assessment', category: 'mandatory', level: 'Intermediate', targetLevel: 'Advanced', dots: 3, source: 'MIA', status: 'Developing', description: 'Refugee and protection visa assessments including complementary protection and sur place claims.', lastActivity: 'Dec 2025' },
            { id: 'sk4', label: 'Employer Sponsorship', category: 'mandatory', level: 'Intermediate', targetLevel: 'Proficient', dots: 2, source: 'MARA', status: 'Developing', description: 'Sponsor obligations, monitoring requirements, TSS/ENS pathways, and labour market testing.', lastActivity: 'Jan 2026' },
            { id: 'sk5', label: 'Character & Identity Assessment', category: 'mandatory', level: 'Advanced', targetLevel: 'Advanced', dots: 4, source: 'MARA', status: 'Proficient', description: 'Character and identity requirements across visa subclasses, police clearances, and biometric processes.', lastActivity: 'Nov 2025' },
            { id: 'sk6', label: 'Global Talent (858) Visa Program', category: 'personal', level: 'Beginner', targetLevel: 'Proficient', dots: 1, source: 'MARA', status: 'Gap', description: 'Global Talent visa eligibility criteria, nominator requirements, salary threshold evidence, and application strategy.', lastActivity: 'Oct 2025' },
            { id: 'sk7', label: 'Business Innovation & Investment (188/888)', category: 'personal', level: 'Beginner', targetLevel: 'Intermediate', dots: 1, source: 'MARA', status: 'Gap', description: 'Business innovation, investor, and significant investor visa streams with compliance and reporting requirements.', lastActivity: 'Sep 2025' },
            { id: 'sk8', label: 'Migration Tribunal Advocacy', category: 'personal', level: 'Intermediate', targetLevel: 'Proficient', dots: 2, source: 'MIA · Law Council', status: 'Developing', description: 'AAT advocacy skills including hearing preparation, oral submissions, and cross-examination techniques.', lastActivity: 'Nov 2025' },
          ],
          milestones: [
            { date: 'Jan 2026', skillId: 'sk2', event: 'MARA Code of Conduct Certification', type: 'certification', points: 3 },
            { date: 'Nov 2025', skillId: 'sk5', event: 'Character & Identity Assessment — certified', type: 'certification', points: 2 },
            { date: 'Oct 2025', skillId: 'sk1', event: 'Points Test & SkillSelect — complete', type: 'completion', points: 2.5 },
            { date: 'Sep 2025', skillId: 'sk5', event: 'Partner Visa Evidence Standards — certified', type: 'certification', points: 4 },
            { date: 'Aug 2025', skillId: 'sk1', event: 'Migration Act Fundamentals — complete', type: 'completion', points: 3 },
            { date: 'Jul 2025', skillId: 'sk3', event: 'Protection Visa Basics — module complete', type: 'completion', points: 2 },
          ],
          scoreBreakdown: [
            { label: 'Scenario Assessment', weight: 40, score: 65 },
            { label: 'Course Completion', weight: 20, score: 78 },
            { label: 'Work Signals', weight: 20, score: 40 },
            { label: 'Org Config', weight: 20, score: 48 },
            { label: 'Self-Assessment', weight: 0, score: 60 },
          ],
          evidence: {
            sk1: {
              sources: [
                { signal: 'Course Completion', detail: 'Migration Act & Regulations — Advanced (90%)', weight: 'High' },
                { signal: 'Scenario Assessment', detail: 'Scored 82/100 on visa eligibility scenarios', weight: 'High' },
                { signal: 'Work Signal', detail: '45 visa applications processed in last 6 months', weight: 'High' },
              ],
              cpdBodies: ['MARA', 'MIA'],
              recommendedAction: 'Maintain proficiency — consider presenting at MIA annual conference.',
            },
            sk2: {
              sources: [
                { signal: 'Course Completion', detail: 'MARA Code of Conduct Certification — Passed (94%)', weight: 'High' },
                { signal: 'Work Signal', detail: '0 complaints lodged in last 12 months', weight: 'High' },
                { signal: 'Scenario Assessment', detail: 'Scored 90/100 on professional conduct scenarios', weight: 'High' },
              ],
              cpdBodies: ['MARA'],
              recommendedAction: 'Maintain certification currency — next MARA renewal due Sep 2026.',
            },
            sk3: {
              sources: [
                { signal: 'Course Completion', detail: 'Protection Visa Basics — Complete (72%)', weight: 'Medium' },
                { signal: 'Work Signal', detail: '3 protection visa matters handled this year', weight: 'Medium' },
              ],
              cpdBodies: ['MIA'],
              recommendedAction: 'Complete Advanced Protection Visa module to reach target level.',
            },
            sk4: {
              sources: [
                { signal: 'Course Completion', detail: 'Employer Sponsorship Fundamentals — In Progress (55%)', weight: 'Medium' },
                { signal: 'Work Signal', detail: '8 employer-sponsored visa applications in last 6 months', weight: 'Medium' },
              ],
              cpdBodies: ['MARA'],
              recommendedAction: 'Complete TSS/ENS Pathways Advanced module for additional CPD.',
            },
            sk5: {
              sources: [
                { signal: 'Course Completion', detail: 'Character & Identity Assessment — Certified (88%)', weight: 'High' },
                { signal: 'Work Signal', detail: '30 character assessments completed in last quarter', weight: 'High' },
              ],
              cpdBodies: ['MARA'],
              recommendedAction: 'Advanced proficiency achieved — share assessment frameworks with team.',
            },
            sk6: {
              sources: [
                { signal: 'Work Signal', detail: 'Limited engagement — 1 Global Talent inquiry in last 12 months', weight: 'Low' },
              ],
              cpdBodies: [],
              recommendedAction: 'Critical gap — enrol in Global Talent Visa Masterclass (Mar 2026).',
            },
            sk7: {
              sources: [
                { signal: 'Course Completion', detail: 'Business Innovation Visa Overview — Introductory (40%)', weight: 'Low' },
              ],
              cpdBodies: [],
              recommendedAction: 'Growing requirement — start Business & Investment Visa workshop (3 CPD points).',
            },
            sk8: {
              sources: [
                { signal: 'Course Completion', detail: 'AAT Advocacy Skills — In Progress (65%)', weight: 'Medium' },
                { signal: 'Work Signal', detail: '4 AAT hearings attended in last 6 months', weight: 'Medium' },
              ],
              cpdBodies: ['MIA', 'Law Council'],
              recommendedAction: 'Complete Advanced Tribunal Advocacy module for additional CPD.',
            },
          },
          closeGapRecommendations: {
            sk3: {
              learning: [
                { title: 'Advanced Protection Visa Assessment', type: 'course', cpdPoints: 4, matchScore: 92, provider: 'MIA' },
                { title: 'Complementary Protection Claims Workshop', type: 'workshop', cpdPoints: 2.5, matchScore: 80, provider: 'MARA' },
              ],
              assessments: [
                { title: 'Protection Visa Assessment', questions: 8, estimatedTime: '15 min' },
              ],
              events: [
                { title: 'Refugee & Protection Visa Update Seminar', date: '2026-04-14', time: '10:00 AM – 12:00 PM', cpdPoints: 2, provider: 'MIA' },
              ],
            },
            sk4: {
              learning: [
                { title: 'TSS/ENS Pathways Advanced', type: 'course', cpdPoints: 3.5, matchScore: 90, provider: 'MARA' },
                { title: 'Labour Market Testing Compliance', type: 'workshop', cpdPoints: 2, matchScore: 78, provider: 'MIA' },
              ],
              assessments: [
                { title: 'Employer Sponsorship Assessment', questions: 6, estimatedTime: '12 min' },
              ],
              events: [
                { title: 'Sponsor Obligations Compliance Briefing', date: '2026-04-29', time: '1:00 PM – 3:00 PM', cpdPoints: 2, provider: 'MARA' },
              ],
            },
            sk6: {
              learning: [
                { title: 'Global Talent Visa Masterclass', type: 'course', cpdPoints: 4, matchScore: 95, provider: 'MIA' },
                { title: 'Distinguished Talent Nomination Strategies', type: 'workshop', cpdPoints: 2, matchScore: 82, provider: 'MARA' },
              ],
              assessments: [
                { title: 'Global Talent (858) Assessment', questions: 8, estimatedTime: '15 min' },
              ],
              events: [
                { title: 'Global Talent Visa Masterclass', date: '2026-04-20', time: '10:00 AM – 12:00 PM', cpdPoints: 2, provider: 'MARA' },
                { title: 'Global Talent Salary Threshold Update Forum', date: '2026-05-08', time: '2:00 PM – 3:30 PM', cpdPoints: 1.5, provider: 'MIA' },
              ],
            },
            sk7: {
              learning: [
                { title: 'Business Innovation & Investment Visa Workshop', type: 'workshop', cpdPoints: 3, matchScore: 95, provider: 'MARA' },
                { title: 'Significant Investor Visa Compliance', type: 'course', cpdPoints: 2.5, matchScore: 78, provider: 'MIA' },
              ],
              assessments: [
                { title: 'Business & Investment Visa Assessment', questions: 6, estimatedTime: '12 min' },
              ],
              events: [
                { title: 'Business & Investment Visa Pathways Seminar', date: '2026-05-05', time: '9:00 AM – 11:30 AM', cpdPoints: 2.5, provider: 'MARA' },
                { title: 'SIV Compliance Workshop', date: '2026-05-19', time: '1:00 PM – 3:00 PM', cpdPoints: 2, provider: 'MIA' },
              ],
            },
            sk8: {
              learning: [
                { title: 'Advanced Tribunal Advocacy', type: 'course', cpdPoints: 3.5, matchScore: 88, provider: 'Law Council' },
                { title: 'Effective AAT Hearing Preparation', type: 'workshop', cpdPoints: 2, matchScore: 75, provider: 'MIA' },
              ],
              assessments: [
                { title: 'Tribunal Advocacy Assessment', questions: 6, estimatedTime: '12 min' },
              ],
              events: [
                { title: 'AAT Practice Directions Briefing', date: '2026-04-24', time: '10:00 AM – 11:30 AM', cpdPoints: 1.5, provider: 'Law Council' },
              ],
            },
          },
          certificates: [
            { journeyName: 'Migration Act & Regulations', skillId: 'sk1', issuedDate: 'Feb 2026', capabilityScore: 90, status: 'claimable' },
            { journeyName: 'MARA Code of Conduct', skillId: 'sk2', issuedDate: 'Jan 2026', capabilityScore: 94, status: 'claimed' },
          ],
          assessmentQuestions: {
            sk6: [
              { question: 'What is the minimum salary threshold for a Global Talent (858) visa applicant?', options: ['AUD 100,000', 'Fair Work High Income Threshold (FWHIT)', 'AUD 200,000', 'There is no minimum salary'], correct: 1, explanation: 'The Global Talent visa requires applicants to demonstrate they can earn at or above the Fair Work High Income Threshold.' },
              { question: 'How many target sectors are currently eligible for the Global Talent visa program?', options: ['5', '7', '10', '12'], correct: 2, explanation: 'The Global Talent visa program currently covers 10 target sectors including digitech, health industries, and energy.' },
              { question: 'What role does a nominator play in a Global Talent visa application?', options: ['They sponsor the applicant financially', 'They are an Australian citizen or organisation with national reputation who endorses the applicant', 'They guarantee employment', 'They provide accommodation'], correct: 1, explanation: 'A nominator must be an Australian citizen, permanent resident, or organisation with a national reputation in the same field as the applicant.' },
              { question: 'Which evidence is most critical for demonstrating "internationally recognised record of exceptional achievement"?', options: ['Academic transcripts', 'Peer-reviewed publications, patents, awards, or senior appointments', 'Length of work experience', 'English language test scores'], correct: 1, explanation: 'Evidence of exceptional achievement includes publications, patents, major awards, and senior roles that demonstrate international recognition.' },
              { question: 'Can a Global Talent visa holder change employers after grant?', options: ['No, they are tied to one employer', 'Yes, the visa is not employer-sponsored', 'Only after 2 years', 'Only with ministerial approval'], correct: 1, explanation: 'The Global Talent visa is not tied to a specific employer — holders have unrestricted work rights in Australia.' },
              { question: 'What is the processing priority for Global Talent visa applications?', options: ['Standard queue processing', 'Priority processing with a dedicated team', 'Same as skilled worker visas', 'Processed only during allocation rounds'], correct: 1, explanation: 'Global Talent visa applications receive priority processing through a dedicated team within the Department of Home Affairs.' },
            ],
            sk7: [
              { question: 'What is the minimum investment requirement for a Business Innovation (188A) visa?', options: ['AUD 200,000', 'AUD 500,000', 'AUD 800,000', 'AUD 1,250,000'], correct: 0, explanation: 'The Business Innovation stream (188A) requires a minimum business turnover and personal/business assets, with the minimum asset requirement being AUD 200,000 (state-dependent).' },
              { question: 'What is the Significant Investor Visa (SIV) complying investment framework?', options: ['Any Australian investment', 'At least AUD 5 million in complying investments across three categories', 'AUD 1.5 million in government bonds only', 'Property investment of AUD 2 million'], correct: 1, explanation: 'The SIV requires AUD 5 million in complying investments: venture capital/growth PE, emerging companies, and balancing investments.' },
              { question: 'How long must a 188 visa holder maintain their business before applying for an 888 permanent visa?', options: ['6 months', '1 year', '2 years', '4 years'], correct: 2, explanation: 'Business Innovation visa holders must generally hold and operate their business for at least 2 years before being eligible to apply for the 888 permanent visa.' },
              { question: 'Which body nominates Business Innovation visa applicants?', options: ['The Department of Home Affairs', 'A state or territory government', 'An Australian employer', 'The Australian Trade Commission'], correct: 1, explanation: 'Business Innovation visa applicants must be nominated by a state or territory government, which assesses alignment with their economic priorities.' },
              { question: 'What happens if an SIV holder withdraws their complying investments early?', options: ['Nothing, investments are voluntary', 'Their visa may be cancelled for non-compliance', 'They pay a financial penalty', 'They must reapply from scratch'], correct: 1, explanation: 'Maintaining complying investments is a visa condition — withdrawal or non-compliance can lead to visa cancellation.' },
              { question: 'What is the key compliance obligation for 188 visa holders?', options: ['Annual tax returns only', 'Regular reporting to the nominating state/territory on business activity', 'Monthly immigration check-ins', 'Quarterly bank statement submissions'], correct: 1, explanation: '188 visa holders must report to their nominating state/territory on their business activity and compliance with nomination conditions.' },
            ],
          },
          roleProgression: {
            currentRole: 'Registered Migration Agent',
            targetRole: 'Principal Agent',
            progress: 58,
            requiredSkills: ['sk1', 'sk2', 'sk3', 'sk4', 'sk5', 'sk6'],
            metSkills: ['sk1', 'sk2', 'sk3'],
          },
          complianceStatus: {
            mandatoryMet: 4,
            mandatoryTotal: 6,
            nextDeadline: 'Mar 31, 2027',
            regimeSummary: [
              { regime: 'MARA', status: 'On Track', progress: 68 },
            ],
          },
          crossSpaceSignals: [
            { skillId: 'sk4', source: 'Insights', event: 'Employer sponsorship threshold changes announced', date: 'Mar 2026' },
            { skillId: 'sk5', source: 'Comply', event: 'Character assessment policy update', date: 'Feb 2026' },
          ],
        },
        teamCapability: {
          teamAvgScore: 62,
          percentMeetingRequired: 65,
          totalSkillsTracked: 8,
          lastAssessmentCycle: 'Feb 2026',
          teamGaps: [
            { skillId: 'sk7', label: 'Business Innovation Visas', membersBelow: 6, targetLevel: 'Proficient' },
            { skillId: 'sk6', label: 'Global Talent Visas', membersBelow: 5, targetLevel: 'Intermediate' },
            { skillId: 'sk4', label: 'Employer Sponsorship', membersBelow: 4, targetLevel: 'Proficient' },
          ],
          members: [
            { id: 1, name: 'Angela Nguyen', initials: 'AN', role: 'Principal Agent', overallScore: 82, topGap: 'Business Innovation Visas', lastAssessed: 'Feb 2026', skills: { sk1: 4, sk2: 4, sk3: 4, sk4: 3, sk5: 4, sk6: 2, sk7: 1, sk8: 3 }, targetRole: 'Practice Director', roleProgress: 82 },
            { id: 2, name: 'Raj Krishnamurthy', initials: 'RK', role: 'Senior Migration Agent', overallScore: 75, topGap: 'Global Talent Visa', lastAssessed: 'Feb 2026', skills: { sk1: 4, sk2: 4, sk3: 3, sk4: 3, sk5: 4, sk6: 1, sk7: 2, sk8: 3 }, targetRole: 'Principal Agent', roleProgress: 70 },
            { id: 3, name: 'Sophie Liu', initials: 'SL', role: 'Migration Agent', overallScore: 60, topGap: 'Protection Visa', lastAssessed: 'Jan 2026', skills: { sk1: 3, sk2: 3, sk3: 2, sk4: 2, sk5: 3, sk6: 1, sk7: 1, sk8: 2 }, targetRole: 'Senior Agent', roleProgress: 55 },
            { id: 4, name: 'Daniel Okafor', initials: 'DO', role: 'Junior Migration Agent', overallScore: 42, topGap: 'Employer Sponsorship', lastAssessed: 'Feb 2026', skills: { sk1: 2, sk2: 2, sk3: 1, sk4: 1, sk5: 2, sk6: 1, sk7: 1, sk8: 1 }, targetRole: 'Senior Agent', roleProgress: 48 },
            { id: 5, name: 'Maria Santos', initials: 'MS', role: 'Case Manager', overallScore: 55, topGap: 'Tribunal Advocacy', lastAssessed: 'Jan 2026', skills: { sk1: 3, sk2: 3, sk3: 2, sk4: 2, sk5: 3, sk6: 1, sk7: 1, sk8: 1 }, targetRole: 'Principal Agent', roleProgress: 65 },
            { id: 6, name: 'Chris Tanner', initials: 'CT', role: 'Compliance Officer', overallScore: 68, topGap: 'Global Talent Visa', lastAssessed: 'Dec 2025', skills: { sk1: 3, sk2: 4, sk3: 3, sk4: 3, sk5: 3, sk6: 1, sk7: 1, sk8: 2 }, targetRole: 'Senior Agent', roleProgress: 40 },
            { id: 7, name: 'Yuki Tanaka', initials: 'YT', role: 'Senior Migration Agent', overallScore: 70, topGap: 'Business Innovation Visas', lastAssessed: 'Feb 2026', skills: { sk1: 4, sk2: 3, sk3: 3, sk4: 3, sk5: 4, sk6: 2, sk7: 1, sk8: 2 }, targetRole: 'Senior Agent', roleProgress: 52 },
            { id: 8, name: 'Ben Fitzgerald', initials: 'BF', role: 'Practice Manager', overallScore: 48, topGap: 'Protection Visa', lastAssessed: 'Nov 2025', skills: { sk1: 2, sk2: 3, sk3: 1, sk4: 2, sk5: 2, sk6: 1, sk7: 1, sk8: 1 }, targetRole: 'Principal Agent', roleProgress: 60 },
          ],
          skillDistribution: [
            { skillId: 'sk1', label: 'Migration Act & Regulations', avgDots: 3.1, meetingTarget: 75, criticalGap: false },
            { skillId: 'sk2', label: 'MARA Code of Conduct', avgDots: 3.3, meetingTarget: 88, criticalGap: false },
            { skillId: 'sk3', label: 'Protection Visa Assessment', avgDots: 2.4, meetingTarget: 38, criticalGap: false },
            { skillId: 'sk4', label: 'Employer Sponsorship', avgDots: 2.4, meetingTarget: 50, criticalGap: false },
            { skillId: 'sk5', label: 'Character & Identity Assessment', avgDots: 3.1, meetingTarget: 75, criticalGap: false },
            { skillId: 'sk6', label: 'Global Talent (858) Visa Program', avgDots: 1.3, meetingTarget: 0, criticalGap: true },
            { skillId: 'sk7', label: 'Business Innovation & Investment (188/888)', avgDots: 1.1, meetingTarget: 0, criticalGap: true },
            { skillId: 'sk8', label: 'Migration Tribunal Advocacy', avgDots: 1.9, meetingTarget: 25, criticalGap: true },
          ],
        },
      },

      // ── Skills Settings ──────────────────────────────────────
      skillsSettings: {
        assessmentsRequired: 'required-all',
        assessmentSchedule: 'annual',
        dueDateReminders: true,
        matrixSource: 'custom',
        customMatrix: { fileName: 'playfair-skills-matrix.csv', uploadDate: 'Feb 20, 2026', roles: 6, skills: 18 },
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
          { id: 'm-1',  name: 'March Board Meeting',           boardId: 'au',         dateTime: '28 Mar 2026, 9:00am',  type: 'Board',     status: 'Scheduled',   attendees: 8, minutes: 'Pending' },
          { id: 'm-2',  name: 'Audit Committee — Q1 review',   boardId: 'audit-risk', dateTime: '15 Apr 2026, 10:00am', type: 'Committee', status: 'Scheduled',   attendees: 5, minutes: 'Pending' },
          { id: 'm-3',  name: 'Risk Committee — quarterly',    boardId: 'audit-risk', dateTime: '08 Apr 2026, 2:00pm',  type: 'Committee', status: 'Scheduled',   attendees: 5, minutes: 'Pending' },
          { id: 'm-4',  name: 'Annual General Meeting',        boardId: 'au',         dateTime: '22 May 2026, 9:30am',  type: 'AGM',       status: 'Scheduled',   attendees: 0, minutes: 'Pending' },
          { id: 'm-5',  name: 'Remuneration Committee',        boardId: 'governance', dateTime: '22 Apr 2026, 11:00am', type: 'Committee', status: 'Scheduled',   attendees: 4, minutes: 'Pending' },
          { id: 'm-6',  name: 'February Board Meeting',        boardId: 'au',         dateTime: '28 Feb 2026, 9:00am',  type: 'Board',     status: 'Completed',   attendees: 8, minutes: 'Final'   },
          { id: 'm-7',  name: 'China Board — bi-monthly',      boardId: 'cn',         dateTime: '05 May 2026, 8:00am',  type: 'Board',     status: 'Scheduled',   attendees: 7, minutes: 'Pending' },
          { id: 'm-8',  name: 'Governance Committee — Q2',     boardId: 'governance', dateTime: '12 May 2026, 1:00pm',  type: 'Committee', status: 'In Progress', attendees: 5, minutes: 'Draft'   },
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
          'MARA compliance score is 94% — 3 overdue client file audits and 2 unsigned fee agreements are the primary gaps.',
          'OMARA complaint rate is zero for the past 12 months — above industry benchmark.',
          'Sponsorship monitoring obligations are 100% current across all employer-sponsored visa clients.',
          'Identity verification backlog has reduced from 8 to 3 — on track for full clearance this week.',
          'MARA CPD compliance is at risk — 2 agents need additional points before Mar 31 renewal.',
        ],
        aiActions: [
          { priority: 'High', title: 'Complete overdue client file audits', desc: '3 client files overdue for annual audit — Al-Rashid, Chen, and Garcia files require immediate review.' },
          { priority: 'High', title: 'Obtain unsigned fee agreements', desc: '2 clients (Okafor, Hassan) have commenced without signed MARA-compliant fee agreements.' },
          { priority: 'Medium', title: 'Complete identity verifications', desc: '3 clients pending identity verification — required before visa lodgement.' },
          { priority: 'Low', title: 'Update MARA compliance register', desc: 'Quarterly OMARA compliance report due Mar 15. Begin data collection.' },
        ],
        priorities: [
          { label: 'Complete overdue client file audits (3)', urgency: 'High', due: 'This week' },
          { label: 'Obtain unsigned fee agreements (2)', urgency: 'High', due: 'This week' },
          { label: 'Identity verification backlog (3)', urgency: 'Medium', due: 'Before lodgement' },
          { label: 'OMARA compliance report preparation', urgency: 'Low', due: 'Mar 15' },
        ],
        kpis: [
          { label: 'MARA Compliance', value: '94%', delta: '+1.2%', dir: 'up', primary: true },
          { label: 'Open Items', value: '8', delta: '-3', dir: 'up' },
          { label: 'CPD Rate', value: '88%', delta: '+5%', dir: 'up' },
          { label: 'Complaint Rate', value: '0', delta: '0', dir: 'flat' },
        ],
      },

      // ── Contracts ───────────────────────────────────────────
      contracts: {
        aiPoints: [
          '5 active service agreements under management — interpreter services, medical panels, translation services, migration software, and MARA registration.',
          'Interpreter services agreement renewal due Mar 15 — current provider has 12-month price escalation clause.',
          'Medical panel provider agreement has been flagged for review following new Dept of Home Affairs panel physician requirements.',
          'Translation services SLA compliance is at 91% — 2 late deliveries in the past month.',
        ],
        aiActions: [
          { priority: 'High', title: 'Interpreter services renewal', desc: 'Agreement expires Mar 15. Review pricing escalation clause and compare with alternative providers.' },
          { priority: 'Medium', title: 'Medical panel agreement review', desc: 'New Home Affairs requirements for panel physicians may require contract amendments.' },
          { priority: 'Low', title: 'Review translation SLA performance', desc: '2 late deliveries flagged. Schedule quarterly review meeting with provider.' },
        ],
      },

      // ── Conflict ────────────────────────────────────────────
      conflict: {
        aiPoints: [
          '4 potential conflicts identified — 2 involve dual representation in family visa matters.',
          'Employer-employee conflict flagged on Patel 482 visa — TechCorp is both sponsor and has a workplace dispute with applicant.',
          'Family sponsorship conflict in Chen case — sponsor has a concurrent family court matter that may affect visa assessment.',
          'Conflict screening compliance is 100% for all new matters this quarter.',
        ],
        aiActions: [
          { priority: 'High', title: 'Patel employer-employee conflict', desc: 'TechCorp workplace dispute may create a conflict of interest with sponsorship representation. Obtain informed consent or refer.' },
          { priority: 'High', title: 'Chen family court matter', desc: 'Sponsor has concurrent Family Court proceedings. Assess impact on genuine relationship evidence.' },
          { priority: 'Medium', title: 'Review dual representation policy', desc: '2 family visa matters have dual representation — ensure written consent and Chinese walls are documented.' },
        ],
      },

      // ── Risk ────────────────────────────────────────────────
      risk: {
        aiPoints: [
          '7 risks on the active register — 2 Critical, 2 High, 2 Medium, 1 Low.',
          'Visa refusal pattern risk (Critical) — 3 skilled migration refusals in Q4 2025 indicate potential skills assessment issues.',
          'MARA complaint risk elevated — a client has expressed dissatisfaction with processing timeframes.',
          'Sponsorship obligation breach risk — 1 employer sponsor has failed to notify of employment changes within 28 days.',
        ],
        aiActions: [
          { priority: 'High', title: 'Review skills assessment process', desc: '3 refusals linked to skills assessments. Review preparation process and consider engaging assessment body directly.' },
          { priority: 'High', title: 'Address client dissatisfaction', desc: 'Proactive contact recommended to prevent formal MARA complaint. Schedule call this week.' },
          { priority: 'Medium', title: 'Sponsorship breach notification', desc: 'Employer sponsor has failed to report employment changes. Advise client of obligations and potential consequences.' },
        ],
      },

      // ── Incident ────────────────────────────────────────────
      incident: {
        aiPoints: [
          '5 incidents logged this quarter — 2 relate to missed Home Affairs deadlines, 2 to documentation errors, 1 client complaint.',
          'Missed RFI response deadline on Kim skilled migration case resulted in visa refusal — AAT appeal lodged.',
          'Documentation error on Garcia student visa — incorrect CoE details submitted, correction lodged.',
          'Client complaint from Okafor regarding lack of communication during nomination processing period.',
        ],
        aiActions: [
          { priority: 'High', title: 'Implement RFI tracking system', desc: '2 missed deadlines indicate systemic gap. Implement automated RFI deadline alerts across all matters.' },
          { priority: 'Medium', title: 'Address Okafor communication complaint', desc: 'Client expects weekly updates during nomination processing. Set up automated status notifications.' },
          { priority: 'Low', title: 'Document correction procedure review', desc: '2 documentation errors this quarter. Review quality check procedures before lodgement.' },
        ],
      },

      // ── Audit ───────────────────────────────────────────────
      audit: {
        aiPoints: [
          'MARA compliance audit evidence is 78% complete — CPD records and client file audits are the primary gaps.',
          'Home Affairs correspondence logs are up to date across all active matters.',
          'OMARA annual return preparation is on track — due Apr 30.',
          'Professional indemnity insurance renewal evidence needs to be collected before Mar 31 MARA renewal.',
        ],
        aiActions: [
          { priority: 'High', title: 'Complete MARA CPD records', desc: 'CPD evidence is the primary gap for compliance audit. Ensure all certificates and attendance records are filed.' },
          { priority: 'High', title: 'Professional indemnity renewal', desc: 'Insurance certificate needed for MARA renewal by Mar 31. Contact broker for renewal quote.' },
          { priority: 'Medium', title: 'Complete client file audit backlog', desc: '3 overdue client file audits. Schedule dedicated audit day this week.' },
        ],
      },

      // ── Legislation ─────────────────────────────────────────
      legislation: {
        aiPoints: [
          '8 migration-specific regulatory updates tracked this quarter — Migration Act amendments, new visa subclass conditions, and updated policy guidance.',
          'Migration Amendment (Strengthening Employer Sponsor Obligations) Act 2026 effective Apr 1 — significant impact on 482/494 sponsored matters.',
          'Updated Direction under s499 of the Migration Act regarding character test — affects all protection visa assessments.',
          'New English language testing requirements for skilled migration effective Jul 1 — PTE and IELTS changes.',
        ],
        aiSuggestions: [
          'Brief all agents on employer sponsor obligation changes before Apr 1 effective date.',
          'Update protection visa assessment procedures to reflect new s499 Direction on character.',
          'Advise skilled migration clients of upcoming English testing changes and transition arrangements.',
          'Review all active 482/494 matters for compliance with new sponsor monitoring requirements.',
        ],
      },

      // ── Respond ─────────────────────────────────────────────
      respond: {
        draftActions: [
          { id: 1, title: 'Draft visa assessment — Hassan Global Talent', status: 'Ready for review', time: '5 min ago' },
          { id: 2, title: 'Prepare AAT submission — Nguyen appeal', status: 'In progress', time: '20 min ago' },
          { id: 3, title: 'Generate sponsorship compliance report', status: 'Queued', time: '1 hr ago' },
        ],
        featuredAgents: [
          { id: 1, name: 'Visa Assessment Drafter', description: 'Analyses client circumstances against visa criteria and drafts initial assessment letters.', category: 'Migration' },
          { id: 2, name: 'Ministerial Intervention Writer', description: 'Drafts s351/s417 ministerial intervention requests with supporting arguments.', category: 'Appeals' },
          { id: 3, name: 'Tribunal Submission Generator', description: 'Prepares AAT/ART review application submissions with legal arguments.', category: 'Appeals' },
        ],
      },

      // ── MatterDetail ────────────────────────────────────────
      matterDetail: {
        actors: {
          SM: { color: 'bg-slate-500 text-white', name: 'Sarah Mitchell' },
          JW: { color: 'bg-brand-800 text-brand-50', name: 'James Walker' },
          RL: { color: 'bg-violet-500 text-white', name: 'Rachel Lee' },
          KL: { color: 'bg-teal-600 text-white', name: 'Karen Liu' },
          DP: { color: 'bg-orange-500 text-white', name: 'David Park' },
        },
        tasks: [
          { id: 1, task: 'Lodge visa application with Home Affairs', assignee: 'KL', due: 'Mar 1', status: 'In Progress', priority: 'Critical' },
          { id: 2, task: 'Request health examination from panel physician', assignee: 'RL', due: 'Feb 25', status: 'Behind', priority: 'High' },
          { id: 3, task: 'Submit character declarations and police checks', assignee: 'SM', due: 'Feb 28', status: 'In Progress', priority: 'High' },
          { id: 4, task: 'Compile relationship evidence bundle', assignee: 'SM', due: 'Mar 5', status: 'Open', priority: 'Critical' },
          { id: 5, task: 'Obtain sponsor statutory declaration', assignee: 'JW', due: 'Mar 3', status: 'Open', priority: 'Medium' },
          { id: 6, task: 'Prepare Form 80 personal particulars', assignee: 'DP', due: 'Mar 8', status: 'Open', priority: 'Medium' },
          { id: 7, task: 'Schedule client interview preparation', assignee: 'JW', due: 'Mar 15', status: 'Open', priority: 'Low' },
        ],
        risks: [
          { risk: 'Health examination delay — panel physician backlog', severity: 'Critical', status: 'Open', owner: 'RL' },
          { risk: 'Insufficient relationship evidence for decision', severity: 'High', status: 'Mitigated', owner: 'SM' },
          { risk: 'Sponsor income below threshold for financial support', severity: 'Medium', status: 'Monitored', owner: 'JW' },
          { risk: 'Police check processing delay (overseas)', severity: 'Low', status: 'Open', owner: 'SM' },
        ],
        documents: [
          { name: 'Form 47SP — Partner Visa Application', type: 'Application', date: 'Feb 18', status: 'Draft' },
          { name: 'Relationship Evidence Bundle', type: 'Evidence', date: 'Feb 15', status: 'Under Review' },
          { name: 'Sponsor Statutory Declaration', type: 'Legal', date: 'Feb 10', status: 'Final' },
          { name: 'Health Examination Referral', type: 'Medical', date: 'Jan 20', status: 'Filed' },
          { name: 'Police Clearance Certificate', type: 'Character', date: 'Jan 15', status: 'Complete' },
        ],
        fileCompleteness: [
          { label: 'Identity Documents', pct: 100 },
          { label: 'Relationship Evidence', pct: 65 },
          { label: 'Character & Health', pct: 50 },
          { label: 'Financial Documents', pct: 80 },
        ],
        timeline: [
          { date: 'Feb 18', text: 'Form 47SP draft prepared — awaiting final review', actor: 'KL' },
          { date: 'Feb 15', text: 'Relationship evidence bundle compiled — v1 sent for review', actor: 'SM' },
          { date: 'Feb 10', text: 'Sponsor statutory declaration signed and witnessed', actor: 'JW' },
          { date: 'Feb 05', text: 'Health examination referral sent to panel physician', actor: 'RL' },
          { date: 'Jan 28', text: 'Police clearance certificates received (Australia + overseas)', actor: 'SM' },
          { date: 'Jan 20', text: 'Initial client consultation completed — visa pathway confirmed', actor: 'JW' },
          { date: 'Jan 15', text: 'Fee agreement signed — case file opened', actor: 'JW' },
        ],
        aiPoints: [
          'Health examination is overdue — panel physician backlog is causing delays. Consider alternative panel physician.',
          'Relationship evidence bundle at 65% — needs additional financial co-mingling and social context evidence.',
          '3 critical tasks have overlapping deadlines in the Mar 1–5 window — resource allocation needed.',
          'Sponsor income documentation shows earnings slightly below threshold — may need additional evidence or co-sponsor.',
          'Police clearances are complete for both Australian and overseas checks — character assessment is on track.',
        ],
      },

    }, // end pages
  }, // end migration

  // ── FSHD Global Research Foundation ─────────────────────────────────────────
  fshd: {
    appName: 'FSHD Global',
    logo: '/fshd-logo.png',
    icon: '/fshd-icon.png',
    greeting: 'Good morning, Emma',

    term: {
      matter: 'project', matters: 'projects', Matter: 'Project', Matters: 'Projects',
      firm: 'foundation', Firm: 'Foundation',
    },

    nav: { work: 'Matters' },

    complySubItems: [
      { title: 'Overview', page: 'Comply' },
      { title: 'ACNC & Regulatory Landscape', page: 'Legislation & Regulatory Landscape' },
      { title: 'Grants & Agreements', page: 'Contracts & Obligations' },
      { title: 'Conflict of Interest', page: 'Conflict Management' },
      { title: 'Incidents & Safeguarding', page: 'Incidents & Breaches' },
      { title: 'Risk & Controls', page: 'Risk & Controls' },
      { title: 'Audit & Assurance', page: 'Audit & Evidence' },
    ],

    pages: {

      // ── Control ─────────────────────────────────────────────
      control: {
        kpiActiveMatters: 'Active Projects',
        mattersOverview: 'Projects Overview',
        mattersOverviewSub: '12 active across 4 pillars',
        firmHealth: 'Foundation Health',
        kpis: [
          { label: 'ACNC Compliance', value: '96%', delta: '+2.1%', dir: 'up', primary: true },
          { label: 'Active Projects', value: '12', delta: '+2', dir: 'up' },
          { label: 'Donor Retention', value: '84%', delta: '+1.5%', dir: 'up' },
          { label: 'Research Grants', value: '$4.2M', delta: '+$600K', dir: 'up' },
        ],
        matters: [
          { name: 'Cure FSHD Registry Expansion', client: 'Registry Partners', type: 'Research', status: 'Active', days: 90, value: '$1.8M', lead: 'LI' },
          { name: 'Sydney Chocolate Ball 2026', client: 'Events Committee', type: 'Fundraising', status: 'Active', days: 45, value: '$2.5M', lead: 'EW' },
          { name: 'Facio BioTherapies Investment Round', client: 'Facio BioTherapies', type: 'Biotech', status: 'Review', days: 120, value: '$5M', lead: 'NC' },
          { name: 'World FSHD Day Campaign', client: 'Advocacy Committee', type: 'Advocacy', status: 'Active', days: 30, value: '$120K', lead: 'EW' },
          { name: 'Gene Therapy Clinical Trial — Phase II', client: 'Research Partners', type: 'Clinical Trial', status: 'Active', days: 210, value: '$3.2M', lead: 'LI' },
        ],
        compliance: [
          { label: 'DGR Status', status: 'good', value: 'Current', sub: 'Renewal 2027' },
          { label: 'ACNC Reporting', status: 'good', value: 'Submitted', sub: 'AIS lodged' },
          { label: 'Fundraising Licences', status: 'warning', value: '6/8', sub: '2 renewals due' },
          { label: 'Privacy Act Compliance', status: 'good', value: 'Compliant', sub: 'Policy reviewed' },
          { label: 'WHS Compliance', status: 'neutral', value: 'Review due', sub: 'Mar 2026' },
        ],
        firmHealthMetrics: [
          { label: 'Fundraising ROI', value: 88, target: 85, delta: '+3%', above: true },
          { label: 'Grant Acquittal Rate', value: 95, target: 90, delta: '+5%', above: true },
          { label: 'Donor Retention', value: 84, target: 80, delta: '+4%', above: true },
          { label: 'Overhead Ratio', value: 18, target: 15, delta: '+3%', above: false },
        ],
        team: [
          { initials: 'EW', name: 'Emma Weatherley', role: 'CEO', matters: 6, util: 92, level: 'over' },
          { initials: 'LI', name: 'Dr Laura Issa', role: 'Scientific Director', matters: 5, util: 88, level: 'high' },
          { initials: 'NC', name: 'Natalie Cooney', role: 'Board Chair', matters: 3, util: 45, level: 'good' },
          { initials: 'BM', name: 'Bill Moss AO', role: 'Founder & Board Member', matters: 2, util: 30, level: 'good' },
          { initials: 'JH', name: 'Jessica Hart', role: 'Fundraising Manager', matters: 4, util: 85, level: 'high' },
        ],
        aiActions: [
          { priority: 'High', title: 'Fundraising licence renewals due', desc: 'NSW and VIC charitable fundraising licences expire in March. Renewal applications must be lodged by Feb 28.' },
          { priority: 'High', title: 'Gene Therapy Trial ethics renewal', desc: 'HREC approval for Phase II gene therapy trial expires Apr 15. Amendment application needed for protocol changes.' },
          { priority: 'Medium', title: 'Sydney Chocolate Ball sponsorship shortfall', desc: 'Current sponsorship commitments at $1.8M against $2.5M target. 3 prospective sponsors require follow-up.' },
          { priority: 'Low', title: 'ACNC governance review', desc: 'Annual governance standards self-assessment due by Jun 30. Begin board survey and documentation review.' },
        ],
        importantDates: [
          { label: 'Fundraising licence renewal — NSW & VIC', month: 'FEB', day: '28', year: '2026', sub: 'Saturday · Compliance', urgency: 'high' },
          { label: 'HREC ethics approval renewal', month: 'APR', day: '15', year: '2026', sub: 'Wednesday · Clinical Trial', urgency: 'high' },
          { label: 'Sydney Chocolate Ball', month: 'JUN', day: '20', year: '2026', sub: 'Saturday · Fundraising', urgency: 'medium' },
          { label: 'ACNC Annual Information Statement', month: 'MAR', day: '31', year: '2026', sub: 'Tuesday · Reporting', urgency: 'medium' },
          { label: 'World FSHD Day', month: 'JUN', day: '20', year: '2026', sub: 'Saturday · Advocacy', urgency: 'low' },
          { label: 'DGR endorsement review', month: 'SEP', day: '30', year: '2026', sub: 'Wednesday · Compliance', urgency: 'low' },
        ],
        upcomingEvents: [
          { title: 'Board Meeting — Q1 Review', month: 'MAR', day: '05', year: '2026', time: '10:00 AM', location: 'FSHD Global Office' },
          { title: 'Scientific Advisory Board Meeting', month: 'MAR', day: '12', year: '2026', time: '2:00 PM', location: 'Video call' },
          { title: 'Donor Appreciation Evening', month: 'MAR', day: '20', year: '2026', time: '6:00 PM', location: 'Sydney CBD' },
          { title: 'Facio BioTherapies Investment Committee', month: 'MAR', day: '25', year: '2026', time: '9:00 AM', location: 'Board Room' },
          { title: 'Muscles for Muscles Campaign Launch', month: 'APR', day: '01', year: '2026', time: '11:00 AM', location: 'Martin Place, Sydney' },
        ],
        aiSummary: [
          'ACNC compliance is strong at 96% — fundraising licence renewals in NSW and VIC are the primary action items before end of February.',
          'Research portfolio spans $23M+ invested across 11 countries. Gene Therapy Phase II trial is the flagship project with $3.2M committed.',
          'Sydney Chocolate Ball sponsorship is tracking at 72% of target — 3 major sponsor proposals need follow-up this month.',
          'Donor retention has improved to 84%, above the 80% target, driven by improved impact reporting and the Cure FSHD Registry.',
          'Overhead ratio at 18% is above the 15% target — board to review operational efficiencies at Q1 meeting.',
        ],
        priorities: [
          { label: 'Lodge fundraising licence renewals (NSW & VIC)', urgency: 'High', due: 'Feb 28' },
          { label: 'Prepare HREC ethics renewal application', urgency: 'High', due: 'Before Apr 15' },
          { label: 'Close sponsorship gap for Chocolate Ball', urgency: 'Medium', due: 'Apr 30' },
          { label: 'Complete ACNC Annual Information Statement', urgency: 'Medium', due: 'Mar 31' },
          { label: 'Board governance self-assessment', urgency: 'Low', due: 'Jun 30' },
        ],
      },

      // ── Work ────────────────────────────────────────────────
      work: {
        title: 'Work',
        description: 'Project delivery, performance & task operations',
        newButton: 'New Project',
        overviewTitle: 'Projects Overview',
        overviewSub: (total) => `Distribution across ${total} active projects`,
        donutLabel: 'PROJECTS',
        matterStats: {
          total: 12,
          weekDelta: '+2',
          breakdown: [
            { label: 'Research',    value: 4, pct: 33, hex: '#a7f3d0', textHex: '#065f46' },
            { label: 'Fundraising', value: 3, pct: 25, hex: '#fde68a', textHex: '#92400e' },
            { label: 'Advocacy',    value: 3, pct: 25, hex: '#e2e8f0', textHex: '#475569' },
            { label: 'Biotech',     value: 2, pct: 17, hex: '#fecaca', textHex: '#991b1b' },
          ],
        },
        performance: [
          { label: 'Grant Acquittal Rate',    value: '95%',  bar: 95, onTarget: true,  note: '+5% vs target' },
          { label: 'Fundraising ROI',         value: '4.2x', bar: 84, onTarget: true,  note: '+0.3x vs prev yr' },
          { label: 'Donor Retention',         value: '84%',  bar: 84, onTarget: true,  note: '+4% vs target' },
          { label: 'Research Milestones Met', value: '78%',  bar: 78, onTarget: false, note: 'target 85%' },
          { label: 'Volunteer Engagement',    value: '92%',  bar: 92, onTarget: true,  note: '+7% MoM' },
        ],
        workMatters: [
          { id: 1, name: 'Cure FSHD Registry Expansion', ref: 'FSHD-2601', client: 'Registry Partners', practice: 'Find a Cure', status: 'On Track', priority: 'Critical', progress: 60, due: 'Jun 30', value: '$1.8M', lead: 'LI', leadColor: 'bg-violet-500 text-white' },
          { id: 2, name: 'Sydney Chocolate Ball 2026', ref: 'FSHD-2602', client: 'Events Committee', practice: 'Fundraising', status: 'Behind', priority: 'High', progress: 45, due: 'Jun 20', value: '$2.5M', lead: 'EW', leadColor: 'bg-brand-800 text-brand-50' },
          { id: 3, name: 'Facio BioTherapies Investment Round', ref: 'FSHD-2603', client: 'Facio BioTherapies', practice: 'Biotech', status: 'Active', priority: 'Critical', progress: 35, due: 'May 15', value: '$5M', lead: 'NC', leadColor: 'bg-teal-600 text-white' },
          { id: 4, name: 'World FSHD Day Campaign', ref: 'FSHD-2604', client: 'Advocacy Committee', practice: 'Patient & Medical Advocacy', status: 'On Track', priority: 'Medium', progress: 25, due: 'Jun 20', value: '$120K', lead: 'EW', leadColor: 'bg-brand-800 text-brand-50' },
          { id: 5, name: 'Gene Therapy Clinical Trial — Phase II', ref: 'FSHD-2605', client: 'Research Partners', practice: 'Find a Cure', status: 'Active', priority: 'Critical', progress: 55, due: 'Dec 31', value: '$3.2M', lead: 'LI', leadColor: 'bg-violet-500 text-white' },
          { id: 6, name: 'Muscles for Muscles Campaign 2026', ref: 'FSHD-2606', client: 'Community Partners', practice: 'Fundraising', status: 'On Track', priority: 'Medium', progress: 20, due: 'Apr 01', value: '$350K', lead: 'JH', leadColor: 'bg-orange-500 text-white' },
          { id: 7, name: 'FSHD Biomarker Discovery Program', ref: 'FSHD-2607', client: 'University of Sydney', practice: 'Muscle Regeneration', status: 'Active', priority: 'High', progress: 40, due: 'Sep 30', value: '$800K', lead: 'LI', leadColor: 'bg-violet-500 text-white' },
          { id: 8, name: 'Patient Advocacy Toolkit Development', ref: 'FSHD-2608', client: 'FSHD Society', practice: 'Patient & Medical Advocacy', status: 'On Track', priority: 'Low', progress: 70, due: 'Mar 31', value: '$45K', lead: 'EW', leadColor: 'bg-brand-800 text-brand-50' },
          { id: 9, name: 'Facio Gene Editing Platform — Preclinical', ref: 'FSHD-2609', client: 'Facio BioTherapies', practice: 'Biotech', status: 'On Hold', priority: 'High', progress: 15, due: 'TBD', value: '$2.1M', lead: 'NC', leadColor: 'bg-teal-600 text-white' },
          { id: 10, name: 'International Research Consortium Grant', ref: 'FSHD-2610', client: 'NIH / NHMRC', practice: 'Find a Cure', status: 'Active', priority: 'High', progress: 30, due: 'Aug 15', value: '$1.5M', lead: 'LI', leadColor: 'bg-violet-500 text-white' },
        ],
        aiPoints: [
          'Sydney Chocolate Ball sponsorship is behind target at 45% — 3 major sponsor proposals need follow-up before end of March.',
          'Gene Therapy Phase II trial is progressing well at 55% — HREC ethics renewal due Apr 15 is a critical dependency.',
          'Facio BioTherapies investment round is at 35% progress — due diligence materials need board review by Mar 25.',
          'Muscles for Muscles campaign launches Apr 1 — marketing collateral and volunteer coordination need to be finalised.',
          'International Research Consortium Grant application due Aug 15 — preliminary data package from 3 partner institutions still outstanding.',
        ],
        aiActions: [
          { text: 'Follow up on 3 outstanding Chocolate Ball sponsorship proposals — total gap of $700K against target' },
          { text: 'Prepare HREC ethics renewal application for Gene Therapy Phase II before Apr 15 deadline' },
          { text: 'Circulate Facio BioTherapies due diligence pack to board members before Mar 25 investment committee' },
        ],
      },

      // ── Vault ───────────────────────────────────────────────
      vault: {
        description: 'The documentation base that supports FSHD Global governance, research, and fundraising operations',
        status: {
          label: 'Excellent',
          body: 'Your vault has the foundational documents Ethos needs to understand FSHD Global — governing structure, ACNC policies, research and ethics frameworks, and strategic direction. HREC ethics approvals are due for review.',
          lastSynced: 'Last synced 8 min ago',
        },
        categories: [
          { id: 'governing',  name: 'Governing Documents'  },
          { id: 'policies',   name: 'Policies'             },
          { id: 'frameworks', name: 'Frameworks'           },
          { id: 'strategy',   name: 'Strategy & Reporting' },
        ],
        files: [
          // Governing Documents (5)
          { id: 'fs-1',  name: 'FSHD Global Constitution 2024',         type: 'document',    categoryId: 'governing',  status: 'stale',   lastUpdated: '15 Jan 2026 at 9:00am'  },
          { id: 'fs-2',  name: 'ACNC Registration Certificate',         type: 'document',    categoryId: 'governing',  status: 'healthy', lastUpdated: '20 Sep 2025 at 11:42am' },
          { id: 'fs-3',  name: 'Trust Deed (FSHD Global Foundation)',   type: 'document',    categoryId: 'governing',  status: 'healthy', lastUpdated: '14 Feb 2026 at 9:00am'  },
          { id: 'fs-4',  name: 'Board Charter',                          type: 'document',    categoryId: 'governing',  status: 'healthy', lastUpdated: '08 Mar 2026 at 2:30pm'  },
          { id: 'fs-5',  name: 'Scientific Advisory Board Charter',      type: 'document',    categoryId: 'governing',  status: 'healthy', lastUpdated: '12 Feb 2026 at 5:14pm'  },
          // Policies (5)
          { id: 'fs-6',  name: 'Code of Conduct',                        type: 'document',    categoryId: 'policies',   status: 'healthy', lastUpdated: '08 Feb 2026 at 9:00am'  },
          { id: 'fs-7',  name: 'Conflict of Interest Policy v2',         type: 'document',    categoryId: 'policies',   status: 'healthy', lastUpdated: '12 Mar 2026 at 3:22pm'  },
          { id: 'fs-8',  name: 'Privacy Policy',                         type: 'document',    categoryId: 'policies',   status: 'healthy', lastUpdated: '18 Jan 2026 at 11:18am' },
          { id: 'fs-9',  name: 'Donor Engagement Policy',                type: 'document',    categoryId: 'policies',   status: 'healthy', lastUpdated: '02 Apr 2026 at 4:30pm'  },
          { id: 'fs-10', name: 'Volunteer & Conduct Policy',             type: 'document',    categoryId: 'policies',   status: 'check',   lastUpdated: '08 Nov 2025 at 5:44pm'  },
          // Frameworks (5)
          { id: 'fs-11', name: 'Risk Management Framework',              type: 'document',    categoryId: 'frameworks', status: 'healthy', lastUpdated: '01 Mar 2026 at 4:00pm'  },
          { id: 'fs-12', name: 'Research Integrity Framework',           type: 'document',    categoryId: 'frameworks', status: 'healthy', lastUpdated: '04 Apr 2026 at 9:30am'  },
          { id: 'fs-13', name: 'HREC Ethics Framework',                  type: 'document',    categoryId: 'frameworks', status: 'check',   lastUpdated: '20 Jan 2026 at 8:50am'  },
          { id: 'fs-14', name: 'ACNC Compliance Framework',              type: 'document',    categoryId: 'frameworks', status: 'healthy', lastUpdated: '28 Jan 2026 at 12:00pm' },
          { id: 'fs-15', name: 'Fundraising Compliance Framework',       type: 'document',    categoryId: 'frameworks', status: 'healthy', lastUpdated: '15 Feb 2026 at 10:00am' },
          // Strategy & Reporting (5)
          { id: 'fs-16', name: 'Strategic Plan FY26-28',                 type: 'document',    categoryId: 'strategy',   status: 'healthy', lastUpdated: '12 Jan 2026 at 10:32am' },
          { id: 'fs-17', name: 'ACNC Annual Information Statement 2025', type: 'document',    categoryId: 'strategy',   status: 'healthy', lastUpdated: '28 Jan 2026 at 12:00pm' },
          { id: 'fs-18', name: 'Research Strategy 2026-2028',            type: 'document',    categoryId: 'strategy',   status: 'healthy', lastUpdated: '10 Feb 2026 at 2:42pm'  },
          { id: 'fs-19', name: 'FY25 Annual Report & Impact Statement',  type: 'document',    categoryId: 'strategy',   status: 'healthy', lastUpdated: '15 Oct 2025 at 9:45am'  },
          { id: 'fs-20', name: 'FY2025 Audited Financial Statements',    type: 'document',    categoryId: 'strategy',   status: 'stale',   lastUpdated: '30 Jul 2025 at 5:14pm'  },
        ],
      },

      // ── Meet ────────────────────────────────────────────────
      meet: {
        summaryPoints: [
          "You've attended 4 board and committee meetings this quarter, with strong attendance across all governance forums.",
          "Scientific Advisory Board has reviewed 6 research proposals — 4 recommended for funding, 2 returned for further development.",
          "Donor briefings have increased 25% this quarter, correlating with improved retention and a $600K uplift in pledged giving.",
        ],
        upcoming: [
          { id: 1, month: 'MAR', day: '05', year: '2026', name: 'Board Meeting — Q1 Review', time: '10:00am', location: 'FSHD Global Office', hasAgenda: true, hasBoardPack: true, hasMinutes: false },
          { id: 2, month: 'MAR', day: '12', year: '2026', name: 'Scientific Advisory Board Meeting', time: '2:00pm', location: 'Video call', hasAgenda: true, hasBoardPack: true, hasMinutes: false },
          { id: 3, month: 'MAR', day: '20', year: '2026', name: 'Donor Appreciation Evening', time: '6:00pm', location: 'Sydney CBD', hasAgenda: true, hasBoardPack: false, hasMinutes: false },
          { id: 4, month: 'MAR', day: '25', year: '2026', name: 'Facio BioTherapies Investment Committee', time: '9:00am', location: 'Board Room', hasAgenda: true, hasBoardPack: true, hasMinutes: false },
        ],
        past: [
          { id: 5, month: 'FEB', day: '12', year: '2026', name: 'Board Meeting — Strategic Planning', time: '10:00am', location: 'FSHD Global Office', hasAgenda: true, hasBoardPack: true, hasMinutes: true },
          { id: 6, month: 'FEB', day: '05', year: '2026', name: 'Scientific Committee — Grant Review', time: '2:00pm', location: 'Video call', hasAgenda: true, hasBoardPack: true, hasMinutes: true },
          { id: 7, month: 'JAN', day: '28', year: '2026', name: 'Fundraising Committee Meeting', time: '11:00am', location: 'Online', hasAgenda: true, hasBoardPack: false, hasMinutes: true },
        ],
      },

      // ── Resource Library ────────────────────────────────────
      resource: {
        categories: [
          { id: 'all', label: 'All' },
          { id: 'research', label: 'Research' },
          { id: 'governance', label: 'Governance' },
          { id: 'fundraising', label: 'Fundraising' },
          { id: 'compliance', label: 'Compliance' },
          { id: 'clinical', label: 'Clinical Trials' },
        ],
        contentTypes: [
          { id: 'all', label: 'All Types' },
          { id: 'template', label: 'Templates' },
          { id: 'guide', label: 'Guides' },
          { id: 'policy', label: 'Policies' },
          { id: 'playbook', label: 'Playbooks' },
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
            id: 'rl-f1', title: 'Grant Application Template — NHMRC', description: 'Standard template for NHMRC research grant applications with budget justification and ethics sections.',
            resource_type: 'template', category: 'research', tags: ['NHMRC', 'Grant', 'Research'], jurisdiction: 'Australia',
            author: { name: 'Rebecca Liu', role: 'Grant & Partnerships Manager' }, source: 'ethika', status: 'approved', ai_assisted: false,
            file_type: 'DOCX', file_size: '68 KB', last_updated: '2026-02-15', review_due: '2026-08-15',
            version: '2.0', page_count: 14,
            purpose: 'Provides a structured template for preparing competitive NHMRC research grant applications.',
            when_to_use: ['When preparing NHMRC Investigator Grant applications', 'During annual grant round preparation', 'As a framework for other research funding applications'],
            linked_categories: ['Research', 'Fundraising'],
            compliance_flags: [{ type: 'info', message: 'Aligned with NHMRC 2026 Investigator Grant Guidelines.' }],
            key_clauses: [
              { name: 'Research Plan', description: 'Structured research plan including aims, significance, innovation, and approach.', clause_ref: 'Section 3' },
              { name: 'Budget Justification', description: 'Detailed budget with justification for personnel, equipment, and consumables.', clause_ref: 'Section 5' },
            ],
            sections: [{ number: '1', title: 'Project Summary' }, { number: '2', title: 'Investigator Profile' }, { number: '3', title: 'Research Plan' }, { number: '4', title: 'Ethics & Governance' }, { number: '5', title: 'Budget' }],
            versions: [{ number: '2.0', date: '2026-02-15', author: 'Rebecca Liu', summary: 'Updated for 2026 NHMRC guidelines and funding rules.', current: true }],
            related_learning: [{ title: 'Research Grant Writing', type: 'Course', estimated_time: '3 hrs', kc_id: 'kc-grants' }],
          },
          {
            id: 'rl-f2', title: 'Board Paper Template', description: 'Template for board meeting papers including executive summary, recommendation, and risk assessment sections.',
            resource_type: 'template', category: 'governance', tags: ['Board', 'Governance', 'Template'], jurisdiction: null,
            author: { name: 'David Morrison', role: 'NFP Governance Consultant' }, source: 'org', status: 'approved', ai_assisted: false,
            file_type: 'DOCX', file_size: '42 KB', last_updated: '2026-01-20', review_due: '2026-07-20',
            version: '1.3', page_count: 6,
            purpose: 'Ensures consistent, high-quality board papers that enable effective board decision-making.',
            when_to_use: ['When preparing papers for board meetings', 'For committee papers requiring board endorsement', 'As a standard for management reporting to the board'],
            linked_categories: ['Governance'],
            compliance_flags: [{ type: 'info', message: 'Aligned with ACNC governance standards for registered charities.' }],
            key_clauses: [
              { name: 'Executive Summary', description: 'Concise overview of the matter, key issues, and recommended action.', clause_ref: 'Section 1' },
              { name: 'Risk Assessment', description: 'Identification and assessment of risks associated with the recommendation.', clause_ref: 'Section 4' },
            ],
            sections: [{ number: '1', title: 'Executive Summary' }, { number: '2', title: 'Background' }, { number: '3', title: 'Options Analysis' }, { number: '4', title: 'Risk Assessment' }, { number: '5', title: 'Recommendation' }],
            versions: [{ number: '1.3', date: '2026-01-20', author: 'David Morrison', summary: 'Added risk assessment section.', current: true }],
            related_learning: [{ title: 'NFP Board Governance', type: 'Course', estimated_time: '2 hrs', kc_id: 'kc-nfp-gov' }],
          },
          {
            id: 'rl-f3', title: 'ACNC Governance Standards Checklist', description: 'Self-assessment checklist against ACNC governance standards for registered charities.',
            resource_type: 'guide', category: 'compliance', tags: ['ACNC', 'Governance', 'Compliance'], jurisdiction: 'Australia',
            author: { name: 'David Morrison', role: 'NFP Governance Consultant' }, source: 'ethika', status: 'approved', ai_assisted: true,
            file_type: 'PDF', file_size: '52 KB', last_updated: '2026-03-01', review_due: '2026-09-01',
            version: '1.1', page_count: 10,
            purpose: 'Enables charities to self-assess their compliance with all five ACNC governance standards.',
            when_to_use: ['During annual governance reviews', 'When preparing for ACNC compliance reviews', 'As part of new director onboarding'],
            linked_categories: ['Compliance', 'Governance'],
            compliance_flags: [{ type: 'info', message: 'Covers all 5 ACNC Governance Standards under the ACNC Act 2012.' }],
            key_clauses: [
              { name: 'Standard 1 — Purposes', description: 'Charity operates for its stated charitable purposes and is not-for-profit.', clause_ref: 'Standard 1' },
              { name: 'Standard 5 — Duties of Officers', description: 'Responsible persons understand and fulfil their duties.', clause_ref: 'Standard 5' },
            ],
            sections: [{ number: '1', title: 'Purposes & NFP' }, { number: '2', title: 'Accountability' }, { number: '3', title: 'Compliance' }, { number: '4', title: 'Financial' }, { number: '5', title: 'Officer Duties' }],
            versions: [{ number: '1.1', date: '2026-03-01', author: 'David Morrison', summary: 'Updated for revised ACNC guidance on Standard 3.', current: true }],
            related_learning: [{ title: 'NFP Compliance Essentials', type: 'Learning Module', estimated_time: '1.5 hrs', kc_id: 'kc-nfp-compliance' }],
          },
          {
            id: 'rl-f4', title: 'Clinical Trial Consent Form Template', description: 'Participant information and consent form template for FSHD clinical trials meeting NHMRC requirements.',
            resource_type: 'template', category: 'clinical', tags: ['Clinical Trial', 'Consent', 'HREC', 'NHMRC'], jurisdiction: 'Australia',
            author: { name: 'Dr Anita Patel', role: 'Clinical Trial Coordinator' }, source: 'org', status: 'approved', ai_assisted: false,
            file_type: 'DOCX', file_size: '32 KB', last_updated: '2026-02-10', review_due: '2026-08-10',
            version: '3.0', page_count: 8,
            purpose: 'Provides a compliant participant information and consent form for FSHD clinical trial recruitment.',
            when_to_use: ['When initiating a new clinical trial', 'During HREC ethics application preparation', 'When amending an existing trial protocol'],
            linked_categories: ['Clinical Trials', 'Research'],
            compliance_flags: [
              { type: 'info', message: 'Compliant with NHMRC National Statement on Ethical Conduct in Human Research (2023 update).' },
              { type: 'neutral', message: 'Must be customised for each specific trial protocol and approved by HREC before use.' },
            ],
            key_clauses: [
              { name: 'Voluntary Participation', description: 'Clear statement that participation is voluntary and can be withdrawn at any time without affecting care.', clause_ref: 'Section 2' },
              { name: 'Risks and Benefits', description: 'Plain language description of known risks, potential benefits, and alternatives to participation.', clause_ref: 'Section 5' },
            ],
            sections: [{ number: '1', title: 'Study Overview' }, { number: '2', title: 'Voluntary Participation' }, { number: '3', title: 'Procedures' }, { number: '4', title: 'Data & Privacy' }, { number: '5', title: 'Risks & Benefits' }, { number: '6', title: 'Consent Declaration' }],
            versions: [{ number: '3.0', date: '2026-02-10', author: 'Dr Anita Patel', summary: 'Major revision — restructured for NHMRC 2023 National Statement requirements.', current: true }],
            related_learning: [{ title: 'Clinical Trial Ethics', type: 'Course', estimated_time: '2 hrs', kc_id: 'kc-ethics' }],
          },
          {
            id: 'rl-f5', title: 'Donor Impact Report Template', description: 'Annual donor impact report template with research milestone summaries and financial transparency sections.',
            resource_type: 'template', category: 'fundraising', tags: ['Donor Relations', 'Impact Report', 'Fundraising'], jurisdiction: null,
            author: { name: 'Sophie Martin', role: 'Events & Fundraising Coordinator' }, source: 'org', status: 'approved', ai_assisted: false,
            file_type: 'DOCX', file_size: '55 KB', last_updated: '2026-01-30', review_due: '2026-07-30',
            version: '2.1', page_count: 12,
            purpose: 'Helps produce compelling, transparent donor impact reports that demonstrate how contributions advance FSHD research.',
            when_to_use: ['When preparing annual donor reports', 'For major donor stewardship communications', 'As part of grant acquittal reporting'],
            linked_categories: ['Fundraising'],
            compliance_flags: [{ type: 'info', message: 'Includes financial transparency requirements under Australian Charities and Not-for-profits Commission reporting standards.' }],
            key_clauses: [
              { name: 'Research Milestones', description: 'Summary of key research milestones achieved with funding impact narrative.', clause_ref: 'Section 2' },
              { name: 'Financial Summary', description: 'Income and expenditure summary with allocation breakdown by program.', clause_ref: 'Section 4' },
            ],
            sections: [{ number: '1', title: 'Message from the CEO' }, { number: '2', title: 'Research Progress' }, { number: '3', title: 'Patient Stories' }, { number: '4', title: 'Financial Summary' }, { number: '5', title: 'Looking Ahead' }],
            versions: [{ number: '2.1', date: '2026-01-30', author: 'Sophie Martin', summary: 'Added patient story section and updated financial template.', current: true }],
            related_learning: [{ title: 'Effective Donor Stewardship', type: 'Guide', estimated_time: '1 hr', kc_id: 'kc-donor' }],
          },
          {
            id: 'rl-f6', title: 'Whistleblower Policy Template', description: 'Whistleblower protection policy template compliant with Corporations Act 2001 Part 9.4AAA for charities.',
            resource_type: 'policy', category: 'compliance', tags: ['Whistleblower', 'Policy', 'Compliance'], jurisdiction: 'Australia',
            author: { name: 'David Morrison', role: 'NFP Governance Consultant' }, source: 'ethika', status: 'approved', ai_assisted: false,
            file_type: 'PDF', file_size: '28 KB', last_updated: '2026-02-05', review_due: '2027-02-05',
            version: '1.2', page_count: 10,
            purpose: 'Provides a compliant whistleblower policy template tailored for not-for-profit organisations.',
            when_to_use: ['When establishing or updating the organisation\'s whistleblower policy', 'During annual policy review cycles', 'As part of ACNC governance standard compliance'],
            linked_categories: ['Compliance', 'Governance'],
            compliance_flags: [{ type: 'info', message: 'Compliant with Part 9.4AAA of the Corporations Act 2001.' }],
            key_clauses: [
              { name: 'Eligible Disclosers', description: 'Defines who qualifies under the whistleblower protections — employees, volunteers, contractors, and their relatives.', clause_ref: 'Section 3' },
              { name: 'Protection from Detriment', description: 'Protections against victimisation, threats, and other detrimental conduct.', clause_ref: 'Section 6' },
            ],
            sections: [{ number: '1', title: 'Purpose' }, { number: '2', title: 'Scope' }, { number: '3', title: 'Eligible Disclosers' }, { number: '4', title: 'Qualifying Disclosures' }, { number: '5', title: 'How to Disclose' }, { number: '6', title: 'Protections' }],
            versions: [{ number: '1.2', date: '2026-02-05', author: 'David Morrison', summary: 'Updated for ACNC guidance on NFP-specific provisions.', current: true }],
            related_learning: [{ title: 'NFP Compliance Essentials', type: 'Learning Module', estimated_time: '1.5 hrs', kc_id: 'kc-nfp-compliance' }],
          },
        ],
      },

      // ── Talent ──────────────────────────────────────────────
      talent: {
        practiceAreas: ['Research', 'Fundraising', 'Advocacy', 'Operations', 'Biotech', 'Governance'],
        professionals: [
          { id: 1, name: 'Dr Sarah Chen', initials: 'SC', color: 'bg-violet-100 text-violet-700', title: 'Gene Therapy Researcher', experience: '15+ years', tags: ['Gene Therapy', 'DUX4', 'Clinical Trials', 'Molecular Biology', 'FSHD'], location: 'Sydney, NSW', availability: 'Available now', availType: 'Immediately', rating: 4.9, hires: 12, seniority: 'Senior', practiceAreas: ['Research', 'Biotech'] },
          { id: 2, name: 'Prof Michael Turner', initials: 'MT', color: 'bg-brand-100 text-brand-700', title: 'Muscle Regeneration Specialist', experience: '20+ years', tags: ['Muscle Biology', 'Stem Cells', 'Regenerative Medicine', 'FSHD', 'Biomarkers'], location: 'Melbourne, VIC', availability: 'Available now', availType: 'Immediately', rating: 5.0, hires: 8, seniority: 'Executive', practiceAreas: ['Research'] },
          { id: 3, name: 'Rebecca Liu', initials: 'RL', color: 'bg-teal-100 text-teal-700', title: 'Grant & Partnerships Manager', experience: '8+ years', tags: ['Grant Writing', 'NHMRC', 'NIH', 'Research Funding', 'Partnerships'], location: 'Sydney, NSW', availability: '1–2 weeks', availType: '1–2 weeks', rating: 4.7, hires: 24, seniority: 'Mid', practiceAreas: ['Fundraising', 'Operations'] },
          { id: 4, name: 'James Whitfield', initials: 'JW', color: 'bg-amber-100 text-amber-700', title: 'Patient Advocacy Lead', experience: '10+ years', tags: ['Patient Advocacy', 'Rare Disease', 'Policy', 'Community Engagement', 'FSHD'], location: 'Brisbane, QLD', availability: 'Available now', availType: 'Immediately', rating: 4.8, hires: 15, seniority: 'Senior', practiceAreas: ['Advocacy'] },
          { id: 5, name: 'Dr Anita Patel', initials: 'AP', color: 'bg-rose-100 text-rose-700', title: 'Clinical Trial Coordinator', experience: '7+ years', tags: ['Clinical Trials', 'Regulatory', 'TGA', 'Ethics', 'Phase II'], location: 'Sydney, NSW', availability: 'Available now', availType: 'Immediately', rating: 4.6, hires: 10, seniority: 'Senior', practiceAreas: ['Research', 'Biotech'] },
          { id: 6, name: 'Sophie Martin', initials: 'SM', color: 'bg-slate-100 text-slate-700', title: 'Events & Fundraising Coordinator', experience: '5+ years', tags: ['Events', 'Fundraising', 'Sponsorship', 'Donor Relations', 'Marketing'], location: 'Sydney, NSW', availability: '1–2 weeks', availType: '1–2 weeks', rating: 4.5, hires: 18, seniority: 'Mid', practiceAreas: ['Fundraising', 'Operations'] },
          { id: 7, name: 'David Morrison', initials: 'DM', color: 'bg-pink-100 text-pink-700', title: 'NFP Governance Consultant', experience: '12+ years', tags: ['ACNC', 'Governance', 'Board Advisory', 'Compliance', 'NFP Law'], location: 'Melbourne, VIC', availability: 'Available now', availType: 'Immediately', rating: 4.8, hires: 32, seniority: 'Senior', practiceAreas: ['Governance', 'Operations'] },
          { id: 8, name: 'Emily Zhang', initials: 'EZ', color: 'bg-cyan-100 text-cyan-700', title: 'Research Communications Officer', experience: '3+ years', tags: ['Science Communication', 'Impact Reporting', 'Social Media', 'Donor Updates', 'Content'], location: 'Sydney, NSW', availability: 'Available now', availType: 'Immediately', rating: 4.4, hires: 6, seniority: 'Junior', practiceAreas: ['Advocacy', 'Fundraising'] },
        ],
        aiSummary: [
          '5 specialists are available immediately — strong coverage across research, advocacy, and governance disciplines.',
          'Dr Sarah Chen and Prof Michael Turner provide world-class FSHD research expertise for gene therapy and muscle regeneration projects.',
          'David Morrison offers deep NFP governance experience — ideal for ACNC compliance review and board advisory work.',
          'Consider expanding clinical trial coordination capacity — Dr Anita Patel is the sole TGA-experienced resource for Phase II trial.',
        ],
        aiActions: [
          { priority: 'High', title: 'Engage clinical trial backup coordinator', desc: 'Gene Therapy Phase II relies on a single coordinator. Identify backup resource to mitigate key person risk.' },
          { priority: 'High', title: 'Grant writing support needed', desc: 'International Research Consortium application due Aug 15. Rebecca Liu is available in 1–2 weeks for partnership.' },
          { priority: 'Medium', title: 'Board governance review support', desc: 'ACNC governance self-assessment due Jun 30. David Morrison is available immediately for advisory engagement.' },
          { priority: 'Low', title: 'Expand fundraising event capacity', desc: 'Chocolate Ball and Muscles for Muscles overlap in Q2. Consider engaging Sophie Martin early for event support.' },
        ],
        aiRecommendations: [
          { label: 'Engage Dr Anita Patel backup for Phase II trial coordination', due: 'Mar 15' },
          { label: 'Brief Rebecca Liu on consortium grant application', due: 'Mar 31' },
          { label: 'Schedule David Morrison for governance review', due: 'Apr 30' },
          { label: 'Quarterly talent and capability review', due: 'Jun 30' },
        ],
      },

      // ── Learn ───────────────────────────────────────────────
      learn: {
        cpdSummary: { hoursCompleted: 10, hoursRequired: 16, hoursRemaining: 6, periodEnd: '30 Jun 2026', categoriesComplete: 2, categoriesTotal: 4, upcomingHours: 8, upcomingCount: 3 },
        focusAreas: [
          { id: 1, label: 'ACNC Governance Standards', progress: 75, description: 'Understanding and implementing the ACNC governance standards for registered charities.' },
          { id: 2, label: 'Fundraising Ethics & Regulation', progress: 50, description: 'Compliance with state and territory fundraising legislation and ethical fundraising standards.' },
          { id: 3, label: 'Clinical Trial Regulations', progress: 30, description: 'TGA requirements, HREC processes, and Good Clinical Practice for research-focused NFPs.' },
        ],
        completedAreas: [
          { id: 4, label: 'NFP Financial Reporting Standards', completedDate: '20 Jan 2026', hours: 3, cpdPoints: 3, category: 'Financial Reporting', categories: ['Financial Reporting'], regimes: ['acnc'], badge: 'Certified', description: 'Overview of financial reporting standards specific to not-for-profit entities including AASB 1060, grant acquittal requirements, and ACNC annual information statement obligations.' },
          { id: 5, label: 'Privacy Act for Charities', completedDate: '10 Dec 2025', hours: 2, cpdPoints: 2, category: 'Governance & Compliance', categories: ['Governance & Compliance'], regimes: ['acnc'], badge: 'Complete', description: 'Practical guidance on Privacy Act compliance for charities and NFPs including donor data management, volunteer records, and fundraising platform privacy obligations.' },
          { id: 6, label: 'Workplace Health & Safety for NFPs', completedDate: '15 Nov 2025', hours: 2.5, cpdPoints: 2.5, category: 'Governance & Compliance', categories: ['Governance & Compliance'], regimes: ['acnc'], badge: 'Complete', description: 'WHS obligations for NFP boards and management covering volunteer safety, event risk management, and duty of care in community service delivery.' },
          { id: 7, label: 'DGR Endorsement & Tax Concessions', completedDate: '01 Oct 2025', hours: 3, cpdPoints: 3, category: 'Financial Reporting', categories: ['Financial Reporting'], regimes: ['acnc'], badge: 'Certified', description: 'Detailed training on obtaining and maintaining DGR endorsement, GST concessions, FBT exemptions, and income tax exemptions available to eligible NFP organisations.' },
        ],
        skillsGaps: [
          { skill: 'Clinical Trial Good Practice (GCP)', importance: 'Critical', currentLevel: 'Beginner', targetLevel: 'Proficient', gap: 75 },
          { skill: 'ACNC External Conduct Standards', importance: 'High', currentLevel: 'Intermediate', targetLevel: 'Advanced', gap: 40 },
          { skill: 'Biotech Investment Governance', importance: 'High', currentLevel: 'Beginner', targetLevel: 'Intermediate', gap: 60 },
          { skill: 'Data Protection for Patient Registries', importance: 'Medium', currentLevel: 'Intermediate', targetLevel: 'Proficient', gap: 30 },
        ],
        upcomingWorkshops: [
          { id: 1, title: 'ACNC Governance Standards — Deep Dive', month: 'MAR', day: '10', year: '2026', time: '10:00 AM – 1:00 PM', location: 'Online', provider: 'ACNC', type: 'Webinar', cpdHours: 3, cpdPoints: 3, category: 'Governance & Compliance', categories: ['Governance & Compliance'], regimes: ['acnc'], isEthika: false, status: 'Booked', description: 'In-depth exploration of ACNC Governance Standards covering responsible person duties, managing conflicts of interest, financial oversight, and external conduct standards for charities.', externalDisclaimer: 'This event is organised and managed by ACNC. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
          { id: 2, title: 'Good Clinical Practice (GCP) Training', month: 'MAR', day: '18', year: '2026', time: '9:00 AM – 4:00 PM', location: 'Sydney', provider: 'NHMRC', type: 'Workshop', cpdHours: 6, cpdPoints: 6, category: 'Research Compliance', categories: ['Research Compliance', 'Governance & Compliance'], regimes: ['acnc'], isEthika: false, status: 'Booked', description: 'Full-day GCP training covering ICH-GCP guidelines, NHMRC National Statement requirements, informed consent processes, and governance responsibilities for clinical trial oversight.', externalDisclaimer: 'This event is organised and managed by NHMRC. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
          { id: 3, title: 'Fundraising Regulation Masterclass', month: 'APR', day: '08', year: '2026', time: '2:00 PM – 4:00 PM', location: 'Online', provider: 'FIA', type: 'Webinar', cpdHours: 2, cpdPoints: 2, category: 'Financial Reporting', categories: ['Financial Reporting', 'Governance & Compliance'], regimes: ['acnc'], isEthika: false, status: 'Waitlisted', description: 'Masterclass on navigating Australia\'s fundraising regulatory landscape including state-based licensing, online fundraising compliance, and the new national fundraising framework.', externalDisclaimer: 'This event is organised and managed by FIA. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
        ],
        suggestedWorkshops: [
          { id: 4, title: 'Biotech Investment for NFPs — Governance Framework', month: 'APR', day: '22', year: '2026', time: '10:00 AM – 1:00 PM', location: 'Online', provider: 'AICD', type: 'Workshop', cpdHours: 3, cpdPoints: 3, category: 'Governance & Compliance', categories: ['Governance & Compliance', 'Research Compliance'], regimes: ['acnc', 'aicd'], isEthika: false, relevance: 'Addresses Biotech Investment Governance skills gap', matchScore: 95, description: 'Workshop on governance frameworks for NFPs engaging in biotech investment, covering fiduciary duties, risk appetite setting, and managing commercial ventures alongside charitable purposes.', externalDisclaimer: 'This event is organised and managed by AICD. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
          { id: 5, title: 'Patient Registry Data Protection', month: 'MAY', day: '06', year: '2026', time: '1:00 PM – 3:00 PM', location: 'Online', provider: 'OAIC', type: 'Seminar', cpdHours: 2, cpdPoints: 2, category: 'Governance & Compliance', categories: ['Governance & Compliance'], regimes: ['acnc'], isEthika: false, relevance: 'Directly supports Cure FSHD Registry data governance', matchScore: 92, description: 'Seminar on data protection requirements for patient registries including consent management, de-identification standards, and cross-border data sharing for medical research.', externalDisclaimer: 'This event is organised and managed by OAIC. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
          { id: 6, title: 'ACNC External Conduct Standards Workshop', month: 'MAY', day: '13', year: '2026', time: '10:00 AM – 12:00 PM', location: 'Online', provider: 'ACNC', type: 'Workshop', cpdHours: 2, cpdPoints: 2, category: 'Governance & Compliance', categories: ['Governance & Compliance'], regimes: ['acnc'], isEthika: false, relevance: 'Addresses external conduct standards gap for international grants', matchScore: 90, description: 'Practical workshop on meeting ACNC External Conduct Standards for charities operating or sending funds overseas, including due diligence and monitoring requirements.', externalDisclaimer: 'This event is organised and managed by ACNC. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
          { id: 7, title: 'NFP Board Effectiveness Program', month: 'JUN', day: '03', year: '2026', time: '9:00 AM – 4:00 PM', location: 'Sydney', provider: 'AICD', type: 'Intensive', cpdHours: 4, cpdPoints: 4, category: 'Governance & Compliance', categories: ['Governance & Compliance'], regimes: ['aicd', 'acnc'], isEthika: false, relevance: 'Strengthens overall board governance capability', matchScore: 85, description: 'Intensive program designed to strengthen NFP board effectiveness covering strategic planning, stakeholder engagement, performance evaluation, and succession planning.', externalDisclaimer: 'This event is organised and managed by AICD. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
        ],
        aiSummary: [
          'You have completed 10 of 16 professional development points (63%) with 4 months remaining — on track for Jun 30 deadline.',
          'NFP Financial Reporting and DGR categories are complete. Focus remaining points on Governance (3 pts needed) and Research Compliance (3 pts needed).',
          'Your highest-priority skills gap is Clinical Trial Good Practice (Critical). The booked NHMRC GCP training directly addresses this with 6 CPD points.',
          'Biotech Investment Governance gap is increasingly relevant with Facio BioTherapies investment round — the AICD workshop is a strong match.',
        ],
        aiActions: [
          { priority: 'High', title: 'Attend GCP training on Mar 18', desc: 'Directly addresses your highest skills gap (Clinical Trial Good Practice) and provides 6 CPD points.' },
          { priority: 'High', title: 'Enrol in Biotech Investment workshop', desc: 'Addresses Biotech Investment Governance gap (95% match). Critical with Facio investment round in progress.' },
          { priority: 'Medium', title: 'Complete ACNC Governance deep dive', desc: 'ACNC Governance Standards focus area at 75%. Booked webinar on Mar 10 will bring this to completion.' },
          { priority: 'Low', title: 'Log FIA conference attendance', desc: 'You attended the Feb 5 Fundraising Institute session — 2 CPD points not yet recorded.' },
        ],
        learningGoals: [
          { label: 'Complete professional development requirements', due: 'Jun 30' },
          { label: 'Attend GCP training for clinical trial governance', due: 'Mar 18' },
          { label: 'Enrol in Biotech Investment workshop', due: 'Apr 15' },
          { label: 'Complete fundraising regulation masterclass', due: 'Apr 30' },
        ],
        activeJourney: {
          name: 'NFP Governance & Research Compliance Pathway',
          timeline: '12 months',
          description: 'A curated guide to strengthening your NFP governance and research compliance knowledge. Work through these recommended items at your own pace.',
          elements: [
            { id: 'e1', title: 'ACNC Governance Standards Certification', description: 'Certification covering Australian Charities and Not-for-profits Commission governance standards.' },
            { id: 'e2', title: 'Read: ACNC Governance for Purpose Guide', description: 'Review the ACNC guide on governance standards for charities and NFPs.' },
            { id: 'e3', title: 'Review current board governance practices', description: 'Audit current board processes against ACNC governance standards and identify improvement areas.' },
            { id: 'e4', title: 'Clinical Trial GCP Training', description: 'Good Clinical Practice training for research governance oversight.' },
            { id: 'e5', title: 'Observe ethics committee review with senior director', description: 'Attend a Human Research Ethics Committee meeting. Note decision-making frameworks and ethical considerations.' },
            { id: 'e6', title: 'Fundraising Ethics & Compliance Course', description: 'Course covering state-by-state fundraising compliance and ethical fundraising practices.' },
          ],
        },
        knowledgeItems: [
          { id: 'k1', type: 'regulatory', title: 'ACNC Governance Standards — 2026 Update', snippet: 'Updated requirements for NFP governance compliance including new reporting obligations and board accountability measures.', source: 'Ethika Insights', readTime: '5 min read', isNew: true },
          { id: 'k2', type: 'insight', title: 'Clinical Trial Governance: GCP Best Practices', snippet: 'Practical guide to good clinical practice compliance for research foundations and their governance teams.', source: 'Ethika Academy', readTime: '6 min read', isNew: true },
          { id: 'k3', type: 'thought-leadership', title: 'Fundraising Ethics in the Digital Age', snippet: 'How leading foundations are navigating donor privacy, digital fundraising compliance, and ethical investment.', source: 'ACNC', readTime: '7 min read', isNew: false },
          { id: 'k4', type: 'community', title: 'Peer Discussion: NFP Board Effectiveness', snippet: 'Key takeaways from the roundtable on improving board engagement and governance outcomes in research foundations.', source: 'Community', readTime: '3 min read', isNew: false },
        ],
        practicalResources: [
          { id: 'r1', title: 'ACNC Compliance Checklist', description: 'Annual governance compliance checklist aligned to ACNC standards.', type: 'Checklist' },
          { id: 'r2', title: 'Clinical Trial Governance Framework', description: 'Framework for research governance oversight and ethics approvals.', type: 'Framework' },
          { id: 'r3', title: 'Fundraising Compliance Playbook', description: 'State-by-state fundraising registration and compliance guide.', type: 'Playbook' },
          { id: 'r4', title: 'Board Paper Template', description: 'Standard template for NFP board meeting papers and resolutions.', type: 'Template' },
          { id: 'r5', title: 'Donor Privacy Policy Template', description: 'Model privacy policy for donor data collection and use.', type: 'Template' },
          { id: 'r6', title: 'CPD Activity Log', description: 'Record template for tracking professional development activities.', type: 'Template' },
        ],
        skillsProfile: {
          overallScore: 55,
          lastAssessedDate: 'Feb 2026',
          skills: [
            { id: 'sk1', label: 'ACNC Governance Standards', category: 'mandatory', level: 'Intermediate', targetLevel: 'Advanced', dots: 3, source: 'ACNC · AICD', status: 'Developing', description: 'Understanding and implementing ACNC governance standards for registered charities and NFP organisations.', lastActivity: 'Feb 2026' },
            { id: 'sk2', label: 'NFP Financial Reporting', category: 'mandatory', level: 'Advanced', targetLevel: 'Advanced', dots: 4, source: 'ACNC', status: 'Proficient', description: 'Financial reporting standards for NFPs including AASB 1060, grant acquittal, and ACNC annual information statements.', lastActivity: 'Jan 2026' },
            { id: 'sk3', label: 'DGR & Tax Concessions', category: 'mandatory', level: 'Advanced', targetLevel: 'Advanced', dots: 4, source: 'ATO · ACNC', status: 'Proficient', description: 'DGR endorsement, GST concessions, FBT exemptions, and income tax exemptions for eligible NFP organisations.', lastActivity: 'Oct 2025' },
            { id: 'sk4', label: 'Fundraising Ethics & Regulation', category: 'mandatory', level: 'Intermediate', targetLevel: 'Proficient', dots: 3, source: 'FIA · ACNC', status: 'Developing', description: 'State and territory fundraising legislation compliance and ethical fundraising standards.', lastActivity: 'Dec 2025' },
            { id: 'sk5', label: 'Privacy Act for Charities', category: 'mandatory', level: 'Intermediate', targetLevel: 'Advanced', dots: 3, source: 'OAIC', status: 'Developing', description: 'Privacy Act compliance for charities including donor data management, volunteer records, and fundraising privacy.', lastActivity: 'Dec 2025' },
            { id: 'sk6', label: 'Clinical Trial Good Practice (GCP)', category: 'personal', level: 'Beginner', targetLevel: 'Proficient', dots: 1, source: 'NHMRC', status: 'Gap', description: 'ICH-GCP guidelines, NHMRC requirements, informed consent processes, and governance for clinical trial oversight.', lastActivity: 'Sep 2025' },
            { id: 'sk7', label: 'Biotech Investment Governance', category: 'personal', level: 'Beginner', targetLevel: 'Intermediate', dots: 1, source: 'AICD', status: 'Gap', description: 'Governance frameworks for NFPs engaging in biotech investment, fiduciary duties, and managing commercial ventures.', lastActivity: 'Oct 2025' },
            { id: 'sk8', label: 'ACNC External Conduct Standards', category: 'personal', level: 'Intermediate', targetLevel: 'Advanced', dots: 2, source: 'ACNC', status: 'Developing', description: 'Meeting ACNC External Conduct Standards for charities operating or sending funds overseas.', lastActivity: 'Nov 2025' },
          ],
          milestones: [
            { date: 'Jan 2026', skillId: 'sk2', event: 'NFP Financial Reporting Standards — certified', type: 'certification', points: 3 },
            { date: 'Dec 2025', skillId: 'sk5', event: 'Privacy Act for Charities — complete', type: 'completion', points: 2 },
            { date: 'Nov 2025', skillId: 'sk4', event: 'Workplace Health & Safety for NFPs — complete', type: 'completion', points: 2.5 },
            { date: 'Oct 2025', skillId: 'sk3', event: 'DGR Endorsement & Tax Concessions — certified', type: 'certification', points: 3 },
            { date: 'Sep 2025', skillId: 'sk1', event: 'ACNC Governance Foundations — module complete', type: 'completion', points: 2 },
            { date: 'Aug 2025', skillId: 'sk8', event: 'External Conduct Standards Intro — complete', type: 'completion', points: 1.5 },
          ],
          scoreBreakdown: [
            { label: 'Scenario Assessment', weight: 40, score: 58 },
            { label: 'Course Completion', weight: 20, score: 72 },
            { label: 'Work Signals', weight: 20, score: 42 },
            { label: 'Org Config', weight: 20, score: 45 },
            { label: 'Self-Assessment', weight: 0, score: 55 },
          ],
          evidence: {
            sk1: {
              sources: [
                { signal: 'Course Completion', detail: 'ACNC Governance Foundations — Complete (70%)', weight: 'Medium' },
                { signal: 'Work Signal', detail: '3 ACNC compliance reviews completed this year', weight: 'Medium' },
              ],
              cpdBodies: ['ACNC', 'AICD'],
              recommendedAction: 'Complete ACNC Governance Advanced module to reach target level.',
            },
            sk2: {
              sources: [
                { signal: 'Course Completion', detail: 'NFP Financial Reporting Standards — Certified (92%)', weight: 'High' },
                { signal: 'Scenario Assessment', detail: 'Scored 86/100 on grant acquittal scenarios', weight: 'High' },
                { signal: 'Work Signal', detail: '4 annual information statements prepared in last 12 months', weight: 'High' },
              ],
              cpdBodies: ['ACNC'],
              recommendedAction: 'Maintain proficiency — consider presenting at NFP sector conference.',
            },
            sk3: {
              sources: [
                { signal: 'Course Completion', detail: 'DGR Endorsement & Tax Concessions — Certified (88%)', weight: 'High' },
                { signal: 'Work Signal', detail: '6 DGR compliance reviews in last 6 months', weight: 'High' },
              ],
              cpdBodies: ['ATO', 'ACNC'],
              recommendedAction: 'Maintain certification currency — next ATO review cycle Aug 2026.',
            },
            sk4: {
              sources: [
                { signal: 'Course Completion', detail: 'Fundraising Compliance Foundations — In Progress (60%)', weight: 'Medium' },
                { signal: 'Work Signal', detail: '2 state fundraising registrations managed this year', weight: 'Medium' },
              ],
              cpdBodies: ['FIA', 'ACNC'],
              recommendedAction: 'Complete Ethical Fundraising Advanced module for additional CPD.',
            },
            sk5: {
              sources: [
                { signal: 'Course Completion', detail: 'Privacy Act for Charities — Complete (75%)', weight: 'Medium' },
                { signal: 'Self-Assessment', detail: 'Self-rated intermediate on donor data management', weight: 'Low' },
              ],
              cpdBodies: ['OAIC'],
              recommendedAction: 'Enrol in Advanced Charity Privacy Masterclass (90% match).',
            },
            sk6: {
              sources: [
                { signal: 'Work Signal', detail: 'Limited engagement — no clinical trial oversight in last 12 months', weight: 'Low' },
              ],
              cpdBodies: ['NHMRC'],
              recommendedAction: 'Critical gap — enrol in GCP Fundamentals for Research Governance (Mar 2026).',
            },
            sk7: {
              sources: [
                { signal: 'Course Completion', detail: 'Biotech Investment Overview — Introductory (35%)', weight: 'Low' },
              ],
              cpdBodies: ['AICD'],
              recommendedAction: 'Growing requirement — start NFP Commercial Ventures workshop (3 CPD points).',
            },
            sk8: {
              sources: [
                { signal: 'Course Completion', detail: 'External Conduct Standards Intro — Complete (68%)', weight: 'Medium' },
                { signal: 'Work Signal', detail: '2 overseas program compliance reviews in last 6 months', weight: 'Medium' },
              ],
              cpdBodies: ['ACNC'],
              recommendedAction: 'Complete Advanced External Conduct module for additional CPD.',
            },
          },
          closeGapRecommendations: {
            sk1: {
              learning: [
                { title: 'ACNC Governance Standards Advanced', type: 'course', cpdPoints: 4, matchScore: 92, provider: 'ACNC' },
                { title: 'NFP Board Effectiveness Workshop', type: 'workshop', cpdPoints: 2.5, matchScore: 80, provider: 'AICD' },
              ],
              assessments: [
                { title: 'ACNC Governance Assessment', questions: 8, estimatedTime: '15 min' },
              ],
              events: [
                { title: 'NFP Governance Update', date: '2026-04-18', time: '9:00 AM – 11:00 AM', cpdPoints: 2, provider: 'ACNC' },
              ],
            },
            sk4: {
              learning: [
                { title: 'Ethical Fundraising Advanced', type: 'course', cpdPoints: 3.5, matchScore: 90, provider: 'FIA' },
                { title: 'State Fundraising Regulation Compliance', type: 'workshop', cpdPoints: 2, matchScore: 78, provider: 'ACNC' },
              ],
              assessments: [
                { title: 'Fundraising Compliance Assessment', questions: 6, estimatedTime: '12 min' },
              ],
              events: [
                { title: 'State Fundraising Regulation Compliance Forum', date: '2026-04-30', time: '1:00 PM – 3:00 PM', cpdPoints: 2, provider: 'FIA' },
              ],
            },
            sk5: {
              learning: [
                { title: 'Advanced Charity Privacy Masterclass', type: 'course', cpdPoints: 3.5, matchScore: 90, provider: 'OAIC' },
                { title: 'Donor Data Management Best Practices', type: 'workshop', cpdPoints: 2, matchScore: 75, provider: 'FIA' },
              ],
              assessments: [
                { title: 'Privacy for Charities Assessment', questions: 8, estimatedTime: '15 min' },
              ],
              events: [
                { title: 'Charity Privacy Obligations Seminar', date: '2026-05-07', time: '10:00 AM – 12:00 PM', cpdPoints: 2, provider: 'OAIC' },
              ],
            },
            sk6: {
              learning: [
                { title: 'GCP Fundamentals for Research Governance', type: 'course', cpdPoints: 4, matchScore: 95, provider: 'NHMRC' },
                { title: 'Clinical Trial Ethics & Oversight', type: 'workshop', cpdPoints: 2.5, matchScore: 85, provider: 'NHMRC' },
              ],
              assessments: [
                { title: 'Clinical Trial GCP Assessment', questions: 8, estimatedTime: '15 min' },
              ],
              events: [
                { title: 'ICH-GCP E6(R2) Guidelines Briefing', date: '2026-04-23', time: '9:30 AM – 12:00 PM', cpdPoints: 2.5, provider: 'NHMRC' },
                { title: 'Clinical Trial Governance Masterclass', date: '2026-05-14', time: '10:00 AM – 1:00 PM', cpdPoints: 3, provider: 'NHMRC' },
              ],
            },
            sk7: {
              learning: [
                { title: 'NFP Commercial Ventures & Biotech Investment', type: 'workshop', cpdPoints: 3, matchScore: 95, provider: 'AICD' },
                { title: 'Fiduciary Duties in Research Commercialisation', type: 'course', cpdPoints: 2.5, matchScore: 78, provider: 'ACNC' },
              ],
              assessments: [
                { title: 'Biotech Investment Governance Assessment', questions: 6, estimatedTime: '12 min' },
              ],
              events: [
                { title: 'NFP Commercial Activity Guidelines Workshop', date: '2026-05-01', time: '9:00 AM – 11:00 AM', cpdPoints: 2, provider: 'ACNC' },
                { title: 'Biotech Investment & Fiduciary Duty Forum', date: '2026-05-21', time: '1:00 PM – 3:30 PM', cpdPoints: 2.5, provider: 'AICD' },
              ],
            },
          },
          certificates: [
            { journeyName: 'NFP Financial Reporting', skillId: 'sk2', issuedDate: 'Jan 2026', capabilityScore: 92, status: 'claimed' },
            { journeyName: 'DGR & Tax Concessions', skillId: 'sk3', issuedDate: 'Oct 2025', capabilityScore: 88, status: 'claimable' },
          ],
          assessmentQuestions: {
            sk6: [
              { question: 'What does ICH-GCP stand for?', options: ['International Conference on Harmonisation — Good Clinical Practice', 'International Committee for Health — General Clinical Protocols', 'Institutional Council for Healthcare — Governance & Clinical Practice', 'International Charter for Health — Good Compliance Procedures'], correct: 0, explanation: 'ICH-GCP stands for International Conference on Harmonisation — Good Clinical Practice, the international standard for clinical trial conduct.' },
              { question: 'What is the primary purpose of informed consent in clinical trials?', options: ['To protect the sponsor from liability', 'To ensure participants understand the trial and voluntarily agree to participate', 'To satisfy regulatory paperwork requirements', 'To recruit more participants efficiently'], correct: 1, explanation: 'Informed consent ensures participants fully understand the nature, risks, and benefits of the trial and make a voluntary decision to participate.' },
              { question: 'Which body is the primary regulator of clinical trial governance in Australia?', options: ['TGA only', 'NHMRC and institutional HRECs', 'State health departments', 'The Australian Medical Association'], correct: 1, explanation: 'The NHMRC sets national ethical guidelines, and institutional Human Research Ethics Committees (HRECs) provide governance oversight for clinical trials.' },
              { question: 'What is a Serious Adverse Event (SAE) in a clinical trial?', options: ['Any minor side effect', 'An event that results in death, hospitalisation, or significant disability', 'A protocol deviation', 'A participant dropping out of the study'], correct: 1, explanation: 'An SAE is any untoward medical occurrence that results in death, life-threatening condition, hospitalisation, disability, or birth defect.' },
              { question: 'What is the role of a Data Safety Monitoring Board (DSMB)?', options: ['To manage the trial budget', 'To independently monitor patient safety and trial data integrity', 'To recruit trial participants', 'To publish trial results'], correct: 1, explanation: 'A DSMB independently monitors the progress of a clinical trial, reviews safety data, and can recommend modification or termination of the trial.' },
              { question: 'How long must clinical trial records typically be retained under Australian requirements?', options: ['5 years', '10 years', '15 years', '25 years'], correct: 2, explanation: 'Clinical trial records must generally be retained for at least 15 years after the completion or discontinuation of the trial under Australian requirements.' },
            ],
            sk7: [
              { question: 'What fiduciary duty applies when an NFP board considers biotech investment?', options: ['Duty of loyalty only', 'Duty to act in the best interests of the charity\'s purposes', 'Duty to maximise financial returns', 'No specific duties apply to NFP investments'], correct: 1, explanation: 'NFP directors must ensure any commercial venture, including biotech investment, serves the charitable purposes of the organisation.' },
              { question: 'What is the key risk when an NFP engages in commercial activities?', options: ['Increased revenue', 'Potential loss of tax-exempt status if activities are not related to charitable purpose', 'Better staff retention', 'Improved governance ratings'], correct: 1, explanation: 'NFPs risk losing their tax-exempt status if commercial activities are not sufficiently connected to their charitable purpose.' },
              { question: 'Which standard governs NFP financial reporting for commercial ventures in Australia?', options: ['IFRS 15', 'AASB 1060 (General Purpose — Simplified Disclosures)', 'US GAAP', 'There is no specific standard'], correct: 1, explanation: 'AASB 1060 provides the simplified disclosure framework for NFP financial reporting, including reporting on commercial ventures.' },
              { question: 'What governance structure is recommended for NFPs managing biotech investments?', options: ['No additional governance needed', 'A separate investment sub-committee with relevant expertise', 'Outsource all decisions to financial advisors', 'Let the CEO decide independently'], correct: 1, explanation: 'Best practice recommends a dedicated investment sub-committee with members who have relevant biotech and financial expertise.' },
              { question: 'How should an NFP manage conflicts of interest in biotech investment decisions?', options: ['Ignore conflicts as they are normal', 'Declare, record, and manage conflicts with appropriate exclusions from decision-making', 'Only address conflicts if they involve money', 'Conflicts are only relevant for for-profit companies'], correct: 1, explanation: 'NFPs must declare, record, and actively manage conflicts of interest, including excluding conflicted directors from relevant decisions.' },
              { question: 'What is the ACNC\'s role regarding NFP commercial activities?', options: ['ACNC has no oversight of commercial activities', 'ACNC monitors that commercial activities align with charitable purpose and governance standards', 'ACNC approves all investment decisions', 'ACNC only reviews financial statements'], correct: 1, explanation: 'The ACNC oversees that any commercial activities undertaken by registered charities align with their charitable purpose and meet governance standards.' },
            ],
          },
          roleProgression: {
            currentRole: 'Governance Manager',
            targetRole: 'Head of Governance',
            progress: 65,
            requiredSkills: ['sk1', 'sk2', 'sk3', 'sk4', 'sk5'],
            metSkills: ['sk1', 'sk2', 'sk4'],
          },
          complianceStatus: {
            mandatoryMet: 3,
            mandatoryTotal: 5,
            nextDeadline: 'Jun 30, 2026',
            regimeSummary: [
              { regime: 'ACNC', status: 'On Track', progress: 72 },
              { regime: 'Governance Institute', status: 'Developing', progress: 55 },
            ],
          },
          crossSpaceSignals: [
            { skillId: 'sk6', source: 'Insights', event: 'Updated TGA clinical trial guidelines released', date: 'Mar 2026' },
            { skillId: 'sk8', source: 'Comply', event: 'External conduct standards policy review due', date: 'Feb 2026' },
          ],
        },
        teamCapability: {
          teamAvgScore: 58,
          percentMeetingRequired: 60,
          totalSkillsTracked: 8,
          lastAssessmentCycle: 'Feb 2026',
          teamGaps: [
            { skillId: 'sk6', label: 'Clinical Trial GCP', membersBelow: 6, targetLevel: 'Proficient' },
            { skillId: 'sk7', label: 'Biotech Investment Governance', membersBelow: 5, targetLevel: 'Intermediate' },
            { skillId: 'sk5', label: 'Privacy Act for Health Data', membersBelow: 4, targetLevel: 'Proficient' },
          ],
          members: [
            { id: 1, name: 'Dr Lisa Chang', initials: 'LC', role: 'CEO', overallScore: 72, topGap: 'Clinical Trial GCP', lastAssessed: 'Feb 2026', skills: { sk1: 3, sk2: 4, sk3: 4, sk4: 3, sk5: 3, sk6: 1, sk7: 2, sk8: 3 }, targetRole: 'Board Director', roleProgress: 72 },
            { id: 2, name: 'Mark Henderson', initials: 'MH', role: 'Program Manager', overallScore: 65, topGap: 'Biotech Investment', lastAssessed: 'Feb 2026', skills: { sk1: 3, sk2: 3, sk3: 3, sk4: 3, sk5: 3, sk6: 1, sk7: 1, sk8: 2 }, targetRole: 'CFO', roleProgress: 65 },
            { id: 3, name: 'Dr Sarah Mitchell', initials: 'SM', role: 'Research Coordinator', overallScore: 68, topGap: 'Fundraising Ethics', lastAssessed: 'Jan 2026', skills: { sk1: 3, sk2: 3, sk3: 3, sk4: 2, sk5: 2, sk6: 3, sk7: 2, sk8: 3 }, targetRole: 'Chief Research Officer', roleProgress: 58 },
            { id: 4, name: 'Jake Williams', initials: 'JW', role: 'Finance Officer', overallScore: 60, topGap: 'ACNC Governance', lastAssessed: 'Feb 2026', skills: { sk1: 2, sk2: 4, sk3: 3, sk4: 2, sk5: 2, sk6: 1, sk7: 1, sk8: 2 }, targetRole: 'Head of Programs', roleProgress: 42 },
            { id: 5, name: 'Emma Thompson', initials: 'ET', role: 'Fundraising Manager', overallScore: 55, topGap: 'Clinical Trial GCP', lastAssessed: 'Jan 2026', skills: { sk1: 2, sk2: 2, sk3: 2, sk4: 3, sk5: 3, sk6: 1, sk7: 1, sk8: 2 }, targetRole: 'Head of Governance', roleProgress: 55 },
            { id: 6, name: 'Prof David Yeo', initials: 'DY', role: 'Board Member', overallScore: 50, topGap: 'Privacy Act', lastAssessed: 'Dec 2025', skills: { sk1: 3, sk2: 2, sk3: 3, sk4: 1, sk5: 1, sk6: 2, sk7: 2, sk8: 2 }, targetRole: 'Scientific Advisory Chair', roleProgress: 78 },
            { id: 7, name: 'Nina Patel', initials: 'NP', role: 'Compliance Officer', overallScore: 62, topGap: 'Biotech Investment', lastAssessed: 'Feb 2026', skills: { sk1: 3, sk2: 3, sk3: 3, sk4: 3, sk5: 3, sk6: 1, sk7: 1, sk8: 2 }, targetRole: 'Senior Policy Advisor', roleProgress: 50 },
            { id: 8, name: 'Chris O\'Brien', initials: 'CO', role: 'Volunteer Coordinator', overallScore: 38, topGap: 'ACNC Governance', lastAssessed: 'Nov 2025', skills: { sk1: 1, sk2: 2, sk3: 2, sk4: 1, sk5: 2, sk6: 1, sk7: 1, sk8: 1 }, targetRole: 'Board Director', roleProgress: 45 },
          ],
          skillDistribution: [
            { skillId: 'sk1', label: 'ACNC Governance Standards', avgDots: 2.5, meetingTarget: 38, criticalGap: false },
            { skillId: 'sk2', label: 'NFP Financial Reporting', avgDots: 2.9, meetingTarget: 63, criticalGap: false },
            { skillId: 'sk3', label: 'DGR & Tax Concessions', avgDots: 2.9, meetingTarget: 75, criticalGap: false },
            { skillId: 'sk4', label: 'Fundraising Ethics & Regulation', avgDots: 2.3, meetingTarget: 38, criticalGap: false },
            { skillId: 'sk5', label: 'Privacy Act for Charities', avgDots: 2.4, meetingTarget: 38, criticalGap: false },
            { skillId: 'sk6', label: 'Clinical Trial Good Practice (GCP)', avgDots: 1.4, meetingTarget: 13, criticalGap: true },
            { skillId: 'sk7', label: 'Biotech Investment Governance', avgDots: 1.4, meetingTarget: 0, criticalGap: true },
            { skillId: 'sk8', label: 'ACNC External Conduct Standards', avgDots: 2.1, meetingTarget: 25, criticalGap: true },
          ],
        },
      },

      // ── Skills Settings ──────────────────────────────────────
      skillsSettings: {
        assessmentsRequired: 'required-by-role',
        assessmentSchedule: 'onboarding',
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
          { id: 'm-1',  name: 'March Board Meeting',           boardId: 'au',         dateTime: '28 Mar 2026, 9:00am',  type: 'Board',     status: 'Scheduled',   attendees: 8, minutes: 'Pending' },
          { id: 'm-2',  name: 'Audit Committee — Q1 review',   boardId: 'audit-risk', dateTime: '15 Apr 2026, 10:00am', type: 'Committee', status: 'Scheduled',   attendees: 5, minutes: 'Pending' },
          { id: 'm-3',  name: 'Risk Committee — quarterly',    boardId: 'audit-risk', dateTime: '08 Apr 2026, 2:00pm',  type: 'Committee', status: 'Scheduled',   attendees: 5, minutes: 'Pending' },
          { id: 'm-4',  name: 'Annual General Meeting',        boardId: 'au',         dateTime: '22 May 2026, 9:30am',  type: 'AGM',       status: 'Scheduled',   attendees: 0, minutes: 'Pending' },
          { id: 'm-5',  name: 'Remuneration Committee',        boardId: 'governance', dateTime: '22 Apr 2026, 11:00am', type: 'Committee', status: 'Scheduled',   attendees: 4, minutes: 'Pending' },
          { id: 'm-6',  name: 'February Board Meeting',        boardId: 'au',         dateTime: '28 Feb 2026, 9:00am',  type: 'Board',     status: 'Completed',   attendees: 8, minutes: 'Final'   },
          { id: 'm-7',  name: 'China Board — bi-monthly',      boardId: 'cn',         dateTime: '05 May 2026, 8:00am',  type: 'Board',     status: 'Scheduled',   attendees: 7, minutes: 'Pending' },
          { id: 'm-8',  name: 'Governance Committee — Q2',     boardId: 'governance', dateTime: '12 May 2026, 1:00pm',  type: 'Committee', status: 'In Progress', attendees: 5, minutes: 'Draft'   },
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
          'ACNC compliance score is 96% — fundraising licence renewals and WHS review are the primary outstanding items.',
          'DGR endorsement is current and all tax concession obligations are met — next ATO review due Sep 2026.',
          'All board members have submitted annual conflict of interest declarations — 2 new disclosures require review.',
          'Clinical trial ethics approvals are current but HREC renewal for Gene Therapy Phase II is due Apr 15.',
          'Fundraising licence compliance is at risk — NSW and VIC licences require renewal by Feb 28.',
        ],
        aiActions: [
          { priority: 'High', title: 'Renew fundraising licences', desc: 'NSW and VIC charitable fundraising licences expire Feb 28. Applications must be lodged immediately.' },
          { priority: 'High', title: 'HREC ethics renewal', desc: 'Gene Therapy Phase II HREC approval expires Apr 15. Protocol amendment application required.' },
          { priority: 'Medium', title: 'Review new conflict disclosures', desc: '2 board members have disclosed new interests — review and document management strategies.' },
          { priority: 'Low', title: 'Schedule WHS compliance review', desc: 'Workplace health and safety review due Mar 2026. Engage WHS consultant for office and event assessments.' },
        ],
        priorities: [
          { label: 'Lodge fundraising licence renewals (NSW & VIC)', urgency: 'High', due: 'Feb 28' },
          { label: 'Prepare HREC ethics renewal application', urgency: 'High', due: 'Before Apr 15' },
          { label: 'Review board conflict of interest disclosures', urgency: 'Medium', due: 'Mar 15' },
          { label: 'WHS compliance review', urgency: 'Low', due: 'Mar 31' },
        ],
        kpis: [
          { label: 'ACNC Compliance', value: '96%', delta: '+2.1%', dir: 'up', primary: true },
          { label: 'Open Items', value: '6', delta: '-2', dir: 'up' },
          { label: 'Ethics Approvals', value: '100%', delta: '0%', dir: 'flat' },
          { label: 'Incident Rate', value: '1', delta: '-1', dir: 'up' },
        ],
      },

      // ── Contracts ───────────────────────────────────────────
      contracts: {
        aiPoints: [
          '8 active agreements under management — research funding agreements, event sponsorships, and biotech investment MOU.',
          'NHMRC grant agreement for Biomarker Discovery Program requires milestone report by Mar 31 for next tranche release.',
          'Facio BioTherapies investment MOU is under review — key terms around IP ownership and milestone-based funding need board sign-off.',
          'Sydney Chocolate Ball venue agreement has a cancellation clause triggered at 60 days — final commitment needed by Apr 20.',
          'International consortium grant agreement requires compliance with ACNC external conduct standards for overseas payments.',
        ],
        aiActions: [
          { priority: 'High', title: 'NHMRC milestone report', desc: 'Biomarker Discovery Program milestone report due Mar 31. Dr Laura Issa to prepare research outcomes summary.' },
          { priority: 'High', title: 'Facio BioTherapies MOU review', desc: 'Investment MOU requires board review by Mar 25. IP ownership and milestone payment terms need clarification.' },
          { priority: 'Medium', title: 'Chocolate Ball venue confirmation', desc: 'Venue cancellation clause triggers Apr 20. Confirm final guest numbers and sponsorship commitments.' },
          { priority: 'Low', title: 'Consortium grant compliance review', desc: 'Review ACNC external conduct standards compliance for international research payments.' },
        ],
      },

      // ── Conflict ────────────────────────────────────────────
      conflict: {
        aiPoints: [
          '3 conflict of interest matters under management — 2 board member disclosures and 1 research funding relationship.',
          'Board member Bill Moss AO has disclosed a personal investment in a biotech company that may overlap with Facio BioTherapies activities.',
          'Natalie Cooney has disclosed a family member employed at a pharmaceutical company with FSHD research interests.',
          'Dr Laura Issa has a consulting relationship with a university that is also a grant applicant — managed through recusal protocol.',
          'All conflict declarations are current and documented in the governance register.',
        ],
        aiActions: [
          { priority: 'High', title: 'Review Moss biotech conflict', desc: 'Bill Moss AO biotech investment may overlap with Facio BioTherapies investment round. Board to assess and document management strategy.' },
          { priority: 'Medium', title: 'Cooney pharmaceutical disclosure', desc: 'Family member employment at pharma company noted. Ensure recusal from any related research funding decisions.' },
          { priority: 'Low', title: 'Update conflict register', desc: 'Annual conflict register update due. Ensure all board and committee members have current declarations on file.' },
        ],
      },

      // ── Risk ────────────────────────────────────────────────
      risk: {
        aiPoints: [
          '8 risks on the active register — 2 Critical, 3 High, 2 Medium, 1 Low.',
          'Funding dependency risk (Critical) — 65% of annual revenue comes from 3 major donors. Diversification strategy needed.',
          'Key person risk (Critical) — CEO Emma Weatherley and Scientific Director Dr Laura Issa hold critical institutional knowledge without documented succession plans.',
          'Clinical trial failure risk (High) — Gene Therapy Phase II trial has a 40% probability of not meeting primary endpoints.',
          'Reputational risk (High) — any adverse event in clinical trials or fundraising practices could significantly impact donor confidence.',
          'Regulatory change risk (Medium) — potential ACNC reforms and DGR eligibility changes could affect operational model.',
        ],
        aiActions: [
          { priority: 'High', title: 'Develop donor diversification strategy', desc: '65% revenue concentration in 3 donors. Board to approve diversification plan targeting 50% threshold by FY2027.' },
          { priority: 'High', title: 'Document succession plans', desc: 'CEO and Scientific Director have no documented succession plans. Board to commission succession planning exercise.' },
          { priority: 'Medium', title: 'Clinical trial risk mitigation', desc: 'Review Gene Therapy Phase II interim data and assess go/no-go criteria for continuation.' },
          { priority: 'Low', title: 'Monitor ACNC reform proposals', desc: 'Track proposed ACNC reforms and model impact on foundation operations and DGR status.' },
        ],
      },

      // ── Incident ────────────────────────────────────────────
      incident: {
        aiPoints: [
          '3 incidents logged this quarter — 1 data breach near-miss, 1 fundraising complaint, 1 clinical trial adverse event report.',
          'Patient registry data access audit revealed 2 user accounts with excessive permissions — access revoked and review completed.',
          'Donor complaint regarding frequency of solicitation communications — preference updated and apology issued.',
          'Clinical trial participant reported mild adverse event — reported to HREC within required timeframe, no protocol changes needed.',
        ],
        aiActions: [
          { priority: 'High', title: 'Registry data access review', desc: 'Complete comprehensive access audit of Cure FSHD Registry. Implement quarterly access reviews going forward.' },
          { priority: 'Medium', title: 'Review donor communication frequency', desc: 'Fundraising complaint indicates potential over-solicitation. Review communication cadence and opt-out processes.' },
          { priority: 'Low', title: 'Update adverse event procedures', desc: 'Clinical trial adverse event was handled correctly. Document learnings and update standard operating procedures.' },
        ],
      },

      // ── Audit ───────────────────────────────────────────────
      audit: {
        aiPoints: [
          'ACNC Annual Information Statement is due Mar 31 — data collection is 80% complete.',
          'FY2025 financial audit is complete with unqualified opinion — no material findings.',
          'NHMRC grant acquittal for Biomarker Study Phase I is due Apr 30 — expenditure reconciliation in progress.',
          'HREC annual ethics review for Gene Therapy Phase II due Apr 15 — progress report in preparation.',
        ],
        aiActions: [
          { priority: 'High', title: 'Complete ACNC AIS data collection', desc: 'Annual Information Statement due Mar 31. Remaining data: staff numbers, volunteer hours, and program outcomes.' },
          { priority: 'High', title: 'Prepare HREC annual review', desc: 'Ethics approval renewal requires progress report, adverse event summary, and protocol compliance statement.' },
          { priority: 'Medium', title: 'NHMRC grant acquittal preparation', desc: 'Biomarker Study Phase I acquittal due Apr 30. Reconcile expenditure against approved budget line items.' },
          { priority: 'Low', title: 'Plan FY2026 financial audit', desc: 'Engage auditor for FY2026 audit. Consider timing to align with ACNC reporting deadline.' },
        ],
        aiMissing: [
          'Staff headcount confirmation for ACNC AIS',
          'Volunteer hours log for FY2025',
          'Program outcome metrics for research pillar',
          'Updated responsible persons register',
        ],
        aiExpiring: [
          { label: 'ACNC Annual Information Statement', due: 'Mar 31, 2026' },
          { label: 'HREC Ethics Approval — Gene Therapy Phase II', due: 'Apr 15, 2026' },
          { label: 'NHMRC Grant Acquittal — Biomarker Study', due: 'Apr 30, 2026' },
          { label: 'NSW Fundraising Licence', due: 'Feb 28, 2026' },
        ],
        aiInsights: [
          'Audit trail is strong — FY2025 financial audit received unqualified opinion with no material findings.',
          'Grant acquittal rate is 95% — above sector benchmark of 88%. Maintain detailed milestone documentation.',
          'Consider implementing continuous auditing for patient registry data to strengthen data governance posture.',
          'ACNC reporting efficiency has improved — AIS completion time reduced from 6 weeks to 3 weeks with new data collection process.',
        ],
      },

      // ── Legislation ─────────────────────────────────────────
      legislation: {
        aiPoints: [
          '6 regulatory updates tracked this quarter affecting NFP governance, fundraising, and clinical research.',
          'ACNC Act 2012 amendments proposed — new external conduct standards may increase reporting obligations for overseas research grants.',
          'Charities Act 2013 review underway — potential changes to charity registration requirements and public benefit test.',
          'Therapeutic Goods Act amendments effective Jul 1 — new requirements for clinical trial notification and reporting.',
          'Privacy Act 1988 reform bill includes enhanced obligations for health data held by research organisations.',
          'State fundraising legislation harmonisation project progressing — potential single national framework by 2027.',
        ],
        aiSuggestions: [
          'Brief board on proposed ACNC external conduct standards and impact on international research funding.',
          'Review clinical trial notification procedures ahead of Jul 1 Therapeutic Goods Act amendments.',
          'Assess Privacy Act reform impact on Cure FSHD Registry data handling and participant consent processes.',
          'Monitor fundraising legislation harmonisation — potential to simplify multi-state licence compliance.',
        ],
      },

      // ── Respond ─────────────────────────────────────────────
      respond: {
        draftActions: [
          { id: 1, title: 'Draft NHMRC milestone report — Biomarker Study', status: 'Ready for review', time: '10 min ago' },
          { id: 2, title: 'Prepare board paper — Facio BioTherapies investment', status: 'In progress', time: '30 min ago' },
          { id: 3, title: 'Generate donor impact report — Q1 2026', status: 'Queued', time: '1 hr ago' },
        ],
        featuredAgents: [
          { id: 1, name: 'Grant Application Drafter', description: 'Analyses research proposals and drafts grant applications with budget justifications and ethics sections.', category: 'Research' },
          { id: 2, name: 'Board Paper Generator', description: 'Prepares board meeting papers with executive summaries, recommendations, and risk assessments.', category: 'Governance' },
          { id: 3, name: 'Donor Impact Reporter', description: 'Generates impact reports for donors with research milestone summaries and financial transparency.', category: 'Fundraising' },
        ],
      },

      // ── MatterDetail ────────────────────────────────────────
      matterDetail: {
        actors: {
          EW: { color: 'bg-brand-800 text-brand-50', name: 'Emma Weatherley' },
          LI: { color: 'bg-violet-500 text-white', name: 'Dr Laura Issa' },
          NC: { color: 'bg-teal-600 text-white', name: 'Natalie Cooney' },
          JH: { color: 'bg-orange-500 text-white', name: 'Jessica Hart' },
          BM: { color: 'bg-slate-500 text-white', name: 'Bill Moss AO' },
        },
        tasks: [
          { id: 1, task: 'Submit HREC ethics renewal application', assignee: 'LI', due: 'Apr 1', status: 'In Progress', priority: 'Critical' },
          { id: 2, task: 'Prepare research milestone report for NHMRC', assignee: 'LI', due: 'Mar 25', status: 'In Progress', priority: 'High' },
          { id: 3, task: 'Finalise sponsorship proposals for Chocolate Ball', assignee: 'JH', due: 'Mar 15', status: 'Behind', priority: 'High' },
          { id: 4, task: 'Review Facio BioTherapies due diligence materials', assignee: 'NC', due: 'Mar 20', status: 'Open', priority: 'Critical' },
          { id: 5, task: 'Draft donor impact report for Q1 2026', assignee: 'EW', due: 'Apr 10', status: 'Open', priority: 'Medium' },
          { id: 6, task: 'Coordinate Muscles for Muscles campaign launch', assignee: 'JH', due: 'Mar 28', status: 'In Progress', priority: 'Medium' },
          { id: 7, task: 'Update patient registry data governance framework', assignee: 'EW', due: 'Apr 30', status: 'Open', priority: 'Low' },
        ],
        risks: [
          { risk: 'HREC ethics approval lapse — trial suspension risk', severity: 'Critical', status: 'Open', owner: 'LI' },
          { risk: 'Sponsorship shortfall — Chocolate Ball revenue target at risk', severity: 'High', status: 'Monitored', owner: 'JH' },
          { risk: 'Facio BioTherapies investment — conflict of interest concerns', severity: 'Medium', status: 'Mitigated', owner: 'NC' },
          { risk: 'Key person dependency — CEO and Scientific Director', severity: 'High', status: 'Open', owner: 'EW' },
        ],
        documents: [
          { name: 'HREC Ethics Renewal Application', type: 'Regulatory', date: 'Feb 20', status: 'Draft' },
          { name: 'NHMRC Milestone Report — Biomarker Study', type: 'Grant', date: 'Feb 18', status: 'Under Review' },
          { name: 'Chocolate Ball Sponsorship Prospectus', type: 'Fundraising', date: 'Feb 10', status: 'Final' },
          { name: 'Facio BioTherapies Due Diligence Pack', type: 'Investment', date: 'Feb 5', status: 'Draft' },
          { name: 'Donor Impact Report Template', type: 'Reporting', date: 'Jan 25', status: 'Complete' },
        ],
        fileCompleteness: [
          { label: 'Ethics & Regulatory', pct: 85 },
          { label: 'Grant Documentation', pct: 70 },
          { label: 'Fundraising Materials', pct: 90 },
          { label: 'Financial Reports', pct: 95 },
        ],
        timeline: [
          { date: 'Feb 20', text: 'HREC ethics renewal application draft prepared — awaiting Scientific Director review', actor: 'LI' },
          { date: 'Feb 18', text: 'NHMRC milestone report compiled — v1 circulated for internal review', actor: 'LI' },
          { date: 'Feb 12', text: 'Board approved strategic plan update including Facio BioTherapies investment framework', actor: 'NC' },
          { date: 'Feb 10', text: 'Chocolate Ball sponsorship prospectus finalised and distributed to target sponsors', actor: 'JH' },
          { date: 'Feb 05', text: 'Facio BioTherapies due diligence materials received — initial review commenced', actor: 'NC' },
          { date: 'Jan 28', text: 'Q1 fundraising targets set — Muscles for Muscles campaign planning initiated', actor: 'EW' },
          { date: 'Jan 20', text: 'ACNC Annual Information Statement data collection commenced', actor: 'EW' },
        ],
        aiPoints: [
          'HREC ethics renewal is the top priority — Gene Therapy Phase II trial cannot continue without current approval.',
          'NHMRC milestone report at 70% completion — needs final research outcomes data from 2 partner institutions.',
          'Chocolate Ball sponsorship is behind at $1.8M of $2.5M target — 3 proposals outstanding with deadline pressure.',
          'Facio BioTherapies due diligence raises conflict of interest considerations for Bill Moss AO — board management protocol needed.',
          'Foundation governance posture is strong — ACNC compliance at 96% and financial audit received unqualified opinion.',
        ],
      },

    }, // end pages
  }, // end fshd

}

// ── Share Insights & Community data with migration tenant ─────────────────
configs.migration.pages.insights = configs.default.pages.insights
configs.migration.pages.community = configs.default.pages.community

// ── Blackmores (ASX-listed health/wellness — non-APRA governance team) ─────
const blackmoresBoards = [
  {
    id: 'group', name: 'Blackmores Group', type: 'Board',
    description: 'ASX-listed parent entity; oversees group strategy, capital and continuous-disclosure obligations.',
    icon: 'Building2', accent: 'brand', memberCount: 8,
    members: [
      { name: 'Margaret Chen',  initials: 'MC' },
      { name: 'James Whitfield', initials: 'JW' },
      { name: 'Caitlin Hughes', initials: 'CH' },
      { name: 'Olivia Park',    initials: 'OP' },
    ],
    cadence: 'Monthly', nextMeeting: '14 May 2026',
    tasks: 6, overdue: 1, resolutions: 3,
  },
  {
    id: 'au', name: 'Blackmores Australia Pty Ltd', type: 'Board',
    description: 'Operating subsidiary for the Australian market; TGA-regulated manufacturing and distribution.',
    icon: 'Building2', accent: 'amber', memberCount: 6,
    members: [
      { name: 'James Whitfield', initials: 'JW' },
      { name: 'Marcus Patel',    initials: 'MP' },
      { name: 'Susan Lee',       initials: 'SL' },
    ],
    cadence: 'Monthly', nextMeeting: '20 May 2026',
    tasks: 4, overdue: 0, resolutions: 2,
  },
  {
    id: 'nz', name: 'Blackmores New Zealand', type: 'Board',
    description: 'New Zealand operating subsidiary; Medsafe-regulated and Fair Trading Act compliance.',
    icon: 'Building2', accent: 'indigo', memberCount: 5,
    members: [
      { name: 'Rebecca Boyle',  initials: 'RB' },
      { name: 'Daniel Harvey',  initials: 'DH' },
    ],
    cadence: 'Bi-monthly', nextMeeting: '28 May 2026',
    tasks: 3, overdue: 0, resolutions: 1,
  },
  {
    id: 'cn', name: 'Blackmores China', type: 'Board',
    description: 'China operating subsidiary; cross-border e-commerce and SAMR/NMPA compliance.',
    icon: 'Building2', accent: 'amber', memberCount: 7,
    members: [
      { name: 'Wei Zhang',  initials: 'WZ' },
      { name: 'James Whitfield', initials: 'JW' },
    ],
    cadence: 'Bi-monthly', nextMeeting: '05 Jun 2026',
    tasks: 3, overdue: 1, resolutions: 1,
  },
  {
    id: 'kirin', name: 'Kirin Pty Ltd', type: 'Board',
    description: 'Wholly-owned Australian subsidiary; complementary medicines manufacturing arm.',
    icon: 'Building2', accent: 'slate', memberCount: 4,
    members: [
      { name: 'Marcus Patel', initials: 'MP' },
      { name: 'Caitlin Hughes', initials: 'CH' },
    ],
    cadence: 'Quarterly', nextMeeting: '12 Jun 2026',
    tasks: 2, overdue: 0, resolutions: 0,
  },
  {
    id: 'audit-risk-cmte', name: 'Audit & Risk Committee', type: 'Committee',
    description: 'ASX-listed Audit & Risk Committee — financial reporting, internal controls, enterprise risk.',
    icon: 'Users', accent: 'slate', memberCount: 4,
    cadence: 'Quarterly', nextMeeting: '08 May 2026',
    tasks: 3, overdue: 0, resolutions: 1,
  },
  {
    id: 'nom-gov-cmte', name: 'Nomination & Governance Committee', type: 'Committee',
    description: 'Board composition, succession planning, governance framework and director independence.',
    icon: 'Users', accent: 'amber', memberCount: 4,
    cadence: 'Quarterly', nextMeeting: '15 May 2026',
    tasks: 2, overdue: 0, resolutions: 0,
  },
  {
    id: 'people-rem-cmte', name: 'People & Remuneration Committee', type: 'Committee',
    description: 'Executive remuneration, incentive design, culture and people strategy.',
    icon: 'Users', accent: 'indigo', memberCount: 3,
    cadence: 'Bi-monthly', nextMeeting: '17 May 2026',
    tasks: 1, overdue: 0, resolutions: 0,
  },
]

const blackmoresPolicies = [
  // ── TGA / Product Safety ───────────────────────────────────────
  { id: 'bp-1',  name: 'Product Safety & Quality Policy (GMP)',                  owner: { name: 'Marcus Patel',   initials: 'MP' }, stage: 'Approve',  daysAtStage: 5,  rag: 'green', status: 'On Track', regulator: 'TGA' },
  { id: 'bp-2',  name: 'Adverse Event Reporting Policy (Pharmacovigilance)',     owner: { name: 'Marcus Patel',   initials: 'MP' }, stage: 'Publish',  daysAtStage: 1,  rag: 'green', status: 'On Track', regulator: 'TGA' },
  { id: 'bp-3',  name: 'Therapeutic Goods Advertising Policy',                    owner: { name: 'Susan Lee',      initials: 'SL' }, stage: 'Review',   daysAtStage: 22, rag: 'red',   status: 'Overdue', blockingParty: 'Awaiting Marketing review', regulator: 'TGA' },
  { id: 'bp-4',  name: 'Claims Substantiation Procedure',                         owner: { name: 'Susan Lee',      initials: 'SL' }, stage: 'Draft',    daysAtStage: 7,  rag: 'amber', status: 'At Risk', regulator: 'TGA' },
  { id: 'bp-5',  name: 'Product Recall Procedure',                                owner: { name: 'Marcus Patel',   initials: 'MP' }, stage: 'Publish',  daysAtStage: 2,  rag: 'green', status: 'On Track', regulator: 'TGA' },
  { id: 'bp-6',  name: 'Manufacturing Quality Assurance Policy',                  owner: { name: 'Marcus Patel',   initials: 'MP' }, stage: 'Identify', daysAtStage: 4,  rag: 'green', status: 'On Track', regulator: 'TGA' },

  // ── ASIC / ASX listed-entity ──────────────────────────────────
  { id: 'bp-7',  name: 'Continuous Disclosure Policy',                            owner: { name: 'Daniel Harvey',  initials: 'DH' }, stage: 'Approve',  daysAtStage: 6,  rag: 'amber', status: 'At Risk', blockingParty: 'Awaiting Audit & Risk Committee', regulator: 'ASX' },
  { id: 'bp-8',  name: 'Securities Trading Policy',                               owner: { name: 'Olivia Park',    initials: 'OP' }, stage: 'Review',   daysAtStage: 8,  rag: 'green', status: 'On Track', regulator: 'ASX' },
  { id: 'bp-9',  name: 'Director Independence Policy',                            owner: { name: 'Olivia Park',    initials: 'OP' }, stage: 'Identify', daysAtStage: 3,  rag: 'green', status: 'On Track', regulator: 'ASIC' },
  { id: 'bp-10', name: 'Board Charter',                                            owner: { name: 'Olivia Park',    initials: 'OP' }, stage: 'Approve',  daysAtStage: 12, rag: 'amber', status: 'At Risk', blockingParty: 'Awaiting Chair sign-off', regulator: 'ASIC' },
  { id: 'bp-11', name: 'Audit & Risk Committee Charter',                           owner: { name: 'Daniel Harvey',  initials: 'DH' }, stage: 'Publish',  daysAtStage: 1,  rag: 'green', status: 'On Track', regulator: 'ASIC' },
  { id: 'bp-12', name: 'People & Remuneration Committee Charter',                  owner: { name: 'Daniel Harvey',  initials: 'DH' }, stage: 'Review',   daysAtStage: 4,  rag: 'green', status: 'On Track', regulator: 'ASIC' },

  // ── ACCC / Consumer Law ────────────────────────────────────────
  { id: 'bp-13', name: 'Marketing & Advertising Compliance Policy',               owner: { name: 'Susan Lee',      initials: 'SL' }, stage: 'Review',   daysAtStage: 5,  rag: 'amber', status: 'At Risk', regulator: 'ACCC' },
  { id: 'bp-14', name: 'Competition Law Compliance Policy',                       owner: { name: 'Daniel Harvey',  initials: 'DH' }, stage: 'Publish',  daysAtStage: 2,  rag: 'green', status: 'On Track', regulator: 'ACCC' },
  { id: 'bp-15', name: 'Consumer Guarantees Policy',                              owner: { name: 'Susan Lee',      initials: 'SL' }, stage: 'Identify', daysAtStage: 6,  rag: 'green', status: 'On Track', regulator: 'ACCC' },

  // ── OAIC / Privacy ─────────────────────────────────────────────
  { id: 'bp-16', name: 'Privacy Policy',                                          owner: { name: 'Daniel Harvey',  initials: 'DH' }, stage: 'Approve',  daysAtStage: 9,  rag: 'amber', status: 'At Risk', regulator: 'OAIC' },
  { id: 'bp-17', name: 'Notifiable Data Breach Response Plan',                    owner: { name: 'Robert McKean',  initials: 'RM' }, stage: 'Review',   daysAtStage: 5,  rag: 'green', status: 'On Track', regulator: 'OAIC' },
  { id: 'bp-18', name: 'Customer Data Handling Standards',                        owner: { name: 'Robert McKean',  initials: 'RM' }, stage: 'Draft',    daysAtStage: 4,  rag: 'green', status: 'On Track', regulator: 'OAIC' },

  // ── Risk ───────────────────────────────────────────────────────
  { id: 'bp-19', name: 'Risk Management Framework',                               owner: { name: 'Priya Lakshman', initials: 'PL' }, stage: 'Publish',  daysAtStage: 1,  rag: 'green', status: 'On Track', regulator: 'Internal' },
  { id: 'bp-20', name: 'Risk Appetite Statement',                                 owner: { name: 'Priya Lakshman', initials: 'PL' }, stage: 'Approve',  daysAtStage: 7,  rag: 'amber', status: 'At Risk', blockingParty: 'Awaiting Audit & Risk Committee', regulator: 'Internal' },
  { id: 'bp-21', name: 'Business Continuity Plan',                                owner: { name: 'Priya Lakshman', initials: 'PL' }, stage: 'Review',   daysAtStage: 6,  rag: 'green', status: 'On Track', regulator: 'Internal' },
  { id: 'bp-22', name: 'Cyber Security Policy',                                   owner: { name: 'Robert McKean',  initials: 'RM' }, stage: 'Review',   daysAtStage: 11, rag: 'amber', status: 'At Risk', regulator: 'Internal' },

  // ── ESG / Modern Slavery / Climate ─────────────────────────────
  { id: 'bp-23', name: 'Modern Slavery Policy',                                   owner: { name: 'Rebecca Boyle',  initials: 'RB' }, stage: 'Review',   daysAtStage: 8,  rag: 'green', status: 'On Track', regulator: 'Modern Slavery' },
  { id: 'bp-24', name: 'Supplier Code of Conduct',                                owner: { name: 'Rebecca Boyle',  initials: 'RB' }, stage: 'Publish',  daysAtStage: 2,  rag: 'green', status: 'On Track', regulator: 'Modern Slavery' },
  { id: 'bp-25', name: 'Climate-Related Financial Disclosure Policy (AASB S2)',   owner: { name: 'Rebecca Boyle',  initials: 'RB' }, stage: 'Draft',    daysAtStage: 14, rag: 'amber', status: 'At Risk', regulator: 'AASB' },

  // ── Internal ───────────────────────────────────────────────────
  { id: 'bp-26', name: 'Code of Conduct',                                         owner: { name: 'Olivia Park',    initials: 'OP' }, stage: 'Approve',  daysAtStage: 3,  rag: 'green', status: 'On Track', regulator: 'Internal' },
  { id: 'bp-27', name: 'Whistleblower Policy',                                    owner: { name: 'Daniel Harvey',  initials: 'DH' }, stage: 'Publish',  daysAtStage: 1,  rag: 'green', status: 'On Track', regulator: 'Internal' },
  { id: 'bp-28', name: 'Anti-Bribery & Corruption Policy',                        owner: { name: 'Daniel Harvey',  initials: 'DH' }, stage: 'Draft',    daysAtStage: 5,  rag: 'green', status: 'On Track', regulator: 'Internal' },
]

const blackmoresGovern = {
  activeBoardId: 'all',
  aiPoints: [
    'AASB S2 climate-disclosure readiness is the active strategic risk for FY27 — framework draft due to Audit & Risk Committee in 4 weeks.',
    'TGA Therapeutic Goods Advertising Policy is overdue for refresh — 4 marketing campaigns flagged for compliance review.',
    'Continuous disclosure obligations are on track — 6 ASX announcements lodged this quarter.',
    'Modern Slavery Statement preparation for FY27 starting; Tier 1 supplier survey returns due 30 June.',
  ],
  aiActions: [
    { priority: 'High',   title: 'Approve Climate-Related Financial Disclosure framework', desc: 'AASB S2 readiness checkpoint due before the May Group Board meeting.' },
    { priority: 'High',   title: 'Finalise TGA advertising claims register',                desc: 'Outstanding regulator queries on 4 product claims; legal sign-off pending.' },
    { priority: 'Medium', title: 'Refresh Continuous Disclosure Policy',                    desc: 'Last reviewed 2024; align with ASIC RG 198 update.' },
    { priority: 'Low',    title: 'Schedule annual risk-appetite review',                    desc: 'Audit & Risk Committee charter requires annual sign-off.' },
  ],
  priorities: [
    { label: 'Continuous Disclosure Policy refresh',          urgency: 'High',   due: 'Due 02 May' },
    { label: 'AASB S2 readiness checkpoint',                  urgency: 'High',   due: 'Due 12 May' },
    { label: 'TGA advertising compliance audit',              urgency: 'Medium', due: 'Due 09 May' },
    { label: 'Modern Slavery statement FY27 sign-off',        urgency: 'Medium', due: 'Due 14 May' },
    { label: 'Board skills matrix refresh',                   urgency: 'Low',    due: 'Due 30 May' },
  ],
  kpis: [
    { label: 'ASX/ASIC Compliance Score', value: '92%', delta: '+2%', dir: 'up',   primary: true },
    { label: 'Upcoming Meetings',          value: '4',   delta: '+1',  dir: 'up'    },
    { label: 'Policies On Track',          value: '84%', delta: '+5%', dir: 'up'    },
    { label: 'Open Actions',               value: '9',   delta: '-2',  dir: 'down', invert: true },
  ],
  boards: blackmoresBoards,
  currentUserBoardIds: blackmoresBoards.map(b => b.id),
  boardsCommittees: [
    { id: 'group',           name: 'Blackmores Group',                  type: 'Board',     jurisdiction: 'Australia',    memberCount: 8, nextMeeting: '14 May 2026', health: 'green' },
    { id: 'au',              name: 'Blackmores Australia Pty Ltd',      type: 'Board',     jurisdiction: 'Australia',    memberCount: 6, nextMeeting: '20 May 2026', health: 'green' },
    { id: 'nz',              name: 'Blackmores New Zealand',            type: 'Board',     jurisdiction: 'New Zealand',  memberCount: 5, nextMeeting: '28 May 2026', health: 'green' },
    { id: 'cn',              name: 'Blackmores China',                  type: 'Board',     jurisdiction: 'China',         memberCount: 7, nextMeeting: '05 Jun 2026', health: 'amber' },
    { id: 'kirin',           name: 'Kirin Pty Ltd',                     type: 'Board',     jurisdiction: 'Australia',    memberCount: 4, nextMeeting: '12 Jun 2026', health: 'green' },
    { id: 'audit-risk-cmte', name: 'Audit & Risk Committee',            type: 'Committee', jurisdiction: 'Group',         memberCount: 4, nextMeeting: '08 May 2026', health: 'amber' },
    { id: 'nom-gov-cmte',    name: 'Nomination & Governance Committee', type: 'Committee', jurisdiction: 'Group',         memberCount: 4, nextMeeting: '15 May 2026', health: 'green' },
    { id: 'people-rem-cmte', name: 'People & Remuneration Committee',   type: 'Committee', jurisdiction: 'Group',         memberCount: 3, nextMeeting: '17 May 2026', health: 'green' },
  ],
  policies: blackmoresPolicies,
  annualWorkProgram: [
    { id: 'cd-policy',       name: 'Continuous Disclosure Policy review',              regulator: 'ASX',  months: [4] },
    { id: 'aasb-s2',         name: 'Climate-Related Financial Disclosure (AASB S2)',   regulator: 'AASB', months: [5, 11] },
    { id: 'tga-pv',          name: 'TGA Pharmacovigilance Annual Review',              regulator: 'TGA',  months: [6] },
    { id: 'mod-slavery',     name: 'Modern Slavery Statement Sign-off',                regulator: 'AGD',  months: [9] },
    { id: 'agm',             name: 'Annual General Meeting',                                              months: [11] },
    { id: 'audit-plan',      name: 'Annual Internal Audit Plan',                       regulator: 'ASX',  months: [3] },
    { id: 'remuneration',    name: 'Remuneration Report Sign-off',                     regulator: 'ASIC', months: [9] },
  ],
}

const blackmoresWork = {
  description: 'Governance workstreams across Blackmores Group — policy uplift, disclosure obligations, and regulatory readiness.',
  overviewSub: total => `Distribution across ${total} active governance workflows`,
  performance: [
    { label: 'Task Quality',       value: '95%',   bar: 95, onTarget: true,  note: 'target 95%'  },
    { label: 'Milestone Delivery', value: '90%',   bar: 90, onTarget: false, note: 'target 100%' },
    { label: 'Avg Response',       value: '3.6h',  bar: 65, onTarget: true,  note: '−0.2h'       },
    { label: 'Avg Cycle Time',     value: '14d',   bar: 70, onTarget: true,  note: 'on target'   },
    { label: 'Team Capacity',      value: '82%',   bar: 82, onTarget: false, note: 'of 100%'     },
  ],
  workMatters: [
    { id: 1,  name: 'Therapeutic Goods Advertising Policy uplift',  ref: 'GOV-2401', client: 'Marketing',              practice: 'Policy',     status: 'Behind',   priority: 'Critical', progress: 38, due: 'May 14', value: '$120K', lead: 'SL', leadColor: 'bg-brand-800 text-brand-50' },
    { id: 2,  name: 'Continuous Disclosure Policy refresh (ASX)',   ref: 'GOV-2402', client: 'Group',                  practice: 'Disclosure', status: 'Active',   priority: 'High',     progress: 62, due: 'May 02', value: '$95K',  lead: 'DH', leadColor: 'bg-teal-600 text-white' },
    { id: 3,  name: 'AASB S2 Climate Disclosure framework',         ref: 'GOV-2403', client: 'Group',                  practice: 'ESG',        status: 'Active',   priority: 'High',     progress: 24, due: 'Jun 30', value: '$240K', lead: 'RB', leadColor: 'bg-emerald-600 text-white' },
    { id: 4,  name: 'Adverse Event Reporting Policy review',         ref: 'GOV-2404', client: 'Blackmores Australia',   practice: 'Compliance', status: 'Active',   priority: 'Medium',   progress: 70, due: 'May 20', value: '$60K',  lead: 'MP', leadColor: 'bg-slate-500 text-white' },
    { id: 5,  name: 'Modern Slavery Statement FY27 preparation',     ref: 'GOV-2405', client: 'Group',                  practice: 'ESG',        status: 'Active',   priority: 'Medium',   progress: 18, due: 'Jun 30', value: '$80K',  lead: 'RB', leadColor: 'bg-emerald-600 text-white' },
    { id: 6,  name: 'Privacy Policy refresh (NDB)',                  ref: 'GOV-2406', client: 'Group',                  practice: 'Privacy',    status: 'Active',   priority: 'Medium',   progress: 55, due: 'May 30', value: '$45K',  lead: 'DH', leadColor: 'bg-teal-600 text-white' },
    { id: 7,  name: 'Cyber Security Policy framework alignment',     ref: 'GOV-2407', client: 'Group',                  practice: 'Risk',       status: 'Behind',   priority: 'High',     progress: 45, due: 'Apr 30', value: '$150K', lead: 'RM', leadColor: 'bg-violet-500 text-white' },
    { id: 8,  name: 'Board Charter annual review',                    ref: 'GOV-2408', client: 'Group',                  practice: 'Board',      status: 'On Track', priority: 'Low',      progress: 80, due: 'May 14', value: '$30K',  lead: 'OP', leadColor: 'bg-orange-500 text-white' },
    { id: 9,  name: 'Whistleblower Policy refresh',                   ref: 'GOV-2409', client: 'Group',                  practice: 'Policy',     status: 'On Track', priority: 'Low',      progress: 92, due: 'Apr 25', value: '$25K',  lead: 'DH', leadColor: 'bg-teal-600 text-white' },
    { id: 10, name: 'Securities Trading Policy refresh',              ref: 'GOV-2410', client: 'Group',                  practice: 'Disclosure', status: 'Active',   priority: 'Medium',   progress: 30, due: 'Jun 15', value: '$40K',  lead: 'OP', leadColor: 'bg-orange-500 text-white' },
  ],
  aiPoints: [
    '2 workstreams are behind schedule — Therapeutic Goods Advertising Policy uplift and Cyber Security Policy framework alignment need attention.',
    'AASB S2 Climate Disclosure framework is at 24% with a Jun 30 deadline — climate-disclosure readiness is the strategic risk for FY27.',
    'Whistleblower Policy refresh is at 92% and due 25 Apr — on track for completion this week.',
    'Open scope has grown this month; consider sequencing Modern Slavery Statement FY27 and Securities Trading Policy refresh after the May board cycle.',
  ],
  aiActions: [
    { text: 'Review delayed milestones on Therapeutic Goods Advertising Policy uplift before 14 May deadline' },
    { text: 'Schedule priority check-in with Susan Lee on TGA advertising compliance escalation' },
    { text: 'Chase outstanding actions — 2 overdue items linked to cyber security framework alignment' },
  ],
  teamWorkload: [
    { name: 'Olivia Park',     initials: 'OP', utilisation: 88, capacity: 100 },
    { name: 'Daniel Harvey',   initials: 'DH', utilisation: 76, capacity: 100 },
    { name: 'Priya Lakshman',  initials: 'PL', utilisation: 70, capacity: 100 },
    { name: 'Susan Lee',       initials: 'SL', utilisation: 92, capacity: 100 },
    { name: 'Rebecca Boyle',   initials: 'RB', utilisation: 60, capacity: 100 },
  ],
  upcomingDeadlines: [
    { id: 'wd-1', label: 'Continuous Disclosure Policy — board sign-off',  matter: 'Continuous Disclosure Policy refresh (ASX)',   month: 'MAY', day: '02', year: '2026', urgency: 'high'   },
    { id: 'wd-2', label: 'TGA advertising compliance audit',                matter: 'Therapeutic Goods Advertising Policy uplift',  month: 'MAY', day: '14', year: '2026', urgency: 'high'   },
    { id: 'wd-3', label: 'AASB S2 readiness checkpoint',                    matter: 'AASB S2 Climate Disclosure framework',         month: 'JUN', day: '30', year: '2026', urgency: 'medium' },
    { id: 'wd-4', label: 'Modern Slavery FY27 — Q4 review',                  matter: 'Modern Slavery Statement FY27 preparation',    month: 'JUN', day: '30', year: '2026', urgency: 'medium' },
    { id: 'wd-5', label: 'Whistleblower Policy — final draft',                matter: 'Whistleblower Policy refresh',                 month: 'APR', day: '25', year: '2026', urgency: 'low'    },
  ],
}

const blackmoresControl = {
  kpiActiveMatters: 'Active Workstreams',
  mattersOverview: 'Active Workstreams',
  mattersOverviewSub: '10 active governance workflows',
  firmHealth: 'Governance Operations',
  kpis: [
    { label: 'ASX/ASIC Compliance Score', value: '92%', delta: '+2%',  dir: 'up',   primary: true },
    { label: 'Active Workstreams',         value: '10', delta: '+1',   dir: 'up'   },
    { label: 'Open Board Actions',          value: '9',  delta: '-2',  dir: 'down' },
    { label: 'Policies On Track',           value: '84%', delta: '+5%', dir: 'up'  },
  ],
  matters: [
    { name: 'Therapeutic Goods Advertising Policy uplift', client: 'Marketing', type: 'Policy',     status: 'Review',  days: 38, value: '$120K', lead: 'SL' },
    { name: 'Continuous Disclosure Policy refresh',        client: 'Group',     type: 'Disclosure', status: 'Active',  days: 7,  value: '$95K',  lead: 'DH' },
    { name: 'AASB S2 Climate Disclosure framework',        client: 'Group',     type: 'ESG',        status: 'Active',  days: 24, value: '$240K', lead: 'RB' },
    { name: 'Cyber Security Policy framework alignment',   client: 'Group',     type: 'Risk',       status: 'Review',  days: 11, value: '$150K', lead: 'RM' },
    { name: 'Modern Slavery Statement FY27',               client: 'Group',     type: 'ESG',        status: 'Active',  days: 18, value: '$80K',  lead: 'RB' },
  ],
  compliance: [
    { label: 'TGA Pharmacovigilance Reports',     status: 'good',    value: '12/12',     sub: 'All current'      },
    { label: 'ASX Continuous Disclosures',         status: 'good',    value: '6/6',       sub: 'On track'         },
    { label: 'ACCC Advertising Reviews',           status: 'warning', value: '8/11',      sub: '3 outstanding'    },
    { label: 'Privacy Breach Notifications',       status: 'good',    value: '0',         sub: 'No breaches'      },
    { label: 'Modern Slavery Supplier Surveys',    status: 'neutral', value: '143/180',   sub: '37 in progress'   },
  ],
  firmHealthMetrics: [
    { label: 'Pack on-time Rate',     value: 88, target: 90, delta: '+1%', above: false },
    { label: 'Action Close-out Rate', value: 80, target: 85, delta: '-2%', above: false },
    { label: 'Policy Currency',       value: 84, target: 90, delta: '+5%', above: false },
    { label: 'Director Attendance',   value: 95, target: 90, delta: '+2%', above: true  },
  ],
  team: [
    { initials: 'OP', name: 'Olivia Park',     role: 'Head of Governance & Co Sec',  matters: 8, util: 88, level: 'high' },
    { initials: 'DH', name: 'Daniel Harvey',   role: 'General Counsel',              matters: 5, util: 76, level: 'good' },
    { initials: 'PL', name: 'Priya Lakshman',  role: 'Risk & Compliance Manager',    matters: 4, util: 70, level: 'good' },
  ],
  aiActions: [
    { priority: 'High',   title: 'Approve Climate-Related Financial Disclosure framework', desc: 'AASB S2 readiness checkpoint due before the May Group Board meeting.' },
    { priority: 'High',   title: 'Finalise TGA advertising claims register',                desc: 'Outstanding regulator queries on 4 product claims; legal sign-off pending.' },
    { priority: 'Medium', title: 'Refresh Continuous Disclosure Policy',                    desc: 'Last reviewed 2024; align with ASIC RG 198 update.' },
    { priority: 'Low',    title: 'Schedule annual risk-appetite review',                    desc: 'Audit & Risk Committee charter requires annual sign-off.' },
  ],
  importantDates: [
    { label: 'Group Board pack circulation',              month: 'MAY', day: '11', year: '2026', sub: 'Monday · Action required',  urgency: 'high'    },
    { label: 'AASB S2 readiness checkpoint',               month: 'JUN', day: '30', year: '2026', sub: 'ESG · framework due',       urgency: 'high'    },
    { label: 'TGA advertising compliance audit',           month: 'MAY', day: '14', year: '2026', sub: 'Thursday · Compliance',     urgency: 'medium'  },
    { label: 'Continuous Disclosure board sign-off',       month: 'MAY', day: '02', year: '2026', sub: 'Friday · ASX',              urgency: 'medium'  },
    { label: 'Modern Slavery Statement FY27',              month: 'JUN', day: '30', year: '2026', sub: 'Q4 · ESG',                  urgency: 'medium'  },
  ],
  upcomingEvents: [
    { title: 'Group Board Meeting — May 2026',          month: 'MAY', day: '14', year: '2026', time: '9:00 AM',  location: 'Sydney HQ'        },
    { title: 'Audit & Risk Committee — May',             month: 'MAY', day: '08', year: '2026', time: '10:00 AM', location: 'Sydney HQ'        },
    { title: 'Blackmores Australia Board — May',          month: 'MAY', day: '20', year: '2026', time: '9:30 AM',  location: 'Online (Teams)'   },
    { title: 'Blackmores China Board — Q2',               month: 'JUN', day: '05', year: '2026', time: '8:00 AM',  location: 'Shanghai'         },
    { title: 'AASB S2 readiness checkpoint',               month: 'JUN', day: '30', year: '2026', time: '2:00 PM',  location: 'Online'           },
  ],
  aiSummary: [
    'ASX/ASIC compliance score is 92% — 2 board papers outstanding for the May Group meeting and 1 overdue policy review.',
    '3 governance tasks are overdue — therapeutic goods advertising review, cyber security framework alignment and continuous disclosure policy refresh.',
    'Next Group Board meeting is in 14 days — climate-disclosure framework requires final review this week.',
    'Modern Slavery Statement preparation for FY27 starting; supplier survey returns are tracking ahead of plan.',
    'Therapeutic Goods Advertising Policy uplift is at 38% — 4 marketing campaigns flagged for compliance review before 14 May deadline.',
  ],
  priorities: [
    { label: 'Group board papers due — May 2026 meeting',           urgency: 'High',   due: 'Tue 12 May'  },
    { label: 'TGA advertising compliance audit overdue — 8 days',   urgency: 'High',   due: 'Overdue'     },
    { label: 'AASB S2 climate framework checkpoint',                  urgency: 'Medium', due: 'Due 30 Jun'  },
    { label: 'Continuous Disclosure Policy — board approval',         urgency: 'Medium', due: 'Due 02 May'  },
    { label: 'Board skills matrix refresh',                            urgency: 'Low',    due: 'Due 30 May'  },
  ],
}

const blackmoresComply = {
  kpis: [
    { label: 'ASIC Compliance Score',  value: '92%',  delta: '+2%', dir: 'up',  primary: true },
    { label: 'Active Obligations',      value: '38',  delta: '+3',  dir: 'up'   },
    { label: 'Open Incidents',          value: '4',   delta: '-1',  dir: 'down', invert: true },
    { label: 'ESG Readiness',           value: '78%', delta: '+8%', dir: 'up'   },
  ],
  aiPoints: [
    'Overall compliance score is 92% — TGA advertising review is the only flagged item this quarter.',
    'AASB S2 climate-disclosure obligations are at 78% completion — on track for FY27 readiness.',
    'Modern Slavery Act due-diligence questionnaire returns are at 79% — supplier follow-up needed.',
    'Director training completion is at 92% — 1 director has overdue cyber-resilience module.',
  ],
  aiActions: [
    { priority: 'High',   title: 'Action TGA advertising compliance audit', desc: 'Audit findings due before 14 May; 4 campaigns flagged.' },
    { priority: 'Medium', title: 'Chase outstanding supplier surveys',       desc: 'Modern Slavery Act FY27 preparation needs 37 more supplier returns.' },
    { priority: 'Low',    title: 'Refresh continuous disclosure register',   desc: 'Annual ASX RG 198 review.' },
  ],
  priorities: [
    { label: 'TGA advertising audit — 4 campaigns flagged',         urgency: 'High',   due: 'Due 14 May' },
    { label: 'AASB S2 framework draft',                              urgency: 'High',   due: 'Due 30 Jun' },
    { label: 'Modern Slavery supplier survey close-out',             urgency: 'Medium', due: 'Due 30 Jun' },
    { label: 'Continuous Disclosure register refresh',                urgency: 'Medium', due: 'Due 02 May' },
    { label: 'Privacy Act amendment training',                        urgency: 'Low',    due: 'Due 30 May' },
  ],
  obligations: {
    items: [
      { id: 'bl-ob-1',  name: 'TGA pharmacovigilance reporting',           source: 'Therapeutic Goods Act',   regulator: 'TGA',    category: 'Product Safety',  frequency: 'Ongoing',   owner: { name: 'Marcus Patel',    initials: 'MP' }, status: 'Compliant', dueDate: 'Ongoing',     evidenceCount: 12 },
      { id: 'bl-ob-2',  name: 'ASX Continuous Disclosure',                 source: 'ASX Listing Rules',       regulator: 'ASX',    category: 'Disclosure',      frequency: 'Ongoing',   owner: { name: 'Daniel Harvey',  initials: 'DH' }, status: 'Compliant', dueDate: 'Ongoing',     evidenceCount: 6  },
      { id: 'bl-ob-3',  name: 'ACCC therapeutic goods advertising',        source: 'Australian Consumer Law', regulator: 'ACCC',   category: 'Marketing',       frequency: 'Quarterly', owner: { name: 'Susan Lee',      initials: 'SL' }, status: 'At Risk',   dueDate: '14 May 2026', evidenceCount: 3  },
      { id: 'bl-ob-4',  name: 'Modern Slavery statement (FY27)',           source: 'Modern Slavery Act',      regulator: 'AGD',    category: 'ESG',             frequency: 'Annual',    owner: { name: 'Rebecca Boyle',  initials: 'RB' }, status: 'Compliant', dueDate: '30 Jun 2026', evidenceCount: 4  },
      { id: 'bl-ob-5',  name: 'AASB S2 climate-disclosure readiness',      source: 'AASB S2',                 regulator: 'AASB',   category: 'ESG',             frequency: 'Annual',    owner: { name: 'Rebecca Boyle',  initials: 'RB' }, status: 'At Risk',   dueDate: '30 Jun 2026', evidenceCount: 2  },
      { id: 'bl-ob-6',  name: 'OAIC notifiable data breach (NDB) window',  source: 'Privacy Act 1988',        regulator: 'OAIC',   category: 'Privacy',         frequency: 'Ongoing',   owner: { name: 'Robert McKean',  initials: 'RM' }, status: 'Compliant', dueDate: 'Ongoing',     evidenceCount: 5  },
      { id: 'bl-ob-7',  name: 'Director ID register maintenance',          source: 'Corporations Act',        regulator: 'ASIC',   category: 'Corporate',       frequency: 'Annual',    owner: { name: 'Olivia Park',    initials: 'OP' }, status: 'Compliant', dueDate: '30 Sep 2026', evidenceCount: 8  },
      { id: 'bl-ob-8',  name: 'Annual report governance disclosures',      source: 'ASX Listing Rules',       regulator: 'ASX',    category: 'Disclosure',      frequency: 'Annual',    owner: { name: 'Olivia Park',    initials: 'OP' }, status: 'Compliant', dueDate: '30 Sep 2026', evidenceCount: 7  },
      { id: 'bl-ob-9',  name: 'Securities trading policy attestations',    source: 'ASX Listing Rules',       regulator: 'ASX',    category: 'Disclosure',      frequency: 'Quarterly', owner: { name: 'Olivia Park',    initials: 'OP' }, status: 'Compliant', dueDate: '30 Jun 2026', evidenceCount: 4  },
      { id: 'bl-ob-10', name: 'Whistleblower policy refresh',              source: 'Internal',                regulator: 'Internal', category: 'Whistleblowing', frequency: 'Annual',    owner: { name: 'Daniel Harvey',  initials: 'DH' }, status: 'Compliant', dueDate: '30 Sep 2026', evidenceCount: 6  },
    ],
  },
}

configs.blackmores = {
  ...configs.default,
  appName: 'Blackmores',
  logo: '/blackmores-logo.svg',
  icon: '/blackmores-icon.png',
  greeting: 'Good morning, Olivia',
  user: { name: 'Olivia Park', initials: 'OP', email: 'olivia.park@blackmores.com.au' },
  pages: {
    ...configs.default.pages,
    control: {
      ...configs.default.pages.control,
      ...blackmoresControl,
    },
    govern: {
      ...configs.default.pages.govern,
      ...blackmoresGovern,
    },
    work: {
      ...configs.default.pages.work,
      ...blackmoresWork,
    },
    comply: {
      ...configs.default.pages.comply,
      ...blackmoresComply,
    },
  },
}

// ── Cooper IP (clone of default with IP-specific matters) ─────────────────
configs.cooperip = {
  ...configs.default,
  appName: 'Cooper IP',
  logo: '/cooperip-logo.png',
  icon: '/cooperip-icon.png',
  greeting: 'Good morning, James',
  pages: {
    ...configs.default.pages,
    control: {
      ...configs.default.pages.control,
      kpis: [
        { label: 'Active Filings', value: '34', delta: '+3', dir: 'up', primary: true },
        { label: 'Active Matters', value: '28', delta: '+1', dir: 'up' },
        { label: 'Pending Oppositions', value: '4', delta: '0', dir: 'flat' },
        { label: 'Revenue MTD', value: '$480K', delta: '+8%', dir: 'up' },
      ],
      mattersOverview: 'IP Portfolio Overview',
      mattersOverviewSub: '28 active across 19 clients',
      matters: [
        { name: 'Acme Corp Patent Application', client: 'Acme Corp', type: 'Patent', status: 'Active', days: 45, value: '$38K', lead: 'MC' },
        { name: 'BrandX Trademark Opposition', client: 'BrandX Pty Ltd', type: 'Trademark', status: 'Review', days: 22, value: '$24K', lead: 'WA' },
        { name: 'TechFlow Design Registration', client: 'TechFlow Industries', type: 'Design', status: 'Active', days: 14, value: '$12K', lead: 'NN' },
        { name: 'GreenLeaf Patent Prosecution', client: 'GreenLeaf Bio', type: 'Patent', status: 'Active', days: 120, value: '$52K', lead: 'MC' },
        { name: 'Pacific Brands TM Portfolio', client: 'Pacific Brands', type: 'Trademark', status: 'Active', days: 8, value: '$18K', lead: 'WA' },
      ],
      compliance: [
        { label: 'Patent Renewals', status: 'good', value: '12/12', sub: 'All current' },
        { label: 'Trademark Renewals', status: 'warning', value: '8/10', sub: '2 due this month' },
        { label: 'Filing Deadlines', status: 'good', value: '100%', sub: 'On track' },
        { label: 'Client Reporting', status: 'neutral', value: '6/8', sub: '2 in progress' },
        { label: 'CPD Requirements', status: 'good', value: '94%', sub: 'On track' },
      ],
      team: [
        { initials: 'MC', name: 'Michael Cooper', role: 'Principal', matters: 12, util: 88, level: 'high' },
        { initials: 'WA', name: 'Warren', role: 'Patent & TM Attorney', matters: 10, util: 82, level: 'high' },
        { initials: 'NN', name: 'Naleesha Niranjan', role: 'Patent & TM Attorney', matters: 8, util: 72, level: 'good' },
        { initials: 'JT', name: 'James Thomson', role: 'Associate', matters: 6, util: 65, level: 'good' },
      ],
      aiActions: [
        { priority: 'High', title: 'Patent deadline approaching', desc: 'Acme Corp provisional patent expires in 14 days. Complete specification required before Mar 12.' },
        { priority: 'High', title: 'Opposition response due', desc: 'BrandX trademark opposition — response to examiner due within 10 business days.' },
        { priority: 'Medium', title: 'Renewal notice', desc: 'GreenLeaf Bio AU Patent 2021/234567 — renewal fee due Apr 1. Client notification recommended.' },
        { priority: 'Low', title: 'Portfolio review', desc: 'Pacific Brands TM portfolio — 3 marks approaching 10-year renewal. Schedule review with client.' },
      ],
      importantDates: [
        { label: 'Acme Corp — provisional patent deadline', month: 'MAR', day: '12', year: '2026', sub: 'Thursday · Filing deadline', urgency: 'high' },
        { label: 'BrandX — opposition response due', month: 'MAR', day: '18', year: '2026', sub: 'Wednesday · Trademark', urgency: 'high' },
        { label: 'GreenLeaf — patent renewal fee', month: 'APR', day: '01', year: '2026', sub: 'Wednesday · Renewal', urgency: 'medium' },
        { label: 'TechFlow — design examination report', month: 'MAR', day: '25', year: '2026', sub: 'Tuesday · Design', urgency: 'medium' },
        { label: 'Pacific Brands — TM portfolio review', month: 'APR', day: '10', year: '2026', sub: 'Thursday · Review', urgency: 'low' },
      ],
      upcomingEvents: [
        { title: 'Client call — Acme Corp patent strategy', month: 'MAR', day: '10', year: '2026', time: '10:00 AM', location: 'Video call' },
        { title: 'BrandX opposition hearing prep', month: 'MAR', day: '15', year: '2026', time: '2:00 PM', location: 'Melbourne office' },
        { title: 'IP Australia examiner interview', month: 'MAR', day: '20', year: '2026', time: '11:00 AM', location: 'Canberra (remote)' },
        { title: 'GreenLeaf Bio patent review', month: 'MAR', day: '22', year: '2026', time: '9:00 AM', location: 'Video call' },
      ],
      aiSummary: [
        'Active filings are at 34 with 3 new applications lodged this month — patent workload is increasing.',
        'BrandX trademark opposition requires a response within 10 business days — this is the highest priority item.',
        'Acme Corp provisional patent deadline is Mar 12 — the complete specification needs partner review before filing.',
        'Team utilisation is healthy at an average of 77% — capacity available for new instructions.',
        'Revenue MTD is tracking 8% ahead of target at $480K, driven by GreenLeaf patent prosecution fees.',
      ],
      priorities: configs.default.pages.control.priorities,
      firmHealthMetrics: [
        { label: 'Utilization Rate', value: 77, target: 80, delta: '+2.1%', above: false },
        { label: 'Realization Rate', value: 93, target: 90, delta: '+3.2%', above: true },
        { label: 'Collection Rate', value: 89, target: 88, delta: '+1.0%', above: true },
        { label: 'Client NPS', value: 78, target: 75, delta: '+4.0', above: true },
      ],
    },
    work: {
      ...configs.default.pages.work,
      overviewTitle: 'IP Matters Overview',
      overviewSub: (total) => `Distribution across ${total} active IP matters`,
      matterStats: {
        total: 28,
        weekDelta: '+1',
        breakdown: [
          { label: 'On Track', value: 21, pct: 75, hex: '#a7f3d0', textHex: '#065f46' },
          { label: 'At Risk',  value: 3,  pct: 11, hex: '#fde68a', textHex: '#92400e' },
          { label: 'Overdue',  value: 1,  pct: 4,  hex: '#fecaca', textHex: '#991b1b' },
          { label: 'On Hold',  value: 3,  pct: 11, hex: '#e2e8f0', textHex: '#475569' },
        ],
      },
      workMatters: [
        { id: 1, name: 'Acme Corp Patent Application', ref: 'CIP-2601', client: 'Acme Corp', practice: 'Patent', status: 'Active', priority: 'Critical', progress: 65, due: 'Mar 12', value: '$38K', lead: 'MC', leadColor: 'bg-brand-800 text-brand-50' },
        { id: 2, name: 'BrandX Trademark Opposition', ref: 'CIP-2598', client: 'BrandX Pty Ltd', practice: 'Trademark', status: 'Behind', priority: 'High', progress: 40, due: 'Mar 18', value: '$24K', lead: 'WA', leadColor: 'bg-teal-600 text-white' },
        { id: 3, name: 'TechFlow Design Registration', ref: 'CIP-2612', client: 'TechFlow Industries', practice: 'Design', status: 'On Track', priority: 'Medium', progress: 30, due: 'Apr 15', value: '$12K', lead: 'NN', leadColor: 'bg-violet-500 text-white' },
        { id: 4, name: 'GreenLeaf Patent Prosecution', ref: 'CIP-2534', client: 'GreenLeaf Bio', practice: 'Patent', status: 'On Track', priority: 'High', progress: 78, due: 'Apr 01', value: '$52K', lead: 'MC', leadColor: 'bg-brand-800 text-brand-50' },
        { id: 5, name: 'Pacific Brands TM Portfolio', ref: 'CIP-2620', client: 'Pacific Brands', practice: 'Trademark', status: 'On Track', priority: 'Medium', progress: 15, due: 'Apr 10', value: '$18K', lead: 'WA', leadColor: 'bg-teal-600 text-white' },
        { id: 6, name: 'MedTech Patent Family', ref: 'CIP-2590', client: 'MedTech Solutions', practice: 'Patent', status: 'Active', priority: 'High', progress: 55, due: 'Mar 30', value: '$45K', lead: 'NN', leadColor: 'bg-violet-500 text-white' },
        { id: 7, name: 'Harbour Foods Brand Protection', ref: 'CIP-2615', client: 'Harbour Foods', practice: 'Trademark', status: 'On Track', priority: 'Low', progress: 90, due: 'Mar 08', value: '$8K', lead: 'JT', leadColor: 'bg-orange-500 text-white' },
        { id: 8, name: 'SolarTech Innovation Patent', ref: 'CIP-2622', client: 'SolarTech AU', practice: 'Patent', status: 'On Track', priority: 'Medium', progress: 10, due: 'May 20', value: '$32K', lead: 'MC', leadColor: 'bg-brand-800 text-brand-50' },
      ],
      aiPoints: [
        'Acme Corp provisional patent deadline is Mar 12 — complete specification needs final review before filing with IP Australia.',
        'BrandX trademark opposition response is overdue — the 10 business day window is closing.',
        'GreenLeaf patent prosecution is at 78% and on track for Apr 1 renewal deadline.',
        'Harbour Foods brand protection is at 90% — trademark registration expected to complete this week.',
        'New patent instruction from SolarTech AU received — initial patentability search underway.',
      ],
      aiActions: [
        { text: 'Finalise Acme Corp complete patent specification before Mar 12 deadline' },
        { text: 'Prepare and file BrandX opposition response — examiner deadline imminent' },
        { text: 'Send GreenLeaf Bio renewal fee notification to client before Apr 1' },
      ],
    },
  },
}

// ── Gallagher Bassett (in-house corporate legal tenant) ──────────────────
configs.gallagherbassett = {
  appName: 'Gallagher Bassett',
  logo: '/gallagher-bassett-logo.png',
  logoClassName: 'h-15 w-auto',
  icon: '/gallagher-bassett-icon-v2.png',
  greeting: 'Good morning, Sarah',

  term: {
    matter: 'matter', matters: 'matters', Matter: 'Matter', Matters: 'Matters',
    firm: 'legal team', Firm: 'Legal Team', firms: 'legal teams', Firms: 'Legal Teams',
  },

  nav: { work: 'Matters' },

  complySubItems: [
    { title: 'Overview', page: 'Comply' },
    { title: 'Legislation & Regulatory Landscape', page: 'Legislation & Regulatory Landscape' },
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
      mattersOverviewSub: '38 active across 13 business units',
      firmHealth: 'Firm Health',
      kpis: [
        { label: 'Compliance Score', value: '93%', delta: '+1.4%', dir: 'up', primary: true },
        { label: 'Active Matters', value: '38', delta: '+4', dir: 'up' },
        { label: 'Utilization', value: '82%', delta: '+2.1%', dir: 'up' },
        { label: 'Revenue MTD', value: '$2.1M', delta: '+8%', dir: 'up' },
      ],
      matters: [
        { name: 'icare NSW Agent Scheme renewal', client: 'Workers Compensation', type: 'Commercial', status: 'Active', days: 42, value: '$140K', lead: 'DP' },
        { name: 'Motor claims system — privacy incident', client: 'IT & InfoSec', type: 'Privacy & Data', status: 'Active', days: 9, value: '$95K', lead: 'PN' },
        { name: 'AFCA complaint defence — motor injury', client: 'Motor Claims', type: 'Litigation & Disputes', status: 'Review', days: 61, value: '$55K', lead: 'KL' },
        { name: 'ASIC AFS licence variation response', client: 'Executive/Board', type: 'Regulatory', status: 'Active', days: 18, value: '$120K', lead: 'MR' },
        { name: 'Employment dispute — Brisbane operations', client: 'People & Culture', type: 'Employment', status: 'Active', days: 27, value: '$40K', lead: 'RL' },
      ],
      compliance: [
        { label: 'Privacy Act / APP attestations', status: 'good', value: '13/13', sub: 'All BUs current' },
        { label: 'Conflict checks', status: 'warning', value: '29/34', sub: '5 pending this week' },
        { label: 'CPD Requirements', status: 'good', value: '94%', sub: 'On track' },
        { label: 'Delegated Authority Register', status: 'warning', value: '2 overdue', sub: 'Review due' },
        { label: 'Data breach drill readiness', status: 'neutral', value: 'Q2 planned', sub: 'Scheduled May' },
      ],
      firmHealthMetrics: [
        { label: 'Utilization Rate', value: 82, target: 80, delta: '+2.1%', above: true },
        { label: 'Realization Rate', value: 93, target: 90, delta: '+2.3%', above: true },
        { label: 'Collection Rate', value: 88, target: 92, delta: '-1.2%', above: false },
        { label: 'Client NPS', value: 74, target: 75, delta: '-0.5', above: false },
      ],
      team: [
        { initials: 'SB', name: 'Sarah Bennett', role: 'General Counsel, AU & NZ', matters: 7, util: 88, level: 'high' },
        { initials: 'DP', name: 'David Park', role: 'Deputy General Counsel (Commercial)', matters: 11, util: 90, level: 'over' },
        { initials: 'KL', name: 'Karen Liu', role: 'Senior Legal Counsel (Litigation & Disputes)', matters: 9, util: 85, level: 'high' },
        { initials: 'JW', name: 'James Walker', role: 'Senior Legal Counsel (Regulatory & Licensing)', matters: 6, util: 78, level: 'good' },
        { initials: 'PN', name: 'Priya Nair', role: 'Privacy Officer & Senior Counsel', matters: 5, util: 82, level: 'high' },
      ],
      aiActions: [
        { priority: 'High', title: 'Motor claims privacy incident — 72hr window', desc: 'OAIC Notifiable Data Breach assessment due within 72 hours of awareness. Priya Nair leading; containment confirmed, eligible data breach determination in progress.' },
        { priority: 'High', title: 'ASIC AFS licence variation response', desc: 'ASIC request for further information on licence variation is due 30 April. Marcus Reid to coordinate board attestation pack.' },
        { priority: 'Medium', title: 'icare NSW agent scheme renewal drafting', desc: 'Key commercial terms to be settled by 10 May to preserve renewal timeline. David Park awaiting underwriting input on fee structure.' },
        { priority: 'Low', title: 'Delegated authority register overdue', desc: 'Two BUs have not re-attested their delegated authority matrices this quarter. Tom Barker to chase before month-end.' },
      ],
      importantDates: [
        { label: 'OAIC NDB assessment — motor claims incident', month: 'APR', day: '24', year: '2026', sub: 'Friday · Privacy', urgency: 'high' },
        { label: 'ASIC AFS licence variation response', month: 'APR', day: '30', year: '2026', sub: 'Thursday · Regulatory', urgency: 'high' },
        { label: 'Modern Slavery Statement FY26 — first draft', month: 'MAY', day: '08', year: '2026', sub: 'Friday · ESG', urgency: 'medium' },
        { label: 'icare NSW agent scheme — terms settled', month: 'MAY', day: '10', year: '2026', sub: 'Sunday · Commercial', urgency: 'medium' },
        { label: 'Risk & Compliance Committee charter refresh', month: 'MAY', day: '15', year: '2026', sub: 'Friday · Governance', urgency: 'medium' },
        { label: 'General Insurance Code of Practice attestation', month: 'JUN', day: '30', year: '2026', sub: 'Tuesday · Compliance', urgency: 'low' },
      ],
      upcomingEvents: [
        { title: 'Privacy incident response working group', month: 'APR', day: '23', year: '2026', time: '9:30 AM', location: 'Teams' },
        { title: 'Legal leadership weekly', month: 'APR', day: '24', year: '2026', time: '11:00 AM', location: 'Melbourne HQ L14' },
        { title: 'Risk & Compliance Committee standing meeting', month: 'APR', day: '28', year: '2026', time: '2:00 PM', location: 'Board Room' },
        { title: 'icare NSW commercial terms negotiation', month: 'APR', day: '30', year: '2026', time: '10:00 AM', location: 'Video call' },
        { title: 'General Counsel monthly with CEO', month: 'MAY', day: '05', year: '2026', time: '3:00 PM', location: 'CEO office' },
      ],
      aiSummary: [
        'Compliance posture sits at 93% — conflict checks and the delegated authority register are the two areas currently trailing.',
        'A motor claims privacy incident is the dominant risk this week; OAIC Notifiable Data Breach determination is due by 24 April.',
        'External counsel spend is tracking at $680K (28% of FY budget) — favourable versus 35% target, driven by in-sourced regulatory work.',
        'Matter intake SLA has improved to 3.2 days average, 0.6 days ahead of target; Claims Operations and Underwriting remain the two highest-volume internal clients.',
        'icare NSW and Comcare renewal cadence is well-controlled; ASIC AFS licence variation is the most time-sensitive regulatory matter.',
      ],
      priorities: [
        { label: 'OAIC NDB determination — motor claims incident', urgency: 'High', due: 'Fri 24 Apr' },
        { label: 'ASIC AFS licence variation response pack', urgency: 'High', due: '30 Apr' },
        { label: 'Settle icare NSW scheme commercial terms', urgency: 'Medium', due: '10 May' },
        { label: 'Clear outstanding conflict checks (5)', urgency: 'Medium', due: 'This week' },
        { label: 'Delegated authority register re-attestation', urgency: 'Low', due: 'Month-end' },
      ],
    },

    // ── Work ────────────────────────────────────────────────
    work: {
      title: 'Work',
      description: 'Matter intake, delivery and cost-to-business-unit',
      newButton: 'New Matter',
      overviewTitle: 'Matters Overview',
      overviewSub: (total) => `Distribution across ${total} active matters`,
      donutLabel: 'MATTERS',
      matterStats: {
        total: 38,
        weekDelta: '+4',
        breakdown: [
          { label: 'Commercial',           value: 12, pct: 32, hex: '#a7f3d0', textHex: '#065f46' },
          { label: 'Regulatory',           value: 9,  pct: 24, hex: '#fde68a', textHex: '#92400e' },
          { label: 'Litigation & Disputes', value: 8,  pct: 21, hex: '#e2e8f0', textHex: '#475569' },
          { label: 'Employment / Privacy', value: 9,  pct: 23, hex: '#fecaca', textHex: '#991b1b' },
        ],
      },
      performance: [
        { label: 'Intake SLA (days)',      value: '3.2d', bar: 85, onTarget: true,  note: '-0.6 vs target' },
        { label: 'Matter Cycle Time',      value: '24d',  bar: 82, onTarget: true,  note: '-4 vs target'   },
        { label: 'Self-served advice rate', value: '62%', bar: 62, onTarget: true,  note: '+7% vs target'  },
        { label: 'External counsel spend (% budget)', value: '28%', bar: 72, onTarget: true, note: '35% target' },
        { label: 'Business unit NPS',      value: '71',   bar: 71, onTarget: true,  note: '+1 vs prev qtr' },
      ],
      workMatters: [
        { id: 1,  name: 'icare NSW Agent Scheme renewal', ref: 'GBL-2601', client: 'Workers Compensation', practice: 'Commercial', status: 'Active', priority: 'High', progress: 55, due: 'May 10', value: '$140K', lead: 'DP', leadColor: 'bg-brand-800 text-brand-50' },
        { id: 2,  name: 'Comcare contract variation — PSA clauses', ref: 'GBL-2602', client: 'Workers Compensation', practice: 'Commercial', status: 'On Track', priority: 'Medium', progress: 40, due: 'May 22', value: '$60K', lead: 'DP', leadColor: 'bg-brand-800 text-brand-50' },
        { id: 3,  name: 'WorkSafe VIC claims handling MSA', ref: 'GBL-2603', client: 'Workers Compensation', practice: 'Commercial', status: 'On Track', priority: 'Medium', progress: 30, due: 'Jun 06', value: '$90K', lead: 'DP', leadColor: 'bg-brand-800 text-brand-50' },
        { id: 4,  name: 'Azure cloud migration — Master Services Agreement', ref: 'GBL-2604', client: 'IT & InfoSec', practice: 'Commercial', status: 'Active', priority: 'High', progress: 65, due: 'May 01', value: '$80K', lead: 'DP', leadColor: 'bg-brand-800 text-brand-50' },
        { id: 5,  name: 'Motor claims system — privacy incident response', ref: 'GBL-2605', client: 'IT & InfoSec', practice: 'Privacy & Data', status: 'Active', priority: 'Critical', progress: 70, due: 'Apr 24', value: '$95K', lead: 'PN', leadColor: 'bg-teal-600 text-white' },
        { id: 6,  name: 'AFCA complaint defence — motor injury', ref: 'GBL-2606', client: 'Motor Claims', practice: 'Litigation & Disputes', status: 'Review', priority: 'High', progress: 60, due: 'May 14', value: '$55K', lead: 'KL', leadColor: 'bg-slate-500 text-white' },
        { id: 7,  name: 'ASIC AFS licence variation response', ref: 'GBL-2607', client: 'Executive/Board', practice: 'Regulatory', status: 'Active', priority: 'Critical', progress: 50, due: 'Apr 30', value: '$120K', lead: 'MR', leadColor: 'bg-violet-500 text-white' },
        { id: 8,  name: 'Employment dispute — unfair dismissal (BNE ops)', ref: 'GBL-2608', client: 'People & Culture', practice: 'Employment', status: 'Active', priority: 'High', progress: 45, due: 'May 20', value: '$40K', lead: 'RL', leadColor: 'bg-orange-500 text-white' },
        { id: 9,  name: 'Modern Slavery Statement FY26 preparation', ref: 'GBL-2609', client: 'Procurement', practice: 'ESG', status: 'On Track', priority: 'Medium', progress: 35, due: 'Sep 30', value: '$30K', lead: 'AO', leadColor: 'bg-rose-500 text-white' },
        { id: 10, name: 'AI use policy — internal adoption framework', ref: 'GBL-2610', client: 'Executive/Board', practice: 'Regulatory', status: 'Active', priority: 'Medium', progress: 55, due: 'Jun 15', value: '$25K', lead: 'JW', leadColor: 'bg-violet-500 text-white' },
        { id: 11, name: 'Acquisition DD — Victorian claims consultancy', ref: 'GBL-2611', client: 'Executive/Board', practice: 'Corporate/M&A', status: 'On Hold', priority: 'Medium', progress: 25, due: 'TBD', value: '$180K', lead: 'DP', leadColor: 'bg-brand-800 text-brand-50' },
        { id: 12, name: 'SIRA audit response (NSW)', ref: 'GBL-2612', client: 'Workers Compensation', practice: 'Regulatory', status: 'Active', priority: 'High', progress: 40, due: 'May 18', value: '$70K', lead: 'JW', leadColor: 'bg-violet-500 text-white' },
      ],
      aiPoints: [
        'Three matters carry critical deadlines in the next 10 days — motor claims privacy incident (Apr 24), ASIC AFS variation (Apr 30), and Azure MSA signature (May 1).',
        'Privacy & Data and Regulatory together represent 47% of the active book by count, reflecting heightened OAIC and ASIC engagement this quarter.',
        'External counsel has been engaged on 4 of 38 matters (11%), weighted to Litigation & Disputes and the Victorian claims DD — in line with in-sourcing strategy.',
        'SIRA NSW audit response is trending behind — evidence pack for sampling requires Claims Operations sign-off by Fri 25 Apr to remain on track.',
        'Modern Slavery Statement FY26 first draft is due 8 May; Procurement has provided 60% of supplier data — remainder requested from Finance.',
      ],
      aiActions: [
        { text: 'Finalise NDB determination for motor claims incident before Fri 24 Apr and brief GC within 24 hours' },
        { text: 'Lodge ASIC AFS licence variation response pack by 30 Apr with board attestation signed' },
        { text: 'Settle final commercial terms on icare NSW scheme renewal before 10 May underwriting gate' },
      ],
    },

    // ── Vault ───────────────────────────────────────────────
    vault: {
      description: 'The documentation base that informs and automates Gallagher Bassett\'s in-house legal function',
      status: {
        label: 'Excellent',
        body: 'Your vault has the foundational documents Ethos needs to understand Gallagher Bassett — governing structure, core policies, CPS 230-aligned frameworks and strategic direction. Two items require attention.',
        lastSynced: 'Last synced 3 min ago',
      },
      categories: [
        { id: 'governing',  name: 'Governing Documents'  },
        { id: 'policies',   name: 'Policies'             },
        { id: 'frameworks', name: 'Frameworks'           },
        { id: 'strategy',   name: 'Strategy & Reporting' },
      ],
      files: [
        // Governing Documents (5)
        { id: 'gb-1',  name: 'Constitution',                              type: 'document',    categoryId: 'governing',  status: 'healthy', lastUpdated: '14 Feb 2026 at 9:00am'  },
        { id: 'gb-2',  name: 'AFS Licence (ASIC)',                        type: 'document',    categoryId: 'governing',  status: 'healthy', lastUpdated: '20 Mar 2026 at 11:42am' },
        { id: 'gb-3',  name: 'Board Charter v3',                          type: 'document',    categoryId: 'governing',  status: 'healthy', lastUpdated: '18 Mar 2026 at 2:30pm'  },
        { id: 'gb-4',  name: 'Risk & Compliance Committee Charter',       type: 'document',    categoryId: 'governing',  status: 'stale',   lastUpdated: '02 Aug 2024 at 4:08pm'  },
        { id: 'gb-5',  name: 'Delegations of Authority',                 type: 'spreadsheet', categoryId: 'governing',  status: 'healthy', lastUpdated: '12 Mar 2026 at 10:32am' },
        // Policies (5)
        { id: 'gb-6',  name: 'Code of Conduct',                           type: 'document',    categoryId: 'policies',   status: 'healthy', lastUpdated: '08 Feb 2026 at 9:00am'  },
        { id: 'gb-7',  name: 'Conflict of Interest Policy',               type: 'document',    categoryId: 'policies',   status: 'healthy', lastUpdated: '14 Jan 2026 at 3:55pm'  },
        { id: 'gb-8',  name: 'AI Use Policy — Internal Adoption v1',     type: 'document',    categoryId: 'policies',   status: 'healthy', lastUpdated: '14 Apr 2026 at 2:55pm'  },
        { id: 'gb-9',  name: 'Notifiable Data Breach Policy',             type: 'document',    categoryId: 'policies',   status: 'healthy', lastUpdated: '18 Feb 2026 at 11:08am' },
        { id: 'gb-10', name: 'Anti-Bribery & Corruption Policy',          type: 'document',    categoryId: 'policies',   status: 'check',   lastUpdated: '11 Nov 2025 at 5:44pm'  },
        // Frameworks (5)
        { id: 'gb-11', name: 'CPS 230 Operational Risk Framework',        type: 'document',    categoryId: 'frameworks', status: 'healthy', lastUpdated: '04 Apr 2026 at 10:11am' },
        { id: 'gb-12', name: 'Risk Appetite Statement FY26',              type: 'document',    categoryId: 'frameworks', status: 'healthy', lastUpdated: '15 Feb 2026 at 10:00am' },
        { id: 'gb-13', name: 'Compliance Management Framework',           type: 'document',    categoryId: 'frameworks', status: 'healthy', lastUpdated: '22 Mar 2026 at 11:30am' },
        { id: 'gb-14', name: 'AML/CTF Program',                           type: 'document',    categoryId: 'frameworks', status: 'check',   lastUpdated: '15 Dec 2025 at 9:00am'  },
        { id: 'gb-15', name: 'Cyber Security Framework',                  type: 'document',    categoryId: 'frameworks', status: 'stale',   lastUpdated: '09 Aug 2024 at 3:24pm'  },
        // Strategy & Reporting (5)
        { id: 'gb-16', name: 'Strategic Plan FY26-28',                    type: 'document',    categoryId: 'strategy',   status: 'healthy', lastUpdated: '12 Jan 2026 at 10:32am' },
        { id: 'gb-17', name: 'ASIC Compliance Plan FY26',                 type: 'document',    categoryId: 'strategy',   status: 'healthy', lastUpdated: '03 Apr 2026 at 1:14pm'  },
        { id: 'gb-18', name: 'AFCA Engagement Plan',                      type: 'document',    categoryId: 'strategy',   status: 'healthy', lastUpdated: '10 Mar 2026 at 9:30am'  },
        { id: 'gb-19', name: 'Modern Slavery Statement FY25',             type: 'document',    categoryId: 'strategy',   status: 'healthy', lastUpdated: '30 Jun 2025 at 3:18pm'  },
        { id: 'gb-20', name: 'Annual Compliance Attestation',             type: 'document',    categoryId: 'strategy',   status: 'healthy', lastUpdated: '15 Oct 2025 at 9:45am'  },
      ],
    },

    // ── Meet ────────────────────────────────────────────────
    meet: {
      summaryPoints: [
        'You\'ve led 9 business unit check-ins this month — Claims Operations and Workers Compensation remain the most frequent touchpoints.',
        'Risk & Compliance Committee met twice this quarter; privacy, AFS licence, and delegated authority framework dominated the agenda.',
        'AFCA pre-hearing conferences are up 20% year-on-year, reflecting motor claims volume and scheme-driven complaint activity.',
      ],
      upcoming: [
        { id: 1, month: 'APR', day: '23', year: '2026', name: 'Privacy incident response working group', time: '9:30am', location: 'Teams', hasAgenda: true, hasBoardPack: false, hasMinutes: false },
        { id: 2, month: 'APR', day: '28', year: '2026', name: 'Risk & Compliance Committee — standing', time: '2:00pm', location: 'Board Room', hasAgenda: true, hasBoardPack: true, hasMinutes: false },
        { id: 3, month: 'APR', day: '30', year: '2026', name: 'icare NSW — commercial terms negotiation', time: '10:00am', location: 'Video call', hasAgenda: true, hasBoardPack: false, hasMinutes: false },
        { id: 4, month: 'MAY', day: '05', year: '2026', name: 'GC monthly with CEO', time: '3:00pm', location: 'CEO office', hasAgenda: true, hasBoardPack: false, hasMinutes: false },
      ],
      past: [
        { id: 5, month: 'APR', day: '17', year: '2026', name: 'Legal leadership weekly', time: '11:00am', location: 'Melbourne HQ L14', hasAgenda: true, hasBoardPack: false, hasMinutes: true },
        { id: 6, month: 'APR', day: '10', year: '2026', name: 'ASIC liaison — AFS licence pre-discussion', time: '2:30pm', location: 'Video call', hasAgenda: true, hasBoardPack: true, hasMinutes: true },
        { id: 7, month: 'APR', day: '03', year: '2026', name: 'Board Risk Committee quarterly', time: '9:00am', location: 'Board Room', hasAgenda: true, hasBoardPack: true, hasMinutes: true },
      ],
    },

    // ── Resource Library ────────────────────────────────────
    resource: {
      categories: [
        { id: 'all', label: 'All' },
        { id: 'commercial', label: 'Commercial' },
        { id: 'regulatory', label: 'Regulatory' },
        { id: 'privacy', label: 'Privacy & Data' },
        { id: 'litigation', label: 'Litigation & Disputes' },
        { id: 'employment', label: 'Employment' },
        { id: 'governance', label: 'Governance' },
      ],
      contentTypes: [
        { id: 'all', label: 'All Types' },
        { id: 'template', label: 'Templates' },
        { id: 'guide', label: 'Guides' },
        { id: 'policy', label: 'Policies' },
        { id: 'playbook', label: 'Playbooks' },
        { id: 'legislation', label: 'Legislation' },
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
          id: 'rl-gb1', title: 'Vendor MSA Template — GB Paper', description: 'Gallagher Bassett standard Master Services Agreement template for technology and operational vendors.',
          resource_type: 'template', category: 'commercial', tags: ['MSA', 'Vendor', 'Commercial'], jurisdiction: 'Australia',
          author: { name: 'David Park', role: 'Deputy General Counsel (Commercial)' }, source: 'org', status: 'approved', ai_assisted: false,
          file_type: 'DOCX', file_size: '72 KB', last_updated: '2026-03-10', review_due: '2026-09-10',
          version: '4.1', page_count: 28,
          purpose: 'Provides a consistent baseline for vendor contracting, aligned to CPS 230 material service provider requirements.',
          when_to_use: ['When contracting a new technology or claims vendor', 'During MSA consolidation programme review', 'For renewal of material service providers'],
          linked_categories: ['Commercial', 'Regulatory'],
          compliance_flags: [{ type: 'info', message: 'Aligned with APRA CPS 230 Operational Risk Management requirements.' }],
          key_clauses: [
            { name: 'Material Service Provider Obligations', description: 'CPS 230 aligned obligations including tolerance levels and notification timelines.', clause_ref: 'Schedule 4' },
            { name: 'Data & Privacy', description: 'Privacy Act 1988, APPs, and Notifiable Data Breach alignment.', clause_ref: 'Clause 12' },
          ],
          sections: [{ number: '1', title: 'Services' }, { number: '2', title: 'Fees & Payment' }, { number: '3', title: 'Service Levels' }, { number: '4', title: 'Data & Privacy' }, { number: '5', title: 'Termination' }],
          versions: [{ number: '4.1', date: '2026-03-10', author: 'David Park', summary: 'CPS 230 alignment update and AI-use clause added.', current: true }],
          related_learning: [{ title: 'CPS 230 Fundamentals', type: 'Course', estimated_time: '2 hrs', kc_id: 'kc-cps230' }],
        },
        {
          id: 'rl-gb2', title: 'Notifiable Data Breach Playbook', description: 'Step-by-step playbook for OAIC Notifiable Data Breach assessment, determination and notification.',
          resource_type: 'playbook', category: 'privacy', tags: ['Privacy', 'NDB', 'OAIC', 'Incident Response'], jurisdiction: 'Australia',
          author: { name: 'Priya Nair', role: 'Privacy Officer & Senior Counsel' }, source: 'org', status: 'approved', ai_assisted: false,
          file_type: 'PDF', file_size: '58 KB', last_updated: '2026-02-18', review_due: '2026-08-18',
          version: '2.3', page_count: 16,
          purpose: 'Ensures GB meets the 30-day OAIC assessment window and coordinated incident response with IT & InfoSec.',
          when_to_use: ['On awareness of suspected eligible data breach', 'During privacy incident response working group', 'For annual breach-response rehearsal'],
          linked_categories: ['Privacy & Data', 'Regulatory'],
          compliance_flags: [{ type: 'info', message: 'Aligned with Privacy Act 1988, Part IIIC and OAIC guidance.' }],
          key_clauses: [
            { name: 'Assessment Timeline', description: 'Eligible data breach assessment within 30 days of awareness.', clause_ref: 'Section 2' },
            { name: 'Notification Criteria', description: 'Determining serious harm and statement preparation for OAIC and affected individuals.', clause_ref: 'Section 4' },
          ],
          sections: [{ number: '1', title: 'Triage' }, { number: '2', title: 'Assessment' }, { number: '3', title: 'Determination' }, { number: '4', title: 'Notification' }, { number: '5', title: 'Post-Incident Review' }],
          versions: [{ number: '2.3', date: '2026-02-18', author: 'Priya Nair', summary: 'Updated for revised OAIC 2026 guidance and CPS 234 cross-references.', current: true }],
          related_learning: [{ title: 'Privacy Act for Regulated Entities', type: 'Course', estimated_time: '2.5 hrs', kc_id: 'kc-privacy' }],
        },
        {
          id: 'rl-gb3', title: 'AFCA Complaint Defence Framework', description: 'Framework for defending AFCA determinations in workers compensation, motor and general insurance claims.',
          resource_type: 'playbook', category: 'litigation', tags: ['AFCA', 'Disputes', 'Claims'], jurisdiction: 'Australia',
          author: { name: 'Karen Liu', role: 'Senior Legal Counsel (Litigation & Disputes)' }, source: 'org', status: 'approved', ai_assisted: true,
          file_type: 'PDF', file_size: '64 KB', last_updated: '2026-01-28', review_due: '2026-07-28',
          version: '1.4', page_count: 14,
          purpose: 'Provides a consistent defence framework to reduce AFCA cycle time and preserve scheme outcomes.',
          when_to_use: ['On receipt of an AFCA complaint notification', 'For preparation of final response letters', 'During case assessment escalation'],
          linked_categories: ['Litigation & Disputes', 'Regulatory'],
          compliance_flags: [{ type: 'info', message: 'Aligned with General Insurance Code of Practice and AFCA Operational Guidelines.' }],
          key_clauses: [
            { name: 'Final Response Letter', description: 'Requirements for IDR final response before AFCA escalation.', clause_ref: 'Section 2' },
            { name: 'Case Assessment Submissions', description: 'Evidence pack standards for AFCA case management.', clause_ref: 'Section 4' },
          ],
          sections: [{ number: '1', title: 'Triage' }, { number: '2', title: 'IDR Final Response' }, { number: '3', title: 'AFCA Lodgement' }, { number: '4', title: 'Case Management' }, { number: '5', title: 'Determination Response' }],
          versions: [{ number: '1.4', date: '2026-01-28', author: 'Karen Liu', summary: 'Refreshed for 2026 AFCA operational guideline changes.', current: true }],
          related_learning: [{ title: 'Insurance Disputes & AFCA', type: 'Course', estimated_time: '2 hrs', kc_id: 'kc-afca' }],
        },
        {
          id: 'rl-gb4', title: 'Modern Slavery Statement Template', description: 'GB\'s Modern Slavery Statement template covering supply chain, claims panels and overseas data processing.',
          resource_type: 'template', category: 'governance', tags: ['Modern Slavery', 'ESG', 'Procurement'], jurisdiction: 'Australia',
          author: { name: 'Aisha Okonkwo', role: 'Legal Counsel (ESG & Modern Slavery)' }, source: 'org', status: 'approved', ai_assisted: false,
          file_type: 'DOCX', file_size: '48 KB', last_updated: '2026-02-05', review_due: '2027-02-05',
          version: '3.0', page_count: 22,
          purpose: 'Aligns GB\'s reporting with Modern Slavery Act 2018 (Cth) mandatory criteria and reflects supply chain risk assessment.',
          when_to_use: ['During annual Modern Slavery Statement preparation', 'For supplier onboarding due diligence', 'As a board paper supporting appendix'],
          linked_categories: ['Governance', 'Commercial'],
          compliance_flags: [{ type: 'info', message: 'Covers the 7 mandatory criteria under the Modern Slavery Act 2018 (Cth).' }],
          key_clauses: [
            { name: 'Risk Assessment', description: 'Inherent and residual modern slavery risk across supply chain tiers.', clause_ref: 'Section 3' },
            { name: 'Remediation', description: 'Remediation framework for identified modern slavery risks.', clause_ref: 'Section 5' },
          ],
          sections: [{ number: '1', title: 'Reporting Entity' }, { number: '2', title: 'Structure' }, { number: '3', title: 'Risk Assessment' }, { number: '4', title: 'Actions' }, { number: '5', title: 'Remediation' }, { number: '6', title: 'Effectiveness' }, { number: '7', title: 'Consultation' }],
          versions: [{ number: '3.0', date: '2026-02-05', author: 'Aisha Okonkwo', summary: 'Restructured around 7 mandatory criteria and updated supplier tiering approach.', current: true }],
          related_learning: [{ title: 'Modern Slavery Reporting', type: 'Course', estimated_time: '1.5 hrs', kc_id: 'kc-modernslavery' }],
        },
        {
          id: 'rl-gb5', title: 'Whistleblower Investigation Playbook', description: 'Playbook for managing whistleblower disclosures under the Corporations Act Part 9.4AAA.',
          resource_type: 'playbook', category: 'governance', tags: ['Whistleblower', 'Investigations', 'Governance'], jurisdiction: 'Australia',
          author: { name: 'Sarah Bennett', role: 'General Counsel, AU & NZ' }, source: 'org', status: 'approved', ai_assisted: false,
          file_type: 'PDF', file_size: '52 KB', last_updated: '2026-03-18', review_due: '2027-03-18',
          version: '2.0', page_count: 18,
          purpose: 'Gives Legal and People & Culture a consistent approach to receipt, triage and investigation of whistleblower disclosures.',
          when_to_use: ['On receipt of an eligible whistleblower disclosure', 'During investigation planning', 'For annual whistleblower policy review'],
          linked_categories: ['Governance', 'Employment'],
          compliance_flags: [{ type: 'info', message: 'Aligned with Corporations Act 2001 (Cth) Part 9.4AAA and ASIC RG 270.' }],
          key_clauses: [
            { name: 'Eligible Disclosers', description: 'Scope of eligible disclosers and protected disclosures.', clause_ref: 'Section 2' },
            { name: 'Confidentiality', description: 'Handling confidentiality and consent to disclose identity.', clause_ref: 'Section 4' },
          ],
          sections: [{ number: '1', title: 'Purpose' }, { number: '2', title: 'Eligible Disclosers' }, { number: '3', title: 'Triage' }, { number: '4', title: 'Confidentiality' }, { number: '5', title: 'Investigation' }, { number: '6', title: 'Reporting' }],
          versions: [{ number: '2.0', date: '2026-03-18', author: 'Sarah Bennett', summary: 'Updated to reflect ASIC RG 270 February 2026 amendments.', current: true }],
          related_learning: [{ title: 'Whistleblower Regime Essentials', type: 'Course', estimated_time: '2 hrs', kc_id: 'kc-wb' }],
        },
        {
          id: 'rl-gb6', title: 'CPS 230 Material Service Provider Checklist', description: 'Self-assessment checklist for CPS 230 material service provider classification and oversight.',
          resource_type: 'guide', category: 'regulatory', tags: ['CPS 230', 'APRA', 'Operational Resilience'], jurisdiction: 'Australia',
          author: { name: 'James Walker', role: 'Senior Legal Counsel (Regulatory & Licensing)' }, source: 'org', status: 'approved', ai_assisted: true,
          file_type: 'PDF', file_size: '34 KB', last_updated: '2026-03-22', review_due: '2026-09-22',
          version: '1.2', page_count: 10,
          purpose: 'Supports Procurement and Legal in material service provider classification and ongoing oversight under CPS 230.',
          when_to_use: ['When onboarding a new strategic vendor', 'During MSA renewal reviews', 'For annual material service provider attestation'],
          linked_categories: ['Regulatory', 'Commercial'],
          compliance_flags: [{ type: 'info', message: 'Aligned with APRA CPS 230 effective 1 July 2025.' }],
          key_clauses: [
            { name: 'Materiality Test', description: 'Criteria for material service provider classification.', clause_ref: 'Section 2' },
            { name: 'Tolerance Levels', description: 'Tolerance levels for disruption to critical operations.', clause_ref: 'Section 4' },
          ],
          sections: [{ number: '1', title: 'Scope' }, { number: '2', title: 'Materiality Test' }, { number: '3', title: 'Register' }, { number: '4', title: 'Tolerance Levels' }, { number: '5', title: 'Oversight' }],
          versions: [{ number: '1.2', date: '2026-03-22', author: 'James Walker', summary: 'Added tolerance level worked examples.', current: true }],
          related_learning: [{ title: 'CPS 230 Fundamentals', type: 'Course', estimated_time: '2 hrs', kc_id: 'kc-cps230' }],
        },
        {
          id: 'rl-gb7', title: 'Employment Investigation Template', description: 'Standard template for workplace investigation scoping, interview plan and findings report.',
          resource_type: 'template', category: 'employment', tags: ['Employment', 'Investigations', 'Fair Work'], jurisdiction: 'Australia',
          author: { name: 'Rachel Lee', role: 'Legal Counsel (Employment)' }, source: 'org', status: 'approved', ai_assisted: false,
          file_type: 'DOCX', file_size: '44 KB', last_updated: '2026-01-15', review_due: '2026-07-15',
          version: '1.5', page_count: 12,
          purpose: 'Gives investigators a defensible structure for workplace investigations under the Fair Work Act 2009.',
          when_to_use: ['When commissioning a workplace investigation', 'For preparation of findings reports', 'During People & Culture escalations'],
          linked_categories: ['Employment'],
          compliance_flags: [{ type: 'info', message: 'Aligned with Fair Work Act 2009 and work health and safety obligations.' }],
          key_clauses: [
            { name: 'Procedural Fairness', description: 'Interview plan and procedural fairness requirements.', clause_ref: 'Section 3' },
            { name: 'Findings Standard', description: 'Standard of proof and findings methodology.', clause_ref: 'Section 5' },
          ],
          sections: [{ number: '1', title: 'Scope' }, { number: '2', title: 'Plan' }, { number: '3', title: 'Interviews' }, { number: '4', title: 'Evidence' }, { number: '5', title: 'Findings' }, { number: '6', title: 'Recommendations' }],
          versions: [{ number: '1.5', date: '2026-01-15', author: 'Rachel Lee', summary: 'Added procedural fairness checklist and updated interview template.', current: true }],
          related_learning: [{ title: 'Workplace Investigations', type: 'Course', estimated_time: '2.5 hrs', kc_id: 'kc-wpi' }],
        },
        {
          id: 'rl-gb8', title: 'AI Use Policy — Internal Adoption Framework', description: 'Internal policy covering permitted AI tools, data handling, disclosure and oversight for GB staff.',
          resource_type: 'policy', category: 'regulatory', tags: ['AI', 'Policy', 'Governance'], jurisdiction: 'Australia',
          author: { name: 'James Walker', role: 'Senior Legal Counsel (Regulatory & Licensing)' }, source: 'org', status: 'under_review', ai_assisted: true,
          file_type: 'DOCX', file_size: '38 KB', last_updated: '2026-04-14', review_due: '2027-04-14',
          version: '0.9', page_count: 14,
          purpose: 'Sets out the approved use of AI tools by GB staff, including claims handling adjacent use cases and professional disclosure requirements.',
          when_to_use: ['Before onboarding a new AI tool', 'During staff training on AI-assisted workflows', 'For vendor AI feature risk assessment'],
          linked_categories: ['Regulatory', 'Governance'],
          compliance_flags: [{ type: 'neutral', message: 'Currently under Risk & Compliance Committee review — v1.0 expected June 2026.' }],
          key_clauses: [
            { name: 'Permitted Tools', description: 'Approved AI tools and tier-based data handling expectations.', clause_ref: 'Section 3' },
            { name: 'Disclosure', description: 'Disclosure expectations for AI-assisted customer communications.', clause_ref: 'Section 5' },
          ],
          sections: [{ number: '1', title: 'Purpose' }, { number: '2', title: 'Scope' }, { number: '3', title: 'Permitted Tools' }, { number: '4', title: 'Data Handling' }, { number: '5', title: 'Disclosure' }, { number: '6', title: 'Oversight' }],
          versions: [{ number: '0.9', date: '2026-04-14', author: 'James Walker', summary: 'Drafted for Risk & Compliance Committee April review.', current: true }],
          related_learning: [{ title: 'AI Governance for Regulated Entities', type: 'Course', estimated_time: '2 hrs', kc_id: 'kc-ai' }],
        },
      ],
    },

    // ── Talent ──────────────────────────────────────────────
    talent: {
      practiceAreas: ['Commercial', 'Litigation & Disputes', 'Employment', 'Privacy & Data', 'Regulatory', 'Corporate/M&A', 'ESG'],
      professionals: [
        { id: 1, name: 'Sarah Bennett', initials: 'SB', color: 'bg-brand-100 text-brand-700', title: 'General Counsel, AU & NZ', experience: '20+ years', tags: ['Financial Services', 'Regulatory', 'Board Advisory', 'M&A', 'Scheme Agreements'], location: 'Melbourne, VIC', availability: 'Available now', availType: 'Immediately', rating: 4.9, hires: 0, seniority: 'Executive', practiceAreas: ['Commercial', 'Regulatory', 'Corporate/M&A'] },
        { id: 2, name: 'David Park', initials: 'DP', color: 'bg-teal-100 text-teal-700', title: 'Deputy General Counsel (Commercial)', experience: '15+ years', tags: ['Commercial', 'Vendor MSAs', 'CPS 230', 'Outsourcing', 'Scheme Agreements'], location: 'Sydney, NSW', availability: 'Available now', availType: 'Immediately', rating: 4.8, hires: 0, seniority: 'Senior', practiceAreas: ['Commercial', 'Regulatory'] },
        { id: 3, name: 'Karen Liu', initials: 'KL', color: 'bg-slate-100 text-slate-700', title: 'Senior Legal Counsel (Litigation & Disputes)', experience: '12+ years', tags: ['AFCA', 'Class Actions', 'General Insurance Code', 'Claims Disputes', 'Federal Court'], location: 'Sydney, NSW', availability: 'Available now', availType: 'Immediately', rating: 4.7, hires: 0, seniority: 'Senior', practiceAreas: ['Litigation & Disputes'] },
        { id: 4, name: 'James Walker', initials: 'JW', color: 'bg-violet-100 text-violet-700', title: 'Senior Legal Counsel (Regulatory & Licensing)', experience: '11+ years', tags: ['AFS Licensing', 'SIRA', 'icare', 'Comcare', 'WorkSafe'], location: 'Melbourne, VIC', availability: '1–2 weeks', availType: '1–2 weeks', rating: 4.7, hires: 0, seniority: 'Senior', practiceAreas: ['Regulatory', 'Commercial'] },
        { id: 5, name: 'Priya Nair', initials: 'PN', color: 'bg-rose-100 text-rose-700', title: 'Privacy Officer & Senior Counsel', experience: '10+ years', tags: ['Privacy Act', 'APPs', 'NDB', 'CPS 234', 'Incident Response'], location: 'Sydney, NSW', availability: 'Available now', availType: 'Immediately', rating: 4.8, hires: 0, seniority: 'Senior', practiceAreas: ['Privacy & Data'] },
        { id: 6, name: 'Marcus Reid', initials: 'MR', color: 'bg-amber-100 text-amber-700', title: 'Senior Counsel (Regulatory / ASIC & APRA)', experience: '14+ years', tags: ['ASIC', 'APRA', 'Financial Accountability Regime', 'AFSL', 'CPS 230'], location: 'Sydney, NSW', availability: 'Available now', availType: 'Immediately', rating: 4.8, hires: 0, seniority: 'Senior', practiceAreas: ['Regulatory'] },
        { id: 7, name: 'Rachel Lee', initials: 'RL', color: 'bg-orange-100 text-orange-700', title: 'Legal Counsel (Employment)', experience: '7+ years', tags: ['Fair Work', 'Unfair Dismissal', 'Investigations', 'Workplace Policies', 'EBAs'], location: 'Brisbane, QLD', availability: '1–2 weeks', availType: '1–2 weeks', rating: 4.6, hires: 0, seniority: 'Mid', practiceAreas: ['Employment'] },
        { id: 8, name: 'Aisha Okonkwo', initials: 'AO', color: 'bg-pink-100 text-pink-700', title: 'Legal Counsel (ESG & Modern Slavery)', experience: '6+ years', tags: ['Modern Slavery', 'ESG Disclosures', 'Human Rights', 'Supplier DD', 'AASB S2'], location: 'Melbourne, VIC', availability: 'Available now', availType: 'Immediately', rating: 4.5, hires: 0, seniority: 'Mid', practiceAreas: ['ESG', 'Commercial'] },
        { id: 9, name: 'Claire Morrison', initials: 'CM', color: 'bg-cyan-100 text-cyan-700', title: 'Senior Counsel (Employment & IR)', experience: '13+ years', tags: ['Industrial Relations', 'Enterprise Bargaining', 'Fair Work Commission', 'Policy Design', 'Union Engagement'], location: 'Melbourne, VIC', availability: '2–4 weeks', availType: '2–4 weeks', rating: 4.8, hires: 0, seniority: 'Senior', practiceAreas: ['Employment'] },
        { id: 10, name: 'Tom Barker', initials: 'TB', color: 'bg-blue-100 text-blue-700', title: 'Legal Operations Manager', experience: '9+ years', tags: ['Legal Ops', 'Intake', 'Matter Management', 'Panel Management', 'Analytics'], location: 'Melbourne, VIC', availability: 'Available now', availType: 'Immediately', rating: 4.7, hires: 0, seniority: 'Senior', practiceAreas: ['Commercial'] },
        { id: 11, name: 'David Lim', initials: 'DL', color: 'bg-emerald-100 text-emerald-700', title: 'Paralegal', experience: '3+ years', tags: ['Research', 'Contract Admin', 'Document Review', 'Legal Hold', 'Discovery'], location: 'Sydney, NSW', availability: 'Available now', availType: 'Immediately', rating: 4.4, hires: 0, seniority: 'Junior', practiceAreas: ['Commercial', 'Litigation & Disputes'] },
      ],
      aiSummary: [
        'The legal team covers all ten core functions in-house — Commercial and Regulatory have the deepest bench, with senior cover across ASIC/APRA and privacy.',
        'Priya Nair is the single privacy SME — consider developing a deputy privacy counsel to address CPS 234 key-person risk.',
        'Employment & IR is well covered across Rachel Lee (day-to-day) and Claire Morrison (strategic / EBAs); litigation volume concentrated on Karen Liu.',
        'Legal Operations under Tom Barker is driving the self-served advice rate uplift and panel management savings.',
      ],
      aiActions: [
        { priority: 'High', title: 'Develop deputy privacy counsel', desc: 'Priya Nair is the sole privacy SME. Identify a suitable secondment or development opportunity to mitigate key-person risk.' },
        { priority: 'High', title: 'External counsel for Victorian claims DD', desc: 'Acquisition DD exceeds in-house capacity. Engage panel firm for tax, IP and employment streams.' },
        { priority: 'Medium', title: 'Law Society CPD review for all lawyers', desc: 'Annual CPD year closes 31 March. Schedule individual reviews with each lawyer before end of quarter.' },
        { priority: 'Low', title: 'Panel firm performance review', desc: 'Quarterly panel scorecard due. Tom Barker to circulate metrics to preferred firms.' },
      ],
      aiRecommendations: [
        { label: 'Scope deputy privacy counsel role', due: 'This month' },
        { label: 'Brief panel firm on Victorian claims DD workstreams', due: 'May 15' },
        { label: 'CPD one-on-ones across legal team', due: 'Mar 31, 2027' },
        { label: 'Quarterly panel performance review', due: 'Jun 30' },
      ],
    },

    // ── Learn ───────────────────────────────────────────────
    learn: {
      cpdSummary: { hoursCompleted: 6, hoursRequired: 10, hoursRemaining: 4, periodEnd: '31 Mar 2027', categoriesComplete: 2, categoriesTotal: 4, upcomingHours: 6, upcomingCount: 3 },
      focusAreas: [
        { id: 1, label: 'Financial Accountability Regime (FAR)', progress: 70, description: 'Directors\' and accountable persons\' obligations under the Financial Accountability Regime as applied to regulated insurers and claims administrators.' },
        { id: 2, label: 'Privacy Act reform & APP obligations', progress: 45, description: 'Staying current with Privacy Act reform, OAIC enforcement priorities and CPS 234 alignment.' },
        { id: 3, label: 'Insurance disputes & AFCA jurisprudence', progress: 35, description: 'Recent AFCA case determinations and Federal Court decisions affecting workers compensation, motor and general insurance claims handling.' },
      ],
      completedAreas: [
        { id: 4, label: 'General Insurance Code of Practice — 2026 refresh', completedDate: '18 Feb 2026', hours: 2, cpdPoints: 2, category: 'Legal & Regulatory', categories: ['Legal & Regulatory'], regimes: ['lawsociety'], badge: 'Certified', description: 'Updated General Insurance Code of Practice — implications for claims handling timeframes, vulnerable customer protocols and attestation requirements.' },
        { id: 5, label: 'CPS 230 Fundamentals', completedDate: '12 Jan 2026', hours: 2, cpdPoints: 2, category: 'Risk & Compliance', categories: ['Risk & Compliance'], regimes: ['lawsociety'], badge: 'Complete', description: 'Foundational course on APRA CPS 230 Operational Risk Management including material service provider registers and tolerance levels.' },
        { id: 6, label: 'AUSTRAC AML/CTF — 2026 update', completedDate: '10 Dec 2025', hours: 1.5, cpdPoints: 1.5, category: 'Legal & Regulatory', categories: ['Legal & Regulatory'], regimes: ['lawsociety'], badge: 'Complete', description: 'Refresher on AUSTRAC AML/CTF program expectations and recent enforcement trends relevant to financial services entities.' },
        { id: 7, label: 'AICD Directors\' Duties Masterclass', completedDate: '02 Oct 2025', hours: 3, cpdPoints: 3, category: 'Governance & Board Effectiveness', categories: ['Governance & Board Effectiveness'], regimes: ['aicd'], badge: 'Certified', description: 'AICD masterclass on directors\' duties including Chapter 2E, the FAR, and recent High Court and Federal Court decisions on director liability.' },
      ],
      skillsGaps: [
        { skill: 'APRA CPS 230 Material Service Provider oversight', importance: 'Critical', currentLevel: 'Intermediate', targetLevel: 'Advanced', gap: 40 },
        { skill: 'Privacy Act reform readiness', importance: 'High', currentLevel: 'Intermediate', targetLevel: 'Advanced', gap: 50 },
        { skill: 'AFCA advocacy & submissions', importance: 'High', currentLevel: 'Proficient', targetLevel: 'Advanced', gap: 25 },
        { skill: 'AI governance for regulated entities', importance: 'Medium', currentLevel: 'Beginner', targetLevel: 'Intermediate', gap: 60 },
      ],
      upcomingWorkshops: [
        { id: 1, title: 'Privacy Act Reform — In-House Counsel Workshop', month: 'MAY', day: '06', year: '2026', time: '10:00 AM – 1:00 PM', location: 'Online', provider: 'IAPP ANZ', type: 'Workshop', cpdHours: 3, cpdPoints: 3, category: 'Legal & Regulatory', categories: ['Legal & Regulatory', 'Risk & Compliance'], regimes: ['lawsociety'], isEthika: false, status: 'Booked', description: 'Practical workshop on Privacy Act reform implementation for in-house counsel including PIAs, right to erasure and OAIC enforcement trends.', externalDisclaimer: 'This event is organised and managed by IAPP ANZ. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
        { id: 2, title: 'CPS 230 — One Year On', month: 'MAY', day: '21', year: '2026', time: '9:00 AM – 11:30 AM', location: 'Online', provider: 'GRC Institute', type: 'Webinar', cpdHours: 2.5, cpdPoints: 2.5, category: 'Risk & Compliance', categories: ['Risk & Compliance', 'Legal & Regulatory'], regimes: ['grci'], isEthika: false, status: 'Booked', description: 'Lessons learned one year into CPS 230 including APRA supervisory themes, MSP register maturity and tolerance level calibration.', externalDisclaimer: 'This event is organised and managed by GRC Institute. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
        { id: 3, title: 'AFCA Annual Update — Insurance', month: 'JUN', day: '04', year: '2026', time: '1:00 PM – 3:00 PM', location: 'Online', provider: 'AFCA', type: 'Webinar', cpdHours: 2, cpdPoints: 2, category: 'Substantive Law', categories: ['Substantive Law'], regimes: ['lawsociety'], isEthika: false, status: 'Waitlisted', description: 'AFCA\'s annual insurance update covering determination trends, new approach documents and the interaction with Treasury financial system reforms.', externalDisclaimer: 'This event is organised and managed by AFCA. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
      ],
      suggestedWorkshops: [
        { id: 4, title: 'AI Governance for Regulated Entities', month: 'JUN', day: '11', year: '2026', time: '10:00 AM – 12:30 PM', location: 'Online', provider: 'AICD', type: 'Workshop', cpdHours: 2.5, cpdPoints: 2.5, category: 'Governance & Board Effectiveness', categories: ['Governance & Board Effectiveness'], regimes: ['aicd'], isEthika: false, relevance: 'Addresses AI governance skills gap', matchScore: 94, description: 'Workshop for directors and senior counsel on AI governance frameworks for regulated entities including model risk, disclosure and vendor AI features.', externalDisclaimer: 'This event is organised and managed by AICD. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
        { id: 5, title: 'Workers Compensation Scheme Masterclass', month: 'JUN', day: '24', year: '2026', time: '9:00 AM – 12:00 PM', location: 'Sydney CBD', provider: 'Law Society NSW', type: 'Workshop', cpdHours: 3, cpdPoints: 3, category: 'Substantive Law', categories: ['Substantive Law'], regimes: ['lawsociety'], isEthika: false, relevance: 'Supports icare and SIRA engagement', matchScore: 91, description: 'Masterclass on workers compensation schemes across NSW, VIC and QLD including scheme agent obligations, recent jurisprudence and SIRA supervisory priorities.', externalDisclaimer: 'This event is organised and managed by Law Society NSW. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
        { id: 6, title: 'Modern Slavery Reporting — Year 7', month: 'JUL', day: '08', year: '2026', time: '2:00 PM – 4:00 PM', location: 'Online', provider: 'AHRC', type: 'Seminar', cpdHours: 2, cpdPoints: 2, category: 'Governance & Board Effectiveness', categories: ['Governance & Board Effectiveness'], regimes: ['lawsociety'], isEthika: false, relevance: 'Supports Modern Slavery Statement FY26', matchScore: 88, description: 'Seminar on Modern Slavery reporting maturity in year 7, including benchmarking against supply chain risk assessments and emerging regulator expectations.', externalDisclaimer: 'This event is organised and managed by AHRC. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
        { id: 7, title: 'AFCA Advocacy Skills Intensive', month: 'JUL', day: '22', year: '2026', time: '9:00 AM – 4:00 PM', location: 'Sydney CBD', provider: 'Law Society NSW', type: 'Intensive', cpdHours: 4, cpdPoints: 4, category: 'Professional Skills', categories: ['Professional Skills', 'Substantive Law'], regimes: ['lawsociety'], isEthika: false, relevance: 'Builds AFCA advocacy capability', matchScore: 85, description: 'Full-day intensive on AFCA advocacy skills including written submissions, oral argument at case assessment, and strategic use of expert evidence.', externalDisclaimer: 'This event is organised and managed by Law Society NSW. Ethika is not responsible for event content, scheduling, or attendance tracking.' },
      ],
      aiSummary: [
        'You have completed 6 of 10 required Law Society CPD points (60%) for the 2026/27 practising year — on track with 11 months remaining.',
        'Risk & Compliance and Governance are complete. Remaining points should be split between Legal & Regulatory (2 pts) and Professional Skills (2 pts).',
        'Your highest-priority skills gap is AI Governance for regulated entities — the AICD workshop is a 94% match and aligns to the new internal AI use policy.',
        'Privacy Act reform is an emerging board topic — the IAPP workshop on 6 May will anchor your readiness briefings to the Risk & Compliance Committee.',
      ],
      aiActions: [
        { priority: 'High', title: 'Enrol in AI governance workshop', desc: '94% match for your biggest skills gap and directly supports the AI use policy now under committee review.' },
        { priority: 'High', title: 'Attend Privacy Act reform workshop (6 May)', desc: 'Anchors board and Risk & Compliance Committee readiness briefings for the Privacy Act reform rollout.' },
        { priority: 'Medium', title: 'Close Workers Compensation Scheme module', desc: 'Reinforces knowledge base ahead of icare NSW agent scheme renewal negotiations and SIRA audit response.' },
        { priority: 'Low', title: 'Log IAPP ANZ roundtable attendance', desc: 'Attended the Mar 28 IAPP ANZ in-house counsel roundtable — 1 CPD point not yet recorded.' },
      ],
      learningGoals: [
        { label: 'Complete Law Society CPD year (10 pts)', due: 'Mar 31, 2027' },
        { label: 'Enrol in AI governance workshop', due: 'Jun 11' },
        { label: 'Complete Workers Compensation masterclass', due: 'Jun 24' },
        { label: 'Attend AFCA annual insurance update', due: 'Jun 04' },
      ],
      activeJourney: {
        name: 'In-House Counsel — Regulated Financial Services Pathway',
        timeline: '12 months',
        description: 'A curated pathway for in-house counsel supporting a regulated claims administrator. Work through at your own pace.',
        elements: [
          { id: 'e1', title: 'FAR Fundamentals for accountable persons', description: 'Module covering the Financial Accountability Regime including accountability statements and reasonable steps.' },
          { id: 'e2', title: 'Read: CPS 230 Prudential Practice Guide', description: 'Review the APRA Prudential Practice Guide for CPS 230 and the material service provider framework.' },
          { id: 'e3', title: 'Privacy Act reform readiness assessment', description: 'Assess the GB privacy framework against incoming Privacy Act reforms and identify uplift areas.' },
          { id: 'e4', title: 'AFCA advocacy essentials', description: 'Core course on AFCA case assessment, submissions and determination management.' },
          { id: 'e5', title: 'Observe AFCA case assessment conference', description: 'Attend an AFCA case assessment conference. Note advocacy approach and evidentiary practices.' },
          { id: 'e6', title: 'AI governance workshop', description: 'AICD workshop on AI governance frameworks for regulated entities.' },
          { id: 'e7', title: 'Modern Slavery Statement preparation', description: 'Participate in the FY26 Modern Slavery Statement preparation cycle.' },
        ],
      },
      knowledgeItems: [
        { id: 'k1', type: 'regulatory', title: 'ASIC RG 270 refresh — whistleblower program expectations', snippet: 'Updated expectations for whistleblower programs including governance, investigations and reporting. Review impact on GB\'s program.', source: 'Ethika Insights', readTime: '5 min read', isNew: true },
        { id: 'k2', type: 'insight', title: 'Privacy Act reform: what in-house teams need to do now', snippet: 'Practical roadmap for in-house counsel preparing for Privacy Act reform including PIAs and vendor renegotiation priorities.', source: 'Ethika Academy', readTime: '6 min read', isNew: true },
        { id: 'k3', type: 'thought-leadership', title: 'AI in claims handling — governance expectations', snippet: 'How regulated insurers and claims administrators are approaching AI governance as vendor AI features proliferate.', source: 'GRC Institute', readTime: '7 min read', isNew: false },
        { id: 'k4', type: 'community', title: 'Peer discussion: AFCA case assessment strategies', snippet: 'Insights from the in-house counsel roundtable on AFCA case assessment and early resolution tactics.', source: 'Community', readTime: '3 min read', isNew: false },
      ],
      practicalResources: [
        { id: 'r1', title: 'Vendor MSA Template', description: 'GB standard Master Services Agreement template aligned to CPS 230.', type: 'Template' },
        { id: 'r2', title: 'NDB Playbook', description: 'Step-by-step playbook for OAIC Notifiable Data Breach assessment.', type: 'Playbook' },
        { id: 'r3', title: 'AFCA Defence Framework', description: 'Framework for AFCA complaint defence in insurance disputes.', type: 'Playbook' },
        { id: 'r4', title: 'Modern Slavery Statement Template', description: 'GB Modern Slavery Statement template aligned to mandatory criteria.', type: 'Template' },
        { id: 'r5', title: 'Legal Intake Form', description: 'Standard intake form for business unit legal requests.', type: 'Template' },
        { id: 'r6', title: 'CPD Activity Log', description: 'Record template for tracking Law Society CPD activities.', type: 'Template' },
      ],
      skillsProfile: {
        overallScore: 68,
        lastAssessedDate: 'Mar 2026',
        skills: [
          { id: 'sk1', label: 'Financial Accountability Regime (FAR)', category: 'mandatory', level: 'Advanced', targetLevel: 'Advanced', dots: 4, source: 'AICD · Law Society', status: 'Proficient', description: 'FAR application to regulated insurers and claims administrators including accountability statements and reasonable steps.', lastActivity: 'Mar 2026' },
          { id: 'sk2', label: 'APRA CPS 230 & CPS 234', category: 'mandatory', level: 'Intermediate', targetLevel: 'Advanced', dots: 3, source: 'GRC Institute', status: 'Developing', description: 'APRA prudential standards for operational risk management and information security.', lastActivity: 'Feb 2026' },
          { id: 'sk3', label: 'Privacy Act 1988 & APPs', category: 'mandatory', level: 'Advanced', targetLevel: 'Advanced', dots: 4, source: 'OAIC · IAPP', status: 'Proficient', description: 'Privacy Act 1988, APPs and Notifiable Data Breach scheme applied to claims data and health information.', lastActivity: 'Apr 2026' },
          { id: 'sk4', label: 'General Insurance Code of Practice', category: 'mandatory', level: 'Advanced', targetLevel: 'Advanced', dots: 4, source: 'Law Society', status: 'Proficient', description: 'General Insurance Code of Practice including vulnerable customer obligations and attestation.', lastActivity: 'Feb 2026' },
          { id: 'sk5', label: 'AFCA Advocacy', category: 'mandatory', level: 'Proficient', targetLevel: 'Advanced', dots: 3, source: 'Law Society · AFCA', status: 'Developing', description: 'Advocacy across AFCA case management, case assessment and determination processes for insurance disputes.', lastActivity: 'Mar 2026' },
          { id: 'sk6', label: 'AI Governance for Regulated Entities', category: 'personal', level: 'Beginner', targetLevel: 'Intermediate', dots: 1, source: 'AICD', status: 'Gap', description: 'Governance frameworks for AI adoption in regulated claims and insurance operations.', lastActivity: 'Jan 2026' },
          { id: 'sk7', label: 'Modern Slavery & Supply Chain ESG', category: 'personal', level: 'Intermediate', targetLevel: 'Proficient', dots: 2, source: 'AHRC', status: 'Developing', description: 'Modern Slavery Act reporting and broader supply chain human rights due diligence.', lastActivity: 'Feb 2026' },
          { id: 'sk8', label: 'Whistleblower Regime & Investigations', category: 'mandatory', level: 'Proficient', targetLevel: 'Advanced', dots: 3, source: 'ASIC · Law Society', status: 'Developing', description: 'Corporations Act Part 9.4AAA whistleblower regime and investigation practice.', lastActivity: 'Mar 2026' },
        ],
        milestones: [
          { date: 'Mar 2026', skillId: 'sk1', event: 'AICD Directors\' Duties Masterclass — certified', type: 'certification', points: 3 },
          { date: 'Feb 2026', skillId: 'sk4', event: 'General Insurance Code 2026 refresh — certified', type: 'certification', points: 2 },
          { date: 'Jan 2026', skillId: 'sk2', event: 'CPS 230 Fundamentals — complete', type: 'completion', points: 2 },
          { date: 'Dec 2025', skillId: 'sk3', event: 'AUSTRAC AML/CTF 2026 update — complete', type: 'completion', points: 1.5 },
          { date: 'Oct 2025', skillId: 'sk1', event: 'AICD Directors\' Duties foundational — complete', type: 'completion', points: 2 },
          { date: 'Aug 2025', skillId: 'sk5', event: 'AFCA advocacy essentials — module complete', type: 'completion', points: 2 },
        ],
        scoreBreakdown: [
          { label: 'Scenario Assessment', weight: 40, score: 72 },
          { label: 'Course Completion', weight: 20, score: 80 },
          { label: 'Work Signals', weight: 20, score: 65 },
          { label: 'Org Config', weight: 20, score: 55 },
          { label: 'Self-Assessment', weight: 0, score: 70 },
        ],
        evidence: {
          sk1: {
            sources: [
              { signal: 'Course Completion', detail: 'AICD Directors\' Duties Masterclass — Certified (92%)', weight: 'High' },
              { signal: 'Scenario Assessment', detail: 'Scored 85/100 on FAR accountability scenarios', weight: 'High' },
              { signal: 'Work Signal', detail: 'Led FAR accountability statement refresh for 5 accountable persons', weight: 'High' },
            ],
            cpdBodies: ['AICD', 'Law Society NSW'],
            recommendedAction: 'Maintain proficiency — consider presenting at AICD regional event.',
          },
          sk2: {
            sources: [
              { signal: 'Course Completion', detail: 'CPS 230 Fundamentals — Complete (78%)', weight: 'Medium' },
              { signal: 'Work Signal', detail: 'Drafted 6 CPS 230 aligned MSAs in last 6 months', weight: 'Medium' },
            ],
            cpdBodies: ['GRC Institute'],
            recommendedAction: 'Enrol in CPS 230 — One Year On webinar (May 2026) to reach Advanced.',
          },
          sk3: {
            sources: [
              { signal: 'Scenario Assessment', detail: 'Scored 90/100 on Privacy Act and NDB scenarios', weight: 'High' },
              { signal: 'Work Signal', detail: 'Led 4 NDB assessments and 2 OAIC liaison matters', weight: 'High' },
            ],
            cpdBodies: ['OAIC', 'IAPP ANZ'],
            recommendedAction: 'Maintain proficiency — attend IAPP ANZ annual summit.',
          },
          sk4: {
            sources: [
              { signal: 'Course Completion', detail: 'General Insurance Code 2026 refresh — Certified (88%)', weight: 'High' },
              { signal: 'Work Signal', detail: '12 Code-related attestations and reviews completed', weight: 'High' },
            ],
            cpdBodies: ['Law Society NSW'],
            recommendedAction: 'Maintain certification currency — next Code refresh expected Q4 2026.',
          },
          sk5: {
            sources: [
              { signal: 'Course Completion', detail: 'AFCA Advocacy Essentials — Complete (74%)', weight: 'Medium' },
              { signal: 'Work Signal', detail: '9 AFCA matters under management this year', weight: 'Medium' },
            ],
            cpdBodies: ['Law Society NSW', 'AFCA'],
            recommendedAction: 'Attend AFCA Advocacy Skills Intensive to reach Advanced.',
          },
          sk6: {
            sources: [
              { signal: 'Work Signal', detail: 'Drafted AI Use Policy v0.9 for Risk & Compliance Committee', weight: 'Medium' },
            ],
            cpdBodies: ['AICD'],
            recommendedAction: 'Critical gap — enrol in AI Governance for Regulated Entities workshop.',
          },
          sk7: {
            sources: [
              { signal: 'Course Completion', detail: 'Modern Slavery Reporting — Intermediate (65%)', weight: 'Medium' },
              { signal: 'Work Signal', detail: 'Leading FY26 Modern Slavery Statement preparation', weight: 'Medium' },
            ],
            cpdBodies: ['AHRC'],
            recommendedAction: 'Attend Modern Slavery Reporting Year 7 seminar.',
          },
          sk8: {
            sources: [
              { signal: 'Course Completion', detail: 'Whistleblower Regime Essentials — Complete (80%)', weight: 'High' },
              { signal: 'Work Signal', detail: 'Led Claims Ops whistleblower investigation and ASIC RG 270 alignment', weight: 'High' },
            ],
            cpdBodies: ['ASIC', 'Law Society NSW'],
            recommendedAction: 'Complete advanced investigations accreditation for Advanced level.',
          },
        },
        closeGapRecommendations: {
          sk2: {
            learning: [
              { title: 'CPS 230 — One Year On', type: 'webinar', cpdPoints: 2.5, matchScore: 92, provider: 'GRC Institute' },
              { title: 'Operational Resilience for Insurers', type: 'course', cpdPoints: 3, matchScore: 82, provider: 'AICD' },
            ],
            assessments: [
              { title: 'CPS 230 Scenario Assessment', questions: 8, estimatedTime: '15 min' },
            ],
            events: [
              { title: 'APRA supervisory insights briefing', date: '2026-05-21', time: '9:00 AM – 11:30 AM', cpdPoints: 2.5, provider: 'GRC Institute' },
            ],
          },
          sk5: {
            learning: [
              { title: 'AFCA Advocacy Skills Intensive', type: 'workshop', cpdPoints: 4, matchScore: 88, provider: 'Law Society NSW' },
              { title: 'Insurance Disputes — Expert Evidence', type: 'course', cpdPoints: 2, matchScore: 78, provider: 'Law Society NSW' },
            ],
            assessments: [
              { title: 'AFCA Advocacy Assessment', questions: 6, estimatedTime: '12 min' },
            ],
            events: [
              { title: 'AFCA Annual Update — Insurance', date: '2026-06-04', time: '1:00 PM – 3:00 PM', cpdPoints: 2, provider: 'AFCA' },
            ],
          },
          sk6: {
            learning: [
              { title: 'AI Governance for Regulated Entities', type: 'workshop', cpdPoints: 2.5, matchScore: 94, provider: 'AICD' },
              { title: 'AI Model Risk Management', type: 'course', cpdPoints: 2, matchScore: 82, provider: 'GRC Institute' },
            ],
            assessments: [
              { title: 'AI Governance Assessment', questions: 8, estimatedTime: '15 min' },
            ],
            events: [
              { title: 'AI Governance Leaders Forum', date: '2026-06-11', time: '10:00 AM – 12:30 PM', cpdPoints: 2.5, provider: 'AICD' },
            ],
          },
          sk7: {
            learning: [
              { title: 'Modern Slavery Reporting — Year 7', type: 'seminar', cpdPoints: 2, matchScore: 88, provider: 'AHRC' },
              { title: 'Supply Chain Human Rights Due Diligence', type: 'course', cpdPoints: 3, matchScore: 80, provider: 'AHRC' },
            ],
            assessments: [
              { title: 'Modern Slavery Assessment', questions: 6, estimatedTime: '12 min' },
            ],
            events: [
              { title: 'Modern Slavery Benchmark Launch', date: '2026-07-15', time: '10:00 AM – 12:00 PM', cpdPoints: 2, provider: 'AHRC' },
            ],
          },
        },
        certificates: [
          { journeyName: 'AICD Directors\' Duties', skillId: 'sk1', issuedDate: 'Mar 2026', capabilityScore: 92, status: 'claimed' },
          { journeyName: 'General Insurance Code of Practice', skillId: 'sk4', issuedDate: 'Feb 2026', capabilityScore: 88, status: 'claimed' },
        ],
        assessmentQuestions: {
          sk6: [
            { question: 'Which regulator has issued expectations on AI in regulated financial services that most directly impact claims administrators?', options: ['OAIC', 'APRA', 'Both APRA and ASIC', 'AUSTRAC only'], correct: 2, explanation: 'Both APRA and ASIC have issued expectations on AI governance, model risk and disclosure — relevant across prudential and conduct regulation.' },
            { question: 'What is the primary purpose of an AI use register for an in-house legal team?', options: ['To track vendor invoices', 'To record permitted tools, data categories and oversight owners', 'To meet tax reporting', 'To support marketing'], correct: 1, explanation: 'An AI use register documents permitted tools, data categories, use cases and oversight owners, and supports disclosure and model risk management.' },
            { question: 'Which of the following is a core element of an AI governance framework?', options: ['Only technology controls', 'Policy, oversight forum, risk assessment, and disclosure', 'Marketing approvals', 'HR performance management'], correct: 1, explanation: 'A core AI governance framework includes policy, an oversight forum, risk assessment and disclosure — cutting across policy, operational and risk management layers.' },
          ],
          sk7: [
            { question: 'How many mandatory reporting criteria must a Modern Slavery Statement address under the Modern Slavery Act 2018 (Cth)?', options: ['5', '6', '7', '9'], correct: 2, explanation: 'The Modern Slavery Act 2018 (Cth) sets out 7 mandatory reporting criteria for modern slavery statements.' },
            { question: 'What is the primary focus of risk assessment under the mandatory criteria?', options: ['Employee salaries', 'Modern slavery risks in operations and supply chains', 'Market share', 'Brand recognition'], correct: 1, explanation: 'Risk assessment under the mandatory criteria focuses on modern slavery risks in an entity\'s operations and supply chains.' },
            { question: 'What does "effectiveness" in the mandatory criteria require?', options: ['Financial ROI of the statement', 'Assessment of the effectiveness of actions taken', 'Board attendance', 'External PR metrics'], correct: 1, explanation: 'Criterion 6 requires reporting entities to describe how they assess the effectiveness of actions being taken to address modern slavery risks.' },
          ],
        },
        roleProgression: {
          currentRole: 'Senior Legal Counsel',
          targetRole: 'Deputy General Counsel',
          progress: 68,
          requiredSkills: ['sk1', 'sk2', 'sk3', 'sk4', 'sk5', 'sk8'],
          metSkills: ['sk1', 'sk3', 'sk4'],
        },
        complianceStatus: {
          mandatoryMet: 4,
          mandatoryTotal: 6,
          nextDeadline: 'Mar 31, 2027',
          regimeSummary: [
            { regime: 'Law Society NSW', status: 'On Track', progress: 60 },
            { regime: 'AICD', status: 'On Track', progress: 75 },
          ],
        },
        crossSpaceSignals: [
          { skillId: 'sk2', source: 'Insights', event: 'APRA CPS 230 one-year supervisory themes published', date: 'Apr 2026' },
          { skillId: 'sk3', source: 'Comply', event: 'Motor claims privacy incident logged — NDB assessment in progress', date: 'Apr 2026' },
        ],
      },
      teamCapability: {
        teamAvgScore: 64,
        percentMeetingRequired: 72,
        totalSkillsTracked: 8,
        lastAssessmentCycle: 'Mar 2026',
        teamGaps: [
          { skillId: 'sk6', label: 'AI Governance for Regulated Entities', membersBelow: 7, targetLevel: 'Intermediate' },
          { skillId: 'sk2', label: 'APRA CPS 230 & CPS 234', membersBelow: 5, targetLevel: 'Advanced' },
          { skillId: 'sk5', label: 'AFCA Advocacy', membersBelow: 4, targetLevel: 'Advanced' },
        ],
        members: [
          { id: 1, name: 'Sarah Bennett', initials: 'SB', role: 'General Counsel', overallScore: 86, topGap: 'AI Governance', lastAssessed: 'Mar 2026', skills: { sk1: 4, sk2: 3, sk3: 4, sk4: 4, sk5: 3, sk6: 2, sk7: 3, sk8: 4 }, targetRole: 'Group GC', roleProgress: 78 },
          { id: 2, name: 'David Park', initials: 'DP', role: 'Deputy General Counsel', overallScore: 80, topGap: 'AI Governance', lastAssessed: 'Mar 2026', skills: { sk1: 4, sk2: 4, sk3: 3, sk4: 4, sk5: 2, sk6: 1, sk7: 3, sk8: 3 }, targetRole: 'General Counsel', roleProgress: 72 },
          { id: 3, name: 'Karen Liu', initials: 'KL', role: 'Senior Legal Counsel', overallScore: 72, topGap: 'CPS 230', lastAssessed: 'Feb 2026', skills: { sk1: 3, sk2: 2, sk3: 3, sk4: 4, sk5: 4, sk6: 1, sk7: 2, sk8: 3 }, targetRole: 'Deputy GC', roleProgress: 60 },
          { id: 4, name: 'James Walker', initials: 'JW', role: 'Senior Legal Counsel', overallScore: 74, topGap: 'AI Governance', lastAssessed: 'Mar 2026', skills: { sk1: 3, sk2: 4, sk3: 3, sk4: 3, sk5: 3, sk6: 2, sk7: 2, sk8: 3 }, targetRole: 'Deputy GC', roleProgress: 58 },
          { id: 5, name: 'Priya Nair', initials: 'PN', role: 'Privacy Officer & Senior Counsel', overallScore: 78, topGap: 'CPS 230', lastAssessed: 'Mar 2026', skills: { sk1: 3, sk2: 3, sk3: 4, sk4: 3, sk5: 2, sk6: 2, sk7: 2, sk8: 3 }, targetRole: 'Deputy GC', roleProgress: 55 },
          { id: 6, name: 'Marcus Reid', initials: 'MR', role: 'Senior Counsel (Regulatory)', overallScore: 82, topGap: 'Modern Slavery', lastAssessed: 'Feb 2026', skills: { sk1: 4, sk2: 4, sk3: 3, sk4: 3, sk5: 3, sk6: 2, sk7: 1, sk8: 3 }, targetRole: 'Deputy GC', roleProgress: 65 },
          { id: 7, name: 'Rachel Lee', initials: 'RL', role: 'Legal Counsel (Employment)', overallScore: 58, topGap: 'AI Governance', lastAssessed: 'Feb 2026', skills: { sk1: 2, sk2: 2, sk3: 3, sk4: 2, sk5: 3, sk6: 1, sk7: 2, sk8: 2 }, targetRole: 'Senior Counsel', roleProgress: 48 },
          { id: 8, name: 'Aisha Okonkwo', initials: 'AO', role: 'Legal Counsel (ESG)', overallScore: 55, topGap: 'CPS 230', lastAssessed: 'Feb 2026', skills: { sk1: 2, sk2: 2, sk3: 3, sk4: 2, sk5: 2, sk6: 2, sk7: 4, sk8: 2 }, targetRole: 'Senior Counsel', roleProgress: 45 },
          { id: 9, name: 'Tom Barker', initials: 'TB', role: 'Legal Operations Manager', overallScore: 52, topGap: 'AFCA Advocacy', lastAssessed: 'Mar 2026', skills: { sk1: 2, sk2: 3, sk3: 2, sk4: 2, sk5: 1, sk6: 2, sk7: 2, sk8: 2 }, targetRole: 'Head of Legal Ops', roleProgress: 55 },
        ],
        skillDistribution: [
          { skillId: 'sk1', label: 'Financial Accountability Regime (FAR)', avgDots: 3.0, meetingTarget: 78, criticalGap: false },
          { skillId: 'sk2', label: 'APRA CPS 230 & CPS 234', avgDots: 3.0, meetingTarget: 55, criticalGap: false },
          { skillId: 'sk3', label: 'Privacy Act & APPs', avgDots: 3.1, meetingTarget: 78, criticalGap: false },
          { skillId: 'sk4', label: 'General Insurance Code of Practice', avgDots: 3.0, meetingTarget: 78, criticalGap: false },
          { skillId: 'sk5', label: 'AFCA Advocacy', avgDots: 2.6, meetingTarget: 55, criticalGap: false },
          { skillId: 'sk6', label: 'AI Governance for Regulated Entities', avgDots: 1.7, meetingTarget: 22, criticalGap: true },
          { skillId: 'sk7', label: 'Modern Slavery & Supply Chain ESG', avgDots: 2.3, meetingTarget: 44, criticalGap: false },
          { skillId: 'sk8', label: 'Whistleblower Regime & Investigations', avgDots: 2.8, meetingTarget: 67, criticalGap: false },
        ],
      },
    },

    // ── Skills Settings ──────────────────────────────────────
    skillsSettings: {
      assessmentsRequired: 'required-by-role',
      assessmentSchedule: 'annual',
      dueDateReminders: true,
      matrixSource: 'custom',
      customMatrix: { fileName: 'gb-legal-skills-matrix.csv', uploadDate: 'Mar 18, 2026', roles: 7, skills: 14 },
      teamVisibility: 'individual-aggregate',
    },

    // ── Govern ───────────────────────────────────────────────
    govern: {
      aiPoints: [
        'Governance score is 91% — Risk & Compliance Committee charter refresh and delegated authority register re-attestation are the two outstanding items.',
        'All directors have signed refreshed deeds of indemnity and the FY26 conflict declarations are complete.',
        'FAR accountability statements were updated in January 2026 — next review cycle is September 2026 in line with ASIC guidance.',
        'Next Risk & Compliance Committee meeting is in 8 days — privacy incident, AFS licence and AI policy are on the standing agenda.',
        'Duties handbook for accountable persons was last reviewed 7 months ago — annual refresh is due within 5 months.',
      ],
      aiActions: [
        { priority: 'High', title: 'Finalise Risk & Compliance Committee charter refresh', desc: 'Refreshed charter is due for board approval 15 May. Sarah Bennett to circulate working draft this week.' },
        { priority: 'High', title: 'Delegated authority register re-attestation', desc: 'Two business units (Procurement, Self-Insurance Services) have not re-attested. Chase this week.' },
        { priority: 'Medium', title: 'Prepare committee pre-reading', desc: 'Risk & Compliance Committee in 8 days — 3 papers need to be circulated to members this week.' },
        { priority: 'Low', title: 'Schedule duties handbook review', desc: 'Annual review due in 5 months. Book a working session with legal leadership team.' },
      ],
      priorities: [
        { label: 'Risk & Compliance Committee charter refresh', urgency: 'High', due: '15 May' },
        { label: 'Chase delegated authority re-attestations (2 BUs)', urgency: 'High', due: 'This week' },
        { label: 'Circulate Risk & Compliance Committee papers', urgency: 'Medium', due: 'This week' },
        { label: 'Quarterly conflict register refresh', urgency: 'Medium', due: 'May 31' },
        { label: 'Schedule duties handbook review', urgency: 'Low', due: 'Sep 2026' },
      ],
      kpis: [
        { label: 'Board Health Score', value: '91%', delta: '+0.9%', dir: 'up', primary: true },
        { label: 'Upcoming Meetings', value: '5', delta: '+2', dir: 'up' },
        { label: 'Policies on Track', value: '86%', delta: '+1%', dir: 'up' },
        { label: 'Open Actions', value: '6', delta: '-1', dir: 'up', invert: true },
      ],
      boards: [
        { id: 'au',              name: 'GB Australia Board',          description: 'Oversees Gallagher Bassett Australia entity strategy, performance and APRA/ASIC obligations.', icon: 'flag-au', accent: 'brand',  memberCount: 8, members: [{ name: 'Tom Barker', initials: 'TB' }, { name: 'Sarah Bennett', initials: 'SB' }, { name: 'Michael Tan', initials: 'MT' }, { name: 'Priya Raman', initials: 'PR' }], cadence: 'Monthly',    nextMeeting: '30 Apr 2026', tasks: 4, overdue: 1, resolutions: 3 },
        { id: 'nz',              name: 'GB New Zealand Board',        description: 'Oversees the New Zealand entity, regulatory licences and local market strategy.',              icon: 'flag-nz', accent: 'amber',  memberCount: 6, members: [{ name: 'Sarah Bennett', initials: 'SB' }, { name: 'Priya Raman', initials: 'PR' }, { name: 'Tom Barker', initials: 'TB' }],                                                                     cadence: 'Bi-monthly', nextMeeting: '15 May 2026', tasks: 2, overdue: 0, resolutions: 1 },
        { id: 'risk-compliance', name: 'Risk & Compliance Committee', description: 'Reviews enterprise risk, regulatory obligations and CPS 230 operational resilience posture.',  icon: 'Users',   accent: 'slate',  memberCount: 6, members: [{ name: 'Sarah Bennett', initials: 'SB' }, { name: 'Priya Raman', initials: 'PR' }, { name: 'Tom Barker', initials: 'TB' }],                                                                     cadence: 'Quarterly',  nextMeeting: '08 May 2026', tasks: 3, overdue: 0, resolutions: 1 },
        { id: 'audit',           name: 'Audit Committee',             description: 'Oversees financial reporting integrity, internal audit plan and external auditor engagement.',  icon: 'Users',   accent: 'indigo', memberCount: 4, members: [{ name: 'Michael Tan', initials: 'MT' }, { name: 'Tom Barker', initials: 'TB' }, { name: 'Priya Raman', initials: 'PR' }],                                                                       cadence: 'Quarterly',  nextMeeting: '22 May 2026', tasks: 2, overdue: 0, resolutions: 0 },
      ],
      currentUserBoardIds: ['au', 'nz', 'risk-compliance', 'audit'],
      boardsCommittees: [
        { id: 'board',      name: 'Board',                  type: 'Board',     jurisdiction: 'Australia', memberCount: 8, nextMeeting: '30 Apr 2026', health: 'green' },
        { id: 'audit-cmte', name: 'Audit Committee',        type: 'Committee', jurisdiction: 'Group',     memberCount: 4, nextMeeting: '22 May 2026', health: 'green' },
        { id: 'risk-cmte',  name: 'Risk Committee',         type: 'Committee', jurisdiction: 'Group',     memberCount: 6, nextMeeting: '08 May 2026', health: 'amber' },
        { id: 'rem-cmte',   name: 'Remuneration Committee', type: 'Committee', jurisdiction: 'Group',     memberCount: 5, nextMeeting: '14 May 2026', health: 'green' },
      ],
    },

    // ── Comply ───────────────────────────────────────────────
    comply: {
      aiPoints: [
        'Compliance score is 93% — the motor claims privacy incident, SIRA NSW audit response and AFS licence variation are the three active workstreams.',
        'All Privacy Act and APP attestations are current across the 13 business units.',
        'General Insurance Code of Practice attestation is on track for 30 June sign-off; evidence collection is 70% complete.',
        'CPS 230 material service provider register is current — 2 vendors added this quarter following the vendor MSA consolidation programme.',
        'AUSTRAC AML/CTF program review completed in March 2026 — no material findings, 2 minor recommendations accepted.',
      ],
      aiActions: [
        { priority: 'High', title: 'OAIC NDB determination — motor claims', desc: 'Complete eligible data breach determination before Fri 24 Apr. Brief GC and prepare contingent notification package.' },
        { priority: 'High', title: 'SIRA NSW audit response sampling pack', desc: 'Evidence pack for SIRA sampling requires Claims Operations sign-off by Fri 25 Apr. Escalate to COO if not cleared by Thursday.' },
        { priority: 'Medium', title: 'Complete General Insurance Code evidence pack', desc: 'Final 30% of evidence required for Jun 30 attestation. Focus on vulnerable customer and claims handling timeframes.' },
        { priority: 'Low', title: 'Quarterly compliance dashboard', desc: 'Q4 FY26 dashboard due for Risk & Compliance Committee in June. Tom Barker to start data collection.' },
      ],
      priorities: [
        { label: 'Complete OAIC NDB determination', urgency: 'High', due: 'Fri 24 Apr' },
        { label: 'SIRA audit response — evidence pack', urgency: 'High', due: 'Fri 25 Apr' },
        { label: 'Close General Insurance Code evidence gaps', urgency: 'Medium', due: '30 Jun' },
        { label: 'Refresh delegated authority register', urgency: 'Medium', due: 'Month-end' },
      ],
      kpis: [
        { label: 'Compliance Score', value: '93%', delta: '+1.4%', dir: 'up', primary: true },
        { label: 'Open Items', value: '9', delta: '-2', dir: 'up' },
        { label: 'NDB Matters (12mo)', value: '3', delta: '+1', dir: 'flat' },
        { label: 'Regulator Enquiries', value: '6', delta: '+2', dir: 'flat' },
      ],
    },

    // ── Contracts ───────────────────────────────────────────
    contracts: {
      aiPoints: [
        '7 high-materiality agreements are under active negotiation — scheme agent, vendor MSAs and a broker panel renewal dominate the pipeline.',
        'icare NSW agent scheme renewal is the highest-value negotiation; fee structure and performance-adjustment clauses are the critical path items.',
        'Azure cloud MSA includes CPS 230 material service provider obligations and data localisation clauses — board approval required before signature.',
        'Broker panel agreement renewal is approaching — 5 of 7 panel brokers have signed; 2 require escalated engagement.',
        'Vendor MSA consolidation programme has retired 12 legacy agreements this quarter, reducing contract register by 14%.',
      ],
      aiActions: [
        { priority: 'High', title: 'icare NSW scheme renewal — terms', desc: 'Settle fee structure and performance-adjustment clauses before 10 May underwriting gate. David Park to lead.' },
        { priority: 'High', title: 'Azure MSA board paper', desc: 'Board approval for Azure cloud MSA required before signature. James Walker to draft board paper this week.' },
        { priority: 'Medium', title: 'Broker panel agreement — outstanding signatories', desc: '2 panel brokers require escalated engagement. Tom Barker to reach out to broker principals.' },
        { priority: 'Low', title: 'Close vendor MSA consolidation programme', desc: 'Programme is 85% complete. Finalise remaining 6 legacy agreements before end of FY26.' },
      ],
    },

    // ── Conflict ────────────────────────────────────────────
    conflict: {
      aiPoints: [
        '5 potential conflicts identified this quarter — 2 board director interests, 2 legal team personal relationships, 1 external counsel panel conflict.',
        'Director Bill Moss AO (non-executive) has disclosed a new advisory role with an insurtech vendor being evaluated by Procurement.',
        'External counsel panel firm flagged a conflict on the Victorian claims DD — alternate firm engaged for that workstream.',
        'Personal relationship disclosures have been documented and managed via recusal protocols in line with the conflicts policy.',
        'Conflict screening compliance is 100% for all new matters intake this quarter.',
      ],
      aiActions: [
        { priority: 'High', title: 'Moss insurtech advisory role', desc: 'Director advisory role with a vendor under Procurement evaluation requires board management strategy. Escalate to Chair.' },
        { priority: 'Medium', title: 'Panel firm conflict — Victorian claims DD', desc: 'Alternate panel firm confirmed. Document the conflict and mitigation on the conflict register.' },
        { priority: 'Low', title: 'Quarterly conflict register refresh', desc: 'Annual conflict register refresh is due — all directors, accountable persons and legal team members to re-declare by 31 May.' },
      ],
    },

    // ── Risk ────────────────────────────────────────────────
    risk: {
      aiPoints: [
        '9 legal-adjacent risks on the active register — 2 Critical, 3 High, 3 Medium, 1 Low.',
        'Privacy incident recurrence risk (Critical) — motor claims incident is the second NDB this calendar year. Control uplift required.',
        'Scheme agent dependency risk (Critical) — icare NSW, Comcare and WorkSafe VIC collectively account for 46% of claims volume.',
        'AFS licence variation risk (High) — ASIC request for further information introduces potential conditions.',
        'AI adoption risk (High) — vendor-embedded AI features proliferating in claims platforms; governance uplift required.',
        'CPS 234 key-person risk (Medium) — Priya Nair is the single privacy/infosec legal SME.',
      ],
      aiActions: [
        { priority: 'High', title: 'Privacy control uplift programme', desc: 'Two NDBs this calendar year on motor claims data. IT & InfoSec and Legal to sponsor privacy control uplift programme — board paper due June.' },
        { priority: 'High', title: 'ASIC AFS licence variation response', desc: 'Prepare board-attested response pack by 30 Apr. Marcus Reid to coordinate with Finance and Claims Ops.' },
        { priority: 'Medium', title: 'AI governance uplift', desc: 'AI use policy v1.0 to be approved by Risk & Compliance Committee in June. James Walker to finalise.' },
        { priority: 'Medium', title: 'Scheme agent concentration analysis', desc: 'Scheme agent concentration over 45% of claims volume. Board risk appetite statement to be refreshed to reflect tolerance.' },
      ],
    },

    // ── Incident ────────────────────────────────────────────
    incident: {
      aiPoints: [
        '6 incidents logged this quarter — 2 privacy, 2 claims handling breaches of the General Insurance Code, 1 whistleblower disclosure, 1 employment matter.',
        'Motor claims system privacy incident is the highest-impact matter — OAIC NDB determination in progress.',
        'General Insurance Code timeframe breaches (2) have been self-reported — root cause linked to backlog in Claims Operations following system cutover.',
        'Whistleblower disclosure (Claims Ops) — investigation is in week 3, preliminary findings expected end of May.',
        'Employment incident (Brisbane operations) — unfair dismissal application lodged with the Fair Work Commission.',
      ],
      aiActions: [
        { priority: 'High', title: 'Complete NDB determination', desc: 'Motor claims privacy NDB determination due Fri 24 Apr. Priya Nair leading; containment confirmed.' },
        { priority: 'High', title: 'Claims Ops backlog remediation plan', desc: 'Root-cause remediation plan for Code timeframe breaches due to Risk & Compliance Committee in May.' },
        { priority: 'Medium', title: 'Whistleblower investigation progress update', desc: 'Preliminary investigation findings expected end of May. Sarah Bennett to brief Chair.' },
        { priority: 'Low', title: 'Update incident management SOP', desc: 'Incident management SOP is due for annual refresh. Tom Barker to co-ordinate with Risk function.' },
      ],
    },

    // ── Audit ───────────────────────────────────────────────
    audit: {
      aiPoints: [
        'Internal audit coverage of Legal is 80% — privacy, AFS licence and vendor MSA frameworks have all been audited in the past 12 months.',
        'SIRA NSW scheme audit response is in-flight — evidence sampling pack due by Fri 25 Apr.',
        'External audit of FY26 financial statements commenced in April with Legal providing contingent liability input.',
        'Internal audit has issued 4 recommendations this year — 3 closed, 1 in progress (delegated authority register).',
        'CPS 234 information security audit completed in Q3 FY26 with no material findings.',
      ],
      aiActions: [
        { priority: 'High', title: 'SIRA evidence sampling pack', desc: 'Evidence sampling pack for SIRA NSW audit due Fri 25 Apr. Claims Ops sign-off required by Thursday.' },
        { priority: 'High', title: 'External audit contingent liabilities', desc: 'Contingent liability schedule for external auditors due 5 May. Karen Liu to coordinate matter-by-matter review.' },
        { priority: 'Medium', title: 'Close delegated authority audit recommendation', desc: 'Final internal audit recommendation still open. Re-attestations to close this month.' },
        { priority: 'Low', title: 'FY27 internal audit plan input', desc: 'Provide Legal input to FY27 internal audit plan — focus areas: AI, Modern Slavery, and scheme agent assurance.' },
      ],
      aiMissing: [
        'Claims Ops sign-off on SIRA sampling pack',
        'Updated contingent liability schedule for active litigation',
        'Delegated authority register re-attestation from 2 BUs',
        'Finalised FY27 internal audit plan input',
      ],
      aiExpiring: [
        { label: 'SIRA NSW audit evidence pack', due: 'Apr 25, 2026' },
        { label: 'External audit contingent liabilities schedule', due: 'May 05, 2026' },
        { label: 'General Insurance Code attestation evidence', due: 'Jun 30, 2026' },
        { label: 'CPS 230 annual attestation', due: 'Jul 31, 2026' },
      ],
      aiInsights: [
        'Audit trail on privacy incidents is strong — NDB determinations all documented and linked to OAIC guidance.',
        'SIRA, icare and Comcare scheme audits are increasingly focused on claims handling timeframe evidence — align internal controls accordingly.',
        'FY27 audit plan should contemplate AI governance and scheme agent concentration risk as emerging focus areas.',
        'Code of Practice attestation evidence collection has moved from 4-week sprint to a continuous model — quality and completeness both improving.',
      ],
    },

    // ── Legislation ─────────────────────────────────────────
    legislation: {
      aiPoints: [
        '9 regulatory updates tracked this quarter across financial services, privacy, employment and ESG.',
        'Privacy Act reform — first tranche effective 1 July 2026. Mandatory PIAs and right to erasure have material operational impact.',
        'APRA CPS 230 — one year into operation. APRA has published supervisory themes highlighting tolerance level rigour.',
        'ASIC RG 270 refresh — whistleblower program expectations updated in February 2026.',
        'Fair Work Act 2009 — continuing amendments to casual employment and fixed-term contract regimes.',
        'Modern Slavery Act 2018 review — potential penalty regime under consultation.',
      ],
      aiSuggestions: [
        'Brief Risk & Compliance Committee on Privacy Act reform rollout plan at April standing meeting.',
        'Review GB whistleblower program against refreshed ASIC RG 270 expectations.',
        'Update casual employment and fixed-term contract templates to align with latest Fair Work amendments.',
        'Begin scoping enhanced Modern Slavery Statement disclosures ahead of potential penalty regime.',
      ],
    },

    // ── Respond ─────────────────────────────────────────────
    respond: {
      draftActions: [
        { id: 1, title: 'Draft OAIC NDB assessment — motor claims incident', status: 'Ready for review', time: '12 min ago' },
        { id: 2, title: 'Prepare ASIC AFS licence variation response pack', status: 'In progress', time: '35 min ago' },
        { id: 3, title: 'Generate General Insurance Code evidence summary', status: 'Queued', time: '1 hr ago' },
      ],
      featuredAgents: [
        { id: 1, name: 'NDB Assessment Drafter', description: 'Analyses incident facts against the eligible data breach test and drafts OAIC assessment documentation.', category: 'Privacy & Data' },
        { id: 2, name: 'Regulator Response Writer', description: 'Drafts structured responses to ASIC, APRA, OAIC and SIRA information requests with citation mapping.', category: 'Regulatory' },
        { id: 3, name: 'AFCA Submission Generator', description: 'Prepares AFCA case assessment submissions with evidence mapping and determination risk summary.', category: 'Litigation & Disputes' },
      ],
    },

    // ── MatterDetail ────────────────────────────────────────
    matterDetail: {
      actors: {
        SB: { color: 'bg-brand-800 text-brand-50', name: 'Sarah Bennett' },
        DP: { color: 'bg-teal-600 text-white', name: 'David Park' },
        KL: { color: 'bg-slate-500 text-white', name: 'Karen Liu' },
        JW: { color: 'bg-violet-500 text-white', name: 'James Walker' },
        PN: { color: 'bg-teal-600 text-white', name: 'Priya Nair' },
        MR: { color: 'bg-violet-500 text-white', name: 'Marcus Reid' },
        RL: { color: 'bg-orange-500 text-white', name: 'Rachel Lee' },
        AO: { color: 'bg-rose-500 text-white', name: 'Aisha Okonkwo' },
      },
      tasks: [
        { id: 1, task: 'Complete OAIC NDB eligible data breach determination', assignee: 'PN', due: 'Apr 24', status: 'In Progress', priority: 'Critical' },
        { id: 2, task: 'Draft board attestation for ASIC AFS licence response', assignee: 'MR', due: 'Apr 28', status: 'In Progress', priority: 'Critical' },
        { id: 3, task: 'Settle icare NSW scheme commercial terms', assignee: 'DP', due: 'May 10', status: 'Open', priority: 'High' },
        { id: 4, task: 'Finalise Azure MSA board paper', assignee: 'JW', due: 'Apr 29', status: 'Open', priority: 'High' },
        { id: 5, task: 'Prepare SIRA NSW audit sampling pack', assignee: 'JW', due: 'Apr 25', status: 'Behind', priority: 'Critical' },
        { id: 6, task: 'Respond to AFCA case assessment — motor injury', assignee: 'KL', due: 'May 14', status: 'In Progress', priority: 'High' },
        { id: 7, task: 'Draft position paper — Brisbane unfair dismissal', assignee: 'RL', due: 'May 06', status: 'Open', priority: 'Medium' },
      ],
      risks: [
        { risk: 'Regulator determination — OAIC motor claims NDB', severity: 'Critical', status: 'Open', owner: 'PN' },
        { risk: 'ASIC imposing additional conditions on AFS licence', severity: 'High', status: 'Monitored', owner: 'MR' },
        { risk: 'icare NSW scheme renewal slipping past underwriting gate', severity: 'High', status: 'Open', owner: 'DP' },
        { risk: 'SIRA audit adverse finding on claims handling timeframes', severity: 'Medium', status: 'Mitigated', owner: 'JW' },
        { risk: 'Brisbane unfair dismissal — FWC reinstatement order', severity: 'Medium', status: 'Monitored', owner: 'RL' },
      ],
      documents: [
        { name: 'OAIC NDB Assessment — Motor Claims', type: 'Privacy', date: 'Apr 21', status: 'Draft' },
        { name: 'ASIC AFS Licence Variation Response Pack', type: 'Regulatory', date: 'Apr 19', status: 'Under Review' },
        { name: 'icare NSW Agent Scheme Agreement v4', type: 'Commercial', date: 'Apr 20', status: 'Draft' },
        { name: 'Azure Cloud MSA — Board Paper', type: 'Governance', date: 'Apr 18', status: 'Draft' },
        { name: 'SIRA NSW Audit Evidence Pack', type: 'Regulatory', date: 'Apr 17', status: 'Final' },
      ],
      fileCompleteness: [
        { label: 'Privacy & Incident Response', pct: 85 },
        { label: 'Regulatory Correspondence', pct: 70 },
        { label: 'Commercial Agreements', pct: 75 },
        { label: 'Board & Committee Papers', pct: 90 },
      ],
      timeline: [
        { date: 'Apr 21', text: 'NDB assessment draft prepared — awaiting IT & InfoSec forensic input', actor: 'PN' },
        { date: 'Apr 19', text: 'ASIC AFS licence variation response pack drafted — circulated for internal review', actor: 'MR' },
        { date: 'Apr 18', text: 'Azure cloud MSA — board paper draft circulated with CPS 230 analysis appendix', actor: 'JW' },
        { date: 'Apr 17', text: 'SIRA NSW audit evidence pack finalised — awaiting Claims Ops sign-off', actor: 'JW' },
        { date: 'Apr 15', text: 'Risk & Compliance Committee April pack distributed', actor: 'SB' },
        { date: 'Apr 10', text: 'ASIC liaison pre-discussion held — scope of response clarified', actor: 'MR' },
        { date: 'Apr 03', text: 'Board Risk Committee quarterly — scheme concentration and privacy risk discussed', actor: 'SB' },
      ],
      aiPoints: [
        'The motor claims NDB determination is the dominant task this week — any slip past 24 April breaches statutory timelines.',
        'ASIC AFS licence response pack is near-complete — board attestation is the critical path item before 30 April lodgement.',
        'SIRA NSW audit evidence pack is at 90% — Claims Ops sign-off is the blocking dependency.',
        'icare NSW scheme renewal is on track for the 10 May underwriting gate provided fee structure is settled this fortnight.',
        'External counsel engagement is limited to 3 matters — discipline on in-sourcing the remainder has been maintained.',
      ],
    },

    // ── Insights & Community / Connect ──────────────────────
    // Inherit Ethika Intelligence insights and community/connect content from the default tenant
    // — the same cross-tenant intelligence stream applies to GB in-house legal.

  }, // end pages
}

// Reuse cross-tenant Insights and Community content from default (same Ethika-wide stream)
configs.gallagherbassett.pages.insights = configs.default.pages.insights
configs.gallagherbassett.pages.community = configs.default.pages.community

// ─── Peoplecare (private health insurer — APRA-regulated) ─────────────────────
// Inherits from default for everything except Govern, which is tailored for the
// govteam user overseeing three private health funds: Peoplecare Health Fund,
// OneMediFund, and Reserve Bank Health Society. KPIs reflect APRA CPS 510 / 230
// governance standards instead of the generic legal-firm metrics.
const peoplecareBoards = [
  {
    id: 'peoplecare', name: 'Peoplecare Health Fund', type: 'Board',
    description: 'Restricted-access private health insurer; APRA-regulated under CPS 510 governance standard.',
    icon: 'Building2', accent: 'brand', memberCount: 8,
    members: [
      { name: 'Patricia Hartley', initials: 'PH' },
      { name: 'Anthony Caruso',   initials: 'AC' },
      { name: 'Holly Allen',      initials: 'HA' },
      { name: 'Marcus Elborn',    initials: 'ME' },
    ],
    cadence: 'Monthly', nextMeeting: '14 May 2026',
    tasks: 5, overdue: 1, resolutions: 3,
  },
  {
    id: 'onemedifund', name: 'OneMediFund', type: 'Board',
    description: 'Specialist medical-professional health fund; member of the not-for-profit health insurance group.',
    icon: 'Building2', accent: 'amber', memberCount: 7,
    members: [
      { name: 'Susan Ekanayake', initials: 'SE' },
      { name: 'David Fairhall',  initials: 'DF' },
      { name: 'Holly Allen',     initials: 'HA' },
    ],
    cadence: 'Bi-monthly', nextMeeting: '22 May 2026',
    tasks: 3, overdue: 0, resolutions: 1,
  },
  {
    id: 'rbhs', name: 'Reserve Bank Health Society', type: 'Board',
    description: 'Restricted access fund for current and former Reserve Bank of Australia employees and families.',
    icon: 'Building2', accent: 'indigo', memberCount: 6,
    members: [
      { name: 'Edward Hartness', initials: 'EH' },
      { name: 'Anne Bromley',    initials: 'AB' },
      { name: 'Holly Allen',     initials: 'HA' },
    ],
    cadence: 'Quarterly', nextMeeting: '03 Jun 2026',
    tasks: 4, overdue: 2, resolutions: 0,
  },
  {
    id: 'board-audit-pc', name: 'Board Audit', type: 'Committee',
    description: 'CPS 510 board committee for audit, external assurance and financial reporting.',
    icon: 'Users', accent: 'slate', memberCount: 4,
    cadence: 'Quarterly', nextMeeting: '08 May 2026',
    tasks: 2, overdue: 0, resolutions: 1,
  },
  {
    id: 'board-risk-pc', name: 'Board Risk', type: 'Committee',
    description: 'CPS 510 board committee for enterprise risk and prudential oversight (CPS 230 / CPS 220).',
    icon: 'Users', accent: 'amber', memberCount: 4,
    cadence: 'Quarterly', nextMeeting: '15 May 2026',
    tasks: 3, overdue: 1, resolutions: 0,
  },
  {
    id: 'board-remuneration-pc', name: 'Board Remuneration', type: 'Committee',
    description: 'CPS 510 board committee for executive remuneration and Fit & Proper assessments.',
    icon: 'Users', accent: 'indigo', memberCount: 3,
    cadence: 'Bi-monthly', nextMeeting: '17 May 2026',
    tasks: 1, overdue: 0, resolutions: 0,
  },
]

const peoplecareGovern = {
  activeBoardId: 'all',
  aiPoints: [
    'CPS 510 self-assessment is on track for the June board cycle; two control gaps remain in IT operational risk.',
    'Three policies (Outsourcing, Fit & Proper, Risk Management) lapse in the next 60 days — schedule for the May meeting.',
    'Open audit actions for OneMediFund are trending down (-2 this fortnight) but Reserve Bank Health Society has 4 overdue.',
    'CPS 230 operational risk uplift program is at 62% — material service provider register still requires sign-off.',
  ],
  aiActions: [
    { priority: 'High',   title: 'Approve CPS 510 board attestation',    desc: 'Final draft ready for review ahead of the 14 May Peoplecare board meeting.' },
    { priority: 'High',   title: 'Close out RBHS overdue actions',        desc: '4 actions are past their committed dates; assign clear owners before quarterly review.' },
    { priority: 'Medium', title: 'Refresh Outsourcing Policy',             desc: 'Last reviewed Apr 2024; APRA expects 2-yearly cycle for material outsourcing arrangements.' },
    { priority: 'Low',    title: 'Onboard new RBHS director',              desc: 'Fit & Proper assessment pending HR sign-off; aim for May board induction.' },
  ],
  priorities: [
    { label: 'Sign off Q1 Risk Appetite Statement',         urgency: 'High',   due: 'Due 02 May' },
    { label: 'Confirm CPS 230 implementation plan',          urgency: 'High',   due: 'Due 12 May' },
    { label: 'Review Audit Committee charter',               urgency: 'Medium', due: 'Due 09 May' },
    { label: 'Approve May Peoplecare board pack',            urgency: 'Medium', due: 'Due 14 May' },
    { label: 'Schedule annual fit & proper reviews',         urgency: 'Low',    due: 'Due 30 May' },
  ],
  kpis: [
    { label: 'CPS 510 Governance Score',  value: '92 / 100', delta: '+3',  dir: 'up',   primary: true },
    { label: 'Upcoming Meetings',          value: '4',        delta: '+1',  dir: 'up'    },
    { label: 'APRA Policies on Track',     value: '88%',      delta: '+4%', dir: 'up'    },
    { label: 'Open Actions',               value: '12',       delta: '-2',  dir: 'down', invert: true },
  ],
  boards: peoplecareBoards,
  currentUserBoardIds: peoplecareBoards.map(b => b.id),
  boardsCommittees: [
    { id: 'peoplecare',           name: 'Peoplecare Health Fund',         type: 'Board',     jurisdiction: 'Australia', memberCount: 8, nextMeeting: '14 May 2026', health: 'green' },
    { id: 'onemedifund',          name: 'OneMediFund',                    type: 'Board',     jurisdiction: 'Australia', memberCount: 7, nextMeeting: '22 May 2026', health: 'amber' },
    { id: 'rbhs',                 name: 'Reserve Bank Health Society',    type: 'Board',     jurisdiction: 'Australia', memberCount: 6, nextMeeting: '03 Jun 2026', health: 'red'   },
    { id: 'board-audit-pc',       name: 'Board Audit Committee',          type: 'Committee', jurisdiction: 'Group',     memberCount: 4, nextMeeting: '08 May 2026', health: 'green' },
    { id: 'board-risk-pc',        name: 'Board Risk Committee',           type: 'Committee', jurisdiction: 'Group',     memberCount: 4, nextMeeting: '15 May 2026', health: 'amber' },
    { id: 'board-remuneration-pc', name: 'Board Remuneration Committee',   type: 'Committee', jurisdiction: 'Group',     memberCount: 3, nextMeeting: '17 May 2026', health: 'green' },
  ],
  annualWorkProgram: [
    { id: 'cps-510',        name: 'CPS 510 Annual Governance Review',         regulator: 'APRA', months: [5] },
    { id: 'cps-230',        name: 'Board Risk Appetite Discussion (CPS 230)', regulator: 'APRA', months: [5, 11] },
    { id: 'audit-plan',     name: 'Annual Internal Audit Plan',               regulator: 'APRA', months: [3] },
    { id: 'budget-fy27',    name: 'FY27 Budget Approval',                                        months: [4, 5] },
    { id: 'fit-proper',     name: 'Fit and Proper Annual Reviews',            regulator: 'APRA', months: [6] },
    { id: 'modern-slavery', name: 'Modern Slavery Statement Sign-off',                           months: [9] },
    { id: 'agm',            name: 'Annual General Meeting',                                      months: [11] },
  ],
  meetings: [
    {
      id: 'pc-may-2026',
      name: 'Peoplecare Board — May 2026 Meeting',
      boardId: 'peoplecare',
      dateTime: '14 May 2026, 9:00am',
      type: 'Board',
      status: 'Scheduled',
      attendees: 8,
      minutes: 'Pending',
      integration: { name: 'Diligent', message: 'finalised pack will be pushed automatically on assembly' },
      agenda: [
        { id: 'a-1',  title: 'Apologies and conflicts of interest',          type: 'Information', officer: { name: 'Holly Allen',     initials: 'HA' }, paperStatus: 'In Pack',       source: 'Manual' },
        { id: 'a-2',  title: 'CEO report — May',                              type: 'Information', officer: { name: 'Anthony Caruso',  initials: 'AC' }, paperStatus: 'In Pack',       source: 'From Last Meeting — action' },
        { id: 'a-3',  title: 'CPS 230 operational risk uplift — approval',   type: 'Decision',    officer: { name: 'Marcus Elborn',   initials: 'ME' }, paperStatus: 'In Pack',       source: 'From Risk Register' },
        { id: 'a-4',  title: 'Outsourcing Policy refresh',                    type: 'Decision',    officer: { name: 'Sarah Toscan',    initials: 'ST' }, paperStatus: 'Not Submitted', source: 'From Policy Register',     daysOutstanding: 9,  lastReminderDays: 2, reminderCount: 3 },
        { id: 'a-5',  title: 'Cyber and IT operational risk dashboard',       type: 'Discussion',  officer: { name: 'Anthony Caruso',  initials: 'AC' }, paperStatus: 'Submitted',     source: 'From Risk Register' },
        { id: 'a-6',  title: 'CFO report — financial position to 30 April',  type: 'Information', officer: { name: 'Catherine Pereira', initials: 'CP' }, paperStatus: 'CoSec Review',  source: 'From CFO' },
        { id: 'a-7',  title: 'Member complaints quarterly summary',           type: 'Information', officer: { name: 'Naomi Kapoor',    initials: 'NK' }, paperStatus: 'Not Submitted', source: 'From Member Experience',   daysOutstanding: 4,  lastReminderDays: 1, reminderCount: 1 },
        { id: 'a-8',  title: 'Audit Committee minutes — Q1',                  type: 'Information', officer: { name: 'Patricia Hartley', initials: 'PH' }, paperStatus: 'Not Submitted', source: 'From Audit Committee',     daysOutstanding: 6,  lastReminderDays: 3, reminderCount: 2 },
        { id: 'a-9',  title: 'Annual Internal Audit Plan',                    type: 'Decision',    officer: { name: 'Anthony Caruso',  initials: 'AC' }, paperStatus: 'Not Submitted', source: 'From External advisor',    daysOutstanding: 11, lastReminderDays: 4, reminderCount: 4 },
        { id: 'a-10', title: 'Risk Appetite Statement — annual review',       type: 'Decision',    officer: { name: 'Marcus Elborn',   initials: 'ME' }, paperStatus: 'Not Submitted', source: 'From Risk Register',       daysOutstanding: 7,  lastReminderDays: 2, reminderCount: 2 },
      ],
      aiSuggestions: [
        { id: 's-1', title: 'Modern slavery policy gap identified in March minutes — draft policy?',                       source: 'Minutes (Mar 2026)' },
        { id: 's-2', title: 'Fit and Proper Policy due for board approval this quarter (CPS 510 requirement)',             source: 'APRA CPS 510' },
        { id: 's-3', title: 'CEO delegation of authority pending sign-off for 8 days — follow up? Here is a draft email.', source: 'Outstanding action' },
      ],
    },
    {
      id: 'pc-mar-2026',
      name: 'Peoplecare Board — March 2026 Meeting',
      boardId: 'peoplecare',
      dateTime: '12 Mar 2026, 9:00am',
      type: 'Board',
      status: 'Completed',
      attendees: 8,
      minutes: 'Draft',
      minutesDraft: {
        state: 'Draft',
        draftReadyAfter: '4 minutes',
        confidence: 'High',
        workflow: [
          { id: 'cosec', title: 'Company Secretary — Holly Allen', state: 'in_review' },
          { id: 'ceo',   title: 'CEO Review',                       state: 'pending'   },
          { id: 'chair', title: 'Chair Sign-off',                   state: 'pending'   },
        ],
        sections: [
          {
            id: 's-1', number: 1, title: 'Apologies and conflicts of interest', approved: true,
            paragraphs: [
              [{ text: 'Apologies received from M. Elborn. No conflicts of interest were declared at the opening of the meeting.' }],
            ],
          },
          {
            id: 's-2', number: 2, title: 'Confirmation of previous minutes', approved: true,
            paragraphs: [
              [{ text: 'The minutes of the February 2026 meeting were confirmed as a true and accurate record, on motion of L. Depers, seconded by S. Toscan.' }],
            ],
          },
          {
            id: 's-3', number: 3, title: 'CEO report — March', approved: false,
            paragraphs: [
              [
                { text: 'The Chief Executive presented the monthly performance update. Membership growth ' },
                { text: 'continues to track ahead of plan', kind: 'insert' },
                { text: ', with retention rates broadly stable across the quarter.' },
              ],
            ],
          },
          {
            id: 's-4', number: 4, title: 'CPS 230 operational risk uplift', approved: false,
            highlight: true,
            comment: 'Trained on 47 Peoplecare board minutes — style matched.',
            paragraphs: [
              [{ text: "The Board considered management's update on the CPS 230 operational risk uplift program. The Board noted that critical operations have been mapped and tolerance levels are being finalised, with a dependency map for material service providers expected by 30 June 2026." }],
            ],
          },
          {
            id: 's-5', number: 5, title: 'Risk Appetite Statement — annual review', approved: false,
            paragraphs: [
              [
                { text: 'The Chief Risk Officer walked the Board through the proposed amendments to the Risk Appetite Statement. ' },
                { text: 'After discussion, the Board approved the revised statement subject to minor wording changes', kind: 'insert' },
                { text: ' to be circulated by the Company Secretary.' },
              ],
            ],
          },
          {
            id: 's-6', number: 6, title: 'Other business and close', approved: false,
            paragraphs: [
              [{ text: 'There being no further business, the meeting closed at 11:42am. Next meeting: 14 May 2026.' }],
            ],
          },
        ],
      },
    },
    { id: 'pc-apr-2026',    name: 'Peoplecare Board — April 2026 Meeting', boardId: 'peoplecare',    dateTime: '16 Apr 2026, 9:00am',  type: 'Board',     status: 'Completed', attendees: 8, minutes: 'Final'   },
    { id: 'omf-may-2026',   name: 'OneMediFund Board — May 2026',          boardId: 'onemedifund',   dateTime: '22 May 2026, 10:00am', type: 'Board',     status: 'Scheduled', attendees: 7, minutes: 'Pending' },
    { id: 'rbhs-jun-2026',  name: 'Reserve Bank Health Society — Q2',      boardId: 'rbhs',          dateTime: '03 Jun 2026, 2:00pm',  type: 'Board',     status: 'Scheduled', attendees: 6, minutes: 'Pending' },
    { id: 'audit-may-2026', name: 'Board Audit — May review',              boardId: 'board-audit-pc', dateTime: '08 May 2026, 11:00am', type: 'Committee', status: 'Scheduled', attendees: 4, minutes: 'Pending' },
    { id: 'risk-may-2026',  name: 'Board Risk — May',                       boardId: 'board-risk-pc',  dateTime: '15 May 2026, 9:30am',  type: 'Committee', status: 'Scheduled', attendees: 4, minutes: 'Pending' },
    { id: 'rem-may-2026',   name: 'Board Remuneration — May',               boardId: 'board-remuneration-pc', dateTime: '17 May 2026, 1:00pm', type: 'Committee', status: 'Scheduled', attendees: 3, minutes: 'Pending' },
  ],
  boardPapers: [
    { id: 'pcbp-1', title: 'CFO report — May',                     meetingId: 'pc-may-2026',    agendaId: 'a-6',  boardId: 'peoplecare',    responsibleOfficer: { name: 'Liz Depers',     initials: 'LD' }, stage: 'In Pack',      daysAtStage: 1, blocked: false, readingTime: 12, readStatus: 'Read'   },
    { id: 'pcbp-2', title: 'CEO strategy update',                   meetingId: 'pc-may-2026',    agendaId: 'a-2',  boardId: 'peoplecare',    responsibleOfficer: { name: 'Sarah Toscan',     initials: 'ST' }, stage: 'In Pack',      daysAtStage: 2, blocked: false, readingTime: 18, readStatus: 'Read'   },
    { id: 'pcbp-3', title: 'CPS 230 operational risk uplift paper', meetingId: 'pc-may-2026',    agendaId: 'a-3',  boardId: 'peoplecare',    responsibleOfficer: { name: 'Marcus Elborn',   initials: 'ME' }, stage: 'CoSec Review', daysAtStage: 3, blocked: false, readingTime: 9,  readStatus: 'Unread' },
    {
      id: 'pcbp-4',
      title: 'Risk Appetite Framework — Annual Review',
      meetingId: 'pc-may-2026',
      agendaId: 'a-10',
      boardId: 'peoplecare',
      responsibleOfficer: { name: 'Marcus Elborn', initials: 'ME', role: 'Chief Risk Officer' },
      stage: 'Submitted',
      daysAtStage: 2,
      blocked: false,
      readingTime: 14,
      readStatus: 'Unread',
      flag: { kind: 'warning', message: 'Template issue — click to review' },
      submission: {
        state: 'Returned to Author',
        submittedBy: 'Chief Risk Officer',
        submittedAgo: '2 days ago',
        cosecNotice: 'CoSec notified of return. Holly Allen will be alerted when resubmitted.',
        documentPreview: {
          heading: 'Risk Appetite Framework — Annual Review 2026',
          meta: 'For the May 2026 Peoplecare Health Fund Board Meeting · Prepared by the Chief Risk Officer · 12 May 2026',
          body: [
            '1. Purpose',
            "This paper presents the annual review of the Peoplecare Health Fund Risk Appetite Framework for the period commencing 1 July 2026. It summarises the proposed amendments and seeks the Board's consideration.",
            '2. Background',
            'The Risk Appetite Framework is reviewed annually as required under APRA Prudential Standard CPS 220. Material amendments since the prior year are limited to the operational risk and cyber risk categories, reflecting the CPS 230 uplift program currently in flight…',
          ],
        },
        issues: [
          {
            id: 'i-1',
            severity: 'High',
            label: 'Paper type mismatch',
            body: 'This paper is marked For Information but the agenda item requires a Decision. Please add a board resolution: Resolved that the Board of Peoplecare Health Fund approves the updated Risk Appetite Framework effective 1 July 2026.',
          },
          {
            id: 'i-2',
            severity: 'Medium',
            label: 'Missing section',
            body: 'Executive Summary is a required section before Recommendations.',
          },
          {
            id: 'i-3',
            severity: 'Low',
            label: 'Resolution wording',
            body: 'Use standard form: Resolved that the Board of Peoplecare Health Fund…',
          },
        ],
      },
    },
    { id: 'pcbp-5', title: 'Internal audit findings — Q1',          meetingId: 'audit-may-2026', boardId: 'board-audit-pc', responsibleOfficer: { name: 'Anthony Caruso',      initials: 'AC' }, stage: 'Submitted',    daysAtStage: 4, blocked: false, readingTime: 11, readStatus: 'Unread' },
    { id: 'pcbp-6', title: 'OneMediFund — capital position update', meetingId: 'omf-may-2026',   boardId: 'onemedifund',   responsibleOfficer: { name: 'Naomi Kapoor',        initials: 'NK' }, stage: 'Draft',        daysAtStage: 5, blocked: false, readingTime: 7,  readStatus: 'Unread' },
  ],
  policies: [
    // ── APRA — CPS 510 governance ──────────────────────────────────
    { id: 'pcp-1',  name: 'Board Charter (CPS 510)',                 owner: { name: 'Holly Allen',     initials: 'HA' }, stage: 'Approve',  daysAtStage: 4,  rag: 'amber', status: 'At Risk',  blockingParty: 'Awaiting Chair sign-off',                                                         regulator: 'APRA' },
    { id: 'pcp-2',  name: 'Fit and Proper Policy (CPS 510)',         owner: { name: 'Liz Depers',   initials: 'LD' }, stage: 'Draft',    daysAtStage: 8,  rag: 'green', status: 'On Track', dependsOn: 'Board Charter (CPS 510)',                                                              regulator: 'APRA' },
    { id: 'pcp-3',  name: 'Board Renewal Policy (CPS 510)',          owner: { name: 'Holly Allen',     initials: 'HA' }, stage: 'Identify', daysAtStage: 2,  rag: 'green', status: 'On Track',                                                                                                  regulator: 'APRA' },
    { id: 'pcp-4',  name: 'Remuneration Policy (CPS 511)',           owner: { name: 'Liz Depers',   initials: 'LD' }, stage: 'Review',   daysAtStage: 6,  rag: 'amber', status: 'At Risk',                                                                                                   regulator: 'APRA' },

    // ── APRA — CPS 220 risk management ─────────────────────────────
    { id: 'pcp-5',  name: 'Risk Management Framework (CPS 220)',     owner: { name: 'Marcus Elborn', initials: 'ME' }, stage: 'Publish',  daysAtStage: 1,  rag: 'green', status: 'On Track',                                                                                                  regulator: 'APRA' },
    { id: 'pcp-6',  name: 'Risk Appetite Statement',                  owner: { name: 'Marcus Elborn', initials: 'ME' }, stage: 'Approve',  daysAtStage: 5,  rag: 'amber', status: 'At Risk',  blockingParty: 'Awaiting Board Risk', dependsOn: 'Risk Management Framework (CPS 220)',          regulator: 'APRA' },
    { id: 'pcp-7',  name: 'Stress Testing Policy',                    owner: { name: 'Marcus Elborn', initials: 'ME' }, stage: 'Draft',    daysAtStage: 10, rag: 'green', status: 'On Track', dependsOn: 'Risk Management Framework (CPS 220)',                                                  regulator: 'APRA' },

    // ── APRA — CPS 230 operational risk ───────────────────────────
    { id: 'pcp-8',  name: 'Operational Risk Framework (CPS 230)',    owner: { name: 'Anthony Caruso',    initials: 'AC' }, stage: 'Review',   daysAtStage: 9,  rag: 'amber', status: 'At Risk',                                                                                                   regulator: 'APRA' },
    { id: 'pcp-9',  name: 'Outsourcing Policy (CPS 230)',            owner: { name: 'Sarah Toscan',   initials: 'ST' }, stage: 'Review',   daysAtStage: 12, rag: 'red',   status: 'Overdue', blockingParty: 'CRO sign-off',         dependsOn: 'Operational Risk Framework (CPS 230)',                regulator: 'APRA' },
    { id: 'pcp-10', name: 'Material Service Provider Register',       owner: { name: 'Anthony Caruso',    initials: 'AC' }, stage: 'Identify', daysAtStage: 3,  rag: 'green', status: 'On Track', dependsOn: 'Outsourcing Policy (CPS 230)',                                                          regulator: 'APRA' },
    { id: 'pcp-11', name: 'Business Continuity Plan (CPS 232)',       owner: { name: 'Anthony Caruso',    initials: 'AC' }, stage: 'Publish',  daysAtStage: 1,  rag: 'green', status: 'On Track',                                                                                                  regulator: 'APRA' },
    { id: 'pcp-12', name: 'Information Security Policy (CPS 234)',   owner: { name: 'Anthony Caruso',    initials: 'AC' }, stage: 'Approve',  daysAtStage: 7,  rag: 'amber', status: 'At Risk', dependsOn: 'Operational Risk Framework (CPS 230)',                                                regulator: 'APRA' },
    { id: 'pcp-13', name: 'Recovery Planning Standards (CPS 190)',   owner: { name: 'Marcus Elborn', initials: 'ME' }, stage: 'Draft',    daysAtStage: 14, rag: 'amber', status: 'At Risk', dependsOn: 'Stress Testing Policy',                                                                regulator: 'APRA' },

    // ── FAR (Financial Accountability Regime) ─────────────────────
    { id: 'pcp-14', name: 'FAR Accountability Statements',            owner: { name: 'Liz Depers',   initials: 'LD' }, stage: 'Review',   daysAtStage: 5,  rag: 'green', status: 'On Track', dependsOn: 'Risk Management Framework (CPS 220)',                                                  regulator: 'APRA' },
    { id: 'pcp-15', name: 'Material Risk Personnel Policy (FAR)',    owner: { name: 'Holly Allen',     initials: 'HA' }, stage: 'Identify', daysAtStage: 4,  rag: 'green', status: 'On Track',                                                                                                  regulator: 'APRA' },
    { id: 'pcp-16', name: 'Whistleblower Policy (FAR)',               owner: { name: 'Sarah Toscan',   initials: 'ST' }, stage: 'Approve',  daysAtStage: 22, rag: 'red',   status: 'Blocked', blockingParty: 'Awaiting Audit Committee',                                                       regulator: 'APRA' },

    // ── DoHAC (Department of Health & Aged Care) ──────────────────
    { id: 'pcp-17', name: 'Privacy Policy (My Health Records)',      owner: { name: 'Anthony Caruso',    initials: 'AC' }, stage: 'Identify', daysAtStage: 3,  rag: 'green', status: 'On Track',                                                                                                  regulator: 'DoHAC' },
    { id: 'pcp-18', name: 'Data Breach Response Plan',                owner: { name: 'Anthony Caruso',    initials: 'AC' }, stage: 'Draft',    daysAtStage: 6,  rag: 'green', status: 'On Track', dependsOn: 'Privacy Policy (My Health Records)',                                                  regulator: 'DoHAC' },
    { id: 'pcp-19', name: 'Member Data Handling Standards',           owner: { name: 'Naomi Kapoor',      initials: 'NK' }, stage: 'Review',   daysAtStage: 8,  rag: 'amber', status: 'At Risk',                                                                                                   regulator: 'DoHAC' },
    { id: 'pcp-20', name: 'Health Information Disclosure Policy',     owner: { name: 'Sarah Toscan',   initials: 'ST' }, stage: 'Publish',  daysAtStage: 2,  rag: 'green', status: 'On Track',                                                                                                  regulator: 'DoHAC' },

    // ── PHIAC (Private Health Insurance) ──────────────────────────
    { id: 'pcp-21', name: 'Member Communications Standards',          owner: { name: 'Naomi Kapoor',      initials: 'NK' }, stage: 'Publish',  daysAtStage: 2,  rag: 'green', status: 'On Track',                                                                                                  regulator: 'PHIAC' },
    { id: 'pcp-22', name: 'Standard Information Statement Policy',    owner: { name: 'Naomi Kapoor',      initials: 'NK' }, stage: 'Review',   daysAtStage: 4,  rag: 'green', status: 'On Track',                                                                                                  regulator: 'PHIAC' },
    { id: 'pcp-23', name: 'PHI Code of Conduct',                       owner: { name: 'Sarah Toscan',   initials: 'ST' }, stage: 'Approve',  daysAtStage: 6,  rag: 'amber', status: 'At Risk',                                                                                                   regulator: 'PHIAC' },
    { id: 'pcp-24', name: 'Complaints Handling Policy',                owner: { name: 'Naomi Kapoor',      initials: 'NK' }, stage: 'Draft',    daysAtStage: 7,  rag: 'green', status: 'On Track',                                                                                                  regulator: 'PHIAC' },

    // ── ACCC (consumer law) ───────────────────────────────────────
    { id: 'pcp-25', name: 'Member Marketing & Advertising Policy',    owner: { name: 'Naomi Kapoor',      initials: 'NK' }, stage: 'Review',   daysAtStage: 5,  rag: 'green', status: 'On Track',                                                                                                  regulator: 'ACCC' },
    { id: 'pcp-26', name: 'Comparison Site Engagement Policy',         owner: { name: 'Naomi Kapoor',      initials: 'NK' }, stage: 'Identify', daysAtStage: 2,  rag: 'green', status: 'On Track', dependsOn: 'Member Marketing & Advertising Policy',                                              regulator: 'ACCC' },
    { id: 'pcp-27', name: 'Standard Form Contracts Policy',            owner: { name: 'Sarah Toscan',   initials: 'ST' }, stage: 'Draft',    daysAtStage: 9,  rag: 'amber', status: 'At Risk',                                                                                                   regulator: 'ACCC' },

    // ── Internal ──────────────────────────────────────────────────
    { id: 'pcp-28', name: 'Conflict of Interest Policy',              owner: { name: 'Sarah Toscan',   initials: 'ST' }, stage: 'Approve',  daysAtStage: 22, rag: 'red',   status: 'Blocked', blockingParty: 'Awaiting Chair sign-off',                                                         regulator: 'Internal' },
    { id: 'pcp-29', name: 'Code of Conduct',                            owner: { name: 'Holly Allen',     initials: 'HA' }, stage: 'Publish',  daysAtStage: 1,  rag: 'green', status: 'On Track',                                                                                                  regulator: 'Internal' },
    { id: 'pcp-30', name: 'IT Acceptable Use Policy',                   owner: { name: 'Anthony Caruso',    initials: 'AC' }, stage: 'Identify', daysAtStage: 5,  rag: 'green', status: 'On Track',                                                                                                  regulator: 'Internal' },
    { id: 'pcp-31', name: 'Anti-Bribery & Corruption Policy',           owner: { name: 'Sarah Toscan',   initials: 'ST' }, stage: 'Draft',    daysAtStage: 4,  rag: 'green', status: 'On Track',                                                                                                  regulator: 'Internal' },
    { id: 'pcp-32', name: 'Modern Slavery Policy',                      owner: { name: 'Sarah Toscan',   initials: 'ST' }, stage: 'Review',   daysAtStage: 6,  rag: 'green', status: 'On Track',                                                                                                  regulator: 'Internal' },
    { id: 'pcp-33', name: 'Records Management Policy',                  owner: { name: 'Holly Allen',     initials: 'HA' }, stage: 'Identify', daysAtStage: 3,  rag: 'green', status: 'On Track',                                                                                                  regulator: 'Internal' },
    { id: 'pcp-34', name: 'Workplace Health & Safety',                  owner: { name: 'Liz Depers',   initials: 'LD' }, stage: 'Publish',  daysAtStage: 1,  rag: 'green', status: 'On Track',                                                                                                  regulator: 'Internal' },
  ],
}

const peoplecareComply = {
  kpis: [
    { label: 'CPS 510',                                            value: '92%',  delta: '+1.5%', dir: 'up',   primary: true },
    { label: 'APRA Active Obligations (CPS 510 / CPS 230 / FAR)',  value: '124',  delta: '+3',    dir: 'up'    },
    { label: 'Open Incidents',                                      value: '5',    delta: '-1',    dir: 'up',   invert: true },
    { label: 'CPS 230 Risk Score',                                  value: '6.4',  delta: '-0.3',  dir: 'up',   invert: true },
    { label: 'APRA Prudential Readiness',                           value: '88%',  delta: '+4%',   dir: 'up'    },
  ],
  obligations: {
    items: [
      { id: 'pcob-1',  name: 'CPS 510 governance self-assessment',          source: 'APRA CPS 510',   regulator: 'APRA',     category: 'Governance',   frequency: 'Annual',    owner: { name: 'Liz Depers',   initials: 'LD' }, status: 'Compliant',     dueDate: '30 Jun 2026', evidenceCount: 9 },
      { id: 'pcob-2',  name: 'CPS 230 operational resilience tests',         source: 'APRA CPS 230',   regulator: 'APRA',     category: 'Risk',          frequency: 'Quarterly', owner: { name: 'Anthony Caruso',    initials: 'AC' }, status: 'Compliant',     dueDate: '30 Jun 2026', evidenceCount: 5 },
      { id: 'pcob-3',  name: 'CPS 220 risk appetite annual review',           source: 'APRA CPS 220',   regulator: 'APRA',     category: 'Risk',          frequency: 'Annual',    owner: { name: 'Marcus Elborn', initials: 'ME' }, status: 'At Risk',       dueDate: '31 Aug 2026', evidenceCount: 3 },
      { id: 'pcob-4',  name: 'FAR accountability statements lodgement',       source: 'FAR Act 2023',   regulator: 'APRA',     category: 'Accountability',frequency: 'Annual',    owner: { name: 'Liz Depers',   initials: 'LD' }, status: 'Compliant',     dueDate: '30 Sep 2026', evidenceCount: 6 },
      { id: 'pcob-5',  name: 'Member health-data privacy compliance',         source: 'My Health Records Act', regulator: 'DoHAC', category: 'Privacy',     frequency: 'Ongoing',   owner: { name: 'Anthony Caruso',    initials: 'AC' }, status: 'At Risk',       dueDate: '14 May 2026', evidenceCount: 2 },
      { id: 'pcob-6',  name: 'PHI standard contracts disclosure',             source: 'Private Health Insurance Act', regulator: 'DoHAC', category: 'Disclosure', frequency: 'Annual', owner: { name: 'Sarah Toscan',   initials: 'ST' }, status: 'Compliant',     dueDate: '01 Jul 2026', evidenceCount: 4 },
      { id: 'pcob-7',  name: 'Member-communications consumer-law compliance', source: 'ACL',            regulator: 'ACCC',     category: 'Consumer Law', frequency: 'Ongoing',   owner: { name: 'Naomi Kapoor',      initials: 'NK' }, status: 'Compliant',     dueDate: 'Ongoing',     evidenceCount: 7 },
      { id: 'pcob-8',  name: 'Comparison-website rules — fair representation',source: 'ACL',            regulator: 'ACCC',     category: 'Consumer Law', frequency: 'Quarterly', owner: { name: 'Naomi Kapoor',      initials: 'NK' }, status: 'At Risk',       dueDate: '14 May 2026', evidenceCount: 1 },
      { id: 'pcob-9',  name: 'Whistleblower policy refresh',                   source: 'Internal',       regulator: 'Internal', category: 'Whistleblowing',frequency: 'Annual',    owner: { name: 'Sarah Toscan',   initials: 'ST' }, status: 'Compliant',     dueDate: '30 Sep 2026', evidenceCount: 4 },
      { id: 'pcob-10', name: 'Modern slavery statement',                       source: 'Modern Slavery Act', regulator: 'Internal', category: 'Human Rights', frequency: 'Annual', owner: { name: 'Anthony Caruso',    initials: 'AC' }, status: 'Compliant',     dueDate: '30 Sep 2026', evidenceCount: 5 },
    ],
  },
}

const peoplecareIncident = {
  aiPoints: [
    '7 incidents logged this quarter — 3 escalated, 2 resolved, 2 under investigation.',
    'Most common theme is "Claims Processing Delays" (3 incidents) followed by "Member Privacy Concerns" (2 incidents).',
    'Average resolution time is 4.2 days — within the 5-day SLA target.',
    'Member complaint regarding delayed claims processing requires CEO review.',
  ],
  aiActions: [
    { priority: 'High',   title: 'Review delayed claims complaint',          desc: 'Member has raised a formal complaint about delayed claim resolution. CEO response required within 48 hours.' },
    { priority: 'Medium', title: 'Address claims processing pattern',         desc: '3 incidents relate to claims processing delays. Consider revisiting claims-handling SLA reporting.' },
    { priority: 'Low',    title: 'Close resolved incidents',                  desc: '2 incidents are resolved but not formally closed. Complete closure documentation.' },
  ],
  incidents: [
    { id: 'INC-2026-001', type: 'Breach',    title: 'Unauthorised disclosure of member health data',         client: 'Member',          matter: 'Member ID #48221',     severity: 'Critical', status: 'Investigating',       owner: 'Holly Allen'        },
    { id: 'INC-2026-002', type: 'Complaint', title: 'Member complaint regarding denied claim',                client: 'Member',          matter: 'Member ID #3847',      severity: 'Medium',   status: 'Open',                owner: 'Naomi Kapoor'       },
    { id: 'INC-2026-003', type: 'Incident',  title: 'System outage affecting member portal access',           client: 'Operations',      matter: 'IT Infrastructure',    severity: 'High',     status: 'Resolved',            owner: 'Anthony Caruso'     },
    { id: 'INC-2026-004', type: 'Near miss', title: 'Potential conflict of interest identified',              client: 'Board governance', matter: 'Director declaration', severity: 'Low',      status: 'Closed',              owner: 'Holly Allen'        },
    { id: 'INC-2026-005', type: 'Breach',    title: 'Late filing of APRA quarterly statistics',                client: 'APRA',            matter: 'Regulatory',           severity: 'High',     status: 'Reported externally', owner: 'Liz Depers'         },
    { id: 'INC-2026-006', type: 'Complaint', title: 'Premium increase dispute from member',                    client: 'Member',          matter: 'Billing',              severity: 'Low',      status: 'Resolved',            owner: 'Naomi Kapoor'       },
    { id: 'INC-2026-007', type: 'Incident',  title: 'Phishing attack targeting staff email',                   client: 'Organisation-wide', matter: 'Cyber Security',     severity: 'High',     status: 'Investigating',       owner: 'Anthony Caruso'     },
    { id: 'PCINC-2026-008', type: 'CPS 230 Operational Incident', title: 'Core membership system outage — 47 minutes',        client: 'Peoplecare Health Fund', matter: 'IT Operations',         severity: 'High',   status: 'Investigating', owner: 'Anthony Caruso' },
    { id: 'PCINC-2026-009', type: 'FAR Accountability Breach',     title: 'Late notification of material outsourcing change', client: 'Peoplecare Health Fund', matter: 'Outsourcing register', severity: 'Medium', status: 'Open',          owner: 'Marcus Elborn'  },
  ],
}

const peoplecareWork = {
  description: 'Governance workflow management and task coordination',
  overviewSub: total => `Distribution across ${total} active governance workflows`,
  performance: [
    { label: 'Task Quality',       value: '97%',   bar: 97, onTarget: true,  note: 'target 95%'  },
    { label: 'Milestone Delivery', value: '94%',   bar: 94, onTarget: false, note: 'target 100%' },
    { label: 'Avg Response',       value: '3.2h',  bar: 68, onTarget: true,  note: '−0.4h'       },
    { label: 'Avg Cycle Time',     value: '12.5d', bar: 75, onTarget: true,  note: 'on target'   },
    { label: 'Team Capacity',      value: '78%',   bar: 78, onTarget: false, note: 'of 100%'     },
  ],
  workMatters: [
    { id: 1,  name: 'CPS 230 Operational Risk Uplift',     ref: 'MAT-2401', client: 'Peoplecare Health Fund',      practice: 'Risk',        status: 'Active',   priority: 'Critical', progress: 72, due: 'May 14', value: '$1.2M', lead: 'AC', leadColor: 'bg-brand-800 text-brand-50' },
    { id: 2,  name: 'Outsourcing Policy Refresh',          ref: 'MAT-2398', client: 'Group',                       practice: 'Policy',      status: 'Behind',   priority: 'High',     progress: 45, due: 'Mar 15', value: '$680K', lead: 'LD', leadColor: 'bg-teal-600 text-white' },
    { id: 3,  name: 'Fit & Proper Annual Reviews',         ref: 'MAT-2412', client: 'Group',                       practice: 'Compliance',  status: 'On Track', priority: 'Medium',   progress: 28, due: 'Apr 10', value: '$340K', lead: 'HA', leadColor: 'bg-slate-500 text-white' },
    { id: 4,  name: 'RBHS Audit Action Close-out',         ref: 'MAT-2356', client: 'Reserve Bank Health Society', practice: 'Compliance',  status: 'On Hold',  priority: 'Low',      progress: 60, due: 'TBD',    value: '$890K', lead: 'ST', leadColor: 'bg-orange-500 text-white' },
    { id: 5,  name: 'CPS 510 Board Attestation',           ref: 'MAT-2418', client: 'Peoplecare Health Fund',      practice: 'Board',       status: 'On Track', priority: 'High',     progress: 15, due: 'May 14', value: '$210K', lead: 'HA', leadColor: 'bg-brand-800 text-brand-50' },
    { id: 6,  name: 'Modern Slavery Statement Refresh',    ref: 'MAT-2420', client: 'Group',                       practice: 'Compliance',  status: 'Active',   priority: 'Medium',   progress: 55, due: 'Mar 20', value: '$95K',  lead: 'ST', leadColor: 'bg-violet-500 text-white' },
    { id: 7,  name: 'OneMediFund Capital Position Review', ref: 'MAT-2415', client: 'OneMediFund',                 practice: 'Risk',        status: 'Behind',   priority: 'High',     progress: 38, due: 'Feb 25', value: '$420K', lead: 'ME', leadColor: 'bg-teal-600 text-white' },
    { id: 8,  name: 'Risk Appetite Framework Update',      ref: 'MAT-2422', client: 'Peoplecare Health Fund',      practice: 'Risk',        status: 'On Track', priority: 'Medium',   progress: 10, due: 'May 15', value: '$180K', lead: 'ME', leadColor: 'bg-slate-500 text-white' },
    { id: 9,  name: 'Material Service Provider Register',  ref: 'MAT-2409', client: 'Group',                       practice: 'Outsourcing', status: 'Active',   priority: 'Low',      progress: 85, due: 'Feb 20', value: '$150K', lead: 'ST', leadColor: 'bg-violet-500 text-white' },
    { id: 10, name: 'RBHS Director Onboarding',            ref: 'MAT-2425', client: 'Reserve Bank Health Society', practice: 'Board',       status: 'Active',   priority: 'Medium',   progress: 20, due: 'Jun 01', value: '$275K', lead: 'HA', leadColor: 'bg-brand-800 text-brand-50' },
  ],
  aiPoints: [
    '2 workstreams are flagged as Behind schedule — Outsourcing Policy Refresh and OneMediFund Capital Position Review need attention.',
    'Sarah Toscan is assigned to RBHS Audit Action Close-out (On Hold) — consider reallocating capacity to active workstreams.',
    'CPS 230 Operational Risk Uplift (Critical priority) is at 72% with a 14 May deadline — 6 tasks remain open.',
    'Material Service Provider Register is at 85% and due 20 Feb — on track for completion this week.',
    'Open scope has grown this month; consider sequencing Fit & Proper Annual Reviews and Risk Appetite Framework Update before the May board cycle.',
  ],
  aiActions: [
    { text: 'Review delayed milestones on Outsourcing Policy Refresh before 22 Feb deadline' },
    { text: 'Schedule priority check-in with Anthony Caruso on CPS 230 Operational Risk Uplift escalation' },
    { text: 'Chase outstanding actions — 2 overdue items linked to RBHS audit close-out' },
  ],
  teamWorkload: [
    { name: 'Anthony Caruso', initials: 'AC', utilisation: 92, capacity: 100 },
    { name: 'Holly Allen',    initials: 'HA', utilisation: 88, capacity: 100 },
    { name: 'Liz Depers',     initials: 'LD', utilisation: 76, capacity: 100 },
    { name: 'Sarah Toscan',   initials: 'ST', utilisation: 64, capacity: 100 },
    { name: 'Marcus Elborn',  initials: 'ME', utilisation: 70, capacity: 100 },
  ],
  upcomingDeadlines: [
    { id: 'wd-1', label: 'CPS 230 Operational Risk Uplift — board paper finalisation',  matter: 'CPS 230 Operational Risk Uplift',     month: 'MAY', day: '02', year: '2026', urgency: 'high'   },
    { id: 'wd-2', label: 'OneMediFund Capital Position Review — APRA response due',     matter: 'OneMediFund Capital Position Review', month: 'MAY', day: '05', year: '2026', urgency: 'high'   },
    { id: 'wd-3', label: 'Fit & Proper Annual Reviews — sign-off memo',                  matter: 'Fit & Proper Annual Reviews',         month: 'MAY', day: '12', year: '2026', urgency: 'medium' },
    { id: 'wd-4', label: 'CPS 510 Board Attestation — final draft',                      matter: 'CPS 510 Board Attestation',           month: 'MAY', day: '15', year: '2026', urgency: 'medium' },
    { id: 'wd-5', label: 'Outsourcing Policy Refresh — circulation to directors',         matter: 'Outsourcing Policy Refresh',          month: 'MAY', day: '20', year: '2026', urgency: 'low'    },
  ],
}

const peoplecareControl = {
  kpiActiveMatters: 'Active Responsibilities',
  mattersOverview: 'Active Workstreams',
  mattersOverviewSub: '12 active governance workflows',
  firmHealth: 'Governance Operations',
  kpis: [
    { label: 'CPS 510 Governance Score', value: '92%',  delta: '+3%',  dir: 'up',   primary: true },
    { label: 'Active Responsibilities',  value: '34',   delta: '+2',   dir: 'up'   },
    { label: 'Open Board Actions',       value: '12',   delta: '-2',   dir: 'down' },
    { label: 'Policies Due',             value: '5',    delta: '+1',   dir: 'up'   },
  ],
  matters: [
    { name: 'CPS 230 Operational Risk Uplift',     client: 'Peoplecare Health Fund',      type: 'Risk',        status: 'Active',  days: 21, value: '$1.2M', lead: 'AC' },
    { name: 'Outsourcing Policy Refresh',          client: 'Group',                       type: 'Policy',      status: 'Review',  days: 89, value: '$680K', lead: 'LD' },
    { name: 'CPS 510 Board Attestation',           client: 'Peoplecare Health Fund',      type: 'Board',       status: 'Active',  days: 7,  value: '$210K', lead: 'HA' },
    { name: 'RBHS Audit Action Close-out',         client: 'Reserve Bank Health Society', type: 'Compliance',  status: 'On Hold', days: 156, value: '$890K', lead: 'ST' },
    { name: 'Risk Appetite Framework Update',      client: 'Peoplecare Health Fund',      type: 'Risk',        status: 'Active',  days: 14, value: '$180K', lead: 'ME' },
  ],
  compliance: [
    { label: 'APRA Policy Reviews',                 status: 'good',    value: '38/40',     sub: 'All current'      },
    { label: 'Conflict of Interest Declarations',   status: 'warning', value: '18/20',     sub: '2 outstanding'    },
    { label: 'Director Training Completions',       status: 'good',    value: '100%',      sub: 'On track'         },
    { label: 'Privacy & Data Governance',           status: 'good',    value: 'On Track',  sub: 'Up to date'       },
    { label: 'CPS 230 Risk Assessments',            status: 'neutral', value: '12/15',     sub: '3 in progress'    },
  ],
  firmHealthMetrics: [
    { label: 'Pack on-time Rate',     value: 87, target: 90, delta: '+2%', above: false },
    { label: 'Action Close-out Rate', value: 78, target: 85, delta: '-3%', above: false },
    { label: 'Policy Currency',       value: 88, target: 90, delta: '+1%', above: false },
    { label: 'Director Attendance',   value: 92, target: 90, delta: '+1%', above: true  },
  ],
  team: [
    { initials: 'HA', name: 'Holly Allen',    role: 'Governance Manager & Co Sec',           matters: 8, util: 88, level: 'high' },
    { initials: 'LD', name: 'Liz Depers',     role: 'Senior Governance & Policy Advisor',    matters: 5, util: 76, level: 'good' },
    { initials: 'ST', name: 'Sarah Toscan',   role: 'Governance Administrator',              matters: 3, util: 60, level: 'good' },
  ],
  aiActions: [
    { priority: 'High',   title: 'Approve CPS 510 board attestation', desc: 'Final draft ready for review ahead of the 14 May Peoplecare board meeting.' },
    { priority: 'High',   title: 'Close out RBHS overdue actions',     desc: '4 actions are past their committed dates; assign clear owners before quarterly review.' },
    { priority: 'Medium', title: 'Refresh Outsourcing Policy',         desc: 'Last reviewed Apr 2024; APRA expects 2-yearly cycle for material outsourcing arrangements.' },
    { priority: 'Low',    title: 'Onboard new RBHS director',          desc: 'Fit & Proper assessment pending HR sign-off; aim for May board induction.' },
  ],
  importantDates: [
    { label: 'Peoplecare Board pack circulation',    month: 'MAY', day: '11', year: '2026', sub: 'Monday · Action required',  urgency: 'high'     },
    { label: 'CPS 230 program checkpoint',           month: 'MAY', day: '12', year: '2026', sub: 'Tuesday · Risk',             urgency: 'high'     },
    { label: 'Delegated Authority register review',  month: 'MAY', day: '08', year: '2026', sub: 'Friday · Overdue',           urgency: 'overdue'  },
    { label: 'APRA quarterly compliance return',     month: 'MAY', day: '15', year: '2026', sub: 'Friday · Reporting',         urgency: 'medium'   },
    { label: 'Director Fit & Proper declarations',   month: 'JUN', day: '01', year: '2026', sub: 'Monday · Compliance',        urgency: 'low'      },
    { label: 'Board skills matrix refresh',          month: 'APR', day: '15', year: '2026', sub: 'Wednesday · Governance',     urgency: 'medium'   },
  ],
  upcomingEvents: [
    { title: 'Peoplecare Board Meeting — May 2026',          month: 'MAY', day: '14', year: '2026', time: '9:00 AM',  location: 'Wollongong Boardroom' },
    { title: 'OneMediFund Board Meeting — May 2026',         month: 'MAY', day: '22', year: '2026', time: '10:00 AM', location: 'Online (Teams)'       },
    { title: 'Board Risk & Audit Committee — May 2026',      month: 'MAY', day: '15', year: '2026', time: '9:30 AM',  location: 'Wollongong'           },
    { title: 'RBHS Board Meeting — June 2026',                month: 'JUN', day: '03', year: '2026', time: '9:00 AM',  location: 'Sydney CBD'           },
    { title: 'CPS 230 program checkpoint',                    month: 'MAY', day: '12', year: '2026', time: '2:00 PM',  location: 'Online'               },
  ],
  aiSummary: [
    'CPS 510 governance score is 92% — 2 board papers outstanding for the May meeting and 1 overdue policy review.',
    '3 governance tasks are overdue — delegated authority register update, risk appetite statement review and committee terms of reference refresh.',
    'Next board meeting is in 14 days — 2 agenda items require pre-reading distribution this week.',
    'Duties handbook was last reviewed 8 months ago — annual review is due within 4 months.',
    'CPS 230 Operational Risk Uplift workstream is at 72% — 6 tasks remain open before the May board cycle.',
  ],
  priorities: [
    { label: 'Board papers due — May 2026 Peoplecare Board meeting', urgency: 'High',   due: 'Tue 12 May'  },
    { label: 'Delegated authority register update overdue — 8 days', urgency: 'High',   due: 'Overdue'     },
    { label: 'CPS 230 risk appetite statement review',                urgency: 'Medium', due: 'Due 30 May'  },
    { label: 'Fit and Proper Policy — board approval required',       urgency: 'Medium', due: 'Due 14 May'  },
    { label: 'Board skills matrix refresh',                            urgency: 'Low',    due: 'Due 15 Apr'  },
  ],
}

const peoplecareInsights = {
  greetingSuffix: "Here's what matters today across your governance obligations.",
  suggestedActions: [
    { title: 'Review FAR accountability statements',                              source: 'ASIC Updated Guidance',           urgency: 'urgent'      },
    { title: 'Update board papers on member privacy reform obligations',           source: 'Privacy Act Reform',              urgency: 'urgent'      },
    { title: 'Brief board on new ESG disclosure rules',                            source: 'AASB Sustainability Standards',   urgency: 'recommended' },
    { title: 'Check CPS 230 program against 1 July 2026 compliance deadline',     source: 'APRA CPS 230',                    urgency: 'recommended' },
    { title: 'Schedule director governance training update',                       source: 'CPS 510 Fit & Proper',            urgency: 'recommended' },
  ],
  focusAreas: [
    { name: 'Director Duties & FAR',         count: 12, urgency: 'High',     snippet: 'ASIC updated FAR guidance — accountability statement review required',          time: '2h ago'  },
    { name: 'Privacy & Data Protection',     count: 8,  urgency: 'Elevated', snippet: 'Privacy Act reform passes Senate — new compliance obligations',                  time: '5h ago'  },
    { name: 'ESG & Climate Disclosure',       count: 15, urgency: 'Medium',   snippet: 'AASB sustainability standards — Group 2 deadline Jan 2027',                       time: '6h ago'  },
    { name: 'PHI Premium Affordability',      count: 4,  urgency: 'Medium',   snippet: 'PHIAC review of premium affordability metrics — board attention required',       time: '12h ago' },
    { name: 'Operational Resilience',         count: 9,  urgency: 'High',     snippet: 'CPS 230 final compliance deadline 1 July 2026',                                   time: '8h ago'  },
    { name: 'AI & Governance Technology',     count: 4,  urgency: 'Low',      snippet: 'New ethical guidelines for AI use in board and governance practice',              time: '10h ago' },
  ],
  regulatory: [
    { urgency: 'critical', type: 'Legislation',  source: 'Federal Parliament', jurisdiction: 'AU', title: 'Privacy Act Reform Bill 2026',                                  date: 'Mar 22', deadline: 'Jul 1, 2026' },
    { urgency: 'high',     type: 'Enforcement',  source: 'ASIC',                jurisdiction: 'AU', title: 'Civil proceedings — former fund director breach of duty',     date: 'Mar 22', deadline: null            },
    { urgency: 'high',     type: 'Deadline',     source: 'APRA',                jurisdiction: 'AU', title: 'CPS 230 Operational Resilience — full compliance',            date: 'Mar 20', deadline: 'Jul 1, 2026' },
    { urgency: 'medium',   type: 'Legislation',  source: 'Dept Health',         jurisdiction: 'AU', title: 'Private Health Insurance (Rebates) Amendment',                date: 'Mar 19', deadline: 'Jun 15, 2026' },
    { urgency: 'medium',   type: 'Legislation',  source: 'AUSTRAC',             jurisdiction: 'AU', title: 'AML/CTF threshold transaction reporting amendments',          date: 'Mar 18', deadline: 'Sep 1, 2026' },
    { urgency: 'low',      type: 'Guidance',     source: 'Governance Institute', jurisdiction: 'AU', title: 'AI in governance practice — ethical guidelines',              date: 'Mar 17', deadline: null            },
  ],
}

const peoplecareCommunity = {
  posts: [
    { id: 'CP-001', type: 'AI Win',     author: 'Holly Allen',         role: 'Company Secretary',                 org: 'Peoplecare Health Fund',     time: '2h ago', title: 'Using Claude to draft board paper summaries — cut prep time by 60%',           snippet: 'We integrated Claude into our board paper workflow to generate executive summaries for each agenda item. Directors now receive a 2-page brief instead of a 40-page pack, with the full pack available on request.', tags: ['AI in Practice', 'Board Effectiveness'], replies: 18, saved: false },
    { id: 'CP-002', type: 'Question',   author: 'Liz Depers',          role: 'Senior Governance Advisor',         org: 'Peoplecare Health Fund',     time: '4h ago', title: 'How are you handling CPS 230 material service provider assessments?',           snippet: 'We have 40+ third-party providers and the register requirement feels overwhelming. Has anyone found a practical approach to the materiality assessment that doesn\'t require a full-time role?', tags: ['Risk & Compliance', 'CPS 230'], replies: 24, saved: false },
    { id: 'CP-003', type: 'Discussion', author: 'Prof. Sarah Chen',    role: 'ESG Advisory Board',                 org: 'Governance Institute',       time: '6h ago', title: 'Mandatory climate disclosures — are boards really ready?',                       snippet: 'With Group 2 entities facing January 2027 deadlines, I\'m seeing a significant gap between board awareness and operational readiness. The governance frameworks are there but the data pipelines aren\'t.', tags: ['ESG & Sustainability', 'Governance'], replies: 31, saved: true },
    { id: 'CP-004', type: 'Ethika',     author: 'Ethika Intelligence', role: 'Editorial Team',                     org: 'Ethika',                     time: '8h ago', title: 'Weekly roundup: Top 5 regulatory developments you may have missed',              snippet: 'This week\'s highlights include ASIC\'s updated FAR guidance, the Privacy Act reform passing Senate, APRA\'s CPS 230 reminder, new AUSTRAC thresholds, and the Governance Institute\'s AI ethics guidelines.', tags: ['Governance', 'Risk & Compliance'], replies: 12, saved: false },
    { id: 'CP-005', type: 'AI Win',     author: 'Marcus Elborn',       role: 'Risk Committee Chair',              org: 'Peoplecare Health Fund',     time: '1d ago', title: 'Automated conflict checking with AI — lessons from 6 months live',              snippet: 'We built an AI-powered conflict checking workflow that cross-references new directorships against our entire registered interest history. False positive rate dropped from 35% to 8% after fine-tuning.', tags: ['AI in Practice', 'Governance'], replies: 42, saved: false },
    { id: 'CP-006', type: 'Question',   author: 'Anthony Caruso',      role: 'Chief Executive Officer',           org: 'Peoplecare Health Fund',     time: '1d ago', title: 'Best practices for FAR accountability statement reviews?',                        snippet: 'We are finalising our FAR accountability framework and debating how prescriptive to be on reasonable steps documentation. What level of evidence are other accountable persons preparing?', tags: ['Governance', 'FAR'], replies: 37, saved: false },
  ],
  joinedGroups: [
    { name: 'AI Governance',                     members: 342 },
    { name: 'Boards & Directors',                members: 218 },
    { name: 'PHI & Health Fund Governance',      members: 213 },
  ],
  collaborationGroups: [
    { name: 'AI Governance',                     description: 'Exploring responsible AI adoption in governance practice',          members: 342, category: 'Topic',      joined: true  },
    { name: 'PHI & Health Fund Governance',      description: 'Private health fund governance, APRA prudential and PHI oversight', members: 213, category: 'Profession', joined: true  },
    { name: 'Boards & Directors',                description: 'Governance, strategy, and director duties',                          members: 218, category: 'Profession', joined: true  },
    { name: 'Risk & Compliance',                 description: 'Risk management, compliance frameworks, and regulatory change',      members: 289, category: 'Topic',      joined: false },
    { name: 'NFP Governance',                    description: 'Not-for-profit board governance and compliance',                     members: 124, category: 'Profession', joined: false },
    { name: 'Financial Services',                description: 'Banking, insurance, and superannuation governance',                  members: 198, category: 'Profession', joined: false },
  ],
}

const peoplecareLegislation = {
  aiPoints: [
    '14 regulatory updates tracked this quarter — 3 have direct impact on active governance obligations.',
    'Privacy Act amendments effective Mar 1 require updated member data handling procedures.',
    'CPS 230 final compliance deadline approaches 1 July 2026 — material service provider register required.',
    'FAR Accountability Statement guidance updated — revisit reasonable steps obligation for accountable persons.',
  ],
  aiSuggestions: [
    'Update member data handling procedures before Mar 1 Privacy Act amendments take effect.',
    'Finalise CPS 230 material service provider register before 1 July 2026 deadline.',
    'Brief board on FAR Accountability Statement updates.',
    'Schedule annual PHI Premium Compliance Review.',
  ],
}

const peoplecareContractsCfg = {
  aiPoints: [
    "Hospital Access Agreement with St Vincent's Hospital Network expires in 90 days — renewal negotiations needed.",
    'APRA Prudential Reporting Agreement due for annual attestation.',
    'Outsourcing contract with Lifetime Health Cover (core admin system) is critical — review CPS 231 obligations.',
    'Member Communications Platform agreement (Whitecoat) has expired and requires action.',
  ],
  aiActions: [
    { priority: 'High',   title: 'Action expired Member Communications Platform',  desc: 'Whitecoat agreement is past expiry. Renew or transition member-facing comms within 30 days.' },
    { priority: 'Medium', title: 'Begin Hospital Access Agreement renewal',         desc: 'St Vincent\'s Network agreement expires in 90 days — initiate negotiation.' },
    { priority: 'Low',    title: 'Schedule Actuarial Services Agreement review',    desc: 'Finity Consulting engagement due for triennial review.' },
  ],
}

const peoplecareConflictCfg = {
  aiPoints: [
    '6 active conflicts of interest tracked across the board — 2 marked Actual/High require ongoing monitoring.',
    'Patricia Hartley (Chair) has disclosed interest in 2 related provider entities.',
    'Marcus Elborn (NED) linked to Ramsay Health Care via prior directorship — monitor for hospital contract discussions.',
    'Board committee matters involving hospital contracting show higher conflict incidence — review declarations before tender discussions.',
  ],
  aiActions: [
    { priority: 'High',   title: 'Review Hartley Medical Group declaration', desc: 'Refresh declaration before Hospital Access Agreement renewal discussions begin.' },
    { priority: 'Medium', title: 'Refresh director conflict declarations',    desc: 'Annual declaration cycle due — circulate to all directors.' },
    { priority: 'Low',    title: 'Update conflict register procedure',         desc: 'Align CoI register procedure with CPS 510 Fit & Proper updates.' },
  ],
}

const peoplecareRiskCfg = {
  aiPoints: [
    '8 risks tracked under CPS 230 framework — 2 rated Critical/Almost Certain require immediate attention.',
    'APRA CPS 230 compliance deadline breach is the highest-rated risk — board action required.',
    'Member data breach via third-party vendor remains the top operational risk.',
    'Key personnel departure risk elevated for CEO and Company Secretary positions.',
  ],
  aiActions: [
    { priority: 'High',   title: 'Finalise CPS 230 material service provider register', desc: 'Outstanding sign-off on materiality assessment is the gating control for residual risk reduction.' },
    { priority: 'Medium', title: 'Review D&O insurance coverage gap',                   desc: 'Coverage gap identified in FAR-related defence cost cover; broker review scheduled.' },
    { priority: 'Low',    title: 'Refresh strategic risk view',                          desc: 'Digital health competition and fund amalgamation pressure require strategic risk reassessment.' },
  ],
}

const peoplecareAuditCfg = {
  aiPoints: [
    'APRA evidence collection is 72% complete with 4 weeks remaining ahead of CPS 510 attestation.',
    '3 evidence items expire within 30 days — D&O insurance certificate, director training records, and CPS 510 framework review.',
    'Last external audit (Dec 2025) had 2 findings — both remediation actions are in progress and on track.',
    'Assurance coverage is strong across Governance (94%) and Compliance (88%) but weak in Privacy & Data Governance (62%).',
  ],
  aiActions: [
    { priority: 'High',   title: 'Renew expiring evidence items',           desc: '3 items expiring within 30 days. D&O insurance certificate is highest priority.' },
    { priority: 'Medium', title: 'Improve Privacy & Data Governance coverage', desc: 'Coverage at 62% is below 80% threshold. Schedule evidence-gathering session with Mark Steiner team.' },
    { priority: 'Low',    title: 'Prepare APRA prudential return',           desc: 'APRA prudential return due Mar 31. Begin drafting executive summary and findings section.' },
  ],
}

const peoplecareObligationsCfg = {
  aiPoints: [
    'CPS 510 governance self-assessment is on track for 30 Jun 2026 deadline — 9 evidence items collected.',
    'PHI standard contracts disclosure obligation is at risk — Sarah Toscan to action by 14 May.',
    'Member health-data privacy compliance flagged At Risk under My Health Records Act.',
    'CPS 230 operational resilience tests are passing quarterly thresholds — continue cadence.',
  ],
  aiActions: [
    { priority: 'High',   title: 'Action PHI standard contracts disclosure',    desc: 'Annual disclosure due 1 Jul 2026; preparation tracking behind schedule.' },
    { priority: 'Medium', title: 'Schedule member-data privacy refresh',         desc: 'My Health Records Act compliance flagged At Risk — refresh evidence within 60 days.' },
    { priority: 'Low',    title: 'Confirm comparison-website rules submission',   desc: 'ACL fair representation register due 14 May.' },
  ],
}

configs.peoplecare = {
  ...configs.default,
  appName: 'Ethos — Peoplecare',
  logo: '/peoplecare-logo.png',
  icon: '/peoplecare-icon.jpeg',
  greeting: 'Good morning, Holly',
  user: { name: 'Holly Allen', initials: 'HA', email: 'holly.allen@peoplecare.com.au' },
  pages: {
    ...configs.default.pages,
    control: {
      ...configs.default.pages.control,
      ...peoplecareControl,
    },
    govern: {
      ...configs.default.pages.govern,
      ...peoplecareGovern,
    },
    comply: {
      ...configs.default.pages.comply,
      ...peoplecareComply,
      legislation: { ...configs.default.pages.comply.legislation, ...peoplecareLegislation },
      contracts:   { ...configs.default.pages.comply.contracts,   ...peoplecareContractsCfg },
      conflict:    { ...configs.default.pages.comply.conflict,    ...peoplecareConflictCfg  },
      risk:        { ...configs.default.pages.comply.risk,        ...peoplecareRiskCfg      },
      audit:       { ...configs.default.pages.comply.audit,       ...peoplecareAuditCfg     },
      obligations: { ...configs.default.pages.comply.obligations, ...peoplecareObligationsCfg },
    },
    incident: {
      ...configs.default.pages.incident,
      ...peoplecareIncident,
    },
    work: {
      ...configs.default.pages.work,
      ...peoplecareWork,
    },
    insights: {
      ...configs.default.pages.insights,
      ...peoplecareInsights,
    },
    community: {
      ...configs.default.pages.community,
      ...peoplecareCommunity,
    },
    integrations: {
      rows: [
        { id: 'ms365',    name: 'Microsoft 365',                desc: 'Email, calendar, documents and file sync',                                  status: 'connected', lastSync: '2 minutes ago', logo: 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=128' },
        { id: 'box',      name: 'Box',                          desc: 'Cloud content management and document sharing',                             status: 'connected', lastSync: '5 minutes ago', logo: 'https://www.google.com/s2/favicons?domain=box.com&sz=128' },
        { id: 'slack',    name: 'Slack',                        desc: 'Team messaging and channel-based communication',                            status: 'connected', lastSync: '1 minute ago',  logo: 'https://www.google.com/s2/favicons?domain=slack.com&sz=128' },
        { id: 'diligent', name: 'Diligent',                     desc: 'Board pack distribution and director portal',                               status: 'connected', lastSync: '4 minutes ago', logo: 'https://www.google.com/s2/favicons?domain=diligent.com&sz=128', featured: true },
        { id: 'apraconnect', name: 'APRA Connect',              desc: 'APRA regulatory reporting and prudential return portal',                     status: 'available', logo: 'https://www.google.com/s2/favicons?domain=apra.gov.au&sz=128' },
        { id: 'apralibrary', name: 'APRA Prudential Standards Library', desc: 'Prudential standards, practice guides and governance frameworks',     status: 'connected', lastSync: '12 minutes ago', logo: 'https://www.google.com/s2/favicons?domain=apra.gov.au&sz=128' },
        { id: 'civica',   name: 'Civica',                       desc: 'Member management and fund administration system',                          status: 'available', logo: 'https://www.google.com/s2/favicons?domain=civica.com&sz=128' },
        { id: 'claimvantage', name: 'ClaimVantage',             desc: 'Claims management platform',                                                 status: 'available', logo: 'https://www.google.com/s2/favicons?domain=claimvantage.com&sz=128' },
        { id: 'salesforcehealth', name: 'Salesforce Health Cloud', desc: 'Member relationship management for health funds',                          status: 'available', logo: 'https://www.google.com/s2/favicons?domain=salesforce.com&sz=128' },
        { id: 'regis',    name: 'Regis',                        desc: 'APRA regulatory reporting automation',                                       status: 'available', logo: 'https://www.google.com/s2/favicons?domain=regis.com.au&sz=128' },
        { id: 'docusign', name: 'DocuSign',                     desc: 'Electronic signature for board resolutions',                                 status: 'available', logo: 'https://www.google.com/s2/favicons?domain=docusign.com&sz=128' },
        { id: 'asic',     name: 'ASIC Connect',                 desc: 'Lodge company-register changes with the regulator',                          status: 'available', logo: 'https://www.google.com/s2/favicons?domain=asic.gov.au&sz=128' },
        { id: 'xero',     name: 'Xero',                         desc: 'Cloud accounting and financial management',                                  status: 'available', logo: 'https://www.google.com/s2/favicons?domain=xero.com&sz=128' },
        { id: 'regfeeds', name: 'Regulator feeds — APRA/PHIAC', desc: 'Prudential and private-health regulatory updates',                           status: 'available', logo: 'https://www.google.com/s2/favicons?domain=apra.gov.au&sz=128' },
        { id: 'boardpro', name: 'BoardPro',                     desc: 'Alternative board portal and governance management',                        status: 'available', logo: 'https://www.google.com/s2/favicons?domain=boardpro.com&sz=128' },
      ],
    },
  },
}

// ─── Export ───────────────────────────────────────────────────────────────────

// Determine tenant: pathname (/<tenant>/…) > sessionStorage (from login) > env var > default
let resolvedTenant = import.meta.env.VITE_TENANT ?? 'default'
try {
  const stored = sessionStorage.getItem('ethos_auth')
  if (stored) {
    const parsed = JSON.parse(stored)
    if (parsed.tenant && configs[parsed.tenant]) resolvedTenant = parsed.tenant
  }
} catch { /* ignore */ }
try {
  const segments = window.location.pathname.split('/')
  const raw = segments[1]
  const first = raw?.toLowerCase()
  if (first && configs[first]) {
    resolvedTenant = first
    if (raw !== first) {
      segments[1] = first
      window.history.replaceState(null, '', segments.join('/') + window.location.search + window.location.hash)
    }
  }
} catch { /* ignore */ }
const envTenant = resolvedTenant
const tenant = { ...(configs[envTenant] ?? configs.default) }

function switchTenant(id) {
  const next = configs[id] ?? configs.default
  Object.keys(tenant).forEach(k => delete tenant[k])
  Object.assign(tenant, next)
}

export default tenant
export { envTenant as tenantId, switchTenant, configs }
