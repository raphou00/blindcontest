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

    const { room, name } = route.params;

    useEffect(() => {
        socket.emit("players", { room });

        socket.on("players", (data: any) => {
            setPlayers(data.players);

            data.players.forEach((e: any) => {
                if (e.id == socket.id) addPoint(e.point);
            });
        });

        return;
    }, []);

    const addPoint = (point: number) => {
        supabase.auth.updateUser({
            data: {
                point: user?.user_metadata.point + point
            }
        });
    }

    return (
        <Layout>
            <View style={styles.ranking}>
                <Link to="/home">
                    <View style={{ ...gstyles.button, width: 300 }}>
                        <Text style={gstyles.buttonText}>Accueil</Text>
                    </View>
                </Link>

                {players.length > 0 && <Text style={styles.player}>{name}</Text>}

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
    player: {
        fontWeight: "bold",
        color: "#FFFFFF",
        fontSize: 30,
        width: 300,
        textAlign: "center"
    }
});