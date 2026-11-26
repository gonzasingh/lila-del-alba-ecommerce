// Carga inicial de Firestore: sube los productos (scripts/data/products.js) y los banners (public/banners.json).
// Es un script que se corre una sola vez desde la terminal: la tienda NO lee los productos de este archivo,
// los lee de Firestore.
//
//   npm run seed              carga los datos si la colección "products" está vacía
//   npm run seed -- --force   reemplaza lo que haya (¡vuelve el stock a los valores del archivo!)
//
// SOLO para un proyecto de Firebase propio de esta tienda: si encuentra un catálogo de otra
// aplicación no cambia nada. Lee los datos de .env / .env.local (igual que la app) y necesita
// reglas que permitan escribir mientras se ejecuta.
import { readFile } from 'node:fs/promises'
import { initializeApp } from 'firebase/app'
import {
  collection,
  doc,
  getDocsFromServer,
  getFirestore,
  terminate,
  writeBatch,
} from 'firebase/firestore'
import { loadEnv } from 'vite'
import { products } from './data/products.js'

const env = loadEnv('development', process.cwd(), 'VITE_')

const config = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
}

if (!config.apiKey || !config.projectId || !config.appId) {
  console.error('Faltan datos de Firebase en .env o .env.local (ver .env.example).')
  process.exit(1)
}

const db = getFirestore(initializeApp(config))
const forzar = process.argv.includes('--force')

try {
  const existentes = await getDocsFromServer(collection(db, 'products'))
  // Los productos de este proyecto tienen id numérico; otros ids son de otra aplicación
  const ajenos = existentes.docs.filter((documento) => !/^\d+$/.test(documento.id))

  if (ajenos.length > 0) {
    console.error(
      `El proyecto "${config.projectId}" ya tiene un catálogo de otra aplicación (${ajenos.length} productos). No se cambió nada.`,
    )
    console.error('Usá un proyecto de Firebase nuevo para esta tienda.')
    process.exitCode = 1
  } else if (!existentes.empty && !forzar) {
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
