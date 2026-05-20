// AI sources + transparency footer rendered at the bottom of every Insights
// page. Addresses PRD §16.8 ("AI-assisted curation. Verify before acting on
// regulatory content.") and the Sources / Curation Transparency requirement
// at a lightweight level — author, source title, link per row.

const SOURCES = [
  { author: 'ASIC',                       title: 'Information Sheets & Regulatory Guides', url: 'https://asic.gov.au/regulatory-resources/' },
  { author: 'APRA',                       title: 'Prudential Standards & Guidance',         url: 'https://www.apra.gov.au/industries-we-regulate' },
  { author: 'OAIC',                       title: 'Privacy Act Guidance & Notifiable Data Breach',  url: 'https://www.oaic.gov.au/privacy/' },
  { author: 'AUSTRAC',                    title: 'AML/CTF Guidance',                        url: 'https://www.austrac.gov.au/business' },
  { author: 'AICD',                       title: 'Director Resources & Governance',         url: 'https://www.aicd.com.au/' },
  { author: 'Law Council of Australia',   title: 'Professional Standards & Releases',       url: 'https://lawcouncil.au/' },
]

// `bare` mode lets the parent constrain the width (used on Insights Detail
// so the footer aligns with the article column rather than the full page).
export function InsightsFooter({ className = '', bare = false }) {
  const date = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
  const inner = (
    <>
      <div className="text-xs text-muted-foreground leading-relaxed">
        <p>ETHOS Insights · Curated for your practice · {date}</p>
        <p className="mt-1">AI-assisted curation of insights using the following sources. Verify before acting on regulatory content.</p>
      </div>
      <ul className="space-y-1.5 font-mono">
        {SOURCES.map(s => (
          <li key={s.author} className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="font-medium">{s.author}</span>
            <span className="text-muted-foreground/60">·</span>
            <span>{s.title}</span>
            <span className="text-muted-foreground/60">·</span>
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="hover:underline break-all"
            >
              {s.url}
            </a>
          </li>
        ))}
      </ul>
    </>
  )

  if (bare) {
    return (
      <footer className={`border-t border-border mt-12 pt-8 pb-12 space-y-5 ${className}`}>
        {inner}
      </footer>
    )
  }

  return (
    <footer className={`border-t border-border mt-12 pt-8 pb-12 ${className}`}>
      <div className="max-w-[1000px] mx-auto px-6 space-y-5">
        {inner}
      </div>
    </footer>
  )
}
