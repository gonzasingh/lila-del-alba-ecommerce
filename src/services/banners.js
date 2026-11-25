// Servicio de banners (novedades y promociones del carrusel de la home).
//
// Las diapositivas NO están escritas en el código. Se buscan en este orden:
//  1. Con Firebase configurado, en la colección "banners" de Firestore: se editan desde la
//     consola de Firebase y el sitio cambia SIN volver a publicarlo.
//  2. Si no, en el JSON de VITE_BANNERS_URL (URL remota) o en /banners.json (carpeta public).
//  3. Si nada se puede leer, se muestra una diapositiva de respaldo para que el banner nunca quede vacío.
import { collection, getDocs } from 'firebase/firestore'
import { db, firebaseConfigured } from './firebase'

const URL_BANNERS = import.meta.env.VITE_BANNERS_URL || '/banners.json'
const MAX_DIAPOSITIVAS = 10

// Diapositiva de respaldo (si el JSON no se puede leer o no tiene diapositivas válidas)
const RESPALDO = [
  {
    id: 'respaldo',
    title: 'Una colección para cualquier espacio y momento',
    text: 'Velas, difusores, spray textil y cuidado personal. Todas las fragancias son aptas para velas, difusores y spray textil.',
    buttonText: 'Ver productos',
    link: '#catalogo',
    image: '/banners/hero.webp',
    imageAlt: 'Mujer sonriendo con una toalla en el pelo y una crema en la mano',
    imageFit: 'contain',
    theme: 'lila',
  },
]

const TEMAS = ['lila', 'amanecer', 'noche']
const AJUSTES = ['contain', 'cover']

// Solo se aceptan rutas internas ("/category/hogar"), anclas ("#catalogo") o https.
// Así un JSON mal escrito (o manipulado) no puede inyectar, por ejemplo, "javascript:...".
export const esEnlaceSeguro = (valor) =>
  typeof valor === 'string' &&
  (/^\/(?!\/)/.test(valor) || /^#[\w-]+$/.test(valor) || /^https:\/\//i.test(valor))

// Solo rutas internas o https para las imágenes
const esImagenSegura = (valor) =>
  typeof valor === 'string' && (/^\/(?!\/)/.test(valor) || /^https:\/\//i.test(valor))

// ¿La fecha de hoy está dentro del período de la diapositiva? (from / to son opcionales, formato AAAA-MM-DD)
const estaVigente = (slide, hoy = new Date()) => {
  const desde = slide.from ? new Date(`${slide.from}T00:00:00`) : null
  const hasta = slide.to ? new Date(`${slide.to}T23:59:59`) : null
  if (desde && !Number.isNaN(desde.getTime()) && hoy < desde) return false
  if (hasta && !Number.isNaN(hasta.getTime()) && hoy > hasta) return false
  return true
}

// Limpia lo que llega del JSON: descarta lo inválido y completa lo que falta
export const normalizarDiapositivas = (datos) => {
  const lista = Array.isArray(datos) ? datos : datos?.slides
  if (!Array.isArray(lista)) return []

  return lista
    .filter((slide) => slide && typeof slide.title === 'string' && slide.title.trim() !== '')
    .filter((slide) => slide.active !== false && estaVigente(slide))
    .slice(0, MAX_DIAPOSITIVAS)
    .map((slide, indice) => ({
      id: String(slide.id ?? `slide-${indice}`),
      title: slide.title.trim(),
      text: typeof slide.text === 'string' ? slide.text : '',
      buttonText: typeof slide.buttonText === 'string' ? slide.buttonText : '',
      link: esEnlaceSeguro(slide.link) ? slide.link : '',
      image: esImagenSegura(slide.image) ? slide.image : '',
      imageAlt: typeof slide.imageAlt === 'string' ? slide.imageAlt : '',
      imageFit: AJUSTES.includes(slide.imageFit) ? slide.imageFit : 'contain',
      theme: TEMAS.includes(slide.theme) ? slide.theme : 'lila',
    }))
}

// Documentos de la colección "banners", ordenados por el campo "order"
const leerDeFirestore = async () => {
  const respuesta = await getDocs(collection(db, 'banners'))
  return respuesta.docs
    .map((documento) => ({ ...documento.data(), id: documento.id }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

// Devuelve una Promise con las diapositivas vigentes. Nunca se rechaza: ante cualquier error devuelve el respaldo.
export const getBanners = async (signal) => {
  if (firebaseConfigured) {
    try {
      const documentos = await leerDeFirestore()
      // Si la colección está vacía todavía no se cargó nada: se sigue con el JSON
      if (documentos.length > 0) return normalizarDiapositivas(documentos)
    } catch (error) {
      console.warn('No se pudieron leer los banners de Firestore:', error.message)
    }
  }

  try {
    // no-cache: el navegador siempre revalida, así los cambios del JSON se ven al recargar
    const respuesta = await fetch(URL_BANNERS, { signal, cache: 'no-cache' })
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`)

    const diapositivas = normalizarDiapositivas(await respuesta.json())
    // Si el JSON es válido pero no hay nada vigente, no se muestra banner
    return diapositivas
  } catch (error) {
    // Una lectura cancelada (el componente se desmontó) no es un error real
    if (error.name === 'AbortError') throw error
    return RESPALDO
  }
}
