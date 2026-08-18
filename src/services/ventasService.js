import { supabase } from '../supabaseClient'

export async function listarVentas() {
  const { data, error } = await supabase
    .from('ventas')
    .select('*')
    .order('id', { ascending: false })

  if (error) throw error

  return data ?? []
}

export async function listarDetalleVentas() {
  const { data, error } = await supabase
    .from('detalle_ventas')
    .select('*')
    .order('id', { ascending: false })

  if (error) throw error

  return data ?? []
}

export async function crearVenta(payloadVenta) {
  const { data, error } = await supabase
    .from('ventas')
    .insert([payloadVenta])
    .select()
    .single()

  if (error) throw error

  return data
}

export async function actualizarVenta(id, payloadVenta) {
  const { data, error } = await supabase
    .from('ventas')
    .update(payloadVenta)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data
}

export async function eliminarDetallesDeVenta(ventaId) {
  const { error } = await supabase
    .from('detalle_ventas')
    .delete()
    .eq('venta_id', ventaId)

  if (error) throw error
}

export async function crearDetallesVenta(detalles) {
  if (!detalles.length) {
    return []
  }

  const { data, error } = await supabase
    .from('detalle_ventas')
    .insert(detalles)
    .select()

  if (error) throw error

  return data ?? []
}

export async function eliminarVentaPorId(id) {
  const { error } = await supabase
    .from('ventas')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function marcarVentaComoCobrada(id, payloadCobro) {
  const { data, error } = await supabase
    .from('ventas')
    .update({
      estado_cobro: 'cobrado',
      fecha_cobro: payloadCobro.fecha_cobro,
      metodo_cobro: payloadCobro.metodo_cobro,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data
}