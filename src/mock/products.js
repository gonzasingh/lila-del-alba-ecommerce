// Catálogo de la tienda. Los precios y aromas salen de la lista de precios y de
// la lista de fragancias de Lila del Alba; el stock es de ejemplo.
//
// Propiedades de cada producto:
//   id, name, price, category, img, stock, description   -> se usan en el listado
//   priceX10     precio por unidad comprando un pack de 10 (solo en el detalle)
//   presentation tamaño o contenido                          (solo en el detalle)
//   container    tipo de envase                              (solo en el detalle)
//   features     características                             (solo en el detalle)
//   aromas       aromas disponibles                          (solo en el detalle)
// Los ids son strings: así coinciden con los parámetros de una URL cuando se sumen las rutas.

// ---- Aromas según la lista de fragancias ----
const AROMAS_ESENCIAL = [
  'Bamboo',
  'Lemongrass',
  'Mango & Maracuyá',
  'Guayaba',
  'Frambuesa & Pimienta',
  'Tilo & Lavanda',
  'Verbena & Flores Blancas',
  'Melón & Sandía',
  'Uva & Caramelo',
]

// Aroma que no está disponible en todos los productos de cuidado personal
const AROMAS_CUIDADO_BASE = [
  'Moras & Fresias',
  'Coco & Vainilla',
  'Guayaba',
  'Nikki',
  'Gardenias',
  'Cerezo en flor',
]

// Aceite corporal, shampoo y acondicionador
const AROMAS_ACEITE_SHAMPOO = AROMAS_CUIDADO_BASE
// Jabón: suma Mora roja & Jabuticaba
const AROMAS_JABON = [...AROMAS_CUIDADO_BASE, 'Mora roja & Jabuticaba']
// Crema corporal y body splash: suman Açaí y Mora roja & Jabuticaba
const AROMAS_CREMA_SPLASH = ['Açaí', ...AROMAS_CUIDADO_BASE, 'Mora roja & Jabuticaba']
// Hogar: todas las fragancias sirven para velas, difusores y spray textil
const AROMAS_HOGAR = [
  ...AROMAS_ESENCIAL,
  'Açaí',
  'Moras & Fresias',
  'Coco & Vainilla',
  'Nikki',
  'Gardenias',
  'Cerezo en flor',
  'Mora roja & Jabuticaba',
]

export const products = [
  // ---------- Jabones ----------
  {
    id: '1',
    name: 'Jabón exfoliante masajeador sin aroma',
    price: 2000,
    priceX10: 1800,
    category: 'jabones',
    img: '/productos/jabon-exfoliante.jpg',
    stock: 40,
    description:
      'Jabón exfoliante con forma de masajeador, pensado para limpiar y estimular la piel durante la ducha. Se presenta sin aroma.',
    features: ['Con avena coloidal / carbón activado', 'Sin aroma'],
  },
  {
    id: '2',
    name: 'Jabón exfoliante masajeador con arcilla, sin aroma',
    price: 2500,
    priceX10: 2300,
    category: 'jabones',
    img: '/productos/jabon-exfoliante.jpg',
    stock: 32,
    description:
      'Jabón exfoliante masajeador que suma arcilla a la base de avena o carbón activado. Se presenta sin aroma.',
    features: ['Con avena coloidal / carbón activado', 'Con arcilla blanca / café', 'Sin aroma'],
  },
  {
    id: '3',
    name: 'Jabón exfoliante masajeador con aroma',
    price: 3500,
    priceX10: 3300,
    category: 'jabones',
    img: '/productos/jabon-exfoliante.jpg',
    stock: 28,
    description:
      'Jabón exfoliante con forma de masajeador, con el aroma que elijas de nuestra colección de cuidado personal.',
    features: ['Con avena coloidal / carbón activado', 'Aroma a elección'],
    aromas: AROMAS_JABON,
  },
  {
    id: '4',
    name: 'Jabón exfoliante masajeador con arcilla y aroma',
    price: 4000,
    priceX10: 3800,
    category: 'jabones',
    img: '/productos/jabon-exfoliante.jpg',
    stock: 5,
    description:
      'Nuestro jabón exfoliante más completo: base de avena o carbón activado, arcilla y el aroma que prefieras.',
    features: [
      'Con avena coloidal / carbón activado',
      'Con arcilla blanca / café',
      'Aroma a elección',
    ],
    aromas: AROMAS_JABON,
  },

  // ---------- Cremas ----------
  {
    id: '5',
    name: 'Crema corporal 50 cc',
    price: 4900,
    priceX10: 4700,
    category: 'cremas',
    img: '/productos/crema-corporal.jpg',
    stock: 18,
    description:
      'Crema corporal hidratante en formato chico, ideal para llevar en la cartera. Con el aroma que elijas.',
    presentation: '50 cc',
    features: ['Aroma a elección'],
    aromas: AROMAS_CREMA_SPLASH,
  },
  {
    id: '6',
    name: 'Crema corporal 100 cc',
    price: 5100,
    priceX10: 4900,
    category: 'cremas',
    img: '/productos/crema-corporal.jpg',
    stock: 22,
    description:
      'Crema corporal hidratante en formato de uso diario. Con el aroma que elijas.',
    presentation: '100 cc',
    features: ['Aroma a elección'],
    aromas: AROMAS_CREMA_SPLASH,
  },

  // ---------- Aceites ----------
  {
    id: '7',
    name: 'Aceite corporal sin aroma 50 cc',
    price: 8750,
    priceX10: 8550,
    category: 'aceites',
    img: '/productos/aceite-corporal.jpg',
    stock: 14,
    description:
      'Aceite corporal con almendras, karité, jojoba y vitamina E. Se presenta sin aroma.',
    presentation: '50 cc',
    features: ['Con almendras, karité, jojoba y vitamina E', 'Sin aroma'],
  },
  {
    id: '8',
    name: 'Aceite corporal con aroma 50 cc',
    price: 8950,
    priceX10: 8750,
    category: 'aceites',
    img: '/productos/aceite-corporal.jpg',
    stock: 12,
    description:
      'Aceite corporal con almendras, karité, jojoba y vitamina E, con el aroma que elijas.',
    presentation: '50 cc',
    features: ['Con almendras, karité, jojoba y vitamina E', 'Aroma a elección'],
    aromas: AROMAS_ACEITE_SHAMPOO,
  },
  {
    id: '9',
    name: 'Aceite corporal sin aroma 100 cc',
    price: 15100,
    priceX10: 14900,
    category: 'aceites',
    img: '/productos/aceite-corporal.jpg',
    stock: 9,
    description:
      'Aceite corporal con almendras, karité, jojoba y vitamina E en formato de 100 cc. Se presenta sin aroma.',
    presentation: '100 cc',
    features: ['Con almendras, karité, jojoba y vitamina E', 'Sin aroma'],
  },
  {
    id: '10',
    name: 'Aceite corporal con aroma 100 cc',
    price: 15480,
    priceX10: 15280,
    category: 'aceites',
    img: '/productos/aceite-corporal.jpg',
    stock: 3,
    description:
      'Aceite corporal con almendras, karité, jojoba y vitamina E en formato de 100 cc, con el aroma que elijas.',
    presentation: '100 cc',
    features: ['Con almendras, karité, jojoba y vitamina E', 'Aroma a elección'],
    aromas: AROMAS_ACEITE_SHAMPOO,
  },

  // ---------- Sérum ----------
  {
    id: '11',
    name: 'Sérum hidratante en envase plástico',
    price: 6800,
    priceX10: 6600,
    category: 'serum',
    img: '/productos/serum-hidratante.jpg',
    stock: 16,
    description:
      'Sérum hidratante con ácido hialurónico y niacinamida, en envase plástico con válvula gota a gota.',
    presentation: '30 cc',
    container: 'Plástico con válvula gota a gota',
    features: ['Con ácido hialurónico y niacinamida'],
  },
  {
    id: '12',
    name: 'Sérum hidratante en envase de vidrio',
    price: 8000,
    priceX10: 7800,
    category: 'serum',
    img: '/productos/serum-hidratante.jpg',
    stock: 11,
    description:
      'Sérum hidratante con ácido hialurónico y niacinamida, en envase de vidrio con gotero.',
    presentation: '30 cc',
    container: 'Vidrio con gotero',
    features: ['Con ácido hialurónico y niacinamida'],
  },

  // ---------- Bálsamo labial ----------
  {
    id: '13',
    name: 'Bálsamo labial en envase plástico',
    price: 3500,
    priceX10: 3300,
    category: 'balsamo',
    img: '/productos/balsamo.svg',
    stock: 36,
    description: 'Bálsamo labial en envase plástico, práctico para llevar siempre encima.',
    presentation: '5 cc',
    container: 'Plástico',
    features: ['Opcional con color'],
  },
  {
    id: '14',
    name: 'Bálsamo labial en envase metálico',
    price: 3700,
    priceX10: 3500,
    category: 'balsamo',
    img: '/productos/balsamo-lata.jpg',
    stock: 25,
    description: 'Bálsamo labial en lata metálica, con más contenido para uso frecuente.',
    presentation: '10 cc',
    container: 'Metálico',
    features: ['Opcional con color'],
  },

  // ---------- Ducha cuerpo y cabello ----------
  {
    id: '15',
    name: 'Shampoo sólido',
    price: 7500,
    priceX10: 7300,
    category: 'ducha',
    img: '/productos/shampoo-solido.jpg',
    stock: 20,
    description:
      'Shampoo en barra, sin envase plástico. Disponible para la caída de cabello, para cabello seco o para cabello graso.',
    features: ['Para la caída de cabello / cabello seco / graso'],
    aromas: AROMAS_ACEITE_SHAMPOO,
  },
  {
    id: '16',
    name: 'Acondicionador sólido',
    price: 7500,
    priceX10: 7300,
    category: 'ducha',
    img: '/productos/ducha.svg',
    stock: 2,
    description:
      'Acondicionador en barra, humectante y sin TACC. Complementa al shampoo sólido en la rutina de ducha.',
    features: ['Sin TACC', 'Humectante'],
    aromas: AROMAS_ACEITE_SHAMPOO,
  },
  {
    id: '17',
    name: 'Body splash',
    price: 8000,
    priceX10: 7800,
    category: 'ducha',
    img: '/productos/bodysplash.svg',
    stock: 15,
    description:
      'Body splash para perfumar el cuerpo después de la ducha, con el aroma que elijas.',
    features: ['Aroma a elección'],
    aromas: AROMAS_CREMA_SPLASH,
  },

  // ---------- Hogar ----------
  {
    id: '18',
    name: 'Difusor ambiental 60 ml',
    price: 3000,
    category: 'hogar',
    img: '/productos/hogar-difusor-spray.jpg',
    stock: 30,
    description:
      'Difusor con varillas para perfumar ambientes chicos, con el aroma que elijas.',
    presentation: '60 ml',
    container: 'Plástico ámbar',
    features: ['Aroma a elección'],
    aromas: AROMAS_HOGAR,
  },
  {
    id: '19',
    name: 'Difusor ambiental 125 ml',
    price: 5500,
    category: 'hogar',
    img: '/productos/hogar-difusor-spray.jpg',
    stock: 21,
    description:
      'Difusor con varillas en formato de 125 ml, para perfumar ambientes por más tiempo.',
    presentation: '125 ml',
    container: 'Plástico ámbar',
    features: ['Aroma a elección'],
    aromas: AROMAS_HOGAR,
  },
  {
    id: '20',
    name: 'Difusor ambiental 100 ml en vidrio',
    price: 7500,
    category: 'hogar',
    img: '/productos/hogar-difusor-spray.jpg',
    stock: 13,
    description:
      'Difusor con varillas en envase de vidrio, una opción más decorativa para el living o el dormitorio.',
    presentation: '100 ml',
    container: 'Vidrio',
    features: ['Aroma a elección'],
    aromas: AROMAS_HOGAR,
  },
  {
    id: '21',
    name: 'Difusor para auto 9 ml',
    price: 4800,
    category: 'hogar',
    img: '/productos/difusor-auto.svg',
    stock: 24,
    description: 'Difusor de 9 ml para perfumar el interior del auto, con el aroma que elijas.',
    presentation: '9 ml',
    features: ['Aroma a elección'],
    aromas: AROMAS_HOGAR,
  },
  {
    id: '22',
    name: 'Spray textil 250 ml',
    price: 6500,
    category: 'hogar',
    img: '/productos/hogar-difusor-spray.jpg',
    stock: 17,
    description:
      'Spray para perfumar telas, cortinas, almohadones y ropa de cama, con el aroma que elijas.',
    presentation: '250 ml',
    features: ['Aroma a elección'],
    aromas: AROMAS_HOGAR,
  },
  {
    id: '23',
    name: 'Vela de soja 90 gr',
    price: 6000,
    category: 'hogar',
    img: '/productos/hogar.svg',
    stock: 19,
    description: 'Vela de cera de soja en envase de metal, con el aroma que elijas.',
    presentation: '90 gr',
    container: 'Metal',
    features: ['Cera de soja', 'Aroma a elección'],
    aromas: AROMAS_HOGAR,
  },
]
