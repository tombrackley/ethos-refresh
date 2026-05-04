import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LogIn } from 'lucide-react'
import tenant, { switchTenant } from '@/config/tenant'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const credentials = {
      admin:     { tenant: 'default', mode: 'ethika-admin' },
      ethos:     { tenant: 'default', mode: 'user' },
      blackmores:{ tenant: 'blackmores', mode: 'user' },
      playfair:  { tenant: 'migration', mode: 'user' },
      cooperip:  { tenant: 'cooperip', mode: 'user' },
      gallagherbassett: { tenant: 'gallagherbassett', mode: 'user' },
      peoplecare: { tenant: 'peoplecare', mode: 'user' },
    }
    const cred = credentials[username]
    if (cred && password === 'password') {
      // Store auth + tenant in sessionStorage so it survives reload
      sessionStorage.setItem('ethos_auth', JSON.stringify({ tenant: cred.tenant, mode: cred.mode }))
      switchTenant(cred.tenant)
      // Reload so module-level tenant references re-initialize with correct data.
      // Non-default tenants land at /<tenant> so the URL reflects the active session.
      window.location.href = cred.tenant === 'default' ? '/' : `/${cred.tenant}`
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100">
      <div className="w-full max-w-sm rounded-xl border bg-background p-8 shadow-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <img src={tenant.logo} alt={tenant.appName} className={tenant.logoClassName || 'h-10'} />
          <h1 className="text-xl font-semibold text-foreground">{tenant.appName}</h1>
          <p className="text-sm text-muted-foreground">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-sm font-medium text-foreground">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="mt-2 w-full">
            <LogIn className="mr-2 h-4 w-4" />
            Sign in
          </Button>
        </form>
      </div>
    </div>
  )
}
