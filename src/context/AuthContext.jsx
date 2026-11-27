import { createContext, useContext, useEffect, useState } from 'react'
import {
  cambiarContrasena,
  cerrarSesion,
  iniciarSesion,
  observarSesion,
  registrarUsuario,
} from '../services/auth'

// Contexto de autenticación: el usuario vive en el AuthProvider y cualquier componente
// puede leerlo con useAuth(). (Igual que CartContext, se juntan a propósito el contexto,
// el Provider y el hook: forman una sola pieza.)
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null)

// Custom hook: devuelve el valor del contexto y avisa si se usa fuera del Provider
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === null) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }

  return context
}

// Valor del contexto:
//   user      usuario de Firebase con la sesión iniciada (null si no hay ninguna)
//   loading   true mientras Firebase valida la sesión guardada (al abrir o recargar la página)
//   register  (email, password) crea la cuenta e inicia sesión
//   login     (email, password) inicia sesión con una cuenta existente
//   logout    cierra la sesión
//   changePassword  (contraseñaActual, contraseñaNueva) cambia la contraseña
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // onAuthStateChanged mantiene el estado sincronizado con Firebase: avisa al cargar la página
  // (con la sesión guardada, si hay) y cada vez que se inicia o se cierra sesión.
  // Al cerrar sesión llega null, así que la interfaz nunca queda mostrando al usuario anterior.
  useEffect(() => {
    const dejarDeEscuchar = observarSesion((usuario) => {
      setUser(usuario)
      setLoading(false)
    })

    return dejarDeEscuchar
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register: registrarUsuario,
        login: iniciarSesion,
        logout: cerrarSesion,
        changePassword: cambiarContrasena,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
