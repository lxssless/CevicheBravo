import {
  NavLink,
  Outlet,
  useNavigate,
} from 'react-router-dom'
import { useApp } from '../context/AppContext'
import logoCevicheBravo from '../assets/logo.png'

function Layout() {
  const {
    mostrarMontosCaja,
    setMostrarMontosCaja,

    saldoEfectivoActual,
    saldoYapeActual,
    saldoFiados,
    dineroPorPagar,

    mostrarEditorCaja,
    setMostrarEditorCaja,

    saldoInicialEfectivoManual,
    setSaldoInicialEfectivoManual,

    saldoInicialYapeManual,
    setSaldoInicialYapeManual,

    observacionCaja,
    setObservacionCaja,

    guardarEncabezadoCaja,

    mostrarModalPago,
    setMostrarModalPago,
    gastoPendienteSeleccionado,
    metodoPagoPendiente,
    setMetodoPagoPendiente,
    fechaPagoPendiente,
    setFechaPagoPendiente,
    confirmarPagoPendiente,

    mostrarModalCobro,
    setMostrarModalCobro,
    ventaPendienteSeleccionada,
    metodoCobroPendiente,
    setMetodoCobroPendiente,
    fechaCobroPendiente,
    setFechaCobroPendiente,
    confirmarCobroPendiente,
  } = useApp()

  const navigate = useNavigate()

  const textoMonto = (valor) => {
    if (!mostrarMontosCaja) {
      return '****'
    }

    return `S/ ${Number(valor || 0).toFixed(2)}`
  }

  return (
    <div className="app-shell">
      <div className="app-shell__inner">
        <section className="hero-header">
          <div className="brand-block">
            <NavLink
              to="/"
              className="brand-button"
              style={{
                textDecoration: 'none',
              }}
            >
              <span className="brand-mark">
                <img
                  src={logoCevicheBravo}
                  alt="Logo Ceviche Bravo"
                  className="brand-logo"
                />
              </span>

              <span className="brand-copy">
                <span className="brand-title">
                  CevicheBravo
                </span>

                <span className="brand-subtitle">
                  Sistema de control diario
                </span>
              </span>
            </NavLink>
          </div>

          <aside className="resumen-caja">
            <div className="resumen-caja__card resumen-caja__card--horizontal">
              <div className="resumen-caja__top">
                <button
                  type="button"
                  className="resumen-caja__toggle"
                  onClick={() =>
                    setMostrarMontosCaja(
                      !mostrarMontosCaja
                    )
                  }
                >
                  <span>Resumen de caja</span>

                  <span>
                    {mostrarMontosCaja
                      ? 'Ocultar'
                      : 'Ver'}
                  </span>
                </button>
              </div>

              <div className="resumen-caja__inline">
                <button
                  type="button"
                  className="resumen-caja__dato resumen-caja__dato--clickeable"
                  onClick={() =>
                    navigate('/caja/efectivo')
                  }
                >
                  <span className="resumen-caja__label">
                    Saldo efectivo
                  </span>

                  <strong>
                    {textoMonto(
                      saldoEfectivoActual
                    )}
                  </strong>
                </button>

                <button
                  type="button"
                  className="resumen-caja__dato resumen-caja__dato--clickeable"
                  onClick={() =>
                    navigate('/caja/yape')
                  }
                >
                  <span className="resumen-caja__label">
                    Saldo Yape
                  </span>

                  <strong>
                    {textoMonto(saldoYapeActual)}
                  </strong>
                </button>

                <button
                  type="button"
                  className="resumen-caja__dato resumen-caja__dato--clickeable"
                  onClick={() =>
                    navigate('/caja/fiados')
                  }
                >
                  <span className="resumen-caja__label">
                    Saldo fiados
                  </span>

                  <strong>
                    {textoMonto(saldoFiados)}
                  </strong>
                </button>

                <button
                  type="button"
                  className="resumen-caja__dato resumen-caja__dato--clickeable"
                  onClick={() =>
                    navigate('/caja/por-pagar')
                  }
                >
                  <span className="resumen-caja__label">
                    Por pagar
                  </span>

                  <strong>
                    {textoMonto(dineroPorPagar)}
                  </strong>
                </button>

                {mostrarMontosCaja && (
                  <div className="resumen-caja__dato resumen-caja__dato--accion">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        setMostrarEditorCaja(
                          true
                        )
                      }
                    >
                      Editar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </section>

        {mostrarEditorCaja && (
          <div className="panel-seccion mb-4">
            <div className="panel-seccion__body">
              <h3 className="panel-titulo">
                Editar encabezado de caja
              </h3>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">
                    Saldo inicial efectivo
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={
                      saldoInicialEfectivoManual
                    }
                    onChange={(e) =>
                      setSaldoInicialEfectivoManual(
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">
                    Saldo inicial Yape
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={
                      saldoInicialYapeManual
                    }
                    onChange={(e) =>
                      setSaldoInicialYapeManual(
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">
                    Observación
                  </label>

                  <textarea
                    className="form-control"
                    rows="2"
                    value={observacionCaja}
                    onChange={(e) =>
                      setObservacionCaja(
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="col-12 d-flex gap-2 flex-wrap">
                  <button
                    className="btn btn-primary"
                    onClick={
                      guardarEncabezadoCaja
                    }
                  >
                    Guardar encabezado
                  </button>

                  <button
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setMostrarEditorCaja(
                        false
                      )
                    }
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <main className="contenido-principal">
          <Outlet />
        </main>

        {mostrarModalPago &&
          gastoPendienteSeleccionado && (
            <div
              className="modal d-block"
              tabIndex="-1"
              style={{
                backgroundColor:
                  'rgba(0, 0, 0, 0.5)',
              }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      Registrar pago pendiente
                    </h5>

                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        setMostrarModalPago(
                          false
                        )
                      }}
                    />
                  </div>

                  <div className="modal-body">
                    <p className="mb-3">
                      <strong>Gasto:</strong>{' '}
                      {
                        gastoPendienteSeleccionado.descripcion
                      }
                      <br />
                      <strong>Monto:</strong>{' '}
                      S/{' '}
                      {Number(
                        gastoPendienteSeleccionado.monto
                      ).toFixed(2)}
                    </p>

                    <div className="mb-3">
                      <label className="form-label">
                        Fecha de pago
                      </label>

                      <input
                        type="date"
                        className="form-control"
                        value={
                          fechaPagoPendiente
                        }
                        onChange={(e) =>
                          setFechaPagoPendiente(
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <label className="form-label">
                        Método de pago
                      </label>

                      <select
                        className="form-select"
                        value={
                          metodoPagoPendiente
                        }
                        onChange={(e) =>
                          setMetodoPagoPendiente(
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
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setMostrarModalPago(
                          false
                        )
                      }}
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={
                        confirmarPagoPendiente
                      }
                    >
                      Confirmar pago
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        {mostrarModalCobro &&
          ventaPendienteSeleccionada && (
            <div
              className="modal d-block"
              tabIndex="-1"
              style={{
                backgroundColor:
                  'rgba(0, 0, 0, 0.5)',
              }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      Registrar cobro de fiado
                    </h5>

                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Cerrar"
                      onClick={() => {
                        setMostrarModalCobro(
                          false
                        )
                      }}
                    />
                  </div>

                  <div className="modal-body">
                    <p className="mb-3">
                      <strong>Venta:</strong>{' '}
                      #
                      {
                        ventaPendienteSeleccionada.id
                      }
                      <br />

                      <strong>Cliente:</strong>{' '}
                      {ventaPendienteSeleccionada.fiado_nombre ||
                        'Sin descripción'}
                      <br />

                      <strong>Monto:</strong>{' '}
                      S/{' '}
                      {Number(
                        ventaPendienteSeleccionada.total ??
                          ventaPendienteSeleccionada.monto ??
                          0
                      ).toFixed(2)}
                    </p>

                    <div className="mb-3">
                      <label className="form-label">
                        Fecha de cobro
                      </label>

                      <input
                        type="date"
                        className="form-control"
                        value={
                          fechaCobroPendiente
                        }
                        onChange={(e) =>
                          setFechaCobroPendiente(
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <label className="form-label">
                        Método de cobro
                      </label>

                      <select
                        className="form-select"
                        value={
                          metodoCobroPendiente
                        }
                        onChange={(e) =>
                          setMetodoCobroPendiente(
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
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setMostrarModalCobro(
                          false
                        )
                      }}
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={
                        confirmarCobroPendiente
                      }
                    >
                      Confirmar cobro
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}

export default Layout