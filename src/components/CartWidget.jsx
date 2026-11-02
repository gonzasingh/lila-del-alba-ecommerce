import './CartWidget.css'

function CartWidget() {
  // Número hardcodeado por ahora: más adelante vendrá del estado del carrito
  const cantidadItems = 3

  return (
    <button
      type="button"
      className="cart-widget"
      aria-label={`Carrito de compras: ${cantidadItems} productos`}
    >
      <svg
        className="cart-widget__icono"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
        <path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H6" />
      </svg>
      <span className="cart-widget__contador">{cantidadItems}</span>
    </button>
  )
}

export default CartWidget
