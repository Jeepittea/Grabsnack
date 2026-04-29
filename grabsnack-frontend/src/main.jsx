import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './shared/styles/index.css'
import App from './App.jsx'
import { GrabSnackProvider } from './context/GrabSnackContext.jsx'
import { CartProvider }      from './context/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GrabSnackProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </GrabSnackProvider>
  </StrictMode>,
)
