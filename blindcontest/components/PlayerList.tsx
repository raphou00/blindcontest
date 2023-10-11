import { StyleSheet, View, Text } from "react-native";

export default function PlayerList(props: any) {
    const { players } = props;

    return (
        <View style={styles.loginPlayers}>
            <View style={styles.loginPlayersTitle}>
                <Text style={styles.loginPlayersTitleText}>joueurs ({players.length})</Text>
            </View>
            <View style={styles.loginPlayersList}>
                {
                    players.length === 0 ? <Text style={styles.loginPlayersListNoPlayer}>Aucun joueur pour le moment</Text> :
                    players.map((e: any) => <Text key={e.id} style={styles.loginPlayersListName}>{e.name}</Text>)
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    loginPlayers: {
        backgroundColor: "#111111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "50%",
        width: 300,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: "#213547",
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
        borderBottomLeftRadius: 6,
        overflow: "hidden"
    },
    loginPlayersTitle: {
        width: "100%",
        height: "10%",
        borderBottomWidth: 3,
        borderColor: "#213547",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
    },
    loginPlayersTitleText: {
        display: "flex",
        textTransform: "uppercase",
        fontSize: 20,
        fontWeight: "bold",
        color: "#F9F9F9"
    },
    loginPlayersTitleNbr: {
        paddingLeft: 10,
        fontSize: 16,
        fontWeight: "bold",
        color: "#646CFF"
    },
    loginPlayersList: {
        overflowY: "scroll",
        width: "100%",
        height: "90%"
    },
    loginPlayersListNoPlayer: {
        width: "100%",
        height: 30,
        color: "#FFFFFF",
        fontWeight: "bold",
        padding: 5,
        textAlign: "center"
    },
    loginPlayersListName: {
        width: "90%",
        marginTop: 0,
        marginRight: "auto",
        marginBottom: 0,
        marginLeft: "auto",
        borderBottomWidth: 1,
        borderColor: "#646CFF",
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        paddingTop: 5,
        paddingRight: 0,
        paddingBottom: 5,
        paddingLeft: 0,
        color: "#F9F9F9"
    }
});