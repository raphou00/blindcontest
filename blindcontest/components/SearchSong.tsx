import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { socket } from "../server/Server";

export default function SearchSong(props: any) {
    const { song, answered, setAnswered, setMyAnswer, setCorrect } = props;
    const { id, title, artists, image } = song;

    const onValidate = () => {
        if (!setAnswered) return;

        setMyAnswer(song);
        socket.emit("answer_room", { id: id }, (res: { correct: boolean }) => {
            setAnswered(true);            
            setCorrect(res.correct);
        });
    };

    return (
        <Pressable onPress={onValidate}>
            <View style={{...styles.song, backgroundColor: answered ? "grey" : ""}}>
                <Image style={styles.songImg} source={{uri: image}} />
                <View style={styles.songText}>
                    <Text style={styles.songTitle}>{title}</Text>
                    <Text style={styles.songArtist}>{artists.join(", ")}</Text>
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    song: {
        padding: 5,
        height: 50,
        width: 285,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: "#646CFF",
        borderRadius: 6,
        display: "flex",
        flexDirection: "row",
        overflow: "hidden"
    },
    songImg: {
        height: 36,
        width: 36,
        borderRadius: 6
    },
    songText: {
        display: "flex",
        flexDirection: "column",
        height: 36,
        width: 500,
        marginLeft: 10
    },
    songTitle: {
        height: 20,
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
        overflow: "hidden"
    },
    songArtist: {
        height: 16,
        fontSize: 14,
        color: "#CCC",
        overflow: "hidden"
    }
});