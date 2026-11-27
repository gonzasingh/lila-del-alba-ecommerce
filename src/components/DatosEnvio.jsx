import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CheckoutForm from './CheckoutForm'
import Cargando from './Cargando'
import { useAuth } from '../context/AuthContext'
import { guardarDatosEnvio, obtenerDatosEnvio } from '../services/users'
import './Cuenta.css'

// Datos de envío de la cuenta (ruta /cuenta/envio, protegida por ProtectedRoute).
// Se guardan en Firestore (colección "users") y el checkout los usa para completar el formulario.
function DatosEnvio() {
  const { user } = useAuth()

  const [datosGuardados, setDatosGuardados] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [errorGuardar, setErrorGuardar] = useState('')
  const [exito, setExito] = useState('')

  // Al abrir la página se leen los datos que el usuario ya había guardado (si los hay)
  useEffect(() => {
    let activo = true // evita actualizar el estado si se sale de la página antes de que llegue la respuesta

    obtenerDatosEnvio(user.uid)
      .then((datos) => {
        if (activo) setDatosGuardados(datos)
      })
      .catch((error) => {
        console.error('No se pudieron leer los datos de envío:', error)
        if (activo) setErrorCarga(true)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [user.uid])

  const guardar = async (datos) => {
    setErrorGuardar('')
    setExito('')
    setGuardando(true)
    try {
      await guardarDatosEnvio(user.uid, datos)
      setExito('Guardamos tus datos de envío. Los vas a ver completados cuando finalices una compra.')
    } catch (error) {
      console.error('No se pudieron guardar los datos de envío:', error)
      setErrorGuardar(
        error.code === 'permission-denied'
          ? 'No tenés permiso para guardar tus datos. Si el problema sigue, avisanos.'
          : 'No pudimos guardar tus datos. Revisá tu conexión e intentá de nuevo.',
      )
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) return <Cargando mensaje="Cargando tus datos..." />

  return (
    <main className="cuenta">
      <h1 className="cuenta__titulo">Datos de envío</h1>
      <p className="cuenta__subtitulo">
        Guardalos una vez y los usamos para completar tus próximas compras.
      </p>

      {errorCarga && (
        <p className="cuenta__aviso" role="status">
          No pudimos cargar tus datos guardados. Igual podés completar el formulario y guardarlos.
        </p>
      )}

      <section className="cuenta__bloque">
        <CheckoutForm
          datosIniciales={datosGuardados}
          titulo="Tu dirección de entrega"
          textoBoton="Guardar datos"
          textoEnviando="Guardando..."
          onSubmit={guardar}
          enviando={guardando}
          error={errorGuardar}
          exito={exito}
        />
      </section>

      <Link className="cuenta__volver" to="/">
        Volver a la tienda
      </Link>
    </main>
  )
}

export default DatosEnvio
