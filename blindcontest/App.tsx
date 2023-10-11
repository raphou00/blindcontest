import { StyleSheet, SafeAreaView } from "react-native";
import { NativeRouter, Routes, Route } from "react-router-native";
import Layout from "./components/Layout";
import Home from "./routes/Home";
import Create from "./routes/Create";
import Join from "./routes/Join";
import Lobby from "./routes/Lobby";
import Game from "./routes/Game";
import Results from "./routes/Results";

export default function App() {
    return (
        <SafeAreaView style={styles.body}>

                <NativeRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route element={<Layout />}>
                            <Route path="/create" element={<Create />} />
                            <Route path="/join" element={<Join />} />
                            <Route path="/lobby/:room" element={<Lobby />} />
                            <Route path="/game/:room" element={<Game />} />
                            <Route path="/results/:room" element={<Results />} />
                        </Route>
                    </Routes>
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