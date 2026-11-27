import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Layout from './components/Layout'
import ItemListContainer from './components/ItemListContainer'
import ItemDetailContainer from './components/ItemDetailContainer'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import DatosEnvio from './components/DatosEnvio'
import CambiarContrasena from './components/CambiarContrasena'
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
              {/* Rutas protegidas: sin sesión iniciada redirigen a /login */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute aviso="Iniciá sesión para finalizar tu compra.">
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              {/* Menú de la cuenta: datos de envío y cambio de contraseña */}
              <Route
                path="/cuenta/envio"
                element={
                  <ProtectedRoute aviso="Iniciá sesión para ver tus datos de envío.">
                    <DatosEnvio />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cuenta/contrasena"
                element={
                  <ProtectedRoute aviso="Iniciá sesión para cambiar tu contraseña.">
                    <CambiarContrasena />
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
