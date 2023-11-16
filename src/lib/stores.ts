import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { writable } from "svelte/store";

export const supabase = writable<SupabaseClient<any, "public", any>>();
export const session = writable<Session | null>();
export const refresh = writable(true);