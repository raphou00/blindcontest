import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Pressable, Image } from "react-native";
import supabase from "../helpers/supabase";
import Layout from "../components/Layout";
import Back from "../components/Back";
import gstyles from "../components/Styles";
import Captcha from "../components/Catpcha";

function Login({ navigation }: any) {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const submit = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) alert("Connexion échouée");
        else  alert("Connexion réussie");

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
            alert("Les mots de passe ne corréspondent pas");
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

        if (error) alert("Inscription échouée");
        else alert("Inscription réussie");

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
                <Text style={styles.label}>Confimez le mot de passe</Text>
                <TextInput
                    style={gstyles.input}
                    value={passwordConfirm}
                    onChangeText={setPasswordConfirm}
                    placeholder="Confirmer"
                    secureTextEntry={true} />
            </View>

            {/* <View style={{flex: 1}}>
                <Captcha />
            </View> */}

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

export default function Auth({ navigation }: any) {
    const [page, setPage] = useState<"login" | "register" | "home">("home");

    return (
        <Layout>
            <View style={styles.form}>
                {
                    page !== "home" &&
                    <Back onPress={() => setPage("home")} />
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
        color: "#535bf2",
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
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 20
    }
});