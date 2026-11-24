import { Link, NavLink } from 'react-router-dom'
import CartWidget from './CartWidget'
import { CATEGORIAS } from '../mock/categories'
import logoHorizontal from '../assets/logo-horizontal.svg'
import './Navbar.css'

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__contenido">
        {/* El logo horizontal ya incluye la flor y el nombre de la marca */}
        <Link className="navbar__marca" to="/" aria-label="Lila del Alba, ir al inicio">
          <img className="navbar__logo" src={logoHorizontal} alt="Lila del Alba" />
        </Link>

        <nav className="navbar__categorias" aria-label="Categorías de productos">
          <ul className="navbar__lista">
            {CATEGORIAS.map((categoria) => (
              <li key={categoria.id}>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? 'navbar__enlace navbar__enlace--activo' : 'navbar__enlace'
                  }
                  to={`/category/${categoria.id}`}
                >
                  {categoria.nombre}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <CartWidget />
      </div>
    </header>
  )
}

export default Navbar
