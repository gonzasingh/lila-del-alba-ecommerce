import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { formatearPrecio } from '../utils/formatearPrecio'
import './Cart.css'

// Vista del carrito: lista los productos agregados, permite quitarlos y muestra el total
function Cart() {
  const { cart, removeItem, clearCart, totalQuantity, totalPrice } = useCart()

  if (cart.length === 0) {
    return (
      <main className="cart cart--vacio">
        <h1 className="cart__titulo">Tu carrito está vacío</h1>
        <p>Todavía no agregaste productos.</p>
        <Link className="cart__enlace" to="/">
          Ver productos
        </Link>
      </main>
    )
  }

  return (
    <main className="cart">
      <h1 className="cart__titulo">Tu carrito</h1>

      <ul className="cart__lista">
        {cart.map((item) => (
          <li key={item.id} className="cart__item">
            <img className="cart__imagen" src={item.img} alt="" />
            <div className="cart__datos">
              <Link className="cart__nombre" to={`/item/${item.id}`}>
                {item.name}
              </Link>
              <p className="cart__detalle">
                {item.quantity} × {formatearPrecio(item.price)}
              </p>
            </div>
            <p className="cart__subtotal">{formatearPrecio(item.price * item.quantity)}</p>
            <button
              type="button"
              className="cart__quitar"
              onClick={() => removeItem(item.id)}
              aria-label={`Quitar ${item.name} del carrito`}
            >
              Quitar
            </button>
          </li>
        ))}
      </ul>

      <div className="cart__resumen">
        <p className="cart__total">
          Total ({totalQuantity} {totalQuantity === 1 ? 'unidad' : 'unidades'}):{' '}
          <strong>{formatearPrecio(totalPrice)}</strong>
        </p>
        <button type="button" className="cart__vaciar" onClick={clearCart}>
          Vaciar carrito
        </button>
      </div>
    </main>
  )
}

export default Cart
