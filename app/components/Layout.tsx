import { useEffect, useRef } from "react";
import { StyleSheet, Animated } from "react-native";

export default function Layout({ children }: { children: React.ReactNode }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start();

        return;
    }, []);

    return (
        <Animated.View style={{...styles.container, opacity: fadeAnim}}>
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