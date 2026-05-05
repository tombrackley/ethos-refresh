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
    accent: 'blue',
    title: 'Summarise upcoming meetings',
    subtitle: 'Recap this week and flag actions',
    prompt: 'Summarise my upcoming meetings and flag the action items I own.',
  },
  {
    id: 'review-policies',
    icon: IconShieldCheck3,
    accent: 'amber',
    title: 'Review at-risk policies',
    subtitle: 'Find blocked or red-status items',
    prompt: 'List policies that are blocked or in red status, grouped by owner.',
  },
  {
    id: 'draft-brief',
    icon: IconLightbulbGlow,
    accent: 'purple',
    title: 'Draft an internal brief',
    subtitle: 'Spin up a 1-pager on a recent change',
    prompt: 'Draft a 1-page internal brief on a recent regulatory update relevant to my matters.',
  },
  {
    id: 'overdue-tasks',
    icon: IconTasks,
    accent: 'red',
    title: "What's overdue?",
    subtitle: 'See tasks falling behind across your matters',
    prompt: 'Show me every overdue task across my open matters, sorted by criticality.',
  },
  {
    id: 'board-pack',
    icon: IconBooks,
    accent: 'slate',
    title: 'Prep my board pack',
    subtitle: 'Pull papers and notes for the next meeting',
    prompt: 'Pull together the board pack for my next meeting — papers, prior minutes, and outstanding actions.',
  },
  {
    id: 'cpd-progress',
    icon: IconGraduateCap,
    accent: 'green',
    title: 'Where am I on CPD?',
    subtitle: 'Progress toward this year’s requirement',
    prompt: 'How am I tracking against my CPD requirement this year, and what should I prioritise next?',
  },
  {
    id: 'reg-changes',
    icon: IconLaw,
    accent: 'cyan',
    title: 'Latest regulatory changes',
    subtitle: 'See what shifted this week',
    prompt: 'Summarise this week’s regulatory changes that affect my jurisdiction and matter types.',
  },
  {
    id: 'team-load',
    icon: IconTeam,
    accent: 'purple',
    title: 'How is my team loaded?',
    subtitle: 'Utilisation and bandwidth across owners',
    prompt: 'Show me current team utilisation and flag anyone over 90% across the next two weeks.',
  },
  {
    id: 'top-risks',
    icon: IconExclamationTriangle,
    accent: 'red',
    title: 'Top risks right now',
    subtitle: 'Critical items needing attention',
    prompt: 'List my top critical risks across matters and policies, with the owner and next action.',
  },
]
