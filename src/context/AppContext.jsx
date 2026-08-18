import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  listarPlatos,
  crearPlato,
  actualizarPlato,
  eliminarPlatoPorId,
} from '../services/platosService'

import {
  listarGastos,
  crearGasto,
  actualizarGasto,
  marcarGastoComoPagado,
  eliminarGastoPorId,
} from '../services/gastosService'

import {
  listarVentas,
  listarDetalleVentas,
  crearVenta,
  actualizarVenta,
  eliminarDetallesDeVenta,
  crearDetallesVenta,
  eliminarVentaPorId,
  marcarVentaComoCobrada,
} from '../services/ventasService'

import {
  obtenerCajaPorFecha,
  obtenerUltimaCajaAntesDe,
  guardarCajaPorFecha,
} from '../services/cajaService'

const AppContext = createContext(null)

export function AppProvider({ children }) {

  // =========================
  // FECHA
  // =========================

  const hoy = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())

  const mesActual = hoy.slice(0, 7)

  // =========================
  // PLATOS
  // =========================

  const [platos, setPlatos] = useState([])

  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [categoria, setCategoria] = useState('')
  const [imagenUrl, setImagenUrl] = useState('')
  const [editandoPlatoId, setEditandoPlatoId] = useState(null)

  // =========================
  // VENTAS
  // =========================

  const [ventas, setVentas] = useState([])
  const [detalleVentas, setDetalleVentas] = useState([])

  const [editandoVentaId, setEditandoVentaId] = useState(null)

  const [platoId, setPlatoId] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [carrito, setCarrito] = useState([])

  const [fechaVenta, setFechaVenta] = useState(hoy)
  const [metodoPago, setMetodoPago] = useState('efectivo')
  const [fiadoNombre, setFiadoNombre] = useState('')
  const [montoRecibido, setMontoRecibido] = useState('')

  const [filtroVentaTexto, setFiltroVentaTexto] = useState('')
  const [filtroVentaFecha, setFiltroVentaFecha] = useState('')
  const [filtroVentaMetodo, setFiltroVentaMetodo] = useState('')
  const [filtroVentaEstado, setFiltroVentaEstado] = useState('')

  // =========================
  // GASTOS
  // =========================

  const [gastos, setGastos] = useState([])

  const [descripcionGasto, setDescripcionGasto] = useState('')
  const [montoGasto, setMontoGasto] = useState('')
  const [fechaGasto, setFechaGasto] = useState(hoy)

  const [estadoPagoGasto, setEstadoPagoGasto] = useState('pagado')
  const [notaPendiente, setNotaPendiente] = useState('')
  const [metodoPagoGastoReal, setMetodoPagoGastoReal] = useState('efectivo')

  const [editandoGastoId, setEditandoGastoId] = useState(null)

  const [filtroGastoTexto, setFiltroGastoTexto] = useState('')
  const [filtroGastoFecha, setFiltroGastoFecha] = useState('')
  const [filtroGastoEstado, setFiltroGastoEstado] = useState('')
  const [filtroGastoMetodo, setFiltroGastoMetodo] = useState('')

  // =========================
  // CAJA
  // =========================

  const [cierreCajaHoy, setCierreCajaHoy] = useState(null)

  const [saldoInicialEfectivoManual, setSaldoInicialEfectivoManual] = useState('')
  const [saldoInicialYapeManual, setSaldoInicialYapeManual] = useState('')
  const [observacionCaja, setObservacionCaja] = useState('')

  const [mostrarEditorCaja, setMostrarEditorCaja] = useState(false)
  const [mostrarMontosCaja, setMostrarMontosCaja] = useState(false)

  // =========================
  // PENDIENTES
  // =========================

  const [ventaPendienteSeleccionada, setVentaPendienteSeleccionada] = useState(null)
  const [gastoPendienteSeleccionado, setGastoPendienteSeleccionado] = useState(null)

  const [mostrarModalCobro, setMostrarModalCobro] = useState(false)
  const [mostrarModalPago, setMostrarModalPago] = useState(false)

  const [metodoCobroPendiente, setMetodoCobroPendiente] = useState('efectivo')
  const [fechaCobroPendiente, setFechaCobroPendiente] = useState(hoy)

  const [metodoPagoPendiente, setMetodoPagoPendiente] = useState('efectivo')
  const [fechaPagoPendiente, setFechaPagoPendiente] = useState(hoy)

  // =========================
  // REPORTES
  // =========================

  const [fechaReporte, setFechaReporte] = useState(hoy)
  const [mesReporte, setMesReporte] = useState(mesActual)

  // =========================
  // GASTOS FRECUENTES
  // =========================

  const gastosFrecuentes = useMemo(
    () => [
      'Camote',
      'Ají limo',
      'Ají amarillo',
      'Cebolla',
      'Limón',
      'Pescado',
      'Mariscos',
      'Cancha',
      'Choclo',
      'Culantro',
      'Ajo',
      'Kion',
      'Aceite',
      'Sal',
      'Gas',
      'Hielo',
      'Envases',
      'Bolsas',
      'Lechuga',
      'Limpieza',
      'Gasolina',
      'Pota',
      'Pimienta',
      'Apio',
      'Azucar',
      'Servilleta',
      'Cebolla china',
      'Papel higiénico',
      'Poet',
      'Lejia',
      'Sillao',
      'Rocoto',
    ],
    []
  )

  // =========================
  // CARGAR DATOS
  // =========================

  useEffect(() => {
    inicializarApp()
  }, [])

  async function inicializarApp() {
    await Promise.all([
      obtenerPlatos(),
      obtenerVentas(),
      obtenerDetalleVentas(),
      obtenerGastos(),
    ])

    await cargarCajaDelDia()
  }

async function obtenerPlatos() {
  try {
    const data = await listarPlatos()
    setPlatos(data)
  } catch (error) {
    console.error('Error al obtener platos:', error)
    alert(`Error al cargar platos: ${error.message}`)
  }
}

 async function obtenerVentas() {
  try {
    const data = await listarVentas()
    setVentas(data)
  } catch (error) {
    console.error('Error al obtener ventas:', error)
    alert(`Error al cargar ventas: ${error.message}`)
  }
}

 async function obtenerDetalleVentas() {
  try {
    const data = await listarDetalleVentas()
    setDetalleVentas(data)
  } catch (error) {
    console.error('Error al obtener detalle de ventas:', error)
    alert(`Error al cargar detalle de ventas: ${error.message}`)
  }
}

async function obtenerGastos() {
  try {
    const data = await listarGastos()
    setGastos(data)
  } catch (error) {
    console.error('Error al obtener gastos:', error)
    alert(`Error al cargar gastos: ${error.message}`)
  }
}

  // =========================
  // CAJA
  // =========================

  async function cargarCajaDelDia() {
  try {
    const cierreHoy = await obtenerCajaPorFecha(hoy)

    if (cierreHoy) {
      setCierreCajaHoy(cierreHoy)
      setSaldoInicialEfectivoManual(
        cierreHoy.saldo_inicial_efectivo ?? 0
      )
      setSaldoInicialYapeManual(
        cierreHoy.saldo_inicial_yape ?? 0
      )
      setObservacionCaja(cierreHoy.observacion ?? '')
      return
    }

    const ultimoCierre =
      await obtenerUltimaCajaAntesDe(hoy)

    setCierreCajaHoy(null)
    setSaldoInicialEfectivoManual(
      Number(
        ultimoCierre?.caja_real_efectivo ?? 0
      )
    )
    setSaldoInicialYapeManual(
      Number(ultimoCierre?.caja_real_yape ?? 0)
    )
    setObservacionCaja('')
  } catch (error) {
    console.error('Error al cargar caja:', error)
    alert(`Error al cargar caja: ${error.message}`)
  }
}
  async function guardarEncabezadoCaja() {
  const saldoEfectivo = Number(
    saldoInicialEfectivoManual || 0
  )

  const saldoYape = Number(
    saldoInicialYapeManual || 0
  )

  const payload = {
    fecha: hoy,
    saldo_inicial: saldoEfectivo + saldoYape,
    saldo_inicial_efectivo: saldoEfectivo,
    saldo_inicial_yape: saldoYape,
    observacion: observacionCaja.trim() || null,
    caja_real_efectivo:
      cierreCajaHoy?.caja_real_efectivo ??
      saldoEfectivo,
    caja_real_yape:
      cierreCajaHoy?.caja_real_yape ?? saldoYape,
    cerrado: cierreCajaHoy?.cerrado ?? false,
  }

  try {
    await guardarCajaPorFecha(payload)

    await cargarCajaDelDia()
    setMostrarEditorCaja(false)
  } catch (error) {
    console.error('Error al guardar caja:', error)
    alert(`Error al guardar encabezado: ${error.message}`)
  }
}

  // =========================
  // PLATOS
  // =========================

  function limpiarFormularioPlatos() {
    setNombre('')
    setPrecio('')
    setCategoria('')
    setImagenUrl('')
    setEditandoPlatoId(null)
  }

async function guardarPlato(e) {
  e.preventDefault()

  const payload = {
    nombre: nombre.trim(),
    precio: Number(precio),
    categoria: categoria.trim(),
    imagen_url: imagenUrl.trim() || null,
  }

  try {
    if (editandoPlatoId) {
      await actualizarPlato(editandoPlatoId, payload)
    } else {
      await crearPlato(payload)
    }

    limpiarFormularioPlatos()
    await obtenerPlatos()
  } catch (error) {
    console.error('Error al guardar plato:', error)
    alert(`Error al guardar plato: ${error.message}`)
  }
}

  function cargarPlatoParaEditar(plato) {
    setNombre(plato.nombre || '')
    setPrecio(plato.precio || '')
    setCategoria(plato.categoria || '')
    setImagenUrl(plato.imagen_url || '')
    setEditandoPlatoId(plato.id)
  }

 async function eliminarPlato(id) {
  const confirmar = window.confirm(
    '¿Seguro que deseas eliminar este plato?'
  )

  if (!confirmar) {
    return
  }

  try {
    await eliminarPlatoPorId(id)

    if (editandoPlatoId === id) {
      limpiarFormularioPlatos()
    }

    await obtenerPlatos()
  } catch (error) {
    console.error('Error al eliminar plato:', error)
    alert(`Error al eliminar plato: ${error.message}`)
  }
}
  // =========================
  // VENTAS
  // =========================

  function limpiarFormularioVentas() {

    setEditandoVentaId(null)
    setPlatoId('')
    setCantidad(1)
    setCarrito([])

    setFechaVenta(hoy)
    setMetodoPago('efectivo')
    setFiadoNombre('')
    setMontoRecibido('')
  }

  function agregarAlCarrito() {

    const platoSeleccionado =
      platos.find(
        (plato) =>
          plato.id === Number(platoId)
      )

    if (!platoSeleccionado) {
      alert('Debes seleccionar un plato')
      return
    }

    const cantidadNum = Number(cantidad)

    if (!cantidadNum || cantidadNum <= 0) {
      alert('La cantidad debe ser mayor a 0')
      return
    }

    const precioUnitario =
      Number(platoSeleccionado.precio)

    const subtotal =
      precioUnitario * cantidadNum

    setCarrito((prev) => [
      ...prev,
      {
        plato_id: platoSeleccionado.id,
        nombre: platoSeleccionado.nombre,
        cantidad: cantidadNum,
        precio_unitario: precioUnitario,
        subtotal,
      },
    ])

    setPlatoId('')
    setCantidad(1)
  }

  function eliminarDelCarrito(index) {
    setCarrito((prev) =>
      prev.filter((_, i) => i !== index)
    )
  }

  async function guardarVenta(e) {
  e.preventDefault()

  if (carrito.length === 0) {
    alert('Debes agregar al menos un plato a la venta')
    return
  }

  const totalVenta = carrito.reduce(
    (acum, item) => acum + Number(item.subtotal),
    0
  )

  let vueltoCalculado = 0
  let montoRecibidoFinal = null
  let fiadoNombreFinal = null
  let estadoCobroFinal = 'cobrado'
  let fechaCobroFinal = null
  let metodoCobroFinal = null

  if (metodoPago === 'efectivo') {
    if (!montoRecibido) {
      alert('Debes ingresar con cuánto te pagaron')
      return
    }

    montoRecibidoFinal = Number(montoRecibido)

    if (montoRecibidoFinal < totalVenta) {
      alert(
        'El monto recibido no puede ser menor al total de la venta'
      )
      return
    }

    vueltoCalculado = montoRecibidoFinal - totalVenta
    fechaCobroFinal = fechaVenta
    metodoCobroFinal = 'efectivo'
  }

  if (metodoPago === 'yape') {
    fechaCobroFinal = fechaVenta
    metodoCobroFinal = 'yape'
  }

  if (metodoPago === 'fiado') {
    if (!fiadoNombre.trim()) {
      alert(
        'Debes ingresar el nombre o descripción del fiado'
      )
      return
    }

    fiadoNombreFinal = fiadoNombre.trim()
    estadoCobroFinal = 'por_cobrar'
  }

  const payloadVenta = {
    total: totalVenta,
    monto: totalVenta,
    fecha: fechaVenta,
    metodo_pago: metodoPago,
    fiado_nombre: fiadoNombreFinal,
    monto_recibido: montoRecibidoFinal,
    vuelto: vueltoCalculado,
    estado_cobro: estadoCobroFinal,
    fecha_cobro: fechaCobroFinal,
    metodo_cobro: metodoCobroFinal,
  }

  try {
    let ventaId = editandoVentaId

    if (editandoVentaId) {
      await actualizarVenta(editandoVentaId, payloadVenta)
      await eliminarDetallesDeVenta(editandoVentaId)
    } else {
      const ventaCreada = await crearVenta(payloadVenta)
      ventaId = ventaCreada.id
    }

    const detalles = carrito.map((item) => ({
      venta_id: ventaId,
      plato_id: item.plato_id,
      cantidad: Number(item.cantidad),
      precio_unitario: Number(item.precio_unitario),
      subtotal: Number(item.subtotal),
    }))

    await crearDetallesVenta(detalles)

    limpiarFormularioVentas()

    await Promise.all([
      obtenerVentas(),
      obtenerDetalleVentas(),
      cargarCajaDelDia(),
    ])
  } catch (error) {
    console.error('Error al guardar venta:', error)
    alert(`Error al guardar venta: ${error.message}`)
  }
}

  function obtenerDetalleDeVenta(ventaId) {

    const items =
      detalleVentas.filter(
        (item) =>
          item.venta_id === ventaId
      )

    return items.map((item) => {

      const plato =
        platos.find(
          (p) =>
            p.id === item.plato_id
        )

      return {
        ...item,
        nombre:
          plato?.nombre ||
          'Plato eliminado',
      }
    })
  }

  function cargarVentaParaEditar(venta) {

    const items =
      detalleVentas.filter(
        (item) =>
          item.venta_id === venta.id
      )

    const carritoEditado =
      items.map((item) => {

        const plato =
          platos.find(
            (p) =>
              p.id === item.plato_id
          )

        return {
          plato_id: item.plato_id,

          nombre:
            plato?.nombre ||
            'Plato eliminado',

          cantidad:
            Number(item.cantidad),

          precio_unitario:
            Number(item.precio_unitario),

          subtotal:
            Number(item.subtotal),
        }
      })

    setEditandoVentaId(venta.id)
    setCarrito(carritoEditado)

    setFechaVenta(
      venta.fecha || hoy
    )

    setMetodoPago(
      venta.metodo_pago ||
      'efectivo'
    )

    setFiadoNombre(
      venta.fiado_nombre || ''
    )

    setMontoRecibido(
      venta.monto_recibido || ''
    )

    setPlatoId('')
    setCantidad(1)
  }

  async function eliminarVenta(id) {
  const confirmar = window.confirm(
    '¿Seguro que deseas eliminar esta venta completa?'
  )

  if (!confirmar) {
    return
  }

  try {
    await eliminarVentaPorId(id)

    if (editandoVentaId === id) {
      limpiarFormularioVentas()
    }

    await Promise.all([
      obtenerVentas(),
      obtenerDetalleVentas(),
      cargarCajaDelDia(),
    ])
  } catch (error) {
    console.error('Error al eliminar venta:', error)
    alert(`Error al eliminar venta: ${error.message}`)
  }
}

  // =========================
  // COBRAR FIADO
  // =========================

  function abrirModalCobro(venta) {

    setVentaPendienteSeleccionada(venta)

    setMetodoCobroPendiente('efectivo')

    setFechaCobroPendiente(hoy)

    setMostrarModalCobro(true)
  }

  async function confirmarCobroPendiente() {
  if (!ventaPendienteSeleccionada) {
    return
  }

  try {
    await marcarVentaComoCobrada(
      ventaPendienteSeleccionada.id,
      {
        fecha_cobro: fechaCobroPendiente,
        metodo_cobro: metodoCobroPendiente,
      }
    )

    setMostrarModalCobro(false)
    setVentaPendienteSeleccionada(null)

    await Promise.all([
      obtenerVentas(),
      cargarCajaDelDia(),
    ])
  } catch (error) {
    console.error('Error al cobrar venta pendiente:', error)
    alert(`Error al cobrar fiado: ${error.message}`)
  }
}

  // =========================
  // GASTOS
  // =========================

  function limpiarFormularioGastos() {

    setDescripcionGasto('')
    setMontoGasto('')
    setFechaGasto(hoy)

    setEstadoPagoGasto('pagado')

    setNotaPendiente('')

    setMetodoPagoGastoReal('efectivo')

    setEditandoGastoId(null)
  }

  async function guardarGasto(e) {
  e.preventDefault()

  if (
    estadoPagoGasto === 'por_pagar' &&
    !notaPendiente.trim()
  ) {
    alert(
      'Debes ingresar una nota o descripción del pago pendiente'
    )
    return
  }

  const payload = {
    descripcion: descripcionGasto.trim(),
    monto: Number(montoGasto),
    fecha: fechaGasto,
    estado_pago: estadoPagoGasto,
    nota_pendiente:
      estadoPagoGasto === 'por_pagar'
        ? notaPendiente.trim()
        : null,
    fecha_pago:
      estadoPagoGasto === 'pagado'
        ? fechaGasto
        : null,
    metodo_pago_real:
      estadoPagoGasto === 'pagado'
        ? metodoPagoGastoReal
        : null,
  }

  try {
    if (editandoGastoId) {
      await actualizarGasto(editandoGastoId, payload)
    } else {
      await crearGasto(payload)
    }

    limpiarFormularioGastos()
    await obtenerGastos()
    await cargarCajaDelDia()
  } catch (error) {
    console.error('Error al guardar gasto:', error)
    alert(`Error: ${error.message}`)
  }
}

  function cargarGastoParaEditar(gasto) {

    setDescripcionGasto(
      gasto.descripcion || ''
    )

    setMontoGasto(
      gasto.monto || ''
    )

    setFechaGasto(
      gasto.fecha || hoy
    )

    setEstadoPagoGasto(
      gasto.estado_pago || 'pagado'
    )

    setNotaPendiente(
      gasto.nota_pendiente || ''
    )

    setMetodoPagoGastoReal(
      gasto.metodo_pago_real ||
      'efectivo'
    )

    setEditandoGastoId(gasto.id)
  }

  function abrirModalPago(gasto) {

    setGastoPendienteSeleccionado(gasto)

    setMetodoPagoPendiente('efectivo')

    setFechaPagoPendiente(hoy)

    setMostrarModalPago(true)
  }

  async function confirmarPagoPendiente() {
  if (!gastoPendienteSeleccionado) {
    return
  }

  try {
    await marcarGastoComoPagado(
      gastoPendienteSeleccionado.id,
      {
        fecha_pago: fechaPagoPendiente,
        metodo_pago_real: metodoPagoPendiente,
      }
    )

    setMostrarModalPago(false)
    setGastoPendienteSeleccionado(null)

    await Promise.all([
      obtenerGastos(),
      cargarCajaDelDia(),
    ])
  } catch (error) {
    console.error(
      'Error al pagar gasto pendiente:',
      error
    )

    alert(`Error al pagar gasto pendiente: ${error.message}`)
  }
}

  async function eliminarGasto(id) {
  const confirmar = window.confirm(
    '¿Seguro que deseas eliminar este gasto?'
  )

  if (!confirmar) {
    return
  }

  try {
    await eliminarGastoPorId(id)

    if (editandoGastoId === id) {
      limpiarFormularioGastos()
    }

    await obtenerGastos()
    await cargarCajaDelDia()
  } catch (error) {
    console.error('Error al eliminar gasto:', error)
    alert(`Error: ${error.message}`)
  }
}

  // =========================
  // FILTROS
  // =========================

  const ventasFiltradas = ventas.filter((venta) => {

    const items =
      obtenerDetalleDeVenta(venta.id)

    const textoItems =
      items
        .map((item) => item.nombre)
        .join(' ')
        .toLowerCase()

    const textoGeneral =
      `${venta.id} ${venta.fiado_nombre || ''} ${textoItems}`
        .toLowerCase()

    const cumpleTexto =
      filtroVentaTexto
        ? textoGeneral.includes(
            filtroVentaTexto.toLowerCase()
          )
        : true

    const cumpleFecha =
      filtroVentaFecha
        ? venta.fecha === filtroVentaFecha
        : true

    const cumpleMetodo =
      filtroVentaMetodo
        ? (venta.metodo_pago || '') === filtroVentaMetodo
        : true

    const cumpleEstado =
      filtroVentaEstado
        ? (venta.estado_cobro || '') === filtroVentaEstado
        : true

    return (
      cumpleTexto &&
      cumpleFecha &&
      cumpleMetodo &&
      cumpleEstado
    )
  })

  const gastosFiltrados = gastos.filter((gasto) => {

    const textoGeneral =
      `${gasto.descripcion || ''} ${gasto.nota_pendiente || ''}`
        .toLowerCase()

    const cumpleTexto =
      filtroGastoTexto
        ? textoGeneral.includes(
            filtroGastoTexto.toLowerCase()
          )
        : true

    const cumpleFecha =
      filtroGastoFecha
        ? gasto.fecha === filtroGastoFecha
        : true

    const cumpleEstado =
      filtroGastoEstado
        ? (gasto.estado_pago || '') === filtroGastoEstado
        : true

    const cumpleMetodo =
      filtroGastoMetodo
        ? (gasto.metodo_pago_real || '') === filtroGastoMetodo
        : true

    return (
      cumpleTexto &&
      cumpleFecha &&
      cumpleEstado &&
      cumpleMetodo
    )
  })

  // =========================
  // PENDIENTES
  // =========================

  const pendientesPorCobrar =
    ventas
      .filter(
        (venta) =>
          venta.estado_cobro === 'por_cobrar'
      )
      .sort(
        (a, b) =>
          new Date(b.fecha) -
          new Date(a.fecha)
      )

  const pendientesPorPagar =
    gastos
      .filter(
        (gasto) =>
          gasto.estado_pago === 'por_pagar'
      )
      .sort(
        (a, b) =>
          new Date(b.fecha) -
          new Date(a.fecha)
      )

  // =========================
  // CAJA
  // =========================

  const saldoBaseEfectivo =
    Number(
      saldoInicialEfectivoManual || 0
    )

  const saldoBaseYape =
    Number(
      saldoInicialYapeManual || 0
    )

  const ventasCobradasEfectivo =
    ventas
      .filter(
        (venta) =>
          venta.estado_cobro === 'cobrado' &&
          venta.metodo_cobro === 'efectivo'
      )
      .reduce(
        (acum, venta) =>
          acum +
          Number(
            venta.total ??
            venta.monto ??
            0
          ),
        0
      )

  const ventasCobradasYape =
    ventas
      .filter(
        (venta) =>
          venta.estado_cobro === 'cobrado' &&
          venta.metodo_cobro === 'yape'
      )
      .reduce(
        (acum, venta) =>
          acum +
          Number(
            venta.total ??
            venta.monto ??
            0
          ),
        0
      )

  const gastosPagadosEfectivo =
    gastos
      .filter(
        (gasto) =>
          gasto.estado_pago === 'pagado' &&
          gasto.metodo_pago_real === 'efectivo'
      )
      .reduce(
        (acum, gasto) =>
          acum + Number(gasto.monto),
        0
      )

  const gastosPagadosYape =
    gastos
      .filter(
        (gasto) =>
          gasto.estado_pago === 'pagado' &&
          gasto.metodo_pago_real === 'yape'
      )
      .reduce(
        (acum, gasto) =>
          acum + Number(gasto.monto),
        0
      )

  const saldoFiados =
    ventas
      .filter(
        (venta) =>
          venta.estado_cobro === 'por_cobrar'
      )
      .reduce(
        (acum, venta) =>
          acum +
          Number(
            venta.total ??
            venta.monto ??
            0
          ),
        0
      )

  const dineroPorPagar =
    gastos
      .filter(
        (gasto) =>
          gasto.estado_pago === 'por_pagar'
      )
      .reduce(
        (acum, gasto) =>
          acum + Number(gasto.monto),
        0
      )

  const saldoEfectivoActual =
    saldoBaseEfectivo +
    ventasCobradasEfectivo -
    gastosPagadosEfectivo

  const saldoYapeActual =
    saldoBaseYape +
    ventasCobradasYape -
    gastosPagadosYape

  // =========================
  // REPORTES
  // =========================

  const ventasReporte =
    ventas.filter(
      (venta) =>
        venta.fecha === fechaReporte
    )

  const gastosReporte =
    gastos.filter(
      (gasto) =>
        gasto.fecha === fechaReporte
    )

  const totalVentasReporte =
    ventasReporte.reduce(
      (acum, venta) =>
        acum +
        Number(
          venta.total ??
          venta.monto ??
          0
        ),
      0
    )

  const totalGastosReporte =
    gastosReporte.reduce(
      (acum, gasto) =>
        acum + Number(gasto.monto),
      0
    )

  const gananciaReporte =
    totalVentasReporte -
    totalGastosReporte

  const ventasPorCobrarReporte =
    ventasReporte
      .filter(
        (venta) =>
          venta.estado_cobro === 'por_cobrar'
      )
      .reduce(
        (acum, venta) =>
          acum +
          Number(
            venta.total ??
            venta.monto ??
            0
          ),
        0
      )

  const gastosPorPagarReporte =
    gastosReporte
      .filter(
        (gasto) =>
          gasto.estado_pago === 'por_pagar'
      )
      .reduce(
        (acum, gasto) =>
          acum + Number(gasto.monto),
        0
      )

  const ventasMes =
    ventas.filter(
      (venta) =>
        venta.fecha?.startsWith(mesReporte)
    )

  const gastosMes =
    gastos.filter(
      (gasto) =>
        gasto.fecha?.startsWith(mesReporte)
    )

  const totalVentasMes =
    ventasMes.reduce(
      (acum, venta) =>
        acum +
        Number(
          venta.total ??
          venta.monto ??
          0
        ),
      0
    )

  const totalGastosMes =
    gastosMes.reduce(
      (acum, gasto) =>
        acum + Number(gasto.monto),
      0
    )

  const gananciaMes =
    totalVentasMes -
    totalGastosMes

  const ventasPorCobrarMes =
    ventasMes
      .filter(
        (venta) =>
          venta.estado_cobro === 'por_cobrar'
      )
      .reduce(
        (acum, venta) =>
          acum +
          Number(
            venta.total ??
            venta.monto ??
            0
          ),
        0
      )

  const gastosPorPagarMes =
    gastosMes
      .filter(
        (gasto) =>
          gasto.estado_pago === 'por_pagar'
      )
      .reduce(
        (acum, gasto) =>
          acum + Number(gasto.monto),
        0
      )

  // =========================
  // VALORES CALCULADOS VENTA
  // =========================

  const platoSeleccionadoActual =
    platos.find(
      (plato) =>
        plato.id === Number(platoId)
    )

  const subtotalActual =
    platoSeleccionadoActual
      ? Number(
          platoSeleccionadoActual.precio
        ) * Number(cantidad || 0)
      : 0

  const totalCarrito =
    carrito.reduce(
      (acum, item) =>
        acum + Number(item.subtotal),
      0
    )

  const vueltoActual =
    metodoPago === 'efectivo' &&
    montoRecibido !== ''
      ? Number(montoRecibido) -
        totalCarrito
      : 0

  // =========================
  // CONTEXTO
  // =========================

  const value = {

    hoy,

    // platos
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

    // ventas
    ventas,
    detalleVentas,
    editandoVentaId,
    platoId,
    setPlatoId,
    cantidad,
    setCantidad,
    carrito,
    fechaVenta,
    setFechaVenta,
    metodoPago,
    setMetodoPago,
    fiadoNombre,
    setFiadoNombre,
    montoRecibido,
    setMontoRecibido,

    filtroVentaTexto,
    setFiltroVentaTexto,
    filtroVentaFecha,
    setFiltroVentaFecha,
    filtroVentaMetodo,
    setFiltroVentaMetodo,
    filtroVentaEstado,
    setFiltroVentaEstado,

    guardarVenta,
    agregarAlCarrito,
    eliminarDelCarrito,
    cargarVentaParaEditar,
    eliminarVenta,
    limpiarFormularioVentas,
    obtenerDetalleDeVenta,

    ventasFiltradas,

    subtotalActual,
    totalCarrito,
    vueltoActual,

    // gastos
    gastos,
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

    filtroGastoTexto,
    setFiltroGastoTexto,
    filtroGastoFecha,
    setFiltroGastoFecha,
    filtroGastoEstado,
    setFiltroGastoEstado,
    filtroGastoMetodo,
    setFiltroGastoMetodo,

    guardarGasto,
    cargarGastoParaEditar,
    eliminarGasto,
    limpiarFormularioGastos,

    gastosFiltrados,
    gastosFrecuentes,

    // pendientes
    pendientesPorCobrar,
    pendientesPorPagar,

    abrirModalCobro,
    confirmarCobroPendiente,

    abrirModalPago,
    confirmarPagoPendiente,

    ventaPendienteSeleccionada,
    gastoPendienteSeleccionado,

    mostrarModalCobro,
    setMostrarModalCobro,

    mostrarModalPago,
    setMostrarModalPago,

    metodoCobroPendiente,
    setMetodoCobroPendiente,

    fechaCobroPendiente,
    setFechaCobroPendiente,

    metodoPagoPendiente,
    setMetodoPagoPendiente,

    fechaPagoPendiente,
    setFechaPagoPendiente,

    // caja
    cierreCajaHoy,

    saldoInicialEfectivoManual,
    setSaldoInicialEfectivoManual,

    saldoInicialYapeManual,
    setSaldoInicialYapeManual,

    observacionCaja,
    setObservacionCaja,

    mostrarEditorCaja,
    setMostrarEditorCaja,

    mostrarMontosCaja,
    setMostrarMontosCaja,

    saldoEfectivoActual,
    saldoYapeActual,
    saldoFiados,
    dineroPorPagar,

    guardarEncabezadoCaja,

    // reportes
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

    // refrescar
    obtenerPlatos,
    obtenerVentas,
    obtenerDetalleVentas,
    obtenerGastos,
    cargarCajaDelDia,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}