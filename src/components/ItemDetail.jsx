import { useState } from 'react'
import { Link } from 'react-router-dom'
import ItemCount from './ItemCount'
import { useCart } from '../context/CartContext'
import { getNombreCategoria } from '../mock/categories'
import { formatearPrecio } from '../utils/formatearPrecio'
import './ItemDetail.css'

// ItemDetail recibe un producto por props y muestra TODA su información.
// No busca datos (eso lo hace ItemDetailContainer): lo único que toma del contexto
// es el carrito, para agregar el producto con la cantidad que elija el cliente.
function ItemDetail({ product }) {
  const { addItem, getQuantity } = useCart()

  // Cantidad que se acaba de agregar en esta visita (0 = todavía no agregó nada)
  const [agregadas, setAgregadas] = useState(0)

  const {
    id,
    name,
    price,
    priceX10,
    category,
    img,
    stock,
    description,
    presentation,
    container,
    features = [],
    aromas = [],
  } = product

  // Lo que todavía se puede agregar: el stock menos lo que ya está en el carrito
  const cantidadEnCarrito = getQuantity(id)
  const disponible = stock - cantidadEnCarrito

  const textoStock =
    stock === 0 ? 'Sin stock' : `Stock disponible: ${stock} ${stock === 1 ? 'unidad' : 'unidades'}`

  // El cliente confirma la cantidad en ItemCount: se agrega al carrito (contexto)
  const handleAdd = (cantidad) => {
    addItem(product, cantidad)
    setAgregadas(cantidad)
  }

  return (
    <article className="item-detail">
      <img className="item-detail__imagen" src={img} alt={name} />

      <div className="item-detail__info">
        <p className="item-detail__categoria">{getNombreCategoria(category)}</p>
        <h1 className="item-detail__nombre">{name}</h1>

        <div className="item-detail__precios">
          <p className="item-detail__precio">{formatearPrecio(price)}</p>
          {priceX10 && (
            <p className="item-detail__pack">
              Pack x10 unidades: {formatearPrecio(priceX10)} c/u
            </p>
          )}
        </div>

        <p className="item-detail__descripcion">{description}</p>

        {(presentation || container) && (
          <dl className="item-detail__ficha">
            {presentation && (
              <>
                <dt>Presentación</dt>
                <dd>{presentation}</dd>
              </>
            )}
            {container && (
              <>
                <dt>Envase</dt>
                <dd>{container}</dd>
              </>
            )}
          </dl>
        )}

        {features.length > 0 && (
          <section>
            <h2 className="item-detail__subtitulo">Características</h2>
            <ul className="item-detail__caracteristicas">
              {features.map((caracteristica) => (
                <li key={caracteristica}>{caracteristica}</li>
              ))}
            </ul>
          </section>
        )}

        {aromas.length > 0 && (
          <section>
            <h2 className="item-detail__subtitulo">Aromas disponibles</h2>
            <ul className="item-detail__aromas">
              {aromas.map((aroma) => (
                <li key={aroma}>{aroma}</li>
              ))}
            </ul>
          </section>
        )}

        <div className="item-detail__compra">
          <p className="item-detail__stock">{textoStock}</p>

          {agregadas > 0 ? (
            // Ya agregó: el botón "Agregar" se reemplaza por "Terminar mi compra" (lleva a /cart)
            <>
              <p className="item-detail__confirmacion" role="status">
                ¡Listo! Agregaste {agregadas} {agregadas === 1 ? 'unidad' : 'unidades'} al carrito.
              </p>
              <div className="item-detail__acciones">
                <Link className="item-detail__terminar" to="/cart">
                  Terminar mi compra
                </Link>
                <Link className="item-detail__seguir" to="/">
                  Seguir comprando
                </Link>
              </div>
            </>
          ) : (
            <>
              {disponible > 0 ? (
                <ItemCount stock={disponible} onAdd={handleAdd} />
              ) : (
                stock > 0 && (
                  <p className="item-detail__confirmacion">
                    Ya tenés todo el stock disponible en tu carrito.
                  </p>
                )
              )}
              {cantidadEnCarrito > 0 && (
                <p className="item-detail__en-carrito">
                  Tenés {cantidadEnCarrito} {cantidadEnCarrito === 1 ? 'unidad' : 'unidades'} de
                  este producto en el carrito.{' '}
                  <Link className="item-detail__enlace" to="/cart">
                    Terminar mi compra
                  </Link>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  )
}

export default ItemDetail
