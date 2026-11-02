import Item from './Item'
import './ItemList.css'

// ItemList recibe los productos por props y renderiza un Item por cada uno
function ItemList({ items }) {
  if (items.length === 0) {
    return <p className="item-list__vacio">Todavía no hay productos disponibles.</p>
  }

  return (
    <div className="item-list">
      {items.map((product) => (
        <Item key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ItemList
