import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import tenant from '@/config/tenant'

export default function LandingPage() {
  const navigate = useNavigate()
  function start(demo) {
    sessionStorage.setItem('ethos_auth', JSON.stringify({ mode: 'user', demo }))
    window.location.href = '/home'
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-100">
      <div className="w-full max-w-md text-center px-6">
        <div className="mb-8 flex flex-col items-center gap-3">
          <img src={tenant.logo} alt={tenant.appName} className="h-12 w-auto rounded-sm" />
          <h1 className="text-3xl font-semibold text-foreground tracking-[-0.03em]">
            Ethos Prototype
          </h1>
        </div>

        <div className="mx-auto flex max-w-xs flex-col gap-2.5">
          <Button variant="outline" onClick={() => navigate('/onboarding')} className="h-10">
            Start Onboarding
          </Button>
          <Button variant="outline" onClick={() => start('launch')} className="h-10">
            June 30 Version
          </Button>
          <Button onClick={() => start('full')} className="h-10">
            Full Platform Demo
          </Button>
        </div>
      </div>
    </div>
  )
}
