import { Dispatch, SetStateAction } from "react";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import socket from "../lib/socket";

// Propriétés attendues par le composant SearchSong
type SearchSongsProps = {
    song: {
        id: string;
        title: string;
        artists: string[];
        image: string;
    };
    answered?: boolean | any;
    setCorrect?: Dispatch<boolean> | any;
    setAnswered?: Dispatch<SetStateAction<boolean>> | any;
    setMyAnswer?: Dispatch<SetStateAction<boolean>> | any;
};

// Composant représentant une chanson dans la recherche
export default function SearchSong({
    song,
    answered,
    setAnswered,
    setMyAnswer,
    setCorrect,
}: SearchSongsProps) {
    const { id, title, artists, image } = song;

    // Fonction appelée lorsqu'une chanson est validée
    const onValidate = () => {
        // Vérifier si la prop setAnswered est définie
        if (!setAnswered) return;

        // Mettre à jour la réponse de l'utilisateur et envoyer la réponse au serveur
        setMyAnswer(song);

        socket.emit("answer_room", { id: id }, (res: { correct: boolean }) => {
            // Mettre à jour l'état de la réponse et indiquer si la réponse est correcte
            setAnswered(true);
            setCorrect(res.correct as boolean);
        });
    };

    return (
        <Pressable onPress={onValidate}>
            {/* Conteneur principal du composant, avec une couleur différente si la réponse a déjà été donnée */}
            <View style={{ ...styles.song, backgroundColor: answered ? "grey" : "#111111" }}>
                {/* Image de la chanson */}
                <Image style={styles.songImg} source={{ uri: image }} />
                {/* Conteneur du texte de la chanson */}
                <View style={styles.songText}>
                    {/* Titre de la chanson */}
                    <Text style={styles.songTitle}>{title}</Text>
                    {/* Artistes de la chanson */}
                    <Text style={styles.songArtist}>{artists.join(", ")}</Text>
                </View>
            </View>
        </Pressable>
    );
}

// Styles pour le composant SearchSong
const styles = StyleSheet.create({
    song: {
        padding: 5,
        height: 50,
        width: 285,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: "slateblue",
        borderRadius: 6,
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
    },
    songImg: {
        height: 36,
        width: 36,
        borderRadius: 6,
    },
    songText: {
        display: "flex",
        flexDirection: "column",
        height: 36,
        width: 500,
        marginLeft: 10,
    },
    songTitle: {
        height: 20,
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
        overflow: "hidden",
    },
    songArtist: {
        height: 16,
        fontSize: 14,
        color: "#CCC",
        overflow: "hidden",
    },
});
