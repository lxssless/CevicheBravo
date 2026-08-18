import { supabase } from "../supabaseClient";

export async function listarPlatos() {
  const { data, error } = await supabase
    .from("platos")
    .select("*")
    .order("id", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function crearPlato(payload) {
  const { data, error } = await supabase
    .from("platos")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function actualizarPlato(id, payload) {
  const { data, error } = await supabase
    .from("platos")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function eliminarPlatoPorId(id) {
  const { error } = await supabase
    .from("platos")
    .delete()
    .eq("id", id);

  if (error) throw error;
}