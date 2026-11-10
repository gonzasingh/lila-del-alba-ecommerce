import { Link } from 'react-router-dom'
import ItemCount from './ItemCount'
import { getNombreCategoria } from '../mock/categories'
import { formatearPrecio } from '../utils/formatearPrecio'
import './ItemDetail.css'

// ItemDetail recibe un producto por props y muestra TODA su información.
// No busca datos ni toca el carrito: eso lo hace ItemDetailContainer, que le pasa
//  - cantidadEnCarrito: cuántas unidades de este producto ya están en el carrito
//  - onAdd: función a ejecutar cuando el cliente confirma una cantidad
function ItemDetail({ product, cantidadEnCarrito = 0, onAdd }) {
  const {
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
  const disponible = stock - cantidadEnCarrito

  const textoStock =
    stock === 0 ? 'Sin stock' : `Stock disponible: ${stock} ${stock === 1 ? 'unidad' : 'unidades'}`

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
          {/* Con key, el contador se reinicia después de cada "Agregar al carrito" */}
          <ItemCount key={cantidadEnCarrito} stock={disponible} onAdd={onAdd} />
          {cantidadEnCarrito > 0 && (
            <p className="item-detail__confirmacion" role="status">
              Tenés {cantidadEnCarrito} {cantidadEnCarrito === 1 ? 'unidad' : 'unidades'} de este
              producto en el carrito.{' '}
              <Link className="item-detail__enlace" to="/cart">
                Ir al carrito
              </Link>
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

export default ItemDetail
