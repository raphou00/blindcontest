import { useState } from "react";
import { StyleSheet, View, Text, Image, TextInput, Pressable, Alert } from "react-native";
import socket from "../lib/socket";
import { ScreenProps } from "../lib/type";
import gstyles from "../components/Styles";
import Layout from "../components/Layout";

export default function Join({ navigation }: ScreenProps) {
    const [room, setRoom] = useState<string>("");

    const login = async () => {
        if (!room) {
            Alert.alert("Veuillez entrer une clé");
            return;
        }

        socket.emit("check_key", { room: room });
        socket.on("check_key", data => {
            if (data.access) navigation.navigate("lobby", { room: room, host: false });
            else Alert.alert("Vous ne pouvez pas rejoindre cette partie");
        });
    };

    return (
        <Layout>
            <Image style={styles.homeImg} source={require("../assets/blindcontest.png")} />
            <Text style={styles.homeTitle}>Rejoindre</Text>
            
            <View style={styles.homeButtons}>
                <TextInput style={gstyles.input} value={room} onChangeText={setRoom} inputMode="search" onSubmitEditing={login} placeholder="Clé..." />

                <Pressable style={gstyles.button} onPress={login}>
                    <Text style={gstyles.buttonText}>Rejoindre la partie</Text>
                </Pressable>
            </View>
        </Layout>
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
        color: "slateblue"
    },
    homeButtons: {
        width: 300,
        gap: 10,
        marginTop: 30
    }
});