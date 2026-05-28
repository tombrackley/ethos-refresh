import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { IconSettingsGear1 } from '@central-icons-react/round-outlined-radius-2-stroke-1.5/IconSettingsGear1'
import { Button } from '@/components/ui/button'
import tenant from '@/config/tenant'
import { NOTIFICATIONS } from '@/lib/notifications'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 10

// ─── Filter Chip (matches the Core/Vault category chips) ───────────────────────

function FilterChip({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 h-8 border transition-colors',
        active
          ? 'bg-[#dffff2] border-[rgba(14,95,91,0.5)]'
          : 'bg-muted/60 hover:bg-muted border-transparent',
      )}
    >
      <span className={cn('text-sm font-medium tracking-[-0.28px]', active ? 'text-[#0e5f5b]' : 'text-foreground')}>
        {label}
      </span>
      <span className={cn('text-xs', active ? 'text-[rgba(14,95,91,0.5)]' : 'text-muted-foreground')}>
        {count}
      </span>
    </button>
  )
}

// ─── Notification Row ──────────────────────────────────────────────────────────

function NotifAvatar({ sender }) {
  if (sender) {
    const initials = sender.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    return (
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
        {initials}
      </span>
    )
  }
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-white overflow-hidden">
      <img src={tenant.icon} alt="" className="size-4 rounded-sm" />
    </span>
  )
}

function NotificationRow({ notification, onMarkRead }) {
  const { sender, title, body, time, read } = notification
  return (
    <div
      className={cn(
        'flex gap-3 rounded-[8px] border px-4 py-3.5 cursor-pointer transition-colors',
        read
          ? 'border-[#ecf2f5] bg-white hover:bg-muted/20'
          : 'border-blue-100 bg-blue-50/40 hover:bg-blue-50/70',
      )}
      onClick={() => !read && onMarkRead(notification.id)}
    >
      <NotifAvatar sender={sender} />
      <div className="flex-1 min-w-0">
        <h4 className={cn('text-sm text-foreground', read ? 'font-medium' : 'font-semibold')}>{title}</h4>
        <p className="mt-1 text-sm text-slate-600 leading-relaxed">{body}</p>
        <span className="mt-2 block text-xs text-muted-foreground">{time}</span>
      </div>
      <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', read ? 'bg-transparent' : 'bg-blue-500')} />
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(() =>
    NOTIFICATIONS.map(n => ({ ...n, read: !!n.read })),
  )
  const [filter, setFilter] = useState('all') // all | unread | read
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications])
  const readCount = notifications.length - unreadCount

  const filtered = useMemo(() => {
    if (filter === 'unread') return notifications.filter(n => !n.read)
    if (filter === 'read') return notifications.filter(n => n.read)
    return notifications
  }, [notifications, filter])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = filtered.length > visibleCount

  const markRead = (id) =>
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)))
  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  // Reset paging when switching tabs so each filter starts at the top.
  const changeFilter = (value) => {
    setFilter(value)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <div className="flex flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto bg-white px-8 pt-[52px] pb-6">
        <div className="max-w-[800px] mx-auto space-y-8">

          <div className="flex items-center justify-between gap-2.5">
            <h1 className="text-[28px] leading-[30px] tracking-[-1.12px] font-normal text-[#0A0A0A]">Notifications</h1>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate('/profile?section=notifications')}
            >
              <IconSettingsGear1 className="size-4 [&_path]:stroke-2" />
              Settings
            </Button>
          </div>

          <div className="space-y-4">
            {/* Filter bar */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex flex-wrap items-center gap-3">
                <FilterChip label="All" count={notifications.length} active={filter === 'all'} onClick={() => changeFilter('all')} />
                <FilterChip label="Unread" count={unreadCount} active={filter === 'unread'} onClick={() => changeFilter('unread')} />
                <FilterChip label="Read" count={readCount} active={filter === 'read'} onClick={() => changeFilter('read')} />
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={markAllRead}
                disabled={unreadCount === 0}
              >
                Mark all as read
              </Button>
            </div>

            {/* List */}
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="size-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  {filter === 'unread' ? "You're all caught up — no unread notifications." : 'No notifications to show.'}
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {visible.map(n => (
                    <NotificationRow key={n.id} notification={n} onMarkRead={markRead} />
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                    >
                      Show more
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
