// Conexión con Firebase: es el ÚNICO lugar donde se inicializa.
// Exporta `db` (Cloud Firestore) y `auth` (Firebase Authentication).
//
// Los datos de la configuración vienen de variables de entorno (archivo .env, que NO se sube a GitHub;
// ver .env.example). En Vercel se cargan en Settings → Environment Variables.
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
)

const app = firebaseConfigured ? initializeApp(firebaseConfig) : null

export const db = app ? getFirestore(app) : null
export const auth = app ? getAuth(app) : null

// Los servicios llaman a esta función antes de usar Firebase: si faltan las variables de entorno
// la operación falla con un error claro (que la interfaz muestra) y no con un fallo confuso del SDK.
export const exigirFirebase = () => {
  if (!firebaseConfigured) {
    throw Object.assign(
      new Error('Firebase no está configurado: completá el archivo .env (ver .env.example).'),
      { code: 'app/firebase-no-configurado' },
    )
  }
}
