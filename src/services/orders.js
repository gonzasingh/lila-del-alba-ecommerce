// Órdenes de compra en Firestore.
// La orden se guarda con addDoc en la colección "orders", asociada al usuario autenticado,
// y después se descuenta el stock de los productos comprados.
import {
  addDoc,
  collection,
  doc,
  getDoc,
  increment,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { db, exigirFirebase } from '../firebase/config'

// Error propio para avisar qué productos ya no tienen stock suficiente
export class SinStockError extends Error {
  constructor(faltantes) {
    super('No hay stock suficiente')
    this.name = 'SinStockError'
    this.faltantes = faltantes // [{ name, disponible }]
  }
}

// La base es la de otra aplicación (por ejemplo, la del sitio ya publicado): no se escribe en ella
export class BaseAjenaError extends Error {
  constructor() {
    super('La base de datos tiene el formato de otra aplicación')
    this.name = 'BaseAjenaError'
  }
}

// Unidades pedidas de cada producto, sumando sus variedades
const unidadesPorProducto = (lineas) =>
  lineas.reduce(
    (acumulado, linea) => ({
      ...acumulado,
      [linea.id]: (acumulado[linea.id] ?? 0) + linea.quantity,
    }),
    {},
  )

// Datos de la orden. Firestore no acepta valores "undefined": lo que puede faltar va como null
export const armarOrden = ({ usuario, comprador, lineas, subtotal, descuento, total }) => ({
  // Usuario autenticado que hizo la compra (las reglas de Firestore exigen que coincida con la sesión)
  userId: usuario.uid,
  userEmail: usuario.email,
  buyer: {
    name: comprador.name,
    phone: comprador.phone,
    address: comprador.address,
    city: comprador.city,
    notes: comprador.notes,
  },
  items: lineas.map((linea) => ({
    id: linea.id,
    name: linea.name,
    selection: linea.selection,
    quantity: linea.quantity,
    price: linea.price,
    priceX10: linea.priceX10 ?? null,
    packUnits: linea.unidadesPack,
    subtotal: linea.subtotal,
  })),
  subtotal,
  discount: descuento,
  total,
  status: 'generada',
})

// Antes de crear la orden se revisa que cada producto tenga stock para lo que se pidió
const verificarStock = async (pedido, lineas) => {
  const ids = Object.keys(pedido)
  const productos = await Promise.all(ids.map((id) => getDoc(doc(db, 'products', id))))

  // Protección: solo se compra sobre productos cargados por este proyecto (npm run seed
  // los guarda con "img"). Si no, se corta acá, antes de escribir nada.
  if (productos.some((p) => p.exists() && !p.data().img)) throw new BaseAjenaError()

  const faltantes = ids.flatMap((id, i) => {
    const disponible = productos[i].exists() ? productos[i].data().stock : 0
    if (disponible >= pedido[id]) return []
    return [{ name: lineas.find((linea) => linea.id === id).name, disponible }]
  })
  if (faltantes.length > 0) throw new SinStockError(faltantes)
}

// Descuenta del stock lo comprado (todos los productos juntos, en un solo lote).
// La orden ya está guardada: si esto falla no se anula la compra, solo se deja un aviso en la consola.
const descontarStock = async (pedido) => {
  try {
    const lote = writeBatch(db)
    Object.entries(pedido).forEach(([id, unidades]) => {
      lote.update(doc(db, 'products', id), { stock: increment(-unidades) })
    })
    await lote.commit()
  } catch (error) {
    console.warn('La orden se guardó, pero no se pudo descontar el stock:', error.message)
  }
}

// Crea la orden y devuelve su id. Si algo falla lanza el error (el carrito NO se toca acá)
export const crearOrden = async (datos) => {
  exigirFirebase()

  const pedido = unidadesPorProducto(datos.lineas)
  await verificarStock(pedido, datos.lineas)

  const referencia = await addDoc(collection(db, 'orders'), {
    ...armarOrden(datos),
    date: serverTimestamp(),
  })

  await descontarStock(pedido)

  return referencia.id
}
