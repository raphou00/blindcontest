import { useState } from "react";
import { StyleSheet, View, Text, TextInput, Pressable } from "react-native";
import supabase from "../helpers/supabase";
import gstyles from "../components/Styles";
import Back from "../components/Back";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submit = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) alert("Connexion échouée");
        else  alert("Connexion réussie");
    }

    return (
        <>
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

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const submit = async () => {
        if (password !== passwordConfirm) {
            alert("Les mots de passe ne corréspondent pas");
            return;
        }

        const { error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) alert("Inscription échouée");
        else  alert("Inscription réussie");
    }

    return (
        <>
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

            <Pressable style={gstyles.button} onPress={submit}>
                <Text style={gstyles.buttonText}>S'inscrire</Text>
            </Pressable>
        </>
    );
}

function Home({ setPage }: { setPage: React.Dispatch<React.SetStateAction<"login" | "register" | "home">> }) {
    const google = async () => {
        const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });

        if (error) alert("Connexion échouée");
        else  alert("Connexion réussie");
    }

    return (
        <View style={styles.buttons}>
            <Pressable style={gstyles.button} onPress={google}>
                <Text style={gstyles.buttonText}>Google</Text>
            </Pressable>

            <Pressable style={gstyles.button} onPress={() => setPage("login")}>
                <Text style={gstyles.buttonText}>Connexion</Text>
            </Pressable>

            <Pressable style={gstyles.button} onPress={() => setPage("register")}>
                <Text style={gstyles.buttonText}>Inscription</Text>
            </Pressable>
        </View>
    );
}

export default function Auth() {
    const [page, setPage] = useState<"login" | "register" | "home">("home");

    return (
        <>
            <View style={styles.form}>
                {
                    page !== "home" &&
                    <Back title="compte" onPress={() => setPage("home")} />
                }

                <Text style={styles.title}>
                    { page === "login" && "Connexion" }
                    { page === "register" && "Inscription" }
                    { page === "home" && "Compte" }
                </Text>

                { page === "home" && <Home setPage={setPage} /> }
                { page === "login" && <Login /> }
                { page === "register" && <Register /> }
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 45,
        fontWeight: "bold",
        color: "#FFF",
        textAlign: "center",
        marginBottom: 50
    },
    buttons: {
        width: 300,
        gap: 10
    },
    form: {
        padding: 10,
        borderStyle: "solid",
        borderWidth: 2,
        borderRadius: 6,
        borderColor: "#646CFF",
        backgroundColor: "#111"
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