import { StyleSheet, View, Text } from "react-native";

type PlayerListProps = {
    players: any[];
};

export default function PlayerList({ players }: PlayerListProps) {
    return (
        <View style={styles.players}>
            <View style={styles.playersTitle}>
                <Text style={styles.playersTitleText}>joueurs ({players.length})</Text>
            </View>

            <View style={styles.playersList}>
                {
                    players.length === 0 ? (
                        <Text style={styles.playersListNoPlayer}>Aucun joueur pour le moment</Text>
                    ) : (
                        players.map((e: any) => <Text key={e.id} style={styles.playersListName}>{e.name}</Text>)
                    )
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    players: {
        backgroundColor: "#111111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "50%",
        width: 300,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: "slateblue",
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
        borderBottomLeftRadius: 6,
        overflow: "hidden",
    },
    playersTitle: {
        width: "100%",
        height: "10%",
        borderBottomWidth: 3,
        borderColor: "slateblue",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    playersTitleText: {
        display: "flex",
        textTransform: "uppercase",
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    playersTitleNbr: {
        paddingLeft: 10,
        fontSize: 16,
        fontWeight: "bold",
        color: "slateblue",
    },
    playersList: {
        overflowY: "scroll",
        width: "100%",
        height: "90%",
    },
    playersListNoPlayer: {
        width: "100%",
        height: 30,
        color: "#FFFFFF",
        fontWeight: "bold",
        padding: 5,
        textAlign: "center",
    },
    playersListName: {
        width: "90%",
        marginTop: 0,
        marginRight: "auto",
        marginBottom: 0,
        marginLeft: "auto",
        borderBottomWidth: 1,
        borderColor: "slateblue",
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        paddingTop: 5,
        paddingRight: 0,
        paddingBottom: 5,
        paddingLeft: 0,
        color: "#FFFFFF",
    },
});
