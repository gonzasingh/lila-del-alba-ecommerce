import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { mensajeErrorAuth } from '../utils/erroresAuth'
import Cargando from './Cargando'
import logoFlor from '../assets/logo-flor.svg'
import './AuthForm.css'

// Un mismo formulario sirve para las dos pantallas: modo="login" (/login) y modo="registro" (/registro)
const TEXTOS = {
  login: {
    titulo: 'Iniciar sesión',
    subtitulo: 'Ingresá con tu cuenta para finalizar tus compras.',
    boton: 'Iniciar sesión',
    botonEnviando: 'Ingresando...',
    pregunta: '¿Todavía no tenés cuenta?',
    otraRuta: '/registro',
    otroEnlace: 'Registrate',
  },
  registro: {
    titulo: 'Crear cuenta',
    subtitulo: 'Registrate con tu email y una contraseña para comprar.',
    boton: 'Crear cuenta',
    botonEnviando: 'Creando tu cuenta...',
    pregunta: '¿Ya tenés una cuenta?',
    otraRuta: '/login',
    otroEnlace: 'Iniciá sesión',
  },
}

// Devuelve un objeto con los mensajes de error de los campos que estén mal
const validar = (modo, { email, password, confirmar }) => {
  const errores = {}
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errores.email = 'Escribí un email válido.'
  if (password.length < 6) errores.password = 'La contraseña debe tener al menos 6 caracteres.'
  if (modo === 'registro' && password !== confirmar) errores.confirmar = 'Las contraseñas no coinciden.'
  return errores
}

function AuthForm({ modo }) {
  const { user, loading, login, register } = useAuth()
  const location = useLocation()
  const textos = TEXTOS[modo]

  const [datos, setDatos] = useState({ email: '', password: '', confirmar: '' })
  const [errores, setErrores] = useState({}) // errores de cada campo (validación local)
  const [errorGeneral, setErrorGeneral] = useState('') // error que devuelve Firebase
  const [enviando, setEnviando] = useState(false)

  // Si lo mandó una ruta protegida (ProtectedRoute), después de ingresar vuelve a esa página
  const destino = location.state?.from ?? '/'
  const aviso = location.state?.aviso

  const handleChange = (evento) => {
    const { name, value } = evento.target
    setDatos((anteriores) => ({ ...anteriores, [name]: value }))
  }

  const handleSubmit = async (evento) => {
    evento.preventDefault()
    setErrorGeneral('')

    const encontrados = validar(modo, datos)
    setErrores(encontrados)
    if (Object.keys(encontrados).length > 0) return

    setEnviando(true)
    try {
      const accion = modo === 'login' ? login : register
      await accion(datos.email.trim(), datos.password)
      // No hace falta navegar acá: al cambiar el usuario, este componente redirige solo (ver abajo)
    } catch (error) {
      setErrorGeneral(mensajeErrorAuth(error))
    } finally {
      setEnviando(false)
    }
  }

  if (loading) return <Cargando mensaje="Verificando tu sesión..." />

  // Con la sesión iniciada no tiene sentido ver este formulario: vuelve a donde quería ir
  if (user) return <Navigate to={destino} replace />

  const campos = [
    { id: 'email', etiqueta: 'Email', type: 'email', autoComplete: 'email' },
    {
      id: 'password',
      etiqueta: 'Contraseña',
      type: 'password',
      autoComplete: modo === 'login' ? 'current-password' : 'new-password',
    },
    ...(modo === 'registro'
      ? [
          {
            id: 'confirmar',
            etiqueta: 'Repetí la contraseña',
            type: 'password',
            autoComplete: 'new-password',
          },
        ]
      : []),
  ]

  return (
    <main className="auth">
      <img className="auth__flor" src={logoFlor} alt="" />
      <h1 className="auth__titulo">{textos.titulo}</h1>
      <p className="auth__subtitulo">{textos.subtitulo}</p>

      {aviso && (
        <p className="auth__aviso" role="status">
          {aviso}
        </p>
      )}

      <form className="auth__formulario" onSubmit={handleSubmit} noValidate>
        {campos.map((campo) => (
          <div key={campo.id} className="auth__campo">
            <label htmlFor={`auth-${campo.id}`}>{campo.etiqueta}</label>
            <input
              id={`auth-${campo.id}`}
              name={campo.id}
              type={campo.type}
              autoComplete={campo.autoComplete}
              value={datos[campo.id]}
              onChange={handleChange}
              aria-invalid={Boolean(errores[campo.id])}
              aria-describedby={errores[campo.id] ? `auth-${campo.id}-error` : undefined}
            />
            {errores[campo.id] && (
              <p className="auth__error-campo" id={`auth-${campo.id}-error`}>
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

        <button type="submit" className="cart__boton cart__boton--principal" disabled={enviando}>
          {enviando ? textos.botonEnviando : textos.boton}
        </button>
      </form>

      <p className="auth__otra">
        {textos.pregunta}{' '}
        {/* Se conserva el estado para que, tras registrarse, también vuelva a donde quería ir */}
        <Link to={textos.otraRuta} state={location.state}>
          {textos.otroEnlace}
        </Link>
      </p>
    </main>
  )
}

export default AuthForm
