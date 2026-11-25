import { useState } from 'react'
import './CheckoutForm.css'

const CAMPOS = [
  { id: 'name', etiqueta: 'Nombre y apellido', type: 'text', autoComplete: 'name' },
  { id: 'phone', etiqueta: 'Teléfono', type: 'tel', autoComplete: 'tel' },
  { id: 'email', etiqueta: 'Email', type: 'email', autoComplete: 'email' },
  { id: 'emailConfirm', etiqueta: 'Repetí tu email', type: 'email', autoComplete: 'email' },
]

// Devuelve un objeto con los mensajes de error de los campos que estén mal
const validar = ({ name, phone, email, emailConfirm }) => {
  const errores = {}
  if (name.trim().length < 3) errores.name = 'Escribí tu nombre y apellido.'
  if (phone.replace(/\D/g, '').length < 8) errores.phone = 'Escribí un teléfono con al menos 8 números.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errores.email = 'Escribí un email válido.'
  else if (email.trim().toLowerCase() !== emailConfirm.trim().toLowerCase()) {
    errores.emailConfirm = 'Los emails no coinciden.'
  }
  return errores
}

// Formulario con los datos del comprador. No guarda nada: entrega los datos a onSubmit.
//  - onSubmit: recibe { name, phone, email }
//  - onCancel: cierra el formulario
//  - enviando: true mientras se genera la orden
//  - error:    mensaje si la orden no se pudo generar
function CheckoutForm({ onSubmit, onCancel, enviando, error }) {
  const [datos, setDatos] = useState({ name: '', phone: '', email: '', emailConfirm: '' })
  const [errores, setErrores] = useState({})

  const handleChange = (evento) => {
    const { name, value } = evento.target
    setDatos((anteriores) => ({ ...anteriores, [name]: value }))
  }

  const handleSubmit = (evento) => {
    evento.preventDefault()
    const encontrados = validar(datos)
    setErrores(encontrados)
    if (Object.keys(encontrados).length > 0) return

    onSubmit({ name: datos.name.trim(), phone: datos.phone.trim(), email: datos.email.trim() })
  }

  return (
    <form className="checkout" onSubmit={handleSubmit} noValidate>
      <h3 className="checkout__titulo">Tus datos</h3>

      {CAMPOS.map((campo) => (
        <div key={campo.id} className="checkout__campo">
          <label htmlFor={`checkout-${campo.id}`}>{campo.etiqueta}</label>
          <input
            id={`checkout-${campo.id}`}
            name={campo.id}
            type={campo.type}
            autoComplete={campo.autoComplete}
            value={datos[campo.id]}
            onChange={handleChange}
            aria-invalid={Boolean(errores[campo.id])}
            aria-describedby={errores[campo.id] ? `checkout-${campo.id}-error` : undefined}
          />
          {errores[campo.id] && (
            <p className="checkout__error-campo" id={`checkout-${campo.id}-error`}>
              {errores[campo.id]}
            </p>
          )}
        </div>
      ))}

      {error && (
        <p className="checkout__error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="cart__boton cart__boton--principal" disabled={enviando}>
        {enviando ? 'Generando tu orden...' : 'Confirmar compra'}
      </button>
      <button type="button" className="checkout__cancelar" onClick={onCancel} disabled={enviando}>
        Cancelar
      </button>
    </form>
  )
}

export default CheckoutForm
