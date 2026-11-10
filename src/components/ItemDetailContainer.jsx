import { useState, useEffect } from 'react'
import { getProductById } from '../mock/asyncMock'
import ItemDetail from './ItemDetail'
import Cargando from './Cargando'
import './ItemDetailContainer.css'

// productId: id del producto a mostrar. Por ahora lo define App de forma temporal;
// con React Router (Módulo 5) vendrá de la URL.
// onVolver (opcional): se ejecuta al tocar "Volver al catálogo".
function ItemDetailContainer({ productId, onVolver }) {
  const [product, setProduct] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)

  // Se vuelve a ejecutar cada vez que cambia el id del producto
  useEffect(() => {
    // Si el componente se desmonta (o cambia el id) antes de que llegue la respuesta,
    // se ignora ese resultado para no mostrar un producto equivocado
    let activo = true

    const cargarProducto = async () => {
      setCargando(true)
      setError(false)
      setProduct(null)

      try {
        const encontrado = await getProductById(productId)
        if (activo) setProduct(encontrado)
      } catch {
        // La promesa se rechaza cuando no existe un producto con ese id
        if (activo) setError(true)
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargarProducto()

    return () => {
      activo = false
    }
  }, [productId])

  return (
    <main className="item-detail-container">
      {onVolver && (
        <button type="button" className="item-detail-container__volver" onClick={onVolver}>
          ← Volver al catálogo
        </button>
      )}

      {cargando && <Cargando mensaje="Cargando producto..." />}

      {error && (
        <p className="item-detail-container__error" role="alert">
          No encontramos este producto. Puede que ya no esté disponible.
        </p>
      )}

      {product && <ItemDetail product={product} />}
    </main>
  )
}

export default ItemDetailContainer
