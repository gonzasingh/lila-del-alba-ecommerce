import { Link } from 'react-router-dom'
import BagIcon from './BagIcon'
import { useCart } from '../context/CartContext'
import './CartWidget.css'

function CartWidget() {
  // Suma de las cantidades de todos los productos del carrito
  const { totalItems } = useCart()

  return (
    <Link
      className="cart-widget"
      to="/cart"
      aria-label={`Carrito de compras: ${totalItems} ${totalItems === 1 ? 'unidad' : 'unidades'}`}
    >
      {/* Bolsa vacía (solo contorno) o llena (con productos) */}
      <BagIcon className="cart-widget__icono" filled={totalItems > 0} />
      {/* Con el carrito vacío no se muestra el número */}
      {totalItems > 0 && <span className="cart-widget__contador">{totalItems}</span>}
    </Link>
  )
}

export default CartWidget
