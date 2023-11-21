import { StyleSheet, SafeAreaView } from "react-native";
import AuthProvider from "./components/AuthProvider";
import Navigation from "./components/Navigation";

export default function App() {
    return (
        <SafeAreaView style={styles.body}>
            <AuthProvider>
                <Navigation />
            </AuthProvider>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    body: {
        minWidth: 320,
        width: "100%",
        height: "100%"
    }
});