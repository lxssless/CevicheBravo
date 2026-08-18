import { useApp } from '../context/AppContext'

function Gastos() {

  const {
    descripcionGasto,
    setDescripcionGasto,

    montoGasto,
    setMontoGasto,

    fechaGasto,
    setFechaGasto,

    estadoPagoGasto,
    setEstadoPagoGasto,

    notaPendiente,
    setNotaPendiente,

    metodoPagoGastoReal,
    setMetodoPagoGastoReal,

    editandoGastoId,

    gastosFiltrados,
    gastosFrecuentes,

    guardarGasto,
    limpiarFormularioGastos,
    cargarGastoParaEditar,
    eliminarGasto,

    filtroGastoTexto,
    setFiltroGastoTexto,

    filtroGastoFecha,
    setFiltroGastoFecha,

    filtroGastoEstado,
    setFiltroGastoEstado,

    filtroGastoMetodo,
    setFiltroGastoMetodo,

    abrirModalPago,
  } = useApp()

  return (

    <div className="row g-4">

      <div className="col-12 col-xl-5">

        <div className="panel-seccion">

          <div className="panel-seccion__body">

            <h3 className="panel-titulo">
              {editandoGastoId
                ? 'Editar gasto'
                : 'Registrar gasto'}
            </h3>

            <form onSubmit={guardarGasto}>

              <div className="mb-3">

                <label className="form-label">
                  Descripción
                </label>

                <input
                  list="gastos-frecuentes"
                  type="text"
                  className="form-control"
                  value={descripcionGasto}
                  onChange={(e) =>
                    setDescripcionGasto(
                      e.target.value
                    )
                  }
                  required
                />

                <datalist id="gastos-frecuentes">

                  {gastosFrecuentes.map(
                    (gasto) => (
                      <option
                        key={gasto}
                        value={gasto}
                      />
                    )
                  )}

                </datalist>

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Monto
                </label>

                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={montoGasto}
                  onChange={(e) =>
                    setMontoGasto(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Fecha
                </label>

                <input
                  type="date"
                  className="form-control"
                  value={fechaGasto}
                  onChange={(e) =>
                    setFechaGasto(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Estado
                </label>

                <select
                  className="form-select"
                  value={estadoPagoGasto}
                  onChange={(e) =>
                    setEstadoPagoGasto(
                      e.target.value
                    )
                  }
                >

                  <option value="pagado">
                    Pagado
                  </option>

                  <option value="por_pagar">
                    Por pagar
                  </option>

                </select>

              </div>

              {estadoPagoGasto ===
                'pagado' && (

                <div className="mb-3">

                  <label className="form-label">
                    Método de pago
                  </label>

                  <select
                    className="form-select"
                    value={
                      metodoPagoGastoReal
                    }
                    onChange={(e) =>
                      setMetodoPagoGastoReal(
                        e.target.value
                      )
                    }
                  >

                    <option value="efectivo">
                      Efectivo
                    </option>

                    <option value="yape">
                      Yape
                    </option>

                  </select>

                </div>

              )}

              {estadoPagoGasto ===
                'por_pagar' && (

                <div className="mb-3">

                  <label className="form-label">
                    Descripción del pendiente
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={notaPendiente}
                    onChange={(e) =>
                      setNotaPendiente(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>

              )}

              <div className="d-flex gap-2">

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  {editandoGastoId
                    ? 'Actualizar gasto'
                    : 'Guardar gasto'}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={
                    limpiarFormularioGastos
                  }
                >
                  Limpiar
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

      <div className="col-12 col-xl-7">

        <div className="panel-seccion">

          <div className="panel-seccion__body">

            <h3 className="panel-titulo">
              Historial de gastos
            </h3>

            <div className="row g-3 mb-4">

              <div className="col-12 col-md-6">

                <label className="form-label">
                  Buscar
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={filtroGastoTexto}
                  onChange={(e) =>
                    setFiltroGastoTexto(
                      e.target.value
                    )
                  }
                  placeholder="limón, gasolina..."
                />

              </div>

              <div className="col-12 col-md-6">

                <label className="form-label">
                  Fecha
                </label>

                <input
                  type="date"
                  className="form-control"
                  value={filtroGastoFecha}
                  onChange={(e) =>
                    setFiltroGastoFecha(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="col-12 col-md-6">

                <label className="form-label">
                  Estado
                </label>

                <select
                  className="form-select"
                  value={filtroGastoEstado}
                  onChange={(e) =>
                    setFiltroGastoEstado(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Todos
                  </option>

                  <option value="pagado">
                    Pagado
                  </option>

                  <option value="por_pagar">
                    Por pagar
                  </option>

                </select>

              </div>

              <div className="col-12 col-md-6">

                <label className="form-label">
                  Método
                </label>

                <select
                  className="form-select"
                  value={filtroGastoMetodo}
                  onChange={(e) =>
                    setFiltroGastoMetodo(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Todos
                  </option>

                  <option value="efectivo">
                    Efectivo
                  </option>

                  <option value="yape">
                    Yape
                  </option>

                </select>

              </div>

            </div>

            {gastosFiltrados.length === 0 ? (

              <p className="panel-texto">
                No hay gastos.
              </p>

            ) : (

              <div className="stack-list">

                {gastosFiltrados.map(
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
                          Estado:
                        </strong>{' '}
                        {gasto.estado_pago}
                      </p>

                      {gasto.nota_pendiente && (

                        <p className="item-card__text">
                          <strong>
                            Pendiente:
                          </strong>{' '}
                          {gasto.nota_pendiente}
                        </p>

                      )}

                      <div className="d-flex gap-2 flex-wrap mt-3">

                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() =>
                            cargarGastoParaEditar(
                              gasto
                            )
                          }
                        >
                          Editar
                        </button>

                        {gasto.estado_pago ===
                          'por_pagar' && (

                          <button
                            className="btn btn-success btn-sm"
                            onClick={() =>
                              abrirModalPago(
                                gasto
                              )
                            }
                          >
                            Marcar pagado
                          </button>

                        )}

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            eliminarGasto(
                              gasto.id
                            )
                          }
                        >
                          Eliminar
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  )
}

export default Gastos