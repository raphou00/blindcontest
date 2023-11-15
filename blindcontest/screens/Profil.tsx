import { StyleSheet, View, Text, Pressable } from "react-native";
import supabase from "../lib/supabase";
import { useAuth } from "../components/AuthProvider"
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
                    <Text style={{...gstyles.buttonText, fontSize: 30}}>Points</Text>
                    <View style={styles.point}>
                        <Text style={styles.pointText}>{user?.user_metadata.point}</Text>
                    </View>
                </View>

                <View>
                    <Text style={{...gstyles.buttonText, textAlign: "left", padding: 5}}>E-Mail</Text>
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
        padding: 10,
        borderWidth: 2,
        borderRadius: 100,
        borderColor: "slateblue",
        height: 200,
        width: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    pointText: {
        fontSize: 100,
        fontWeight: "bold",
        color: "slateblue",
    }
});