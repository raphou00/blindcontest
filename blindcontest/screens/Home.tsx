import { StyleSheet, View, Text, Image } from "react-native";
import { Link } from "react-router-native";
import gstyles from "../components/Styles";
import { useAuth } from "../helpers/auth-provider";

export default function Home() {
    const { user } = useAuth();
    console.log(user);
    
    return (
        <>
            <Image style={styles.homeImg} source={require("../assets/blindcontest.png")} />
            <Text style={styles.homeTitle}>blind contest</Text>
            
            <View style={styles.homeButtons}>
                <View style={gstyles.button}>
                    <Link to="/join" underlayColor={"transparent"}>
                        <Text style={gstyles.buttonText}>Rejoindre une partie</Text>
                    </Link>
                </View>

                <View style={gstyles.button}>
                    <Link to="/create" underlayColor={"transparent"}>
                        <Text style={gstyles.buttonText}>Créer une partie</Text>
                    </Link>
                </View>

                <View style={gstyles.button}>
                    <Link to="/auth" underlayColor={"transparent"}>
                        <Text style={gstyles.buttonText}>Compte</Text>
                    </Link>
                </View>
            </View>

        </>
    );
};

const styles = StyleSheet.create({
    homeImg: {
        height: 200,
        width: 200
    },
    homeTitle: {
        width: 300,
        fontSize: 32,
        textTransform: "uppercase",
        fontWeight: "bold",
        textAlign: "center",
        color: "#535bf2"
    },
    homeButtons: {
        width: 300,
        gap: 10,
        marginTop: 30
    }
})