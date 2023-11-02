import { useEffect, useRef } from "react";
import { StyleSheet, Animated } from "react-native";

export default function Layout({ children }: { children: any }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateAnim = useRef(new Animated.Value(100)).current;
    
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start();

        Animated.timing(translateAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, []);

    return (
        <Animated.View style={{...styles.container, opacity: fadeAnim, transform: [{translateY: translateAnim}]}}>
            { children }
        </Animated.View>
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