import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProductById } from '../mock/asyncMock'
import { useCart } from '../hooks/useCart'
import ItemDetail from './ItemDetail'
import Cargando from './Cargando'
import './ItemDetailContainer.css'

// Se usa en la ruta "/item/:id": el id del producto viene de la URL
function ItemDetailContainer() {
  const { id: productId } = useParams()
  const { addItem, getQuantity } = useCart()

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

  // Al confirmar en ItemCount, el producto se agrega al carrito con la cantidad elegida
  const handleAdd = (cantidad) => addItem(product, cantidad)

  return (
    <main className="item-detail-container">
      <Link className="item-detail-container__volver" to="/">
        ← Volver al catálogo
      </Link>

      {cargando && <Cargando mensaje="Cargando producto..." />}

      {error && (
        <p className="item-detail-container__error" role="alert">
          No encontramos este producto. Puede que ya no esté disponible.
        </p>
      )}

      {product && (
        <ItemDetail
          product={product}
          cantidadEnCarrito={getQuantity(product.id)}
          onAdd={handleAdd}
        />
      )}
    </main>
  )
}

export default ItemDetailContainer
