import { StyleSheet, Text, Pressable } from "react-native";

export default function Back({ title, onPress }: { title: string, onPress: () => void }) {
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{ title }</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 5,
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 6,
        borderColor: "#CCC",
        backgroundColor: "#111",
        alignSelf: "flex-start"
    },
    buttonText: {
        color: "#FFF",
        fontSize: 14
    }
});