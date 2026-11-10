import Item from './Item'
import './ItemList.css'

// ItemList recibe los productos por props y renderiza un Item por cada uno.
// onVerDetalle (opcional) se reenvía a cada Item.
function ItemList({ items, onVerDetalle }) {
  if (items.length === 0) {
    return <p className="item-list__vacio">Todavía no hay productos disponibles.</p>
  }

  return (
    <div className="item-list">
      {items.map((product) => (
        <Item key={product.id} product={product} onVerDetalle={onVerDetalle} />
      ))}
    </div>
  )
}

export default ItemList
