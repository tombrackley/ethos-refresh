import { X } from 'lucide-react'
import { AskEthosSparkle } from '@/components/AskEthosSparkle'

export function AskEthosDrawer({ open, onOpenChange }) {
  return (
    <>
      <div
        className={`fixed top-[10px] right-[10px] bottom-[10px] z-50 transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-[calc(100%+10px)]'
        }`}
        style={{ width: 380 }}
        aria-hidden={!open}
      >
        <div className="h-full bg-[#f1f5f9] rounded-[14px] border border-[rgba(229,229,229,0.6)] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden">
          <div className="bg-white px-5 pt-4 pb-3 border-b border-[rgba(229,229,229,0.6)] shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AskEthosSparkle className="size-5 shrink-0" />
                <p className="text-base font-semibold text-[#002022]">Ethos AI</p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label="Close Ethos AI"
                className="size-7 flex items-center justify-center rounded-sm hover:bg-muted/50 text-muted-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto" />
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/10"
          onClick={() => onOpenChange(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
