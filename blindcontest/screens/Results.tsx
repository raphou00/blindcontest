import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { socket } from "../helpers/server";
import Ranking from "../components/Ranking";
import gstyles from "../components/Styles";
import { Link } from "@react-navigation/native";

export default function Results({ route }: { route: any }) {
    const [players, setPlayers] = useState<any[]>([]);
    const { room } = route.params;
    
    useEffect(() => {
        socket.emit("players", { room: room });
        socket.on("players", data => setPlayers(data.players));

        return;
    }, [])

    return (
        <View style={styles.ranking}>
            <Link to="/" style={{...gstyles.button, width: 300}}>
                <Text style={gstyles.buttonText}>Accueil</Text>
            </Link>

            {
                players.length > 0 &&
                <Text style={styles.winner}>
                    <Text style={{color: "gold"}}>{players[0].name}</Text> - {players[0].point}
                </Text>
            }

            
            <View>
                <Ranking players={players} visible={true} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    ranking: {
        gap: 10
    },
    winner: {
        fontWeight: "bold",
        color: "#FFFFFF",
        fontSize: 30,
        width: 300,
        textAlign: "center"
    }
});