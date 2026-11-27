// Datos propios de cada usuario, en la colección "users" de Firestore (un documento por usuario,
// con el uid de Authentication como id). Hoy guarda los datos de envío: { shipping: {...} }.
// Las reglas de Firestore solo dejan leer y escribir cada documento a su dueño.
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db, exigirFirebase } from '../firebase/config'

// Datos de envío guardados por el usuario, o null si todavía no cargó ninguno
export const obtenerDatosEnvio = async (uid) => {
  exigirFirebase()
  const documento = await getDoc(doc(db, 'users', uid))
  return documento.exists() ? (documento.data().shipping ?? null) : null
}

// Guarda (o reemplaza) los datos de envío: { name, phone, address, city, notes }
export const guardarDatosEnvio = async (uid, datos) => {
  exigirFirebase()
  await setDoc(
    doc(db, 'users', uid),
    { shipping: datos, updatedAt: serverTimestamp() },
    { merge: true },
  )
}
