import { createContext, useContext, useState } from 'react'
import { calcularPrecios } from '../utils/precios'

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

// Cada línea del carrito agrupa unidades idénticas: mismo producto y mismas opciones elegidas
const crearLineId = (id, selection) =>
  [id, ...selection.map(({ label, value }) => `${label}=${value}`)].join('|')

// Unidades de un producto en un carrito, sumando todas sus fragancias
const contarUnidades = (lineas, id) =>
  lineas.reduce((total, linea) => (linea.id === id ? total + linea.quantity : total), 0)

// CartProvider guarda el carrito en un estado (array) y expone las funciones para modificarlo.
// Cada elemento del carrito es:
//   { lineId, id, name, price, priceX10, img, category, stock, selection, quantity }
//   selection: lo elegido, por ejemplo [{ label: 'Fragancia', value: 'Guayaba' }]
// Todas las actualizaciones son INMUTABLES: nunca se modifica el array original,
// siempre se devuelve uno nuevo (con spread, .map() o .filter()).
export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  // Agrega un producto con la cantidad elegida. Las opciones elegidas viajan en item.selection.
  // Si ya hay uno idéntico (mismo id y mismas opciones) NO se duplica: se suma la cantidad.
  // El stock es por producto, sumando todas sus variedades.
  const addItem = (item, quantity) => {
    if (quantity <= 0) return

    setCart((prev) => {
      const selection = item.selection ?? []
      const lineId = crearLineId(item.id, selection)

      const disponible = (item.stock ?? Infinity) - contarUnidades(prev, item.id)
      const aAgregar = Math.min(quantity, disponible)
      if (aAgregar <= 0) return prev

      if (prev.some((p) => p.lineId === lineId)) {
        // Update inmutable: .map() reemplaza solo la línea que coincide, con una copia nueva
        return prev.map((p) =>
          p.lineId === lineId ? { ...p, quantity: p.quantity + aAgregar } : p,
        )
      }

      // Línea nueva: se agrega copiando el array anterior con spread
      const { id, name, price, priceX10, img, category, stock } = item

      return [
        ...prev,
        { lineId, id, name, price, priceX10, img, category, stock, selection, quantity: aAgregar },
      ]
    })
  }

  // Elimina un producto del carrito por su id. Si además se indica el lineId,
  // elimina solo esa variedad y deja las demás del mismo producto.
  const removeItem = (itemId, lineId) =>
    setCart((prev) =>
      prev.filter((p) => p.id !== itemId || (lineId !== undefined && p.lineId !== lineId)),
    )

  // Vacía el carrito por completo
  const clear = () => setCart([])

  // ¿El producto ya está en el carrito (con cualquier variedad)?
  const isInCart = (id) => cart.some((p) => p.id === id)

  // Unidades de un producto que ya están en el carrito (0 si no está)
  const getQuantity = (id) => contarUnidades(cart, id)

  // Valores calculados a partir del carrito (no se guardan en el estado).
  // calcularPrecios aplica el descuento por pack x10.
  const totalItems = cart.reduce((acc, p) => acc + p.quantity, 0)
  const { lines, subtotal, discount, totalPrice } = calcularPrecios(cart)

  return (
    <CartContext.Provider
      value={{
        cart,
        lines,
        addItem,
        removeItem,
        clear,
        isInCart,
        getQuantity,
        totalItems,
        subtotal,
        discount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
