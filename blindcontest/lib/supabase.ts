// Importation de AsyncStorage pour le stockage local dans React Native
import AsyncStorage from "@react-native-async-storage/async-storage";

// Importation des fonctions nécessaires de la bibliothèque Supabase
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Importation du polyfill URL pour React Native
import "react-native-url-polyfill/auto";

// URL de votre projet Supabase
const supa_url: string = "https://dhnvcwntyfjpzhzdelht.supabase.co";

// Clé d'accès anonyme à votre projet Supabase
const supa_anon: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRobnZjd250eWZqcHpoemRlbGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY0OTAxNDUsImV4cCI6MjAxMjA2NjE0NX0.EbfxrScGQ_Rp58UzZAZQB2TwJqh224J6XoFgQ1j9uFw";

// Création d'une instance de SupabaseClient avec les paramètres nécessaires
const supabase: SupabaseClient = createClient(supa_url, supa_anon, {
    auth: {
        // Configuration du stockage local pour les informations d'authentification
        storage: AsyncStorage,
        autoRefreshToken: true, // Actualisation automatique du jeton d'authentification
        persistSession: true, // Persistance de la session d'authentification
        detectSessionInUrl: false, // Désactivation de la détection de la session dans l'URL
    }
});

// Exportation de l'instance de SupabaseClient pour une utilisation dans d'autres fichiers
export default supabase;
