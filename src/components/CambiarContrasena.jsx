import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { mensajeErrorAuth } from '../utils/erroresAuth'
import './Cuenta.css'

const CAMPOS = [
  { id: 'actual', etiqueta: 'Contraseña actual', autoComplete: 'current-password' },
  { id: 'nueva', etiqueta: 'Contraseña nueva', autoComplete: 'new-password' },
  { id: 'repetir', etiqueta: 'Repetí la contraseña nueva', autoComplete: 'new-password' },
]

// Devuelve un objeto con los mensajes de error de los campos que estén mal
const validar = ({ actual, nueva, repetir }) => {
  const errores = {}
  if (actual === '') errores.actual = 'Escribí tu contraseña actual.'
  if (nueva.length < 6) errores.nueva = 'La contraseña nueva debe tener al menos 6 caracteres.'
  else if (nueva === actual) errores.nueva = 'La contraseña nueva debe ser distinta de la actual.'
  if (repetir !== nueva) errores.repetir = 'Las contraseñas no coinciden.'
  return errores
}

// Cambio de contraseña (ruta /cuenta/contrasena, protegida por ProtectedRoute).
// Firebase exige confirmar la contraseña actual antes de aceptar una nueva.
function CambiarContrasena() {
  const { user, changePassword } = useAuth()

  const [datos, setDatos] = useState({ actual: '', nueva: '', repetir: '' })
  const [errores, setErrores] = useState({}) // errores de cada campo (validación local)
  const [errorGeneral, setErrorGeneral] = useState('') // error que devuelve Firebase
  const [exito, setExito] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const handleChange = (evento) => {
    const { name, value } = evento.target
    setDatos((anteriores) => ({ ...anteriores, [name]: value }))
  }

  const handleSubmit = async (evento) => {
    evento.preventDefault()
    setErrorGeneral('')
    setExito(false)

    const encontrados = validar(datos)
    setErrores(encontrados)
    if (Object.keys(encontrados).length > 0) return

    setEnviando(true)
    try {
      await changePassword(datos.actual, datos.nueva)
      setDatos({ actual: '', nueva: '', repetir: '' })
      setExito(true)
    } catch (error) {
      // Con una contraseña actual equivocada Firebase responde con un error de credenciales
      setErrorGeneral(
        ['auth/invalid-credential', 'auth/wrong-password'].includes(error.code)
          ? 'La contraseña actual no es correcta.'
          : mensajeErrorAuth(error),
      )
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="auth">
      <h1 className="auth__titulo">Cambiar contraseña</h1>
      <p className="auth__subtitulo">
        Cuenta: <strong>{user.email}</strong>
      </p>

      <form className="auth__formulario" onSubmit={handleSubmit} noValidate>
        {CAMPOS.map((campo) => (
          <div key={campo.id} className="auth__campo">
            <label htmlFor={`contrasena-${campo.id}`}>{campo.etiqueta}</label>
            <input
              id={`contrasena-${campo.id}`}
              name={campo.id}
              type="password"
              autoComplete={campo.autoComplete}
              value={datos[campo.id]}
              onChange={handleChange}
              aria-invalid={Boolean(errores[campo.id])}
              aria-describedby={errores[campo.id] ? `contrasena-${campo.id}-error` : undefined}
            />
            {errores[campo.id] && (
              <p className="auth__error-campo" id={`contrasena-${campo.id}-error`}>
                {errores[campo.id]}
              </p>
            )}
          </div>
        ))}

        {errorGeneral && (
          <p className="auth__error" role="alert">
            {errorGeneral}
          </p>
        )}

        {exito && (
          <p className="auth__exito" role="status">
            Listo: cambiaste tu contraseña.
          </p>
        )}

        <button type="submit" className="cart__boton cart__boton--principal" disabled={enviando}>
          {enviando ? 'Guardando...' : 'Cambiar contraseña'}
        </button>
      </form>

      <p className="auth__otra">
        <Link to="/">Volver a la tienda</Link>
      </p>
    </main>
  )
}

export default CambiarContrasena
