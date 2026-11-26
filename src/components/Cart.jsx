import { Link } from 'react-router-dom'
import ResumenCompra from './ResumenCompra'
import { useCart } from '../context/CartContext'
import { formatearPrecio } from '../utils/formatearPrecio'
import logoFlor from '../assets/logo-flor.svg'
import './Cart.css'

// Vista del carrito (ruta /cart): lista los productos agregados, permite quitarlos
// de a uno o vaciar todo, y muestra el total antes de decidir la compra.
// "Finalizar compra" lleva a /checkout, que solo pueden usar los usuarios con sesión iniciada.
function Cart() {
  // lines: cada línea del carrito con su precio ya calculado (incluye el descuento por pack x10)
  const { lines, removeItem, clear } = useCart()

  // Carrito vacío: mensaje y link para volver al catálogo
  if (lines.length === 0) {
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
          {lines.map((item) => (
            <li key={item.lineId} className="cart__item">
              <img className="cart__imagen" src={item.img} alt="" />

              <div className="cart__datos">
                <Link className="cart__nombre" to={`/item/${item.id}`}>
                  {item.name}
                </Link>

                {item.selection.map((eleccion) => (
                  <p key={eleccion.label} className="cart__fragancia">
                    {eleccion.label}: {eleccion.value}
                  </p>
                ))}

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
                    <dd className="cart__subtotal">
                      {item.unidadesPack > 0 && (
                        <del className="cart__antes">
                          <span className="sr-only">Antes </span>
                          {formatearPrecio(item.subtotalSinDescuento)}
                        </del>
                      )}
                      {formatearPrecio(item.subtotal)}
                    </dd>
                  </div>
                </dl>

                {/* Desglose cuando se aplicó el pack: cuántas con descuento y cuántas a precio normal */}
                {item.unidadesPack > 0 && (
                  <p className="cart__pack">
                    Pack x10: {item.unidadesPack} × {formatearPrecio(item.priceX10)}
                    {item.unidadesNormales > 0 &&
                      ` + ${item.unidadesNormales} × ${formatearPrecio(item.price)} (precio normal)`}
                  </p>
                )}
              </div>

              <button
                type="button"
                className="cart__eliminar"
                onClick={() => removeItem(item.id, item.lineId)}
                aria-label={`Eliminar ${[item.name, ...item.selection.map((e) => e.value)].join(', ')} del carrito`}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>

        <aside className="cart__resumen" aria-label="Resumen de la compra">
          <ResumenCompra />

          <Link className="cart__boton cart__boton--principal" to="/checkout">
            Finalizar compra
          </Link>

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
