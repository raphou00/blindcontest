import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Link } from "@react-navigation/native";
import socket from "../lib/socket";
import supabase from "../lib/supabase";
import { ScreenProps } from "../lib/type";
import { useAuth } from "../components/AuthProvider";
import Ranking from "../components/Ranking";
import gstyles from "../components/Styles";
import Layout from "../components/Layout";

export default function Results({ navigation, route }: ScreenProps) {
    // State pour stocker la liste des joueurs
    const [players, setPlayers] = useState<any[]>([]);

    // Utilisation du hook useAuth pour obtenir les informations sur l'utilisateur connecté
    const { user } = useAuth();

    // Récupération des paramètres de navigation
    const { room, name } = route.params;

    // Effet pour écouter le focus de la navigation
    useEffect(() => {
        // Fonction pour mettre à jour les joueurs et ajouter des points à l'utilisateur actuel
        const updatePlayers = (data: any) => {
            setPlayers(data.players);

            // Ajouter des points à l'utilisateur actuel en fonction de sa performance dans la partie
            data.players.forEach((e: any) => {
                if (e.id == socket.id) addPoint(e.point);
            });
        };

        // Écoute des changements de joueurs
        socket.on("players", updatePlayers);

        // Nettoyage des écouteurs lors de la sortie du composant
        return () => {
            socket.off("players", updatePlayers);
        };
    }, []);

    // Fonction pour ajouter des points à l'utilisateur dans la base de données Supabase
    const addPoint = (point: number) => {
        // Mise à jour des données utilisateur dans la base de données Supabase
        supabase.auth.updateUser({
            data: {
                point: user?.user_metadata.point + point
            }
        });
    }

    return (
        // Utilisation du composant Layout pour la mise en page générale
        <Layout>
            {/* Conteneur pour afficher les résultats */}
            <View style={styles.ranking}>
                {/* Lien de navigation vers la page d'accueil */}
                <Link to="/home">
                    {/* Bouton pour revenir à la page d'accueil */}
                    <View style={{ ...gstyles.button, width: 300 }}>
                        <Text style={gstyles.buttonText}>Accueil</Text>
                    </View>
                </Link>

                {/* Affichage du nom du joueur actuel */}
                {players.length > 0 && <Text style={styles.player}>{name}</Text>}

                {/* Affichage du classement des joueurs */}
                <View>
                    {/* Composant Ranking pour afficher le classement des joueurs */}
                    <Ranking players={players} visible={true} />
                </View>
            </View>
        </Layout>
    );
}

// Styles pour le composant Results
const styles = StyleSheet.create({
    ranking: {
        gap: 10
    },
    player: {
        fontWeight: "bold",
        color: "#FFFFFF",
        fontSize: 30,
        width: 300,
        textAlign: "center"
    }
});
