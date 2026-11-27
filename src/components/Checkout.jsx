import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import CheckoutForm from './CheckoutForm'
import ResumenCompra from './ResumenCompra'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { BaseAjenaError, crearOrden, SinStockError } from '../services/orders'
import { formatearPrecio } from '../utils/formatearPrecio'
import graciasPorCompra from '../assets/graciasxcompra.svg'
import './Checkout.css'

// Mensaje claro para cada motivo por el que puede fallar la generación de la orden
const mensajeErrorOrden = (error) => {
  if (error instanceof SinStockError) {
    const detalle = error.faltantes.map((f) => `${f.name} (quedan ${f.disponible})`).join(', ')
    return `No hay stock suficiente de ${detalle}.`
  }
  if (error instanceof BaseAjenaError) {
    return 'La compra online todavía no está disponible con esta base de datos.'
  }
  if (error.code === 'permission-denied') {
    return 'No tenés permiso para generar la orden. Cerrá sesión, volvé a ingresar e intentá de nuevo.'
  }
  if (error.code === 'unavailable') {
    return 'No pudimos conectarnos. Revisá tu conexión e intentá de nuevo.'
  }
  if (error.code === 'app/firebase-no-configurado') {
    return 'La compra online todavía no está disponible: falta configurar Firebase.'
  }
  return 'No pudimos generar la orden. Intentá de nuevo en unos minutos.'
}

// Checkout (ruta /checkout, protegida por ProtectedRoute): muestra la compra, pide los datos de
// entrega y, al confirmar, guarda la orden en Firestore. Después muestra el id de la orden.
function Checkout() {
  const { user } = useAuth()
  const { lines, subtotal, discount, totalPrice, clear } = useCart()

  const [enviando, setEnviando] = useState(false)
  const [errorOrden, setErrorOrden] = useState('')
  const [orden, setOrden] = useState(null) // { id, total } cuando la compra se completó

  const confirmarCompra = async (comprador) => {
    setErrorOrden('')

    // Se verifica de nuevo lo necesario antes de crear la orden (los datos del formulario
    // ya los validó CheckoutForm)
    if (!user) {
      setErrorOrden('Tu sesión se cerró. Iniciá sesión para finalizar la compra.')
      return
    }
    if (lines.length === 0) {
      setErrorOrden('Tu carrito está vacío.')
      return
    }

    setEnviando(true)
    try {
      const id = await crearOrden({
        usuario: user,
        comprador,
        lineas: lines,
        subtotal,
        descuento: discount,
        total: totalPrice,
      })
      // El carrito se vacía solo después de que la orden se creó correctamente
      setOrden({ id, total: totalPrice })
      clear()
    } catch (error) {
      console.error('No se pudo generar la orden:', error)
      setErrorOrden(mensajeErrorOrden(error))
    } finally {
      setEnviando(false)
    }
  }

  // Compra confirmada: se muestra el id de la orden (el carrito ya quedó vacío,
  // por eso este caso va antes que el del carrito vacío)
  if (orden) {
    return (
      <main className="cart cart--vacio">
        <img className="cart__flor" src={graciasPorCompra} alt="" />
        <h1 className="cart__titulo">¡Gracias por tu compra!</h1>
        <div className="cart__orden" role="status">
          <p>Tu compra fue registrada. Tu número de orden es</p>
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

  // Sin productos no se puede generar una orden: se lo manda al carrito, que ofrece volver al catálogo
  if (lines.length === 0) return <Navigate to="/cart" replace />

  return (
    <main className="cart">
      <h1 className="cart__titulo">Finalizar compra</h1>

      <div className="cart__contenido">
        <div>
          <section className="checkout-page__bloque" aria-labelledby="checkout-productos">
            <h2 className="checkout-page__subtitulo" id="checkout-productos">
              Tu pedido
            </h2>
            <ul className="checkout-page__lista">
              {lines.map((linea) => (
                <li key={linea.lineId} className="checkout-page__linea">
                  <img className="checkout-page__imagen" src={linea.img} alt="" />
                  <div>
                    <p className="checkout-page__nombre">{linea.name}</p>
                    {linea.selection.map((eleccion) => (
                      <p key={eleccion.label} className="checkout-page__detalle">
                        {eleccion.label}: {eleccion.value}
                      </p>
                    ))}
                    <p className="checkout-page__detalle">
                      {linea.quantity} × {formatearPrecio(linea.price)}
                    </p>
                  </div>
                  <strong className="checkout-page__subtotal">{formatearPrecio(linea.subtotal)}</strong>
                </li>
              ))}
            </ul>
          </section>

          <section className="checkout-page__bloque">
            <CheckoutForm
              email={user.email}
              onSubmit={confirmarCompra}
              enviando={enviando}
              error={errorOrden}
            />
          </section>
        </div>

        <aside className="cart__resumen" aria-label="Resumen de la compra">
          <ResumenCompra />
          <Link className="cart__seguir" to="/cart">
            Volver al carrito
          </Link>
        </aside>
      </div>
    </main>
  )
}

export default Checkout
