import { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, Pressable } from "react-native";
import { NavigateFunction, useNavigate } from "react-router-native";
import { socket } from "../server/Server";
import Category from "../components/Category";
import gstyles from "../components/Styles";

export default function Create() {
    const [key, setKey] = useState<string>("");
    const [activeCategories, setActiveCategories] = useState<any[]>([]);
    const [time, setTime] = useState<string>("20");
    const [nbrQuestions, setNbrQuestions] = useState<string>("20");
    const navigate: NavigateFunction = useNavigate();
    
    useEffect(() => {
        socket.emit("create_room");
        socket.on("create_room", data => setKey(data.key));
        
        return;
    }, []);

    const onCreate = () => {        
        socket.emit("update_room", {
            key: key,
            time: Number.parseInt(time),
            nbrQuestions: Number.parseInt(nbrQuestions),
            categories: activeCategories
        }, () => navigate(`/lobby/${key}?host=true`));
    }

    return (
        <>
            <Text style={styles.createTitle}>{"#" + key}</Text>


            <View style={styles.createBox}>
                <Text style={styles.createBoxTitle}>Catégories</Text>
                <Category
                    activeCategories={activeCategories}
                    setActiveCategories={setActiveCategories} />
            </View>

            <View style={styles.createBox}>
                <Text style={styles.createBoxTitle}>Temps pour répondre</Text>
                <TextInput
                    style={[gstyles.input, styles.createInput]}
                    value={time}
                    onChangeText={setTime}
                    inputMode="numeric" />
            </View>
            
            <View style={styles.createBox}>
                <Text style={styles.createBoxTitle}>Nombre de questions</Text>
                <TextInput
                    style={[gstyles.input, styles.createInput]}
                    value={nbrQuestions}
                    onChangeText={setNbrQuestions}
                    inputMode="numeric" />
            </View>

            <Pressable onPress={onCreate}>
                <View style={[gstyles.button, styles.createButton]}>
                    <Text style={gstyles.buttonText}>Créer et rejoindre</Text>
                </View>
            </Pressable>
        </>
    );
};

const styles = StyleSheet.create({
    createTitle: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#F9F9F9",
        marginBottom: 10,
        textDecorationLine: "underline",
        textDecorationColor: "#FFFFFF",
        textDecorationStyle: "solid"
    },
    createPlayers: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "50%",
        width: 300,
        borderWidth: 2,
        borderColor: "#213547",
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
        borderColor: "#213547",
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
        color: "#F9F9F9"
    },
    createPlayersTitleNbr: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#646CFF"
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
        borderColor: "#646CFF",
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        paddingTop: 5,
        paddingRight: 0,
        paddingBottom: 5,
        paddingLeft: 0,
        color: "#F9F9F9"
    },

    createBox: {
        width: 300,
        height: "auto",
        borderWidth: 2,
        borderRadius: 6,
        borderStyle: "solid",
        borderColor: "#213547",
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