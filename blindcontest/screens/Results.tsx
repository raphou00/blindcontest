import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Link, useParams } from "react-router-native";
import { socket } from "../helpers/server";
import Ranking from "../components/Ranking";
import gstyles from "../components/Styles";

export default function Results() {
    const [players, setPlayers] = useState<any[]>([]);
    const { room } = useParams<{room: string}>();
    
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