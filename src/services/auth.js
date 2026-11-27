// Autenticación con Firebase (email y contraseña).
// Los componentes no usan el SDK directamente: pasan por el AuthContext, que llama a estas funciones.
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
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

// Cambia la contraseña del usuario con la sesión iniciada. Firebase exige una sesión "reciente"
// para esta operación, así que primero se confirma la contraseña actual (reautenticación).
export const cambiarContrasena = async (contrasenaActual, contrasenaNueva) => {
  exigirFirebase()
  const usuario = auth.currentUser
  if (!usuario) throw Object.assign(new Error('No hay sesión iniciada'), { code: 'app/sin-sesion' })

  await reauthenticateWithCredential(usuario, EmailAuthProvider.credential(usuario.email, contrasenaActual))
  await updatePassword(usuario, contrasenaNueva)
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
