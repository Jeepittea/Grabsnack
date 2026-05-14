import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './shared/styles/index.css'
import App from './App.jsx'
import { GrabSnackProvider } from './shared/context/GrabSnackContext.jsx'
import { CartProvider }      from './shared/context/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GrabSnackProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </GrabSnackProvider>
  </StrictMode>,
)
