// Descuento por pack x10.
//
// Regla: el pack son 10 unidades EXACTAMENTE IGUALES (mismo producto, misma fragancia y
// mismas opciones). Cada línea del carrito agrupa unidades idénticas, así que se calcula
// línea por línea: por cada 10 se aplica el precio de pack (priceX10) y las que sobran
// van a precio normal.
// Ejemplos: 9 = 9 normales · 11 = 10 en pack + 1 normal · 20 = 20 en pack ·
// 6 de una fragancia + 5 de otra = sin descuento.
// Los productos sin priceX10 (los de hogar) no tienen descuento.

export const UNIDADES_POR_PACK = 10

// Recibe el carrito y devuelve sus líneas con el detalle de precio, más los totales.
// No modifica el carrito: crea objetos nuevos.
export const calcularPrecios = (cart) => {
  const lines = cart.map((linea) => {
    const unidadesPack = linea.priceX10
      ? Math.floor(linea.quantity / UNIDADES_POR_PACK) * UNIDADES_POR_PACK
      : 0
    const unidadesNormales = linea.quantity - unidadesPack
    const subtotalSinDescuento = linea.price * linea.quantity
    const subtotal = unidadesPack * (linea.priceX10 ?? 0) + unidadesNormales * linea.price

    return { ...linea, unidadesPack, unidadesNormales, subtotalSinDescuento, subtotal }
  })

  const subtotal = lines.reduce((total, linea) => total + linea.subtotalSinDescuento, 0)
  const totalPrice = lines.reduce((total, linea) => total + linea.subtotal, 0)

  return { lines, subtotal, discount: subtotal - totalPrice, totalPrice }
}
