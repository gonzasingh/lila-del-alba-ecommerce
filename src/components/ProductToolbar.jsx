import { ORDENES } from '../utils/filtrarProductos'
import './ProductToolbar.css'

// Buscador y selector de orden de la lista. No filtra: avisa los cambios al contenedor.
function ProductToolbar({ texto, onTexto, orden, onOrden }) {
  return (
    <div className="toolbar" role="search">
      <label className="toolbar__grupo">
        <span className="sr-only">Buscar productos</span>
        <input
          className="toolbar__campo toolbar__campo--buscar"
          type="search"
          placeholder="Buscar un producto"
          value={texto}
          onChange={(evento) => onTexto(evento.target.value)}
        />
      </label>

      <label className="toolbar__grupo">
        <span className="sr-only">Ordenar productos</span>
        <select
          className="toolbar__campo"
          value={orden}
          onChange={(evento) => onOrden(evento.target.value)}
        >
          {ORDENES.map((opcion) => (
            <option key={opcion.value} value={opcion.value}>
              {opcion.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

export default ProductToolbar
