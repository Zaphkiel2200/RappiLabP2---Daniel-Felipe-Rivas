import { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

const useSupabase = (): SupabaseClient => supabase;

export default useSupabase;
