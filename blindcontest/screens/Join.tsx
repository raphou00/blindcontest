import { useState } from "react";
import { StyleSheet, View, Text, Image, TextInput, Pressable, Alert } from "react-native";
import socket from "../lib/socket";
import { ScreenProps } from "../lib/type";
import gstyles from "../components/Styles";
import Layout from "../components/Layout";

export default function Join({ navigation }: ScreenProps) {
    // État local pour stocker la clé de la salle
    const [room, setRoom] = useState<string>("");

    // Fonction pour gérer la tentative de connexion à une salle
    const login = async () => {
        // Vérification si la clé de la salle est fournie
        if (!room) {
            // Affichage d'une alerte si la clé est manquante
            Alert.alert("Veuillez entrer une clé");
            return;
        }

        // Émission d'un événement "check_key" au serveur avec la clé de la salle
        socket.emit("check_key", { room: room });

        // Écoute de la réponse du serveur à l'événement "check_key"
        socket.on("check_key", data => {
            // Vérification si l'accès à la salle est autorisé
            if (data.access) {
                // Navigation vers l'écran du lobby avec les détails de la salle
                navigation.navigate("lobby", { room: room, host: false });
            } else {
                // Affichage d'une alerte si l'accès à la salle est refusé
                Alert.alert("Vous ne pouvez pas rejoindre cette partie");
            }
        });
    };

    return (
        // Utilisation du composant Layout pour la mise en page générale
        <Layout>
            {/* Affichage de l'image du logo */}
            <Image style={styles.homeImg} source={require("../assets/blindcontest.png")} />
            {/* Affichage du titre de la page */}
            <Text style={styles.homeTitle}>Rejoindre</Text>
            
            {/* Zone des boutons et du champ de saisie */}
            <View style={styles.homeButtons}>
                {/* Champ de saisie pour entrer la clé de la salle */}
                <TextInput style={gstyles.input} value={room} onChangeText={setRoom} inputMode="search" onSubmitEditing={login} placeholder="Clé..." />

                {/* Bouton pour rejoindre la salle avec la clé fournie */}
                <Pressable style={gstyles.button} onPress={login}>
                    <Text style={gstyles.buttonText}>Rejoindre la partie</Text>
                </Pressable>
            </View>
        </Layout>
    );
}

// Styles pour le composant Join
const styles = StyleSheet.create({
    homeImg: {
        height: 200,
        width: 200,
    },
    homeTitle: {
        width: 300,
        fontSize: 32,
        textTransform: "uppercase",
        fontWeight: "bold",
        textAlign: "center",
        color: "slateblue",
    },
    homeButtons: {
        width: 300,
        gap: 10,
        marginTop: 30,
    },
});
