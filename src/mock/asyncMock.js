// Simulación de una base de datos / API.
// En un módulo posterior este archivo se reemplaza por consultas a Firebase,
// pero los componentes seguirán recibiendo los datos de la misma forma.
import { products } from './products'

// Tiempos de espera que simulan la demora de una conexión real
const RETARDO_LISTADO_MS = 2000
const RETARDO_DETALLE_MS = 1000

// Devuelve una Promise que se resuelve con el array de productos, no recomiendan hardcodear los datos, pero para este ejemplo está bien. Se resuelve
// después de RETARDO_LISTADO_MS, como si se estuviera esperando la respuesta de un servidor.
// Si recibe un categoryId, solo devuelve los productos de esa categoría.
export const getProducts = (categoryId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lista = categoryId
        ? products.filter((product) => product.category === categoryId)
        : products

      // Se entrega una copia para que quien consuma los datos no pueda modificar el original
      resolve([...lista])
    }, RETARDO_LISTADO_MS)
  })
}

// Devuelve una Promise que se resuelve con UN producto, buscado por su id.
// Si ningún producto tiene ese id, la Promise se rechaza con un error.
export const getProductById = (productId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Se comparan como texto para que funcione igual con '3' (por ejemplo, desde una URL) que con 3
      const product = products.find((item) => String(item.id) === String(productId))

      if (product) {
        resolve({ ...product })
      } else {
        reject(new Error(`No existe un producto con id "${productId}"`))
      }
    }, RETARDO_DETALLE_MS)
  })
}
