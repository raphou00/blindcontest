import { StyleSheet, View } from "react-native";

export default function Layout({ children }: { children: any }) {
    return (
        <View style={styles.container}>
            { children }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 10
    }
});