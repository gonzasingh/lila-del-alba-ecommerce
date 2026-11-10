import CartWidget from './CartWidget'
import { CATEGORIAS } from '../mock/categories'
import logoFlor from '../assets/logo-flor.png'
import './Navbar.css'

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__contenido">
        <a className="navbar__marca" href="#">
          <img className="navbar__logo" src={logoFlor} alt="" />
          <span className="navbar__nombre">Lila del Alba</span>
        </a>

        <nav className="navbar__categorias" aria-label="Categorías de productos">
          <ul className="navbar__lista">
            {CATEGORIAS.map((categoria) => (
              <li key={categoria.id}>
                <a className="navbar__enlace" href={`#${categoria.id}`}>
                  {categoria.nombre}
                </a>
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
