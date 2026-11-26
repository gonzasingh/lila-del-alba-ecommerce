// Autenticación con Firebase (email y contraseña).
// Los componentes no usan el SDK directamente: pasan por el AuthContext, que llama a estas funciones.
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth, exigirFirebase } from '../firebase/config'

// Crea la cuenta e inicia la sesión automáticamente. Devuelve el usuario
export const registrarUsuario = async (email, password) => {
  exigirFirebase()
  const credencial = await createUserWithEmailAndPassword(auth, email, password)
  return credencial.user
}

// Inicia sesión con una cuenta existente. Devuelve el usuario
export const iniciarSesion = async (email, password) => {
  exigirFirebase()
  const credencial = await signInWithEmailAndPassword(auth, email, password)
  return credencial.user
}

export const cerrarSesion = async () => {
  exigirFirebase()
  await signOut(auth)
}

// Avisa cada vez que cambia el usuario (al iniciar o cerrar sesión y al recargar la página,
// porque Firebase guarda la sesión en el navegador). Devuelve la función para dejar de escuchar.
// Sin Firebase configurado no hay sesión posible: avisa "sin usuario" una vez.
export const observarSesion = (alCambiar) => {
  if (!auth) {
    alCambiar(null)
    return () => {}
  }
  return onAuthStateChanged(auth, alCambiar, () => alCambiar(null))
}
