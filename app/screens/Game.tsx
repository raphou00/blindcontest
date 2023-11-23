import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, TextInput, Pressable } from "react-native";
import { Audio } from "expo-av";
import socket from "../lib/socket";
import { searchSongs } from "../lib/search";
import { ScreenProps } from "../lib/type";
import SearchSong from "../components/SearchSong";
import Ranking from "../components/Ranking";
import gstyles from "../components/Styles";
import Layout from "../components/Layout";
import Timer from "../components/Timer";

const soundObject: Audio.Sound = new Audio.Sound();

export default function Game({ navigation, route }: ScreenProps) {
    const [players, setPlayers] = useState<any[]>([]);
    const [songs, setSongs] = useState<any[]>([]);
    const [answer, setAnswer] = useState<any>(null);
    const [myAnswer, setMyAnswer] = useState<any>(null);
    const [search, setSearch] = useState<string>("");
    const [answered, setAnswered] = useState<boolean>(false);
    const [correct, setCorrect] = useState<boolean>(false);
    const [rankingVisible, setRankingVisible] = useState<boolean>(false);
    const [timer, setTimer] = useState<boolean>(false);
    const [roomTime, setRoomTime] = useState<number>(20);

    const { room, host, name } = route.params;

    useEffect(() => {
        onChangeSearch("Eminem")
        setSearch("");

        socket.emit("audio_room");

        socket.on("audio_room", data => {
            setRankingVisible(false);
            setTimer(true);
            setRoomTime(data.time);
            playSong(data.audio);

            console.log(data.cheat);
        });

        socket.on("answer_room", data => {
            setAnswer(data.answer);
            setPlayers(data.players);
            setAnswered(true);
            setTimer(false);

            setTimeout(() => {
                setRankingVisible(true);
            }, 5000);
        });

        socket.on("next_room", () => {
            onChangeSearch("Eminem");
            setSearch("");
            setMyAnswer(null);
            setAnswer(false);
            setAnswered(false);
            setCorrect(false);
        });

        socket.on("results_room", () => {
            navigation.navigate("results", { room, name });
        });

        return;
    }, []);

    const playSong = async (uri: string) => {
        if ((await soundObject.getStatusAsync()).isLoaded) {
            await soundObject.stopAsync();
            await soundObject.unloadAsync();
        }

        await soundObject.loadAsync({ uri });
        await soundObject.playAsync();
    }

    const onChangeSearch = async (e: string) => {
        if (!e) return;
        setSearch(e);
        setSongs(await searchSongs(e));
    }

    const nextQuestion = () => {
        socket.emit("next_room", () => {
            socket.emit("audio_room");
        });
    }

    return (
        <Layout>
            <View style={styles.game}>
                {rankingVisible &&
                    <View style={styles.ranking}>
                        <Text style={styles.player}>{name}</Text>
                        <Ranking players={players} visible={rankingVisible} />
                        {
                            host && (
                                <Pressable style={{ ...gstyles.button, width: 300, marginTop: 10 }} onPress={nextQuestion}>
                                    <Text style={gstyles.buttonText}>Suivant</Text>
                                </Pressable>
                            )
                        }
                    </View>
                }

                <View>
                    <View style={styles.image}>
                        {
                            answer ? (
                                <Image style={styles.imageResponse} source={{ uri: answer.image }} />
                            ) : (
                                <View style={styles.imageTextContainer}>
                                    <Text style={styles.imageText}>
                                        <Timer nbr={roomTime} play={timer} />
                                    </Text>
                                </View>
                            )
                        }
                    </View>

                    {
                        answer && (
                            <>
                                <Text style={styles.titleResponse}>{answer.name}</Text>
                                <Text style={styles.artistsResponse}>{answer.artists.join(", ")}</Text>
                            </>
                        )
                    }
                </View>

                {
                    answered && (
                        <>
                            <View style={styles.result}>
                                {
                                    answer ? (
                                        <View style={styles.resultBox}>
                                            <Image style={styles.resultImg} source={correct ? require("../assets/correct.png") : require("../assets/incorrect.png")} />
                                            <Text style={styles.resultText}>{correct ? "Correcte" : "Incorrecte"}</Text>
                                        </View>
                                    ) : (
                                        <Text style={styles.resultTitle}>En attente du résultat</Text>
                                    )
                                }
                            </View>

                            {
                                myAnswer && (
                                    <View style={{ marginTop: 10, gap: 10 }}>
                                        <Text style={styles.resultTitle}>Votre réponse</Text>
                                        <SearchSong song={myAnswer} />
                                    </View>
                                )
                            }
                        </>
                    )
                }

                {
                    (!answer && !myAnswer) && (
                        <View style={styles.search}>
                            <Text style={styles.searchTitle}>Trouve la musique</Text>
                            <TextInput style={[gstyles.input, styles.searchInput]} value={search} onChangeText={onChangeSearch} placeholder="Rechercher une musique..." />

                            <View style={{ ...styles.songContainer, marginTop: songs.length > 0 ? 10 : 0 }}>
                                {songs.map((e: any) =>
                                    <SearchSong
                                        key={e.id}
                                        song={e}
                                        answered={answered}
                                        setAnswered={setAnswered}
                                        setMyAnswer={setMyAnswer}
                                        setCorrect={setCorrect}
                                    />)
                                }
                            </View>
                        </View>
                    )
                }
            </View>
        </Layout>
    );
};

const styles = StyleSheet.create({
    game: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        height: "100%"
    },

    ranking: {
        position: "absolute",
        left: 0,
        display: "flex",
        justifyContent: "space-around",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#000",
        zIndex: 1000,
    },
    rankingButton: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 10000
    },
    rankingImage: {
        height: 30,
        width: 30,
        borderRadius: 50,
        backgroundColor: "#333333",
        borderWidth: 2,
        borderColor: "gold"
    },
    player: {
        fontWeight: "bold",
        color: "#FFFFFF",
        fontSize: 30,
        width: 300,
        textAlign: "center"
    },

    image: {
        height: 300,
        width: 300,
        borderRadius: 10,
        marginLeft: "auto",
        marginRight: "auto",
        overflow: "hidden"
    },
    imageTextContainer: {
        height: 300,
        width: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#333333"
    },
    imageText: {
        fontSize: 50,
        color: "#CCC",
        fontWeight: "bold",
    },
    imageResponse: {
        width: 300,
        height: 300
    },

    search: {
        height: "auto",
        width: 300,
        padding: 5,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#111111",
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: "slateblue",
        borderRadius: 6
    },
    searchTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
        margin: 5
    },
    searchInput: {
        width: 285,
        textAlign: "left"
    },

    songContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 5
    },

    result: {
        height: 100,
        width: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    resultTitle: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 20
    },
    resultBox: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 5
    },
    resultImg: {
        height: 60,
        width: 60
    },
    resultText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold"
    },

    titleResponse: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
        textAlign: "center"
    },
    artistsResponse: {
        fontSize: 18,
        color: "#CCCCCC",
        marginBottom: 10,
        textAlign: "center"
    }
});