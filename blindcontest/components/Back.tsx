import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { StyleSheet, Text, Pressable } from "react-native";

export default function Back({ onPress }: { onPress: () => void }) {
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}><FontAwesome5 name="chevron-left" /></Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 30,
        height: 30,
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 6,
        borderColor: "#CCC",
        backgroundColor: "#111",
        alignSelf: "flex-start",
        marginBottom: 10
    },
    buttonText: {
        color: "#FFF",
        fontSize: 14
    }
});