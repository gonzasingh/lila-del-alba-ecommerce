import { useState } from 'react'
import './CheckoutForm.css'

// Campos de una sola línea. El largo máximo coincide con el que aceptan las reglas de Firestore.
const CAMPOS = [
  { id: 'name', etiqueta: 'Nombre y apellido', type: 'text', autoComplete: 'name', max: 120 },
  { id: 'phone', etiqueta: 'Teléfono', type: 'tel', autoComplete: 'tel', max: 40 },
  {
    id: 'address',
    etiqueta: 'Dirección (calle, número, piso y depto.)',
    type: 'text',
    autoComplete: 'street-address',
    max: 200,
  },
  { id: 'city', etiqueta: 'Ciudad', type: 'text', autoComplete: 'address-level2', max: 100 },
]

const MAX_NOTAS = 300

// Devuelve un objeto con los mensajes de error de los campos que estén mal
const validar = ({ name, phone, address, city, notes }) => {
  const errores = {}
  if (name.trim().length < 3) errores.name = 'Escribí tu nombre y apellido.'
  if (phone.replace(/\D/g, '').length < 8) errores.phone = 'Escribí un teléfono con al menos 8 números.'
  if (address.trim().length < 5) errores.address = 'Escribí la dirección de entrega.'
  if (city.trim().length < 2) errores.city = 'Escribí la ciudad.'
  if (notes.length > MAX_NOTAS) errores.notes = `Escribí como máximo ${MAX_NOTAS} caracteres.`
  return errores
}

const DATOS_VACIOS = { name: '', phone: '', address: '', city: '', notes: '' }

// Formulario con los datos de entrega. No guarda nada: entrega los datos a onSubmit.
// Se usa en el checkout (confirmar la compra) y en "Datos de envío" de la cuenta (guardarlos).
//  - datosIniciales: datos con los que arranca el formulario (por ejemplo, los guardados en la cuenta)
//  - email:          email de la cuenta con la que se compra (si se pasa, se muestra; no se edita)
//  - titulo, textoBoton, textoEnviando: textos, según para qué se use
//  - onSubmit:       recibe { name, phone, address, city, notes }
//  - enviando:       true mientras se procesa
//  - error / exito:  mensajes del resultado de la operación
function CheckoutForm({
  datosIniciales,
  email,
  titulo = 'Datos de entrega',
  textoBoton = 'Confirmar compra',
  textoEnviando = 'Generando tu orden...',
  onSubmit,
  enviando,
  error,
  exito,
}) {
  const [datos, setDatos] = useState({ ...DATOS_VACIOS, ...datosIniciales })
  const [errores, setErrores] = useState({})

  const handleChange = (evento) => {
    const { name, value } = evento.target
    setDatos((anteriores) => ({ ...anteriores, [name]: value }))
  }

  const handleSubmit = (evento) => {
    evento.preventDefault()
    const encontrados = validar(datos)
    setErrores(encontrados)
    // La orden no se genera si hay datos faltantes o inválidos
    if (Object.keys(encontrados).length > 0) return

    onSubmit({
      name: datos.name.trim(),
      phone: datos.phone.trim(),
      address: datos.address.trim(),
      city: datos.city.trim(),
      notes: datos.notes.trim(),
    })
  }

  // Mensaje de error de un campo (si lo tiene), vinculado al campo para lectores de pantalla
  const errorDe = (id) =>
    errores[id] && (
      <p className="checkout__error-campo" id={`checkout-${id}-error`}>
        {errores[id]}
      </p>
    )

  const propiedadesAccesibles = (id) => ({
    'aria-invalid': Boolean(errores[id]),
    'aria-describedby': errores[id] ? `checkout-${id}-error` : undefined,
  })

  return (
    <form className="checkout" onSubmit={handleSubmit} noValidate>
      <h2 className="checkout__titulo">{titulo}</h2>

      {email && (
        <p className="checkout__cuenta">
          Comprás con la cuenta <strong>{email}</strong>
        </p>
      )}

      {CAMPOS.map((campo) => (
        <div key={campo.id} className="checkout__campo">
          <label htmlFor={`checkout-${campo.id}`}>{campo.etiqueta}</label>
          <input
            id={`checkout-${campo.id}`}
            name={campo.id}
            type={campo.type}
            autoComplete={campo.autoComplete}
            maxLength={campo.max}
            value={datos[campo.id]}
            onChange={handleChange}
            {...propiedadesAccesibles(campo.id)}
          />
          {errorDe(campo.id)}
        </div>
      ))}

      <div className="checkout__campo">
        <label htmlFor="checkout-notes">Información adicional (opcional)</label>
        <textarea
          id="checkout-notes"
          name="notes"
          rows={3}
          value={datos.notes}
          onChange={handleChange}
          placeholder="Horarios para recibir, entre calles, timbre..."
          {...propiedadesAccesibles('notes')}
        />
        {errorDe('notes')}
      </div>

      {error && (
        <p className="checkout__error" role="alert">
          {error}
        </p>
      )}

      {exito && (
        <p className="checkout__exito" role="status">
          {exito}
        </p>
      )}

      <button type="submit" className="cart__boton cart__boton--principal" disabled={enviando}>
        {enviando ? textoEnviando : textoBoton}
      </button>
    </form>
  )
}

export default CheckoutForm
