import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import DesktopApp from './desktop/DesktopApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DesktopApp />
  </StrictMode>,
)
