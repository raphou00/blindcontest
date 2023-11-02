import { StyleSheet, SafeAreaView } from "react-native";
import { NativeRouter, Routes, Route } from "react-router-native";
import AuthProvider from "./helpers/auth-provider";
import Layout from "./components/Layout";
import Auth from "./screens/Auth";
import Home from "./screens/Home";
import Create from "./screens/Create";
import Join from "./screens/Join";
import Lobby from "./screens/Lobby";
import Game from "./screens/Game";
import Results from "./screens/Results";

export default function App() {
    return (
        <SafeAreaView style={styles.body}>
            <NativeRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="/auth" element={<Auth />} />
                            <Route path="/create" element={<Create />} />
                            <Route path="/join" element={<Join />} />
                            <Route path="/lobby/:room" element={<Lobby />} />
                            <Route path="/game/:room" element={<Game />} />
                            <Route path="/results/:room" element={<Results />} />
                        </Route>
                    </Routes>
                </AuthProvider>
            </NativeRouter>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    body: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minWidth: 320,
        width: "100%",
        minHeight: "100%",
        backgroundColor: "#1A1A1A"
    }
});