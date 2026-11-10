import { useState } from 'react'
import { CartContext } from './CartContext'

// CartProvider guarda el carrito en un estado y expone las funciones para modificarlo.
// Cada elemento del carrito es: { id, name, price, img, category, stock, quantity }
function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  // Agrega un producto. Si ya estaba en el carrito, suma la cantidad (sin superar el stock)
  const addItem = (product, quantity) => {
    if (quantity <= 0) return

    setCart((prev) => {
      const enCarrito = prev.find((item) => item.id === product.id)

      if (enCarrito) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, item.stock) }
            : item,
        )
      }

      const { id, name, price, img, category, stock } = product
      return [...prev, { id, name, price, img, category, stock, quantity: Math.min(quantity, stock) }]
    })
  }

  const removeItem = (id) => setCart((prev) => prev.filter((item) => item.id !== id))

  const clearCart = () => setCart([])

  // Cantidad de un producto que ya está en el carrito (0 si no está)
  const getQuantity = (id) => cart.find((item) => item.id === id)?.quantity ?? 0

  // Totales calculados a partir del carrito
  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, clearCart, getQuantity, totalQuantity, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider
