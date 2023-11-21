import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Pressable, Image, Alert } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import supabase from "../lib/supabase";
import { ScreenProps } from "../lib/type";
import Layout from "../components/Layout";
import gstyles from "../components/Styles";

function Login({ navigation }: any) {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const submit = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) Alert.alert("Connexion échouée");
        else Alert.alert("Connexion réussie");

        navigation.navigate("home");
    }

    return (
        <>
            <Text style={styles.homeTitle}>Connexion</Text>

            <View style={styles.fieldBox}>
                <Text style={styles.label}>Entrez votre E-Mail</Text>
                <TextInput
                    style={gstyles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="E-Mail"
                    keyboardType="email-address" />
            </View>

            <View style={styles.fieldBox}>
                <Text style={styles.label}>Entrez votre mot de passe</Text>
                <TextInput
                    style={gstyles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Mot de passe"
                    secureTextEntry={true} />
            </View>

            <Pressable style={gstyles.button} onPress={submit}>
                <Text style={gstyles.buttonText}>Se connecter</Text>
            </Pressable>
        </>
    );
}

function Register({ navigation }: any) {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");

    const submit = async () => {
        if (password !== passwordConfirm) {
            Alert.alert("Les mots de passe ne correspondent pas");
            return;
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    point: 0
                }
            }
        });

        if (error) Alert.alert("Inscription échouée");
        else Alert.alert("Inscription réussie");

        navigation.navigate("home");
    }

    return (
        <>
            <Text style={styles.homeTitle}>Inscription</Text>

            <View style={styles.fieldBox}>
                <Text style={styles.label}>Entrez un E-Mail</Text>
                <TextInput
                    style={gstyles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="E-Mail"
                    keyboardType="email-address" />
            </View>

            <View style={styles.fieldBox}>
                <Text style={styles.label}>Entrez un mot de passe</Text>
                <TextInput
                    style={gstyles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Mot de passe"
                    secureTextEntry={true} />
            </View>

            <View style={styles.fieldBox}>
                <Text style={styles.label}>Confirmez le mot de passe</Text>
                <TextInput
                    style={gstyles.input}
                    value={passwordConfirm}
                    onChangeText={setPasswordConfirm}
                    placeholder="Confirmer"
                    secureTextEntry={true} />
            </View>

            <Pressable style={gstyles.button} onPress={submit}>
                <Text style={gstyles.buttonText}>S'inscrire</Text>
            </Pressable>
        </>
    );
}

function Home({ setPage }: { setPage: React.Dispatch<React.SetStateAction<"login" | "register" | "home">> }) {
    return (
        <View style={styles.home}>
            <Image style={styles.homeImg} source={require("../assets/blindcontest.png")} />
            <Text style={styles.homeTitle}>Connexion</Text>

            <View style={styles.buttons}>
                <Pressable style={gstyles.button} onPress={() => setPage("login")}>
                    <Text style={gstyles.buttonText}>Connexion</Text>
                </Pressable>

                <Pressable style={gstyles.button} onPress={() => setPage("register")}>
                    <Text style={gstyles.buttonText}>Inscription</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default function Auth({ navigation }: ScreenProps) {
    const [page, setPage] = useState<"login" | "register" | "home">("home");

    return (
        <Layout>
            <View style={styles.form}>
                {
                    page !== "home" && (
                        <Pressable style={styles.back} onPress={() => setPage("home")}>
                            <Text style={styles.backText}><FontAwesome5 name="chevron-left" /></Text>
                        </Pressable>
                    )
                }

                { page === "home" && <Home setPage={setPage} /> }
                { page === "login" && <Login navigation={navigation} /> }
                { page === "register" && <Register navigation={navigation} /> }
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    home: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    },
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
        color: "slateblue",
        marginBottom: 10
    },
    buttons: {
        width: 300,
        gap: 10
    },
    form: {
        padding: 10,
    },
    fieldBox: {
        marginBottom: 10
    },
    label: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 20
    },

    back: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 30,
        height: 30,
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 6,
        borderColor: "#CCC",
        backgroundColor: "#111111",
        alignSelf: "flex-start",
        marginBottom: 10
    },
    backText: {
        color: "#FFFFFF",
        fontSize: 14
    }
});