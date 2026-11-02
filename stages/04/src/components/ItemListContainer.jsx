import './ItemListContainer.css'

function ItemListContainer({ greeting }) {
  return (
    <main className="item-list-container">
      <h1 className="item-list-container__saludo">{greeting}</h1>
    </main>
  )
}

export default ItemListContainer
