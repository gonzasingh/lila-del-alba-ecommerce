import { useState } from 'react'
import { Link } from 'react-router-dom'
import CheckoutForm from './CheckoutForm'
import { useCart } from '../context/CartContext'
import { firebaseConfigured } from '../services/firebase'
import { crearOrden, SinStockError } from '../services/orders'
import { formatearPrecio } from '../utils/formatearPrecio'
import logoFlor from '../assets/logo-flor.svg'
import './Cart.css'

// Vista del carrito (ruta /cart): lista los productos agregados, permite quitarlos
// de a uno o vaciar todo, y muestra el total antes de decidir la compra.
function Cart() {
  // lines: cada línea del carrito con su precio ya calculado (incluye el descuento por pack x10)
  const { lines, removeItem, clear, totalItems, subtotal, discount, totalPrice } = useCart()

  // "Finalizar compra" abre el formulario; la orden se guarda en Firestore
  const [mostrarCheckout, setMostrarCheckout] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [errorOrden, setErrorOrden] = useState('')
  const [orden, setOrden] = useState(null) // { id, total } cuando la compra se completó

  // Productos distintos (un mismo producto puede ocupar varias líneas, una por variedad)
  const totalProductos = new Set(lines.map((linea) => linea.id)).size

  const confirmarCompra = async (comprador) => {
    setEnviando(true)
    setErrorOrden('')

    try {
      const id = await crearOrden({
        comprador,
        lineas: lines,
        subtotal,
        descuento: discount,
        total: totalPrice,
      })
      setOrden({ id, total: totalPrice })
      clear()
    } catch (error) {
      setErrorOrden(
        error instanceof SinStockError
          ? `No hay stock suficiente de ${error.faltantes
              .map((f) => `${f.name} (quedan ${f.disponible})`)
              .join(', ')}.`
          : 'No pudimos generar la orden. Intentá de nuevo en unos minutos.',
      )
    } finally {
      setEnviando(false)
    }
  }

  // Compra confirmada: se muestra el número de orden (el carrito ya quedó vacío)
  if (orden) {
    return (
      <main className="cart cart--vacio">
        <img className="cart__flor" src={logoFlor} alt="" />
        <h1 className="cart__titulo">¡Gracias por tu compra!</h1>
        <div className="cart__orden" role="status">
          <p>Tu número de orden es</p>
          <p className="cart__orden-id">{orden.id}</p>
          <p>Total: {formatearPrecio(orden.total)}</p>
        </div>
        <p className="cart__mensaje">Guardá este número para consultar por tu pedido.</p>
        <Link className="cart__boton cart__boton--principal" to="/">
          Seguir comprando
        </Link>
      </main>
    )
  }

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
                disabled={enviando}
                aria-label={`Eliminar ${[item.name, ...item.selection.map((e) => e.value)].join(', ')} del carrito`}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>

        <aside
          className={mostrarCheckout ? 'cart__resumen cart__resumen--formulario' : 'cart__resumen'}
          aria-label="Resumen de la compra"
        >
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

          {mostrarCheckout && firebaseConfigured ? (
            <CheckoutForm
              onSubmit={confirmarCompra}
              onCancel={() => setMostrarCheckout(false)}
              enviando={enviando}
              error={errorOrden}
            />
          ) : (
            <button
              type="button"
              className="cart__boton cart__boton--principal"
              onClick={() => setMostrarCheckout(true)}
            >
              Finalizar compra
            </button>
          )}

          {mostrarCheckout && !firebaseConfigured && (
            <p className="cart__aviso" role="status">
              La compra online todavía no está disponible: falta configurar Firebase.
            </p>
          )}

          <button
            type="button"
            className="cart__boton cart__boton--secundario"
            onClick={clear}
            disabled={enviando}
          >
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
