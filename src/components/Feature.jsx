import { isEnabled } from '@/config/flags'

export default function Feature({ flag, children }) {
  if (!isEnabled(flag)) return null
  return children
}
