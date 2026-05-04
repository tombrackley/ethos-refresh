import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import tenant from './config/tenant.js'

const favicon = document.getElementById('favicon')
if (favicon && tenant.icon) {
  favicon.href = tenant.icon
  favicon.type = tenant.icon.endsWith('.svg') ? 'image/svg+xml' : 'image/png'
}
if (tenant.appName) document.title = tenant.appName

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
