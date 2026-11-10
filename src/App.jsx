import { Routes, Route } from 'react-router-dom'
import CartProvider from './context/CartProvider'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import ItemListContainer from './components/ItemListContainer'
import ItemDetailContainer from './components/ItemDetailContainer'
import Cart from './components/Cart'
import NotFound from './components/NotFound'

function App() {
  return (
    <CartProvider>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<ItemListContainer greeting="¡Bienvenidos a Lila del Alba!" />} />
        <Route path="/category/:categoryId" element={<ItemListContainer />} />
        <Route path="/item/:id" element={<ItemDetailContainer />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </CartProvider>
  )
}

export default App
