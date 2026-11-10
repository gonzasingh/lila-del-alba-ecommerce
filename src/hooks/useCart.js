import { useContext } from 'react'
import { CartContext } from '../context/CartContext'

// Custom hook para usar el carrito desde cualquier componente
export function useCart() {
  const context = useContext(CartContext)

  if (context === null) {
    throw new Error('useCart debe usarse dentro de un CartProvider')
  }

  return context
}
