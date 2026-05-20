import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { X, RotateCcw, ArrowUpRight } from 'lucide-react'
import { AskEthosSparkle } from '@/components/AskEthosSparkle'
import { Skeleton } from '@/components/ui/skeleton'
import { useAskEthos } from '@/context/useAskEthos'
import { cn } from '@/lib/utils'

function UserBubble({ content }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#f1f5f9] text-foreground px-3 py-2 text-sm leading-relaxed">
        {content}
      </div>
    </div>
  )
}

function AssistantBubble({ children }) {
  return (
    <div className="text-sm text-foreground leading-relaxed">
      {children}
    </div>
  )
}

function ThinkingBubble() {
  return (
    <AssistantBubble>
      <div className="space-y-1.5 py-0.5">
        <Skeleton className="h-3 w-[180px]" />
        <Skeleton className="h-3 w-[140px]" />
        <Skeleton className="h-3 w-[80px]" />
      </div>
    </AssistantBubble>
  )
}

function AssistantResponse({ intro, bullets, actions, onActionClick }) {
  return (
    <div className="space-y-2">
      <div className="text-sm text-foreground leading-relaxed">
        {intro && <p className="mb-2">{intro}</p>}
          {bullets?.length > 0 && (
            <ul className="space-y-1.5">
              {bullets.map((b, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-brand-500" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      {actions?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {actions.map((a) => (
            <Link
              key={a.label}
              to={a.href}
              onClick={onActionClick}
              className="group inline-flex items-center gap-1 rounded-full bg-[#F7F7F7] hover:bg-[#EFEFEF] px-2.5 py-1 text-xs font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              {a.label}
              <ArrowUpRight className="size-3 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function AskEthosDrawer() {
  const { isOpen, messages, isThinking, close, reset } = useAskEthos()
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length, isThinking])

  const hasContent = messages.length > 0 || isThinking

  return (
    <>
      <div
        className={cn(
          'fixed top-[10px] right-[10px] bottom-[10px] z-50 transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-[calc(100%+10px)]',
        )}
        style={{ width: 380 }}
        aria-hidden={!isOpen}
      >
        <div className="h-full bg-white rounded-[14px] border border-[rgba(229,229,229,0.6)] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden">
          <div className="bg-white px-5 pt-4 pb-3 border-b border-[rgba(229,229,229,0.6)] shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AskEthosSparkle className="size-5 shrink-0" />
                <p className="text-base font-semibold text-[#002022]">Ethos AI</p>
              </div>
              <div className="flex items-center gap-1">
                {hasContent && (
                  <button
                    type="button"
                    onClick={reset}
                    aria-label="New chat"
                    className="size-7 flex items-center justify-center rounded-sm hover:bg-muted/50 text-muted-foreground transition-colors"
                  >
                    <RotateCcw className="size-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close Ethos AI"
                  className="size-7 flex items-center justify-center rounded-sm hover:bg-muted/50 text-muted-foreground transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-auto px-4 py-4 space-y-3">
            {!hasContent && (
              <div className="h-full flex flex-col items-center justify-center text-center px-6 text-muted-foreground">
                <AskEthosSparkle className="size-8 mb-3" />
                <p className="text-sm font-medium text-foreground">Ask Ethos anything</p>
                <p className="mt-1 text-xs">
                  Try one of the suggested prompts on this page, or ask your own question.
                </p>
              </div>
            )}

            {messages.map((m) =>
              m.role === 'user'
                ? <UserBubble key={m.id} content={m.content} />
                : <AssistantResponse key={m.id} intro={m.intro} bullets={m.bullets} actions={m.actions} onActionClick={close} />
            )}

            {isThinking && <ThinkingBubble />}
          </div>

          <div className="bg-white border-t border-[rgba(229,229,229,0.6)] px-3 py-3 shrink-0">
            <div className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2 text-sm text-muted-foreground">
              <AskEthosSparkle className="size-4 shrink-0 opacity-60" />
              <span className="flex-1 truncate">Ask a follow-up…</span>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/10"
          onClick={close}
          aria-hidden="true"
        />
      )}
    </>
  )
}
