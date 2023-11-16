// Import des hooks et types nécessaires depuis les bibliothèques React et Supabase
import { useState, useEffect, useContext, createContext, ReactNode } from "react";
import { User, AuthChangeEvent, Session } from "@supabase/supabase-js";
import supabase from "../lib/supabase";

// Définition d'un type pour le contexte d'authentification
type AuthContext = {
    user: User | null; // Le type d'utilisateur ou null s'il n'est pas connecté
};

// Création du contexte d'authentification
const authContext: React.Context<AuthContext | {}> = createContext({});

// Composant fournisseur d'authentification qui utilise le contexte
const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
    // État local pour stocker l'utilisateur actuellement connecté
    const [user, setUser] = useState<User | null>(null);

    // Effet secondaire pour souscrire aux changements d'état d'authentification avec Supabase
    useEffect(() => {
        // On utilise la méthode onAuthStateChange de Supabase
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            // Mise à jour de l'état local lorsque l'état d'authentification change
            if (session) setUser(session.user);
            else setUser(null);
        });

        // Nettoyage de l'abonnement lorsque le composant est démonté
        return () => {
            subscription.unsubscribe();
        };
    }, []); // S'exécute une seule fois lors du montage initial

    // Rendu du composant avec le contexte d'authentification fourni
    return (
        <authContext.Provider value={{ user }}>
            { children }
        </authContext.Provider>
    );
};

// Hook personnalisé pour consommer le contexte d'authentification
const useAuth = () => useContext(authContext) as AuthContext;

// Export du composant et du hook pour une utilisation ailleurs dans l'application
export default AuthProvider;
export { useAuth };