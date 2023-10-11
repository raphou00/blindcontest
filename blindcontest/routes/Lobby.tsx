import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable, TextInput } from "react-native";
import { useNavigate, useParams, useSearchParams } from "react-router-native";
import { socket } from "../server/Server";
import PlayerList from "../components/PlayerList";
import gstyles from "../components/Styles";

export default function Lobby() {
    const [name, setName] = useState<string>("");
    const [logged, setLogged] = useState<boolean>(false);
    const [players, setPlayers] = useState<any[]>([]);
    const { room } = useParams<{room: string}>();
    const [searchParams] = useSearchParams();
    const [host] = useState<boolean>(searchParams.get("host") == "true" ? true : false);
    const navigate = useNavigate();
    
    useEffect(() => {
        socket.emit("join_lobby", { room: room });

        socket.emit("players", { room: room });
        socket.on("players", data => setPlayers(data.players));

        socket.on("start_room", () => navigate("/game/" + room + (host ? "?host=true" : "")));

        return;
    }, []);

    const login = () => {
        if (players.map(e => e.name).includes(name)) {
            alert("Nom déjà dans la liste");
            return;
        } else if (name.length < 3) {
            alert("Nom trop court");
            return;
        }

        setLogged(true);
        socket.emit("join_room", { room: room, name: name });
    }

    const start = () => {
        if (logged) socket.emit("start_room");
        else alert("connectez vous pour commencer la partie");
    }

    return (
        <>
            <Text style={styles.lobbyTitle}>{"#" + room}</Text>

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
                        <Pressable style={{...gstyles.button, width: 300, marginTop: 30}} onPress={start}>
                            <Text style={gstyles.buttonText}>Jouer</Text>
                        </Pressable>
                </> : <></>
            }
        </>
    );
};

const styles = StyleSheet.create({
    lobbyTitle: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#F9F9F9",
        marginBottom: 30,
        textDecorationLine: "underline",
        textDecorationColor: "#FFFFFF",
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