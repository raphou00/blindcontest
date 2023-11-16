import { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, Pressable, Alert } from "react-native";
import socket from "../lib/socket";
import { ScreenProps } from "../lib/type";
import Category from "../components/Category";
import gstyles from "../components/Styles";
import Layout from "../components/Layout";

export default function Create({ navigation }: ScreenProps) {
    // État local pour les catégories actives, la clé de la salle, le temps et le nombre de questions
    const [activeCategories, setActiveCategories] = useState<any[]>([]);
    const [room, setRoom] = useState<string>("");
    const [time, setTime] = useState<string>("20");
    const [nbrQuestions, setNbrQuestions] = useState<string>("10");

    useEffect(() => {
        // Effet secondaire lors de la mise au premier plan du composant
        const unsubscribe = navigation.addListener("focus", () => {
            // Réinitialiser les états lorsque le composant devient actif
            setActiveCategories([]);
            setRoom("");
            setTime("20");
            setNbrQuestions("10");

            // Émettre un événement pour créer une nouvelle salle et écouter la réponse
            socket.emit("create_room");
            socket.on("create_room", data => setRoom(data.key));
        });

        // Nettoyer l'abonnement lorsque le composant est démonté ou lorsque la navigation change
        return unsubscribe;
    }, [navigation]);

    // Gérer la création de la salle
    const handleCreate = () => {
        // Convertir les valeurs en nombres
        const nTime = Number.parseInt(time);
        const nQuestions = Number.parseInt(nbrQuestions);

        // Vérifier si les valeurs sont des nombres valides
        if (isNaN(nTime) || isNaN(nQuestions)) {
            // Gestion des erreurs, alerte à l'utilisateur
            Alert.alert("Entrez des valeurs valides")
            return;
        }

        // Émettre un événement pour mettre à jour les paramètres de la salle et naviguer vers le lobby
        socket.emit("update_room", {
            key: room,
            time: nTime,
            nbrQuestions: nQuestions,
            categories: activeCategories
        }, () => navigation.navigate("lobby", { room: room, host: true }));
    }

    return (
        <Layout>
            <Text style={styles.createTitle}>
                Clé <Text style={{ ...styles.createTitle, color: "slateblue" }}>{room}</Text>
            </Text>

            <View style={styles.createBox}>
                <Text style={styles.createBoxTitle}>Catégories</Text>
                <Category
                    activeCategories={activeCategories}
                    setActiveCategories={setActiveCategories} />
            </View>

            <View style={styles.createBox}>
                <Text style={styles.createBoxTitle}>Temps pour répondre (sec)</Text>
                <TextInput
                    style={[gstyles.input, styles.createInput]}
                    value={time}
                    onChangeText={setTime}
                    inputMode="numeric" />
            </View>

            <View style={styles.createBox}>
                <Text style={styles.createBoxTitle}>Nombre de musiques</Text>
                <TextInput
                    style={[gstyles.input, styles.createInput]}
                    value={nbrQuestions}
                    onChangeText={setNbrQuestions}
                    inputMode="numeric" />
            </View>

            <Pressable onPress={handleCreate}>
                <View style={[gstyles.button, styles.createButton]}>
                    <Text style={gstyles.buttonText}>Créer et rejoindre</Text>
                </View>
            </Pressable>
        </Layout>
    );
};

const styles = StyleSheet.create({
    createTitle: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 10,
        textDecorationLine: "underline",
        textDecorationStyle: "solid"
    },
    createPlayers: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "50%",
        width: 300,
        borderWidth: 2,
        borderColor: "slateblue",
        borderStyle: "solid",
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
        borderBottomLeftRadius: 6,
        overflow: "hidden"
    },
    createPlayersTitle: {
        width: "100%",
        height: 40,
        borderBottomWidth: 3,
        borderColor: "slateblue",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 10
    },
    createPlayersTitleText: {
        textTransform: "uppercase",
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "right",
        color: "#FFFFFF"
    },
    createPlayersTitleNbr: {
        fontSize: 16,
        fontWeight: "bold",
        color: "slateblue"
    },
    createPlayersList: {
        overflowY: "scroll",
        width: "100%",
        height: 400
    },
    createPlayersListName: {
        width: "90%",
        marginTop: 0,
        marginRight: "auto",
        marginBottom: 0,
        marginLeft: "auto",
        borderBottomWidth: 1,
        borderColor: "slateblue",
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        paddingTop: 5,
        paddingRight: 0,
        paddingBottom: 5,
        paddingLeft: 0,
        color: "#FFFFFF"
    },

    createBox: {
        width: 300,
        height: "auto",
        borderWidth: 2,
        borderRadius: 6,
        borderStyle: "solid",
        borderColor: "slateblue",
        backgroundColor: "#111111",
        padding: 5,
        marginTop: 20
    },
    createBoxTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
        margin: 5
    },
    createInput: {
        width: 285
    },
    createButton: {
        marginTop: 20,
        width: 300
    }
});