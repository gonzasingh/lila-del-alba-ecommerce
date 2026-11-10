import { getNombreCategoria } from '../mock/categories'
import { formatearPrecio } from '../utils/formatearPrecio'
import './Item.css'

// Item solo muestra la información resumida de un producto (imagen, categoría, nombre y precio).
// El resto de los datos se ven en el detalle (ItemDetail).
// onVerDetalle es opcional: si llega, la card muestra el botón "Ver detalle".
function Item({ product, onVerDetalle }) {
  const { id, name, price, category, img } = product

  return (
    <article className="item">
      <img className="item__imagen" src={img} alt={name} loading="lazy" />
      <div className="item__cuerpo">
        <p className="item__categoria">{getNombreCategoria(category)}</p>
        <h2 className="item__nombre">{name}</h2>
        <div className="item__pie">
          <p className="item__precio">{formatearPrecio(price)}</p>
          {onVerDetalle && (
            <button
              type="button"
              className="item__boton"
              onClick={() => onVerDetalle(id)}
              aria-label={`Ver detalle de ${name}`}
            >
              Ver detalle
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default Item
