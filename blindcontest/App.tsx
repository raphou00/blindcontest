import { StyleSheet, SafeAreaView } from "react-native";
import AuthProvider from "./components/AuthProvider";
import Navigation from "./components/Navigation";

// Composant principal de l'application
export default function App() {
    return (
        // Conteneur sûr pour assurer une zone de rendu sécurisée
        <SafeAreaView style={styles.body}>
            {/* Utilisation du composant AuthProvider pour gérer l'authentification */}
            <AuthProvider>
                {/* Utilisation du composant Navigation pour gérer la navigation dans l'application */}
                <Navigation />
            </AuthProvider>
        </SafeAreaView>
    );
}

// Styles pour le composant App
const styles = StyleSheet.create({
    body: {
        minWidth: 320,
        width: "100%",
        height: "100%"
    }
});
