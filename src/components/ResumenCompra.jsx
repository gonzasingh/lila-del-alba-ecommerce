import { useCart } from '../context/CartContext'
import { formatearPrecio } from '../utils/formatearPrecio'

// Resumen de la compra (unidades, descuento y total) que comparten el carrito y el checkout.
// Va dentro de un contenedor con la clase "cart__resumen" (lo pone quien lo usa).
function ResumenCompra() {
  const { lines, totalItems, subtotal, discount, totalPrice } = useCart()

  // Productos distintos (un mismo producto puede ocupar varias líneas, una por variedad)
  const totalProductos = new Set(lines.map((linea) => linea.id)).size

  return (
    <>
      <h2 className="cart__resumen-titulo">Resumen</h2>

      <p className="cart__resumen-fila">
        <span>
          {totalItems} {totalItems === 1 ? 'unidad' : 'unidades'} ({totalProductos}{' '}
          {totalProductos === 1 ? 'producto' : 'productos'})
        </span>
      </p>

      {discount > 0 && (
        <>
          <p className="cart__resumen-fila">
            <span>Subtotal</span>
            <span>{formatearPrecio(subtotal)}</span>
          </p>
          <p className="cart__resumen-fila cart__resumen-fila--descuento">
            <span>Descuento pack x10</span>
            <span>− {formatearPrecio(discount)}</span>
          </p>
        </>
      )}

      <p className="cart__total">
        <span>Total</span>
        <strong>{formatearPrecio(totalPrice)}</strong>
      </p>
    </>
  )
}

export default ResumenCompra
