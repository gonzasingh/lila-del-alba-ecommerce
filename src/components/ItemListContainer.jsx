import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getProducts } from '../services/products'
import { CATEGORIAS, getNombreCategoria } from '../mock/categories'
import Banner from './Banner'
import ItemList from './ItemList'
import Cargando from './Cargando'
import NotFound from './NotFound'
import './ItemListContainer.css'

// Se usa en dos rutas: "/" (todo el catálogo) y "/category/:id" (una categoría)
function ItemListContainer({ greeting }) {
  // El :id de la URL es la categoría (queda undefined en "/")
  const { id: categoryId } = useParams()
  const categoriaValida = !categoryId || CATEGORIAS.some((categoria) => categoria.id === categoryId)

  // Productos obtenidos de la "API". Arranca como un array vacío
  const [items, setItems] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)

  // Se ejecuta al montar el componente y cada vez que cambia la categoría de la URL
  useEffect(() => {
    if (!categoriaValida) return

    // Si el componente se desmonta (o cambia la categoría) antes de que llegue la respuesta,
    // se ignora ese resultado para no mostrar productos de otra categoría
    let activo = true

    const cargarProductos = async () => {
      setCargando(true)
      setError(false)

      try {
        const productos = await getProducts(categoryId)
        if (activo) setItems(productos)
      } catch {
        if (activo) setError(true)
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargarProductos()

    return () => {
      activo = false
    }
  }, [categoryId, categoriaValida])

  if (!categoriaValida) {
    return <NotFound mensaje="La categoría que buscás no existe." />
  }

  return (
    <main className="item-list-container">
      {/* El carrusel de novedades y promociones solo se muestra en el inicio */}
      {!categoryId && <Banner />}

      {/* id="catalogo": destino del ancla "#catalogo" que usan los botones del banner */}
      <div className="item-list-container__encabezado" id="catalogo">
        <h1 className="item-list-container__titulo">
          {categoryId ? getNombreCategoria(categoryId) : greeting}
        </h1>
        {!cargando && !error && (
          <p className="item-list-container__cantidad">
            {items.length} {items.length === 1 ? 'producto' : 'productos'}
          </p>
        )}
      </div>

      {cargando && <Cargando mensaje="Cargando productos..." />}

      {error && (
        <p className="item-list-container__error" role="alert">
          No pudimos cargar los productos. Intentá de nuevo en unos minutos.
        </p>
      )}

      {!cargando && !error && <ItemList items={items} />}
    </main>
  )
}

export default ItemListContainer
