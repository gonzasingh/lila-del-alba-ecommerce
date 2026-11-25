import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import CartWidget from './CartWidget'
import { CATEGORIAS } from '../mock/categories'
import logoHorizontal from '../assets/logo-horizontal.svg'
import './Navbar.css'

function Navbar() {
  // En pantallas chicas las categorías están en un menú desplegable (hamburguesa)
  const [menuAbierto, setMenuAbierto] = useState(false)
  // true cuando se bajó en la página: la barra pasa de integrada a "vidrio" flotante
  const [desplazado, setDesplazado] = useState(false)
  const botonRef = useRef(null)

  const cerrarMenu = () => setMenuAbierto(false)

  useEffect(() => {
    const alDesplazar = () => setDesplazado(window.scrollY > 24)

    alDesplazar() // por si la página se recarga estando abajo
    window.addEventListener('scroll', alDesplazar, { passive: true })
    return () => window.removeEventListener('scroll', alDesplazar)
  }, [])

  const claseBarra = [
    'navbar',
    desplazado || menuAbierto ? 'navbar--vidrio' : '',
    menuAbierto ? 'navbar--menu' : '',
  ]
    .filter(Boolean)
    .join(' ')

  // Con el menú abierto: Escape o un toque fuera de la barra lo cierran
  useEffect(() => {
    if (!menuAbierto) return

    const handleKeyDown = (evento) => {
      if (evento.key === 'Escape') {
        setMenuAbierto(false)
        botonRef.current?.focus() // el foco vuelve al botón que abrió el menú
      }
    }

    const handlePointerDown = (evento) => {
      if (!evento.target.closest('.navbar')) setMenuAbierto(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [menuAbierto])

  const claseEnlace = ({ isActive }) =>
    isActive ? 'navbar__enlace navbar__enlace--activo' : 'navbar__enlace'

  return (
    <header className={claseBarra}>
      <div className="navbar__contenido">
        {/* El logo horizontal ya incluye la flor y el nombre de la marca */}
        <Link
          className="navbar__marca"
          to="/"
          aria-label="Lila del Alba, ir al inicio"
          onClick={cerrarMenu}
        >
          <img className="navbar__logo" src={logoHorizontal} alt="Lila del Alba" />
        </Link>

        <nav
          id="menu-categorias"
          className={
            menuAbierto ? 'navbar__categorias navbar__categorias--abierto' : 'navbar__categorias'
          }
          aria-label="Categorías de productos"
        >
          <ul className="navbar__lista">
            {/* "Todos los productos" solo aparece en el menú desplegable del celular */}
            <li className="navbar__item-inicio">
              <NavLink className={claseEnlace} to="/" end onClick={cerrarMenu}>
                Todos los productos
              </NavLink>
            </li>
            {CATEGORIAS.map((categoria) => (
              <li key={categoria.id}>
                <NavLink
                  className={claseEnlace}
                  to={`/category/${categoria.id}`}
                  onClick={cerrarMenu}
                >
                  {categoria.nombre}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <CartWidget />

        <button
          ref={botonRef}
          type="button"
          className="navbar__hamburguesa"
          aria-expanded={menuAbierto}
          aria-controls="menu-categorias"
          aria-label={menuAbierto ? 'Cerrar menú de categorías' : 'Abrir menú de categorías'}
          onClick={() => setMenuAbierto((abierto) => !abierto)}
        >
          <span className="navbar__barras" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}

export default Navbar
