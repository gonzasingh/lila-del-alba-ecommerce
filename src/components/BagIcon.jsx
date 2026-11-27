// Ícono de bolsa de compras (el del carrito del Navbar).
//  - filled = false: solo el contorno (bolsa vacía)
//  - filled = true:  el cuerpo de la bolsa se rellena con el mismo color del contorno (bolsa con productos)
// El color lo toma del texto del contenedor (currentColor).
function BagIcon({ filled = false, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Asa */}
      <path d="M9 8V7a3 3 0 0 1 6 0v1" />
      {/* Cuerpo de la bolsa */}
      <path
        d="M4.5 8h15l-1 11.3a1.8 1.8 0 0 1-1.8 1.7H7.3a1.8 1.8 0 0 1-1.8-1.7L4.5 8z"
        fill={filled ? 'currentColor' : 'none'}
      />
    </svg>
  )
}

export default BagIcon
