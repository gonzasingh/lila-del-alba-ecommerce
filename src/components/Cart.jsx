import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatearPrecio } from '../utils/formatearPrecio'
import logoFlor from '../assets/logo-flor.svg'
import './Cart.css'

// Vista del carrito (ruta /cart): lista los productos agregados, permite quitarlos
// de a uno o vaciar todo, y muestra el total antes de decidir la compra.
function Cart() {
  const { cart, removeItem, clear, totalItems, totalPrice } = useCart()

  // "Finalizar compra" es un placeholder: el checkout real llega en el módulo de Firebase
  const [avisoCheckout, setAvisoCheckout] = useState(false)

  // Carrito vacío: mensaje y link para volver al catálogo
  if (cart.length === 0) {
    return (
      <main className="cart cart--vacio">
        <img className="cart__flor" src={logoFlor} alt="" />
        <h1 className="cart__titulo">Tu carrito está vacío</h1>
        <p className="cart__mensaje">
          Todavía no elegiste nada, pero hay muchos aromas y productos de cuidado personal
          esperándote. ¡Encontrá el que más te guste!
        </p>
        <Link className="cart__boton cart__boton--principal" to="/">
          Explorar el catálogo
        </Link>
      </main>
    )
  }

  return (
    <main className="cart">
      <h1 className="cart__titulo">Tu carrito</h1>

      <div className="cart__contenido">
        <ul className="cart__lista">
          {cart.map((item) => (
            <li key={item.id} className="cart__item">
              <img className="cart__imagen" src={item.img} alt="" />

              <div className="cart__datos">
                <Link className="cart__nombre" to={`/item/${item.id}`}>
                  {item.name}
                </Link>

                <dl className="cart__cifras">
                  <div>
                    <dt>Precio unitario</dt>
                    <dd>{formatearPrecio(item.price)}</dd>
                  </div>
                  <div>
                    <dt>Cantidad</dt>
                    <dd>{item.quantity}</dd>
                  </div>
                  <div>
                    <dt>Subtotal</dt>
                    <dd className="cart__subtotal">{formatearPrecio(item.price * item.quantity)}</dd>
                  </div>
                </dl>
              </div>

              <button
                type="button"
                className="cart__eliminar"
                onClick={() => removeItem(item.id)}
                aria-label={`Eliminar ${item.name} del carrito`}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>

        <aside className="cart__resumen" aria-label="Resumen de la compra">
          <h2 className="cart__resumen-titulo">Resumen</h2>

          <p className="cart__resumen-fila">
            <span>
              {totalItems} {totalItems === 1 ? 'unidad' : 'unidades'} ({cart.length}{' '}
              {cart.length === 1 ? 'producto' : 'productos'})
            </span>
          </p>

          <p className="cart__total">
            <span>Total</span>
            <strong>{formatearPrecio(totalPrice)}</strong>
          </p>

          <button
            type="button"
            className="cart__boton cart__boton--principal"
            onClick={() => setAvisoCheckout(true)}
          >
            Finalizar compra
          </button>

          {avisoCheckout && (
            <p className="cart__aviso" role="status">
              queda pendiente para finalizar la compra.
            </p>
          )}

          <button type="button" className="cart__boton cart__boton--secundario" onClick={clear}>
            Vaciar carrito
          </button>

          <Link className="cart__seguir" to="/">
            Seguir comprando
          </Link>
        </aside>
      </div>
    </main>
  )
}

export default Cart
