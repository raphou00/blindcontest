import { StyleSheet, View, Text, Image } from "react-native";
import { Link } from "@react-navigation/native";
import gstyles from "../components/Styles";
import { useAuth } from "../helpers/auth-provider";
import Layout from "../components/Layout";

export default function Home() {
    const { user } = useAuth();
    console.log(user);
    
    return (
        <Layout>
            <Image style={styles.homeImg} source={require("../assets/blindcontest.png")} />
            <Text style={styles.homeTitle}>blind contest</Text>
            
            <View style={styles.homeButtons}>
                <Link to="/join" style={gstyles.button}>
                    <Text style={gstyles.buttonText}>Rejoindre une partie</Text>
                </Link>

                <Link to="/create" style={gstyles.button}>
                    <Text style={gstyles.buttonText}>Créer une partie</Text>
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
        color: "#535bf2"
    },
    homeButtons: {
        width: 300,
        gap: 10,
        marginTop: 30
    }
})