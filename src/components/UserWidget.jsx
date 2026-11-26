import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './UserWidget.css'

// Sector de la cuenta en el Navbar:
//  - sin sesión: link "Ingresar" (en celulares, solo el ícono)
//  - con sesión: el email del usuario y el botón "Cerrar sesión" (en celulares van dentro del menú)
// Props: menuAbierto (el menú del celular está desplegado) y onNavegar (lo cierra al elegir algo).
function UserWidget({ menuAbierto, onNavegar }) {
  const { user, loading, logout } = useAuth()
  const [error, setError] = useState(false)

  // Mientras se valida la sesión guardada no se muestra nada, para que no parpadee "Ingresar"
  if (loading) return null

  if (!user) {
    return (
      <Link className="user-widget__ingresar" to="/login" onClick={onNavegar}>
        <svg
          className="user-widget__icono"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
        <span className="user-widget__texto">Ingresar</span>
      </Link>
    )
  }

  const cerrarSesion = async () => {
    setError(false)
    try {
      // onAuthStateChanged limpia el usuario del contexto, y con él desaparece el email de la barra
      await logout()
      onNavegar()
    } catch (e) {
      console.error('No se pudo cerrar la sesión:', e)
      setError(true)
    }
  }

  return (
    <div
      className={
        menuAbierto ? 'user-widget__sesion user-widget__sesion--abierto' : 'user-widget__sesion'
      }
    >
      <span className="user-widget__email" title={user.email}>
        {user.email}
      </span>
      <button type="button" className="user-widget__salir" onClick={cerrarSesion}>
        Cerrar sesión
      </button>
      {error && (
        <span className="user-widget__error" role="alert">
          No pudimos cerrar la sesión. Intentá de nuevo.
        </span>
      )}
    </div>
  )
}

export default UserWidget
