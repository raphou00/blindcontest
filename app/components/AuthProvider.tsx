import { useState, useEffect, useContext, createContext, ReactNode } from "react";
import { User, AuthChangeEvent, Session } from "@supabase/supabase-js";
import supabase from "../lib/supabase";

type AuthContext = {
    user: User | null; 
};

const authContext: React.Context<AuthContext | {}> = createContext({});

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            if (session) setUser(session.user);
            else setUser(null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <authContext.Provider value={{ user }}>
            { children }
        </authContext.Provider>
    );
};

const useAuth = () => useContext(authContext) as AuthContext;

export default AuthProvider;
export { useAuth };