import { useEffect, useRef } from "react";
import { StyleSheet, Animated } from "react-native";

export default function Layout({ children }: { children: any }) {
    // Création des références pour les animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateAnim = useRef(new Animated.Value(100)).current;

    useEffect(() => {
        // Animation de l'opacité
        Animated.timing(fadeAnim, {
            toValue: 1,               // Valeur finale
            duration: 500,            // Durée de l'animation en millisecondes
            useNativeDriver: false,   // N'utiliser le pilote natif que si possible
        }).start();

        // Animation de translation verticale
        Animated.timing(translateAnim, {
            toValue: 0,               // Valeur finale
            duration: 500,            // Durée de l'animation en millisecondes
            useNativeDriver: false,   // N'utiliser le pilote natif que si possible
        }).start();

        return; // La fonction de retour vide indique qu'il n'y a pas de nettoyage nécessaire
    }, []);

    return (
        <Animated.View style={{ ...styles.container, opacity: fadeAnim, transform: [{ translateY: translateAnim }] }}>
            {children}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 10,
    },
});
