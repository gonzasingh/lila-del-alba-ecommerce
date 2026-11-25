// Origen de los productos.
//  - Con Firebase configurado (.env.local o variables de Vercel): colección "products" de Firestore.
//  - Sin configurar: el mock local, para que el proyecto se pueda probar sin credenciales.
// Los componentes reciben los datos de la misma forma en los dos casos.
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db, firebaseConfigured } from './firebase'
import * as mock from '../mock/asyncMock'

// El id del producto es el id del documento
const aProducto = (documento) => ({ ...documento.data(), id: documento.id })

// Todos los productos, o solo los de una categoría
export const getProducts = async (categoryId) => {
  if (!firebaseConfigured) return mock.getProducts(categoryId)

  const coleccion = collection(db, 'products')
  const consulta = categoryId ? query(coleccion, where('category', '==', categoryId)) : coleccion
  const respuesta = await getDocs(consulta)

  // Se ordena acá (campo "order") para no necesitar un índice compuesto en Firestore
  return respuesta.docs.map(aProducto).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

// UN producto por su id. Si no existe, la promesa se rechaza (igual que el mock)
export const getProductById = async (productId) => {
  if (!firebaseConfigured) return mock.getProductById(productId)

  const documento = await getDoc(doc(db, 'products', String(productId)))
  if (!documento.exists()) throw new Error(`No existe un producto con id "${productId}"`)

  return aProducto(documento)
}
