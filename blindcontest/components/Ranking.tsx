import { StyleSheet, View, Text } from "react-native";

// Propriétés attendues par le composant Ranking
type RankingProps = {
    players: any[];
    visible: boolean;
};

export default function Ranking({ players, visible }: RankingProps) {
    return (
        // Conteneur principal du composant, géré par la visibilité
        <View style={{ ...styles.ranking, display: visible ? "flex" : "none" }}>
            {/* Titre du classement */}
            <View style={styles.rankingTitle}>
                <Text style={styles.rankingTitleText}>classement ({players.length})</Text>
            </View>

            {/* Liste des joueurs classés */}
            <View style={styles.rankingList}>
                {/* Affichage des noms et des points des joueurs */}
                {players.map((e: any, idx: number) => (
                    <Text key={e.id} style={styles.rankingListName}>
                        {e.name} - {e.point}
                    </Text>
                ))}
            </View>
        </View>
    );
}

// Styles pour le composant Ranking
const styles = StyleSheet.create({
    ranking: {
        width: 300,
        height: 500,
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "slateblue",
        borderRadius: 6,
        backgroundColor: "#111111",
    },
    rankingTitle: {
        width: "100%",
        height: "10%",
        borderBottomWidth: 3,
        borderColor: "slateblue",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    rankingTitleText: {
        display: "flex",
        textTransform: "uppercase",
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    rankingTitleNbr: {
        paddingLeft: 10,
        fontSize: 16,
        fontWeight: "bold",
        color: "slateblue",
    },
    rankingList: {
        overflowY: "scroll",
        width: "100%",
        height: "90%",
    },
    rankingListNoPlayer: {
        width: "100%",
        height: 30,
        color: "#FFFFFF",
        fontWeight: "bold",
        padding: 5,
        textAlign: "center",
    },
    rankingListName: {
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
