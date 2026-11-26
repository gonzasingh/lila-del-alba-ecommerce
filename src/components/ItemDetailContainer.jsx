import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProductById } from '../services/products'
import { getNombreCategoria } from '../constants/categories'
import ItemDetail from './ItemDetail'
import Cargando from './Cargando'
import './ItemDetailContainer.css'

// Se usa en la ruta "/item/:id": el id del producto viene de la URL
function ItemDetailContainer() {
  const { id: productId } = useParams()

  const [product, setProduct] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('') // mensaje para el usuario (vacío si no hubo error)

  // Se vuelve a ejecutar cada vez que cambia el id del producto
  useEffect(() => {
    // Si el componente se desmonta (o cambia el id) antes de que llegue la respuesta,
    // se ignora ese resultado para no mostrar un producto equivocado
    let activo = true

    const cargarProducto = async () => {
      setCargando(true)
      setError('')
      setProduct(null)

      try {
        const encontrado = await getProductById(productId)
        if (activo) setProduct(encontrado)
      } catch (e) {
        // La promesa se rechaza si no existe un producto con ese id o si falla la consulta
        console.error('No se pudo cargar el producto:', e)
        if (activo) {
          setError(
            e.code === 'app/producto-inexistente'
              ? 'No encontramos este producto. Puede que ya no esté disponible.'
              : 'No pudimos cargar el producto. Revisá tu conexión e intentá de nuevo.',
          )
        }
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
      {/* Vuelve a la categoría del producto (mientras carga todavía no se sabe cuál es) */}
      <Link
        className="item-detail-container__volver"
        to={product ? `/category/${product.category}` : '/'}
      >
        ← Volver {product ? `a ${getNombreCategoria(product.category)}` : 'al catálogo'}
      </Link>

      {cargando && <Cargando mensaje="Cargando producto..." />}

      {error && (
        <p className="item-detail-container__error" role="alert">
          {error}
        </p>
      )}

      {product && <ItemDetail product={product} />}
    </main>
  )
}

export default ItemDetailContainer
