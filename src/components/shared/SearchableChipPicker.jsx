import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'

// Searchable chip picker with autocomplete dropdown — used by Profile page
// (Focus & Skills) and the Manage Focus & Skills overlay on Skills Profile.
export default function SearchableChipPicker({
  options,
  selected,
  onAdd,
  onRemove,
  placeholder,
  editing = true,
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  const filtered = options.filter(opt =>
    !selected.has(opt.value) &&
    opt.label.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    if (!open) return
    function onClick(e) {
      if (!containerRef.current?.contains(e.target)) setOpen(false)
    }
    function onEsc(e) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  function handleAdd(value) {
    onAdd(value)
    setQuery('')
    setOpen(false)
  }

  const hasSelected = selected.size > 0

  return (
    <div ref={containerRef} className="mt-3 rounded-lg bg-muted/40 p-3 space-y-3">
      {editing && (
        <div className="relative">
          <div className="flex items-center gap-2 rounded-md border border-border bg-white px-3 h-9 focus-within:ring-2 focus-within:ring-brand-200/50">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          {open && filtered.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 z-10 max-h-60 overflow-y-auto rounded-md border border-border bg-white shadow-lg">
              {filtered.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleAdd(opt.value)}
                  className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {hasSelected ? (
        <div className="flex flex-wrap gap-2">
          {[...selected].map(value => {
            const opt = options.find(o => o.value === value)
            if (!opt) return null
            return (
              <span
                key={value}
                className={`inline-flex items-center gap-1 rounded-full border border-border bg-white py-1 text-sm font-medium text-foreground ${editing ? 'pl-3 pr-1.5' : 'px-3'}`}
              >
                {opt.label}
                {editing && (
                  <button
                    type="button"
                    onClick={() => onRemove(value)}
                    aria-label={`Remove ${opt.label}`}
                    className="size-5 inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </span>
            )
          })}
        </div>
      ) : !editing && (
        <p className="text-sm text-muted-foreground italic">None selected.</p>
      )}
    </div>
  )
}
