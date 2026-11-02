import { useState, useEffect } from 'react'
import { getProducts } from '../mock/asyncMock'
import ItemList from './ItemList'
import './ItemListContainer.css'

function ItemListContainer({ greeting }) {
  // Productos obtenidos de la "API". Arranca como un array vacío
  const [items, setItems] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)

  // El array de dependencias vacío hace que la carga ocurra solo al montar el componente
  useEffect(() => {
    // Si el componente se desmonta antes de que llegue la respuesta, no se actualiza el estado
    let montado = true

    const cargarProductos = async () => {
      try {
        const productos = await getProducts()
        if (montado) setItems(productos)
      } catch {
        if (montado) setError(true)
      } finally {
        if (montado) setCargando(false)
      }
    }

    cargarProductos()

    return () => {
      montado = false
    }
  }, [])

  return (
    <main className="item-list-container">
      <h1 className="item-list-container__saludo">{greeting}</h1>

      {cargando && (
        <p className="item-list-container__estado" role="status">
          <span className="item-list-container__spinner" aria-hidden="true" />
          Cargando productos...
        </p>
      )}

      {error && (
        <p className="item-list-container__estado" role="alert">
          No pudimos cargar los productos. Intentá de nuevo en unos minutos.
        </p>
      )}

      {!cargando && !error && <ItemList items={items} />}
    </main>
  )
}

export default ItemListContainer
