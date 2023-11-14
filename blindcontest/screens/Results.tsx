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
    const [players, setPlayers] = useState<any[]>([]);
    const { user } = useAuth();

    const { room } = route.params;
    
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            socket.emit("players", { room: room });
            socket.on("players", data => setPlayers(data.players));

            if (!user) return;
            addPoint();
        });

        return unsubscribe;
    }, []);

    const addPoint = async () => {
        const point = players.find(p => p.id === socket.id).point;

        await supabase.auth.updateUser({
            data: {
                point: user?.user_metadata.point + point
            }
        });
    }

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