import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, TextInput, Pressable } from "react-native";
import { useSearchParams } from "react-router-native";
import { Audio } from "expo-av";
import { socket } from "../server/Server";
import { searchSongs } from "../server/Search";
import SearchSong from "../components/SearchSong";
import gstyles from "../components/Styles";

const soundObject: Audio.Sound = new Audio.Sound();

export default function Game() {
    const [songs, setSongs] = useState<any[]>([]);
    const [answer, setAnswer] = useState<any>(false);
    const [myAnswer, setMyAnswer] = useState<any>(null);
    const [answered, setAnswered] = useState<boolean>(false);
    const [correct, setCorrect] = useState<boolean>(false);
    const [search, setSearch] = useState<any>("");
    const [searchParams] = useSearchParams();
    const host: boolean = searchParams.get("host") == "true" ? true : false;

    useEffect(() => {
        onChangeSearch("Taylor");
        setSearch("");

        if (host) socket.emit("audio_room");
        
        socket.on("audio_room", data => {
            playSong(data.audio);
        });

        socket.on("answer_room", data => {
            setAnswer(data.answer);
            setAnswered(true);
        });

        socket.on("next_room", () => {
            onChangeSearch("Taylor");
            setSearch("");
            setMyAnswer(null);
            setAnswer(false);
            setAnswered(false);
            setCorrect(false);
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
        <View style={styles.game}>

            <View>
                <View style={styles.image}>
                    {
                        answer ? <Image style={styles.imageResponse} source={{uri: answer.image}} /> : <Text style={styles.imageText}>?</Text>
                    }
                </View>

                {
                    answer &&
                    <>
                        <Text style={styles.titleResponse}>{answer.name}</Text>
                        <Text style={styles.artistsResponse}>{answer.artists.join(", ")}</Text>
                    </>
                }
            </View>


            {
                answered &&
                <>
                    <View style={styles.result}>
                            {
                                answer ?
                                <View style={styles.resultBox}>
                                    <Image style={styles.resultImg} source={correct ? require(`../assets/correct.png`) : require(`../assets/incorrect.png`)} />
                                    <Text style={styles.resultText}>{correct ? "Correcte" : "Incorrecte"}</Text>
                                </View>
                                :
                                <Text style={styles.resultTitle}>En attente du résultat</Text>
                            }
                    </View>

                    {
                        myAnswer &&
                        <View style={{marginTop: 10, gap: 10}}>
                            <Text style={styles.resultTitle}>Votre réponse</Text>
                            <SearchSong song={myAnswer} />
                        </View>
                    }
                </>
            }


            {
                answer ?
                <>
                    {
                        host &&
                        <Pressable style={{...gstyles.button, width: 300, marginTop: 10}} onPress={nextQuestion}>
                            <Text style={gstyles.buttonText}>Suivant</Text>
                        </Pressable>
                    }
                </>
                :
                <>
                    {
                        !myAnswer &&
                        <View style={styles.search}>
                            <Text style={styles.searchTitle}>Trouve la musique</Text>
                            <TextInput style={[gstyles.input, styles.searchInput]} value={search} onChangeText={onChangeSearch} placeholder="Rechercher une musique..." />
                            
                            <View style={{...styles.songContainer, marginTop: songs.length > 0 ? 10 : 0}}>
                                {
                                    songs.map((e: any) => <SearchSong
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
                    }
                </>
            }
        </View>
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

    image: {
        height: 300,
        width: 300,
        borderRadius: 10,
        marginLeft: "auto",
        marginRight: "auto",
        overflow: "hidden"
    },
    imageText: {
        fontSize: 50,
        height: 300,
        width: 300,
        backgroundColor: "#333333",
        color: "#CCC",
        fontWeight: "bold",
        flex: 1
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
        borderColor: "#213547",
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