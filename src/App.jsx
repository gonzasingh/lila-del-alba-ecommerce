import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Layout from './components/Layout'
import ItemListContainer from './components/ItemListContainer'
import ItemDetailContainer from './components/ItemDetailContainer'
import Cart from './components/Cart'
import NotFound from './components/NotFound'

function App() {
  return (
    <BrowserRouter>
      {/* El CartProvider envuelve todas las rutas: el carrito no se pierde al navegar */}
      <CartProvider>
        <Routes>
          {/* Rutas anidadas: todas se dibujan dentro del Layout (Navbar + Footer) */}
          <Route element={<Layout />}>
            {/* Inicio (/): todo el catálogo */}
            <Route index element={<ItemListContainer greeting="Todos los productos" />} />
            {/* Categoría: el listado se filtra con el :id de la URL */}
            <Route path="/category/:id" element={<ItemListContainer />} />
            {/* Detalle: el :id de la URL es el id del producto */}
            <Route path="/item/:id" element={<ItemDetailContainer />} />
            <Route path="/cart" element={<Cart />} />
            {/* Cualquier otra URL: error 404 (también dentro del Layout) */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
