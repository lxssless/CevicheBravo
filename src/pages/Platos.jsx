import { useApp } from '../context/AppContext'

function Platos() {

  const {
    platos,

    nombre,
    setNombre,

    precio,
    setPrecio,

    categoria,
    setCategoria,

    imagenUrl,
    setImagenUrl,

    editandoPlatoId,

    guardarPlato,
    cargarPlatoParaEditar,
    eliminarPlato,
    limpiarFormularioPlatos,
  } = useApp()

  return (

    <div className="row g-4">

      {/* FORMULARIO */}

      <div className="col-12 col-xl-5">

        <div className="panel-seccion h-100">

          <div className="panel-seccion__body">

            <h3 className="panel-titulo">

              {editandoPlatoId
                ? 'Editar plato'
                : 'Registrar plato'}

            </h3>

            <form onSubmit={guardarPlato}>

              <div className="mb-3">

                <label className="form-label">
                  Nombre
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={nombre}
                  onChange={(e) =>
                    setNombre(e.target.value)
                  }
                  required
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Precio
                </label>

                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={precio}
                  onChange={(e) =>
                    setPrecio(e.target.value)
                  }
                  required
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Categoría
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={categoria}
                  onChange={(e) =>
                    setCategoria(e.target.value)
                  }
                  required
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  URL de imagen
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={imagenUrl}
                  onChange={(e) =>
                    setImagenUrl(e.target.value)
                  }
                />

              </div>

              <div className="d-flex gap-2">

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  {editandoPlatoId
                    ? 'Actualizar plato'
                    : 'Guardar plato'}
                </button>

                {editandoPlatoId && (

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={
                      limpiarFormularioPlatos
                    }
                  >
                    Cancelar
                  </button>

                )}

              </div>

            </form>

          </div>

        </div>

      </div>

      {/* LISTA */}

      <div className="col-12 col-xl-7">

        <div className="panel-seccion h-100">

          <div className="panel-seccion__body">

            <h3 className="panel-titulo">
              Lista de platos
            </h3>

            {platos.length === 0 ? (

              <p className="panel-texto">
                No hay platos registrados todavía.
              </p>

            ) : (

              <div className="row g-3">

                {platos.map((plato) => (

                  <div
                    className="col-12 col-md-6"
                    key={plato.id}
                  >

                    <div className="item-card h-100">

                      <h5 className="item-card__title">
                        {plato.nombre}
                      </h5>

                      <p className="item-card__text">
                        <strong>
                          Precio:
                        </strong>{' '}
                        S/ {Number(
                          plato.precio
                        ).toFixed(2)}
                      </p>

                      <p className="item-card__text">
                        <strong>
                          Categoría:
                        </strong>{' '}
                        {plato.categoria}
                      </p>

                      {plato.imagen_url && (

                        <img
                          src={plato.imagen_url}
                          alt={plato.nombre}
                          className="img-fluid rounded mt-3 mb-3"
                        />

                      )}

                      <div className="d-flex gap-2 flex-wrap">

                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() =>
                            cargarPlatoParaEditar(
                              plato
                            )
                          }
                        >
                          Editar
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            eliminarPlato(
                              plato.id
                            )
                          }
                        >
                          Eliminar
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  )
}

export default Platos