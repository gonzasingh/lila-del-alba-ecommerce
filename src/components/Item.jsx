import './Item.css'

// Formatea el precio como pesos argentinos, por ejemplo $ 4.500
const formatearPrecio = (valor) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(valor)

// Aviso de stock: solo se muestra cuando quedan pocas unidades
const textoStock = (stock) => {
  if (stock === 0) return 'Sin stock'
  if (stock === 1) return '¡Última unidad!'
  if (stock <= 5) return `¡Últimas ${stock} unidades!`
  return null
}

// Item solo se ocupa de mostrar la card de un producto que recibe por props
function Item({ product }) {
  const { name, price, img, description, stock } = product
  const avisoStock = textoStock(stock)

  return (
    <article className="item">
      <img className="item__imagen" src={img} alt={name} loading="lazy" />
      <div className="item__cuerpo">
        <h2 className="item__nombre">{name}</h2>
        <p className="item__descripcion">{description}</p>
        <div className="item__pie">
          <p className="item__precio">{formatearPrecio(price)}</p>
          {avisoStock && <p className="item__stock">{avisoStock}</p>}
        </div>
      </div>
    </article>
  )
}

export default Item
