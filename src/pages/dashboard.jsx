import { useNavigate } from 'react-router-dom'

function Dashboard() {

  const navigate = useNavigate()

  return (
    <section className="quick-access">

      <button
        className="quick-access__card quick-access__card--wide"
        onClick={() => navigate('/ventas')}
      >

        <span className="quick-access__eyebrow">
          Movimiento principal
        </span>

        <h3>
          Ventas
        </h3>

        <p>
          Registra, edita y consulta ventas
          completas con varios platos.
        </p>

      </button>

      <button
        className="quick-access__card"
        onClick={() => navigate('/gastos')}
      >

        <span className="quick-access__eyebrow">
          Control diario
        </span>

        <h3>
          Gastos
        </h3>

        <p>
          Guarda, edita y consulta gastos
          pagados y pendientes.
        </p>

      </button>

      <button
        className="quick-access__card"
        onClick={() => navigate('/reportes')}
      >

        <span className="quick-access__eyebrow">
          Resumen
        </span>

        <h3>
          Reportes
        </h3>

        <p>
          Revisa resultados por día y por mes.
        </p>

      </button>

      <button
        className="quick-access__card"
        onClick={() => navigate('/pendientes')}
      >

        <span className="quick-access__eyebrow">
          Seguimiento
        </span>

        <h3>
          Pendientes
        </h3>

        <p>
          Consulta fiados y pagos pendientes.
        </p>

      </button>

      <button
        className="quick-access__card"
        onClick={() => navigate('/platos')}
      >

        <span className="quick-access__eyebrow">
          Catálogo
        </span>

        <h3>
          Platos
        </h3>

        <p>
          Edita nombres, precios y categorías.
        </p>

      </button>

    </section>
  )
}

export default Dashboard