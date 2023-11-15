import { StyleSheet, View, Text, Image } from "react-native";
import { Link } from "@react-navigation/native";
import { useAuth } from "../components/AuthProvider";
import Layout from "../components/Layout";
import gstyles from "../components/Styles";

export default function Home() {
    const { user } = useAuth();
    
    return (
        <Layout>
            <Image style={styles.homeImg} source={require("../assets/blindcontest.png")} />
            <Text style={styles.homeTitle}>blind contest</Text>
            
            <View style={styles.homeButtons}>
                <Link to="/join">
                    <View style={{...gstyles.button, width: 300}}>
                        <Text style={gstyles.buttonText}>Rejoindre une partie</Text>
                    </View>
                </Link>

                <Link to="/create">
                    <Text style={gstyles.buttonText}></Text>
                    <View style={{...gstyles.button, width: 300}}>
                        <Text style={gstyles.buttonText}>Créer une partie</Text>
                    </View>
                </Link>

                <Link to="/auth">
                    <Text style={gstyles.buttonText}></Text>
                    <View style={{...gstyles.button, width: 300}}>
                        <Text style={gstyles.buttonText}>{ user ? "Profil" : "Connexion" }</Text>
                    </View>
                </Link>
            </View>

        </Layout>
    );
};

const styles = StyleSheet.create({
    homeImg: {
        height: 200,
        width: 200
    },
    homeTitle: {
        width: 300,
        fontSize: 32,
        textTransform: "uppercase",
        fontWeight: "bold",
        textAlign: "center",
        color: "slateblue"
    },
    homeButtons: {
        width: 300,
        gap: 10,
        marginTop: 30
    }
})