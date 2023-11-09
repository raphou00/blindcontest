import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Link } from "@react-navigation/native";
import { useAuth } from "../helpers/auth-provider";
import { socket } from "../helpers/server";
import Ranking from "../components/Ranking";
import gstyles from "../components/Styles";
import Layout from "../components/Layout";
import supabase from "../helpers/supabase";

export default function Results({ route }: { route: any }) {
    const { user } = useAuth();
    const [players, setPlayers] = useState<any[]>([]);
    const { room } = route.params;
    
    useEffect(() => {
        socket.emit("players", { room: room });
        socket.on("players", data => setPlayers(data.players));

        return;
    }, []);

    useEffect(() => {
        (async () => {
            if (!user) return;
            
            for (const p of players) {
                if (p.id === socket.id) {
                    await supabase.auth.updateUser({
                        data: {
                            point: user?.user_metadata.point + p.point
                        }
                    });
                }
            }
        })();

        return;
    }, [players]);

    return (
        <Layout>
            <View style={styles.ranking}>
                <Link to="/home">
                    <View style={{...gstyles.button, width: 300}}>
                        <Text style={gstyles.buttonText}>Accueil</Text>
                    </View>
                </Link>

                {
                    players.length > 0 &&
                    <Text style={styles.winner}>
                        <Text style={{ color: "gold" }}>{players[0].name}</Text>
                    </Text>
                }
                
                <View>
                    <Ranking players={players} visible={true} />
                </View>
            </View>
        </Layout>
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