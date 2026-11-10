import { useState, useEffect } from 'react'
import { getProducts } from '../mock/asyncMock'
import ItemList from './ItemList'
import Cargando from './Cargando'
import './ItemListContainer.css'

// onVerDetalle (opcional): se reenvía a ItemList para abrir el detalle de un producto
function ItemListContainer({ greeting, onVerDetalle }) {
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

      {cargando && <Cargando mensaje="Cargando productos..." />}

      {error && (
        <p className="item-list-container__error" role="alert">
          No pudimos cargar los productos. Intentá de nuevo en unos minutos.
        </p>
      )}

      {!cargando && !error && <ItemList items={items} onVerDetalle={onVerDetalle} />}
    </main>
  )
}

export default ItemListContainer
