import { Link } from 'react-router-dom'
import { CATEGORIAS } from '../mock/categories'
import logoOscuro from '../assets/logo-horizontal-oscuro.svg'
import './Footer.css'

// Pie de página: se muestra en todas las rutas gracias al Layout.
// Los links internos usan <Link> para navegar sin recargar la página.
function Footer() {
  const anio = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__contenido">
        <div className="footer__marca">
          {/* Versión del logo para fondo oscuro */}
          <img className="footer__logo" src={logoOscuro} alt="Lila del Alba" />
          <p className="footer__lema">Cosmética natural y aromatización.</p>
        </div>

        <nav className="footer__columna" aria-label="Categorías (pie de página)">
          <h2 className="footer__titulo">Categorías</h2>
          <ul className="footer__lista">
            {CATEGORIAS.map((categoria) => (
              <li key={categoria.id}>
                <Link className="footer__enlace" to={`/category/${categoria.id}`}>
                  {categoria.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="footer__columna" aria-label="Tienda (pie de página)">
          <h2 className="footer__titulo">Tienda</h2>
          <ul className="footer__lista">
            <li>
              <Link className="footer__enlace" to="/">
                Todos los productos
              </Link>
            </li>
            <li>
              <Link className="footer__enlace" to="/cart">
                Carrito
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <p className="footer__copy">© {anio} Lila del Alba. Todos los derechos reservados.</p>
    </footer>
  )
}

export default Footer
