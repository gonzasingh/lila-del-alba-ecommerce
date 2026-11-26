// Catálogo de productos: se lee de la colección "products" de Cloud Firestore.
// Los componentes reciben los datos ya adaptados (ver aProducto) y manejan los estados de
// carga y de error; acá solo se consulta.
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db, exigirFirebase } from '../firebase/config'

// La base puede tener dos formatos:
//  - el de este proyecto (npm run seed): "img" y opciones { id, label, title, choices }
//  - el del sitio ya publicado: "image" y opciones { label, values }
// Acá se convierte todo al formato que usan los componentes (la base no se modifica).

// Foto por categoría para los productos que no tienen una propia en la base
const FOTOS_CATEGORIA = {
  hogar: '/productos/hogar.webp',
  cremas: '/productos/cremas.webp',
  aceites: '/productos/aceites.webp',
  ducha: '/productos/shampoo-solido.webp',
}

const TITULOS_OPCION = {
  Fragancia: 'Elegí la fragancia',
  Arcilla: 'Elegí el color de la arcilla',
  'Tipo de cabello': 'Elegí el tipo de cabello',
  Color: '¿Con o sin color?',
}

const resolverImagen = ({ img, image, category }) => {
  const valor = img || image || ''
  // Foto guardada en la base, URL https o archivo de este proyecto
  if (/^(data:image\/|https:\/\/|\/productos\/)/.test(valor)) return valor
  // Rutas "/img/..." del otro sitio: esos archivos no existen acá
  return FOTOS_CATEGORIA[category] ?? '/favicon.png'
}

const adaptarOpcion = (opcion) => {
  if (opcion.choices) return opcion
  return {
    id: opcion.label.toLowerCase().replace(/\s+/g, '-'),
    label: opcion.label,
    title: TITULOS_OPCION[opcion.label] ?? `Elegí: ${opcion.label.toLowerCase()}`,
    choices: opcion.values ?? [],
  }
}

// El id del producto es el id del documento
const aProducto = (documento) => {
  // Solo se toman los campos que la tienda usa (la base puede tener otros, como el costo)
  const datos = documento.data()
  const { name, price, priceX10, category, stock, description, order } = datos
  const { presentation, container, features, aromas } = datos

  return {
    id: documento.id,
    name,
    price,
    priceX10,
    category,
    stock,
    description,
    order,
    presentation,
    container,
    features,
    aromas,
    img: resolverImagen(datos),
    // Una opción sin valores no se podría elegir y bloquearía la compra: se descarta
    options: (datos.options ?? []).map(adaptarOpcion).filter((o) => o.choices.length > 0),
  }
}

// Todos los productos, o solo los de una categoría (el filtro lo hace Firestore con where)
export const getProducts = async (categoryId) => {
  exigirFirebase()

  const coleccion = collection(db, 'products')
  const consulta = categoryId ? query(coleccion, where('category', '==', categoryId)) : coleccion
  const respuesta = await getDocs(consulta)

  // Se ordena acá (campo "order") para no necesitar un índice compuesto en Firestore
  return respuesta.docs.map(aProducto).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

// UN producto por su id (doc + getDoc). Si no existe, la promesa se rechaza
export const getProductById = async (productId) => {
  exigirFirebase()

  const documento = await getDoc(doc(db, 'products', String(productId)))
  if (!documento.exists()) {
    throw Object.assign(new Error(`No existe un producto con id "${productId}"`), {
      code: 'app/producto-inexistente',
    })
  }

  return aProducto(documento)
}
