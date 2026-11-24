import { createContext, useContext, useState } from 'react'

// Contexto del carrito: el estado vive en el CartProvider y cualquier componente
// puede leerlo con useCart(), sin pasar el carrito por props de un componente a otro.
// (react-refresh pide un componente por archivo; acá se juntan a propósito el contexto,
//  el Provider y el hook, que forman una sola pieza.)
// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext(null)

// Custom hook: devuelve el valor del contexto y avisa si se usa fuera del Provider
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext)

  if (context === null) {
    throw new Error('useCart debe usarse dentro de un CartProvider')
  }

  return context
}

// CartProvider guarda el carrito en un estado (array) y expone las funciones para modificarlo.
// Cada elemento del carrito es: { id, name, price, img, category, stock, quantity }
// Todas las actualizaciones son INMUTABLES: nunca se modifica el array original,
// siempre se devuelve uno nuevo (con spread, .map() o .filter()).
export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  // Agrega un producto con la cantidad elegida.
  // Si ya está en el carrito (se compara por id) NO se duplica: se suma la cantidad
  // al item existente, sin superar el stock del producto.
  const addItem = (item, quantity) => {
    if (quantity <= 0) return

    setCart((prev) => {
      const maximo = item.stock ?? Infinity
      const existe = prev.find((p) => p.id === item.id)

      if (existe) {
        // Update inmutable: .map() reemplaza solo el item que coincide, con una copia nueva
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: Math.min(p.quantity + quantity, maximo) } : p,
        )
      }

      // Item nuevo: se agrega copiando el array anterior con spread
      const { id, name, price, img, category, stock } = item
      return [...prev, { id, name, price, img, category, stock, quantity: Math.min(quantity, maximo) }]
    })
  }

  // Elimina un producto del carrito por su id
  const removeItem = (itemId) => setCart((prev) => prev.filter((p) => p.id !== itemId))

  // Vacía el carrito por completo
  const clear = () => setCart([])

  // ¿El producto ya está en el carrito?
  const isInCart = (id) => cart.some((p) => p.id === id)

  // Cantidad de un producto que ya está en el carrito (0 si no está)
  const getQuantity = (id) => cart.find((p) => p.id === id)?.quantity ?? 0

  // Valores calculados a partir del carrito (no se guardan en el estado)
  const totalItems = cart.reduce((acc, p) => acc + p.quantity, 0)
  const totalPrice = cart.reduce((acc, p) => acc + p.price * p.quantity, 0)

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, clear, isInCart, getQuantity, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}
