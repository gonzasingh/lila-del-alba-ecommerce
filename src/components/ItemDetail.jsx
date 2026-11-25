import { useState } from 'react'
import { Link } from 'react-router-dom'
import ItemCount from './ItemCount'
import OptionPicker from './OptionPicker'
import { useCart } from '../context/CartContext'
import { getNombreCategoria } from '../mock/categories'
import { formatearPrecio } from '../utils/formatearPrecio'
import { UNIDADES_POR_PACK } from '../utils/precios'
import './ItemDetail.css'

// Todo lo que hay que elegir antes de agregar un producto: la fragancia (si tiene)
// y sus opciones propias (color de la arcilla, tipo de cabello, color del bálsamo)
const armarGrupos = ({ aromas = [], options = [] }) => [
  ...(aromas.length > 0
    ? [{ id: 'fragancia', label: 'Fragancia', title: 'Elegí la fragancia', choices: aromas }]
    : []),
  ...options,
]

// ItemDetail recibe un producto por props y muestra TODA su información.
// No busca datos (eso lo hace ItemDetailContainer): lo único que toma del contexto
// es el carrito, para agregar el producto con las opciones y la cantidad que elija el cliente.
function ItemDetail({ product }) {
  const { addItem, getQuantity } = useCart()

  // Lo elegido en cada grupo: { fragancia: 'Guayaba', arcilla: 'Café' }
  const [elecciones, setElecciones] = useState({})
  // Lo que se acaba de agregar en esta visita (null = todavía no agregó nada)
  const [agregado, setAgregado] = useState(null)

  const {
    id,
    name,
    price,
    priceX10,
    category,
    img,
    stock,
    description,
    presentation,
    container,
    features = [],
  } = product

  const grupos = armarGrupos(product)
  const faltantes = grupos.filter((grupo) => !elecciones[grupo.id])
  const motivoBloqueo =
    faltantes.length > 0
      ? `Para agregar al carrito elegí: ${faltantes.map((g) => g.label.toLowerCase()).join(' y ')}.`
      : ''

  // Lo que todavía se puede agregar: el stock menos lo que ya está en el carrito (todas las variedades)
  const cantidadEnCarrito = getQuantity(id)
  const disponible = stock - cantidadEnCarrito

  const textoStock =
    stock === 0 ? 'Sin stock' : `Stock disponible: ${stock} ${stock === 1 ? 'unidad' : 'unidades'}`

  const elegir = (grupoId, valor) =>
    setElecciones((anteriores) => ({ ...anteriores, [grupoId]: valor }))

  // El cliente confirma la cantidad en ItemCount: se agrega al carrito (contexto)
  const handleAdd = (cantidad) => {
    const selection = grupos.map((grupo) => ({ label: grupo.label, value: elecciones[grupo.id] }))
    addItem({ ...product, selection }, cantidad)
    setAgregado({ cantidad, detalle: selection.map((eleccion) => eleccion.value).join(' · ') })
  }

  // "Seguir comprando": vuelve a mostrar las opciones para agregar otra variedad del producto
  const seguirComprando = () => {
    setAgregado(null)
    setElecciones({})
  }

  return (
    <article className="item-detail">
      <img className="item-detail__imagen" src={img} alt={name} />

      <div className="item-detail__info">
        <p className="item-detail__categoria">{getNombreCategoria(category)}</p>
        <h1 className="item-detail__nombre">{name}</h1>

        <div className="item-detail__precios">
          <p className="item-detail__precio">{formatearPrecio(price)}</p>
          {priceX10 && (
            <p className="item-detail__pack">
              Pack x10 unidades: {formatearPrecio(priceX10)} c/u
            </p>
          )}
        </div>

        {priceX10 && (
          <p className="item-detail__pack-ayuda">
            El precio de pack se aplica en el carrito por cada {UNIDADES_POR_PACK} unidades
            exactamente iguales{grupos.length > 0 && ' (con las mismas opciones elegidas)'}.
          </p>
        )}

        <p className="item-detail__descripcion">{description}</p>

        {(presentation || container) && (
          <dl className="item-detail__ficha">
            {presentation && (
              <>
                <dt>Presentación</dt>
                <dd>{presentation}</dd>
              </>
            )}
            {container && (
              <>
                <dt>Envase</dt>
                <dd>{container}</dd>
              </>
            )}
          </dl>
        )}

        {features.length > 0 && (
          <section>
            <h2 className="item-detail__subtitulo">Características</h2>
            <ul className="item-detail__caracteristicas">
              {features.map((caracteristica) => (
                <li key={caracteristica}>{caracteristica}</li>
              ))}
            </ul>
          </section>
        )}

        {agregado ? (
          // Ya agregó: aviso verde con "Ver carrito" y "Seguir comprando"
          <div className="item-detail__aviso">
            <p className="item-detail__aviso-texto" role="status">
              Agregaste {agregado.cantidad} {agregado.cantidad === 1 ? 'unidad' : 'unidades'}
              {agregado.detalle && ` (${agregado.detalle})`} al carrito.
            </p>
            <div className="item-detail__acciones">
              <Link className="item-detail__terminar" to="/cart">
                Ver carrito
              </Link>
              {disponible > 0 ? (
                <button type="button" className="item-detail__seguir" onClick={seguirComprando}>
                  Seguir comprando
                </button>
              ) : (
                // Ya no queda stock de este producto: se sigue comprando en su categoría
                <Link className="item-detail__seguir" to={`/category/${category}`}>
                  Seguir comprando
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="item-detail__compra">
            {/* Las opciones se eligen antes de agregar al carrito */}
            {disponible > 0 &&
              grupos.map((grupo) => (
                <OptionPicker
                  key={grupo.id}
                  legend={grupo.title}
                  name={grupo.id}
                  options={grupo.choices.map((opcion) => ({ value: opcion, label: opcion }))}
                  value={elecciones[grupo.id] ?? ''}
                  onChange={(valor) => elegir(grupo.id, valor)}
                />
              ))}

            <p className="item-detail__stock">{textoStock}</p>

            {disponible > 0 ? (
              <ItemCount stock={disponible} onAdd={handleAdd} motivoBloqueo={motivoBloqueo} />
            ) : (
              stock > 0 && (
                <p className="item-detail__confirmacion">
                  Ya tenés todo el stock disponible en tu carrito.
                </p>
              )
            )}
            {cantidadEnCarrito > 0 && (
              <p className="item-detail__en-carrito">
                Tenés {cantidadEnCarrito} {cantidadEnCarrito === 1 ? 'unidad' : 'unidades'} de este
                producto en el carrito.{' '}
                <Link className="item-detail__enlace" to="/cart">
                  Ver carrito
                </Link>
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

export default ItemDetail
