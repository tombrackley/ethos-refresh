import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import TopicQuiz from '@/components/TopicQuiz'
import Feature from '@/components/Feature'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  X, ChevronDown, Lightbulb, Send, CheckSquare, Square,
  Sparkles, MessageSquare, Clock, BookOpen, ExternalLink, Link2,
  ArrowUp, ChevronUp, PanelRightClose,
} from 'lucide-react'

// ─── Data ────────────────────────────────────────────────────────────────────

const TOPICS = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'key-updates', label: 'Key Updates & Trends' },
  {
    id: 'your-duties', label: 'Your Duties', children: [
      { id: 'core-statutory', label: 'Core Statutory Duties' },
      { id: 'other-duties', label: 'Other duties' },
      { id: 'watch-out', label: 'Watch out for' },
    ],
  },
  { id: 'summary', label: 'Summary' },
]

const KEY_TRENDS = [
  {
    title: 'Statutory amendments in Corporations Act 2001 (Cth)',
    description: 'The consolidated Corporations Act (as of Feb 2025) includes multiple amendments (Acts No. 14, 15 of 2025)',
    link: { label: 'Federal Register of Legislation', url: '#' },
    matters: 'Directors need to use the most up-to-date Act when referencing obligations',
  },
  {
    title: 'Statutory amendments in Corporations Act 2001 (Cth)',
    description: 'The consolidated Corporations Act (as of Feb 2025) includes multiple amendments (Acts No. 14, 15 of 2025)',
    link: { label: 'Federal Register of Legislation', url: '#' },
    matters: 'Directors need to use the most up-to-date Act when referencing obligations',
  },
  {
    title: 'Statutory amendments in Corporations Act 2001 (Cth)',
    description: 'The consolidated Corporations Act (as of Feb 2025) includes multiple amendments (Acts No. 14, 15 of 2025)',
    link: { label: 'Federal Register of Legislation', url: '#' },
    matters: 'Directors need to use the most up-to-date Act when referencing obligations',
  },
]

const CORE_STATUTORY_DUTIES = [
  {
    title: 'Act with care and diligence',
    body: 'You must perform your role carefully and attentively, with a degree of care and diligence\u2014taking appropriate steps and asking questions to understand key issues and risks.',
  },
  {
    title: 'Act in good faith, in the best interests of the company, and for a proper purpose',
    body: 'Your decisions should aim to benefit the company (as a whole), not yourself or another party, which would cause detriment to the company. Use your powers according to the purpose for which they were given while avoiding actual, potential, and perceived conflicts of interest.',
  },
  {
    title: 'Not misuse your role',
    body: 'You should not use your position as a director to gain a benefit (directly or indirectly) or cause harm to the company. This includes refraining from using confidential information gained through your role.',
  },
  {
    title: 'Not misuse information',
    body: 'Any information you obtain because of your role should not be used to advantage yourself or others, causing detriment to the company.',
  },
  {
    title: 'Business judgment rule (safe harbour in section 180(2))',
    body: 'If you make a business decision in good faith, for a proper purpose, without material personal interest, after making reasonable inquiry, and believe it is in the company\'s best interests, that decision is presumed to meet the duty of care and diligence.',
  },
]

const OTHER_DUTIES = [
  {
    title: 'Act with care and diligence',
    body: 'You must perform your role carefully and attentively, with a degree of care and diligence\u2014taking appropriate steps and asking questions to understand key issues and risks.',
  },
  {
    title: 'Act in good faith, in the best interests of the company, and for a proper purpose',
    body: 'Your decisions should aim to benefit the company (as a whole), not yourself or another party, which would cause detriment to the company. Use your powers according to the purpose for which they were given while avoiding actual, potential, and perceived conflicts of interest.',
  },
  {
    title: 'Not misuse your role',
    body: 'You should not use your position as a director to gain a benefit (directly or indirectly) or cause harm to the company. This includes refraining from using confidential information gained through your role.',
  },
  {
    title: 'Not misuse information',
    body: 'Any information you obtain because of your role should not be used to advantage yourself or others, causing detriment to the company.',
  },
  {
    title: 'Business judgment rule (safe harbour in section 180(2))',
    body: 'If you make a business decision in good faith, for a proper purpose, without material personal interest, after making reasonable inquiry, and believe it is in the company\'s best interests, that decision is presumed to meet the duty of care and diligence.',
  },
]

const AI_SUGGESTIONS = [
  'Summarise',
  'Explain Key Trends',
  'Latest updates',
  'What are my duties',
  'Recommend actions',
]

const TOPIC_LINKS = [
  { label: 'Modern Slavery Policy', url: '#' },
  { label: 'Example Link 2', url: '#' },
  { label: 'Example link 3', url: '#' },
]

// ─── Sub-components ──────────────────────────────────────────────────────────

// ─── Generic content sections for non-Duties items ──────────────────────────

const GENERIC_SECTIONS = {
  'kc-ai-gov': {
    topics: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'risk-assessment', label: 'AI Risk Assessment' },
      { id: 'ethical-use', label: 'Ethical Use Policies' },
      { id: 'board-oversight', label: 'Board Oversight of AI' },
    ],
    sections: [
      { id: 'introduction', title: 'Introduction', content: 'This framework provides guidelines for responsible AI adoption within your organisation. It covers key areas including risk assessment, ethical use policies, and the role of board oversight in AI-driven decision making. As AI becomes increasingly embedded in business operations, directors and officers must understand their governance obligations.' },
      { id: 'risk-assessment', title: 'AI Risk Assessment', content: 'Organisations deploying AI systems must conduct thorough risk assessments covering algorithmic bias, data privacy, model transparency, and potential impacts on stakeholders. This section outlines a structured approach to identifying, evaluating, and mitigating AI-specific risks across the enterprise.' },
      { id: 'ethical-use', title: 'Ethical Use Policies', content: 'Establishing clear ethical boundaries for AI use is essential. This includes policies on automated decision-making, human oversight requirements, fairness and non-discrimination principles, and transparency obligations. Your organisation should develop an AI ethics charter that aligns with industry standards and regulatory expectations.' },
      { id: 'board-oversight', title: 'Board Oversight of AI', content: 'Boards have a fiduciary duty to understand and oversee AI deployments that materially affect the business. This section covers board reporting frameworks, key questions directors should ask, and governance structures for effective AI oversight including the role of AI ethics committees.' },
    ],
  },
  'kc-banking': {
    topics: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'apra-framework', label: 'APRA Regulatory Framework' },
      { id: 'asic-obligations', label: 'ASIC Obligations' },
      { id: 'prudential-standards', label: 'Prudential Standards' },
    ],
    sections: [
      { id: 'introduction', title: 'Introduction', content: 'This course provides an end-to-end overview of the Australian banking regulatory landscape. It covers the dual-regulator model (APRA and ASIC), prudential standards, and compliance obligations for authorised deposit-taking institutions and financial services licensees.' },
      { id: 'apra-framework', title: 'APRA Regulatory Framework', content: 'The Australian Prudential Regulation Authority (APRA) is responsible for the prudential regulation of banks, insurers, and superannuation funds. This section covers APRA\'s supervisory approach, key prudential standards (CPS 220, CPS 234, CPS 230), and reporting obligations that boards must understand.' },
      { id: 'asic-obligations', title: 'ASIC Obligations', content: 'The Australian Securities and Investments Commission (ASIC) regulates market conduct and consumer protection in financial services. This section covers AFS licensing requirements, responsible lending obligations, breach reporting, and ASIC\'s enforcement priorities for the current regulatory cycle.' },
      { id: 'prudential-standards', title: 'Prudential Standards', content: 'Prudential standards set minimum requirements for risk management, governance, and capital adequacy. Key standards covered include CPS 510 (Governance), CPS 220 (Risk Management), CPS 234 (Information Security), and the new CPS 230 (Operational Risk Management) effective from July 2025.' },
    ],
  },
  'kc-risk': {
    topics: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'risk-identification', label: 'Risk Identification' },
      { id: 'appetite-setting', label: 'Risk Appetite Setting' },
      { id: 'control-frameworks', label: 'Control Frameworks' },
    ],
    sections: [
      { id: 'introduction', title: 'Introduction', content: 'This framework covers enterprise risk identification, appetite setting, and control frameworks aligned with ISO 31000 and COSO standards. It provides practical guidance for boards and management on establishing and maintaining effective risk governance.' },
      { id: 'risk-identification', title: 'Risk Identification', content: 'Effective risk management begins with comprehensive identification of risks across the enterprise. This section covers techniques for risk identification including risk workshops, scenario analysis, emerging risk scanning, and the use of risk taxonomies to ensure completeness.' },
      { id: 'appetite-setting', title: 'Risk Appetite Setting', content: 'Risk appetite defines the level and types of risk an organisation is willing to accept in pursuit of its objectives. This section provides guidance on developing risk appetite statements, setting tolerances and limits, and cascading appetite through the organisation.' },
      { id: 'control-frameworks', title: 'Control Frameworks', content: 'Control frameworks provide the structure for managing identified risks within appetite. This section covers the three lines model, control design and testing, key risk indicators (KRIs), and reporting frameworks that give boards assurance over the control environment.' },
    ],
  },
  'kc-privacy': {
    topics: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'privacy-act', label: 'Privacy Act Obligations' },
      { id: 'apps', label: 'Australian Privacy Principles' },
      { id: 'breach-notification', label: 'Data Breach Notification' },
    ],
    sections: [
      { id: 'introduction', title: 'Introduction', content: 'This guide provides practical guidance on Privacy Act obligations, Australian Privacy Principles (APPs), cross-border data transfers, and data breach notification requirements. It is designed for directors and compliance officers who need to understand their organisation\'s privacy obligations.' },
      { id: 'privacy-act', title: 'Privacy Act Obligations', content: 'The Privacy Act 1988 (Cth) regulates the handling of personal information by Australian Government agencies and private sector organisations. This section covers who is bound by the Act, key definitions, and the interaction between federal and state privacy laws.' },
      { id: 'apps', title: 'Australian Privacy Principles', content: 'The 13 Australian Privacy Principles (APPs) set out standards for the handling of personal information. This section covers collection, use, disclosure, storage, access, and correction obligations with practical examples and common compliance pitfalls.' },
      { id: 'breach-notification', title: 'Data Breach Notification', content: 'The Notifiable Data Breaches (NDB) scheme requires organisations to notify affected individuals and the OAIC when a data breach is likely to result in serious harm. This section covers assessment criteria, notification timelines, and remediation steps.' },
    ],
  },
  'kc-aml': {
    topics: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'cdd', label: 'Customer Due Diligence' },
      { id: 'reporting', label: 'Suspicious Matter Reporting' },
      { id: 'compliance-program', label: 'Compliance Program Design' },
    ],
    sections: [
      { id: 'introduction', title: 'Introduction', content: 'This course covers core AML/CTF obligations under the Anti-Money Laundering and Counter-Terrorism Financing Act 2006. It provides practical guidance on customer due diligence, suspicious matter reporting, and compliance program design for reporting entities.' },
      { id: 'cdd', title: 'Customer Due Diligence', content: 'Customer due diligence (CDD) is a fundamental obligation for reporting entities. This section covers customer identification and verification procedures, enhanced due diligence for high-risk customers, ongoing CDD requirements, and beneficial ownership identification.' },
      { id: 'reporting', title: 'Suspicious Matter Reporting', content: 'Reporting entities must report suspicious matters to AUSTRAC. This section covers the indicators of suspicious activity, reporting thresholds and timelines, tipping-off offences, and practical guidance on building effective transaction monitoring systems.' },
      { id: 'compliance-program', title: 'Compliance Program Design', content: 'Every reporting entity must have an AML/CTF compliance program. This section covers the two-part structure (Part A and Part B), risk assessment methodology, employee training requirements, independent review obligations, and record-keeping standards.' },
    ],
  },
  'kc-modern-slavery': {
    topics: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'reporting-obligations', label: 'Reporting Obligations' },
      { id: 'supply-chain', label: 'Supply Chain Due Diligence' },
      { id: 'risk-assessment', label: 'Risk Assessment' },
    ],
    sections: [
      { id: 'introduction', title: 'Introduction', content: 'This guide provides step-by-step guidance on Modern Slavery Act reporting, supply chain due diligence, and risk assessment methodologies. It is designed for organisations meeting the reporting threshold and those seeking to understand their supply chain risks.' },
      { id: 'reporting-obligations', title: 'Reporting Obligations', content: 'Entities with annual consolidated revenue of $100 million or more must submit a modern slavery statement to the Australian Border Force. This section covers statement requirements, mandatory criteria, approval processes, and publication timelines.' },
      { id: 'supply-chain', title: 'Supply Chain Due Diligence', content: 'Effective supply chain due diligence is central to identifying modern slavery risks. This section covers supplier mapping, questionnaire design, audit programs, and remediation frameworks when modern slavery risks are identified.' },
      { id: 'risk-assessment', title: 'Risk Assessment', content: 'Risk assessment methodologies help organisations prioritise their modern slavery response. This section covers sector-specific risk factors, geographic risk indicators, product and service risk categories, and frameworks for assessing the severity and likelihood of modern slavery in supply chains.' },
    ],
  },
  'kc-cyber': {
    topics: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'incident-response', label: 'Incident Response' },
      { id: 'risk-appetite', label: 'Cyber Risk Appetite' },
      { id: 'regulatory', label: 'Regulatory Obligations' },
    ],
    sections: [
      { id: 'introduction', title: 'Introduction', content: 'This framework provides board-level guidance on cyber security governance, covering incident response planning, cyber risk appetite setting, and regulatory obligations. It is designed to help directors fulfil their oversight responsibilities in an increasingly complex threat landscape.' },
      { id: 'incident-response', title: 'Incident Response', content: 'An effective incident response plan is critical for minimising the impact of cyber security incidents. This section covers the incident response lifecycle, roles and responsibilities, communication protocols, and post-incident review processes that boards should expect to see in place.' },
      { id: 'risk-appetite', title: 'Cyber Risk Appetite', content: 'Boards must set and oversee cyber risk appetite as part of broader enterprise risk management. This section covers how to define cyber risk appetite, translate it into measurable tolerances, and integrate it with business strategy and investment decisions.' },
      { id: 'regulatory', title: 'Regulatory Obligations', content: 'Cyber security regulatory obligations continue to expand. This section covers CPS 234 (Information Security) for APRA-regulated entities, the Security of Critical Infrastructure Act 2018, notifiable data breach requirements, and emerging regulatory expectations around cyber resilience.' },
    ],
  },
}

function TopicNav({ activeTopic, onTopicClick, topics }) {
  const navTopics = topics || TOPICS
  return (
    <nav className="space-y-0.5">
      {navTopics.map((topic) => (
        <div key={topic.id}>
          <button
            onClick={() => onTopicClick(topic.id)}
            className={`w-full text-left text-sm py-1.5 px-2 transition-colors ${
              activeTopic === topic.id
                ? 'text-foreground font-medium border-r-2 border-brand-800'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {topic.label}
          </button>
          {topic.children && (
            <div className="ml-4 space-y-0.5 mt-0.5">
              {topic.children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => onTopicClick(child.id)}
                  className={`w-full text-left text-xs py-1 px-2 rounded transition-colors ${
                    activeTopic === child.id
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {child.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

function TrendCard({ trend, isLast }) {
  return (
    <div className="flex items-stretch gap-3">
      <div className="flex flex-col items-center shrink-0">
        <div className="size-2 rounded-full bg-gray-300 mt-2.5 shrink-0" />
        {!isLast && <div className="w-px flex-1 bg-gray-200" />}
      </div>
      <div className="space-y-3 flex-1 pb-8">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground leading-6">{trend.title}</p>
          <p className="text-base text-foreground/70 leading-7">
            {trend.description}{' '}
            <span className="text-blue-600 underline cursor-pointer">({trend.link.label})</span>
          </p>
        </div>
        <div className="border border-blue-100 pl-4 py-3 space-y-1 rounded-md" style={{ backgroundColor: '#FDFEFF' }}>
          <p className="text-sm font-semibold text-foreground">Why this matters?</p>
          <p className="text-sm text-foreground/70">{trend.matters}</p>
        </div>
      </div>
    </div>
  )
}

function DutyList({ title, duties }) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <ol className="space-y-4 list-none">
        {duties.map((duty, i) => (
          <li key={i} className="space-y-1">
            <p className="text-base text-foreground">
              <span className="font-semibold">{i + 1}. {duty.title}</span>
            </p>
            <p className="text-base text-foreground/70 leading-7 pl-4">{duty.body}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

function SectionFooter({ understood, onToggleUnderstood, timestamp, onQuiz, isComplete }) {
  return (
    <div className="space-y-4 pt-4">
      {/* Topic links */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Topic links:</span>
        {TOPIC_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.url}
            className="inline-flex items-center gap-1.5 text-xs text-brand-800 border border-brand-200 rounded-full px-3 py-1 hover:bg-brand-50 transition-colors"
          >
            <Link2 className="size-3" />
            {link.label}
          </a>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        {isComplete ? (
          <span className="flex items-center gap-2 text-sm text-brand-600 border border-border rounded-lg px-4 py-2.5">
            <CheckSquare className="size-4" />
            Marked understood 17 May, 2026
          </span>
        ) : timestamp ? (
          <span className="flex items-center gap-2 text-sm text-brand-600 border border-border rounded-lg px-4 py-2.5">
            <CheckSquare className="size-4" />
            Marked understood {timestamp}
          </span>
        ) : (
          <button
            onClick={onToggleUnderstood}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg px-4 py-2.5 transition-colors"
          >
            {understood ? (
              <CheckSquare className="size-4 text-brand-600" />
            ) : (
              <Square className="size-4" />
            )}
            Mark as understood
          </button>
        )}
        <button
          onClick={onQuiz}
          className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-brand-700 border border-border rounded-lg px-4 py-2.5 transition-colors"
        >
          <Lightbulb className="size-4" />
          {isComplete ? 'View quiz results' : 'Take quiz on topic'}
        </button>
        <button className="flex items-center justify-center border border-border rounded-lg px-3 py-2.5 text-muted-foreground hover:text-foreground transition-colors">
          <MessageSquare className="size-4" />
        </button>
      </div>
    </div>
  )
}

const HISTORY_ENTRIES = [
  { date: '12th Jun', time: '6:48pm', title: 'Document Modified', author: 'Ethika', icon: 'ethika', hasViewChanges: true },
  { date: '12th Jun', time: '6:48pm', title: 'Document Modified', author: 'Ethika', icon: 'ethika' },
  { date: '12th Jun', time: '6:48pm', title: 'Document Modified', author: 'Ethika', icon: 'ethika' },
  { date: '12th Jun', time: '6:48pm', title: 'Document Modified', author: 'Ethika', icon: 'ethika' },
  { date: '12th Jun', time: '6:48pm', title: 'Advisory Service Initiated', author: 'Ramona Roach', icon: 'initials' },
  { date: '12th Jun', time: '6:48pm', title: 'Document Added', author: 'Ramona Roach', icon: 'initials' },
]

const COMMENTS = [
  {
    id: 1,
    author: 'John Smith',
    avatar: null,
    time: '2h ago',
    body: '@Sally Jones et tincidunt senectus purus a consectetur mattis pharetra nec tempus nulla condimentum aenean consectetur neque integer proin vivamus viverra ut vitae sed.',
    replies: 1,
  },
  {
    id: 2,
    author: 'Sally Jones',
    avatar: null,
    initials: 'SJ',
    time: '2h ago',
    body: 'Lorem ipsum et tincidunt senectus purus a consectetur mattis pharetra',
    isReply: true,
  },
]

function SidePanelTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-2">
      <div className="flex items-center gap-1.5">
        {['Ask', 'History', 'Comments'].map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              activeTab === tab
                ? 'bg-brand-800 text-white font-medium'
                : 'text-muted-foreground border border-border hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <button className="text-muted-foreground hover:text-foreground">
        <PanelRightClose className="size-4" />
      </button>
    </div>
  )
}

function AskTab() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Ethos swirl icon */}
        <div className="size-16 mb-5 relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-300 via-brand-300 to-cyan-300 opacity-60 blur-sm" />
          <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-pink-400 via-emerald-300 to-cyan-300 opacity-80" />
          <div className="absolute inset-3 rounded-full bg-gradient-to-bl from-pink-200 via-white to-cyan-200 opacity-90" />
        </div>
        <p className="text-base font-medium text-foreground mb-6">Hi John, how can I help?</p>
        <div className="flex flex-wrap justify-center gap-2">
          {AI_SUGGESTIONS.map((s) => (
            <button
              key={s}
              className="flex items-center gap-1.5 text-xs text-muted-foreground bg-white border border-border rounded-full px-3 py-1.5 hover:bg-muted transition-colors"
            >
              <Sparkles className="size-3" />
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Chat input */}
      <div className="px-4 pb-4 space-y-3">
        <div className="relative">
          <Input
            placeholder="Ask something about this..."
            className="pr-10 text-sm rounded-full bg-white border-border h-12"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 size-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowUp className="size-4" />
          </button>
        </div>
        <p className="text-xs text-brand-700/60 text-center leading-tight">
          AI can make mistakes. We recommend independent<br />review before acting on outputs.
        </p>
      </div>
    </div>
  )
}

function HistoryTab() {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      {/* Summary */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">History</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Document was most recently updated by Ramona Roach, main changes were Lorem ipsum dolor sit amet consectetur. Convallis augue sapien accumsan mattis dignissim nulla. Aliquet pulvinar viverra fermentum tempor ornare.
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {HISTORY_ENTRIES.map((entry, i) => (
          <div key={i} className="group flex gap-3">
            {/* Date column */}
            <div className="w-16 shrink-0 pt-1">
              <p className="text-xs text-muted-foreground leading-tight">{entry.date}</p>
              <p className="text-xs text-muted-foreground">{entry.time}</p>
            </div>

            {/* Dot + line */}
            <div className="flex flex-col items-center shrink-0">
              <div className="size-2 rounded-full bg-brand-800 mt-2" />
              {i < HISTORY_ENTRIES.length - 1 && <div className="w-px flex-1 bg-border" />}
            </div>

            {/* Content */}
            <div className="pb-6 pt-0.5 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-normal leading-none text-black">{entry.title}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {entry.icon === 'ethika' ? (
                      <img src="/ethos-icon.svg" alt="Ethos" className="size-5 rounded-full" />
                    ) : (
                      <div className="size-5 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-[8px] text-muted-foreground font-medium">
                          {entry.author.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">{entry.author}</span>
                  </div>
                </div>
                {entry.hasViewChanges && (
                  <button className="text-xs text-muted-foreground hover:text-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    View changes
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CommentsTab() {
  const hasComments = COMMENTS.length > 0

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {!hasComments ? (
          <div className="px-4 py-6">
            <p className="text-sm text-muted-foreground text-center">No comments yet</p>
          </div>
        ) : (
          <div className="px-4 py-4">
            {/* Comments card */}
            <div className="bg-white rounded-lg p-4 space-y-0">
              {COMMENTS.map((comment) => (
                <div key={comment.id} className={`py-3 ${comment.isReply ? 'pl-8 border-t border-border' : ''}`}>
                  <div className="flex items-start gap-2.5">
                    <Avatar className="size-7 shrink-0">
                      {comment.avatar ? (
                        <AvatarImage src={comment.avatar} />
                      ) : (
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
                          {comment.initials || comment.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{comment.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{comment.body}</p>
                      {comment.replies && (
                        <button className="flex items-center gap-1 text-xs font-medium text-foreground hover:text-brand-700 mt-1">
                          {comment.replies} reply <ChevronDown className="size-3" />
                        </button>
                      )}
                      {comment.isReply && (
                        <button className="text-xs font-medium text-foreground hover:text-brand-700 mt-1">Reply</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Comment input */}
      <div className="px-4 pb-4 space-y-2">
        <div className="relative">
          <Input
            placeholder="Leave a comment"
            className="pr-10 text-sm rounded-full bg-white border-border h-12"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 size-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowUp className="size-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground leading-tight">
          Use &apos;@&apos; to tag people in your organisation
        </p>
      </div>
    </div>
  )
}

function AiSidePanel({ activeTab, onTabChange }) {
  return (
    <div className="flex flex-col h-full">
      <SidePanelTabs activeTab={activeTab} onTabChange={onTabChange} />

      {activeTab === 'Ask' && <AskTab />}
      {activeTab === 'History' && <HistoryTab />}
      {activeTab === 'Comments' && <CommentsTab />}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function DutiesHandbook({ onClose, item }) {
  const [activeTopic, setActiveTopic] = useState('introduction')
  const [aiTab, setAiTab] = useState('Ask')
  const [quizOpen, setQuizOpen] = useState(false)

  const isDutiesHandbook = !item || item.id === 'kc-duties'
  const genericData = !isDutiesHandbook && item ? GENERIC_SECTIONS[item.id] : null
  const readerTitle = isDutiesHandbook ? 'Duties Handbook' : item?.title || 'Content Reader'
  const navTopics = genericData?.topics || TOPICS

  function scrollToSection(id) {
    setActiveTopic(id)
    const el = document.getElementById(`handbook-${id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* ── Header ── */}
      <header className="flex items-center h-14 px-4 border-b border-border shrink-0 relative">
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-5" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 text-sm text-muted-foreground">{readerTitle}</span>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left sidebar — fixed width */}
        <aside className="w-[280px] shrink-0 overflow-y-auto px-6 pt-8">
          <div className="space-y-5 border-r border-border/40 pr-4">
            {/* Country selector */}
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium">Country</p>
              <button className="flex items-center gap-2 w-full text-sm text-foreground hover:text-brand-700 transition-colors">
                <span className="text-base">🇦🇺</span>
                <span className="font-medium">Australia</span>
                <ChevronDown className="size-3.5 ml-auto text-muted-foreground" />
              </button>
            </div>

            {/* Topics nav */}
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium">Topics</p>
              <TopicNav activeTopic={activeTopic} onTopicClick={scrollToSection} topics={navTopics} />
            </div>
          </div>
        </aside>

        {/* Center content area */}
        <main className="flex-1 overflow-y-auto">
          {/* Hero section */}
          <div className="mx-6 mt-6">
            {/* Hero image */}
            {item?.heroImage ? (
              <div className="w-full aspect-[3/1] overflow-hidden rounded-lg">
                <img src={item.heroImage} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full aspect-[3/1] bg-gradient-to-b from-cyan-100 to-cyan-50 rounded-lg" />
            )}
            {/* Title card — overlapping hero */}
            <div className="bg-white border border-border/40 rounded-lg py-10 max-w-[800px] mx-auto -mt-12 relative shadow-[0_0_12px_rgba(0,0,0,0.03)]">
              <div className="max-w-[700px] mx-auto space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-white text-foreground border border-border text-xs font-normal">
                  🇦🇺 Australia
                </Badge>
              </div>
              <h1 className="text-3xl font-medium leading-none tracking-tight text-foreground" style={{ letterSpacing: '-0.5px' }}>{readerTitle}</h1>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {item?.parts && (
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="size-3.5" />{item.parts} parts
                  </span>
                )}
                {item?.estimatedTime && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5" />{item.estimatedTime}
                  </span>
                )}
              </div>
              <Separator className="my-6 opacity-40" />
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <img src="/images/ethika-avatar.png" alt="Ethika" className="size-5 rounded-full" />
                  {isDutiesHandbook ? 'Last updated Today by Ethika' : `${item?.updated || ''} by Ethika`}
                </span>
                {item?.completion === 'in-progress' && item?.progress != null && item?.parts && (
                  <span className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{Math.round((item.progress / 100) * item.parts)} of {item.parts} completed</span>
                    <Progress value={item.progress} className="w-24 h-1.5 bg-gray-200 [&>[data-slot=progress-indicator]]:bg-lime-400" />
                    <span className="text-xs text-muted-foreground">{item.progress}%</span>
                  </span>
                )}
                {item?.completion === 'complete' && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 bg-lime-50 border border-gray-200 rounded-full px-1.5 h-6">
                    <span className="size-3 rounded-full bg-emerald-700 flex items-center justify-center">
                      <svg className="size-2 text-white" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 4L3.5 6L6.5 2" /></svg>
                    </span>
                    Completed
                  </span>
                )}
              </div>
              </div>
            </div>
          </div>

          <div className="max-w-[700px] mx-auto py-8">
            {/* Body content */}
            <div className="space-y-10">

            {isDutiesHandbook ? (
              <>
                {/* Introduction */}
                <section id="handbook-introduction" className="space-y-4">
                  <h2 className="text-2xl font-normal leading-8 text-black" style={{ letterSpacing: '-0.6px' }}>Introduction</h2>
                  <p className="text-base text-foreground/70 leading-7">
                    Lorem ipsum dolor sit amet consectetur. Rhoncus eget tortor fusce amet sit sollicitudin tristique. Non dictum nulla tristique aenean placerat ac dictum non. Quis a sed congue consectetur volupat. Est magna sapien non nunc.
                  </p>
                  <p className="text-base text-foreground/70 leading-7">
                    Sollicitudin nec feugiat nisi sed. Pretium est lacinia ullamcorper nibh et tempus mus arcu adipiscing. Sed purus risus sed sapien gravida. Id etiam nisi amet viverra et. Integer natoque quis luctus cursus neque sit lacus aliquet nec. In quis mi a morbi nullam dui tincidunt. Ullamcorper fermentum senectus eget sed nulla curabitur. Integer aliquet tincidunt viverra orci nisi ante adipiscing pharetra diam. Mi purus erat quis praesent consectetur.
                  </p>
                </section>

                <Separator />

                {/* Key Trends & Updates */}
                <section id="handbook-key-updates" className="space-y-5">
                  <h2 className="text-2xl font-normal leading-8 text-black" style={{ letterSpacing: '-0.6px' }}>Key Trends & Updates</h2>
                  <div className="space-y-0">
                    {KEY_TRENDS.map((trend, i) => (
                      <TrendCard key={i} trend={trend} isLast={i === KEY_TRENDS.length - 1} />
                    ))}
                  </div>
                  <SectionFooter timestamp="24/6/2025 at 4:10pm" onQuiz={() => setQuizOpen(true)} />
                </section>

                <Separator />

                {/* Your Duties */}
                <section id="handbook-your-duties" className="space-y-6">
                  <h2 className="text-2xl font-normal leading-8 text-black" style={{ letterSpacing: '-0.6px' }}>Your Duties</h2>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground leading-6">Foundations of Director Responsibility</p>
                    <p className="text-base text-foreground/70 leading-7">
                      An Australian director's legal duties come from several sources: the Corporations Act 2001 (Cth), the company's constitution, court-developed common law duties (fiduciary principles), and other statutes (WHS, environment, data/privacy, etc.). These duties also interact with listing rules (if the company is listed) and corporate governance best practice.
                    </p>
                  </div>

                  <div id="handbook-core-statutory" className="space-y-4">
                    <DutyList title="A. Core Statutory Duties" duties={CORE_STATUTORY_DUTIES} />
                  </div>

                  <div id="handbook-other-duties" className="space-y-4">
                    <DutyList title="B. Other Legal & Practical Duties" duties={OTHER_DUTIES} />
                  </div>

                  <div id="handbook-watch-out" />

                  <SectionFooter understood={false} onToggleUnderstood={() => {}} onQuiz={() => setQuizOpen(true)} />
                </section>

                {/* Summary anchor */}
                <div id="handbook-summary" />
              </>
            ) : genericData ? (
              <>
                {genericData.sections.map((section, i) => (
                  <div key={section.id}>
                    <section id={`handbook-${section.id}`} className="space-y-4">
                      <h2 className="text-2xl font-normal leading-8 text-black" style={{ letterSpacing: '-0.6px' }}>{section.title}</h2>
                      <p className="text-base text-foreground/70 leading-7">{section.content}</p>
                      {i === genericData.sections.length - 1 && (
                        <SectionFooter understood={false} onToggleUnderstood={() => {}} onQuiz={() => setQuizOpen(true)} isComplete={item?.completion === 'complete'} />
                      )}
                    </section>
                    {i < genericData.sections.length - 1 && <Separator className="mt-10" />}
                  </div>
                ))}
              </>
            ) : (
              <section id="handbook-introduction" className="space-y-4">
                <h2 className="text-2xl font-normal leading-8 text-black" style={{ letterSpacing: '-0.6px' }}>Introduction</h2>
                <p className="text-base text-foreground/70 leading-7">{item?.description || 'Content coming soon.'}</p>
              </section>
            )}

            </div>
          </div>
        </main>

        {/* Right sidebar — AI panel, fixed */}
        <aside className="w-80 min-w-[380px] shrink-0 border-l border-border overflow-hidden bg-muted/50">
          <AiSidePanel activeTab={aiTab} onTabChange={setAiTab} />
        </aside>
      </div>

      {/* Quiz overlay */}
      {quizOpen && (
        <Feature flag="FEATURE_TOPIC_QUIZ">
          <TopicQuiz
            onClose={() => setQuizOpen(false)}
            onBackToHandbook={() => setQuizOpen(false)}
          />
        </Feature>
      )}
    </div>
  )
}
