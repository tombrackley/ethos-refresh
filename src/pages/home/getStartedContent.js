import { IconPlugin1 } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconPlugin1'
import { IconShieldCheck3 } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconShieldCheck3'
import { IconTeam } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconTeam'
import { IconGraduateCap } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconGraduateCap'
import { IconSparkleCentral } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconSparkleCentral'
import { IconRadar } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconRadar'
import { IconLock } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconLock'
import { IconTree } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconTree'
import { IconTrending1 } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconTrending1'
import { IconUser } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconUser'

export const getStartedCards = [
  {
    id: 'connect-data',
    icon: IconPlugin1,
    accent: 'blue',
    title: 'Connect your data',
    body: 'Bring your matters, policies and board calendars into Ethos so everything lives in one place.',
    ctaLabel: 'Get started',
    ctaHref: '/integrations',
  },
  {
    id: 'set-up-boards',
    icon: IconShieldCheck3,
    accent: 'green',
    title: 'Set up your boards',
    body: 'Configure boards, committees and meeting cadences to keep governance running smoothly.',
    ctaLabel: 'Configure boards',
    ctaHref: '/govern/boards-committees',
  },
  {
    id: 'setup-profile',
    icon: IconUser,
    accent: 'brand',
    title: 'Set up your profile',
    body: 'Add a photo and tell us your focus areas, skills and learning goals so Ethos can tailor the experience.',
    ctaLabel: 'Complete profile',
    ctaHref: '/profile?section=personal&from=get-started',
  },
  {
    id: 'invite-team',
    icon: IconTeam,
    accent: 'purple',
    title: 'Invite your team',
    body: 'Add colleagues so they can collaborate on matters, review policies and attend meetings.',
    ctaLabel: 'Add people',
    ctaHref: '/admin/users',
  },
  {
    id: 'track-cpd',
    icon: IconGraduateCap,
    accent: 'amber',
    title: 'Track your CPD',
    body: 'Log professional development, set goals and discover recommended workshops for your role.',
    ctaLabel: 'Open CPD tracker',
    ctaHref: '/learn/cpd',
  },
  {
    id: 'try-ask-ethos',
    icon: IconSparkleCentral,
    accent: 'brand',
    title: 'Try Ask Ethos',
    body: 'Ask questions across your matters, policies and obligations — Ethos pulls answers in seconds.',
    ctaLabel: 'See it in action',
    ctaHref: '/insights',
  },
]

// Personal preferences — surfaced via the 'setup-profile' task in the Get Started widget.
// Distinct from the org-level CHALLENGES anchor selected during onboarding.
export const FOCUS_AREAS = [
  { value: 'ai_gov',          label: 'AI governance',        icon: IconSparkleCentral },
  { value: 'cyber',           label: 'Cybersecurity',        icon: IconLock },
  { value: 'esg',             label: 'ESG & sustainability', icon: IconTree },
  { value: 'risk_compliance', label: 'Risk & compliance',    icon: IconRadar },
  { value: 'cpd',             label: 'CPD & skills',         icon: IconGraduateCap },
  { value: 'transactions',    label: 'M&A / transactions',   icon: IconTrending1 },
]

export const SKILLS = [
  { value: 'board_gov',     label: 'Board governance' },
  { value: 'risk_mgmt',     label: 'Risk management' },
  { value: 'compliance',    label: 'Compliance & regulatory' },
  { value: 'financial',     label: 'Financial literacy' },
  { value: 'cyber_data',    label: 'Cyber & data' },
  { value: 'esg',           label: 'ESG & sustainability' },
  { value: 'strategy',      label: 'Strategy' },
  { value: 'stakeholder',   label: 'Stakeholder engagement' },
  { value: 'm_and_a',       label: 'Mergers & acquisitions' },
]

export const LEARNING_GOALS = [
  { value: 'earn_cpd',         label: 'Earn CPD hours' },
  { value: 'stay_current',     label: 'Stay current on regulations' },
  { value: 'build_board_cap',  label: 'Develop board capability' },
  { value: 'technical_depth',  label: 'Build technical depth' },
  { value: 'mentor_others',    label: 'Mentor others' },
  { value: 'new_sectors',      label: 'Explore new sectors' },
]
