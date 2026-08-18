import { Link, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './DetalleCaja.css'

function DetalleCaja() {
  const { tipo } = useParams()

  const {
    ventas,
    gastos,
    saldoInicialEfectivoManual,
    saldoInicialYapeManual,
  } = useApp()

  const configuraciones = {
    efectivo: {
      titulo: 'Saldo efectivo',
      saldoInicial: Number(saldoInicialEfectivoManual || 0),
      metodo: 'efectivo',
    },
    yape: {
      titulo: 'Saldo Yape',
      saldoInicial: Number(saldoInicialYapeManual || 0),
      metodo: 'yape',
    },
    fiados: {
      titulo: 'Saldo fiados',
      saldoInicial: 0,
      metodo: null,
    },
    'por-pagar': {
      titulo: 'Por pagar',
      saldoInicial: 0,
      metodo: null,
    },
  }

  const config = configuraciones[tipo]

  if (!config) {
    return (
      <section className="dcaja-wrap">
        <div className="dcaja-panel">
          <h2 className="dcaja-title">Detalle no encontrado</h2>
          <Link to="/" className="dcaja-back">
            Volver al inicio
          </Link>
        </div>
      </section>
    )
  }

  let ingresos = []
  let egresos = []

  if (tipo === 'efectivo' || tipo === 'yape') {
    ingresos = ventas.filter(
      (venta) =>
        venta.estado_cobro === 'cobrado' &&
        venta.metodo_cobro === config.metodo
    )

    egresos = gastos.filter(
      (gasto) =>
        gasto.estado_pago === 'pagado' &&
        gasto.metodo_pago_real === config.metodo
    )
  }

  if (tipo === 'fiados') {
    ingresos = ventas.filter(
      (venta) => venta.estado_cobro === 'por_cobrar'
    )
  }

  if (tipo === 'por-pagar') {
    egresos = gastos.filter(
      (gasto) => gasto.estado_pago === 'por_pagar'
    )
  }

  const totalIngresos = ingresos.reduce(
    (acum, venta) =>
      acum + Number(venta.total ?? venta.monto ?? 0),
    0
  )

  const totalEgresos = egresos.reduce(
    (acum, gasto) => acum + Number(gasto.monto || 0),
    0
  )

  const saldoFinal =
    config.saldoInicial + totalIngresos - totalEgresos

  const movimientosIngresos = ingresos.map((venta) => ({
    id: `venta-${venta.id}`,
    tipo: 'ingreso',
    fecha: venta.fecha,
    titulo:
      tipo === 'fiados'
        ? `Fiado #${venta.id}`
        : `Venta #${venta.id}`,
    subtitulo:
      venta.fiado_nombre || venta.metodo_cobro || 'Ingreso',
    monto: Number(venta.total ?? venta.monto ?? 0),
  }))

  const movimientosEgresos = egresos.map((gasto) => ({
    id: `gasto-${gasto.id}`,
    tipo: 'egreso',
    fecha: gasto.fecha,
    titulo: gasto.descripcion || `Gasto #${gasto.id}`,
    subtitulo:
      tipo === 'por-pagar'
        ? 'Pendiente de pago'
        : gasto.metodo_pago_real || 'Egreso',
    monto: Number(gasto.monto || 0),
  }))

  const movimientos = [
    ...movimientosIngresos,
    ...movimientosEgresos,
  ].sort((a, b) => {
    const fechaA = new Date(a.fecha).getTime()
    const fechaB = new Date(b.fecha).getTime()
    return fechaB - fechaA
  })

  const gruposPorFecha = movimientos.reduce(
    (acum, movimiento) => {
      const fecha = movimiento.fecha || 'Sin fecha'

      if (!acum[fecha]) {
        acum[fecha] = []
      }

      acum[fecha].push(movimiento)
      return acum
    },
    {}
  )

  const grupos = Object.entries(gruposPorFecha).sort(
    (a, b) =>
      new Date(b[0]).getTime() - new Date(a[0]).getTime()
  )

  const formatearFecha = (fecha) => {
    if (!fecha || fecha === 'Sin fecha') return fecha

    return new Intl.DateTimeFormat('es-PE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(`${fecha}T00:00:00`))
  }

  return (
    <section className="dcaja-wrap">
      <div className="dcaja-panel">
        <div className="dcaja-head">
          <div>
            <p className="dcaja-kicker">Detalle de caja</p>
            <h1 className="dcaja-title">{config.titulo}</h1>
            <p className="dcaja-subtitle">
              Movimientos agrupados por día
            </p>
          </div>

          <Link to="/" className="dcaja-back">
            Volver
          </Link>
        </div>

        <div className="dcaja-stats">
          <article className="dcaja-stat">
            <span className="dcaja-stat__label">
              Saldo inicial
            </span>
            <strong className="dcaja-stat__value">
              S/ {config.saldoInicial.toFixed(2)}
            </strong>
          </article>

          <article className="dcaja-stat dcaja-stat--ok">
            <span className="dcaja-stat__label">
              Ingresos
            </span>
            <strong className="dcaja-stat__value">
              S/ {totalIngresos.toFixed(2)}
            </strong>
          </article>

          <article className="dcaja-stat dcaja-stat--bad">
            <span className="dcaja-stat__label">
              Egresos
            </span>
            <strong className="dcaja-stat__value">
              S/ {totalEgresos.toFixed(2)}
            </strong>
          </article>

          <article className="dcaja-stat dcaja-stat--main">
            <span className="dcaja-stat__label">
              Saldo actual
            </span>
            <strong className="dcaja-stat__value">
              S/ {saldoFinal.toFixed(2)}
            </strong>
          </article>
        </div>

        {grupos.length === 0 ? (
          <div className="dcaja-empty">
            No hay movimientos para mostrar.
          </div>
        ) : (
          <div className="dcaja-groups">
            {grupos.map(([fecha, items]) => (
              <section
                key={fecha}
                className="dcaja-group"
              >
                <header className="dcaja-group__head">
                  <div>
                    <h2 className="dcaja-group__title">
                      {formatearFecha(fecha)}
                    </h2>
                    <p className="dcaja-group__date">
                      {fecha}
                    </p>
                  </div>

                  <div className="dcaja-group__pill">
                    {items.length}{' '}
                    {items.length === 1
                      ? 'movimiento'
                      : 'movimientos'}
                  </div>
                </header>

                <div className="dcaja-items">
                  {items.map((movimiento) => (
                    <article
                      key={movimiento.id}
                      className={`dcaja-item ${
                        movimiento.tipo === 'ingreso'
                          ? 'dcaja-item--ingreso'
                          : 'dcaja-item--egreso'
                      }`}
                    >
                      <div className="dcaja-item__left">
                        <span
                          className={`dcaja-item__tag ${
                            movimiento.tipo === 'ingreso'
                              ? 'dcaja-item__tag--ingreso'
                              : 'dcaja-item__tag--egreso'
                          }`}
                        >
                          {movimiento.tipo === 'ingreso'
                            ? 'Ingreso'
                            : 'Egreso'}
                        </span>

                        <div className="dcaja-item__content">
                          <h3 className="dcaja-item__title">
                            {movimiento.titulo}
                          </h3>
                          <p className="dcaja-item__meta">
                            {movimiento.subtitulo}
                          </p>
                        </div>
                      </div>

                      <strong
                        className={`dcaja-item__amount ${
                          movimiento.tipo === 'ingreso'
                            ? 'dcaja-item__amount--ingreso'
                            : 'dcaja-item__amount--egreso'
                        }`}
                      >
                        {movimiento.tipo === 'ingreso'
                          ? '+'
                          : '-'}{' '}
                        S/ {movimiento.monto.toFixed(2)}
                      </strong>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default DetalleCaja