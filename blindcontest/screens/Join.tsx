import { useState } from "react";
import { StyleSheet, View, Text, Image, TextInput, Pressable } from "react-native";
import { NavigateFunction, useNavigate } from "react-router-native";
import { socket } from "../helpers/server";
import gstyles from "../components/Styles";

export default function Join() {
    const [key, setKey] = useState<string>("");
    const navigate: NavigateFunction = useNavigate();

    const login = async () => {
        if (!key) {
            alert("Veuillez entrer une clé de partie.");
            return;
        }

        socket.emit("check_key", { key: key });
        socket.on("check_key", data => {
            if (data.access) return navigate("/lobby/" + data.key);
            else alert("Vous ne pouvez pas rejoindre cette partie");
        });
    };

    return (
        <>
            <Image style={styles.homeImg} source={require("../assets/blindcontest.png")} />
            <Text style={styles.homeTitle}>blind contest</Text>
            
            <View style={styles.homeButtons}>
                <TextInput style={gstyles.input} value={key} onChangeText={setKey} inputMode="search" onSubmitEditing={login} placeholder="Clé..." />

                <Pressable style={gstyles.button} onPress={login}>
                    <Text style={gstyles.buttonText}>Rejoindre la partie</Text>
                </Pressable>
            </View>
        </>
    );
};


const styles = StyleSheet.create({
    homeImg: {
        height: 200,
        width: 200
    },
    homeTitle: {
        width: 300,
        fontSize: 32,
        textTransform: "uppercase",
        fontWeight: "bold",
        textAlign: "center",
        color: "#535bf2"
    },
    homeButtons: {
        width: 300,
        gap: 10,
        marginTop: 30
    }
});