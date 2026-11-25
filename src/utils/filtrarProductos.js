// Búsqueda y orden de la lista de productos (mismo comportamiento que el sitio de la marca).
// Se hace en el navegador sobre los productos ya cargados: Firestore no busca texto libre.

export const ORDENES = [
  { value: 'lista', label: 'Orden de la lista' },
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
]

// Sin tildes y en minúsculas: "Jabón" se encuentra escribiendo "jabon"
const normalizar = (texto = '') =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

// Devuelve un array NUEVO: los productos cuyo nombre, descripción o presentación (el tamaño,
// por ejemplo "30 cc") contienen el texto, en el orden pedido
export const filtrarYOrdenar = (productos, { texto = '', orden = 'lista' } = {}) => {
  const buscado = normalizar(texto.trim())

  const encontrados = productos.filter(({ name, description, presentation }) =>
    // Cada campo por separado, para que la búsqueda no "salte" de uno a otro
    [name, description, presentation].some((campo) => normalizar(campo ?? '').includes(buscado)),
  )

  if (orden === 'precio-asc') return encontrados.sort((a, b) => a.price - b.price)
  if (orden === 'precio-desc') return encontrados.sort((a, b) => b.price - a.price)
  return encontrados
}
