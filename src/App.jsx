import { useEffect, useMemo, useState } from 'react'
import { supabase } from './supabaseClient'
import logoCevicheBravo from './assets/logo.png'

function App() {
  const [seccion, setSeccion] = useState('dashboard')
  const [tipoPendienteActivo, setTipoPendienteActivo] = useState('por_cobrar')
  const [mostrarEditorCaja, setMostrarEditorCaja] = useState(false)
  const [mostrarMontosCaja, setMostrarMontosCaja] = useState(false)

  const [platos, setPlatos] = useState([])
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [categoria, setCategoria] = useState('')
  const [imagenUrl, setImagenUrl] = useState('')
  const [editandoPlatoId, setEditandoPlatoId] = useState(null)

  const [ventas, setVentas] = useState([])
  const [detalleVentas, setDetalleVentas] = useState([])
  const [editandoVentaId, setEditandoVentaId] = useState(null)

  const [platoId, setPlatoId] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [carrito, setCarrito] = useState([])
  const [fechaVenta, setFechaVenta] = useState('')
  const [metodoPago, setMetodoPago] = useState('efectivo')
  const [fiadoNombre, setFiadoNombre] = useState('')
  const [montoRecibido, setMontoRecibido] = useState('')

  const [filtroVentaTexto, setFiltroVentaTexto] = useState('')
  const [filtroVentaFecha, setFiltroVentaFecha] = useState('')
  const [filtroVentaMetodo, setFiltroVentaMetodo] = useState('')
  const [filtroVentaEstado, setFiltroVentaEstado] = useState('')

  const [gastos, setGastos] = useState([])
  const [descripcionGasto, setDescripcionGasto] = useState('')
  const [montoGasto, setMontoGasto] = useState('')
  const [fechaGasto, setFechaGasto] = useState('')
  const [estadoPagoGasto, setEstadoPagoGasto] = useState('pagado')
  const [notaPendiente, setNotaPendiente] = useState('')
  const [metodoPagoGastoReal, setMetodoPagoGastoReal] = useState('efectivo')
  const [editandoGastoId, setEditandoGastoId] = useState(null)

  const [filtroGastoTexto, setFiltroGastoTexto] = useState('')
  const [filtroGastoFecha, setFiltroGastoFecha] = useState('')
  const [filtroGastoEstado, setFiltroGastoEstado] = useState('')
  const [filtroGastoMetodo, setFiltroGastoMetodo] = useState('')

  const [cierreCajaHoy, setCierreCajaHoy] = useState(null)
  const [saldoInicialEfectivoManual, setSaldoInicialEfectivoManual] = useState('')
  const [saldoInicialYapeManual, setSaldoInicialYapeManual] = useState('')
  const [observacionCaja, setObservacionCaja] = useState('')

  const [ventaPendienteSeleccionada, setVentaPendienteSeleccionada] = useState(null)
  const [gastoPendienteSeleccionado, setGastoPendienteSeleccionado] = useState(null)
  const [mostrarModalCobro, setMostrarModalCobro] = useState(false)
  const [mostrarModalPago, setMostrarModalPago] = useState(false)
  const [metodoCobroPendiente, setMetodoCobroPendiente] = useState('efectivo')
  const [fechaCobroPendiente, setFechaCobroPendiente] = useState('')
  const [metodoPagoPendiente, setMetodoPagoPendiente] = useState('efectivo')
  const [fechaPagoPendiente, setFechaPagoPendiente] = useState('')

  const hoy = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())

  const mesActual = hoy.slice(0, 7)

  const [fechaReporte, setFechaReporte] = useState(hoy)
  const [mesReporte, setMesReporte] = useState(mesActual)

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

  useEffect(() => {
    inicializarApp()
    setFechaVenta(hoy)
    setFechaGasto(hoy)
    setFechaCobroPendiente(hoy)
    setFechaPagoPendiente(hoy)
  }, [])

  async function inicializarApp() {
    await Promise.all([obtenerPlatos(), obtenerVentas(), obtenerDetalleVentas(), obtenerGastos()])
    await cargarCajaDelDia()
  }

  async function obtenerPlatos() {
    const { data, error } = await supabase.from('platos').select('*').order('id', { ascending: false })
    if (error) return console.error(error)
    setPlatos(data || [])
  }

  async function obtenerVentas() {
    const { data, error } = await supabase.from('ventas').select('*').order('id', { ascending: false })
    if (error) return console.error(error)
    setVentas(data || [])
  }

  async function obtenerDetalleVentas() {
    const { data, error } = await supabase.from('detalle_ventas').select('*').order('id', { ascending: false })
    if (error) return console.error(error)
    setDetalleVentas(data || [])
  }

  async function obtenerGastos() {
    const { data, error } = await supabase.from('gastos').select('*').order('id', { ascending: false })
    if (error) return console.error(error)
    setGastos(data || [])
  }

  async function cargarCajaDelDia() {
    const { data: cierreHoy, error: errorHoy } = await supabase
      .from('cierres_caja')
      .select('*')
      .eq('fecha', hoy)
      .maybeSingle()

    if (errorHoy) {
      console.error(errorHoy)
      return
    }

    if (cierreHoy) {
      setCierreCajaHoy(cierreHoy)
      setSaldoInicialEfectivoManual(cierreHoy.saldo_inicial_efectivo ?? 0)
      setSaldoInicialYapeManual(cierreHoy.saldo_inicial_yape ?? 0)
      setObservacionCaja(cierreHoy.observacion || '')
      return
    }

    const { data: ultimoCierre, error: errorAnterior } = await supabase
      .from('cierres_caja')
      .select('*')
      .lt('fecha', hoy)
      .order('fecha', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (errorAnterior) {
      console.error(errorAnterior)
      return
    }

    setCierreCajaHoy(null)
    setSaldoInicialEfectivoManual(Number(ultimoCierre?.caja_real_efectivo || 0))
    setSaldoInicialYapeManual(Number(ultimoCierre?.caja_real_yape || 0))
    setObservacionCaja('')
  }

  function limpiarFormularioPlatos() {
    setNombre('')
    setPrecio('')
    setCategoria('')
    setImagenUrl('')
    setEditandoPlatoId(null)
  }

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

  function limpiarFormularioGastos() {
    setDescripcionGasto('')
    setMontoGasto('')
    setFechaGasto(hoy)
    setEstadoPagoGasto('pagado')
    setNotaPendiente('')
    setMetodoPagoGastoReal('efectivo')
    setEditandoGastoId(null)
  }

  async function guardarPlato(e) {
    e.preventDefault()

    const payload = {
      nombre: nombre.trim(),
      precio: Number(precio),
      categoria: categoria.trim(),
      imagen_url: imagenUrl.trim(),
    }

    if (editandoPlatoId) {
      const { error } = await supabase.from('platos').update(payload).eq('id', editandoPlatoId)
      if (error) return alert(`Error: ${error.message}`)
      limpiarFormularioPlatos()
      await obtenerPlatos()
      return
    }

    const { error } = await supabase.from('platos').insert([payload])
    if (error) return alert(`Error: ${error.message}`)

    limpiarFormularioPlatos()
    await obtenerPlatos()
  }

  function cargarPlatoParaEditar(plato) {
    setNombre(plato.nombre || '')
    setPrecio(plato.precio || '')
    setCategoria(plato.categoria || '')
    setImagenUrl(plato.imagen_url || '')
    setEditandoPlatoId(plato.id)
  }

  async function eliminarPlato(id) {
    if (!window.confirm('¿Seguro que deseas eliminar este plato?')) return
    const { error } = await supabase.from('platos').delete().eq('id', id)
    if (error) return alert(`Error: ${error.message}`)
    if (editandoPlatoId === id) limpiarFormularioPlatos()
    await obtenerPlatos()
  }

  function agregarAlCarrito() {
    const platoSeleccionado = platos.find((plato) => plato.id === Number(platoId))
    if (!platoSeleccionado) return alert('Debes seleccionar un plato')

    const cantidadNum = Number(cantidad)
    if (!cantidadNum || cantidadNum <= 0) return alert('La cantidad debe ser mayor a 0')

    const precioUnitario = Number(platoSeleccionado.precio)
    const subtotal = precioUnitario * cantidadNum

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
    setCarrito((prev) => prev.filter((_, i) => i !== index))
  }

  async function guardarVenta(e) {
    e.preventDefault()

    if (carrito.length === 0) return alert('Debes agregar al menos un plato a la venta')

    const totalVenta = carrito.reduce((acum, item) => acum + Number(item.subtotal), 0)

    let vueltoCalculado = 0
    let montoRecibidoFinal = null
    let fiadoNombreFinal = null
    let estadoCobroFinal = 'cobrado'
    let fechaCobroFinal = null
    let metodoCobroFinal = null

    if (metodoPago === 'efectivo') {
      if (!montoRecibido) return alert('Debes ingresar con cuánto te pagaron')
      montoRecibidoFinal = Number(montoRecibido)
      if (montoRecibidoFinal < totalVenta) return alert('El monto recibido no puede ser menor al total de la venta')
      vueltoCalculado = montoRecibidoFinal - totalVenta
      estadoCobroFinal = 'cobrado'
      fechaCobroFinal = fechaVenta
      metodoCobroFinal = 'efectivo'
    }

    if (metodoPago === 'yape') {
      estadoCobroFinal = 'cobrado'
      fechaCobroFinal = fechaVenta
      metodoCobroFinal = 'yape'
    }

    if (metodoPago === 'fiado') {
      if (!fiadoNombre.trim()) return alert('Debes ingresar el nombre o descripción del fiado')
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

    if (editandoVentaId) {
      const { error: errorVenta } = await supabase.from('ventas').update(payloadVenta).eq('id', editandoVentaId)
      if (errorVenta) return alert(`Error: ${errorVenta.message}`)

      const { error: errorDelete } = await supabase.from('detalle_ventas').delete().eq('venta_id', editandoVentaId)
      if (errorDelete) return alert(`Error al limpiar detalle: ${errorDelete.message}`)

      const detalles = carrito.map((item) => ({
        venta_id: editandoVentaId,
        plato_id: item.plato_id,
        cantidad: Number(item.cantidad),
        precio_unitario: Number(item.precio_unitario),
        subtotal: Number(item.subtotal),
      }))

      const { error: errorDetalle } = await supabase.from('detalle_ventas').insert(detalles)
      if (errorDetalle) return alert(`Error en detalle: ${errorDetalle.message}`)

      limpiarFormularioVentas()
      await obtenerVentas()
      await obtenerDetalleVentas()
      await cargarCajaDelDia()
      return
    }

    const { data: ventaCreada, error: errorVenta } = await supabase
      .from('ventas')
      .insert([payloadVenta])
      .select()
      .single()

    if (errorVenta) return alert(`Error: ${errorVenta.message}`)

    const detalles = carrito.map((item) => ({
      venta_id: ventaCreada.id,
      plato_id: item.plato_id,
      cantidad: Number(item.cantidad),
      precio_unitario: Number(item.precio_unitario),
      subtotal: Number(item.subtotal),
    }))

    const { error: errorDetalle } = await supabase.from('detalle_ventas').insert(detalles)
    if (errorDetalle) return alert(`Error en detalle: ${errorDetalle.message}`)

    limpiarFormularioVentas()
    await obtenerVentas()
    await obtenerDetalleVentas()
    await cargarCajaDelDia()
  }

  function cargarVentaParaEditar(venta) {
    const items = detalleVentas.filter((item) => item.venta_id === venta.id)

    const carritoEditado = items.map((item) => {
      const plato = platos.find((p) => p.id === item.plato_id)
      return {
        plato_id: item.plato_id,
        nombre: plato?.nombre || 'Plato eliminado',
        cantidad: Number(item.cantidad),
        precio_unitario: Number(item.precio_unitario),
        subtotal: Number(item.subtotal),
      }
    })

    setEditandoVentaId(venta.id)
    setCarrito(carritoEditado)
    setFechaVenta(venta.fecha || hoy)
    setMetodoPago(venta.metodo_pago || 'efectivo')
    setFiadoNombre(venta.fiado_nombre || '')
    setMontoRecibido(venta.monto_recibido || '')
    setPlatoId('')
    setCantidad(1)
    setSeccion('ventas')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function eliminarVenta(id) {
    if (!window.confirm('¿Seguro que deseas eliminar esta venta completa?')) return
    const { error } = await supabase.from('ventas').delete().eq('id', id)
    if (error) return alert(`Error: ${error.message}`)

    if (editandoVentaId === id) limpiarFormularioVentas()

    await obtenerVentas()
    await obtenerDetalleVentas()
    await cargarCajaDelDia()
  }

  function abrirModalCobro(venta) {
    setVentaPendienteSeleccionada(venta)
    setMetodoCobroPendiente('efectivo')
    setFechaCobroPendiente(hoy)
    setMostrarModalCobro(true)
  }

  async function confirmarCobroPendiente() {
    if (!ventaPendienteSeleccionada) return

    const { error } = await supabase
      .from('ventas')
      .update({
        estado_cobro: 'cobrado',
        fecha_cobro: fechaCobroPendiente,
        metodo_cobro: metodoCobroPendiente,
      })
      .eq('id', ventaPendienteSeleccionada.id)

    if (error) return alert(`Error: ${error.message}`)

    setMostrarModalCobro(false)
    setVentaPendienteSeleccionada(null)
    await obtenerVentas()
    await cargarCajaDelDia()
  }

  async function guardarGasto(e) {
    e.preventDefault()

    if (estadoPagoGasto === 'por_pagar' && !notaPendiente.trim()) {
      return alert('Debes ingresar una nota o descripción del pago pendiente')
    }

    const payload = {
      descripcion: descripcionGasto.trim(),
      monto: Number(montoGasto),
      fecha: fechaGasto,
      estado_pago: estadoPagoGasto,
      nota_pendiente: estadoPagoGasto === 'por_pagar' ? notaPendiente.trim() : null,
      fecha_pago: estadoPagoGasto === 'pagado' ? fechaGasto : null,
      metodo_pago_real: estadoPagoGasto === 'pagado' ? metodoPagoGastoReal : null,
    }

    if (editandoGastoId) {
      const { error } = await supabase.from('gastos').update(payload).eq('id', editandoGastoId)
      if (error) return alert(`Error: ${error.message}`)
      limpiarFormularioGastos()
      await obtenerGastos()
      await cargarCajaDelDia()
      return
    }

    const { error } = await supabase.from('gastos').insert([payload])
    if (error) return alert(`Error: ${error.message}`)

    limpiarFormularioGastos()
    await obtenerGastos()
    await cargarCajaDelDia()
  }

  function cargarGastoParaEditar(gasto) {
    setDescripcionGasto(gasto.descripcion || '')
    setMontoGasto(gasto.monto || '')
    setFechaGasto(gasto.fecha || hoy)
    setEstadoPagoGasto(gasto.estado_pago || 'pagado')
    setNotaPendiente(gasto.nota_pendiente || '')
    setMetodoPagoGastoReal(gasto.metodo_pago_real || 'efectivo')
    setEditandoGastoId(gasto.id)
    setSeccion('gastos')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function abrirModalPago(gasto) {
    setGastoPendienteSeleccionado(gasto)
    setMetodoPagoPendiente('efectivo')
    setFechaPagoPendiente(hoy)
    setMostrarModalPago(true)
  }

  async function confirmarPagoPendiente() {
    if (!gastoPendienteSeleccionado) return

    const { error } = await supabase
      .from('gastos')
      .update({
        estado_pago: 'pagado',
        nota_pendiente: null,
        fecha_pago: fechaPagoPendiente,
        metodo_pago_real: metodoPagoPendiente,
      })
      .eq('id', gastoPendienteSeleccionado.id)

    if (error) return alert(`Error: ${error.message}`)

    setMostrarModalPago(false)
    setGastoPendienteSeleccionado(null)
    await obtenerGastos()
    await cargarCajaDelDia()
  }

  async function eliminarGasto(id) {
    if (!window.confirm('¿Seguro que deseas eliminar este gasto?')) return
    const { error } = await supabase.from('gastos').delete().eq('id', id)
    if (error) return alert(`Error: ${error.message}`)
    if (editandoGastoId === id) limpiarFormularioGastos()
    await obtenerGastos()
    await cargarCajaDelDia()
  }

  async function guardarEncabezadoCaja() {
    const payload = {
      fecha: hoy,
      saldo_inicial: Number(saldoInicialEfectivoManual || 0) + Number(saldoInicialYapeManual || 0),
      saldo_inicial_efectivo: Number(saldoInicialEfectivoManual || 0),
      saldo_inicial_yape: Number(saldoInicialYapeManual || 0),
      observacion: observacionCaja || null,
      caja_real_efectivo: cierreCajaHoy?.caja_real_efectivo ?? Number(saldoInicialEfectivoManual || 0),
      caja_real_yape: cierreCajaHoy?.caja_real_yape ?? Number(saldoInicialYapeManual || 0),
      cerrado: cierreCajaHoy?.cerrado || false,
    }

    const { error } = await supabase.from('cierres_caja').upsert([payload], { onConflict: 'fecha' })
    if (error) return alert(`Error: ${error.message}`)

    await cargarCajaDelDia()
    setMostrarEditorCaja(false)
  }

  function abrirPendientes(tipo) {
    setTipoPendienteActivo(tipo)
    setSeccion('pendientes')
  }

  function obtenerDetalleDeVenta(ventaId) {
    const items = detalleVentas.filter((item) => item.venta_id === ventaId)

    return items.map((item) => {
      const plato = platos.find((p) => p.id === item.plato_id)
      return {
        ...item,
        nombre: plato?.nombre || 'Plato eliminado',
      }
    })
  }

  const ventasFiltradas = ventas.filter((venta) => {
    const items = obtenerDetalleDeVenta(venta.id)
    const textoItems = items.map((item) => item.nombre).join(' ').toLowerCase()
    const textoGeneral = `${venta.id} ${venta.fiado_nombre || ''} ${textoItems}`.toLowerCase()

    const cumpleTexto = filtroVentaTexto ? textoGeneral.includes(filtroVentaTexto.toLowerCase()) : true
    const cumpleFecha = filtroVentaFecha ? venta.fecha === filtroVentaFecha : true
    const cumpleMetodo = filtroVentaMetodo ? (venta.metodo_pago || '') === filtroVentaMetodo : true
    const cumpleEstado = filtroVentaEstado ? (venta.estado_cobro || '') === filtroVentaEstado : true

    return cumpleTexto && cumpleFecha && cumpleMetodo && cumpleEstado
  })

  const gastosFiltrados = gastos.filter((gasto) => {
    const textoGeneral = `${gasto.descripcion || ''} ${gasto.nota_pendiente || ''}`.toLowerCase()

    const cumpleTexto = filtroGastoTexto ? textoGeneral.includes(filtroGastoTexto.toLowerCase()) : true
    const cumpleFecha = filtroGastoFecha ? gasto.fecha === filtroGastoFecha : true
    const cumpleEstado = filtroGastoEstado ? (gasto.estado_pago || '') === filtroGastoEstado : true
    const cumpleMetodo = filtroGastoMetodo ? (gasto.metodo_pago_real || '') === filtroGastoMetodo : true

    return cumpleTexto && cumpleFecha && cumpleEstado && cumpleMetodo
  })

  const saldoBaseEfectivo = Number(saldoInicialEfectivoManual || 0)
  const saldoBaseYape = Number(saldoInicialYapeManual || 0)

  const ventasCobradasEfectivo = ventas
    .filter((venta) => venta.estado_cobro === 'cobrado' && venta.metodo_cobro === 'efectivo')
    .reduce((acum, venta) => acum + Number(venta.total ?? venta.monto ?? 0), 0)

  const ventasCobradasYape = ventas
    .filter((venta) => venta.estado_cobro === 'cobrado' && venta.metodo_cobro === 'yape')
    .reduce((acum, venta) => acum + Number(venta.total ?? venta.monto ?? 0), 0)

  const gastosPagadosEfectivo = gastos
    .filter((gasto) => gasto.estado_pago === 'pagado' && gasto.metodo_pago_real === 'efectivo')
    .reduce((acum, gasto) => acum + Number(gasto.monto), 0)

  const gastosPagadosYape = gastos
    .filter((gasto) => gasto.estado_pago === 'pagado' && gasto.metodo_pago_real === 'yape')
    .reduce((acum, gasto) => acum + Number(gasto.monto), 0)

  const saldoFiados = ventas
    .filter((venta) => venta.estado_cobro === 'por_cobrar')
    .reduce((acum, venta) => acum + Number(venta.total ?? venta.monto ?? 0), 0)

  const dineroPorPagar = gastos
    .filter((gasto) => gasto.estado_pago === 'por_pagar')
    .reduce((acum, gasto) => acum + Number(gasto.monto), 0)

  const saldoEfectivoActual = saldoBaseEfectivo + ventasCobradasEfectivo - gastosPagadosEfectivo
  const saldoYapeActual = saldoBaseYape + ventasCobradasYape - gastosPagadosYape

  const ventasReporte = ventas.filter((venta) => venta.fecha === fechaReporte)
  const gastosReporte = gastos.filter((gasto) => gasto.fecha === fechaReporte)

  const totalVentasReporte = ventasReporte.reduce((acum, venta) => acum + Number(venta.total ?? venta.monto ?? 0), 0)
  const totalGastosReporte = gastosReporte.reduce((acum, gasto) => acum + Number(gasto.monto), 0)
  const gananciaReporte = totalVentasReporte - totalGastosReporte

  const ventasPorCobrarReporte = ventasReporte
    .filter((venta) => venta.estado_cobro === 'por_cobrar')
    .reduce((acum, venta) => acum + Number(venta.total ?? venta.monto ?? 0), 0)

  const gastosPorPagarReporte = gastosReporte
    .filter((gasto) => gasto.estado_pago === 'por_pagar')
    .reduce((acum, gasto) => acum + Number(gasto.monto), 0)

  const ventasMes = ventas.filter((venta) => venta.fecha?.startsWith(mesReporte))
  const gastosMes = gastos.filter((gasto) => gasto.fecha?.startsWith(mesReporte))

  const totalVentasMes = ventasMes.reduce((acum, venta) => acum + Number(venta.total ?? venta.monto ?? 0), 0)
  const totalGastosMes = gastosMes.reduce((acum, gasto) => acum + Number(gasto.monto), 0)
  const gananciaMes = totalVentasMes - totalGastosMes

  const ventasPorCobrarMes = ventasMes
    .filter((venta) => venta.estado_cobro === 'por_cobrar')
    .reduce((acum, venta) => acum + Number(venta.total ?? venta.monto ?? 0), 0)

  const gastosPorPagarMes = gastosMes
    .filter((gasto) => gasto.estado_pago === 'por_pagar')
    .reduce((acum, gasto) => acum + Number(gasto.monto), 0)

  const pendientesPorCobrar = ventas
    .filter((venta) => venta.estado_cobro === 'por_cobrar')
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

  const pendientesPorPagar = gastos
    .filter((gasto) => gasto.estado_pago === 'por_pagar')
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

  const platoSeleccionadoActual = platos.find((plato) => plato.id === Number(platoId))
  const subtotalActual = platoSeleccionadoActual
    ? Number(platoSeleccionadoActual.precio) * Number(cantidad || 0)
    : 0

  const totalCarrito = carrito.reduce((acum, item) => acum + Number(item.subtotal), 0)

  const vueltoActual =
    metodoPago === 'efectivo' && montoRecibido !== ''
      ? Number(montoRecibido) - totalCarrito
      : 0

  function renderHeaderResumen() {
    const textoMonto = (valor) => {
      if (!mostrarMontosCaja) return '****'
      return `S/ ${Number(valor || 0).toFixed(2)}`
    }

    return (
      <aside className="resumen-caja">
        <div className="resumen-caja__card resumen-caja__card--horizontal">
          <div className="resumen-caja__top">
            <button
              type="button"
              className="resumen-caja__toggle"
              onClick={() => setMostrarMontosCaja(!mostrarMontosCaja)}
            >
              <span>Resumen de caja</span>
              <span>{mostrarMontosCaja ? 'Ocultar' : 'Ver'}</span>
            </button>
          </div>

          <div className="resumen-caja__inline">
            <div className="resumen-caja__dato">
              <span className="resumen-caja__label">Saldo efectivo</span>
              <strong>{textoMonto(saldoEfectivoActual)}</strong>
            </div>

            <div className="resumen-caja__dato">
              <span className="resumen-caja__label">Saldo Yape</span>
              <strong>{textoMonto(saldoYapeActual)}</strong>
            </div>

            <div className="resumen-caja__dato">
              <span className="resumen-caja__label">Saldo fiados</span>
              <strong>{textoMonto(saldoFiados)}</strong>
            </div>

            <div className="resumen-caja__dato">
              <span className="resumen-caja__label">Por pagar</span>
              <strong>{textoMonto(dineroPorPagar)}</strong>
            </div>

            {mostrarMontosCaja ? (
              <div className="resumen-caja__dato resumen-caja__dato--accion">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setMostrarEditorCaja(true)}
                >
                  Editar
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </aside>
    )
  }

  function renderTopBar() {
    return (
      <section className="hero-header">
        <div className="brand-block">
          <button
            type="button"
            className="brand-button"
            onClick={() => setSeccion('dashboard')}
            title="Volver al inicio"
          >
            <span className="brand-mark">
              <img
                src={logoCevicheBravo}
                alt="Logo Ceviche Bravo"
                className="brand-logo"
              />
            </span>

            <span className="brand-copy">
              <span className="brand-title">CevicheBravo</span>
              <span className="brand-subtitle">Sistema de control diario</span>
            </span>
          </button>
        </div>

        {renderHeaderResumen()}
      </section>
    )
  }

  function renderEditorCaja() {
    if (!mostrarEditorCaja) return null

    return (
      <div className="panel-seccion mb-4">
        <div className="panel-seccion__body">
          <h3 className="panel-titulo">Editar encabezado</h3>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Saldo inicial efectivo</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={saldoInicialEfectivoManual}
                onChange={(e) => setSaldoInicialEfectivoManual(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Saldo inicial Yape</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={saldoInicialYapeManual}
                onChange={(e) => setSaldoInicialYapeManual(e.target.value)}
              />
            </div>

            <div className="col-12">
              <label className="form-label">Observación</label>
              <textarea
                className="form-control"
                rows="2"
                value={observacionCaja}
                onChange={(e) => setObservacionCaja(e.target.value)}
              />
            </div>

            <div className="col-12 d-flex gap-2 flex-wrap">
              <button className="btn btn-primary" onClick={guardarEncabezadoCaja}>
                Guardar encabezado
              </button>
              <button className="btn btn-outline-secondary" onClick={() => setMostrarEditorCaja(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  function renderContenido() {
    if (seccion === 'dashboard') {
      return (
        <>
          {renderEditorCaja()}

          <section className="quick-access">
            <button className="quick-access__card quick-access__card--wide" onClick={() => setSeccion('ventas')}>
              <span className="quick-access__eyebrow">Movimiento principal</span>
              <h3>Ventas</h3>
              <p>Registra, edita y consulta ventas completas con varios platos.</p>
            </button>

            <button className="quick-access__card" onClick={() => setSeccion('gastos')}>
              <span className="quick-access__eyebrow">Control diario</span>
              <h3>Gastos</h3>
              <p>Guarda, edita y consulta gastos pagados y pendientes.</p>
            </button>

            <button className="quick-access__card" onClick={() => setSeccion('reportes')}>
              <span className="quick-access__eyebrow">Resumen</span>
              <h3>Reportes</h3>
              <p>Revisa resultados por día y por mes.</p>
            </button>

            <button className="quick-access__card" onClick={() => setSeccion('pendientes')}>
              <span className="quick-access__eyebrow">Seguimiento</span>
              <h3>Pendientes</h3>
              <p>Consulta fiados y pagos pendientes.</p>
            </button>

            <button className="quick-access__card" onClick={() => setSeccion('platos')}>
              <span className="quick-access__eyebrow">Catálogo</span>
              <h3>Platos</h3>
              <p>Edita nombres, precios y categorías.</p>
            </button>
          </section>
        </>
      )
    }

    if (seccion === 'platos') {
      return (
        <>
          {renderEditorCaja()}
          <div className="row g-4">
            <div className="col-12 col-xl-5">
              <div className="panel-seccion h-100">
                <div className="panel-seccion__body">
                  <h3 className="panel-titulo">{editandoPlatoId ? 'Editar plato' : 'Registrar plato'}</h3>

                  <form onSubmit={guardarPlato}>
                    <div className="mb-3">
                      <label className="form-label">Nombre</label>
                      <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Precio</label>
                      <input type="number" step="0.01" className="form-control" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Categoría</label>
                      <input type="text" className="form-control" value={categoria} onChange={(e) => setCategoria(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">URL de imagen</label>
                      <input type="text" className="form-control" value={imagenUrl} onChange={(e) => setImagenUrl(e.target.value)} />
                    </div>

                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-primary w-100">
                        {editandoPlatoId ? 'Actualizar plato' : 'Guardar plato'}
                      </button>

                      {editandoPlatoId ? (
                        <button type="button" className="btn btn-outline-secondary" onClick={limpiarFormularioPlatos}>
                          Cancelar
                        </button>
                      ) : null}
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-12 col-xl-7">
              <div className="panel-seccion h-100">
                <div className="panel-seccion__body">
                  <h3 className="panel-titulo">Lista de platos</h3>

                  {platos.length === 0 ? (
                    <p className="panel-texto">No hay platos registrados todavía.</p>
                  ) : (
                    <div className="row g-3">
                      {platos.map((plato) => (
                        <div className="col-12 col-md-6" key={plato.id}>
                          <div className="item-card h-100">
                            <h5 className="item-card__title">{plato.nombre}</h5>
                            <p className="item-card__text"><strong>Precio:</strong> S/ {Number(plato.precio).toFixed(2)}</p>
                            <p className="item-card__text"><strong>Categoría:</strong> {plato.categoria}</p>

                            {plato.imagen_url ? (
                              <img src={plato.imagen_url} alt={plato.nombre} className="img-fluid rounded mt-3 mb-3" />
                            ) : null}

                            <div className="d-flex gap-2 flex-wrap">
                              <button className="btn btn-warning btn-sm" onClick={() => cargarPlatoParaEditar(plato)}>
                                Editar
                              </button>
                              <button className="btn btn-danger btn-sm" onClick={() => eliminarPlato(plato.id)}>
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
        </>
      )
    }

    if (seccion === 'ventas') {
      return (
        <>
          {renderEditorCaja()}
          <div className="row g-4">
            <div className="col-12 col-xl-5">
              <div className="panel-seccion h-100">
                <div className="panel-seccion__body">
                  <h3 className="panel-titulo">{editandoVentaId ? `Editar venta #${editandoVentaId}` : 'Registrar venta'}</h3>

                  <form onSubmit={guardarVenta}>
                    <div className="mb-3">
                      <label className="form-label">Plato</label>
                      <select className="form-select" value={platoId} onChange={(e) => setPlatoId(e.target.value)}>
                        <option value="">Seleccione un plato</option>
                        {platos.map((plato) => (
                          <option key={plato.id} value={plato.id}>
                            {plato.nombre} - S/ {Number(plato.precio).toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Cantidad</label>
                      <input type="number" min="1" className="form-control" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Subtotal del ítem</label>
                      <input type="text" className="form-control" value={`S/ ${subtotalActual.toFixed(2)}`} readOnly />
                    </div>

                    <div className="d-grid mb-4">
                      <button type="button" className="btn btn-outline-primary" onClick={agregarAlCarrito}>
                        Agregar plato a la venta
                      </button>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Fecha</label>
                      <input type="date" className="form-control" value={fechaVenta} onChange={(e) => setFechaVenta(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Método de pago</label>
                      <select className="form-select" value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} required>
                        <option value="efectivo">Efectivo</option>
                        <option value="yape">Yape</option>
                        <option value="fiado">Fiado</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Total de la venta</label>
                      <input type="text" className="form-control" value={`S/ ${totalCarrito.toFixed(2)}`} readOnly />
                    </div>

                    {metodoPago === 'efectivo' ? (
                      <>
                        <div className="mb-3">
                          <label className="form-label">Con cuánto pagó</label>
                          <input type="number" step="0.01" className="form-control" value={montoRecibido} onChange={(e) => setMontoRecibido(e.target.value)} required />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Vuelto</label>
                          <input
                            type="text"
                            className="form-control"
                            value={vueltoActual >= 0 ? `S/ ${vueltoActual.toFixed(2)}` : 'Monto insuficiente'}
                            readOnly
                          />
                        </div>
                      </>
                    ) : null}

                    {metodoPago === 'fiado' ? (
                      <div className="mb-3">
                        <label className="form-label">Nombre o descripción del fiado</label>
                        <input type="text" className="form-control" value={fiadoNombre} onChange={(e) => setFiadoNombre(e.target.value)} required />
                      </div>
                    ) : null}

                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-primary w-100">
                        {editandoVentaId ? 'Actualizar venta completa' : 'Guardar venta completa'}
                      </button>
                      <button type="button" className="btn btn-outline-secondary" onClick={limpiarFormularioVentas}>
                        {editandoVentaId ? 'Cancelar edición' : 'Limpiar'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-12 col-xl-7">
              <div className="panel-seccion mb-4">
                <div className="panel-seccion__body">
                  <h3 className="panel-titulo">{editandoVentaId ? 'Detalle que se está editando' : 'Venta actual'}</h3>

                  {carrito.length === 0 ? (
                    <p className="panel-texto">Todavía no agregaste platos a esta venta.</p>
                  ) : (
                    <div className="stack-list">
                      {carrito.map((item, index) => (
                        <div className="item-card" key={`${item.plato_id}-${index}`}>
                          <h5 className="item-card__title">{item.nombre}</h5>
                          <p className="item-card__text"><strong>Cantidad:</strong> {item.cantidad}</p>
                          <p className="item-card__text"><strong>Precio unitario:</strong> S/ {Number(item.precio_unitario).toFixed(2)}</p>
                          <p className="item-card__text"><strong>Subtotal:</strong> S/ {Number(item.subtotal).toFixed(2)}</p>
                          <div className="d-flex gap-2 flex-wrap mt-3">
                            <button className="btn btn-danger btn-sm" onClick={() => eliminarDelCarrito(index)}>
                              Quitar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="panel-seccion h-100">
                <div className="panel-seccion__body">
                  <h3 className="panel-titulo">Historial de ventas</h3>

                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-6">
                      <label className="form-label">Buscar por número, fiado o plato</label>
                      <input
                        type="text"
                        className="form-control"
                        value={filtroVentaTexto}
                        onChange={(e) => setFiltroVentaTexto(e.target.value)}
                        placeholder="Ej: 12, Carlos, ceviche"
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Filtrar por fecha</label>
                      <input
                        type="date"
                        className="form-control"
                        value={filtroVentaFecha}
                        onChange={(e) => setFiltroVentaFecha(e.target.value)}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Filtrar por método</label>
                      <select className="form-select" value={filtroVentaMetodo} onChange={(e) => setFiltroVentaMetodo(e.target.value)}>
                        <option value="">Todos</option>
                        <option value="efectivo">Efectivo</option>
                        <option value="yape">Yape</option>
                        <option value="fiado">Fiado</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Filtrar por estado</label>
                      <select className="form-select" value={filtroVentaEstado} onChange={(e) => setFiltroVentaEstado(e.target.value)}>
                        <option value="">Todos</option>
                        <option value="cobrado">Cobrado</option>
                        <option value="por_cobrar">Por cobrar</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setFiltroVentaTexto('')
                          setFiltroVentaFecha('')
                          setFiltroVentaMetodo('')
                          setFiltroVentaEstado('')
                        }}
                      >
                        Limpiar filtros
                      </button>
                    </div>
                  </div>

                  {ventasFiltradas.length === 0 ? (
                    <p className="panel-texto">No hay ventas que coincidan con los filtros.</p>
                  ) : (
                    <div className="stack-list">
                      {ventasFiltradas.map((venta) => {
                        const items = obtenerDetalleDeVenta(venta.id)
                        return (
                          <div className="item-card" key={venta.id}>
                            <h5 className="item-card__title">Venta #{venta.id}</h5>
                            <p className="item-card__text"><strong>Fecha:</strong> {venta.fecha}</p>
                            <p className="item-card__text text-capitalize"><strong>Método:</strong> {venta.metodo_pago || 'efectivo'}</p>
                            <p className="item-card__text text-capitalize"><strong>Estado:</strong> {venta.estado_cobro || 'cobrado'}</p>
                            <p className="item-card__text"><strong>Total:</strong> S/ {Number(venta.total ?? venta.monto ?? 0).toFixed(2)}</p>

                            {venta.metodo_pago === 'fiado' ? (
                              <p className="item-card__text"><strong>Por cobrar a:</strong> {venta.fiado_nombre}</p>
                            ) : null}

                            {venta.estado_cobro === 'cobrado' && venta.metodo_cobro ? (
                              <p className="item-card__text text-capitalize"><strong>Cobrado por:</strong> {venta.metodo_cobro}</p>
                            ) : null}

                            {items.length > 0 ? (
                              <div className="detalle-box">
                                <strong>Detalle:</strong>
                                <ul className="detalle-box__list">
                                  {items.map((item) => (
                                    <li key={item.id}>
                                      {item.nombre} x{item.cantidad} — S/ {Number(item.subtotal).toFixed(2)}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : null}

                            <div className="d-flex gap-2 flex-wrap mt-3">
                              <button className="btn btn-warning btn-sm" onClick={() => cargarVentaParaEditar(venta)}>
                                Editar
                              </button>

                              {venta.estado_cobro === 'por_cobrar' ? (
                                <button className="btn btn-success btn-sm" onClick={() => abrirModalCobro(venta)}>
                                  Marcar como cobrada
                                </button>
                              ) : null}

                              <button className="btn btn-danger btn-sm" onClick={() => eliminarVenta(venta.id)}>
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
        </>
      )
    }

    if (seccion === 'gastos') {
      return (
        <>
          {renderEditorCaja()}
          <div className="row g-4">
            <div className="col-12 col-xl-5">
              <div className="panel-seccion h-100">
                <div className="panel-seccion__body">
                  <h3 className="panel-titulo">{editandoGastoId ? 'Editar gasto' : 'Registrar gasto'}</h3>

                  <form onSubmit={guardarGasto}>
                    <div className="mb-3">
                      <label className="form-label">Descripción</label>
                      <input
                        list="gastos-frecuentes"
                        type="text"
                        className="form-control"
                        value={descripcionGasto}
                        onChange={(e) => setDescripcionGasto(e.target.value)}
                        required
                      />
                      <datalist id="gastos-frecuentes">
                        {gastosFrecuentes.map((gasto) => (
                          <option key={gasto} value={gasto} />
                        ))}
                      </datalist>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Monto</label>
                      <input type="number" step="0.01" className="form-control" value={montoGasto} onChange={(e) => setMontoGasto(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Fecha</label>
                      <input type="date" className="form-control" value={fechaGasto} onChange={(e) => setFechaGasto(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Estado del gasto</label>
                      <select className="form-select" value={estadoPagoGasto} onChange={(e) => setEstadoPagoGasto(e.target.value)} required>
                        <option value="pagado">Pagado</option>
                        <option value="por_pagar">Por pagar</option>
                      </select>
                    </div>

                    {estadoPagoGasto === 'pagado' ? (
                      <div className="mb-3">
                        <label className="form-label">Método de pago real</label>
                        <select
                          className="form-select"
                          value={metodoPagoGastoReal}
                          onChange={(e) => setMetodoPagoGastoReal(e.target.value)}
                          required
                        >
                          <option value="efectivo">Efectivo</option>
                          <option value="yape">Yape</option>
                        </select>
                      </div>
                    ) : null}

                    {estadoPagoGasto === 'por_pagar' ? (
                      <div className="mb-3">
                        <label className="form-label">Descripción del pendiente</label>
                        <input type="text" className="form-control" value={notaPendiente} onChange={(e) => setNotaPendiente(e.target.value)} required />
                      </div>
                    ) : null}

                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-primary w-100">
                        {editandoGastoId ? 'Actualizar gasto' : 'Guardar gasto'}
                      </button>

                      <button type="button" className="btn btn-outline-secondary" onClick={limpiarFormularioGastos}>
                        {editandoGastoId ? 'Cancelar edición' : 'Limpiar'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-12 col-xl-7">
              <div className="panel-seccion h-100">
                <div className="panel-seccion__body">
                  <h3 className="panel-titulo">Historial de gastos</h3>

                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-6">
                      <label className="form-label">Buscar por descripción o nota</label>
                      <input
                        type="text"
                        className="form-control"
                        value={filtroGastoTexto}
                        onChange={(e) => setFiltroGastoTexto(e.target.value)}
                        placeholder="Ej: limón, delivery, deuda"
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Filtrar por fecha</label>
                      <input
                        type="date"
                        className="form-control"
                        value={filtroGastoFecha}
                        onChange={(e) => setFiltroGastoFecha(e.target.value)}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Filtrar por estado</label>
                      <select className="form-select" value={filtroGastoEstado} onChange={(e) => setFiltroGastoEstado(e.target.value)}>
                        <option value="">Todos</option>
                        <option value="pagado">Pagado</option>
                        <option value="por_pagar">Por pagar</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Filtrar por método</label>
                      <select className="form-select" value={filtroGastoMetodo} onChange={(e) => setFiltroGastoMetodo(e.target.value)}>
                        <option value="">Todos</option>
                        <option value="efectivo">Efectivo</option>
                        <option value="yape">Yape</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setFiltroGastoTexto('')
                          setFiltroGastoFecha('')
                          setFiltroGastoEstado('')
                          setFiltroGastoMetodo('')
                        }}
                      >
                        Limpiar filtros
                      </button>
                    </div>
                  </div>

                  {gastosFiltrados.length === 0 ? (
                    <p className="panel-texto">No hay gastos que coincidan con los filtros.</p>
                  ) : (
                    <div className="stack-list">
                      {gastosFiltrados.map((gasto) => (
                        <div className="item-card" key={gasto.id}>
                          <h5 className="item-card__title">{gasto.descripcion}</h5>
                          <p className="item-card__text"><strong>Monto:</strong> S/ {Number(gasto.monto).toFixed(2)}</p>
                          <p className="item-card__text"><strong>Fecha:</strong> {gasto.fecha}</p>
                          <p className="item-card__text text-capitalize"><strong>Estado:</strong> {gasto.estado_pago || 'pagado'}</p>

                          {gasto.estado_pago === 'por_pagar' ? (
                            <p className="item-card__text"><strong>Pendiente:</strong> {gasto.nota_pendiente}</p>
                          ) : null}

                          {gasto.estado_pago === 'pagado' && gasto.metodo_pago_real ? (
                            <p className="item-card__text text-capitalize"><strong>Pagado por:</strong> {gasto.metodo_pago_real}</p>
                          ) : null}

                          <div className="d-flex gap-2 flex-wrap mt-3">
                            <button className="btn btn-warning btn-sm" onClick={() => cargarGastoParaEditar(gasto)}>
                              Editar
                            </button>

                            {gasto.estado_pago === 'por_pagar' ? (
                              <button className="btn btn-success btn-sm" onClick={() => abrirModalPago(gasto)}>
                                Marcar como pagado
                              </button>
                            ) : null}

                            <button className="btn btn-danger btn-sm" onClick={() => eliminarGasto(gasto.id)}>
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )
    }

    if (seccion === 'pendientes') {
      return (
        <>
          {renderEditorCaja()}
          <div className="panel-seccion">
            <div className="panel-seccion__body">
              <div className="d-flex flex-wrap gap-2 mb-3">
                <button
                  className={`btn ${tipoPendienteActivo === 'por_cobrar' ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={() => setTipoPendienteActivo('por_cobrar')}
                >
                  Ventas por cobrar
                </button>
                <button
                  className={`btn ${tipoPendienteActivo === 'por_pagar' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                  onClick={() => setTipoPendienteActivo('por_pagar')}
                >
                  Gastos por pagar
                </button>
              </div>

              {tipoPendienteActivo === 'por_cobrar' ? (
                <>
                  <h3 className="panel-titulo">Ventas por cobrar</h3>

                  {pendientesPorCobrar.length === 0 ? (
                    <p className="panel-texto mb-0">No hay ventas pendientes por cobrar.</p>
                  ) : (
                    <div className="stack-list">
                      {pendientesPorCobrar.map((venta) => (
                        <div className="item-card" key={venta.id}>
                          <h5 className="item-card__title">Venta #{venta.id}</h5>
                          <p className="item-card__text"><strong>Monto:</strong> S/ {Number(venta.total ?? venta.monto ?? 0).toFixed(2)}</p>
                          <p className="item-card__text"><strong>Fecha:</strong> {venta.fecha}</p>
                          <p className="item-card__text"><strong>Cliente / referencia:</strong> {venta.fiado_nombre}</p>

                          <div className="d-flex gap-2 flex-wrap mt-3">
                            <button className="btn btn-success btn-sm" onClick={() => abrirModalCobro(venta)}>
                              Marcar como cobrada
                            </button>
                            <button className="btn btn-primary btn-sm" onClick={() => setSeccion('ventas')}>
                              Ir a ventas
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h3 className="panel-titulo">Gastos por pagar</h3>

                  {pendientesPorPagar.length === 0 ? (
                    <p className="panel-texto mb-0">No hay gastos pendientes por pagar.</p>
                  ) : (
                    <div className="stack-list">
                      {pendientesPorPagar.map((gasto) => (
                        <div className="item-card" key={gasto.id}>
                          <h5 className="item-card__title">{gasto.descripcion}</h5>
                          <p className="item-card__text"><strong>Monto:</strong> S/ {Number(gasto.monto).toFixed(2)}</p>
                          <p className="item-card__text"><strong>Fecha:</strong> {gasto.fecha}</p>
                          <p className="item-card__text"><strong>Pendiente:</strong> {gasto.nota_pendiente}</p>

                          <div className="d-flex gap-2 flex-wrap mt-3">
                            <button className="btn btn-success btn-sm" onClick={() => abrirModalPago(gasto)}>
                              Marcar como pagado
                            </button>
                            <button className="btn btn-primary btn-sm" onClick={() => setSeccion('gastos')}>
                              Ir a gastos
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )
    }

    return (
      <>
        {renderEditorCaja()}
        <div className="row g-4">
          <div className="col-12">
            <div className="panel-seccion mb-4">
              <div className="panel-seccion__body">
                <h3 className="panel-titulo">Reporte diario</h3>

                <div className="row g-3 align-items-end">
                  <div className="col-12 col-md-4">
                    <label className="form-label">Selecciona una fecha</label>
                    <input type="date" className="form-control" value={fechaReporte} onChange={(e) => setFechaReporte(e.target.value)} />
                  </div>

                  <div className="col-12 col-md-8">
                    <div className="row g-3">
                      <div className="col-12 col-md-3">
                        <div className="mini-stat">
                          <span className="mini-stat__label">Ventas</span>
                          <strong>S/ {totalVentasReporte.toFixed(2)}</strong>
                        </div>
                      </div>

                      <div className="col-12 col-md-3">
                        <div className="mini-stat">
                          <span className="mini-stat__label">Gastos</span>
                          <strong>S/ {totalGastosReporte.toFixed(2)}</strong>
                        </div>
                      </div>

                      <div className="col-12 col-md-3">
                        <button type="button" className="mini-stat mini-stat--button" onClick={() => abrirPendientes('por_cobrar')}>
                          <span className="mini-stat__label">Por cobrar</span>
                          <strong>S/ {ventasPorCobrarReporte.toFixed(2)}</strong>
                        </button>
                      </div>

                      <div className="col-12 col-md-3">
                        <button type="button" className="mini-stat mini-stat--button" onClick={() => abrirPendientes('por_pagar')}>
                          <span className="mini-stat__label">Por pagar</span>
                          <strong>S/ {gastosPorPagarReporte.toFixed(2)}</strong>
                        </button>
                      </div>

                      <div className="col-12">
                        <div className="mini-stat mini-stat--wide">
                          <span className="mini-stat__label">Ganancia del día</span>
                          <strong>S/ {gananciaReporte.toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel-seccion">
              <div className="panel-seccion__body">
                <h3 className="panel-titulo">Reporte mensual</h3>

                <div className="row g-3 align-items-end">
                  <div className="col-12 col-md-4">
                    <label className="form-label">Selecciona un mes</label>
                    <input type="month" className="form-control" value={mesReporte} onChange={(e) => setMesReporte(e.target.value)} />
                  </div>

                  <div className="col-12 col-md-8">
                    <div className="row g-3">
                      <div className="col-12 col-md-3">
                        <div className="mini-stat">
                          <span className="mini-stat__label">Ventas del mes</span>
                          <strong>S/ {totalVentasMes.toFixed(2)}</strong>
                        </div>
                      </div>

                      <div className="col-12 col-md-3">
                        <div className="mini-stat">
                          <span className="mini-stat__label">Gastos del mes</span>
                          <strong>S/ {totalGastosMes.toFixed(2)}</strong>
                        </div>
                      </div>

                      <div className="col-12 col-md-3">
                        <button type="button" className="mini-stat mini-stat--button" onClick={() => abrirPendientes('por_cobrar')}>
                          <span className="mini-stat__label">Por cobrar</span>
                          <strong>S/ {ventasPorCobrarMes.toFixed(2)}</strong>
                        </button>
                      </div>

                      <div className="col-12 col-md-3">
                        <button type="button" className="mini-stat mini-stat--button" onClick={() => abrirPendientes('por_pagar')}>
                          <span className="mini-stat__label">Por pagar</span>
                          <strong>S/ {gastosPorPagarMes.toFixed(2)}</strong>
                        </button>
                      </div>

                      <div className="col-12">
                        <div className="mini-stat mini-stat--wide">
                          <span className="mini-stat__label">Ganancia del mes</span>
                          <strong>S/ {gananciaMes.toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="app-shell">
      <div className="app-shell__inner">
        {renderTopBar()}

        <main className="contenido-principal">
          {renderContenido()}
        </main>
      </div>

      {mostrarModalCobro ? (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.45)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cobrar fiado</h5>
                <button type="button" className="btn-close" onClick={() => setMostrarModalCobro(false)}></button>
              </div>
              <div className="modal-body">
                <p className="mb-2"><strong>Cliente:</strong> {ventaPendienteSeleccionada?.fiado_nombre}</p>
                <p className="mb-3"><strong>Monto:</strong> S/ {Number(ventaPendienteSeleccionada?.total ?? ventaPendienteSeleccionada?.monto ?? 0).toFixed(2)}</p>

                <div className="mb-3">
                  <label className="form-label">Fecha de cobro</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fechaCobroPendiente}
                    onChange={(e) => setFechaCobroPendiente(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Método de cobro</label>
                  <select
                    className="form-select"
                    value={metodoCobroPendiente}
                    onChange={(e) => setMetodoCobroPendiente(e.target.value)}
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="yape">Yape</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={() => setMostrarModalCobro(false)}>
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={confirmarCobroPendiente}>
                  Confirmar cobro
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {mostrarModalPago ? (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.45)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Pagar pendiente</h5>
                <button type="button" className="btn-close" onClick={() => setMostrarModalPago(false)}></button>
              </div>
              <div className="modal-body">
                <p className="mb-2"><strong>Gasto:</strong> {gastoPendienteSeleccionado?.descripcion}</p>
                <p className="mb-3"><strong>Monto:</strong> S/ {Number(gastoPendienteSeleccionado?.monto || 0).toFixed(2)}</p>

                <div className="mb-3">
                  <label className="form-label">Fecha de pago</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fechaPagoPendiente}
                    onChange={(e) => setFechaPagoPendiente(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Método de pago</label>
                  <select
                    className="form-select"
                    value={metodoPagoPendiente}
                    onChange={(e) => setMetodoPagoPendiente(e.target.value)}
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="yape">Yape</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={() => setMostrarModalPago(false)}>
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={confirmarPagoPendiente}>
                  Confirmar pago
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App