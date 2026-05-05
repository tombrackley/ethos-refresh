import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const ACCENT_BG = {
  red: 'bg-red-100',
  amber: 'bg-amber-100',
  blue: 'bg-blue-100',
  purple: 'bg-purple-100',
  cyan: 'bg-cyan-100',
  slate: 'bg-slate-100',
  green: 'bg-brand-green-100',
  brand: 'bg-brand-100',
}

const ICON_COLOR = 'text-[#151D2B]'

export function HomeCard({ icon: Icon, accent = 'slate', title, subtitle, badge, badgeVariant = 'outline', to }) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-3 rounded-[8px] border border-[#ECF2F5] bg-white p-3 hover:border-brand-200 hover:shadow-sm transition-all"
    >
      <div className={cn('size-8 rounded-[8px] flex items-center justify-center shrink-0', ACCENT_BG[accent])}>
        <Icon className={cn('size-4', ICON_COLOR)} />
      </div>
      <div className="flex flex-col min-w-0 flex-1 gap-0.5">
        <span className="text-sm font-medium text-foreground line-clamp-1">{title}</span>
        {subtitle && <span className="text-xs text-muted-foreground line-clamp-1">{subtitle}</span>}
      </div>
      {badge && (
        <Badge variant={badgeVariant} className="shrink-0 self-start">
          {badge}
        </Badge>
      )}
    </Link>
  )
}
