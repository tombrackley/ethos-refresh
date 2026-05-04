import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { X, ExternalLink } from 'lucide-react'
import tenant from '@/config/tenant'

// Content map — in production this would come from an API.
// `source` determines the back button label. `type` determines how content is rendered.
const CONTENT_MAP = {
  // ── Knowledge Centre ──────────────────────────────────────────────────────
  'kc-org-1': { title: 'Board Governance Best Practices 2026', url: 'https://example.com/governance-guide.pdf', source: 'kc', type: 'url' },
  'kc-org-2': { title: 'AICD Director Obligations Webinar', url: 'https://www.youtube.com/embed/qp0HIF3SfI4', source: 'kc', type: 'video' },
  'kc-org-3': { title: 'ASX Corporate Governance Principles', url: 'https://www.asx.com.au/regulation/corporate-governance-council', source: 'kc', type: 'url' },
  'kc-org-4': { title: 'Anti-Money Laundering Compliance Pack', url: 'https://example.com/aml-pack.docx', source: 'kc', type: 'url' },
  'kc-org-5': { title: 'ESG Reporting Framework Overview', url: 'https://example.com/esg-framework.pdf', source: 'kc', type: 'url' },
  'kc-duties': { title: 'Directors\' Duties Handbook', url: 'https://aicd.companydirectors.com.au', source: 'kc', type: 'url' },
  'kc-ai-gov': { title: 'AI Governance Framework', url: 'https://www.industry.gov.au/publications/australias-artificial-intelligence-ethics-framework', source: 'kc', type: 'url' },

  // ── Resource Library ──────────────────────────────────────────────────────
  // PDFs — use a public sample PDF for prototype viewing
  'rl-1':  { title: 'Non-Disclosure Agreement', url: '/sample-documents/nda-template.pdf', source: 'rl', type: 'pdf' },
  'rl-2':  { title: 'Board Governance Policy', url: '/sample-documents/board-governance-policy.pdf', source: 'rl', type: 'pdf' },
  'rl-3':  { title: 'Data Breach Response Playbook', url: '/sample-documents/data-breach-playbook.pdf', source: 'rl', type: 'pdf' },
  'rl-5':  { title: 'AML/CTF Compliance Policy', url: '/sample-documents/aml-ctf-policy.pdf', source: 'rl', type: 'pdf' },
  'rl-6':  { title: 'Enterprise Risk Management Guide', url: '/sample-documents/erm-guide.pdf', source: 'rl', type: 'pdf' },
  'rl-7':  { title: 'Whistleblower Protection Policy', url: '/sample-documents/whistleblower-policy.pdf', source: 'rl', type: 'pdf' },
  'rl-9':  { title: 'Modern Slavery Compliance Guide', url: '/sample-documents/modern-slavery-guide.pdf', source: 'rl', type: 'pdf' },
  'rl-11': { title: 'Corporations Act 2001 — Key Provisions', url: '/sample-documents/corporations-act-key-provisions.pdf', source: 'rl', type: 'pdf' },
  'rl-12': { title: 'Conflict of Interest Management Playbook', url: '/sample-documents/conflict-of-interest-playbook.pdf', source: 'rl', type: 'pdf' },
  // External URL
  'rl-13': { title: 'ASIC Regulatory Guide RG 259 — Risk Management', url: 'https://en.wikipedia.org/wiki/Risk_management', source: 'rl', type: 'url' },
  // Video
  'rl-14': { title: 'Board Governance Best Practices — AICD Webinar', url: 'https://www.youtube.com/embed/qp0HIF3SfI4', source: 'rl', type: 'video' },

  // ── Vault (seed files) ────────────────────────────────────────────────────
  // Map each tenant seed file id to an existing sample PDF for preview.
  'vault-1': { title: 'Board Charter 2025.pdf',            url: '/sample-documents/board-governance-policy.pdf',    source: 'vault', type: 'pdf' },
  'vault-2': { title: 'Privacy Policy v3.2.pdf',           url: '/sample-documents/aml-ctf-policy.pdf',              source: 'vault', type: 'pdf' },
  'vault-3': { title: 'Vendor NDA Template.docx',          url: '/sample-documents/nda-template.pdf',                source: 'vault', type: 'pdf' },
  'vault-4': { title: 'Risk Management Framework.pdf',     url: '/sample-documents/erm-guide.pdf',                   source: 'vault', type: 'pdf' },
  'vault-5': { title: 'Conflict of Interest Policy.pdf',   url: '/sample-documents/conflict-of-interest-playbook.pdf', source: 'vault', type: 'pdf' },
  'vault-6': { title: 'Client Engagement Letter.docx',     url: '/sample-documents/corporations-act-key-provisions.pdf', source: 'vault', type: 'pdf' },
  'vault-7': { title: 'Annual Compliance Report 2024.pdf', url: '/sample-documents/modern-slavery-guide.pdf',        source: 'vault', type: 'pdf' },
  'vault-8': { title: 'Data Retention Policy v2.pdf',      url: '/sample-documents/data-breach-playbook.pdf',        source: 'vault', type: 'pdf' },
}

export default function ExternalContentViewer() {
  const { contentId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Fallback for content not in the static map (e.g. Vault-uploaded files,
  // where the URL is a runtime blob: handle). Accepts `url`, `title`, `type`
  // query params — the caller builds the navigate URL and we render from it.
  const content = CONTENT_MAP[contentId] ?? (searchParams.get('url')
    ? {
        title: searchParams.get('title') ?? 'Document',
        url: searchParams.get('url'),
        type: searchParams.get('type') ?? 'pdf',
        source: 'vault',
      }
    : null)

  if (!content) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-foreground">Content not found</p>
          <Button variant="outline" onClick={() => navigate(-1)}>Close</Button>
        </div>
      </div>
    )
  }

  function handleClose() {
    navigate(-1)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-border/60 shrink-0">
        <div className="flex items-center gap-4">
          <img src={tenant.icon || tenant.logo} alt={tenant.appName} className="h-7 w-auto" />
          <div className="h-5 w-px bg-border/60" />
          <p className="text-sm font-medium text-foreground truncate max-w-md">{content.title}</p>
        </div>
        <div className="flex items-center gap-2">
          {content.type !== 'pdf' && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground"
              onClick={() => window.open(content.url, '_blank', 'noopener')}
            >
              <ExternalLink className="size-3.5" /> Open original
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-muted-foreground"
            onClick={handleClose}
          >
            <X className="size-3.5" /> Close
          </Button>
        </div>
      </div>

      {/* Content area — adapts by type */}
      <div className="flex-1 overflow-hidden">
        {content.type === 'pdf' ? (
          <object
            data={content.url}
            type="application/pdf"
            className="w-full h-full"
          >
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">Unable to display PDF in browser.</p>
                <Button variant="outline" onClick={() => window.open(content.url, '_blank')}>
                  Open PDF
                </Button>
              </div>
            </div>
          </object>
        ) : content.type === 'video' ? (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <iframe
              src={content.url}
              title={content.title}
              className="w-full h-full max-w-5xl max-h-[80vh] aspect-video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <iframe
            src={content.url}
            title={content.title}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        )}
      </div>
    </div>
  )
}
