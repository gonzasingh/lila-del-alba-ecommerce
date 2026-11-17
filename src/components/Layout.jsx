import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'
import './Layout.css'

// Layout compartido: el Navbar y el Footer están siempre presentes y
// <Outlet /> es el lugar donde se dibuja la página que corresponde a la ruta.
function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="layout">
      <ScrollToTop />
      <Navbar />
      {/* Con key, cada página arranca desde cero al cambiar de ruta y nunca
          se ve por un instante el contenido de la ruta anterior */}
      <Outlet key={pathname} />
      <Footer />
    </div>
  )
}

export default Layout
