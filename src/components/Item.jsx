import { Link } from 'react-router-dom'
import { getNombreCategoria } from '../mock/categories'
import { formatearPrecio } from '../utils/formatearPrecio'
import './Item.css'

// Item solo muestra la información resumida de un producto (imagen, categoría, nombre y precio).
// El resto de los datos se ven en el detalle (ItemDetail), al que se llega desde el link "Ver detalle".
function Item({ product }) {
  const { id, name, price, category, img } = product

  return (
    <article className="item">
      <img className="item__imagen" src={img} alt={name} loading="lazy" />
      <div className="item__cuerpo">
        <p className="item__categoria">{getNombreCategoria(category)}</p>
        <h2 className="item__nombre">{name}</h2>
        <div className="item__pie">
          <p className="item__precio">{formatearPrecio(price)}</p>
          <Link className="item__boton" to={`/item/${id}`} aria-label={`Ver detalle de ${name}`}>
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  )
}

export default Item
