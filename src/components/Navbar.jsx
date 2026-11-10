import { Link, NavLink } from 'react-router-dom'
import CartWidget from './CartWidget'
import { CATEGORIAS } from '../mock/categories'
import logoFlor from '../assets/logo-flor.png'
import './Navbar.css'

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__contenido">
        <Link className="navbar__marca" to="/">
          <img className="navbar__logo" src={logoFlor} alt="" />
          <span className="navbar__nombre">Lila del Alba</span>
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
