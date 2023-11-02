import { StyleSheet, SafeAreaView } from "react-native";
import AuthProvider from "./helpers/auth-provider";
import Navigation from "./Navigation";

export default function App() {
    return (
        <SafeAreaView style={styles.body}>
            <AuthProvider>
                <Navigation />
            </AuthProvider>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    body: {
        minWidth: 320,
        width: "100%",
        height: "100%",
        backgroundColor: "#1A1A1A"
    }
});