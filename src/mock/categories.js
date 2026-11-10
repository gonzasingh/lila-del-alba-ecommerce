// Categorías de la tienda (según la lista de precios de la marca).
// Cada producto guarda en `category` el id de una de estas categorías.
export const CATEGORIAS = [
  { id: 'jabones', nombre: 'Jabones' },
  { id: 'cremas', nombre: 'Cremas' },
  { id: 'aceites', nombre: 'Aceites' },
  { id: 'serum', nombre: 'Sérum' },
  { id: 'balsamo', nombre: 'Bálsamo' },
  { id: 'ducha', nombre: 'Ducha' },
  { id: 'hogar', nombre: 'Hogar' },
]

// Devuelve el nombre para mostrar de una categoría a partir de su id
export const getNombreCategoria = (id) =>
  CATEGORIAS.find((categoria) => categoria.id === id)?.nombre ?? id
