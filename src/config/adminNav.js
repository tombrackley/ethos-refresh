import {
  Building2,
  Scale,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  BookOpen,
  Settings,
  Lock,
  Users,
  Activity,
  FileText,
} from 'lucide-react'

// Parent sidebar groups — each group has categories, each category has child items
export const adminParentGroups = [
  {
    label: 'ORGANISATION',
    categories: [
      {
        label: 'Settings',
        icon: Settings,
        items: [
          { title: 'Organisation Profile' },
          { title: 'Users' },
          { title: 'Privacy & Security' },
          { title: 'Billing' },
          { title: 'AI Settings' },
          { title: 'Integrations' },
        ],
      },
      { label: 'Vault',           icon: Lock,     items: [{ title: 'Vault',            page: 'Admin:Vault' }] },
      { label: 'Talent',          icon: Users,    items: [{ title: 'Talent',            page: 'Admin:Talent' }] },
      { label: 'Activity & Logs', icon: Activity, items: [{ title: 'Activity & Logs',   page: 'Admin:Activity & Logs' }] },
      { label: 'Reporting',       icon: FileText, items: [{ title: 'Reporting',          page: 'Admin:Reporting' }] },
    ],
  },
  {
    label: 'MODULES',
    categories: [
      {
        label: 'Govern',
        icon: Scale,
        items: [
          { title: 'Boards',              page: 'Admin:Govern' },
          { title: 'Governance Settings', page: 'Admin:Govern Settings' },
        ],
      },
      {
        label: 'Comply',
        icon: ShieldCheck,
        items: [
          { title: 'Compliance Settings', page: 'Admin:Comply' },
          { title: 'Obligations',         page: 'Admin:Obligations' },
          { title: 'Risk Framework',      page: 'Admin:Risk Framework' },
        ],
      },
      {
        label: 'Work',
        icon: Briefcase,
        items: [
          { title: 'Work Settings',   page: 'Admin:Work' },
          { title: 'Matter Types',    page: 'Admin:Matter Types' },
          { title: 'Workflows',       page: 'Admin:Workflows' },
          { title: 'Resource Library', page: 'Admin:Resources' },
        ],
      },
      {
        label: 'Knowledge',
        icon: BookOpen,
        items: [
          { title: 'Settings',           page: 'Admin:Knowledge Settings' },
        ],
      },
      {
        label: 'Learn',
        icon: GraduationCap,
        items: [
          { title: 'Learning Journeys',  page: 'Admin:Learning Journeys' },
          { title: 'CPD Management',     page: 'Admin:CPD Management' },
          { title: 'CPD Regimes',        page: 'Admin:CPD Regimes' },
          { title: 'CPD Events',         page: 'Admin:CPD Events' },
          { title: 'Team Capability',    page: 'Admin:Team Capability' },
          { title: 'Knowledge Centre',   page: 'Admin:Knowledge Centre' },
        ],
      },
    ],
  },
]

// Flat list of all categories (for child sidebar lookup)
export const adminCategories = adminParentGroups.flatMap(g => g.categories)
