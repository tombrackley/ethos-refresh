import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Search, Check, ExternalLink, Eye, Settings2, X,
  Reply, ReplyAll, Forward, Archive, Trash2, Star,
  Mail, Sparkles, Briefcase, Users, Globe, Link2, FileText, Pencil,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import tenant from '@/config/tenant'

// ─── Data ─────────────────────────────────────────────────────────────────────

const g = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`

const CATEGORIES = [
  {
    id: 'comply',
    label: 'Comply',
    desc: 'Compliance, regulatory & risk management',
    integrations: [
      { name: 'InfoTrack',        initials: 'IT', color: 'bg-red-700 text-white',       logo: g('infotrack.com.au'),    desc: 'Automated legal searches, ASIC and property data',      connected: true  },
      { name: 'CompliSpace',      initials: 'CS', color: 'bg-emerald-600 text-white',   logo: g('complispace.com.au'),  desc: 'Policy management and compliance training platform',    connected: false },
      { name: 'Lexis+ AI',        initials: 'L+', color: 'bg-blue-700 text-white',      logo: g('lexisnexis.com'),      desc: 'Legal research, analytics and AI-assisted drafting',    connected: false },
      { name: 'Thomson Reuters',  initials: 'TR', color: 'bg-orange-600 text-white',    logo: g('thomsonreuters.com'),  desc: 'Legal content, research tools and practice solutions',  connected: true  },
    ],
  },
  {
    id: 'work',
    label: 'Work',
    desc: 'Matter management & daily productivity',
    integrations: [
      { name: 'Clio',              initials: 'C',  color: 'bg-sky-600 text-white',       logo: g('clio.com'),            desc: 'Cloud-based legal practice management software',        connected: true  },
      { name: 'LEAP',              initials: 'L',  color: 'bg-green-600 text-white',     logo: g('leap.com.au'),         desc: 'Legal practice productivity and matter management',     connected: false },
      { name: 'Microsoft Outlook', initials: 'O',  color: 'bg-blue-500 text-white',      logo: g('outlook.com'),         desc: 'Email, calendar and contact management',                connected: true  },
      { name: 'Actionstep',        initials: 'A',  color: 'bg-brand-800 text-brand-50',  logo: g('actionstep.com'),      desc: 'Legal workflow automation and practice management',     connected: false },
      { name: 'Smokeball',         initials: 'S',  color: 'bg-pink-600 text-white',      logo: g('smokeball.com'),       desc: 'Automated legal practice management for small firms',   connected: false },
      { name: 'Asana',             initials: 'As', color: 'bg-rose-500 text-white',      logo: g('asana.com'),           desc: 'Project and task management for teams',                 connected: false },
      { name: 'Monday.com',        initials: 'Mo', color: 'bg-violet-600 text-white',    logo: g('monday.com'),          desc: 'Work operating system for team collaboration',          connected: false },
      { name: 'Migration Manager', initials: 'M',  color: 'bg-teal-700 text-white',      logo: null,                     desc: 'Visa and migration case management platform',           connected: false },
      { name: 'FilePro',           initials: 'FP', color: 'bg-slate-600 text-white',     logo: g('filepro.com.au'),      desc: 'Legal document and practice management',                connected: false },
    ],
  },
  {
    id: 'respond',
    label: 'Respond',
    desc: 'Uplift, change management & AI agents',
    integrations: [
      { name: 'Josef',             initials: 'J',  color: 'bg-indigo-600 text-white',    logo: g('joseflegal.com'),      desc: 'No-code legal chatbot and automation builder',          connected: false },
      { name: 'Spellbook',         initials: 'Sp', color: 'bg-purple-600 text-white',    logo: g('spellbook.legal'),     desc: 'AI contract drafting and review assistant',             connected: false },
      { name: 'Harvey AI',         initials: 'H',  color: 'bg-slate-800 text-white',     logo: g('harvey.ai'),           desc: 'Generative AI for professional services firms',         connected: false },
      { name: 'CoCounsel',         initials: 'CC', color: 'bg-blue-800 text-white',      logo: g('thomsonreuters.com'),  desc: 'AI legal assistant for research and document review',   connected: true  },
      { name: 'Luminance',         initials: 'Lu', color: 'bg-cyan-600 text-white',      logo: g('luminance.com'),       desc: 'AI-powered contract intelligence platform',             connected: false },
      { name: 'Checkbox',          initials: 'Cb', color: 'bg-violet-500 text-white',    logo: g('checkbox.ai'),         desc: 'Legal operations automation and workflow management',   connected: false },
    ],
  },
  {
    id: 'meet',
    label: 'Meet',
    desc: 'Meetings, scheduling & video calls',
    integrations: [
      { name: 'Microsoft Teams',   initials: 'MT', color: 'bg-indigo-500 text-white',    logo: g('teams.microsoft.com'), desc: 'Video conferencing, chat and collaboration',            connected: true  },
      { name: 'Zoom',              initials: 'Z',  color: 'bg-blue-600 text-white',      logo: g('zoom.us'),             desc: 'Video communications and virtual meeting rooms',        connected: true  },
      { name: 'Calendly',          initials: 'Ca', color: 'bg-blue-500 text-white',      logo: g('calendly.com'),        desc: 'Automated scheduling and appointment booking',          connected: false },
      { name: 'Google Meet',       initials: 'GM', color: 'bg-green-500 text-white',     logo: g('meet.google.com'),     desc: 'Video meetings integrated with Google Workspace',       connected: false },
    ],
  },
  {
    id: 'insights',
    label: 'Insights',
    desc: 'Business intelligence & reporting',
    integrations: [
      { name: 'Power BI',          initials: 'PB', color: 'bg-yellow-500 text-black',    logo: g('powerbi.com'),         desc: 'Interactive data visualisation and business analytics', connected: false },
      { name: 'Tableau',           initials: 'T',  color: 'bg-blue-700 text-white',      logo: g('tableau.com'),         desc: 'Visual analytics platform for data exploration',        connected: false },
      { name: 'Xero',              initials: 'X',  color: 'bg-sky-500 text-white',       logo: g('xero.com'),            desc: 'Cloud accounting and financial management',             connected: true  },
      { name: 'MYOB',              initials: 'MY', color: 'bg-purple-700 text-white',    logo: g('myob.com'),            desc: 'Accounting, payroll and financial management',           connected: false },
    ],
  },
  {
    id: 'learn',
    label: 'Learn',
    desc: 'Training, CPD & professional development',
    integrations: [
      { name: 'LinkedIn Learning', initials: 'Li', color: 'bg-blue-700 text-white',      logo: g('linkedin.com'),        desc: 'Online courses and professional development platform',  connected: false },
      { name: 'LawCPD',            initials: 'LC', color: 'bg-emerald-700 text-white',   logo: g('lawcpd.com.au'),       desc: 'Continuing professional development for lawyers',       connected: false },
      { name: 'Practical Law',     initials: 'PL', color: 'bg-red-600 text-white',       logo: g('thomsonreuters.com'),  desc: 'Legal know-how, precedents and practice resources',     connected: true  },
    ],
  },
  {
    id: 'community',
    label: 'Community',
    desc: 'Team collaboration & internal comms',
    integrations: [
      { name: 'Slack',             initials: 'Sl', color: 'bg-purple-600 text-white',    logo: g('slack.com'),           desc: 'Team messaging and channel-based communication',        connected: true  },
      { name: 'Microsoft Teams',   initials: 'MT', color: 'bg-indigo-500 text-white',    logo: g('teams.microsoft.com'), desc: 'Chat, channels and team collaboration hub',             connected: true  },
      { name: 'Confluence',        initials: 'Co', color: 'bg-blue-600 text-white',      logo: g('atlassian.com'),       desc: 'Team wiki, knowledge base and documentation',           connected: false },
      { name: 'Notion',            initials: 'N',  color: 'bg-slate-800 text-white',     logo: g('notion.so'),           desc: 'Connected workspace for docs, wikis and projects',      connected: false },
      { name: 'Yammer',            initials: 'Y',  color: 'bg-blue-500 text-white',      logo: g('yammer.com'),          desc: 'Enterprise social networking for organisations',         connected: false },
      { name: 'Google Workspace',  initials: 'GW', color: 'bg-green-500 text-white',     logo: g('workspace.google.com'), desc: 'Productivity and collaboration tools suite',            connected: false },
    ],
  },
  {
    id: 'resource',
    label: 'Resource Library',
    desc: 'Precedents, templates & knowledge base',
    integrations: [
      { name: 'iManage',           initials: 'iM', color: 'bg-blue-800 text-white',      logo: g('imanage.com'),         desc: 'Document and email management for legal professionals', connected: true  },
      { name: 'NetDocuments',      initials: 'ND', color: 'bg-sky-700 text-white',       logo: g('netdocuments.com'),    desc: 'Cloud-based document management for law firms',         connected: false },
      { name: 'SharePoint',        initials: 'SP', color: 'bg-teal-600 text-white',      logo: g('sharepoint.com'),      desc: 'Document management and team collaboration platform',   connected: true  },
      { name: 'Docusign CLM',      initials: 'DS', color: 'bg-blue-600 text-white',      logo: g('docusign.com'),        desc: 'Contract lifecycle management and e-signature',         connected: false },
    ],
  },
  {
    id: 'talent',
    label: 'Talent',
    desc: 'HR, recruitment & people management',
    integrations: [
      { name: 'BambooHR',          initials: 'BH', color: 'bg-green-600 text-white',     logo: g('bamboohr.com'),        desc: 'HR software for people data, hiring and onboarding',    connected: false },
      { name: 'Employment Hero',   initials: 'EH', color: 'bg-purple-500 text-white',    logo: g('employmenthero.com'),  desc: 'HR, payroll and benefits management platform',          connected: false },
      { name: 'Rippling',          initials: 'R',  color: 'bg-yellow-400 text-black',    logo: g('rippling.com'),        desc: 'Unified HR, IT and finance management',                 connected: false },
    ],
  },
  {
    id: 'vault',
    label: 'Vault',
    desc: 'Secure document storage & archiving',
    integrations: [
      { name: 'Box',               initials: 'Bx', color: 'bg-blue-500 text-white',      logo: g('box.com'),             desc: 'Secure cloud content management and file sharing',      connected: false },
      { name: 'Dropbox Business',  initials: 'DB', color: 'bg-blue-600 text-white',      logo: g('dropbox.com'),         desc: 'Cloud file storage, sync and collaboration',            connected: false },
      { name: 'AWS S3',            initials: 'S3', color: 'bg-orange-500 text-white',     logo: g('aws.amazon.com'),      desc: 'Scalable cloud object storage infrastructure',          connected: false },
      { name: 'OneDrive',          initials: 'OD', color: 'bg-blue-500 text-white',      logo: g('onedrive.com'),        desc: 'Cloud storage integrated with Microsoft 365',           connected: true  },
    ],
  },
  {
    id: 'data',
    label: 'Data & Analytics',
    desc: 'Data pipelines, warehousing & advanced analytics',
    integrations: [
      { name: 'Snowflake',         initials: 'Sf', color: 'bg-sky-400 text-white',       logo: g('snowflake.com'),       desc: 'Cloud data platform for analytics and data sharing',    connected: false },
      { name: 'BigQuery',          initials: 'BQ', color: 'bg-blue-500 text-white',      logo: g('cloud.google.com'),    desc: 'Serverless data warehouse for analytics at scale',      connected: false },
      { name: 'Zapier',            initials: 'Zp', color: 'bg-orange-500 text-white',    logo: g('zapier.com'),          desc: 'No-code workflow automation between apps',              connected: false },
      { name: 'Make',              initials: 'Mk', color: 'bg-violet-600 text-white',    logo: g('make.com'),            desc: 'Visual integration platform for complex workflows',     connected: false },
      { name: 'Segment',           initials: 'Sg', color: 'bg-green-500 text-white',     logo: g('segment.com'),         desc: 'Customer data platform for data collection and routing',connected: false },
    ],
  },
]

// ─── Sub-components ──────────────────────────────────────────────────────────

function LogoBadge({ integration }) {
  const [failed, setFailed] = useState(false)

  if (!integration.logo || failed) {
    return (
      <span className={`inline-flex size-10 items-center justify-center rounded-lg text-xs font-bold shrink-0 ${integration.color}`}>
        {integration.initials}
      </span>
    )
  }

  return (
    <img
      src={integration.logo}
      alt={integration.name}
      onError={() => setFailed(true)}
      className="size-10 rounded-lg object-contain shrink-0 bg-white border border-border/40"
    />
  )
}

function IntegrationCard({ integration, onViewDetails }) {
  const category = CATEGORIES.find(c => c.integrations.includes(integration))

  return (
    <div className="flex flex-col border border-border/60 rounded-lg bg-white hover:border-border transition-colors">
      {/* Card body */}
      <div className="p-4 flex-1 space-y-3">
        <div className="flex items-start gap-3">
          <LogoBadge integration={integration} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">{integration.name}</p>
            {integration.connected && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 mt-0.5">
                <Check className="size-3" />
                Connected
              </span>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{integration.desc}</p>
        {category && (
          <span className="inline-flex text-xs font-medium text-muted-foreground bg-muted/60 rounded px-1.5 py-0.5 uppercase tracking-wide">
            {category.label}
          </span>
        )}
      </div>

      {/* Card footer */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-border/60">
        {integration.connected ? (
          <>
            <Button size="sm" variant="outline" className="h-7 text-xs px-3" onClick={() => onViewDetails?.(integration)}>
              <Eye className="size-3 mr-1.5" /> View details
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs px-3">
              <Settings2 className="size-3 mr-1.5" /> Manage
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="outline" className="h-7 text-xs px-3">
              Connect
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Outlook Demo ────────────────────────────────────────────────────────────

const OUTLOOK_EMAILS = [
  {
    id: 1,
    from: 'Sarah Mitchell',
    initials: 'SM',
    to: 'James Thornton',
    subject: 'Re: Share Purchase Agreement — Due Diligence Documents',
    preview: 'Dear James, Further to our call this morning, ple...',
    date: 'Thursday, 19 Feb',
    starred: true,
    body: `Dear James,

Further to our call this morning, please find attached the due diligence documents for the Meridian / Northgate acquisition. I have included:

• Revised financial statements (FY2024–2025)
• Updated property valuations for Logistics Ltd
• Employment contracts for senior management
• Material contract summaries
• Environmental compliance certificates

Could you please review and confirm receipt? We need to finalise the due diligence checklist by end of week.

Kind regards,
Sarah Mitchell
General Counsel, Meridian Holdings plc`,
    context: {
      matter: 'Meridian / Northgate Acquisition',
      client: 'Meridian Holdings plc',
      parties: 'S. Mitchell (GC), D. Chen, L. Fitzgerald',
      jurisdiction: 'England & Wales · CMA Regulatory',
      related: '2 related documents in Vault',
    },
  },
  {
    id: 2,
    from: 'David Chen',
    initials: 'DC',
    to: 'James Thornton',
    subject: 'Board Resolution — Meridian Holdings',
    preview: "Hi James, I've reviewed the draft board resoluti...",
    date: 'Thursday, 19 Feb',
    starred: false,
    body: `Hi James,

I've reviewed the draft board resolution for the Meridian Holdings acquisition and have a few comments on the warranty provisions in section 4.3.

Can we schedule a call tomorrow to discuss?

Best,
David Chen`,
    context: {
      matter: 'Meridian / Northgate Acquisition',
      client: 'Meridian Holdings plc',
      parties: 'D. Chen, J. Thornton',
      jurisdiction: 'England & Wales',
      related: '1 related document in Vault',
    },
  },
  {
    id: 3,
    from: 'Laura Fitzgerald',
    initials: 'LF',
    to: 'James Thornton',
    subject: 'Re: Regulatory Filing — FCA Submission',
    preview: 'James, just confirming the deadline for the FCA...',
    date: 'Wednesday, 18 Feb',
    starred: false,
    body: `James,

Just confirming the deadline for the FCA submission is 28 February. I've prepared the draft notification and it's ready for your review in the Vault.

Please let me know if you need any changes.

Laura Fitzgerald`,
    context: {
      matter: 'Meridian / Northgate Acquisition',
      client: 'Meridian Holdings plc',
      parties: 'L. Fitzgerald, J. Thornton',
      jurisdiction: 'England & Wales · FCA',
      related: '3 related documents in Vault',
    },
  },
  {
    id: 4,
    from: 'Marcus Webb',
    initials: 'MW',
    to: 'James Thornton',
    subject: 'Fee Estimate — Project Meridian',
    preview: 'Dear James, Please see the updated fee estima...',
    date: 'Wednesday, 18 Feb',
    starred: false,
    body: `Dear James,

Please see the updated fee estimate for Project Meridian. The total is now £245,000 reflecting the expanded scope of the due diligence phase.

Happy to discuss.

Marcus Webb`,
    context: {
      matter: 'Meridian / Northgate Acquisition',
      client: 'Meridian Holdings plc',
      parties: 'M. Webb, J. Thornton',
      jurisdiction: 'England & Wales',
      related: '1 related document in Vault',
    },
  },
  {
    id: 5,
    from: 'Emily Hartman',
    initials: 'EH',
    to: 'James Thornton',
    subject: 'Conflict Check — New Client Instruction',
    preview: 'Hi James, Could you approve the conflict check...',
    date: 'Tuesday, 17 Feb',
    starred: true,
    body: `Hi James,

Could you approve the conflict check for the new client instruction from Northgate Industries? The preliminary check is clear but requires partner sign-off.

Thanks,
Emily Hartman`,
    context: {
      matter: 'Northgate Industries — New Instruction',
      client: 'Northgate Industries Ltd',
      parties: 'E. Hartman, J. Thornton',
      jurisdiction: 'England & Wales',
      related: 'No related documents',
    },
  },
]

function OutlookDemoOverlay({ onClose }) {
  const [selectedEmail, setSelectedEmail] = useState(OUTLOOK_EMAILS[0])

  return createPortal(
    <div className="fixed inset-0 z-50 bg-[#f3f3f3] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-[#e0e0e0]">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-[#0078d4] flex items-center justify-center">
            <Mail className="size-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Outlook with Ethos AI</p>
            <p className="text-xs text-muted-foreground">Integration Preview — Email Workflow</p>
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="size-5" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Inbox list */}
        <div className="w-[320px] bg-white border-r border-[#e0e0e0] flex flex-col shrink-0">
          <div className="px-4 py-3 border-b border-[#e0e0e0]">
            <p className="text-sm font-semibold text-foreground">Inbox</p>
          </div>
          <div className="flex-1 overflow-auto">
            {OUTLOOK_EMAILS.map(email => (
              <button
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className={`w-full text-left px-4 py-3 border-b border-[#f0f0f0] transition-colors ${
                  selectedEmail.id === email.id ? 'bg-[#e8f0fe] border-l-2 border-l-[#0078d4]' : 'hover:bg-[#f5f5f5]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground truncate">{email.from}</p>
                  {email.starred && <Star className="size-3.5 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />}
                </div>
                <p className="text-sm text-foreground truncate mt-0.5">{email.subject}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{email.preview}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Email view */}
        <div className="flex-1 bg-white flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-[#e0e0e0]">
            {[
              { icon: Reply, label: 'Reply' },
              { icon: ReplyAll, label: 'Reply All' },
              { icon: Forward, label: 'Forward' },
              { icon: Archive, label: 'Archive' },
              { icon: Trash2, label: 'Delete' },
            ].map(action => (
              <button key={action.label} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted/50 rounded transition-colors">
                <action.icon className="size-4" />
                {action.label}
              </button>
            ))}
          </div>

          {/* Email content */}
          <div className="flex-1 overflow-auto p-6">
            <h2 className="text-xl font-normal text-foreground">{selectedEmail.subject}</h2>
            <div className="flex items-center gap-3 mt-4">
              <div className="size-10 rounded-full bg-[#0078d4] flex items-center justify-center text-white text-sm font-semibold">
                {selectedEmail.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{selectedEmail.from}</p>
                <p className="text-xs text-muted-foreground">To: {selectedEmail.to}</p>
                <p className="text-xs text-muted-foreground">{selectedEmail.date}</p>
              </div>
            </div>
            <div className="mt-6 text-sm text-foreground leading-relaxed whitespace-pre-line">
              {selectedEmail.body}
            </div>
          </div>
        </div>

        {/* Ethos AI Sidebar */}
        <div className="w-[320px] bg-[#f1f5f9] border-l border-[rgba(229,229,229,0.6)] flex flex-col shrink-0 overflow-hidden">
          {/* Header */}
          <div className="bg-white px-5 pt-4 pb-3 border-b border-[rgba(229,229,229,0.6)] shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(67.5deg, #A7FFD9 17%, #C3FFD8 49%, #B9FFE3 82%)' }}>
                  <Sparkles className="size-3.5 text-[#153e40]" />
                </div>
                <p className="text-base font-semibold text-[#002022]">Ethos AI</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <span className="size-1.5 rounded-full bg-emerald-500" /> Connected
              </span>
            </div>
          </div>

          {/* Context line */}
          <div className="bg-white px-5 py-3 border-b border-[rgba(229,229,229,0.6)] shrink-0">
            <p className="text-xs text-[#64748b] leading-relaxed">
              Showing context for <span className="font-semibold text-[#0a0a0a]">{selectedEmail.from}</span> — {selectedEmail.subject.split('—')[0].trim()}
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto px-3 py-4 space-y-2">
            {/* Email Context card */}
            <div className="bg-white rounded-[8px] border border-[#e2e8f0] p-3 space-y-3">
              <div className="flex items-center gap-1.5">
                <FileText className="size-3.5 text-[#64748b]" />
                <span className="text-xs font-medium text-[#64748b]">Email Context</span>
              </div>

              {/* Matter card */}
              <div className="rounded-md border border-[#e2e8f0] bg-[#f8fafb] p-2.5">
                <div className="flex items-start justify-between">
                  <p className="text-xs text-[#64748b]">Matter</p>
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                    <Check className="size-3" /> Linked
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground leading-tight mt-1.5">{selectedEmail.context.matter}</p>
              </div>

              <div className="space-y-2.5">
                {[
                  { label: 'Client', value: selectedEmail.context.client },
                  { label: 'Key Parties', value: selectedEmail.context.parties },
                  { label: 'Jurisdiction', value: selectedEmail.context.jurisdiction },
                  { label: 'Related', value: selectedEmail.context.related },
                ].map(field => (
                  <div key={field.label}>
                    <p className="text-xs text-[#64748b]">{field.label}</p>
                    <p className="text-sm font-medium text-foreground">{field.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Draft Response card */}
            <div className="bg-white rounded-[8px] border border-[#e2e8f0] p-3 space-y-2.5">
              <span className="text-xs font-medium text-[#64748b]">Respond</span>

              <div className="space-y-1.5">
                {[
                  { icon: Reply, label: 'Draft reply' },
                  { icon: FileText, label: 'Detailed advice' },
                  { icon: Check, label: 'Acknowledge' },
                  { icon: Mail, label: 'Request info' },
                  { icon: Sparkles, label: 'Summarise thread' },
                ].map(action => (
                  <button key={action.label} className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-foreground hover:bg-[#f1f5f9] transition-colors text-left">
                    <action.icon className="size-3.5 text-[#64748b] shrink-0" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Last synced */}
            <p className="text-xs text-[#64748b] text-center py-3">Last synced: 26 Mar 2026, 2:34 PM</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ─── Row-list view (tenant-driven) ───────────────────────────────────────────

const ROW_STATUS_STYLE = {
  connected: { dot: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-200', bg: 'bg-emerald-50' },
  available: { dot: 'bg-slate-400',   text: 'text-slate-600',   border: 'border-slate-200',   bg: 'bg-slate-50'   },
  error:     { dot: 'bg-rose-500',    text: 'text-rose-700',    border: 'border-rose-200',    bg: 'bg-rose-50'    },
}

const ROW_STATUS_LABEL = {
  connected: 'Connected',
  available: 'Available',
  error:     'Error',
}

function RowLogo({ logo, name }) {
  const [failed, setFailed] = useState(false)
  if (!logo || failed) {
    const initials = name.split(/\s+/).slice(0, 2).map(s => s[0]).join('').toUpperCase()
    return (
      <span className="inline-flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground text-xs font-semibold shrink-0">
        {initials}
      </span>
    )
  }
  return (
    <img
      src={logo}
      alt={name}
      onError={() => setFailed(true)}
      className="size-10 rounded-lg object-contain shrink-0 bg-white border border-border/40 p-1"
    />
  )
}

function IntegrationRow({ row }) {
  const style = ROW_STATUS_STYLE[row.status] ?? ROW_STATUS_STYLE.available
  const Icon = row.status === 'error' ? AlertTriangle : null
  return (
    <div
      className={cn(
        'flex items-center gap-4 px-5 py-4 border-b border-border/40 last:border-0',
        row.featured && 'bg-brand-50/40',
      )}
    >
      <RowLogo logo={row.logo} name={row.name} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">{row.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{row.desc}</p>
      </div>
      <span className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 h-6 text-[11px] font-medium shrink-0',
        style.border, style.bg, style.text,
      )}>
        {Icon ? <Icon className="size-3" /> : <span className={cn('size-1.5 rounded-full', style.dot)} />}
        {ROW_STATUS_LABEL[row.status] ?? row.status}
      </span>
      <span className="text-xs text-muted-foreground shrink-0 w-32 text-right tabular-nums">
        {row.status === 'connected' && row.lastSync ? `Last sync ${row.lastSync}` : '—'}
      </span>
      <Button size="sm" variant={row.status === 'connected' ? 'outline' : 'default'} className="h-8 text-xs px-3 shrink-0">
        {row.status === 'connected' ? 'Manage' : 'Connect'}
      </Button>
    </div>
  )
}

function IntegrationsRowListView({ rows }) {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('all')

  const counts = useMemo(() => ({
    all:       rows.length,
    connected: rows.filter(r => r.status === 'connected').length,
    available: rows.filter(r => r.status === 'available').length,
  }), [rows])

  const filtered = rows.filter(r => {
    if (tab === 'connected' && r.status !== 'connected') return false
    if (tab === 'available' && r.status !== 'available') return false
    if (search) {
      const q = search.toLowerCase()
      if (!r.name.toLowerCase().includes(q) && !r.desc.toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-5">

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Integrations</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Connect Ethos to the systems that already run your governance work.
              </p>
            </div>
            <Button size="sm" variant="outline" className="gap-1.5 shrink-0">
              <ExternalLink className="size-3.5" /> Request integration
            </Button>
          </div>

          <div className="border border-border/60 rounded-lg overflow-hidden bg-white">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
              <div className="flex items-center gap-1">
                {[
                  { key: 'all',       label: `All (${counts.all})` },
                  { key: 'connected', label: `Connected (${counts.connected})` },
                  { key: 'available', label: `Available (${counts.available})` },
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={cn(
                      'px-3 py-1 text-sm font-medium rounded transition-colors',
                      tab === t.key
                        ? 'bg-brand-800 text-brand-50'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="relative w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search integrations..."
                  className="w-full h-8 pl-9 pr-3 text-xs border border-border/60 rounded bg-background outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div>
              {filtered.length === 0 ? (
                <p className="px-5 py-10 text-sm text-muted-foreground text-center">
                  No integrations match your search.
                </p>
              ) : (
                filtered.map(row => <IntegrationRow key={row.id} row={row} />)
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IntegrationsPage() {
  const integrationsRows = tenant.pages?.integrations?.rows
  if (integrationsRows?.length) {
    return <IntegrationsRowListView rows={integrationsRows} />
  }

  // Fallback: existing card-grid view (default and other tenants)
  return <IntegrationsCardGridView />
}

function IntegrationsCardGridView() {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showOutlookDemo, setShowOutlookDemo] = useState(false)

  // Counts
  const totalConnected = CATEGORIES.reduce((sum, c) => sum + c.integrations.filter(i => i.connected).length, 0)
  const totalAvailable = CATEGORIES.reduce((sum, c) => sum + c.integrations.filter(i => !i.connected).length, 0)

  // Flatten + filter
  const allIntegrations = CATEGORIES.flatMap(c => c.integrations)
  const filtered = allIntegrations.filter(i => {
    if (tab === 'connected' && !i.connected) return false
    if (tab === 'available' && i.connected) return false
    if (selectedCategory) {
      const cat = CATEGORIES.find(c => c.id === selectedCategory)
      if (cat && !cat.integrations.includes(i)) return false
    }
    if (search) {
      const q = search.toLowerCase()
      if (!i.name.toLowerCase().includes(q) && !i.desc.toLowerCase().includes(q)) return false
    }
    return true
  })

  // "Missing" card at end
  const showMissing = !search && tab !== 'connected'

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-5">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-medium leading-none tracking-[-0.045em] text-foreground">Integrations</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Review your integrations and enable new connections. Ethos works with your current tools or can replace them over time.
              </p>
            </div>
            <Button size="sm" variant="outline" className="gap-1.5 shrink-0">
              <ExternalLink className="size-3.5" /> Request integration
            </Button>
          </div>

          {/* Tabs + Search bar inside a bordered container */}
          <div className="border border-border/60 rounded overflow-hidden bg-white">

            {/* Tabs row */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
              <div className="flex items-center gap-1">
                {[
                  { key: 'all', label: `All (${allIntegrations.length})` },
                  { key: 'connected', label: `Connected (${totalConnected})` },
                  { key: 'available', label: `Available (${totalAvailable})` },
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                      tab === t.key
                        ? 'bg-brand-800 text-brand-50'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="relative w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search integrations..."
                  className="w-full h-8 pl-9 pr-3 text-xs border border-border/60 rounded bg-background outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Category sidebar + card grid */}
            <div className="flex">

              {/* Category sidebar */}
              <div className="w-52 shrink-0 border-r border-border/60 p-3 space-y-0.5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-2.5 mb-1.5">Categories</p>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left text-sm px-2.5 py-1.5 rounded transition-colors ${
                    !selectedCategory ? 'bg-brand-50 text-brand-800 font-medium' : 'text-foreground hover:bg-muted/50'
                  }`}
                >
                  All
                </button>
                {CATEGORIES.map(c => {
                  const count = c.integrations.filter(i => {
                    if (tab === 'connected') return i.connected
                    if (tab === 'available') return !i.connected
                    return true
                  }).length
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id === selectedCategory ? null : c.id)}
                      className={`w-full flex items-center justify-between text-sm px-2.5 py-1.5 rounded transition-colors ${
                        selectedCategory === c.id ? 'bg-brand-50 text-brand-800 font-medium' : 'text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <span>{c.label}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">{count}</span>
                    </button>
                  )
                })}
              </div>

              {/* Card grid */}
              <div className="flex-1 p-4">
                {filtered.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {filtered.map((integration) => (
                      <IntegrationCard
                        key={integration.name + integration.desc}
                        integration={integration}
                        onViewDetails={(i) => { if (i.name === 'Microsoft Outlook') setShowOutlookDemo(true) }}
                      />
                    ))}

                    {/* Missing integration card */}
                    {showMissing && (
                      <div className="flex flex-col items-center justify-center border border-dashed border-border/60 rounded-lg p-6 text-center">
                        <p className="text-sm font-medium text-foreground mb-1">Missing an integration?</p>
                        <p className="text-xs text-muted-foreground mb-3">Let us know what you need</p>
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          Request an integration
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <p className="text-sm text-muted-foreground">No integrations found matching your search.</p>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Footer hints */}
          <div className="bg-white rounded-lg p-5 space-y-3 border border-border/60">
            <div className="flex items-start gap-3">
              <Settings2 className="size-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-sm text-foreground/80">
                You can connect systems later from <span className="font-semibold text-foreground">Settings</span>.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="size-4 text-muted-foreground mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
              <p className="text-sm text-foreground/80">
                Ethos can also operate as your <span className="font-semibold text-foreground">central platform</span>.
              </p>
            </div>
          </div>

        </div>
      </div>

      {showOutlookDemo && <OutlookDemoOverlay onClose={() => setShowOutlookDemo(false)} />}
    </div>
  )
}
