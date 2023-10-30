import { StyleSheet, View, ImageBackground } from "react-native";
import { Outlet } from "react-router-native";

export default function Layout() {
    return (
        <ImageBackground source={require("../assets/background.jpg")} resizeMode="cover" style={{width: "100%", height: "100%"}}>
            <View style={styles.main}>
                <Outlet />
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    main: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
    }
});