import { useState, useEffect, useContext, createContext, ReactNode } from "react";
import { User, AuthChangeEvent, Session } from "@supabase/supabase-js";
import supabase from "./supabase";

type AuthContextProps = {
    user: User | null
};

const AuthContext: React.Context<AuthContextProps | {}> = createContext({});

const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            if (session) setUser(session.user);
            else setUser(null);
        });

        return () => {
            subscription.unsubscribe();
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            { children }
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext) as AuthContextProps;

export default AuthProvider;
export { useAuth };