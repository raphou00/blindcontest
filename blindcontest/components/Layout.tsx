import { StyleSheet, View, ImageBackground } from "react-native";
import { NavigateFunction, Outlet, useLocation, useNavigate, Location } from "react-router-native";
import Back from "./Back";

export default function Layout() {
    const navigate: NavigateFunction = useNavigate();
    const location: Location = useLocation();

    return (
        <ImageBackground source={require("../assets/background.jpg")} resizeMode="cover" style={{width: "100%", height: "100%"}}>
            <View style={{ margin: 5 }}>
                { location.pathname !== "/" && <Back title="accueil" onPress={() => navigate("/")} /> }
            </View>

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