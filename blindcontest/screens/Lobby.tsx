import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable, TextInput, Alert } from "react-native";
import socket from "../lib/socket";
import { ScreenProps } from "../lib/type";
import PlayerList from "../components/PlayerList";
import gstyles from "../components/Styles";
import Layout from "../components/Layout";

export default function Lobby({ navigation, route }: ScreenProps) {
    // État local pour stocker le nom du joueur
    const [name, setName] = useState<string>("");
    
    // État local pour indiquer si le joueur est connecté
    const [logged, setLogged] = useState<boolean>(false);

    // État local pour stocker la liste des joueurs dans le lobby
    const [players, setPlayers] = useState<any[]>([]);

    // Récupération des détails de la salle et du statut de l'hôte depuis les paramètres de la route
    const { room, host } = route.params;
    
    // Effet utilisé pour écouter les changements de focus sur l'écran
    useEffect(() => {
        // Mise en place des écouteurs d'événements lors du focus sur l'écran
        const unsubscribe = navigation.addListener("focus", () => {
            // Émission de l'événement "join_lobby" pour informer le serveur que le joueur a rejoint le lobby
            socket.emit("join_lobby", { room: room });

            // Émission de l'événement "players" pour demander au serveur la liste des joueurs dans le lobby
            socket.emit("players", { room: room });

            // Écoute de l'événement "players" pour mettre à jour la liste des joueurs dans le lobby
            socket.on("players", data => setPlayers(data.players));

            // Écoute de l'événement "start_room" pour naviguer vers l'écran du jeu lorsque la partie commence
            socket.on("start_room", data => navigation.navigate("game", { room, host, name: data.name }));
        });

        // Nettoyage des écouteurs d'événements lors du démontage du composant
        return unsubscribe;
    }, []);

    // Fonction pour gérer la connexion du joueur avec un nom
    const login = () => {
        // Vérification si le nom du joueur est déjà dans la liste
        if (players.map(e => e.name).includes(name)) {
            // Affichage d'une alerte si le nom est déjà pris
            Alert.alert("Nom déjà dans la liste");
            return;
        } else if (name.length < 3) {
            // Affichage d'une alerte si le nom est trop court
            Alert.alert("Nom trop court");
            return;
        }

        // Mise à jour de l'état pour indiquer que le joueur est connecté
        setLogged(true);

        // Émission de l'événement "join_room" avec la clé de la salle et le nom du joueur
        socket.emit("join_room", { room: room, name: name });
    }

    // Fonction pour démarrer la partie (uniquement disponible pour l'hôte)
    const start = () => {
        // Émission de l'événement "start_room" pour indiquer au serveur de commencer la partie
        socket.emit("start_room");
    }

    return (
        // Utilisation du composant Layout pour la mise en page générale
        <Layout>
            {/* Affichage du titre avec la clé de la salle */}
            <Text style={styles.lobbyTitle}>
                Clé <Text style={{ ...styles.lobbyTitle, color: "slateblue" }}>{room}</Text>
            </Text>

            {/* Section pour entrer le nom du joueur */}
            <View style={styles.lobbyName}>
                <View style={styles.lobbyNameBox}>
                    {/* Champ de saisie pour entrer le nom du joueur */}
                    <TextInput style={gstyles.input} onChangeText={setName} value={name} placeholder="Batman..." />
                    {/* Bouton pour valider le nom et se connecter */}
                    <Pressable style={{ ...gstyles.button, backgroundColor: logged ? "grey" : gstyles.button.backgroundColor }} onPress={login} disabled={logged}>
                        <Text style={gstyles.buttonText}>Valider</Text>
                    </Pressable>
                </View>
            </View>

            {/* Liste des joueurs dans le lobby */}
            <PlayerList players={players} />

            {/* Bouton pour démarrer la partie (visible uniquement pour l'hôte) */}
            {host ? <>
                <Pressable
                    style={{ ...gstyles.button, width: 300, marginTop: 30, backgroundColor: !logged ? "grey" : gstyles.button.backgroundColor }}
                    disabled={!logged}
                    onPress={start}
                >
                    <Text style={gstyles.buttonText}>Jouer</Text>
                </Pressable>
            </> : <></>}
        </Layout>
    );
}

// Styles pour le composant Lobby
const styles = StyleSheet.create({
    lobbyTitle: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 30,
        textDecorationLine: "underline",
        textDecorationStyle: "solid"
    },
    lobbyName: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 300
    },
    lobbyNameBox: {
        gap: 10,
        marginBottom: 30
    }
});
