import { IconCalendar1 } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconCalendar1'
import { IconShieldCheck3 } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconShieldCheck3'
import { IconLightbulbGlow } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconLightbulbGlow'
import { IconTasks } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconTasks'
import { IconBooks } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconBooks'
import { IconGraduateCap } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconGraduateCap'
import { IconLaw } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconLaw'
import { IconTeam } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconTeam'
import { IconExclamationTriangle } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconExclamationTriangle'

export const chatPrompts = [
  {
    id: 'summarise-meetings',
    icon: IconCalendar1,
    label: 'Summarise my upcoming **meetings**',
    prompt: 'Summarise my upcoming meetings and flag the action items I own.',
  },
  {
    id: 'review-policies',
    icon: IconShieldCheck3,
    label: 'Review at-risk **policies**',
    prompt: 'List policies that are blocked or in red status, grouped by owner.',
  },
  {
    id: 'draft-brief',
    icon: IconLightbulbGlow,
    label: 'Draft an internal **brief** on a recent regulatory change',
    prompt: 'Draft a 1-page internal brief on a recent regulatory update relevant to my matters.',
  },
  {
    id: 'overdue-tasks',
    icon: IconTasks,
    label: 'Show me my overdue **tasks**',
    prompt: 'Show me every overdue task across my open matters, sorted by criticality.',
  },
  {
    id: 'board-pack',
    icon: IconBooks,
    label: 'Prep my next **board pack**',
    prompt: 'Pull together the board pack for my next meeting — papers, prior minutes, and outstanding actions.',
  },
  {
    id: 'cpd-progress',
    icon: IconGraduateCap,
    label: 'Track my **CPD** progress this year',
    prompt: 'How am I tracking against my CPD requirement this year, and what should I prioritise next?',
  },
  {
    id: 'reg-changes',
    icon: IconLaw,
    label: 'Summarise this week’s **regulatory changes**',
    prompt: 'Summarise this week’s regulatory changes that affect my jurisdiction and matter types.',
  },
  {
    id: 'team-load',
    icon: IconTeam,
    label: 'Review my **team’s** workload',
    prompt: 'Show me current team utilisation and flag anyone over 90% across the next two weeks.',
  },
  {
    id: 'top-risks',
    icon: IconExclamationTriangle,
    label: 'Surface my top **risks** right now',
    prompt: 'List my top critical risks across matters and policies, with the owner and next action.',
  },
]
