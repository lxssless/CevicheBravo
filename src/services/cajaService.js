import { supabase } from '../supabaseClient'

export async function obtenerCajaPorFecha(fecha) {
  const { data, error } = await supabase
    .from('cierres_caja')
    .select('*')
    .eq('fecha', fecha)
    .maybeSingle()

  if (error) throw error

  return data
}

export async function obtenerUltimaCajaAntesDe(fecha) {
  const { data, error } = await supabase
    .from('cierres_caja')
    .select('*')
    .lt('fecha', fecha)
    .order('fecha', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error

  return data
}

export async function guardarCajaPorFecha(payload) {
  const { data, error } = await supabase
    .from('cierres_caja')
    .upsert(payload, {
      onConflict: 'fecha',
    })
    .select()
    .single()

  if (error) throw error

  return data
}