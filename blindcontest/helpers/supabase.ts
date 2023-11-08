import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supa_url: string = "https://dhnvcwntyfjpzhzdelht.supabase.co";
const supa_anon: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRobnZjd250eWZqcHpoemRlbGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY0OTAxNDUsImV4cCI6MjAxMjA2NjE0NX0.EbfxrScGQ_Rp58UzZAZQB2TwJqh224J6XoFgQ1j9uFw";

const supabase: SupabaseClient = createClient(supa_url, supa_anon, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },

});

export default supabase;