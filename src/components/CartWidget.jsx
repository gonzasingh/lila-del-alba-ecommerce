import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import './CartWidget.css'

function CartWidget() {
  // Cantidad total de unidades que hay en el carrito
  const { totalQuantity } = useCart()

  return (
    <Link
      className="cart-widget"
      to="/cart"
      aria-label={`Carrito de compras: ${totalQuantity} ${totalQuantity === 1 ? 'unidad' : 'unidades'}`}
    >
      <svg
        className="cart-widget__icono"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
        <path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H6" />
      </svg>
      {totalQuantity > 0 && <span className="cart-widget__contador">{totalQuantity}</span>}
    </Link>
  )
}

export default CartWidget
