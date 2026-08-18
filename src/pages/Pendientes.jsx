import { useApp } from '../context/AppContext'
import { useState } from 'react'

function Pendientes() {

  const [tipo, setTipo] =
    useState('por_cobrar')

  const {
    pendientesPorCobrar,
    pendientesPorPagar,

    abrirModalCobro,
    abrirModalPago,
  } = useApp()

  return (

    <div className="panel-seccion">

      <div className="panel-seccion__body">

        <div className="d-flex flex-wrap gap-2 mb-4">

          <button
            className={`btn ${
              tipo === 'por_cobrar'
                ? 'btn-warning'
                : 'btn-outline-warning'
            }`}
            onClick={() =>
              setTipo('por_cobrar')
            }
          >
            Ventas por cobrar
          </button>

          <button
            className={`btn ${
              tipo === 'por_pagar'
                ? 'btn-secondary'
                : 'btn-outline-secondary'
            }`}
            onClick={() =>
              setTipo('por_pagar')
            }
          >
            Gastos por pagar
          </button>

        </div>

        {tipo === 'por_cobrar' ? (

          <>

            <h3 className="panel-titulo">
              Ventas por cobrar
            </h3>

            {pendientesPorCobrar.length === 0 ? (

              <p className="panel-texto">
                No hay ventas pendientes.
              </p>

            ) : (

              <div className="stack-list">

                {pendientesPorCobrar.map(
                  (venta) => (

                    <div
                      className="item-card"
                      key={venta.id}
                    >

                      <h5 className="item-card__title">
                        Venta #{venta.id}
                      </h5>

                      <p className="item-card__text">
                        <strong>
                          Monto:
                        </strong>{' '}
                        S/ {Number(
                          venta.total ??
                          venta.monto ??
                          0
                        ).toFixed(2)}
                      </p>

                      <p className="item-card__text">
                        <strong>
                          Fecha:
                        </strong>{' '}
                        {venta.fecha}
                      </p>

                      <p className="item-card__text">
                        <strong>
                          Cliente:
                        </strong>{' '}
                        {venta.fiado_nombre}
                      </p>

                      <button
                        className="btn btn-success btn-sm"
                        onClick={() =>
                          abrirModalCobro(
                            venta
                          )
                        }
                      >
                        Marcar como cobrada
                      </button>

                    </div>

                  )
                )}

              </div>

            )}

          </>

        ) : (

          <>

            <h3 className="panel-titulo">
              Gastos por pagar
            </h3>

            {pendientesPorPagar.length === 0 ? (

              <p className="panel-texto">
                No hay gastos pendientes.
              </p>

            ) : (

              <div className="stack-list">

                {pendientesPorPagar.map(
                  (gasto) => (

                    <div
                      className="item-card"
                      key={gasto.id}
                    >

                      <h5 className="item-card__title">
                        {gasto.descripcion}
                      </h5>

                      <p className="item-card__text">
                        <strong>
                          Monto:
                        </strong>{' '}
                        S/ {Number(
                          gasto.monto
                        ).toFixed(2)}
                      </p>

                      <p className="item-card__text">
                        <strong>
                          Fecha:
                        </strong>{' '}
                        {gasto.fecha}
                      </p>

                      <p className="item-card__text">
                        <strong>
                          Pendiente:
                        </strong>{' '}
                        {gasto.nota_pendiente}
                      </p>

                      <button
                        className="btn btn-success btn-sm"
                        onClick={() =>
                          abrirModalPago(
                            gasto
                          )
                        }
                      >
                        Marcar como pagado
                      </button>

                    </div>

                  )
                )}

              </div>

            )}

          </>

        )}

      </div>

    </div>
  )
}

export default Pendientes