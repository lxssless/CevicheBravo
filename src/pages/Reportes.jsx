import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

function Reportes() {

  const navigate = useNavigate()

  const {
    fechaReporte,
    setFechaReporte,

    mesReporte,
    setMesReporte,

    totalVentasReporte,
    totalGastosReporte,
    gananciaReporte,

    ventasPorCobrarReporte,
    gastosPorPagarReporte,

    totalVentasMes,
    totalGastosMes,
    gananciaMes,

    ventasPorCobrarMes,
    gastosPorPagarMes,
  } = useApp()

  return (

    <div className="row g-4">

      {/* REPORTE DIARIO */}

      <div className="col-12">

        <div className="panel-seccion">

          <div className="panel-seccion__body">

            <h3 className="panel-titulo">
              Reporte diario
            </h3>

            <div className="row g-3 align-items-end">

              <div className="col-12 col-md-4">

                <label className="form-label">
                  Selecciona una fecha
                </label>

                <input
                  type="date"
                  className="form-control"
                  value={fechaReporte}
                  onChange={(e) =>
                    setFechaReporte(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="col-12 col-md-8">

                <div className="row g-3">

                  <div className="col-12 col-md-6">

                    <div className="mini-stat">

                      <span className="mini-stat__label">
                        Ventas
                      </span>

                      <strong>
                        S/ {totalVentasReporte.toFixed(2)}
                      </strong>

                    </div>

                  </div>

                  <div className="col-12 col-md-6">

                    <div className="mini-stat">

                      <span className="mini-stat__label">
                        Gastos
                      </span>

                      <strong>
                        S/ {totalGastosReporte.toFixed(2)}
                      </strong>

                    </div>

                  </div>

                  <div className="col-12 col-md-6">

                    <button
                      className="mini-stat mini-stat--button w-100"
                      onClick={() =>
                        navigate(
                          '/pendientes'
                        )
                      }
                    >

                      <span className="mini-stat__label">
                        Por cobrar
                      </span>

                      <strong>
                        S/ {ventasPorCobrarReporte.toFixed(2)}
                      </strong>

                    </button>

                  </div>

                  <div className="col-12 col-md-6">

                    <button
                      className="mini-stat mini-stat--button w-100"
                      onClick={() =>
                        navigate(
                          '/pendientes'
                        )
                      }
                    >

                      <span className="mini-stat__label">
                        Por pagar
                      </span>

                      <strong>
                        S/ {gastosPorPagarReporte.toFixed(2)}
                      </strong>

                    </button>

                  </div>

                  <div className="col-12">

                    <div className="mini-stat mini-stat--wide">

                      <span className="mini-stat__label">
                        Ganancia del día
                      </span>

                      <strong>
                        S/ {gananciaReporte.toFixed(2)}
                      </strong>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* REPORTE MENSUAL */}

      <div className="col-12">

        <div className="panel-seccion">

          <div className="panel-seccion__body">

            <h3 className="panel-titulo">
              Reporte mensual
            </h3>

            <div className="row g-3 align-items-end">

              <div className="col-12 col-md-4">

                <label className="form-label">
                  Selecciona un mes
                </label>

                <input
                  type="month"
                  className="form-control"
                  value={mesReporte}
                  onChange={(e) =>
                    setMesReporte(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="col-12 col-md-8">

                <div className="row g-3">

                  <div className="col-12 col-md-6">

                    <div className="mini-stat">

                      <span className="mini-stat__label">
                        Ventas del mes
                      </span>

                      <strong>
                        S/ {totalVentasMes.toFixed(2)}
                      </strong>

                    </div>

                  </div>

                  <div className="col-12 col-md-6">

                    <div className="mini-stat">

                      <span className="mini-stat__label">
                        Gastos del mes
                      </span>

                      <strong>
                        S/ {totalGastosMes.toFixed(2)}
                      </strong>

                    </div>

                  </div>

                  <div className="col-12 col-md-6">

                    <div className="mini-stat">

                      <span className="mini-stat__label">
                        Por cobrar
                      </span>

                      <strong>
                        S/ {ventasPorCobrarMes.toFixed(2)}
                      </strong>

                    </div>

                  </div>

                  <div className="col-12 col-md-6">

                    <div className="mini-stat">

                      <span className="mini-stat__label">
                        Por pagar
                      </span>

                      <strong>
                        S/ {gastosPorPagarMes.toFixed(2)}
                      </strong>

                    </div>

                  </div>

                  <div className="col-12">

                    <div className="mini-stat mini-stat--wide">

                      <span className="mini-stat__label">
                        Ganancia del mes
                      </span>

                      <strong>
                        S/ {gananciaMes.toFixed(2)}
                      </strong>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Reportes