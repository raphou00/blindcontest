import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable, TextInput, Alert } from "react-native";
import socket from "../lib/socket";
import { ScreenProps } from "../lib/type";
import PlayerList from "../components/PlayerList";
import gstyles from "../components/Styles";
import Layout from "../components/Layout";

export default function Lobby({ navigation, route }: ScreenProps) {
    const [name, setName] = useState<string>("");
    const [logged, setLogged] = useState<boolean>(false);
    const [players, setPlayers] = useState<any[]>([]); 
    const { room, host } = route.params;
    
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            socket.emit("join_lobby", { room: room });
            socket.emit("players", { room: room });
            
            socket.on("players", data => setPlayers(data.players));
            socket.on("start_room", () => navigation.navigate("game", { room, host }));
        });

        return unsubscribe;
    }, []);

    const login = () => {
        if (players.map(e => e.name).includes(name)) {
            Alert.alert("Nom déjà dans la liste");
            return;
        } else if (name.length < 3) {
            Alert.alert("Nom trop court");
            return;
        }

        setLogged(true);
        socket.emit("join_room", { room: room, name: name });
    }

    const start = () => {
        socket.emit("start_room");
    }

    return (
        <Layout>
            <Text style={styles.lobbyTitle}>
                Clé <Text style={{...styles.lobbyTitle, color: "slateblue"}}>{room}</Text>
            </Text>

            <View style={styles.lobbyName}>
                <View style={styles.lobbyNameBox}>
                    <TextInput style={gstyles.input} onChangeText={setName} value={name} placeholder="Batman..." />
                    <Pressable style={{...gstyles.button, backgroundColor: logged ? "grey" : gstyles.button.backgroundColor}} onPress={login} disabled={logged}>
                        <Text style={gstyles.buttonText}>Valider</Text>
                    </Pressable>
                </View>
            </View>

            <PlayerList players={players} />

            {
                host ? <>
                        <Pressable
                            style={{...gstyles.button, width: 300, marginTop: 30, backgroundColor: !logged ? "grey" : gstyles.button.backgroundColor}}
                            disabled={!logged}
                            onPress={start}
                        >
                            <Text style={gstyles.buttonText}>Jouer</Text>
                        </Pressable>
                </> : <></>
            }
        </Layout>
    );
};

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