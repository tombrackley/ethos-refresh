import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { PATH_TO_PAGE } from '@/lib/routes'

const STORAGE_KEY = 'ethos_recent_pages'
const MAX_RECENT = 5

function read() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function useRecentPages() {
  const { pathname } = useLocation()
  const [recent, setRecent] = useState(read)

  useEffect(() => {
    const page = PATH_TO_PAGE[pathname]
    if (!page || page.startsWith('Admin:')) return
    setRecent((prev) => {
      const filtered = prev.filter((p) => p.path !== pathname)
      const next = [{ path: pathname, page }, ...filtered].slice(0, MAX_RECENT)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch { /* ignore */ }
      return next
    })
  }, [pathname])

  return recent
}
