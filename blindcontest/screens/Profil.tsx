import { Text, Pressable } from "react-native";
import supabase from "../helpers/supabase";
import { useAuth } from "../helpers/auth-provider"
import Layout from "../components/Layout";
import gstyles from "../components/Styles";

export default function Profil() {
    const { user } = useAuth();

    const logOut = async () => {
        await supabase.auth.signOut();
    }

    return (
        <Layout>
            <Text style={gstyles.input}>{user?.email}</Text>

            <Pressable onPress={logOut} style={gstyles.button}>
                <Text style={gstyles.buttonText}>Déconnexion</Text>
            </Pressable>
        </Layout>
    );
}