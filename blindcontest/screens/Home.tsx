import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { Link } from "@react-navigation/native";
import { useAuth } from "../components/AuthProvider";
import Layout from "../components/Layout";
import gstyles from "../components/Styles";

export default function Home() {
    // Utilisation du hook useAuth pour récupérer l'utilisateur authentifié
    const { user } = useAuth();

    return (
        // Utilisation du composant Layout pour la mise en page générale
        <Layout>
            {/* Affichage de l'image du logo */}
            <Image style={styles.homeImg} source={require("../assets/blindcontest.png")} />
            {/* Affichage du titre de l'application */}
            <Text style={styles.homeTitle}>blindcontest</Text>

            {/* Affichage des boutons avec des liens vers différentes pages */}
            <View style={styles.homeButtons}>
                {/* Bouton pour rejoindre une partie */}
                <Link to="/join">
                    <View style={{ ...gstyles.button, width: 300 }}>
                        <Text style={gstyles.buttonText}>Rejoindre une partie</Text>
                    </View>
                </Link>

                {/* Bouton pour créer une partie */}
                <Link to="/create">
                    <View style={{ ...gstyles.button, width: 300 }}>
                        <Text style={gstyles.buttonText}>Créer une partie</Text>
                    </View>
                </Link>

                {/* Bouton pour accéder au profil ou à l'écran de connexion en fonction de l'état de l'utilisateur */}
                <Link to="/auth">
                    <View style={{ ...gstyles.button, width: 300 }}>
                        <Text style={gstyles.buttonText}>{user ? "Profil" : "Connexion"}</Text>
                    </View>
                </Link>
            </View>
        </Layout>
    );
}

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