// Órdenes de compra en Firestore.
// La orden se guarda en la colección "orders" y, en la misma transacción, se descuenta
// el stock de cada producto: o se hacen las dos cosas o ninguna.
import { collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

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
export const armarOrden = ({ comprador, lineas, subtotal, descuento, total }) => ({
  buyer: { name: comprador.name, phone: comprador.phone, email: comprador.email },
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

// Crea la orden y devuelve su id
export const crearOrden = async (datos) => {
  if (!db) throw new Error('Firebase no está configurado')

  const pedido = unidadesPorProducto(datos.lineas)
  const ids = Object.keys(pedido)
  const ordenRef = doc(collection(db, 'orders'))

  await runTransaction(db, async (transaccion) => {
    // 1. Primero todas las lecturas (Firestore lo exige dentro de una transacción)
    const productos = await Promise.all(
      ids.map((id) => transaccion.get(doc(db, 'products', id))),
    )

    // Protección: solo se compra sobre productos cargados por este proyecto (npm run seed
    // los guarda con "img"). Si no, se corta acá, antes de cualquier escritura.
    if (productos.some((p) => p.exists() && !p.data().img)) throw new BaseAjenaError()

    const faltantes = ids.flatMap((id, i) => {
      const disponible = productos[i].exists() ? productos[i].data().stock : 0
      if (disponible >= pedido[id]) return []
      return [{ name: datos.lineas.find((linea) => linea.id === id).name, disponible }]
    })
    if (faltantes.length > 0) throw new SinStockError(faltantes)

    // 2. Después las escrituras: se descuenta el stock y se guarda la orden
    ids.forEach((id, i) => {
      transaccion.update(productos[i].ref, { stock: productos[i].data().stock - pedido[id] })
    })
    transaccion.set(ordenRef, { ...armarOrden(datos), date: serverTimestamp() })
  })

  return ordenRef.id
}
