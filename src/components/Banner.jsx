import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBanners } from '../services/banners'
import './Banner.css'

const INTERVALO_MS = 6000 // tiempo que se ve cada diapositiva
const UMBRAL_DESLIZAR_PX = 50 // cuánto hay que deslizar el dedo para cambiar de diapositiva

// El link de cada diapositiva puede ser una ruta interna (Link, sin recargar),
// un ancla de la misma página ("#catalogo") o una URL externa https (pestaña nueva).
function EnlaceBanner({ href, className, children }) {
  if (href.startsWith('/')) {
    return (
      <Link className={className} to={href}>
        {children}
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return (
      <a className={className} href={href}>
        {children}
      </a>
    )
  }

  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only"> (se abre en una pestaña nueva)</span>
    </a>
  )
}

// Carrusel de novedades y promociones. Las diapositivas vienen de un JSON editable (ver src/services/banners.js),
// por lo que se pueden cambiar, agregar o quitar sin tocar el código.
function Banner() {
  const [slides, setSlides] = useState(null) // null mientras se cargan
  const [indice, setIndice] = useState(0)
  // Quien prefiere menos movimiento empieza con el avance automático en pausa
  const [pausado, setPausado] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  // Pausa temporal mientras el mouse está encima o hay un elemento del carrusel con foco
  const [interactuando, setInteractuando] = useState(false)
  const inicioX = useRef(null)

  useEffect(() => {
    const controlador = new AbortController()

    getBanners(controlador.signal)
      .then(setSlides)
      .catch((error) => {
        if (error.name !== 'AbortError') setSlides([])
      })

    return () => controlador.abort()
  }, [])

  const total = slides?.length ?? 0

  // Avance automático: un temporizador que se reinicia cada vez que cambia la diapositiva
  useEffect(() => {
    if (total < 2 || pausado || interactuando) return

    const temporizador = setTimeout(() => setIndice((actual) => (actual + 1) % total), INTERVALO_MS)
    return () => clearTimeout(temporizador)
  }, [indice, total, pausado, interactuando])

  const siguiente = () => setIndice((actual) => (actual + 1) % total)
  const anterior = () => setIndice((actual) => (actual - 1 + total) % total)

  // Deslizar con el dedo (o arrastrar con el mouse) cambia de diapositiva
  const handlePointerDown = (evento) => {
    inicioX.current = evento.clientX
  }

  const handlePointerUp = (evento) => {
    if (inicioX.current === null) return
    const desplazamiento = evento.clientX - inicioX.current
    inicioX.current = null

    if (Math.abs(desplazamiento) > UMBRAL_DESLIZAR_PX) {
      if (desplazamiento < 0) siguiente()
      else anterior()
    }
  }

  const handleKeyDown = (evento) => {
    if (total < 2) return
    if (evento.key === 'ArrowRight') siguiente()
    if (evento.key === 'ArrowLeft') anterior()
  }

  // Mientras carga se reserva el espacio para que la página no "salte"
  if (slides === null) return <div className="banner banner--cargando" aria-hidden="true" />

  // Sin diapositivas vigentes no se muestra el banner
  if (total === 0) return null

  const reproduciendo = !pausado && !interactuando

  return (
    <section
      className="banner"
      aria-roledescription="carousel"
      aria-label="Novedades y promociones"
      onKeyDown={handleKeyDown}
      onPointerEnter={(evento) => evento.pointerType === 'mouse' && setInteractuando(true)}
      onPointerLeave={() => setInteractuando(false)}
      onFocus={() => setInteractuando(true)}
      onBlur={(evento) => {
        if (!evento.currentTarget.contains(evento.relatedTarget)) setInteractuando(false)
      }}
    >
      {/* Todas las diapositivas ocupan la misma celda: el alto es el de la más alta y no hay saltos al cambiar */}
      <div
        className="banner__slides"
        aria-live={reproduciendo ? 'off' : 'polite'}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => (inicioX.current = null)}
      >
        {slides.map((slide, posicion) => {
          const activa = posicion === indice
          const clases = [
            'banner__slide',
            `banner__slide--${slide.theme}`,
            slide.image && slide.imageFit === 'cover' ? 'banner__slide--foto' : '',
            slide.image ? '' : 'banner__slide--solo-texto',
            activa ? 'banner__slide--activa' : '',
          ]

          return (
            <div
              key={slide.id}
              className={clases.filter(Boolean).join(' ')}
              role="group"
              aria-roledescription="slide"
              aria-label={`${posicion + 1} de ${total}`}
              inert={!activa}
            >
              <div className="banner__texto">
                <h2 className="banner__titulo">{slide.title}</h2>
                {slide.text && <p className="banner__descripcion">{slide.text}</p>}
                {slide.buttonText && slide.link && (
                  <EnlaceBanner className="banner__boton" href={slide.link}>
                    {slide.buttonText}
                  </EnlaceBanner>
                )}
              </div>

              {slide.image && (
                <img
                  className="banner__imagen"
                  src={slide.image}
                  alt={slide.imageAlt}
                  loading={posicion === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable="false"
                />
              )}
            </div>
          )
        })}
      </div>

      {total > 1 && (
        <div className="banner__controles">
          <button
            type="button"
            className="banner__flecha"
            onClick={anterior}
            aria-label="Diapositiva anterior"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>

          <div className="banner__puntos" role="group" aria-label="Elegir diapositiva">
            {slides.map((slide, posicion) => (
              <button
                key={slide.id}
                type="button"
                className="banner__punto"
                onClick={() => setIndice(posicion)}
                aria-label={`Ir a la diapositiva ${posicion + 1}`}
                aria-current={posicion === indice}
              />
            ))}
          </div>

          <button
            type="button"
            className="banner__flecha"
            onClick={siguiente}
            aria-label="Diapositiva siguiente"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            type="button"
            className="banner__flecha banner__pausa"
            onClick={() => setPausado((actual) => !actual)}
            aria-label={pausado ? 'Reanudar el avance automático' : 'Pausar el avance automático'}
          >
            {pausado ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path className="banner__relleno" d="M8 5l11 7-11 7z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path className="banner__relleno" d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
              </svg>
            )}
          </button>
        </div>
      )}
    </section>
  )
}

export default Banner
