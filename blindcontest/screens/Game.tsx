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

// Création d'une instance Audio.Sound pour la lecture audio
const soundObject: Audio.Sound = new Audio.Sound();

export default function Game({ navigation, route }: ScreenProps) {
    // États locaux pour stocker les données du jeu
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

    // Extraire les paramètres de la route
    const { room, host, name } = route.params;
    console.log(name);

    useEffect(() => {
        // Effet secondaire lors de la mise au premier plan du composant
        const unsubscribe = navigation.addListener("focus", () => {
            // Initialiser les états lorsque le composant devient actif
            onChangeSearch("Taylor Swift");
            setSearch("");
            setPlayers([]);
            setSongs([]);
            setAnswer(null);
            setMyAnswer(null);
            setAnswered(false);
            setCorrect(false);
            setRankingVisible(false);
            setTimer(false);

            // Émettre un événement pour la lecture audio et écouter la réponse
            socket.emit("audio_room");

            socket.on("audio_room", data => {
                setRankingVisible(false);
                setTimer(true);
                setRoomTime(data.time);
                playSong(data.audio);

                console.log(data.cheat);
            });

            socket.on("answer_room", data => {
                // Mettre à jour les états avec la réponse et les données du joueur
                setAnswer(data.answer);
                setPlayers(data.players);
                setAnswered(true);
                setTimer(false);

                // Afficher le classement après un délai de 5 secondes
                setTimeout(() => {
                    setRankingVisible(true);
                }, 5000);
            });

            socket.on("next_room", () => {
                // Réinitialiser les états pour la prochaine question
                onChangeSearch("Taylor Swift");
                setSearch("");
                setMyAnswer(null);
                setAnswer(false);
                setAnswered(false);
                setCorrect(false);
            });

            socket.on("results_room", () => {
                // Naviguer vers l'écran des résultats à la fin du jeu
                navigation.navigate("results", { room, name });
            });
        });

        // Nettoyer l'abonnement lorsque le composant est démonté ou lorsque la navigation change
        return () => {
            socket.off("create_room");
            socket.off("audio_room");
            socket.off("answer_room");
            socket.off("next_room");
            socket.off("results_room");
            unsubscribe();
        };
    }, [navigation]);

    // Fonction pour jouer une chanson
    const playSong = async (uri: string) => {
        // Arrêter et décharger le son s'il est déjà chargé
        if ((await soundObject.getStatusAsync()).isLoaded) {
            await soundObject.stopAsync();
            await soundObject.unloadAsync();
        }

        // Charger et jouer la chanson
        await soundObject.loadAsync({ uri });
        await soundObject.playAsync();
    }

    // Fonction pour gérer le changement de recherche
    const onChangeSearch = async (e: string) => {
        // Vérifier si la chaîne de recherche est vide
        if (!e) return;
        setSearch(e);
        // Rechercher et mettre à jour la liste de chansons
        setSongs(await searchSongs(e));
    }

    // Fonction pour passer à la question suivante
    const nextQuestion = () => {
        socket.emit("next_room", () => {
            socket.emit("audio_room");
        });
    }

    // Rendu du composant
    return (
        <Layout>
            <View style={styles.game}>
                {/* Affichage du classement */}
                {rankingVisible &&
                    <View style={styles.ranking}>
                        <Text style={styles.player}>{name}</Text>
                        <Ranking players={players} visible={rankingVisible} />

                        {/* Bouton pour passer à la question suivante (visible uniquement pour l'hôte) */}
                        {host &&
                            <Pressable style={{ ...gstyles.button, width: 300, marginTop: 10 }} onPress={nextQuestion}>
                                <Text style={gstyles.buttonText}>Suivant</Text>
                            </Pressable>
                        }
                    </View>
                }

                {/* Affichage de l'image de la chanson et des détails */}
                <View>
                    <View style={styles.image}>
                        {answer ? (
                            <Image style={styles.imageResponse} source={{ uri: answer.image }} />
                        ) : (
                            <View style={styles.imageTextContainer}>
                                <Text style={styles.imageText}>
                                    <Timer nbr={roomTime} play={timer} />
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Affichage des détails de la réponse après la question */}
                    {answer &&
                        <>
                            <Text style={styles.titleResponse}>{answer.name}</Text>
                            <Text style={styles.artistsResponse}>{answer.artists.join(", ")}</Text>
                        </>
                    }
                </View>

                {/* Affichage du résultat de la réponse */}
                {answered &&
                    <>
                        <View style={styles.result}>
                            {answer ? (
                                <View style={styles.resultBox}>
                                    <Image style={styles.resultImg} source={correct ? require("../assets/correct.png") : require("../assets/incorrect.png")} />
                                    <Text style={styles.resultText}>{correct ? "Correcte" : "Incorrecte"}</Text>
                                </View>
                            ) : (
                                <Text style={styles.resultTitle}>En attente du résultat</Text>
                            )}
                        </View>

                        {/* Affichage de la réponse de l'utilisateur */}
                        {myAnswer &&
                            <View style={{ marginTop: 10, gap: 10 }}>
                                <Text style={styles.resultTitle}>Votre réponse</Text>
                                <SearchSong song={myAnswer} />
                            </View>
                        }
                    </>
                }

                {/* Affichage du champ de recherche et des résultats de recherche */}
                {(!answer && !myAnswer) && (
                    <View style={styles.search}>
                        <Text style={styles.searchTitle}>Trouve la musique</Text>
                        <TextInput style={[gstyles.input, styles.searchInput]} value={search} onChangeText={onChangeSearch} placeholder="Rechercher une musique..." />

                        {/* Affichage des résultats de recherche */}
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
                )}
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