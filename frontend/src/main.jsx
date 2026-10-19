import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <><aside style={{padding:12,background:"#fff4d6",color:"#333"}}>Research prototype. Some screens contain mock data. Model scores and suggested changes are not admissions decisions.</aside><App /></>
  </StrictMode>,
)
