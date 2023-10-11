import { StyleSheet, View, Text } from "react-native";

type RankingProps = {
    players: any[],
    visible: boolean
};

export default function Ranking({ players, visible }: RankingProps) {
    return (
        <View style={{...styles.ranking, display: visible ? "flex" : "none"}}>
            <View style={styles.rankingTitle}>
                <Text style={styles.rankingTitleText}>classement ({players.length})</Text>
            </View>
            <View style={styles.rankingList}>
                {
                    players.map((e: any, idx: number) => <Text key={e.id} style={{...styles.rankingListName, color: idx == 0 ? "gold" : "white"}}>{e.name} - {e.point}</Text>)
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    ranking: {
        width: 300,
        height: 500,
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "#213547",
        borderRadius: 6,
        backgroundColor: "#111111"
    },
    rankingTitle: {
        width: "100%",
        height: "10%",
        borderBottomWidth: 3,
        borderColor: "#213547",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
    },
    rankingTitleText: {
        display: "flex",
        textTransform: "uppercase",
        fontSize: 20,
        fontWeight: "bold",
        color: "#F9F9F9"
    },
    rankingTitleNbr: {
        paddingLeft: 10,
        fontSize: 16,
        fontWeight: "bold",
        color: "#646CFF"
    },
    rankingList: {
        overflowY: "scroll",
        width: "100%",
        height: "90%"
    },
    rankingListNoPlayer: {
        width: "100%",
        height: 30,
        color: "#FFFFFF",
        fontWeight: "bold",
        padding: 5,
        textAlign: "center"
    },
    rankingListName: {
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