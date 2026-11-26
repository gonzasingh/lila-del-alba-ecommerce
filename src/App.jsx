import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Layout from './components/Layout'
import ItemListContainer from './components/ItemListContainer'
import ItemDetailContainer from './components/ItemDetailContainer'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import AuthForm from './components/AuthForm'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './components/NotFound'

function App() {
  return (
    <BrowserRouter>
      {/* Los providers envuelven todas las rutas: la sesión y el carrito no se pierden al navegar */}
      <AuthProvider>
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
              {/* Cuenta: el mismo formulario para iniciar sesión y para registrarse */}
              <Route path="/login" element={<AuthForm modo="login" />} />
              <Route path="/registro" element={<AuthForm modo="registro" />} />
              {/* Checkout protegido: sin sesión iniciada redirige a /login */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              {/* Cualquier otra URL: error 404 (también dentro del Layout) */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
