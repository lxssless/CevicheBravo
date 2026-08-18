import { supabase } from '../supabaseClient'

export async function listarGastos() {
  const { data, error } = await supabase
    .from('gastos')
    .select('*')
    .order('id', { ascending: false })

  if (error) throw error

  return data ?? []
}

export async function crearGasto(payload) {
  const { data, error } = await supabase
    .from('gastos')
    .insert([payload])
    .select()
    .single()

  if (error) throw error

  return data
}

export async function actualizarGasto(id, payload) {
  const { data, error } = await supabase
    .from('gastos')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data
}

export async function marcarGastoComoPagado(id, payloadPago) {
  const { data, error } = await supabase
    .from('gastos')
    .update({
      estado_pago: 'pagado',
      nota_pendiente: null,
      fecha_pago: payloadPago.fecha_pago,
      metodo_pago_real: payloadPago.metodo_pago_real,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data
}

export async function eliminarGastoPorId(id) {
  const { error } = await supabase
    .from('gastos')
    .delete()
    .eq('id', id)

  if (error) throw error
}