import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './UserWidget.css'

// Cuenta en el Navbar:
//  - sin sesión: un círculo con el ícono de persona que lleva a /login
//  - con sesión: un círculo con la inicial del email, que abre el menú de la cuenta
// Prop: onAbrir (se avisa al Navbar para que cierre el menú de categorías del celular).
function UserWidget({ onAbrir }) {
  const { user, loading } = useAuth()

  // Mientras se valida la sesión guardada no se muestra nada, para que no parpadee el ícono de ingreso
  if (loading) return null

  if (!user) {
    return (
      <Link className="user-widget__circulo" to="/login" aria-label="Iniciar sesión">
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
      </Link>
    )
  }

  // Es un componente aparte para que el menú vuelva a empezar cerrado cada vez que se inicia sesión
  return <CuentaMenu user={user} onAbrir={onAbrir} />
}

function CuentaMenu({ user, onAbrir }) {
  const { logout } = useAuth()
  const [abierto, setAbierto] = useState(false)
  const [error, setError] = useState(false)
  const raizRef = useRef(null)
  const botonRef = useRef(null)

  const cerrar = () => setAbierto(false)

  // Con el menú abierto: Escape o un toque fuera de él lo cierran
  useEffect(() => {
    if (!abierto) return

    const handleKeyDown = (evento) => {
      if (evento.key === 'Escape') {
        setAbierto(false)
        botonRef.current?.focus() // el foco vuelve al botón que abrió el menú
      }
    }

    const handlePointerDown = (evento) => {
      if (!raizRef.current?.contains(evento.target)) setAbierto(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [abierto])

  const alternar = () => {
    setError(false)
    if (!abierto) onAbrir?.()
    setAbierto(!abierto)
  }

  const cerrarSesion = async () => {
    setError(false)
    try {
      // onAuthStateChanged limpia el usuario del contexto: el círculo vuelve a ser el ícono de ingreso
      await logout()
      cerrar()
    } catch (e) {
      console.error('No se pudo cerrar la sesión:', e)
      setError(true)
    }
  }

  return (
    <div className="user-widget" ref={raizRef}>
      <button
        ref={botonRef}
        type="button"
        className="user-widget__circulo user-widget__circulo--sesion"
        aria-expanded={abierto}
        aria-controls="menu-cuenta"
        aria-label={`Menú de la cuenta de ${user.email}`}
        title={user.email}
        onClick={alternar}
      >
        {/* Inicial del email, en mayúscula */}
        {user.email.charAt(0).toUpperCase()}
      </button>

      {abierto && (
        <div id="menu-cuenta" className="user-widget__menu">
          <p className="user-widget__menu-email">
            <span>Sesión iniciada como</span>
            <strong>{user.email}</strong>
          </p>

          <Link className="user-widget__opcion" to="/cuenta/envio" onClick={cerrar}>
            Datos de envío
          </Link>
          <Link className="user-widget__opcion" to="/cuenta/contrasena" onClick={cerrar}>
            Cambiar contraseña
          </Link>
          <button
            type="button"
            className="user-widget__opcion user-widget__opcion--salir"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>

          {error && (
            <p className="user-widget__error" role="alert">
              No pudimos cerrar la sesión. Intentá de nuevo.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default UserWidget
