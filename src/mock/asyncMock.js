// Simulación de una base de datos / API.
// En un módulo posterior este archivo se reemplaza por consultas a Firebase,
// pero los componentes seguirán recibiendo los datos de la misma forma.

// Catálogo de ejemplo. Los precios están en pesos argentinos.
// Las imágenes viven en /public/productos y se referencian por su URL,
// igual que se haría con imágenes alojadas en un servidor.
const products = [
  {
    id: '1',
    name: 'Jabón exfoliante de lavanda',
    price: 4500,
    category: 'jabones',
    img: '/productos/jabon.svg',
    stock: 24,
    description: 'Jabón artesanal con lavanda y exfoliante suave para la limpieza diaria.',
  },
  {
    id: '2',
    name: 'Crema corporal de manteca de karité',
    price: 8900,
    category: 'cremas',
    img: '/productos/crema.svg',
    stock: 15,
    description: 'Crema de rápida absorción para nutrir la piel después del baño.',
  },
  {
    id: '3',
    name: 'Aceite corporal de almendras',
    price: 9800,
    category: 'aceites',
    img: '/productos/aceite.svg',
    stock: 12,
    description: 'Aceite liviano de almendras dulces para masajes e hidratación del cuerpo.',
  },
  {
    id: '4',
    name: 'Sérum hidratante facial',
    price: 12500,
    category: 'serum',
    img: '/productos/serum.svg',
    stock: 8,
    description: 'Sérum de textura ligera para hidratar el rostro de día y de noche.',
  },
  {
    id: '5',
    name: 'Bálsamo labial de manteca de cacao',
    price: 3200,
    category: 'balsamo',
    img: '/productos/balsamo.svg',
    stock: 40,
    description: 'Bálsamo en barra que protege y suaviza los labios.',
  },
  {
    id: '6',
    name: 'Shampoo sólido de romero',
    price: 7500,
    category: 'ducha',
    img: '/productos/ducha.svg',
    stock: 18,
    description: 'Shampoo en barra con aroma a romero, sin envase plástico.',
  },
  {
    id: '7',
    name: 'Acondicionador sólido de coco',
    price: 7500,
    category: 'ducha',
    img: '/productos/ducha.svg',
    stock: 3,
    description: 'Acondicionador en barra con aceite de coco para desenredar y suavizar el cabello.',
  },
  {
    id: '8',
    name: 'Vela de soja de lavanda',
    price: 9500,
    category: 'hogar',
    img: '/productos/hogar.svg',
    stock: 14,
    description: 'Vela de cera de soja con aroma a lavanda, en frasco de vidrio.',
  },
  {
    id: '9',
    name: 'Vela de soja de vainilla',
    price: 9500,
    category: 'hogar',
    img: '/productos/hogar.svg',
    stock: 10,
    description: 'Vela de cera de soja con aroma a vainilla, hecha a mano.',
  },
]

// Tiempo de espera que simula la demora de una conexión real (2 segundos)
const RETARDO_MS = 2000

// Devuelve una Promise que se resuelve con el array de productos
// después de RETARDO_MS, como si se estuviera esperando la respuesta de un servidor.
export const getProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Se entrega una copia para que quien consuma los datos no pueda modificar el original
      resolve([...products])
    }, RETARDO_MS)
  })
}
