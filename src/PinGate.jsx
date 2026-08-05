import { useState } from 'react'

const APP_PIN = import.meta.env.VITE_APP_PIN || '151229'

export default function PinGate({ children }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [accesoPermitido, setAccesoPermitido] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (pin === APP_PIN) {
      setError('')
      setAccesoPermitido(true)
      return
    }

    setError('Contraseña incorrecta')
    setPin('')
  }

  if (!accesoPermitido) {
    return (
      <div className="pin-gate">
        <div className="pin-card-simple">
          <h3 className="pin-card-simple__title">Ceviche Bravo</h3>
          <p className="pin-card-simple__text">Ingresa la contraseña para continuar</p>

          <form onSubmit={handleSubmit} className="pin-card-simple__form">
            <input
              type="password"
              className="form-control pin-card-simple__input"
              placeholder="Contraseña"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoFocus
            />

            {error ? <div className="pin-card-simple__error">{error}</div> : null}

            <button type="submit" className="btn btn-dark w-100 pin-card-simple__button">
              Ingresar
            </button>
          </form>
        </div>
      </div>
    )
  }

  return children
}