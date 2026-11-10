import { useState } from 'react'
import Navbar from './components/Navbar'
import ItemListContainer from './components/ItemListContainer'
import ItemDetailContainer from './components/ItemDetailContainer'

function App() {
  // Navegación PROVISORIA: guarda el id del producto que se está viendo (null = catálogo).
  // Cuando se incorpore React Router (Módulo 5), el id vendrá de la URL y este estado desaparece.
  const [productoId, setProductoId] = useState(null)

  return (
    <>
      <Navbar />
      {productoId === null ? (
        <ItemListContainer greeting="¡Bienvenidos a Lila del Alba!" onVerDetalle={setProductoId} />
      ) : (
        <ItemDetailContainer productId={productoId} onVolver={() => setProductoId(null)} />
      )}
    </>
  )
}

export default App
