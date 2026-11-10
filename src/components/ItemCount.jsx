import { useState } from 'react'
import './ItemCount.css'

// Contador de cantidad reutilizable.
//  - stock:   cantidad máxima que se puede seleccionar (llega por props desde el producto)
//  - initial: cantidad con la que arranca (por defecto 1)
//  - onAdd:   función que se ejecuta al confirmar, recibe la cantidad elegida
function ItemCount({ stock, initial = 1, onAdd }) {
  // La cantidad inicial nunca puede ser negativa ni superar el stock
  const [cantidad, setCantidad] = useState(Math.min(Math.max(initial, 0), stock))

  // Nunca se supera el stock
  const sumar = () => setCantidad((actual) => Math.min(actual + 1, stock))
  // Nunca se baja de cero
  const restar = () => setCantidad((actual) => Math.max(actual - 1, 0))

  return (
    <div className="item-count">
      <div className="item-count__selector">
        <button
          type="button"
          className="item-count__boton"
          onClick={restar}
          disabled={cantidad === 0}
          aria-label="Restar una unidad"
        >
          −
        </button>
        <span className="item-count__cantidad" aria-live="polite">
          {cantidad}
        </span>
        <button
          type="button"
          className="item-count__boton"
          onClick={sumar}
          disabled={cantidad >= stock}
          aria-label="Sumar una unidad"
        >
          +
        </button>
      </div>

      <button
        type="button"
        className="item-count__agregar"
        onClick={() => onAdd?.(cantidad)}
        disabled={cantidad === 0}
      >
        Agregar al carrito
      </button>
    </div>
  )
}

export default ItemCount
