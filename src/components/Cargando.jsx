import './Cargando.css'

// Indicador de carga que usan los contenedores mientras esperan una promesa
function Cargando({ mensaje = 'Cargando...' }) {
  return (
    <p className="cargando" role="status">
      <span className="cargando__spinner" aria-hidden="true" />
      {mensaje}
    </p>
  )
}

export default Cargando
