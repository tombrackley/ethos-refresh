import { useContext } from 'react'
import { AskEthosContext } from './ask-ethos-context'

export function useAskEthos() {
  const ctx = useContext(AskEthosContext)
  if (!ctx) throw new Error('useAskEthos must be used inside <AskEthosProvider>')
  return ctx
}
