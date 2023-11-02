import { StyleSheet, View, Text, Pressable } from "react-native";
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
            <View style={{ gap: 50 }}>
                <View style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Text style={{...gstyles.buttonText, fontSize: 30}}>Vos points :</Text>
                    <Text style={styles.point}>{user?.user_metadata.point}</Text>
                </View>

                <View>
                    <Text style={{...gstyles.buttonText, textAlign: "left", padding: 5}}>Votre E-Mail :</Text>
                    <Text style={gstyles.input}>{user?.email}</Text>
                </View>

                <Pressable onPress={logOut} style={{...gstyles.button, width: 300}}>
                    <Text style={gstyles.buttonText}>Déconnexion</Text>
                </Pressable>
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    point: {
        fontSize: 100,
        fontWeight: "bold",
        color: "#646CFF",
        padding: 10,
        borderWidth: 2,
        borderRadius: 100,
        borderColor: "#646CFF",
        height: 200,
        width: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
});