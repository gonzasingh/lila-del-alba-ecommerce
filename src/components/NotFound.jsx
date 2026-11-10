import { Link } from 'react-router-dom'
import './NotFound.css'

// Se muestra cuando la ruta (o la categoría) no existe
function NotFound({ mensaje = 'La página que buscás no existe.' }) {
  return (
    <main className="not-found">
      <h1 className="not-found__titulo">No encontramos lo que buscás</h1>
      <p>{mensaje}</p>
      <Link className="not-found__enlace" to="/">
        Volver al catálogo
      </Link>
    </main>
  )
}

export default NotFound
