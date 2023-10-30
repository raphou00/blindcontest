import { useState } from "react";
import { StyleSheet, View, Text, TextInput, Image, Pressable } from "react-native";
import supabase from "../helpers/db";
import gstyles from "../components/Styles";

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
                <Text style={gstyles.buttonText}>Se connecter</Text>
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
        <>
            <Pressable style={gstyles.button} onPress={google}>
                <Text style={gstyles.buttonText}>Google</Text>
            </Pressable>

            <Pressable style={gstyles.button} onPress={() => setPage("login")}>
                <Text style={gstyles.buttonText}>Connexion</Text>
            </Pressable>

            <Pressable style={gstyles.button} onPress={() => setPage("register")}>
                <Text style={gstyles.buttonText}>Inscrpition</Text>
            </Pressable>
        </>
    );
}

export default function Auth() {
    const [page, setPage] = useState<"login" | "register" | "home">("home");

    return (
        <>
            <View style={styles.form}>
                <Image source={require("../assets/blindcontest.png")} width={50} height={50} />

                { page === "home" && <Home setPage={setPage} /> }
                { page === "login" && <Login /> }
                { page === "register" && <Register /> }
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    form: {

    },
    fieldBox: {

    },
    label: {

    }
});