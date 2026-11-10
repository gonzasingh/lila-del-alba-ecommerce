import { useState } from 'react'
import ItemCount from './ItemCount'
import { getNombreCategoria } from '../mock/categories'
import { formatearPrecio } from '../utils/formatearPrecio'
import './ItemDetail.css'

// ItemDetail recibe un producto por props y muestra TODA su información.
// No busca datos: eso lo hace ItemDetailContainer.
function ItemDetail({ product }) {
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

  // Cantidad que el cliente confirmó con ItemCount (el carrito llega en una próxima entrega)
  const [agregado, setAgregado] = useState(0)

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
          <ItemCount stock={stock} onAdd={setAgregado} />
          {agregado > 0 && (
            <p className="item-detail__confirmacion" role="status">
              Agregaste {agregado} {agregado === 1 ? 'unidad' : 'unidades'} al carrito.
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

export default ItemDetail
