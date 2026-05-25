import { IconUser } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconUser'
import { IconSparkleCentral } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconSparkleCentral'
import { IconBag2 } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconBag2'
import { IconBell } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconBell'
import { IconShieldCheck3 } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconShieldCheck3'

export const PROFILE_SECTIONS = [
  { key: 'personal',     label: 'Personal Details',      icon: IconUser },
  { key: 'focus-skills', label: 'Focus Areas & Learning Goals', icon: IconSparkleCentral },
  { key: 'professional', label: 'Professional Details',  icon: IconBag2 },
  { key: 'notifications',label: 'Notifications',         icon: IconBell },
  { key: 'security',     label: 'Security',              icon: IconShieldCheck3 },
]
