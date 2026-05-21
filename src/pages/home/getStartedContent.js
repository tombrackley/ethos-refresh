import { IconPlugin1 } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconPlugin1'
import { IconShieldCheck3 } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconShieldCheck3'
import { IconTeam } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconTeam'
import { IconGraduateCap } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconGraduateCap'
import { IconSparkleCentral } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconSparkleCentral'
import { IconRadar } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconRadar'
import { IconLock } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconLock'
import { IconTree } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconTree'
import { IconTrending1 } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconTrending1'

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
    id: 'personalise-focus',
    icon: IconSparkleCentral,
    accent: 'brand',
    title: 'Personalise your feed',
    body: 'Choose the topics that should surface first in Insights, Learn and your daily briefings.',
    ctaLabel: 'Pick focus areas',
    action: 'focusAreas',
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

// Personal preference — surfaced via the 'personalise-focus' task in the Get Started widget.
// Distinct from the org-level CHALLENGES anchor selected during onboarding.
export const FOCUS_AREAS = [
  { value: 'ai_gov',          label: 'AI governance',        icon: IconSparkleCentral },
  { value: 'cyber',           label: 'Cybersecurity',        icon: IconLock },
  { value: 'esg',             label: 'ESG & sustainability', icon: IconTree },
  { value: 'risk_compliance', label: 'Risk & compliance',    icon: IconRadar },
  { value: 'cpd',             label: 'CPD & skills',         icon: IconGraduateCap },
  { value: 'transactions',    label: 'M&A / transactions',   icon: IconTrending1 },
]
