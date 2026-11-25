import './OptionPicker.css'

// Grupo de opciones que se ven como botones y permite elegir UNA sola.
// Por debajo son radios nativos: funcionan con teclado y con lectores de pantalla.
//  - legend:   título del grupo
//  - name:     nombre del grupo de radios (único en la página)
//  - options:  [{ value, label }]
//  - value:    opción elegida ('' si todavía no se eligió)
//  - onChange: recibe el value de la opción tocada
function OptionPicker({ legend, name, options, value, onChange }) {
  return (
    <fieldset className="option-picker">
      <legend className="option-picker__titulo">{legend}</legend>
      <div className="option-picker__opciones">
        {options.map((opcion) => (
          <label key={opcion.value} className="option-picker__opcion">
            <input
              className="option-picker__input"
              type="radio"
              name={name}
              value={opcion.value}
              checked={value === opcion.value}
              onChange={() => onChange(opcion.value)}
            />
            <span className="option-picker__boton">{opcion.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default OptionPicker
