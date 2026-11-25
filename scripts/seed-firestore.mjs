// Carga en Firestore los productos (src/mock/products.js) y los banners (public/banners.json).
//
//   npm run seed              carga los datos si la colección "products" está vacía
//   npm run seed -- --force   reemplaza lo que haya (¡vuelve el stock a los valores del archivo!)
//
// Necesita .env.local con los datos del proyecto y reglas que permitan escribir mientras se ejecuta.
import { readFile } from 'node:fs/promises'
import { initializeApp } from 'firebase/app'
import {
  collection,
  doc,
  getDocsFromServer,
  getFirestore,
  limit,
  query,
  terminate,
  writeBatch,
} from 'firebase/firestore'
import { products } from '../src/mock/products.js'

const config = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

if (!config.apiKey || !config.projectId || !config.appId) {
  console.error('Faltan datos de Firebase en .env.local (ver .env.example).')
  process.exit(1)
}

const db = getFirestore(initializeApp(config))
const forzar = process.argv.includes('--force')

try {
  const existentes = await getDocsFromServer(query(collection(db, 'products'), limit(1)))

  if (!existentes.empty && !forzar) {
    console.log(`El proyecto "${config.projectId}" ya tiene productos. No se cambió nada.`)
    console.log('Para reemplazarlos (y restablecer el stock): npm run seed -- --force')
  } else {
    const { slides } = JSON.parse(
      await readFile(new URL('../public/banners.json', import.meta.url), 'utf8'),
    )

    // Todo en un solo lote: o se carga completo o no se carga nada
    const lote = writeBatch(db)
    products.forEach(({ id, ...datos }) => {
      lote.set(doc(db, 'products', id), { ...datos, order: Number(id) })
    })
    slides.forEach(({ id, ...datos }, posicion) => {
      lote.set(doc(db, 'banners', id), { ...datos, order: posicion })
    })
    await lote.commit()

    console.log(`Listo en "${config.projectId}": ${products.length} productos y ${slides.length} banners.`)
  }
} catch (error) {
  console.error('No se pudieron cargar los datos:', error.code ?? '', error.message)
  process.exitCode = 1
} finally {
  await terminate(db)
}
