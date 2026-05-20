import { useCallback, useRef, useState } from 'react'
import tenant from '@/config/tenant'
import { AskEthosContext } from './ask-ethos-context'

const THINKING_MS = 1500

const COMPLIANCE_ACTIONS = [
  { label: 'View Risk Register', href: '/comply/risk' },
  { label: 'Audit Tasks', href: '/comply/audit' },
  { label: 'Review Conflicts', href: '/comply/conflicts' },
  { label: 'Open Incidents', href: '/comply/incidents' },
]

const GOVERN_ACTIONS = [
  { label: 'Open Board Papers', href: '/govern/board-papers' },
  { label: 'Upcoming Meetings', href: '/govern/meetings' },
  { label: 'Review Policies', href: '/govern/policies' },
  { label: 'Delegations Register', href: '/govern/delegations' },
]

const WORK_ACTIONS = [
  { label: 'View Matters', href: '/matters' },
  { label: 'Open Respond', href: '/respond' },
  { label: 'Time & Efficiency', href: '/work/time-efficiency' },
  { label: 'Upcoming Meetings', href: '/meet' },
]

const RESPONSES = {
  'Summarise my compliance and focused obligations': () => ({
    intro: "Here's a snapshot of your current compliance posture.",
    bullets: tenant.pages?.comply?.aiPoints ?? [],
    actions: COMPLIANCE_ACTIONS,
  }),
  'Summarise governance and open board actions': () => ({
    intro: "Here's where your governance stands right now.",
    bullets: tenant.pages?.govern?.aiPoints ?? [],
    actions: GOVERN_ACTIONS,
  }),
  'Summarise my matters and priorities': () => ({
    intro: "Here's a quick read on your matters and where to focus.",
    bullets: tenant.pages?.work?.aiPoints ?? [],
    actions: WORK_ACTIONS,
  }),
}

function defaultResponse() {
  return {
    intro: "Here's a snapshot of your current compliance posture.",
    bullets: tenant.pages?.comply?.aiPoints ?? [],
    actions: COMPLIANCE_ACTIONS,
  }
}

let nextId = 1
const makeId = () => `m-${nextId++}`

export function AskEthosProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [isThinking, setIsThinking] = useState(false)
  const thinkingTimer = useRef(null)

  const close = useCallback(() => setIsOpen(false), [])

  const reset = useCallback(() => {
    if (thinkingTimer.current) {
      clearTimeout(thinkingTimer.current)
      thinkingTimer.current = null
    }
    setIsThinking(false)
    setMessages([])
  }, [])

  const open = useCallback((prompt) => {
    setIsOpen(true)
    if (!prompt) return

    setMessages((prev) => [...prev, { id: makeId(), role: 'user', content: prompt }])
    setIsThinking(true)

    if (thinkingTimer.current) clearTimeout(thinkingTimer.current)
    thinkingTimer.current = setTimeout(() => {
      const make = RESPONSES[prompt] ?? defaultResponse
      const reply = make()
      setMessages((prev) => [...prev, { id: makeId(), role: 'assistant', ...reply }])
      setIsThinking(false)
      thinkingTimer.current = null
    }, THINKING_MS)
  }, [])

  return (
    <AskEthosContext.Provider value={{ isOpen, messages, isThinking, open, close, reset }}>
      {children}
    </AskEthosContext.Provider>
  )
}

