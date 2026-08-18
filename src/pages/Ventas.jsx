import { useApp } from '../context/AppContext'

function Ventas() {

  const {
    platos,

    ventasFiltradas,

    platoId,
    setPlatoId,

    cantidad,
    setCantidad,

    fechaVenta,
    setFechaVenta,

    metodoPago,
    setMetodoPago,

    fiadoNombre,
    setFiadoNombre,

    montoRecibido,
    setMontoRecibido,

    carrito,

    subtotalActual,
    totalCarrito,
    vueltoActual,

    editandoVentaId,

    agregarAlCarrito,
    eliminarDelCarrito,

    guardarVenta,
    limpiarFormularioVentas,

    cargarVentaParaEditar,
    eliminarVenta,

    filtroVentaTexto,
    setFiltroVentaTexto,

    filtroVentaFecha,
    setFiltroVentaFecha,

    filtroVentaMetodo,
    setFiltroVentaMetodo,

    filtroVentaEstado,
    setFiltroVentaEstado,

    obtenerDetalleDeVenta,

    abrirModalCobro,
  } = useApp()

  return (

    <div className="row g-4">

      {/* FORMULARIO */}

      <div className="col-12 col-xl-5">

        <div className="panel-seccion h-100">

          <div className="panel-seccion__body">

            <h3 className="panel-titulo">

              {editandoVentaId
                ? `Editar venta #${editandoVentaId}`
                : 'Registrar venta'}

            </h3>

            <form onSubmit={guardarVenta}>

              <div className="mb-3">

                <label className="form-label">
                  Plato
                </label>

                <select
                  className="form-select"
                  value={platoId}
                  onChange={(e) =>
                    setPlatoId(e.target.value)
                  }
                >

                  <option value="">
                    Seleccione un plato
                  </option>

                  {platos.map((plato) => (

                    <option
                      key={plato.id}
                      value={plato.id}
                    >
                      {plato.nombre} - S/ {Number(
                        plato.precio
                      ).toFixed(2)}
                    </option>

                  ))}

                </select>

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Cantidad
                </label>

                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={cantidad}
                  onChange={(e) =>
                    setCantidad(e.target.value)
                  }
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Subtotal del ítem
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={`S/ ${subtotalActual.toFixed(2)}`}
                  readOnly
                />

              </div>

              <div className="d-grid mb-4">

                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={agregarAlCarrito}
                >
                  Agregar plato a la venta
                </button>

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Fecha
                </label>

                <input
                  type="date"
                  className="form-control"
                  value={fechaVenta}
                  onChange={(e) =>
                    setFechaVenta(e.target.value)
                  }
                  required
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Método de pago
                </label>

                <select
                  className="form-select"
                  value={metodoPago}
                  onChange={(e) =>
                    setMetodoPago(e.target.value)
                  }
                >

                  <option value="efectivo">
                    Efectivo
                  </option>

                  <option value="yape">
                    Yape
                  </option>

                  <option value="fiado">
                    Fiado
                  </option>

                </select>

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Total
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={`S/ ${totalCarrito.toFixed(2)}`}
                  readOnly
                />

              </div>

              {metodoPago === 'efectivo' && (

                <>

                  <div className="mb-3">

                    <label className="form-label">
                      Con cuánto pagó
                    </label>

                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={montoRecibido}
                      onChange={(e) =>
                        setMontoRecibido(
                          e.target.value
                        )
                      }
                      required
                    />

                  </div>

                  <div className="mb-3">

                    <label className="form-label">
                      Vuelto
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={
                        vueltoActual >= 0
                          ? `S/ ${vueltoActual.toFixed(2)}`
                          : 'Monto insuficiente'
                      }
                      readOnly
                    />

                  </div>

                </>

              )}

              {metodoPago === 'fiado' && (

                <div className="mb-3">

                  <label className="form-label">
                    Nombre o descripción del fiado
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={fiadoNombre}
                    onChange={(e) =>
                      setFiadoNombre(
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
                  {editandoVentaId
                    ? 'Actualizar venta'
                    : 'Guardar venta'}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={limpiarFormularioVentas}
                >
                  Limpiar
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

      {/* CARRITO + HISTORIAL */}

      <div className="col-12 col-xl-7">

        <div className="panel-seccion mb-4">

          <div className="panel-seccion__body">

            <h3 className="panel-titulo">
              Venta actual
            </h3>

            {carrito.length === 0 ? (

              <p className="panel-texto">
                Todavía no agregaste platos.
              </p>

            ) : (

              <div className="stack-list">

                {carrito.map((item, index) => (

                  <div
                    className="item-card"
                    key={`${item.plato_id}-${index}`}
                  >

                    <h5 className="item-card__title">
                      {item.nombre}
                    </h5>

                    <p className="item-card__text">
                      <strong>
                        Cantidad:
                      </strong>{' '}
                      {item.cantidad}
                    </p>

                    <p className="item-card__text">
                      <strong>
                        Precio:
                      </strong>{' '}
                      S/ {Number(
                        item.precio_unitario
                      ).toFixed(2)}
                    </p>

                    <p className="item-card__text">
                      <strong>
                        Subtotal:
                      </strong>{' '}
                      S/ {Number(
                        item.subtotal
                      ).toFixed(2)}
                    </p>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        eliminarDelCarrito(index)
                      }
                    >
                      Quitar
                    </button>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

        <div className="panel-seccion">

          <div className="panel-seccion__body">

            <h3 className="panel-titulo">
              Historial de ventas
            </h3>

            {/* FILTROS */}

            <div className="row g-3 mb-4">

              <div className="col-12 col-md-6">

                <label className="form-label">
                  Buscar
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={filtroVentaTexto}
                  onChange={(e) =>
                    setFiltroVentaTexto(
                      e.target.value
                    )
                  }
                  placeholder="Número, cliente o plato"
                />

              </div>

              <div className="col-12 col-md-6">

                <label className="form-label">
                  Fecha
                </label>

                <input
                  type="date"
                  className="form-control"
                  value={filtroVentaFecha}
                  onChange={(e) =>
                    setFiltroVentaFecha(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="col-12 col-md-6">

                <label className="form-label">
                  Método
                </label>

                <select
                  className="form-select"
                  value={filtroVentaMetodo}
                  onChange={(e) =>
                    setFiltroVentaMetodo(
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

                  <option value="fiado">
                    Fiado
                  </option>

                </select>

              </div>

              <div className="col-12 col-md-6">

                <label className="form-label">
                  Estado
                </label>

                <select
                  className="form-select"
                  value={filtroVentaEstado}
                  onChange={(e) =>
                    setFiltroVentaEstado(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Todos
                  </option>

                  <option value="cobrado">
                    Cobrado
                  </option>

                  <option value="por_cobrar">
                    Por cobrar
                  </option>

                </select>

              </div>

            </div>

            {/* LISTA */}

            {ventasFiltradas.length === 0 ? (

              <p className="panel-texto">
                No hay ventas.
              </p>

            ) : (

              <div className="stack-list">

                {ventasFiltradas.map((venta) => {

                  const items =
                    obtenerDetalleDeVenta(
                      venta.id
                    )

                  return (

                    <div
                      className="item-card"
                      key={venta.id}
                    >

                      <h5 className="item-card__title">
                        Venta #{venta.id}
                      </h5>

                      <p className="item-card__text">
                        <strong>
                          Fecha:
                        </strong>{' '}
                        {venta.fecha}
                      </p>

                      <p className="item-card__text">
                        <strong>
                          Método:
                        </strong>{' '}
                        {venta.metodo_pago}
                      </p>

                      <p className="item-card__text">
                        <strong>
                          Estado:
                        </strong>{' '}
                        {venta.estado_cobro}
                      </p>

                      <p className="item-card__text">
                        <strong>
                          Total:
                        </strong>{' '}
                        S/ {Number(
                          venta.total ??
                          venta.monto ??
                          0
                        ).toFixed(2)}
                      </p>

                      {venta.fiado_nombre && (

                        <p className="item-card__text">
                          <strong>
                            Cliente:
                          </strong>{' '}
                          {venta.fiado_nombre}
                        </p>

                      )}

                      {items.length > 0 && (

                        <div className="detalle-box">

                          <strong>
                            Detalle:
                          </strong>

                          <ul>
                            {items.map((item) => (

                              <li key={item.id}>
                                {item.nombre} x
                                {item.cantidad}
                                {' — '}
                                S/ {Number(
                                  item.subtotal
                                ).toFixed(2)}
                              </li>

                            ))}
                          </ul>

                        </div>

                      )}

                      <div className="d-flex gap-2 flex-wrap mt-3">

                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() =>
                            cargarVentaParaEditar(
                              venta
                            )
                          }
                        >
                          Editar
                        </button>

                        {venta.estado_cobro ===
                          'por_cobrar' && (

                          <button
                            className="btn btn-success btn-sm"
                            onClick={() =>
                              abrirModalCobro(
                                venta
                              )
                            }
                          >
                            Marcar cobrada
                          </button>

                        )}

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            eliminarVenta(
                              venta.id
                            )
                          }
                        >
                          Eliminar
                        </button>

                      </div>

                    </div>

                  )
                })}

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  )
}

export default Ventas