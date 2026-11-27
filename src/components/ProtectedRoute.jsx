import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Cargando from './Cargando'

// Protege una ruta: solo deja ver a sus hijos si hay un usuario con sesión iniciada.
// Si no lo hay, redirige al login y le avisa por qué. En el estado de la navegación guarda
// a dónde quería ir, para volver ahí apenas inicie sesión (ver AuthForm).
// Prop aviso: el motivo que se le muestra en el login (depende de la página que quería ver).
function ProtectedRoute({ children, aviso = 'Iniciá sesión para continuar.' }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Mientras Firebase valida la sesión guardada todavía no se sabe si hay usuario:
  // sin esta espera, al recargar /checkout se lo mandaría al login aunque tenga sesión
  if (loading) return <Cargando mensaje="Verificando tu sesión..." />

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname, aviso }}
      />
    )
  }

  return children
}

export default ProtectedRoute
